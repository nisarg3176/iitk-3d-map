// Open Air Theatre (stage, bowl, stage house, wings), SAC tower, Students' Activity Centre and Indoor Sports Complex, OAT/SAC boundary wall, New SAC Road lanterns and gate board.
// ---- Open Air Theatre: stepped semicircle facing the SAC stage, plus the glass tower
{ const cx=-532, cz=940, seat=C('#cfcac0'), seat2=C('#bdb7aa');
  disc(dg,cx,cz,6,0.7,C('#a9a196'),40);   // the stage: a raised half-round platform, its curved front painted
  // murals on the outer ring
  const mur=['#2f74c0','#e0b33a','#c8453a','#3f9b6a'];
  for(let s=0;s<30;s++){ const a=Math.PI+(s+0.5)/30*Math.PI; box(dg,cx+Math.cos(a)*6.05,cz+Math.sin(a)*6.05,1.25,0.12,0.08,0.56,a+Math.PI/2,C(mur[s%4])); }
  markOcc(cx,cz-10,22); markOcc(cx,cz+2,12);   // keep trees off the stage
  // glass lift tower (from the photos): a tapering red-brick base with a doorway, a square glass shaft rising out of it,
  //   a balcony ring near the top and an octagonal concrete cabin with a wide overhanging roof
  const tx=-512, tz=906, brk=C('#8e4a36'), brk2=C('#7a3e2d');
  { const B0=3.8, B1=1.9, Hb=10; const P=(s,h)=>[tx+s[0]*(B0+(B1-B0)*h/Hb),h,tz+s[1]*(B0+(B1-B0)*h/Hb)];
    const S=[[-1,-1],[1,-1],[1,1],[-1,1]]; for(let i=0;i<4;i++){ const a=S[i], b=S[(i+1)%4]; const A=P(a,0),Bq=P(b,0),Cq=P(b,Hb),D=P(a,Hb); const col=i%2?brk:brk2;
      dg.tri(A[0],A[1],A[2],Bq[0],Bq[1],Bq[2],Cq[0],Cq[1],Cq[2],col); dg.tri(A[0],A[1],A[2],Cq[0],Cq[1],Cq[2],D[0],D[1],D[2],col); dg.tri(A[0],A[1],A[2],Cq[0],Cq[1],Cq[2],Bq[0],Bq[1],Bq[2],col); dg.tri(A[0],A[1],A[2],D[0],D[1],D[2],Cq[0],Cq[1],Cq[2],col); }
    box(dg,tx,tz+B0+0.02,1.4,0.15,0,2.6,0,C('#3a2c24')); box(dg,tx,tz+B0+0.1,2.0,0.4,2.6,0.25,0,C('#b9ad98'));
    box(dg,tx,tz,B1*2+0.3,B1*2+0.3,Hb,0.35,0,C('#b9ad98')); }
  { const sh=addMesh(new THREE.BoxGeometry(2.8,12,2.8),glassMat,tx,10.35+6,tz); sh.castShadow=false;
    for(const [ox,oz] of [[-1.4,-1.4],[1.4,-1.4],[1.4,1.4],[-1.4,1.4]]) box(dg,tx+ox,tz+oz,0.16,0.16,10.35,12,0,C('#c9ccce'));
    for(let y=12;y<22.3;y+=2.6) box(dg,tx,tz,3.0,3.0,y,0.12,0,C('#c9ccce')); }
  addMesh(new THREE.CylinderGeometry(2.6,2.6,0.3,8),stdMat(0xbfb4a1),tx,22.5,tz,Math.PI/8);
  for(let k=0;k<16;k++){ const a=k/16*Math.PI*2; box(dg,tx+Math.cos(a)*2.5,tz+Math.sin(a)*2.5,0.06,0.06,22.65,1.0,0,C('#5d5a56')); }
  addMesh(new THREE.TorusGeometry(2.5,0.04,4,16),stdMat(0x5d5a56),tx,23.65,tz).rotation.x=Math.PI/2;
  addMesh(new THREE.CylinderGeometry(1.75,1.75,2.4,8),stdMat(0xd4c9b4),tx,23.85,tz,Math.PI/8);
  for(let k=0;k<8;k++){ const a=(k+0.5)/8*Math.PI*2; box(glowW,tx+Math.cos(a)*1.66,tz+Math.sin(a)*1.66,0.9,0.05,23.2,0.9,-a+Math.PI/2,C('#3b4a55')); }
  addMesh(new THREE.CylinderGeometry(3.1,2.4,0.55,8),stdMat(0xbfb4a1),tx,25.35,tz,Math.PI/8);
  addMesh(new THREE.CylinderGeometry(1.0,1.2,0.6,8),stdMat(0xbfb4a1),tx,25.9,tz,Math.PI/8);
  markOcc(tx,tz,5);
  labels.push({name:'SAC Tower',x:tx,z:tz,y:28,rank:4,tier:3,cat:'civic',alt:['Glass tower','Lift tower SAC'],size:6}); }

// ---- New SAC / Indoor Sports Complex and the SAC block: sandstone walls over a red ground floor, orange pergola beams;
//      the glass entrance fills the recess in the WEST face (towards the SAC lawn and the OAT), with hedged lawns in front
for(const o of decos){ if(o.st!==STY.sac) continue; const red=C('#b8452e');
  for(const e of edges(o.outer)) if(e.L>2.5){ cl(e,0,e.L,0,3.3,red,0.06); band(e,3.3,0.35,0.3,0.6,C('#e2cfae'),0.2); } }

{ const b=BN(/^Indoor Sports Complex$/); if(b){ const og=C('#e0782c'), fr=C('#6d6a66');
  const N=[[-464,922],[-460,924],[-465,934],[-470,931]];                      // the recess, from the map outline
  ringPrism([N],0,b.H-0.65,C('#9cc2cf')); for(let i=0;i<N.length;i++) quad(paneL,N[i],N[(i+1)%N.length],0.2,b.H-1.0,C('#9cc2cf'));
  const ox=-467, oz=926.5, ux=-6/10.82, uz=9/10.82, nx=-uz, nz=ux, ang=Math.atan2(uz,ux);   // opening line and its outward normal (west)
  for(let k=0;k<=9;k++){ const t=-5+k*1.1; box(dg,ox+ux*t+nx*0.12,oz+uz*t+nz*0.12,0.12,0.12,0,b.H-0.65,ang,fr); }
  for(const y of [3.4,6.8]) box(dg,ox+nx*0.12,oz+nz*0.12,10.6,0.12,y,0.14,ang,fr);
  for(let k=0;k<12;k++){ const t=-5.2+k*0.95; box(dg,ox+ux*t+nx*2.2,oz+uz*t+nz*2.2,0.28,4.6,4.4,0.42,ang,og); }   // orange pergola beams
  for(const s of [-5,5]) box(dg,ox+ux*s+nx*4.2,oz+uz*s+nz*4.2,0.45,0.45,0,4.4,ang,og);
  box(dg,ox+nx*4.25,oz+nz*4.25,11,0.45,4.85,0.45,ang,og);
  for(let k=0;k<3;k++) box(dg,ox+nx*(5.4+k*0.45),oz+nz*(5.4+k*0.45),8,0.45,0,0.45-k*0.15,ang,C('#d7cfc0'));
  for(const s of [-1,1]) for(let r=0;r<3;r++){ const cx2=ox+ux*s*7.2+nx*(6.5+r*2.4), cz2=oz+uz*s*7.2+nz*(6.5+r*2.4); box(dg,cx2,cz2,5.5,0.9,0,0.9,ang,C('#3f7d35')); }
  markOcc(ox+nx*6,oz+nz*6,7); } }

// SAC block behind the OAT: orange truss beams along the upper floor on its faces
for(const o of decos){ if(o.st!==STY.sac) continue; const [ccx,ccz]=centroid(o.outer); if(Math.hypot(ccx+522,ccz-948)>8) continue; const og=C('#e0782c');
  for(const e of edges(o.outer)) if(e.L>8){ const n=Math.floor(e.L/1.6); for(let k=0;k<n;k++) bx(e,(k+0.5)*e.L/n,0.8,0.2,1.6,7.0,0.3,og); band(e,7.3,0.25,1.6,0.25,og); } }

// ---- Open Air Theatre: sandstone-grey tiers with stepped aisles and low divider walls, a rim walk with railing, lamp posts,
//      a control box and concrete canopy frames. Both ends are open (stairs down each side); the food court is an arcade under the back rows.
{ const cx=-532, cz=940, R=21.5, r0=6, NT=13, top=5.6, rise=top/NT, dr=(R-1.2-r0)/NT, AE=1.88*Math.PI, SP=AE-Math.PI;
  const tread=C('#bab4a9'), riser=C('#8c867c'), aisleC=C('#d4cec3'), conc=C('#c9c2b5'), railC=C('#8a4a2e'), beige=C('#dccfb8');
  const P=(a,r)=>[cx+Math.cos(a)*r,cz+Math.sin(a)*r];
  const aisles=[1.05,1.32,1.6,1.83].map(f=>f*Math.PI), inA=(a,r)=>aisles.some(q=>Math.abs(a-q)*r<1.1);
  const seg=52;
  for(let k=0;k<NT;k++){ const ra=r0+k*dr, rb=ra+dr, y=(k+1)*rise;
    for(let s=0;s<seg;s++){ const a0=Math.PI+SP*s/seg, a1=Math.PI+SP*(s+1)/seg, A=P(a0,ra),B=P(a1,ra),Cq=P(a1,rb),D=P(a0,rb);
      if(inA((a0+a1)/2,(ra+rb)/2)){ const rm=(ra+rb)/2, M0=P(a0,rm), M1=P(a1,rm);
        dg.flat(A[0],A[1],B[0],B[1],M1[0],M1[1],y-rise/2,aisleC); dg.flat(A[0],A[1],M1[0],M1[1],M0[0],M0[1],y-rise/2,aisleC);
        dg.flat(M0[0],M0[1],M1[0],M1[1],Cq[0],Cq[1],y,aisleC); dg.flat(M0[0],M0[1],Cq[0],Cq[1],D[0],D[1],y,aisleC);
        quad(dg,B,A,y-rise,y-rise/2,riser); quad(dg,M1,M0,y-rise/2,y,riser); }
      else { dg.flat(A[0],A[1],B[0],B[1],Cq[0],Cq[1],y,tread); dg.flat(A[0],A[1],Cq[0],Cq[1],D[0],D[1],y,tread); quad(dg,B,A,y-rise,y,riser); } } }
  for(const a of [Math.PI,AE]) for(let k=0;k<NT;k++){ const ra=r0+k*dr; quad(dg,P(a,ra),P(a,ra+dr),0,(k+1)*rise,conc); }
  // low divider walls beside every aisle (as in the photos), sloping with the tiers
  for(const q of aisles) for(const sd of [-1,1]){ const rm=(r0+R)/2, a=q+sd*1.2/rm, p0=P(a,r0+dr), p1=P(a,R-1.2);
    q3([p0[0],rise,p0[1]],[p1[0],top,p1[1]],[p1[0],top+0.55,p1[1]],[p0[0],rise+0.55,p0[1]],beige); }
  // rim walk, railing and the outer face (open below the back rows where the food court is)
  const F0=1.14*Math.PI, F1=1.53*Math.PI, inF=a=>a>F0&&a<F1, rs=44;
  for(let s=0;s<rs;s++){ const a0=Math.PI+SP*s/rs, a1=Math.PI+SP*(s+1)/rs, am=(a0+a1)/2, A=P(a0,R-1.2),B=P(a1,R-1.2),Cq=P(a1,R),D=P(a0,R);
    dg.flat(A[0],A[1],B[0],B[1],Cq[0],Cq[1],top,aisleC); dg.flat(A[0],A[1],Cq[0],Cq[1],D[0],D[1],top,aisleC);
    quad(dg,P(a0,R-0.06),P(a1,R-0.06),top+0.95,top+1.05,railC); quad(dg,P(a0,R-0.06),P(a1,R-0.06),top+0.5,top+0.56,railC);
    const [px,pz]=P(a0,R-0.06); box(dg,px,pz,0.07,0.07,top,1.05,a0,railC);
    quad(dg,P(a0,R),P(a1,R),inF(am)?5.0:0,top,C('#cdbb9b')); }
  // open ends: paved ground paths into the bowl beside the stage on both sides
  for(const [a0,a1] of [[Math.PI-0.09,Math.PI],[AE,AE+0.09]]){ const n=6; for(let i=0;i<n;i++){ const b0=a0+(a1-a0)*i/n, b1=a0+(a1-a0)*(i+1)/n, A=P(b0,r0),B=P(b1,r0),Cq=P(b1,R+2),D=P(b0,R+2);
    dg.flat(A[0],A[1],B[0],B[1],Cq[0],Cq[1],0.06,C('#cfc6b6')); dg.flat(A[0],A[1],Cq[0],Cq[1],D[0],D[1],0.06,C('#cfc6b6')); } }
  // stairs up the outside at both ends to the rim walk
  for(const [a,dir] of [[Math.PI+0.012,1],[AE-0.012,-1]]){ const n=Math.round(top/0.19), rr2=R+1.0;
    for(let i=0;i<n;i++){ const aa=a+dir*(i+0.5)*0.3/rr2, [x,z]=P(aa,rr2); box(dg,x,z,0.32,1.8,0,(i+1)*top/n,aa+Math.PI/2,conc); }
    for(let i=0;i<n;i+=2){ const aa=a+dir*(i+0.5)*0.3/rr2, [x,z]=P(aa,rr2+0.9); box(dg,x,z,0.06,0.06,(i+1)*top/n,1.0,aa,railC); } }
  // tall lamp posts with square heads, the control box and two open canopy frames on the rim
  for(let f=1.04;f<1.87;f+=0.115){ const a=f*Math.PI, [x,z]=P(a,R-0.45); box(dg,x,z,0.2,0.2,top,4.6,a,C('#4d4a47')); box(dg,x,z,0.75,0.5,top+4.5,0.5,a,C('#6e4b39')); }
  { const a=1.74*Math.PI, [x,z]=P(a,R-2.2); box(dg,x,z,4.2,3.4,top,3.0,a+Math.PI/2,beige); box(dg,x,z,4.6,3.8,top+3.0,0.3,a+Math.PI/2,C('#c9bca4'));
    const [wx,wz]=P(a,R-3.92); box(dg,wx,wz,2.4,0.06,top+1.2,1.1,a+Math.PI/2,C('#2b3640')); const [dx2,dz2]=P(a+0.06,R-0.5); box(dg,dx2,dz2,0.9,0.06,top,2.1,a,C('#d9567a')); }
  for(const f of [1.36,1.62]){ const a=f*Math.PI, t=a+Math.PI/2, [x,z]=P(a,R-0.9); for(const s of [-1.5,1.5]) box(dg,x+Math.cos(t)*s,z+Math.sin(t)*s,0.5,0.5,top,3.3,t,beige); box(dg,x,z,4.0,2.2,top+3.3,0.4,t,beige); }
  // murals on the two end walls, facing the stage
  const mural=tex((g,W,H)=>{ g.fillStyle='#2b2f3a'; g.fillRect(0,0,W,H); const cs=['#f2c230','#e8453c','#2f9bd8','#3fbf6a','#ef7fb4','#ffffff'];
    for(let i=0;i<26;i++){ g.fillStyle=cs[i%cs.length]; g.beginPath(); g.ellipse((i*97)%W,(i*53)%H,30+(i*13)%60,18+(i*7)%40,(i%5)*0.6,0,7); g.fill(); }
    g.font='bold 120px sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.lineWidth=10; g.strokeStyle='#111'; g.strokeText('OAT',W/2,H/2); g.fillStyle='#fdf2a0'; g.fillText('OAT',W/2,H/2); },512,180);
  for(const [a,sg] of [[Math.PI,1],[AE,-1]]){ const rm=r0+dr*3, [x,z]=P(a,rm), nx=-Math.sin(a)*sg, nz=Math.cos(a)*sg; plane(x+nx*0.08,1.1,z+nz*0.08,Math.atan2(nx,nz),dr*5.5,1.6,mural,0); }
  // the food court: shopfronts set back under the back rows, columns, a raised platform with stone benches, stairs up on both sides
  const fr=R-1.4, shopW=C('#d8d1c4');
  for(let s=0;s<rs;s++){ const a0=Math.PI+SP*s/rs, a1=Math.PI+SP*(s+1)/rs, am=(a0+a1)/2; if(!inF(am)) continue;
    const A=P(a0,fr),B=P(a1,fr),Cq=P(a1,R+0.25),D=P(a0,R+0.25); dg.flat(A[0],A[1],B[0],B[1],Cq[0],Cq[1],5.4,conc); dg.flat(A[0],A[1],Cq[0],Cq[1],D[0],D[1],5.4,conc);
    dg.flat(A[0],A[1],B[0],B[1],Cq[0],Cq[1],5.0,C('#b7b0a4')); dg.flat(A[0],A[1],Cq[0],Cq[1],D[0],D[1],5.0,C('#b7b0a4')); quad(dg,D,Cq,5.0,5.4,conc);
    quad(dg,P(a0,fr),P(a1,fr),0,5.0,shopW); }
  for(let i=0;i<=7;i++){ const a=F0+(F1-F0)*i/7, [x,z]=P(a,R+0.05); box(dg,x,z,0.6,0.6,0,5.0,a,conc); }
  const shops=[[null,'#8a8f95','',1.18],['NAUGHTY BLENDERS','#f5f7fb','#1f4fb8',1.24],['BURGER SINGH','#1f4fb8','#ffd23f',1.30],["Aladdin's",'#231818','#ff5252',1.36],[null,'#8a8f95','',1.42],["Domino's",'#0b5ea8','#ffffff',1.48]];
  for(const [nm,bg,fg,af] of shops){ const a=af*Math.PI, ha=0.029*Math.PI, ry=Math.atan2(Math.cos(a),Math.sin(a)), tg=a+Math.PI/2;
    const f0=P(a-ha,fr+0.06), f1=P(a+ha,fr+0.06); if(!nm){ quad(dg,f0,f1,0.1,3.2,C('#80858b')); continue; }
    quad(dg,f0,f1,0,3.2,C(bg).multiplyScalar(0.8)); quad(paneL,P(a-ha*0.8,fr+0.1),P(a+ha*0.2,fr+0.1),0.95,2.7,C('#f3dfae')); quad(dg,P(a+ha*0.38,fr+0.1),P(a+ha*0.85,fr+0.1),0,2.5,C('#5e4130'));
    const [fx,fz]=P(a,fr+0.2); box(dg,fx,fz,3.85,0.35,3.2,1.4,tg,C(bg)); const [sx,sz]=P(a,fr+0.39); plane(sx,3.9,sz,ry,3.65,1.15,txt([nm],bg,fg,'bold 60px sans-serif',512,150),1);
    const [kx,kz]=P(a-ha*0.3,fr+0.7); box(dg,kx,kz,2.0,0.7,0,1.05,tg,C(bg).multiplyScalar(0.65)); }
  { const b0=F0-0.025*Math.PI, b1=F1+0.025*Math.PI, n=30; for(let i=0;i<n;i++){ const a0=b0+(b1-b0)*i/n, a1=b0+(b1-b0)*(i+1)/n, A=P(a0,R+2.2),B=P(a1,R+2.2),Cq=P(a1,R+6.8),D=P(a0,R+6.8);
      dg.flat(A[0],A[1],B[0],B[1],Cq[0],Cq[1],0.35,C('#bdb6aa')); dg.flat(A[0],A[1],Cq[0],Cq[1],D[0],D[1],0.35,C('#bdb6aa')); quad(dg,D,Cq,0,0.35,C('#a59e92')); quad(dg,B,A,0,0.35,C('#a59e92'));
      if(i%3===1){ const am=(a0+a1)/2, [x,z]=P(am,R+6.2); box(dg,x,z,2.6,0.6,0.35,0.45,am+Math.PI/2,C('#d3ccc0')); } } }
  markOcc(cx,cz-12,26); labels.push({name:'OAT Food Court',x:cx-6,z:cz-R-5,y:7,rank:4,tier:3,cat:'food',alt:['Food court','Food court below OAT','OAT shops'],size:12}); }

// ---- OAT stage house (from the photos and the drone shot): beige exposed-concrete frame with a recessed white screen in the middle,
//      red walls either side, blue panels at the base, a graffiti wall on the right, terraces and projecting pergola beams above,
//      a glass pyramid skylight on the roof, and two tall floodlight masts behind the rim
{ const X=-532, Zf=943.2, bg=C('#d9c6a2'), bg2=C('#c8b38d'), red=C('#b5432f'), blue=C('#2f8fd0'), wht=C('#f3f1ec');
  // red back wall, with the recessed white screen in the middle under a deep beige frame
  box(dg,X,Zf+3.6,28,0.6,0,10.4,0,red); box(dg,X,Zf+6.5,28,5.6,0,9.8,0,bg2);
  box(glowW,X,Zf+3.2,12.4,0.2,1.0,5.6,0,wht); box(dg,X,Zf+2.2,13.6,2.2,0,0.9,0,bg2);
  for(const s of [-1,1]) box(dg,X+s*7.2,Zf+1.6,1.2,4.0,0,8.2,0,bg);
  { const ox=X, oz=Zf+2.2, n=28, r0=1.5, r1=8.2, y0=8.0, y1=8.7, Q=(a,r)=>[ox+Math.cos(a)*r,oz+Math.sin(a)*r];   // curved concrete roof over the stage, its edge following the stage
    for(let i=0;i<n;i++){ const a0=Math.PI+Math.PI*i/n, a1=Math.PI+Math.PI*(i+1)/n, A=Q(a0,r0),B=Q(a1,r0),Cq=Q(a1,r1),D=Q(a0,r1);
      dg.flat(A[0],A[1],B[0],B[1],Cq[0],Cq[1],y1,bg); dg.flat(A[0],A[1],Cq[0],Cq[1],D[0],D[1],y1,bg); dg.flat(A[0],A[1],Cq[0],Cq[1],B[0],B[1],y0,bg2); dg.flat(A[0],A[1],D[0],D[1],Cq[0],Cq[1],y0,bg2);
      quad(dg,D,Cq,y0-0.35,y1,bg); quad(dg,Cq,D,y0-0.35,y1,bg); if(i%4===2){ const [lx,lz]=Q((a0+a1)/2,r1-0.6); box(glowS,lx,lz,0.5,0.5,y0-0.02,0.04,0,C('#fff1d6')); } }
    for(const a of [Math.PI*1.25,Math.PI*1.75]){ const [px,pz]=Q(a,r1-0.4); box(dg,px,pz,0.55,0.55,0.7,y0-0.7,0,bg); } }
  // beside the screen (from the photos): to the audience's left a tall red wall framed in beige with a small beige room and window at its foot,
  //   the blue "TEC IT" wall lower down by the end of the seats; to the right a red wall with the big graffiti mural at stage level;
  //   an orange steel lighting truss across the top of the opening
  const og=C('#d4672a');
  for(const s of [-1,1]){ box(dg,X+s*10.9,Zf+0.55,6.2,0.5,0,8.4,0,red); box(dg,X+s*7.9,Zf+0.3,0.9,1.0,0,8.9,0,bg); box(dg,X+s*13.95,Zf+0.3,0.9,1.0,0,8.9,0,bg); box(dg,X+s*10.9,Zf+0.3,6.9,1.0,8.4,0.9,0,bg); }
  box(dg,X+10,Zf+0.25,1.0,0.1,0.7,2.2,0,C('#4a3a30'));
  
  const gr=tex((g,W,H)=>{ g.fillStyle='#f4e7c9'; g.fillRect(0,0,W,H); const cs=['#e8322b','#ffd23f','#21a7f2','#2b2b2b','#ff7b29','#1e7f4e'];
    for(let i=0;i<22;i++){ g.fillStyle=cs[i%cs.length]; g.beginPath(); g.moveTo((i*53)%W,H); g.lineTo(((i*53)%W)+40+(i%4)*25,0); g.lineTo(((i*53)%W)+90,H); g.fill(); }
    g.fillStyle='#c8102e'; g.beginPath(); g.ellipse(W*0.42,H*0.5,70,62,0,0,7); g.fill(); g.fillStyle='#111'; g.beginPath(); g.ellipse(W*0.38,H*0.46,16,11,0.3,0,7); g.ellipse(W*0.47,H*0.46,16,11,-0.3,0,7); g.fill();
    g.font='bold 54px sans-serif'; g.lineWidth=8; g.strokeStyle='#111'; g.fillStyle='#fff'; g.strokeText('OH SH*T..',W*0.62,H*0.3); g.fillText('OH SH*T..',W*0.62,H*0.3); },512,200);
  plane(X-11.2,1.75,Zf+0.25,Math.PI,5.8,2.3,gr,0);
  { const tr=(x0,x1,y,z)=>{ const L=x1-x0; box(dg,(x0+x1)/2,z,L,0.14,y,0.14,0,og); box(dg,(x0+x1)/2,z,L,0.14,y+0.9,0.14,0,og);
      const n=Math.round(L/1.1); for(let k=0;k<n;k++){ const xa=x0+L*k/n, xb=x0+L*(k+1)/n; const dx=xb-xa, len=Math.hypot(dx,0.9), an=Math.atan2(0.9,dx)*(k%2?-1:1);
        const m=addMesh(new THREE.BoxGeometry(len,0.1,0.1),stdMat(0xd4672a),(xa+xb)/2,y+0.52,z); m.rotation.z=an; m.castShadow=false; } };
    tr(X-7.4,X+7.4,7.0,Zf-0.05); tr(X+8.2,X+14,9.5,Zf+0.2); box(dg,X+2.5,Zf-0.1,1.0,0.6,7.6,0.6,0,C('#2f9b55')); }
  { const px=[X-3,X+2.2]; for(const x of px) box(dg,x,Zf+3.2,0.8,0.8,10.4,5.4,0,bg); box(dg,(px[0]+px[1])/2,Zf+3.2,6.4,0.9,15.4,0.9,0,bg); }
  // top: a beige box room on the left and a pergola of concrete beams across the top
  box(dg,X-6,Zf+4.5,6,5,9.8,3.4,0,bg); box(dg,X-6,Zf+4.5,6.4,5.4,13.2,0.3,0,bg2); box(glowW,X-6,Zf+1.98,2.4,0.05,10.8,1.4,0,C('#36404a'));
  for(let x=-13.8;x<=13.9;x+=2.3) box(dg,X+x,Zf+3.2,0.3,6.0,11.0,0.45,0,bg2); box(dg,X,Zf+0.4,28.4,0.6,11.0,0.6,0,bg);
  { const pm=new THREE.MeshLambertMaterial({color:0x9fd3d8,transparent:true,opacity:0.7}); for(const x of [3,9]){ const py=addMesh(new THREE.ConeGeometry(2.6,2.2,4),pm,X+x,11.2,Zf+7,Math.PI/4); py.castShadow=false; } }
  // two tall floodlight masts behind the rim
  for(const f of [1.22,1.66]){ const a=f*Math.PI, r=21.5+4.5, x=-532+Math.cos(a)*r, z=940+Math.sin(a)*r;
    box(dg,x,z,0.45,0.45,0,19,0,C('#8d9398')); box(dg,x,z,2.6,0.6,19,1.6,-a+Math.PI/2,C('#4e5358')); box(glowS,x-Math.cos(a)*0.32,z-Math.sin(a)*0.32,2.4,0.08,19.1,1.4,-a+Math.PI/2,C('#f3efe6')); markOcc(x,z,1.5); }
  markOcc(X,Zf+4,14); }

// ---- the two wings at the OAT ends (from the photos and the drone shot), each laid exactly along the end wall of the seats, from the
//      stage up past the rim, and closed against the stage house. Left (east, to the audience): rooms at the bottom with the blue "TEC IT"
//      wall facing the stage, open vine-covered frames above with orange trusses and the curved drum, no corridor. Right (west): a block
//      whose upper levels are open corridors with railings, red and grey walls behind, the graffiti side towards the stage.
const oatWing=(A,B,nv,corr,W)=>{ const ux=(B[0]-A[0]), uz=(B[1]-A[1]), L=Math.hypot(ux,uz), u=[ux/L,uz/L], n=nv, ang=Math.atan2(uz,ux);
  const at=(t,o)=>[A[0]+u[0]*t+n[0]*o, A[1]+u[1]*t+n[1]*o], fr=C('#d6bf98'), fr2=C('#cbbd9f'), og=C('#d4672a'), red=C('#b5432f'), gry=C('#8f9296'), y1=5.6, y2=9.8, top=13.4;
  const nb=Math.max(2,Math.round(L/4.4)), bay=L/nb, wl=(t0,t1,o,y0,y1_,col,th=0.3)=>{ const [x,z]=at((t0+t1)/2,o); box(dg,x,z,t1-t0,th,y0,y1_-y0,ang,col); };
  const ew=(t,o0,o1,y0,y1_,col,th=0.3)=>{ const [x,z]=at(t,(o0+o1)/2); box(dg,x,z,th,o1-o0,y0,y1_-y0,ang,col); };
  // columns on both long faces, beams at each level all round, slabs
  for(let k=0;k<=nb;k++) for(const o of [0.35,W-0.35]){ const [x,z]=at(Math.min(L-0.35,Math.max(0.35,bay*k)),o); box(dg,x,z,0.7,0.7,0,top,ang,fr); }
  for(const y of [y1,y2,top]){ for(const o of [0.35,W-0.35]) wl(0,L,o,y-0.55,y,fr,0.7); for(let k=0;k<=nb;k++) ew(Math.min(L-0.35,Math.max(0.35,bay*k)),0,W,y-0.55,y,fr,0.6); }
  for(const y of [y1,y2]){ const [x,z]=at(L/2,W/2); box(dg,x,z,L,W,y-0.55,0.3,ang,fr2); } { const [x,z]=at(L/2,W/2); box(dg,x,z,L+0.4,W+0.4,top-0.1,0.35,ang,fr); }
  // ground level: closed rooms, a concrete wall along the seats, doors and small windows on the outside
  wl(0,L,0.12,0,y1-0.55,C('#c9c2b5'),0.24);
  for(let k=0;k<nb;k++){ const t0=bay*k+0.35, t1=bay*(k+1)-0.35; wl(t0,t1,W-0.2,0,y1-0.55,k%2?red:fr2,0.25); const [dx,dz]=at((t0+t1)/2,W-0.02); box(glowW,dx,dz,1.0,0.05,0.05,2.3,ang,C('#3a2f28')); }
  ew(L-0.1,0,W,0,top,fr,0.2);
  if(corr){
    // corridors on both upper levels facing the seats, rooms behind
    for(const [y0,yt] of [[y1,y2-0.55],[y2,top-0.1]]){ wl(0,L,0.25,y0+0.95,y0+1.05,C('#5d5a56'),0.08); for(let t=0.6;t<L;t+=1.1){ const [px,pz]=at(t,0.25); box(dg,px,pz,0.06,0.06,y0-0.25,1.25,ang,C('#5d5a56')); }
      for(let k=0;k<nb;k++){ const t0=bay*k+0.35, t1=bay*(k+1)-0.35, col=(k+(y0>6?1:0))%3===0?red:gry; wl(t0,t1,2.4,y0-0.25,yt,col,0.25); const [dx,dz]=at((t0+t1)/2,2.26); box(glowW,dx,dz,1.0,0.05,y0-0.25,2.3,ang,C('#2d3238')); } }
    ew(0.1,0,W,0,top,red,0.25); }
  else {
    for(let k=0;k<nb;k++){ const t=bay*(k+0.5), [vx,vz]=at(t,0.45);
      if(k%2===0) for(let j=0;j<5;j++) box(dg,vx+(j-2)*u[0]*0.7,vz+(j-2)*u[1]*0.7,0.6,0.5,y2-1.6-(j%3)*0.9,1.2+(j%3)*0.9,ang,C(j%2?'#4f8a3a':'#3f7a34'));
      for(let j=0;j<4;j++){ const [gx,gz]=at(t+(j-1.5)*0.9,W/2); box(dg,gx,gz,0.8,0.8,top+0.25,0.55,ang,C(j%2?'#5d9a45':'#467f38')); } }
    // orange steel truss along the seats side, between the first two beams
    const bar3=(p,q,w,col)=>{ const d=[q[0]-p[0],q[1]-p[1],q[2]-p[2]]; let uu=[d[2],0,-d[0]]; const ul=Math.hypot(...uu)||1; uu=uu.map(v=>v/ul*w/2);
      let vv=[d[1]*uu[2]-d[2]*uu[1], d[2]*uu[0]-d[0]*uu[2], d[0]*uu[1]-d[1]*uu[0]]; const vl=Math.hypot(...vv)||1; vv=vv.map(v=>v/vl*w/2);
      const c=(o,a_,b_)=>[o[0]+uu[0]*a_+vv[0]*b_, o[1]+uu[1]*a_+vv[1]*b_, o[2]+uu[2]*a_+vv[2]*b_], K=[[1,1],[1,-1],[-1,-1],[-1,1]];
      for(let i=0;i<4;i++){ const [a1,b1]=K[i],[a2,b2]=K[(i+1)%4]; q3(c(p,a1,b1),c(q,a1,b1),c(q,a2,b2),c(p,a2,b2),col); } };
    const lo=y1+0.15, hi=y1+1.35, n2=Math.round(L/1.3); for(let k=0;k<n2;k++){ const [ax,az]=at(L*k/n2,-0.12), [bx2,bz2]=at(L*(k+1)/n2,-0.12);
      if(k%2) bar3([ax,hi,az],[bx2,lo,bz2],0.12,og); else bar3([ax,lo,az],[bx2,hi,bz2],0.12,og); }
    for(const y of [lo,hi]) wl(0,L,-0.12,y-0.07,y+0.07,og,0.14);
    // the blue "TEC IT" wall on the end facing the stage, a beige parapet above it
    ew(0.05,0,W,0,3.2,C('#2f8fd0'),0.3); ew(0.05,0,W,3.2,y1-0.55,fr2,0.3);
    { const [px,pz]=at(-0.22,W/2); plane(px,1.7,pz,Math.atan2(-u[0],-u[1]),Math.min(W-0.6,4.4),0.9,txt(['TEC        IT'],'#2f8fd0','#ffffff','bold 64px sans-serif',512,90),0); }
    // the curved concrete drum on top, at the end nearest the stage
    { const [cx2,cz2]=at(Math.min(4.2,L/3),W/2), R=Math.min(4.2,W/2-0.4), segs=16; for(let i=0;i<segs;i++){ const a0=i/segs*Math.PI*2, a1=(i+1)/segs*Math.PI*2;
        const p0=[cx2+Math.cos(a0)*R,cz2+Math.sin(a0)*R], p1=[cx2+Math.cos(a1)*R,cz2+Math.sin(a1)*R]; quad(dg,p0,p1,top+0.25,top+3.2,C('#cdb894')); quad(dg,p1,p0,top+0.25,top+3.2,C('#bba582')); }
      disc(dg,cx2,cz2,R,top+3.0,C('#c4b08c'),16); } }
  markOcc(...at(L/2,W/2),Math.min(12,L/2+2)); };

// east (audience's left): along the end wall of the seats at angle 1.88π, from near the stage out past the rim; a low beige room links it to the stage house
{ const a=1.88*Math.PI, e=[Math.cos(a),Math.sin(a)], nO=[-Math.sin(a),Math.cos(a)], P=r=>[-532+e[0]*r,940+e[1]*r];
  oatWing(P(8.5),P(28),nO,false,9.5);
  const A=P(8.5), c0=[A[0]+nO[0]*9.5,A[1]+nO[1]*9.5]; const x0=Math.min(A[0],c0[0]), x1=-518, z0=Math.min(A[1],c0[1])+0.4, z1=943.2;
  box(dg,(x0+x1)/2+0.6,(z0+z1)/2,x1-x0-1.2,z1-z0,0,3.4,0,C('#d9c6a2')); box(dg,(x0+x1)/2+0.6,(z0+z1)/2,x1-x0-0.8,z1-z0+0.4,3.4,0.3,0,C('#c8b38d'));
  box(glowW,(x0+x1)/2+0.6,z0-0.03,1.2,0.05,1.6,0.9,0,C('#36404a')); }

// west (audience's right): its seats-side face on the west end wall of the seats (z = 940), from the stage house corner out past the rim
oatWing([-546.2,940],[-561.5,940],[0,1],true,10.0);

// ---- OAT / SAC compound boundary: brick pillars with alternating solid sandstone panels and white grilles
{ const inBox=p=>p[0]>-575&&p[0]<-392&&p[1]>893&&p[1]<976, brick=C('#9c4a36'), sand=C('#d9c6a0'), white=C('#ecebe6');
  for(const l of DL){ if(l.t!=='wall') continue; const pts=toPts(l.p); if(!pts.every(inBox)) continue;
    const dense=[]; for(let i=0;i<pts.length-1;i++){ const a=pts[i],b=pts[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]); for(let t=0;t<L;t+=0.5) dense.push([a[0]+(b[0]-a[0])*t/L,a[1]+(b[1]-a[1])*t/L]); }
    dense.push(pts[pts.length-1]); let k=0, last=dense[0], acc=0;
    const panel=(a,b,kind)=>{ const dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz); if(L<0.3) return; const ang=Math.atan2(dz,dx), mx=(a[0]+b[0])/2, mz=(a[1]+b[1])/2;
      if(kind){ box(dg,mx,mz,L,0.3,0,2.0,ang,sand); box(dg,mx,mz,L,0.36,2.0,0.12,ang,C('#c9b48d')); }
      else { box(dg,mx,mz,L,0.3,0,0.5,ang,brick); for(const y of [0.55,1.9]) box(dg,mx,mz,L,0.06,y,0.06,ang,white); const nb=Math.max(2,Math.round(L/0.22)); for(let j=1;j<nb;j++){ const t=j/nb-0.5; box(dg,mx+Math.cos(ang)*L*t,mz+Math.sin(ang)*L*t,0.04,0.04,0.5,1.45,ang,white); } } };
    box(dg,last[0],last[1],0.5,0.5,0,2.3,0,brick);
    for(let i=1;i<dense.length;i++){ acc+=Math.hypot(dense[i][0]-dense[i-1][0],dense[i][1]-dense[i-1][1]); if(acc<3&&i<dense.length-1) continue;
      panel(last,dense[i],k%2===0); box(dg,dense[i][0],dense[i][1],0.5,0.5,0,2.3,Math.atan2(dense[i][1]-last[1],dense[i][0]-last[0]),brick); last=dense[i]; acc=0; k++; } } }

// ---- New SAC Road (from the video): thin steel pole frames over the road every 12 m, strung with hanging lanterns (white hexagonal
//      paper lanterns with a few red and orange box lanterns) up to the SAC gate, and the navy "STUDENTS ACTIVITY CENTER" board over the gate
{ const pl=C('#5b6068'), zc=892.7, hw=4.8, lw=[C('#f1eee6'),C('#ece6d6'),C('#e8853a'),C('#c8402c')];
  const lantern=(x,y,z,k)=>{ const col=lw[k%7===3?2:k%9===5?3:k%2]; box(dg,x,z,0.02,0.02,y,0.35,0,pl); if(col===lw[0]||col===lw[1]){ box(glowW,x,z,0.42,0.42,y-0.45,0.45,Math.PI/4,col); box(dg,x,z,0.5,0.5,y-0.08,0.06,Math.PI/4,col); box(dg,x,z,0.5,0.5,y-0.5,0.06,Math.PI/4,col); }
    else { box(glowW,x,z,0.36,0.36,y-0.6,0.6,0,col); } };
  let k=0; for(let x=-396;x>=-506;x-=12){ for(const s of [-1,1]) box(dg,x,zc+s*hw,0.12,0.12,0,5.4,0,pl); box(dg,x,zc,0.08,hw*2,5.3,0.08,0,pl);
    for(let j=-3;j<=3;j++) lantern(x,5.3,zc+j*1.3,k++);
    if(x>-506) for(const s of [-1,1]){ box(dg,x-6,zc+s*hw,12,0.04,5.25,0.04,0,pl); for(let t=1.5;t<12;t+=2.2) lantern(x-t,5.25,zc+s*hw,k++); } }
  // the SAC gate board
  { const gx=-478.9, gz=899.3; for(const s of [-1,1]) box(dg,gx+s*3.6,gz,0.18,0.18,0,4.6,0,pl);
    box(dg,gx,gz,6.4,0.25,3.8,1.25,0,C('#151d33')); box(dg,gx,gz,6.6,0.35,3.75,0.08,0,C('#c9ccd0'));
    plane(gx,4.42,gz-0.14,Math.PI,6.1,1.12,txt(['STUDENTS','ACTIVITY CENTER'],'#151d33','#ffffff','bold 52px sans-serif',512,128),1); } }
