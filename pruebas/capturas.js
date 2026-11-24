// Capturas limpias de la Entrega 1 y un video corto del recorrido. Uso: node pruebas/capturas.js
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const CAP = path.join(__dirname, '..', 'capturas'), espera = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('file://' + path.join(__dirname, '..', 'MI-PIANO-3-E1.html')); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo);
  const cap = async n => pg.screenshot({ path: path.join(CAP, n + '.png') });
  await espera(600); await cap('e1-selector');
  await pg.evaluate(() => { __mp3.perfil('sarah'); __mp3.ir('natal'); }); await espera(900); await cap('e1-aldea');
  await pg.evaluate(() => __mp3.ir('mapa')); await espera(900); await cap('e1-mapa');
  await pg.evaluate(() => { __mp3.ir('belen'); }); await espera(600); await cap('e1-belen-llegada-niebla');
  await pg.evaluate(() => { __mp3.revelarTodo(); __mp3.ir('belen', { desde: [19, 14] }); __mp3.revelarTodo(); }); await espera(900); await cap('e1-belen-plaza');
  await pg.evaluate(() => { __mp3.ir('belen', { desde: [21, 25] }); __mp3.revelarTodo(); }); await espera(900); await cap('e1-belen-dia');
  await pg.evaluate(() => __mp3.ir('b-salon')); await espera(700); await cap('e1-interior-salon-de-bach');
  await pg.evaluate(() => __mp3.ir('b-coro')); await espera(700); await cap('e1-interior-coro');
  await pg.evaluate(() => __mp3.ir('b-conservatorio')); await espera(700); await cap('e1-interior-conservatorio');
  // video: llegada a Belén por la puerta sur y paseo hasta el pesebre (con niebla), 12 cuadros por segundo
  const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'vid-'));
  await pg.evaluate(() => { localStorage.clear(); __mp3.perfil('sarah'); __mp3.ir('belen'); }); await espera(400);
  await pg.evaluate(() => __mp3.caminar(18, 12));
  for (let k = 0; k < 120; k++) { await pg.screenshot({ path: path.join(tmp, String(k).padStart(4, '0') + '.png') }); await espera(40); }
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '12', '-i', path.join(tmp, '%04d.png'), '-vf', 'scale=960:-2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', path.join(CAP, 'e1-recorrido-belen.mp4')]);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '12', '-i', path.join(tmp, '%04d.png'), '-vf', 'scale=640:-2,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse', path.join(CAP, 'e1-recorrido-belen.gif')]);
  console.log(errs.length ? 'ERRORES ' + JSON.stringify(errs) : 'capturas y video listos, sin errores'); await b.close();
})();
