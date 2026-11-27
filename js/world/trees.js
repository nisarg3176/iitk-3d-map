// Trees (avenue rows, clumps, map trees), shaped by the occupancy map; contact-shadow overlay.
// --- occupancy readback
const occD=oc.getImageData(0,0,OCC,OCC).data, denD=dc.getImageData(0,0,OCC,OCC).data;
const occAt=(x,z)=>{ const i=(toPx(z)|0)*OCC+(toPx(x)|0); if(i<0||i>=OCC*OCC) return 1; return occD[i*4]>40; };
const denAt=(x,z)=>{ const i=(toPx(z)|0)*OCC+(toPx(x)|0); if(i<0||i>=OCC*OCC) return 0; return denD[i*4]/255; };

// --- trees
const trees=[]; // [x,z,type,scale,colorIdx]
const MAXT=isCoarse?11000:24000;
for(const v of vehicular){
  if(v.t==='runway'||v.t==='taxiway') continue;
  const avenueCone = hash2(v.pts[0][0]|0,v.pts[0][1]|0)<0.45;
  for(const side of [-1,1]){
    walk(v.pts,rr(10,13),rr(0,8),(x,z,dx,dz)=>{
      const off=v.w/2+1.3+2.6; const px=x-dz*off*side+rr(-.4,.4), pz=z+dx*off*side+rr(-.4,.4);
      if(occAt(px,pz)) return; if(R()<0.12) return;
      trees.push([px,pz,avenueCone?1:0,rr(0.85,1.15)]);
    });
  }
}
{
  const step=6.5;
  for(let z=-EXT+20; z<EXT-20; z+=step) for(let x=-EXT+20; x<EXT-20; x+=step){
    const px=x+rr(-step*.45,step*.45), pz=z+rr(-step*.45,step*.45);
    if(occAt(px,pz)) continue;
    const d=denAt(px,pz), n=fbm(px/170+3,pz/170-7);
    let p = Math.max(0,(n-0.42)*1.7)*0.55;
    if(d>0.9) p=0.75+n*0.2; else if(d>0.45) p=Math.max(p,0.28); else if(d>0.25) p=Math.max(p*1.2,0.12);
    p += 0.035;
    const edge=Math.max(Math.abs(px),Math.abs(pz)); if(edge>1150) p*=Math.max(0,1-(edge-1150)/330)*0.7+0.3*(edge<1450);
    if(R()>p) continue;
    const tt=R(); const type = d>0.9 ? (tt<0.75?0:2) : (tt<0.6?0:tt<0.8?2:1);
    trees.push([px,pz,type,rr(0.7,1.25)]);
  }
}
// shuffle-trim to budget (keep avenue trees first)
for(const t of (data.trees||[])) if(!occAt(t[0],t[1])) trees.unshift([t[0],t[1],0,rr(1.1,1.35)]);
if(trees.length>MAXT){ const keep=trees.splice(0,0); for(let i=trees.length-1;i>0;i--){ const j=(R()*(i+1))|0; [trees[i],trees[j]]=[trees[j],trees[i]]; } trees.length=MAXT; }
keepTreesClear(trees,bushes);   // move trees and bushes off buildings and paving (js/world/clearance.js)

{
  const geoms=[
    new THREE.IcosahedronGeometry(1,0),
    (()=>{ const g=new THREE.ConeGeometry(1,1,7,1); g.translate(0,0.5,0); return g; })(),
    new THREE.DodecahedronGeometry(1,0)
  ];
  const counts=[0,0,0]; for(const t of trees) counts[t[2]]++;
  const leafMat=new THREE.MeshLambertMaterial({flatShading:true});
  leafMat.onBeforeCompile=sh=>{ Object.assign(sh.uniforms,{uLeafMul:SEA.leafMul,uTurn:SEA.turn,uTurnA:SEA.turnA,uTurnB:SEA.turnB,uBloom:SEA.bloom});
    sh.vertexShader='varying float vRnd;\n'+sh.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      #ifdef USE_INSTANCING
        vRnd=fract(sin(dot(instanceMatrix[3].xz,vec2(12.9898,78.233)))*43758.5453);
      #else
        vRnd=.5;
      #endif`);
    sh.fragmentShader='varying float vRnd; uniform vec3 uLeafMul,uTurnA,uTurnB; uniform float uTurn,uBloom;\n'+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      { float isG=step(diffuseColor.r*1.25,diffuseColor.g);
        diffuseColor.rgb*=mix(vec3(1.),uLeafMul,isG);
        if(isG>.5&&vRnd<uTurn) diffuseColor.rgb=mix(uTurnA,uTurnB,fract(vRnd*17.3))*(.75+.45*fract(vRnd*29.7));
        else if(isG>.5&&vRnd>1.-uBloom) diffuseColor.rgb=fract(vRnd*31.1)<.62?vec3(.72,.09,.03):vec3(.86,.58,.02); }`); };
  const meshes=geoms.map((g,i)=>{ const m=new THREE.InstancedMesh(g,leafMat,Math.max(1,counts[i])); m.castShadow=true; m.receiveShadow=true; m.count=0; scene.add(m); return m; });
  const trunkG=new THREE.CylinderGeometry(0.22,0.34,1,5); trunkG.translate(0,0.5,0);
  const trunks=new THREE.InstancedMesh(trunkG,new THREE.MeshLambertMaterial({color:0x6b4a32,flatShading:true}),trees.length); trunks.castShadow=true; trunks.count=0; scene.add(trunks);
  const BLOOM=['#d9462b','#e2552c','#ea6a2e','#f0c419','#e9b820'].map(C);
  const greens=['#3f7d3a','#4b8a3c','#5a9643','#356f37','#6aa34a','#4f8f4a','#2f6a3a','#78a845'].map(C);
  const M=new THREE.Matrix4(), Q=new THREE.Quaternion(), E=new THREE.Euler(), S=new THREE.Vector3(), P=new THREE.Vector3(), col=new THREE.Color();
  for(const [x,z,type,s] of trees){
    const m=meshes[type]; let th, sx, sy;
    if(type===0){ th=2.2*s; sx=3.4*s; sy=3.0*s; }
    else if(type===1){ th=1.0*s; sx=1.6*s; sy=10.5*s; }
    else { th=1.8*s; sx=2.6*s; sy=2.6*s; }
    E.set(rr(-.12,.12),R()*Math.PI*2,rr(-.12,.12)); Q.setFromEuler(E);
    P.set(x, type===1?th:th+sy*0.78, z); S.set(sx,sy,sx);
    M.compose(P,Q,S); m.setMatrixAt(m.count,M);
    col.copy(greens[(R()*greens.length)|0]).offsetHSL(rr(-.015,.015),rr(-.05,.05),rr(-.04,.04)); if(type===1) col.multiplyScalar(0.82);
    if(type===0 && R()<0.045) col.copy(BLOOM[(R()*BLOOM.length)|0]).offsetHSL(0,0,rr(-.05,.03));
    ac.fillStyle='rgba(255,255,255,.45)'; ac.beginPath(); ac.arc(toAo(x),toAo(z),Math.max(1.2,sx*0.75*AON/(2*EXT)),0,7); ac.fill();
    m.setColorAt(m.count,col); m.count++;
    E.set(0,R()*6,0); Q.setFromEuler(E); P.set(x,0,z); S.set(s,th+ (type===1?0.5:sy*0.3),s); M.compose(P,Q,S); trunks.setMatrixAt(trunks.count++,M);
  }
  meshes.forEach(m=>{ m.instanceMatrix.needsUpdate=true; if(m.instanceColor) m.instanceColor.needsUpdate=true; m.computeBoundingSphere(); });
  trunks.computeBoundingSphere();
  // bushes
  const bm=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1,0),leafMat,Math.max(1,bushes.length));
  const bg=['#3c7a33','#4c8a37','#5c9a3e','#447f3a','#6a9f45'].map(C);
  bushes.forEach((b,i)=>{ E.set(0,R()*6,0); Q.setFromEuler(E); P.set(b[0],b[2]*0.5+(b[3]||0),b[1]); S.set(b[2]*1.3,b[2]*0.85,b[2]*1.3); M.compose(P,Q,S); bm.setMatrixAt(i,M);
    col.copy(bg[(R()*bg.length)|0]); if(R()<0.04) col.copy(BLOOM[(R()*BLOOM.length)|0]); bm.setColorAt(i,col); });
  bm.count=bushes.length; bm.castShadow=true; bm.receiveShadow=true; bm.computeBoundingSphere(); scene.add(bm);
}
// ambient-occlusion / contact-shadow overlay
{
  const id=ac.getImageData(0,0,AON,AON), src=new Float32Array(AON*AON);
  for(let i=0;i<src.length;i++) src[i]=id.data[i*4];
  let b=blur(src,AON,AON,3); b=blur(b,AON,AON,3);
  for(let i=0;i<b.length;i++){ const v=Math.min(255,b[i]*1.15); id.data[i*4]=id.data[i*4+1]=id.data[i*4+2]=v; id.data[i*4+3]=255; }
  ac.putImageData(id,0,0);
  const t=new THREE.CanvasTexture(ao);
  const g=new THREE.PlaneGeometry(2*EXT,2*EXT); g.rotateX(-Math.PI/2);
  var aoMat=new THREE.MeshBasicMaterial({color:0x0e1f0c,alphaMap:t,transparent:true,opacity:0.62,depthWrite:false});
  const m=new THREE.Mesh(g,aoMat); m.position.y=0.3; m.renderOrder=12.5; scene.add(m);
}

lmsg.textContent='Switching on the street lamps…'; await tick();

