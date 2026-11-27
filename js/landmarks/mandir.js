// LHC Mandir.
// ---- LHC Mandir (from the photos): white shrine with an octagonal white shikhara, red trim and kalash, on a white-tiled platform
//      inside a red-and-grey railing, red flags on tall poles all round, red bell gate on the path, pink kiosk, tin store shed, netted flower beds
{ const x=-179, z=270, wh=C('#f6f4ef'), red=C('#c9302a'), rail=C('#c43d2c'), grey=C('#b9bcc0'), tile=C('#e9e7e1');
  box(dg,x,z,11,10,0,0.25,0,tile);                                                     // tiled platform
  box(dg,x,z-1.0,3.4,3.4,0.25,3.1,0,wh); box(dg,x,z-1.0,3.6,3.6,3.35,0.25,0,red);      // sanctum with red cornice
  box(dg,x,z+0.75,2.6,0.5,0.25,3.0,0,wh); box(glowW,x,z+1.02,1.5,0.06,0.25,2.2,0,C('#6b5640'));   // front arch wall and opening
  for(const s of [-1,1]) box(dg,x+s*0.55,z+1.05,0.32,0.05,2.0,0.4,0,C('#e8c34d'));            // small pictures by the arch
  { const sp=addMesh(new THREE.CylinderGeometry(0.25,1.95,3.4,8),stdMat(0xf6f4ef),x,3.6+1.7,z-1.0); sp.rotation.y=Math.PI/8; }
  addMesh(new THREE.CylinderGeometry(0.5,0.6,0.35,8),stdMat(0xc9302a),x,7.1,z-1.0); addMesh(new THREE.SphereGeometry(0.28,8,6),stdMat(0xd9a520),x,7.5,z-1.0);
  box(dg,x,z-1.0,0.05,0.05,7.6,0.9,0,C('#5a4030')); box(dg,x+0.3,z-1.0,0.55,0.04,8.05,0.4,0,C('#e2512a'));
  box(dg,x,z+3.2,1.2,2.6,0.25,0.03,0,C('#2e9e6e'));                                    // green mat to the door
  // railing round the platform: red posts and top rail, grey horizontal bars; gap at the front gate
  const rl=(x0,z0,x1,z1)=>{ const L=Math.hypot(x1-x0,z1-z0), a=Math.atan2(z1-z0,x1-x0), mx=(x0+x1)/2, mz=(z0+z1)/2; if(L<0.3) return;
    box(dg,mx,mz,L,0.09,1.15,0.09,a,rail); box(dg,mx,mz,L,0.08,0.25,0.08,a,rail); for(const y of [0.45,0.65,0.85]) box(dg,mx,mz,L,0.04,y,0.04,a,grey);
    const n=Math.max(1,Math.round(L/1.8)); for(let k=0;k<=n;k++){ const t=k/n; box(dg,x0+(x1-x0)*t,z0+(z1-z0)*t,0.09,0.09,0,1.25,0,rail); } };
  const X0=x-5.6,X1=x+5.6,Z0=z-5.1,Z1=z+5.1; rl(X0,Z0,X1,Z0); rl(X0,Z0,X0,Z1); rl(X1,Z0,X1,Z1); rl(X0,Z1,x-0.75,Z1); rl(x+0.75,Z1,X1,Z1);
  for(const s of [-1,1]) box(dg,x+s*0.8,Z1,0.14,0.14,0,2.7,0,rail); box(dg,x,Z1,1.75,0.14,2.6,0.14,0,rail);             // bell gate
  for(const s of [-1,1]){ addMesh(new THREE.ConeGeometry(0.17,0.32,10),stdMat(0x9a5a2a),x+s*0.35,2.27,Z1); box(dg,x+s*0.35,Z1,0.02,0.02,2.43,0.17,0,C('#5a4030')); }
  { const bx0=x+4.2,bz0=z-3.6; for(const [a,b] of [[-0.6,0],[0.6,0]]) box(dg,bx0+a,bz0+b,0.12,0.12,0,2.4,0,rail); box(dg,bx0,bz0,1.35,0.12,2.3,0.12,0,rail);
    addMesh(new THREE.ConeGeometry(0.15,0.28,10),stdMat(0x9a5a2a),bx0,2.05,bz0); }                                       // second bell frame
  { const kx=x-3.6,kz=z+0.2; box(dg,kx,kz,1.8,1.4,0.25,2.2,0,C('#e2457c'));                                             // pink kiosk with a pitched roof
    dg.tri(kx-1.0,2.45,kz-0.8,kx+1.0,2.45,kz-0.8,kx,2.95,kz-0.8,C('#d23a6e')); dg.tri(kx-1.0,2.45,kz+0.8,kx,2.95,kz+0.8,kx+1.0,2.45,kz+0.8,C('#d23a6e'));
    for(const s of [-1,1]){ const p=[kx+s*1.0,2.45]; dg.tri(p[0],p[1],kz-0.8,kx,2.95,kz-0.8,kx,2.95,kz+0.8,C('#c9346a')); dg.tri(p[0],p[1],kz-0.8,kx,2.95,kz+0.8,p[0],p[1],kz+0.8,C('#c9346a')); }
    box(dg,kx,kz+0.71,1.4,0.03,0.6,1.4,0,C('#b02a58')); }
  box(dg,x+3.4,z-3.6,2.4,1.8,0.25,2.2,0,C('#8d9196')); box(dg,x+3.4,z-3.6,2.6,2.0,2.45,0.08,0,C('#7a7e84'));            // tin store shed
  const fl=C('#e2401f'); for(let i=0;i<12;i++){ const a=i/12*Math.PI*2+0.13, px=x+Math.cos(a)*6.4, pz=z+Math.sin(a)*5.9; if(Math.abs(px-x)<1.6&&pz>z) continue;
    const hgt=4.8+(i%3)*0.5; box(dg,px,pz,0.05,0.05,0,hgt,0,C('#d9d2c6')); dg.tri(px,hgt,pz,px,hgt-1.4,pz,px+1.0,hgt-0.45,pz+0.25,fl); dg.tri(px,hgt,pz,px+1.0,hgt-0.45,pz+0.25,px,hgt-1.4,pz,fl); }
  for(const s of [-1,1]){ const cx=x+s*3.4, cz=z+7.4; box(dg,cx,cz,5.4,3.6,0,0.12,0,C('#5a4232'));                         // netted flower beds by the path
    for(let k=0;k<14;k++) box(dg,cx-2.4+(k%7)*0.8,cz-1.0+Math.floor(k/7)*1.6,0.18,0.18,0.12,0.15,0,C('#5d8f3a'));
    for(const [a,b,w,d] of [[0,-1.8,5.4,0.03],[0,1.8,5.4,0.03],[-2.7,0,0.03,3.6],[2.7,0,0.03,3.6]]) box(dg,cx+a,cz+b,w,d,0,0.9,0,C('#d9d6cf')); }
  box(dg,x,z+7.4,1.4,3.8,0,0.06,0,C('#bdb9b0'));                                       // concrete path to the gate
  markOcc(x,z,7.5); markOcc(x,z+7.5,4.5); xLamps.push([x+1.8,z+9.5,0,1,1]); (data.trees||(data.trees=[])).push([x+6.5,z-7.5]); }
