// Walking a route: live GPS and preview.
/* ================= WALK THE ROUTE: live (GPS) and preview ================= */
const IC_PLAY='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l12.5-7.5z"/></svg>';
const IC_NAV='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l7.5 19-7.5-4-7.5 4z"/></svg>';
let guide=null;
const gEl={ic:document.getElementById('gIc'),txt:document.getElementById('gTxt'),next:document.getElementById('gNext'),rem:document.getElementById('gRem'),pause:document.getElementById('gPause')};
const puck=new THREE.Group(); { const m1=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.2,0.3,24),new THREE.MeshBasicMaterial({color:0xffffff}));
  const m2=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,0.45,24),new THREE.MeshBasicMaterial({color:0x1a73e8}));
  const m3=new THREE.Mesh(new THREE.ConeGeometry(1.1,2.2,3),new THREE.MeshBasicMaterial({color:0xffffff})); m3.rotation.x=-Math.PI/2; m3.position.set(0,0.6,-0.2); m3.scale.set(1,1,0.35);
  for(const m of [m1,m2,m3]){ m.material.depthTest=false; m.renderOrder=20; }
  puck.add(m1,m2,m3); puck.visible=false; puck.renderOrder=20; scene.add(puck); }
function guideRoute(){ // (re)compute helpers for the current route
  const P=nav.route.P, cum=[0]; for(let i=1;i<P.length;i++) cum.push(cum[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
  const sOf=p=>{ let bi=0,bd=1e9; for(let i=0;i<P.length;i++){ const d=Math.hypot(P[i][0]-p[0],P[i][1]-p[1]); if(d<bd){bd=d;bi=i;} } return cum[bi]; };
  const st=nav.route.steps.map((x,i)=>({...x,s:i===0?0:sOf(x.p)}));
  for(let i=1;i<st.length;i++) if(st[i].s<st[i-1].s) st[i].s=st[i-1].s;
  st[st.length-1].s=cum[cum.length-1];
  Object.assign(guide,{P,cum,total:cum[cum.length-1],st,s:0,i:0}); }
function routeAt(s){ const {P,cum}=guide; s=THREE.MathUtils.clamp(s,0,guide.total); let i=1; while(i<cum.length-1&&cum[i]<s) i++;
  const k=(s-cum[i-1])/((cum[i]-cum[i-1])||1); return [P[i-1][0]+(P[i][0]-P[i-1][0])*k,P[i-1][1]+(P[i][1]-P[i-1][1])*k,i]; }
function heading(s){ const a=routeAt(s-6), b=routeAt(s+14); let dx=b[0]-a[0], dz=b[1]-a[1]; const l=Math.hypot(dx,dz)||1; return [dx/l,dz/l]; }
function snapToRoute(x,z){ const {P,cum}=guide; let best=null; for(let i=0;i<P.length-1;i++){ const a=P[i],b=P[i+1], dx=b[0]-a[0], dz=b[1]-a[1], L=dx*dx+dz*dz||1;
  const t=THREE.MathUtils.clamp(((x-a[0])*dx+(z-a[1])*dz)/L,0,1), px=a[0]+dx*t, pz=a[1]+dz*t, d=Math.hypot(x-px,z-pz);
  if(!best||d<best.d-0.5||(Math.abs(d-best.d)<0.5&&Math.abs(cum[i]-guide.s)<Math.abs(best.s-guide.s))) best={d,s:cum[i]+Math.sqrt(L)*t}; } return best; }
function startGuide(mode){
  if(!nav.route) return;
  if(mode==='live'){
    if(!me){ locate(false); showHint('Finding your location…',6000); let n=0; const iv=setInterval(()=>{ n++; if(me){ clearInterval(iv); startGuide('live'); } else if(n>40||meWatch===null){ clearInterval(iv); } },500); return; }
    if(!me.on){ showHint('You seem to be outside campus. Try Preview to see the walk instead.',6000); return; }
    if(!(nav.from&&nav.from.me)){ nav.from=ME_PL; dFrom.value='Your location'; guide={mode,reroute:true,off:0,paused:false}; runNav(true); }
  }
  if(!guide||guide.mode!==mode) guide={mode,off:0,paused:false};
  guideRoute(); if(wk.on) exitWalk(true);
  guide.speed=Math.max(9,guide.total/45); guide.t0=performance.now();
  document.body.classList.add('guiding'); document.body.classList.toggle('guide-live',mode==='live');
  controls.enabled=false; controls.autoRotate=false; fly=null; puck.visible=true; gEl.pause.textContent='❚❚';
  try{ if(mode==='live'&&navigator.wakeLock) navigator.wakeLock.request('screen').then(l=>guide&&(guide.lock=l)).catch(()=>{}); }catch(e){}
  updateGuideUI(); kick(); }
function stopGuide(){ if(!guide) return; try{ guide.lock&&guide.lock.release(); }catch(e){}
  guide=null; puck.visible=false; document.body.classList.remove('guiding','guide-live'); controls.enabled=true;
  if(nav.route){ let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9; for(const p of nav.route.P){ x0=Math.min(x0,p[0]); x1=Math.max(x1,p[0]); z0=Math.min(z0,p[1]); z1=Math.max(z1,p[1]); }
    const ext=Math.max(x1-x0,z1-z0), dist=THREE.MathUtils.clamp(ext*1.25+160,260,2300)*(innerWidth<innerHeight?1.35:1);
    flyTo(new THREE.Vector3((x0+x1)/2,0,(z0+z1)/2),HOME_OFF.clone().normalize().multiplyScalar(dist),1200); }
  idleT=performance.now(); kick(); }
document.getElementById('gStop').onclick=stopGuide;
gEl.pause.onclick=()=>{ if(!guide) return; guide.paused=!guide.paused; gEl.pause.textContent=guide.paused?'▶':'❚❚'; };
function updateGuideUI(){ const g=guide, st=g.st; let i=0; while(i<st.length-1&&st[i+1].s<=g.s+3) i++; g.i=i;
  const left=g.total-g.s, nx=st[i+1];
  if(left<12){ gEl.ic.innerHTML=arw('end'); gEl.txt.innerHTML=st[st.length-1].txt.replace(/^Arrive at/,'You’ve arrived at'); gEl.next.textContent=''; gEl.rem.textContent='Arrived'; return; }
  if(nx){ gEl.ic.innerHTML=arw(nx.ic); gEl.txt.innerHTML=`In ${fmtD(Math.max(0,nx.s-g.s))}: ${nx.txt}`; const n2=st[i+2]; gEl.next.innerHTML=n2?'Then: '+n2.txt.replace(/<[^>]+>/g,''):''; }
  const mins=left/(navMode==='cycle'?4:1.3)/60; gEl.rem.textContent=`${fmtD(left)} · ${fmtT(mins)} left`+(g.mode==='live'&&me&&me.acc>40?' · weak GPS':''); }
function stepGuide(now,dt){
  const g=guide; if(!g||!g.P) return;
  if(g.mode==='preview'){ if(!g.paused) g.s=Math.min(g.total,g.s+g.speed*dt); if(g.s>=g.total&&!g.done){ g.done=now; } if(g.done&&now-g.done>2500){ stopGuide(); return; } }
  else if(me){ const sn=snapToRoute(me.x,me.z);
    if(sn){ if(sn.d>35){ g.off++; if(g.off>40&&!g.rerouting){ g.rerouting=true; showHint('Off route, finding a new way…',3000); nav.from=ME_PL; g.reroute=true; runNav(true); g.rerouting=false; g.off=0; } }
      else { g.off=0; g.s+=(sn.s-g.s)*Math.min(1,dt*3); } } }
  const [x,z]=routeAt(g.s), [hx,hz]=heading(g.s);
  if(!g.hx){ g.hx=hx; g.hz=hz; } const k=Math.min(1,dt*2.5); g.hx+=(hx-g.hx)*k; g.hz+=(hz-g.hz)*k; const hl=Math.hypot(g.hx,g.hz)||1;
  const fx=g.hx/hl, fz=g.hz/hl, px=g.mode==='live'&&me?me.x:x, pz=g.mode==='live'&&me?me.z:z;
  puck.position.set(px,0.7,pz); puck.rotation.y=Math.atan2(-fx,-fz);
  const back=flat2D?0:34, up=flat2D?170:70;
  controls.target.set(px+fx*22,0,pz+fz*22);
  camera.position.set(px-fx*back+(flat2D?0:0),up,pz-fz*back+(flat2D?0.01:0));
  if(now-(g.ui||0)>200){ g.ui=now; updateGuideUI(); }
  dirty=true; }

