// Prueba de humo (E1+M2+M5): carga, selector, mapa, Belén desde arriba (caminar, hablar, entrar por la puerta), interiores; 0 errores; fps; capturas.
// Uso: node pruebas/humo.js [ancho alto] [--capturas]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path');
const args = process.argv.slice(2), nums = args.filter(a => /^\d+$/.test(a)).map(Number), W = nums[0] || 1280, H = nums[1] || 800, CAP = args.includes('--capturas');
const espera = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const pg = await b.newPage({ viewport: { width: W, height: H }, hasTouch: true });
  const errs = []; pg.on('pageerror', e => errs.push('pageerror: ' + e.message)); pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  const t0 = Date.now(); await pg.goto('file://' + path.join(__dirname, '..', 'MI-PIANO-3-M3.html')); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 30000 });
  const R = { carga: Math.round(await pg.evaluate(() => __mp3.carga())), cargaTotal: Date.now() - t0 };
  const cap = async n => { if (CAP) await pg.screenshot({ path: path.join(__dirname, '..', 'capturas', n + '-' + W + '.png') }); };
  await espera(700); await cap('01-selector');
  // un toque en la carta de Sarah (en coordenadas de pantalla)
  const toque = async (lx, ly) => { const k = Math.min(W / 1280, H / 800), ox = (W - 1280 * k) / 2, oy = (H - 800 * k) / 2; await pg.touchscreen.tap(ox + lx * k, oy + ly * k); };
  await toque(260, 380); await espera(2200); R.tras1toque = await pg.evaluate(() => __mp3.escena());
  await cap('02-aldea');
  // entrar a la casa: tocar la casa
  await pg.evaluate(() => __mp3.caminar(5, 5)); await espera(400);
  await pg.evaluate(() => __mp3.ir('mapa')); await espera(800); await cap('03-mapa');
  await pg.evaluate(() => __mp3.ir('belen')); await espera(1000); R.belen = await pg.evaluate(() => __mp3.escena());
  // caminar por Belén (desde arriba) y medir fps
  await pg.evaluate(() => __mp3.caminar(31, 24)); await espera(3500); R.fps = Math.round(await pg.evaluate(() => __mp3.fps()));
  R.cuadros = await pg.evaluate(() => { const c = __mp3.cuadros().slice(-120).sort((a, b) => a - b); return { mediana: +c[60].toFixed(1), p95: +c[114].toFixed(1) }; });
  R.jugador = await pg.evaluate(() => __mp3.jugador());
  await pg.evaluate(() => __mp3.caminar(31, 32)); await espera(2500); await cap('04-belen-plaza');
  // hablar con María: mirar hacia arriba y ¡Toca! (con la cruz de flechas y el botón de verdad)
  await toque(150, 646 - 80); await espera(300); await toque(1138, 650); await espera(2500); R.dialogo = await pg.evaluate(() => __mp3.dialogo()); await cap('05-belen-dialogo');
  for (let k = 0; k < 12; k++) { await toque(640, 600); await espera(150); }
  // entrar caminando por la puerta de la Torre de notas (tarjeta del lugar)
  await pg.evaluate(() => { __mp3.caminar(5, 10); }); await pg.waitForFunction(() => __mp3.jugador() && !__mp3.jugador().camino && __mp3.jugador().i === 5, null, { timeout: 30000 }); await espera(300); await pg.keyboard.down('ArrowUp'); await espera(400); await pg.keyboard.up('ArrowUp'); await espera(600); R.panelLugar = await pg.evaluate(() => !!(ESC.panel && ESC.panel.o && ESC.panel.o.nombre)); await cap('06-belen-torre');
  // interiores
  for (const id of ['b-salon', 'b-coro', 'b-teatro', 'b-conservatorio', 'b-taller', 'b-patio', 'n-casa']) { await pg.evaluate(id => __mp3.ir(id), id); await espera(700); await cap('07-' + id); }
  await pg.evaluate(() => __mp3.ir('selector')); await espera(500);
  R.errores = errs; console.log(JSON.stringify(R, null, 1)); await b.close();
})();
