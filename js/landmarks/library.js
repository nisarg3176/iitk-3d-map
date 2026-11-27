// P K Kelkar Library (glass ground floor, brick upper floors, crown), the Crow sculpture, and the library forecourt (fountain channels, planters, pergolas, terraces).
// ---- P K Kelkar Library: glass ground floor on pillars, red-brick upper floors in a concrete grid
for(const o of decos){ if(o.cust!=='library') continue; const R0=o.rings;
  const inner=R0.map((r,i)=>i?offsetRing(r,-3):offsetRing(r,3));
  fillPoly(dg,inner,4.4,glassC); for(const r of inner) for(let i=0;i<r.length;i++) quad(glowW,r[i],r[(i+1)%r.length],0,4.4,glassC);
  for(const r of R0) walk(r.concat([r[0]]),5.2,1,(x,z)=>box(dg,x,z,0.9,0.9,0,4.6,0,conc));
  ringPrism(R0,4.6,15.6,brick); fillPoly(dg,R0,15.62,C('#b9b3a7'));
  { const cv=document.createElement('canvas'); cv.width=256; cv.height=128; const g=cv.getContext('2d');
    for(let i=0;i<4;i++){ const cx=(i+0.5)*64, gr=g.createRadialGradient(cx,132,4,cx,132,120); gr.addColorStop(0,'rgba(255,196,120,0.95)'); gr.addColorStop(0.5,'rgba(255,186,110,0.35)'); gr.addColorStop(1,'rgba(255,180,100,0)'); g.fillStyle=gr; g.fillRect(0,0,256,128); }
    const tx=new THREE.CanvasTexture(cv); tx.wrapS=THREE.RepeatWrapping; tx.colorSpace=THREE.SRGBColorSpace;
    const wm=new THREE.MeshBasicMaterial({map:tx,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}); nightHooks.push((n,k)=>{ wm.opacity=k*0.28; });
    const r=R0[0]; for(let i=0;i<r.length;i++){ const a=r[i],b=r[(i+1)%r.length], dx=b[0]-a[0], dz=b[1]-a[1], L=Math.hypot(dx,dz); if(L<8) continue;
      let nx=dz/L,nz=-dx/L; const mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2; if(pipO(mx+nx*0.6,mz+nz*0.6,r)){ nx=-nx; nz=-nz; }
      const pg=new THREE.PlaneGeometry(L,11.5); const uv=pg.attributes.uv; for(let k=0;k<uv.count;k++) uv.setX(k,uv.getX(k)*L/21);
      const m=new THREE.Mesh(pg,wm); m.position.set(mx+nx*1.3,4.6+5.75,mz+nz*1.3); m.rotation.y=Math.atan2(nx,nz); m.renderOrder=12; scene.add(m); } }
  for(const y of [4.4,8.1,11.8,15.4]) for(const r of R0) for(let i=0;i<r.length;i++){ const a=r[i],b=r[(i+1)%r.length]; const L=Math.hypot(b[0]-a[0],b[1]-a[1]); if(L<1) continue;
    box(dg,(a[0]+b[0])/2,(a[1]+b[1])/2,L+0.8,1.2,y,0.55,Math.atan2(b[1]-a[1],b[0]-a[0]),conc); }
  for(const r of R0) for(let i=0;i<r.length;i++){ const a=r[i],b=r[(i+1)%r.length]; const dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz); if(L<3) continue;
    let nx=dz/L,nz=-dx/L; const mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2; if(pipO(mx+nx*0.6,mz+nz*0.6,R0[0])!==(r!==R0[0])){ nx=-nx; nz=-nz; }
    const ang=Math.atan2(dz,dx), n=Math.max(1,Math.round(L/4.2));
    for(let k=0;k<=n;k++){ const t=L*k/n; box(dg,a[0]+dx/L*t+nx*0.4,a[1]+dz/L*t+nz*0.4,0.6,0.9,4.6,11.4,ang,conc); }
    for(const y of [6.5,10.2,13.9]) box(glowW,mx+nx*0.1,mz+nz*0.1,L-0.6,0.3,y,0.9,ang,dark); } }

// ---- "Crow": the angular grey sculpture in front of the library
{ const IF=data.info||[]; const sj=IF.find(r=>/silver jubilee/i.test(r.n))||{x:-123.6,z:195.2}; const x=sj.x, z=sj.z, g=C('#2f2a27'), g2=C('#1f1b19');
  { const dm=addMesh(new THREE.SphereGeometry(3.4,18,6,0,Math.PI*2,0,Math.PI/2),stdMat(0xe4e1da),x,0,z); dm.scale.y=0.28; }
  const K=0.92, T1=(a,b,c,col)=>dg.tri(x+a[0]*K,0.6+a[1]*K,z+a[2]*K,x+b[0]*K,0.6+b[1]*K,z+b[2]*K,x+c[0]*K,0.6+c[1]*K,z+c[2]*K,col), T=(a,b,c,col)=>{ T1(a,b,c,col); T1(a,c,b,col); };
  const P={f1:[-1.6,0.5,0.8],f2:[1.4,0.5,-0.6],k:[0,4.2,0],h:[1.5,7.6,0.6],b:[-0.4,6.1,-1.4],w:[-2.6,5.6,1.6],t:[0.3,3,1.9]};
  T(P.f1,P.k,P.t,g); T(P.f2,P.k,P.t,g2); T(P.f1,P.f2,P.k,g); T(P.k,P.h,P.b,g2); T(P.k,P.h,P.w,g); T(P.k,P.b,P.w,g2); T(P.h,P.b,P.w,g); T(P.k,P.t,P.h,g2);
  markOcc(x,z,4); }

// ---- P K Kelkar Library: the M-shaped concrete crown on the roof
for(const o of decos){ if(o.cust!=='library') continue; const e=edges(o.rings[0]).sort((p,q)=>q.L-p.L)[0], cc=C('#e6e1d7'); if(!e) continue;
  const [x,z]=e.at(e.L/2,-4); const c=Math.cos(e.ang),sn=Math.sin(e.ang); box(dg,x,z,8.4,3.2,15.6,0.8,e.ang,cc);
  for(const o of [-2.7,0,2.7]) for(let k=0;k<5;k++) box(dg,x+c*o,z+sn*o,2.3-k*0.34,3-k*0.2,16.4+k*0.95,0.95,e.ang,cc);
  for(const ee of edges(o.rings[0])){ if(ee.L<10) continue; const n=Math.max(1,Math.round(ee.L/4.2)), bw=ee.L/n-1.0;
    for(let k=0;k<n;k++){ const t=ee.L*(k+0.5)/n; bx(ee,t,0.55,bw,1.1,10.9,4.2,C('#a9483a')); bx(ee,t,0.7,bw+0.2,1.4,10.45,0.45,cc); bx(ee,t,0.65,bw+0.2,1.3,15.05,0.4,cc); }
    for(let k=1;k<n;k++){ const [gx,gz]=ee.at(ee.L*k/n,0.12); box(glowW,gx,gz,0.75,0.12,11.0,3.9,ee.ang,dark); } } }

// ---- Library forecourt (from the photos): brick-paved plaza, empty blue-tiled fountain channels with steel railings, a pump tank,
//      raised brick planters, steel pergolas with bougainvillea in front of the library and CCD, an arched bridge, stepped brick terraces
{ const pav=C('#a7573f'), brk=C('#b4513a'), cop=C('#c6c2b8'), blue=C('#4fa6cc'), blueF=C('#5aa9c8'), stl=C('#d5d8dc'), grs=C('#5f8f3d');
  oc.fillStyle='#fff'; oc.fillRect(toPx(-122),toPx(145),69*pxPerM,45*pxPerM);
  box(dg,-87,167,68,44,0,0.05,0,pav);
  for(const [cx,cz,w,d] of [[-63,184,12,7],[-106,186,6,5],[-76,151.8,5,1.4]]) box(dg,cx,cz,w,d,0.05,0.02,0,grs);
  const chan=(x0,x1,z0,z1,rail=1)=>{ const w=x1-x0,d=z1-z0,mx=(x0+x1)/2,mz=(z0+z1)/2;
    box(glowC,mx,mz,w,d,0.05,0.04,0,blueF); for(let t=x0+2;t<x1-1;t+=4) for(const zz of [z0,z1]) box(glowS,t,zz,0.18,0.18,0.68,0.1,0,C('#f3ead8'));
    for(const [a,b,ww,dd] of [[mx,z0+0.12,w,0.25],[mx,z1-0.12,w,0.25],[x0+0.12,mz,0.25,d],[x1-0.12,mz,0.25,d]]){ box(dg,a,b,ww,dd,0,0.6,0,blue); box(dg,a,b,ww+0.12,dd+0.12,0.6,0.08,0,cop); }
    if(!rail) return; const rr=(ax,az,bx_,bz)=>{ const L=Math.hypot(bx_-ax,bz-az), an=Math.atan2(bz-az,bx_-ax); box(dg,(ax+bx_)/2,(az+bz)/2,L,0.05,1.55,0.05,an,stl); box(dg,(ax+bx_)/2,(az+bz)/2,L,0.04,1.1,0.04,an,stl);
      const n=Math.max(1,Math.round(L/2)); for(let k=0;k<=n;k++) box(dg,ax+(bx_-ax)*k/n,az+(bz-az)*k/n,0.05,0.05,0.6,1.0,0,stl); };
    rr(x0,z0,x1,z0); rr(x0,z1,x1,z1); rr(x0,z0,x0,z1); rr(x1,z0,x1,z1); };
  chan(-99,-60,152,155.5); chan(-96,-70,159,176); chan(-70,-56,166,170); chan(-104,-96,170,174); chan(-84,-80,155.5,159,0);
  for(const z of [163,167.5,172]) addMesh(new THREE.CylinderGeometry(0.16,0.16,24,8),stdMat(0x9aa0a6),-83,0.3,z,0).rotation.z=Math.PI/2;
  for(const [x,z] of [[-91,162],[-85,170],[-77,164],[-75,173]]) box(dg,x,z,1.2,1.0,0.05,0.5,0,cop);
  addMesh(new THREE.CylinderGeometry(0.9,0.9,1.1,16),stdMat(0xb4b8bd),-61,0.6,177); addMesh(new THREE.SphereGeometry(0.9,16,8,0,Math.PI*2,0,Math.PI/2),stdMat(0xb4b8bd),-61,1.15,177);
  box(dg,-61,177,2.2,2.2,0,0.15,0,cop); box(dg,-65,178,1.3,0.9,0,1.5,0,C('#eceae6'));
  { const x=-58.5; for(let k=0;k<9;k++){ const t=k/8, z=164.5+t*7, y=0.35+Math.sin(t*Math.PI)*0.9; box(dg,x,z,2.0,0.95,y,0.14,0,C('#8a5a3a'));
      for(const s of [-1,1]) box(dg,x+s*0.95,z,0.07,0.95,y+0.14,0.9,0,C('#6e4a30')); } }
  for(const [cx,cz,w,d] of [[-62,182,9,6],[-80,184,14,5],[-99,181,7,7],[-66,158,6,4],[-112,186,10,5],[-108,148,8,4]]){
    for(const [a,b,ww,dd] of [[cx,cz-d/2+0.15,w,0.3],[cx,cz+d/2-0.15,w,0.3],[cx-w/2+0.15,cz,0.3,d],[cx+w/2-0.15,cz,0.3,d]]){ box(dg,a,b,ww,dd,0,0.85,0,brk); box(dg,a,b,ww+0.15,dd+0.15,0.85,0.1,0,cop); }
    box(dg,cx,cz,w-0.6,d-0.6,0,0.7,0,C('#5d4632')); box(dg,cx,cz,w-0.6,d-0.6,0.7,0.04,0,grs);
    for(let i=0;i<Math.max(2,Math.round(w*d/14));i++) bushes.push([cx+(Math.random()-0.5)*(w-1.8),cz+(Math.random()-0.5)*(d-1.8),0.7+Math.random()*0.4,0.75+Math.random()*0.5]); }
  const perg=(cx,cz,w,d,ang,flw)=>{ const c=Math.cos(ang),s=Math.sin(ang), P=(a,b)=>[cx+a*c-b*s,cz+a*s+b*c], H=3.7;
    for(const a of [-w/2,0,w/2]) for(const b of [-d/2,d/2]){ const [x,z]=P(a,b); box(dg,x,z,0.16,0.16,0,H,0,stl); }
    for(const b of [-d/2,d/2]){ const [x,z]=P(0,b); box(dg,x,z,w+0.4,0.14,H,0.22,ang,stl); }
    for(let a=-w/2;a<=w/2+0.01;a+=0.55){ const [x,z]=P(a,0); box(dg,x,z,0.08,d+0.5,H+0.22,0.12,ang,stl); }
    for(const b of [-d/2,d/2]){ const [x,z]=P(0,b); box(glowS,x,z,w,0.06,H-0.05,0.05,ang,C('#fff1d6')); }
    if(flw) for(let i=0;i<7;i++){ const [x,z]=P((Math.random()-0.5)*w,(Math.random()<0.5?-1:1)*d/2*(0.6+Math.random()*0.4)); box(dg,x,z,1.0+Math.random(),0.9,H+0.1+Math.random()*0.3,0.45,ang,C(i%3?'#d43a72':'#f08c2e')); } };
  for(const x of [-94,-80.5,-67]) perg(x,148,11.5,5.4,0,1);
  perg(-52.5,152,8,4.6,Math.PI/2,1); perg(-52.5,162,8,4.6,Math.PI/2,0);
  // stepped brick terraces: tiers fall from the north and west edges down to a lawn
  { const X0=-121,X1=-103,Z0=150,Z1=180,W=1.6;
    for(let j=4;j>=1;j--){ const bw=W*(5-j), h=0.4*j; box(dg,(X0+X1)/2,Z0+bw/2,X1-X0,bw,0,h,0,brk); box(dg,X0+bw/2,(Z0+Z1)/2,bw,Z1-Z0,0,h,0,brk);
      const ib=W*(5-j); box(dg,(X0+ib-W/2+X1)/2,Z0+ib-W/2,X1-(X0+ib-W)+0.0,W-0.3,h,0.03,0,C('#a2a184')); box(dg,X0+ib-W/2,(Z0+ib-W+Z1)/2,W-0.3,Z1-(Z0+ib-W),h,0.03,0,C('#a2a184'));
      box(dg,(X0+ib+X1)/2,Z0+ib-0.15,X1-(X0+ib),0.3,h,0.05,0,cop); box(dg,X0+ib-0.15,(Z0+ib+Z1)/2,0.3,Z1-(Z0+ib),h,0.05,0,cop); }
    box(dg,(X0+X1)/2,Z0+0.12,X1-X0,0.25,1.6,0.45,0,brk); box(dg,X0+0.12,(Z0+Z1)/2,0.25,Z1-Z0,1.6,0.45,0,brk);
    box(dg,(X0+6.4+X1)/2,(Z0+6.4+Z1)/2,X1-X0-6.4,Z1-Z0-6.4,0.05,0.03,0,grs); }
  for(const [x,z] of [[-104,189],[-74,189],[-124,164],[-54,180],[-112,148],[-60,148],[-92,214],[-70,223],[-104,240],[-64,246]]) xLamps.push([x,z,0,1,1]);
  markOcc(-87,167,0); for(let x=-120;x<=-55;x+=5) for(let z=147;z<=188;z+=5) markOcc(x,z,3.2); }
