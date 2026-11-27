// Useful spots layers (toilets, water, ATMs…) and "nearest X" searches.
// ---- useful spots (layers)
const UT={lecture:['L','Lecture halls','L','#e0782f'],water:['W','Drinking water',ICONS.water[0],'#2f8fd0'],toilets:['T','Toilets','WC','#3d6fd6'],
  bikepark:['P','Cycle parking','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M8 20V4h5a4 4 0 0 1 0 8H8"/></svg>','#3e9b3a'],
  bikeshop:['R','Cycle repair',ICONS.bike[0],'#2e7d32'],atm:['₹','ATMs & banks','₹','#9a5ad1'],
  print:['Pr','Photocopy','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/></svg>','#5b6b7a'],
  laundry:['La','Laundry','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M8 3l-5 4 3 3 2-1v12h8V9l2 1 3-3-5-4c0 2-1.5 3-4 3S8 5 8 3z"/></svg>','#1f8a74'],
  pharmacy:['+','Pharmacy','<svg viewBox="0 0 24 24"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="currentColor"/></svg>','#d64545'],
  barber:['S','Salons','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8 16L19 4M16 16L5 4"/></svg>','#c2569b'],
  post:['Po','Post office',ICONS.post[0],'#d0372b'],ev:['E','EV charging',ICONS.ev[0],'#1f8a74']};
const utilItems=[];
for(const u of (data.util||[])) if(UT[u.t]) utilItems.push({t:u.t,name:u.n||UT[u.t][1].replace(/s$/,''),x:u.x,z:u.z,named:!!u.n,h:u.h});
for(const l of labels) if(!l.kind&&/^L\d{1,2}$/.test(l.name)) utilItems.push({t:'lecture',name:l.name,x:l.x,z:l.z,named:true,lbl:l});
const layOn=new Set(), layPop=document.getElementById('layPop'), lpGrid=document.getElementById('lpGrid');
const cnt=t=>utilItems.filter(u=>u.t===t).length;
lpGrid.innerHTML=Object.entries(UT).filter(([k])=>cnt(k)).map(([k,u])=>`<button data-l="${k}"><b style="background:${u[3]}">${u[2]}</b>${u[1]}<small>${cnt(k)}</small></button>`).join('');
const layChip=document.createElement('button'); layChip.className='chip lay'; layChip.innerHTML='＋ Useful spots'; chipsEl.appendChild(layChip);
function closeLay(){ layPop.classList.remove('open'); }
layChip.onclick=()=>{ layPop.classList.toggle('open'); closeCard(); };
document.getElementById('lpX').onclick=closeLay;
function setLayer(k,on,fit){ if(on) layOn.add(k); else layOn.delete(k);
  [...lpGrid.children].forEach(b=>b.classList.toggle('on',layOn.has(b.dataset.l))); layChip.classList.toggle('on',layOn.size>0);
  layChip.innerHTML=layOn.size?`＋ Useful spots · ${layOn.size}`:'＋ Useful spots';
  for(const p of pins){ p.on=layOn.has(p.u.t); if(!p.on) p.el.classList.remove('hot'); }
  spotsOn=layOn.size; renderSpotList();
  if(on&&fit){ const its=utilItems.filter(u=>u.t===k); let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9; for(const p of its){ x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);z0=Math.min(z0,p.z);z1=Math.max(z1,p.z); }
    const ext=Math.max(x1-x0,z1-z0); flyTo(new THREE.Vector3((x0+x1)/2,0,(z0+z1)/2),HOME_OFF.clone().normalize().multiplyScalar(THREE.MathUtils.clamp(ext*1.2+200,300,2200)*(innerWidth<innerHeight?1.35:1)),1500); idleT=performance.now(); }
  kick(); }
lpGrid.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; setLayer(b.dataset.l,!layOn.has(b.dataset.l),true); });
const pins=utilItems.map(u=>{ const el=document.createElement('div'); el.className='upin'+(u.named&&u.t!=='lecture'?'':' bare');
  el.innerHTML=`<b style="background:${UT[u.t][3]}">${u.t==='lecture'?esc(u.name):UT[u.t][2]}</b>${u.named&&u.t!=='lecture'?`<span>${esc(u.name)}</span>`:''}`; if(u.t==='lecture') el.querySelector('b').style.width='auto',el.querySelector('b').style.padding='0 6px',el.querySelector('b').style.borderRadius='10px';
  lblRoot.appendChild(el); const p={u,el,on:false}; el.addEventListener('click',()=>pinClick(p)); return p; });
const lpList=document.getElementById('lpList'); let spotRows=[];
function nearName(u){ if(u._nn) return u._nn; let best=null,bd=1e9; for(const l of cardLabels){ if(l.kind||l.tier>2.5||/^L\d/.test(l.name)) continue; const d=Math.hypot(l.x-u.x,l.z-u.z); if(d<bd){bd=d;best=l;} } return u._nn=best?best.name:'campus'; }
function renderSpotList(){ if(!layOn.size){ lpList.classList.remove('has'); lpList.innerHTML=''; return; }
  const ref=me&&me.on?me:controls.target; const its=utilItems.filter(u=>layOn.has(u.t)).map(u=>({u,d:Math.hypot(u.x-ref.x,u.z-ref.z)})).sort((a,b)=>a.d-b.d);
  spotRows=its.map(o=>o.u);
  lpList.innerHTML=`<div class="lh">${its.length} spot${its.length>1?'s':''} · nearest to ${me&&me.on?'you':'map centre'} first</div>`+its.map((o,i)=>`<button class="li" data-i="${i}"><b style="background:${UT[o.u.t][3]}">${o.u.t==='lecture'?'L':UT[o.u.t][2]}</b><span>${esc(o.u.name)}${o.u.named?'':`<em> · near ${esc(nearName(o.u))}</em>`}</span><small>${fmtD(o.d)}</small></button>`).join('');
  lpList.classList.add('has'); }
lpList.addEventListener('click',e=>{ const b=e.target.closest('.li'); if(!b) return; const u=spotRows[+b.dataset.i]; if(!u) return;
  const p=pins.find(q=>q.u===u); pins.forEach(q=>q.el.classList.toggle('hot',q===p));
  flyTo(new THREE.Vector3(u.x,0,u.z),HOME_OFF.clone().normalize().multiplyScalar(320),1300); idleT=performance.now();
  if(innerWidth<760) closeLay(); if(p) pinClick(p); kick(); });
function pinClick(p){ const u=p.u; if(u.lbl){ openPlace(u.lbl,false); return; }
  const l=u.named&&cardLabels.find(q=>nrm(q.name)===nrm(u.name)&&Math.hypot(q.x-u.x,q.z-u.z)<120);
  if(l){ openPlace(l,false); return; }
  const pl={name:u.name,x:u.x,z:u.z,util:u.t,cat:'civic'}; if(u.h) INFO.set(nrm(u.name),{n:u.name,x:u.x,z:u.z,h:u.h}); showPlaceCard(pl); }
const _pp=new THREE.Vector3();
function stepPins(){ const W=innerWidth,H=innerHeight, showTxt=camDist<1100;
  for(const p of pins){ if(!p.on){ if(p.vis){ p.el.style.display='none'; p.vis=false; } continue; }
    _pp.set(p.u.x,2,p.u.z).project(camera); if(_pp.z>1||Math.abs(_pp.x)>1.1||Math.abs(_pp.y)>1.1){ if(p.vis){ p.el.style.display='none'; p.vis=false; } continue; }
    if(!p.vis){ p.el.style.display='flex'; p.vis=true; }
    const sp=p.el.querySelector('span'); if(sp) sp.style.display=showTxt?'':'none';
    p.el.style.transform=`translate(${((_pp.x*.5+.5)*W-13)|0}px,${((-_pp.y*.5+.5)*H-13)|0}px)`; }
  if(me){ _pp.set(me.x,1,me.z).project(camera); const ok=me.on&&_pp.z<1&&Math.abs(_pp.x)<1.1&&Math.abs(_pp.y)<1.1; meEl.style.display=ok?'block':'none';
    if(ok) meEl.style.transform=`translate(${((_pp.x*.5+.5)*W)|0}px,${((-_pp.y*.5+.5)*H)|0}px)`; } }
// "nearest X" search intents
const INTENTS=[[/^(water|drinking|cooler|water cooler)/,'water'],[/^(toilet|washroom|restroom|wc|bathroom|loo)/,'toilets'],[/^(atm|bank|cash)/,'atm'],
  [/^(print|photocopy|xerox|copy shop)/,'print'],[/^(laundry|dhobi|dry clean|washing)/,'laundry'],[/^(cycle repair|bike repair|puncture|cycle shop|bicycle)/,'bikeshop'],
  [/^(cycle stand|cycle parking|bike parking|parking)/,'bikepark'],[/^(pharmacy|medicine|chemist|medical store)/,'pharmacy'],[/^(salon|barber|haircut|hair)/,'barber'],
  [/^(lecture hall|lecture|lh\b|classroom)/,'lecture'],[/^(post office|post)/,'post'],[/^(ev|charging)/,'ev']];
function intentsFor(raw){ const q=raw.toLowerCase().trim(); if(q.length<2) return [];
  const out=[]; for(const [re,k] of INTENTS){ if(!cnt(k)) continue; const words=re.source.replace(/^\^\(|\)$/g,'').split('|').map(w=>w.replace(/\\b/g,''));
    if(re.test(q)||(q.length>=3&&words.some(w=>w.startsWith(q)))){ if(!out.some(o=>o.special===k)) out.push({special:k,l:{name:(k==='lecture'?'All lecture halls':'Nearest '+UT[k][1].toLowerCase()),col:UT[k][3],kind:'special',tier:0,rank:0},type:cnt(k)+' on map'}); } }
  return out.slice(0,2); }
function pickSpecial(it){ const k=it.special; closeResults(); sq.blur(); sq.value=''; sclear.style.display='none';
  setLayer(k,true,k==='lecture'); if(k==='lecture'){ showHint('Showing all lecture halls, tap one for details',4000); return; }
  const ref=me&&me.on?me:controls.target; let best=null,bd=1e9; for(const u of utilItems) if(u.t===k){ const d=Math.hypot(u.x-ref.x,u.z-ref.z); if(d<bd){bd=d;best=u;} }
  if(!best) return; const p=pins.find(q=>q.u===best); flyTo(new THREE.Vector3(best.x,0,best.z),HOME_OFF.clone().normalize().multiplyScalar(300),1500); idleT=performance.now();
  pinClick(p); showHint(`Nearest ${UT[k][1].toLowerCase()} to ${me&&me.on?'you':'the map centre'}, ${fmtD(bd)} away. All ${cnt(k)} are marked.`,5000); }
