// My location (GPS).
// ---- my location
let me=null, meWatch=null; const meEl=document.getElementById('me'), bLocate=document.getElementById('bLocate');
const toXZ=(lat,lon)=>[(lon-80.2347)*Math.cos(26.5134*Math.PI/180)*111320,-(lat-26.5134)*110540];
function flyToMe(){ if(!me) return; if(!me.on){ showHint('You seem to be outside campus, so your dot isn’t on this map',6000); return; }
  if(wk.on) exitWalk(true); flyTo(new THREE.Vector3(me.x,0,me.z),HOME_OFF.clone().normalize().multiplyScalar(340),1500); idleT=performance.now(); }
function locate(fly){ if(!navigator.geolocation){ showHint('Location isn’t available in this browser',4000); return; }
  if(me){ if(fly) flyToMe(); return; } if(meWatch!==null) return;
  showHint('Finding your location…',5000);
  meWatch=navigator.geolocation.watchPosition(pos=>{ const [x,z]=toXZ(pos.coords.latitude,pos.coords.longitude), first=!me;
    me={x,z,acc:pos.coords.accuracy,on:Math.abs(x)<1700&&Math.abs(z)<1700}; bLocate.classList.add('on');
    if(first){ hideHint(); if(fly) flyToMe(); if(navPending&&nav.from&&nav.to){ navPending=false; runNav(); } } kick(); },
    err=>{ showHint(err.code===1?'Location permission was denied':'Couldn’t get your location',5000); if(meWatch!==null) navigator.geolocation.clearWatch(meWatch); meWatch=null; bLocate.classList.remove('on'); navPending=false; },
    {enableHighAccuracy:true,maximumAge:5000,timeout:20000}); }
bLocate.onclick=()=>locate(true);
