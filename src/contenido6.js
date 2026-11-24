// =====================================================================
//  M6 · CONTENIDO: repetición CON variación (nunca más de 3 iguales seguidas), banco de células dentro de lo aprendido,
//  y cada edificio del currículo con SU gracia: Coro = oído y voz · Salón = lo nuevo, Bach pregunta y tú respondes, lectura
//  · Teatro = actuar la canción de la semana (todo–parte–todo, con público y «¡otra vez, más rápido!») · Patio = pulso · Taller = inventar.
//  Kodály/Orff/Gordon (sonido antes que símbolo, eco, imitar→explorar→improvisar); práctica intercalada; actividades cortas.
//  Reemplaza definirParadas5 (va después de dia.js en el mismo script).
// =====================================================================
// ---------- «¡Otra vez!» (texto grande + voz) y el contador de repeticiones idénticas ----------
function avisoOtraVez5(P, txt, voz) { let v = null; try { v = voz5(voz, { forzar: true }) || voz5('ay-otra', { forzar: true }); } catch (e) { } P.otraVez = { t: P.t, txt: textoDeVoz5(v || voz, txt) }; marca5('otra vez: ' + txt); }
function dibujarOtraVez5(ctx, P) {
  const t = P.t - P.otraVez.t; if (t > 2.2) return; habla5(P.otraVez.txt); const q = Math.min(1, t * 5, (2.2 - t) * 4), s = 1 + Math.max(0, .25 - t) * 1.2;
  ctx.save(); ctx.globalAlpha = Math.max(0, q); ctx.translate(LW5 / 2, 112); ctx.scale(s, s); ctx.rotate(-.03);
  ctx.font = '700 40px Outfit'; const w = ctx.measureText(P.otraVez.txt).width + 60; ctx.restore();
  ctx.save(); ctx.globalAlpha = Math.max(0, q); ctx.translate(LW5 / 2, 112); ctx.scale(s, s); ctx.rotate(-.03); caja5(ctx, -w / 2, -36, w, 72, { r: 18, borde: 5, sombra: 7, fondo: NC.MI }); titulo5(ctx, P.otraVez.txt, 0, 2, 42, MK5); ctx.restore();
}
const REP5 = { firma: null, n: 0, max: 0 };
function contarRepeticion5(f) { if (f === REP5.firma) REP5.n++; else { REP5.firma = f; REP5.n = 1; } REP5.max = Math.max(REP5.max, REP5.n); if (REP5.n > 3) marca5('¡más de 3 iguales seguidas!'); }
// ---------- banco de células (todo dentro de lo aprendido) ----------
const CELULAS5 = [['rep3', 'tan tan tan taaan', 4], ['dosLarga', 'tan tan taaan', 4], ['larga', 'taaan taaan', 4], ['silFin', 'tan tan tan sh', 4], ['silMedio', 'tan sh tan sh', 4], ['silLarga', 'tan sh taaan', 4],
  ['larTan', 'taaan tan tan', 4], ['tacaL', 'taca taca taaan', 4], ['tacaM', 'tan taca tan sh', 4], ['tacaT', 'taca tan taca tan', 4], ['red', 'taaaaan', 4], ['redPre', 'tan tan tan tan', 4]];
function celula5(sil, notas) { const out = []; sil.split(' ').forEach((c, i) => CELDAS5[c].forEach(dd => out.push(dd < 0 ? { n: 0, d: -dd } : { n: notas[Math.min(i, notas.length - 1)], d: dd }))); if (out[0].n === 0) out[0] = { n: notas[0], d: out[0].d }; return out; }
// una secuencia que se DESARROLLA: tipos intercalados (nota repetida, dos y una larga, silencio en medio, cambio de nota, pregunta–respuesta…)
function secuencia5(d, cuantos = 8, semilla = 1) {
  const P = planDia5(d), R = rngP5(semilla * 977 + d * 31), K = P.notas.map(pc => NOTA_PC5[pc]), nueva = K[K.length - 1], vieja = K.length > 1 ? K[K.length - 2] : K[0], inv = K.length === 1 ? invitada5(d) : null;
  const ok = s => s.split(' ').every(c => P.ritmos.includes(c));
  const cel = CELULAS5.filter(c => ok(c[1])), nuevoR = P.ritmos[P.ritmos.length - 1], conNuevo = cel.filter(c => c[1].split(' ').includes(nuevoR));
  const out = []; let ult = '';
  for (let i = 0; i < cuantos; i++) {
    let c, tipo = i % 4;   // intercalar: 0 lo nuevo · 1 otra célula · 2 cambio de nota / octava · 3 pregunta–respuesta
    const pool = (tipo === 0 && conNuevo.length ? conNuevo : cel).filter(x => x[0] !== ult); c = pool[Math.floor(R() * pool.length)] || cel[0]; ult = c[0];
    const n = tipo === 0 ? nueva : K[Math.floor(R() * K.length)];
    if (tipo === 2) { if (inv) { const a = celula5(c[1], [K[0]]), b = celula5(c[1], [inv]); out.push({ id: c[0] + '-visita', notas: a.concat(b), compas: c[2], invitada: inv }); continue; }   // M8: con una sola nota, «una nota de visita» (la próxima del camino)
      if (K.length > 1) { const a = celula5(c[1], [vieja]), b = celula5(c[1], [nueva]); out.push({ id: c[0] + '-cambio', notas: a.concat(b), compas: c[2] }); continue; }
      out.push({ id: c[0] + '-octava', notas: celula5(c[1], [n + 12 <= 83 ? n + 12 : n]), compas: c[2], arriba: true }); continue; }
    if (tipo === 3) { const r2 = cel.filter(x => x[2] === c[2] && x[0] !== c[0]); const resp = r2.length ? r2[Math.floor(R() * r2.length)] : c; out.push({ id: c[0] + '-pr', pregunta: celula5(c[1], [n]), notas: celula5(resp[1], [K.length > 1 ? K[(K.indexOf(n) + 1) % K.length] : n]), compas: c[2] }); continue; }
    out.push({ id: c[0], notas: celula5(c[1], [n]), compas: c[2] });
  }
  return out;
}
// M8: la próxima nota del camino visita los días de una sola nota (para que no sea solo «mi, mi, mi»)
function invitada5(d) { const K0 = planDia5(d).notas; for (let k = d + 1; k < 20; k++) { const n = planDia5(k).notas.find(pc => !K0.includes(pc)); if (n != null) return NOTA_PC5[n]; } return null; }
function pasoVisita5(item, modo) { const s = pasoLectura5(item.notas, modo, { compas: item.compas, titulo: modo === 'espera' ? 'Nota de visita: ' + NOMBRE_NOTA5(item.invitada) : '…y ahora con el pulso' }), ini = s.iniciar;
  s.iniciar = P => { if (s.intento === 0) { vistas5(item.notas); TECLADO5.dedos = Object.assign({}, TECLADO5.dedos || {}, DEDO5[item.invitada] ? { [item.invitada]: DEDO5[item.invitada] } : {}); pista5(item.invitada, 3); if (modo === 'espera') avisoOtraVez5(P, '¡Llegó de visita ' + NOMBRE_NOTA5(item.invitada) + '!', 'visita-' + NOMBRE_NOTA5(item.invitada).toLowerCase()); } ini(P); }; return s; }
const VARIAS5 = [{ id: 'rapido', txt: '¡Otra vez! Un poquito más rápido' }, { id: 'banda', txt: '¡Otra vez! Ahora te acompaña la banda' }, { id: 'octava', txt: '¡Otra vez! Ahora arriba' }, { id: 'suave', txt: '¡Otra vez! Suavecito' }, { id: 'fuerte', txt: '¡Otra vez! Fuerte' }, { id: 'tuEmpiezas', txt: '¡Ahora tú empiezas y Tic responde!' }];
// el mismo ítem, cambiando UNA cosa (y anunciándolo)
function pasoVariado5(item, vi, extra = {}) {
  const V = VARIAS5[vi % VARIAS5.length], o = Object.assign({ compas: item.compas, titulo: extra.titulo }, extra, { var: V }); let notas = item.notas;
  if (V.id === 'rapido') { o.bpm = tempoDia5() + 6; o.sinTope = true; }
  if (V.id === 'banda') { o.base = true; o.acordes = ['C', 'C', 'F', 'G']; }
  if (V.id === 'octava') { notas = notas.map(x => x.n && x.n + 12 <= 83 ? { n: x.n + 12, d: x.d } : x); vistas5(notas); }
  if (V.id === 'suave' || V.id === 'fuerte') o.din = V.id;
  return pasoLectura5(notas, 'tempo', o);
}
function vistas5(notas) { const m = m2_(); if (!m) return; m.notasVistas = m.notasVistas || []; notas.forEach(x => { if (x.n && !m.notasVistas.includes(x.n)) m.notasVistas.push(x.n); }); }
// =====================================================================
//  CORO = OÍDO Y VOZ: «¿subió o bajó?», «¿igual o diferente?», canta y encuéntrala en el piano, eco cantado
// =====================================================================
function pasoOido5(tipo) {
  const S = { tipo: 'oido', eval: true, o: { corto: true, titulo: tipo === 'sube' ? '¿Subió o bajó?' : '¿Igual o diferente?' }, intento: 0, modo: 'oido' };
  const BT = [[LW5 / 2 - 280, 420, 250, 120], [LW5 / 2 + 30, 420, 250, 120]];
  S.iniciar = P => { S.intento++; S.listo = false; S.res = null; S.finEn = 0; if (S.intento === 1) voz5(tipo === 'sube' ? 'coro-sube' : 'coro-igual', { forzar: true });
    if (tipo === 'sube') { const esc = [60, 62, 64, 65, 67, 69, 71, 72], a = Math.floor(Math.random() * 5), salto = 2 + Math.floor(Math.random() * 3), sube = Math.random() < .5; const n1 = esc[sube ? a : a + salto], n2 = esc[sube ? a + salto : a];
      S.ev = [{ n: n1, d: .7 }, { n: n2, d: .9 }]; S.bien = n2 > n1 ? 0 : 1; S.op = ['↑ subió', '↓ bajó']; }
    else { const cel = CELULAS5.filter(c => c[2] === 4 && c[1].split(' ').every(x => ['tan', 'taaan', 'taca', 'sh'].includes(x))).map(c => celula5(c[1], [64])), a = cel[Math.floor(Math.random() * cel.length)]; let b = a; const igual = Math.random() < .45; if (!igual) { const otras = cel.filter(x => JSON.stringify(x) !== JSON.stringify(a)); b = otras[Math.floor(Math.random() * otras.length)]; }
      S.ev = a.map(x => ({ n: x.n, d: x.d, fila: 0 })).concat([{ n: 0, d: 1, fila: -1 }], b.map(x => ({ n: x.n, d: x.d, fila: 1 }))); S.bien = igual ? 0 : 1; S.op = ['= igual', '≠ diferente']; S.filas = [a, b]; }
    programar(P); };
  function programar(P) { let t = P.t + .6; const bt = 60 / Math.min(84, tempoDia5() + 10); S.sonido = S.ev.map(e => { const r = { t, e }; t += e.d * bt; return r; }); S.tResp = t + .1; S.i = 0; }
  S.paso = (P) => { while (S.i < S.sonido.length && P.t >= S.sonido[S.i].t) { const e = S.sonido[S.i++].e; if (e.n) { if (tipo === 'sube') { SON5.ticCanta(e.n - 12, .6); SON5.nota(e.n, 60); } else SON5.palma(.8); } P.ticCanta = P.t + .3; S.brilla = P.t; }
    if (S.finEn && P.t >= S.finEn) { S.finEn = 0; S.listo = true; } };
  function responder(P, v) { if (S.res || P.t < S.tResp) return; const ok = v === S.bien; S.res = { t: P.t, ok, v }; S.prec = ok ? 1 : .8; S.finEn = P.t + 1.3; if (ok) { P.fx.estallar(BT[v][0] + 125, 470, NC.SOL, 22); ticPita5('feliz'); } else { const b = BT[S.bien]; P.fx.estallar(b[0] + 125, 470, '#ffd046', 10); } marca5('coro oído ' + tipo + (ok ? ' bien' : ' (era la otra)')); }
  S.tocar = (P, x, y) => { BT.forEach(([bx, by, bw, bh], k) => { if (x > bx && x < bx + bw && y > by && y < by + bh) responder(P, k); }); if (y < 400 && y > 140 && !S.res && P.t >= S.tResp) programar(P); };
  S.nota = () => null;
  S.objetivo = P => S.res || P.t < S.tResp ? null : { id: 'O' + S.intento + S.tResp.toFixed(2), toque: [BT[S.bien][0] + 125, BT[S.bien][1] + 60], t: P.t + .15, reaccion: true };
  S.dibujar = (P, ctx) => {
    caja5(ctx, 250, 140, 780, 250, { r: 22, borde: 5, sombra: 8, cab: NC.SOL, cabH: 18 });
    titulo5(ctx, S.o.titulo, LW5 / 2, 194, 40, MK5);
    if (tipo === 'sube') { [0, 1].forEach(k => { const s = S.sonido && S.sonido[k], on = s && P.t >= s.t, e = S.ev[k], y = 330 - (e.n - 60) * 7; if (!on) return; ctx.save(); rr(ctx, LW5 / 2 - 140 + k * 200, y - 26, 80, 52, 14); ctx.fillStyle = S.res ? COLOR_NOTA5(e.n) : '#e9e4ee'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = MK5; ctx.stroke(); ctx.restore(); });
      if (S.sonido && P.t >= S.sonido[1].t) { ctx.save(); ctx.strokeStyle = MK5; ctx.lineWidth = 4; ctx.setLineDash([6, 8]); const y1 = 330 - (S.ev[0].n - 60) * 7, y2 = 330 - (S.ev[1].n - 60) * 7; ctx.beginPath(); ctx.moveTo(LW5 / 2 - 60, y1); ctx.lineTo(LW5 / 2 + 60, y2); ctx.stroke(); ctx.restore(); } }
    else (S.filas || []).forEach((f, k) => { let x = LW5 / 2 - 190; const y = 252 + k * 66; f.forEach((e, i) => { const idx = k === 0 ? i : S.filas[0].length + 1 + i, on = S.sonido && S.sonido[idx] && P.t >= S.sonido[idx].t; ctx.save(); rr(ctx, x, y, e.d * 92 - 8, 44, 12); ctx.globalAlpha = on ? 1 : .25; ctx.fillStyle = e.n ? NC.MI : '#fff'; ctx.fill(); ctx.lineWidth = 3.5; ctx.strokeStyle = MK5; if (!e.n) ctx.setLineDash([5, 5]); ctx.stroke(); ctx.restore(); x += e.d * 92; }); });
    if (P.t < S.tResp) texto(ctx, 'escucha…', LW5 / 2, 372, { tam: 24, c: MARCA5.tinta2, peso: 700 }); else if (!S.res) texto(ctx, 'toca aquí arriba para oír otra vez', LW5 / 2, 372, { tam: 20, c: MARCA5.tinta2, peso: 600 });
    BT.forEach(([bx, by, bw, bh], k) => { const es = S.res && k === S.bien, mal = S.res && !S.res.ok && k === S.res.v; caja5(ctx, bx, by, bw, bh, { r: 20, borde: 5, sombra: 7, fondo: es ? '#7fe08a' : mal ? '#ff9a9a' : P.t >= S.tResp ? MARCA5.papel : MARCA5.gris }); titulo5(ctx, S.op[k], bx + bw / 2, by + bh / 2 + 2, 44, MK5); });
  };
  return S;
}
// canta y encuéntrala: Tic canta una nota que ya sabes; la buscas en el piano
function pasoEncontrar5() {
  const S = { tipo: 'encontrar', eval: true, o: { corto: true, titulo: 'Canta y encuéntrala' }, intento: 0, modo: 'encontrar' };
  S.iniciar = P => { S.intento++; S.listo = false; S.errores = 0; S.res = null; if (S.intento === 1) voz5('coro-encontrar', { forzar: true }); const K = conocidas5().map(pc => NOTA_PC5[pc]); S.n = K[Math.floor(Math.random() * K.length)]; S.tCanta = [P.t + .5, P.t + 1.6]; S.i = 0; S.tResp = P.t + 2.4; S.finEn = 0; };
  S.paso = P => { while (S.i < 2 && P.t >= S.tCanta[S.i]) { S.i++; SON5.ticCanta(S.n, .8); P.ticCanta = P.t + .8; } if (S.finEn && P.t >= S.finEn) { S.finEn = 0; S.listo = true; } };
  S.nota = (P, n) => { if (S.res) return null; if (n % 12 === S.n % 12) { S.res = { t: P.t, ok: true }; S.prec = Math.max(.8, 1 - S.errores * .1); S.finEn = P.t + 1.1; SON5.acorde(n); P.fx.estallar(xDeTecla(n), 560, COLOR_NOTA5(n), 22); marca5('coro encontrar ' + NOMBRE_NOTA5(n)); return 'ok'; }
    S.errores++; if (S.errores >= 2) pista5(S.n, 2); if (S.errores === 1) setTimeout(() => SON5.ticCanta(S.n, .7), 300 / VEL5); return 'error'; };
  S.objetivo = P => S.res || P.t < S.tResp ? null : { id: 'E' + S.intento + S.tResp.toFixed(2), n: S.n, t: S.tResp, reaccion: true };
  S.dibujar = (P, ctx) => { caja5(ctx, 330, 150, 620, 230, { r: 22, borde: 5, sombra: 8, cab: NC.SOL, cabH: 18 }); titulo5(ctx, P.t < S.tResp ? 'Escucha y canta con Tic' : '¡Ahora búscala en el piano!', LW5 / 2, 210, 38, MK5);
    const k = 1 + .12 * Math.sin(P.t * 9) * (P.ticCanta > P.t ? 1 : 0); ctx.save(); ctx.translate(LW5 / 2, 300); ctx.scale(k, k); figura5c(ctx, 'negra', 0, 22, 22, { color: S.res ? COLOR_NOTA5(S.n) : '#e9e4ee' }); ctx.restore(); if (S.res) texto(ctx, NOMBRE_NOTA5(S.n), LW5 / 2 + 110, 300, { tam: 46, c: MK5, peso: 700 }); };
  return S;
}

// =====================================================================
//  M8 · «Bach lo muestra»: la mini intro de lo nuevo del día. La nota nueva (con la mano y el dedo sobre su tecla)
//  y los ritmos nuevos (la barra baja a la tecla mientras suena). Solo la primera vez; texto = voz (guion-belen-8).
// =====================================================================
function loNuevo5(d) { const a = planDia5(d), b = d > 0 ? planDia5(d - 1) : { notas: [], ritmos: [] };
  return { notas: a.notas.filter(pc => !b.notas.includes(pc)).map(pc => NOTA_PC5[pc]), ritmos: a.ritmos.filter(r => !b.ritmos.includes(r)) }; }
const MUESTRA_DUR5 = { tan: 1, taaan: 2, sh: 1, taca: .5, taaaaan: 4 };
function pasoMuestra5(d) {
  const N = loNuevo5(d), fases = [];
  /* la nota nueva ya tiene su tarjeta (con la mano, el dedo y Bach que la canta): aquí solo los ritmos */ if (false) N.notas.forEach(n => fases.push({ tipo: 'nota', n, voz: 'muestra-nota-' + NOMBRE_NOTA5(n).toLowerCase(), txt: 'Esta es ' + NOMBRE_NOTA5(n) + '. Pon aquí ' + (DEDO5[n] ? 'tu dedo ' + DEDO5[n] : 'un dedo') + ' y tócala.' }));
  const n0 = N.notas[0] || NOTA_PC5[planDia5(d).notas[0]];
  N.ritmos.forEach(r => fases.push({ tipo: 'ritmo', r, n: n0, voz: 'muestra-' + r, txt: { tan: 'Corto: tan.', taaan: 'Largo: taaan.', sh: 'Sh: el silencio no se toca.', taca: 'Taca: dos notas en un pulso.', taaaaan: 'Muy largo: taaaaan.' }[r] || r }));
  const S = { eval: false, tipo: 'muestra', o: { corto: true }, fases, i: 0 };
  const fase = () => S.fases[S.i];
  function empezarFase(P) { const f = fase(); if (!f) { S.listo = true; return; } f.t0 = P.t; f.ok = false; const v = voz5(f.voz, { forzar: true }); f.txtV = textoDeVoz5(v || f.voz, f.txt);
    if (f.tipo === 'nota') { TECLADO5.dedos = Object.assign({}, TECLADO5.dedos || {}, DEDO5[f.n] ? { [f.n]: DEDO5[f.n] } : {}); pista5(f.n, 30); }
    else { const b = 60 / tempoDia5(); f.ev = []; let t = P.t + .8; const golpes = f.r === 'taca' ? [.5, .5] : [MUESTRA_DUR5[f.r] || 1]; golpes.forEach(g => { f.ev.push({ t, d: g }); t += g * b; }); f.fin = t + 1.2; f.k = 0; } }
  S.iniciar = P => { S.i = 0; S.listo = false; if (!S.fases.length) { S.listo = true; return; } empezarFase(P); };
  S.paso = P => { const f = fase(); if (!f) return;
    if (f.tipo === 'ritmo') { const b = 60 / tempoDia5(); while (f.k < f.ev.length && P.t >= f.ev[f.k].t) { const e = f.ev[f.k++]; if (f.r !== 'sh') { SON5.nota(f.n, 80); pista5(f.n, e.d * b * .9); } P.ticCanta = P.t + e.d * b; } if (P.t >= f.fin) { S.i++; empezarFase(P); } }
    else if (f.ok && P.t - f.ok > 1.2) { delete TECLADO5.pistas[f.n]; S.i++; empezarFase(P); } };
  S.nota = (P, n) => { const f = fase(); if (!f || f.tipo !== 'nota' || f.ok) return null; if (n % 12 === f.n % 12) { f.ok = P.t; SON5.acorde(n); P.fx.estallar(xDeTecla(n), 560, COLOR_NOTA5(n), 26); return 'ok'; } pista5(f.n, 30); return 'error'; };
  S.tocar = (P, x, y) => { const f = fase(); if (f && f.tipo === 'ritmo' && P.t - f.t0 > 1) { f.fin = Math.min(f.fin, P.t); } };
  S.objetivo = P => { const f = fase(); return f && f.tipo === 'nota' && !f.ok && P.t - f.t0 > 1.2 ? { id: 'M' + S.i + f.t0.toFixed(2), n: f.n, t: f.t0 + 1.4, reaccion: true } : null; };
  S.dibujar = (P, ctx) => { const f = fase(); if (!f) return; if (f.tipo === 'ritmo') { caja5(ctx, 250, 140, 780, 330, { r: 22, borde: 5, sombra: 8, cab: COLOR_NOTA5(f.n), cabH: 18 }); titulo5(ctx, f.txtV || f.txt, LW5 / 2, 210, 40, MK5); } else burbuja5(ctx, 330, 160, 700, f.txtV || f.txt, P.t - f.t0, { cola: [940, 400], colaDx: 130 });
    const x = xDeTecla(f.n), y0 = TECLADO5.y;
    if (f.tipo === 'nota') { const yb = y0 - 70 + Math.sin(P.t * 5) * 8;   // la mano: un dedo grande con su número que apunta a la tecla
      ctx.save(); caja5(ctx, x - 34, yb - 44, 68, 68, { r: 34, borde: 5, sombra: 5, fondo: COLOR_NOTA5(f.n) }); titulo5(ctx, String(DEDO5[f.n] || '☝'), x, yb - 8, 38, MK5);
      ctx.fillStyle = MK5; ctx.beginPath(); ctx.moveTo(x - 14, yb + 26); ctx.lineTo(x + 14, yb + 26); ctx.lineTo(x, yb + 48); ctx.fill(); ctx.restore();
      titulo5(ctx, NOMBRE_NOTA5(f.n), LW5 / 2, 470, 64, MK5); }
    else { const b = 60 / tempoDia5(), pxb = 120; let xx = LW5 / 2 - (f.ev.reduce((a, e) => a + e.d, 0) * pxb) / 2;   // las barras: crecen mientras suenan y bajan hacia la tecla
      f.ev.forEach(e => { const on = P.t >= e.t, q = on ? Math.min(1, (P.t - e.t) / (e.d * b)) : 0, w = e.d * pxb - 10; ctx.save(); ctx.globalAlpha = on ? 1 : .25; rr(ctx, xx, 300, w * Math.max(.08, q), 60, 14); ctx.fillStyle = f.r === 'sh' ? '#fff' : COLOR_NOTA5(f.n); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = MK5; if (f.r === 'sh') ctx.setLineDash([6, 6]); ctx.stroke(); ctx.restore(); xx += e.d * pxb; });
      texto(ctx, f.r, LW5 / 2, 420, { tam: 40, c: MK5, peso: 700 }); } };
  return S;
}
// =====================================================================
//  LAS PARADAS (cada una con su gracia)
// =====================================================================
function definirParadas5() {
  // PATIO = cuerpo y pulso: respirar con Tic, marchar con el pulso y tocar libre
  crearParada5('patio', () => ({ pasos: [pasoPatio5(60)], estrellas: P => P.ganadasPatio || 0, corcheas: P => P.ganadasPatio || 0 }));
  // CORO = oído y voz
  crearParada5('coro', () => { const d = diaPlan5(), Q = secuencia5(d, 4, 5), K = conocidas5();
    if (K.length === 1) { const E = secuencia5(d, 8, 11).filter(q => !q.pregunta && !q.invitada);   // M8: con una nota, cantar MI y eco de ritmos; «¿sube o baja?» llega con la segunda nota
      const eco = i => pasoLectura5((E[i % E.length] || Q[1]).notas, 'ritmo', { introCanto: 2, corto: true, compas: 4 });
      return { pasos: [eco(0), pasoEncontrar5(), pasoOido5('igual'), eco(1), pasoVariado5(Q[1], 2, { corto: true }), eco(2)], repaso: i => [pasoOido5('igual'), eco(3 + i)][i % 2], minimo: 100, decor: (P, ctx) => coroDecor5(P, ctx) }; }
    return { pasos: [pasoLectura5(Q[1].notas, 'ritmo', { introCanto: 2, corto: true, compas: Q[1].compas }), pasoOido5('sube'), pasoEncontrar5(), pasoOido5('igual'), pasoVariado5(Q[1], 2, { corto: true }), pasoOido5('sube')],
      repaso: i => [pasoOido5('igual'), pasoEncontrar5(), pasoOido5('sube')][i % 3], minimo: 100, decor: (P, ctx) => coroDecor5(P, ctx) }; });
  // SALÓN DE BACH = lo nuevo: Bach presenta, tú lo pruebas (escalera corta), Bach pregunta y tú respondes, variaciones, lectura
  crearParada5('salon', P => { P.ticPos = [100, 300, 4];
    const pl = plan5(), d = diaPlan5(), Q = secuencia5(d, 10, 3), base = Q[0], pasos = [pasoDialogo5('bach', pl.dice, 'salon-dia-' + pl.dia)];
    { const m = m2_(), clave = 'muestra-' + d; if (m && !(m.muestras || {})[clave]) { const mu = pasoMuestra5(d), i0 = mu.iniciar; mu.iniciar = P => { m.muestras = m.muestras || {}; m.muestras[clave] = true; i0(P); }; if (mu.fases.length) pasos.push(mu); } }   // M8: Bach lo muestra (solo la primera vez)
    const pregunta = (q) => { const s = pasoLectura5(q.pregunta, 'escucha', { veces: 1, compas: q.compas, titulo: 'Bach pregunta…' }), ini = s.iniciar; s.iniciar = P => { if (s.intento === 0) voz5('salon-pregunta', { forzar: true }); ini(P); }; return s; };
    if (conocidas5().length === 1) {   // M8: días de una sola nota: 5–6 rondas, cada dos cambia algo grande, y una nota de visita
      const vis = Q.find(q => q.invitada), pr = Q.find(q => q.pregunta), otra = Q.find(q => !q.pregunta && !q.invitada && q !== base) || base;
      pasos.push(pasoLectura5(base.notas, 'escucha', { veces: 1, compas: base.compas }), pasoLectura5(base.notas, 'espera', { compas: base.compas }), pasoLectura5(base.notas, 'tempo', { clave: 'ritmo-dia-' + pl.dia, compas: base.compas }), pasoVariado5(base, 1));
      if (vis) pasos.push(pasoVisita5(vis, 'espera'), pasoVisita5(vis, 'tempo'));
      if (pr) pasos.push(pregunta(pr), pasoLectura5(pr.notas, 'tempo', { compas: pr.compas, titulo: '…y tú respondes' }));
      pasos.push(pasoVariado5(otra, 5));
      return { decor: (P, ctx) => { const x = 1218, y = 592 + Math.sin(RELOJ * 2) * 1.5; sombra(ctx, x, y, 34, .3); dibujarBachParada7(ctx, x, y, 3); }, pasos, minimo: 0 }; }
    pasos.push(pasoLectura5(base.notas, 'escucha', { veces: 1, compas: base.compas }), pasoLectura5(base.notas, 'espera', { compas: base.compas }), pasoLectura5(base.notas, 'tempo', { clave: 'ritmo-dia-' + pl.dia, compas: base.compas }), pasoVariado5(base, 0));
    let vi = 1; Q.slice(1, 6).forEach(q => { if (q.pregunta) { pasos.push(pregunta(q), pasoLectura5(q.notas, 'tempo', { compas: q.compas, titulo: '…y tú respondes' })); }
      else { pasos.push(pasoLectura5(q.notas, 'tempo', { compas: q.compas })); if (q.id.indexOf('-') < 0) pasos.push(pasoVariado5(q, vi++)); } });
    return { decor: (P, ctx) => { const x = 1218, y = 592 + Math.sin(RELOJ * 2) * 1.5; sombra(ctx, x, y, 34, .3); dibujarBachParada7(ctx, x, y, 3); },
      pasos, repaso: i => { const q = secuencia5(d, 4, 40 + i)[i % 4]; return q.pregunta ? pasoLectura5(q.notas, 'tempo', { compas: q.compas, titulo: '…y tú respondes' }) : pasoVariado5(q, i + 1); }, minimo: 150 }; });
  // TEATRO = actuar la canción de la semana: todo (escuchar con el público) → por partes → todo con la banda → ¡otra vez, más rápido!
  crearParada5('teatro', P => { const cfg = teatroDelDia5(P), id = P.cancion, V = VILLANCICOS5[id], ver = versionDe5(id), todas = [], ac = []; ver.forEach(k => { todas.push(...V.pedazos[k].notas); ac.push(...V.pedazos[k].ac); });
    const todo0 = pasoLectura5(todas, 'escucha', { veces: 1, compas: V.compas, bpm: V.bpm, anac: V.pedazos[ver[0]].anac || 0, titulo: V.titulo + ' · toda (escucha)', base: true, acordes: ac }), i0 = todo0.iniciar; todo0.iniciar = P => { if (todo0.intento === 0) voz5('teatro-todo', { forzar: true }); i0(P); };
    let pasos = [todo0].concat(cfg.pasos);
    if (conocidas5().length === 1) {   // M8: días de una sola nota: escuchar toda, el ritmo del primer pedazo en los tambores y tocarlo en MI con la banda
      const k0 = ver[0], pz = V.pedazos[k0], o = { compas: V.compas, bpm: V.bpm, anac: pz.anac || 0, titulo: V.titulo + ' · 1' }, MI = NOTA_PC5[conocidas5()[0]];
      pasos = [todo0, pasoLectura5(pz.notas, 'tempo', Object.assign({ pads: true }, o)), pasoLectura5(pz.notas, 'tempo', Object.assign({ unaTecla: MI, base: true, acordes: pz.ac }, o))];
      cfg.repaso = null; }
    const ult = pasos[pasos.length - 1]; if (ult && ult.o && ult.o.base && ult.modo === 'tempo') { const o2 = Object.assign({}, ult.o, { bpm: Math.min(V.bpm + 6, tempoDia5() + 6), sinTope: true, var: VARIAS5[0], titulo: V.titulo + ' · ¡otra vez, más rápido!' }); delete o2.clave; pasos.push(pasoLectura5(ult.notas, 'tempo', o2)); }
    return Object.assign(cfg, { pasos, minimo: 0, decor: (P, ctx) => teatroDecor5(P, ctx) }); });
  // TALLER = inventar
  crearParada5('taller', () => ({ pasos: [pasoTaller5(16)], estrellas: P => P.ganadasTaller || 0, corcheas: P => P.ganadasTaller || 0 }));
}
function coroDecor5(P, ctx) {   // el coro: tres niños cantores que abren la boca cuando Tic canta
  const canta = P.ticCanta > P.t; [['nina1', 1110], ['nino2', 1170], ['nina2', 1230]].forEach(([p, x], i) => { sombra(ctx, x, 600, 22, .25); sprK(ctx, sprPersona5(VECINOS5[p], 'abajo', 0, canta && i % 2 ? 'happy' : null), x, 600 - (canta ? Math.abs(Math.sin(RELOJ * 8 + i)) * 4 : 0), 2); });
}
function teatroDecor5(P, ctx) {   // el escenario: telón rojo a los lados, luces y el público (la familia) abajo
  ctx.save(); ctx.fillStyle = '#a3243a'; [[0, 1], [LW5, -1]].forEach(([x0, dx]) => { for (let k = 0; k < 5; k++) { ctx.fillStyle = k % 2 ? '#a3243a' : '#c23345'; ctx.fillRect(x0 + dx * k * 18 - (dx < 0 ? 18 : 0), 0, 18, 590 - k * 26); } }); ctx.fillStyle = '#c23345'; ctx.fillRect(0, 0, LW5, 26); ctx.fillStyle = MK5; ctx.fillRect(0, 26, LW5, 5); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; [[360, .18], [920, .18]].forEach(([x, a]) => { const g = ctx.createLinearGradient(x, 30, x, 600); g.addColorStop(0, 'rgba(255,240,190,' + a + ')'); g.addColorStop(1, 'rgba(255,240,190,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 20, 30); ctx.lineTo(x + 20, 30); ctx.lineTo(x + 160, 600); ctx.lineTo(x - 160, 600); ctx.fill(); }); ctx.restore();
  publico5(ctx, P);
}
