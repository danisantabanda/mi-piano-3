// Prueba de sonido de verdad (M7b): sirve web/ por http local (con service worker), entra con un toque real
// (sin la bandera de autoplay: como Dani en Chrome), toca el teclado de pantalla y un MIDI simulado (MIDIAccess falso)
// y mide el audio en el analizador del master de KitSonido. También: que la voz NO se corte al tocar (solo baja).
// Uso: node pruebas/sonido.js [--sin-salamander]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), http = require('http'), fs = require('fs');
const SIN = process.argv.includes('--sin-salamander'), WEB = path.join(__dirname, '..', 'web');
const espera = ms => new Promise(r => setTimeout(r, ms));
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.ogg': 'audio/ogg' };
// una voz de prueba de 3 s (silencio no sirve para medir: un tono) para ver que tocar no la corta
const VOZ_PRUEBA = (() => { const sr = 22050, n = sr * 3, b = Buffer.alloc(44 + n * 2); b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40); for (let i = 0; i < n; i++) b.writeInt16LE(Math.round(Math.sin(i / sr * 2 * Math.PI * 330) * 9000), 44 + i * 2); return b; })();
const srv = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]); if (u === '/') u = '/index.html';
  if (u === '/voces/manifiesto.js') { res.writeHead(200, { 'Content-Type': 'text/javascript' }); res.end('window.VOCES = { "prueba-voz": { g: "prueba", d: 3 } };'); return; }
  if (u === '/voces/prueba-voz.ogg') { res.writeHead(200, { 'Content-Type': 'audio/wav' }); res.end(VOZ_PRUEBA); return; }
  if (SIN && u === '/piano-datos.js') { res.writeHead(404); res.end(); return; }
  const f = path.join(WEB, u); if (!f.startsWith(WEB) || !fs.existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const URL = 'http://127.0.0.1:' + srv.address().port + '/';
  const b = await chromium.launch({ args: ['--autoplay-policy=document-user-activation-required'] });   /* la política de Chrome de verdad */ const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  // MIDI falso: un teclado «Piano de prueba» que podemos tocar desde la prueba
  await ctx.addInitScript(() => {
    const inp = { id: 'x', name: 'Piano de prueba', state: 'connected', type: 'input', onmidimessage: null, addEventListener() { } };
    window.__midiFalso = (d) => { if (inp.onmidimessage) inp.onmidimessage({ data: new Uint8Array(d), timeStamp: performance.now() }); };
    navigator.requestMIDIAccess = () => Promise.resolve({ inputs: new Map([['x', inp]]), outputs: new Map(), onstatechange: null, addEventListener() { } });
  });
  const R = { url: URL, salamander: !SIN };
  await pg.goto(URL); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  const ev = (f, x) => pg.evaluate(f, x);
  // segunda visita: la página ya la sirve el service worker (como la PWA publicada), con el piano desde su caché
  await pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(() => { });
  await espera(SIN ? 500 : 4000); await pg.reload(); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  R.sw = await ev(() => !!(navigator.serviceWorker && navigator.serviceWorker.controller));
  // nivel del bus del piano durante ms (pico de RMS en ventanas de 2048 muestras)
  const medir = ms => ev(ms => new Promise(res => { const K = window.KitSonido; if (!K || !K._master) return res(-1); const P = K.bus('piano'); if (!P._medidor) { P._medidor = K.contexto().createAnalyser(); P._medidor.fftSize = 2048; P.nivel.connect(P._medidor); } const A = P._medidor, buf = new Float32Array(A.fftSize); let pico = 0; const t0 = performance.now();
    (function paso() { A.getFloatTimeDomainData(buf); let s = 0; for (const v of buf) s += v * v; pico = Math.max(pico, Math.sqrt(s / buf.length)); if (performance.now() - t0 < ms) setTimeout(paso, 20); else res(+pico.toFixed(4)); })(); }), ms);
  // 0) lo primero que hace Dani: tocar el piano MIDI (sin ningún clic todavía)
  await ev(() => { localStorage.clear(); __mp3.ir && __mp3.ir('selector'); });
  await espera(600); await ev(() => { __midiFalso([0x90, 60, 90]); __midiFalso([0x80, 60, 0]); }); await espera(300);
  R.contextoTrasMidi = await ev(() => window.KitSonido && KitSonido.contexto() ? KitSonido.contexto().state : 'sin contexto');
  // 1) un toque real en el selector (el gesto que desbloquea el audio)
  await espera(400); await pg.mouse.click(260, 400); await espera(1500);
  R.contexto = await ev(() => window.KitSonido && KitSonido.contexto() ? KitSonido.contexto().state : 'sin contexto');
  // 2) a una parada con el teclado de pantalla; esperamos el piano (Salamander tarda en decodificar)
  await ev(() => { __mp3.pararNino && __mp3.pararNino(); __mp3.paradaDirecta('patio'); ESC.anuncio.dur = 0; SON5.musica(null); });
  await pg.waitForFunction(() => Snd.estadoPiano().listo, null, { timeout: 60000 }).catch(() => { });
  R.piano = await ev(() => Snd.estadoPiano()); await espera(2500);
  R.silencio = await medir(300);
  // tecla DO4 del teclado de pantalla (coordenadas del lienzo → pantalla)
  const [px, py] = await ev(() => { const c = document.querySelector('canvas'), r = c.getBoundingClientRect(); return [r.left + (xDeTecla(60)) * r.width / LW5, r.top + (TECLADO5.y + TECLADO5.h * .85) * r.height / LH5]; });
  await pg.mouse.move(px, py); await pg.mouse.down(); const pantalla = medir(500); await espera(120); await pg.mouse.up(); R.pantalla = await pantalla;
  await espera(1500);
  // 3) MIDI: noteOn DO4 velocidad 100, luego noteOff (y un noteOn con velocidad 0 = soltar)
  R.midi = await ev(() => ({ estado: Entrada.estado, dispositivos: Entrada.dispositivos }));
  R.antesMidi = await medir(200);
  const midi = medir(500); await ev(() => { __midiFalso([0x90, 64, 100]); setTimeout(() => __midiFalso([0x90, 64, 0]), 300); }); R.midiNivel = await midi;
  // 4) voz + tocar: la voz debe seguir (más bajita), no cortarse
  await espera(1500);
  R.voz = await ev(() => new Promise(res => { Voz5.activa = true; const id = Voz5.decir('prueba-voz', { hito: true, forzar: true }); setTimeout(() => { const a = Voz5.sonando && Voz5.sonando.a; [0, 250, 500].forEach(d => setTimeout(() => notaEntrante(60 + d / 250 * 2, 90, 'pantalla'), d));
    setTimeout(() => res({ id, sigue: !!(Voz5.sonando && Voz5.sonando.a === a && a && !a.paused), volumen: a ? +a.volume.toFixed(2) : null }), 900); }, 700); }));
  R.panel = await ev(() => { PESTANA5 = 'piano'; MENU5.abrir('papas'); const t = document.getElementById('menu').innerText; return { piano: (t.match(/Piano: [^\n]*/) || [''])[0], midi: (t.match(/MIDI: [^\n]*/) || [''])[0], boton: /Probar sonido/.test(t) }; });
  R.errores = errs.slice(0, 8);
  R.ok = R.sw && R.contexto === 'running' && R.pantalla > .01 && R.midiNivel > .01 && R.voz.sigue && !R.errores.length;
  console.log(JSON.stringify(R, null, 1));
  await b.close(); srv.close(); process.exit(R.ok ? 0 : 1);
})();
