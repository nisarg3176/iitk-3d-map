// Street lamps along every road (plus extra plaza lamps from xLamps) and their night glow.
// --- street lamps
const lamps=[], lampGrid=new Map();
function lampOk(x,z,minD){ const cx=Math.floor(x/minD), cz=Math.floor(z/minD);
  for(let i=-1;i<=1;i++) for(let j=-1;j<=1;j++){ const L=lampGrid.get((cx+i)+','+(cz+j)); if(L) for(const q of L) if(Math.hypot(q[0]-x,q[1]-z)<minD) return false; }
  return true; }
function addLamp(l,minD){ if(!lampOk(l[0],l[1],minD)) return; lamps.push(l); const k=Math.floor(l[0]/minD)+','+Math.floor(l[1]/minD); (lampGrid.get(k)||lampGrid.set(k,[]).get(k)).push(l); }
// evenly spaced street lamps: one every 42 m along every road, alternating sides, never closer than 30 m to another lamp
//  (the OSM lamp points are bunched on a few roads, so they are not used for placement)
const MAIN=new Set(['trunk','trunk_link','primary','primary_link','secondary','secondary_link','tertiary','tertiary_link','unclassified']);
for(const v of vehicular.slice().sort((a,b)=>b.w-a.w)){ if(v.t==='runway'||v.t==='taxiway') continue;
  rr(0,1); let side=1;                                   // (keeps the random sequence for the trees etc. unchanged)
  walk(v.pts,48,20,(x,z,dx,dz)=>{ const off=v.w/2+0.9; const px=x-dz*off*side, pz=z+dx*off*side; side=-side;
    addLamp([px,pz,-dz*side,dx*side],34); });
}
for(const l of xLamps) addLamp(l,5);
let lampGlow, lampHeads, lampPools, poolMat, headMat;
{
  const poleG=new THREE.CylinderGeometry(0.07,0.11,6,5); poleG.translate(0,3,0);
  const poles=new THREE.InstancedMesh(poleG,new THREE.MeshLambertMaterial({color:0x3b4048}),lamps.length);
  const headG=new THREE.BoxGeometry(0.7,0.22,0.4);
  headMat=new THREE.MeshBasicMaterial({color:0x9aa0a6});
  lampHeads=new THREE.InstancedMesh(headG,headMat,lamps.length);
  const poolG=new THREE.PlaneGeometry(1,1); poolG.rotateX(-Math.PI/2);
  poolMat=new THREE.MeshBasicMaterial({map:glowTexture('rgba(255,205,130,.9)'),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
  lampPools=new THREE.InstancedMesh(poolG,poolMat,lamps.length); lampPools.renderOrder=13;
  const gp=new Float32Array(lamps.length*3);
  const M=new THREE.Matrix4(), P=new THREE.Vector3(), S=new THREE.Vector3(1,1,1), Q=new THREE.Quaternion();
  lamps.forEach((l,i)=>{ const small=l[4]; const h=small?3.6:6;
    P.set(l[0],0,l[1]); S.set(1,small?0.6:1,1); M.compose(P,Q,S); poles.setMatrixAt(i,M);
    P.set(l[0],h,l[1]); S.set(1,1,1); M.compose(P,Q,S); lampHeads.setMatrixAt(i,M);
    const ps=small?8:13; P.set(l[0],0.3,l[1]); S.set(ps,1,ps); M.compose(P,Q,S); lampPools.setMatrixAt(i,M);
    gp[i*3]=l[0]; gp[i*3+1]=h-0.2; gp[i*3+2]=l[1]; });
  poles.castShadow=true; scene.add(poles,lampHeads,lampPools);
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(gp,3));
  lampGlow=new THREE.Points(g,new THREE.PointsMaterial({map:glowTexture(),size:7,sizeAttenuation:true,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));
  lampGlow.renderOrder=14; scene.add(lampGlow);
}

