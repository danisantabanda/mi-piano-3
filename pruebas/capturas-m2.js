// Capturas M2 (y los ajustes de M1) → capturas/m2-*.png + hoja de contacto capturas/_contacto.jpg
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs'), { execSync } = require('child_process');
const espera = ms => new Promise(r => setTimeout(r, ms)), DIR = path.join(__dirname, '..', 'capturas');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
  const pg = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('file://' + path.join(__dirname, '..', 'MI-PIANO-3-M3.html')); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  await pg.evaluate(() => { localStorage.clear(); __mp3.fecha('2026-12-02'); });
  const L = [];
  const cap = async (n, rotulo) => { const f = path.join(DIR, 'm2-' + n + '.png'); await pg.screenshot({ path: f }); L.push([f, rotulo]); };
  const ev = (s, a) => pg.evaluate(s, a);
  await espera(800); await cap('01-selector', 'M1 · ¿Quién toca hoy? (más sobrio)');
  await ev(() => { __mp3.perfil('sarah'); SON5.iniciar(); __mp3.ir('mapa'); }); await espera(1200); await cap('02-mapa', 'M1 · mapa del mundo (manuscrito, se desplaza)');
  await ev(() => { __mp3.ir('belen'); __mp3.revelarTodo(); __mp3.caminar(17, 22); }); await espera(4500); await cap('03-belen', 'M1 · Belén: calles anchas, niebla oscura');
  await ev(() => { const J = ESC.jugador; J.fi = 26; J.fj = 9; J.camino = []; ESC.cam.x += 0; }); await espera(1500); await cap('04-silueta', 'M1 · Sarah y Tic detrás del Salón: silueta');
  // primer día
  await ev(() => { __mp3.carta(); }); await espera(5200); await cap('05-carta', 'Primer día · la carta de Bach');
  await ev(() => { __mp3.nino('bueno', 'midi'); }); await pg.waitForFunction(() => __mp3.dia().log.some(l => l.que === 'puerta') || ESC.t > 30, null, { timeout: 60000 }).catch(() => { });
  await ev(() => { __mp3.pararNino(); }); await ev(() => { ESC.tf -= 0; }); await espera(1500); await cap('08-puerta', 'Primer día · la primera nota abre la puerta');
  await ev(() => { __mp3.carta(); }); await espera(3300); await ev(() => { ESC.tocar(600, 400); }); await espera(1000); await cap('06-tic', 'Primer día · Tic sale del sobre');
  await ev(() => { ESC.tocar(600, 400); }); await espera(2300); await cap('07-traje', 'Primer día · el traje de viajero');
  // paradas
  const parada = async (id, k, ms, n, r, antes) => { await ev(([id, k]) => { __mp3.pararNino(); __mp3.paradaDirecta(id, k); __mp3.nino('bueno', 'midi', { errorP: 0 }); }, [id, k]); if (antes) await antes(); await espera(ms); await cap(n, r); };
  await parada('patio', 0, 4200, '09-patio-respira', 'Patio · respiración con el pulso');
  await ev(() => { ESC.t = 30; ESC.pulso.t0 = ESC.t - 20 * .75; }); await espera(3500); await cap('10-patio-libre', 'Patio · Modo Piano: faroles de colores');
  await parada('coro', 0, 4300, '11-coro', 'Coro · Tic canta, el niño canta y hace el eco');
  await parada('salon', 0, 2600, '12-salon-bach', 'Salón de Bach · lo nuevo: negra y blanca');
  await parada('salon', 3, 2600, '13-salon-espera', 'Salón · espera (el juego espera la nota)');
  await parada('salon', 4, 3600, '14-salon-ritmo', 'Salón · a tu ritmo (la blanca dura)');
  await parada('salon', 5, 2200, '15-salon-tempo', 'Salón · a tempo: cuenta de cuatro');
  // error: nota equivocada → suena suave, brilla la correcta, tropieza
  await ev(() => { __mp3.pararNino(); __mp3.paradaDirecta('salon', 3); }); await espera(500); await ev(() => { Entrada.bytes([0x90, 71, 90]); }); await espera(160); await cap('16-error', 'Error · brilla la correcta, el personaje tropieza');
  await parada('teatro', 1, 5200, '17-teatro-pads', 'Teatro · Jingle Bells: ritmo en pads');
  await parada('teatro', 7, 7600, '18-teatro-cancion', 'Teatro · la canción entera con la banda');
  await parada('taller', 0, 14000, '19-taller', 'Taller · inventar sobre la base (telar)');
  await ev(() => { __mp3.pararNino(); __mp3.ir('belen'); }); await espera(300); await ev(() => { __mp3.paseo('coro', 'salon'); }); await espera(4600); await cap('20-paseo', 'Entre paradas: Belén pasa animado');
  await ev(() => { const d = __mp3.dia(); const p = GUARDA.perfil(); p.m2.dias['2026-11-30'] = { paradas: {}, completo: true }; p.m2.dias['2026-12-01'] = { paradas: {}, completo: true }; const h = diaHoy5(); ['patio', 'coro', 'salon', 'teatro', 'taller'].forEach((id, i) => h.paradas[id] = { e: [3, 3, 2, 2, 3][i], c: [3, 3, 2, 7, 3][i] }); p.m2.corcheas = 18; __mp3.organo(); }); await espera(6500); await cap('21-organo', 'El órgano del día + pentagrama de la semana');
  console.log(JSON.stringify({ capturas: L.length, errores: errs }));
  fs.writeFileSync('/tmp/claude-0/lista-contacto.json', JSON.stringify(L));
  await b.close();
})();
