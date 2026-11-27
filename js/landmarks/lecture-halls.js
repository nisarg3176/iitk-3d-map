// Old Lecture Hall Complex (L1–L15) and its sign, L20 (New Lecture Hall Complex) and the old stage on its lawn.
// ---- old Lecture Hall Complex (L10–L15): red brick halls raised on concrete pillars, with outside stairs
for(const o of decos){ if(o.cust!=='lhc') continue; const R0=o.rings, cr=C('#bdb8ae'), red=C('#a24d39');
  ringPrism(R0.map((r,i)=>i?offsetRing(r,-1.4):offsetRing(r,1.4)),0,3.5,C('#8c8882'));
  const es=edges(R0[0]); for(const e of es) if(e.L>2){ const n=Math.max(1,Math.round(e.L/4)); for(let k=0;k<=n;k++) bx(e,e.L*k/n,-0.45,0.7,0.7,0,3.6,cr); }
  ringPrism(R0,3.6,10.4,red); fillPoly(dg,R0,10.42,C('#b7b1a6'));
  for(const e of es) if(e.L>2){ band(e,3.35,0.5,0.15,0.5,cr,0.3); band(e,9.9,0.8,0.15,0.5,cr,0.3); if(e.L>5) for(let k=1;k<Math.round(e.L/3);k++) cl(e,k*e.L/Math.round(e.L/3)-0.15,k*e.L/Math.round(e.L/3)+0.15,3.85,9.9,cr,0.08); }
  const e=es.slice().sort((p,q)=>q.L-p.L)[0]; const [x,z]=e.at(0.6,1.3); flight(x,z,e.ang,0,3.6,1.5,cr,true); bx(e,e.L/2,2.1,e.L*0.5,0.12,3.6,1.0,cr); }

// ---- L20 (new Lecture Hall Complex), from the photos: tall open cream ground floor under slanted grey V-struts, one upper floor of
//      brick panels and dark glass between grey pilasters, two thick projecting grey slabs with a thin balcony rail, brick end towers,
//      and on the roof three flat-topped hooded shells (sloped sides) facing the lawn; the outer two carry slanted wing plates
{ const b=BN(/^New Lecture Hall Complex$/); if(b){ const gy=C('#9b9893'), gy2=C('#84817c'), gyD=C('#66645f'), crm=C('#ddd5c3'), brk=C('#a9503c'), dk=C('#2f353c'), rl=C('#e4e4e0');
  const G1=6.4, T1=10.3, ES=edges(b.outer), arcF=q=>q.L>10&&q.nz<0&&q.mx>-86&&q.mx<-36&&q.mz>252&&q.mz<292;
  const beam=(e,p0,p1,s,col)=>{ const d=[p1[0]-p0[0],p1[1]-p0[1],p1[2]-p0[2]], dl=Math.hypot(...d), dn=d.map(v=>v/dl), u=[e.nx,0,e.nz];
    let v=[dn[1]*u[2]-dn[2]*u[1], dn[2]*u[0]-dn[0]*u[2], dn[0]*u[1]-dn[1]*u[0]]; const vl=Math.hypot(...v); v=v.map(q=>q/vl*s/2); const U=u.map(q=>q*s/2);
    const cn=(p,a,b_)=>[p[0]+U[0]*a+v[0]*b_, p[1]+U[1]*a+v[1]*b_, p[2]+U[2]*a+v[2]*b_];
    const k=[[1,1],[1,-1],[-1,-1],[-1,1]]; for(let i=0;i<4;i++){ const [a,c]=k[i], [a2,c2]=k[(i+1)%4]; q3(cn(p0,a,c),cn(p1,a,c),cn(p1,a2,c2),cn(p0,a2,c2),col); } };
  const W3=(e,t,o,y)=>{ const [x,z]=e.at(t,o); return [x,y,z]; };
  for(const e of ES){ const front=arcF(e);
    bx(e,e.L/2,front?1.0:0.35,e.L+(front?0.5:0.2),front?2.0:0.7,G1,0.7,gy);
    bx(e,e.L/2,front?1.1:0.35,e.L+(front?0.5:0.2),front?2.2:0.7,T1,0.8,gy);
    if(front){
      cl(e,0,e.L,0,G1,crm,0.06);
      const nd=Math.max(1,Math.floor(e.L/10)); for(let k=0;k<nd;k++){ const t=e.L*(k+0.5)/nd; bx(e,t,0.1,1.5,0.12,0,2.4,C('#6b4a35')); bx(e,t+3.0,0.1,1.1,0.1,1.5,0.6,dk); }
      const ns=Math.max(1,Math.round(e.L/9)); for(let k=0;k<=ns;k++){ const t=e.L*k/ns;
        beam(e,W3(e,t,1.4,0),W3(e,t-1.5,1.4,G1+0.1),0.6,gy); beam(e,W3(e,t,1.4,0),W3(e,t+1.5,1.4,G1+0.1),0.6,gy); bx(e,t,1.4,0.9,0.9,0,0.25,gy2); }
      for(let t=3;t<e.L-1;t+=6){ bx(e,t,1.3,0.35,0.35,G1-0.06,0.05,C('#fff4dc')); const [x,z]=e.at(t,1.3); box(glowS,x,z,0.3,0.3,G1-0.07,0.04,0,C('#fff4dc')); }
      const nb=Math.max(1,Math.round(e.L/4.6)), bw=e.L/nb;
      for(let k=0;k<nb;k++){ const t0=k*bw; bx(e,t0+0.3,0.18,0.6,0.36,G1+0.7,T1-G1-0.7,gy); cl(e,t0+0.6,t0+2.1,G1+0.7,T1,brk,0.08);
        quad(glowW,e.at(t0+2.1,0.08),e.at(t0+bw,0.08),G1+0.7,T1,dk); }
      for(const y of [G1+1.35,G1+1.7]) bx(e,e.L/2,1.95,e.L,0.05,y,0.05,rl);
      for(let t=0;t<=e.L;t+=1.6) bx(e,t,1.95,0.04,0.04,G1+0.7,1.0,rl);
    } else if(e.L>4){ for(let t=0.4;t<e.L-2.4;t+=2.6){ pane(e,t,t+2.0,G1+1.6,T1-0.5,0.08,dk); pane(e,t,t+2.0,1.2,3.0,0.08,dk); } } }
  const pts=[]; for(const e of ES.filter(arcF)) pts.push(e.at(0,0),e.at(e.L,0));
  if(pts.length){ pts.sort((p,q)=>p[0]-q[0]); const A=pts[0], B=pts[pts.length-1];
    const L=Math.hypot(B[0]-A[0],B[1]-A[1]), dx=(B[0]-A[0])/L, dz=(B[1]-A[1])/L; let nx=dz, nz=-dx; if(nz>0){ nx=-nx; nz=-nz; }
    const at=(t,o)=>[A[0]+dx*t+nx*o, A[1]+dz*t+nz*o], P=(t,o,y)=>{ const [x,z]=at(t,o); return [x,y,z]; }, ang=Math.atan2(dz,dx);
    const y0=T1+0.8, O=6, oF=O+2.0, oB=O-11, S=L/3;
    { const [x,z]=at(L/2,O-5); box(dg,x,z,L-2,9,y0,1.9,ang,gy2); }
    for(let i=0;i<3;i++){ const t0=S*i+0.8, t1=S*(i+1)-0.8, s=2.3, h=4.2, fr=oF-0.7;
      const sl=(ta,tb,col)=>q3(P(ta,oF,y0),P(tb,oF,y0+h),P(tb,oB,y0+h),P(ta,oB,y0),col);
      sl(t0,t0+s,gy); sl(t1,t1-s,gy); q3(P(t0+s,oF,y0+h),P(t1-s,oF,y0+h),P(t1-s,oB,y0+h),P(t0+s,oB,y0+h),gy);
      q3(P(t0,fr,y0),P(t0+s,fr,y0+h),P(t1-s,fr,y0+h),P(t1,fr,y0),gyD); q3(P(t0,oB,y0),P(t0+s,oB,y0+h),P(t1-s,oB,y0+h),P(t1,oB,y0),gy2);
      q3(P(t0,oF,y0),P(t0+s,oF,y0+h),P(t0+s,fr,y0+h),P(t0,fr,y0),gy2); q3(P(t1,oF,y0),P(t1-s,oF,y0+h),P(t1-s,fr,y0+h),P(t1,fr,y0),gy2);
      q3(P(t0+s,oF,y0+h),P(t1-s,oF,y0+h),P(t1-s,fr,y0+h),P(t0+s,fr,y0+h),gy2);
      if(i!==1){ const sg=i===0?-1:1, te=i===0?t0:t1;
        q3(P(te,oF+0.4,y0+0.4),P(te+sg*5.5,oF+1.2,y0+h+0.8),P(te+sg*5.5,oF-3.2,y0+h+0.8),P(te,oF-3.8,y0+0.4),gy);
        q3(P(te,oF+0.4,y0+0.25),P(te+sg*5.5,oF+1.2,y0+h+0.65),P(te+sg*5.5,oF-3.2,y0+h+0.65),P(te,oF-3.8,y0+0.25),gy2);
        beam({nx:dx,nz:dz},P(te,oF-1.5,y0),P(te+sg*3.2,oF-1.5,y0+h*0.62),0.35,gy); } }
    for(const [t,o] of [[-2.5,O-3],[L+2.5,O-3]]){ const [x,z]=at(t,o); box(dg,x,z,7,9,0,T1+3.2,ang,brk); box(dg,x,z,7.2,9.2,T1+3.2,0.25,ang,gy);
      for(const s of [-1,1]){ const [x2,z2]=at(t+s*3.5,o); box(dg,x2,z2,0.05,9,T1+3.45,0.9,ang,rl); } } } } }

// ---- Lecture Hall Complex sign: the red-brick wall of the stair up to L5 / L6, on L6's west side, facing the cul-de-sac and the Tutorial Block
{ const br=C('#a24c39'), cr=C('#b9b4aa'), wx=-214.0, wz=219.9, rail=C('#5d5a56');
  box(dg,wx,wz,0.8,5.4,0,8.2,0,br); box(dg,wx,wz,1.0,5.6,8.2,0.3,0,cr);
  plane(wx-0.45,6.2,wz,-Math.PI/2,4.8,2.3,txt(['व्याख्यान कक्ष','LECTURE HALL','COMPLEX'],null,'#18213a',['bold 56px sans-serif','bold 62px sans-serif','bold 62px sans-serif'],512,256),0);
  plane(wx-0.45,3.0,wz+1.3,-Math.PI/2,1.2,1.0,txt(['L5 · L6'],'#24507e','#ffffff','bold 64px sans-serif',256,180),0);
  const n=Math.round(4.2/0.19), sx=-214.2; for(let i=0;i<n;i++) box(dg,sx,wz-2.9-(i+0.5)*0.3,1.4,0.3,0,(i+1)*4.2/n,0,cr);   // solid flight rising north from the wall
  for(let i=0;i<=n;i+=3) box(dg,sx-0.68,wz-2.9-i*0.3,0.05,0.05,i*4.2/n,1.0,0,rail);
  box(dg,sx,wz-2.9-n*0.3-0.9,1.8,1.8,3.95,0.25,0,cr); box(dg,sx-0.6,wz-2.9-n*0.3-0.9,0.35,0.35,0,3.95,0,cr);
  markOcc(wx-1,wz,4); markOcc(sx,wz-6,3); } 

// ---- the old open-air stage on the lawn east of L20, in front of the two trees by Southern Labs: a low stepped concrete platform
//      under a white steel-pipe frame, facing west to the lawn, with a long low wall along its front
{ const X=-46.5, Z=232, A=Math.PI/2, ca=Math.cos(A), sa=Math.sin(A), Lp=(u,v)=>[X+u*ca-v*sa, Z+u*sa+v*ca], cc=C('#b7b3a9'), wp=C('#eef0ee');
  for(let k=0;k<3;k++){ const [x,z]=Lp(0,-k*0.9); box(dg,x,z,17-k*1.2,13-k*1.8,0,0.45*(k+1),A,cc); }
  { const [x,z]=Lp(0,8.2); box(dg,x,z,30,0.6,0,0.8,A,C('#a9a59b')); }
  const H=5.2, us=[-7,-2.33,2.33,7], vs=[-6,-1.8,2.4];
  for(const u of us) for(const v of vs){ const [x,z]=Lp(u,v); box(dg,x,z,0.12,0.12,1.35,H-1.35,A,wp); }
  for(const v of vs){ const [x,z]=Lp(0,v); box(dg,x,z,14.1,0.12,H,0.12,A,wp); }
  for(const u of us){ const [x,z]=Lp(u,-1.8); box(dg,x,z,0.12,8.5,H,0.12,A,wp); }
  oc.fillStyle='#fff'; oc.fillRect(toPx(X-9),toPx(Z-9.5),18.5*pxPerM,19*pxPerM); }
