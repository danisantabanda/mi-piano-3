// Prueba M3: el preludio de Belén (varios días seguidos) con el niño simulado, y el duelo del Conservatorio.
// Uso: node pruebas/preludio.js [bueno|aporrea] [midi|pantalla] [vel] [--dias N] [--perfil sarah|david] [--salida archivo.json]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs');
const a = process.argv.slice(2), TIPO = a.find(x => /^(bueno|aporrea)$/.test(x)) || 'bueno', FUENTE = a.find(x => /^(midi|pantalla)$/.test(x)) || 'midi';
const VEL = +(a.find(x => /^\d+(\.\d+)?$/.test(x)) || 16), DIAS = +(a.includes('--dias') ? a[a.indexOf('--dias') + 1] : 10), PERFIL = a.includes('--perfil') ? a[a.indexOf('--perfil') + 1] : 'sarah';
const SAL = a.includes('--salida') ? a[a.indexOf('--salida') + 1] : null, TAM = (a.includes('--tam') ? a[a.indexOf('--tam') + 1] : '1280x800').split('x').map(Number);
const espera = ms => new Promise(r => setTimeout(r, ms));
const FECHAS = ['2026-12-01', '2026-12-02', '2026-12-03', '2026-12-04', '2026-12-08', '2026-12-09', '2026-12-10', '2026-12-11', '2026-12-15', '2026-12-16', '2026-12-17', '2026-12-18', '2026-12-22', '2026-12-23', '2026-12-24', '2026-12-29'];
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const pg = await (await b.newContext({ viewport: { width: TAM[0], height: TAM[1] }, hasTouch: true })).newPage();
  const errs = []; pg.on('pageerror', e => errs.push('pageerror: ' + e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push('error: ' + m.text()); });
  await pg.goto('file://' + path.join(__dirname, '..', 'MI-PIANO-3-M3.html')); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  await pg.evaluate(([f, p]) => { localStorage.clear(); __mp3.fecha(f); __mp3.perfil(p); }, [FECHAS[0], PERFIL]);
  await espera(500);
  const R = { tipo: TIPO, fuente: FUENTE, perfil: PERFIL, vel: VEL, dias: [] };
  const guardar = () => { if (SAL) fs.writeFileSync(SAL, JSON.stringify(Object.assign({}, R, { errores: errs.slice(0, 10) }), null, 1)); };
  for (let d = 0; d < DIAS; d++) {
    await pg.evaluate(([f, t, fu, v]) => { __mp3.fecha(f); __mp3.pararNino(); __mp3.empezar(); __mp3.nino(t, fu); __mp3.vel(v); }, [FECHAS[d], TIPO, FUENTE, VEL]);
    const t0 = Date.now(); let x;
    while (true) { await espera(1500); x = await pg.evaluate(() => __mp3.dia()); if ((x.escena === 'organo' && x.tFin) || x.completo) break; if ((Date.now() - t0) / 1000 * VEL > (TIPO === 'bueno' ? 30 : 12) * 60) break; }
    await pg.evaluate(() => __mp3.pararNino());
    const dom = Object.keys(x.m2.dominio).filter(k => x.m2.dominio[k].length >= 2);
    const extra = await pg.evaluate(() => { const L = SESION5.log.map(l => l.que), pasos = L.filter(q => / paso \d+ /.test(q)), prec = pasos.map(q => +(q.match(/(\d+)%/) || [0, 0])[1]), pl = plan5();
      return { plan: { notas: pl.notas.map(pc => NOMBRE_NOTA5(NOTA_PC5[pc])).join(' '), ritmos: pl.ritmos.join(' '), lectura: pl.lectura, bpm: pl.bpm, nuevo: pl.nuevo }, pasosEval: pasos.length, repetidos: pasos.filter(q => /otra vez/.test(q)).length, precMedia: prec.length ? Math.round(prec.reduce((a, b) => a + b, 0) / prec.length) : null, notasNuevas: L.filter(q => /nota nueva/.test(q)).map(q => q.replace('nota nueva ', '')) }; });
    R.dias.push({ fecha: FECHAS[d], cancion: x.cancion, organo: !!x.completo, min: x.tFin ? +((x.tFin - x.t0) / 60).toFixed(1) : null, paradas: Object.keys(x.paradas || {}).length, corcheas: x.corcheas, dominados: dom.length, dominadosLista: dom, donde: x.escena + ' paso ' + x.k, ...extra });
    console.log(JSON.stringify(R.dias[R.dias.length - 1])); guardar();
    if (TIPO === 'aporrea') break;
  }
  // el duelo del Conservatorio
  await pg.evaluate(([t, fu, v]) => { __mp3.duelo(); __mp3.nino(t, fu); __mp3.vel(v); }, [TIPO, FUENTE, Math.min(VEL, 10)]);
  const t1 = Date.now(); let y;
  while (true) { await espera(1000); y = await pg.evaluate(() => __mp3.dia()); if (y.m2.insignias.estrella || /duelo perdido/.test(JSON.stringify(y.log.slice(-3))) || (Date.now() - t1) / 1000 * 10 > 300) break; }
  R.duelo = { insignia: !!y.m2.insignias.estrella, llave: !!(y.m2.llaves || {}).enero, corazones: y.m2.corazones, log: y.log.filter(l => /duelo|conservatorio/.test(l.que)).map(l => l.que) };
  await espera(2500); R.voces = (await pg.evaluate(() => __mp3.voces())).map(v => v.id);
  R.musica = await pg.evaluate(() => { __mp3.pararNino(); __mp3.ir('belen'); return null; }); await espera(1500); R.musica = (await pg.evaluate(() => __mp3.dia())).musica;
  R.errores = errs.slice(0, 10); console.log(JSON.stringify({ duelo: R.duelo, musica: R.musica, voces: R.voces.length, errores: R.errores })); guardar();
  await b.close();
})();
