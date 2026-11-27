// Renderer, camera, lights, sky dome, stars and moon.
/* ---------------- renderer / scene ---------------- */
const canvas=document.getElementById('c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
const DPR=Math.min(devicePixelRatio, isCoarse?1.75:2);
renderer.setPixelRatio(DPR);
renderer.setSize(innerWidth,innerHeight);
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.0;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,3,12000);
scene.fog=new THREE.Fog(0xdbe9f2,1500,5200);

const hemi=new THREE.HemisphereLight(0xdff0ff,0x7a9a58,1.2); scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff0d8,2.6); sun.castShadow=true;
sun.shadow.mapSize.set(isCoarse?2048:4096,isCoarse?2048:4096);
sun.shadow.bias=-0.0004; sun.shadow.normalBias=0.8;
scene.add(sun,sun.target);
const SUN_DIR=new THREE.Vector3(0.72,0.62,0.42).normalize();

// sky dome
const skyU={top:{value:C('#5d9fd6')},hor:{value:C('#e2eef4')},glow:{value:C('#fff2d6')},glowAmt:{value:0.25},sunDir:{value:SUN_DIR.clone()},
  sunCol:{value:C('#fff4d6')},sunVis:{value:1},haze:{value:0}};
const skyMat=new THREE.ShaderMaterial({uniforms:skyU,side:THREE.BackSide,depthWrite:false,fog:false,
  vertexShader:`varying vec3 vP; void main(){ vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader:`uniform vec3 top,hor,glow,sunCol; uniform float glowAmt,sunVis,haze; uniform vec3 sunDir; varying vec3 vP;
    void main(){ vec3 d=normalize(vP); float h=clamp(d.y,0.,1.); vec3 c=mix(hor,top,pow(h,mix(.62,1.6,haze))*smoothstep(0.,.05,h)*.85+pow(h,.62)*.15);
      vec2 sh=normalize(vec2(sunDir.x,sunDir.z)+1e-5);
      float g=pow(max(dot(normalize(vec2(d.x,d.z)+1e-5),sh),0.),3.)*pow(1.-h,5.);
      c+=glow*g*glowAmt;
      float sd=max(dot(d,normalize(sunDir)),0.);
      c+=sunCol*(pow(sd,9.)*.22+pow(sd,90.)*.35)*sunVis*glowAmt;
      c+=sunCol*smoothstep(.99955,.9997,sd)*sunVis*2.2*(1.-haze*.8);
      if(d.y<0.) c=mix(c,hor*.92,clamp(-d.y*6.,0.,1.));
      gl_FragColor=vec4(c,1.);
      #include <colorspace_fragment>
    }`});
const sky=new THREE.Mesh(new THREE.SphereGeometry(9000,48,24),skyMat);
sky.renderOrder=-10; scene.add(sky);
const envScene=new THREE.Scene(); envScene.add(new THREE.Mesh(new THREE.SphereGeometry(100,32,16),skyMat));
const pmrem=new THREE.PMREMGenerator(renderer); let envRT=null, envDirty=true, envT=0;
function refreshEnv(now){ if(!envDirty||now-envT<350) return; envDirty=false; envT=now;
  const rt=pmrem.fromScene(envScene,0,1,1000); if(envRT) envRT.dispose(); envRT=rt; scene.environment=rt.texture; }

// stars + moon
{
  const n=1800, p=new Float32Array(n*3);
  for(let i=0;i<n;i++){ const u=R(), v=R()*0.95+0.05; const th=u*Math.PI*2, ph=Math.acos(v); const r=8500;
    p[i*3]=Math.sin(ph)*Math.cos(th)*r; p[i*3+1]=Math.cos(ph)*r; p[i*3+2]=Math.sin(ph)*Math.sin(th)*r; }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3));
  var stars=new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:1.6,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));
  stars.renderOrder=-9; scene.add(stars);
  const mc=document.createElement('canvas'); mc.width=mc.height=128; const x=mc.getContext('2d');
  const gr=x.createRadialGradient(64,64,10,64,64,64); gr.addColorStop(0,'rgba(255,250,235,1)'); gr.addColorStop(.28,'rgba(255,246,220,1)'); gr.addColorStop(.32,'rgba(200,210,255,.35)'); gr.addColorStop(1,'rgba(150,170,255,0)');
  x.fillStyle=gr; x.fillRect(0,0,128,128);
  var moon=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(mc),transparent:true,opacity:0,fog:false,depthWrite:false}));
  moon.scale.set(900,900,1); moon.position.set(5200,3600,-5200); moon.renderOrder=-8; scene.add(moon);
}

