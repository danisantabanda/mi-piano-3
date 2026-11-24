// Recorre TODOS los modos por los atajos de papá (con el niño simulado unos segundos en cada uno): 0 errores + capturas
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs');
const espera = ms => new Promise(r => setTimeout(r, ms)), DIR = '/tmp/claude-0/modos'; fs.mkdirSync(DIR, { recursive: true });
const TAM = (process.argv[2] || '1280x800').split('x').map(Number);
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const pg = await b.newPage({ viewport: { width: TAM[0], height: TAM[1] } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('file://' + path.join(__dirname, '..', 'MI-PIANO-3-M3.html')); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  await pg.evaluate(() => { localStorage.clear(); __mp3.fecha('2026-12-09'); __mp3.perfil('sarah'); SON5.iniciar(); const m = m2_(); m.primerDia = true; m.corcheas = 120; m.diaForzado = 4; });
  await espera(1500);
  const n = await pg.evaluate(() => ATAJOS5.length), L = [];
  for (let i = 0; i < n; i++) {
    const nom = await pg.evaluate(i => { MENU5.cerrar(); __mp3.pararNino(); ATAJOS5[i][1](); return ATAJOS5[i][0]; }, i);
    await espera(1200); await pg.evaluate(() => { if (ESC && ESC.anuncio) ESC.anuncio.dur = 0; __mp3.nino('bueno', 'midi', { errorP: .03 }); }); await espera(4500);
    const f = path.join(DIR, String(i).padStart(2, '0') + '.png'); await pg.screenshot({ path: f }); L.push([f, nom]);
  }
  // compras, vestidor, tienda, casa
  await pg.evaluate(() => { MENU5.cerrar(); __mp3.pararNino(); ['arpa', 'barroco', 'cuadro', 'reloj', 'estante'].forEach(id => comprar5(TIENDA5.find(x => x.id === id))); MENU5.abrir('tienda'); }); await espera(600); await pg.screenshot({ path: path.join(DIR, 'tienda.png') }); L.push([path.join(DIR, 'tienda.png'), 'Tienda del luthier']);
  await pg.evaluate(() => { MENU5.abrir('vestidor'); }); await espera(500); await pg.screenshot({ path: path.join(DIR, 'vestidor.png') }); L.push([path.join(DIR, 'vestidor.png'), 'Vestidor']);
  await pg.evaluate(() => { MENU5.cerrar(); __mp3.ir('n-casa'); }); await espera(1500); await pg.screenshot({ path: path.join(DIR, 'casa.png') }); L.push([path.join(DIR, 'casa.png'), 'Casa decorada']);
  await pg.evaluate(() => { GUARDA.d.verMundos = true; __mp3.ir('mapa'); ESCENA_MAPA.entrar(); }); await espera(1500); await pg.screenshot({ path: path.join(DIR, 'mapa-todos.png') }); L.push([path.join(DIR, 'mapa-todos.png'), 'Papá: ver todos los mundos']);
  await pg.evaluate(() => { __mp3.papas('papa'); }); await espera(500); await pg.screenshot({ path: path.join(DIR, 'papa.png') }); L.push([path.join(DIR, 'papa.png'), 'Modo Papá: atajos y día simulado']);
  fs.writeFileSync(path.join(DIR, 'lista.json'), JSON.stringify(L)); console.log(JSON.stringify({ modos: L.length, errores: errs.slice(0, 12) }));
  await b.close();
})();
