from pathlib import Path
from PIL import Image,ImageDraw
import struct,zipfile,json,math,hashlib
root=Path(__file__).resolve().parents[2]
folder=root/'scripts/geography'; raw=(folder/'ne_110m_land.zip').read_bytes()
with zipfile.ZipFile(folder/'ne_110m_land.zip') as z:
 shp=z.read('ne_110m_land.shp'); version=z.read('ne_110m_land.VERSION.txt').decode().strip() if 'ne_110m_land.VERSION.txt' in z.namelist() else '4.0.0'
mask=Image.new('L',(1024,512));draw=ImageDraw.Draw(mask);offset=100;rings=0
while offset<len(shp):
 _,words=struct.unpack_from('>ii',shp,offset);record=shp[offset+8:offset+8+words*2];offset+=8+words*2
 if struct.unpack_from('<i',record)[0]!=5:continue
 parts,points=struct.unpack_from('<ii',record,36);starts=struct.unpack_from('<'+'i'*parts,record,44);coords=struct.unpack_from('<'+'d'*(points*2),record,44+parts*4)
 for a,b in zip(starts,(*starts[1:],points)):
  polygon=[((coords[i*2]+180)/360*1024,(90-coords[i*2+1])/180*512) for i in range(a,b)]
  # Natural Earth land rings use clockwise outer shells, counterclockwise holes.
  area=sum(coords[i*2]*coords[(a+(i-a+1)%(b-a))*2+1]-coords[(a+(i-a+1)%(b-a))*2]*coords[i*2+1] for i in range(a,b))
  draw.polygon(polygon,fill=255 if area<0 else 0);rings+=1
asset=root/'public/earth';mask.save(asset/'natural-earth-land-mask.png',optimize=True)
rows=[]
for y in range(512):
 row=[];active=False
 for x in range(1024):
  land=mask.getpixel((x,y))>0
  if land!=active:row.append(x);active=land
 if active:row.append(1024)
 rows.append(row)
(root/'src/webgl/land-mask.json').write_text(json.dumps({'width':1024,'height':512,'rows':rows},separators=(',',':')))
# Static orthographic Earth at longitude25/latitude12, from the very same mask.
size=720;im=Image.new('RGBA',(size,size));pixels=im.load();lat0=math.radians(12);lon0=math.radians(25)
for y in range(size):
 for x in range(size):
  xx=(x-size/2)/(size*.485);yy=(size/2-y)/(size*.485);r2=xx*xx+yy*yy
  if r2>1:continue
  zz=math.sqrt(1-r2);lat=math.asin(yy*math.cos(lat0)+zz*math.sin(lat0));lon=lon0+math.atan2(xx,zz*math.cos(lat0)-yy*math.sin(lat0))
  u=int(((math.degrees(lon)+180)%360)/360*1024);v=min(511,max(0,int((90-math.degrees(lat))/180*512)))
  rim=(1-zz)**3;alpha=int(32+rim*70);pixels[x,y]=(58,76,98,alpha)
  if (x%4==0 and y%4==0):
   land=mask.getpixel((u,v))>0;strength=(150 if land else 9)*(0.6+zz*.4)+rim*70;
   if land:
    for dx,dy in [(0,0),(1,0),(0,1),(1,1)]:
     if x+dx<size and y+dy<size:pixels[x+dx,y+dy]=(210,226,241,min(240,int(strength*1.4)))
im.save(asset/'earth-fallback.webp','WEBP',lossless=True,method=6)
(folder/'SOURCE.md').write_text(f'''# Earth geography\n\nNatural Earth physical land, 1:110m, version {version}.\nDownloaded 2026-10-04 from https://naciscdn.org/naturalearth/110m/physical/ne_110m_land.zip\nCatalogue: https://www.naturalearthdata.com/downloads/110m-physical-vectors/\nTerms: https://www.naturalearthdata.com/about/terms-of-use/ (public domain).\nSHA256 original archive: {hashlib.sha256(raw).hexdigest()}\n\nOriginal archive preserved here. prepare-earth.py parses polygon shapefile using Python stdlib/Pillow already available (no installed dependencies).\nOutputs: public/earth/natural-earth-land-mask.png (1024x512 equirectangular), src/webgl/land-mask.json (same mask as row intervals, lazy-loaded in scene chunk), public/earth/earth-fallback.webp (orthographic25E/12N).\nSeeded positions/count remain unchanged. Land membership assigned once at scene creation; no runtime requests to geography services or per-frame mask computations.\n''')
print('rings',rings,'mask',mask.getbbox(),'rows bytes', (root/'src/webgl/land-mask.json').stat().st_size,'fallback', (asset/'earth-fallback.webp').stat().st_size)
