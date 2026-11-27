// Builds the window glass and the signboard atlas collected by all landmark files, then closes the landmarks block.
// ---- build the glass
if(paneL.p.length){ const m=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0xffc985,emissiveIntensity:0,side:THREE.DoubleSide}); const mesh=new THREE.Mesh(paneL.build(),m); mesh.receiveShadow=true; scene.add(mesh);
  nightHooks.push(n=>{ m.emissiveIntensity=n*0.55; }); }

if(paneD.p.length){ const mesh=new THREE.Mesh(paneD.build(),new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide})); mesh.receiveShadow=true; scene.add(mesh); }

// ---- build the signs: pack every sign canvas into one atlas texture, then one mesh for lit signs and one for painted ones
signs.push(...(window.__mtSigns||[]));

if(signs.length){ const AW=2048; let sx=0,sy=0,rowH=0;
  const uniq=[...new Set(signs.map(s=>s.cv))].map(cv=>{ const wide=cv.width>=1000; const k=Math.min(1,(wide?1024:320)/cv.width,(wide?110:84)/cv.height); return {cv,w:Math.max(8,Math.round(cv.width*k)),h:Math.max(8,Math.round(cv.height*k))}; }).sort((a,b)=>b.h-a.h);
  for(const u of uniq){ if(sx+u.w+2>AW){ sx=0; sy+=rowH+2; rowH=0; } u.x=sx; u.y=sy; sx+=u.w+2; rowH=Math.max(rowH,u.h); }
  const AH=Math.pow(2,Math.ceil(Math.log2(sy+rowH+2))); const ac=document.createElement('canvas'); ac.width=AW; ac.height=AH; const g=ac.getContext('2d'); const pos=new Map();
  for(const u of uniq){ g.drawImage(u.cv,u.x,u.y,u.w,u.h); pos.set(u.cv,u); }
  const at=new THREE.CanvasTexture(ac); at.colorSpace=THREE.SRGBColorSpace; at.anisotropy=4;
  const mk=(list,glow)=>{ if(!list.length) return; const Pp=[],N=[],U=[],I=[];
    list.forEach((s,i)=>{ const u=pos.get(s.cv), c=Math.cos(s.ry), sn=Math.sin(s.ry), hw=s.w/2, hh=s.h/2;
      for(const [lx,ly] of [[-hw,-hh],[hw,-hh],[hw,hh],[-hw,hh]]){ Pp.push(s.x+lx*c,s.y+ly,s.z-lx*sn); N.push(sn,0,c); }
      const u0=(u.x+0.5)/AW,u1=(u.x+u.w-0.5)/AW,v0=1-(u.y+u.h-0.5)/AH,v1=1-(u.y+0.5)/AH; U.push(u0,v0,u1,v0,u1,v1,u0,v1); const b=i*4; I.push(b,b+1,b+2,b,b+2,b+3); });
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.Float32BufferAttribute(Pp,3)); geo.setAttribute('normal',new THREE.Float32BufferAttribute(N,3)); geo.setAttribute('uv',new THREE.Float32BufferAttribute(U,2)); geo.setIndex(I); geo.computeBoundingSphere();
    const m=new THREE.MeshLambertMaterial({map:at,alphaTest:0.5,...(glow?{emissive:0xffffff,emissiveMap:at,emissiveIntensity:0}:{})}); const mesh=new THREE.Mesh(geo,m); mesh.receiveShadow=true; scene.add(mesh);
    if(glow) nightHooks.push(n=>{ m.emissiveIntensity=n*0.55; }); };
  mk(signs.filter(s=>s.glow),1); mk(signs.filter(s=>!s.glow),0); }

}   // ---- end of the landmarks block (opened in _kit.js)
