// Recorrido como niño: registra pasos, voces, clics y capturas.
// Uso: (cd web && python3 -m http.server 8765) y luego: node pruebas/recorrido-nino.js MINUTOS VEL bueno|aporrea FECHA CARPETA [pantalla|midi]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const A = process.argv.slice(2), MIN = +(A[0] || 12), VEL = +(A[1] || 1), TIPO = A[2] || 'bueno', FECHA = A[3] || '2026-12-02', OUT = A[4] || 'rec', FUENTE = A[5] || 'pantalla';
fs.mkdirSync(OUT, { recursive: true });
const espera = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
  const cx = await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }), pg = await cx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('http://localhost:8765/'); await espera(4000); await pg.reload(); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 90000 });
  await pg.evaluate(f => { localStorage.clear(); __mp3.fecha(f); }, FECHA);
  await espera(800); await pg.touchscreen.tap(260, 380);
  await pg.evaluate(() => {
    window.__R = { tics: [], cuentas: [], est: [] };
    const ti = SON5.ticEn.bind(SON5), cu = SON5.cuenta.bind(SON5);
    SON5.ticEn = (uno, at) => { __R.tics.push({ a: +(+at).toFixed(3), now: +KitSonido.ahora().toFixed(3) }); return ti(uno, at); };
    window.__V=[]; const dz = Voz5.decir.bind(Voz5); Voz5.decir = (c, o) => { const r = dz(c, o); if (!r) return r; const reg = Voz5.registro[Voz5.registro.length-1]; __V.push({ w: Date.now(), c: String(c), id: r, audio: !!(window.VOCES && VOCES[r]), t: textoDeVoz5(r, '') , esc: __mp3.dia().escena, k: ESC && ESC.k }); return r; };
    SON5.cuenta = (n, at, de) => { __R.cuentas.push({ n, a: +(+at).toFixed(3) }); return cu(n, at, de); };
  });
  await pg.evaluate(([t, f, v]) => { __mp3.nino(t, f); __mp3.vel(v); }, [TIPO, FUENTE, VEL]);
  const t0 = Date.now(); let ncap = 0, ultCap = 0;
  while ((Date.now() - t0) / 1000 < MIN * 60) {
    await espera(250);
    const e = await pg.evaluate(() => { const P = ESC, S = P && P.paso; let son = null; try { son = P && P.pulso && P.pulso.puedeSonar ? P.pulso.puedeSonar() : null; } catch (e) { }
      return { w: Date.now(), a: SON5.listo ? +KitSonido.ahora().toFixed(2) : 0, esc: __mp3.dia().escena, k: P && P.k, tipo: S && S.tipo, modo: S && S.modo, estado: S && S.estado, intento: S && S.intento, titulo: S && (S.titulo || S.t || S.id || S.nombre), son, bpm: P && P.pulso && P.pulso.bpm, dlg: window.DIALOGO5 && DIALOGO5.abierto ? String(DIALOGO5.texto || DIALOGO5.t || '').slice(0, 120) : '' }; });
    __last = e; fs.appendFileSync(OUT + '/estados.jsonl', JSON.stringify(e) + '\n');
    if (Date.now() - ultCap > 6000) { ultCap = Date.now(); await pg.screenshot({ path: `${OUT}/c${String(ncap++).padStart(3, '0')}.jpg`, quality: 55, type: 'jpeg' }); }
  }
  const fin = await pg.evaluate(() => ({ R: __R, voces: __V, dia: __mp3.dia(), guion: Object.fromEntries(Object.entries(window.GUION || {}).map(([k, v]) => [k, v.t])) }));
  fin.errs = errs.slice(0, 20); fs.writeFileSync(OUT + '/fin.json', JSON.stringify(fin));
  console.log('ok', ncap, 'capturas; errores', errs.length);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
var __last;
