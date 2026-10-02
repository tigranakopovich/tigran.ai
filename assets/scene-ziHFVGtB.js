import{Ut as e,W as t,Wt as n,a as r,i,in as a,q as o}from"./three-core-BsKnU1D5.js";import{t as s}from"./three-renderer-CfMEHx83.js";var c=`
attribute float aSeed;
attribute float aSize;
attribute float aTone;
uniform float uTime;
uniform float uAngle;
uniform float uScale;
uniform float uOffsetX;
uniform float uWave;
uniform float uZones;
uniform float uDpr;
uniform float uPointerActive;
uniform vec2 uPointer;
uniform vec2 uTilt;
varying float vLight;
varying float vTone;
varying float vDepth;
void main(){
 vec3 p=position;
 float breath=1.0+sin(uTime*.31)*.018;
 p*=breath+uWave*sin(p.y*3.5+uTime*.33+aSeed*6.28)*.016;
 float angle=uAngle+uTilt.x;
 float c=cos(angle),s=sin(angle);
 p=vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);
 c=cos(uTilt.y);s=sin(uTilt.y);p=vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);
 vec3 normal=normalize(p);
 float rim=pow(1.0-abs(normal.z),1.4);
 float directional=max(0.0,dot(normal,normalize(vec3(-.7,.9,1.0))));
 float bands=.5+.5*cos(length(position)*10.5);
 vLight=.24+rim*.95+directional*.32+bands*uZones*.11;
 vDepth=clamp((p.z+2.1)/4.2,.0,1.0);
 p*=uScale;p.x+=uOffsetX;p.y+=.02;
 vec4 mv=modelViewMatrix*vec4(p,1.0);
 vec4 clip=projectionMatrix*mv;
 vec2 ndc=clip.xy/clip.w;
 vec2 diff=ndc-uPointer;
 float influence=exp(-dot(diff,diff)*95.0)*uPointerActive;
 p.xy+=normalize(diff+vec2(.001))*influence*.11;
 mv=modelViewMatrix*vec4(p,1.0);
 gl_Position=projectionMatrix*mv;
 gl_PointSize=clamp(aSize*uDpr*(.74+vDepth*.53)*(5.6/-mv.z),.65,4.3);
 vTone=aTone;
}
`,l=`
uniform float uTime;
uniform float uExposure;
varying float vLight;
varying float vTone;
varying float vDepth;
void main(){
 float r=length(gl_PointCoord-.5);if(r>.5)discard;
 float core=1.0-smoothstep(.05,.5,r);
 vec3 silver=mix(vec3(.294,.333,.388),vec3(.957,.965,.973),vTone);
 if(vTone>.84)silver=mix(silver,vec3(.659,.737,.788),.24);
 float pulse=pow(max(0.0,sin(uTime*.27)),28.0)*.08;
 float alpha=core*(.35+vDepth*.35)*vLight*uExposure*1.6+pulse*core;
 gl_FragColor=vec4(silver,alpha);
}
`,u=[{x:1.13,scale:1,rotation:.036,wave:.55,opacity:1,zones:0},{x:1.76,scale:.96,rotation:.043,wave:.9,opacity:.8,zones:0},{x:1.52,scale:1.05,rotation:.028,wave:.35,opacity:1.25,zones:0},{x:1.64,scale:.98,rotation:.02,wave:.28,opacity:.85,zones:1},{x:1.36,scale:1.08,rotation:.014,wave:.15,opacity:.7,zones:.25}];function d(e){return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function f(f,p){let m=matchMedia(`(max-width:600px)`).matches?7e3:19e3,h={available:!1,count:m,dpr:0,frames:0,disposed:!1},g={...u[0]},_={...g},v=innerWidth,y=innerHeight,b=.12,x=0,S=!1,C=!1,w,T,E,D,O,k,A={x:0,y:0,active:0},j={x:0,y:0,active:0},M=matchMedia(`(pointer:coarse), (hover:none)`),N=new URL(location).searchParams.get(`webgl`)===`off`?null:f.getContext(`webgl2`,{alpha:!0,antialias:!1,powerPreference:`low-power`});if(!N)return{diagnostics:h,setState(){},render(){},resize(){},suspend(){},dispose(){h.disposed=!0}};try{w=new s({canvas:f,context:N,alpha:!0,antialias:!1,powerPreference:`low-power`}),w.setClearColor(527883,0),O=new t(44,v/y,.1,20),O.position.z=6,D=new e,T=new r;let u=d(1042026),p=new Float32Array(m*3),g=new Float32Array(m),_=new Float32Array(m),x=new Float32Array(m);for(let e=0;e<m;e++){let t=u()*2-1,n=u()*Math.PI*2,r=Math.sqrt(1-t*t),i=e<m*.78?1.91+u()*.09:Math.cbrt(u())*1.94;i*=1+.036*Math.sin(n*3+.6)+.022*Math.sin(n*7+t*4),p[e*3]=Math.cos(n)*r*i,p[e*3+1]=t*i*.97,p[e*3+2]=Math.sin(n)*r*i,g[e]=u(),_[e]=.85+u()*1.75,x[e]=.3+u()*.7}T.setAttribute(`position`,new i(p,3)),T.setAttribute(`aSeed`,new i(g,1)),T.setAttribute(`aSize`,new i(_,1)),T.setAttribute(`aTone`,new i(x,1)),k={uTime:{value:0},uAngle:{value:b},uScale:{value:1},uOffsetX:{value:1},uWave:{value:.55},uZones:{value:0},uDpr:{value:1},uPointerActive:{value:0},uPointer:{value:new a},uTilt:{value:new a},uExposure:{value:1}},E=new n({vertexShader:c,fragmentShader:l,uniforms:k,transparent:!0,depthWrite:!1,depthTest:!1,blending:2});let S=new o(T,E);S.frustumCulled=!1,D.add(S),h.available=!0,document.body.classList.add(`webgl-ready`)}catch{return w?.dispose(),{diagnostics:h,setState(){},render(){},resize(){},suspend(){},dispose(){}}}let P=e=>{M.matches||p.matches||(A.x=e.clientX/v*2-1,A.y=1-e.clientY/y*2,A.active=1)},F=()=>{A.active=0};window.addEventListener(`pointermove`,P,{passive:!0}),document.addEventListener(`pointerleave`,F);function I(){C||(v=innerWidth,y=innerHeight,w.setPixelRatio(Math.min(devicePixelRatio,innerWidth<=600?1:1.5)),w.setSize(v,y,!1),h.dpr=w.getPixelRatio(),k.uDpr.value=h.dpr,O.aspect=v/y,O.updateProjectionMatrix(),L(0,!0))}function L(e,t=!1){if(C||S||!t&&(document.hidden||p.matches))return;let n=Math.min(Math.max(e,0),.05),r=1-Math.exp(-n*3.5);_.x+=(g.x-_.x)*r,_.scale+=(g.scale-_.scale)*r,_.rotation+=(g.rotation-_.rotation)*r,_.wave+=(g.wave-_.wave)*r,_.opacity+=(g.opacity-_.opacity)*r,_.zones+=(g.zones-_.zones)*r,j.x+=(A.x-j.x)*r,j.y+=(A.y-j.y)*r,j.active+=(A.active-j.active)*r,p.matches||(x+=n,b+=n*_.rotation);let i=v/y;k.uTime.value=x,k.uAngle.value=b,k.uScale.value=_.scale*(i<.8?.77:1),k.uOffsetX.value=i*(i<.8?.46:_.x),k.uWave.value=p.matches?0:_.wave,k.uExposure.value=_.opacity,k.uZones.value=_.zones,k.uPointer.value.set(j.x,j.y),k.uPointerActive.value=p.matches||M.matches?0:j.active,k.uTilt.value.set(j.x*.025,j.y*.025),w.render(D,O),h.frames++}function R(e){p.matches||Object.assign(g,u[e])}function z(e){S=e,e||L(0,!0)}let B=e=>{e.preventDefault(),S=!0,document.body.classList.remove(`webgl-ready`)},V=()=>{S=!1,document.body.classList.add(`webgl-ready`),I()};f.addEventListener(`webglcontextlost`,B),f.addEventListener(`webglcontextrestored`,V);function H(){C||(C=!0,h.disposed=!0,window.removeEventListener(`pointermove`,P),document.removeEventListener(`pointerleave`,F),f.removeEventListener(`webglcontextlost`,B),f.removeEventListener(`webglcontextrestored`,V),T.dispose(),E.dispose(),w.dispose(),document.body.classList.remove(`webgl-ready`))}return I(),{diagnostics:h,setState:R,render:L,resize:I,suspend:z,dispose:H}}export{f as createNeuralField};