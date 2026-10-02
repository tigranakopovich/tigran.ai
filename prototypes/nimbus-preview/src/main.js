import {createChoreography} from './motion/choreography.js';
import {createDemoMotion} from './motion/demos.js';
import {setupForm} from './form.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// Keep the contact/menu/demo code independent of the decorative WebGL download.
let engine=null,loading=null,dead=false,fieldState=0,fieldSuspended=false;
const fallbackDiagnostics={available:false,count:0,dpr:0,frames:0,disposed:false};
const field={get diagnostics(){return engine?.diagnostics||fallbackDiagnostics;},setState(i){fieldState=i;engine?.setState(i);},render(...args){engine?.render(...args);},resize(){engine?.resize();},suspend(value){fieldSuspended=value;engine?.suspend(value);},dispose(){dead=true;fallbackDiagnostics.disposed=true;engine?.dispose();}};
function loadField(){if(dead||reduced.matches||loading)return;loading=import('./webgl/scene.js').then(({createNeuralField})=>{if(dead)return;engine=createNeuralField(document.querySelector('#neural-canvas'),reduced);engine.setState(fieldState);engine.suspend(fieldSuspended);}).catch(()=>{ /* The CSS sphere remains available if the optional download fails. */ });}
const motion=createChoreography(field,reduced),demos=createDemoMotion(reduced),cleanForm=setupForm();
const fieldTimer=setTimeout(loadField,250);
const fieldMode=()=>{if(!reduced.matches)loadField();};reduced.addEventListener('change',fieldMode);
function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.page-progress i').style.transform=`scaleX(${max>0?scrollY/max:0})`;document.querySelector('.site-header').classList.toggle('is-scrolled',scrollY>40);}window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();
function resize(){field.resize();drawBranches();}window.addEventListener('resize',resize);
function drawBranches(){if(getComputedStyle(document.querySelector('.case-branches')).display==='none')return;const host=document.querySelector('.case-scene'),svg=host.querySelector('.case-branches'),base=host.getBoundingClientRect(),source=host.querySelector('.case-source').getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${base.width} ${base.height}`);host.querySelectorAll('.case-outputs>.glass').forEach((el,i)=>{const r=el.getBoundingClientRect(),x0=source.right-base.left,y0=source.top+source.height/2-base.top,x1=r.left-base.left,y1=r.top+r.height/2-base.top;svg.querySelectorAll('path')[i].setAttribute('d',`M${x0} ${y0}C${x0+(x1-x0)*.5} ${y0} ${x1-(x1-x0)*.5} ${y1} ${x1} ${y1}`);});}document.fonts.ready.then(drawBranches);drawBranches();
const menu=document.querySelector('.mobile-menu');menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.open=false;}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
const fine=matchMedia('(hover:hover) and (pointer:fine)');const cleanup=[];
if(fine.matches){document.querySelectorAll('.button,.glass').forEach(el=>{let rect;const enter=()=>{rect=el.getBoundingClientRect();},move=e=>{if(reduced.matches||!rect)return;el.style.setProperty('--light-x',`${e.clientX-rect.left}px`);el.style.setProperty('--light-y',`${e.clientY-rect.top}px`);};el.addEventListener('pointerenter',enter);el.addEventListener('pointermove',move);cleanup.push(()=>{el.removeEventListener('pointerenter',enter);el.removeEventListener('pointermove',move);});});}
const pagehide=e=>{demos.cancelAll();motion.suspend(true);if(!e.persisted){clearTimeout(fieldTimer);reduced.removeEventListener('change',fieldMode);motion.destroy();demos.destroy();field.dispose();cleanForm();cleanup.forEach(fn=>fn());window.removeEventListener('resize',resize);window.removeEventListener('scroll',updateScroll);}};
const pageshow=e=>{if(e.persisted){motion.suspend(false);resize();updateScroll();}};window.addEventListener('pagehide',pagehide);window.addEventListener('pageshow',pageshow);
// Diagnostics for one-off local review; no visitor controls or real integration.
window.nimbusPreview={get field(){return field.diagnostics;},motion,demos,reduced};
