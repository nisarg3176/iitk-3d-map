// Roads: asphalt, kerbs, footpaths, markings, rails; road-occupancy map used to keep things off roads.
// --- roads
const ROAD={primary:[11,1],primary_link:[8,1],secondary_link:[8,1],tertiary_link:[7,1],trunk:[12,1],trunk_link:[9,1],secondary:[10,1],tertiary:[9,1],unclassified:[7,1],residential:[7,1],living_street:[5.5,1],service:[4.6,1],
  runway:[30,1],taxiway:[14,1],track:[3.2,2],footway:[2.4,3],path:[2.0,3],cycleway:[2.6,3],pedestrian:[3,3],crossing:[3,3],steps:[2,3]};
const rg={foot:new Geo(),curb:new Geo(),asph:new Geo(),mark:new Geo(),edge:new Geo(),rail:new Geo(),railTop:new Geo()};
const asphaltCol=C('#6c6f73'), curbCol=C('#d7d2c6'), footCol=C('#dccaa4'), trackCol=C('#c7ad80'), markCol=C('#f3efe3'), yellow=C('#e8c34d');
const vehicular=[], footways=[];
oc.lineCap='round'; oc.lineJoin='round'; oc.strokeStyle='#fff';
for(const r of data.roads){
  const spec=ROAD[r.t]; if(!spec) continue;
  const pts=toPts(r.p); if(pts.length<2) continue;
  const [w0,kind]=spec, w=r.w||w0;  // r.w: a lane narrowed to fit between houses
  oc.lineWidth=(w+(kind===1?4:2))*pxPerM; ctxLine(oc,pts); oc.stroke();
  if(kind===3 && r.lv && r.b) continue;
  if(kind===3 || kind===2) footways.push({pts,w,t:r.t});
  if(kind===3){ ribbon(rg.foot,pts,w,0.14,footCol); dashes(rg.edge,pts,1.2,1.2,0.22,0.2,yellow); }
  else if(kind===2){ ribbon(rg.foot,pts,w,0.13,trackCol); }
  else {
    ribbon(rg.curb,pts,w+2.6,0.16,curbCol);
    for(let i=1;i<pts.length-1;i++) disc(rg.curb,pts[i][0],pts[i][1],(w+2.6)/2,0.16,curbCol,10);
    ribbon(rg.asph,pts,w,0.2,asphaltCol);
    for(let i=1;i<pts.length-1;i++) disc(rg.asph,pts[i][0],pts[i][1],w/2,0.2,asphaltCol,10);
    if(r.t==='runway'){ dashes(rg.mark,pts,22,14,0.9,0.26,markCol); ribbon(rg.mark,pts,0.5,0.25,markCol,false);
      const off=(w/2-1.5); const sh=(s)=>pts.map((p,i)=>{ const q=pts[Math.min(i+1,pts.length-1)],o=pts[Math.max(i-1,0)]; let dx=q[0]-o[0],dz=q[1]-o[1]; const l=Math.hypot(dx,dz)||1; return [p[0]-dz/l*off*s,p[1]+dx/l*off*s]; });
      ribbon(rg.mark,sh(1),0.6,0.25,markCol,false); ribbon(rg.mark,sh(-1),0.6,0.25,markCol,false); }
    else if(w>=6.5) dashes(rg.mark,pts,3,4,0.22,0.26,markCol);
    vehicular.push({pts,w,t:r.t,n:r.n});
  }
}
for(const rl of data.rails){ const pts=toPts(rl); ribbon(rg.rail,pts,4.2,0.1,C('#9b8f7f'),false);
  oc.lineWidth=8*pxPerM; ctxLine(oc,pts); oc.stroke();
  for(const s of [-0.75,0.75]){ const sh=pts.map((p,i)=>{ const q=pts[Math.min(i+1,pts.length-1)],o=pts[Math.max(i-1,0)]; let dx=q[0]-o[0],dz=q[1]-o[1]; const l=Math.hypot(dx,dz)||1; return [p[0]-dz/l*s,p[1]+dx/l*s]; });
    ribbon(rg.railTop,sh,0.18,0.18,C('#4a4a4e'),false); } }
addOverlay(rg.rail,null,7); addOverlay(rg.railTop,null,8);
const footM=addOverlay(rg.foot,null,8); addOverlay(rg.edge,null,9);
addOverlay(rg.curb,null,10); const asphM=addOverlay(rg.asph,null,11); addOverlay(rg.mark,null,12);
if(asphM){ asphM.material=new THREE.MeshStandardMaterial({vertexColors:true,depthWrite:false,roughness:0.95,metalness:0}); asphM.material.userData.wet=1; }

const occNoB=oc.getImageData(0,0,OCC,OCC).data;
const roadAt=(x,z)=>{ const i=(toPx(z)|0)*OCC+(toPx(x)|0); if(i<0||i>=OCC*OCC) return 1; return occNoB[i*4]>40; };
lmsg.textContent='Raising the buildings…'; await tick();

