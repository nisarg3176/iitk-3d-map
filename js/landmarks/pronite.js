// Pronite ground: brick stage, fest bunting, light towers and entry arch.
// ---- Pronite ground: open lawn with the brick stage
{ oc.fillStyle='#fff'; oc.fillRect(toPx(-565),toPx(990),(565-440)*pxPerM,(1110-990)*pxPerM);
  const x=-505, z=1104, bw=34;
  box(dg,x,z,bw+6,13,0,1.6,0,C('#b5492f')); box(dg,x,z-6.4,bw+6,0.3,1.6,0.25,0,C('#efe3d0'));
  box(dg,x,z+5,bw*0.48,1,1.6,5.4,0,C('#e9e9e6')); box(dg,x-bw*0.37,z+5,bw*0.26,1,1.6,5.4,0,C('#1f2226')); box(dg,x+bw*0.37,z+5,bw*0.26,1,1.6,5.4,0,C('#1f2226'));
  for(const s of [-1,1]) for(let k=0;k<4;k++) box(dg,x+s*(bw/2+3+k*1.2),z-2,1.2,8,0,1.6-k*0.4,0,C('#b5492f'));
  const ff=C('#e08a2c'); for(let i=0;i<16;i++){ const t=-bw/2-6+i*(bw+12)/15; box(dg,x+t,z-10,0.18,0.18,0,1.1,0,ff); } box(dg,x,z-10,bw+12,0.1,0.9,0.12,0,ff);
  labels.push({name:'Pronite Stage',x,z:z+4,y:8,rank:4,tier:3,cat:'civic',alt:['Pronite','Antaragni stage','Fest stage'],size:10}); }

// ---- Pronite fest look: bunting, light towers and an entry arch
{ const cols=['#e63946','#f4a261','#2a9d8f','#e9c46a','#7b2cbf'].map(c=>C(c)), pole=C('#8d99a6');
  const poles=[[-560,1000],[-505,995],[-450,1000],[-450,1060],[-560,1060]];
  for(const [x,z] of poles) box(dg,x,z,0.3,0.3,0,7,0,pole);
  const line=(a,b,y0)=>{ const n=Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/1.6); for(let i=1;i<n;i++){ const t=i/n, x=a[0]+(b[0]-a[0])*t, z=a[1]+(b[1]-a[1])*t, y=y0-Math.sin(t*Math.PI)*1.6;
    const ang=Math.atan2(b[1]-a[1],b[0]-a[0]), c=cols[i%cols.length], ux=Math.cos(ang)*0.45, uz=Math.sin(ang)*0.45;
    dg.tri(x-ux,y,z-uz,x+ux,y,z+uz,x,y-0.9,z,c); } };
  for(let i=0;i<poles.length;i++) line(poles[i],poles[(i+1)%poles.length],6.8);
  line(poles[0],[-505,1104-6],6.8); line(poles[2],[-505,1104-6],6.8);
  for(const [x,z] of [[-565,1095],[-445,1095],[-565,995],[-445,995]]){ box(dg,x,z,0.6,0.6,0,14,0,pole); box(dg,x,z,2.6,1,14,1.2,0,C('#30363d')); box(dg,x,z+0.55,2.3,0.1,14.15,0.9,0,C('#fff6d8')); }
  const ax=-500, az=986; for(const s of [-1,1]) box(dg,ax+s*5,az,1,1,0,6,0,C('#7b2cbf')); box(dg,ax,az,11,1.2,6,1.6,0,C('#e63946')); box(dg,ax,az-0.65,9,0.1,6.25,1.1,0,C('#f4d35e')); }
