// Generic buildings from the map data: walls with window grids, flat/hip roofs, rooftop clutter, solar panels, bushes. Colours come from data/styles.json.
// --- buildings
const [winMap,winEmi]=windowTextures();
const wallG=new Geo(), roofG=new Geo();
const PAL={
  university:['#ece7de','#e3ddd2','#d9d4ca','#efe8da','#e6d6c2'],
  dormitory:['#ead8bd','#e8cfae','#efe0c6','#e2c9a6'],
  residential:['#f1ece2','#ebe4d6','#e6ddcd','#f3eee6'],
  house:['#f5f0e6','#f0e8da','#ece3d2'],
  school:['#efdcb3','#ead3a2'],
  kindergarten:['#f2d7a8'],
  construction:['#cfcac0'],
  yes:['#e6e2da','#dcd8cf','#ebe5da','#e3dccd']
};
const ROOFRED=['#b5533b','#a8492f','#bf6145','#9f4732'];
const GLASS=/library|computer cent|auditorium|technopark|rajeev motwani|c3i|outreach|samtel|flexible|sustainable/i;
const labels=[];
const hallGroups=new Map();
const SKIP=/substation|laundry|tv room|reading room|security control|central store|maintenance|monitoring station|^iit kanpur$|semi-urban|multipurpose|gym|^workshop$|^sbi$|central ac|^subway$|^house \d+$|^building \d+$|^\d+$/i;
function cleanName(n){ return n.replace(/,?\s*(@\s*)?(IIT Kanpur|IITK)\b/ig,'').replace(/^P K /,'PK ').replace(/^Dept\.? Of /i,'Dept of ').replace(/^H\.R\. /,'HR ').replace(/^Hall(\d)/,'Hall $1').replace(/\s+/g,' ').trim() || n; }
const TIER1=/kelkar|main auditorium|computer cent|outreach auditorium|lecture hall complex|faculty building|rajeev motwani|gurdwara|indoor sports|^flight lab$|director|technopark|health cent|shopping cent|wind tunnel|kadim diwan|^hall \d+$|girls hall|sports stadium|swimming pool|activity centre|open air theatre|airstrip|mt market|old shopping|pronite|hanuman temple|silver jubilee|metro station|^visitor hostel|kendriya|football field|events ground|aces ground|old sports complex/i;
function bcat(n,t){ if(/lecture|tutorial|^L\d+$/i.test(n)) return 'academic'; if(/hall|hostel|mess|residence|apartment|quarters/i.test(n)) return 'hostel'; if(/canteen|cafe|caf\u00e9|nescaf|coffee|restaurant|food|juice|shake/i.test(n)) return 'food';
  if(/gurdwara|temple|mandir|mosque|church/i.test(n)) return 'worship'; if(/health|hospital|counsel|cmhw/i.test(n)) return 'health'; if(/sports|stadium|gym/i.test(n)) return 'sports';
  if(/shop|market|store|bank/i.test(n)) return 'shop'; return t==='dormitory'||t==='residential'||t==='house'?'hostel':'academic'; }
const LANDMARK=/kelkar|main auditorium|computer centre|outreach auditorium|lecture hall complex|faculty building|rajeev motwani|gurdwara|indoor sports|flight lab|director|technopark|health center|shopping center|wind tunnel|kadim diwan|visitor/i;
const roofBoxes=[];
function hipRoof(ring, y, col){
  // minimum-area oriented rectangle via edge directions
  let best=null;
  for(let i=0;i<ring.length;i++){ const a=ring[i],b=ring[(i+1)%ring.length]; let ux=b[0]-a[0],uz=b[1]-a[1]; const l=Math.hypot(ux,uz); if(l<0.5) continue; ux/=l;uz/=l;
    let mn1=1e9,mx1=-1e9,mn2=1e9,mx2=-1e9; for(const p of ring){ const s=p[0]*ux+p[1]*uz, t=-p[0]*uz+p[1]*ux; mn1=Math.min(mn1,s);mx1=Math.max(mx1,s);mn2=Math.min(mn2,t);mx2=Math.max(mx2,t); }
    const ar=(mx1-mn1)*(mx2-mn2); if(!best||ar<best.ar) best={ar,ux,uz,mn1,mx1,mn2,mx2}; }
  if(!best) return false;
  const ov=0.45; let {ux,uz,mn1,mx1,mn2,mx2}=best; mn1-=ov;mx1+=ov;mn2-=ov;mx2+=ov;
  let L=mx1-mn1, Wd=mx2-mn2; let ax=[ux,uz], bx=[-uz,ux];
  if(Wd>L){ [mn1,mx1,mn2,mx2]=[mn2,mx2,mn1,mx1]; [L,Wd]=[Wd,L]; const t=ax; ax=bx; bx=[-t[0],-t[1]]; [mn2,mx2]=[-mx2,-mn2]; }
  const P=(s,t)=>[ax[0]*s+bx[0]*t, ax[1]*s+bx[1]*t];
  const A=P(mn1,mn2),B=P(mx1,mn2),Cc=P(mx1,mx2),D=P(mn1,mx2);
  const rh=Math.min(Wd*0.38,4.5), inset=Math.min(Wd/2,L/2);
  const tm=(mn2+mx2)/2, R1=P(mn1+inset,tm), R2=P(mx1-inset,tm);
  const yr=y+rh, Y=y-0.25;
  roofG.tri(A[0],Y,A[1],B[0],Y,B[1],R2[0],yr,R2[1],col); roofG.tri(A[0],Y,A[1],R2[0],yr,R2[1],R1[0],yr,R1[1],col);
  roofG.tri(Cc[0],Y,Cc[1],D[0],Y,D[1],R1[0],yr,R1[1],col); roofG.tri(Cc[0],Y,Cc[1],R1[0],yr,R1[1],R2[0],yr,R2[1],col);
  const c2=col.clone().multiplyScalar(0.9);
  roofG.tri(B[0],Y,B[1],Cc[0],Y,Cc[1],R2[0],yr,R2[1],c2); roofG.tri(D[0],Y,D[1],A[0],Y,A[1],R1[0],yr,R1[1],c2);
  // soffit (underside) so overhang isn't see-through from below
  roofG.flat(A[0],A[1],B[0],B[1],Cc[0],Cc[1],Y-0.01,c2.clone().multiplyScalar(.7)); roofG.flat(A[0],A[1],Cc[0],Cc[1],D[0],D[1],Y-0.01,c2.clone().multiplyScalar(.7));
  return true;
}
function box(g,cx,cz,w,d,y0,h,ang,col){
  const c=Math.cos(ang),s=Math.sin(ang);
  const P=(x,z)=>[cx+x*c-z*s,cz+x*s+z*c];
  const q=[P(-w/2,-d/2),P(w/2,-d/2),P(w/2,d/2),P(-w/2,d/2)], y1=y0+h;
  g.flat(q[0][0],q[0][1],q[1][0],q[1][1],q[2][0],q[2][1],y1,col); g.flat(q[0][0],q[0][1],q[2][0],q[2][1],q[3][0],q[3][1],y1,col);
  const sc=col.clone().multiplyScalar(0.82);
  for(let i=0;i<4;i++){ const a=q[i],b=q[(i+1)%4]; let nx=b[1]-a[1], nz=-(b[0]-a[0]); const l=Math.hypot(nx,nz)||1; nx/=l;nz/=l;
    // ensure outward
    const mx=(a[0]+b[0])/2-cx, mz=(a[1]+b[1])/2-cz; if(nx*mx+nz*mz<0){nx=-nx;nz=-nz;}
    const pushV=(p,y)=>{ g.p.push(p[0],y,p[1]); g.n.push(nx,0,nz); g.c.push(sc.r,sc.g,sc.b); };
    // choose order so face is CCW from outside
    const cr=(b[0]-a[0])*nz-(b[1]-a[1])*nx; // sign check
    if(cr>0){ pushV(a,y0);pushV(b,y1);pushV(b,y0); pushV(a,y0);pushV(a,y1);pushV(b,y1); }
    else { pushV(a,y0);pushV(b,y0);pushV(b,y1); pushV(a,y0);pushV(b,y1);pushV(a,y1); }
  }
}
const bInfo=[];
// facade styles matched to photos (wall colour + frame/band details added later)
const STY=STYLES.styles;   // building colours: edit data/styles.json
const decos=[];
let _rSave=null;
for(const b of data.buildings){
  if(b.hx&&_rSave===null) _rSave=R.st();
  let rings=b.r.map(toPts);
  const outer=rings[0]; if(outer.length<3) continue;
  if(signedArea(outer)<0) outer.reverse();
  for(let i=1;i<rings.length;i++) if(signedArea(rings[i])>0) rings[i].reverse();
  const area=Math.abs(signedArea(outer));
  const t=PAL[b.t]?b.t:'yes';
  const fh=3.3;
  let floors = b.l ? b.l : ({university:3,dormitory:4,residential:3,house:2,school:2,kindergarten:1,construction:2}[t] ?? (area>900?3:area>250?2:1));
  if(!b.l && t==='university' && area>2500) floors=4;
  if(!b.l && t==='yes' && area<60) floors=1;
  floors=Math.max(1,Math.min(floors,14));
  const H=b.h ? Math.max(3,b.h) : floors*fh+0.7;
  const pal=PAL[t]; let wc=C(pal[(R()*pal.length)|0]);
  const glassy = b.n && GLASS.test(b.n);
  if(glassy) wc=C('#cfe3ec');
  const st=b.sty&&STY[b.sty]; if(st) wc=C(st.wall);
  const pan0=panels.length;
  const w0=wallG.p.length/3, r0=roofG.p.length/3;
  const u0=(R()*16)|0, v0=(R()*16)|0; const wcB=wc.clone().multiplyScalar(H>8?0.72:0.8);
  for(const ring of rings){
    let u=u0;
    for(let i=0;i<ring.length;i++){
      const a=ring[i], c=ring[(i+1)%ring.length];
      const dx=c[0]-a[0], dz=c[1]-a[1], len=Math.hypot(dx,dz); if(len<0.05) continue;
      const nx=dz/len, nz=-dx/len;
      const bays = len>2 ? Math.max(1,Math.round(len/3.4)) : len/3.4;
      const u1=u+bays, vt=(v0+H/fh)/16, vb=v0/16;
      const A0=[a[0],0,a[1]],B0=[c[0],0,c[1]],A1=[a[0],H,a[1]],B1=[c[0],H,c[1]];
      const push=st&&st.plain?(p)=>wallG.v(p[0],p[1],p[2],nx,0,nz,p[1]>0?wc:wcB,0.004,0.031):(p,uu,vv)=>wallG.v(p[0],p[1],p[2],nx,0,nz,p[1]>0?wc:wcB,uu/16,vv);
      push(A0,u,vb); push(B1,u1,vt); push(B0,u1,vb);
      push(A0,u,vb); push(A1,u,vt); push(B1,u1,vt);
      u=u1;
    }
  }
  const rc = st ? C('#aaa69e').lerp(wc,0.12) : wc.clone().multiplyScalar(0.86).lerp(C('#9d9b96'),0.25);
  let didHip=false;
  if((t==='house' || (t==='residential' && area<220) || /gabled|hipped|pyramidal/.test(b.rs||'')) && rings.length===1){ didHip=hipRoof(outer,H,C(ROOFRED[(R()*ROOFRED.length)|0])); }
  if(!didHip){
    const Hr=H-0.65;
    fillPoly(roofG,rings,Hr,rc);
    const pc=wc.clone().multiplyScalar(0.8);
    for(const ring of rings) for(let i=0;i<ring.length;i++){ const a=ring[i],c=ring[(i+1)%ring.length];
      roofG.p.push(a[0],Hr,a[1], c[0],H,c[1], c[0],Hr,c[1], a[0],Hr,a[1], a[0],H,a[1], c[0],H,c[1]);
      for(let k=0;k<6;k++){ roofG.n.push(0,1,0); roofG.c.push(pc.r,pc.g,pc.b); } }
    // rooftop clutter on big flat roofs
    if(area>220){
      const nb=Math.min(5,1+(area/600|0)); const [cx,cz]=centroid(outer);
      let ang=Math.atan2(outer[1][1]-outer[0][1],outer[1][0]-outer[0][0]);
      let minx=1e9,maxx=-1e9,minz=1e9,maxz=-1e9; for(const p of outer){minx=Math.min(minx,p[0]);maxx=Math.max(maxx,p[0]);minz=Math.min(minz,p[1]);maxz=Math.max(maxz,p[1]);}
      for(let k=0,tries=0;k<nb&&tries<30;tries++){
        const x=rr(minx,maxx), z=rr(minz,maxz); if(!pip(x,z,outer)) continue;
        // keep away from edge
        let ok=true; for(const q of [[3,0],[-3,0],[0,3],[0,-3]]) if(!pip(x+q[0],z+q[1],outer)) ok=false; if(!ok) continue;
        const tank=R()<0.35;
        if(tank) box(roofG,x,z,2.4,2.4,Hr,1.8,ang,C('#3d4a57'));
        else box(roofG,x,z,rr(2.5,6),rr(2,4),Hr,rr(1,2.4),ang,rc.clone().multiplyScalar(1.08));
        k++;
      }
    }
  }
  if(st) decos.push({st,outer,H,floors,area,rings});
  // solar panels on some big flat roofs
  if(!didHip && area>450 && t!=='house' && (b.sol!=null?(R(),b.sol):R()<0.4) && panels.length<5000)
    gridInPoly(rings,4.3,3.4,2.6,(x,z,ang)=>panels.push([x,z,H-0.65+0.45,ang,4,1.9]));
  // landscaping: bushes hugging the walls
  if(area>80) walk(outer.concat([outer[0]]),rr(3.5,5),rr(0,3),(x,z,dx,dz)=>{
    if(R()>0.5) return; const off=rr(1.8,2.8); const px=x+dz*off, pz=z-dx*off; if(roadAt(px,pz)||pip(px,pz,outer)) return; const sz=rr(0.7,1.4); if(Math.hypot(px+532,pz-940)<17) return; bushes.push([px,pz,sz]); });   // none on the OAT stage
  // occupancy + ambient occlusion footprint
  oc.fillStyle='#fff'; ctxPoly(oc,rings); oc.fill('evenodd'); oc.lineWidth=5*pxPerM; oc.stroke();
  ac.fillStyle='#fff'; ac.beginPath(); for(const r of rings){ r.forEach((p,i)=>i?ac.lineTo(toAo(p[0]),toAo(p[1])):ac.moveTo(toAo(p[0]),toAo(p[1]))); ac.closePath(); } ac.fill('evenodd');
  const [cx,cz]=centroid(outer);
  const bi={cx,cz,H,area,outer,w0,w1:wallG.p.length/3,r0,r1:roofG.p.length/3,cat:null,name:b.n?cleanName(b.n):null}; bInfo.push(bi);
  const svc=b.n&&/^(central store|security control room|electrical maintenance office|central ac plant|atmospheric monitoring station)/i.test(b.n);
  if(svc) labels.push({name:cleanName(b.n),short:cleanName(b.n).replace(/\s*\(.*\)$/,''),x:cx,z:cz,y:H+2,rank:Math.sqrt(area),tier:3.5,kind:'blk',cat:'civic',size:Math.sqrt(area)});
  else if(b.n && (!SKIP.test(b.n) || (/^Hall ?\d/i.test(b.n)&&!/gym/i.test(b.n)))){
    let name=cleanName(b.n); if(b.ab && !name.includes(b.ab)) name+=' ('+b.ab+')';
    if(/^Hall\d/i.test(name)) name=name.replace(/^Hall(\d)/i,'Hall $1');
    const hm=name.match(/^Hall (\d+)\b/i);
    if(hm){ const k='Hall '+hm[1]; const g=hallGroups.get(k)||{x:0,z:0,n:0,H:0,area:0}; g.x+=cx;g.z+=cz;g.n++;g.H=Math.max(g.H,H);g.area+=area; hallGroups.set(k,g);
      const sub=name.replace(/^Hall \d+\s*/i,'').trim();
      if(sub) labels.push({name:k+' '+sub,short:'H'+hm[1]+' · '+sub.replace(/^./,c=>c.toUpperCase()),hall:k,x:cx,z:cz,y:H+2,rank:Math.sqrt(area),tier:3.5,kind:'blk',
        cat:/mess|canteen/i.test(sub)?'food':'hostel',alt:[k+' '+sub.replace(/^block\s*/i,''),sub+' '+k],size:Math.sqrt(area)}); }
    else labels.push({name,x:cx,z:cz,y:H+(didHip?4:2),rank:Math.sqrt(area)*(1+floors*0.1),cat:bcat(name,t),alt:[b.fn,...(b.alt||[])].filter(Boolean),size:Math.sqrt(area),...(b.feat?{kind:'feat',cat:'health'}:{})});
  } else if(b.hn) labels.push({name:b.hn,x:cx,z:cz,y:H+(didHip?3.5:1.2),rank:0,tier:4,kind:'hn'});
  if(b.cust){ // hand-modelled further down: drop the generic box (random draws above are kept so nothing else shifts)
    wallG.p.length=w0*3; wallG.n.length=w0*3; wallG.c.length=w0*3; wallG.uv.length=w0*2;
    roofG.p.length=r0*3; roofG.n.length=r0*3; roofG.c.length=r0*3; panels.length=pan0;
    bi.w1=w0; bi.r1=r0; bi.cust=b.cust; decos.push({cust:b.cust,outer,rings,H,area,cx,cz});
    const l=labels.find(q=>q.name===bi.name); if(l) l.y=16; }
}
if(_rSave!==null) R.set(_rSave);
