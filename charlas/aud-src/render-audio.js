// node render-audio.js [id…] → ../aud/<id>.mp3 (mono, 112 kbps, 10–15 s)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const OUT = path.join(__dirname, '..', 'aud'), TMP = process.env.TMPDIR || '/tmp', http = require('http');
const RAIZ = path.join(__dirname, '..', '..'), PIANO = '/tmp/claude-0/piano/out';
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.ogg': 'audio/ogg' };
function servidor() { return new Promise(ok => { const s = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = u.startsWith('/piano-out/') ? path.join(PIANO, u.slice(11)) : path.join(RAIZ, u); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); }); s.listen(0, '127.0.0.1', () => ok(s)); }); }
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  const srv = await servidor(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/charlas/aud-src/audio.html');
  let ids = process.argv.slice(2); if (!ids.length) ids = await pg.evaluate(() => Object.keys(PIEZAS));
  for (const id of ids) {
    const r = await pg.evaluate(async id => { try { return await renderPieza(id); } catch (e) { return { error: e.message + ' ' + e.stack }; } }, id);
    if (r.error) { console.log(id, r.error); continue; }
    const wav = path.join(TMP, 'au-' + id + '.wav'); fs.writeFileSync(wav, Buffer.from(r.wav, 'base64'));
    const mp3 = path.join(OUT, id + '.mp3');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', '44100', '-b:a', '112k', mp3]);
    console.log(id, r.seg.toFixed(1) + ' s', Math.round(fs.statSync(mp3).size / 1024) + ' KB', 'pico', r.pico.toFixed(2), r.piano || '');
  }
  if (errs.length) console.log('ERRORES', errs.slice(0, 5));
  await b.close(); srv.close();
})();
