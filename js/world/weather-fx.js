// Clouds and rain.
/* ---------------- clouds ---------------- */
const NCL=isCoarse?50:80, PUFF=7, cloudMat=new THREE.MeshLambertMaterial({color:0xffffff,flatShading:true});
const CLU={uDrift:{value:0},uN:{value:16}};
let clouds;
{
  const g=new THREE.IcosahedronGeometry(1,1);
  clouds=new THREE.InstancedMesh(g,cloudMat,NCL*PUFF);
  const aC=new Float32Array(NCL*PUFF), aI=new Float32Array(NCL*PUFF);
  const M=new THREE.Matrix4(), Q=new THREE.Quaternion(), P=new THREE.Vector3(), S=new THREE.Vector3();
  const cr=rng(77);
  for(let c=0;c<NCL;c++){ const cx=(cr()*2-1)*4600, cz=(cr()*2-1)*4600, cy=560+cr()*300, sc=55+cr()*75;
    for(let k=0;k<PUFF;k++){ const i=c*PUFF+k; const t=k/(PUFF-1)-.5;
      P.set(cx+t*sc*2.6+(cr()-.5)*sc*.5, cy+(cr()-.3)*sc*.25, cz+(cr()-.5)*sc*.9);
      const s=sc*(0.55+cr()*0.5)*(1-Math.abs(t)*.6); S.set(s*1.25,s*.62,s); Q.setFromEuler(new THREE.Euler(0,cr()*6,0));
      M.compose(P,Q,S); clouds.setMatrixAt(i,M); aC[i]=cx; aI[i]=c; } }
  g.setAttribute('aC',new THREE.InstancedBufferAttribute(aC,1)); g.setAttribute('aI',new THREE.InstancedBufferAttribute(aI,1));
  cloudMat.onBeforeCompile=sh=>{ Object.assign(sh.uniforms,CLU);
    sh.vertexShader='attribute float aC,aI; uniform float uDrift,uN; varying float vFade;\n'+sh.vertexShader.replace('#include <project_vertex>',`
      vec4 mvPosition=vec4(transformed,1.); mvPosition=instanceMatrix*mvPosition;
      mvPosition.x+=mod(aC+uDrift+4600.,9200.)-4600.-aC;
      float cd=distance(mvPosition.xyz,cameraPosition);
      vFade=smoothstep(180.,520.,cd)*clamp(uN-aI,0.,1.)*(1.-smoothstep(4200.,4600.,abs(mvPosition.x)));
      mvPosition=modelViewMatrix*mvPosition; gl_Position=projectionMatrix*mvPosition;`);
    sh.fragmentShader='varying float vFade;\n'+sh.fragmentShader.replace('void main() {',`void main() {
      if(vFade<fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))))) discard;`); };
  clouds.frustumCulled=false; scene.add(clouds);
}
/* ---------------- rain ---------------- */
const NRAIN=isCoarse?3500:7000;
const rainMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uT:TIME,uO:{value:new THREE.Vector3()},uB:{value:new THREE.Vector3(200,160,200)},uA:{value:0},uCol:{value:C('#c9d2da')}},
  vertexShader:`attribute vec3 seed; attribute float tip; uniform float uT; uniform vec3 uO,uB; varying float vA;
    void main(){ vec3 b=uB; vec3 p;
      p.x=uO.x-b.x*.5+mod(seed.x*b.x-uO.x+uT*2.5,b.x);
      p.z=uO.z-b.z*.5+mod(seed.z*b.z-uO.z+uT*1.2,b.z);
      p.y=uO.y-b.y*.5+mod(seed.y*b.y-uO.y-uT*26.,b.y);
      p+=tip*vec3(-.22,2.4,-.1)*(b.x/200.+.4);
      vA=(1.-tip*.7); gl_Position=projectionMatrix*viewMatrix*vec4(p,1.); }`,
  fragmentShader:`uniform vec3 uCol; uniform float uA; varying float vA; void main(){ gl_FragColor=vec4(uCol,uA*vA); }`});
let rainLines;
{ const seed=new Float32Array(NRAIN*6), tip=new Float32Array(NRAIN*2), pos=new Float32Array(NRAIN*6);
  for(let i=0;i<NRAIN;i++){ const a=Math.random(),b=Math.random(),c=Math.random(); seed.set([a,b,c,a,b,c],i*6); tip[i*2+1]=1; }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); g.setAttribute('seed',new THREE.BufferAttribute(seed,3)); g.setAttribute('tip',new THREE.BufferAttribute(tip,1));
  rainLines=new THREE.LineSegments(g,rainMat); rainLines.frustumCulled=false; rainLines.visible=false; rainLines.renderOrder=20; scene.add(rainLines); }

