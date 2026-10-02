import * as THREE from 'three';
import {vertexShader,fragmentShader} from './shaders.js';
const STATES=[
 {x:1.55,scale:1,rotation:.036,wave:.55,opacity:1,zones:0},
 {x:1.76,scale:.96,rotation:.043,wave:.9,opacity:.8,zones:0},
 {x:1.52,scale:1.05,rotation:.028,wave:.35,opacity:1.25,zones:0},
 {x:1.64,scale:.98,rotation:.02,wave:.28,opacity:.85,zones:1},
 {x:1.36,scale:1.08,rotation:.014,wave:.15,opacity:.7,zones:.25}
];
function seeded(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export function createNeuralField(canvas,reduced){
 const mobile=matchMedia('(max-width:600px)').matches,count=mobile?7000:19000;
 const diagnostics={available:false,count,dpr:0,frames:0,disposed:false};
 const target={...STATES[0]},current={...target};let width=innerWidth,height=innerHeight,angle=.12,time=0,suspended=false,disposed=false;
 let renderer,geometry,material,scene,camera,uniforms;
 const pointerTarget={x:0,y:0,active:0},pointer={x:0,y:0,active:0};
 const coarse=matchMedia('(pointer:coarse), (hover:none)');
 const context=new URL(location).searchParams.get('webgl')==='off'?null:canvas.getContext('webgl2',{alpha:true,antialias:false,powerPreference:'low-power'});
 if(!context)return{diagnostics,setState(){},render(){},resize(){},suspend(){},dispose(){diagnostics.disposed=true;}};
 try{
 renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:false,powerPreference:'low-power'});renderer.setClearColor(0x080e0b,0);
 camera=new THREE.PerspectiveCamera(44,width/height,.1,20);camera.position.z=6;
 scene=new THREE.Scene();geometry=new THREE.BufferGeometry();const random=seeded(1042026),positions=new Float32Array(count*3),seeds=new Float32Array(count),sizes=new Float32Array(count),tones=new Float32Array(count);
 // Immutable seeded geometry: 78% thin shell, 22% volume. No regenerated particle arrays.
 for(let i=0;i<count;i++){const z=random()*2-1,theta=random()*Math.PI*2,phi=Math.sqrt(1-z*z);let radius=i<count*.78?1.91+random()*.09:Math.cbrt(random())*1.94;radius*=1+.036*Math.sin(theta*3+.6)+.022*Math.sin(theta*7+z*4);positions[i*3]=Math.cos(theta)*phi*radius;positions[i*3+1]=z*radius*.97;positions[i*3+2]=Math.sin(theta)*phi*radius;seeds[i]=random();sizes[i]=.85+random()*1.75;tones[i]=.3+random()*.7;}
 geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));geometry.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));geometry.setAttribute('aTone',new THREE.BufferAttribute(tones,1));
 uniforms={uTime:{value:0},uAngle:{value:angle},uScale:{value:1},uOffsetX:{value:1},uWave:{value:.55},uZones:{value:0},uDpr:{value:1},uPointerActive:{value:0},uPointer:{value:new THREE.Vector2()},uTilt:{value:new THREE.Vector2()},uExposure:{value:1}};
 material=new THREE.ShaderMaterial({vertexShader,fragmentShader,uniforms,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending});
 const points=new THREE.Points(geometry,material);points.frustumCulled=false;scene.add(points);diagnostics.available=true;document.body.classList.add('webgl-ready');
 }catch{renderer?.dispose();return{diagnostics,setState(){},render(){},resize(){},suspend(){},dispose(){}};}
 const move=e=>{if(coarse.matches||reduced.matches)return;pointerTarget.x=e.clientX/width*2-1;pointerTarget.y=1-e.clientY/height*2;pointerTarget.active=1;};
 const leave=()=>{pointerTarget.active=0;};window.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',leave);
 function resize(){if(disposed)return;width=innerWidth;height=innerHeight;renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(width,height,false);diagnostics.dpr=renderer.getPixelRatio();uniforms.uDpr.value=diagnostics.dpr;camera.aspect=width/height;camera.updateProjectionMatrix();render(0,true);}
 function render(delta,force=false){
  if(disposed||suspended||(!force&&(document.hidden||reduced.matches)))return;
  const dt=Math.min(Math.max(delta,0),.05),damp=1-Math.exp(-dt*3.5);
  // All objects/uniform vectors exist already. Only scalars change in the shared ticker.
  current.x+=(target.x-current.x)*damp;current.scale+=(target.scale-current.scale)*damp;current.rotation+=(target.rotation-current.rotation)*damp;current.wave+=(target.wave-current.wave)*damp;current.opacity+=(target.opacity-current.opacity)*damp;current.zones+=(target.zones-current.zones)*damp;
  pointer.x+=(pointerTarget.x-pointer.x)*damp;pointer.y+=(pointerTarget.y-pointer.y)*damp;pointer.active+=(pointerTarget.active-pointer.active)*damp;
  if(!reduced.matches){time+=dt;angle+=dt*current.rotation;}
  const aspect=width/height;uniforms.uTime.value=time;uniforms.uAngle.value=angle;uniforms.uScale.value=current.scale*(aspect<.8?.77:1);uniforms.uOffsetX.value=aspect*(aspect<.8?.46:current.x);uniforms.uWave.value=reduced.matches?0:current.wave;uniforms.uExposure.value=current.opacity;uniforms.uZones.value=current.zones;uniforms.uPointer.value.set(pointer.x,pointer.y);uniforms.uPointerActive.value=reduced.matches||coarse.matches?0:pointer.active;uniforms.uTilt.value.set(pointer.x*.025,pointer.y*.025);renderer.render(scene,camera);diagnostics.frames++;
 }
 function setState(index){if(reduced.matches)return;Object.assign(target,STATES[index]);}
 function suspend(value){suspended=value;if(!value)render(0,true);}
 const lost=e=>{e.preventDefault();suspended=true;document.body.classList.remove('webgl-ready');};const restored=()=>{suspended=false;document.body.classList.add('webgl-ready');resize();};canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);
 function dispose(){if(disposed)return;disposed=true;diagnostics.disposed=true;window.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);geometry.dispose();material.dispose();renderer.dispose();document.body.classList.remove('webgl-ready');}
 resize();return{diagnostics,setState,render,resize,suspend,dispose};
}
