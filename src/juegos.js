// =====================================================================
//  M5 · EL JUEGO «INFINITO»: un generador de retos COHERENTE con lo aprendido (notas, figuras, tempo de la misión)
//  y con dificultad que sube por niveles. Edificios-juego que se repiten sin fin:
//  Torre de notas que caen · Casa del ritmo · Biblioteca de teoría · Arena del eco · Gimnasio de dedos
//  + Patio, Coro, Teatro y Taller libres (fuera de la misión).
// =====================================================================
function retoGen5(tipo, nivel = 0, semilla) {
  const P = plan5(), R = rngP5(semilla != null ? semilla : (Math.random() * 1e9) | 0), pick = L => L[Math.floor(R() * L.length)];
  const rit = P.ritmos.filter(r => tipo !== 'melodia' || nivel > 1 || r !== 'sh'), K = conocidas5().map(pc => NOTA_PC5[pc]).sort((a, b) => a - b);
  const bars = COMPASES5.filter(b => b.split(' ').every(c => rit.includes(c)));
  const nb = Math.min(4, 1 + Math.floor((nivel + 2) / 3)), salto = 1 + Math.floor(nivel / 4);
  const notas = []; let k = Math.floor(R() * K.length);
  if (tipo === 'dedos') {   // carreras de cinco dedos sobre lo que ya sabe (sube y baja)
    const sube = K.slice(0, Math.min(K.length, 5)), ida = sube.concat(sube.slice(0, -1).reverse()), fig = nivel >= 4 && rit.includes('taca') ? .5 : 1, largo = Math.max(4, Math.min(16, 4 + nivel * 2));
    for (let i = 0; i < largo; i++) notas.push({ n: ida[i % ida.length], d: fig }); notas.push({ n: ida[0], d: 2 }); return { notas, bpm: P.bpm };
  }
  for (let c = 0; c < nb; c++) { const b = (c === nb - 1 && bars.some(x => /taaan$/.test(x))) ? pick(bars.filter(x => /taaan$/.test(x))) : pick(bars);
    b.split(' ').forEach(cel => CELDAS5[cel].forEach(d => { if (d < 0) { notas.push({ n: 0, d: -d }); return; } notas.push({ n: tipo === 'ritmo' ? 64 : K[k], d }); if (tipo !== 'ritmo') { k = Math.max(0, Math.min(K.length - 1, k + Math.round((R() * 2 - 1) * salto))); } })); }
  if (notas[0].n === 0) notas[0] = { n: tipo === 'ritmo' ? 64 : K[0], d: notas[0].d };
  return { notas, bpm: Math.min(P.bpm + Math.min(12, nivel * 2), 96) };
}
// ---------- las paradas libres de los edificios-juego ----------
function definirJuegos5() {
  Object.assign(NOMBRE_PARADA5, { patioL: 'El Patio', coroL: 'El Coro', teatroL: 'El Teatro', tallerL: 'El Taller', ritmo: 'Casa del ritmo', gimnasio: 'Gimnasio de dedos', batalla: 'Arena del eco' });
  Object.assign(COLOR_PARADA5, { patioL: NC.FA, coroL: NC.SOL, teatroL: NC.DO, tallerL: NC.RE, ritmo: NC.DO, gimnasio: NC.RE });
  crearParada5('patioL', () => ({ libre: true, premio: 1, fondo: 'b-patio', pasos: [pasoPatio5(45)] }));
  crearParada5('coroL', () => { const M = motivos5(); return { libre: true, premio: 2, fondo: 'b-coro', pasos: M.slice(0, 5).map(m => pasoLectura5(m, 'ritmo', { introCanto: 2, corto: true })) }; });
  crearParada5('teatroL', P => Object.assign(teatroDelDia5(P), { libre: true, premio: 2, fondo: 'b-teatro', minimo: 0 }));
  crearParada5('tallerL', () => ({ libre: true, premio: 1, fondo: 'b-taller', pasos: [pasoTaller5(12)] }));
  // Casa del ritmo: pads, compases y figuras; cada nivel un compás más o un poco más de tempo
  crearParada5('ritmo', P => { const nv = nivelJuego5('ritmo'), pasos = [0, 1, 2, 3].map(i => { const r = retoGen5('ritmo', nv + Math.floor(i / 2)); return pasoLectura5(r.notas, i === 0 ? 'ritmo' : 'tempo', { pads: true, bpm: r.bpm, titulo: 'Casa del ritmo · nivel ' + (nv + 1) }); });
    return { libre: true, vidas: 3, premio: 2, fondo: 'b-teatro', pasos, alGanar: () => subirNivel5('ritmo', true) }; });
  // Gimnasio de dedos: velocidad sobre lo ya aprendido; el tempo sube cada vuelta (aquí sí puede pasar el de la canción)
  crearParada5('gimnasio', P => { const nv = nivelJuego5('gimnasio'), r = retoGen5('dedos', nv), b0 = Math.min(110, plan5().bpm + nv * 4);
    return { libre: true, vidas: 3, premio: 2, fondo: 'b-salon', pasos: [0, 1, 2, 3].map(i => pasoLectura5(r.notas, i ? 'tempo' : 'ritmo', { bpm: b0 + i * 6, sinTope: true, titulo: 'Gimnasio · ' + (b0 + i * 6) + ' por minuto' })), alGanar: () => subirNivel5('gimnasio', true) }; });
  // Arena del eco (antes «batalla con el rival»): motivos que crecen con el nivel; 3 corazones
  crearParada5('batalla', P => { P.ticPos = [100, 300, 4]; const nv = nivelJuego5('arena'), M = [0, 1, 2, 3].map(i => retoGen5('melodia', Math.max(0, nv - 2) + i, (Math.random() * 1e6) | 0).notas.slice(0, 3 + Math.min(5, nv + i)));
    return { libre: true, vidas: 3, premio: 3, fondo: 'b-conservatorio', pasos: M.map(m => pasoLectura5(m, 'ritmo', { introCanto: 1, voz: 'flauta', corto: true })), alGanar: () => subirNivel5('arena', true),
      decor: (P, ctx) => { const x = 1222, y = 596, toca = P.ticCanta > P.t; sombra(ctx, x, y, 30, .3); sprK(ctx, destacado5(sprPastorcito({ toca })), x, y, 4, { flip: true }); } }; });
}
// =====================================================================
//  BIBLIOTECA DE TEORÍA: adivina el nombre · figura ↔ duración y sonido · «¿cuál sonó?» · líneas y espacios.
//  8 preguntas por ronda, 3 corazones; las opciones y los tipos crecen con el nivel y con lo aprendido.
// =====================================================================
const SILABA_FIG5 = { negra: 'tan', blanca: 'taaan', corcheas: 'taca', silencio: 'sh', redonda: 'taaaaan' }, FIG_RITMO5 = { tan: 'negra', taaan: 'blanca', taca: 'corcheas', sh: 'silencio', taaaaan: 'redonda' };
function figuraSuelta5(ctx, tipo, x, y, s = 1, c = INK) {   // una figura suelta, dibujada grande y clara (cabeza inclinada, plica, barra)
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = c; ctx.strokeStyle = c; ctx.lineCap = 'round';
  const cabeza = (cx, cy, hueca) => { ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.35); ctx.beginPath(); ctx.ellipse(0, 0, 13, 9.5, 0, 0, 7); if (hueca) { ctx.lineWidth = 4.2; ctx.stroke(); } else ctx.fill(); ctx.restore(); };
  if (tipo === 'silencio') { silencioGlifo5(ctx, 0, -10, 48, c); }
  else if (tipo === 'corcheas') { cabeza(-22, 18, false); cabeza(22, 18, false); ctx.lineWidth = 3.6; ctx.beginPath(); ctx.moveTo(-10.5, 15); ctx.lineTo(-10.5, -42); ctx.moveTo(33.5, 15); ctx.lineTo(33.5, -42); ctx.stroke(); ctx.fillRect(-12.3, -46, 47.6, 9); }
  else { cabeza(0, 18, tipo !== 'negra'); if (tipo !== 'redonda') { ctx.lineWidth = 3.6; ctx.beginPath(); ctx.moveTo(11.5, 15); ctx.lineTo(11.5, -42); ctx.stroke(); } }
  ctx.restore();
}
function crearBiblioteca5() {
  const S = { dia: true, t: 0, fx: fx5(), padGolpe: [] }; S.reloj = () => S.t;
  const OPC = { y: 470, h: 96 };
  function pregunta() {
    const nv = nivelJuego5('biblioteca'), K = conocidas5().map(pc => NOTA_PC5[pc]), lv = plan5().lectura, rit = plan5().ritmos, nOp = Math.min(4, 2 + Math.floor(nv / 2));
    const tipos = ['figura']; if (K.length >= 2) tipos.push('nombre', 'cual'); else tipos.push('toca'); if (rit.length >= 2) tipos.push('cualRitmo'); if (lv >= 1 && K.length >= 2) tipos.push('linea');
    const tp = tipos[Math.floor(Math.random() * tipos.length)], mezclar = L => L.sort(() => Math.random() - .5);
    if (tp === 'figura') { const figs = rit.map(r => FIG_RITMO5[r]), f = figs[Math.floor(Math.random() * figs.length)], op = mezclar([f].concat(mezclar(figs.filter(x => x !== f)).slice(0, nOp - 1)));
      return { tp, txt: '¿Cómo suena esta figura?', fig: f, op: op.map(x => ({ t: SILABA_FIG5[x], v: x })), bien: f }; }
    if (tp === 'toca') return { tp, txt: 'Toca ' + NOMBRE_NOTA5(K[0]) + ' en el piano.', nota: K[0], op: [], bien: K[0] };
    if (tp === 'nombre' || tp === 'linea') { const n = K[Math.floor(Math.random() * K.length)], op = mezclar([n].concat(mezclar(K.filter(x => x !== n)).slice(0, nOp - 1)));
      if (tp === 'linea') { const p = paso(LETRA_EN5(n), 'sol'), enLinea = ((p % 2) + 2) % 2 === 0; return { tp, txt: '¿Esta nota está en una línea o en un espacio?', nota: n, op: [{ t: 'línea', v: true }, { t: 'espacio', v: false }], bien: enLinea }; }
      return { tp, txt: lv === 0 ? '¿Cómo se llama esta nota?' : '¿Qué nota es? (también la puedes tocar)', nota: n, color: nv < 3 || lv < 2, op: op.map(x => ({ t: NOMBRE_NOTA5(x), v: x, c: COLOR_NOTA5(x) })), bien: n }; }
    if (tp === 'cual') { const n = K[Math.floor(Math.random() * K.length)], op = mezclar([n].concat(mezclar(K.filter(x => x !== n)).slice(0, nOp - 1))); return { tp, txt: '¿Cuál sonó?', sonar: [{ n, d: 1.2 }], op: op.map(x => ({ t: NOMBRE_NOTA5(x), v: x, c: COLOR_NOTA5(x) })), bien: n }; }
    const pares = rit.filter(r => r !== 'sh').map(r => FIG_RITMO5[r]), f = pares[Math.floor(Math.random() * pares.length)], op = mezclar([f].concat(mezclar(pares.filter(x => x !== f)).slice(0, Math.min(nOp, pares.length) - 1)));
    return { tp: 'cualRitmo', txt: '¿Qué figura sonó?', sonar: CELDAS5[SILABA_FIG5[f]].map(d => ({ n: 64, d })), op: op.map(x => ({ fig: x, v: x })), bien: f };
  }
  function sonar(L) { let t = .2; const b = 60 / Math.min(80, tempoDia5()); L.forEach(x => { setTimeout(() => { if (ESC === S) SON5.nota(x.n, 84); }, t * 1000 / VEL5); t += x.d * b; }); }
  S.entrar = () => { S.t = 0; S.vidas = 3; S.ok = 0; S.k = 0; S.fin = null; S.fx.lista.length = 0; S.fondo = fotoInterior5('int-biblioteca'); S.q = pregunta(); S.q.t0 = 0; S.res = null; marca5('biblioteca nivel ' + (nivelJuego5('biblioteca') + 1)); if (S.q.sonar) sonar(S.q.sonar); voz5('anuncio-biblioteca', { forzar: true }); SON5.musica(null); };
  const posOp = k => { const n = S.q.op.length, w = n > 3 ? 210 : 250; return [LW5 / 2 + (k - (n - 1) / 2) * (w + 26) - w / 2, OPC.y, w, OPC.h]; };
  function responder(v) { if (S.res || S.fin) return; const ok = v === S.q.bien || (S.q.tp === 'nombre' && v % 12 === S.q.bien % 12); S.res = { t: S.t, ok, v };
    if (ok) { S.ok++; S.fx.estallar(LW5 / 2, 300, '#ffd046', 18); try { Snd.estrella(Math.min(2, S.ok % 3)); } catch (e) { } if (S.q.fig) sonar(CELDAS5[S.q.op.find(o => o.v === S.q.bien).t].map(d => ({ n: d < 0 ? 0 : 64, d: Math.abs(d) })).filter(x => x.n)); }
    else { S.vidas--; S.fx.estallar(276, 112, '#ff5a7a', 12); }
    if (S.vidas <= 0) { S.fin = { t: S.t + 1, gano: false }; subirNivel5('biblioteca', false); }
    else if (S.ok >= 8) { S.fin = { t: S.t + 1, gano: true }; const m = m2_(); m.corcheas += 2; GUARDA.guardar(); subirNivel5('biblioteca', true); } }
  S.dibujar = (ctx, dtR) => {
    const dt = pausado5() ? 0 : dtR; S.t += dt;
    if (S.res && S.t - S.res.t > 1.3 && !S.fin) { S.res = null; S.k++; S.q = pregunta(); S.q.t0 = S.t; if (S.q.sonar) sonar(S.q.sonar); }
    if (S.fin && S.t - S.fin.t > 2.6 && !S.fin.ido) { S.fin.ido = true; volverDeModo5(S); }
    ctx.drawImage(S.fondo, 0, 0); ctx.fillStyle = 'rgba(28,16,48,.45)'; ctx.fillRect(0, 0, LW5, LH5);
    // estantes de libros a los lados
    for (let s = 0; s < 2; s++) for (let f = 0; f < 4; f++) for (let b = 0; b < 7; b++) { const x = (s ? 1120 : 30) + b * 18, y = 170 + f * 90; ctx.fillStyle = ['#c23345', '#2a4b9b', '#2e8b6a', '#d9a930', '#7a3fc8'][(b + f * 3 + s) % 5]; ctx.fillRect(x, y, 15, 70 - (b * 7 + f) % 16); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(x, y + (b * 7 + f) % 16, 15, 70 - (b * 7 + f) % 16); }
    const q = S.q, x = 230, y = 130, w = 820, h = 300;
    rr(ctx, x + 8, y + 10, w, h, 24); ctx.fillStyle = '#2a1a3a'; ctx.fill(); rr(ctx, x, y, w, h, 24); ctx.fillStyle = '#fffaf4'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#2a1a3a'; ctx.stroke();
    titulo5(ctx, q.txt, LW5 / 2, y + 44, 34, '#2a1a3a');
    if (q.fig) figuraSuelta5(ctx, q.fig, LW5 / 2, y + 175, 1.8);
    if (q.tp === 'nombre' || q.tp === 'linea' || q.tp === 'toca') { const lv = plan5().lectura;
      if (lv === 0 && q.tp !== 'linea') { rr(ctx, LW5 / 2 - 70, y + 110, 140, 120, 18); ctx.fillStyle = COLOR_NOTA5(q.nota); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); }
      else pentagrama(ctx, LW5 / 2 - 230, y + 110, 460, 26, [{ n: LETRA_EN5(q.nota), f: 'redonda', c: q.color ? true : undefined, x: LW5 / 2 + 60 }], {}); }
    if (q.sonar) { const k = 1 + .08 * Math.sin(S.t * 8); ctx.save(); ctx.translate(LW5 / 2, y + 170); ctx.scale(k, k); texto(ctx, '♪)))', 0, 0, { tam: 80, c: '#5a7dff', borde: 8, bordeC: INK }); ctx.restore(); texto(ctx, 'toca aquí para oír otra vez', LW5 / 2, y + 260, { tam: 20, c: '#6b5a7d', peso: 600 }); }
    q.op.forEach((o, k) => { const [bx, by, bw, bh] = posOp(k), es = S.res && (o.v === q.bien), mala = S.res && !S.res.ok && o.v === S.res.v;
      rr(ctx, bx + 6, by + 8, bw, bh, 20); ctx.fillStyle = '#2a1a3a'; ctx.fill(); rr(ctx, bx, by, bw, bh, 20); ctx.fillStyle = es ? '#7fe08a' : mala ? '#ff9a9a' : (o.c || '#fffaf4'); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#2a1a3a'; ctx.stroke();
      if (o.fig) figuraSuelta5(ctx, o.fig, bx + bw / 2, by + bh / 2 - 6, .75); else titulo5(ctx, o.t, bx + bw / 2, by + bh / 2 + 2, 40, o.c ? '#fff8ec' : '#2a1a3a', o.c ? { borde: 7, bordeC: INK } : {}); });
    cinta5(ctx, 'Biblioteca de teoría', 44, 50, 330); for (let i = 0; i < 3; i++) corazon(ctx, 420 + i * 46, 50, 15, i < S.vidas ? '#ff5a7a' : 'rgba(251,241,216,.3)');
    texto(ctx, S.ok + ' / 8  ·  nivel ' + (nivelJuego5('biblioteca') + 1), LW5 - 250, 50, { tam: 26, c: '#fffaf4', borde: 6, bordeC: INK }); botonRedondo5(ctx, LW5 - 50, 48, 'salir');
    if (S.res) titulo5(ctx, S.res.ok ? '¡Eso es!' : 'Era: ' + (q.op.find(o => o.v === q.bien) || {}).t, LW5 / 2, y + h + 18, 34, S.res.ok ? '#7fe08a' : '#ffb0a0', { borde: 7, bordeC: INK });
    dibujarTeclado5(ctx); S.fx.dibujar(ctx, dt);
    if (S.fin && S.t > S.fin.t) { const t = S.t - S.fin.t; ctx.save(); ctx.fillStyle = 'rgba(28,16,48,.5)'; ctx.fillRect(0, 0, LW5, LH5); ctx.restore(); if (S.fin.gano) { rayosLuz5(ctx, LW5 / 2, 300, t); titulo5(ctx, '¡Nivel ' + (nivelJuego5('biblioteca') + 1) + '!  +2', LW5 / 2, 320, 64, '#ffd046', { borde: 9, bordeC: '#2a1a3a' }); } else for (let i = 0; i < 3; i++) corazon(ctx, LW5 / 2 - 60 + i * 60, 300, 26, 'rgba(251,241,216,.3)'); }
  };
  S.tocar = (x, y) => { if (Math.hypot(x - (LW5 - 50), y - 48) < 34) { volverDeModo5(S); return; } if (S.fin) return;
    for (let k = 0; k < S.q.op.length; k++) { const [bx, by, bw, bh] = posOp(k); if (x > bx && x < bx + bw && y > by && y < by + bh) { try { Snd.boton(); } catch (e) { } responder(S.q.op[k].v); return; } }
    if (S.q.sonar && y > 130 && y < 430 && x > 230 && x < 1050) { sonar(S.q.sonar); return; }
    const n = teclaEn(x, y); if (n != null) notaEntrante(n, 90, 'pantalla'); };
  S.nota = n => { if (S.fin || S.res) return null; if (S.q.tp === 'nombre' || S.q.tp === 'toca') { responder(n % 12 === S.q.bien % 12 ? S.q.bien : -1); return n % 12 === S.q.bien % 12 ? 'ok' : 'error'; } return null; };
  S.objetivo = () => { if (S.fin || S.res || S.t - (S.q.t0 || 0) < .8) return null; if (S.q.tp === 'nombre' || S.q.tp === 'toca') return { id: 'B' + S.k, n: S.q.bien, t: S.t + .1, reaccion: true }; const k = S.q.op.findIndex(o => o.v === S.q.bien); const [bx, by, bw, bh] = posOp(k); return { id: 'B' + S.k, toque: [bx + bw / 2, by + bh / 2], t: S.t + .1, reaccion: true }; };
  return S;
}
let ESCENA_BIBLIO5 = null;
