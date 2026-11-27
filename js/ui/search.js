// Search box, results, focus marker, category chips.
/* ================= SEARCH + CATEGORY FILTERS ================= */
const nrm=s=>(s||'').toLowerCase().replace(/\b(iit ?k(anpur)?|dept\.?( of)?|department( of)?|the|of|and)\b/g,' ').replace(/[^a-z0-9]+/g,' ').trim();
const SYN={hospital:'health',doctor:'health',medical:'health',hostel:'hall',mess:'hall',library:'kelkar',lib:'kelkar',cc:'computer centre',temple:'temple',canteen:'canteen',food:'canteen',coffee:'cafe',gym:'sports',pool:'swimming',lhc:'lecture hall',counselling:'cmhw',counseling:'cmhw',counsel:'cmhw',bank:'bank',atm:'atm',airstrip:'airstrip',oat:'open air theatre'};
const searchItems=[]; { const seen=new Set();
  for(const l of labels){ if(l.kind&&l.kind!=='feat'&&l.kind!=='lane'&&l.kind!=='blk') continue; const k=l.name.toLowerCase(); if(seen.has(k)) continue; seen.add(k);
    const keys=[l.name,...(l.alt||[])].map(nrm).filter(Boolean);
    const acr=nrm(l.name).split(' ').filter(w=>w.length>1||/\d/.test(w)).map(w=>/^\d+$/.test(w)?w:w[0]).join('');
    searchItems.push({l,keys,acr,type:l.name==='CMHW'?'Mental health & wellbeing':l.kind==='lane'?'Road':({academic:'Academic',hostel:'Hostel',food:'Food',shop:'Shop',sports:'Sports',worship:'Worship',health:'Health',civic:'Place'})[l.cat]||'Place'}); } }
function searchScore(it,q,qc){ let best=0;
  for(const k of it.keys){ const kc=k.replace(/ /g,'');
    if(k===q) best=Math.max(best,100); else if(k.startsWith(q)) best=Math.max(best,85); else if((' '+k).includes(' '+q)) best=Math.max(best,70);
    else if(kc.includes(qc)) best=Math.max(best,qc.length>2?50:0); }
  if(qc.length>=2 && it.acr===qc) best=Math.max(best,78); else if(qc.length>=2&&it.acr.startsWith(qc)) best=Math.max(best,45);
  if(best) best+=Math.min(8,(it.l.rank||0)/25)-(it.l.kind==='lane'?6:it.l.kind==='person'?12:0)+(it.l.tier<=1?6:0); return best; }
const sq=document.getElementById('sq'), resEl=document.getElementById('results'), sclear=document.getElementById('sclear');
let resList=[], resSel=0;
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'})[c]);
function renderResults(){
  const raw=sq.value.trim(); sclear.style.display=raw?'block':'none';
  if(!raw){ closeResults(); return; }
  let q=nrm(raw); for(const [a,b] of Object.entries(SYN)) if(q===a) q=b;
  const qc=q.replace(/ /g,'');
  resList=[...intentsFor(raw),...searchItems.map(it=>[searchScore(it,q,qc),it]).filter(x=>x[0]>0).sort((a,b)=>b[0]-a[0]).map(x=>x[1])].slice(0,8); resSel=0;
  if(!resList.length){ resEl.innerHTML='<div class="nores">No places match “'+esc(raw)+'”</div>'; resEl.classList.add('open'); return; }
  const re=new RegExp('('+raw.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','i');
  resEl.innerHTML=resList.map((it,i)=>`<div class="res${i===0?' sel':''}" data-i="${i}"><i style="background:${it.l.col||(it.l.kind==='lane'?'#8b8f96':it.l.kind==='feat'?'#e0262f':CATCOL[it.l.cat]||CATCOL.civic)}"></i><span>${esc(it.l.name).replace(re,'<b>$1</b>')}</span><small>${esc(it.type)}</small></div>`).join('');
  resEl.classList.add('open');
}
function closeResults(){ resEl.classList.remove('open'); }
function hiliteSel(){ [...resEl.children].forEach((c,i)=>c.classList.toggle('sel',i===resSel)); }
sq.addEventListener('input',renderResults);
sq.addEventListener('focus',()=>{ if(sq.value.trim()) renderResults(); closePanel(); });
sq.addEventListener('keydown',e=>{ if(e.key==='ArrowDown'){ resSel=Math.min(resList.length-1,resSel+1); hiliteSel(); e.preventDefault(); }
  else if(e.key==='ArrowUp'){ resSel=Math.max(0,resSel-1); hiliteSel(); e.preventDefault(); }
  else if(e.key==='Enter'&&resList[resSel]){ pick(resList[resSel]); }
  else if(e.key==='Tab'&&!e.shiftKey&&resList[resSel]&&!resList[resSel].special){ e.preventDefault(); const it=resList[resSel], tl=it.person?it.person.bl:it.l; closeResults(); sq.blur(); if(tl) dirTo(tl); }
  else if(e.key==='Escape'){ closeResults(); sq.blur(); } });
resEl.addEventListener('pointerdown',e=>{ const r=e.target.closest('.res'); if(r){ e.preventDefault(); pick(resList[+r.dataset.i]); } });
sclear.onclick=()=>{ sq.value=''; closeResults(); sclear.style.display='none'; setFocus(null); closeCard(); setURL(null); };
// focus marker
const mkMat=new THREE.MeshBasicMaterial({color:0xffc531,transparent:true,opacity:.9,depthWrite:false,side:THREE.DoubleSide});
const marker=new THREE.Group();
{ const r=new THREE.Mesh(new THREE.RingGeometry(.86,1,64),mkMat); r.rotation.x=-Math.PI/2; r.renderOrder=14; marker.add(r);
  const r2=new THREE.Mesh(new THREE.RingGeometry(.4,.46,48),mkMat); r2.rotation.x=-Math.PI/2; r2.renderOrder=14; marker.add(r2);
  const bm=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1,12,1,true),new THREE.MeshBasicMaterial({color:0xffc531,transparent:true,opacity:.35,depthWrite:false,fog:false})); bm.position.y=.5; bm.renderOrder=14; marker.add(bm); marker.userData.beam=bm; }
marker.visible=false; scene.add(marker);
function setFocus(l){ focusLbl=l; marker.visible=!!l; if(l){ const s=Math.max(14,Math.min(60,(l.size||20)*.75)); marker.position.set(l.x,.55,l.z); marker.userData.s=s; marker.userData.beam.scale.set(s*.6,l.y+40,s*.6); marker.userData.t0=performance.now(); } kick(); }
function pick(it){ if(it.special) return pickSpecial(it); if(it.person) return pickPerson(it); const l=it.l; sq.value=l.name; closeResults(); sq.blur(); sclear.style.display='block';
  if(wk.on) exitWalk(true);
  if(catFilter && l.cat!==catFilter) setCat('all');
  setFocus(l);
  const dist=l.kind==='lane'?420:THREE.MathUtils.clamp((l.size||30)*3.2+170,220,620);
  const off=HOME_OFF.clone().normalize().multiplyScalar(dist);
  flyTo(new THREE.Vector3(l.x,0,l.z),off,1900); idleT=performance.now();
  if(l.kind!=='lane'){ showPlaceCard(l); setURL({place:l.name}); } else closeCard();
}
// category chips
const CHIPS=[['all','All'],['academic','Academic'],['hostel','Hostels'],['food','Food'],['shop','Shops'],['sports','Sports'],['health','Health'],['worship','Worship']];
const chipsEl=document.getElementById('chips');
chipsEl.innerHTML=CHIPS.map(([k,n])=>`<button class="chip${k==='all'?' on':''}" data-c="${k}">${k==='all'?'':`<i style="background:${CATCOL[k]}"></i>`}${n}</button>`).join('');
let catAnim=null;
function setCat(c,doFly=true){
  catFilter=c==='all'?null:c; [...chipsEl.children].forEach(b=>b.classList.toggle('on',b.dataset.c===c));
  if(catFilter){ CATU.uCat.value=CATS.indexOf(catFilter); CATU.uCatCol.value.set(CATCOL[catFilter]); }
  catAnim={from:CATU.uCatAmt.value,to:catFilter?1:0,t0:performance.now()};
  if(catFilter&&doFly){ const pts=labels.filter(l=>!l.kind&&l.cat===catFilter);
    if(pts.length){ let mnx=1e9,mxx=-1e9,mnz=1e9,mxz=-1e9; for(const l of pts){ mnx=Math.min(mnx,l.x);mxx=Math.max(mxx,l.x);mnz=Math.min(mnz,l.z);mxz=Math.max(mxz,l.z); }
      const span=Math.max(mxx-mnx,mxz-mnz); const T=new THREE.Vector3((mnx+mxx)/2,0,(mnz+mxz)/2);
      if(wk.on) exitWalk(true);
      flyTo(T,HOME_OFF.clone().normalize().multiplyScalar(THREE.MathUtils.clamp(span*1.25+350,450,2900)),1800); } }
  kick();
}
chipsEl.addEventListener('click',e=>{ const b=e.target.closest('.chip'); if(!b) return; const c=b.dataset.c; setCat(c===catFilter?'all':c); });

