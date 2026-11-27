// Swimming pool, football and hockey ground fences and floodlights.
// ---- Institute Swimming Pool (from the campus tour videos): red-brick boundary wall with a mesh fence on top and gabled sign headers,
//      grey tiled deck, lane ropes, numbered starting blocks, steel ladders, a spectator rail, the diving pool with its board, floodlights
{ const red=C('#c8402c'), cop=C('#ece8e0'), mesh=C('#c3c8cc'), deck=C('#cfd2cf'), stl=C('#d9dde0');
  const ring=[[-362,869],[-362,856],[-387,856],[-387,954],[-334,954],[-334,889]];
  fillPoly(dg,[ring.concat([[-340,889],[-340,869]])],0.07,deck);
  oc.fillStyle='#fff'; oc.fillRect(toPx(-388),toPx(855),55*pxPerM,100*pxPerM);
  const wall=(x0,z0,x1,z1,gap)=>{ const L=Math.hypot(x1-x0,z1-z0), a=Math.atan2(z1-z0,x1-x0), ux=(x1-x0)/L, uz=(z1-z0)/L;
    const segs=gap?[[0,gap[0]],[gap[1],L]]:[[0,L]];
    for(const [s0,s1] of segs){ const m=(s0+s1)/2, w=s1-s0; if(w<0.3) continue; const mx=x0+ux*m, mz=z0+uz*m;
      box(dg,mx,mz,w,0.35,0,2.0,a,red); box(dg,mx,mz,w,0.45,2.0,0.12,a,cop);
      for(const y of [2.15,3.0,3.75]) box(dg,mx,mz,w,0.05,y,0.05,a,mesh);
      for(let t=s0;t<=s1+0.01;t+=3){ box(dg,x0+ux*t,z0+uz*t,0.08,0.08,2.1,1.7,0,mesh); }
      for(let t=s0+0.25;t<s1;t+=0.5) box(dg,x0+ux*t,z0+uz*t,0.02,0.02,2.15,1.6,0,mesh); } };
  wall(-362,869,-362,856); wall(-362,856,-387,856); wall(-387,856,-387,954,[40,45]); wall(-387,954,-334,954); wall(-334,954,-334,889);
  // gate on the road side, with the gabled red sign header "SWIMMING POOL"
  for(const z of [896,901]) box(dg,-387,z,0.7,0.7,0,2.9,0,red);
  for(let k=0;k<12;k++) box(dg,-387.1,896.6+k*0.36,0.05,0.04,0.1,2.0,0,C('#2b2f33')); box(dg,-387.1,898.5,0.06,4.2,1.9,0.08,0,C('#2b2f33'));
  for(const z of [880,926]){ box(dg,-387,z,0.4,4.2,2.0,0.7,0,red); dg.tri(-387.2,2.7,z-2.1,-387.2,2.7,z+2.1,-387.2,3.7,z,red); dg.tri(-386.8,2.7,z-2.1,-386.8,3.7,z,-386.8,2.7,z+2.1,red);
    plane(-387.25,2.6,z,-Math.PI/2,3.0,0.75,txt(['तरण ताल','SWIMMING POOL'],'#c8402c','#ffffff','bold 44px sans-serif',512,128),0); }
  // main pool: coping, lane ropes, starting blocks with numbers, ladders, and the steel rail on the spectator side
  const X0=-363.7,X1=-343.2,Z0=896,Z1=945.7;
  for(const [cx,cz,w,d] of [[(X0+X1)/2,Z0,X1-X0+0.8,0.5],[(X0+X1)/2,Z1,X1-X0+0.8,0.5],[X0,(Z0+Z1)/2,0.5,Z1-Z0],[X1,(Z0+Z1)/2,0.5,Z1-Z0]]) box(dg,cx,cz,w,d,0.05,0.12,0,cop);
  for(let k=1;k<8;k++){ const x=X0+(X1-X0)*k/8; for(let z=Z0+0.5;z<Z1-0.5;z+=1.0) box(dg,x,z+0.25,0.09,0.5,0.1,0.06,0,C(((z-Z0)<5||(Z1-z)<5)?'#d9372b':(Math.floor(z)%2?'#f2f2ee':'#2a6fd1'))); }
  for(let k=0;k<8;k++){ const x=X0+(X1-X0)*(k+0.5)/8; box(dg,x,Z1+0.8,0.55,0.6,0,0.75,0,C('#f2f1ec')); box(dg,x,Z1+0.75,0.5,0.55,0.75,0.06,0,C('#d9372b'));
    plane(x,0.45,Z1+0.49,Math.PI,0.36,0.3,txt([String(k+1)],'#ffffff','#d9372b','bold 90px sans-serif',128,110),0); }
  for(const [x,z] of [[X0+1.2,Z0+0.2],[X1-1.2,Z0+0.2],[X0+1.2,Z1-0.2],[X1-1.2,Z1-0.2]]) for(const s of [-0.3,0.3]){ box(dg,x+s,z,0.05,0.05,0.1,1.0,0,stl); }
  for(let z=Z0+2;z<Z1;z+=2.5) box(dg,-339,z,0.05,0.05,0,1.1,0,stl); for(const y of [0.55,1.1]) box(dg,-339,(Z0+Z1)/2,0.05,Z1-Z0-2,y,0.05,0,stl);
  // diving pool coping and the board at its far end
  { const x0=-382.4,x1=-369.9,z0=861.3,z1=885.9; for(const [cx,cz,w,d] of [[(x0+x1)/2,z0,x1-x0+0.8,0.5],[(x0+x1)/2,z1,x1-x0+0.8,0.5],[x0,(z0+z1)/2,0.5,z1-z0],[x1,(z0+z1)/2,0.5,z1-z0]]) box(dg,cx,cz,w,d,0.05,0.12,0,cop);
    const bxx=(x0+x1)/2; box(dg,bxx,z0-1.2,2.2,2.2,0,3.0,0,C('#2f8f6b')); box(dg,bxx,z0+1.4,0.55,4.6,3.0,0.12,0,C('#e9e7e1')); for(const s of [-1,1]) box(dg,bxx+s*1.0,z0-1.2,0.06,2.2,3.0,1.0,0,stl);
    for(let k=0;k<10;k++) box(dg,bxx+1.35,z0-1.9+k*0.2,0.5,0.18,k*0.3,0.06,0,C('#9aa0a6')); }
  // floodlights at the corners, and the red office block's pool-side door
  for(const [x,z] of [[-385,858],[-385,952],[-336,952],[-336,893]]){ box(dg,x,z,0.25,0.25,0,9,0,C('#8d9398')); box(dg,x,z,1.2,0.5,9,0.5,0,C('#5d6267')); box(glowS,x,z,1.0,0.45,8.98,0.05,0,C('#f3efe6')); }
  box(dg,-345,889.2,1.8,0.2,0,2.4,0,C('#5a4334')); }

// ---- football and hockey grounds (from the video): green steel railing fences with curved rails round both pitches, and floodlight masts at the hockey ground
{ const gr=C('#2f7d4a'), gr2=C('#3d9a5c');
  const fence=(x0,x1,z0,z1,gap)=>{ const sides=[[x0,z0,x1,z0],[x1,z0,x1,z1],[x1,z1,x0,z1],[x0,z1,x0,z0]];
    for(const [ax,az,bx_,bz] of sides){ const L=Math.hypot(bx_-ax,bz-az), a=Math.atan2(bz-az,bx_-ax), ux=(bx_-ax)/L, uz=(bz-az)/L;
      for(let t=0;t<L;t+=2.5){ const m=Math.min(2.5,L-t), cx=ax+ux*(t+m/2), cz=az+uz*(t+m/2); if(gap&&Math.hypot(cx-gap[0],cz-gap[1])<3) continue;
        box(dg,ax+ux*t,az+uz*t,0.1,0.1,0,1.5,0,gr); box(dg,cx,cz,m,0.06,1.42,0.08,a,gr); box(dg,cx,cz,m,0.06,0.25,0.06,a,gr);
        for(let q=0.25;q<m;q+=0.5) box(dg,ax+ux*(t+q),az+uz*(t+q),0.03,0.03,0.25,1.1+0.12*Math.sin(q/m*Math.PI),0,gr2); } } };
  fence(-475,-411,776,875,[-443,875]); fence(-562,-479,749,866,[-520,866]);
  for(const [x,z] of [[-476,780],[-410,780],[-476,871],[-410,871]]){ box(dg,x,z,0.5,0.5,0,20,0,C('#8d9398')); box(dg,x,z,2.6,0.4,20,1.8,0,C('#4e5358')); box(glowS,x+(x>-443?-0.22:0.22),z,0.06,2.4,20.1,1.5,0,C('#f3efe6')); } }
