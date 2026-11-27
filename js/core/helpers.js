// Shared helpers: random numbers, noise, geometry builder (Geo), polygon maths, ribbons, discs, dashes.
const lmsg = document.getElementById('lmsg');
const tick = () => new Promise(r => setTimeout(r, 0));

/* ---------------- helpers ---------------- */
function rng(seed){ const f=function(){ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed);
  t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; f.st=()=>seed; f.set=v=>{seed=v;}; return f; }
const R = rng(20261121);
const rr = (a,b)=>a+(b-a)*R();
function hash2(x,y){ let h = Math.imul(x|0,374761393) + Math.imul(y|0,668265263); h=(h^(h>>>13))*1274126177|0; return ((h^(h>>>16))>>>0)/4294967296; }
function vnoise(x,y){ const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi;
  const u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf);
  const a=hash2(xi,yi), b=hash2(xi+1,yi), c=hash2(xi,yi+1), d=hash2(xi+1,yi+1);
  return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vnoise(x,y)*.55+vnoise(x*2.1+7,y*2.1+3)*.3+vnoise(x*4.3+1,y*4.3+9)*.15; }
const C = h => new THREE.Color(h);
const isCoarse = matchMedia('(pointer:coarse)').matches || Math.min(innerWidth,innerHeight) < 600;

class Geo { // non-indexed geometry builder
  constructor(){ this.p=[]; this.n=[]; this.c=[]; this.uv=[]; }
  v(x,y,z,nx,ny,nz,col,u,vv){ this.p.push(x,y,z); this.n.push(nx,ny,nz); if(col) this.c.push(col.r,col.g,col.b); if(u!==undefined) this.uv.push(u,vv); }
  tri(ax,ay,az,bx,by,bz,cx,cy,cz,col){ // auto-orient so normal points up-ish
    let ux=bx-ax,uy=by-ay,uz=bz-az,vx=cx-ax,vy=cy-ay,vz=cz-az;
    let nx=uy*vz-uz*vy, ny=uz*vx-ux*vz, nz=ux*vy-uy*vx;
    if(ny<0){ [bx,by,bz,cx,cy,cz]=[cx,cy,cz,bx,by,bz]; nx=-nx;ny=-ny;nz=-nz; }
    const l=Math.hypot(nx,ny,nz)||1; nx/=l;ny/=l;nz/=l;
    this.v(ax,ay,az,nx,ny,nz,col); this.v(bx,by,bz,nx,ny,nz,col); this.v(cx,cy,cz,nx,ny,nz,col);
  }
  flat(ax,az,bx,bz,cx,cz,y,col){ this.tri(ax,y,az,bx,y,bz,cx,y,cz,col); }
  build(){ const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));
    g.setAttribute('normal',new THREE.Float32BufferAttribute(this.n,3));
    if(this.c.length) g.setAttribute('color',new THREE.Float32BufferAttribute(this.c,3));
    if(this.uv.length) g.setAttribute('uv',new THREE.Float32BufferAttribute(this.uv,2));
    g.computeBoundingSphere(); return g; }
}
function toPts(flat){ const a=[]; for(let i=0;i<flat.length;i+=2) a.push([flat[i],flat[i+1]]); return a; }
function signedArea(r){ let a=0; for(let i=0;i<r.length;i++){ const p=r[i],q=r[(i+1)%r.length]; a+=p[0]*q[1]-q[0]*p[1]; } return a/2; }
function centroid(r){ let x=0,z=0; for(const p of r){x+=p[0];z+=p[1];} return [x/r.length,z/r.length]; }
function pip(x,z,r){ let ins=false; for(let i=0,j=r.length-1;i<r.length;j=i++){ const a=r[i],b=r[j];
  if(((a[1]>z)!==(b[1]>z)) && (x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])) ins=!ins; } return ins; }
function offsetRing(r,d){ // inward offset
  const s=signedArea(r)>0?1:-1, n=r.length, out=[];
  for(let i=0;i<n;i++){ const p=r[(i-1+n)%n], c=r[i], q=r[(i+1)%n];
    let e1x=c[0]-p[0],e1z=c[1]-p[1],e2x=q[0]-c[0],e2z=q[1]-c[1]; const l1=Math.hypot(e1x,e1z)||1,l2=Math.hypot(e2x,e2z)||1;
    e1x/=l1;e1z/=l1;e2x/=l2;e2z/=l2;
    let nx=-(e1z+e2z)*s, nz=(e1x+e2x)*s; const l=Math.hypot(nx,nz)||1; nx/=l;nz/=l;
    const cos=Math.max(0.5,nx*(-e2z*s)+nz*(e2x*s));
    out.push([c[0]+nx*d/cos,c[1]+nz*d/cos]); }
  return out; }
function mainAngle(r){ let best=0,bl=0; for(let i=0;i<r.length;i++){const a=r[i],b=r[(i+1)%r.length]; const l=Math.hypot(b[0]-a[0],b[1]-a[1]); if(l>bl){bl=l;best=Math.atan2(b[1]-a[1],b[0]-a[0]);}} return best; }
function gridInPoly(rings, stepU, stepV, inset, cb){
  const outer=rings[0], ang=mainAngle(outer), c=Math.cos(ang), s=Math.sin(ang);
  let mnu=1e9,mxu=-1e9,mnv=1e9,mxv=-1e9;
  for(const p of outer){ const u=p[0]*c+p[1]*s, v=-p[0]*s+p[1]*c; mnu=Math.min(mnu,u);mxu=Math.max(mxu,u);mnv=Math.min(mnv,v);mxv=Math.max(mxv,v); }
  const inside=(px,pz)=>pip(px,pz,outer)&&!rings.slice(1).some(h=>pip(px,pz,h));
  let j=0;
  for(let v=mnv+inset; v<=mxv-inset; v+=stepV, j++){ let i=0; for(let u=mnu+inset; u<=mxu-inset; u+=stepU, i++){
    const x=u*c-v*s, z=u*s+v*c; if(!inside(x,z)) continue;
    let ok=true; for(const [du,dv] of [[inset,0],[-inset,0],[0,inset],[0,-inset]]) if(!inside(x+du*c-dv*s, z+du*s+dv*c)){ok=false;break;}
    if(ok) cb(x,z,ang,i,j); } }
}
function blur(src,w,h,r){ const tmp=new Float32Array(w*h), out=new Float32Array(w*h), k=2*r+1;
  for(let y=0;y<h;y++){ const o=y*w; let acc=0; for(let x=-r;x<=r;x++) acc+=src[o+Math.min(w-1,Math.max(0,x))];
    for(let x=0;x<w;x++){ tmp[o+x]=acc/k; acc+=src[o+Math.min(w-1,x+r+1)]-src[o+Math.max(0,x-r)]; } }
  for(let x=0;x<w;x++){ let acc=0; for(let y=-r;y<=r;y++) acc+=tmp[Math.min(h-1,Math.max(0,y))*w+x];
    for(let y=0;y<h;y++){ out[y*w+x]=acc/k; acc+=tmp[Math.min(h-1,y+r+1)*w+x]-tmp[Math.max(0,y-r)*w+x]; } }
  return out; }
function fillPoly(geo, rings, y, colFn){
  const contour=rings[0].map(p=>new THREE.Vector2(p[0],p[1]));
  const holes=rings.slice(1).map(r=>r.map(p=>new THREE.Vector2(p[0],p[1])));
  let tris; try{ tris=THREE.ShapeUtils.triangulateShape(contour,holes); }catch(e){ return; }
  const all=contour.concat(...holes);
  for(const t of tris){ const a=all[t[0]],b=all[t[1]],c=all[t[2]];
    const col = typeof colFn==='function' ? colFn((a.x+b.x+c.x)/3,(a.y+b.y+c.y)/3) : colFn;
    geo.flat(a.x,a.y,b.x,b.y,c.x,c.y,y,col); }
}
function ribbon(geo, pts, w, y, col, joints=true){
  const hw=w/2, n=pts.length;
  if(n<2) return;
  const L=[],Rt=[];
  for(let i=0;i<n;i++){
    const p=pts[i]; let dx,dz;
    const pr=pts[Math.max(0,i-1)], nx=pts[Math.min(n-1,i+1)];
    let d1x=p[0]-pr[0], d1z=p[1]-pr[1], d2x=nx[0]-p[0], d2z=nx[1]-p[1];
    const l1=Math.hypot(d1x,d1z)||1, l2=Math.hypot(d2x,d2z)||1;
    d1x/=l1;d1z/=l1;d2x/=l2;d2z/=l2;
    if(i===0){dx=d2x;dz=d2z;} else if(i===n-1){dx=d1x;dz=d1z;} else {dx=d1x+d2x;dz=d1z+d2z;}
    const l=Math.hypot(dx,dz)||1; dx/=l;dz/=l;
    let m=hw; if(i>0&&i<n-1){ const cos=dx*d2x+dz*d2z; m=hw/Math.max(cos,0.5); }
    L.push([p[0]-dz*m,p[1]+dx*m]); Rt.push([p[0]+dz*m,p[1]-dx*m]);
  }
  for(let i=0;i<n-1;i++){
    geo.flat(L[i][0],L[i][1],Rt[i][0],Rt[i][1],Rt[i+1][0],Rt[i+1][1],y,col);
    geo.flat(L[i][0],L[i][1],Rt[i+1][0],Rt[i+1][1],L[i+1][0],L[i+1][1],y,col);
  }
  if(joints) for(const i of [0,n-1]) disc(geo,pts[i][0],pts[i][1],hw,y,col,10);
}
function disc(geo,x,z,r,y,col,seg=10){ for(let k=0;k<seg;k++){ const a=k/seg*Math.PI*2,b=(k+1)/seg*Math.PI*2;
  geo.flat(x,z,x+Math.cos(a)*r,z+Math.sin(a)*r,x+Math.cos(b)*r,z+Math.sin(b)*r,y,col); } }
function walk(pts, step, offset0, cb){ // callback at every `step` metres along polyline
  let acc=offset0;
  for(let i=0;i<pts.length-1;i++){ const a=pts[i],b=pts[i+1]; const dx=b[0]-a[0],dz=b[1]-a[1]; const l=Math.hypot(dx,dz); if(!l) continue;
    while(acc<=l){ const t=acc/l; cb(a[0]+dx*t,a[1]+dz*t,dx/l,dz/l); acc+=step; } acc-=l; }
}
function dashes(geo, pts, dash, gap, w, y, col){
  let pos=0, on=true, left=dash;
  for(let i=0;i<pts.length-1;i++){ let a=pts[i],b=pts[i+1]; let dx=b[0]-a[0],dz=b[1]-a[1]; let l=Math.hypot(dx,dz); if(!l) continue;
    const ux=dx/l,uz=dz/l; let s=0;
    while(s<l){ const take=Math.min(left,l-s);
      if(on){ const x0=a[0]+ux*s,z0=a[1]+uz*s,x1=a[0]+ux*(s+take),z1=a[1]+uz*(s+take); const hx=-uz*w/2,hz=ux*w/2;
        geo.flat(x0+hx,z0+hz,x0-hx,z0-hz,x1-hx,z1-hz,y,col); geo.flat(x0+hx,z0+hz,x1-hx,z1-hz,x1+hx,z1+hz,y,col); }
      s+=take; left-=take; if(left<=1e-6){ on=!on; left=on?dash:gap; } }
  }
}

