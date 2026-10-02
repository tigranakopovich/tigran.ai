export const vertexShader=/* glsl */`
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
`;
export const fragmentShader=/* glsl */`
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
`;
