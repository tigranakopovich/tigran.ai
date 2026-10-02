// One lifecycle for every timeline. Cancel resolves pending work and removes all clones.
export class SceneController {
  constructor(root, sequence, renderStatic = () => {}) {
    this.root=root; this.sequence=sequence; this.renderStatic=renderStatic;
    this.state='idle'; this.animations=new Set(); this.waits=new Set(); this.transients=new Set(); this.runId=0;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    this.onReduced=()=>this.cancelAndSettle(); this.reduced.addEventListener('change',this.onReduced);
    this.renderStatic(); this.setState('idle');
  }
  setState(state) { this.state=state;this.root.dataset.state=state;this.root.dispatchEvent(new CustomEvent('scene-state',{detail:state})); }
  async play() {
    this.cancelAndSettle();
    if(this.reduced.matches||document.hidden) return false;
    const id=++this.runId;this.setState('playing');
    const valid=()=>id===this.runId;
    try {
      await this.sequence(this,valid);
      if(!valid()) return false;
      await Promise.allSettled([...this.animations].map(a=>a.finished));
      if(!valid()) return false;
      this.cancelAndSettle(); return true;
    } catch(error) { if(valid()){this.cancelAndSettle();console.error(error);}return false; }
  }
  replay() { return this.play(); }
  animate(element,frames,timing) {
    if(!element||this.reduced.matches||!['playing','paused'].includes(this.state)) return null;
    const a=element.animate(frames,{easing:'cubic-bezier(.22,1,.36,1)',...timing});
    this.animations.add(a);if(this.state==='paused')a.pause();
    a.finished.then(()=>this.animations.delete(a),()=>this.animations.delete(a));return a;
  }
  wait(ms) {
    return new Promise(resolve=>{
      const task={resolve,remaining:ms,started:performance.now(),timer:null};
      task.finish=()=>{this.waits.delete(task);resolve();};this.waits.add(task);
      if(this.state==='playing')task.timer=setTimeout(task.finish,ms);
    });
  }
  async move(element,frames,ms) { const a=this.animate(element,frames,{duration:ms}); if(a)await a.finished.catch(()=>{}); }
  async pulse(target,ms=600) {
    if(!target) return;
    const base=this.root.getBoundingClientRect(),rect=target.getBoundingClientRect();
    const node=document.createElement('i');node.className='accent-overlay';node.setAttribute('aria-hidden','true');
    Object.assign(node.style,{left:`${rect.left-base.left}px`,top:`${rect.top-base.top}px`,width:`${rect.width}px`,height:`${rect.height}px`});
    this.root.querySelector('[data-flight-layer]').append(node);this.transients.add(node);
    await this.move(node,[{opacity:0},{opacity:1,offset:.3},{opacity:1,offset:.65},{opacity:0}],ms);
    node.remove();this.transients.delete(node);
  }
  pause() {
    if(this.state!=='playing')return;this.setState('paused');this.animations.forEach(a=>a.pause());
    this.waits.forEach(t=>{clearTimeout(t.timer);t.timer=null;t.remaining=Math.max(0,t.remaining-(performance.now()-t.started));});
  }
  resume() {
    if(this.state!=='paused'||this.reduced.matches||document.hidden)return;this.setState('playing');this.animations.forEach(a=>a.play());
    this.waits.forEach(t=>{t.started=performance.now();t.timer=setTimeout(t.finish,t.remaining);});
  }
  cancelAndSettle() {
    ++this.runId;this.animations.forEach(a=>a.cancel());this.animations.clear();
    this.waits.forEach(t=>{clearTimeout(t.timer);t.resolve();});this.waits.clear();
    this.transients.forEach(n=>n.remove());this.transients.clear();this.renderStatic();this.setState('settled');
  }
  destroy() {this.cancelAndSettle();this.reduced.removeEventListener('change',this.onReduced);}
}

export async function transferValue(scene,source,target,value,valid,ms=1100,signal=false) {
  if(!valid()||!source||!target)return;
  const root=scene.root.getBoundingClientRect(),from=source.getBoundingClientRect(),to=target.getBoundingClientRect();
  const center=r=>({x:r.left-root.left+r.width/2,y:r.top-root.top+r.height/2});
  const a=center(from),b=center(to),control={x:(a.x+b.x)/2,y:(a.y+b.y)/2-Math.min(56,Math.hypot(b.x-a.x,b.y-a.y)*.2)};
  const node=document.createElement('span');node.className=signal?'demo-flight demo-signal':'demo-flight';node.textContent=value;node.dataset.flightValue=value;node.setAttribute('aria-hidden','true');
  scene.root.querySelector('[data-flight-layer]').append(node);scene.transients.add(node);
  const frames=Array.from({length:31},(_,i)=>{
    const t=i/30,u=1-t;const x=u*u*a.x+2*u*t*control.x+t*t*b.x,y=u*u*a.y+2*u*t*control.y+t*t*b.y;
    return {transform:`translate(${x}px,${y}px) translate(-50%,-50%)`,opacity:i===0||i===30?0:1,offset:t};
  });
  const animation=scene.animate(node,frames,{duration:ms,easing:'cubic-bezier(.45,0,.2,1)'});
  if(animation)await animation.finished.catch(()=>{});
  node.remove();scene.transients.delete(node);
}
export function createExclusiveTaskManager() {
  let active=null;
  return {play(scene){active?.cancelAndSettle();active=scene;return scene.play();},settle(){active?.cancelAndSettle();active=null;}};
}
