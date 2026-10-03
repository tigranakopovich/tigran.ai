const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'prototypes/nimbus-preview/dist'),site=path.join(root,'site');
if(!fs.existsSync(path.join(dist,'index.html')))throw new Error('Build the Nimbus preview before exporting.');
fs.mkdirSync(site,{recursive:true});
// Runtime files only. Source, references, reports and original media are never deployed.
for(const name of ['assets','fonts'])fs.cpSync(path.join(dist,name),path.join(site,name),{recursive:true});
for(const name of ['favicon.svg','images/tigran-graphite.webp','earth/earth-fallback.webp']){const target=path.join(site,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(dist,name),target);}
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8').replace(/<meta name="robots" content="noindex,nofollow">/,'').replace('Tigran AI — Nimbus prototype','Tigran AI — автоматизация для бизнеса').replace('#2D322F','#13171D');
fs.writeFileSync(path.join(site,'index.html'),html);
console.log('Exported verified runtime to site/; private workspace files excluded.');
