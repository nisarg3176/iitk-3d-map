// Facade details for every styled building: concrete frames, floor bands, balcony stripes, awnings.
// facade details: concrete frames, floor bands, balcony stripes, awnings
for(const o of decos){ if(!o.st) continue; const st=o.st, outer=o.outer, H=o.H;
  const fr=st.frame?C(st.frame):null, stp=st.stripe?C(st.stripe):null, aw=st.awn?C(st.awn):null, bd=st.band?C(st.band):null;
  const bay=st.bay||4.5, fl=Math.max(1,Math.round((H-0.7)/3.3)); let longest=null;
  for(let i=0;i<outer.length;i++){ const a=outer[i],b=outer[(i+1)%outer.length]; const dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz); if(L<1.5) continue;
    const ux=dx/L,uz=dz/L; let nx=uz,nz=-ux; const mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2; if(pipO(mx+nx*0.6,mz+nz*0.6,outer)){ nx=-nx; nz=-nz; }
    const ang=Math.atan2(dz,dx), at=(t,off)=>[a[0]+ux*t+nx*off,a[1]+uz*t+nz*off];
    if(!longest||L>longest.L) longest={a,ux,uz,nx,nz,ang,L};
    if(fr){ const n=Math.max(1,Math.round(L/bay)); for(let k=0;k<=n;k++){ const [x,z]=at(L*k/n,0.25); box(dg,x,z,0.55,0.5,0,H+0.15,ang,fr); }
      for(let k=1;k<fl;k++){ const [x,z]=at(L/2,0.22); box(dg,x,z,L,0.44,k*3.3-0.15,0.35,ang,fr); }
      const [x,z]=at(L/2,0.1); box(dg,x,z,L+0.4,0.5,H-0.2,0.6,ang,fr); }
    if(stp) for(let k=1;k<=fl;k++){ const [x,z]=at(L/2,0.5); box(dg,x,z,L,0.3,k*3.3-2.3,0.7,ang,stp); }
    if(aw&&L>2.5){ const [x,z]=at(L/2,1.0); box(dg,x,z,L-0.4,2.0,2.7,0.18,ang,aw); }
    if(bd){ const [x,z]=at(L/2,0.15); box(dg,x,z,L,0.3,H-1.7,1.0,ang,bd); } }
  if(st.doors&&longest){ const {a,ux,uz,nx,nz,ang,L}=longest; const n=Math.min(3,Math.floor(L/5)); for(let k=0;k<n;k++){ const t=L*(k+1)/(n+1); box(dg,a[0]+ux*t+nx*0.12,a[1]+uz*t+nz*0.12,3.4,0.25,0,3.8,ang,C(st.doors)); } } }
