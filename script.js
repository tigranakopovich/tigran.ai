
(()=>{const root=document.getElementById('tigran-story');if(!root)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)');const sessions=new Map();const options={pace:1};let stage=0;const $=(s,c=root)=>c.querySelector(s),$$=(s,c=root)=>Array.from(c.querySelectorAll(s));
function save() {}
function cancel(key){const s=sessions.get(key);if(!s)return;s.cancelled=true;(s.cleanups||[]).forEach(fn=>fn());s.animations.forEach(a=>a.cancel());s.timers.forEach(t=>{clearTimeout(t.id);t.resolve();});s.host.querySelectorAll('.is-lit').forEach(el=>el.classList.remove('is-lit'));sessions.delete(key);}
function delay(s,ms){return new Promise(resolve=>{const t={resolve};t.id=setTimeout(resolve,ms*options.pace);s.timers.push(t);});}
function animate(s,el,frames,ms,extra={}){if(!el||s.cancelled||reduced.matches)return;const a=el.animate(frames,{duration:ms*options.pace,easing:'cubic-bezier(.22,1,.36,1)',...extra});s.animations.push(a);return a;}
function light(s,el){if(el&&!s.cancelled){el.classList.add('is-lit');const t={resolve:()=>{}};t.id=setTimeout(()=>el.classList.remove('is-lit'),700*options.pace);s.timers.push(t);}}
async function choreograph(key,s){
 const host=s.host,phase=host.querySelector('[data-phase]');
 const settled=()=>phase.textContent=key==='hero'?'Результат сохранён':'Данные сохранены';
 s.cleanups=s.cleanups||[];s.cleanups.push(settled);
 const setPhase=text=>{if(!s.cancelled)phase.textContent=text;};
 const flash=(el,ms=800)=>animate(s,el,[{background:'#cce6d5',transform:'scale(1.02)'},{background:'transparent',transform:'scale(1)'}],ms);
 const fly=(source,target,label,ms=950,bend=26,record=false)=>{
  if(s.cancelled)return;
  const box=host.getBoundingClientRect(),a=source.getBoundingClientRect(),b=target.getBoundingClientRect();
  const token=document.createElement('span');token.className='flying-value'+(record?' flying-record':'');token.textContent=label;
  host.querySelector('.flight-layer').append(token);s.cleanups.push(()=>token.remove());
  const x0=a.left-box.left+a.width/2,y0=a.top-box.top+a.height/2,x1=b.left-box.left+b.width/2,y1=b.top-box.top+b.height/2;
  const frames=Array.from({length:31},(_,i)=>{const t=i/30,dx=x0+(x1-x0)*t,dy=y0+(y1-y0)*t-Math.sin(t*Math.PI)*bend;return{transform:'translate('+dx+'px,'+dy+'px) translate(-50%,-50%) scale('+(1-.06*t)+')',opacity:i===0||i===30?0:1,offset:t};});
  const animation=animate(s,token,frames,ms,{easing:'cubic-bezier(.45,0,.2,1)'});
  if(animation)animation.finished.then(()=>token.remove(),()=>token.remove());
 };
 if(key==='hero'){
  setPhase('Получить данные');light(s,host.querySelector('[data-step="0"]'));
  const fields=[['request','стоимость'],['document','Заявка.pdf'],['owner','Анна']];
  for(const [name,label] of fields){
   if(s.cancelled)return;const source=host.querySelector('[data-origin="'+name+'"]'),target=host.querySelector('[data-slot="'+name+'"]');
   flash(source,950);await delay(s,260);if(s.cancelled)return;
   fly(source,target,label,950,22);await delay(s,900);if(s.cancelled)return;flash(target,850);
  }
  if(s.cancelled)return;setPhase('Обработать');light(s,host.querySelector('[data-step="1"]'));
  const slots=host.querySelectorAll('.assembly-slot');slots.forEach((el,i)=>animate(s,el,[{transform:'translateY('+(8+i*3)+'px)',opacity:.65},{transform:'translateY(0)',opacity:1}],650,{delay:i*100*options.pace}));
  animate(s,host.querySelector('.scan-line'),[{transform:'translateX(-100%)',opacity:0},{opacity:1,offset:.15},{opacity:1,offset:.8},{transform:'translateX(550%)',opacity:0}],1000,{easing:'linear'});
  await delay(s,1100);if(s.cancelled)return;setPhase('Сохранить результат');light(s,host.querySelector('[data-step="2"]'));
  fly(host.querySelector('.assembly'),host.querySelector('[data-record]'),'№104 · Стоимость · Анна',1000,0,true);
  await delay(s,950);if(s.cancelled)return;
  animate(s,host.querySelector('.saved-record'),[{transform:'translateY(7px)',boxShadow:'0 0 0 2px #28765360'},{transform:'translateY(0)',boxShadow:'0 0 0 0 transparent'}],650);
  animate(s,host.querySelector('.save-badge'),[{transform:'scale(.75)',opacity:.4},{transform:'scale(1.08)',opacity:1,offset:.65},{transform:'scale(1)',opacity:1}],550);
  await delay(s,650);settled();
 }else{
  setPhase('Выделить имя и тему');
  const originName=host.querySelector('[data-origin="name"]'),originTopic=host.querySelector('[data-origin="topic"]');
  flash(originName,1100);flash(originTopic,1100);await delay(s,600);if(s.cancelled)return;
  setPhase('Имя → поле «Имя»');fly(originName,host.querySelector('[data-slot="name"]'),'Алексей',1100,28);
  await delay(s,1050);if(s.cancelled)return;flash(host.querySelector('[data-slot="name"]'),750);
  setPhase('Тема → поле «Тема»');fly(originTopic,host.querySelector('[data-slot="topic"]'),'Консультация',1100,28);
  await delay(s,1050);if(s.cancelled)return;flash(host.querySelector('[data-slot="topic"]'),750);
  animate(s,host.querySelector('.to'),[{transform:'translateY(6px)'},{transform:'translateY(0)'}],650);
  animate(s,host.querySelector('.save-badge'),[{transform:'scale(.7)',opacity:.3},{transform:'scale(1.08)',opacity:1,offset:.65},{transform:'scale(1)',opacity:1}],600);
  await delay(s,750);settled();
 }
}

async function run(key,manual=true){if(key.startsWith('task'))['task0','task1','task2'].forEach(cancel);cancel(key);const host=key==='work'?$('.work-canvas'):$('[data-demo="'+key+'"]');if(!host)return;const s={host,animations:[],timers:[],cancelled:false};sessions.set(key,s);const status=$('[data-status="'+key+'"]');if(manual)save(key);if(reduced.matches){if(status)status.textContent='Результат показан. Движение отключено.';sessions.delete(key);return;}
if(key==='hero'||key==='task0'){await choreograph(key,s);}
else if(key.startsWith('task')){const from=$('.from',host),to=$('.to',host);light(s,from);$$('.data-key',host).forEach(el=>animate(s,el,[{background:'transparent'},{background:'#c9e3d1',offset:.4},{background:'transparent'}],900));await delay(s,650);if(s.cancelled)return;const token=$('.transfer',host),bridge=$('.bridge',host).getBoundingClientRect(),source=from.getBoundingClientRect(),target=to.getBoundingClientRect();const start=source.left+source.width/2-(bridge.left+bridge.width/2),end=target.left+target.width/2-(bridge.left+bridge.width/2);animate(s,token,[{opacity:0,transform:'translate('+start+'px,0)'},{opacity:1,offset:.18},{opacity:1,offset:.82},{opacity:0,transform:'translate('+end+'px,0)'}],850);await delay(s,780);if(s.cancelled)return;light(s,to);for(const el of $$('.to .result',host)){animate(s,el,[{background:'#d1e7d8',transform:'translateY(7px)'},{background:'transparent',transform:'translateY(0)'}],650);await delay(s,260);}}
else if(key==='case'){light(s,$('.case-input',host));await delay(s,600);for(const el of $$('.case-output',host)){if(s.cancelled)return;light(s,el);animate(s,el,[{transform:'translateY(6px)'},{transform:'translateY(0)'}],650);await delay(s,450);}}
else if(key==='work'){const frame=$('[data-work="'+stage+'"]');const marks=$$('.work-token,.service,.check',frame);for(const el of marks){if(s.cancelled)return;animate(s,el,[{background:'#d1e7d8',transform:'translateY(4px)'},{background:'transparent',transform:'translateY(0)'}],620);await delay(s,340);}}
await Promise.allSettled(s.animations.map(a=>a.finished));if(!s.cancelled){(s.cleanups||[]).forEach(fn=>fn());if(status)status.textContent='Демонстрация завершена. Результат остаётся видимым.';sessions.delete(key);}}
function selectStage(value,manual=true){cancel('work');stage=value;$$('[data-stage]').forEach(el=>el.setAttribute('aria-pressed',String(+el.dataset.stage===stage)));$$('[data-work]').forEach(el=>el.hidden=+el.dataset.work!==stage);run('work',manual);}
$$('[data-run]').forEach(el=>el.addEventListener('click',()=>run(el.dataset.run)));$$('[data-stage]').forEach(el=>el.addEventListener('click',()=>selectStage(+el.dataset.stage)));
function orderTaskActions(){const narrow=matchMedia('(max-width:760px)').matches;$$('.task').forEach(task=>{const action=$('[data-run]',task),copy=task.firstElementChild;if(narrow)task.append(action);else copy.append(action);});}orderTaskActions();window.addEventListener('resize',()=>{Array.from(sessions.keys()).forEach(cancel);orderTaskActions();});const seen=new Set();const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{const key=e.target.dataset.demo;if(!e.isIntersecting){cancel(key);return;}if(!seen.has(key)){seen.add(key);if(key==='hero'||key==='case')run(key,false);}});},{threshold:.12});$$('[data-demo]').forEach(el=>observer.observe(el));document.addEventListener('visibilitychange',()=>{if(document.hidden)Array.from(sessions.keys()).forEach(cancel);});reduced.addEventListener('change',()=>Array.from(sessions.keys()).forEach(cancel));
const businessField=$('#ts-business'),contactLink=$('#ts-contact-button');
function updateTelegramDraft(){const business=businessField.value.trim();const message=business?`Здравствуйте, Тигран! Занимаюсь ${business}. Хочу понять, что можно автоматизировать в моём бизнесе. С чего начнём?`:'Здравствуйте, Тигран! Хочу понять, что можно автоматизировать в моём бизнесе. С чего начнём?';const link=new URL('https://t.me/tigran_ai');link.searchParams.set('text',message);contactLink.href=link.href;}
businessField.addEventListener('focus',()=>Array.from(sessions.keys()).forEach(cancel));businessField.addEventListener('input',updateTelegramDraft);contactLink.addEventListener('click',updateTelegramDraft);updateTelegramDraft();
const menu=$('.mobile-menu');menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>menu.open=false));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});

})();
