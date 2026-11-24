// =====================================================================
//  MI PIANO 2 · elenco en píxel (todo en código, contorno automático)
//  Jacob el loro (compañero) · Bach · Mozart · Beethoven (maestros de mundo)
//  Sarah · David (los pianistas) · Sansón (el público) · notitas · estrellas
// =====================================================================
const CACHE = {};
function cache(k, fn) { return CACHE[k] || (CACHE[k] = fn()); }

// ---------- ojos genéricos (2×3 con brillo), cerrados, felices, sorprendidos ----------
function ojo(g, x, y, modo, c = PAL.tinta) {
  if (modo === 'cerrado') { g.R(x, y + 2, 2, 1, c); return; }
  if (modo === 'feliz') { g.px(x, y + 1, c); g.px(x + 1, y + 1, c); g.px(x - 1, y + 2, c); g.px(x + 2, y + 2, c); return; }
  if (modo === 'sorpresa') { g.R(x, y, 2, 3, c); g.px(x - 1, y + 1, c); g.px(x + 2, y + 1, c); g.px(x, y, PAL.blanco); return; }
  g.R(x, y, 2, 3, c); g.px(x, y, PAL.blanco);
}

// ---------- JACOB, el loro de la casa (amazona de frente amarilla) ----------
// pose: idle | canta | feliz | duda | aletea ; f: cuadro 0/1 ; ojos: abierto|cerrado|feliz|sorpresa
function sprJacob(P = {}) {
  const k = 'jacob' + JSON.stringify(P);
  return cache(k, () => sprite(28, 30, g => {
    const f = P.f || 0, pose = P.pose || 'idle', b = (pose === 'idle' && f) ? 1 : 0; // respiración
    const V = PAL.verde, V2 = PAL.verde2, V3 = PAL.verde3, PICO = '#ffb347', PICO2 = '#d97a2b';
    // cola (detrás)
    g.R(6, 22, 5, 6, V2); g.R(5, 25, 4, 3, PAL.azul2); g.px(5, 27, PAL.azul3); g.R(9, 26, 2, 2, V3);
    // cuerpo (bola) con sombra abajo-derecha
    g.ellE(5, 9 + b, 18, 19 - b, V2); g.ellE(5, 8 + b, 17, 18 - b, V);
    g.ellE(11, 15 + b, 10, 11 - b, '#8fe67c'); // pechito claro
    g.R(13, 18 + b, 6, 1, '#7fd86c'); g.R(12, 21 + b, 7, 1, '#7fd86c'); // plumitas
    // cabeza
    const hy = b + (pose === 'duda' ? 1 : 0), hx = pose === 'duda' ? -1 : 0;
    g.ellE(9 + hx, 1 + hy, 16, 15, V2); g.ellE(9 + hx, 0 + hy, 15, 15, V);
    g.ellE(12 + hx, 0 + hy, 9, 5, PAL.oro); g.R(14 + hx, 0 + hy, 3, 1, PAL.oro3); g.px(13 + hx, 1 + hy, PAL.oro3); // frente amarilla
    g.R(20 + hx, 5 + hy, 2, 2, '#4fc4c0'); // mejilla turquesa
    // anillo blanco del ojo + ojo grande
    g.ellE(15 + hx, 4 + hy, 7, 7, PAL.blanco);
    const om = P.ojos || (pose === 'feliz' ? 'feliz' : pose === 'canta' ? 'cerrado' : 'abierto');
    if (om === 'abierto') { g.R(17 + hx, 5 + hy, 3, 4, PAL.tinta); g.px(17 + hx, 5 + hy, PAL.blanco); g.px(18 + hx, 5 + hy, PAL.blanco); g.px(19 + hx, 8 + hy, PAL.tinta2); }
    else if (om === 'sorpresa') { g.R(17 + hx, 5 + hy, 3, 4, PAL.tinta); g.px(17 + hx, 5 + hy, PAL.blanco); g.R(16 + hx, 4 + hy, 5, 1, V); }
    else if (om === 'feliz') { g.R(17 + hx, 7 + hy, 3, 1, PAL.tinta); g.px(16 + hx, 8 + hy, PAL.tinta); g.px(20 + hx, 8 + hy, PAL.tinta); g.px(16 + hx, 6 + hy, PAL.blanco); }
    else { g.R(16 + hx, 7 + hy, 4, 1, PAL.tinta); g.px(16 + hx, 6 + hy, PAL.tinta); }
    g.R(14 + hx, 10 + hy, 2, 1, PAL.rubor);
    // pico ganchudo (abierto cuando canta)
    const abre = pose === 'canta' || pose === 'feliz' ? 1 + f : 0;
    g.R(22 + hx, 5 + hy, 4, 3, PICO); g.R(24 + hx, 8 + hy, 2, 2, PICO); g.px(25 + hx, 10 + hy, PICO2); g.px(23 + hx, 5 + hy, '#ffd59a');
    g.R(22 + hx, 8 + hy + abre, 2, 2, PICO2); if (abre) { g.R(22 + hx, 8 + hy, 2, abre, '#a3243a'); }
    // ala: plegada, levantada o aleteando
    if (pose === 'feliz' || pose === 'aletea') {
      const up = f ? 0 : 3;
      g.ellE(0, 5 + up, 9, 12, V2); g.ellE(1, 5 + up, 7, 10, V3); g.R(1, 6 + up, 3, 3, PAL.rojo); g.R(0, 13 + up, 4, 3, PAL.azul2);
    } else {
      g.ellE(5, 12 + b, 9, 12, V3); g.ellE(6, 12 + b, 7, 11, V2); g.R(8, 15 + b, 3, 3, PAL.rojo); g.px(8, 15 + b, '#ff9a9a');
      g.R(7, 21 + b, 5, 2, PAL.azul2); g.px(6, 22 + b, PAL.azul3);
    }
    // patitas
    g.R(11, 27, 2, 2, PAL.gris2); g.R(16, 27, 2, 2, PAL.gris2); g.px(10, 28, PAL.gris2); g.px(18, 28, PAL.gris2);
  }, { ax: 14, ay: 30 }));
}

// ---------- BACH · el abuelo del órgano (peluca-nube, casaca azul) ----------
function sprBach(P = {}) {
  return cache('bach' + JSON.stringify(P), () => sprite(38, 46, g => {
    const f = P.f || 0, b = f, cara = P.cara || 'sonrie';
    const M = PAL.marino2, M2 = PAL.marino, W = PAL.peluca, W2 = PAL.peluca2, W3 = PAL.peluca3;
    // casaca (campana)
    for (let y = 28; y < 46; y++) { const t = (y - 28) / 17, w = Math.round(16 + t * 12); g.R(19 - w / 2, y, w, 1, y > 43 ? M2 : M); g.px(19 - w / 2, y, '#5a6cb8'); g.px(19 + w / 2 - 1, y, M2); }
    g.R(17, 29, 4, 17, '#22305a'); // abertura
    [32, 36, 40].forEach(y => { g.px(16, y, PAL.oro); g.px(22, y, PAL.oro); });
    // chorrera (jabot)
    g.R(16, 27, 6, 3, PAL.blanco); g.R(17, 30, 4, 3, PAL.blanco); g.R(17, 33, 4, 2, PAL.peluca2); g.px(18, 35, PAL.blanco);
    // manitas sosteniendo una partitura
    g.R(9, 36 - b, 8, 6, PAL.blanco); g.R(10, 37 - b, 6, 1, PAL.gris); g.R(10, 39 - b, 6, 1, PAL.gris); g.px(12, 38 - b, PAL.tinta); g.px(14, 40 - b, PAL.tinta);
    g.R(8, 39 - b, 3, 3, PAL.piel); g.R(16, 39 - b, 3, 3, PAL.piel);
    // peluca: rulos laterales (nube) detrás de la cara
    const rulo = (x, y) => { g.disc(x, y, 4, W2); g.disc(x - 1, y - 1, 3, W); g.px(x - 2, y - 2, PAL.blanco); };
    [[5, 13], [4, 19], [5, 25], [33, 13], [34, 19], [33, 25]].forEach(([x, y]) => rulo(x, y + b));
    g.ellE(5, 0 + b, 28, 14, W2); g.ellE(6, 0 + b, 26, 13, W); g.R(12, 1 + b, 10, 1, PAL.blanco);
    // cara redonda con papada
    g.ellE(8, 6 + b, 22, 22, PAL.piel2); g.ellE(8, 5 + b, 22, 22, PAL.piel);
    g.R(13, 25 + b, 12, 1, PAL.piel2);
    // flequillo de peluca sobre la frente
    g.ellE(9, 2 + b, 20, 8, W); g.R(10, 8 + b, 3, 1, W2); g.R(18, 8 + b, 3, 1, W2); g.R(25, 7 + b, 3, 1, W2);
    // cejas, ojos, nariz, mejillas, boca
    g.R(11, 12 + b, 5, 1, W3); g.R(22, 12 + b, 5, 1, W3);
    const om = cara === 'feliz' ? 'feliz' : cara === 'sorpresa' ? 'sorpresa' : (P.parpadeo ? 'cerrado' : 'abierto');
    ojo(g, 13, 14 + b, om); ojo(g, 23, 14 + b, om);
    g.R(18, 17 + b, 2, 3, PAL.piel2); g.px(18, 17 + b, PAL.piel3);
    g.R(10, 19 + b, 3, 2, PAL.rubor); g.R(25, 19 + b, 3, 2, PAL.rubor);
    if (cara === 'sorpresa') { g.R(17, 22 + b, 4, 3, PAL.vino); }
    else if (cara === 'feliz') { g.R(15, 21 + b, 8, 1, PAL.tinta); g.R(16, 22 + b, 6, 2, PAL.vino); g.R(17, 23 + b, 4, 1, '#ff8fb0'); }
    else { g.px(15, 21 + b, PAL.tinta); g.R(16, 22 + b, 6, 1, PAL.tinta); g.px(22, 21 + b, PAL.tinta); }
  }, { ax: 19, ay: 46 }));
}

// ---------- MOZART · el travieso del palacio (casaca roja, coleta con moño) ----------
function sprMozart(P = {}) {
  return cache('moz' + JSON.stringify(P), () => sprite(34, 44, g => {
    const f = P.f || 0, b = f, cara = P.cara || 'pícaro';
    const R1 = PAL.rojo, R2 = PAL.rojo2, R3 = PAL.rojo3, W = PAL.peluca, W2 = PAL.peluca2;
    // moño grande de la coleta (detrás, rebota)
    const mb = f ? -1 : 0;
    g.R(1, 15 + b + mb, 5, 6, PAL.tinta2); g.R(8, 15 + b + mb, 5, 6, PAL.tinta2); g.R(5, 16 + b + mb, 4, 4, PAL.tinta); g.px(2, 16 + b + mb, PAL.n3); g.px(9, 16 + b + mb, PAL.n3);
    g.R(5, 20 + b, 2, 5, PAL.tinta2); g.R(8, 20 + b, 2, 4, PAL.tinta2);
    // casaca roja con ribete dorado
    for (let y = 26; y < 44; y++) { const t = (y - 26) / 17, w = Math.round(12 + t * 12); g.R(18 - w / 2, y, w, 1, y > 41 ? R2 : R1); g.px(18 - w / 2, y, '#ff8a8a'); g.px(18 + w / 2 - 1, y, R3); }
    g.R(16, 27, 4, 17, PAL.crema); for (let y = 28; y < 44; y += 3) { g.px(15, y, PAL.oro); g.px(20, y, PAL.oro); }
    g.R(15, 26, 6, 3, PAL.blanco); g.px(17, 29, PAL.blanco); g.px(18, 30, PAL.blanco);
    // brazo levantado (dirige) o en jarra
    if (P.pose === 'dirige') { g.line(24, 30, 29, 23 - b * 2, R1, 3); g.R(28, 20 - b * 2, 3, 3, PAL.piel); g.line(30, 20 - b * 2, 33, 13 - b * 2, PAL.blanco, 1); }
    else { g.R(24, 30, 3, 6, R2); g.R(25, 35, 3, 3, PAL.piel); }
    g.R(9, 31, 3, 6, R2); g.R(8, 36, 3, 3, PAL.piel);
    // peluca empolvada: copete + un rulo por lado
    g.ellE(7, 1 + b, 22, 14, W2); g.ellE(8, 0 + b, 20, 13, W); g.R(13, 1 + b, 8, 1, PAL.blanco);
    // cara (más chica y fina)
    g.ellE(9, 6 + b, 18, 19, PAL.piel2); g.ellE(9, 5 + b, 18, 19, PAL.piel);
    g.ellE(9, 2 + b, 18, 7, W); g.R(12, 7 + b, 2, 1, W2); g.R(20, 7 + b, 2, 1, W2);
    [[7, 14], [27, 14]].forEach(([x, y]) => { g.ellE(x - 3, y + b - 1, 6, 8, W2); g.ellE(x - 3, y + b - 2, 6, 7, W); g.R(x - 2, y + b, 4, 1, W2); });
    // cara pícara: una ceja arriba, sonrisa torcida
    const om = cara === 'feliz' ? 'feliz' : cara === 'sorpresa' ? 'sorpresa' : (P.parpadeo ? 'cerrado' : 'abierto');
    g.R(11, 10 + b, 4, 1, PAL.peluca3); g.R(19, 9 + b, 4, 1, PAL.peluca3); g.px(23, 10 + b, PAL.peluca3);
    ojo(g, 12, 12 + b, om); ojo(g, 20, 12 + b, om);
    g.px(17, 15 + b, PAL.piel3); g.R(10, 16 + b, 2, 2, PAL.rubor); g.R(23, 16 + b, 2, 2, PAL.rubor);
    if (cara === 'sorpresa') g.R(15, 19 + b, 3, 3, PAL.vino);
    else { g.R(13, 18 + b, 8, 1, PAL.tinta); g.R(14, 19 + b, 7, 2, PAL.vino); g.R(15, 20 + b, 4, 1, '#ff8fb0'); g.px(21, 17 + b, PAL.tinta); }
  }, { ax: 18, ay: 44 }));
}

// ---------- BEETHOVEN · el de la tormenta (melena al viento, casaca verde, bufanda dorada) ----------
function sprBeethoven(P = {}) {
  return cache('bee' + JSON.stringify(P), () => sprite(46, 52, g => {
    const f = P.f || 0, b = f, cara = P.cara || 'serio', Y = 6;
    const H = '#4a3048', H2 = '#33203a', H3 = '#6e4a68', C = PAL.verde3, C2 = '#1f5c3a';
    const mecha = (x0, y0, x1, y1, w, c) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0; for (let i = 0; i <= n; i++) { const t = i / n, th = Math.max(1, Math.round(lerp(w, 1, t))); g.R(Math.round(lerp(x0, x1, t) - th / 2), Math.round(lerp(y0, y1, t) - th / 2), th, th, c); } };
    // casaca con cuello alto
    for (let y = 28 + Y; y < 52; y++) { const t = (y - 28 - Y) / 17, w = Math.round(18 + t * 12); g.R(23 - w / 2, y, w, 1, y > 49 ? C2 : C); g.px(23 - w / 2, y, '#4aa070'); g.px(23 + w / 2 - 1, y, C2); }
    g.R(15, 25 + Y, 4, 6, C); g.R(27, 25 + Y, 4, 6, C);
    g.R(18, 27 + Y, 10, 3, PAL.oro); g.R(21, 30 + Y, 4, 6, PAL.oro); g.R(21, 36 + Y, 4, 1, PAL.oro2); g.px(19, 27 + Y, PAL.oro3); g.px(22, 31 + Y, PAL.oro3);
    if (cara === 'feliz') { g.line(12, 32 + Y, 6, 24 + Y - b * 2, C, 3); g.R(4, 21 + Y - b * 2, 4, 3, PAL.piel); g.line(34, 32 + Y, 40, 24 + Y - b * 2, C, 3); g.R(38, 21 + Y - b * 2, 4, 3, PAL.piel); }
    else { g.R(14, 35 + Y, 18, 4, C2); g.R(15, 35 + Y, 16, 3, C); g.R(14, 35 + Y, 3, 3, PAL.piel); g.R(29, 35 + Y, 3, 3, PAL.piel); }
    // melena: masa + mechones que se disparan (barridos por el viento hacia la derecha)
    const v = f ? 1 : 0, mx = 23, my = 12 + Y + b;
    const mechas = [[-12, -2, -21, -4], [-12, 4, -20, 8], [-10, 9, -17, 16], [-9, -8, -15, -16], [-3, -11, -5, -21], [4, -11, 6, -21], [9, -9, 15, -17], [12, -4, 22 + v, -9], [13, 2, 22 + v, 1], [12, 8, 20 + v, 13], [-6, -10, -12, -19]];
    mechas.forEach(([a, b2, c, d]) => mecha(mx + a, my + b2, mx + c, my + d, 7, H2));
    g.ellE(mx - 15, my - 13, 30, 25, H2);
    mechas.forEach(([a, b2, c, d]) => mecha(mx + a, my + b2 - 1, mx + c * .92, my + d * .92 - 1, 5, H));
    g.ellE(mx - 14, my - 13, 28, 23, H);
    [[-8, -9, -13, -15], [3, -10, 4, -17], [10, -6, 17, -12], [-11, 0, -17, -1]].forEach(([a, b2, c, d]) => mecha(mx + a, my + b2, mx + c, my + d, 2, H3));
    // cara cuadradota
    g.ellE(13, 8 + Y + b, 20, 20, PAL.piel2); g.ellE(13, 7 + Y + b, 20, 20, PAL.piel); g.R(16, 24 + Y + b, 14, 2, PAL.piel);
    g.R(13, 6 + Y + b, 20, 4, H); g.px(16, 10 + Y + b, H); g.px(17, 10 + Y + b, H); g.px(24, 10 + Y + b, H); g.px(29, 10 + Y + b, H); g.px(30, 10 + Y + b, H);
    g.R(12, 10 + Y + b, 2, 9, H); g.R(32, 10 + Y + b, 2, 9, H); // patillas
    if (cara === 'feliz' || cara === 'sorpresa') { g.R(15, 11 + Y + b, 6, 2, H2); g.R(25, 11 + Y + b, 6, 2, H2); }
    else { g.R(15, 12 + Y + b, 6, 2, H2); g.px(20, 14 + Y + b, H2); g.R(25, 12 + Y + b, 6, 2, H2); g.px(25, 14 + Y + b, H2); }
    const om = cara === 'feliz' ? 'feliz' : cara === 'sorpresa' ? 'sorpresa' : (P.parpadeo ? 'cerrado' : 'abierto');
    ojo(g, 17, 15 + Y + b, om); ojo(g, 27, 15 + Y + b, om);
    g.R(22, 17 + Y + b, 2, 4, PAL.piel2); g.R(14, 20 + Y + b, 3, 2, PAL.rubor); g.R(30, 20 + Y + b, 3, 2, PAL.rubor);
    if (cara === 'feliz') { g.R(17, 22 + Y + b, 12, 1, PAL.tinta); g.R(18, 23 + Y + b, 10, 3, PAL.vino); g.R(19, 23 + Y + b, 8, 1, PAL.blanco); g.R(20, 25 + Y + b, 6, 1, '#ff8fb0'); }
    else if (cara === 'sorpresa') g.R(21, 23 + Y + b, 4, 3, PAL.vino);
    else { g.R(19, 24 + Y + b, 8, 1, PAL.tinta); g.px(18, 25 + Y + b, PAL.tinta); g.px(27, 25 + Y + b, PAL.tinta); }
    if (cara === 'serio' && f) { g.px(41, 2, PAL.oro); g.px(42, 3, PAL.oro); g.px(41, 4, PAL.oro); g.px(42, 5, PAL.oro3); }
  }, { ax: 23, ay: 52 }));
}

// ---------- SARAH y DAVID: los sprites originales de sus juegos (heroes.js) ----------
function sprSarah(P = {}) {
  return cache('sar' + JSON.stringify(P), () => sprite(32, 34, g => { g.ctx.translate(1, 1); drawSarah(g, Object.assign({ legA: { dx: -1 }, legB: { dx: 1 }, armB: [8, 22], armF: [21, 23], cross: 'none' }, P)); }, { ax: 13, ay: 34 }));
}
function sprDavid(P = {}) {
  return cache('dav' + JSON.stringify(P), () => sprite(32, 34, g => { g.ctx.translate(1, 1); drawDavid(g, Object.assign({ legA: { dx: -1 }, legB: { dx: 1 }, armB: [8, 22], armF: [20, 22], cross: 'none' }, P)); }, { ax: 13, ay: 34 }));
}

// ---------- SANSÓN · el golden de la casa, echado frente al piano (el público) ----------
function sprSanson(P = {}) {
  return cache('san' + JSON.stringify(P), () => sprite(48, 24, g => {
    const f = P.f || 0, G = '#e8b060', G2 = '#c98a3a', G3 = '#ffd89a', G4 = '#a86a28';
    // cola de plumero (se menea)
    if (f) { g.ellE(0, 3, 12, 6, G2); g.ellE(1, 3, 10, 5, G); g.R(2, 4, 6, 1, G3); } else { g.ellE(0, 11, 12, 6, G2); g.ellE(1, 11, 10, 5, G); g.R(2, 12, 6, 1, G3); }
    // cuerpo echado con flecos largos
    g.ellE(7, 7, 30, 15, G2); g.ellE(7, 6, 29, 14, G); g.R(12, 7, 16, 1, G3); g.R(14, 9, 10, 1, G3);
    for (let x = 9; x < 34; x += 2) g.R(x, 19 + (x % 4 ? 0 : 1), 2, 2, x % 4 ? G : G2);
    g.ellE(9, 11, 11, 10, G2); g.ellE(9, 11, 10, 9, G); g.R(11, 13, 5, 1, G3); // pata de atrás
    // patas de adelante estiradas
    g.R(27, 18, 16, 4, G); g.R(27, 21, 16, 1, G2); g.px(42, 19, G4); g.px(40, 19, G4); g.R(29, 18, 8, 1, G3);
    // cabeza: cráneo, hocico claro, nariz, oreja larga
    g.ellE(28, 0, 16, 15, G2); g.ellE(28, 0, 15, 14, G); g.R(31, 1, 6, 1, G3);
    g.ellE(37, 6, 10, 8, G3); g.ellE(38, 8, 8, 5, '#ffe4b8');
    g.R(44, 7, 3, 3, PAL.tinta); g.px(44, 7, PAL.tinta2);
    g.R(40, 12, 4, 1, G4);
    if (P.lengua) { g.R(40, 13, 3, 3, '#ff8fb0'); g.px(41, 15, '#e06090'); }
    g.ellE(26, 3, 8, 14, G4); g.ellE(26, 3, 7, 13, G2); g.R(27, 6, 1, 7, G); g.px(28, 16, G2); // oreja
    ojo(g, 35, 4, P.ojos || 'abierto');
    g.R(33, 2, 3, 1, G4);
  }, { ax: 24, ay: 24 }));
}

// ---------- NOTITA: la nota que cae, color de su nota, con su nombre en la barriga ----------
function sprNotita(nombre, P = {}) {
  return cache('nt' + nombre + JSON.stringify(P), () => {
    const C = NOTA[nombre], w = 19, h = 19;
    return sprite(w, h, g => {
      const om = P.ojos || 'abierto';
      g.ellE(0, 1, w, h - 1, C.o); g.ellE(0, 0, w, h - 2, C.c); g.ellE(3, 1, 5, 3, C.l); g.px(4, 2, PAL.blanco);
      ojo(g, 5, 3, om); ojo(g, 12, 3, om);
      if (om === 'feliz') g.R(8, 6, 3, 1, PAL.tinta);
      g.ellE(2, 8, 15, 9, PAL.blanco); g.R(4, 16, 11, 1, C.l);
      const tw = anchoTexto(nombre); textoPix(g, nombre, Math.round((w - tw) / 2), 10, PAL.tinta);
    }, { ax: Math.floor(w / 2), ay: Math.floor(h / 2) });
  });
}
// ---------- estrella grande (premio) y chica ----------
function sprEstrella(llena = true) {
  return cache('est' + llena, () => sprite(15, 15, g => {
    const c = llena ? PAL.oro : PAL.n2, c2 = llena ? PAL.oro2 : PAL.n1, c3 = llena ? PAL.oro3 : PAL.n3;
    const rows = ['.......x.......', '......xxx......', '......xxx......', '.....xxxxx.....', 'xxxxxxxxxxxxxxx', '.xxxxxxxxxxxxx.', '..xxxxxxxxxxx..', '...xxxxxxxxx...', '...xxxxxxxxx...', '..xxxxxxxxxxx..', '..xxxxx.xxxxx..', '.xxxx.....xxxx.', '.xxx.......xxx.', 'xx...........xx', '...............'];
    g.map(rows, { x: c }); g.R(6, 3, 2, 3, c3); g.R(3, 5, 3, 1, c3); g.R(9, 10, 3, 1, c2); g.R(11, 11, 2, 1, c2);
  }, { ax: 7, ay: 7 }));
}
