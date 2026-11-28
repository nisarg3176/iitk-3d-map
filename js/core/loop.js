// Automatic lite mode, the render loop, start-up, and window.__api for testing.
// ---- automatic lite mode: if frames come too slowly, drop the costly effects
var liteLvl=0; const perf={n:0,slow:0,t0:performance.now()+4000};
function setLite(lv,quiet){ if(lv<=liteLvl) return; liteLvl=lv;
  const pr=lv>=2?Math.min(DPR,1.25):Math.min(DPR,1.5); renderer.setPixelRatio(pr); composer.setPixelRatio(pr);   // keep it sharp on phone screens (they are 2–3x)
  renderer.setSize(innerWidth,innerHeight); composer.setSize(innerWidth,innerHeight);
  if(lv>=2&&sun.castShadow){ sun.castShadow=false;   // shadows go only at the second step: without them the map looks flat and glary
    scene.traverse(o=>{ if(o.material){ (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true); } }); }
  bloom.strength=0; atmosDirty=true; dirty=true; perf.n=perf.slow=0;
  try{ sessionStorage.setItem('iitk3d.lite',String(lv)); }catch(e){}   // only for this visit: the next visit measures again
  if(!quiet) showHint('Switched to lite mode for smoother movement',3500); }
function watchPerf(now,gap){ if(liteLvl>=2||now<perf.t0||document.hidden||gap>10000) return;
  if(!perf.n) perf.w0=now; perf.n++; if(gap>55) perf.slow++;
  if(perf.n>=90||(now-perf.w0>6000&&perf.n>=8)){ if(perf.slow/perf.n>0.6) setLite(liteLvl+1); perf.n=perf.slow=0; } }
try{ localStorage.removeItem('iitk3d.lite'); const sv=+sessionStorage.getItem('iitk3d.lite')||0; const q=new URLSearchParams(location.search).get('lite'); const lv=q!=null?(+q||0):sv; if(q==='0'){ sessionStorage.removeItem('iitk3d.lite'); perf.t0=1e12; } if(lv) setLite(Math.min(2,lv),true); }catch(e){}
function frame(now){
  requestAnimationFrame(frame);
  if(now-lastRender<FRAME_MS && !dirty) return;
  if(lastRender) watchPerf(now,now-lastRender);
  const dt=Math.min(0.1,(now-last)/1000); last=now; const t=now/1000; TIME.value=t;
  if(timeAnim){ const k=Math.min(1,(now-timeAnim.t0)/timeAnim.dur); simMs=timeAnim.from+(timeAnim.to-timeAnim.from)*ease(k); atmosDirty=true;
    if(k>=1){ if(timeAnim.goLive){ live=true; simMs=Date.now(); } timeAnim=null; } }
  else if(live && now-liveT>20000){ simMs=Date.now(); liveT=now; atmosDirty=true; }
  if(stepWx(dt)) atmosDirty=true; stepSeason(dt);
  if(catAnim){ const k=Math.min(1,(now-catAnim.t0)/500); CATU.uCatAmt.value=catAnim.from+(catAnim.to-catAnim.from)*ease(k); if(k>=1) catAnim=null; dirty=true; }
  if(atmosDirty){ atmosDirty=false; applyAtmos(); dirty=true; }
  if(fly){ const k=Math.min(1,(now-fly.t0)/fly.dur), e=ease(k);
    controls.target.lerpVectors(fly.fromT,fly.toT,e); camera.position.lerpVectors(fly.fromP,fly.toP,e); dirty=true; if(k>=1) fly=null; }
  if(wk.on){ stepWalk(dt,now); dirty=true; }
  else if(guide){ stepGuide(now,dt); controls.update(); }
  else {
    if(!angleLock && !flat2D && !controls.autoRotate && !fly && !focusLbl && !catFilter && !routeMesh.visible && now-idleT>30000){ controls.autoRotate=true; controls.autoRotateSpeed=0.25; }
    controls.update(); if(controls.autoRotate) dirty=true;
    clampTarget();
  }
  if(dirty) shadowDirty=true;
  updateSun();
  if(shadowDirty){ renderer.shadowMap.needsUpdate=true; shadowDirty=false; }
  // ambient animation
  CLU.uDrift.value=t*4.5; CLU.uN.value=wxCur.clouds; clouds.visible=wxCur.clouds>0.3;
  rainLines.visible=wxCur.rain>0.02; if(rainLines.visible){ const ru=rainMat.uniforms; ru.uA.value=wxCur.rain*.42;
    const near=wk.on; ru.uB.value.set(near?70:240,near?50:200,near?70:240);
    const f=new THREE.Vector3(); camera.getWorldDirection(f); ru.uO.value.copy(camera.position).addScaledVector(f,near?20:110); }
  stepLife(dt,t);
  if(marker.visible){ const s=marker.userData.s, k=((now-marker.userData.t0)/1400)%1; marker.children[0].scale.setScalar(s*(1+k*.35)); marker.children[1].scale.setScalar(s*.9); mkMat.opacity=.9*(1-k*.6); }
  sky.position.copy(camera.position); refreshEnv(now);
  if(bloom.strength>0.01) composer.render(); else renderer.render(scene,camera);
  updateLabels(); stepNav(now); stepPins();
  dirty=false; lastRender=now;
}
renderer.shadowMap.autoUpdate=false;
applyAtmos();
document.getElementById('loader').classList.add('done');
requestAnimationFrame(frame);
flyTo(HOME_T,HOME_OFF,3200);
window.__ready=true;
window.__api={startGuide:(m)=>startGuide(m),guide:()=>guide&&{s:guide.s,total:guide.total,i:guide.i},set2D:(...q)=>set2D(...q),lite:()=>liteLvl,setLayer:(...a)=>setLayer(...a),NAV,CLOSED,isClosed,choose,dFrom,dTo,searchItems,runNav,nav,flyTo,camera,controls,THREE,kick,scene,sky,clouds,skyU,agents,lifeM,carNet,enterWalk,exitWalk,setCat,wk,labels,
  setTime:(h)=>{ live=false; timeAnim=null; simMs=istDay0(simMs)+h*3600000; atmosDirty=true; },
  setWeather:(w)=>{ weather=w; Object.assign(wxCur,{...WX[w],gc:C(WX[w].gc),cc:C(WX[w].cc)}); atmosDirty=true; },
  setSeason:(s)=>{ seasonMode=s; const S=SEASONS[curSeason()]; SEA.grassMul.value.set(...S.gm); SEA.leafMul.value.set(...S.lm); SEA.dry.value=S.dry; SEA.turn.value=S.turn; SEA.bloom.value=S.bloom; SEA.turnA.value.set(S.ta); SEA.turnB.value.set(S.tb); atmosDirty=true; },
  search:(q)=>{ sq.value=q; renderResults(); if(resList[0]) pick(resList[0]); },
  setView:(t,off)=>{ fly=null; controls.target.copy(t); camera.position.copy(t).add(off); controls.update(); kick(); }};

