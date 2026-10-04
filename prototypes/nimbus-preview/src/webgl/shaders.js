export const vertexShader=/* glsl */`
attribute float aLand;
attribute float aSize;
attribute float aTone;
uniform float uAngle;
uniform float uDpr;
uniform vec2 uTilt;
varying float vLand;
varying float vTone;
varying float vLight;
varying float vFront;
varying vec2 vScreen;
void main(){
 vec3 p=position;
 float a=uAngle+uTilt.x,c=cos(a),s=sin(a);
 p=vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);
 c=cos(uTilt.y);s=sin(uTilt.y);p=vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);
 vec3 normal=normalize(p);vFront=normal.z;
 vLight=.36+.64*max(0.0,dot(normal,normalize(vec3(-.6,.8,1.0))));
 vLand=aLand;vTone=aTone;p.y+=.02;
 gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
 vScreen=gl_Position.xy/gl_Position.w;
 gl_PointSize=((aLand>1.5?1.90:1.32)+aSize*.22)*uDpr;
}
`;
export const fragmentShader=/* glsl */`
uniform float uExposure;
uniform vec4 uSourceRect;
uniform vec4 uResultRect;
varying float vLand;
varying float vTone;
varying float vLight;
varying float vFront;
varying vec2 vScreen;
float panel(vec4 rect){
 vec2 inside=smoothstep(rect.xy,rect.xy+vec2(.018),vScreen)*(1.0-smoothstep(rect.zw-vec2(.018),rect.zw,vScreen));
 return inside.x*inside.y;
}
void main(){
 float r=length(gl_PointCoord-.5);if(r>.5)discard;
 float core=1.0-smoothstep(.20,.5,r);
 float geography=vLand<.5?.012:(vLand>1.5?1.60:1.18);
 float front=mix(.004,1.0,smoothstep(.015,.20,vFront));
 float veil=1.0-.65*max(panel(uSourceRect),panel(uResultRect));
 vec3 silver=mix(vec3(.70,.76,.82),vec3(.94,.96,.98),vTone);
 float alpha=min(.92,core*geography*front*vLight*uExposure*veil);
 gl_FragColor=vec4(silver,alpha);
}
`;
