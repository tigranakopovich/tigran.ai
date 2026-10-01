const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/script.js', ['script.js', 'text/javascript; charset=utf-8']],
  ['/references/Avatar.png', ['references/Avatar.png', 'image/png']],
  ['/fonts/Manrope-Cyrillic.woff2', ['fonts/Manrope-Cyrillic.woff2', 'font/woff2']],
  ['/fonts/Manrope-Latin.woff2', ['fonts/Manrope-Latin.woff2', 'font/woff2']],
]);

http.createServer((request, response) => {
  const asset = assets.get(new URL(request.url, 'http://localhost').pathname);
  if (!asset || !['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(404);
    response.end();
    return;
  }
  fs.readFile(path.join(__dirname, asset[0]), (error, content) => {
    if (error) {
      response.writeHead(500);
      response.end('Preview asset unavailable');
      return;
    }
    response.writeHead(200, { 'Content-Type': asset[1], 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : content);
  });
}).listen(4173, '127.0.0.1', () => {
  console.log('Local preview: http://127.0.0.1:4173');
});
