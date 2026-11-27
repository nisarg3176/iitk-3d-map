// Shareable links (place, directions, pins).
// ---- shareable links
function setURL(o){ try{ const u=new URL(location.href); for(const k of ['place','from','to','mode','pin']) u.searchParams.delete(k);
  if(o) for(const [k,v] of Object.entries(o)) if(v&&v!=='Your location') u.searchParams.set(k,v); history.replaceState(null,'',u.pathname+u.search+u.hash); }catch(e){} }
function shareLink(){ const url=location.href; const ok=()=>showHint('Link copied, paste it anywhere to share',3500);
  if(isTouch&&navigator.share){ navigator.share({title:document.title,url}).catch(()=>{}); return; }
  try{ navigator.clipboard.writeText(url).then(ok,()=>showHint(url,9000)); }catch(e){ showHint(url,9000); } }
const findPl=n=>{ if(!n) return null; const k=n.toLowerCase(); const it=searchItems.find(i=>!i.person&&i.l.name.toLowerCase()===k)||searchItems.find(i=>!i.person&&nrm(i.l.name)===nrm(n)); return it?it.l:null; };
let urlDone=false;
function applyURL(late){ if(urlDone) return; let q; try{ q=new URLSearchParams(location.search); }catch(e){ return; }
  const pl=q.get('place'), f=q.get('from'), t=q.get('to'), pn=q.get('pin');
  if(pn&&!pl&&!f&&!t){ urlDone=true; const [px,pz]=pn.split(',').map(Number); if(isFinite(px)&&isFinite(pz)) setTimeout(()=>{ const P={pin:true,x:px,z:pz,cat:'civic'}; const pp=placeAtPoint(px,pz,buildingAt(px,pz)); const Q=pp.pin?pp:Object.assign(P,{name:'Shared location',near:pp,nearD:Math.hypot(pp.x-px,pp.z-pz)});
      flyTo(new THREE.Vector3(px,0,pz),HOME_OFF.clone().normalize().multiplyScalar(260),1500); showPinCard(Q); },late?0:700); return; }
  if(!pl&&!f&&!t){ urlDone=true; return; }
  if(t||f){ urlDone=true; if(q.get('mode')==='cycle') navMode='cycle'; const T=findPl(t), F=findPl(f);
    setTimeout(()=>{ if(F){ nav.from=F; dFrom.value=F.name; } if(T){ nav.to=T; dTo.value=T.name; } document.body.classList.add('dir');
      if(F&&T) runNav(); else if(T&&!F){ nav.from=ME_PL; dFrom.value='Your location'; navPending=true; locate(false); } },late?0:700); return; }
  const l=findPl(pl); if(l){ urlDone=true; setTimeout(()=>{ const it=searchItems.find(i=>i.l===l); if(it) pick(it); },late?0:700); return; }
  if(late||peopleReady){ const it=searchItems.find(i=>i.person&&i.l.name.toLowerCase()===pl.toLowerCase()); urlDone=true; if(it) setTimeout(()=>pickPerson(it),late?0:700); } }
applyURL(false);
