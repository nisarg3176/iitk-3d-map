// Shops and food spots: Mama Mio, MT market stall, Starbucks & Subway, CC canteen, Cafe Coffee Day, Old Shopping Complex, ATM kiosk, Divyam Naturals.
// ---- Mama Mio chowpatty: row of tin sheds across the road from the shops, benches under each
{ const x0=-756.5, x1=-749.5, post=C('#c9a24a'), wood=C('#8a5a3a'), roof=C('#7b8a92'), xc=(x0+x1)/2;
  for(const [z0,z1] of [[815,825],[827,837],[839,849],[851,861]]){ const zc=(z0+z1)/2;
    box(dg,xc,zc,z1-z0,x1-x0+1,3.3,0.18,Math.PI/2,roof);
    for(const z of [z0,zc,z1]) for(const x of [x0,x1]) box(dg,x,z,0.25,0.25,0,3.3,0,post);
    for(const z of [z0+2.5,z1-2.5]){ box(dg,xc,z,3.6,1.1,0.75,0.12,0,wood); for(const sd of [-1,1]) box(dg,xc,z+sd*1.2,3.6,0.35,0.42,0.1,0,wood); }
    markOcc(xc,zc,7); } }

// ---- Mama Mio row: five single-storey shops facing the road (west), each with its own name board above a low tin awning
{ const fx=-728.5, bx=-723.8, T=(x,z,w,d,y,h,c)=>box(dg,x,z,w,d,y,h,0,typeof c==='string'?C(c):c);
  const tex=(lines,bg,fg,font,w=640,h=128)=>{ const c=document.createElement('canvas'); c.width=w; c.height=h; const g=c.getContext('2d'); g.fillStyle=bg; g.fillRect(0,0,w,h);
    g.strokeStyle='rgba(255,255,255,.55)'; g.lineWidth=6; g.strokeRect(5,5,w-10,h-10); g.fillStyle=fg; g.textAlign='center'; g.textBaseline='middle';
    lines.forEach((l,i)=>{ g.font=Array.isArray(font)?font[i]:font; g.fillText(l,w/2,h*(i+0.5)/lines.length+(lines.length>1?(i?-6:6):0),w*0.92); }); return c; };
  const sign=(z,w,h,y,cv)=>{ (window.__mtSigns=window.__mtSigns||[]).push({x:fx-0.47,y,z,ry:-Math.PI/2,w,h,cv,glow:0.55}); };
  const H=4.3, z0=814, n=5, L=(862-814)/n, xc=(fx+bx)/2, dk=C('#2b2622');
  const shops=[
    {n:['PETRA CAFE'],bg:'#1f5f4f',fg:'#f6e7c1',wall:'#e7dcc6',aw:'#2e7a62',f:'bold 64px sans-serif'},
    {n:['NEW KATHI ROLLS'],bg:'#c22a24',fg:'#ffd23f',wall:'#efe2c8',aw:'#d9452e',f:'bold 58px sans-serif'},
    {n:['Mama Mio','MILKSHAKES & ICE CREAM'],bg:'#e05a8f',fg:'#ffffff',wall:'#f6e3ea',aw:'#e77ba3',f:['bold italic 60px sans-serif','bold 26px sans-serif']},
    {n:['SWAAD SANGAM'],bg:'#e8862a',fg:'#ffffff',wall:'#efe0c4',aw:'#c96a1f',f:'bold 60px sans-serif'},
    {n:['MERE PAKWAAN'],bg:'#7a2032',fg:'#ffd98a',wall:'#e9dcc4',aw:'#8f2b3d',f:'bold 60px sans-serif'}];
  T(xc,838,bx-fx,862-814,H,0.22,'#bdb6aa');
  shops.forEach((sp,i)=>{ const za=z0+i*L, zb=za+L, zm=(za+zb)/2;
    T(xc,zm,bx-fx,L-0.25,0,H,sp.wall);
    T(fx-0.05,zm,0.12,L-0.9,0.05,0.35,'#8d8579');
    T(fx-0.04,zm,0.08,L-2.2,0.4,2.25,dk);
    T(fx-0.09,zm,0.1,L-2.0,2.62,0.32,'#8e9399');
    T(fx-0.55,zm,0.9,L-3.4,0,1.0,'#efe9dc'); T(fx-0.55,zm,1.0,L-3.3,1.0,0.07,'#6b4a35');
    T(fx-0.3,zm,0.26,L-0.7,2.98,1.24,sp.bg);
    sign(zm,L-0.9,1.08,3.6,tex(sp.n,sp.bg,sp.fg,sp.f));
    const ya=2.92, yb=2.5, xa=fx-0.02, xo=fx-1.6, c=C(sp.aw), q0=za+0.3, q1=zb-0.3;
    dg.tri(xa,ya,q0, xo,yb,q1, xo,yb,q0, c); dg.tri(xa,ya,q0, xa,ya,q1, xo,yb,q1, c); dg.tri(xa,ya,q0, xo,yb,q0, xo,yb,q1, c); dg.tri(xa,ya,q0, xo,yb,q1, xa,ya,q1, c);
    for(const z of [q0+0.15,q1-0.15]) T(xo+0.1,z,0.08,0.08,0,yb,'#6f6a62');
    if(i<n-1) T(fx-0.12,zb,0.3,0.32,0,H,'#cfc6b4'); });
  T(fx-1.05,834.6,0.9,1.4,0,1.0,'#f4f6f8'); T(fx-1.05,834.6,0.92,1.42,1.0,0.05,'#4aa3d8');
  T(fx-0.9,816.3,0.6,0.7,0,1.6,'#d71f2e'); T(fx-0.9,861.0,0.6,0.7,0,1.6,'#1e5fa8');
  markOcc(xc,838,3); for(let z=816;z<=860;z+=5) markOcc(fx-5,z,4.5); }

// ---- Starbucks & Subway: brand awnings and outdoor seating
{ const aw=[[17.5,278,C('#f2c230')],[17.5,290,C('#1e6b47')]];
  for(const [x,z,c] of aw){ box(dg,x-7.2,z,1.8,9,2.8,0.18,0,c); }
}

// ---- MT Market (from the photos): a row of small shops facing the road to the east across a paved forecourt —
//      ANEXA (white), a general store, Vinod Garments & Footwear (orange Sparx board), the Hanuman temple (green canopy),
//      and the big tea / snack stall under a tarp roof with drink fridges; a tall steel shed rises behind them; railings, cage bins and a 4-arm lamp in front
{ const fx=-416, T=(x,z,w,d,y,h,c)=>box(dg,x,z,w,d,y,h,0,C(c));
  const tex2=(lines,bg,fg,font,w=512,h=128)=>{ const c=document.createElement('canvas'); c.width=w; c.height=h; const g=c.getContext('2d'); g.fillStyle=bg; g.fillRect(0,0,w,h); g.fillStyle=fg; g.textAlign='center'; g.textBaseline='middle'; lines.forEach((l,i)=>{ g.font=Array.isArray(font)?font[i]:font; g.fillText(l,w/2,h*(i+0.5)/lines.length,w*0.94); }); return c; };
  const sign=(x,y,z,w,h,cv,glow=0.4)=>{ (window.__mtSigns=window.__mtSigns||[]).push({x,y,z,ry:Math.PI/2,w,h,cv,glow}); };
  // steel shed behind (tall, gabled, dark corrugated roof on columns, beige wall under it)
  const sx0=-437, sx1=-421, sz0=116, sz1=142, eave=5.6, ridge=7.4, steel=C('#4a4d51'), sheet=C('#5b5f63');
  T((sx0+sx1)/2,(sz0+sz1)/2,sx1-sx0,sz1-sz0,0,3.4,'#d8cdb6');
  for(const x of [sx0,sx1]) for(let z=sz0;z<=sz1+0.01;z+=6.5) box(dg,x,z,0.25,0.25,3.4,eave-3.4,0,steel);
  const xm=(sx0+sx1)/2; for(const s of [-1,1]){ const x0=s<0?sx0-0.6:sx1+0.6; { const z0=sz0-0.4, z1=sz1+0.4;
      dg.tri(x0,eave,z0, xm,ridge,z1, xm,ridge,z0, sheet); dg.tri(x0,eave,z0, x0,eave,z1, xm,ridge,z1, sheet);
      dg.tri(x0,eave,z0, xm,ridge,z0, xm,ridge,z1, sheet); dg.tri(x0,eave,z0, xm,ridge,z1, x0,eave,z1, sheet); } }
  for(let z=sz0;z<=sz1+0.01;z+=6.5){ dg.tri(sx0,eave,z, xm,ridge,z, sx1,eave,z, steel); box(dg,xm,z,sx1-sx0,0.15,eave-0.15,0.15,0,steel); }
  // shop row (front face at x=fx, facing east)
  const roofT=(z0,z1,col,h=3.0,out=2.2)=>{ const x0=fx-4.6, x1=fx+out; dg.tri(x0,h+0.5,z0, x1,h-0.2,z1, x1,h-0.2,z0, C(col)); dg.tri(x0,h+0.5,z0, x0,h+0.5,z1, x1,h-0.2,z1, C(col));
    dg.tri(x0,h+0.5,z0, x1,h-0.2,z0, x1,h-0.2,z1, C(col)); dg.tri(x0,h+0.5,z0, x1,h-0.2,z1, x0,h+0.5,z1, C(col)); };
  // ANEXA: small white building at the north end
  T(fx-2.5,119.2,6,4.4,0,3.2,'#eeece6'); T(fx-2.5,119.2,6.3,4.7,3.2,0.2,'#d7d3ca'); T(fx+0.03,119.2,0.06,1.2,0,2.2,'#5e6670');
  T(fx+1.2,117.4,0.15,0.15,0,4.6,'#7a7f86'); sign(fx+1.29,4.1,117.4,1.6,1.1,tex2(['ANEXA'],'#f4f6f2','#1f6b4f','bold 70px sans-serif',256,170),0.2);
  // general store
  T(fx-2.3,123,4.6,3.2,0,2.9,'#c9c2b4'); T(fx+0.02,123,0.05,2.8,0.1,2.4,'#3a2c22');
  for(let k=0;k<4;k++) T(fx+0.06,123-1.1+k*0.73,0.06,0.6,0.6+(k%2)*0.5,1.2,['#e2a72e','#3f8ac9','#d9452e','#4fa34a'][k]);
  T(fx+0.5,123,0.9,2.4,0,0.8,'#7a5a3c'); roofT(121.4,124.6,'#6b6f68',2.9,1.6);
  // Vinod Garments & Footwear: red grille front with the orange Sparx board on two posts
  T(fx-2.3,126.5,4.6,3.6,0,2.9,'#b3332b'); for(let k=0;k<8;k++) T(fx+0.04,124.9+k*0.45,0.05,0.05,0.3,2.3,'#7a1f1a');
  for(const z of [124.9,128.1]) T(fx+1.4,z,0.12,0.12,0,4.4,'#5d5a56'); sign(fx+1.47,3.9,126.5,3.4,1.15,tex2(['sparx','VINOD GARMENTS & FOOTWEAR'],'#e8922e','#ffffff',['bold italic 76px sans-serif','bold 30px sans-serif'],512,170),0.5);
  roofT(124.7,128.3,'#5f675e',2.9,1.2);
  // Sankat Mochan Hanuman temple: small red shrine under a green curved canopy, saffron flag
  T(fx-1.4,130,2.8,2.6,0,2.3,'#c8322b'); T(fx+0.03,130,0.05,1.3,0,1.8,'#f2c14e');
  box(dg,fx+0.2,130,1.2,3.2,2.75,0.15,0,C('#1f8a5a')); box(dg,fx+1.05,130,0.7,3.2,2.35,0.12,0,C('#1f8a5a')); box(dg,fx+1.4,130,0.12,3.2,1.95,0.45,0,C('#25a06a'));
  T(fx-1.4,130,0.08,0.08,2.3,2.6,'#6b4a35'); T(fx-1.1,130,0.6,0.05,4.4,0.45,'#f08a24');
  sign(fx+1.05,3.35,130,2.8,0.42,tex2(['श्री संकट मोचन हनुमान मंदिर'],'#c8322b','#fff4c8','bold 40px sans-serif',512,76),0.5);
  // tea / snack stall: open counter, red Coca-Cola fridges, purple Campa fridge, tarp over a corrugated roof
  T(fx-2.4,136,4.8,8.6,0,2.8,'#5a3a2a'); T(fx+0.4,136.2,0.8,6.5,0,1.0,'#d9452e'); T(fx+0.4,136.2,0.9,6.6,1.0,0.06,'#e9e3d6');
  for(const [z,c] of [[132.4,'#d71f2e'],[133.3,'#d71f2e'],[139.6,'#6a2c8f'],[140.4,'#e3e7ea']]) T(fx+0.9,z,0.7,0.8,0,2.0,c);
  roofT(131.6,140.9,'#4e5a4c',3.0,2.6); roofT(131.0,141.6,'#58605a',3.25,3.4);
  // forecourt: low pipe railing with cage dustbins along the road edge, plastic chairs, the 4-arm street light
  const rx=-404.5; for(const z of [120,126.5,133,139.5]){ T(rx,z,1.1,1.1,0,1.4,'#6b4f37'); T(rx,z,0.9,0.9,0.05,0.9,'#2f5fa8'); }
  for(const [z0,z1] of [[120.6,125.9],[127.1,132.4],[133.6,138.9]]){ T(rx,(z0+z1)/2,0.06,z1-z0,0.85,0.06,'#7c7a76'); for(const z of [z0+0.2,z1-0.2]) T(rx,z,0.06,0.06,0,0.88,'#7c7a76'); }
  for(const [x,z] of [[-411,133],[-410,129.5],[-412,136.5]]){ T(x,z,0.8,0.8,0.7,0.06,'#2b2b2b'); T(x+0.8,z,0.5,0.5,0,0.45,'#2b2b2b'); T(x-0.8,z,0.5,0.5,0,0.45,'#2b2b2b'); }
  T(-405.5,116.2,0.8,0.8,0,1.0,'#9a948a'); T(-405.5,116.2,0.22,0.22,1.0,9.5,'#7a4a32');
  for(let k=0;k<4;k++){ const a=k*Math.PI/2+Math.PI/4; box(dg,-405.5+Math.cos(a)*0.7,116.2+Math.sin(a)*0.7,1.5,0.08,10.0+(k%2)*0.4,0.08,a,C('#cfd2d4')); }
  markOcc(-412,129,9); }

// ---- CC canteen: yellow kiosk under a green roof, yellow benches round it
for(const o of decos){ if(o.cust!=='cck') continue; const R0=o.rings[0], yel=C('#f1c21c'), grn=C('#2f9a4c');
  const inner=offsetRing(R0,0.5); ringPrism([inner],0,3.0,yel); for(const e of edges(inner)) if(e.L>1.4) pane(e,0.25,e.L-0.25,0.95,2.5,0.06,GLb);
  const roof=offsetRing(R0,-1.4); ringPrism([roof],3.0,3.5,grn); fillPoly(dg,[roof],3.52,C('#38ad57')); ringPrism([offsetRing(R0,-1.45)],2.95,3.05,C('#f4f1e8'));
  const r0=Math.sqrt(o.area/Math.PI)+4.6; for(let k=0;k<7;k++){ const a=k/7*Math.PI*2+0.4, x=o.cx+Math.cos(a)*r0, z=o.cz+Math.sin(a)*r0;
    if(bInfo.some(b=>Math.abs(b.cx-x)<90&&Math.abs(b.cz-z)<90&&pip(x,z,b.outer))) continue; const t=a+Math.PI/2;
    box(dg,x,z,2.4,0.75,0.42,0.1,t,yel); for(const s of [-1,1]) box(dg,x+Math.cos(t)*s*1,z+Math.sin(t)*s*1,0.15,0.6,0,0.42,t,yel); markOcc(x,z,1.6); } }

// ---- old shopping complex: shop name boards over the shutters, SBI's blue fascia
{ const names=[['SUPARSH PROVISION STORE','#fbe7a1','#b3261e'],['RETAIL HOUSE','#2b2b2b','#ffffff'],['BOOK STALL','#ffe14d','#1d3d8f'],['Union Bank','#e8f1fb','#c8102e'],['AMUL','#ffffff','#1d4fa0'],['BAKERY','#3b2a20','#f6d7a7'],['LADINA','#1c1c1c','#f2d27a'],['CASIO','#1f2a44','#ffffff'],['XEROX & PRINTS','#ffffff','#127a3f'],['STATIONERY','#c8102e','#ffffff']];
  let k=0; for(const re of [/^Old Shopping Complex$/]){ const b=BN(re); if(!b) continue;
    for(const ob of bInfo.filter(q=>q===b||(Math.hypot(q.cx-b.cx,q.cz-b.cz)<40&&q.H<9&&q.area>300&&!q.name))) for(const e of edges(ob.outer)){ if(e.L<6) continue; const n=Math.floor(e.L/6);
      for(let i=0;i<n;i++){ const [nm,bg,fg]=names[k++%names.length]; signOn(e,(i+0.5)*e.L/n,3.6,e.L/n-0.6,0.62,txt([nm],bg,fg,'bold 52px sans-serif',512,80),2.12,0.5); } } }
  const sb=BN(/^SBI$/); if(sb){ const e=frontEdge(sb.outer,6); if(e) signOn(e,e.L/2,sb.H-1.2,Math.min(6,e.L-1),1.0,txt(['SBI'],'#1f5aa8','#ffffff','bold 80px sans-serif',256,64),0.3,0.7); } }

// ---- Cafe Coffee Day: red-brick café under a deep concrete roof slab on round pillars, glass front, palms in brick planters, lit sign
for(const o of decos){ if(o.cust!=='ccd') continue; const es=edges(o.outer); let e=null; for(const q of es) if(q.L>6&&(!e||q.nx<e.nx)) e=q; if(!e) continue;    // the front faces west, to the path
  const D=es.filter(q=>Math.abs(q.ux*e.ux+q.uz*e.uz)<0.3).reduce((m,q)=>Math.max(m,q.L),0)||15, L=e.L, brick=C('#a44d38'), slab=C('#a9a49a'), gl=C('#3d4a50');
  bx(e,L/2,-(4+D)/2,L-1.6,D-4.6,0,3.5,brick);                                                   // brick hall set back behind the porch
  quad(paneL,e.at(1.6,-4.27),e.at(L-1.6,-4.27),0.3,3.0,C('#f3dcae')); for(let t=2.2;t<L-1.5;t+=2.4) bx(e,t,-3.9,0.14,0.12,0.3,2.8,gl);
  bx(e,L/2,-(D-1.4)/2,L+0.6,D+1.4,3.5,0.55,slab); bx(e,L/2,1.3,L+0.6,0.3,3.5,0.9,C('#6f7174'));  // roof slab and front fascia
  signOn(e,L/2,3.95,Math.min(9,L-1),0.75,txt(['Café Coffee Day'],null,'#ffffff','bold 72px sans-serif',1024,110),1.47,0.9);
  signOn(e,L*0.86,2.9,1.3,1.3,txt(['café','coffee','day'],'#d71f2e','#ffffff','bold 46px sans-serif',160,160),1.47,0.6);
  for(const t of [L*0.14,L*0.4,L*0.62,L*0.88]){ const [x,z]=e.at(t,0.9); addMesh(new THREE.CylinderGeometry(0.32,0.32,3.5,10),stdMat(0xb3aea4),x,1.75,z); }
  for(const [t0,t1] of [[0.6,L*0.36],[L*0.46,L*0.58],[L*0.68,L-0.6]]){ bx(e,(t0+t1)/2,-0.4,t1-t0,1.0,0,0.6,brick); bx(e,(t0+t1)/2,-0.4,t1-t0-0.2,0.8,0.6,0.05,C('#4f8a3c')); }
  for(const t of [L*0.25,L*0.52,L*0.78]){ const [x,z]=e.at(t,-0.4); box(dg,x,z,0.25,0.25,0.6,3.6,0,C('#7a5a3c')); for(let k=0;k<6;k++){ const a=k/6*Math.PI*2+0.3; box(dg,x+Math.cos(a)*0.9,z+Math.sin(a)*0.9,1.9,0.45,4.15-(k%2)*0.15,0.12,a,C(k%2?'#4f9a3c':'#3f8a3a')); } box(dg,x,z,0.6,0.6,4.1,0.35,0,C('#4f9a3c')); }
  for(let i=0;i<4;i++){ const [x,z]=e.at(L*0.2+i*L*0.2,4.2); box(dg,x,z,1.0,1.0,0,0.75,0,C('#5a4030')); for(const [dx,dz] of [[0.8,0],[-0.8,0]]) box(dg,x+dx,z+dz,0.45,0.45,0,0.45,0,C('#e8e2d6')); }
  { const [x,z]=e.at(-1.8,3); box(dg,x,z,3.2,3.2,2.4,0.15,e.ang,C('#8a5a3a')); for(const [a,b] of [[-1.5,-1.5],[1.5,-1.5],[1.5,1.5],[-1.5,1.5]]) box(dg,x+a,z+b,0.1,0.1,0,2.4,0,C('#5a4030')); }
  const l=labels.find(q=>q.name==='Cafe Coffee Day'); if(l){ l.y=7; l.alt=['CCD','Cafe Coffee Day',...(l.alt||[])]; } markOcc(o.cx,o.cz,10); }

// ---- ATM kiosk by the road near the Old Sports Complex (SBI and Union Bank ATMs, OSM points), facing the road to the west
{ const x=-380.5, z=568.7, wh=C('#ebe8e1'); box(dg,x,z,3.6,7.2,0,3.0,0,wh); box(dg,x,z,4.0,7.6,3.0,0.25,0,C('#9a9a96'));
  box(dg,x-1.82,z-1.8,0.06,3.2,0.6,0.5,0,C('#1f5aa8')); box(dg,x-1.82,z+1.8,0.06,3.2,0.6,0.5,0,C('#e2231a'));
  for(const s of [-1.8,1.8]) box(dg,x-1.82,z+s,0.06,1.4,0.05,2.3,0,C('#9fc3d1'));
  plane(x-1.86,2.75,z,-Math.PI/2,6.6,0.62,txt(['ATM'],'#1f5aa8','#ffffff','bold 72px sans-serif',512,80),0.9);
  for(const s of [-1,1]) box(dg,x-2.6,z+s*3.0,0.5,0.5,0,0.6,0,C('#d0c9bb')); markOcc(x,z,5); }

// ---- Divyam Naturals: small shop on the lawn by Shopping Centre Road (no photo yet, so a plain shop with a green awning)
{ const x=159.5, z=154.5; box(dg,x,z,6.4,5.0,0,3.1,0,C('#e9e2d2')); box(dg,x,z,6.8,5.4,3.1,0.25,0,C('#c9c0ae'));
  box(dg,x,z+2.52,3.2,0.06,0.1,2.3,0,C('#3b4a52')); box(dg,x-2.2,z+2.52,1.2,0.06,0.9,1.2,0,C('#9fc3d1'));
  box(dg,x,z+3.2,6.6,1.6,2.45,0.12,0,C('#3f8a3a')); plane(x,2.85,z+2.58,0,5.4,0.48,txt(['Divyam Naturals'],'#2f6f3a','#ffffff','bold 56px sans-serif',512,64),0.5);
  markOcc(x,z+2,5); }

// ---- Old Shopping Complex (from the videos): a single-storey row of shops under one long fascia crowded with colourful signboards,
//      shutters and open shopfronts below, thin columns along a canopy, facing the brick-paved plaza
{ const b0=BN(/^Old Shopping Complex$/); if(b0){ const fas=C('#efe9dc'), pal=['#f2c230','#1f5fbf','#d9372b','#f6f3ea','#2f8f4e','#e8762d','#7a3fa0','#1d9bd1'];
  const near=bInfo.filter(q=>Math.abs(q.cx-b0.cx)<70&&Math.abs(q.cz-b0.cz)<70), inB=(x,z)=>near.some(q=>pip(x,z,q.outer));
  for(const b of bInfo.filter(q=>q===b0||(Math.hypot(q.cx-b0.cx,q.cz-b0.cz)<40&&q.H<9&&q.area>300&&!q.name)))
  for(const e of edges(b.outer)){ if(e.L<5) continue; const [px,pz]=e.at(e.L/2,4); if(!(px>176&&px<211&&pz>176&&pz<231)||inB(px,pz)) continue;
    bx(e,e.L/2,1.0,e.L,2.0,3.0,0.18,fas); cols(e,0,3.0,4,1.9,0.18,C('#d6d0c3'));
    let t=0.2, k=0; while(t<e.L-1.2){ const w=Math.min(e.L-0.2-t,2.6+hash2(Math.round(t*7),Math.round(e.mx))*2.4); const col=pal[(k+Math.round(e.mz))%pal.length];
      bx(e,t+w/2,2.02,w-0.08,0.1,3.18,0.85,C(col)); bx(e,t+w/2,2.08,w*0.7,0.03,3.4,0.35,C(col==='#f6f3ea'?'#d9372b':'#f6f3ea'));
      const open=hash2(k,Math.round(e.mx))<0.6; if(open) quad(glowW,e.at(t+0.15,0.06),e.at(t+w-0.15,0.06),0,2.9,C('#5a4c40')); else cl(e,t+0.15,t+w-0.15,0,2.9,C('#9ea2a5'),0.06);
      if(!open) for(let y=0.3;y<2.8;y+=0.25) bx(e,t+w/2,0.09,w-0.35,0.02,y,0.03,C('#7f8488'));
      t+=w; k++; } } } }
