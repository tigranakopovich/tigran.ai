import {transferValue} from './scene-controller.js';
import {heroValues,examples} from './data.js';
const $=(s,root)=>root.querySelector(s),$$=(s,root)=>[...root.querySelectorAll(s)];
const arrive=[{transform:'translateY(12px)',opacity:.8},{transform:'translateY(0)',opacity:1}];
const signal=(s,a,b,valid,ms)=>transferValue(s,a,b,'',valid,ms,true);
export async function heroTimeline(s,valid){
 const root=s.root;
 await Promise.all($$('.source-message,.source-documents,.source-data,.save-confirmation',root).map(el=>s.move(el,arrive,700)));if(!valid())return;
 await s.pulse($('[data-from="request"]',root),800);if(!valid())return;
 for(const key of ['request','document','owner']){
  await transferValue(s,$(`[data-from="${key}"]`,root),$(`[data-to="${key}"]`,root),heroValues[key],valid,1100);if(!valid())return;
 }
 const fields=$('.field-group',root);
 await Promise.all([
  ...$$('.field-group>div',root).map(el=>s.move(el,[{transform:'translateY(8px)'},{transform:'translateY(0)'}],1200)),
  s.move($('.scan',root),[{transform:'translateX(-100%)',opacity:0},{opacity:1,offset:.15},{opacity:1,offset:.8},{transform:'translateX(600%)',opacity:0}],1200)
 ]);if(!valid())return;
 await transferValue(s,fields,$('[data-to="record"]',root),heroValues.record,valid,1100);if(!valid())return;
 await Promise.all([s.move($('.save-confirmation',root),[{transform:'translateY(8px)'},{transform:'translateY(0)'}],900),s.pulse($('.saved-badge',root),900)]);if(!valid())return;
 await s.wait(1000);if(!valid())return;
 await s.wait(5000);
}
export async function taskTimeline(s,valid,key){
 const root=s.root,from=name=>$(`[data-from="${name}"]`,root),to=name=>$(`[data-to="${name}"]`,root);
 if(key==='lead'){
  await Promise.all([s.pulse(from('name'),600),s.pulse(from('topic'),600)]);if(!valid())return;
  for(const name of ['name','topic']){await transferValue(s,from(name),to(name),examples.lead.source[name],valid,1100);if(!valid())return;}
  await s.pulse($('.zone:last-child .mini-window',root),1000);
 }else if(key==='status'){
  await s.pulse(from('status'),800);if(!valid())return;
  await transferValue(s,from('id'),to('id'),'№104 · Готово',valid,1000);if(!valid())return;
  await Promise.all($$('.zone:last-child .bubble span',root).map(el=>s.move(el,[{transform:'translateY(6px)',opacity:.85},{transform:'translateY(0)',opacity:1}],1200)));if(!valid())return;
  await s.pulse($('.zone:last-child .bubble',root),1000);
 }else{
  await s.pulse($('.zone:first-child .mini-window',root),600);if(!valid())return;
  for(const name of ['company','service']){await transferValue(s,from(name),to(name),examples.document.source[name],valid,1000);if(!valid())return;}
  await Promise.all($$('.paper>div',root).map((el,i)=>s.move(el,[{transform:`translateY(${i===1?-8:8}px)`,opacity:.9},{transform:'translateY(0)',opacity:1}],1200)));if(!valid())return;
  await s.pulse($('.paper',root),800);
 }
}
export async function caseTimeline(s,valid){
 const root=s.root,source=$('.case-source',root),listing=$('.case-listing',root),sheet=$('.case-sheet',root);
 await s.pulse(source,600);if(!valid())return;
 await s.move(source,[{transform:'translateY(6px)'},{transform:'translateY(0)'}],1000);if(!valid())return;
 await Promise.all([signal(s,source,listing,valid,800),signal(s,source,sheet,valid,800)]);if(!valid())return;
 await s.pulse(listing,1000);if(!valid())return;
 await s.pulse($('tbody tr',sheet),800);if(!valid())return;
 await s.wait(800);
}
export async function workTimeline(s,valid,index){
 const root=s.root;
 if(index===0){
  const docs=$$('.review-doc',root),rows=$$('.review-map>div',root);
  for(const doc of docs){await s.move(doc,[{transform:'translateY(8px)',opacity:.9},{transform:'translateY(0)',opacity:1}],500);if(!valid())return;}
  await Promise.all(docs.map((doc,i)=>signal(s,doc,rows[i],valid,2000)));if(!valid())return;
  for(const row of rows){await s.pulse($('.icon',row),500);if(!valid())return;}
 }else if(index===1){
  const nodes=$$('.service-node',root);
  await Promise.all(nodes.map(el=>s.move(el,[{transform:'translateY(8px)',opacity:.85},{transform:'translateY(0)',opacity:1}],600)));if(!valid())return;
  for(let i=0;i<3;i++){await signal(s,nodes[i],nodes[i+1],valid,600);if(!valid())return;}
  await s.pulse($('.build-checks',root),800);if(!valid())return;
  await s.wait(800);
 }else{
  await s.pulse($('.support-check',root),1000);if(!valid())return;
  await s.pulse($('.support-correction',root),1000);if(!valid())return;
  await signal(s,$('.support-check',root),$('.support-correction',root),valid,1000);if(!valid())return;
  await s.wait(1000);
 }
}
