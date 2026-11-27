// Life: traffic, cyclists, people, car lights, birds.
/* ================= LIFE: traffic, cyclists, people, birds ================= */
const LIFE={on:true};
function buildNet(list){ const polys=[]; let total=0;
  for(const r of list){ if(r.pts.length<2) continue; const cum=[0]; for(let i=1;i<r.pts.length;i++) cum.push(cum[i-1]+Math.hypot(r.pts[i][0]-r.pts[i-1][0],r.pts[i][1]-r.pts[i-1][1]));
    const len=cum[cum.length-1]; if(len<6) continue; const wt=len*(r.foot?1:r.w>=8?3.2:r.w>=6.5?1.7:1)*(Math.hypot(r.pts[0][0]-200,r.pts[0][1]-250)<900?1.6:1);
    polys.push({pts:r.pts,cum,len,wt,w:r.w,foot:!!r.foot}); total+=wt; }
  const idx=new Map(); const key=q=>Math.round(q[0]/1.5)+','+Math.round(q[1]/1.5);
  polys.forEach((p,pi)=>p.pts.forEach((q,vi)=>{ const k=key(q); (idx.get(k)||idx.set(k,[]).get(k)).push([pi,vi]); }));
  return {polys,idx,total,key}; }
const carNet=buildNet(vehicular.filter(v=>v.t!=='runway'&&v.t!=='taxiway'));
const bikeNet=buildNet([...vehicular.filter(v=>v.t!=='runway'&&v.t!=='taxiway'),...footways.map(f=>({...f,foot:true}))]);
const footNet=buildNet([...footways.map(f=>({...f,foot:true})),...vehicular.filter(v=>v.t==='residential'||v.t==='service'||v.t==='living_street')]);
const LR=rng(4242);
function spawn(net){ let r=LR()*net.total, pi=0; for(;pi<net.polys.length-1;pi++){ r-=net.polys[pi].wt; if(r<=0) break; }
  const p=net.polys[pi]; return {net,pi,s:LR()*p.len,dir:LR()<.5?1:-1,seg:0,h:null,ph:LR()*10}; }
function advance(a,ds){ let p=a.net.polys[a.pi]; a.s+=ds*a.dir; let guard=0;
  while((a.s<0||a.s>p.len)&&guard++<4){ const atEnd=a.s>p.len, over=atEnd?a.s-p.len:-a.s, q=p.pts[atEnd?p.pts.length-1:0];
    const c=(a.net.idx.get(a.net.key(q))||[]).filter(e=>e[0]!==a.pi);
    if(c.length){ const [npi,nvi]=c[(Math.random()*c.length)|0], np=a.net.polys[npi];
      const nd = nvi===0?1 : nvi===np.pts.length-1?-1 : (Math.random()<.5?1:-1);
      a.pi=npi; a.dir=nd; a.s=np.cum[nvi]+over*nd; a.seg=0; p=np; }
    else { a.dir=-a.dir; a.s=atEnd?p.len-over:over; } }
  a.s=Math.max(0,Math.min(p.len,a.s)); }
const smp={x:0,z:0,dx:0,dz:1,w:4,foot:false};
function sample(a){ const p=a.net.polys[a.pi]; let i=Math.min(a.seg,p.cum.length-2);
  while(i>0&&p.cum[i]>a.s) i--; while(i<p.cum.length-2&&p.cum[i+1]<a.s) i++; a.seg=i;
  const A=p.pts[i],B=p.pts[i+1], L=(p.cum[i+1]-p.cum[i])||1, t=(a.s-p.cum[i])/L;
  smp.x=A[0]+(B[0]-A[0])*t; smp.z=A[1]+(B[1]-A[1])*t; smp.dx=(B[0]-A[0])/L*a.dir; smp.dz=(B[1]-A[1])/L*a.dir; smp.w=p.w; smp.foot=p.foot; return smp; }
const angDiff=(a,b)=>{ let d=b-a; while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI; return d; };

const SHIRT=['#d64545','#3d6fd6','#f1f1ef','#2b2d33','#e0a32f','#1f7a6a','#9a5ad1','#f08a5d','#5aa9e6','#e9e4d8','#f1f1ef','#c94f7c'].map(C);
const PANTS=['#2b2f3a','#3b4a63','#5c4a3a','#1f2328','#6b6f78','#d9d3c4'].map(C);
const SKIN=new THREE.MeshLambertMaterial({color:0x9a6a4a,flatShading:true});
const mk=(g,mat,n)=>{ const m=new THREE.InstancedMesh(g,mat,n); m.frustumCulled=false; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(m); return m; };
const box3=(w,h,d,y,z=0,rx=0)=>{ const g=new THREE.BoxGeometry(w,h,d); if(rx) g.rotateX(rx); g.translate(0,y,z); return g; };
const head=(y,z=0)=>{ const g=new THREE.IcosahedronGeometry(.15,1); g.translate(0,y,z); return g; };
const NCAR=0, NRICK=0, NBIKE=0, NWALK=0;
const agents={car:[],rick:[],bike:[],walk:[]};
for(let i=0;i<NCAR;i++) agents.car.push({...spawn(carNet),v:6.5+LR()*3.5});
for(let i=0;i<NRICK;i++) agents.rick.push({...spawn(carNet),v:4.6+LR()*1.4});
for(let i=0;i<NBIKE;i++) agents.bike.push({...spawn(bikeNet),v:3.4+LR()*1.8,side:LR()});
for(let i=0;i<NWALK;i++) agents.walk.push({...spawn(footNet),v:1.15+LR()*.5,side:LR()*2-1});
const lifeM={
  carBody:mk(box3(1.8,.8,4.2,.6),new THREE.MeshLambertMaterial(),NCAR), carCab:mk(box3(1.55,.6,2.2,1.3,-.25),new THREE.MeshLambertMaterial({color:0x34404c}),NCAR),
  rickBody:mk(box3(1.3,1.0,2.6,.75),new THREE.MeshLambertMaterial({color:0x2f8f4e,flatShading:true}),NRICK), rickRoof:mk(box3(1.45,.12,2.5,2.05,-.05),new THREE.MeshLambertMaterial({color:0xf0efe8}),NRICK),
  bike:mk(box3(.12,.6,1.7,.5),new THREE.MeshLambertMaterial({color:0x2a2d33}),NBIKE), bikeT:mk(box3(.42,.62,.3,1.3,-.1,.35),new THREE.MeshLambertMaterial({flatShading:true}),NBIKE), bikeH:mk(head(1.74,.05),SKIN,NBIKE),
  legs:mk(box3(.34,.82,.24,.41),new THREE.MeshLambertMaterial(),NWALK), torso:mk(box3(.44,.6,.28,1.12),new THREE.MeshLambertMaterial({flatShading:true}),NWALK), whead:mk(head(1.6),SKIN,NWALK)};
agents.car.forEach((a,i)=>lifeM.carBody.setColorAt(i,CARCOL[(LR()*CARCOL.length)|0]));
agents.bike.forEach((a,i)=>lifeM.bikeT.setColorAt(i,SHIRT[(LR()*SHIRT.length)|0]));
agents.walk.forEach((a,i)=>{ lifeM.torso.setColorAt(i,SHIRT[(LR()*SHIRT.length)|0]); lifeM.legs.setColorAt(i,PANTS[(LR()*PANTS.length)|0]); });
// headlights & tail lights
const NV=NCAR+NRICK;
const hlGeo=new THREE.BufferGeometry(); hlGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(NV*2*3),3));
const tlGeo=new THREE.BufferGeometry(); tlGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(NV*3),3));
const hlMat=new THREE.PointsMaterial({map:glowTexture('rgba(255,250,235,1)'),size:3.2,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
const tlMat=new THREE.PointsMaterial({map:glowTexture('rgba(255,60,40,1)'),size:2.6,color:0xff3b2b,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
const hlPts=new THREE.Points(hlGeo,hlMat), tlPts=new THREE.Points(tlGeo,tlMat); hlPts.frustumCulled=tlPts.frustumCulled=false; hlPts.renderOrder=tlPts.renderOrder=15; scene.add(hlPts,tlPts);
const beamG=new THREE.PlaneGeometry(1,1); beamG.rotateX(-Math.PI/2); beamG.translate(0,0,.5);
const beamMat=new THREE.MeshBasicMaterial({map:glowTexture('rgba(255,238,200,.95)'),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
const beams=mk(beamG,beamMat,NV); beams.renderOrder=13.5;
// birds (black kites wheel over campus)
const NFL=isCoarse?4:6, PERF=9;
const birdG=new THREE.BufferGeometry(); birdG.setAttribute('position',new THREE.Float32BufferAttribute([0,0,.5, 0,0,-.3, -1.1,.22,-.15,  0,0,.5, 1.1,.22,-.15, 0,0,-.3],3)); birdG.computeVertexNormals();
const birds=mk(birdG,new THREE.MeshBasicMaterial({color:0x2a2622,side:THREE.DoubleSide}),NFL*PERF);
const flocks=[]; for(let f=0;f<NFL;f++){ const fl={cx:(LR()*2-1)*800,cz:(LR()*2-1)*800,r:120+LR()*220,y:70+LR()*70,w:(LR()<.5?-1:1)*(.05+LR()*.06),p:LR()*7,b:[]};
  for(let k=0;k<PERF;k++) fl.b.push({ox:(LR()-.5)*50,oy:(LR()-.5)*16,oz:(LR()-.5)*50,ph:LR()*7,fs:7+LR()*3,dr:LR()*7}); flocks.push(fl); }

const _M=new THREE.Matrix4(), _Q=new THREE.Quaternion(), _E=new THREE.Euler(0,0,0,'YXZ'), _P=new THREE.Vector3(), _S=new THREE.Vector3(1,1,1), _U=new THREE.Vector3(0,1,0);
function setInst(mesh,i,x,y,z,yaw,s=1,pitch=0){ _E.set(pitch,yaw,0); _Q.setFromEuler(_E); _P.set(x,y,z); _S.set(s,s,s); _M.compose(_P,_Q,_S); mesh.setMatrixAt(i,_M); }
const _fr=new THREE.Frustum(), _pm=new THREE.Matrix4(), _cp=new THREE.Vector3();
function recycle(list,net,R,maxN){ const T=controls.target; let n=0;
  for(let k=0;k<list.length&&n<maxN;k++){ list.rr=((list.rr||0)+1)%list.length; const a=list[list.rr];
    const s0=sample(a); if(Math.hypot(s0.x-T.x,s0.z-T.z)<R) continue;
    for(let tr=0;tr<16;tr++){ const pi=(LR()*net.polys.length)|0, q=net.polys[pi];
      if(!q.foot && LR()>q.wt/q.len/3.2) continue;
      const b={net,pi,s:LR()*q.len,dir:LR()<.5?1:-1,seg:0}; const s1=sample(b);
      if(Math.hypot(s1.x-T.x,s1.z-T.z)>R*0.92) continue;
      _cp.set(s1.x,1.2,s1.z); if(tr<12 && _fr.containsPoint(_cp)) continue;
      if((T.x-s1.x)*s1.dx+(T.z-s1.z)*s1.dz<0) b.dir=-b.dir;
      a.pi=b.pi; a.s=b.s; a.dir=b.dir; a.seg=0; a.h=null; n++; break; } } }
function stepLife(dt,t){
  const vis=LIFE.on;
  if(vis){ _pm.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse); _fr.setFromProjectionMatrix(_pm);
    const R=wk.on?200:THREE.MathUtils.clamp(camDist*1.25,200,1900), Rw=wk.on?130:Math.min(R,600);
    recycle(agents.car,carNet,R,10); recycle(agents.rick,carNet,R,5); recycle(agents.bike,bikeNet,Math.min(R,900),1); recycle(agents.walk,footNet,Rw,1); }
  for(const k in lifeM) lifeM[k].visible=vis; hlPts.visible=tlPts.visible=vis&&nightK>0.01; beams.visible=hlPts.visible;
  const showBirds=vis && nightN<0.55 && wxCur.rain<0.3; birds.visible=showBirds;
  if(!vis) return;
  const hp=hlGeo.attributes.position.array, tp=tlGeo.attributes.position.array; let vi=0;
  const drive=(list,body,top,len)=>{ list.forEach((a,i)=>{ advance(a,a.v*dt); const s=sample(a);
    const off=s.w/4+.25, x=s.x+s.dz*off, z=s.z-s.dx*off, tgt=Math.atan2(s.dx,s.dz);
    a.h = a.h===null ? tgt : a.h+angDiff(a.h,tgt)*Math.min(1,dt*5); const fx=Math.sin(a.h), fz=Math.cos(a.h);
    setInst(body,i,x,0.2,z,a.h); setInst(top,i,x,0.2,z,a.h);
    for(const sd of [-.6,.6]){ hp[vi*6+(sd>0?3:0)]=x+fx*len+fz*sd; hp[vi*6+(sd>0?4:1)]=.95; hp[vi*6+(sd>0?5:2)]=z+fz*len-fx*sd; }
    tp[vi*3]=x-fx*len; tp[vi*3+1]=1.0; tp[vi*3+2]=z-fz*len;
    _E.set(0,a.h,0); _Q.setFromEuler(_E); _P.set(x+fx*len,.35,z+fz*len); _S.set(5.5,1,11); _M.compose(_P,_Q,_S); beams.setMatrixAt(vi,_M); vi++; }); };
  drive(agents.car,lifeM.carBody,lifeM.carCab,2.15); drive(agents.rick,lifeM.rickBody,lifeM.rickRoof,1.35);
  agents.bike.forEach((a,i)=>{ advance(a,a.v*dt); const s=sample(a); const off=s.foot?(a.side-.5)*s.w*.5:s.w/2-.7;
    const x=s.x+s.dz*off, z=s.z-s.dx*off, tgt=Math.atan2(s.dx,s.dz); a.h=a.h===null?tgt:a.h+angDiff(a.h,tgt)*Math.min(1,dt*6);
    const y=s.foot?.15:.2; setInst(lifeM.bike,i,x,y,z,a.h,1.15); setInst(lifeM.bikeT,i,x,y,z,a.h,1.15); setInst(lifeM.bikeH,i,x,y,z,a.h,1.15); });
  agents.walk.forEach((a,i)=>{ advance(a,a.v*dt); const s=sample(a); const off=s.foot?a.side*s.w*.32:(s.w/2+.7)*Math.sign(a.side||1);
    const x=s.x+s.dz*off, z=s.z-s.dx*off, tgt=Math.atan2(s.dx,s.dz); a.h=a.h===null?tgt:a.h+angDiff(a.h,tgt)*Math.min(1,dt*6);
    a.ph+=dt*a.v*5.5; const y=(s.foot?.14:.18)+Math.abs(Math.sin(a.ph))*.06;
    setInst(lifeM.legs,i,x,y,z,a.h,1.15); setInst(lifeM.torso,i,x,y,z,a.h,1.15); setInst(lifeM.whead,i,x,y,z,a.h,1.15); });
  for(const k in lifeM) lifeM[k].instanceMatrix.needsUpdate=true;
  beams.instanceMatrix.needsUpdate=true; hlGeo.attributes.position.needsUpdate=true; tlGeo.attributes.position.needsUpdate=true;
  hlMat.opacity=nightK; tlMat.opacity=nightK*.9; beamMat.opacity=nightK*.38; hlMat.size=tlMat.size=THREE.MathUtils.clamp(camDist/150,2.2,7);
  if(showBirds){ let bi=0; for(const fl of flocks){ const ang=fl.p+t*fl.w, cx=fl.cx+Math.cos(ang)*fl.r, cz=fl.cz+Math.sin(ang)*fl.r;
    const yaw=Math.atan2(-Math.sin(ang)*Math.sign(fl.w),Math.cos(ang)*Math.sign(fl.w));
    for(const b of fl.b){ const flap=Math.sin(t*.5+b.dr)>.25 ? Math.sin(t*b.fs+b.ph) : .55;
      _E.set(0,yaw+Math.sin(t*.3+b.ph)*.2,fl.w>0?-.25:.25); _Q.setFromEuler(_E);
      _P.set(cx+b.ox+Math.sin(t*.4+b.ph)*6,fl.y+b.oy+Math.sin(t*.7+b.dr)*3,cz+b.oz+Math.cos(t*.35+b.ph)*6); _S.set(1.5,1.5*flap,1.5); _M.compose(_P,_Q,_S); birds.setMatrixAt(bi++,_M); } }
    birds.instanceMatrix.needsUpdate=true; }
}

