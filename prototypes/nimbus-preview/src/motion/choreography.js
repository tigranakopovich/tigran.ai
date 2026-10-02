import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
gsap.registerPlugin(ScrollTrigger);
export function createChoreography(field,reduced){
 let lenis=null,context=null,intro=null,signal=null,observer=null,suspended=false,destroyed=false,signalStarted=false;
 const sections=[...document.querySelectorAll('main>section')];
 const tick=(seconds,deltaMs)=>{if(suspended||document.hidden||destroyed)return;lenis?.raf(seconds*1000);field.render(Math.min(deltaMs/1000,.05));};
 function stopActive(){gsap.ticker.remove(tick);lenis?.destroy();lenis=null;observer?.disconnect();observer=null;signal?.kill();signal=null;intro?.kill();intro=null;context?.revert();context=null;gsap.set('.input-signal,.event-trace',{clearProps:'transform,opacity'});}
 function startActive(withIntro=false){if(reduced.matches||destroyed)return;
  lenis=new Lenis({autoRaf:false,smoothWheel:matchMedia('(pointer:fine)').matches,lerp:.085,anchors:{offset:-105}});lenis.on('scroll',ScrollTrigger.update);
  context=gsap.context(()=>{
   sections.forEach((section,i)=>ScrollTrigger.create({trigger:section,start:'top 52%',end:'bottom 52%',onEnter:()=>field.setState(i),onEnterBack:()=>field.setState(i)}));
   if(withIntro){const lines=[...document.querySelectorAll('.hero h1 .line-mask>span')];intro=gsap.timeline().fromTo('#neural-canvas',{opacity:.12},{opacity:.2,duration:1.4},0).fromTo(lines,{y:18,opacity:.8},{y:0,opacity:1,duration:1,stagger:.12,ease:'power3.out'},.2).fromTo('.field-label',{opacity:.3,y:6},{opacity:1,y:0,duration:1},.8).fromTo('.hero-atmosphere .input-signal',{opacity:.5},{opacity:1,duration:.9,stagger:.12},1.3);}
  });
  observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting){signal?.kill();signal=null;gsap.set('.input-signal,.event-trace',{clearProps:'transform,opacity'});return;}if(signalStarted||reduced.matches)return;signalStarted=true;signal=gsap.timeline({repeat:1,repeatDelay:3}).to('.signal-message',{x:18,opacity:.25,duration:1.2,ease:'power2.in'},1.4).to('.signal-message',{x:0,opacity:1,duration:.5},2.6).to('.signal-file',{x:14,opacity:.25,duration:1.1,ease:'power2.in'},3.1).to('.signal-file',{x:0,opacity:1,duration:.5},4.2).fromTo('.trace-in',{opacity:0},{opacity:.35,duration:.35,repeat:1,yoyo:true,repeatDelay:.5},3.0).fromTo('.trace-out',{opacity:0},{opacity:.35,duration:.35,repeat:1,yoyo:true,repeatDelay:.5},4.0).to({}, {duration:5.2},0);}),{threshold:.25});observer.observe(document.querySelector('.hero-atmosphere'));
  gsap.ticker.lagSmoothing(0);gsap.ticker.add(tick);
 }
 const mode=()=>{stopActive();if(reduced.matches)field.render(0,true);else startActive();};reduced.addEventListener('change',mode);startActive(true);
 function suspend(value){suspended=value;field.suspend(value);if(value){signal?.pause();intro?.pause();}else{signal?.resume();intro?.resume();}}
 const hidden=()=>suspend(document.hidden);document.addEventListener('visibilitychange',hidden);
 const focus=()=>{signal?.kill();signal=null;};document.querySelector('#business').addEventListener('focus',focus);
 function destroy(){if(destroyed)return;destroyed=true;stopActive();reduced.removeEventListener('change',mode);document.removeEventListener('visibilitychange',hidden);document.querySelector('#business').removeEventListener('focus',focus);}
 return{destroy,suspend,get lenisEnabled(){return!!lenis;}};
}
