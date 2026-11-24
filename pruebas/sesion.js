// Prueba M2: una sesión completa con el niño simulado.
// Uso: node pruebas/sesion.js [bueno|aporrea] [midi|pantalla] [vel] [--minutos N] [--capturas] [--video]
//  bueno: debe pasar las 5 paradas y llegar al órgano en ~15 min de juego. aporrea: NO debe avanzar (se queda en el coro).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs');
const a = process.argv.slice(2), TIPO = a.find(x => /^(bueno|aporrea)$/.test(x)) || 'bueno', FUENTE = a.find(x => /^(midi|pantalla)$/.test(x)) || 'midi';
const VEL = +(a.find(x => /^\d+(\.\d+)?$/.test(x)) || 6), MIN = a.includes('--minutos') ? +a[a.indexOf('--minutos') + 1] : (TIPO === 'bueno' ? 30 : 8), CAP = a.includes('--capturas'), VIDEO = a.includes('--video');
const espera = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
  const ctxOpts = { viewport: { width: 1280, height: 800 }, hasTouch: true }; if (VIDEO) ctxOpts.recordVideo = { dir: '/tmp/claude-0/video5', size: { width: 1280, height: 800 } };
  const cx = await b.newContext(ctxOpts), pg = await cx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push('pageerror: ' + e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push('error: ' + m.text()); });
  await pg.goto('file://' + path.join(__dirname, '..', 'MI-PIANO-3-M3.html')); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  await pg.evaluate(() => { localStorage.clear(); __mp3.fecha('2026-12-02'); });
  await espera(600);
  // el primer toque: la carta de Sarah (toque real en la pantalla)
  await pg.touchscreen.tap(260, 380);
  await pg.evaluate(([t, f, v]) => { __mp3.nino(t, f); __mp3.vel(v); }, [TIPO, FUENTE, VEL]);
  const t0 = Date.now(); let ult = '', R = { escenas: [] };
  while ((Date.now() - t0) / 1000 * VEL < MIN * 60) {
    await espera(1000);
    const d = await pg.evaluate(() => __mp3.dia());
    const e = d.escena + (d.k != null ? ' paso ' + d.k : '');
    if (e !== ult) { ult = e; R.escenas.push(e + ' @' + Math.round(d.reloj) + 's'); }
    if (d.escena === 'organo' && d.tFin) { R.organo = true; break; }
  }
  const d = await pg.evaluate(() => __mp3.dia());
  R.tipo = TIPO; R.fuente = FUENTE; R.vel = VEL; R.paradas = d.paradas; R.corcheas = d.corcheas; R.notasSim = d.notasSim;
  R.maxRepeticionesIdenticas = d.maxRep; R.sesionMin = d.tFin ? +((d.tFin - d.t0) / 60).toFixed(1) : null; R.relojMin = +(d.reloj / 60).toFixed(1); R.log = d.log; R.piano = d.piano;
  R.errores = errs.slice(0, 10);
  console.log(JSON.stringify(R, null, 1));
  await cx.close(); await b.close();
})();
