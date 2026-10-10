// One anchor inset for native scrolling and Lenis: measured fixed header + 16px.
export function setupAnchorNavigation(motion,reduced){
 const root=document.documentElement,header=document.querySelector('.site-header');
 let pending=null,disposed=false,revision=0;
 const inset=()=>header.getBoundingClientRect().height+16;
 const measure=()=>root.style.setProperty('--anchor-inset',`${inset()}px`);
 const observer=new ResizeObserver(measure);observer.observe(header);measure();
 const targetFor=hash=>{try{return document.getElementById(decodeURIComponent(hash.slice(1)));}catch{return null;}};
 const destination=target=>Math.max(0,Math.min(target.getBoundingClientRect().top+scrollY-inset(),root.scrollHeight-innerHeight));
 function navigate(target,immediate=false){
  if(disposed)return;
  const run=++revision;clearTimeout(pending);measure();
  const settle=()=>{if(disposed||run!==revision)return;measure();const y=destination(target);if(Math.abs(scrollY-y)>.5){if(motion.lenis)motion.lenis.scrollTo(y,{immediate:true});else window.scrollTo({top:y,behavior:'instant'});}};
  // Numeric destination avoids Lenis adding CSS margins/padding a second time.
  const y=destination(target);
  if(motion.lenis&&!immediate&&!reduced.matches)motion.lenis.scrollTo(y,{onComplete:settle});
  else{if(motion.lenis)motion.lenis.scrollTo(y,{immediate:true});else window.scrollTo({top:y,behavior:'instant'});pending=setTimeout(settle,240);}
 }
 const click=e=>{
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const link=e.target.closest('a[href]');if(!link||link.hasAttribute('download')||link.target)return;
  const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search||!url.hash)return;
  const target=targetFor(url.hash);if(!target)return;e.preventDefault();
  if(location.hash!==url.hash)history.pushState(null,'',url.hash);
  navigate(target);
 };
 const hash=()=>{const target=targetFor(location.hash);if(target)navigate(target,true);};
 document.addEventListener('click',click);window.addEventListener('hashchange',hash);window.addEventListener('popstate',hash);
 document.fonts.ready.then(()=>{if(!disposed&&location.hash)requestAnimationFrame(hash);});
 return()=>{disposed=true;revision++;clearTimeout(pending);observer.disconnect();document.removeEventListener('click',click);window.removeEventListener('hashchange',hash);window.removeEventListener('popstate',hash);};
}
