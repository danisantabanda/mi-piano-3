// Video corto de una sesión (montaje): el niño simulado juega la sesión completa; los momentos elegidos se graban
// a velocidad real y el resto pasa acelerado y se corta. → capturas/m2-sesion.mp4
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs'), { execSync } = require('child_process');
const espera = ms => new Promise(r => setTimeout(r, ms)), TMP = '/tmp/claude-0/video5';
(async () => {
  fs.rmSync(TMP, { recursive: true, force: true });
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
  const cx = await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true, recordVideo: { dir: TMP, size: { width: 1280, height: 800 } } });
  const pg = await cx.newPage(); const T0 = Date.now();
  await pg.goto('file://' + path.join(__dirname, '..', 'MI-PIANO-3-M3.html')); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  await pg.evaluate(() => { localStorage.clear(); __mp3.fecha('2026-12-02'); }); await espera(900);
  const tramos = []; let abierto = null;
  const real = si => { const t = (Date.now() - T0) / 1000; if (si && !abierto) abierto = t; if (!si && abierto) { tramos.push([abierto, t]); abierto = null; } };
  real(true); await espera(700);
  await pg.touchscreen.tap(260, 380);
  await pg.evaluate(() => { __mp3.nino('bueno', 'midi', { errorP: .03 }); });
  let fin = false, guard = Date.now();
  while (!fin && Date.now() - guard < 9 * 60 * 1000) {
    const d = await pg.evaluate(() => { const x = __mp3.dia(); x.f = ESC === ESCENA_CARTA ? ESC.f : null; x.tf = ESC === ESCENA_CARTA ? ESC.t - ESC.tf : null; x.pt = ESC && ESC.paso ? ESC.t - (ESC.paso.t0 || 0) : 0; return x; });
    let v = 8, err = .03; const e = d.escena, k = d.k, t = d.t || 0;
    if (e === 'carta') v = (d.f === 2 && d.tf > 4.5) ? 8 : 1;
    else if (e === 'belen') v = 2;
    else if (e === 'parada:patio') v = (t < 7 || (t > 40 && t < 47)) ? 1 : 8;
    else if (e === 'parada:coro') v = k === 0 ? 1 : 8;
    else if (e === 'parada:salon') { v = (k === 0 && t < 4) || k === 3 || k === 5 ? 1 : 8; if (k === 3) err = .3; }
    else if (e === 'parada:teatro') v = k === 1 || k === 7 ? 1 : 8;
    else if (e === 'parada:taller') v = t < 9 ? 1 : 8;
    else if (e === 'organo') { v = 1; await pg.evaluate(() => __mp3.pararNino()); if (t > 8.5) fin = true; }
    if (d.completo && e === 'belen') fin = true;
    await pg.evaluate(([v, err]) => { __mp3.vel(v); SIM5.errorP = err; }, [v, err]);
    real(v <= 2);
    await espera(v <= 2 ? 100 : 60);
  }
  real(false);
  await cx.close(); await b.close();
  const webm = fs.readdirSync(TMP).find(f => f.endsWith('.webm')), src = path.join(TMP, webm), out = path.join(__dirname, '..', 'capturas', 'm2-sesion.mp4');
  // cada tramo a velocidad real se corta aparte (poca memoria) y luego se unen
  const T = tramos.filter(([a, z]) => z - a > .4).map(([a, z]) => [Math.max(0, a + .15), z - .05]);
  fs.writeFileSync(path.join(TMP, 'tramos.json'), JSON.stringify(T));
  const lista = T.map(([a, z], i) => { const o = path.join(TMP, 't' + i + '.mp4'); execSync(`ffmpeg -y -loglevel error -ss ${a.toFixed(2)} -i "${src}" -t ${(z - a).toFixed(2)} -vf scale=960:600,fps=30 -c:v libx264 -preset medium -threads 2 -crf 26 -pix_fmt yuv420p -an "${o}"`); return "file '" + o + "'"; });
  fs.writeFileSync(path.join(TMP, 'lista.txt'), lista.join('\n'));
  execSync(`ffmpeg -y -loglevel error -f concat -safe 0 -i "${path.join(TMP, 'lista.txt')}" -c copy -movflags +faststart "${out}"`);
  const dur = execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${out}"`).toString().trim();
  console.log(JSON.stringify({ tramos: T.length, segundos: +(+dur).toFixed(1), mb: +(fs.statSync(out).size / 1e6).toFixed(2) }));
})();
