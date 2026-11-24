// Video corto M3, CON SONIDO: la salida del KitSonido se graba con MediaRecorder dentro de la página y se une al video.
// Momentos: Belén con la música despierta → Teatro (Noche de paz y Venid fieles con la banda) → el duelo y su premio → mapa → informe.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs'), { execSync } = require('child_process');
const espera = ms => new Promise(r => setTimeout(r, ms)), TMP = '/tmp/claude-0/video-m3', OUT = path.join(__dirname, '..', 'capturas', 'm3-belen.mp4');
(async () => {
  fs.rmSync(TMP, { recursive: true, force: true }); fs.mkdirSync(TMP, { recursive: true });
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const cx = await b.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: TMP, size: { width: 1280, height: 800 } } });
  const pg = await cx.newPage(); const T0 = Date.now();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.join(__dirname, '..', 'MI-PIANO-3-M3.html')); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  const ev = (f, x) => pg.evaluate(f, x);
  await ev(() => { localStorage.clear(); __mp3.fecha('2026-12-16'); __mp3.perfil('sarah'); SON5.iniciar(); const m = m2_(); m.primerDia = true; m.corcheas = 46;
    ['2026-12-01', '2026-12-02', '2026-12-03', '2026-12-08', '2026-12-09', '2026-12-10', '2026-12-15'].forEach((f, i) => { m.dias[f] = { paradas: {}, completo: true, cancion: ROTACION5[i % 5], seg: 880 }; });
    m.dominio = { 'noche-0': ['2026-12-02', '2026-12-09'], 'noche-1': ['2026-12-02', '2026-12-09'], 'noche-2': ['2026-12-02', '2026-12-09'], 'jingle-0': ['2026-12-01', '2026-12-08'] };
    diaHoy5().cancion = 'noche'; GUARDA.guardar(); });
  await espera(3000);   // que cargue el piano Salamander
  // grabar el audio del juego
  const Ta = await ev(() => { const K = KitSonido, c = K.contexto(), d = c.createMediaStreamDestination(); K._master.lim.connect(d); window.__rec = new MediaRecorder(d.stream, { mimeType: 'audio/webm;codecs=opus' }); window.__trozos = []; __rec.ondataavailable = e => __trozos.push(e.data); __rec.start(); return Date.now(); });
  const marca = []; const m = t => marca.push([t, (Date.now() - T0) / 1000]);
  m('belen'); await ev(() => { const B = LUGARES5.belen; B.auto = false; __mp3.ir('belen'); __mp3.revelarTodo(); __mp3.caminar(17, 15); }); await espera(9000);
  m('noche'); await ev(() => { diaHoy5().cancion = 'noche'; __mp3.paradaDirecta('teatro', 3); __mp3.nino('bueno', 'midi', { errorP: 0 }); }); await espera(13000);
  m('venid'); await ev(() => { __mp3.pararNino(); diaHoy5().cancion = 'venid'; __mp3.paradaDirecta('teatro', 3); __mp3.nino('bueno', 'midi', { errorP: 0 }); }); await espera(11000);
  m('duelo'); await ev(() => { __mp3.pararNino(); __mp3.duelo(); __mp3.nino('bueno', 'midi', { errorP: 0 }); }); await espera(14000);
  m('premio'); await ev(() => { __mp3.pararNino(); irA(ESCENA_PREMIO5, { sinTransicion: true }); }); await espera(5200);
  m('mapa'); await ev(() => { const mm = m2_(); mm.insignias = { estrella: '2026-12-16' }; mm.llaves = { enero: true }; __mp3.ir('mapa'); ESCENA_MAPA.entrar(); }); await espera(3500);
  m('informe'); await ev(() => { __mp3.ir('belen'); __mp3.papas('informe'); }); await espera(4500);
  const b64 = await ev(() => new Promise(ok => { __rec.onstop = async () => { const bl = new Blob(__trozos, { type: 'audio/webm' }), r = new FileReader(); r.onload = () => ok(r.result.split(',')[1]); r.readAsDataURL(bl); }; __rec.stop(); }));
  const fin = (Date.now() - T0) / 1000;
  fs.writeFileSync(path.join(TMP, 'audio.webm'), Buffer.from(b64, 'base64'));
  await cx.close(); await b.close();
  const webm = fs.readdirSync(TMP).find(f => f.endsWith('.webm') && f !== 'audio.webm'), v = path.join(TMP, webm);
  const ini = marca[0][1] - .3, off = (Ta - T0) / 1000 - ini;   // el audio empezó un poco antes de la primera marca
  execSync(`ffmpeg -y -loglevel error -ss ${ini.toFixed(2)} -i "${v}" -t ${(fin - ini).toFixed(2)} -itsoffset ${off.toFixed(2)} -i "${path.join(TMP, 'audio.webm')}" -map 0:v -map 1:a -vf scale=960:600,fps=30 -c:v libx264 -preset medium -threads 2 -crf 26 -pix_fmt yuv420p -af loudnorm=I=-18:TP=-1.5 -c:a aac -b:a 128k -shortest -movflags +faststart "${OUT}"`);
  const dur = execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${OUT}"`).toString().trim();
  console.log(JSON.stringify({ segundos: +(+dur).toFixed(1), mb: +(fs.statSync(OUT).size / 1e6).toFixed(2), audioKB: Math.round(Buffer.from(b64, 'base64').length / 1024), errores: errs }));
})();
