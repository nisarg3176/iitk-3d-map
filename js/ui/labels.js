// Floating name labels: placement, priorities, collision.
/* ---------------- labels ---------------- */
const lblRoot=document.getElementById('labels');
labels.sort((a,b)=>(a.tier-b.tier)||(b.rank-a.rank));
const CATCOL={academic:'#1f8a74',hostel:'#3d6fd6',food:'#e0782f',shop:'#9a5ad1',sports:'#3e9b3a',worship:'#d9a21b',health:'#d64545',civic:'#6b7280'};
const ICONS={
  toilets:['WC','#3d6fd6'], water:['<svg viewBox="0 0 24 24"><path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z" fill="currentColor"/></svg>','#2f8fd0'],
  bike:['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l4-7h5l3 7M10 9l2 7"/></svg>','#3e9b3a'],
  ev:['<svg viewBox="0 0 24 24"><path d="M13 2L5 13h6l-1 9 8-11h-6z" fill="currentColor"/></svg>','#1f8a74'],
  post:['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 7l9 6 9-6"/></svg>','#d0372b'],
  atm:['₹','#9a5ad1'], hydrant:['<svg viewBox="0 0 24 24"><path d="M8 21V9h8v12zM6 9h12M10 5h4v4h-4z" fill="currentColor"/></svg>','#d0372b'],
  bus:['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="5" y="3" width="14" height="15" rx="2"/><path d="M5 11h14M8 21v-3M16 21v-3"/></svg>','#3c6e8f']};
const HEART='<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.3-9.6C1.5 7.9 3.7 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.7 1.2-1.6 2.8-2.7 4.8-2.7 3.5 0 5.7 3.4 4.5 6.9C19.5 16.4 12 21 12 21z" fill="currentColor"/></svg>';
for(const l of labels){ const el=document.createElement('div');
  if(l.kind==='lane'){ el.className='lbl lane'; el.textContent=l.name; l.dy=12; }
  else if(l.kind==='hn'){ el.className='lbl hn'; el.textContent=l.name; l.dy=20; }
  else if(l.kind==='blk'){ el.className='lbl blk'; const i=document.createElement('i'); i.style.background=CATCOL[l.cat]||CATCOL.hostel; el.appendChild(i); el.appendChild(document.createTextNode(l.short)); l.dy=22; }
  else if(l.kind==='poi'){ const ic=ICONS[l.name]; el.className='lbl poi'; el.innerHTML=ic[0]; el.style.background=ic[1]; l.dy=16; }
  else if(l.kind==='feat'){ el.className='lbl feat'; el.innerHTML='<b>'+HEART+'</b>'; el.appendChild(document.createTextNode(l.name)); l.dy=34; }
  else { el.className='lbl t'+l.tier; const i=document.createElement('i'); i.style.background=CATCOL[l.cat]||CATCOL.civic; el.appendChild(i); el.appendChild(document.createTextNode(l.name)); l.dy=34; }
  lblRoot.appendChild(el); l.el=el; l.v=new THREE.Vector3(l.x,l.y,l.z); l.w=0; }
const tmpV=new THREE.Vector3();
let labelsOn=true;
let catFilter=null, focusLbl=null, spotsOn=0, lblCamD=1000, angleLock=false, flat2D=false;
function placeLabel(l,W,H,placed){
  tmpV.copy(l.v).project(camera);
  if(!(tmpV.z<1 && Math.abs(tmpV.x)<1.05 && Math.abs(tmpV.y)<1.05)) return false;
  const x=(tmpV.x*.5+.5)*W, y=(-tmpV.y*.5+.5)*H;
  if(!l.w) l.w=l.el.offsetWidth||l.name.length*7+24;
  const pd=placeLabel.pad||4, r=[x-l.w/2-pd,y-l.dy-pd,x+l.w/2+pd,y-l.dy+28+pd];
  if(placed.some(p=>!(r[2]<p[0]||r[0]>p[2]||r[3]<p[1]||r[1]>p[3]))) return false;
  placed.push(r); l.el.style.transform=`translate(${Math.max(6,Math.min(W-l.w-6,x-l.w/2))|0}px,${(y-l.dy)|0}px)`; return true;
}
function setVis(l,vis){ if(vis!==l.on){ l.el.classList.toggle('show',vis); l.on=vis; if(!vis) setTimeout(()=>{ if(!l.on) l.el.style.transform='translate(-9999px,0)'; },260); } }
function updateLabels(){
  if(!labelsOn) return;
  const W=innerWidth,H=innerHeight, placed=[];
  let shown=0; const cd=lblCamD=camera.position.distanceTo(controls.target), MAX=isCoarse?(cd>900?9:14):(cd>900?18:28), PAD=isCoarse?10:6;
  if(spotsOn){ placeLabel.pad=PAD;
    const act=pins.filter(p=>p.on), R=Math.max(110,Math.min(260,cd*0.16));
    for(const p of act) if(p.vis){ _pp.set(p.u.x,2,p.u.z).project(camera); const x=(_pp.x*.5+.5)*W, y=(-_pp.y*.5+.5)*H; placed.push([x-15,y-15,x+15,y+15]); }
    if(focusLbl){ const ok=placeLabel(focusLbl,W,H,placed); setVis(focusLbl,ok); if(ok) shown++; }
    for(const l of labels){ if(l===focusLbl) continue; let vis=false;
      if(!(l.kind==='lane'||l.kind==='hn'||l.kind==='poi'||l.tier>=4.5||act.some(p=>p.u.lbl===l)) && shown<MAX){
        let near=1e9; for(const p of act){ const d=Math.hypot(p.u.x-l.x,p.u.z-l.z); if(d<near) near=d; }
        if(near<R && (l.kind!=='blk'||cd<520) && placeLabel(l,W,H,placed)){ vis=true; shown++; } }
      setVis(l,vis); }
    return; }
  placeLabel.pad=PAD;
  if(focusLbl){ const ok=placeLabel(focusLbl,W,H,placed); setVis(focusLbl,ok); if(ok) shown++; }
  for(const l of labels){
    if(l===focusLbl) continue;
    let vis=false;
    const d=camera.position.distanceTo(l.v);
    let reach = l.tier===0 ? cd*2.2+700 : l.tier===1 ? Math.min(2600,cd*1.35+250) : l.tier===2 ? 700 + l.rank*3 : l.tier===2.5 ? 900 : l.tier===3 ? 420 : l.tier===3.5 ? (cd<520?480:-1) : l.tier===4.5 ? -1 : 210;
    if(catFilter && l.tier!==0) reach = (l.cat===catFilter && (!l.kind||l.kind==='feat')) ? 1e9 : -1;
    if(wk.on) reach=Math.min(reach, l.tier<=1?1100 : l.tier===2.5?140 : l.tier===3.5?120 : l.tier>=3?70 : 420);
    if(d<reach && shown<MAX && placeLabel(l,W,H,placed)){ vis=true; shown++; }
    setVis(l,vis);
  }
}

