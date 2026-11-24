// =====================================================================
//  M5 · RINCONES MUSICALES EN LA CALLE (sin salir del mapa: una tarjeta con el teclado abajo)
//  pastor-eco · campanas · vecina «¿qué nota es?» · pozo del eco · puerta de la posada (contraseña de ritmo)
//  · ovejas que se cuentan con negras · niños en ronda · la estrella. Aporrear no avanza (nota de más = error).
// =====================================================================
const COLOR_RINCON5 = { pastor: NC.FA, campanas: NC.MI, vecina: NC.SOL, pozo: NC.LA, posada: '#c0533f', ovejas: '#fffaf4', ronda: NC.DO, estrella: '#ffd046' };
const RINCONES5 = {
  pastor: { nombre: 'El pastor: eco con la flauta', tipo: 'eco', rondas: 3, retrato: () => sprPersona5(VECINOS5.pastor, 'abajo', 0), dice: 'Escucha mi flauta y repite.' },
  campanas: { nombre: 'Las campanas: tan tan taaan', tipo: 'ritmo', rondas: 3, retrato: () => sprPersona5(VECINOS5.campanero, 'abajo', 0), dice: 'Las campanas tocan. Tú repites el ritmo con una tecla.' },
  vecina: { nombre: 'La vecina canta: ¿qué nota es?', tipo: 'nota', rondas: 4, retrato: () => sprPersona5(VECINOS5.vecina, 'abajo', 0), dice: 'Canto una nota. ¿Cuál es? Búscala en el piano.' },
  pozo: { nombre: 'El pozo del eco', tipo: 'libre', rondas: 3, retrato: () => sprPozo5(), dice: 'Toca lo que quieras… y espera: el pozo te contesta.' },
  posada: { nombre: 'La posada: contraseña de ritmo', tipo: 'ritmo', rondas: 2, posada: true, retrato: () => sprPersona5(VECINOS5.mesonero, 'abajo', 0), dice: 'Toc, toc. ¿La contraseña? Repite mi ritmo.' },
  ovejas: { nombre: 'Cuenta las ovejas con negras', tipo: 'pulso', rondas: 2, retrato: () => sprOvejaA5(0), dice: 'Cada oveja salta en un pulso: tan, tan, tan, tan.' },
  ronda: { nombre: 'Niños en ronda', tipo: 'pulso', rondas: 3, ronda: true, retrato: () => sprPersona5(VECINOS5.nina1, 'abajo', 0), dice: 'Lleva el pulso de la ronda. ¡Cada vuelta, más rápido!' },
  estrella: { nombre: 'La estrella', tipo: 'estrella', rondas: 1, retrato: () => cache('estrRet', () => sprite(20, 20, g => { g.disc(10, 10, 4, '#ffd046'); g.R(9, 0, 3, 20, '#ffd046'); g.R(0, 9, 20, 3, '#ffd046'); g.disc(10, 10, 2, '#fff6c0'); }, { ax: 10, ay: 20 })), dice: 'Toca tus notas, de la más grave a la más aguda, y la estrella brilla.' },
};
function cantar5(n, dur = .8) { if (!SON5.listo) return; const K = KitSonido, t = K.ahora() + .02; K.instrumentos.flauta(K.bus('efectos'), n, t, dur, .45); K.instrumentos.cuerdas(K.bus('efectos'), [n], t, dur, .35); }
function campana5(n, t) { if (!SON5.listo) return; const K = KitSonido; K.instrumentos.celesta(K.bus('efectos'), n + 12, t, 1.4, .5); K.instrumentos.celesta(K.bus('efectos'), n, t, 1.6, .35); K.percusion.palitos(K.bus('efectos'), t, .2); }
// motivo corto con lo aprendido (notas y ritmos que ya conoce)
function motivoCorto5(largo = 3, soloRitmo) { const K = conocidas5().map(pc => NOTA_PC5[pc]).sort((a, b) => a - b), rit = plan5().ritmos.filter(r => r !== 'sh' && r !== 'taaaaan'), out = []; let n = K[Math.floor(Math.random() * K.length)], tot = 0;
  for (let i = 0; i < largo; i++) { const r = i === largo - 1 && rit.includes('taaan') ? 'taaan' : rit[Math.floor(Math.random() * rit.length)]; CELDAS5[r].forEach(d => { out.push({ n: soloRitmo ? 64 : n, d }); tot += d; }); const k = K.indexOf(n), s = Math.random() < .5 ? -1 : 1; n = K[Math.max(0, Math.min(K.length - 1, k + s))]; }
  return out; }
function abrirRincon5(L, id, x) {
  const R = RINCONES5[id]; if (!R) return;
  if (!R.casa && !despierto5(id)) { const k = DESPIERTA5.findIndex(d => (d.rincones || []).includes(id)); DIALOGO5.abrir(R.nombre.split(':')[0], R.retrato, ['Zzz… todavía duerme.', 'Despierta al terminar la misión ' + k + '.']); return; }
  const vR = voz5('rincon-' + id, { forzar: true });
  const P = { t: 0, id, R, dice: textoDeVoz5(vR || 'rincon-' + id, R.dice), ronda: 0, ok: 0, fase: 'intro', fx: fx5(), pulsos: [], toques: [], errores: 0 };
  const bpm = () => Math.min(80, tempoDia5() + (R.ronda ? P.ronda * 8 : 0)), b = () => 60 / bpm();
  function nuevaRonda() {
    P.toques = []; P.errores = 0; P.res = null;
    if (R.tipo === 'eco') { P.motivo = motivoCorto5(P.ronda < 1 ? 2 : 3); tocarModelo(); }
    else if (R.tipo === 'ritmo') { P.motivo = R.posada ? motivoCorto5(P.ronda < 1 ? 2 : 3, true) : [{ n: 64, d: 1 }, { n: 64, d: 1 }, { n: 64, d: 2 }]; tocarModelo(); }
    else if (R.tipo === 'nota') { const K = conocidas5().map(pc => NOTA_PC5[pc]); P.notaPedida = K[Math.floor(Math.random() * K.length)]; P.intentos = 0; P.fase = 'escucha'; P.t0 = P.t; setTimeout(() => cantar5(P.notaPedida, 1), 300); setTimeout(() => { if (L.panel === P) P.fase = 'turno'; }, 1400); }
    else if (R.tipo === 'pulso') { const n = 8; P.t0 = P.t + 1.2; P.pulsos = []; for (let k = 0; k < n; k++) P.pulsos.push({ t: P.t0 + (k + 4) * b(), hecho: false }); P.cuenta = 4; P.fase = 'turno'; P.ritmoT = P.t0; }
    else if (R.tipo === 'libre') { P.fase = 'turno'; P.eco = []; }
    else if (R.tipo === 'suave') { P.fase = 'turno'; P.calma = 0; P.ultT = -9; P.meta = 5; }
    else if (R.tipo === 'contar') { P.cuantos = 2 + Math.floor(Math.random() * 3); P.toques = []; P.fase = 'modelo'; P.t0 = P.t; const bb = b(); for (let k = 0; k < P.cuantos; k++) setTimeout(() => { if (L.panel !== P) return; SON5.flauta(79, bb * .35); setTimeout(() => SON5.flauta(76, bb * .45), bb * 400); P.brilla = { t: P.t, n: 79, k }; }, (500 + k * bb * 1000) / VEL5); setTimeout(() => { if (L.panel === P) { P.fase = 'turno'; P.t0 = P.t; P.ultima = null; } }, (700 + P.cuantos * b() * 1000) / VEL5); }
    else if (R.tipo === 'subeBaja') { const esc = [60, 62, 64, 65, 67, 69, 71, 72, 74], a = Math.floor(Math.random() * 5), sal = 2 + Math.floor(Math.random() * 3), sube = Math.random() < .5; P.par = [esc[sube ? a : a + sal], esc[sube ? a + sal : a]]; P.bien = sube ? 0 : 1; P.fase = 'modelo'; P.t0 = P.t;
      P.par.forEach((n, k) => setTimeout(() => { if (L.panel === P) { SON5.flauta(n, .5); P.brilla = { t: P.t, n, k }; } }, (500 + k * 650) / VEL5)); setTimeout(() => { if (L.panel === P) P.fase = 'turno'; }, 1900 / VEL5); }
    else if (R.tipo === 'estrella') { P.esc = conocidas5().map(pc => NOTA_PC5[pc]).sort((a, c) => a - c); if (P.esc.length === 1) P.esc = [P.esc[0], P.esc[0], P.esc[0], P.esc[0], P.esc[0]]; P.k = 0; P.fase = 'turno'; }
  }
  function tocarModelo() { P.fase = 'modelo'; P.t0 = P.t; let tt = .5; P.modeloT = []; P.motivo.forEach(x => { P.modeloT.push(tt); const at = tt; setTimeout(() => { if (L.panel !== P) return; if (R.tipo === 'eco') { if (R.canta) cantar5(x.n, x.d * b() * .9); else SON5.flauta(x.n, x.d * b() * .9); } else if (R.posada) SON5.palma(.8); else if (SON5.listo) campana5(x.n, KitSonido.ahora() + .01); P.brilla = { t: P.t, n: x.n }; }, at * 1000); tt += x.d * b(); });
    P.finModelo = tt; setTimeout(() => { if (L.panel === P) { P.fase = 'turno'; P.t0 = P.t; } }, (tt + .2) * 1000); }
  function evaluarRitmo() {   // compara las distancias entre toques con las del modelo (con tolerancia)
    const T = P.toques.map(x => x.t), M = P.modeloT; if (T.length !== M.length) return false;
    for (let k = 1; k < M.length; k++) { const a = M[k] - M[k - 1], c = T[k] - T[k - 1]; if (Math.abs(c - a) > Math.max(.18, a * .35)) return false; } return true; }
  function bien() { P.ok++; P.fx.estallar(LW5 / 2, 300, COLOR_RINCON5[id], 20); try { Snd.estrella(Math.min(2, P.ok - 1)); } catch (e) { } P.res = { t: P.t, ok: true }; P.ronda++;
    if (P.ok >= R.rondas) { setTimeout(() => terminar(), 900); return; } setTimeout(() => { if (L.panel === P) nuevaRonda(); }, 1300); }
  function mal() { P.res = { t: P.t, ok: false }; voz5('ay-otra', {}); setTimeout(() => { if (L.panel !== P) return; if (R.tipo === 'eco' || R.tipo === 'ritmo') tocarModelo(); else nuevaRonda(); }, 1300); }
  P.responder = v => { if (P.fase !== 'turno') return; P.fase = 'espera'; P.elegido = v; if (v === P.bien) bien(); else mal(); };
  function terminar() { const c = premioRincon5(id); P.fase = 'fin'; P.fin = { t: P.t, c }; try { Snd.desbloqueo(); } catch (e) { }
    if (id === 'pastor' && darLlave5('flauta')) P.fin.llave = 'flauta'; if (id === 'estrella') P.fin.estrella = true; voz5('rincon-bien', { hito: true }); }
  P.nota = (n, t) => {
    if (P.fase === 'fin' || P.fase === 'intro') return null;
    const ahora = P.t;
    if (P.fase === 'modelo') return 'error';
    if (R.tipo === 'eco') { const k = P.toques.length, q = P.motivo[k]; P.toques.push({ n, t: ahora }); if (!q || n !== q.n) { P.errores++; mal(); P.fase = 'espera'; return 'error'; } if (P.toques.length === P.motivo.length) { P.fase = 'espera'; bien(); } return 'ok'; }
    if (R.tipo === 'ritmo') { P.toques.push({ n, t: ahora }); if (P.toques.length > P.motivo.length) return 'error'; if (P.toques.length === P.motivo.length) { P.fase = 'espera'; setTimeout(() => { if (L.panel !== P) return; if (P.toques.length === P.motivo.length && evaluarRitmo()) bien(); else mal(); }, 500); } SON5.palma(.4); return 'pad'; }
    if (R.tipo === 'nota') { if (P.fase !== 'turno') return 'error'; if (n % 12 === P.notaPedida % 12) { P.fase = 'espera'; cantar5(P.notaPedida, .6); bien(); return 'ok'; } P.intentos++; if (P.intentos >= 2) pista5(P.notaPedida, 2); if (P.intentos === 1) setTimeout(() => cantar5(P.notaPedida, .8), 400); return 'error'; }
    if (R.tipo === 'pulso') { const w = .24, p = P.pulsos.find(x => !x.hecho && Math.abs(x.t - ahora) <= w); if (p) { p.hecho = true; P.fx.estallar(LW5 / 2 + (P.pulsos.indexOf(p) - 3.5) * 90, 330, COLOR_RINCON5[id], 8); return 'ok'; } P.errores++; return 'error'; }
    if (R.tipo === 'libre') { if (P.fase !== 'turno') return 'error'; P.eco.push({ n, t: ahora }); P.ultima = ahora; return 'ok'; }
    if (R.tipo === 'suave') { if (P.fase !== 'turno') return null; const gap = ahora - P.ultT; P.ultT = ahora; if (gap < .55) { P.calma = 0; P.shh = P.t; return 'error'; } P.calma++; P.fx.estallar(LW5 / 2, 330, '#b8aaff', 6); if (P.calma >= P.meta) { P.fase = 'espera'; bien(); } return 'ok'; }
    if (R.tipo === 'contar') { if (P.fase !== 'turno') return 'error'; P.toques.push(ahora); P.ultima = ahora; SON5.palma(.4); return 'pad'; }
    if (R.tipo === 'subeBaja') return null;
    if (R.tipo === 'estrella') { const q = P.esc[P.k]; if (n === q || (P.esc[0] === P.esc[1] && n % 12 === q % 12)) { P.k++; P.fx.estallar(LW5 / 2, 230, '#ffd046', 14); SON5.acorde(n); if (P.k >= P.esc.length) { P.fase = 'espera'; bien(); } return 'ok'; } pista5(q, 1.5); return 'error'; }
    return null;
  };
  P.paso = dt => {
    P.t += dt;
    if (P.fase === 'intro' && P.t > 2.4) nuevaRonda();
    if (R.tipo === 'pulso' && P.fase === 'turno') { const bb = b(); while (P.ritmoT <= P.t) { const k = Math.round((P.ritmoT - P.t0) / bb); if (k < 4) { try { SON5.cuenta(k + 1); } catch (e) { } } SON5.tic(k % 4 === 0); if (R.ronda && k >= 4 && SON5.listo) KitSonido.instrumentos.flauta(KitSonido.bus('efectos'), [76, 74, 72, 74, 76, 76, 76, 79][(k - 4) % 8], KitSonido.ahora() + .01, bb * .8, .3); P.ritmoT += bb; }
      const ult = P.pulsos[P.pulsos.length - 1]; if (ult && P.t > ult.t + .4) { P.fase = 'espera'; const hechos = P.pulsos.filter(x => x.hecho).length; if (hechos >= 6 && P.errores <= 2) bien(); else mal(); } }
    if (R.tipo === 'libre' && P.fase === 'turno' && P.eco.length && P.t - P.ultima > 1.1) { const E = P.eco.slice(0, 8); P.fase = 'espera'; const t0 = E[0].t; [0, 1].forEach(v => E.forEach(x => setTimeout(() => { if (L.panel === P && SON5.listo) { const K = KitSonido; K.instrumentos.celesta(K.bus('efectos'), x.n + 12, K.ahora() + .01, .8, v ? .14 : .3); K.instrumentos.pad(K.bus('efectos'), [x.n], K.ahora() + .01, .6, v ? .06 : .12); } P.brilla = { t: P.t, n: x.n }; }, (.5 + v * (x.t - t0 + 1.2) + (x.t - t0)) * 1000))); setTimeout(() => { if (L.panel === P) { P.ok++; P.ronda++; if (P.ok >= R.rondas) terminar(); else { P.fase = 'turno'; P.eco = []; } } }, (1.9 + (E[E.length - 1].t - t0) * 2) * 1000); }
    if (R.tipo === 'contar' && P.fase === 'turno' && P.ultima != null && P.t - P.ultima > 1.3) { P.fase = 'espera'; if (P.toques.length === P.cuantos) bien(); else mal(); }
    if (P.fase === 'fin' && P.t - P.fin.t > 3.2) cerrar();
  };
  function cerrar() { if (L.panel === P) L.panel = null; TECLADO5.guia = null; }
  P.saltarPaso = () => { P.atasco = false; P.avance = P.t; if (P.fase === 'fin' || P.fase === 'intro') { cerrar(); return; } nuevaRonda(); };
  P.dibujar = (ctx, dt) => {
    if (dt) P.paso(dt);
    { const sg = P.fase + '|' + P.ronda + '|' + P.ok + '|' + (P.toques ? P.toques.length : 0); if (sg !== P.sg) { P.sg = sg; P.avance = P.t; P.atasco = false; }   /* M7b · vigilante */
      const quieto = performance.now() - ULTIMA_ENTRADA5 > 8000; if (P.t - P.avance > (P.fase === 'fin' ? 30 : 75) && quieto) P.atasco = true; else if (!quieto) P.atasco = false;
      if (P.atasco && P.t - P.avance > 105) P.saltarPaso(); }
    const q = Math.min(1, P.t * 4), col = COLOR_RINCON5[id];
    fondoRincon7(ctx, L, q);
    ctx.save(); ctx.fillStyle = 'rgba(28,16,48,' + .55 * q + ')'; ctx.fillRect(0, 0, LW5, LH5); ctx.restore();
    // la tarjeta del rincón (neobrutalismo suave: borde grueso y sombra dura)
    const x = 180, y = 96, w = 920, h = 470; ctx.save(); ctx.globalAlpha = q;
    rr(ctx, x + 8, y + 10, w, h, 24); ctx.fillStyle = '#2a1a3a'; ctx.fill(); rr(ctx, x, y, w, h, 24); ctx.fillStyle = '#fffaf4'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#2a1a3a'; ctx.stroke();
    rr(ctx, x, y, w, 64, 24); ctx.fillStyle = col; ctx.fill(); ctx.stroke(); titulo5(ctx, R.nombre, x + w / 2, y + 34, 34, '#2a1a3a');
    const s = R.retrato(); sombra(ctx, x + 120, y + 380, 50, .2); sprK(ctx, s, x + 120, y + 380 + (P.brilla && P.t - P.brilla.t < .3 ? -6 : 0), Math.min(7, 210 / s.height));
    // lo que dice y lo que hay que hacer
    const msg = P.fase === 'intro' ? P.dice : P.fase === 'modelo' ? (R.tipo === 'eco' ? 'Escucha…' : R.tipo === 'contar' ? 'Escucha y cuenta…' : R.tipo === 'subeBaja' ? 'Escucha al gallo…' : 'Escucha el ritmo…') : P.fase === 'turno' ? (R.tipo === 'eco' ? '¡Tu turno! Repite.' : R.tipo === 'ritmo' ? '¡Tu turno! Repite el ritmo.' : R.tipo === 'nota' ? '¿Qué nota canté? Búscala.' : R.tipo === 'pulso' ? (P.t < P.t0 + 4 * b() ? 'un, dos, tres, cuá…' : '¡Ahora tú, en cada pulso!') : R.tipo === 'libre' ? 'Toca algo… y espera.' : R.tipo === 'suave' ? 'Suavecito y despacio: ' + (P.meta - P.calma) + ' notas más.' : R.tipo === 'contar' ? 'Toca tantas veces como el cuco.' : R.tipo === 'subeBaja' ? '¿Subió o bajó? Toca la flecha.' : 'Toca ' + NOMBRE_NOTA5(P.esc[P.k] || 60) + '.') : P.fase === 'fin' ? '¡Muy bien!' : '';
    burbuja5(ctx, x + 250, y + 96, 620, msg, P.fase === 'intro' ? P.t : 9, { cola: [x + 200, y + 240], colaDx: -60 });
    dibujarRinconCentro5(ctx, P, x + 250, y + 250, 620, 200, b());
    for (let k = 0; k < R.rondas; k++) estrella(ctx, x + w - 60 - (R.rondas - 1 - k) * 44, y + h - 40, k < P.ok ? 17 : 12, k < P.ok ? '#ffd046' : '#e2d2b0');
    if (P.res && P.t - P.res.t < 1.1) titulo5(ctx, P.res.ok ? '¡Eso!' : '¡Otra vez!', x + w / 2 + 120, y + h - 44, 34, P.res.ok ? '#2e8b6a' : '#c23345');
    // botón cerrar
    rr(ctx, x + w - 64, y + 10, 46, 46, 12); ctx.fillStyle = '#fffaf4'; ctx.fill(); ctx.lineWidth = 4; ctx.stroke(); ctx.strokeStyle = '#2a1a3a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + w - 52, y + 22); ctx.lineTo(x + w - 30, y + 44); ctx.moveTo(x + w - 30, y + 22); ctx.lineTo(x + w - 52, y + 44); ctx.stroke();
    ctx.restore();
    if (P.fin) { const t = P.t - P.fin.t; rayosLuz5(ctx, LW5 / 2, 300, t); for (let i = 0; i < P.fin.c; i++) sprK(ctx, corcheaDorada(), LW5 / 2 + (i - (P.fin.c - 1) / 2) * 60, 330 - Math.abs(Math.sin(t * 4 + i)) * 16, 5); if (P.fin.c) titulo5(ctx, '+' + P.fin.c, LW5 / 2, 410, 50, '#fffaf4', { borde: 8, bordeC: '#2a1a3a' });
      if (P.fin.llave) { llave5(ctx, LW5 / 2 - 20, 470, 1.4); texto(ctx, '¡La flauta del pastor! Abre la Arena del eco.', LW5 / 2, 520, { tam: 24, c: '#ffd046', borde: 5, bordeC: INK }); } }
    dibujarTeclado5(ctx); P.fx.dibujar(ctx, dt);
  };
  const BSB = [[480, 440, 190, 92], [710, 440, 190, 92]];
  P.tocar = (x, y) => { if (x > 180 + 920 - 64 && x < 180 + 920 - 18 && y > 106 && y < 152) { cerrar(); return; } if (R.tipo === 'subeBaja') for (let k = 0; k < 2; k++) { const [bx, by, bw, bh] = BSB[k]; if (x > bx && x < bx + bw && y > by && y < by + bh) { P.responder(k); return; } } if (P.fase === 'intro' && P.t > .8 && teclaEn(x, y) == null) { P.t = 2.4; return; } const n = teclaEn(x, y); if (n != null) notaEntrante(n, 90, 'pantalla'); };
  P.toca = () => { if (P.fase === 'intro' && P.t > .8) P.t = 2.4; else if (P.fase === 'fin') cerrar(); };
  P.objetivo = () => { if (P.fase !== 'turno') return null; if (R.tipo === 'eco') { const q = P.motivo[P.toques.length]; return q ? { id: 'R' + P.ronda + P.toques.length, n: q.n, t: P.t + .3, reaccion: true } : null; }
    if (R.tipo === 'nota') return { id: 'N' + P.ronda, n: P.notaPedida, t: P.t0 + 1.4, reaccion: true }; if (R.tipo === 'estrella') return { id: 'E' + P.k, n: P.esc[P.k], t: P.t + .2, reaccion: true };
    if (R.tipo === 'pulso') { const p = P.pulsos.find(x => !x.hecho && x.t > P.t - .1); return p ? { id: 'P' + P.ronda + P.pulsos.indexOf(p), n: 64, t: p.t, tempo: true } : null; }
    if (R.tipo === 'ritmo') { const k = P.toques.length; if (k >= P.motivo.length) return null; return { id: 'T' + P.ronda + '-' + P.modeloT.join(',') + k, n: 64, t: (k === 0 ? P.t0 + .6 : P.toques[0].t + (P.modeloT[k] - P.modeloT[0])), reaccion: k === 0 }; }
    if (R.tipo === 'subeBaja') return { id: 'SB' + P.ronda, toque: [BSB[P.bien][0] + 95, BSB[P.bien][1] + 46], t: P.t + .3, reaccion: true };
    if (R.tipo === 'suave') return { id: 'S' + P.ronda + P.calma, n: conocidas5().map(pc => NOTA_PC5[pc])[0], t: Math.max(P.t, P.ultT + .8), reaccion: false, tempo: true };
    if (R.tipo === 'contar') return P.toques.length < P.cuantos ? { id: 'C' + P.ronda + P.toques.length, n: 64, t: P.t + .45, reaccion: false, tempo: true } : null;
    if (R.tipo === 'libre') return P.eco.length < 3 ? { id: 'L' + P.ronda + P.eco.length, n: [64, 67, 72][P.eco.length], t: P.t + .25, reaccion: true } : null; return null; };
  L.panel = P; MANDO5.soltarTodo(); SON5.iniciar();
  return P;
}
function dibujarRinconCentro5(ctx, P, x, y, w, h, bb) {
  const R = P.R, col = COLOR_RINCON5[P.id] || R.color || NC.MI;
  if (R.tipo === 'suave') { const m = Math.sin(P.t * 1.6) * .08; ctx.save(); ctx.translate(x + w / 2, y + 120); ctx.rotate(m); sprK(ctx, sprCuna5(), 0, 40, 4); ctx.restore(); for (let k = 0; k < P.meta; k++) { ctx.beginPath(); ctx.arc(x + w / 2 - 100 + k * 50, y + 190, 13, 0, 7); ctx.fillStyle = k < P.calma ? '#b8aaff' : MARCA5.gris; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = MK5; ctx.stroke(); }
    if (P.shh && P.t - P.shh < 1.2) titulo5(ctx, '¡Shhh! más despacito', x + w / 2, y + 40, 34, MARCA5.osc.DO); else { ctx.save(); ctx.globalAlpha = .7; titulo5(ctx, 'z z z', x + w / 2 + 120 + Math.sin(P.t) * 6, y + 40 - (P.t * 8) % 20, 30, MARCA5.tinta2); ctx.restore(); } return; }
  if (R.tipo === 'contar') { sprK(ctx, sprCuco5(P.brilla && P.t - P.brilla.t < .4), x + 110, y + 170, 3.2); const n = P.fase === 'turno' || P.fase === 'espera' ? P.toques.length : 0; for (let k = 0; k < Math.max(P.cuantos || 0, n); k++) { const on = k < n; ctx.beginPath(); ctx.arc(x + 270 + k * 80, y + 110, 26, 0, 7); ctx.fillStyle = on ? NC.SOL : MARCA5.gris; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = MK5; ctx.stroke(); texto(ctx, ['un', 'dos', 'tres', 'cuá', 'cin'][k] || '', x + 270 + k * 80, y + 160, { tam: 22, c: MK5, peso: 700 }); } return; }
  if (R.tipo === 'subeBaja') { if (P.par) P.par.forEach((n, k) => { const vis = P.fase !== 'modelo' || (P.brilla && P.brilla.k >= k); if (!vis) return; const yy = y + 130 - (n - 64) * 8; ctx.save(); rr(ctx, x + 230 + k * 160, yy - 24, 90, 48, 14); ctx.fillStyle = P.res ? COLOR_NOTA5(n) : MARCA5.gris; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = MK5; ctx.stroke(); ctx.restore(); });
    [[480, 440, 190, 92], [710, 440, 190, 92]].forEach(([bx, by, bw, bh], k) => { const es = P.res && k === P.bien; caja5(ctx, bx, by, bw, bh, { r: 18, borde: 5, sombra: 6, fondo: es ? '#7fe08a' : P.fase === 'turno' ? MARCA5.papel : MARCA5.gris }); titulo5(ctx, k ? '↓ bajó' : '↑ subió', bx + bw / 2, by + bh / 2 + 2, 40, MK5); }); return; }
  if (R.tipo === 'eco' || R.tipo === 'ritmo') { const M = P.motivo || []; let tot = 0; M.forEach(z => tot += z.d); const px = Math.min(110, (w - 40) / Math.max(1, tot)); let cx = x + 20;
    M.forEach((z, k) => { const hecho = P.toques.length > k, brilla = P.fase === 'modelo' && P.modeloT && P.t - P.t0 >= P.modeloT[k] && (k === M.length - 1 || P.t - P.t0 < P.modeloT[k + 1]);
      ctx.save(); rr(ctx, cx + 3, y + 40 - (brilla ? 8 : 0), z.d * px - 6, 70, 14); ctx.fillStyle = R.tipo === 'eco' ? COLOR_NOTA5(z.n) : col; ctx.globalAlpha = hecho || brilla ? 1 : .45; ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
      texto(ctx, R.tipo === 'eco' ? NOMBRE_NOTA5(z.n) : (z.d === .5 ? 'ta' : z.d === 1 ? 'tan' : 'taaan'), cx + z.d * px / 2, y + 76 - (brilla ? 8 : 0), { tam: 24, c: '#fff8ec', borde: 5, bordeC: INK }); cx += z.d * px; }); }
  else if (R.tipo === 'nota') { ctx.save(); const k = P.fase === 'escucha' ? 1 + .1 * Math.sin(P.t * 10) : 1; ctx.translate(x + w / 2, y + 80); ctx.scale(k, k); texto(ctx, P.fase === 'turno' || P.fase === 'escucha' ? '♪ ?' : P.notaPedida ? NOMBRE_NOTA5(P.notaPedida) : '', 0, 0, { tam: 90, c: P.res && P.res.ok ? COLOR_NOTA5(P.notaPedida) : '#5a7dff', borde: 9, bordeC: INK }); ctx.restore(); }
  else if (R.tipo === 'pulso') { const n = P.pulsos.length || 8; for (let k = 0; k < n; k++) { const p = P.pulsos[k], px = x + w / 2 + (k - (n - 1) / 2) * 76, hecho = p && p.hecho, act = p && Math.abs(p.t - P.t) < .15;
      if (R.martillo) { const golpe = hecho && P.t - p.t < .25; ctx.save(); ctx.translate(px, y + 100); ctx.rotate(golpe ? .5 : -.4); ctx.fillStyle = '#8a5a2a'; ctx.fillRect(-4, -46, 8, 50); ctx.fillStyle = '#6a6a7a'; ctx.fillRect(-16, -54, 32, 16); ctx.strokeStyle = MK5; ctx.lineWidth = 3; ctx.strokeRect(-16, -54, 32, 16); ctx.restore(); ctx.fillStyle = hecho ? '#c9a06a' : MARCA5.gris; ctx.fillRect(px - 30, y + 106, 60, 10); }
      else if (R.ronda) { const a = (P.t * bb * 1.2 + k / n) * Math.PI * 2; sprK(ctx, sprPersona5(VECINOS5[['nina1', 'nino1', 'nina2', 'nino2'][k % 4]], 'abajo', Math.floor(P.t * 6 + k) % 4), px, y + 110 - (hecho ? 16 : 0), 2.4); }
      else { const salta = hecho ? Math.max(0, 1 - (P.t - p.t) * 2) : 0; sprK(ctx, sprOvejaA5(hecho ? 1 : 0), px, y + 110 - Math.sin(salta * Math.PI) * 50, 3.4); }
      texto(ctx, ['un', 'dos', 'tres', 'cuá'][k % 4], px, y + 150, { tam: 22, c: act ? '#c23345' : '#6b5a7d', peso: 700 }); } }
  else if (R.tipo === 'libre') { const E = P.eco || []; E.slice(-8).forEach((z, k) => { const px = x + 60 + k * 70; ctx.save(); ctx.beginPath(); ctx.arc(px, y + 80, 26, 0, 7); ctx.fillStyle = COLOR_NOTA5(z.n); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); });
    if (P.brilla && P.t - P.brilla.t < .5) { const r = 30 + (P.t - P.brilla.t) * 200; ctx.save(); ctx.globalAlpha = 1 - (P.t - P.brilla.t) * 2; ctx.beginPath(); ctx.arc(x + w / 2, y + 110, r, 0, 7); ctx.lineWidth = 5; ctx.strokeStyle = COLOR_NOTA5(P.brilla.n); ctx.stroke(); ctx.restore(); } }
  else if (R.tipo === 'estrella') { const n = (P.esc || []).length || 5, cx = x + w / 2, cy = y + 95; for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + k * Math.PI * 2 / n, on = k < (P.k || 0); ctx.save(); ctx.strokeStyle = on ? '#ffd046' : 'rgba(58,36,20,.25)'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 90, cy + Math.sin(a) * 90); ctx.stroke(); ctx.restore(); if (P.esc) texto(ctx, NOMBRE_NOTA5(P.esc[k]), cx + Math.cos(a) * 118, cy + Math.sin(a) * 112, { tam: 20, c: on ? '#c8901a' : '#6b5a7d', peso: 700 }); }
    estrella(ctx, cx, cy, 30, '#ffd046'); }
}
