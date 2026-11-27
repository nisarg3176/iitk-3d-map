// Keeps trees and bushes clear of buildings, hand-made structures and paved ground.
// The 2 m occupancy map is too coarse for this, so here every built triangle (building walls and roofs, all hand-made models,
// corridors, paving, courts) is drawn onto a 1 m grid. A tree whose trunk lands on anything built or paved, or whose crown
// would push into a wall, is moved up to 4 m to the nearest clear spot, or removed if there is none. Bushes the same, up to 2 m.
// Bushes placed on purpose in planters (those with a height offset) are left alone.
function keepTreesClear(trees,bushes){ const T0=performance.now();
  const N=2*EXT, SOL=1, HI=2, PAV=4, G=new Uint8Array(N*N);
  const cell=(x,z)=>{ const i=Math.floor(x+EXT), j=Math.floor(z+EXT); return (i<0||j<0||i>=N||j>=N)?-1:j*N+i; };
  const put=(x,z,f)=>{ const k=cell(x,z); if(k>=0) G[k]|=f; };
  // draw one triangle: flat-ish ones by their area; walls (a line or sliver when seen from above) along their longest side
  function line(px,pz,qx,qz,f){ const dx=qx-px, dz=qz-pz, n=Math.ceil(Math.sqrt(dx*dx+dz*dz)/0.7);
    for(let s=0;s<=n;s++){ const t=n?s/n:0, i=Math.floor(px+dx*t+EXT), j=Math.floor(pz+dz*t+EXT); if(i>=0&&j>=0&&i<N&&j<N) G[j*N+i]|=f; } }
  function tri(ax,az,bx,bz,cx,cz,f){
    const d=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz), ar=Math.abs(d)/2;
    if(ar<1){ const l1=(bx-ax)*(bx-ax)+(bz-az)*(bz-az), l2=(cx-bx)*(cx-bx)+(cz-bz)*(cz-bz), l3=(ax-cx)*(ax-cx)+(az-cz)*(az-cz);
      if(l1>=l2&&l1>=l3) line(ax,az,bx,bz,f); else if(l2>=l3) line(bx,bz,cx,cz,f); else line(cx,cz,ax,az,f); return; }
    const x0=Math.max(0,Math.floor(Math.min(ax,bx,cx)+EXT)), x1=Math.min(N,Math.ceil(Math.max(ax,bx,cx)+EXT)), z0=Math.max(0,Math.floor(Math.min(az,bz,cz)+EXT)), z1=Math.min(N,Math.ceil(Math.max(az,bz,cz)+EXT));
    for(let j=z0;j<z1;j++){ const pz=j+.5-EXT; for(let i=x0;i<x1;i++){ const px=i+.5-EXT, l1=((bz-cz)*(px-cx)+(cx-bx)*(pz-cz))/d, l2=((cz-az)*(px-cx)+(ax-cx)*(pz-cz))/d;
      if(l1>=-0.02&&l2>=-0.02&&l1+l2<=1.02) G[j*N+i]|=f; } }
    put(ax,az,f); put(bx,bz,f); put(cx,cz,f); }
  function addGeo(g,grassOk){ const p=g.p, c=g.c; if(!p||!p.length) return;
    for(let i=0;i<p.length;i+=9){ const ymax=Math.max(p[i+1],p[i+4],p[i+7]);
      let f;
      if(ymax>2.5) f=SOL|HI;                                   // walls, roofs, tall structures: also keep tree crowns off them
      else if(ymax>0.3) f=SOL;                                  // low walls, stages, planters, benches: nothing planted on them
      else { if(grassOk&&c&&c.length>=i+3){ const r=c[i],gg=c[i+1],bb=c[i+2]; if(gg>r*1.15&&gg>bb) continue; } f=PAV; }   // flat: paving (grass patches are fine)
      tri(p[i],p[i+2],p[i+3],p[i+5],p[i+6],p[i+8],f); } }
  addGeo(wallG); addGeo(roofG); addGeo(dg,true); addGeo(glowW); addGeo(glowF); addGeo(doorG);
  for(const k of ['pave','court','track']) if(areaGeo[k]) addGeo(areaGeo[k]);
  const at=(x,z)=>{ const k=cell(x,z); return k<0?SOL:G[k]; };
  // is this spot fine for a trunk/bush centre, with nothing tall within r metres?
  const D12=[...Array(12)].map((_,a)=>[Math.cos(a*Math.PI/6),Math.sin(a*Math.PI/6)]), D16=[...Array(16)].map((_,a)=>[Math.cos(a*Math.PI/8),Math.sin(a*Math.PI/8)]);
  const ok=(x,z,r,tree)=>{ if(at(x,z)&(SOL|PAV)) return false; if(tree?occAt(x,z):roadAt(x,z)) return false;
    for(const [c,s] of D12){ if(at(x+c*r,z+s*r)&HI) return false; if(r>1.2&&(at(x+c*r*0.5,z+s*r*0.5)&(SOL|HI))) return false; } return true; };
  const place=(x,z,r,maxMove,tree)=>{ if(ok(x,z,r,tree)) return [x,z];
    for(let d=0.75;d<=maxMove;d+=0.75) for(const [c,s] of D16){ const nx=x+c*d, nz=z+s*d; if(ok(nx,nz,r,tree)) return [nx,nz]; }
    return null; };
  let moved=0, gone=0;
  for(let i=trees.length-1;i>=0;i--){ const t=trees[i], crown=(t[2]===1?1.6:t[2]===2?2.6:3.4)*t[3]*0.85;
    const p=place(t[0],t[1],crown,4,true); if(!p){ trees.splice(i,1); gone++; } else if(p[0]!==t[0]||p[1]!==t[1]){ t[0]=p[0]; t[1]=p[1]; moved++; } }
  let bm=0, bg=0;
  for(let i=bushes.length-1;i>=0;i--){ const b=bushes[i]; if(b[3]) continue;        // planter bushes stay where they were put
    const p=place(b[0],b[1],b[2]*0.6,2,false); if(!p){ bushes.splice(i,1); bg++; } else if(p[0]!==b[0]||p[1]!==b[1]){ b[0]=p[0]; b[1]=p[1]; bm++; } }
  window.__clear={ms:Math.round(performance.now()-T0),treesMoved:moved,treesRemoved:gone,bushesMoved:bm,bushesRemoved:bg};
}
