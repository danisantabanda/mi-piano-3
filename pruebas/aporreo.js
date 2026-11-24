// Prueba de «aporreo» (M7b): en cada pantalla, 6 s de golpes a lo loco — piano MIDI falso (todas las teclas 0–127, velocidad 0,
// note-off sueltos), teclado del PC y toques en la pantalla — y después: 0 errores, el reloj de la escena sigue y la actividad
// avanza (con el niño simulado bueno, a velocidad ×3). Nada puede quedar bloqueado.
// Uso: node pruebas/aporreo.js [1920x1080] [--http]   (por defecto file:// a 1280×800)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), http = require('http'), fs = require('fs');
const tam = (process.argv.find(a => /^\d+x\d+$/.test(a)) || '1280x800').split('x').map(Number), HTTP = process.argv.includes('--http');
const espera = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  let url = 'file://' + path.join(__dirname, '..', 'MI-PIANO-3-M3.html'), srv = null;
  if (HTTP) { const WEB = path.join(__dirname, '..', 'web'); srv = http.createServer((q, r) => { let u = q.url.split('?')[0]; if (u === '/') u = '/index.html'; const f = path.join(WEB, u); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': u.endsWith('.js') ? 'text/javascript' : u.endsWith('.html') ? 'text/html' : 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }); await new Promise(r => srv.listen(0, r)); url = 'http://127.0.0.1:' + srv.address().port + '/'; }
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const pg = await b.newPage({ viewport: { width: tam[0], height: tam[1] } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto(url); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  const ev = (f, x) => pg.evaluate(f, x);
  const base = (n = 3) => ev(n => { MENU5.cerrar(); __mp3.pararNino(); __mp3.vel(1); GUARDA.d.perfiles = {}; __mp3.perfil('sarah'); SON5.iniciar(); const m = m2_(); m.primerDia = true; m.corcheas = 24; m.mision = n; m.vistoDespertar = n; m.recorridoVisto = true; m.notasVistas = [64, 67, 60, 62, 65, 69, 71, 72, 74, 76, 77, 79]; m.llaves = { flauta: 2, reto: 1, instrumento: 1, fa: 1 }; }, n);
  const firma = () => ev(() => { const E = ESC || {}, P = E.panel; return JSON.stringify({ e: E.id || (E.def && E.def.id) || '', k: E.k, tj: !!E.tarjeta, fin: !!E.fin, an: !!E.anuncio, pr: E.presenta ? E.presenta.i : null, es: E.paso && (E.paso.estado || E.paso.fase || E.paso.k), p: P ? [P.fase, P.ronda, P.ok, P.toques && P.toques.length, P.calma, P.k, P.eco && P.eco.length, P.intentos] : null, abierto: !!P }); });
  const relojes = () => ev(() => ({ R: RELOJ, t: ESC && ESC.t, pt: ESC && ESC.panel && ESC.panel.t, n: FPS5.cuadros.length + FPS5.n, atasco: hayAtasco5() }));
  const aporrear = async (ms) => {
    const box = await ev(() => { const c = document.querySelector('canvas').getBoundingClientRect(); return [c.left, c.top, c.width, c.height]; });
    const t0 = Date.now(); let i = 0;
    while (Date.now() - t0 < ms) {
      i++;
      await ev(i => { for (let k = 0; k < 4; k++) { const n = Math.floor(Math.random() * 128), v = Math.random() < .15 ? 0 : 1 + Math.floor(Math.random() * 126); Entrada.bytes([0x90, n, v], performance.now(), 'midi', 'aporreo'); if (Math.random() < .5) Entrada.bytes([0x80, Math.floor(Math.random() * 128), 0], performance.now(), 'midi', 'aporreo'); } if (i % 7 === 0) Entrada.bytes([0xb0, 64, Math.random() < .5 ? 127 : 0], performance.now(), 'midi', 'aporreo'); }, i);
      await pg.keyboard.press(['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyW', 'KeyE', 'KeyZ', 'Space', 'Enter', 'ArrowLeft', 'ArrowUp'][Math.floor(Math.random() * 15)]);
      // toques: en cualquier parte menos los botones de arriba a la derecha (pausa/ajustes/mapa) y el cierre de los rincones
      const lx = Math.random() * 1280, ly = 120 + Math.random() * 680; if (!(lx > 1080 && ly < 170)) await pg.mouse.click(box[0] + lx * box[2] / 1280, box[1] + ly * box[3] / 800);
      await espera(25);
    }
    await ev(() => { MENU5.cerrar(); Entrada.pedal = false; });
  };
  const R = [];
  const probar = async (nombre, preparar, o = {}) => {
    const e0 = errs.length;
    await base(o.mision == null ? 3 : o.mision); await ev(preparar); await espera(o.esperaAntes || 1500);
    await aporrear(6000);
    // si el niño cerró el rincón (la X o «¡Toca!» al final), se vuelve a abrir: lo que se prueba es que el rincón siga respondiendo
    if (o.rincon && !(await ev(() => !!(ESC && ESC.panel)))) { await ev(o.rincon); await espera(2600); }
    const r1 = await relojes(); await espera(800); const r2 = await relojes();
    const vivo = r2.n !== r1.n && r2.R > r1.R && (r1.t == null || r2.t > r1.t || r2.pt > r1.pt || o.relojQuieto);
    let avanza = true;
    if (!o.estatica) { const f0 = await firma(); await ev(() => { __mp3.vel(3); __mp3.nino('bueno', 'midi', { errorP: 0 }); }); avanza = false;
      for (let k = 0; k < 40 && !avanza; k++) { await espera(500); if ((await firma()) !== f0) avanza = true; }
      await ev(() => { __mp3.pararNino(); __mp3.vel(1); }); }
    const fila = { nombre, vivo: !!vivo, avanza, atasco: r2.atasco, firma: await firma(), pausa: await ev(() => pausado5()), errores: errs.slice(e0).filter((x, i, a) => a.indexOf(x) === i).slice(0, 2) };
    fila.ok = vivo && avanza && !fila.errores.length; R.push(fila); if (!fila.ok) console.error('FALLA', JSON.stringify(fila));
  };
  for (const [id, m] of [['patio', 0], ['coro', 1], ['salon', 4], ['teatro', 1], ['taller', 2], ['conservatorio', 6], ['ritmo', 4], ['gimnasio', 9], ['batalla', 5], ['partituras', 8], ['kiosco', 9], ['concierto', 10]])
    await probar('parada ' + id, new Function("if (PARADA5['" + id + "']) __mp3.paradaDirecta('" + id + "');"), { mision: m });
  for (const e of ['ESCENA_BIBLIO5', 'ESCENA_CAEN5']) await probar(e, new Function('const S = ' + e + '; S.volver = { lugar: LUGARES5.belen }; irA(S, { sinTransicion: true });'), { mision: 9 });
  await probar('ESCENA_MUSEO5', () => { ESCENA_MUSEO5.volver = { lugar: LUGARES5.belen }; irA(ESCENA_MUSEO5, { sinTransicion: true }); }, { estatica: true, relojQuieto: true });
  for (const r of ['pastor', 'campanas', 'vecina', 'pozo', 'posada', 'ovejas', 'ronda', 'estrella'])
    await probar('rincón ' + r, new Function("const B = LUGARES5.belen; B.auto = false; B.alEntrar = null; irA(B, { sinTransicion: true, desde: [32, 35] }); setTimeout(() => abrirRincon5(B, '" + r + "'), 600);"), { mision: 14, esperaAntes: 2500, rincon: new Function("abrirRincon5(ESC, '" + r + "')") });
  for (const t of ['panaderia', 'carpinteria', 'cuna', 'cuco', 'gallo', 'abuela', 'herreria', 'telar', 'lira'])
    await probar('casa ' + t, new Function("const B = LUGARES5.belen, o = B.objetos.find(x => x.casaK != null && TIPOS_CASA5[x.casaK % TIPOS_CASA5.length].id === '" + t + "'); entrarCasa5(B, o); setTimeout(() => abrirRincon5(ESC, 'casa-" + t + "'), 1300);"), { esperaAntes: 2800, rincon: new Function("abrirRincon5(ESC, 'casa-" + t + "')") });
  await probar('Belén', () => { const B = LUGARES5.belen; B.auto = false; B.alEntrar = null; irA(B, { sinTransicion: true, desde: [32, 40] }); }, { estatica: true, mision: 14, relojQuieto: true });
  await probar('carta', () => { m2_().primerDia = false; irA(ESCENA_CARTA, { sinTransicion: true }); }, { estatica: true, mision: 0, relojQuieto: true });
  const malos = R.filter(x => !x.ok);
  console.log(JSON.stringify({ tam, http: HTTP, pantallas: R.length, bien: R.length - malos.length, malos }, null, 1));
  await b.close(); if (srv) srv.close(); process.exit(malos.length ? 1 : 0);
})();
