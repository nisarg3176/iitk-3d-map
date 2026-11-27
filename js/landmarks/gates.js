// Main gate (walls, truss sign, guard hut), Kendriya Vidyalaya gate, Kargil Chowk.
// ---- main gate (as in the videos): long red boundary walls along both sides of the entry road with the institute name
//      (Hindi on the north wall, English on the south wall), the red "IIT Kanpur" truss sign, the blue board and the welcome board
{ const red=C('#b0483a'), cap=C('#cdc6b9');
  const wallX=(x0,x1,z)=>{ box(dg,(x0+x1)/2,z,x1-x0,0.5,0,2.4,0,red); box(dg,(x0+x1)/2,z,x1-x0+0.2,0.7,2.4,0.16,0,cap); for(let x=x0;x<=x1+0.01;x+=4.4) box(dg,x,z,0.7,0.62,0,2.6,0,red); for(let x=x0;x<=x1;x+=3) markOcc(x,z,1.4); };
  wallX(1028,1094,286.4); wallX(1028,1094,305.8);
  plane(1062,1.25,286.4+0.34,0,32,1.3,txt(['भारतीय प्रौद्योगिकी संस्थान कानपुर'],null,'#f1e8dc','bold 78px sans-serif',1024,104),0.25);
  plane(1062,1.25,305.8-0.34,Math.PI,32,1.2,txt(['INDIAN INSTITUTE OF TECHNOLOGY KANPUR'],null,'#f1e8dc','bold 66px sans-serif',1024,96),0.25);
  const sx=1101, sz=280.5; box(dg,sx,sz,0.5,11,3.2,2.2,0,red); for(const s of [-4.2,4.2]){ box(dg,sx-0.6,sz+s,0.5,0.5,0,4.4,0,red); box(dg,sx+0.8,sz+s,0.5,0.5,0,3.4,0,red); }
  plane(sx+0.27,4.3,sz,Math.PI/2,10.6,2.0,txt(['आईआईटी कानपुर'],'#b4583c','#f3efe6','bold 70px sans-serif',512,100),0.4,0.54);
  const bxp=1104, bzp=312.5; for(const s of [-3.6,3.6]) box(dg,bxp,bzp+s,0.3,0.3,0,6,0,C('#9aa0a6')); box(dg,bxp,bzp,0.25,8.4,4,2.4,0,C('#2463b0'));
  plane(bxp+0.14,5.2,bzp,Math.PI/2,8.2,2.2,txt(['भारतीय प्रौद्योगिकी संस्थान, कानपुर','INDIAN INSTITUTE OF TECHNOLOGY KANPUR'],'#2463b0','#ffffff',['bold 40px sans-serif','bold 32px sans-serif'],512,128),0.4,0.28);
  markOcc(sx,sz,6); markOcc(bxp,bzp,5);
  // red "Welcome I.I.T. Kanpur / 30 Speed Limit" board on the island between the lanes, by the barrier and the cabin
  const wx=1011, wz=290.6; box(dg,wx,wz,2.4,1.3,0,0.45,0,C('#b4553a')); for(const s of [-0.8,0.8]) box(dg,wx,wz+s,0.1,0.1,0.45,2.9,0,C('#3a3d42')); box(dg,wx,wz,0.08,1.8,1.1,2.4,0,C('#f4f1ea'));
  const wm=txt(['WELCOME','I.I.T.','KANPUR','( 30 )','Speed Limit'],'#c8312b','#ffffff',['bold 34px sans-serif','bold 62px sans-serif','bold 30px sans-serif','bold 44px sans-serif','bold 26px sans-serif'],256,330);
  plane(wx+0.05,2.3,wz,Math.PI/2,1.7,2.2,wm,0.3,0.1); markOcc(wx,wz,2);
  labels.push({name:'Main Gate (SIS)',x:1040,z:297,y:6,rank:12,tier:2,cat:'civic',alt:['Main Gate','IIT Gate','Entrance','SIS hut','Security'],size:12}); }

// ---- main gate: brick-red guard hut with a tiled hip roof, on the left as you drive in, a little past the cabin, right at the road edge
{ const x=990, z=317.4, w=7, d=4.4, H=2.8, brick=C('#9f4a37'), tile=C('#b4553b');
  box(dg,x,z,w,d,0,H,0,brick); box(dg,x,z,w+0.3,d+0.3,0,0.3,0,C('#cfc7b8'));
  for(const t of [-2.2,0.4]) box(dg,x+t,z-d/2-0.03,1.4,0.06,1.0,1.1,0,C('#2b3640')); box(dg,x+2.3,z-d/2-0.03,1.0,0.06,0,2.1,0,C('#5e4130'));
  const T2=(...a)=>{ const c=a.pop(); dg.tri(...a,c); dg.tri(a[0],a[1],a[2],a[6],a[7],a[8],a[3],a[4],a[5],c); };
  const yE=H+0.05, ov=0.6, rh=1.5, X0=x-w/2-ov, X1=x+w/2+ov, Z0=z-d/2-ov, Z1=z+d/2+ov, rx=(w-d)/2;
  T2(X0,yE,Z0, x+rx,yE+rh,z, X1,yE,Z0, tile); T2(X0,yE,Z0, x-rx,yE+rh,z, x+rx,yE+rh,z, tile);
  T2(X1,yE,Z1, x-rx,yE+rh,z, X0,yE,Z1, tile); T2(X1,yE,Z1, x+rx,yE+rh,z, x-rx,yE+rh,z, tile);
  T2(X0,yE,Z1, x-rx,yE+rh,z, X0,yE,Z0, C('#a24a33')); T2(X1,yE,Z0, x+rx,yE+rh,z, X1,yE,Z1, C('#a24a33'));
  markOcc(x,z,5); }

// ---- Kendriya Vidyalaya gate: white pillars and the red name boards on the kerb (lined up with the lane it sits on)
{ const g=DP.find(p=>(p.t==='gate'||p.t==='lift_gate')&&Math.hypot(p.x-79,p.z-558)<6); if(g){ const wy=wayAt(g.x,g.z); const ang=wy?wy.ang:0, w=wy?Math.max(5,wy.w+2):6, cx=Math.cos(ang+Math.PI/2), cz=Math.sin(ang+Math.PI/2);
  const m=txt(['KENDRIYA VIDYALAYA'],'#c4283a','#ffffff','bold 58px sans-serif',512,80), m2=txt(['केन्द्रीय विद्यालय'],'#c4283a','#ffffff','bold 58px sans-serif',512,80);
  for(const s of [-1,1]){ const px=g.x+cx*s*(w/2+0.7), pz=g.z+cz*s*(w/2+0.7); box(dg,px,pz,1.2,1.2,0,3.4,ang,C('#f1eee8')); box(dg,px,pz,0.8,1.25,1.2,1.3,ang,C('#7a1f2b'));
    const bxp=g.x+cx*s*(w/2+5.2), bzp=g.z+cz*s*(w/2+5.2), ba=ang+Math.PI/2; box(dg,bxp,bzp,7.6,0.3,0,1.6,ba,C('#c4283a')); box(dg,bxp,bzp,7.9,0.45,0,0.3,ba,C('#e8e3d8'));
    plane(bxp+Math.cos(ang)*0.17,0.95,bzp+Math.sin(ang)*0.17,Math.atan2(Math.cos(ang),Math.sin(ang)),7.4,0.95,s<0?m:m2,0,0.34); } } }

// ---- Kargil Chowk: soldier statue on a black stepped pedestal
{ const kg=(data.info||[]).find(r=>r.n==='Kargil circle'); if(kg){ const x=kg.x, z=kg.z, blk=C('#2a2a2c'), ol=C('#5a5640'), S=1.5;
  addMesh(new THREE.CylinderGeometry(2.9,3.1,0.6,24),stdMat(0x2c2c2e),x,0.3,z); addMesh(new THREE.CylinderGeometry(1.9,2.1,0.7,20),stdMat(0x353537),x,0.95,z);
  box(dg,x,z,1.5,1.5,1.3,2.3,0,blk); box(dg,x,z,1.9,1.9,3.6,0.25,0,blk);
  const y=3.85; for(const s of [-1,1]) box(dg,x+s*0.17*S,z,0.24*S,0.3*S,y,0.95*S,0,ol); box(dg,x,z,0.7*S,0.4*S,y+0.95*S,0.9*S,0,ol);
  box(dg,x-0.45*S,z,0.18*S,0.22*S,y+1.05*S,0.8*S,0,ol); box(dg,x+0.45*S,z-0.12*S,0.18*S,0.22*S,y+1.3*S,0.6*S,0,ol); box(dg,x+0.52*S,z-0.25*S,0.08*S,0.08*S,y+0.7*S,1.75*S,0,blk);
  addMesh(new THREE.SphereGeometry(0.19*S,10,8),stdMat(0x5a5640),x,y+2.05*S,z); addMesh(new THREE.CylinderGeometry(0.22*S,0.24*S,0.14*S,10),stdMat(0x45432f),x,y+2.22*S,z);
  for(let k=0;k<20;k++){ const a=k/20*Math.PI*2; box(dg,x+Math.cos(a)*4.2,z+Math.sin(a)*4.2,1.3,0.35,0,0.3,a+Math.PI/2,C(k%2?'#f3f1ec':'#c8372d')); }
  markOcc(x,z,4.5); const l=labels.find(q=>q.name==='Kargil Circle'); if(l) l.y=9; } }
