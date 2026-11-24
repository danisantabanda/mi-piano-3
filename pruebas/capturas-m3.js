// Capturas M3 → capturas/_contacto.jpg (una hoja). Las sueltas quedan en /tmp.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs');
const espera = ms => new Promise(r => setTimeout(r, ms)), DIR = '/tmp/claude-0/m3cap'; fs.mkdirSync(DIR, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const pg = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('file://' + path.join(__dirname, '..', 'MI-PIANO-3-M3.html')); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  const ev = (f, x) => pg.evaluate(f, x), L = [];
  const cap = async (n, r) => { const f = path.join(DIR, n + '.png'); await pg.screenshot({ path: f }); L.push([f, r]); };
  // un perfil con historia: tres semanas de preludio
  await ev(() => { localStorage.clear(); __mp3.fecha('2026-12-16'); __mp3.perfil('sarah'); SON5.iniciar(); const m = m2_(); m.primerDia = true; m.corcheas = 46;
    ['2026-12-01', '2026-12-02', '2026-12-03', '2026-12-08', '2026-12-09', '2026-12-10', '2026-12-15'].forEach((f, i) => { m.dias[f] = { paradas: { patio: { e: 3, c: 3 }, coro: { e: 2, c: 2 }, salon: { e: 2, c: 2 }, teatro: { e: 3, c: 3 }, taller: { e: 3, c: 3 } }, completo: true, cancion: ROTACION5[i % 5], seg: [880, 910, 840, 900, 870, 920, 860][i] }; });
    m.dominio = { 'jingle-0': ['2026-12-01', '2026-12-08'], 'jingle-1': ['2026-12-01', '2026-12-08'], 'noche-0': ['2026-12-02', '2026-12-09'], 'noche-1': ['2026-12-02'], 'venid-2': ['2026-12-10'], 'negra-blanca': ['2026-12-01', '2026-12-02'] };
    m.stats = { 'El Teatro · Noche de paz · 2 · a tempo': { intentos: 5, fallidos: 3, mejor: .86, dia: '2026-12-15' }, 'Salón de Bach · a tu ritmo': { intentos: 3, fallidos: 1, mejor: .9, dia: '2026-12-15' } };
    m.grab = { 'noche-0': { fecha: '2026-12-15', prec: .92, bpm: 72, titulo: 'Noche de paz', notas: [[67, 0], [69, .62], [67, .84], [64, 1.66], [67, 4.1], [69, 4.75], [67, 4.98], [64, 5.8]] }, 'jingle': { fecha: '2026-12-15', prec: 1, bpm: 80, notas: [[64, 0], [64, .75], [64, 1.5]] } };
    diaHoy5().cancion = 'noche'; GUARDA.guardar(); });
  // 1 la clave nueva (Salón) y 2–4 los villancicos
  const parada = async (id, k, ms, n, r, pre) => { await ev(([id, k, pre]) => { __mp3.pararNino(); if (pre) eval(pre); __mp3.paradaDirecta(id, k); __mp3.nino('bueno', 'midi', { errorP: 0 }); }, [id, k, pre || '']); await espera(ms); await cap(n, r); };
  await parada('salon', 3, 2500, '01-clave', 'La clave de sol, dibujada con trazo propio');
  await parada('teatro', 3, 7000, '02-noche', 'Teatro · Noche de paz en 3/4 (negra con punto, corchea)', "diaHoy5().cancion='noche'");
  await parada('teatro', 0, 9000, '03-venid', 'Teatro · Venid, fieles todos (anacrusa)', "diaHoy5().cancion='venid'");
  await parada('teatro', 3, 6500, '04-peces', 'Teatro · Los peces en el río (2/4)', "diaHoy5().cancion='peces'");
  await ev(() => { diaHoy5().cancion = 'noche'; });
  // 5 Belén con la música despierta (2 pedazos de Noche de paz → flauta y cuerdas)
  await ev(() => { __mp3.pararNino(); const B = LUGARES5.belen; B.auto = false; __mp3.ir('belen'); __mp3.revelarTodo(); }); await espera(1800); await cap('05-belen-musica', 'Belén: la música despierta (un instrumento por pedazo)');
  // 6–7 el duelo
  await ev(() => { __mp3.duelo(); __mp3.nino('bueno', 'midi', { errorP: 0 }); }); await espera(3400); await cap('06-duelo', 'Conservatorio · duelo de eco con el pastorcito');
  await ev(() => { __mp3.pararNino(); }); await espera(5200); await ev(() => { const P = PARADA5.conservatorio; P.corazones = 2; P.fx.estallar(276, 112, '#ff5a7a', 16); P.tropiezo = P.t; }); await espera(250); await cap('07-duelo-corazon', 'Duelo · un eco fallido cuesta un corazón');
  await ev(() => { irA(ESCENA_PREMIO5, { sinTransicion: true }); }); await espera(2600); await cap('08-premio', 'Insignia de la estrella + llave de enero');
  await ev(() => { const m = m2_(); m.insignias = { estrella: '2026-12-16' }; m.llaves = { enero: true }; __mp3.ir('mapa'); ESCENA_MAPA.entrar(); }); await espera(1500); await cap('09-mapa-maelzel', 'Mapa: Maelzel (enero) en silueta, con su llave');
  await ev(() => { __mp3.ir('belen'); __mp3.papas('informe'); }); await espera(900); await cap('10-informe', 'Papás · informe de la semana');
  await ev(() => { __mp3.papas('piano'); }); await espera(600); await cap('11-piano-voces', 'Papás · piano, calibración y voces');
  await ev(() => { MENU5.cerrar(); __mp3.carta(); }); await espera(5200); await cap('12-carta', 'Primer día (sin cambios, con voz de Bach)');
  fs.writeFileSync('/tmp/claude-0/lista-m3.json', JSON.stringify(L)); console.log(JSON.stringify({ capturas: L.length, errores: errs }));
  await b.close();
})();
