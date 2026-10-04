import {gsap} from 'gsap';
import copy from '../data/examples.json';

// Text is split once into meaningful groups; opacity never changes its geometry
// or semantic content. There is no per-letter live announcement or frame timer.
function fragments(node){
 const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT),texts=[];
 while(walker.nextNode())texts.push(walker.currentNode);
 texts.forEach(text=>{const words=text.textContent.match(/\S+\s*|\s+/g)||[],groups=[];let group='';words.forEach(word=>{if(group.length+word.length>30&&group){groups.push(group);group='';}group+=word;});if(group)groups.push(group);const fragment=document.createDocumentFragment();groups.forEach(value=>{const span=document.createElement('span');span.className='value-fragment';span.textContent=value;fragment.append(span);});text.replaceWith(fragment);});
 return [...node.querySelectorAll('.value-fragment')];
}
export function createCarousel(host,reduced){
 const kind=host.dataset.carousel,items=copy[kind].scenarios,timing=copy.motion[kind],cycle=timing.cycleMs/1000;
 const panels=[...host.querySelectorAll('.scenario')],buttons=[...host.querySelectorAll('[data-select]')],pauseButton=host.querySelector('[data-pause]'),bar=host.querySelector('.cycle-progress i');
 const values=panels.map(p=>({source:[...p.querySelectorAll('.source-card [data-value]')].flatMap(fragments),result:[...p.querySelectorAll('.result-card [data-value]')].flatMap(fragments)}));
 const state={selected:0,phase:'result',userPaused:false,interactionHeld:false,visible:false,hidden:document.hidden,reduced:reduced.matches,completedCycles:0,runId:0,progress:1};
 let sequence=null,deadline=null,hover=false,focus=false,suspended=false,disposed=false,finished=true;
 const listeners=[],fine=matchMedia('(hover:hover) and (pointer:fine)');
 const bind=(el,type,fn)=>{if(!el)return;el.addEventListener(type,fn);listeners.push(()=>el.removeEventListener(type,fn));};
 const canRun=()=>state.visible&&!state.hidden&&!state.reduced&&!suspended&&!disposed;
 const canAdvance=()=>canRun()&&!state.userPaused&&!state.interactionHeld;
 function stopDeadline(){deadline?.kill();deadline=null;}
 function full(){state.phase='result';state.progress=1;finished=true;panels.forEach(p=>{gsap.set(p,{clearProps:'opacity'});gsap.set(p.querySelectorAll('.value-fragment,.result-footer'),{clearProps:'opacity'});gsap.set(p.querySelector(kind==='hero'?'.hero-transfer-arrow':'.route-signal'),{clearProps:'transform,opacity'});});if(bar)gsap.set(bar,{scaleX:1});}
 function cancel(){state.runId++;sequence?.kill();sequence=null;stopDeadline();full();}
 function controls(){const stopped=finished&&state.userPaused;pauseButton.setAttribute('aria-label',stopped?copy.controls.resume:copy.controls.pause);pauseButton.setAttribute('aria-pressed',String(stopped));if(kind==='hero')pauseButton.dataset.stopped=String(stopped);else pauseButton.textContent=stopped?'Продолжить':'Остановить';}
 function advance(){if(!canAdvance()||!finished)return;if(state.selected===items.length-1)state.completedCycles++;select((state.selected+1)%items.length,false);}
 function resumeAdvance(){stopDeadline();if(canAdvance()&&finished)deadline=gsap.delayedCall(kind==='hero'?1.5:5,advance);}
 function fill(timeline,nodes,start,duration){if(!nodes.length)return;const actual=kind==='hero'?duration:Math.min(duration,Math.max(.35,nodes.length*.38));timeline.to(nodes,{opacity:1,duration:.14,stagger:{amount:Math.max(0,actual-.14)},ease:'none'},start);}
 function demonstrate(){
  if(!canRun()){full();return;}
  const panel=panels[state.selected],content=values[state.selected],signal=panel.querySelector(kind==='hero'?'.hero-transfer-arrow':'.route-signal'),footer=panel.querySelector('.result-footer'),run=state.runId;
  const sourceDuration=timing.sourceMs/1000,transfer=timing.processMs/1000,resultDuration=timing.resultMs/1000,resultStart=sourceDuration+transfer;
  finished=false;state.phase='source';state.progress=0;gsap.set([...content.source,...content.result,footer],{opacity:0});if(bar)gsap.set(bar,{scaleX:0});
  if(kind==='hero')gsap.set(signal,{y:-8,opacity:0});
  sequence=gsap.timeline({onComplete:()=>{if(run!==state.runId)return;sequence=null;full();controls();advance();}});
  sequence.fromTo(panel,{opacity:.6},{opacity:1,duration:.25,ease:'power2.out'},0);fill(sequence,content.source,0,sourceDuration);
  sequence.call(()=>{state.phase='process';},[],sourceDuration);
  if(kind==='hero')sequence.to(signal,{opacity:1,duration:transfer*.25,ease:'power1.out'},sourceDuration).to(signal,{y:0,duration:transfer,ease:'power2.inOut'},sourceDuration);
  else sequence.fromTo(signal,{x:-9,opacity:0},{x:9,opacity:1,duration:transfer*.65,ease:'power2.inOut'},sourceDuration).to(signal,{opacity:0,duration:transfer*.35},sourceDuration+transfer*.65);
  sequence.call(()=>{state.phase='filling';},[],resultStart);
  fill(sequence,content.result,resultStart,resultDuration);
  const resultEnd=resultStart+(kind==='hero'?resultDuration:Math.min(resultDuration,Math.max(.35,content.result.length*.38)));
  sequence.to(footer,{opacity:1,duration:.2},resultEnd).call(()=>{state.phase='reading';},[],resultEnd+.2);
  controls();sequence.to(state,{progress:1,duration:cycle,ease:'none',onUpdate:()=>{if(bar)gsap.set(bar,{scaleX:state.progress});}},0);
 }
 function select(index,manual=true){cancel();state.selected=(index+items.length)%items.length;if(manual)state.userPaused=true;panels.forEach((p,i)=>{p.hidden=i!==state.selected;p.inert=i!==state.selected;p.setAttribute('aria-hidden',String(i!==state.selected));});buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===state.selected)));controls();if(manual)host.querySelector('.demo-announcement').textContent=items[state.selected].tab;demonstrate();}
 function pause(){const paused=!finished||!state.userPaused;cancel();state.userPaused=paused;controls();if(!paused)demonstrate();}
 function hold(){const held=hover||focus;if(state.interactionHeld===held)return;state.interactionHeld=held;if(held)stopDeadline();else resumeAdvance();}
 buttons.forEach((b,i)=>bind(b,'click',()=>select(i)));bind(host.querySelector('[data-replay]'),'click',()=>select(state.selected));bind(pauseButton,'click',pause);
 bind(host,'pointerenter',e=>{if(fine.matches&&e.pointerType!=='touch'){hover=true;hold();}});bind(host,'pointerleave',()=>{hover=false;hold();});bind(host,'focusin',()=>{focus=true;hold();});bind(host,'focusout',()=>queueMicrotask(()=>{if(disposed)return;focus=host.contains(document.activeElement);hold();}));
 const observer=new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;if(state.visible===visible)return;state.visible=visible;cancel();if(visible&&!state.userPaused)demonstrate();},{threshold:.08});observer.observe(host);
 const hidden=()=>{state.hidden=document.hidden;cancel();if(!state.hidden&&!state.userPaused)demonstrate();};const mode=()=>{state.reduced=reduced.matches;cancel();controls();if(!state.reduced&&!state.userPaused)demonstrate();};const resize=()=>{cancel();resumeAdvance();};document.addEventListener('visibilitychange',hidden);reduced.addEventListener('change',mode);window.addEventListener('resize',resize);bind(document.querySelector('#business'),'focus',cancel);controls();
 return {state,select,pause,cancel,suspend(value){suspended=value;cancel();if(!value&&!state.userPaused)demonstrate();},destroy(){disposed=true;cancel();observer.disconnect();listeners.forEach(f=>f());document.removeEventListener('visibilitychange',hidden);reduced.removeEventListener('change',mode);window.removeEventListener('resize',resize);}};
}
export function setupWorkspaceGlow(host,reduced){
 const fine=matchMedia('(hover:hover) and (pointer:fine)');let rect=null;
 const enter=()=>{if(!fine.matches||reduced.matches)return;rect=host.getBoundingClientRect();host.classList.add('glow-active');};
 const move=e=>{if(!rect||!fine.matches||reduced.matches)return;host.style.setProperty('--glow-x',`${e.clientX-rect.left}px`);host.style.setProperty('--glow-y',`${e.clientY-rect.top}px`);};
 const leave=()=>{rect=null;host.classList.remove('glow-active');};const refresh=()=>{if(rect)rect=host.getBoundingClientRect();};
 host.addEventListener('pointerenter',enter);host.addEventListener('pointermove',move);host.addEventListener('pointerleave',leave);window.addEventListener('scroll',refresh,{passive:true});window.addEventListener('resize',refresh);reduced.addEventListener('change',leave);
 return()=>{leave();host.removeEventListener('pointerenter',enter);host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);window.removeEventListener('scroll',refresh);window.removeEventListener('resize',refresh);reduced.removeEventListener('change',leave);};
}
