// Health Centre, CMHW and the post office.
// ---- CMHW: small reception hut with its sign in front of House 503
{ const b=bInfo.find(q=>q.name==='CMHW'); if(b){ const x=b.cx-8.2, z=b.cz+2; box(dg,x,z,4.2,5,0,3,0,C('#b9c3b0')); box(dg,x-0.3,z,4.8,5.6,3,0.15,0,C('#8d8f88'));
    box(dg,x-2.15,z,0.2,5.4,3.15,1.1,0,C('#262b33')); box(dg,x-2.15,z,0.1,1.6,0,2.4,0,C('#6f8a7c')); markOcc(x,z,3); } }

// ---- Health Centre: white sloped canopy over the entrance with a red cross sign
{ const b=bInfo.find(q=>q.name==='Health Centre'||q.name==='HC'); if(b){ const x=-99, z=932+4.5;
    for(const ox of [-6,6]) for(const oz of [-2.6,2.6]) box(dg,x+ox,z+oz,0.4,0.4,0,3.4,0,C('#eeeae2'));
    const cv=addMesh(new THREE.BoxGeometry(15,0.3,7),stdMat(0xf2efe8),x,3.7,z); cv.rotation.x=0.12;
    box(dg,x,z+3.5,4,0.2,4.2,1.4,0,C('#ffffff')); box(dg,x,z+3.62,0.45,0.1,4.4,1.0,0,C('#d62828')); box(dg,x,z+3.62,1.3,0.1,4.72,0.36,0,C('#d62828')); markOcc(x,z,8); } }

// ---- CMHW: its name on the building
{ const b=BN(/^CMHW$/); if(b){ const e=edges(b.outer).filter(q=>q.L>4&&q.nx>-0.5).sort((p,q)=>q.L-p.L)[0]; if(e){ signOn(e,e.L/2,Math.max(2.6,b.H-1.0),Math.min(e.L-0.6,6),1.0,txt(['CMHW','Center for Mental Health and Wellbeing'],'#2f6f62','#ffffff',['bold 54px sans-serif','bold 26px sans-serif'],512,128),0.16,0.5); } } }

// ---- India Post office and India Post Payments Bank (from the photo): white-painted brick block, maroon IPPB board on a rusty steel frame,
//      black foundation plaque, red post box in front
{ const x=180.5, z=151, w=13, d=8.5, wh=C('#ecebe6');
  box(dg,x,z,w,d,0,3.6,0,wh); box(dg,x,z,w+0.4,d+0.4,3.6,0.35,0,C('#d6d3cb')); box(dg,x,z,w+0.2,d+0.2,0,0.4,0,C('#c9c5bb'));
  for(const t of [-4.2,-1.4,3.6]) box(dg,x+t,z+d/2+0.04,1.6,0.06,1.0,1.3,0,C('#55626d'));
  box(dg,x+1.2,z+d/2+0.04,1.5,0.06,0,2.4,0,C('#8b9096')); box(dg,x+1.2,z+d/2+0.8,3.2,1.6,0,0.15,0,C('#b9b4aa'));
  box(dg,x-5.6,z+d/2+0.05,1.0,0.05,0.9,1.2,0,C('#1d1d1f'));                                             // foundation plaque
  const fx=x-1.5, fz=z+d/2+2.2, rust=C('#7a4a2c'); for(const s of [-3,3]) box(dg,fx+s,fz,0.14,0.14,0,3.4,0,rust); box(dg,fx,fz,6.4,0.14,2.25,0.12,0,rust);
  box(dg,fx,fz,6.4,0.12,2.3,1.25,0,C('#6e1f2e'));
  plane(fx,2.92,fz+0.08,0,6.2,1.15,tex((g,W,H)=>{ g.fillStyle='#6e1f2e'; g.fillRect(0,0,W,H); g.fillStyle='#e23b3b'; g.beginPath(); g.arc(W*0.47,H*0.42,H*0.27,0,7); g.fill();
      g.strokeStyle='#e8c35a'; g.lineWidth=5; for(let k=0;k<3;k++){ g.beginPath(); g.moveTo(W*0.33,H*(0.6-k*0.04)); g.quadraticCurveTo(W*0.47,H*(0.75-k*0.04),W*0.6,H*(0.1+k*0.03)); g.stroke(); }
      g.fillStyle='#f5ece6'; g.textBaseline='middle'; g.textAlign='left'; g.font='bold 34px sans-serif'; g.fillText('India Post',18,H*0.3); g.fillText('Payments Bank',18,H*0.58);
      g.textAlign='right'; g.font='bold 34px sans-serif'; g.fillText('इंडिया पोस्ट',W-18,H*0.3); g.fillText('पेमेन्ट्स बैंक',W-18,H*0.58);
      g.fillStyle='#e8414b'; g.fillRect(14,H*0.76,W-28,3); g.fillStyle='#f5ece6'; g.font='bold 26px sans-serif'; g.fillText('आई.आई.टी.',W-18,H*0.88); },640,128),0.6);
  const pb=addMesh(new THREE.CylinderGeometry(0.32,0.32,1.3,12),stdMat(0xc8202a),x+6.2,0.65,fz+0.8); addMesh(new THREE.SphereGeometry(0.34,12,6,0,Math.PI*2,0,Math.PI/2),stdMat(0xc8202a),x+6.2,1.3,fz+0.8);
  markOcc(x,z+2,9);
  labels.push({name:'India Post Office',x,z,y:6,rank:3,tier:3,cat:'civic',alt:['Post office','IIT Post Office','India Post Payments Bank','IPPB','Dak ghar'],size:10}); }
