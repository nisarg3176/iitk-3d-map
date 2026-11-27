// Professors directory (people.json).
// ---- professors (IIT Kanpur faculty directory)
const PEOPLE_AT=new Map(); let peopleMeta=null, peopleReady=false;
function lblByName(n){ if(!n) return null; const k=nrm(n); return cardLabels.find(l=>nrm(l.name)===k)||cardLabels.find(l=>(l.alt||[]).some(a=>nrm(a)===k))||null; }
fetch('people.json?v=20261122').then(r=>r.json()).then(js=>{ peopleMeta=js;
  for(const p of js.items){ const bl=lblByName(p.b); p.bl=bl;
    if(bl){ if(!PEOPLE_AT.has(bl)) PEOPLE_AT.set(bl,[]); PEOPLE_AT.get(bl).push(p); }
    const nm=p.n.replace(/^(Prof\.?|Dr\.?)\s+/i,'');
    searchItems.push({person:p,l:{name:p.n,kind:'person',tier:5,rank:0,col:'#7c5cff',x:bl?bl.x:0,z:bl?bl.z:0},keys:[nrm(nm),nrm(nm.split(' ').slice(-1)[0])].filter(Boolean),acr:'',type:(p.d||'Faculty').replace(/^Department of /,'').slice(0,26)}); }
  for(const arr of PEOPLE_AT.values()) arr.sort((a,b)=>a.n.localeCompare(b.n));
  peopleReady=true; applyURL(true); if(document.activeElement===sq&&sq.value.trim()) renderResults(); }).catch(()=>{});
function pickPerson(it){ const p=it.person; sq.value=p.n; closeResults(); sq.blur(); sclear.style.display='block';
  if(wk.on) exitWalk(true); if(p.bl){ setFocus(p.bl); flyToPl(p.bl); } showPersonCard(p); setURL({place:p.n}); }
