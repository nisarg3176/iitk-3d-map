// Academic buildings: IME domes, DJAC, Non Core Labs, Rajeev Motwani, CSE (KD), Tutorial Block, Wind Tunnel, Cessna at the Flight Lab, IITK Motorsports.
// ---- IME foyer skylight domes
{ const b=bInfo.find(q=>/^Industrial & Management/.test(q.name||'')); if(b){ const dm=new THREE.MeshStandardMaterial({color:0xbfd9e2,roughness:0.25,metalness:0.3});
    for(const [ox,oz] of [[-5,0],[5,0]]){ const d=addMesh(new THREE.SphereGeometry(3.4,16,8,0,Math.PI*2,0,Math.PI/2),dm,b.cx+ox,b.H-0.6,b.cz+oz); d.castShadow=false; } } }

// ---- DJAC (from the video): a tall grey colonnade on the ground floor under a deep beam, a grey floor of deep-set windows,
//      then two terracotta-red boxes each with one continuous glass strip, a dark recessed floor between them
{ const b=BN(/^DJAC$/); if(b){ const gy=C('#b3b2ad'), gy2=C('#c6c5c0'), rd=C('#a9543f'), dk=C('#2f3338'), H=b.H;
  for(const e of edges(b.outer)){ if(e.L<3) continue;
    cl(e,0,e.L,0,7.2,C('#a6a6a2'),0.06); for(let t=1.6;t<e.L-1;t+=4.2){ pane(e,t-1.0,t+1.0,0.9,2.9,0.09,dk); pane(e,t-1.0,t+1.0,4.0,6.2,0.09,dk); }
    if(e.L>6) cols(e,0,7.2,3.3,1.9,0.55,gy2); bx(e,e.L/2,1.2,e.L+0.3,2.6,7.2,0.8,gy);
    cl(e,0,e.L,8.0,10.8,gy,0.08); for(let t=2;t<e.L-1.5;t+=4.5) pane(e,t-1.4,t+1.4,8.5,10.3,0.12,dk);
    if(e.L>9){ for(const [y0,y1,g0,g1] of [[10.8,15.4,12.3,14.1],[16.6,H-0.2,17.6,19.2]]){
        bx(e,e.L/2,0.45,e.L-0.4,0.9,y0,y1-y0,rd); quad(glowW,e.at(e.L-0.8,0.92),e.at(0.8,0.92),g0,g1,C('#5d87a6')); for(let t=0.8;t<e.L-0.6;t+=1.6) bx(e,t,0.93,0.06,0.05,g0,g1-g0,C('#c9ccd0')); }
      cl(e,0,e.L,15.4,16.6,dk,0.05); for(let t=2;t<e.L-1;t+=5) bx(e,t,0.3,0.25,0.25,15.36,0.04,C('#fff4dc')); }
    else cl(e,0,e.L,10.8,H,gy,0.08); } } }

// ---- Non Core Labs (from the video): red-brick blocks and beige stone blocks side by side, beige stair towers rising above the roof,
//      punched windows in the stone and wider ones in the brick, and a big slatted concrete pergola over the roof terrace
{ const b=BN(/^NCL$/); if(b){ const bg=C('#d6c7a8'), bg2=C('#c5b493'), H=b.H, es=edges(b.outer);
  for(const e of es){ if(e.L<8) continue; const n=Math.max(1,Math.round(e.L/11));
    for(let k=0;k<n;k++){ if((k+Math.round(e.mx+e.mz))%2) continue; const t0=e.L*k/n, t1=e.L*(k+1)/n, tw=k%3===0&&e.L>20;
      bx(e,(t0+t1)/2,0.6,t1-t0,1.2,0,tw?H+2.6:H+0.2,bg); bx(e,(t0+t1)/2,0.62,t1-t0+0.1,1.25,tw?H+2.6:H+0.2,0.3,bg2);
      for(let y=1.0;y<H-1;y+=3.3) for(let t=t0+1.6;t<t1-1.2;t+=2.6) pane(e,t-0.55,t+0.55,y,y+1.3,1.22,C('#3b4652')); } }
  const e=es.slice().sort((p,q)=>q.L-p.L)[0], tm=e.L*0.6, Hp=H+3.4;
  for(const t of [tm-9,tm-3,tm+3,tm+9]) for(const o of [-1.2,-8]) bx(e,t,o,0.6,0.6,H-0.6,Hp-H+0.6,bg);
  for(const o of [-1.2,-8]) bx(e,tm,o,19,0.6,Hp,0.7,bg); for(let t=tm-9.5;t<=tm+9.5;t+=1.2) bx(e,t,-4.6,0.35,8.6,Hp+0.7,0.5,bg2); } }

// ---- Rajeev Motwani Building (from the video): solid red brick, the front facing the road with a glass lobby, two big glass curtain
//      walls between beige stone bands (the lower band carries the name), black vertical louvre bays either side
{ const b=BN(/^Rajeev Motwani/); if(b){ const simp=b.outer.filter((p,i,a)=>{ const q=a[(i-1+a.length)%a.length], r=a[(i+1)%a.length]; return Math.abs((p[0]-q[0])*(r[1]-p[1])-(p[1]-q[1])*(r[0]-p[0]))>8; }), es=edges(simp), st=C('#d9cdb9'), dk=C('#26292d'), H=b.H;
  const fr=es.filter(e=>e.L>15).sort((p,q)=>p.nz-q.nz)[0];   // the front is the long north face, on the side away from KD
  const louv=(e,t0,t1,y0,y1)=>{ cl(e,t0,t1,y0,y1,dk,0.1); for(let t=t0+0.12;t<t1;t+=0.24) bx(e,t,0.16,0.05,0.12,y0,y1-y0,C('#3a3e43')); };
  for(const e of es){ if(e.L<4) continue; for(let y=3.6;y<H-1;y+=6.6) band(e,y,0.35,0.12,0.24,st);
    if(e===fr){ const g0=Math.max(4,e.L*0.2), g1=e.L-g0, mid=(g0+g1)/2, w=g1-g0;
      quad(glowW,e.at(g1,0.1),e.at(g0,0.1),0,3.5,C('#7f9fae')); bx(e,mid,1.0,w+1.2,2.0,3.5,1.0,st);
      quad(glowW,e.at(g1-0.3,0.12),e.at(g0+0.3,0.12),4.5,8.2,C('#98bccb')); bx(e,mid,1.1,w+1.2,2.2,8.2,1.5,st);
      signOn(e,mid,9.0,Math.min(9,w*0.6),0.85,txt(['राजीव मोटवानी भवन','RAJEEV MOTWANI BUILDING'],'#d9cdb9','#ffffff','bold 40px sans-serif',512,110),2.22,0);
      quad(glowW,e.at(g1-0.3,1.0),e.at(g0+0.3,1.0),9.7,16.2,C('#a6c7d4')); for(const y of [10.6,11.0]) bx(e,mid,2.1,w,0.04,y,0.05,C('#e6e6e4'));
      for(let t=g0+0.3;t<=g1-0.3;t+=1.5) bx(e,t,1.0,0.07,0.06,9.7,6.5,C('#c9ccd0'));
      bx(e,mid,1.1,w+1.2,2.2,16.2,1.4,st); quad(glowW,e.at(g1-0.3,0.12),e.at(g0+0.3,0.12),17.6,H-1.6,C('#98bccb'));
      for(const [a,c] of [[0.6,g0-0.6],[g1+0.6,e.L-0.6]]){ louv(e,a+0.4,c-0.4,4.4,10.8); louv(e,a+0.4,c-0.4,12.0,18.4); pane(e,(a+c)/2-0.4,(a+c)/2+0.4,19.6,H-2,0.1,dk); } }
    else { const n=Math.max(1,Math.round(e.L/9)); for(let k=0;k<n;k++){ const t=e.L*(k+0.5)/n; if(e.L>12&&k%2===0) louv(e,t-1.3,t+1.3,4.0,H-2.4); else for(let y=4.2;y<H-2;y+=3.3) pane(e,t-0.6,t+0.6,y,y+1.9,0.1,dk); } }
    band(e,H-1.0,1.0,0.12,0.35,st,0.3); }
  const e=es.slice().sort((p,q)=>q.L-p.L)[0]; for(const t of [3.2,e.L-3.2]){ const [x,z]=e.at(t,-3.2); frame(x,z,e.ang,5,5,H-0.65,4.6,st); } } }

// ---- CSE department (HR Kadim Diwan Building): brick entrance, glass doors, name stone and flower pots
{ const b=BN(/Kadim Diwan/); if(b){ let e=null,bd=1e9; for(const q of edges(b.outer)) if(q.L>7){ const d=Math.hypot(q.mx-2,q.mz+58); if(d<bd){ bd=d; e=q; } }
  if(e){ const t=e.L/2, br=C('#9d4936'), st=C('#ddd6c8'); mark('cse',e,t,2);
    pane(e,t-2.6,t+2.6,0.15,3.0,0.12,GLb); bx(e,t,1.7,7,3.4,3.1,0.4,st); for(const s of [-3.3,3.3]) bx(e,t+s,1.7,0.9,3.4,0,3.1,br);
    for(let k=0;k<3;k++) bx(e,t,3.6+k*0.4,6,0.4,0,0.45-k*0.15,st);
    const [sx,sz]=e.at(t-8,3.4); box(dg,sx,sz,4.8,0.5,0,1.3,e.ang,C('#6e4a3c'));
    const m=txt(['संगणक विज्ञान एवं अभियांत्रिकी विभाग','DEPARTMENT OF','COMPUTER SCIENCE AND ENGINEERING'],'#6e4a3c','#f1e9dc',['bold 30px sans-serif','bold 30px sans-serif','bold 28px sans-serif'],512,150);
    signOn(e,t-8,0.68,4.6,1.2,m,3.67); for(let k=0;k<9;k++){ const [x,z]=e.at(t-5.2+k*0.55,3.3); pot(x,z); }
    for(let k=0;k<6;k++){ const [x,z]=e.at(t+4.4+k*0.6,3.3); pot(x,z); } } } }

// ---- Tutorial Block: deep concrete overhangs; the round brick stair drum and the entrance are on the north side, facing L5 / L6
{ const b=BN(/^Tutorial Block$/); if(b){ const cr=C('#cbc5b8');
  for(const q of edges(b.outer)) if(q.L>3) band(q,3.15,0.4,0.8,1.6,cr,1.2);
  let p=b.outer[0]; for(const q of b.outer) if(q[1]<p[1]) p=q;
  const x=p[0], z=p[1]+4.2, ta=Math.atan2(206-z,-222-x), ca=Math.cos(ta), sa=Math.sin(ta), ct=Math.cos(ta+Math.PI/2), st=Math.sin(ta+Math.PI/2);
  addMesh(new THREE.CylinderGeometry(4.6,4.6,b.H+0.8,20),stdMat(0xa04b37),x,(b.H+0.8)/2,z);
  addMesh(new THREE.CylinderGeometry(4.85,4.85,0.55,20),stdMat(0xcbc5b8),x,b.H+0.85,z);
  for(let k=0;k<5;k++){ const a=ta+(k-2)*0.38; box(dg,x+Math.cos(a)*4.62,z+Math.sin(a)*4.62,0.9,0.08,3.9,1.2,a+Math.PI/2,C('#3a4651')); }
  box(dg,x+ca*4.65,z+sa*4.65,2.4,0.3,0,2.6,ta+Math.PI/2,C('#2e3338'));
  plane(x+ca*4.85,2.95,z+sa*4.85,Math.atan2(ca,sa),2.2,0.5,txt(['TUTORIAL BLOCK'],'#1f7a4a','#ffffff','bold 56px sans-serif',512,110),0.5);
  box(dg,x+ca*6.4,z+sa*6.4,3.8,2.6,3.0,0.3,ta+Math.PI/2,cr); for(const s of [-1.7,1.7]) box(dg,x+ca*7.5+ct*s,z+sa*7.5+st*s,0.3,0.3,0,3.0,ta,cr);
  markOcc(x+ca*6,z+sa*6,4); } }

// ---- Wind Tunnel: raised on concrete stilts, saw-tooth roof, painted name across the front
for(const o of decos){ if(o.cust!=='wt') continue; const R0=o.rings, conc=C('#b6b3ac'), up=C('#dedbd4');
  ringPrism(R0.map((r,i)=>i?offsetRing(r,-2.6):offsetRing(r,2.6)),0,4.3,C('#8f8d88'));
  const es=edges(R0[0]); for(const e of es){ if(e.L<3) continue; const n=Math.max(1,Math.round(e.L/7)); for(let k=0;k<=n;k++) bx(e,e.L*k/n,-0.5,0.8,0.8,0,4.7,conc); }
  ringPrism(R0,4.7,11.2,up); for(const e of es) if(e.L>2){ band(e,4.4,0.6,0.15,0.6,conc,0.4); band(e,10.8,0.6,0.15,0.5,conc,0.4); }
  // saw-tooth roof
  { const outer=R0[0], ang=mainAngle(outer)+Math.PI/2, c=Math.cos(ang), s=Math.sin(ang); const L=outer.map(p=>[p[0]*c+p[1]*s,-p[0]*s+p[1]*c]);
    const W=(u,v)=>[u*c-v*s,u*s+v*c]; const span=v=>{ const xs=[]; for(let i=0;i<L.length;i++){ const a=L[i],b=L[(i+1)%L.length]; if((a[1]>v)!==(b[1]>v)) xs.push(a[0]+(v-a[1])/(b[1]-a[1])*(b[0]-a[0])); } xs.sort((p,q)=>p-q); let best=null; for(let i=0;i+1<xs.length;i+=2) if(!best||xs[i+1]-xs[i]>best[1]-best[0]) best=[xs[i],xs[i+1]]; return best; };
    const mnv=Math.min(...L.map(p=>p[1])), mxv=Math.max(...L.map(p=>p[1])), pitch=7.5, y0=11.2, hh=3.4, rc=C('#a19e97');
    for(let v=mnv+0.6; v+pitch<=mxv-0.3; v+=pitch){ const s0=span(v+0.05), s1=span(v+pitch-0.05); if(!s0||!s1) continue; const u0=Math.max(s0[0],s1[0])+0.4, u1=Math.min(s0[1],s1[1])-0.4; if(u1-u0<4) continue;
      const A=W(u0,v),B=W(u1,v),Cc=W(u1,v+pitch),D=W(u0,v+pitch);
      q3([A[0],y0,A[1]],[B[0],y0,B[1]],[Cc[0],y0+hh,Cc[1]],[D[0],y0+hh,D[1]],rc);
      quad(paneL,D,Cc,y0,y0+hh-0.3,GLb); quad(dg,D,Cc,y0+hh-0.3,y0+hh,rc);
      dg.tri(A[0],y0,A[1],D[0],y0,D[1],D[0],y0+hh,D[1],up); dg.tri(B[0],y0,B[1],Cc[0],y0,Cc[1],Cc[0],y0+hh,Cc[1],up); } }
  // the painted front: Hindi name, emblem and NATIONAL WIND TUNNEL FACILITY IITK
  const e=frontEdge(R0[0],18), Lm=e.L-1.2, Hm=5.6, W=2048, H=Math.max(64,Math.round(W*Hm/Lm));
  const m=tex((g,w,h)=>{ g.fillStyle='#e8e6e0'; g.fillRect(0,0,w,h); for(let i=0;i<70;i++){ g.fillStyle=`rgba(90,90,90,${0.04+0.06*((i*37)%10)/10})`; g.fillRect((i*131)%w,0,3+(i%5)*3,h); }
    g.fillStyle='#2b5aa6'; g.textBaseline='middle'; g.textAlign='center'; g.font=`bold ${h*0.2|0}px sans-serif`; g.fillText('राष्ट्रीय वायु प्रवाही',w*0.17,h*0.36); g.fillText('सुरंग सुविधा',w*0.17,h*0.64);
    const cx=w*0.4, cy=h/2, r=h*0.34; g.strokeStyle='#2b5aa6'; g.lineWidth=h*0.05; g.beginPath(); g.arc(cx,cy,r,0,7); g.stroke(); g.lineWidth=h*0.025; for(let k=0;k<16;k++){ const a=k/16*Math.PI*2; g.beginPath(); g.moveTo(cx+Math.cos(a)*r*0.3,cy+Math.sin(a)*r*0.3); g.lineTo(cx+Math.cos(a)*r*0.85,cy+Math.sin(a)*r*0.85); g.stroke(); }
    g.font=`bold ${h*0.27|0}px sans-serif`; g.fillText('NATIONAL WIND TUNNEL',w*0.73,h*0.33,w*0.5); g.fillText('FACILITY  IITK',w*0.73,h*0.68,w*0.5); },W,H);
  signOn(e,e.L/2,4.9+Hm/2,Lm,Hm,m,0.12); const nf=Math.round(e.L/9); for(let k=1;k<nf;k++) bx(e,e.L*k/nf,0.35,0.6,0.55,4.7,6.5,conc); }

// ---- Cessna VT-DUM on display near the Flight Lab
{ const x=-186, z=-602, ang=0.35, K=1.6, wh=C('#f3f1ec'), tri=[C('#e0802f'),C('#f3f1ec'),C('#2f8a3a')];
  disc(dg,x,z,12.5,0.14,C('#7cbc52'),32);
  for(let i=0;i<30;i++){ const a=i/30*Math.PI*2; box(dg,x+Math.cos(a)*11.8,z+Math.sin(a)*11.8,0.25,0.25,0,1.1,0,tri[i%3]); }
  const P=(u,v)=>[x+Math.cos(ang)*u*K-Math.sin(ang)*v*K, z+Math.sin(ang)*u*K+Math.cos(ang)*v*K];
  const B=(u,v,w,d,y,h,col)=>{ const [a,b]=P(u,v); box(dg,a,b,w*K,d*K,y*K,h*K,ang,col); };
  B(0,0,8.4,1.3,0.9,1.35,wh); B(1.2,0,2.6,1.25,2.2,0.7,C('#7fb3bf')); B(0.9,0,1.6,11.2,2.95,0.18,wh);
  B(-3.9,0,1.4,0.2,2.2,2.2,wh); B(-3.9,0,1.2,3.8,2.1,0.12,wh); B(-3.9,0,1.5,0.24,3.2,0.5,C('#c8453a'));
  B(4.3,0,0.2,2.2,1.2,0.2,C('#333'));
  for(const sd of [-2.6,2.6]) B(0.9,sd,0.12,0.12,0.9,2.1,wh);
  for(const [u,v] of [[2.6,0],[-0.2,-1.2],[-0.2,1.2]]) B(u,v,0.6,0.25,0,0.6,C('#222'));
  // a "P" painted on both sides of the fuselage
  const c=document.createElement('canvas'); c.width=c.height=128; const g=c.getContext('2d'); g.fillStyle='#d62828'; g.font='bold 110px sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('P',64,70);
  const tx=new THREE.CanvasTexture(c); tx.colorSpace=THREE.SRGBColorSpace;
  for(const sd of [-1,1]){ const m=new THREE.Mesh(new THREE.PlaneGeometry(1.3*K,1.3*K),new THREE.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false}));
    const [a,b]=P(-1.4,sd*0.69); m.position.set(a,1.58*K,b); m.rotation.y=-ang+(sd>0?0:Math.PI); scene.add(m); }
  markOcc(x,z,13);
  labels.push({name:'Cessna VT-DUM',x,z,y:7,rank:5,tier:3,cat:'civic',alt:['Plane','Aircraft at airstrip','Aeroplane'],size:12}); }

// ---- IITK Motorsports: small black-and-red workshop / garage, roller shutters facing the road (east)
{ const x=-414, z=216, w=9, d=10, H=4.2, blk=C('#232427'), red=C('#b3262b');
  box(dg,x,z,w,d,0,H,0,blk); box(dg,x,z,w+0.3,d+0.3,H,0.3,0,C('#2e3033')); box(dg,x,z,w+0.3,d+0.3,0,0.3,0,C('#55575b'));
  box(dg,x+w/2+0.03,z,0.06,d+0.05,H-1.15,0.5,0,red);                                       // red band along the front
  for(const s of [-2.3,2.3]){ box(dg,x+w/2+0.04,z+s,0.06,3.2,0.05,2.9,0,C('#6d7176')); for(let k=1;k<10;k++) box(dg,x+w/2+0.07,z+s,0.03,3.2,0.05+k*0.29,0.04,0,C('#4d5054')); }
  box(dg,x,z-d/2-0.03,w-1,0.06,H-1.15,0.5,0,red); box(dg,x-2,z-d/2-0.04,1.6,0.06,1.3,1.0,0,C('#3b4a52'));
  plane(x+w/2+0.12,H-0.25,z,Math.PI/2,6.4,0.55,txt(['IITK MOTORSPORTS'],'#141416','#ff3b30','bold italic 60px sans-serif',512,64),0.5);
  box(dg,x+w/2+2.2,z,3.6,d,0,0.06,0,C('#9b978e')); markOcc(x,z,8); }
