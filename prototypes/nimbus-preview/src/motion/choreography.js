import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
gsap.registerPlugin(ScrollTrigger);
export function createChoreography(field,reduced){
 let lenis=null,context=null,suspended=false,destroyed=false,elapsed=0,heroVisible=true;
 const hero=document.querySelector('#hero');
 const observer=new IntersectionObserver(entries=>heroVisible=entries[0].isIntersecting,{threshold:0});observer.observe(hero);
 const tick=(seconds,deltaMs)=>{if(suspended||document.hidden||destroyed)return;lenis?.raf(seconds*1000);elapsed+=deltaMs/1000;if(innerWidth>600||elapsed>=1/30){if(heroVisible)field.render(Math.min(elapsed,.05));elapsed=0;}};
 const stop=()=>{gsap.ticker.remove(tick);lenis?.destroy();lenis=null;context?.revert();context=null;};
 function start(){if(reduced.matches||destroyed)return;
  lenis=new Lenis({autoRaf:false,smoothWheel:matchMedia('(pointer:fine)').matches,wheelMultiplier:matchMedia('(pointer:fine)').matches?.8:1,lerp:matchMedia('(pointer:fine)').matches?.075:.085,anchors:false});lenis.on('scroll',ScrollTrigger.update);
  context=gsap.context(()=>{
   const mm=gsap.matchMedia();mm.add('(min-width:901px)',()=>{const lines=hero.querySelectorAll('h1>span'),amount=innerWidth<1200?14:24;const tl=gsap.timeline({scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});tl.to(lines[0],{x:-amount,ease:'none'},0).to(lines[1],{x:amount,ease:'none'},0).to(lines[2],{y:12,ease:'none'},0);});
   document.querySelectorAll('.section-heading,.tasks-workspace,.case-copy,.case-showcase').forEach(block=>{
    if(block.dataset.entered==='true'||block.getBoundingClientRect().top<innerHeight){block.dataset.entered='true';return;}
    gsap.fromTo(block,{y:innerWidth<=600?10:20,opacity:.65},{y:0,opacity:1,duration:innerWidth<=600?.45:.65,ease:'power2.out',clearProps:'transform,opacity',scrollTrigger:{trigger:block,start:'top 97%',once:true,onEnter:()=>block.dataset.entered='true'}});
   });
   const stages=[...document.querySelectorAll('.stage')];
   if(innerWidth>900){
    if(document.querySelector('.stages').getBoundingClientRect().top>=innerHeight&&!stages.every(n=>n.dataset.entered==='true'))
     gsap.fromTo(stages,{y:14,opacity:.65},{y:0,opacity:1,duration:.55,stagger:.25,ease:'power2.out',clearProps:'transform,opacity',scrollTrigger:{trigger:'.stages',start:'top 95%',once:true,onEnter:()=>stages.forEach(n=>n.dataset.entered='true')}});
   }else stages.forEach(block=>{if(block.dataset.entered==='true'||block.getBoundingClientRect().top<innerHeight)return;gsap.fromTo(block,{y:8,opacity:.65},{y:0,opacity:1,duration:.45,ease:'power2.out',clearProps:'transform,opacity',scrollTrigger:{trigger:block,start:'top 97%',once:true,onEnter:()=>block.dataset.entered='true'}});});
  });gsap.ticker.lagSmoothing(0);gsap.ticker.add(tick);
 }
 const mode=()=>{stop();if(reduced.matches)field.render(0,true);else start();};reduced.addEventListener('change',mode);start();
 const hidden=()=>suspend(document.hidden);document.addEventListener('visibilitychange',hidden);
 function suspend(value){suspended=value;field.suspend(value);}
 return {suspend,get lenis(){return lenis;},get lenisEnabled(){return!!lenis;},destroy(){destroyed=true;observer.disconnect();stop();reduced.removeEventListener('change',mode);document.removeEventListener('visibilitychange',hidden);}};
}

