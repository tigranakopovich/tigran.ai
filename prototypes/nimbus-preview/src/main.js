import {createChoreography} from './motion/choreography.js';
import {createDemoMotion} from './motion/demos.js';
import {setupForm} from './form.js';
const {createNeuralField}=await import('./webgl/scene.js');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const field=createNeuralField(document.querySelector('#neural-canvas'),reduced),motion=createChoreography(field,reduced),demos=createDemoMotion(reduced),cleanForm=setupForm();
function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.page-progress i').style.transform=`scaleX(${max>0?scrollY/max:0})`;document.querySelector('.site-header').classList.toggle('is-scrolled',scrollY>40);}window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();
function resize(){field.resize();drawBranches();}window.addEventListener('resize',resize);
function drawBranches(){const host=document.querySelector('.case-scene'),svg=host.querySelector('.case-branches'),base=host.getBoundingClientRect(),source=host.querySelector('.case-source').getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${base.width} ${base.height}`);host.querySelectorAll('.case-outputs>.glass').forEach((el,i)=>{const r=el.getBoundingClientRect(),x0=source.right-base.left,y0=source.top+source.height/2-base.top,x1=r.left-base.left,y1=r.top+r.height/2-base.top;svg.querySelectorAll('path')[i].setAttribute('d',`M${x0} ${y0}C${x0+(x1-x0)*.5} ${y0} ${x1-(x1-x0)*.5} ${y1} ${x1} ${y1}`);});}document.fonts.ready.then(drawBranches);drawBranches();
const menu=document.querySelector('.mobile-menu');menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.open=false;}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
const fine=matchMedia('(hover:hover) and (pointer:fine)');const cleanup=[];
if(fine.matches){document.querySelectorAll('.button,.glass').forEach(el=>{let rect;const enter=()=>{rect=el.getBoundingClientRect();},move=e=>{if(reduced.matches||!rect)return;el.style.setProperty('--light-x',`${e.clientX-rect.left}px`);el.style.setProperty('--light-y',`${e.clientY-rect.top}px`);};el.addEventListener('pointerenter',enter);el.addEventListener('pointermove',move);cleanup.push(()=>{el.removeEventListener('pointerenter',enter);el.removeEventListener('pointermove',move);});});}
const pagehide=e=>{demos.cancelAll();motion.suspend(true);if(!e.persisted){motion.destroy();demos.destroy();field.dispose();cleanForm();cleanup.forEach(fn=>fn());window.removeEventListener('resize',resize);window.removeEventListener('scroll',updateScroll);}};
const pageshow=e=>{if(e.persisted){motion.suspend(false);resize();updateScroll();}};window.addEventListener('pagehide',pagehide);window.addEventListener('pageshow',pageshow);
// Diagnostics for one-off local review; no visitor controls or real integration.
window.nimbusPreview={field:field.diagnostics,motion,demos,reduced};
