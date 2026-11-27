// Helpers shared by every landmark file (opens the landmarks block, which _finish.js closes). Use: edges(outline) → wall edges with .at(t,o); bx(edge,t,o,w,d,y,h,col) box on a wall; band, cols, cl (paint a wall), pane (window glass, some lit at night), q3 (quad), txt / tex / plane / signOn (signboards), BN(/name/) finds a building.
{   // ---- landmarks block: everything up to _finish.js shares these helpers
const pipO=(x,z,r)=>pip(x,z,r);

const conc=C('#ece7dc'), brick=C('#cf6a4c'), glassC=C('#9dbcc8'), dark=C('#55626d'), white=C('#efece4'), redB=C('#b4553a');

const glassMat=new THREE.MeshLambertMaterial({color:0x9fd3d8,transparent:true,opacity:0.6});

const ringPrism=(rings,y0,y1,col)=>{ fillPoly(dg,rings,y1,col); const sc=col.clone().multiplyScalar(0.82); for(const r of rings) for(let i=0;i<r.length;i++) quad(dg,r[i],r[(i+1)%r.length],y0,y1,sc); };

const paneL=new Geo(), paneD=new Geo();               // window glass: some light up at night, some stay dark

const GLs=C('#4f6c80'), GLb=C('#7fa3b3');

const edges=(outer)=>{ const out=[]; for(let i=0;i<outer.length;i++){ const a=outer[i],b=outer[(i+1)%outer.length]; const dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz); if(L<1.2) continue;
    const ux=dx/L,uz=dz/L; let nx=uz,nz=-ux; const mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2; if(pip(mx+nx*0.5,mz+nz*0.5,outer)){ nx=-nx; nz=-nz; }
    out.push({a,b,L,ux,uz,nx,nz,mx,mz,ang:Math.atan2(dz,dx),at:(t,o)=>[a[0]+ux*t+nx*o,a[1]+uz*t+nz*o]}); } return out; };

const BN=re=>bInfo.find(b=>b.name&&re.test(b.name)); const DBG=window.__dbg={}; const mark=(k,e,t,o)=>{ const [x,z]=e.at(t,o); DBG[k]=[Math.round(x),Math.round(z),Math.round(e.nx*100)/100,Math.round(e.nz*100)/100]; };

const frontEdge=(outer,minL=6)=>{ const es=edges(outer); let best=null,bd=1e9; for(const e of es){ if(e.L<minL) continue; const [x,z]=e.at(e.L/2,4); const r=nearestRoad(x,z,90); const d=r?r.d:500-e.L; if(d<bd){ bd=d; best=e; } } return best||es.sort((p,q)=>q.L-p.L)[0]; };

const cl=(e,t0,t1,y0,y1,col,o=0.07)=>quad(dg,e.at(t0,o),e.at(t1,o),y0,y1,col);                  // paint / clad part of a wall

const pane=(e,t0,t1,y0,y1,o=0.09,col=GLs)=>{ const p=e.at(t0,o),q=e.at(t1,o); quad(hash2(Math.round(p[0]*3+y0*7),Math.round(p[1]*3))<0.38?paneL:paneD,p,q,y0,y1,col); };

const bx=(e,t,o,w,d,y,h,col)=>{ const [x,z]=e.at(t,o); box(dg,x,z,w,d,y,h,e.ang,col); };

const band=(e,y,h,o,d,col,ext=0)=>bx(e,e.L/2,o,e.L+ext,d,y,h,col);

const cols=(e,y0,y1,step,o,sz,col)=>{ const n=Math.max(1,Math.round(e.L/step)); for(let k=0;k<=n;k++) bx(e,e.L*k/n,o,sz,sz,y0,y1-y0,col); };

const q3=(a,b,c,d,col)=>{ dg.tri(a[0],a[1],a[2],b[0],b[1],b[2],c[0],c[1],c[2],col); dg.tri(a[0],a[1],a[2],c[0],c[1],c[2],d[0],d[1],d[2],col); };

const flight=(x,z,ang,y0,y1,w,col,solid)=>{ const n=Math.max(2,Math.round((y1-y0)/0.18)), run=0.3, rise=(y1-y0)/n, c=Math.cos(ang), s=Math.sin(ang);
  for(let i=0;i<n;i++){ const t=(i+0.5)*run, yy=y0+(i+1)*rise; if(solid) box(dg,x+c*t,z+s*t,run,w,y0,yy-y0,ang,col); else box(dg,x+c*t,z+s*t,run,w,yy-0.24,0.24,ang,col); }
  return [x+c*n*run,z+s*n*run,n*run]; };

const stairTower=(e,t,floors,col,rail)=>{ const w=1.3, fh=3.3, n=Math.round(fh/2/0.18), len=n*0.3;
  for(let f=0;f<floors;f++){ const y=f*fh;
    const [x1,z1]=e.at(t-len/2,0.25+w*1.5); flight(x1,z1,e.ang,y,y+fh/2,w,col,f===0);
    const [x2,z2]=e.at(t+len/2,0.25+w*0.5); flight(x2,z2,e.ang+Math.PI,y+fh/2,y+fh,w,col,false);
    bx(e,t+len/2+0.7,0.25+w,1.4,w*2,y+fh/2-0.24,0.24,col); bx(e,t-len/2-0.7,0.25+w,1.4,w*2,y+fh-0.24,0.24,col);
    bx(e,t,0.25+w*2+0.04,len+2.8,0.1,y+fh/2,1.0,rail); } };

const frame=(x,z,ang,w,d,y,h,col)=>{ const c=Math.cos(ang),s=Math.sin(ang), P=(u,v)=>[x+u*c-v*s,z+u*s+v*c];
  for(const [u,v] of [[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]]){ const [px,pz]=P(u,v); box(dg,px,pz,0.5,0.5,y,h,ang,col); }
  for(const v of [-d/2,d/2]){ const [px,pz]=P(0,v); box(dg,px,pz,w+0.5,0.5,y+h-0.5,0.5,ang,col); }
  for(const u of [-w/2,w/2]){ const [px,pz]=P(u,0); box(dg,px,pz,0.5,d,y+h-0.5,0.5,ang,col); } };

const pot=(x,z)=>{ box(dg,x,z,0.42,0.42,0,0.4,0,C('#b8402d')); box(dg,x,z,0.5,0.5,0.4,0.35,0,C(hash2(Math.round(x*5),Math.round(z*5))<0.5?'#3f8a3a':'#c2306a')); };

// signs: canvas text, all packed into one atlas and drawn as two meshes (cheap on phones); lit at night
const signs=[];

const tex=(draw,w=512,h=128)=>{ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); return c; };

const txt=(lines,bg,fg,font,w=512,h=128,pre)=>tex((g,W,H)=>{ if(bg){ g.fillStyle=bg; g.fillRect(0,0,W,H); } if(pre) pre(g,W,H);
    g.fillStyle=fg; g.textAlign='center'; g.textBaseline='middle'; lines.forEach((l,i)=>{ g.font=Array.isArray(font)?font[i]:font; g.fillText(l,W/2,H*(i+0.5)/lines.length,W*0.94); }); },w,h);

const plane=(x,y,z,ry,w,h,cv,glow=0,back=0)=>{ signs.push({x,y,z,ry,w,h,cv,glow}); if(back) signs.push({x:x-Math.sin(ry)*back,y,z:z-Math.cos(ry)*back,ry:ry+Math.PI,w,h,cv,glow}); };

const signOn=(e,t,y,w,h,cv,o=0.14,glow=0)=>{ const [x,z]=e.at(t,o); plane(x,y,z,Math.atan2(e.nx,e.nz),w,h,cv,glow); };

const hallSign=(n)=>txt(['छात्रावास - '+n,'HALL OF RESIDENCE - '+n],'#f3ede2','#3b2f2a',['bold 40px sans-serif','bold 44px sans-serif'],512,128);
