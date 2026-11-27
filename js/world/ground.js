// Ground overlays, seasonal grass/leaf tint, water shaders, ground plane and map areas (parks, pitches, parking, water…).
const EXT=1500; // half-extent of the modelled area
const overlayMat=(color,order,extra={})=>{ const m=new THREE.MeshLambertMaterial({color,vertexColors:!color,depthWrite:false,...extra}); return [m,order]; };
function addOverlay(geo, color, order, opts={}){
  if(!geo.p.length) return null;
  const mat=new THREE.MeshLambertMaterial({vertexColors:!color,depthWrite:false,...opts});
  if(color) mat.color=C(color);
  const m=new THREE.Mesh(geo.build(),mat); m.renderOrder=order; m.receiveShadow=true; scene.add(m); return m;
}

// --- seasonal tint + water shaders
const SEA={grassMul:{value:new THREE.Vector3(1,1,1)},dry:{value:0},leafMul:{value:new THREE.Vector3(1,1,1)},turn:{value:0},
  turnA:{value:C('#d19a1c')},turnB:{value:C('#a8431a')},bloom:{value:0}};
const TIME={value:0};
function seasonize(mat){ mat.onBeforeCompile=sh=>{ sh.uniforms.uGrassMul=SEA.grassMul; sh.uniforms.uDry=SEA.dry;
  sh.fragmentShader='uniform vec3 uGrassMul; uniform float uDry;\n'+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
  { float gr=clamp((diffuseColor.g-max(diffuseColor.r,diffuseColor.b))*8.,0.,1.);
    vec3 dry=vec3(dot(diffuseColor.rgb,vec3(.35,.5,.15)))*vec3(1.32,1.12,.66);
    diffuseColor.rgb=mix(diffuseColor.rgb,mix(diffuseColor.rgb*uGrassMul,dry,uDry),gr); }`); }; return mat; }
const waterMats=[];
function makeWater(color=0x2f7fa3){
  const m=new THREE.MeshStandardMaterial({color,roughness:0.06,metalness:0.1,depthWrite:false,envMapIntensity:1.0});
  m.userData.rip={value:0.35};
  m.onBeforeCompile=sh=>{ sh.uniforms.uTime=TIME; sh.uniforms.uRip=m.userData.rip;
    sh.vertexShader='varying vec3 vWP;\n'+sh.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\n vWP=(modelMatrix*vec4(transformed,1.)).xyz;');
    sh.fragmentShader='varying vec3 vWP; uniform float uTime,uRip;\n'+sh.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
    { vec2 p=vWP.xz; float t=uTime; vec2 g=vec2(0.);
      g+=vec2(cos(p.x*.21+p.y*.07+t*1.1),cos(p.y*.19-p.x*.05-t*.9))*.5;
      g+=vec2(cos((p.x+p.y)*.63+t*2.3),cos((p.x-p.y)*.57-t*1.9))*.28;
      g+=vec2(cos(p.x*1.7-t*3.1+p.y*.4),cos(p.y*1.9+t*2.7))*.14*(.4+uRip);
      normal=normalize(normal+(viewMatrix*vec4(g.x*uRip,0.,g.y*uRip,0.)).xyz); }`);
    sh.fragmentShader=sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      { float n=sin(vWP.x*.05+uTime*.2)*sin(vWP.z*.06-uTime*.15); diffuseColor.rgb*=1.+n*.08; }`); };
  waterMats.push(m); return m; }

// --- ground
{
  const S=EXT*14, seg=150;
  const g=new THREE.PlaneGeometry(S,S,seg,seg); g.rotateX(-Math.PI/2);
  const pos=g.attributes.position, col=new Float32Array(pos.count*3);
  const g1=C('#8fc05a'), g2=C('#a9cc62'), g3=C('#7aae4f'), dry=C('#b9c477'), far=C('#88a868'), tmp=new THREE.Color();
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i), z=pos.getZ(i);
    const n=fbm(x/260,z/260), m=fbm(x/90+40,z/90-12);
    tmp.copy(g1).lerp(g2,n).lerp(g3,Math.max(0,m-0.55)*1.6);
    const d=fbm(x/400+90,z/400+5); if(d>0.62) tmp.lerp(dry,(d-0.62)*1.8);
    const r=Math.max(Math.abs(x),Math.abs(z)); if(r>EXT) tmp.lerp(far,Math.min(1,(r-EXT)/1200)*0.7);
    col[i*3]=tmp.r; col[i*3+1]=tmp.g; col[i*3+2]=tmp.b;
  }
  g.setAttribute('color',new THREE.BufferAttribute(col,3));
  const ground=new THREE.Mesh(g,seasonize(new THREE.MeshLambertMaterial({vertexColors:true})));
  ground.position.y=-0.6; ground.receiveShadow=true; ground.renderOrder=-2; scene.add(ground);
}

// --- areas
const areaGeo={resid:new Geo(),park:new Geo(),wood:new Geo(),pave:new Geo(),court:new Geo(),field:new Geo(),track:new Geo(),water:new Geo(),lines:new Geo(),bank:new Geo()};
const occ=document.createElement('canvas'), OCC=1500; occ.width=occ.height=OCC; const oc=occ.getContext('2d'); // 2 m/px occupancy
const den=document.createElement('canvas'); den.width=den.height=OCC; const dc=den.getContext('2d');
const toPx=v=>(v+EXT)/(2*EXT)*OCC;
oc.fillStyle='#000'; oc.fillRect(0,0,OCC,OCC); dc.fillStyle='#000'; dc.fillRect(0,0,OCC,OCC);
function ctxPoly(ctx,rings){ ctx.beginPath(); for(const r of rings){ r.forEach((p,i)=>i?ctx.lineTo(toPx(p[0]),toPx(p[1])):ctx.moveTo(toPx(p[0]),toPx(p[1]))); ctx.closePath(); } }
function ctxLine(ctx,pts){ ctx.beginPath(); pts.forEach((p,i)=>i?ctx.lineTo(toPx(p[0]),toPx(p[1])):ctx.moveTo(toPx(p[0]),toPx(p[1]))); }
const pxPerM=OCC/(2*EXT);
const AON=1536, ao=document.createElement('canvas'); ao.width=ao.height=AON; const ac=ao.getContext('2d');
ac.fillStyle='#000'; ac.fillRect(0,0,AON,AON);
const toAo=v=>(v+EXT)/(2*EXT)*AON;
const parkingAreas=[], solarAreas=[], panels=[], bushes=[], cars=[];
dc.globalCompositeOperation='lighten';
const courtCols={basketball:'#c0714f',tennis:'#3f8477',volleyball:'#c98a55',badminton:'#4f8a7a',squash:'#b77b52',roller_skating:'#8f8f97'};
for(const a of data.areas){
  const rings=a.r.map(toPts); const t=a.t;
  if(t==='resid'){ fillPoly(areaGeo.resid,rings,0.02,null||C('#9bc463')); dc.fillStyle='#4a4a4a'; ctxPoly(dc,rings); dc.fill('evenodd'); }
  else if(t==='park'||t==='sports'){ fillPoly(areaGeo.park,rings,0.04,(x,z)=>C('#86c25a').lerp(C('#a6d26a'),fbm(x/40,z/40))); dc.fillStyle='#808080'; ctxPoly(dc,rings); dc.fill('evenodd'); }
  else if(t==='wood'){ fillPoly(areaGeo.wood,rings,0.05,C('#6c9f45')); dc.fillStyle='#ffffff'; ctxPoly(dc,rings); dc.fill('evenodd'); }
  else if(t==='water'){ const [pcx,pcz]=centroid(rings[0]), isPool=pcx>-390&&pcx<-330&&pcz>850&&pcz<960; fillPoly(areaGeo.bank,rings,0.08,C(isPool?'#cfd2cf':'#c9b98f'));
    const sh=rings.map(r=>{ const [cx,cz]=centroid(r); const k=isPool?0.985:0.94; return r.map(p=>[cx+(p[0]-cx)*k,cz+(p[1]-cz)*k]); });
    fillPoly(areaGeo.water,sh,0.12,null); oc.fillStyle='#fff'; ctxPoly(oc,rings); oc.fill('evenodd'); }
  else if(t==='solar'){ fillPoly(areaGeo.pave,rings,0.06,C('#c9c0a8')); solarAreas.push(rings); oc.fillStyle='#fff'; ctxPoly(oc,rings); oc.fill('evenodd'); }
  else if(t==='parking'||t==='apron'||t==='retail'){ if(t==='parking') parkingAreas.push(rings); if(t==='retail'){ fillPoly(areaGeo.pave,rings,0.06,C('#d8cfbd')); }
    else { fillPoly(areaGeo.pave,rings,0.06,C('#a7a8a3')); oc.fillStyle='#fff'; ctxPoly(oc,rings); oc.fill('evenodd'); } }
  else if(t==='track'){ fillPoly(areaGeo.track,rings,0.1,C('#b9573c')); oc.fillStyle='#fff'; ctxPoly(oc,rings); oc.fill('evenodd');
    for(const d of [2.2,4.4,6.6]) { const lr=offsetRing(rings[0],d); ribbon(areaGeo.lines,lr.concat([lr[0]]),0.18,0.18,C('#efe6da'),false); }
    const inner=offsetRing(rings[0],9);
    fillPoly(areaGeo.field,[inner],0.14,C('#86c65b'));
    ribbon(areaGeo.lines,inner.concat([inner[0]]),0.3,0.19,C('#f4f1e8'),false); }
  else if(t.startsWith('pitch')){
    const sport=t.split(':')[1];
    const col=courtCols[sport];
    if(col) fillPoly(areaGeo.court,rings,0.12,C(col));
    else fillPoly(areaGeo.field,rings,0.12,C('#86c65b'));
    const r=rings[0]; ribbon(areaGeo.lines,r.concat([r[0]]),0.35,0.18,C('#f4f1e8'),false);
    if(rings[0].length===4){ const p=r; const m1=[(p[0][0]+p[1][0])/2,(p[0][1]+p[1][1])/2], m2=[(p[2][0]+p[3][0])/2,(p[2][1]+p[3][1])/2];
      const m3=[(p[1][0]+p[2][0])/2,(p[1][1]+p[2][1])/2], m4=[(p[3][0]+p[0][0])/2,(p[3][1]+p[0][1])/2];
      const l1=Math.hypot(m1[0]-m2[0],m1[1]-m2[1]), l2=Math.hypot(m3[0]-m4[0],m3[1]-m4[1]);
      ribbon(areaGeo.lines, l1<l2?[m1,m2]:[m3,m4],0.3,0.18,C('#f4f1e8'),false);
      const [cx,cz]=centroid(p); const cr=Math.min(l1,l2)*0.14; const ring=[]; for(let k=0;k<=24;k++){ const an=k/24*Math.PI*2; ring.push([cx+Math.cos(an)*cr,cz+Math.sin(an)*cr]); }
      ribbon(areaGeo.lines,ring,0.3,0.18,C('#f4f1e8'),false); }
    oc.fillStyle='#fff'; ctxPoly(oc,rings); oc.fill('evenodd');
  }
}
for(const [k,o] of [['resid',1],['park',2],['wood',3]]){ const m=addOverlay(areaGeo[k],null,o); if(m) seasonize(m.material); }
addOverlay(areaGeo.pave,null,4); addOverlay(areaGeo.bank,null,4);
addOverlay(areaGeo.track,null,4.5); addOverlay(areaGeo.court,null,5); { const m=addOverlay(areaGeo.field,null,5.5); if(m) seasonize(m.material); }
addOverlay(areaGeo.lines,null,6);
{ const g=areaGeo.water.build(); const m=new THREE.Mesh(g,makeWater());
  m.renderOrder=6; m.receiveShadow=true; scene.add(m); }

