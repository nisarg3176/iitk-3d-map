// Hostels: hall facades and name boards, Hall 12/13 entrances, hall corridors and cycle stands, night lights on the halls, Visitor Hostel.
// ---- Hall 1: red brick with white balconies;  Hall 3: white frame with light-blue tile panels;  Hall 10 / 11: light beige with a slim roof pergola
for(const o of decos){ if(o.st!==STY.hall1&&o.st!==STY.hall3&&o.st!==STY.hall10) continue; const es=edges(o.outer), fl=Math.max(1,Math.round((o.H-0.7)/3.3));
  if(o.st===STY.hall1){ for(const e of es.filter(q=>q.L>14)) { const n=Math.max(1,Math.round(e.L/7.2)); for(let f=1;f<fl;f++) for(let k=0;k<n;k++) bx(e,(k+0.5)*e.L/n,0.65,2.6,1.3,f*3.3-0.15,1.15,C('#f1eee8')); } }
  else if(o.st===STY.hall3){ const bl=C('#b6cad9'); for(const e of es) if(e.L>4){ const n=Math.max(1,Math.round(e.L/4.2)); for(let f=0;f<fl;f++) for(let k=0;k<n;k++){ const t=(k+0.5)*e.L/n, hw=e.L/n/2-0.35; cl(e,t-hw,t+hw,f*3.3+0.25,f*3.3+1.05,bl,0.08); } } }
  else { const lt=C('#ece2cf'); for(const e of es.filter(q=>q.L>16).sort((p,q)=>q.L-p.L).slice(0,2)){ const n=Math.max(2,Math.round(e.L/9.2)); for(let k=0;k<=n;k++) bx(e,e.L*k/n,0.3,0.35,0.35,o.H-0.7,2.0,lt); band(e,o.H+1.1,0.22,0.3,0.35,lt); band(e,o.H+1.1,0.22,1.4,0.22,lt); } } }

{ const h3=BN(/^Hall 3 Block 1$/); if(h3){ const cv=txt(['छात्रावास III             HOSTEL III'],null,'#22303c','bold 62px sans-serif',1024,100); for(const e of edges(h3.outer).sort((p,q)=>q.L-p.L).slice(0,2)) signOn(e,e.L*0.32,3.95,15,1.4,cv,0.56); } }

// ---- Hall 12 and Hall 13 entrances: the block joining the canteen to Block A, with the big cream portal and the name board facing the road (south)
const hallEntrance=(cRe,aRe,roman)=>{ const cb=BN(cRe), ab=BN(aRe); if(!(cb&&ab)) return; const bb=o=>{ let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9; for(const [x,z] of o){ x0=Math.min(x0,x);x1=Math.max(x1,x);z0=Math.min(z0,z);z1=Math.max(z1,z);} return {x0,x1,z0,z1}; };
  const A=bb(ab.outer), Cb=bb(cb.outer), west=A.x1<Cb.x0, xa=west?A.x1:Cb.x1, xb=west?Cb.x0:A.x0, za=Math.max(A.z0,Cb.z0)+5, zb=Math.min(A.z1,Cb.z1);
  if(xb-xa>4&&zb-za>4){ const wall=C('#9f4934'), cr=C('#efc9a4'), H=10.6, mx=(xa+xb)/2, wd=xb-xa, mz=(za+zb)/2;
    box(dg,mx,mz,wd,zb-za,0,H,0,wall); box(dg,mx,mz,wd+0.3,zb-za+0.3,H,0.35,0,C('#aaa69e'));
    for(let k=0;k<=Math.round(wd/4.3);k++){ const x=xa+wd*k/Math.round(wd/4.3); box(dg,x,zb+0.2,0.55,0.5,0,H+0.2,0,cr); }
    for(const y of [3.3,6.6]) box(dg,mx,zb+0.2,wd,0.45,y-0.15,0.35,0,cr);
    for(const y of [3.3,6.6]) for(let k=0;k<Math.round(wd/4.3);k++){ const x0=xa+wd*k/Math.round(wd/4.3)+0.7, x1=xa+wd*(k+1)/Math.round(wd/4.3)-0.7; quad(paneL,[x0,zb+0.08],[x1,zb+0.08],y+0.9,y+2.5,GLs); }
    for(const s of [-1,1]) box(dg,mx+s*(wd/2-3),zb+0.12,3.2,0.2,0.5,H-1,0,C('#d98f6c'));
    quad(paneL,[mx-3.6,zb+0.1],[mx+3.6,zb+0.1],0.2,3.6,GLb); box(dg,mx,zb+0.12,7.6,0.2,3.6,0.4,0,C('#b4553a'));
    for(const s of [-5.3,5.3]) box(dg,mx+s,zb+2.7,1.4,1.4,0,8.4,0,cr);
    box(dg,mx,zb+2.7,12.6,5.8,8.2,1.0,0,cr); for(const s of [-4.5,-2.25,0,2.25,4.5]) box(dg,mx+s,zb+2.7,0.35,5.8,9.2,0.8,0,cr); box(dg,mx,zb+2.4,10,4.8,3.9,0.3,0,cr);
    plane(mx,8.7,zb+5.62,0,10.4,0.95,hallSign(roman),0.5);
    for(const s of [-1,1]){ box(dg,mx+s*7.5,zb+7,6,2,0,0.45,0,C('#8a5a3a')); box(dg,mx+s*7.5,zb+7,5.6,1.6,0.45,0.25,0,C('#4f8a3c')); for(let k=0;k<6;k++) pot(mx+s*(4.2+k*0.65),zb+5.6); }
    markOcc(mx,zb+3,7); } };

hallEntrance(/^Hall 13 Canteen$/,/^Hall 13 Block A$/,'XIII'); hallEntrance(/^Hall ?12 Canteen$/,/^Hall 12 Block A$/,'XII');

// ---- Hall 13: corridors (walkway on the ground and each level up to the given level, slatted roof) and cycle stands (ground floor only, roof with one grilled strip)
for(const [x0,x1,z0,z1,lv,kind,g0,g1] of (window.__h13cor||[])){ const cr=C('#efc9a4'), sl=C('#aaa69e'), mx=(x0+x1)/2, mz=(z0+z1)/2, w=x1-x0, d=z1-z0;
  if(kind==='r'){ // plain covered corridor: solid flat concrete roof like the blocks, pillars, paved floor
    const SS=STY[g0]||STY.hallB, wc=C(SS.wall), H=g1||3.4, pc=wc, rf=C('#aaa69e').lerp(wc,0.12), fa=wc.clone().multiplyScalar(0.8), ex=w>d, L=ex?w:d, Wd=ex?d:w, n=Math.max(1,Math.round(L/3.6));
    box(dg,mx,mz,w,d,0,0.12,0,C('#b9b3a8')); box(dg,mx,mz,w+0.3,d+0.3,H,0.3,0,rf);
    if(ex){ for(const z of [z0,z1]) box(dg,mx,z,w+0.3,0.18,H-0.25,0.55,0,fa); } else { for(const x of [x0,x1]) box(dg,x,mz,0.18,d+0.3,H-0.25,0.55,0,fa); }
    for(let i=0;i<=n;i++){ const a=-L/2+0.25+(L-0.5)*i/n; for(const s of [-1,1]){ const o=s*(Wd/2-0.25); ex?box(dg,mx+a,mz+o,0.35,0.35,0,H,0,pc):box(dg,mx+o,mz+a,0.35,0.35,0,H,0,pc); } }
    for(let a=-L/2+2;a<L/2-1;a+=4.5) ex?box(glowS,mx+a,mz,0.9,0.18,H-0.06,0.05,0,C('#fff1d6')):box(glowS,mx,mz+a,0.18,0.9,H-0.06,0.05,0,C('#fff1d6'));
    box(glowF,mx,mz,w-0.6,d-0.6,0.13,0.01,0,C('#b9b3a8'));
    for(let a=-L/2+2;a<L/2;a+=3) markOcc(ex?mx+a:mx,ex?mz:mz+a,Math.max(2.5,Wd/2+1)); continue; }
  if(kind==='c'){ const H=3.2, nx=Math.max(2,Math.round(w/3)), nz=Math.max(2,Math.round(d/3.2));
    for(let i=0;i<=nx;i++) for(const z of [z0+0.2,z1-0.2]) box(dg,x0+0.2+(w-0.4)*i/nx,z,0.3,0.3,0,H,0,cr);
    for(let i=1;i<nz;i++) for(const x of [x0+0.2,x1-0.2]) box(dg,x,z0+d*i/nz,0.3,0.3,0,H,0,cr);
    const r0=Math.min(g0,g1), r1=Math.max(g0,g1); for(const [a,b] of [[x0,r0],[r1,x1]]) if(b-a>0.3) box(dg,(a+b)/2,mz,b-a,d,H,0.22,0,sl);
    for(const z of [z0,z1]) box(dg,(r0+r1)/2,z,r1-r0,0.3,H-0.05,0.3,0,cr); for(let z=z0+0.6;z<z1;z+=0.9) box(dg,(r0+r1)/2,z,r1-r0,0.18,H,0.2,0,cr);
    box(dg,mx,mz,w-0.6,d-0.6,0,0.08,0,C('#b9b3a8'));
    for(const zr of [z0+d*0.3,z0+d*0.7]){ box(dg,mx,zr,w-2,0.08,0.55,0.06,0,C('#7a7f86'));
      for(let x=x0+1;x<x1-0.6;x+=0.7){ const dk=C(['#2b3a55','#7a2a2a','#2f2f2f','#3c6b4a'][Math.abs(Math.round(x*3+zr))%4]); box(dg,x,zr,0.06,1.7,0.35,0.55,0,dk); box(dg,x,zr-0.62,0.05,0.5,0.05,0.62,0,C('#222')); box(dg,x,zr+0.62,0.05,0.5,0.05,0.62,0,C('#222')); } }
    for(let x=x0+2;x<x1;x+=4) for(let z=z0+2;z<z1;z+=4) markOcc(x,z,3.2); continue; }
  const ex=w>d, L=ex?w:d, Wd=ex?d:w, bx=(a,o,ww,dd,y,h,c)=>ex?box(dg,mx+a,mz+o,ww,dd,y,h,0,c):box(dg,mx+o,mz+a,dd,ww,y,h,0,c);
  const H=lv*3.3, nc=Math.max(2,Math.round(L/4.5));
  for(let k=0;k<=nc;k++){ const a=-L/2+L*k/nc; for(const s of [-1,1]) bx(a,s*(Wd/2-0.2),0.4,0.4,0,H,cr); }
  bx(0,0,L,Wd,0,0.15,sl);
  for(let k=1;k<lv;k++){ const y=k*3.3; bx(0,0,L,Wd,y-0.3,0.3,sl); for(const s of [-1,1]) bx(0,s*(Wd/2-0.12),L,0.25,y,1.0,cr); }
  for(const s of [-1,1]) bx(0,s*(Wd/2-0.15),L,0.3,H-0.5,0.5,cr); for(let a=-L/2+0.5;a<L/2;a+=1.1) bx(a,0,0.25,Wd,H-0.35,0.3,cr);
  for(let a=-L/2+2;a<L/2;a+=4) markOcc(ex?mx+a:mx,ex?mz:mz+a,3.2); }

// ---- night life on the halls: the stairwell windows stay lit all night, a light over each block's door
for(const b of bInfo){ if(!b.name||b.H<8||!/^(Hall|Girls Hall|GH|Hall of Residence)/i.test(b.name)||/Mess|Canteen|Laundry|Gym|TV|Office|Room/i.test(b.name)) continue;
  const es=edges(b.outer).filter(e=>e.L>5); if(!es.length) continue; const lg=es.slice().sort((p,q)=>q.L-p.L)[0], sh=es.slice().sort((p,q)=>p.L-q.L)[0];
  for(const e of (lg.L>45?[sh,lg]:[sh])){ const t=e===lg?e.L*0.5:e.L/2; quad(glowW,e.at(t+0.7,0.14),e.at(t-0.7,0.14),1.2,b.H-1.3,C('#e9d6b4')); for(let y=3.3;y<b.H-1;y+=3.3) bx(e,t,0.18,1.7,0.08,y-0.15,0.18,C('#c9c2b4')); }
  { const t=lg.L*0.5; bx(lg,t+(lg.L>45?2.6:0),0.3,0.6,0.25,2.9,0.08,C('#fff1d6')); const [x,z]=lg.at(t+(lg.L>45?2.6:0),0.3); box(glowS,x,z,0.5,0.2,2.86,0.04,0,C('#fff1d6')); box(glowF,x+lg.nx*1.2,z+lg.nz*1.2,3.2,3.2,0.03,0.01,0,C('#b9b3a8')); } }

// ---- Visitor Hostel (from the videos): beige exposed-concrete blocks with stair towers topped by open pergola crowns,
//      and a big slatted concrete pergola over the forecourt
{ const b=BN(/^Visitor Hostel$/); if(b){ const cc=C('#cdbb9a'), cc2=C('#bba887'), es=edges(b.outer).filter(e=>e.L>5);
  const crown=(x,z,ang,y)=>{ const c=Math.cos(ang),s=Math.sin(ang), P=(u,v)=>[x+u*c-v*s,z+u*s+v*c];
    for(const [u,v] of [[-1.6,-1.6],[1.6,-1.6],[1.6,1.6],[-1.6,1.6]]){ const [px,pz]=P(u,v); box(dg,px,pz,0.45,0.45,y,2.6,ang,cc); }
    for(const v of [-1.6,1.6]){ const [px,pz]=P(0,v); box(dg,px,pz,4.2,0.45,y+2.6,0.45,ang,cc); }
    for(let u=-1.8;u<=1.81;u+=0.6){ const [px,pz]=P(u,0); box(dg,px,pz,0.22,4.4,y+3.05,0.35,ang,cc2); } };
  const sorted=es.slice().sort((p,q)=>q.L-p.L); const used=[];
  for(const e of sorted){ for(const t of [1.8,e.L-1.8]){ const [x,z]=e.at(t,-1.8); if(used.some(u=>Math.hypot(u[0]-x,u[1]-z)<14)) continue; used.push([x,z]);
      box(dg,x,z,3.6,3.6,0,b.H+0.6,e.ang,cc2); crown(x,z,e.ang,b.H+0.6); if(used.length>=5) break; } if(used.length>=5) break; }
  const e=sorted[0], H=6.2, o0=3, o1=10, n=Math.max(2,Math.round(e.L*0.55/4));
  for(let k=0;k<=n;k++){ const t=e.L*0.225+e.L*0.55*k/n; for(const o of [o0,o1]) bx(e,t,o,0.6,0.6,0,H,cc); }
  for(const o of [o0,o1]) bx(e,e.L/2,o,e.L*0.55+0.8,0.6,H,0.6,cc);
  for(let t=e.L*0.225-0.4;t<=e.L*0.775+0.4;t+=0.9) bx(e,t,(o0+o1)/2,0.3,o1-o0+2.2,H+0.6,0.45,cc2); } }
