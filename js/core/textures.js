// Generated textures: window grids, glow sprites, ground detail.
/* ---------------- textures ---------------- */
function windowTextures(){
  const N=16, S=32, W=N*S;
  const a=document.createElement('canvas'); a.width=a.height=W; const ca=a.getContext('2d');
  const e=document.createElement('canvas'); e.width=e.height=W; const ce=e.getContext('2d');
  ca.fillStyle='#ffffff'; ca.fillRect(0,0,W,W); ce.fillStyle='#000'; ce.fillRect(0,0,W,W);
  const wr=R;
  for(let i=0;i<N;i++) for(let j=0;j<N;j++){
    const x=i*S, y=(N-1-j)*S; // j = floor from bottom
    const wx=x+6, wy=y+7, ww=S-12, wh=S-15;
    ca.fillStyle='#e9e6e0'; ca.fillRect(x,y+S-4,S,4); // slab line
    ca.fillStyle='#4a5866'; ca.fillRect(wx,wy,ww,wh);
    ca.fillStyle='#7d8e9c'; ca.fillRect(wx,wy,ww,3);
    ca.fillStyle='#d8d4cc'; ca.fillRect(wx+ww/2-1,wy,2,wh);
    const r=wr();
    if(r<0.42){ const warm=wr(); const l=0.55+wr()*0.45;
      ce.fillStyle = warm<0.8 ? `rgba(255,${190+wr()*30|0},${110+wr()*40|0},${l})` : `rgba(215,230,255,${l})`;
      if(r<0.36){ const sh=(i*7+j*3)%5; // only some rooms are lit, and not all the same way (curtains, half-open, a lamp)
        if(sh===0) ce.fillRect(wx,wy,ww,wh); else if(sh===1) ce.fillRect(wx,wy,ww/2-1,wh); else if(sh===2) ce.fillRect(wx,wy+wh*0.45,ww,wh*0.55);
        else if(sh===3) ce.fillRect(wx+ww/2+1,wy,ww/2-1,wh); else { ce.globalAlpha=0.6; ce.fillRect(wx,wy,ww,wh); ce.globalAlpha=1; }
        ce.fillStyle='rgba(0,0,0,.5)'; ce.fillRect(wx+ww/2-1,wy,2,wh); } }
  }
  const t1=new THREE.CanvasTexture(a), t2=new THREE.CanvasTexture(e);
  for(const t of [t1,t2]){ t.wrapS=t.wrapT=THREE.RepeatWrapping; t.anisotropy=renderer.capabilities.getMaxAnisotropy(); }
  t1.colorSpace=THREE.SRGBColorSpace; t2.colorSpace=THREE.SRGBColorSpace;
  return [t1,t2];
}
function glowTexture(inner='rgba(255,214,150,1)'){
  const c=document.createElement('canvas'); c.width=c.height=128; const x=c.getContext('2d');
  const g=x.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,inner); g.addColorStop(.25,'rgba(255,190,110,.45)'); g.addColorStop(1,'rgba(255,170,80,0)');
  x.fillStyle=g; x.fillRect(0,0,128,128); const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; return t;
}

