// Capturas para la charla 6 (pantalla por pantalla) → /tmp/claude-0/c6cap
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs');
const espera = ms => new Promise(r => setTimeout(r, ms)), DIR = '/tmp/claude-0/c6cap'; fs.mkdirSync(DIR, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const pg = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.join(__dirname, '..', 'MI-PIANO-3-M3.html')); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  const ev = (f, x) => pg.evaluate(f, x).catch(e => errs.push('ev:' + e.message));
  const cap = async n => { await pg.screenshot({ path: path.join(DIR, n + '.png') }); };
  await espera(1500); await cap('selector');
  await ev(() => { localStorage.clear(); __mp3.fecha('2026-12-01'); __mp3.perfil('sarah'); SON5.iniciar(); });
  await ev(() => __mp3.carta()); await espera(5600); await cap('titulo');
  await ev(() => { ESC.f = 6; ESC.tf = ESC.t; }); await espera(300); await ev(() => notaEntrante(64, 90, 'pantalla')); await espera(5200); await cap('recorrido');
  const parada = async (id, paso, ms, n) => { await ev(([id, paso]) => { __mp3.pararNino(); m2_().diaForzado = 3; __mp3.paradaDirecta(id); ESC.anuncio && (ESC.anuncio.dur = 0); setTimeout(() => { if (paso != null) ESC.irPaso(paso); if (ESC.presenta && ESC.saltarPresenta) ESC.saltarPresenta(); __mp3.nino('bueno', 'midi', { errorP: 0.15 }); }, 400); }, [id, paso]); await espera(ms); await cap(n); };
  await ev(() => { const m = m2_(); m.primerDia = true; __mp3.paradaDirecta('salon'); }); await espera(1800); await cap('anuncio');
  await ev(() => { ESC.anuncio.dur = 0; }); await espera(600); await ev(() => ESC.irPaso(2)); await espera(2600); await cap('nota-nueva');
  await parada('patio', null, 6000, 'patio'); await parada('taller', null, 6000, 'taller');
  await ev(() => { __mp3.paradaDirecta('teatro'); ESC.anuncio.dur = 0; }); await espera(400); await ev(() => { const i = ESC.pasos.findIndex(p => p.tipo === 'repaso'); if (i >= 0) ESC.irPaso(i); }); await espera(4200); await cap('repaso');
  await ev(() => { __mp3.pararNino(); __mp3.duelo(); ESC.anuncio && (ESC.anuncio.dur = 0); setTimeout(() => __mp3.nino('bueno', 'midi', { errorP: 0.1 }), 500); }); await espera(7000); await cap('duelo');
  await ev(() => { __mp3.pararNino(); __mp3.organo(); }); await espera(4000); await cap('organo');
  await ev(() => { __mp3.ir('belen'); }); await espera(1500); await ev(() => __mp3.caminar(20, 18)); await espera(1500); await cap('belen');
  await ev(() => { __mp3.ir('n-casa'); }).catch(() => { }); 
  await ev(() => { __mp3.ir('belen'); __mp3.papas('informe'); }); await espera(700); await cap('informe');
  console.log(JSON.stringify({ errores: errs.slice(0, 8), archivos: fs.readdirSync(DIR) }));
  await b.close();
})();
