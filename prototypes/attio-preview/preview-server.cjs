const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const project=path.resolve(__dirname,'../..');
const allowed=new Map([
 ['/',[path.join(__dirname,'index.html'),'text/html; charset=utf-8']],
 ...['hero-storyboard.html','hero-storyboard.css','hero-storyboard.js','index.html','styles.css','app.js','data.js','scene-controller.js','timelines.js'].map(name=>['/'+name,[path.join(__dirname,name),name.endsWith('.css')?'text/css':name.endsWith('.html')?'text/html':'text/javascript']]),
 ['/fonts/Manrope-Cyrillic.woff2',[path.join(project,'fonts/Manrope-Cyrillic.woff2'),'font/woff2']],
 ['/fonts/Manrope-Latin.woff2',[path.join(project,'fonts/Manrope-Latin.woff2'),'font/woff2']],
 ['/references/Avatar-preview.webp',[path.join(project,'references/Avatar-preview.webp'),'image/webp']],
 ['/favicon.svg',[path.join(project,'favicon.svg'),'image/svg+xml']]
]);
http.createServer((req,res)=>{const asset=allowed.get(new URL(req.url,'http://localhost').pathname);if(!asset||!['GET','HEAD'].includes(req.method)){res.writeHead(404);res.end();return;}fs.readFile(asset[0],(error,content)=>{if(error){res.writeHead(500);res.end('Preview asset unavailable');return;}res.writeHead(200,{'Content-Type':asset[1],'Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:content);});}).listen(4174,'127.0.0.1',()=>console.log('Separate prototype: http://127.0.0.1:4174/'));
