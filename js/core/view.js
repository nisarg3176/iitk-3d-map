// Post-processing (bloom), map controls and the home view.
/* ---------------- post / controls ---------------- */
const composer=new EffectComposer(renderer);
composer.setPixelRatio(DPR); composer.setSize(innerWidth,innerHeight);
composer.addPass(new RenderPass(scene,camera));
const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth/2,innerHeight/2),0.0,0.55,0.72);
composer.addPass(bloom); composer.addPass(new OutputPass());

const controls=new MapControls(camera,canvas);
controls.enableDamping=true; controls.dampingFactor=0.08;
controls.minDistance=70; controls.maxDistance=3400;
controls.maxPolarAngle=1.36; controls.minPolarAngle=0.15;
controls.screenSpacePanning=false; controls.zoomToCursor=true;
controls.touches.ONE=THREE.TOUCH.PAN; controls.touches.TWO=THREE.TOUCH.DOLLY_ROTATE;

// home view: centred on the academic area
let lib=labels.find(l=>/kelkar/i.test(l.name)); labels.forEach(l=>l.tier=l.tier??2);
const HOME_T=new THREE.Vector3(lib?lib.x+60:150,0,lib?lib.z+40:250);
const HOME_OFF=new THREE.Vector3(-300,290,420).multiplyScalar(innerWidth<innerHeight?1.45:1);
camera.position.copy(HOME_T).add(HOME_OFF.clone().multiplyScalar(2.6)); controls.target.copy(HOME_T);
controls.update();

