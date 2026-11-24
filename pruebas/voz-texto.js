// Prueba «voz = texto» (M7b · transparencia): cada vez que empieza una frase con voz, el texto que se muestra como habla
// en ese momento (globos, diálogo, anuncio de la parada, tarjeta, carta, saludos, «¡Otra vez!», tarjeta del lugar, despertar)
// debe decir exactamente lo mismo que la voz. Y en el guion: texto_pantalla = texto (salvo la grafía hablada «Baj» = «Bach»).
// Todas las frases del guion se dan por grabadas (manifiesto falso) y sin presupuesto, para que suenen todas las que se pueda.
// Uso: node pruebas/voz-texto.js   → { frasesOidas, conTexto, diferencias: [...] } y sale con 1 si hay alguna diferencia
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs');
const espera = ms => new Promise(r => setTimeout(r, ms));
const norm = s => (s || '').toLowerCase().replace(/\bbaj\b/g, 'bach').replace(/[¡!¿?.,:;…«»"“”()]/g, ' ').replace(/\s+/g, ' ').trim();
(async () => {
  // 1) el guion: lo que se oye y lo que se escribe
  const gs = ['guion-belen.json', 'guion-belen-2.json', 'guion-belen-3.json', 'guion-belen-4.json', 'guion-belen-5.json'].map(f => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'voz', f), 'utf8')));
  const guion = [].concat(...gs.map(g => g.frases)), difGuion = guion.filter(f => f.texto_pantalla && norm(f.texto_pantalla) !== norm(f.texto)).map(f => ({ id: f.id, voz: f.texto, pantalla: f.texto_pantalla }));
  // 2) el juego: escenas con voz
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const pg = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.join(__dirname, '..', 'MI-PIANO-3-M3.html')); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  const ev = (f, x) => pg.evaluate(f, x);
  await ev(() => {
    window.VOCES = {}; Object.keys(window.GUION).forEach(id => { window.VOCES[id] = { g: GUION[id].g, d: 2.5 }; });   // todas «grabadas»
    window.__oidas = []; Voz5.activa = true; GUARDA.d.voces = true;
    const norm = s => (s || '').toLowerCase().replace(/\bbaj\b/g, 'bach').replace(/[¡!¿?.,:;…«»"“”()]/g, ' ').replace(/\s+/g, ' ').trim();
    const mirar = (o) => { const ahora = performance.now(), vis = HABLA5.filter(x => ahora - x.t < 160 && x.esc === o.esc).map(x => x.txt); o.vistos.push(vis); };   /* solo lo de la misma escena */
    Voz5.oyentes.push(e => { if (!e || !e.id) return; const o = { esc: ESC, id: e.id, texto: e.texto, escena: (window.__mp3.escena && __mp3.escena()) || (ESC && ESC.id) || '', vistos: [] }; window.__oidas.push(o); [350, 900, 1500].forEach(ms => setTimeout(() => mirar(o), ms)); });
    setInterval(() => { Object.assign(Voz5, { ultimaInicio: -1e9, ultimaFin: -1e9, gastadas: 0, libreDesde: -1e9, gastadasLibre: 0 }); if (Voz5.estado) Voz5.estado.ultGrupo = {}; }, 100);   // sin presupuesto
  });
  const base = (mision = 0, extra = '') => ev(([n, x]) => { MENU5.cerrar(); __mp3.pararNino(); GUARDA.d.perfiles = {}; __mp3.perfil('sarah'); SON5.iniciar(); const m = m2_(); m.primerDia = true; m.corcheas = 24; m.mision = n; m.vistoDespertar = n; m.recorridoVisto = true; m.notasVistas = [64, 67, 60, 62, 65, 69, 71, 72, 74, 76, 77, 79]; if (x) (new Function(x))(); }, [mision, extra]);
  const enBelen = (i, j) => ev(([i, j]) => { const B = LUGARES5.belen; B.auto = false; B.alEntrar = null; B.extraHud = null; B.panel = null; irA(B, { sinTransicion: true, desde: [i, j], dir: 'arriba' }); }, [i, j]);
  // selector: los cuatro saludos
  for (const p of ['sarah', 'david', 'papa', 'mama']) { await base(0); await ev(() => __mp3.ir('selector')); await espera(300); await ev(p => { const S = ESCENA_SELECTOR, k = ['sarah', 'david', 'papa', 'mama'].indexOf(p); S.tocar(150 + k * 250 + 100, 214 + 150); }, p); await espera(1800); }
  // la carta (título, carta, Tic, traje, puerta)
  await base(0); await ev(() => { m2_().primerDia = false; irA(ESCENA_CARTA, { sinTransicion: true }); }); await espera(26000);
  // paradas del día y juegos: el anuncio, la presentación y el primer paso; el niño toca (bien y mal) para oír reacciones y «¡Otra vez!»
  const paradas = [['patio', 0], ['coro', 1], ['salon', 0], ['salon', 4], ['teatro', 1], ['taller', 2], ['conservatorio', 6], ['ritmo', 4], ['gimnasio', 9], ['batalla', 5], ['partituras', 8], ['kiosco', 9], ['concierto', 10]];
  for (const [id, m] of paradas) { await base(m); await ev(id => { if (PARADA5[id]) __mp3.paradaDirecta(id); }, id); await espera(7000); await ev(() => __mp3.nino('bueno', 'midi', { errorP: 0 })); await espera(9000); await ev(() => { __mp3.pararNino(); __mp3.nino('malo', 'midi'); }); await espera(8000); await ev(() => __mp3.pararNino()); }
  // la biblioteca, el museo y la torre
  for (const esc of ['ESCENA_BIBLIO5', 'ESCENA_MUSEO5', 'ESCENA_CAEN5']) { await base(9); await ev(e => { const S = eval(e); S.volver = { lugar: LUGARES5.belen }; irA(S, { sinTransicion: true }); }, esc); await espera(2500); }
  // los rincones del pueblo y las casas
  for (const r of ['pastor', 'campanas', 'vecina', 'pozo', 'posada', 'ovejas', 'ronda', 'estrella']) { await base(14); await enBelen(32, 35); await espera(3500); await ev(r => abrirRincon5(LUGARES5.belen, r), r); await espera(2200); }
  for (const t of ['panaderia', 'carpinteria', 'cuna', 'cuco', 'gallo', 'abuela', 'herreria', 'telar', 'lira']) { await base(3); await ev(t => { const B = LUGARES5.belen, o = B.objetos.find(x => x.casaK != null && TIPOS_CASA5[x.casaK % TIPOS_CASA5.length].id === t); entrarCasa5(B, o); }, t); await espera(1300); await ev(t => abrirRincon5(ESC, 'casa-' + t), t); await espera(2200); }
  // las tarjetas de los lugares (al entrar por la puerta)
  for (const l of ['salon', 'patio', 'coro', 'teatro', 'taller', 'conservatorio', 'torre', 'ritmo', 'biblioteca', 'arena', 'gimnasio', 'museo', 'kiosco', 'sala', 'luthier', 'casa']) { await base(14); await enBelen(32, 35); await espera(3500); await ev(l => { const B = LUGARES5.belen, o = B.objetos.find(x => x.lugar === l); if (o) B.entrarEdificio(o); }, l); await espera(1800); await ev(() => { if (ESC.panel) ESC.panel = null; }); }
  // Belén despierta (después de cada misión)
  for (let n = 1; n <= 14; n++) { await base(n); await ev(() => { m2_().vistoDespertar = m2_().mision - 1; }); await enBelen(21, 23); await espera(2600); }
  const oidas = await ev(() => window.__oidas.map(o => ({ id: o.id, texto: o.texto, escena: o.escena, vistos: o.vistos })));
  const dif = [], conTexto = new Set();
  oidas.forEach(o => { const vistos = [].concat(...o.vistos); if (!vistos.length) return; conTexto.add(o.id); if (!vistos.some(v => norm(v) === norm(o.texto))) dif.push({ id: o.id, voz: o.texto, pantalla: [...new Set(vistos)].slice(0, 3), escena: o.escena }); });
  const unicas = {}; dif.forEach(d => { unicas[d.id] = d; });
  const R = { frasesGuion: guion.length, difGuion, frasesOidas: new Set(oidas.map(o => o.id)).size, conTextoEnPantalla: conTexto.size, diferencias: Object.values(unicas), errores: errs.slice(0, 5) };
  console.log(JSON.stringify(R, null, 1));
  await b.close(); process.exit(R.diferencias.length || R.difGuion.length ? 1 : 0);
})();
