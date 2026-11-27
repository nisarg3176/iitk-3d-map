// Shared night-glow geometry, metro viaduct, raised walkways, bridges, steps, fences, canal, bleachers, point features (gates, towers, fountains, kiosks…).
const nightHooks=[];
const dg=new Geo();                       // misc solids (vertex coloured)
const doorG=new Geo();                    // entrances (glow at night)
const glowW=new Geo(), glowS=new Geo(), glowC=new Geo(), glowF=new Geo();   // lit glass, lamp fittings, lit water (glow at night)
const xLamps=[];                          // extra small lamp posts for plazas
const flatD=new Geo();                    // flat ground markings
function offsets(pts,hw){ const n=pts.length,L=[],Rt=[];
  for(let i=0;i<n;i++){ const p=pts[i], pr=pts[Math.max(0,i-1)], nx=pts[Math.min(n-1,i+1)];
    let d1x=p[0]-pr[0],d1z=p[1]-pr[1],d2x=nx[0]-p[0],d2z=nx[1]-p[1]; const l1=Math.hypot(d1x,d1z)||1,l2=Math.hypot(d2x,d2z)||1;
    d1x/=l1;d1z/=l1;d2x/=l2;d2z/=l2; let dx,dz; if(i===0){dx=d2x;dz=d2z;} else if(i===n-1){dx=d1x;dz=d1z;} else {dx=d1x+d2x;dz=d1z+d2z;}
    const l=Math.hypot(dx,dz)||1; dx/=l;dz/=l; let m=hw; if(i>0&&i<n-1){ m=hw/Math.max(dx*d2x+dz*d2z,0.5); }
    L.push([p[0]-dz*m,p[1]+dx*m]); Rt.push([p[0]+dz*m,p[1]-dx*m]); }
  return [L,Rt]; }
function quad(g,a,b,y0,y1,col){ // vertical quad a->b
  let nx=b[1]-a[1], nz=-(b[0]-a[0]); const l=Math.hypot(nx,nz)||1; nx/=l; nz/=l;
  const P=(p,y)=>{ g.p.push(p[0],y,p[1]); g.n.push(nx,0,nz); g.c.push(col.r,col.g,col.b); };
  P(a,y0);P(b,y0);P(b,y1); P(a,y0);P(b,y1);P(a,y1); }
function solidRibbon(g,pts,w,y0,y1,col,top=true,bottom=false){
  if(pts.length<2) return; const [L,Rt]=offsets(pts,w/2); const sc=col.clone().multiplyScalar(0.8);
  for(let i=0;i<pts.length-1;i++){
    if(top){ g.flat(L[i][0],L[i][1],Rt[i][0],Rt[i][1],Rt[i+1][0],Rt[i+1][1],y1,col); g.flat(L[i][0],L[i][1],Rt[i+1][0],Rt[i+1][1],L[i+1][0],L[i+1][1],y1,col); }
    if(bottom){ const bc=col.clone().multiplyScalar(0.55); g.flat(L[i][0],L[i][1],Rt[i][0],Rt[i][1],Rt[i+1][0],Rt[i+1][1],y0,bc); g.flat(L[i][0],L[i][1],Rt[i+1][0],Rt[i+1][1],L[i+1][0],L[i+1][1],y0,bc); }
    quad(g,L[i],L[i+1],y0,y1,sc); quad(g,Rt[i+1],Rt[i],y0,y1,sc); }
}
function prism(g,ring,y0,y1,col){ fillPoly(g,[ring],y1,col); const sc=col.clone().multiplyScalar(0.82);
  for(let i=0;i<ring.length;i++) quad(g,ring[i],ring[(i+1)%ring.length],y0,y1,sc); }
function flatRect(g,cx,cz,w,d,ang,y,col){ const c=Math.cos(ang),s=Math.sin(ang); const P=(x,z)=>[cx+x*c-z*s,cz+x*s+z*c];
  const q=[P(-w/2,-d/2),P(w/2,-d/2),P(w/2,d/2),P(-w/2,d/2)]; g.flat(q[0][0],q[0][1],q[1][0],q[1][1],q[2][0],q[2][1],y,col); g.flat(q[0][0],q[0][1],q[2][0],q[2][1],q[3][0],q[3][1],y,col); }
function ringFlat(g,cx,cz,r0,r1,y,col,seg=40){ for(let k=0;k<seg;k++){ const a=k/seg*Math.PI*2,b=(k+1)/seg*Math.PI*2;
  const A0=[cx+Math.cos(a)*r0,cz+Math.sin(a)*r0],A1=[cx+Math.cos(a)*r1,cz+Math.sin(a)*r1],B0=[cx+Math.cos(b)*r0,cz+Math.sin(b)*r0],B1=[cx+Math.cos(b)*r1,cz+Math.sin(b)*r1];
  g.flat(A0[0],A0[1],A1[0],A1[1],B1[0],B1[1],y,col); g.flat(A0[0],A0[1],B1[0],B1[1],B0[0],B0[1],y,col); } }
function markOcc(x,z,r){ oc.fillStyle='#fff'; oc.beginPath(); oc.arc(toPx(x),toPx(z),Math.max(1,r*pxPerM),0,7); oc.fill(); }
function nearestRoad(x,z,maxD=30){ let best=null,bd=maxD;
  for(const v of vehicular) for(let i=0;i<v.pts.length-1;i++){ const a=v.pts[i],b=v.pts[i+1]; const dx=b[0]-a[0],dz=b[1]-a[1],L=dx*dx+dz*dz; if(!L) continue;
    const t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/L)); const d=Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);
    if(d<bd){ bd=d; best={ang:Math.atan2(dz,dx),w:v.w,d,px:a[0]+t*dx,pz:a[1]+t*dz,n:v.n}; } }
  return best; }
function wayAt(x,z){ let best=null,bd=1e9; for(const r of data.roads){ const p=r.p; for(let i=0;i+3<p.length;i+=2){ const ax=p[i],az=p[i+1],bx=p[i+2],bz=p[i+3]; if(Math.abs(ax-x)>250&&Math.abs(bx-x)>250) continue;
  const dx=bx-ax,dz=bz-az,L=dx*dx+dz*dz; if(!L) continue; const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/L)); const d=Math.hypot(x-ax-t*dx,z-az-t*dz), Ls=Math.sqrt(L); if(d<bd-0.3||(d<bd+0.3&&best&&Ls>best.L)){ bd=Math.min(d,bd); best={ang:Math.atan2(dz,dx),w:(ROAD[r.t]?ROAD[r.t][0]:4),d,t:r.t,L:Ls}; } } } return best; }   // at a bend, follow the longer segment
const stdMat=(c,o={})=>new THREE.MeshLambertMaterial({color:c,flatShading:true,...o});
function addMesh(geo,mat,x,y,z,ry=0){ const m=new THREE.Mesh(geo,mat); m.position.set(x,y,z); m.rotation.y=ry; m.castShadow=true; m.receiveShadow=true; scene.add(m); return m; }
const DL=data.dlines||[], DP=data.dpts||[];

// ---- Orange Line metro viaduct
{
  const deck=C('#d4cfc6'), orange=C('#ec7a2a'), pier=C('#c9c3b8'), railC=C('#55585e');
  const metro=DL.filter(l=>l.t==='metro').map(l=>toPts(l.p));
  for(const pts of metro){
    solidRibbon(dg,pts,9,9.4,11.2,deck,true,true);
    solidRibbon(dg,pts,9.25,10.2,10.8,orange,false);
    for(const s of [-1.75,1.75]){ const [L]=offsets(pts,s); solidRibbon(dg,L,0.22,11.2,11.42,railC); }
    for(const s of [-4.3,4.3]){ const [L]=offsets(pts,s); solidRibbon(dg,L,0.3,11.2,12.3,deck); }
    walk(pts,30,10,(x,z,dx,dz)=>{ const ang=Math.atan2(dz,dx); box(dg,x,z,2.2,2.4,0,8.4,ang,pier); box(dg,x,z,2.6,7.5,8.4,1.0,ang,pier); markOcc(x,z,3); });
  }
  const st=data.places.find(p=>/metro station/i.test(p.n));
  if(st && metro.length){ let best=null,bd=1e9; for(const pts of metro) for(let i=0;i<pts.length-1;i++){ const a=pts[i],b=pts[i+1]; const mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2; const d=Math.hypot(mx-st.x,mz-st.z); if(d<bd){bd=d;best=Math.atan2(b[1]-a[1],b[0]-a[0]);} }
    if(bd<300){ box(dg,st.x,st.z,135,24,7.2,9.6,best,C('#ebe6dc')); box(dg,st.x,st.z,135.5,24.4,15.2,0.9,best,orange); box(dg,st.x,st.z,140,27,16.8,0.6,best,C('#9fa6ad'));
      for(const s of [-1,1]) box(dg,st.x+Math.cos(best+Math.PI/2)*s*22,st.z+Math.sin(best+Math.PI/2)*s*22,10,7,0,7.2,best,C('#e1dbd0')); st.y=19; } }
}
// ---- raised academic-area walkways & covered corridors
{
  const deck=C('#aaa59b'), roof=C('#9e9a91'), post=C('#8f8b83'); // raw grey concrete, as on campus
  const items=[];
  for(const r of data.roads) if(r.lv && r.b) items.push({pts:toPts(r.p),y:Math.max(1,r.lv)*4.2});
  const insideB=(x,z)=>bInfo.some(b=>Math.abs(b.cx-x)<150&&Math.abs(b.cz-z)<150&&pip(x,z,b.outer));
  for(const l of DL) if(l.t==='corridor'){ const pts=toPts(l.p); let n=0,inn=0; walk(pts,3,0,(x,z)=>{ n++; if(insideB(x,z)) inn++; }); if(n && inn/n>0.4) continue; items.push({pts,y:(l.lv||0)*4.2}); }
  for(const it of items){ const {pts,y}=it; if(pts.length<2) continue;
    if(y>0) solidRibbon(dg,pts,3.0,y-0.4,y,deck,true,true);
    solidRibbon(dg,pts,4.0,y+2.6,y+3.3,roof,true,true); if(y>0) for(const s of [-1.45,1.45]){ const [L]=offsets(pts,s); solidRibbon(dg,L,0.18,y,y+1.0,deck); }
    walk(pts,7,1.5,(x,z,dx,dz)=>{ for(const s of [-1.35,1.35]) box(dg,x-dz*s,z+dx*s,0.3,0.3,0,y+3,Math.atan2(dz,dx),post); });
  }
}
// ---- bridges: parapet walls
{
  const par=C('#cfc8bb');
  for(const r of data.roads){ if(!r.b || r.lv) continue; const sp=ROAD[r.t]; if(!sp) continue; const pts=toPts(r.p); if(pts.length<2) continue;
    const hw=sp[0]/2+(sp[1]===1?1.5:0.25);
    for(const s of [-hw,hw]){ const [L]=offsets(pts,s); solidRibbon(dg,L,0.35,0.15,1.25,par); } }
}
// ---- steps: tread stripes
{
  const tread=C('#a9977a');
  for(const r of data.roads){ if(r.t!=='steps') continue; const pts=toPts(r.p); const w=ROAD.steps[0];
    walk(pts,0.7,0.3,(x,z,dx,dz)=>{ flatRect(flatD,x,z,0.16,w,Math.atan2(dz,dx),0.24,tread); }); }
}
// ---- fences, walls, hedges
for(const l of DL){ const pts=toPts(l.p);
  if(l.t==='fence') solidRibbon(dg,pts,0.12,0,1.8,C('#7d8579'));
  else if(l.t==='wall'||l.t==='retaining_wall') solidRibbon(dg,pts,0.35,0,2.1,C('#ddd2bf'));
  else if(l.t==='hedge') solidRibbon(dg,pts,1.3,0,1.3,C('#4f8a3c'));
}
// ---- canal & ditch
{
  const bank=new Geo(), wat=new Geo();
  for(const l of DL){ if(l.t!=='canal'&&l.t!=='ditch'&&l.t!=='drain'&&l.t!=='stream') continue; const pts=toPts(l.p); const w=l.w||(l.t==='canal'?15:2.6);
    ribbon(bank,pts,w+(l.t==='canal'?5:1.4),0.06,C('#bba97e'),false); ribbon(wat,pts,w,0.11,null,false);
    oc.lineWidth=(w+6)*pxPerM; ctxLine(oc,pts); oc.stroke(); }
  addOverlay(bank,null,4.2);
  if(wat.p.length){ const m=new THREE.Mesh(wat.build(),makeWater(0x3a7f8f)); m.renderOrder=6.2; m.receiveShadow=true; scene.add(m); }
}
// ---- bleachers (stepped)
for(const a of data.areas){ if(a.t!=='bleachers') continue; const r=toPts(a.r[0]); const foy=r[0][0]>-115&&r[0][0]<-90&&r[0][1]>268&&r[0][1]<290;
  for(let k=0;k<4;k++){ const ring=k?offsetRing(r,k*1.3):r; prism(dg,ring,0,(k+1)*0.75,foy?(k%2?C('#b39a7a'):C('#d6c6a8')):(k%2?C('#3d6fd6'):C('#d6d2ca'))); } oc.fillStyle='#fff'; ctxPoly(oc,[r]); oc.fill(); }
// ---- point features
const towerMat=stdMat(0xd9d5cc), tankMat=stdMat(0xcfd8dc), steelMat=stdMat(0xa3a9af), redMat=stdMat(0xc8453a), whiteMat=stdMat(0xf1efe9),
      stoneMat=stdMat(0xd8cfbd), waterMat=new THREE.MeshStandardMaterial({color:0x4aa0c8,roughness:0.1,metalness:0.2}),
      sprayMat=new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:0.55,depthWrite:false});
  { const wc0=new THREE.Color(0x4aa0c8), wc1=new THREE.Color(0x1d3a52); nightHooks.push(n=>{ waterMat.color.copy(wc0).lerp(wc1,n*0.85); waterMat.roughness=0.1+0.55*n; waterMat.metalness=0.2-0.2*n; waterMat.envMapIntensity=1-0.7*n; sprayMat.opacity=0.55-0.3*n; }); }
const powerTowers=[];
const poiIcons=[];
for(const d of DP){
  const {x,z}=d;
  if(d.t==='water_tower'){ const r=Math.min(9,Math.max(4,d.r||5));
    addMesh(new THREE.CylinderGeometry(r*0.3,r*0.4,18,10),towerMat,x,9,z);
    addMesh(new THREE.CylinderGeometry(r,r*0.82,7,16),tankMat,x,21.5,z);
    addMesh(new THREE.ConeGeometry(r*1.04,2.6,16),towerMat,x,26.3,z); markOcc(x,z,r); }
  else if(d.t==='comm_tower'){ const H=44, n=6; for(let i=0;i<n;i++){ const r0=1.9*(1-i/n)+0.35, r1=1.9*(1-(i+1)/n)+0.35;
      addMesh(new THREE.CylinderGeometry(r1,r0,H/n,4),i%2?whiteMat:redMat,x,H/n*(i+0.5),z,Math.PI/4); }
    addMesh(new THREE.CylinderGeometry(1.6,1.6,0.4,8),steelMat,x,H*0.72,z); markOcc(x,z,3); }
  else if(d.t==='power_tower') powerTowers.push([x,z,null]);
  else if(d.t==='helipad'){ const pad=C('#cbc9c2'), yl=C('#e8c34d'), wh=C('#f6f4ee');
    disc(flatD,x,z,10.5,0.2,pad,40); ringFlat(flatD,x,z,8.4,9.2,0.23,yl);
    flatRect(flatD,x-2.1,z,0.95,6.2,0,0.25,wh); flatRect(flatD,x+2.1,z,0.95,6.2,0,0.25,wh); flatRect(flatD,x,z,3.3,0.95,0,0.25,wh); markOcc(x,z,11); }
  else if(d.t==='fountain'){ const s=Math.min(2.2,Math.max(1,(d.r||3.6)/3.6));
    addMesh(new THREE.CylinderGeometry(3.6*s,3.9*s,0.8,24),stoneMat,x,0.4,z);
    addMesh(new THREE.CylinderGeometry(3.25*s,3.25*s,0.12,24),waterMat,x,0.78,z);
    addMesh(new THREE.CylinderGeometry(0.35,0.55,1.9,10),stoneMat,x,1.2,z);
    const sp=addMesh(new THREE.IcosahedronGeometry(1,1),sprayMat,x,2.5,z); sp.scale.set(1.1*s,1.4,1.1*s); sp.castShadow=false; markOcc(x,z,4*s); }
  else if(d.t==='planter'){ box(dg,x,z,2.6,1.3,0,0.7,0,C('#b9a894')); bushes.push([x,z,0.9,0.7]); }
  else if(d.t==='bus'){ const nr=nearestRoad(x,z,25); const ang=nr?nr.ang:0; const c=C('#3c6e8f');
    box(dg,x,z,4.6,2.0,2.6,0.18,ang,c); box(dg,x-Math.cos(ang+Math.PI/2)*0.9,z-Math.sin(ang+Math.PI/2)*0.9,4.4,0.1,0,2.6,ang,C('#bfd5df'));
    for(const s of [-2.1,2.1]) box(dg,x+Math.cos(ang)*s,z+Math.sin(ang)*s,0.15,0.15,0,2.6,ang,c);
    poiIcons.push({t:'bus',x,z}); }
  else if(d.t==='gate'||d.t==='lift_gate'){ const wy=d.t==='gate'?wayAt(x,z):null; const nr=wy&&wy.d<6?{ang:wy.ang,w:Math.max(3,wy.w)}:nearestRoad(x,z,25); const ang=nr?nr.ang:0, w=nr?nr.w+2.6:6;
    const cx=Math.cos(ang+Math.PI/2), cz=Math.sin(ang+Math.PI/2);
    if(d.t==='gate'&&d.n&&/Academic Area Gate/.test(d.n)){ // red-brick pillars, open iron gates and a small tiled guard room
      const br=C('#a24e39'), cap=C('#ddd6c8'), iron=C('#26292d');
      for(const s of [-1,1]){ const px=x+cx*s*(w/2+0.7), pz=z+cz*s*(w/2+0.7); box(dg,px,pz,1.3,1.3,0,3.0,ang,br); box(dg,px,pz,1.6,1.6,3.0,0.3,ang,cap); box(dg,px,pz,0.5,0.5,3.3,0.35,ang,cap);
        const L=w/2*0.95, c0=Math.cos(ang), s0=Math.sin(ang); // leaf swung open, lying along the kerb
        for(const yy of [0.2,1.1,2.0]) box(dg,px+c0*(L/2+0.7),pz+s0*(L/2+0.7),L,0.07,yy,0.09,ang,iron);
        for(let k=0;k<=Math.round(L/0.35);k++){ const t=0.7+k*0.35; box(dg,px+c0*t,pz+s0*t,0.05,0.05,0.1,2.05,ang,iron); } }
      let sd=0; for(const s of [1,-1]){ const gx=x+cx*s*(w/2+3.4), gz=z+cz*s*(w/2+3.4); if(!roadAt(gx,gz)&&!roadAt(gx+cx*s*1.4,gz+cz*s*1.4)&&!bInfo.some(b=>Math.abs(b.cx-gx)<90&&Math.abs(b.cz-gz)<90&&pip(gx,gz,b.outer))){ sd=s; break; } }
      if(sd){ const gx=x+cx*sd*(w/2+3.4), gz=z+cz*sd*(w/2+3.4); box(dg,gx,gz,2.6,2.6,0,2.6,ang,br); box(dg,gx-cx*sd*1.31,gz-cz*sd*1.31,1.2,0.06,1.1,0.9,ang,C('#2b3640'));
        box(dg,gx,gz,3.0,3.0,2.6,0.2,ang,C('#cfc8bb')); box(dg,gx,gz,2.2,2.2,2.8,0.45,ang,C('#b4553a')); markOcc(gx,gz,2.5); } }
    else if(d.t==='gate'){ const pc=C('#d9cdb4'); for(const s of [-1,1]) box(dg,x+cx*s*(w/2+0.6),z+cz*s*(w/2+0.6),1.1,1.1,0,d.n?4.6:2.6,ang,pc);
      if(d.n){ box(dg,x,z,1.0,w+2.4,4.6,1.0,ang,pc); } }
    else { box(dg,x+cx*(-w/2-0.5),z+cz*(-w/2-0.5),0.45,0.45,0,1.2,ang,C('#3b4048'));
      const n=Math.max(2,Math.round(w)); for(let i=0;i<n;i++){ const t=-w/2+(i+0.5)*w/n; box(dg,x+cx*t,z+cz*t,0.14,w/n,1.0,0.14,ang,i%2?C('#f1efe9'):C('#d0372b')); }
      if(x>900&&Math.abs(z-297)<40){ const gx=x+cx*(-w/2-3.0), gz=z+cz*(-w/2-3.0); box(dg,gx,gz,3.6,3.6,0,0.5,ang,C('#d9d4ca')); box(dg,gx,gz,3.4,3.4,0.5,2.5,ang,C('#7f93a6'));
        for(const [ox,oz] of [[1.72,0],[-1.72,0],[0,1.72],[0,-1.72]]) box(dg,gx+Math.cos(ang)*ox-Math.sin(ang)*oz,gz+Math.sin(ang)*ox+Math.cos(ang)*oz,oz?2.2:0.08,oz?0.08:2.2,1.25,1.25,ang,C('#2b3640'));
        box(dg,gx,gz,3.9,3.9,3.0,0.18,ang,C('#e9e6df')); box(dg,gx,gz,3.9,3.9,3.18,0.42,ang,C('#2f8f6b')); markOcc(gx,gz,2.5); }
      else { const gx=x+cx*(-w/2-2.6), gz=z+cz*(-w/2-2.6); box(dg,gx,gz,2.2,2.2,0,2.6,ang,C('#e8e0d0')); box(dg,gx,gz,2.8,2.8,2.6,0.25,ang,C('#a95a3e')); } } }
  else if(['toilets','water','bike','ev','post','atm','hydrant'].includes(d.t)) poiIcons.push({t:d.t,x,z});
}

// ================= hand-made models (from photos) =================
