// PWA de f5/web en una subruta (/pruebas/mi-piano-3/): SW activo, 0 errores, sin red recarga.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const WEB = path.join(__dirname, '..', 'web'), T = { '.html': 'text/html', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
(async () => {
  const srv = http.createServer((q, r) => { let u = decodeURIComponent(q.url.split('?')[0]); if (u === '/pruebas/mi-piano-3') { r.writeHead(301, { Location: '/pruebas/mi-piano-3/' }); return r.end(); } if (!u.startsWith('/pruebas/mi-piano-3/')) { r.writeHead(404); return r.end(); } let f = path.join(WEB, u.slice(20) || 'index.html'); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); });
  await new Promise(ok => srv.listen(0, '127.0.0.1', ok)); const base = 'http://127.0.0.1:' + srv.address().port + '/pruebas/mi-piano-3';
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const ctx = await b.newContext({ viewport: { width: 1024, height: 600 } }); const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto(base); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 30000 });
  await pg.waitForFunction(() => navigator.serviceWorker.controller, null, { timeout: 15000 }).catch(() => { });
  const R = { sw: await pg.evaluate(() => !!navigator.serviceWorker.controller) };
  // el piano (≈ 9 MB) queda guardado en su caché aparte
  R.pianoGuardado = await pg.waitForFunction(() => caches.open('mipiano3-datos').then(c => c.match('piano-datos.js')).then(r => !!r), null, { timeout: 60000, polling: 1000 }).then(() => true).catch(() => false);
  await ctx.setOffline(true); await pg.goto(base + '/'); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 30000 }).catch(() => { });
  R.sinRed = await pg.evaluate(() => !!(window.__mp3 && __mp3.listo));
  await pg.evaluate(() => SON5.iniciar()); R.pianoSinRed = await pg.waitForFunction(() => Snd.estadoPiano().fuente === 'salamander', null, { timeout: 60000 }).then(() => true).catch(() => false); R.errores = errs; console.log(JSON.stringify(R)); await b.close(); srv.close();
})();
