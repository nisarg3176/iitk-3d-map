// Keyboard shortcuts and the About panel.
// ---- keyboard
addEventListener('keydown',e=>{ const tag=(e.target.tagName||'').toLowerCase(), typing=tag==='input'||tag==='textarea';
  if((e.key==='/'&&!typing)||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')){ if(wk.on) return; e.preventDefault(); (document.body.classList.contains('dir')?dFrom:sq).focus(); return; }
  if(e.key==='Escape'&&!typing&&!wk.on){ if(cardEl.classList.contains('open')) closeCard(); else if(layPop.classList.contains('open')) closeLay(); else if(document.body.classList.contains('dir')) closeDir(); } });
// ---- about
function showAbout(){ setURL(null);
  const pm=peopleMeta;
  cardShell('IIT Kanpur in 3D','About this map',`<p class="c-note">A hand-built 3D model of the IIT Kanpur campus that you can explore, search and find your way around. Halls, lecture halls, the OAT, the main gate, cafés, shops and other landmarks are modelled from real photos and campus videos, with matching colours, signboards, entrances and even the street lamps at night.</p>
  <div class="c-sec">What you can do</div>
  <ul class="c-note" style="margin:4px 0 0;padding-left:18px;line-height:1.55">
    <li><b>Search anything</b>: halls and their blocks, departments, lecture halls, canteens, cafés, shops, roads and landmarks, by their real names or the short ones people use (CC, L20, CCD, MT, H12, ESB2…).</li>
    <li><b>Find a professor's office</b>: type a professor's name to see their department, building and room on the map.</li>
    <li><b>Directions from anywhere to anywhere</b>: pick a From and a To (or use your location) to get the walking route with distance and time.</li>
    <li><b>Walk the route</b>: Start follows you live with GPS, turn by turn; Preview plays the walk so you can see it first.</li>
    <li><b>Useful spots</b>: cycle repair, drinking water, toilets, ATMs and banks, photocopy, laundry, pharmacy, salons, post office, cycle parking, EV charging and lecture halls, each highlighted on the map with a list of the nearest ones.</li>
    <li><b>Walk mode</b>: drop down to street level and stroll around campus.</li>
    <li><b>Double-tap anywhere</b>: get that spot's name, coordinates and directions, and share it as a link.</li>
    <li><b>Day and night</b>: the sun, shadows and seasons follow the real time in Kanpur; at night windows and street lamps light up.</li>
    <li><b>2D map and angle lock</b>: switch to a flat map, or lock the tilt to zoom in easily; double-tap to zoom.</li>
    <li><b>Filters and sharing</b>: show only academic, hostels, food, shops, sports, health or worship, and share a link to any place or route.</li>
    <li><b>Works on any phone</b>: a lighter mode switches on by itself on slower phones.</li>
  </ul>
  <div class="c-sec">Tips</div><p class="c-note">Tap any building or label for details. <b>/</b> or <b>Ctrl K</b> jumps to search, <b>Tab</b> on a result starts directions there, <b>Esc</b> closes panels. Try searching <b>water</b>, <b>atm</b>, <b>photocopy</b> or a professor's name.</p>
  <div class="c-sec">Sources</div><p class="c-note">Building outlines, roads and footpaths start from ${link('https://www.openstreetmap.org/copyright','© OpenStreetMap contributors')} (ODbL), then corrected and detailed by hand. Directions use the campus road and footpath network.</p>
  <p class="c-note" style="margin-top:8px">Professors: IIT Kanpur's public ${link('https://www.iitk.ac.in/iitk-faculty','faculty directory')}${pm?` (${pm.items.length} people, as listed on ${esc(pm.fetched)})`:''}. Offices are placed from the room listed there; where none is given, the department's building is used.</p>
  <div class="c-sec">Something off?</div><p class="c-note">Spotted a building in the wrong place, a missing shop or a wrong colour? Let us know and it'll be fixed in the next update.</p>`); }
const aboutLink=document.getElementById('aboutLink'); aboutLink.onclick=showAbout; aboutLink.onkeydown=e=>{ if(e.key==='Enter') showAbout(); };

let dirty=true, idleT=performance.now(), atmosDirty=true, shadowDirty=true, camDist=1000;
function kick(){ dirty=true; }
controls.addEventListener('change',kick);
controls.addEventListener('start',()=>{ fly=null; controls.autoRotate=false; idleT=performance.now(); hideHint(); });
controls.addEventListener('end',()=>{ idleT=performance.now(); });
let hintTimer=setTimeout(hideHint,7000);
function hideHint(){ hintEl.classList.add('gone'); }
addEventListener('resize',()=>{ camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); composer.setSize(innerWidth,innerHeight); labels.forEach(l=>l.w=0); kick(); });

const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function clampTarget(){ const t=controls.target, lim=EXT-150; const cx=THREE.MathUtils.clamp(t.x,-lim,lim), cz=THREE.MathUtils.clamp(t.z,-lim,lim);
  if(cx!==t.x||cz!==t.z){ camera.position.x+=cx-t.x; camera.position.z+=cz-t.z; t.x=cx; t.z=cz; } t.y=0; }
function updateSun(){
  const d=wk.on?22:camera.position.distanceTo(controls.target); camDist=d;
  const s=THREE.MathUtils.clamp(d*0.95,wk.on?110:160,1700);
  sun.target.position.copy(controls.target);
  sun.position.copy(controls.target).addScaledVector(LIGHT_DIR,2400);
  const cam=sun.shadow.camera; cam.left=-s;cam.right=s;cam.top=s;cam.bottom=-s; cam.near=100; cam.far=4800; cam.updateProjectionMatrix();
  const fk=wxCur.fogK;
  scene.fog.near=(d*0.8+150)*fk; scene.fog.far=(d*2.2+1250)*(0.35+0.65*fk)*(fk<0.5?0.55+fk:1);
  lampGlow.material.size = THREE.MathUtils.clamp(d/115,4,10.5);
}
let last=performance.now(), lastRender=0, liveT=0;
const FRAME_MS=isCoarse?32:0;
