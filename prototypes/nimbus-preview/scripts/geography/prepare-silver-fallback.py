from pathlib import Path
from PIL import Image
import math,json
root=Path(__file__).resolve().parents[2]
data=json.loads((root/'src/webgl/land-mask.json').read_text())
def land(u,v):
 u%=data['width'];row=data['rows'][max(0,min(data['height']-1,v))]
 for a,b in zip(row[::2],row[1::2]):
  if u<a:return False
  if u<b:return True
 return False
coast=[]
for v,row in enumerate(data['rows']):
 for a,b in zip(row[::2],row[1::2]):
  coast.extend([(a+.5,v+.5),(b-.5,v+.5)])
  for u in range(a+2,b-2,4):
   if not land(u,v-1) or not land(u,v+1):coast.append((u+.5,v+.5))
seed=1042026
def random():
 global seed
 seed=(seed+0x6D2B79F5)&0xffffffff;t=((seed^(seed>>15))*(1|seed))&0xffffffff
 t=(t^((t+(((t^(t>>7))*(61|t))&0xffffffff))&0xffffffff))&0xffffffff
 return ((t^(t>>14))&0xffffffff)/4294967296
# Same allocation, seed, sphere and orthographic camera as the WebGL scene.
size=806;im=Image.new('RGBA',(size,size));pix=im.load();angle=math.radians(-8);tilt=math.radians(-8)
for i in range(19000):
 if i<5700:
  u,v=coast[int(((i*.61803398875)%1)*len(coast))];lon=u/1024*math.tau-math.pi;lat=math.pi/2-v/512*math.pi;kind=2
 else:
  is_land=i<18050
  while True:
   lon=random()*math.tau-math.pi;lat=math.asin(random()*2-1);u=int((lon+math.pi)/math.tau*1024);v=int((math.pi/2-lat)/math.pi*512)
   if land(u,v)==is_land:break
  kind=1 if is_land else 0
 point_size=random();tone=random();x=math.sin(lon)*math.cos(lat);y=math.sin(lat);z=math.cos(lon)*math.cos(lat)
 x,z=math.cos(angle)*x+math.sin(angle)*z,-math.sin(angle)*x+math.cos(angle)*z
 y,z=math.cos(tilt)*y-math.sin(tilt)*z,math.sin(tilt)*y+math.cos(tilt)*z
 if z<=0:continue
 light=.36+.64*max(0,(-.6*x+.8*y+z)/math.sqrt(2));front=max(0,min(1,(z-.015)/.185));front=front*front*(3-2*front)
 alpha=(1.60 if kind==2 else 1.18 if kind==1 else .012)*(.004+.996*front)*light*1.08
 px=size/2+x*1.955/2.39*size/2;py=size/2-(y*1.955+.02)/2.39*size/2
 diameter=(1.90 if kind==2 else 1.32)+point_size*.22
 for iy in range(int(py-diameter/2),int(py+diameter/2)+1):
  for ix in range(int(px-diameter/2),int(px+diameter/2)+1):
   if not(0<=ix<size and 0<=iy<size):continue
   r=math.hypot(ix+.5-px,iy+.5-py)/diameter
   if r>.5:continue
   edge=max(0,min(1,(r-.20)/.30));core=1-edge*edge*(3-2*edge);a=min(.92,core*alpha)
   rgb=tuple(int((lo+(hi-lo)*tone)*255) for lo,hi in zip([.70,.76,.82],[.94,.96,.98]));prev=pix[ix,iy]
   pix[ix,iy]=(*rgb,min(255,prev[3]+int(a*255)))
# Full square canvas, already matching the live WebGL scale; CSS inset0.
im.save(root/'public/earth/earth-fallback.webp','WEBP',lossless=True,method=6)
print('silver fallback bytes',(root/'public/earth/earth-fallback.webp').stat().st_size)
