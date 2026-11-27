// Directions: road graph, closed roads, route finding, route line, from/to panel.
/* ================= DIRECTIONS (from / to) ================= */
// Closed roads (routes never use them) and no-entry lines (nothing may cross them), from local knowledge
const CLOSED=[
  [-904,435,-908,436,-911,442,-910,675,-908,1024],            // road west of Halls 9, 10, 11
  [-910,675,-744,673],                                         // road south of Hall 9
  [68.1,587.7,-1.6,586.2,-170.4,587.6,-190.4,587.8],           // road south of the Institute Sports Stadium
  [-1030,186,-1028,248,-998,252,-980,252,-850,245],            // loop road around Visitor's Hostel 2 (west and south side)
  [-891,252,-855,252,-846,251,-839,247,-829,237,-822,231,-816,230,-786,225,-787,199,-786,196,-785,194], // road north of Hall 13
  [-574,171,-572,264,-574,270,-577,275,-582,278,-671,327,-706,346,-712,355,-714,362,-714,372,-714,385], // Hall 5 back connector road (east of Hall 12)
  [-226,-652,-220,-761]                                        // airstrip chauraha: always closed towards the airstrip
];
const NOENTRY=[
  [-738,600,-738,800],   // Hall 7, west side
  [-735,815,-735,1015],  // Hall 8, west side
  [50,790,50,960],       // Girls Hall 6, east side
  [-391,240,-391,300],   // academic area, from 6th Avenue near Biological Sciences
  [-566,488,-566,625]    // Hall 3, west side
];
const GATES={'girls hall 6':[{n:'AB Gate',x:-134,z:869},{n:'CD Gate',x:-20,z:972}]};
const gatesFor=pl=>{ const k=(pl.name||'').toLowerCase().replace(/^gh ?6$/,'girls hall 6'); return GATES[k]||null; };
function segX(ax,az,bx,bz,cx,cz,dx,dz){ const d=(bx-ax)*(dz-cz)-(bz-az)*(dx-cx); if(Math.abs(d)<1e-9) return false;
  const t=((cx-ax)*(dz-cz)-(cz-az)*(dx-cx))/d, u=((cx-ax)*(bz-az)-(cz-az)*(bx-ax))/d; return t>0&&t<1&&u>0&&u<1; }
const crossesNoEntry=(ax,az,bx,bz)=>NOENTRY.some(c=>segX(ax,az,bx,bz,c[0],c[1],c[2],c[3]));
function nearPoly(x,z,p){ for(let i=0;i+3<p.length;i+=2){ const ax=p[i],az=p[i+1],dx=p[i+2]-ax,dz=p[i+3]-az,L=dx*dx+dz*dz||1;
  const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/L)); if(Math.hypot(x-ax-dx*t,z-az-dz*t)<2.5) return true; } return false; }
const isClosed=(a,b)=>CLOSED.some(p=>nearPoly(a[0],a[1],p)&&nearPoly(b[0],b[1],p)&&nearPoly((a[0]+b[0])/2,(a[1]+b[1])/2,p));
const NAV=(()=>{
  const nodes=[], key=new Map(), adj=[];
  const nid=(x,z)=>{ const k=Math.round(x*10)+','+Math.round(z*10); let i=key.get(k); if(i===undefined){ i=nodes.length; key.set(k,i); nodes.push([x,z]); adj.push([]); } return i; };
  const GEN={footway:'footpath',path:'footpath',pedestrian:'walkway',steps:'steps',cycleway:'cycle track',crossing:'crossing',service:'service road',track:'track',corridor:'corridor'};
  for(const r of data.roads){ if((!ROAD[r.t]&&r.t!=='corridor')||r.t==='runway'||r.t==='taxiway') continue;
    const nm=r.n?cleanName(r.n):(GEN[r.t]||'road'), named=!!r.n, p=r.p; let prev=-1;
    for(let i=0;i<p.length;i+=2){ const k=nid(p[i],p[i+1]);
      if(prev>=0&&prev!==k&&!isClosed(nodes[prev],nodes[k])&&!crossesNoEntry(nodes[prev][0],nodes[prev][1],nodes[k][0],nodes[k][1])){ const d=Math.hypot(nodes[k][0]-nodes[prev][0],nodes[k][1]-nodes[prev][1]), ty=r.t; adj[prev].push({to:k,d,nm,named,ty}); adj[k].push({to:prev,d,nm,named,ty}); }
      prev=k; } }
  const comp=new Int32Array(nodes.length).fill(-1); let main=-1, mainN=0;
  for(let s=0,c=0;s<nodes.length;s++,c++){ if(comp[s]>=0){ c--; continue; } let n=0; const st=[s]; comp[s]=c;
    while(st.length){ const x=st.pop(); n++; for(const e of adj[x]) if(comp[e.to]<0){ comp[e.to]=c; st.push(e.to); } }
    if(n>mainN){ mainN=n; main=c; } }
  const edges=[]; for(let a=0;a<nodes.length;a++) if(comp[a]===main) for(const e of adj[a]) if(e.to>a) edges.push({a,b:e.to,d:e.d,nm:e.nm,named:e.named,ty:e.ty});
  return {nodes,adj,edges};
})();
const SPD={walk:t=>t==='steps'?0.55:t==='corridor'?1.15:1.3, cycle:t=>t==='steps'?0.45:t==='corridor'?0.9:(t==='footway'||t==='path'||t==='pedestrian'||t==='crossing')?2.6:t==='track'?2.8:4.2};
let navMode='walk';
const cost=(e)=>e.d/SPD[navMode](e.ty);
function navSnap(x,z){ let best=null;
  for(const e of NAV.edges){ if(e.ty==='corridor') continue; const A=NAV.nodes[e.a], B=NAV.nodes[e.b]; const dx=B[0]-A[0], dz=B[1]-A[1], L2=dx*dx+dz*dz||1;
    const t=THREE.MathUtils.clamp(((x-A[0])*dx+(z-A[1])*dz)/L2,0,1), px=A[0]+dx*t, pz=A[1]+dz*t, d=Math.hypot(x-px,z-pz);
    if((!best||d<best.d)&&!crossesNoEntry(x,z,px,pz)) best={e,t,px,pz,d}; }
  return best; }
function navRoute(fx,fz,tx,tz){
  const sA=navSnap(fx,fz), sB=navSnap(tx,tz); if(!sA||!sB) return null;
  const N=NAV.nodes.length, dist=new Float64Array(N).fill(Infinity), prev=new Int32Array(N).fill(-2), pnm=new Array(N);
  const H=[]; const push=(d,i)=>{ H.push([d,i]); let k=H.length-1; while(k){ const p=(k-1)>>1; if(H[p][0]<=H[k][0]) break; [H[p],H[k]]=[H[k],H[p]]; k=p; } };
  const pop=()=>{ const top=H[0], last=H.pop(); if(H.length){ H[0]=last; let k=0; for(;;){ const l=2*k+1,r=l+1; let m=k; if(l<H.length&&H[l][0]<H[m][0]) m=l; if(r<H.length&&H[r][0]<H[m][0]) m=r; if(m===k) break; [H[m],H[k]]=[H[k],H[m]]; k=m; } } return top; };
  const ea=sA.e, ca0=cost(ea); dist[ea.a]=sA.t*ca0; prev[ea.a]=-1; pnm[ea.a]=ea.nm; push(dist[ea.a],ea.a);
  if((1-sA.t)*ca0<dist[ea.b]){ dist[ea.b]=(1-sA.t)*ca0; prev[ea.b]=-1; pnm[ea.b]=ea.nm; push(dist[ea.b],ea.b); }
  while(H.length){ const [d,i]=pop(); if(d>dist[i]) continue;
    for(const e of NAV.adj[i]){ const nd=d+cost(e); if(nd<dist[e.to]){ dist[e.to]=nd; prev[e.to]=i; pnm[e.to]=e.nm; push(nd,e.to); } } }
  const eb=sB.e, cbE=cost(eb); let end, tot;
  const ca=dist[eb.a]+sB.t*cbE, cb=dist[eb.b]+(1-sB.t)*cbE; if(ca<=cb){ end=eb.a; tot=ca; } else { end=eb.b; tot=cb; }
  const pts=[], nms=[], deg=[];
  const add=(x,z,nm,dg)=>{ const L=pts[pts.length-1]; if(L&&Math.hypot(L[0]-x,L[1]-z)<0.3) return; pts.push([x,z]); nms.push(nm); deg.push(dg); };
  if(ea===eb && Math.abs(sA.t-sB.t)*ca0<=tot){ add(fx,fz,ea.nm,2); add(sA.px,sA.pz,ea.nm,2); add(sB.px,sB.pz,ea.nm,2); }
  else { const chain=[]; for(let i=end;i>=0;i=prev[i]) chain.push(i); chain.reverse();
    add(fx,fz,ea.nm,2); add(sA.px,sA.pz,pnm[chain[0]],2);
    for(let k=0;k<chain.length;k++){ const i=chain[k]; add(NAV.nodes[i][0],NAV.nodes[i][1],k+1<chain.length?pnm[chain[k+1]]:eb.nm,NAV.adj[i].length); }
    add(sB.px,sB.pz,eb.nm,2); }
  add(tx,tz,null,2);
  const sec=tot+(sA.d+sB.d)/1.3;
  return {pts,nms,deg,sB,sec};
}
const fmtD=m=>m<95?Math.max(5,Math.round(m/5)*5)+' m':m<995?Math.round(m/10)*10+' m':(m/1000).toFixed(1)+' km';
const fmtT=min=>min<60?Math.max(1,Math.round(min))+' min':Math.floor(min/60)+' h '+Math.round(min%60)+' min';
const GENERIC=new Set(['footpath','walkway','steps','cycle track','crossing','service road','track','road','corridor']);
const onto=nm=>GENERIC.has(nm)?'the '+nm:'<em>'+esc(nm)+'</em>';
const ARW={straight:'M12 20V5M6.5 10.5L12 5l5.5 5.5',left:'M17 20v-7a4 4 0 0 0-4-4H5M9 5L5 9l4 4',right:'M7 20v-7a4 4 0 0 1 4-4h8M15 5l4 4-4 4',
  sleft:'M16 20v-6L8 6M8 12V6h6',sright:'M8 20v-6l8-8M16 12V6h-6',uleft:'M15 20V9a4 4 0 0 0-8 0v4M4 10l3 3 3-3',uright:'M9 20V9a4 4 0 0 1 8 0v4M14 10l3 3 3-3',
  start:'M12 3a6 6 0 0 1 6 6c0 4.5-6 12-6 12S6 13.5 6 9a6 6 0 0 1 6-6z',end:'M5 21V4M5 4h11l-2 4 2 4H5'};
const arw=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${ARW[k]}"/></svg>`;
function navSteps(R,destName){
  const P=R.pts, cum=[0]; for(let i=1;i<P.length;i++) cum.push(cum[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
  const total=cum[cum.length-1];
  const at=s=>{ s=THREE.MathUtils.clamp(s,0,total); let i=1; while(i<cum.length-1&&cum[i]<s) i++; const k=(s-cum[i-1])/((cum[i]-cum[i-1])||1); return [P[i-1][0]+(P[i][0]-P[i-1][0])*k,P[i-1][1]+(P[i][1]-P[i-1][1])*k]; };
  const turnAt=j=>{ const a=at(cum[j]-12), b=at(cum[j]+12), h1x=P[j][0]-a[0], h1z=P[j][1]-a[1], h2x=b[0]-P[j][0], h2z=b[1]-P[j][1];
    return Math.atan2(h1x*h2z-h1z*h2x, h1x*h2x+h1z*h2z)*180/Math.PI; };
  let steps=[], cur={nm:R.nms[0],d:0,i0:0,turn:null};
  for(let i=0;i<P.length-1;i++){
    if(i>0){ const nm=R.nms[i]; const tr=turnAt(i);
      if(nm!==cur.nm || (Math.abs(tr)>55 && R.deg[i]>=3)){ steps.push(cur); cur={nm,d:0,i0:i,turn:tr}; } }
    cur.d+=cum[i+1]-cum[i]; }
  steps.push(cur);
  // fold tiny connector steps into their neighbours, then rejoin same-name runs
  for(let k=1;k<steps.length;k++){ if(steps[k].d<9 && steps.length>1){ steps[k-1].d+=steps[k].d; if(steps[k+1]&&steps[k+1].turn!==null&&Math.abs(steps[k+1].turn)<25) steps[k+1].turn=steps[k].turn; steps.splice(k,1); k--; } }
  if(steps.length>1&&steps[0].d<9){ steps[1].d+=steps[0].d; steps[1].i0=0; steps[1].turn=null; steps.shift(); }
  for(let k=1;k<steps.length;k++){ if(steps[k].nm===steps[k-1].nm && Math.abs(steps[k].turn)<55){ steps[k-1].d+=steps[k].d; steps.splice(k,1); k--; } }
  const out=steps.map((s,k)=>{
    const p=P[s.i0];
    if(k===0){ const b=at(Math.min(total,cum[s.i0]+20)); const br=(Math.atan2(b[0]-p[0],-(b[1]-p[1]))*180/Math.PI+360)%360;
      const card=['north','north-east','east','south-east','south','south-west','west','north-west'][Math.round(br/45)%8];
      return {ic:'start',txt:`Head ${card} on ${onto(s.nm)}`,d:s.d,p}; }
    const a=s.turn, side=a>0?'right':'left', A=Math.abs(a); let ic, verb;
    if(A<25){ ic='straight'; verb='Continue straight'; } else if(A<60){ ic='s'+side; verb='Slight '+side; } else if(A<140){ ic=side; verb='Turn '+side; } else { ic='u'+side; verb='Sharp '+side; }
    const same=steps[k-1].nm===s.nm;
    const txt=s.nm==='steps'?(navMode==='cycle'?`${verb} and take the steps (walk your cycle)`:`${verb} and take the steps`):s.nm==='corridor'?`${verb} into the indoor corridor`+(navMode==='cycle'?' (walk your cycle)':''):same?`${verb} to stay on ${onto(s.nm)}`:`${verb} onto ${onto(s.nm)}`;
    return {ic,txt,d:s.d,p}; });
  // arrival side
  const n=P.length, q=P[n-2], last=P[n-1], pr=at(cum[n-2]-15); let sideTxt='';
  if(Math.hypot(last[0]-q[0],last[1]-q[1])>6){ const cr=(q[0]-pr[0])*(last[1]-q[1])-(q[1]-pr[1])*(last[0]-q[0]); sideTxt=cr>0?' on your right':' on your left'; }
  out.push({ic:'end',txt:`Arrive at <em>${esc(destName)}</em>${sideTxt}`,d:0,p:last});
  const named={}; for(const s of steps) if(!GENERIC.has(s.nm)) named[s.nm]=(named[s.nm]||0)+s.d;
  const via=Object.entries(named).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0]);
  return {steps:out,total,cum,via};
}
// route line on the ground
const RU={uW:{value:3},uT:{value:0},uProg:{value:0}};
const routeMat=new THREE.ShaderMaterial({uniforms:RU,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4,
  vertexShader:`attribute float side; attribute float along; attribute vec2 nrm; uniform float uW; varying float vA; varying float vS;
    void main(){ vec3 p=position; p.x+=nrm.x*side*uW; p.z+=nrm.y*side*uW; vA=along; vS=side; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.); }`,
  fragmentShader:`uniform float uW,uT,uProg; varying float vA; varying float vS;
    void main(){ if(vA>uProg) discard; float s=abs(vS);
      vec3 col=vec3(.09,.36,.86); col=mix(col,vec3(.62,.8,1.),smoothstep(.72,.82,s)*.8);
      float k=fract(vA/(uW*3.2)-uT*.9); float dash=step(k,.38)*(1.-smoothstep(.28,.4,s));
      col=mix(col,vec3(.5,.72,1.),dash*.8);
      gl_FragColor=vec4(col,.96*(1.-smoothstep(.93,1.,s))); }`});
const routeMesh=new THREE.Mesh(new THREE.BufferGeometry(),routeMat); routeMesh.frustumCulled=false; routeMesh.renderOrder=16; routeMesh.visible=false; scene.add(routeMesh);
function buildRouteMesh(P,cum){
  const pos=[],sd=[],al=[],nr=[],idx=[];
  for(let i=0;i<P.length;i++){ const a=P[Math.max(0,i-1)], b=P[Math.min(P.length-1,i+1)]; let dx=b[0]-a[0], dz=b[1]-a[1]; const l=Math.hypot(dx,dz)||1; dx/=l; dz/=l;
    let nx=-dz, nz=dx;
    if(i>0&&i<P.length-1){ let ux=P[i][0]-a[0],uz=P[i][1]-a[1]; const ul=Math.hypot(ux,uz)||1; ux/=ul; uz/=ul; const m=Math.max(.35,(-uz)*nx+ux*nz); nx/=m; nz/=m; }
    for(const s of [-1,1]){ pos.push(P[i][0],0.62,P[i][1]); sd.push(s); al.push(cum[i]); nr.push(nx,nz); }
    if(i) { const o=(i-1)*2; idx.push(o,o+1,o+2,o+1,o+3,o+2); } }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('side',new THREE.Float32BufferAttribute(sd,1));
  g.setAttribute('along',new THREE.Float32BufferAttribute(al,1)); g.setAttribute('nrm',new THREE.Float32BufferAttribute(nr,2)); g.setIndex(idx);
  routeMesh.geometry.dispose(); routeMesh.geometry=g; }
const pinS=document.createElement('div'), pinE=document.createElement('div'); pinS.className='rpin s'; pinE.className='rpin e'; document.body.append(pinS,pinE);
const nav={from:null,to:null,route:null,t0:0,len:0};
const _pv=new THREE.Vector3();
function placePin(el,p){ if(!p){ el.style.display='none'; return; } _pv.set(p[0],0.8,p[1]).project(camera);
  if(_pv.z>1||Math.abs(_pv.x)>1.2||Math.abs(_pv.y)>1.2){ el.style.display='none'; return; }
  el.style.display='block'; const x=(_pv.x*.5+.5)*innerWidth, y=(-_pv.y*.5+.5)*innerHeight;
  el.style.transform=`translate(${x|0}px,${y|0}px)`+(el===pinE?' rotate(-45deg)':''); }
function stepNav(now){
  if(!routeMesh.visible){ pinS.style.display=pinE.style.display='none'; return; }
  RU.uT.value=now/1000; RU.uW.value=wk.on?1.3:guide?2.2:THREE.MathUtils.clamp(camDist*.0055,1.8,11);
  const k=Math.min(1,(now-nav.t0)/1400); RU.uProg.value=nav.len*ease(k)+1;
  placePin(pinS,nav.route.P[0]); placePin(pinE,nav.route.P[nav.route.P.length-1]); dirty=true; }
// panel UI
const dFrom=document.getElementById('dFrom'), dTo=document.getElementById('dTo'), dRes=document.getElementById('dRes'), dOut=document.getElementById('dOut');
let dField=null, dList=[], dSel=0;
function suggest(raw){ let q=nrm(raw); for(const [a,b] of Object.entries(SYN)) if(q===a) q=b; const qc=q.replace(/ /g,'');
  return searchItems.filter(it=>it.l.kind!=='lane').map(it=>[searchScore(it,q,qc),it]).filter(x=>x[0]>0).sort((a,b)=>b[0]-a[0]).slice(0,7).map(x=>x[1]); }
function renderD(){ const raw=dField.value.trim(); const meIt={meItem:true,l:ME_PL,type:me&&!me.on?'off campus':'GPS'};
  if(!raw){ dList=[meIt]; } else { dList=suggest(raw).filter(it=>!it.special&&(!it.person||it.person.bl)); if(/^(my|me|curr|your|gps|here)/i.test(raw)) dList.unshift(meIt); } dSel=0;
  dRes.innerHTML=dList.length?dList.map((it,i)=>`<div class="res${i===0?' sel':''}" data-i="${i}"><i style="background:${it.meItem?'#2f7bff':it.l.col||(it.l.kind==='feat'?'#e0262f':CATCOL[it.l.cat]||CATCOL.civic)}"></i><span>${esc(it.meItem?'Your location':it.person?it.l.name+' · '+it.person.bl.name:it.l.name)}</span><small>${esc(it.type)}</small></div>`).join(''):'<div class="nores">No places match “'+esc(raw)+'”</div>';
  dRes.classList.add('open'); }
function choose(field,l){ field.value=l.name; nav[field===dFrom?'from':'to']=l; dRes.classList.remove('open'); field.blur();
  if(l.me&&!me){ navPending=true; locate(false); if(!nav.from||!nav.to) (field===dFrom?dTo:dFrom).focus(); return; }
  if(nav.from&&nav.to) runNav(); else (field===dFrom?dTo:dFrom).focus(); }
for(const f of [dFrom,dTo]){
  f.addEventListener('focus',()=>{ dField=f; if(!nav[f===dFrom?'from':'to']) renderD(); else dRes.classList.remove('open'); });
  f.addEventListener('blur',()=>setTimeout(()=>{ if(document.activeElement!==dFrom&&document.activeElement!==dTo) dRes.classList.remove('open'); },150));
  f.addEventListener('input',()=>{ dField=f; nav[f===dFrom?'from':'to']=null; renderD(); });
  f.addEventListener('keydown',e=>{ if(e.key==='ArrowDown'){ dSel=Math.min(dList.length-1,dSel+1); [...dRes.children].forEach((c,i)=>c.classList.toggle('sel',i===dSel)); e.preventDefault(); }
    else if(e.key==='ArrowUp'){ dSel=Math.max(0,dSel-1); [...dRes.children].forEach((c,i)=>c.classList.toggle('sel',i===dSel)); e.preventDefault(); }
    else if(e.key==='Enter'&&dList[dSel]&&dRes.classList.contains('open')) choose(f,dPick(dList[dSel]));
    else if(e.key==='Escape'){ dRes.classList.remove('open'); f.blur(); } }); }
const dPick=it=>it.meItem?ME_PL:it.person?it.person.bl:it.l;
dRes.addEventListener('pointerdown',e=>{ const r=e.target.closest('.res'); if(r&&dField){ e.preventDefault(); choose(dField,dPick(dList[+r.dataset.i])); } });
document.getElementById('dSwap').onclick=()=>{ [nav.from,nav.to]=[nav.to,nav.from]; [dFrom.value,dTo.value]=[dTo.value,dFrom.value]; if(nav.from&&nav.to) runNav(); };
function openDir(){ document.body.classList.add('dir'); closeResults(); closePanel(); closeLay(); const cp=cardPl; closeCard();
  if((cp||focusLbl)&&!nav.to){ nav.to=cp||focusLbl; dTo.value=nav.to.name; }
  if(!nav.from&&me&&me.on&&nav.to){ nav.from=ME_PL; dFrom.value='Your location'; if(nav.to) { runNav(); return; } }
  setTimeout(()=>(nav.to&&!nav.from?dFrom:!nav.to?dTo:dFrom).focus(),30); }
function closeDir(){ if(guide) stopGuide(); setURL(null); document.body.classList.remove('dir'); dRes.classList.remove('open'); routeMesh.visible=false; nav.route=null; dOut.classList.remove('open');
  nav.from=nav.to=null; dFrom.value=dTo.value=''; kick(); }
document.getElementById('bDir').onclick=openDir; document.getElementById('dClose').onclick=closeDir;
const WALK_IC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="1.8"/><path d="M9 21l2.5-6.5M15.5 21l-2-5-2-3 .8-4.5L9 10l-1 3.5M12.3 8.5l2.7 2.5 3 .5"/></svg>';
const BIKE_IC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5l4-7h6l3 7M9.5 9.5l3 7h-7M15 6h2l-1.5 3.5"/></svg>';
function navRouteGated(F,T){
  const fg=gatesFor(F), tg=gatesFor(T); let best=null;
  for(const a of (fg||[null])) for(const b of (tg||[null])){
    const R=navRoute(a?a.x:F.x,a?a.z:F.z,b?b.x:T.x,b?b.z:T.z); if(!R) continue;
    R.sec+=((a?Math.hypot(F.x-a.x,F.z-a.z):0)+(b?Math.hypot(T.x-b.x,T.z-b.z):0))/1.3;
    if(!best||R.sec<best.sec){ R.gOut=a; R.gIn=b; best=R; } }
  if(!best) return null;
  if(best.gOut){ best.pts.unshift([F.x,F.z]); best.nms.unshift(best.nms[0]); best.deg.unshift(2); }
  if(best.gIn){ const n=best.nms.length; best.nms.splice(n-1,0,best.nms[n-2]); best.pts.push([T.x,T.z]); best.deg.push(2); }
  return best; }
function runNav(keepView){
  if((nav.from&&nav.from.me)||(nav.to&&nav.to.me)){ if(!me){ navPending=true; locate(false); dOut.innerHTML='<div class="d-msg">Finding your location…</div>'; dOut.classList.add('open'); return; }
    if(!me.on){ dOut.innerHTML='<div class="d-msg">You seem to be outside campus, so there’s no route from your location. Pick a place instead.</div>'; dOut.classList.add('open'); routeMesh.visible=false; return; } }
  if(nav.from===nav.to){ dOut.innerHTML='<div class="d-msg">Start and destination are the same place.</div>'; dOut.classList.add('open'); routeMesh.visible=false; return; }
  const R=navRouteGated(nav.from,nav.to);
  if(!R){ dOut.innerHTML='<div class="d-msg">Couldn’t find a route between these places.</div>'; dOut.classList.add('open'); return; }
  const S=navSteps(R,nav.to.name);
  if(R.gOut){ const f=S.steps[0], P=R.pts; let i=1, acc=0; while(i<P.length-1&&acc<20){ acc+=Math.hypot(P[i+1][0]-P[i][0],P[i+1][1]-P[i][1]); i++; }
    const br=(Math.atan2(P[i][0]-P[1][0],-(P[i][1]-P[1][1]))*180/Math.PI+360)%360, card=['north','north-east','east','south-east','south','south-west','west','north-west'][Math.round(br/45)%8];
    f.txt=`Leave <em>${esc(nav.from.name)}</em> through <em>${R.gOut.n}</em>, then `+f.txt.replace(/^Head \S+/,'head '+card); }
  if(R.gIn){ const last=S.steps[S.steps.length-1], prev=S.steps[S.steps.length-2], d=Math.hypot(nav.to.x-R.gIn.x,nav.to.z-R.gIn.z);
    if(prev) prev.d=Math.max(0,prev.d-d);
    S.steps.splice(S.steps.length-1,0,{ic:'straight',txt:`Enter <em>${esc(nav.to.name)}</em> through <em>${R.gIn.n}</em>`,d,p:[R.gIn.x,R.gIn.z]});
    last.txt=`Arrive at <em>${esc(nav.to.name)}</em>`; }
  nav.route={P:R.pts,steps:S.steps}; nav.len=S.total; nav.t0=performance.now();
  buildRouteMesh(R.pts,S.cum); routeMesh.visible=true;
  if(wk.on) exitWalk(true); if(catFilter) setCat('all',false); setFocus(null);
  dOut.innerHTML=`<div class="d-modes"><button data-m="walk" class="${navMode==='walk'?'on':''}">${WALK_IC}Walk</button><button data-m="cycle" class="${navMode==='cycle'?'on':''}">${BIKE_IC}Cycle</button><button class="d-share" title="Copy link to this route">${SHARE_IC}</button></div>`+
    `<div class="d-sum"><b>${fmtT(R.sec/60)}</b><span>${fmtD(S.total)}</span><button class="d-tog">Steps</button></div>`+
    `<div class="d-go-row"><button class="d-go" data-g="preview">${IC_PLAY}Preview</button><button class="d-go pri" data-g="live">${IC_NAV}Start</button></div>`+
    (S.via.length?`<div class="d-via">via ${S.via.map(esc).join(' and ')}</div>`:'')+
    `<div id="dSteps">${S.steps.map((s,i)=>`<div class="d-st" data-i="${i}"><i>${arw(s.ic)}</i><span>${s.txt}</span><small>${s.d?fmtD(s.d):''}</small></div>`).join('')}</div>`;
  dOut.classList.add('open'); dOut.classList.remove('steps');
  dOut.querySelector('.d-modes').onclick=e=>{ const b=e.target.closest('button'); if(!b) return; if(b.classList.contains('d-share')){ shareLink(); return; } if(b.dataset.m&&b.dataset.m!==navMode){ navMode=b.dataset.m; runNav(true); } };
  setURL({from:nav.from.name,to:nav.to.name,...(navMode==='cycle'?{mode:'cycle'}:{})}); closeCard();
  dOut.querySelector('.d-go-row').onclick=e=>{ const b=e.target.closest('.d-go'); if(b) startGuide(b.dataset.g); };
  if(guide&&guide.reroute){ guide.reroute=false; guideRoute(); }
  dOut.querySelector('.d-tog').onclick=e=>{ const on=dOut.classList.toggle('steps'); e.target.textContent=on?'Hide steps':'Steps'; };
  dOut.querySelector('#dSteps').onclick=e=>{ const r=e.target.closest('.d-st'); if(!r) return; const s=nav.route.steps[+r.dataset.i];
    [...r.parentNode.children].forEach(c=>c.classList.toggle('sel',c===r));
    flyTo(new THREE.Vector3(s.p[0],0,s.p[1]),HOME_OFF.clone().normalize().multiplyScalar(260),1300); idleT=performance.now(); };
  if(keepView) return;
  // frame the whole route
  let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9; for(const p of R.pts){ x0=Math.min(x0,p[0]); x1=Math.max(x1,p[0]); z0=Math.min(z0,p[1]); z1=Math.max(z1,p[1]); }
  const ext=Math.max(x1-x0,z1-z0), dist=THREE.MathUtils.clamp(ext*1.25+160,260,2300)*(innerWidth<innerHeight?1.35:1);
  flyTo(new THREE.Vector3((x0+x1)/2,0,(z0+z1)/2),HOME_OFF.clone().normalize().multiplyScalar(dist),1700); idleT=performance.now(); }


