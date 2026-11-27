// Map data (campus.json) and fixes on load: renamed places, Hall 12/13 layouts, which buildings get which style (from data/styles.json).
/* ---------------- build world ---------------- */
const data=CAMPUS;
data.places=data.places.filter(p=>p.n!=='Wazwan Foods'&&p.n!=='Chocolate Room');
// Counselling Service is now CMHW (Center for Mental Health and Wellbeing)
for(const b of data.buildings||[]) if(b.n==='Counselling Service'){ b.n='CMHW'; b.fn='Center for Mental Health and Wellbeing'; b.alt=['Center for Mental Health and Wellbeing','Counselling Service','Mental health centre','Wellbeing centre']; }
for(const r of data.info||[]) if(r.n==='Counselling Service') r.n='CMHW';
// Hall 13 (own layout); Hall 12 keeps its solar + facade style
{ const SRC={'Hall 12 Mess':1,'Hall 12 Block E':0,'Hall 12 Block C':1,'Hall 12 Block F':0,'Hall 12 Block D':0,'Hall 12 Block B':0,'Hall 12 Block A':0,'Hall12 Canteen':0}, AX=-773, DZ=60;
  // Hall 13: laid out from aerial imagery (6 blocks in two columns, mess + canteen, open corridor bridges between rows)
  const H13D={"b":{"Hall 13 Block F":{"r":[-866.4,272.7,-830.9,272.7,-830.9,285.5,-866.4,285.5],"l":6},"Hall 13 Block E":{"r":[-867.3,303.4,-830.9,303.4,-830.9,316.2,-867.3,316.2],"l":6},"Hall 13 Block D":{"r":[-826.5,303.4,-787.4,303.4,-787.4,314.8,-826.5,314.8],"l":6},"Hall 13 Block C":{"r":[-867.3,334.1,-830.9,334.1,-830.9,347.3,-867.3,347.3],"l":6},"Hall 13 Block B":{"r":[-826.0,334.1,-786.6,334.1,-786.6,347.3,-826.0,347.3],"l":6},"Hall 13 Block A":{"r":[-867.3,365.7,-831.7,365.7,-831.7,378.0,-867.3,378.0],"l":6},"Hall 13 Mess":{"r":[-813.9,249.2,-791.0,249.2,-791.0,290.4,-813.9,290.4],"l":2},"Hall 13 Canteen":{"r":[-816.6,364.1,-804.3,364.1,-804.3,378.1,-816.6,378.1],"l":2},"_mess_kitchen":{"r":[-812.2,241.5,-791.6,241.5,-791.6,248.5,-812.2,248.5],"l":1},"_mess_annex":{"r":[-823.1,274.6,-813.9,274.6,-813.9,283.4,-823.1,283.4],"l":2}},"c":[[-830.4,-826.4,285.0,366.2,4,"b"],[-830.9,-823.1,278.0,282.0,2,"b"],[-886.0,-862.8,285.5,303.4,1,"c",-866.7,-862.8],[-886.0,-862.3,347.3,365.7,1,"c",-865.8,-862.3],[-790.8,-771.0,314.8,334.1,1,"c",-790.8,-787.3]]};
  for(const [n,v] of Object.entries(H13D.b)){ const named=!n.startsWith('_'); data.buildings.push({r:[v.r],t:/Block/.test(n)?'residential':'yes',l:v.l,...(named?{n,fn:n}:{}),s:'n',hx:1,sty:'h13',sol:(n==='Hall 13 Block B'||n==='Hall 13 Mess')?1:0}); }
  window.__h13cor=H13D.c.slice();
  for(const w of data.walks||[]) window.__h13cor.push(w);  // ground-floor covered walkways between hall blocks
  for(const l of data.links||[]){ const q=l.q, x0=Math.min(q[0],q[2]), x1=Math.max(q[0],q[2]), z0=Math.min(q[1],q[5]), z1=Math.max(q[1],q[5]);  // hall corridors fitted face to face
    window.__h13cor.push([x0,x1,z0,z1,1,'r',l.s, Math.max(x1-x0,z1-z0)>40?3.5:3.3]); }
  // Hall 12: mirror image of Hall 13 (same layout, flipped east-west), fitted onto Hall 12's site
  { const TX=-1538.0, TZ=-67.2, NM={'Hall 13 Block F':'Hall 12 Block F','Hall 13 Block E':'Hall 12 Block D','Hall 13 Block D':'Hall 12 Block E','Hall 13 Block C':'Hall 12 Block B','Hall 13 Block B':'Hall 12 Block C','Hall 13 Block A':'Hall 12 Block A','Hall 13 Mess':'Hall 12 Mess','Hall 13 Canteen':'Hall12 Canteen'};
    const canteenPart=b=>{ if(b.n) return false; const q=b.r[0]; let x=0,z=0; for(let i=0;i<q.length;i+=2){x+=q[i];z+=q[i+1];} x/=q.length/2; z/=q.length/2; return x>-756&&x<-734&&z>286&&z<302; };
    const keep=new Map(); for(let k=data.buildings.length-1;k>=0;k--){ const b=data.buildings[k]; if(b.fn in SRC||canteenPart(b)){ if(b.fn) keep.set(b.fn,b); data.buildings.splice(k,1); } }
    const mir=r=>{ const o=[]; for(let k=r.length-2;k>=0;k-=2) o.push(+(TX-r[k]).toFixed(1),+(r[k+1]+TZ).toFixed(1)); return o; };
    for(const [n,v] of Object.entries(H13D.b)){ const nm=NM[n], ob=nm&&keep.get(nm);
      if(n==='_mess_kitchen') continue; if(n==='Hall 13 Mess'&&ob){ data.buildings.push({...ob,sty:'h13',sol:1}); continue; }  // Hall 12's mess sits further south (road behind it): keep its own outline
      const rr=n==='_mess_annex'?[-728.4,207.4,-714.9,207.4,-714.9,216.2,-728.4,216.2]:mir(v.r);
      data.buildings.push({...(ob||{}),r:[rr],t:/Block/.test(n)?'residential':'yes',l:v.l,...(nm?{n:nm,fn:nm}:{}),s:'n',sty:'h13',sol:nm&&nm in SRC?SRC[nm]:0}); }
    for(const [x0,x1,z0,z1,lv,kind,g0,g1] of H13D.c) window.__h13cor.push([+(TX-x1).toFixed(1),+(TX-x0).toFixed(1),z0+TZ,z1+TZ,lv,kind,...(kind==='c'?[+(TX-g1).toFixed(1),+(TX-g0).toFixed(1)]:[])]); }
  for(const b of data.buildings) if(b.fn in SRC||/^Hall ?12/.test(b.n||'')){ if(b.fn in SRC) b.sol=SRC[b.fn]; b.sty='h13'; } }
// names people use, styles and hand-made models by building name: all listed in data/styles.json
for(const b of data.buildings){ const n=b.n||'';
  if(STYLES.alt[n]) b.alt=[...STYLES.alt[n],...(b.alt||[])];
  if(STYLES.byName[n]) b.sty=STYLES.byName[n]; for(const [re,s] of STYLES.byPattern) if(new RegExp(re).test(n)) b.sty=s;
  if(STYLES.custom[n]) b.cust=STYLES.custom[n]; for(const [re,c] of STYLES.customPattern) if(new RegExp(re).test(n)) b.cust=c;
  // rules that need the building's position (unnamed buildings)
  if(!b.n&&b.x4&&b.t==='retail'){ const r=b.r[0]; let x=0,z=0; for(let i=0;i<r.length;i+=2){x+=r[i];z+=r[i+1];} x/=r.length/2; z/=r.length/2; if(Math.hypot(x+434,z-130)<3) b.cust='mt'; if(Math.hypot(x+726.15,z-838)<3) b.cust='mm'; }
  if(!b.n||b.n==='Old Sports Complex Gym'){ const r=b.r[0]; let x=0,z=0; for(let i=0;i<r.length;i+=2){x+=r[i];z+=r[i+1];} x/=r.length/2; z/=r.length/2;
    if(!b.n&&Math.hypot(x+524,z-951)<6) b.sty='sacst';                                   // the SAC block behind the OAT stage
    if(!b.sty&&!/dormitory/.test(b.t||'')&&Math.hypot(x+321,z-558)<60) b.sty='hall3'; }   // old sports complex: Hall 3 colours
}
// hall blocks get their hall's look (blocks named after another hall are left alone)
{ const HS=STYLES.hallStyles;
  for(const p of data.places){ const st=HS[p.n]; if(!st) continue; const Rr=Math.sqrt((p.a||8000)/Math.PI);
    for(const b of data.buildings){ if(b.sty||b.cust) continue; const own=(b.n||'').startsWith(p.n+' ');
      if(b.n&&!own) continue; if(!own&&!/dormitory/.test(b.t||'')) continue; if(own&&!/block/i.test(b.n)) continue;
      const r=b.r[0]; let x=0,z=0; for(let i=0;i<r.length;i+=2){x+=r[i];z+=r[i+1];} x/=r.length/2; z/=r.length/2;
      if(own||Math.hypot(x-p.x,z-p.z)<Rr){ b.sty=st; b.hall=p.n; } } }
  for(const b of data.buildings){ if(b.sty||b.cust) continue; const r=b.r[0]; let x=0,z=0; for(let i=0;i<r.length;i+=2){x+=r[i];z+=r[i+1];} x/=r.length/2; z/=r.length/2;
    if(b.n==='Hall 1 Mess'||(!b.n&&Math.hypot(x+313,z-431)<8)) b.sty='hall1m'; } }
lmsg.textContent='Raising the buildings…'; await tick();

