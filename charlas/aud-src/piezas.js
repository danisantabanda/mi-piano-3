// =====================================================================
//  Charla 5 · audios horneados sin tiempo real (OfflineAudioContext) con kit-sonido.js de Mi Piano
//  Salamander Grand V3 (CC BY 3.0) desde /tmp/claude-0/piano/out/ ; lo demás, síntesis del kit
// =====================================================================
const SR = 44100, K = window.KitSonido;
const mtof = n => 440 * Math.pow(2, (n - 69) / 12);
const N = s => { const m = /^([A-G])(#|b)?(\d)$/.exec(s); return 12 * (+m[3] + 1) + { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); };
const MAN = { nombre: 'Salamander', notas: [], capas: [{ id: 'v6', hasta: 62 }, { id: 'v11', hasta: 100 }, { id: 'v15', hasta: 127 }], archivo: 'n{nota}_{capa}.ogg' };
for (let n = 36; n <= 96; n += 3) MAN.notas.push(n);
async function cargarPiano() { await K.piano.cargarManifiesto('/piano-out/', MAN); if (!Object.values(K.piano.zonas).some(z => z && z.length)) throw new Error('sin muestras Salamander'); }
// ---------- clavecín por Karplus-Strong (dos registros: 8' y 4') ----------
function clavecin(ctx, nota) {
  const n = Math.floor(SR * 1.8), out = new Float32Array(n), R = (() => { let s = nota * 9301 + 49297; return () => ((s = (s * 233280 + 49297) % 2147483647) / 2147483647) * 2 - 1; })();
  [[mtof(nota), 1], [mtof(nota) * 2, .42]].forEach(([f, amp]) => {
    const P = Math.max(2, Math.round(SR / f)), buf = new Float32Array(P);
    for (let i = 0; i < P; i++) buf[i] = R(); const dl = Math.max(1, Math.round(P * .12)); for (let i = P - 1; i >= dl; i--) buf[i] = buf[i] - .85 * buf[i - dl];   // punto de pulsación: timbre nasal
    const T60 = 2.4 - (nota - 48) * .03, rho = Math.pow(.001, 1 / (f * Math.max(.5, T60))); let k = 0;
    for (let i = 0; i < n; i++) { const a = buf[k], b = buf[(k + 1) % P]; out[i] += a * amp; buf[k] = (a * .62 + b * .38) * rho; k = (k + 1) % P; }
  });
  let pk = 0; for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(out[i])); for (let i = 0; i < n; i++) out[i] /= pk || 1;
  const ab = ctx.createBuffer(1, n, SR); ab.copyToChannel(out, 0); return ab;
}
function tocarBuf(ctx, buf, dest, t, v, dur) { const s = ctx.createBufferSource(); s.buffer = buf; const g = ctx.createGain(); g.gain.setValueAtTime(v, t); if (dur) g.gain.setTargetAtTime(0, t + dur, .05); s.connect(g); g.connect(dest); s.start(t); }
// ---------- el minueto en Sol (Petzold, BWV Anh. 114, dominio público): compases 1-4 y 7-8, a 80 negras ----------
const Q = 60 / 80;
const MINUETO_M = [   // [nota, inicio en negras, duración en negras]
  ['D5', 0, 1], ['G4', 1, .5], ['A4', 1.5, .5], ['B4', 2, .5], ['C5', 2.5, .5],
  ['D5', 3, 1], ['G4', 4, 1], ['G4', 5, 1],
  ['E5', 6, 1], ['C5', 7, .5], ['D5', 7.5, .5], ['E5', 8, .5], ['F#5', 8.5, .5],
  ['G5', 9, 1], ['G4', 10, 1], ['G4', 11, 1],
  ['F#4', 12, 1], ['G4', 13, .5], ['A4', 13.5, .5], ['B4', 14, .5], ['G4', 14.5, .5],
  ['A4', 15, 3],
];
const MINUETO_B = [['G2', 'D3', 'G3'], ['B2', 'D3', 'G3'], ['C3', 'E3', 'G3'], ['B2', 'D3', 'G3'], ['D3', 'A3', 'D3'], ['D2', 'A2', 'D3']];
const ESTRELLITA = [['C4', 1], ['C4', 1], ['G4', 1], ['G4', 1], ['A4', 1], ['A4', 1], ['G4', 2], ['F4', 1], ['F4', 1], ['E4', 1], ['E4', 1], ['D4', 1], ['D4', 1], ['C4', 2]];
const PIEZAS = {
  'au-ciudad-epoca': { seg: 14.6, fn: (ctx, B) => {
    const cv = ctx.createGain(); cv.gain.value = .55; cv.connect(B.musica.entrada); const cache = {};
    MINUETO_M.forEach(([n, a, d]) => { const k = N(n); cache[k] = cache[k] || clavecin(ctx, k); tocarBuf(ctx, cache[k], cv, .1 + a * Q, .8, d * Q + .9); });
    MINUETO_B.forEach((c, m) => c.forEach((n, k) => K.instrumentos.pizz(B.musica, N(n) - (k === 0 ? 0 : 0), .1 + (m * 3 + k) * Q, Q, k === 0 ? .9 : .6)));
    // clavecín de acompañamiento (acordes quebrados suaves en el 2 y el 3)
    MINUETO_B.forEach((c, m) => [1, 2].forEach(bt => { const k = N(c[2]) + 12; cache[k] = cache[k] || clavecin(ctx, k); tocarBuf(ctx, cache[k], cv, .1 + (m * 3 + bt) * Q, .25, Q * .9); }));
  }, niveles: { musica: -4 } },
  'au-ciudad-piano': { seg: 14.6, piano: true, fn: (ctx, B) => {
    MINUETO_M.forEach(([n, a, d], i) => K.instrumentos.piano(B.piano, N(n), .1 + a * Q, d * Q * .95, .55 + (a % 3 === 0 ? .12 : 0)));
    MINUETO_B.forEach((c, m) => { K.instrumentos.piano(B.piano, N(c[0]), .1 + m * 3 * Q, 3 * Q, .42); [1, 2].forEach(bt => K.instrumentos.piano(B.piano, N(c[1]) + 12, .1 + (m * 3 + bt) * Q, Q * .8, .3)); });
  } },
  'au-ciudad-chip': { seg: 14.6, fn: (ctx, B) => {
    MINUETO_M.forEach(([n, a, d]) => K.instrumentos.chip(B.musica, N(n), .1 + a * Q, d * Q * .85, .55, { ancho: 25 }));
    MINUETO_B.forEach((c, m) => c.forEach((n, k) => K.instrumentos.chip(B.musica, N(n) - 12 + 12, .1 + (m * 3 + k) * Q, Q * .5, .4, { ancho: 50 })));
    for (let bt = 0; bt < 18; bt++) { if (bt % 3 === 0) K.percusion.chipBombo(B.musica, .1 + bt * Q, .5); else K.percusion.chipRuido(B.musica, .1 + bt * Q, .3); }
  }, niveles: { musica: -4 } },
  'au-despierta': { seg: 13.4, piano: true, fn: (ctx, B) => {
    const I = K.instrumentos; let t = .1;
    ESTRELLITA.forEach(([n, d], i) => { I.piano(B.piano, N(n), t, d * Q * .95, .55); t += d * Q; });
    // + bajo a los 3 s, + cuerdas a los 6 s, + campanitas a los 9 s (cada 4 negras = 3 s)
    const acordes = [['C', 0], ['C', 2], ['F', 4], ['C', 6], ['F', 8], ['C', 10], ['G', 12], ['C', 14]], tri = { C: ['C3', 'E3', 'G3'], F: ['F3', 'A3', 'C4'], G: ['G3', 'B3', 'D4'] }, raiz = { C: 'C2', F: 'F2', G: 'G2' };
    acordes.forEach(([a, b]) => { const tt = .1 + b * Q; if (b >= 4) { I.bajo(B.banda, N(raiz[a]) + 12, tt, 2 * Q * .9, .32); } if (b >= 8) I.cuerdas(B.banda, tri[a].map(N).map(x => x + 12), tt, 2 * Q, .3); });
    [12, 13, 14, 15].forEach((b, k) => ['C6', 'G5', 'E6', 'C6'].forEach((n, q) => I.celesta(B.efectos, N(n), .1 + (b + q * .25) * Q, Q, .4)));
    ESTRELLITA.slice(9).forEach(() => { });
  }, niveles: { banda: -15, efectos: -12, piano: 0 } },
  'au-piano-salamander': { seg: 13.6, piano: true, fn: (ctx, B) => {
    let t = .2; const din = [.42, .46, .55, .6, .68, .72, .62, .5, .52, .5, .48, .44, .42, .36];
    ESTRELLITA.forEach(([n, d], i) => { K.instrumentos.piano(B.piano, N(n), t, d * Q * (d > 1 ? 1.1 : .92), din[i]); t += d * Q; });
    [['C3', 0], ['E3', 2], ['F3', 4], ['E3', 6], ['F3', 8], ['C3', 10], ['G2', 12], ['C3', 14]].forEach(([n, b], k) => K.instrumentos.piano(B.piano, N(n), .2 + b * Q, 2 * Q, .3));
    K.instrumentos.piano(B.piano, N('C2'), .2 + 14 * Q, 2.5 * Q, .3); K.instrumentos.piano(B.piano, N('G3'), .2 + 14 * Q + .02, 2.5 * Q, .25);
  } },
};
// ---------- aciertos sobre un loop suave en DO (C–F–G–C, 4 negras cada uno) ----------
function loopSuave(B) { const I = K.instrumentos, tri = [['C3', 'E3', 'G3'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C3', 'E3', 'G3']], raiz = ['C2', 'F2', 'G2', 'C2']; tri.forEach((c, k) => { I.pad(B.musica, c.map(N), .1 + k * 4 * Q, 4 * Q, .45); I.bajo(B.musica, N(raiz[k]) + 12, .1 + k * 4 * Q, 3.6 * Q, .5); for (let b = 0; b < 4; b++) K.percusion.escobilla(B.musica, .1 + (k * 4 + b) * Q, b % 2 ? .25 : .35); }); }
const ACIERTOS = [['E4', 2, ['C4', 'E4', 'G4']], ['A4', 6, ['F4', 'A4', 'C5']], ['B4', 10, ['G4', 'B4', 'D5']], ['C5', 14, ['C5', 'E5', 'G5']]];
PIEZAS['au-acierto-a'] = { seg: 12.6, piano: true, niveles: { musica: -15 }, fn: (ctx, B) => { loopSuave(B); ACIERTOS.forEach(([n, b]) => { const t = .1 + b * Q; K.instrumentos.piano(B.piano, N(n), t, Q, .62); K.instrumentos.celesta(B.efectos, N(n) + 24, t + .02, Q * .6, .35); [0, 1, 2].forEach(k => K.percusion.shaker(B.efectos, t + .03 + k * .04, .2)); }); } };
PIEZAS['au-acierto-b'] = { seg: 12.6, piano: true, niveles: { musica: -15 }, fn: (ctx, B) => { loopSuave(B); ACIERTOS.forEach(([n, b, ac]) => { const t = .1 + b * Q; K.instrumentos.piano(B.piano, N(n), t, Q, .62); ac.forEach((x, k) => { K.instrumentos.ep(B.efectos, N(x) + 12, t + Q * .5, Q * .45, .45); K.instrumentos.marimba(B.efectos, N(x) + 12, t + Q * .5 + .01, Q * .4, .35); }); }); } };
PIEZAS['au-acierto-c'] = { seg: 12.6, piano: true, niveles: { musica: -15 }, fn: (ctx, B) => { loopSuave(B); ACIERTOS.forEach(([n, b]) => { const t = .1 + b * Q; K.instrumentos.piano(B.piano, N(n), t, Q, .62); K.instrumentos.celesta(B.efectos, N('E6'), t + .05, Q, .5); K.instrumentos.celesta(B.efectos, N('B6'), t + .05, Q, .3); }); } };
// ---------- Tic marcando el pulso: 4 compases a 80 ----------
PIEZAS['au-tic-a'] = { seg: 12.4, fn: (ctx, B) => { for (let b = 0; b < 16; b++) K.clic(.1 + b * Q, b % 4 === 0, 1); }, niveles: { efectos: -2 } };
PIEZAS['au-tic-b'] = { seg: 12.4, fn: (ctx, B) => { for (let b = 0; b < 16; b++) { K.percusion.palitos(B.efectos, .1 + b * Q, b % 4 === 0 ? .8 : .55); if (b % 4 === 0) K.instrumentos.celesta(B.efectos, N('G6'), .1 + b * Q, Q, .45); } }, niveles: { efectos: -2 } };
PIEZAS['au-tic-c'] = { seg: 12.4, fn: (ctx, B) => { for (let b = 0; b < 16; b++) { K.percusion.timbal(B.efectos, .1 + b * Q, b % 4 === 0 ? .7 : .4, b % 4 === 0 ? 43 : 48); if (b % 4 === 0) K.percusion.bombo(B.efectos, .1 + b * Q, .35); } }, niveles: { efectos: -2 } };

async function renderPieza(id) {
  const P = PIEZAS[id], ctx = new OfflineAudioContext(2, Math.ceil(SR * P.seg), SR);
  K.iniciar({ contexto: ctx });
  Object.entries(P.niveles || {}).forEach(([b, db]) => K.nivel(b, db));
  if (P.piano) await cargarPiano();
  const B = { piano: K.bus('piano'), banda: K.bus('banda'), efectos: K.bus('efectos'), musica: K.bus('musica') };
  P.fn(ctx, B);
  const buf = await ctx.startRendering();
  const L = buf.getChannelData(0), R = buf.getChannelData(1), n = L.length, m = new Float32Array(n); let pk = 0;
  for (let i = 0; i < n; i++) { m[i] = (L[i] + R[i]) / 2; pk = Math.max(pk, Math.abs(m[i])); }
  const g = pk > 0 ? .89 / pk : 1; const fade = Math.floor(SR * .25);
  for (let i = 0; i < n; i++) { m[i] *= g; if (i > n - fade) m[i] *= (n - i) / fade; }
  // WAV 16 bits mono
  const dv = new DataView(new ArrayBuffer(44 + n * 2)), w = (o, s) => [...s].forEach((c, k) => dv.setUint8(o + k, c.charCodeAt(0)));
  w(0, 'RIFF'); dv.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true); dv.setUint32(24, SR, true); dv.setUint32(28, SR * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true); w(36, 'data'); dv.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) dv.setInt16(44 + i * 2, Math.max(-1, Math.min(1, m[i])) * 32767, true);
  const bytes = new Uint8Array(dv.buffer); let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return { wav: btoa(s), seg: P.seg, pico: pk, piano: K.piano.fuente };
}
