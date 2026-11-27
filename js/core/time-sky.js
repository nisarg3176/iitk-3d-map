// Time of day, sun, sky colours, weather and seasons; night look (window glow, dimming bright walls).
/* ================= TIME · SUN · SKY · WEATHER · SEASONS ================= */
const LAT=26.5134, LON=80.2347, RAD=Math.PI/180, IST=330*60000;
function sunPos(ms){ const d=ms/86400000-10957.5;
  const g=(357.529+0.98560028*d)*RAD, q=280.459+0.98564736*d;
  const L=(q+1.915*Math.sin(g)+0.020*Math.sin(2*g))*RAD, e=(23.439-0.00000036*d)*RAD;
  const RA=Math.atan2(Math.cos(e)*Math.sin(L),Math.cos(L)), dec=Math.asin(Math.sin(e)*Math.sin(L));
  const GMST=((18.697374558+24.06570982441908*d)%24+24)%24;
  const Hh=(GMST*15+LON)*RAD-RA, lat=LAT*RAD;
  const alt=Math.asin(Math.sin(lat)*Math.sin(dec)+Math.cos(lat)*Math.cos(dec)*Math.cos(Hh));
  const az=Math.atan2(-Math.sin(Hh),Math.tan(dec)*Math.cos(lat)-Math.sin(lat)*Math.cos(Hh));
  return {alt:alt/RAD, az:az/RAD}; }
const dirFrom=(alt,az)=>{ const a=alt*RAD,z=az*RAD; return new THREE.Vector3(Math.sin(z)*Math.cos(a),Math.sin(a),-Math.cos(z)*Math.cos(a)); };
const istParts=ms=>{ const d=new Date(ms+IST); return {y:d.getUTCFullYear(),m:d.getUTCMonth(),d:d.getUTCDate(),min:d.getUTCHours()*60+d.getUTCMinutes()+d.getUTCSeconds()/60}; };
const istDay0=ms=>{ const p=istParts(ms); return Date.UTC(p.y,p.m,p.d)-IST; };
const fmt=min=>{ min=((Math.round(min)%1440)+1440)%1440; let h=Math.floor(min/60); const m=min%60, ap=h<12?'AM':'PM'; h=h%12||12; return h+':'+String(m).padStart(2,'0')+' '+ap; };
const evCache=new Map();
function dayEvents(day0){ if(evCache.has(day0)) return evCache.get(day0);
  let rise=390,set=1050,noon=720,best=-99,prev=sunPos(day0).alt;
  for(let m=2;m<=1440;m+=2){ const a=sunPos(day0+m*60000).alt; if(prev<-0.83&&a>=-0.83) rise=m; if(prev>=-0.83&&a<-0.83) set=m; if(a>best){best=a;noon=m;} prev=a; }
  const r={rise,set,noon}; evCache.set(day0,r); return r; }

const KF=[
 [-18,{top:'#040817',hor:'#1b2746',glow:'#ff9a55',ga:.12,fog:'#111a2f',hs:'#4a64a6',hg:'#121a2c',hi:.58,sc:'#a9bfff',si:.5,ex:1.0,sv:0}],
 [-9 ,{top:'#0b1433',hor:'#38406e',glow:'#ff8a4a',ga:.45,fog:'#262c4c',hs:'#5266a2',hg:'#161c30',hi:.64,sc:'#a9bfff',si:.34,ex:1.02,sv:0}],
 [-3 ,{top:'#2c4180',hor:'#e0906c',glow:'#ff7a40',ga:1.0,fog:'#b08a8c',hs:'#a4a2d2',hg:'#3c3a3c',hi:.95,sc:'#ff8a4a',si:0,ex:1.12,sv:.5}],
 [2  ,{top:'#5274b2',hor:'#ffb47e',glow:'#ff9450',ga:1.1,fog:'#e8b894',hs:'#f2cfc0',hg:'#7a7450',hi:1.15,sc:'#ffa060',si:2.4,ex:1.1,sv:1}],
 [9  ,{top:'#4d86c6',hor:'#f5d3a8',glow:'#ffbf72',ga:.75,fog:'#e9d6bd',hs:'#e6e0ea',hg:'#728448',hi:1.05,sc:'#ffcb8a',si:3.0,ex:1.05,sv:1}],
 [24 ,{top:'#4f94d4',hor:'#e8eef0',glow:'#ffe6bf',ga:.35,fog:'#dfe8e6',hs:'#cfe3ff',hg:'#6e8f4c',hi:1.0,sc:'#ffe6c2',si:3.5,ex:1.04,sv:1}],
 [70 ,{top:'#4a8ed2',hor:'#e6eef2',glow:'#fff0d6',ga:.3,fog:'#dfe8e6',hs:'#cfe3ff',hg:'#6e8f4c',hi:1.0,sc:'#fff0d8',si:3.6,ex:1.04,sv:1}],
].map(([e,o])=>[e,Object.fromEntries(Object.entries(o).map(([k,v])=>[k,typeof v==='string'?C(v):v]))]);
function look(e){ e=THREE.MathUtils.clamp(e,-18,70); let i=0; while(i<KF.length-2&&e>KF[i+1][0]) i++;
  const [e0,a]=KF[i],[e1,b]=KF[i+1], t=THREE.MathUtils.smoothstep(e,e0,e1)*0.6+((e-e0)/(e1-e0))*0.4, o={};
  for(const k in a) o[k]= a[k].isColor ? a[k].clone().lerp(b[k],t) : a[k]+(b[k]-a[k])*t; return o; }
const lum=c=>c.r*.2126+c.g*.7152+c.b*.0722;

const WX={clear:{sun:1,gray:0,fogK:1,haze:0,clouds:16,rain:0,rip:.35,hemi:1,gc:'#c9d2da',cc:'#ffffff'},
  cloudy:{sun:.36,gray:.55,fogK:.8,haze:.35,clouds:62,rain:0,rip:.55,hemi:1.1,gc:'#b9c3cb',cc:'#eef1f3'},
  fog:{sun:.45,gray:.82,fogK:.2,haze:.95,clouds:0,rain:0,rip:.12,hemi:1.08,gc:'#d4d8d4',cc:'#ffffff'},
  rain:{sun:.12,gray:.88,fogK:.45,haze:.65,clouds:80,rain:1,rip:1.2,hemi:.85,gc:'#7b858d',cc:'#9aa3ab'}};
let weather='clear';
const wxCur={sun:1,gray:0,fogK:1,haze:0,clouds:16,rain:0,rip:.35,hemi:1,gc:C('#c9d2da'),cc:C('#ffffff')};
function stepWx(dt){ const T=WX[weather], f=1-Math.exp(-dt*2.2); let moving=false;
  for(const k of ['sun','gray','fogK','haze','clouds','rain','rip','hemi']){ const d=T[k]-wxCur[k]; if(Math.abs(d)>1e-3){ wxCur[k]+=d*f; moving=true; } else wxCur[k]=T[k]; }
  wxCur.gc.lerp(C(T.gc),f); wxCur.cc.lerp(C(T.cc),f); return moving; }

const SEASONS={summer:{gm:[1.06,.97,.74],dry:.3,lm:[1.08,.97,.72],turn:.05,ta:'#a8892f',tb:'#8a5a22',bloom:.11},
  monsoon:{gm:[.84,1.08,.8],dry:0,lm:[.8,1.06,.78],turn:0,ta:'#d19a1c',tb:'#a8431a',bloom:.012},
  autumn:{gm:[1.04,1.0,.84],dry:.16,lm:[1.04,.99,.86],turn:.11,ta:'#b8952a',tb:'#a65a22',bloom:0},
  winter:{gm:[.95,.95,.92],dry:.26,lm:[.9,.93,.9],turn:.08,ta:'#a39a62',tb:'#8b7d55',bloom:.004}};
let seasonMode='auto';
const autoSeason=ms=>{ const m=istParts(ms).m; return (m<=1||m===11)?'winter':m<=5?'summer':m<=8?'monsoon':'autumn'; };
const curSeason=()=>seasonMode==='auto'?autoSeason(simMs):seasonMode;
function stepSeason(dt){ const S=SEASONS[curSeason()], f=1-Math.exp(-dt*2.5);
  SEA.grassMul.value.lerp(new THREE.Vector3(...S.gm),f); SEA.leafMul.value.lerp(new THREE.Vector3(...S.lm),f);
  SEA.dry.value+=(S.dry-SEA.dry.value)*f; SEA.turn.value+=(S.turn-SEA.turn.value)*f; SEA.bloom.value+=(S.bloom-SEA.bloom.value)*f;
  SEA.turnA.value.lerp(C(S.ta),f); SEA.turnB.value.lerp(C(S.tb),f); }

let live=true, simMs=Date.now(), timeAnim=null, nightN=0, nightK=0;
const MOON_DIR=moon.position.clone().normalize();
const LIGHT_DIR=SUN_DIR.clone();
const winWarm=new THREE.Color('#ffffff');
function applyLights(n){
  const k=Math.max(0,(n-0.35)/0.65); nightN=n; nightK=k;
  wallMat.emissive.copy(winWarm).multiplyScalar(k*1.35);
  headMat.color.copy(C('#9aa0a6')).lerp(C('#fff1c9').multiplyScalar(3.2),k);
  poolMat.opacity=k*0.6; lampGlow.material.opacity=k*0.85;
  bloom.strength=liteLvl?0:k*0.85; CATU.uSelf.value=n*0.14; CATU.uDim.value=n; nightHooks.forEach(f=>f(n,k));  // uSelf: buildings keep a hint of their own colour at night aoMat.opacity=0.62-0.2*n;
}
let sunAlt=0;
function applyAtmos(){
  const sp=sunPos(simMs), e=sp.alt; sunAlt=e;
  const L=look(e), w=wxCur;
  const gray=w.gc.clone().multiplyScalar(Math.min(1.1,lum(L.hor)/0.82+0.04));
  skyU.top.value.copy(L.top).lerp(gray.clone().multiplyScalar(.92),w.gray*.9);
  skyU.hor.value.copy(L.hor).lerp(L.fog,.3).lerp(gray,w.gray);
  skyU.glow.value.copy(L.glow); skyU.glowAmt.value=L.ga*(1-w.gray*.85);
  skyU.haze.value=w.haze;
  scene.fog.color.copy(skyU.hor.value);
  hemi.color.copy(L.hs).lerp(gray,w.gray*.5); hemi.groundColor.copy(L.hg); hemi.intensity=L.hi*w.hemi;
  const sd=dirFrom(e,sp.az); skyU.sunDir.value.copy(sd); skyU.sunCol.value.copy(L.sc); skyU.sunVis.value=L.sv*(1-w.gray*.92);
  if(e>-3) LIGHT_DIR.copy(dirFrom(Math.max(e,9),sp.az)); else LIGHT_DIR.copy(MOON_DIR);
  sun.color.copy(L.sc); sun.intensity=L.si*(e>-3?w.sun:(1-w.gray*.7));
  renderer.toneMappingExposure=L.ex*(1-w.rain*.08);
  const n=THREE.MathUtils.smoothstep(-e,-3,7);
  const nEff=Math.max(n,w.rain*.42+w.gray*.12*(1-n));
  applyLights(nEff);
  stars.material.opacity=Math.max(0,(n-.5)*2)*(1-w.gray); moon.material.opacity=Math.max(0,(n-.4)/.6)*(1-w.gray*.85);
  document.body.classList.toggle('night',n>0.5);
  for(const m of waterMats) m.userData.rip.value=w.rip;
  if(asphM){ const am=asphM.material; am.roughness=0.95-0.67*w.rain; am.envMapIntensity=0.12+0.9*w.rain; am.color.setScalar(1-0.42*w.rain); }
  if(footM) footM.material.color.setScalar(1-0.22*w.rain);
  cloudMat.color.copy(w.cc); cloudMat.emissive.copy(scene.fog.color).multiplyScalar(.28);
  rainMat.uniforms.uCol.value.copy(scene.fog.color).lerp(C('#ffffff'),.55);
  envDirty=true; shadowDirty=true; updateTimeUI();
}

