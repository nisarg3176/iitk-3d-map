// Power towers and wires, entrance doors on the nearest building wall, lane / point / house-number labels.
// ---- power towers along the lines + wires
{
  const lines=DL.filter(l=>l.t==='power').map(l=>toPts(l.p));
  const wires=[];
  const towerAt=(x,z,ang)=>{ const g=new THREE.Group(); g.position.set(x,0,z); g.rotation.y=-ang;
    const body=new THREE.Mesh(new THREE.CylinderGeometry(0.35,2.8,32,4),steelMat); body.position.y=16; body.rotation.y=Math.PI/4; body.castShadow=true; g.add(body);
    for(const [y,w] of [[23,13],[27.5,10]]){ const arm=new THREE.Mesh(new THREE.BoxGeometry(0.45,0.45,w),steelMat); arm.position.y=y; arm.castShadow=true; g.add(arm); }
    scene.add(g); markOcc(x,z,4); };
  const armPts=[[23,-6.3],[23,6.3],[27.5,-4.8],[27.5,4.8],[32.2,0]];
  for(const pts of lines){
    const angs=pts.map((p,i)=>{ const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)]; return Math.atan2(b[1]-a[1],b[0]-a[0]); });
    pts.forEach((p,i)=>{ if(Math.abs(p[0])<EXT*1.15&&Math.abs(p[1])<EXT*1.15) towerAt(p[0],p[1],angs[i]); });
    for(let i=0;i<pts.length-1;i++){ const a=pts[i],b=pts[i+1]; const L=Math.hypot(b[0]-a[0],b[1]-a[1]); if(L<5||L>900) continue;
      for(const [y,o] of armPts){ const pa=[a[0]-Math.sin(angs[i])*o,a[1]+Math.cos(angs[i])*o], pb=[b[0]-Math.sin(angs[i+1])*o,b[1]+Math.cos(angs[i+1])*o];
        const N=14, sag=Math.min(9,L*0.025); let prev=null;
        for(let k=0;k<=N;k++){ const t=k/N; const v=[pa[0]+(pb[0]-pa[0])*t, y-sag*4*t*(1-t), pa[1]+(pb[1]-pa[1])*t]; if(prev) wires.push(...prev,...v); prev=v; } } }
  }
  for(const [x,z] of powerTowers){ if(lines.some(pts=>pts.some(p=>Math.hypot(p[0]-x,p[1]-z)<15))) continue; towerAt(x,z,0); }
  if(wires.length){ const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(wires,3));
    const wm=new THREE.LineBasicMaterial({color:0x3a3f44,transparent:true,opacity:0.75}); const ln=new THREE.LineSegments(g,wm); scene.add(ln);
    nightHooks.push((n)=>{ wm.color.set(n>0.5?0x6f7c92:0x3a3f44); wm.opacity=n>0.5?0.45:0.75; }); }
}
// ---- entrances: doors on the nearest building wall
{
  const doorC=C('#4b3e33'), mainC=C('#3c3027'), canopy=C('#e7e0d2');
  for(const d of DP){ if(d.t!=='entrance'&&d.t!=='entrance_main') continue;
    let best=null,bd=6;
    for(const b of bInfo){ if(Math.abs(b.cx-d.x)>150||Math.abs(b.cz-d.z)>150) continue; const r=b.outer;
      for(let i=0;i<r.length;i++){ const a=r[i],c=r[(i+1)%r.length]; const dx=c[0]-a[0],dz=c[1]-a[1],L=dx*dx+dz*dz; if(!L) continue;
        const t=Math.max(0,Math.min(1,((d.x-a[0])*dx+(d.z-a[1])*dz)/L)); const dd=Math.hypot(d.x-a[0]-t*dx,d.z-a[1]-t*dz);
        if(dd<bd){ bd=dd; const l=Math.sqrt(L); best={x:a[0]+t*dx,z:a[1]+t*dz,ux:dx/l,uz:dz/l,H:b.H}; } } }
    if(!best) continue;
    const main=d.t==='entrance_main', ang=Math.atan2(best.uz,best.ux), nx=best.uz, nz=-best.ux; // outward normal for CCW ring
    const w=main?3.2:1.7, h=Math.min(main?3.4:2.5,best.H-0.5);
    box(doorG,best.x+nx*0.1,best.z+nz*0.1,w,0.3,0,h,ang,main?mainC:doorC);
    if(main){ box(dg,best.x+nx*1.2,best.z+nz*1.2,w+1.6,2.4,h+0.2,0.25,ang,canopy); }
  }
}
{ const dgMat=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});
  dgMat.onBeforeCompile=sh=>{ sh.uniforms.uSelf=CATU.uSelf; sh.uniforms.uDim=CATU.uDim; sh.fragmentShader='uniform float uSelf,uDim;\n'+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
    float nl=max(dot(diffuseColor.rgb,vec3(.2126,.7152,.0722)),.001);
    diffuseColor.rgb*=mix(1.,clamp(.2/nl,.32,1.),uDim);`).replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\n totalEmissiveRadiance+=diffuseColor.rgb*min(1.,.16/max(dot(diffuseColor.rgb,vec3(.2126,.7152,.0722)),.001))*uSelf;'); };
  const m=new THREE.Mesh(dg.build(),dgMat); m.castShadow=true; m.receiveShadow=true; scene.add(m);
  const doorMat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x000000});
  const dm=new THREE.Mesh(doorG.build(),doorMat); dm.receiveShadow=true; scene.add(dm);
  nightHooks.push((n,k)=>{ doorMat.emissive.setRGB(1.0*k,0.72*k,0.38*k); });
  for(const [g,e,f] of [[glowW,0xffcf8a,0.42],[glowS,0xfff0d0,1.6],[glowC,0x3f9fc8,0.2],[glowF,0xffb066,0.32]]){ if(!g.p.length) continue; const m=new THREE.MeshLambertMaterial({vertexColors:true,emissive:e,emissiveIntensity:0,side:THREE.DoubleSide});
    const ms=new THREE.Mesh(g.build(),m); ms.receiveShadow=true; scene.add(ms); nightHooks.push(n=>{ m.emissiveIntensity=n*f; }); }
  nightHooks.push(n=>{ for(const m of waterMats){ m.roughness=0.06+0.5*n; m.envMapIntensity=1-0.6*n; m.metalness=0.1-0.1*n; } });
  addOverlay(flatD,null,12.2); }
for(const l of (data.lanes||[])) labels.push({name:l.n,x:l.x,z:l.z,y:1.2,rank:0,tier:2.5,kind:'lane'});
for(const p of poiIcons) labels.push({name:p.t,x:p.x,z:p.z,y:2.2,rank:0,tier:4,kind:'poi'});
for(const d of DP) if(d.t==='hn') labels.push({name:d.n,x:d.x,z:d.z,y:3,rank:0,tier:4,kind:'hn'});
{ const st=data.places.find(p=>/metro station/i.test(p.n)); const l=st&&labels.find(q=>q.name===cleanName(st.n)); if(l&&st.y) l.y=st.y; }
lmsg.textContent='Planting the trees…'; await tick();

