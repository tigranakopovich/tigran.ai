import {SceneController,createExclusiveTaskManager} from './scene-controller.js';
import {heroTimeline,taskTimeline,caseTimeline,workTimeline} from './timelines.js';
import {examples,workNames} from './data.js';
const $=(selector,root=document)=>root.querySelector(selector),$$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let selectedTask='lead',selectedWork=0,formFocused=false,manualHero=false,autoPasses=0;
function setWorkVisible(index){$$('.work-panel').forEach((p,i)=>{p.hidden=i!==index;p.setAttribute('aria-hidden',String(i!==index));});}
const heroRoot=$('[data-scene="hero"]'),caseRoot=$('[data-scene="case"]'),workRoot=$('[data-scene="work"]');
const hero=new SceneController(heroRoot,heroTimeline,()=>{$('#hero-status').textContent='Результат сохранён';});
const caseScene=new SceneController(caseRoot,caseTimeline);
const tasks=Object.fromEntries(Object.keys(examples).map(key=>[key,new SceneController($(`[data-task-scene="${key}"]`),(s,valid)=>taskTimeline(s,valid,key),()=>{})]));
const work=new SceneController(workRoot,(s,valid)=>workTimeline(s,valid,selectedWork),()=>setWorkVisible(selectedWork));
const transition=new SceneController(workRoot,async()=>{},()=>setWorkVisible(selectedWork));
const exclusive=createExclusiveTaskManager();const all=[hero,caseScene,work,transition,...Object.values(tasks)];
const pauseButton=$('#hero-pause');
heroRoot.addEventListener('scene-state',()=>{pauseButton.textContent=hero.state==='paused'?'Продолжить анимацию':'Остановить анимацию';pauseButton.setAttribute('aria-pressed',String(hero.state==='paused'));pauseButton.disabled=!['playing','paused'].includes(hero.state);});
pauseButton.disabled=true;
pauseButton.addEventListener('click',()=>hero.state==='paused'?hero.resume():hero.pause());
$('[data-replay="hero"]').addEventListener('click',()=>{manualHero=true;hero.replay();});
$$('[data-task]').forEach(button=>button.addEventListener('click',()=>{
 exclusive.settle();selectedTask=button.dataset.task;$$('[data-task]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 $$('[data-task-scene]').forEach(p=>{const chosen=p.dataset.taskScene===selectedTask;p.hidden=!chosen;p.setAttribute('aria-hidden',String(!chosen));});
 $('#task-announcement').textContent='Пример';
}));
$('#task-play').addEventListener('click',async()=>{const key=selectedTask;const done=await exclusive.play(tasks[key]);if(key===selectedTask&& (done||reduced.matches))$('#task-announcement').textContent='Результат готов';});
$$('[data-work]').forEach(button=>button.addEventListener('click',async()=>{
 workPlayed=true;const old=selectedWork;work.cancelAndSettle();transition.cancelAndSettle();selectedWork=Number(button.dataset.work);
 $$('[data-work]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 $('#work-status').textContent=workNames[selectedWork];
 if(reduced.matches){setWorkVisible(selectedWork);return;}
 const next=selectedWork;
 transition.sequence=async(s,valid)=>{
  setWorkVisible(old);await s.move($(`#work-${old}`),[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'}],120);if(!valid())return;
  setWorkVisible(next);await s.move($(`#work-${next}`),[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],120);
 };
 const done=await transition.play();if(done&&next===selectedWork)work.play();
}));
$('[data-replay="work"]').addEventListener('click',()=>{workPlayed=true;transition.cancelAndSettle();work.replay();});
const menu=$('.mobile-menu');$$('a',menu).forEach(link=>link.addEventListener('click',()=>{menu.open=false;if(link.hash){const target=$(link.hash);target.tabIndex=-1;target.focus({preventScroll:true});}}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;$('summary',menu).focus();}});
document.addEventListener('click',event=>{if(menu.open&&!menu.contains(event.target))menu.open=false;});
const business=$('#business'),contact=$('.contact-button');
function updateTelegramDraft(){const value=business.value.trim();const message=value?`Здравствуйте, Тигран! Занимаюсь ${value}. Хочу понять, что можно автоматизировать в моём бизнесе. С чего начнём?`:'Здравствуйте, Тигран! Хочу понять, что можно автоматизировать в моём бизнесе. С чего начнём?';const link=new URL('https://t.me/tigran_ai');link.searchParams.set('text',message);contact.href=link.href;}
business.addEventListener('input',updateTelegramDraft);contact.addEventListener('click',updateTelegramDraft);updateTelegramDraft();
business.addEventListener('focus',()=>{formFocused=true;all.forEach(s=>s.cancelAndSettle());});business.addEventListener('blur',()=>{formFocused=false;});
const visible=new Set();let casePlayed=false,workPlayed=false;
async function autoHero(){if(autoPasses>=2||manualHero||formFocused||document.hidden||reduced.matches||innerWidth<1024||!visible.has(heroRoot))return;autoPasses++;const done=await hero.play();if(done)autoHero();}
const observer=new IntersectionObserver(entries=>{
 entries.forEach(({target,isIntersecting})=>{
  if(isIntersecting){visible.add(target);if(target===heroRoot&&autoPasses===0)autoHero();if(target===caseRoot&&!casePlayed&&!reduced.matches&&!formFocused){casePlayed=true;caseScene.play();}if(target===workRoot&&!workPlayed&&!reduced.matches&&!formFocused){workPlayed=true;work.play();}}
  else{visible.delete(target);all.filter(s=>s.root===target).forEach(s=>s.cancelAndSettle());}
 });
},{threshold:.2});
[heroRoot,caseRoot,workRoot,...Object.values(tasks).map(s=>s.root)].forEach(root=>observer.observe(root));
document.addEventListener('visibilitychange',()=>{if(document.hidden)all.forEach(s=>s.cancelAndSettle());});
reduced.addEventListener('change',()=>all.forEach(s=>s.cancelAndSettle()));
function center(rect,base){return{x:rect.left-base.left+rect.width/2,y:rect.top-base.top+rect.height/2};}
function heroGeometry(){
 const base=heroRoot.getBoundingClientRect(),svg=$('.connectors',heroRoot),paths=$$('path',svg);svg.setAttribute('viewBox',`0 0 ${base.width} ${base.height}`);
 const box=selector=>{const el=$(selector,heroRoot),r=el.getBoundingClientRect(),m=new DOMMatrixReadOnly(getComputedStyle(el).transform);return {x:r.left-base.left-m.m41,y:r.top-base.top-m.m42,w:r.width,h:r.height};};
 const group=box('.field-group');const message=box('.source-message'),documents=box('.source-documents'),data=box('.source-data');
 const slots=['request','document','owner'].map(key=>center($(`[data-to="${key}"]`,heroRoot).getBoundingClientRect(),base));
 const left=box('.process-content').x+8,right=group.x+group.w+12;
 paths[0].setAttribute('d',`M${message.x+message.w} ${message.y+message.h*.6}H${left}V${group.y-12}H${slots[0].x}V${group.y}`);
 paths[1].setAttribute('d',`M${documents.x} ${documents.y+documents.h*.8}H${right}V${group.y-12}H${slots[1].x}V${group.y}`);
 paths[2].setAttribute('d',`M${data.x+data.w} ${data.y+data.h*.5}H${left}V${group.y+group.h+12}H${slots[2].x}V${group.y+group.h}`);
}
function caseGeometry(){const base=$('.case-inner').getBoundingClientRect(),svg=$('.case-connectors');svg.setAttribute('viewBox',`0 0 ${base.width} ${base.height}`);const source=$('.case-source').getBoundingClientRect();const a={x:source.right-base.left,y:source.top-base.top+source.height/2};['.case-listing','.case-sheet'].forEach((selector,i)=>{const r=$(selector).getBoundingClientRect(),b={x:r.left-base.left,y:r.top-base.top+r.height/2};$$('path',svg)[i].setAttribute('d',`M${a.x} ${a.y}H${a.x+(b.x-a.x)/2}V${b.y}H${b.x}`);});}
let frame;function queueGeometry(){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{heroGeometry();caseGeometry();});}
let knownSize=`${innerWidth}x${innerHeight}`;window.addEventListener('resize',()=>{const size=`${innerWidth}x${innerHeight}`;if(size!==knownSize){knownSize=size;all.forEach(s=>s.cancelAndSettle());}queueGeometry();});
const resize=new ResizeObserver(()=>queueGeometry());resize.observe(heroRoot);resize.observe(caseRoot);document.fonts.ready.then(queueGeometry);queueGeometry();
// Read-only handles for local lifecycle checks, not a visitor control or integration.
window.prototypeScenes={hero,caseScene,work,transition,tasks,all,visible,get autoPasses(){return autoPasses;}};
