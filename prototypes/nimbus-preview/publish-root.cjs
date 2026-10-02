// Run after `npm run build` to prepare the static Vercel site at repository root.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const dist = path.join(__dirname, 'dist');
if (!fs.existsSync(path.join(dist, 'index.html'))) throw new Error('Build Nimbus first.');
for (const name of ['assets', 'fonts', 'images']) {
  fs.cpSync(path.join(dist, name), path.join(root, name), { recursive: true });
}
fs.copyFileSync(path.join(dist, 'favicon.svg'), path.join(root, 'favicon.svg'));
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
  .replace('<meta name="robots" content="noindex,nofollow">', '')
  .replace('<title>Tigran AI — Nimbus prototype</title>', '<title>Tigran AI — автоматизация для бизнеса</title>');
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('Nimbus production files prepared at repository root.');
