// Walk mode (first person) and its joystick.
/* ================= WALK MODE ================= */
const wk={on:false,yaw:0,pitch:0,x:0,z:0,keys:{},jx:0,jy:0,bob:0,trans:null,look:null};
let blockD;
{ const bc=document.createElement('canvas'); bc.width=bc.height=OCC; const x=bc.getContext('2d'); x.fillStyle='#000'; x.fillRect(0,0,OCC,OCC); x.fillStyle='#fff';
  for(const b of bInfo){ ctxPoly(x,[b.outer]); x.fill(); }
  for(const a of data.areas) if(a.t==='water'){ ctxPoly(x,a.r.map(toPts)); x.fill('evenodd'); }
  const id=x.getImageData(0,0,OCC,OCC).data; blockD=new Uint8Array(OCC*OCC); for(let i=0;i<blockD.length;i++) blockD[i]=id[i*4]>110?1:0; }
const blocked=(x,z)=>{ if(Math.abs(x)>EXT-25||Math.abs(z)>EXT-25) return true; return blockD[(toPx(z)|0)*OCC+(toPx(x)|0)]===1; };
const freeAt=(x,z)=>!blocked(x,z)&&!blocked(x+.5,z)&&!blocked(x-.5,z)&&!blocked(x,z+.5)&&!blocked(x,z-.5);
function findSpot(x,z){ for(let r=0;r<300;r+=3){ const n=Math.max(1,Math.round(r*1.6)); for(let i=0;i<n;i++){ const a=i/n*Math.PI*2, px=x+Math.cos(a)*r, pz=z+Math.sin(a)*r; if(roadAt(px,pz)&&freeAt(px,pz)) return [px,pz]; } } return [x,z]; }
const EYE=1.7+0.2;
const hintEl=document.getElementById('hint'); const isTouch=matchMedia('(pointer:coarse)').matches; if(isTouch) document.body.classList.add('touch');
function showHint(txt,ms=6500){ hintEl.textContent=txt; hintEl.classList.remove('gone'); clearTimeout(hintTimer); hintTimer=setTimeout(hideHint,ms); }
function enterWalk(at){
  if(wk.on) return; if(flat2D) set2D(false,true); closePanel(); fly=null; controls.autoRotate=false;
  const t=at||controls.target; const [x,z]=findSpot(t.x,t.z);
  const f=new THREE.Vector3().subVectors(controls.target,camera.position); f.y=0; if(f.lengthSq()<1) f.set(0,0,-1); f.normalize();
  const nr=nearestRoad(x,z,14); if(nr){ let dx=Math.cos(nr.ang), dz=Math.sin(nr.ang); if(dx*f.x+dz*f.z<0){dx=-dx;dz=-dz;} f.set(dx,0,dz); }
  wk.on=true; wk.x=x; wk.z=z; wk.yaw=Math.atan2(-f.x,-f.z); wk.pitch=-0.04; wk.keys={}; wk.jx=wk.jy=0;
  const q1=new THREE.Quaternion().setFromEuler(new THREE.Euler(wk.pitch,wk.yaw,0,'YXZ'));
  wk.trans={t0:performance.now(),dur:2000,p0:camera.position.clone(),q0:camera.quaternion.clone(),p1:new THREE.Vector3(x,EYE,z),q1};
  controls.enabled=false; camera.near=0.25; camera.updateProjectionMatrix();
  document.body.classList.add('walking'); document.getElementById('bWalk').classList.add('on'); document.getElementById('walkTxt').textContent='Exit';
  showHint(isTouch?'Left stick to walk · drag to look around':'W A S D to walk · drag to look · Shift to run · Esc to exit',8000); kick();
}
function exitWalk(noFly){
  if(!wk.on) return; wk.on=false; wk.trans=null; wk.look=null;
  controls.enabled=true; camera.near=3; camera.updateProjectionMatrix();
  document.body.classList.remove('walking'); document.getElementById('bWalk').classList.remove('on'); document.getElementById('walkTxt').textContent='Walk';
  const fx=-Math.sin(wk.yaw), fz=-Math.cos(wk.yaw);
  const T=new THREE.Vector3(wk.x+fx*60,0,wk.z+fz*60);
  controls.target.copy(T); controls.update();
  if(!noFly) flyTo(T,new THREE.Vector3(-fx*260,240,-fz*260),1600);
  hideHint(); kick();
}
function stepWalk(dt,now){
  if(wk.trans){ const tr=wk.trans, t=Math.min(1,(now-tr.t0)/tr.dur), e=ease(t);
    camera.position.lerpVectors(tr.p0,tr.p1,e); camera.position.y=THREE.MathUtils.lerp(tr.p0.y,tr.p1.y,1-Math.pow(1-e,2));
    camera.quaternion.slerpQuaternions(tr.q0,tr.q1,THREE.MathUtils.smoothstep(t,.25,1)); if(t>=1) wk.trans=null; }
  else {
    const k=wk.keys; let fw=(k.KeyW||k.ArrowUp?1:0)-(k.KeyS||k.ArrowDown?1:0)-wk.jy, st=(k.KeyD?1:0)-(k.KeyA?1:0)+wk.jx;
    wk.yaw+=((k.ArrowLeft||k.KeyQ?1:0)-(k.ArrowRight||k.KeyE?1:0))*dt*1.8;
    const mag=Math.min(1,Math.hypot(fw,st)); const run=k.ShiftLeft||k.ShiftRight||Math.hypot(wk.jx,wk.jy)>0.92;
    if(mag>0.05){ const sp=(run?11:4.5)*mag*dt, a=Math.atan2(st,fw); const fx=-Math.sin(wk.yaw), fz=-Math.cos(wk.yaw);
      const mx=(fx*Math.cos(a)-fz*Math.sin(a))*sp, mz=(fz*Math.cos(a)+fx*Math.sin(a))*sp;
      if(freeAt(wk.x+mx,wk.z+mz)){ wk.x+=mx; wk.z+=mz; } else if(freeAt(wk.x+mx,wk.z)) wk.x+=mx; else if(freeAt(wk.x,wk.z+mz)) wk.z+=mz;
      wk.bob+=sp*(run?1.3:1.9); }
    camera.position.set(wk.x,EYE+Math.sin(wk.bob)*.045,wk.z);
    camera.rotation.set(wk.pitch,wk.yaw,0,'YXZ');
  }
  const fx=-Math.sin(wk.yaw), fz=-Math.cos(wk.yaw);
  controls.target.set(camera.position.x+fx*25,0,camera.position.z+fz*25);
}
// input
addEventListener('keydown',e=>{ if(e.target.tagName==='INPUT') return; if(wk.on){ wk.keys[e.code]=true; if(e.code==='Escape') exitWalk(); if(/^(Arrow|Space)/.test(e.code)) e.preventDefault(); } });
addEventListener('keyup',e=>{ wk.keys[e.code]=false; });
addEventListener('keydown',e=>{ if(guide&&e.code==='Escape') stopGuide(); });
addEventListener('blur',()=>{ wk.keys={}; });
canvas.addEventListener('pointerdown',e=>{ closePanel(); closeResults(); if(!wk.on||wk.look) return; wk.look={id:e.pointerId,x:e.clientX,y:e.clientY}; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove',e=>{ const L=wk.look; if(!wk.on||!L||L.id!==e.pointerId||wk.trans) return;
  const s=isTouch?0.0065:0.0042; wk.yaw-=(e.clientX-L.x)*s; wk.pitch=THREE.MathUtils.clamp(wk.pitch-(e.clientY-L.y)*s,-1.25,1.05); L.x=e.clientX; L.y=e.clientY; });
const endLook=e=>{ if(wk.look&&wk.look.id===e.pointerId) wk.look=null; };
canvas.addEventListener('pointerup',endLook); canvas.addEventListener('pointercancel',endLook);
{ const joy=document.getElementById('joy'), knob=joy.querySelector('i'); let jid=null;
  const mv=e=>{ const r=joy.getBoundingClientRect(); let dx=(e.clientX-r.left-r.width/2)/(r.width/2-14), dy=(e.clientY-r.top-r.height/2)/(r.height/2-14); const l=Math.hypot(dx,dy); if(l>1){dx/=l;dy/=l;}
    wk.jx=dx; wk.jy=dy; knob.style.transform=`translate(${dx*36}px,${dy*36}px)`; };
  joy.addEventListener('pointerdown',e=>{ e.stopPropagation(); jid=e.pointerId; joy.setPointerCapture(jid); mv(e); });
  joy.addEventListener('pointermove',e=>{ if(e.pointerId===jid) mv(e); });
  const up=e=>{ if(e.pointerId!==jid) return; jid=null; wk.jx=wk.jy=0; knob.style.transform=''; };
  joy.addEventListener('pointerup',up); joy.addEventListener('pointercancel',up); }
document.getElementById('bWalk').onclick=()=>wk.on?exitWalk():enterWalk();

