// Place cards, opening hours, tapping and double-tapping on the map (dropped pins).
/* ================= PLACE CARDS · USEFUL SPOTS · PROFESSORS · MY LOCATION · LINKS ================= */
const IC={
  share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.3M8.3 13.2l7.4 4.3"/></svg>',
  go:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5l9.5 9.5-9.5 9.5L2.5 12z"/><path d="M9 14v-3h6M13 9l2 2-2 2"/></svg>',
  from:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="8.5"/></svg>',
  walk:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="1.8"/><path d="M9 21l2.5-6.5L14 17v4M7.5 12l2-4.5 3.5-.5 2.5 3.5 3 1M11.5 14.5L13 7"/></svg>',
  bld:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5l8-3 8 3v16M9 21v-5h6v5M8 8h2M14 8h2M8 12h2M14 12h2"/></svg>'};
const SHARE_IC=IC.share;
const CATN={academic:'Academic',hostel:'Hostel',food:'Food',shop:'Shop',sports:'Sports',worship:'Worship',health:'Health',civic:'Place'};
const titleCase=s=>s.replace(/_/g,' ').replace(/^./,c=>c.toUpperCase());
// ---- details from OpenStreetMap
const INFO=new Map(); for(const r of (data.info||[])){ const k=nrm(r.n); if(k&&!INFO.has(k)) INFO.set(k,r); }
function infoFor(pl){ for(const n of [pl.name,...(pl.alt||[])]){ const r=INFO.get(nrm(n)); if(r&&Math.hypot(r.x-pl.x,r.z-pl.z)<400) return r; } return null; }
// ---- opening hours (common OSM forms only; anything else shows the raw text with no badge)
const DAYS=['Mo','Tu','We','Th','Fr','Sa','Su'], DAYN=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
function parseOH(spec){
  if(!spec) return null; spec=spec.trim(); if(/^24\/7$/.test(spec)) return 'always';
  const wk=[null,null,null,null,null,null,null];
  for(let rule of spec.split(';')){ rule=rule.trim(); if(!rule) continue;
    const m=rule.match(/^((?:[A-Z][a-z]|PH)(?:\s*[-,]\s*(?:[A-Z][a-z]|PH))*)?\s*(.*)$/); let days=[0,1,2,3,4,5,6];
    if(m[1]){ days=[]; for(const part of m[1].split(',')){ const p=part.trim(); if(p==='PH') continue; const r=p.split('-').map(x=>DAYS.indexOf(x.trim()));
      if(r.some(i=>i<0)) return null; if(r.length===1) days.push(r[0]); else for(let i=r[0];;i=(i+1)%7){ days.push(i); if(i===r[1]) break; } }
      if(!days.length) continue; }
    const rest=m[2].trim();
    if(/^(off|closed)$/i.test(rest)){ for(const d of days) wk[d]=[]; continue; }
    const spans=[]; for(const t of rest.split(',')){ const q=t.trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})\+?$/); if(!q) return null; spans.push([+q[1]*60+ +q[2],+q[3]*60+ +q[4]]); }
    for(const d of days) wk[d]=spans; }
  return wk; }
const hm=m=>{ m=((m%1440)+1440)%1440; if(m===0) return 'midnight'; const h=Math.floor(m/60), mm=m%60; return `${(h%12)||12}${mm?':'+String(mm).padStart(2,'0'):''} ${h<12?'AM':'PM'}`; };
function openState(spec){ const wk=parseOH(spec); if(!wk) return null; if(wk==='always') return {open:true,txt:'Open 24 hours'};
  const n=new Date(Date.now()+5.5*3600e3), day=(n.getUTCDay()+6)%7, min=n.getUTCHours()*60+n.getUTCMinutes();
  const yd=wk[(day+6)%7]||[]; for(const [s,e] of yd) if(e<=s&&min<e) return {open:true,txt:'Open now · until '+hm(e)};
  for(const [s,e] of (wk[day]||[])){ if(e>s?(min>=s&&min<e):(min>=s)) return {open:true,txt:'Open now · until '+hm(e)}; }
  for(const [s] of (wk[day]||[])) if(s>min) return {open:false,txt:'Closed · opens '+hm(s)};
  for(let k=1;k<=7;k++){ const d=(day+k)%7, sp=wk[d]; if(sp&&sp.length) return {open:false,txt:`Closed · opens ${k===1?'tomorrow':DAYN[d]} ${hm(sp[0][0])}`}; }
  return {open:false,txt:'Closed'}; }
// ---- which building a point is in
function buildingAt(x,z){ for(const b of bInfo){ if(Math.abs(b.cx-x)>160||Math.abs(b.cz-z)>160) continue; if(pip(x,z,b.outer)) return b; } return null; }
const cardLabels=labels.filter(l=>!l.kind||l.kind==='feat'||l.kind==='blk');
function insideOf(pl){ const b=buildingAt(pl.x,pl.z); if(!b) return []; const seen=new Set([nrm(pl.name)]), out=[];
  for(const l of cardLabels){ if(l.tier>=4.5||Math.abs(l.x-b.cx)>160||Math.abs(l.z-b.cz)>160) continue; const k=nrm(l.name); if(seen.has(k)||!pip(l.x,l.z,b.outer)) continue; seen.add(k); out.push(l); }
  return out.slice(0,12); }
// ---- the card
const cardEl=document.getElementById('card'); let cardPl=null;
function closeCard(){ cardEl.classList.remove('open'); cardPl=null; if(typeof pinMk!=='undefined') pinMk.visible=false; }
function cardShell(title,kind,body){ if(typeof pinMk!=='undefined'&&!(cardPl&&cardPl.pin)) pinMk.visible=false; cardEl.innerHTML=`<div class="c-head"><div><h2>${esc(title)}</h2><div class="c-kind">${kind}</div></div><button class="c-x" aria-label="Close">×</button></div><div class="c-body">${body}</div>`;
  cardEl.classList.add('open'); cardEl.querySelector('.c-body').scrollTop=0; closeLay(); }
const kvRows=rows=>{ const r=rows.filter(x=>x[1]); return r.length?`<dl class="c-kv">${r.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`:''; };
const link=(u,t)=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t||u.replace(/^https?:\/\/(www\.)?/,'').replace(/\/$/,'').slice(0,38))}</a>`;
const acts=(pl,extra='')=>`<div class="c-acts"><button class="pri" data-act="go">${IC.go}Directions</button><button data-act="from">${IC.from}Start here</button>${extra}<button data-act="share" title="Copy link">${IC.share}</button></div>`;
function showPlaceCard(pl){
  cardPl=pl; const inf=infoFor(pl)||{}; const st=openState(inf.h);
  const util=pl.util?UT[pl.util]:null;
  const kind=[util?`<i style="background:${util[3]}"></i>${util[1]}`:`<i style="background:${pl.kind==='feat'?'#e0262f':CATCOL[pl.cat]||CATCOL.civic}"></i>${CATN[pl.cat]||'Place'}`,
    pl.name==='CMHW'?'Center for Mental Health and Wellbeing':pl.sub||'',
    inf.k&&!/^(yes|university)$/.test(inf.k)?titleCase(inf.k):''].filter(Boolean).join(' · ');
  const wc={yes:'Step-free',limited:'Partly step-free',no:'Not step-free'}[inf.wc];
  const inside=insideOf(pl);
  const body=acts(pl,`<button data-act="walk">${IC.walk}Walk here</button>`)+
    kvRows([['Hours',inf.h?(st?`<span class="${st.open?'c-open':'c-closed'}">${st.txt}</span><br>`:'')+esc(inf.h):''],
      ['Phone',inf.ph?`<a href="tel:${esc(inf.ph.replace(/\s/g,''))}">${esc(inf.ph)}</a>`:''],['Website',inf.web?link(inf.web):''],
      ['Access',wc||''],['Floor',!pl.sub&&inf.lv!=null&&inf.lv!==''?esc(String(inf.lv)):''],['Cuisine',inf.cu?esc(titleCase(inf.cu.replace(/;/g,', '))):''],
      ['Run by',inf.op?esc(inf.op):''],['Note',inf.ds?esc(inf.ds):'']])+
    (pl.people?`<div class="c-sec">Faculty offices here</div><div class="c-list">${pl.people.slice(0,40).map((p,i)=>`<div data-person="${i}">${esc(p.n)}<small>${esc(p.d.slice(0,24))}</small></div>`).join('')}</div>`:'')+
    (inside.length?`<div class="c-sec">Also in this building</div><div class="c-list">${inside.map((l,i)=>`<div data-inside="${i}"><i style="width:7px;height:7px;border-radius:50%;background:${CATCOL[l.cat]||CATCOL.civic}"></i>${esc(l.name)}</div>`).join('')}</div>`:'')+
    `<p class="c-src">${inf.osm?`Details from ${link('https://www.openstreetmap.org/'+inf.osm,'OpenStreetMap')}`:'Map data from OpenStreetMap'}</p>`;
  cardShell(pl.name,kind,body); cardEl._inside=inside;
  const ppl=PEOPLE_AT.get(pl); if(ppl&&!pl.people){ pl.people=ppl; showPlaceCard(pl); }
}
function showPersonCard(p){
  cardPl=p.bl||null; const b=p.bl;
  const body=(b?`<div class="c-acts"><button class="pri" data-act="go">${IC.go}Directions</button><button data-act="bld">${IC.bld}Show building</button><button data-act="share" title="Copy link">${IC.share}</button></div>`:'')+
    kvRows([['Dept',esc(p.d)],['Office',p.o?esc(p.o):''],['Building',b?esc(b.name)+(p.bv==='d'?' <span style="color:var(--ink2)">(department building)</span>':''):''],
      ['Email',p.e?`<a href="mailto:${esc(p.e)}">${esc(p.e)}</a>`:''],['Phone',p.ph?`<a href="tel:${esc(p.ph)}">${esc(p.ph)}</a>`:''],['Web',p.w?link(p.w):'']])+
    (p.r?`<div class="c-sec">Research</div><p class="c-note">${esc(p.r)}</p>`:'')+
    `<p class="c-src">${p.u?link(p.u,'Profile on iitk.ac.in →'):''}${b?'':' · Office building not listed'}</p>`;
  cardShell(p.n,esc(p.t||'Faculty'),body); cardEl._person=p;
}
cardEl.addEventListener('click',e=>{
  if(e.target.closest('.c-x')){ closeCard(); setFocus(null); setURL(null); return; }
  const a=e.target.closest('[data-act]');
  if(a){ const act=a.dataset.act, pl=cardPl;
    if(act==='share') shareLink();
    else if(act==='go'&&pl) dirTo(pl); else if(act==='from'&&pl) navFromPl(pl);
    else if(act==='walk'&&pl){ closeCard(); enterWalk(new THREE.Vector3(pl.x,0,pl.z)); }
    else if(act==='bld'&&pl){ openPlace(pl,true); }
    return; }
  const ins=e.target.closest('[data-inside]'); if(ins){ openPlace(cardEl._inside[+ins.dataset.inside],true); return; }
  const pe=e.target.closest('[data-person]'); if(pe&&cardPl&&cardPl.people){ const p=cardPl.people[+pe.dataset.person]; showPersonCard(p); setURL({place:p.n}); }
});
function flyToPl(pl){ const dist=THREE.MathUtils.clamp((pl.size||30)*3.2+170,220,620); flyTo(new THREE.Vector3(pl.x,0,pl.z),HOME_OFF.clone().normalize().multiplyScalar(dist),1700); idleT=performance.now(); }
function openPlace(pl,fly){ if(wk.on) exitWalk(true); if(catFilter&&pl.cat!==catFilter) setCat('all',false);
  if(pl.size!==undefined||pl.y!==undefined) setFocus(pl.y!==undefined?pl:null); if(fly) flyToPl(pl); showPlaceCard(pl); setURL({place:pl.name}); }
// ---- directions shortcuts
const ME_PL={name:'Your location',me:true,get x(){ return me?me.x:0; },get z(){ return me?me.z:0; }};
let navPending=false;
function dirTo(pl){ document.body.classList.add('dir'); closeResults(); closePanel(); closeLay(); closeCard(); nav.to=pl; dTo.value=pl.name;
  if(!nav.from&&me&&me.on){ nav.from=ME_PL; dFrom.value='Your location'; }
  if(nav.from&&nav.to&&nav.from!==nav.to) runNav(); else setTimeout(()=>dFrom.focus(),40); }
function navFromPl(pl){ document.body.classList.add('dir'); closeResults(); closePanel(); closeCard(); nav.from=pl; dFrom.value=pl.name;
  if(nav.from&&nav.to&&nav.from!==nav.to) runNav(); else setTimeout(()=>dTo.focus(),40); }
// ---- clicking labels and buildings
// what is at a point on the map: the building there (its named place), else the nearest named place within 30 m, else a dropped pin
function placeAtPoint(x,z,b){ let l=null;
  if(b){ if(b.name){ const k=nrm(b.name); l=cardLabels.find(q=>nrm(q.name)===k)||null; }
    if(!l) l=cardLabels.find(q=>Math.abs(q.x-b.cx)<160&&Math.abs(q.z-b.cz)<160&&pip(q.x,q.z,b.outer))||null;
    if(!l&&b.name){ const hm2=b.name.match(/^(Hall \d+)\b/); const nm=hm2?hm2[1]:b.name; l=cardLabels.find(q=>q.name===nm)||{name:nm,x:b.cx,z:b.cz,y:b.H+2,size:Math.sqrt(b.area),cat:b.cat||'civic'}; }
    if(l) return l; }
  let best=null,bd=30; for(const q of cardLabels){ const d=Math.hypot(q.x-x,q.z-z); if(d<bd){ bd=d; best=q; } } if(best) return best;
  for(const a of data.areas){ if(!/^(pitch|sports|park|track|parking|bleachers)/.test(a.t)) continue; const r=a.r[0]; let mx=1e9,Mx=-1e9,mz=1e9,Mz=-1e9; for(let i=0;i<r.length;i+=2){ mx=Math.min(mx,r[i]); Mx=Math.max(Mx,r[i]); mz=Math.min(mz,r[i+1]); Mz=Math.max(Mz,r[i+1]); }
    if(x<mx||x>Mx||z<mz||z>Mz) continue; const ring=toPts(r); if(!pip(x,z,ring)) continue;
    let q2=null,d2=Math.max(Mx-mx,Mz-mz)*0.8; for(const q of cardLabels){ const d=Math.hypot(q.x-x,q.z-z); if(d<d2&&(pip(q.x,q.z,ring)||Math.hypot(q.x-(mx+Mx)/2,q.z-(mz+Mz)/2)<30)){ d2=d; q2=q; } } if(q2) return q2; }
  let nr=null,nd=1e9,ns=1e9; for(const q of cardLabels){ if(q.kind) continue; const d=Math.hypot(q.x-x,q.z-z), sc=d-Math.min(40,(q.size||0)*0.5); if(sc<ns){ ns=sc; nd=d; nr=q; } }
  return {pin:true,x,z,bld:!!b,near:nr,nearD:nd,name:b?(nr&&nd<120?'Building near '+nr.name:'Building'):(nr&&nd<200?'Near '+nr.name:'Dropped pin'),cat:'civic'}; }
const toLL=(x,z)=>[26.5134-z/110540, 80.2347+x/(Math.cos(26.5134*Math.PI/180)*111320)];
const pinMk=(()=>{ const g=new THREE.Group(), m=new THREE.MeshBasicMaterial({color:0xe0262f}); const h=new THREE.Mesh(new THREE.SphereGeometry(2.2,16,12),m); h.position.y=9; const c=new THREE.Mesh(new THREE.ConeGeometry(1.5,7,16),m); c.rotation.x=Math.PI; c.position.y=4.6;
  const d=new THREE.Mesh(new THREE.SphereGeometry(0.9,12,8),new THREE.MeshBasicMaterial({color:0xffffff})); d.position.set(0,9,0); d.scale.setScalar(1); const r=new THREE.Mesh(new THREE.RingGeometry(1.2,2.4,24),new THREE.MeshBasicMaterial({color:0xe0262f,transparent:true,opacity:0.45,side:THREE.DoubleSide,depthWrite:false})); r.rotation.x=-Math.PI/2; r.position.y=0.25;
  g.add(h,c,r); h.add(d); d.position.set(0,0,0); d.scale.setScalar(0.45); g.visible=false; scene.add(g); return g; })();
function showPinCard(pl){ cardPl=pl; pinMk.position.set(pl.x,0,pl.z); pinMk.visible=true; const [la,lo]=toLL(pl.x,pl.z), ll=la.toFixed(5)+', '+lo.toFixed(5), rd=nearestRoad?nearestRoad(pl.x,pl.z,60):null;
  const body=acts(pl,`<button data-act="walk">${IC.walk}Walk here</button>`)+
    kvRows([['Coordinates',`<span style="user-select:all">${ll}</span>`],['Road',rd&&rd.n?esc(rd.n)+(rd.d>4?` <span style="color:var(--ink2)">(${Math.round(rd.d)} m away)</span>`:''):''],
      ['Nearby',pl.near?`${esc(pl.near.name)} <span style="color:var(--ink2)">(${Math.round(pl.nearD)} m)</span>`:''],
      ['Maps',link('https://www.google.com/maps?q='+la.toFixed(6)+','+lo.toFixed(6),'Open in Google Maps')]])+
    `<p class="c-src">Double-tap anywhere on the map to get its location</p>`;
  cardShell(pl.name,`<i style="background:#e0262f"></i>${pl.bld?'Building':'Location'}`,body); setFocus(null); setURL({pin:pl.x.toFixed(1)+','+pl.z.toFixed(1)}); }
const lblByEl=new Map(labels.map(l=>[l.el,l]));
lblRoot.addEventListener('click',e=>{ const el=e.target.closest('.lbl'); if(!el) return; const l=lblByEl.get(el); if(!l||l.kind==='lane'||l.kind==='hn') return;
  if(l.kind==='poi'){ const t={toilets:'toilets',water:'water',bike:'bikepark',atm:'atm',ev:'ev',post:'post'}[l.name]; if(t){ showPlaceCard({name:UT[t][1].replace(/s$/,''),x:l.x,z:l.z,util:t,cat:'civic'}); } return; }
  openPlace(l,false); });
const ray=new THREE.Raycaster(), _ndc=new THREE.Vector2(); let tapD=null, lastTap=null;
const _gp=new THREE.Plane(new THREE.Vector3(0,1,0),0), _gv=new THREE.Vector3();
canvas.addEventListener('pointerdown',e=>{ tapD={x:e.clientX,y:e.clientY,t:performance.now()}; });
canvas.addEventListener('pointerup',e=>{ if(!tapD||wk.on) return; const moved=Math.hypot(e.clientX-tapD.x,e.clientY-tapD.y), dt=performance.now()-tapD.t; tapD=null;
  if(moved>7||dt>450) return;
  _ndc.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1); ray.setFromCamera(_ndc,camera);
  const now2=performance.now();
  if(lastTap&&now2-lastTap.t<320&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<30){ lastTap=null;
    const h2=ray.intersectObjects([walls,roofs],false)[0], gp=h2?_gv.set(h2.point.x,0,h2.point.z):ray.ray.intersectPlane(_gp,_gv);
    if(gp){ const b=h2?(buildingAt(h2.point.x,h2.point.z)||buildingAt(h2.point.x-h2.face.normal.x*.5,h2.point.z-h2.face.normal.z*.5)):buildingAt(gp.x,gp.z);
      const pl=placeAtPoint(gp.x,gp.z,b), tgt=pl.pin?gp.clone():new THREE.Vector3(pl.x,0,pl.z), cd=camera.position.distanceTo(controls.target), nd=THREE.MathUtils.clamp(cd*0.6,controls.minDistance+30,420);
      flyTo(tgt,camera.position.clone().sub(controls.target).normalize().multiplyScalar(nd),650,true); idleT=performance.now();
      if(pl.pin) showPinCard(pl); else openPlace(pl,false); }
    return; }
  lastTap={x:e.clientX,y:e.clientY,t:now2};
  const hit=ray.intersectObjects([walls,roofs],false)[0];
  if(!hit){ closeCard(); closeLay(); return; }
  const b=buildingAt(hit.point.x,hit.point.z)||buildingAt(hit.point.x-hit.face.normal.x*.5,hit.point.z-hit.face.normal.z*.5);
  if(!b){ closeCard(); return; }
  let l=null;
  if(b.name){ const k=nrm(b.name); l=cardLabels.find(q=>nrm(q.name)===k)||null; }
  if(!l) l=cardLabels.find(q=>Math.abs(q.x-b.cx)<160&&Math.abs(q.z-b.cz)<160&&pip(q.x,q.z,b.outer))||null;
  if(!l&&b.name){ const hm2=b.name.match(/^(Hall \d+)\b/); const nm=hm2?hm2[1]:b.name; l=cardLabels.find(q=>q.name===nm)||{name:nm,x:b.cx,z:b.cz,y:b.H+2,size:Math.sqrt(b.area),cat:b.cat||'civic'}; }
  if(!l){ closeCard(); setFocus(null); return; }
  openPlace(l,false); });
