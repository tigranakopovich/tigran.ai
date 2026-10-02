export function setupForm(){
 const input=document.querySelector('#business'),link=document.querySelector('.contact-button');
 const update=()=>{const value=input.value.trim();const text=value?`Здравствуйте, Тигран! Занимаюсь ${value}. Хочу понять, что можно автоматизировать в моём бизнесе. С чего начнём?`:'Здравствуйте, Тигран! Хочу понять, что можно автоматизировать в моём бизнесе. С чего начнём?';const url=new URL('https://t.me/tigran_ai');url.searchParams.set('text',text);link.href=url.href;};
 input.addEventListener('input',update);link.addEventListener('click',update);update();
 return()=>{input.removeEventListener('input',update);link.removeEventListener('click',update);};
}
