// IIT Kanpur in 3D: start-up.
// Loads three.js, the map data and every code file listed in index.html (<link ... data-part>), all at the same time,
// then runs the code files in that order as one program (so functions in any file can call functions in any other file).
import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const get=(url,json)=>fetch(url,{credentials:'same-origin'}).then(r=>{ if(!r.ok) throw new Error(url+' '+r.status); return json?r.json():r.text(); });
const files=[...document.querySelectorAll('link[data-part]')].map(l=>l.getAttribute('href'));
const [CAMPUS,STYLES,...codes]=await Promise.all([get('campus.json?v=20261129',1),get('data/styles.json?v=20261127b',1),...files.map(f=>get(f))]);
const src=files.map((f,i)=>'// ===== '+f.replace(/\?.*/,'')+' =====\n'+codes[i]).join('\n');
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const app=new AsyncFunction('THREE','MapControls','EffectComposer','RenderPass','UnrealBloomPass','OutputPass','CAMPUS','STYLES',"'use strict';\n"+src+'\n//# sourceURL=iitk3d-app.js');
app(THREE,MapControls,EffectComposer,RenderPass,UnrealBloomPass,OutputPass,CAMPUS,STYLES).catch(e=>{ console.error(e); const m=document.getElementById('lmsg'); if(m) m.textContent='Something went wrong while loading. Please refresh.'; });
