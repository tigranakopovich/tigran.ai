import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
gsap.registerPlugin(ScrollTrigger);
export function createChoreography(field,reduced){
 let lenis=null,context=null,intro=null,suspended=false,destroyed=false;
 const sections=[...document.querySelectorAll('main>section')];
 let fieldElapsed=0,heroVisible=true;
 const heroObserver=new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;},{threshold:0});heroObserver.observe(document.querySelector('#hero'));
 const tick=(seconds,deltaMs)=>{if(suspended||document.hidden||destroyed)return;lenis?.raf(seconds*1000);fieldElapsed+=deltaMs/1000;const mobile=innerWidth<=600;if(!mobile||fieldElapsed>=1/30){if(heroVisible)field.render(Math.min(fieldElapsed,.05));fieldElapsed=0;}};
 function stopActive(){gsap.ticker.remove(tick);lenis?.destroy();lenis=null;intro?.kill();intro=null;context?.revert();context=null;}
 function startActive(withIntro=false){if(reduced.matches||destroyed)return;
  lenis=new Lenis({autoRaf:false,smoothWheel:matchMedia('(pointer:fine)').matches,lerp:.085,anchors:{offset:-105}});lenis.on('scroll',ScrollTrigger.update);
  context=gsap.context(()=>{
   const state=i=>{field.setState(i);gsap.to('#neural-canvas',{opacity:i===0?(innerWidth<=600?.36:.6):.035,duration:.65,overwrite:true});};
   sections.forEach((section,i)=>ScrollTrigger.create({trigger:section,start:'top 52%',end:'bottom 52%',onEnter:()=>state(i),onEnterBack:()=>state(i)}));
   if(withIntro){intro=gsap.fromTo('#neural-canvas',{opacity:.18},{opacity:innerWidth<=600?.36:.6,duration:1.4,ease:'power2.out'});}
   // Prepare only blocks below the viewport: text in Hero and contact stays immediately visible.
   document.querySelectorAll('.task-story,.case-scene,.stage-card,.work-workspace').forEach(block=>{
    if(block.getBoundingClientRect().top<innerHeight)return;
    gsap.fromTo(block,{y:innerWidth<=600?14:24,opacity:.35},{y:0,opacity:1,duration:.65,ease:'power2.out',scrollTrigger:{trigger:block,start:'top 94%',once:true},clearProps:'transform,opacity'});
   });
  });
  gsap.ticker.lagSmoothing(0);gsap.ticker.add(tick);
 }
 const mode=()=>{stopActive();if(reduced.matches)field.render(0,true);else startActive();};reduced.addEventListener('change',mode);startActive(true);
 function suspend(value){suspended=value;field.suspend(value);if(value)intro?.pause();else intro?.resume();}
 const hidden=()=>suspend(document.hidden);document.addEventListener('visibilitychange',hidden);
 function destroy(){if(destroyed)return;destroyed=true;heroObserver.disconnect();stopActive();reduced.removeEventListener('change',mode);document.removeEventListener('visibilitychange',hidden);}
 return{destroy,suspend,get lenisEnabled(){return!!lenis;}};
}
