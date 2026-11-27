// Ground solar farm and parked cars.
// solar farm on the ground
for(const rings of solarAreas) gridInPoly(rings,5.2,5.5,3,(x,z,ang)=>panels.push([x,z,1.3,ang,5,2.6]));
// parked cars
const CARCOL=['#d64545','#f1f1ef','#2b2d33','#3d6fd6','#c9ccd1','#e0a32f','#1f7a6a','#9aa3ad','#f1f1ef','#7a1f2b'].map(C);
for(const rings of parkingAreas) gridInPoly(rings,2.9,5.6,2,(x,z,ang,i,j)=>{ if(j%3===2||R()>0.68) return; cars.push([x,z,ang+(R()<0.5?0:Math.PI),CARCOL[(R()*CARCOL.length)|0]]); });
{
  const M=new THREE.Matrix4(), Q=new THREE.Quaternion(), E=new THREE.Euler(0,0,0,'YXZ'), S=new THREE.Vector3(), P=new THREE.Vector3();
  if(panels.length){
    const pc=document.createElement('canvas'); pc.width=128; pc.height=64; const x=pc.getContext('2d');
    x.fillStyle='#d9dde2'; x.fillRect(0,0,128,64); x.fillStyle='#22406f';
    for(let i=0;i<8;i++) for(let j=0;j<3;j++) x.fillRect(2+i*15.7,2+j*20.5,14,18.5);
    const tex=new THREE.CanvasTexture(pc); tex.colorSpace=THREE.SRGBColorSpace;
    const pm=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshLambertMaterial({map:tex}),panels.length);
    panels.forEach((p,i)=>{ E.set(-0.32,-p[3],0); Q.setFromEuler(E); P.set(p[0],p[2],p[1]); S.set(p[4],0.12,p[5]); M.compose(P,Q,S); pm.setMatrixAt(i,M); });
    pm.castShadow=true; pm.receiveShadow=true; pm.computeBoundingSphere(); scene.add(pm);
  }
  if(cars.length){
    const bodyG=new THREE.BoxGeometry(1.8,0.8,4.2); bodyG.translate(0,0.6,0);
    const cabG=new THREE.BoxGeometry(1.55,0.6,2.2); cabG.translate(0,1.3,-0.25);
    const body=new THREE.InstancedMesh(bodyG,new THREE.MeshLambertMaterial(),cars.length);
    const cab=new THREE.InstancedMesh(cabG,new THREE.MeshLambertMaterial({color:0x34404c}),cars.length);
    cars.forEach((c,i)=>{ E.set(0,-c[2]+Math.PI/2,0); Q.setFromEuler(E); P.set(c[0],0,c[1]); S.set(1,1,1); M.compose(P,Q,S); body.setMatrixAt(i,M); cab.setMatrixAt(i,M); body.setColorAt(i,c[3]); });
    body.castShadow=cab.castShadow=true; body.computeBoundingSphere(); cab.computeBoundingSphere(); scene.add(body,cab);
  }
}

/* ================= DETAILS: metro, walkways, towers, power, helipads, fountains, gates, entrances … ================= */
lmsg.textContent='Adding the little details…'; await tick();
