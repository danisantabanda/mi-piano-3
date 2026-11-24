// Capturas M3.1 en varios tamaños (1280×800, tablet 1024×600 y 4:3 1024×768) → /tmp/claude-0/m31cap + PDF de las guías
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs');
const espera = ms => new Promise(r => setTimeout(r, ms)), DIR = '/tmp/claude-0/m31cap'; fs.mkdirSync(DIR, { recursive: true });
const TAM = (process.argv[2] || '1280x800').split('x').map(Number);
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const pg = await b.newPage({ viewport: { width: TAM[0], height: TAM[1] } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('file://' + path.join(__dirname, '..', 'MI-PIANO-3-M3.html')); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  const ev = (f, x) => pg.evaluate(f, x), L = [], suf = '-' + TAM.join('x');
  const cap = async (n, r) => { const f = path.join(DIR, n + suf + '.png'); await pg.screenshot({ path: f }); L.push([f, r]); };
  await ev(() => { localStorage.clear(); __mp3.fecha('2026-12-01'); __mp3.perfil('sarah'); SON5.iniciar(); });
  await ev(() => __mp3.carta()); await espera(5600); await cap('01-titulo', 'Intro: título y frase de inicio');
  // la puerta → recorrido de llegada
  await ev(() => { ESC.f = 6; ESC.tf = ESC.t; }); await espera(300); await ev(() => notaEntrante(64, 90, 'pantalla')); await espera(5200); await cap('02-recorrido', 'Llegada: la cámara resalta cada edificio');
  await espera(4300); await cap('03-recorrido2', 'Recorrido: el Teatro');
  // anuncio, nota nueva, conteo
  await ev(() => { __mp3.pararNino(); const m = m2_(); m.primerDia = true; __mp3.paradaDirecta('salon'); }); await espera(1800); await cap('04-anuncio', 'Mini-anuncio al entrar (≈5 s)');
  await ev(() => { ESC.anuncio.dur = 0; }); await espera(700); await ev(() => { ESC.irPaso(2); }); await espera(2600); await cap('05-nota-nueva', 'Antes de una nota nueva: su tarjeta (nombre, pentagrama, tecla)');
  await ev(() => { if (ESC.presenta) ESC.saltarPresenta(); }); await espera(1700); await cap('06-conteo', 'A tempo, lento (56): cuenta arriba a la derecha, nada la tapa');
  await ev(() => { __mp3.paradaDirecta('teatro'); ESC.anuncio.dur = 0; }); await espera(400); await ev(() => { const i = ESC.pasos.findIndex(p => p.tipo === 'repaso'); ESC.irPaso(i); }); await espera(4200); await cap('07-repaso', 'Mini repaso en medio: «Recuerda: la negra dice tan»');
  await ev(() => { ESC.irPaso(2); }); await espera(3500); await cap('08-teatro', 'Teatro día 1: Jingle Bells, una sola nota (MI) a 56');
  await ev(() => { __mp3.ir('belen'); __mp3.papas('clase'); }); await espera(700); await cap('09-clase', 'Papás: plan de la clase del viernes');
  await ev(() => { __mp3.papas('guias'); }); await espera(500); await cap('10-guias', 'Papás: guías para imprimir');
  await ev(() => { __mp3.papas('piano'); }); await espera(500); await cap('11-latencia', 'Papás: medir el retraso tocando');
  // las guías y el plan, como PDF (lo que sale de Chrome al imprimir)
  if (TAM[0] === 1280) { await ev(() => { document.getElementById('impresion').innerHTML = planClase5() + GUIAS5.map(g => g[1]()).join(''); }); await pg.emulateMedia({ media: 'print' }); await pg.pdf({ path: path.join(DIR, 'guias.pdf'), format: 'Letter' }); await pg.emulateMedia({ media: 'screen' }); }
  fs.writeFileSync(path.join(DIR, 'lista' + suf + '.json'), JSON.stringify(L)); console.log(JSON.stringify({ capturas: L.length, errores: errs }));
  await b.close();
})();
