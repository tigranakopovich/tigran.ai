// Static storyboard only. No timeline, animation, timeout, or autoplay is connected.
const scene=document.querySelector('.sb-scene');
const captions=[
 'Исходное обращение о стоимости, Заявка.pdf и ответственный Анна. №104 — один и тот же пример во всех кадрах.',
 'Выделены три значения из источников: стоимость, Заявка.pdf, Анна. Остальные документы остаются контекстом.',
 'Каждое значение сопоставлено со своим полем: Запрос, Документ, Ответственный. Связи заканчиваются у портов рядом с полями.',
 'Из заполненных полей сформирована строка №104: Стоимость · Заявка.pdf · Анна. Подтверждения сохранения ещё нет.',
 'Полный результат: №104 · Стоимость · Заявка.pdf · Анна. Запись сохранена.'
];
const buttons=[...document.querySelectorAll('[data-select-frame]')];
function selectFrame(frame,updateUrl=true){
 scene.dataset.frame=frame;
 buttons.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.selectFrame)===frame)));
 document.querySelector('#sb-stage-label').textContent=`0${frame} / 05 · ${buttons[frame-1].textContent.slice(2).trim()}`;
 document.querySelector('#sb-frame-caption').textContent=`Кадр ${frame}/5. ${captions[frame-1]}`;
 // Early frames are review states. The no-JS and default page contains the full final result.
 scene.querySelectorAll('[data-value],.sb-field-check').forEach(e=>e.setAttribute('aria-hidden',String(frame<3)));
 scene.querySelectorAll('[data-result]').forEach(e=>e.setAttribute('aria-hidden',String(frame<4)));
 scene.querySelector('.sb-saved').setAttribute('aria-hidden',String(frame<5));
 if(updateUrl){const url=new URL(location);url.searchParams.set('frame',frame);history.replaceState(null,'',url);}
}
buttons.forEach(b=>b.addEventListener('click',()=>selectFrame(Number(b.dataset.selectFrame))));
const initial=Number(new URL(location).searchParams.get('frame'));selectFrame(initial>=1&&initial<=5&&Number.isInteger(initial)?initial:5,false);
function drawRoutes(){
 const base=scene.getBoundingClientRect(),svg=scene.querySelector('.sb-routes');
 svg.setAttribute('viewBox',`0 0 ${base.width} ${base.height}`);
 if(innerWidth<1024){
  const source=scene.querySelector('.sb-sources').getBoundingClientRect(),process=scene.querySelector('.sb-process').getBoundingClientRect();
  const x=source.left+source.width/2-base.left,y1=source.bottom-base.top,y2=process.top-base.top;
  svg.querySelector('[data-route="mobile"]').setAttribute('d',`M${x} ${y1}V${y2}`);
  const port=svg.querySelector('.sb-mobile-port');port.setAttribute('cx',x);port.setAttribute('cy',y2);return;
 }
 // One canonical curve per value. Future motion must follow these same paths,
 // appearing at the source port and arriving at the receiving port, never crossing text.
 for(const key of ['request','document','owner']){
  const source=scene.querySelector(`[data-source="${key}"]`),shell=source.closest('.window').getBoundingClientRect(),s=source.getBoundingClientRect(),port=scene.querySelector(`[data-field="${key}"] .sb-port`).getBoundingClientRect();
  const a={x:shell.right-base.left,y:s.top+s.height/2-base.top},b={x:port.left+port.width/2-base.left,y:port.top+port.height/2-base.top},gap=b.x-a.x;
  scene.querySelector(`[data-route="${key}"]`).setAttribute('d',`M${a.x} ${a.y}C${a.x+gap*.46} ${a.y} ${b.x-gap*.46} ${b.y} ${b.x} ${b.y}`);
 }
}
const observer=new ResizeObserver(drawRoutes);observer.observe(scene);document.fonts.ready.then(drawRoutes);drawRoutes();
const menu=document.querySelector('.mobile-menu');
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
