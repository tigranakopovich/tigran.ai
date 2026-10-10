import {setupAnchorNavigation} from './navigation.js';
import {createChoreography} from './motion/choreography.js';
import {createCarousel,setupWorkspaceGlow} from './motion/carousels.js';
import {createSupportingMotion} from './motion/supporting.js';
import {setupForm} from './form.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let engine=null,loading=null,dead=false,fieldSuspended=false;
const fallbackDiagnostics={available:false,count:0,dpr:0,frames:0,disposed:false};
const field={get diagnostics(){return engine?.diagnostics||fallbackDiagnostics;},render(delta,force=false){engine?.render(delta,force);},resize(){engine?.resize();},suspend(value){fieldSuspended=value;engine?.suspend(value);},dispose(){dead=true;fallbackDiagnostics.disposed=true;engine?.dispose();}};
function loadField(){if(dead||reduced.matches||loading)return;loading=import('./webgl/scene.js').then(({createNeuralField})=>{if(dead)return;engine=createNeuralField(document.querySelector('#neural-canvas'),reduced);engine.suspend(fieldSuspended);}).catch(()=>{});}
// Measure only on layout changes, independently of lazy GPU loading. This
// positions the CSS fallback and the WebGL field around the same two panels.
function positionField(){
 const hero=document.querySelector('#hero'),stack=hero.querySelector('.hero-demo .scenario-stack'),stage=hero.querySelector('.neural-stage');
 const bounds=hero.getBoundingClientRect(),panels=stack.getBoundingClientRect();
 const centerX=(panels.left+panels.right)/2-bounds.left,centerY=(panels.top+panels.bottom)/2-bounds.top;
 // Keep the existing responsive diameter; only align its centre to the cards.
 stage.style.setProperty('--earth-left',`${centerX-stage.offsetWidth/2}px`);
 stage.style.setProperty('--earth-top',`${centerY-stage.offsetHeight/2}px`);
}
positionField();
const fieldLayout=new ResizeObserver(()=>{positionField();field.resize();});fieldLayout.observe(document.querySelector('.hero-demo .scenario-stack'));
const cleanForm=setupForm(),motion=createChoreography(field,reduced);
const carousels=Object.fromEntries([...document.querySelectorAll('[data-carousel]')].map(el=>[el.dataset.carousel,createCarousel(el,reduced)]));
const supporting=createSupportingMotion(reduced),cleanGlow=setupWorkspaceGlow(document.querySelector('.tasks-workspace'),reduced);
const fieldTimer=setTimeout(loadField,250),fieldMode=()=>{if(!reduced.matches)loadField();};reduced.addEventListener('change',fieldMode);
const header=document.querySelector('.site-header'),progress=document.querySelector('.page-progress i');
function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;header.classList.toggle('is-scrolled',scrollY>40);}window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();
const cleanNavigation=setupAnchorNavigation(motion,reduced);
document.fonts.ready.then(()=>{if(!dead){positionField();field.resize();}});
const resize=()=>{positionField();field.resize();};window.addEventListener('resize',resize);
const menu=document.querySelector('.mobile-menu');menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.open=false));const keydown=e=>{if(e.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}};document.addEventListener('keydown',keydown);
function suspend(value){motion.suspend(value);Object.values(carousels).forEach(c=>c.suspend(value));supporting.suspend(value);}
const pagehide=e=>{suspend(true);if(!e.persisted){clearTimeout(fieldTimer);fieldLayout.disconnect();reduced.removeEventListener('change',fieldMode);motion.destroy();Object.values(carousels).forEach(c=>c.destroy());supporting.destroy();cleanNavigation();cleanGlow();field.dispose();cleanForm();window.removeEventListener('resize',resize);window.removeEventListener('scroll',updateScroll);document.removeEventListener('keydown',keydown);}};
const pageshow=e=>{if(e.persisted){suspend(false);positionField();field.resize();supporting.draw();updateScroll();}};window.addEventListener('pagehide',pagehide);window.addEventListener('pageshow',pageshow);
window.nimbusPreview={get field(){return field.diagnostics;},motion,carousels,supporting,reduced};
