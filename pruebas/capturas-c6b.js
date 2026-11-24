const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'); const espera = ms => new Promise(r => setTimeout(r, ms)), DIR = '/tmp/claude-0/c6cap';
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 800 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.join(__dirname, '..', 'MI-PIANO-3-M3.html')); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  await pg.evaluate(() => { localStorage.clear(); __mp3.fecha('2026-12-01'); __mp3.perfil('sarah'); SON5.iniciar(); });
  for (const id of ['patio', 'taller']) {
    await pg.evaluate(id => { __mp3.pararNino(); m2_().diaForzado = 3; __mp3.paradaDirecta(id); if (ESC.anuncio) ESC.anuncio.dur = 0; }, id); await espera(900);
    await pg.evaluate(() => { ESC.irPaso(0); if (ESC.presenta && ESC.saltarPresenta) ESC.saltarPresenta(); __mp3.nino('bueno', 'midi', { errorP: 0.15 }); }); await espera(6000);
    await pg.screenshot({ path: path.join(DIR, id + '.png') });
  }
  console.log(errs.slice(0, 4)); await b.close();
})();
