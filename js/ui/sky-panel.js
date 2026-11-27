// Time / weather / season panel, lock angle, 2D map.
/* ================= SKY PANEL UI ================= */
const panel=document.getElementById('skyPanel'), slider=document.getElementById('tslider');
const ICO={sun:'<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>',
  moon:'<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>', cloud:'<path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 11.1 3.5 3.5 0 0 0 7 18z"/>',
  fog:'<path d="M4 9h16M3 13h18M5 17h14"/>', rain:'<path d="M7 15h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 8.1 3.5 3.5 0 0 0 7 15z"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3"/>',
  rise:'<path d="M3 18h18M6 18a6 6 0 0 1 12 0M12 4v4M5.5 9.5l1.5 1.5M18.5 9.5L17 11"/>'};
function closePanel(){ panel.classList.remove('open'); }
document.getElementById('bSky').onclick=e=>{ e.stopPropagation(); panel.classList.toggle('open'); closeResults(); };
function updateTimeUI(){
  const p=istParts(simMs), ev=dayEvents(istDay0(simMs));
  if(document.activeElement!==slider) slider.value=Math.round(p.min);
  const t=fmt(p.min); document.getElementById('spTime').textContent=t; document.getElementById('dockTime').textContent=t;
  document.getElementById('spSun').textContent=`Sunrise ${fmt(ev.rise)} · Sunset ${fmt(ev.set)}`+(seasonMode==='auto'?` · ${curSeason()[0].toUpperCase()+curSeason().slice(1)}`:'');
  document.getElementById('bSky').classList.toggle('islive',live); document.getElementById('bLive').classList.toggle('on',live);
  const ic = weather==='rain'?'rain':weather==='fog'?'fog':weather==='cloudy'?'cloud':sunAlt<-3?'moon':sunAlt<6?'rise':'sun';
  const ico=document.getElementById('skyIco'); if(ico.dataset.k!==ic){ ico.innerHTML=ICO[ic]; ico.dataset.k=ic; }
}
function goTime(targetMin,dur=2600){ live=false; const d0=istDay0(simMs), cur=istParts(simMs).min; let to=targetMin; if(to<cur-1) to+=1440;
  timeAnim={from:d0+cur*60000,to:d0+to*60000,t0:performance.now(),dur:Math.min(dur,600+Math.abs(to-cur)*6)}; }
slider.addEventListener('input',()=>{ live=false; timeAnim=null; simMs=istDay0(simMs)+(+slider.value)*60000; atmosDirty=true; });
document.getElementById('bLive').onclick=()=>{ timeAnim=null; const target=Date.now(); timeAnim={from:simMs,to:target,t0:performance.now(),dur:1500,goLive:true}; };
document.getElementById('quick').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; const ev=dayEvents(istDay0(simMs));
  goTime({sunrise:ev.rise+8,noon:ev.noon,golden:ev.set-50,sunset:ev.set-6,night:21*60+30}[b.dataset.q]); });
document.getElementById('wx').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; weather=b.dataset.w;
  [...e.currentTarget.children].forEach(c=>c.classList.toggle('on',c===b)); atmosDirty=true; });
document.getElementById('season').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; seasonMode=b.dataset.s;
  [...e.currentTarget.children].forEach(c=>c.classList.toggle('on',c===b)); atmosDirty=true; });
document.getElementById('lifeT').onchange=e=>{ LIFE.on=e.target.checked; kick(); };
document.getElementById('bLabels').onclick=e=>{ labelsOn=!labelsOn; document.body.classList.toggle('hide-labels',!labelsOn); e.currentTarget.classList.toggle('on',labelsOn); kick(); };
let fly=null;
function flyTo(t,off,dur=1800,free){ if(flat2D) off=new THREE.Vector3(0,off.length(),0.01); else if(angleLock&&!free) off=camera.position.clone().sub(controls.target).normalize().multiplyScalar(off.length()); fly={t0:performance.now(),dur,fromP:camera.position.clone(),fromT:controls.target.clone(),toT:t.clone(),toP:t.clone().add(off)}; kick(); }
document.getElementById('bReset').onclick=()=>{ if(wk.on) exitWalk(true); setCat('all',false); flyTo(HOME_T,HOME_OFF,1800,true); };
// ---- lock viewing angle: one finger moves, pinch zooms, no rotate or tilt
const bLock=document.getElementById('bLock');
function setAngleLock(on){ angleLock=on; bLock.classList.toggle('on',on); bLock.setAttribute('aria-pressed',on);
  document.getElementById('lockTxt').textContent=on?'Angle locked':'Lock angle';
  controls.enableRotate=!on; controls.touches.TWO=on?THREE.TOUCH.DOLLY_PAN:THREE.TOUCH.DOLLY_ROTATE;
  if(on) controls.autoRotate=false;
  showHint(on?'Angle locked · double-tap to zoom in':'Angle unlocked',3000); kick(); }
bLock.onclick=()=>setAngleLock(!angleLock);
// ---- 2D map: straight down, north up, no rotation
const b2D=document.getElementById('b2D');
function set2D(on,quiet){ if(on===flat2D) return; flat2D=on; document.body.classList.toggle('flat',on);
  b2D.classList.toggle('on',on); b2D.setAttribute('aria-pressed',on); b2D.setAttribute('aria-label',on?'Switch to 3D view':'Switch to 2D map');
  document.getElementById('b2DTxt').textContent=on?'3D':'2D'; document.getElementById('viewTxt').textContent=on?'view':'map';
  const d=camera.position.distanceTo(controls.target);
  if(on){ controls.minPolarAngle=0; controls.maxPolarAngle=0.0001; controls.enableRotate=false; controls.touches.TWO=THREE.TOUCH.DOLLY_PAN; controls.autoRotate=false;
    fly=null; camera.position.copy(controls.target).add(new THREE.Vector3(0,d,0.01)); camera.up.set(0,1,0); controls.update(); }
  else { controls.maxPolarAngle=1.36; controls.minPolarAngle=0.15; controls.enableRotate=!angleLock; controls.touches.TWO=angleLock?THREE.TOUCH.DOLLY_PAN:THREE.TOUCH.DOLLY_ROTATE;
    flyTo(controls.target.clone(),HOME_OFF.clone().normalize().multiplyScalar(d),900,true); }
  try{ localStorage.setItem('iitk3d.view',on?'2d':'3d'); }catch(e){}
  if(!quiet) showHint(on?'2D map · drag to move, pinch to zoom':'Back to 3D',2500); kick(); }
b2D.onclick=()=>set2D(!flat2D);
try{ if(localStorage.getItem('iitk3d.view')==='2d') set2D(true,true); }catch(e){}

/* ---------------- loop ---------------- */
