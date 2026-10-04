import * as THREE from 'three';
import {vertexShader,fragmentShader} from './shaders.js';
import landMask from './land-mask.json';
function maskPixel(u,v){const row=landMask.rows[Math.min(landMask.height-1,Math.max(0,v))];u=(u+landMask.width)%landMask.width;for(let k=0;k<row.length;k+=2){if(u<row[k])break;if(u<row[k+1])return true;}return false;}
function seeded(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function pointGeometry(count){
 const random=seeded(1042026),coast=[];
 landMask.rows.forEach((row,v)=>{for(let k=0;k<row.length;k+=2){coast.push([row[k]+.5,v+.5],[row[k+1]-.5,v+.5]);for(let u=row[k]+2;u<row[k+1]-2;u+=4)if(!maskPixel(u,v-1)||!maskPixel(u,v+1))coast.push([u+.5,v+.5]);}});
 const positions=new Float32Array(count*3),lands=new Float32Array(count),sizes=new Float32Array(count),tones=new Float32Array(count);
 // Same 19000/7000 budget. Allocate points once; never resample per frame.
 for(let i=0;i<count;i++){let lon,lat;
  if(i<count*.30){const [u,v]=coast[Math.floor(((i*.61803398875)%1)*coast.length)];lon=u/landMask.width*Math.PI*2-Math.PI;lat=Math.PI/2-v/landMask.height*Math.PI;lands[i]=2;}
  else{const land=i<count*.95;let u,v;do{lon=random()*Math.PI*2-Math.PI;lat=Math.asin(random()*2-1);u=Math.floor((lon+Math.PI)/(2*Math.PI)*landMask.width);v=Math.floor((Math.PI/2-lat)/Math.PI*landMask.height);}while(maskPixel(u,v)!==land);lands[i]=land?1:0;}
  const radius=1.955;positions[i*3]=Math.sin(lon)*Math.cos(lat)*radius;positions[i*3+1]=Math.sin(lat)*radius;positions[i*3+2]=Math.cos(lon)*Math.cos(lat)*radius;sizes[i]=random();tones[i]=random();
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aLand',new THREE.BufferAttribute(lands,1));geometry.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));geometry.setAttribute('aTone',new THREE.BufferAttribute(tones,1));return geometry;
}
const STATES=[
 {x:1.13,scale:1,rotation:.036,wave:.55,opacity:1,zones:0},
 {x:1.76,scale:.96,rotation:.043,wave:.9,opacity:.8,zones:0},
 {x:1.52,scale:1.05,rotation:.028,wave:.35,opacity:1.25,zones:0},
 {x:1.64,scale:.98,rotation:.02,wave:.28,opacity:.85,zones:1},
 {x:1.36,scale:1.08,rotation:.014,wave:.15,opacity:.7,zones:.25}
];
export function createNeuralField(canvas,reduced){
 const mobile=matchMedia('(max-width:600px)').matches,count=mobile?7000:19000;
 const diagnostics={available:false,type:'silver-point-earth',count,dpr:0,frames:0,disposed:false};
 const target={...STATES[0]},current={...target};let width=canvas.clientWidth,height=canvas.clientHeight,angle=-8*Math.PI/180,time=0,suspended=false,disposed=false;
 let renderer,geometry,material,scene,camera,uniforms;
 const pointerTarget={x:0,y:0,active:0},pointer={x:0,y:0,active:0};
 const coarse=matchMedia('(pointer:coarse), (hover:none)');
 const context=new URL(location).searchParams.get('webgl')==='off'?null:canvas.getContext('webgl2',{alpha:true,antialias:false,powerPreference:'low-power'});
 if(!context)return{diagnostics,setState(){},render(){},resize(){},suspend(){},dispose(){diagnostics.disposed=true;}};
 try{
 renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:false,powerPreference:'low-power'});renderer.setClearColor(0x080e0b,0);
 camera=new THREE.OrthographicCamera(-2.39*width/height,2.39*width/height,2.39,-2.39,.1,20);camera.position.z=6.4;
 scene=new THREE.Scene();geometry=pointGeometry(count);
 uniforms={uTime:{value:0},uAngle:{value:angle},uScale:{value:1},uOffsetX:{value:1},uWave:{value:.55},uZones:{value:0},uDpr:{value:1},uPointerActive:{value:0},uPointer:{value:new THREE.Vector2()},uTilt:{value:new THREE.Vector2()},uExposure:{value:1},uSourceRect:{value:new THREE.Vector4()},uResultRect:{value:new THREE.Vector4()}};
 material=new THREE.ShaderMaterial({vertexShader,fragmentShader,uniforms,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending});
 const earth=new THREE.Points(geometry,material);earth.frustumCulled=false;scene.add(earth);diagnostics.available=true;document.body.classList.add('webgl-ready');
 }catch{geometry?.dispose();material?.dispose();renderer?.dispose();return{diagnostics,setState(){},render(){},resize(){},suspend(){},dispose(){}};}
 let stageRect=canvas.getBoundingClientRect();
 const refreshPointerRect=()=>{stageRect=canvas.getBoundingClientRect();};
 window.addEventListener('scroll',refreshPointerRect,{passive:true});window.addEventListener('resize',refreshPointerRect);
 const move=e=>{if(coarse.matches||reduced.matches)return;if(e.clientX<stageRect.left||e.clientX>stageRect.right||e.clientY<stageRect.top||e.clientY>stageRect.bottom){pointerTarget.active=0;return;}pointerTarget.x=(e.clientX-stageRect.left)/width*2-1;pointerTarget.y=1-(e.clientY-stageRect.top)/height*2;pointerTarget.active=1;};
 const leave=()=>{pointerTarget.active=0;};window.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',leave);
 function resize(){if(disposed)return;width=canvas.clientWidth;height=canvas.clientHeight;renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<=600?1:1.5));renderer.setSize(width,height,false);diagnostics.dpr=renderer.getPixelRatio();uniforms.uDpr.value=diagnostics.dpr;camera.left=-2.39*width/height;camera.right=2.39*width/height;camera.updateProjectionMatrix();
  const stage=canvas.getBoundingClientRect();
  for(const [selector,key] of [['.source-card','uSourceRect'],['.result-card','uResultRect']]){const rect=document.querySelector(`.hero-scenario:not([hidden]) ${selector}`).getBoundingClientRect();uniforms[key].value.set((rect.left-stage.left)/width*2-1,1-(rect.bottom-stage.top)/height*2,(rect.right-stage.left)/width*2-1,1-(rect.top-stage.top)/height*2);}
  render(0,true);}
 function render(delta,force=false){
  if(disposed||suspended||(!force&&(document.hidden||reduced.matches)))return;
  const dt=Math.min(Math.max(delta,0),.05),damp=1-Math.exp(-dt*3.5);
  // All objects/uniform vectors exist already. Only scalars change in the shared ticker.
  current.x+=(target.x-current.x)*damp;current.scale+=(target.scale-current.scale)*damp;current.rotation+=(target.rotation-current.rotation)*damp;current.wave+=(target.wave-current.wave)*damp;current.opacity+=(target.opacity-current.opacity)*damp;current.zones+=(target.zones-current.zones)*damp;
  pointer.x+=(pointerTarget.x-pointer.x)*damp;pointer.y+=(pointerTarget.y-pointer.y)*damp;pointer.active+=(pointerTarget.active-pointer.active)*damp;
  if(!reduced.matches){time+=dt;angle+=dt*.018;}
  uniforms.uTime.value=time;uniforms.uAngle.value=angle;uniforms.uScale.value=1;uniforms.uOffsetX.value=0;uniforms.uWave.value=reduced.matches?0:current.wave;uniforms.uExposure.value=innerWidth<=600?.85:1.08;uniforms.uZones.value=current.zones;uniforms.uPointer.value.set(pointer.x,pointer.y);uniforms.uPointerActive.value=reduced.matches||coarse.matches?0:pointer.active;uniforms.uTilt.value.set(pointer.x*.01,-.1396263+pointer.y*.01);renderer.render(scene,camera);diagnostics.frames++;
 }
 function setState(index){if(reduced.matches)return;Object.assign(target,STATES[index]);}
 function suspend(value){suspended=value;if(!value)render(0,true);}
 const lost=e=>{e.preventDefault();suspended=true;document.body.classList.remove('webgl-ready');};const restored=()=>{suspended=false;document.body.classList.add('webgl-ready');resize();};canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);
 function dispose(){if(disposed)return;disposed=true;diagnostics.disposed=true;window.removeEventListener('scroll',refreshPointerRect);window.removeEventListener('resize',refreshPointerRect);window.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);geometry.dispose();material.dispose();renderer.dispose();document.body.classList.remove('webgl-ready');}
 resize();return{diagnostics,setState,render,resize,suspend,dispose};
}
