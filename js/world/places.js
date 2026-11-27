// Places from the map data (points + named areas) and building categories for the filter chips.
// places from the map data (points + named areas)
const placeNames=new Set(data.places.map(p=>p.n));
{ const IF=data.info||[], ex=new Set(labels.map(l=>l.name.toLowerCase()));
  // L8 and L9 sit on the ground floor below L12 and L13
  for(const r of IF) if(/^Lecture Hall (8|9)$/.test(r.n)&&!ex.has(r.sh.toLowerCase())) labels.push({name:r.sh,x:r.x-7,z:r.z+4,y:8,rank:20,tier:3,cat:'academic',alt:[r.n],sub:'Ground floor',size:20});
  // Tutorial Block rooms: found by search, shown when picked
  for(const r of IF) if(/^[12]\d\d$/.test(r.n)&&r.x<-210&&r.x>-260&&r.z>245&&r.z<295) labels.push({name:'TB '+r.n,short:'TB '+r.n,x:r.x,z:r.z,y:+r.lv?9:5,rank:0,tier:4.5,kind:'blk',cat:'academic',alt:['TB'+r.n,'Tutorial Block '+r.n,'Room '+r.n,r.n],sub:(+r.lv?'First floor':'Ground floor')+', Tutorial Block',size:10});
  // tennis courts and Kargil Circle
  for(const r of IF) if(/^C[1-6]$/.test(r.n)&&r.k==='pitch') labels.push({name:'Tennis Court '+r.n,short:'Court '+r.n,x:r.x,z:r.z,y:2,rank:0,tier:3.5,kind:'blk',cat:'sports',alt:[r.n+' tennis court','Tennis '+r.n,r.n],size:20});
  const kg=IF.find(r=>r.n==='Kargil circle'); if(kg&&!ex.has('kargil circle')) labels.push({name:'Kargil Circle',x:kg.x,z:kg.z,y:3,rank:15,tier:3,cat:'civic',alt:['Kargil Chowk','Kargil Heights','Kargil circle'],size:20}); }
for(const [k,g] of hallGroups) if(!placeNames.has(k)) labels.push({name:k,x:g.x/g.n,z:g.z/g.n,y:g.H+3,rank:Math.sqrt(g.area)*1.2,cat:'hostel'});
const have=new Set(labels.map(l=>l.name.toLowerCase()));
for(const p of data.places){
  p.n=cleanName(p.n);
  if(have.has(p.n.toLowerCase())) continue; have.add(p.n.toLowerCase());
  let y=3; for(const b of bInfo){ if(Math.abs(b.cx-p.x)<120&&Math.abs(b.cz-p.z)<120&&pip(p.x,p.z,b.outer)){ y=b.H+2; break; } }
  labels.push({name:p.n,x:p.x,z:p.z,y,rank:p.a?Math.sqrt(p.a)*0.8:6,cat:p.c,...(p.alt?{alt:p.alt}:{})});
}
for(const l of labels) if(l.tier===undefined) l.tier = TIER1.test(l.name) ? 1 : (l.cat==='food'||l.cat==='shop'||/^L\d+$|gate \d|lounge|^c\d$|office|association|motorsports|tailor|salon/i.test(l.name)) ? 3 : 2;

// building categories (for the filter chips)
const CATS=['academic','hostel','food','shop','sports','worship','health','civic'];
for(const bi of bInfo){
  if(bi.name && !/^(house|building) \d+$|^\d+$/i.test(bi.name)) bi.cat=bcat(bi.name,'yes');
  if(/counsel/i.test(bi.name||'')) bi.cat='health';
}
for(const p of data.places){ if(!p.c||p.c==='civic') continue;
  for(const bi of bInfo){ if(Math.abs(bi.cx-p.x)<120&&Math.abs(bi.cz-p.z)<120&&pip(p.x,p.z,bi.outer)){ if(!bi.cat||bi.cat==='academic') bi.cat=p.c; break; } } }
const CATU={uCat:{value:-1},uCatAmt:{value:0},uCatCol:{value:C('#1f8a74')},uSelf:{value:0},uDim:{value:0}};
function catAttr(geo,key0,key1){ const n=geo.p.length/3, a=new Float32Array(n).fill(-5);
  for(const bi of bInfo){ const c=bi.cat?CATS.indexOf(bi.cat):-5; for(let i=bi[key0];i<bi[key1];i++) a[i]=c; } return new THREE.Float32BufferAttribute(a,1); }
function catPatch(mat){ mat.onBeforeCompile=sh=>{ Object.assign(sh.uniforms,CATU);
  sh.vertexShader='attribute float aCat; varying float vCat;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n vCat=aCat;');
  sh.fragmentShader='uniform float uCat,uCatAmt,uSelf,uDim; uniform vec3 uCatCol; varying float vCat;\n'+sh.fragmentShader
   .replace('#include <color_fragment>',`#include <color_fragment>
    float nl=max(dot(diffuseColor.rgb,vec3(.2126,.7152,.0722)),.001);
    diffuseColor.rgb*=mix(1.,clamp(.2/nl,.32,1.),uDim);
    float cm=1.-step(.5,abs(vCat-uCat));
    if(uCatAmt>0.){ vec3 gg=vec3(dot(diffuseColor.rgb,vec3(.3,.59,.11)));
      diffuseColor.rgb=mix(diffuseColor.rgb,mix(mix(gg,vec3(.85),.45),mix(diffuseColor.rgb,uCatCol,.5),cm),uCatAmt); }`)
   .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\n totalEmissiveRadiance*=mix(1.,mix(.12,1.,cm),uCatAmt);\n totalEmissiveRadiance+=diffuseColor.rgb*min(1.,.16/max(dot(diffuseColor.rgb,vec3(.2126,.7152,.0722)),.001))*uSelf;')
   .replace('#include <opaque_fragment>',mat.userData.soft?'outgoingLight=outgoingLight/(1.+max(outgoingLight-vec3(.26),vec3(0.))*1.7);\n#include <opaque_fragment>':'#include <opaque_fragment>'); }; return mat; }
const wallMat=catPatch(new THREE.MeshLambertMaterial({vertexColors:true,map:winMap,emissiveMap:winEmi,emissive:0x000000}));
const wallGeo=wallG.build(); wallGeo.setAttribute('aCat',catAttr(wallG,'w0','w1'));
const walls=new THREE.Mesh(wallGeo,wallMat); walls.castShadow=walls.receiveShadow=true; scene.add(walls);
const roofMat=(()=>{ const m=new THREE.MeshLambertMaterial({vertexColors:true,flatShading:true,side:THREE.DoubleSide}); m.userData.soft=1; return catPatch(m); })();  // soft highlight roll-off: flat roofs never glare at noon
const roofGeo=roofG.build(); roofGeo.setAttribute('aCat',catAttr(roofG,'r0','r1'));
const roofs=new THREE.Mesh(roofGeo,roofMat); roofs.castShadow=roofs.receiveShadow=true; scene.add(roofs);
