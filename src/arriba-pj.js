// =====================================================================
//  M5c · LOS PERSONAJES DEL MUNDO DESDE ARRIBA, CON LA CALIDAD DE LOS ORIGINALES
//  Sarah y David: de lado son EXACTAMENTE sus sprites originales (heroes.js, con su ciclo de 4 cuadros y su traje);
//  de frente y de espaldas, dibujados con la misma paleta, los mismos ojos, la diadema, los rizos y la ropa.
//  Papá, mamá y los vecinos: el mismo dibujo de adulto()/chico() de personajes.js, ahora en 4 direcciones × 4 cuadros.
//  Sansón: el golden de pelo largo caminando. Todo se pinta una sola vez y queda en caché (cache()).
//  Estas funciones reemplazan a las de arriba-spr.js (van después en el mismo script).
// =====================================================================
const KP5 = 2;   // escala de los personajes en el mundo (píxeles enteros: nítidos)
const PASO_PJ5 = [[0, 0], [2, 0], [0, 0], [0, 2]];   // pie levantado (izq, der) por cuadro
const ojosPJ5 = o => o === 'blink' ? 'cerrado' : o === 'happy' ? 'feliz' : null;
// ---------- SARAH de frente y de espaldas (32×34, como su sprite original) ----------
function sarahFA5(g, dir, f, ojos, traje) {
  const T = TRAJES_PJ5.sarah[traje] || {}, D = T.d || SH.d, D2 = T.d2 || SH.d2, D3 = T.d3 || SH.d3, RF = T.ruff || SH.ruff, atras = dir === 'arriba';
  const b = f % 2 ? -1 : 0, [la, ra] = PASO_PJ5[f % 4], s = f === 1 ? 1 : f === 3 ? -1 : 0, cx = 16, CAPA = traje === 'viajero' ? ['#2a4b9b', '#1d3672'] : null;
  // pelo largo por detrás (con ondas), a los dos lados
  if (!atras) for (let y = 8; y <= 24; y++) { const t = (y - 8) / 16, w = y > 21 ? 3 : 4, ond = Math.round(Math.sin(y * .7) * .6 * t); g.R(cx - 9 - ond, y + b, w, 1, SH.hair); g.R(cx + 5 + ond + (4 - w), y + b, w, 1, SH.hair); if (y % 4 === 1) { g.px(cx - 8 - ond, y + b, SH.hair3); g.px(cx + 7 + ond, y + b, SH.hair2); } g.px(cx - 9 - ond, y + b, SH.hairD); g.px(cx + 8 + ond, y + b, SH.hairD); }
  // capa de viajero
  if (CAPA) { if (atras) { for (let y = 16; y <= 26; y++) { const w = 12 + Math.floor((y - 16) / 3); g.R(cx - w / 2, y + b, w, 1, y === 26 ? CAPA[1] : CAPA[0]); } } else { g.R(cx - 10, 17 + b, 3, 10, CAPA[0]); g.R(cx + 7, 17 + b, 3, 10, CAPA[0]); g.R(cx - 10, 26 + b, 3, 1, CAPA[1]); g.R(cx + 7, 26 + b, 3, 1, CAPA[1]); } }
  // piernas y zapatitos
  const pierna = (x, alza, osc) => { g.R(x, 27, 2, 4 - alza, osc ? SH.skin2 : SH.skin); g.R(x - 1, 31 - alza, 4, 2, osc ? '#9a2658' : SH.shoe); if (!osc) g.px(x, 31 - alza, '#ff9fc7'); };
  pierna(cx - 3, la, atras); pierna(cx + 1, ra, atras);
  // falda acampanada con volantes y brillitos
  const filas = [[20, 9], [21, 11], [22, 11], [23, 13], [24, 13], [25, 15], [26, 15], [27, 17]];
  for (const [y, w] of filas) { const x = cx - Math.floor(w / 2), yy = y + b;
    if (y === 27) { g.R(x, yy, w, 1, RF); for (let i = 0; i < w; i += 2) g.px(x + i, yy + 1, RF); continue; }
    g.R(x, yy, w, 1, D); g.R(x, yy, 2, 1, D3); g.R(x + w - 2, yy, 2, 1, D2); if (y >= 23) { g.px(x + Math.floor(w / 3), yy, D3); g.px(x + Math.floor(w * 2 / 3), yy, D2); } if (y === 26) g.R(x + 2, yy, w - 4, 1, D2); }
  if (!atras) [[cx - 3, 23], [cx + 3, 25], [cx, 26], [cx + 4, 22], [cx - 5, 25]].forEach(([x, y], i) => { if ((i + f) % 3 === 0) g.px(x, y + b, K.white); });
  // corpiño
  const ty = 16 + b; g.R(cx - 4, ty, 9, 5, D); g.R(cx - 4, ty, 1, 5, D3); g.R(cx + 3, ty + 1, 2, 3, D2); g.R(cx - 4, ty + 4, 9, 1, D2);
  if (!atras) { g.R(cx - 2, ty, 5, 1, K.white); g.px(cx, ty + 1, K.white); g.px(cx, ty + 2, K.gold); g.px(cx + 1, ty + 2, K.gold); g.px(cx, ty + 3, K.gem); }
  // brazos con mangas abullonadas (se balancean)
  [[-1, s], [1, -s]].forEach(([lado, sw]) => { const x = lado < 0 ? cx - 7 : cx + 6, hx = x + (lado < 0 ? 0 : 0); g.R(x, 18 + b + sw, 2, 5, atras ? SH.skin2 : SH.skin); g.R(hx, 23 + b + sw, 2, 2, atras ? SH.skin2 : SH.skin); g.R(lado < 0 ? cx - 7 : cx + 5, 16 + b, 3, 3, D2); g.px(lado < 0 ? cx - 6 : cx + 6, 16 + b, K.white); });
  if (CAPA && !atras) { g.R(cx - 6, 16 + b, 13, 2, CAPA[0]); g.px(cx, 17 + b, '#ffd046'); g.px(cx + 1, 17 + b, '#d9a930'); }
  // cabeza
  const hy = b;
  g.ellE(cx - 8, hy + 1, 16, 15, SH.hair); g.ellE(cx - 6, hy + 1, 12, 8, SH.hair2); g.R(cx - 4, 3 + hy, 7, 1, SH.hair3);
  if (atras) {   // de espaldas: la melena larga con sus ondas y la diadema por detrás
    for (let y = 9; y <= 23; y++) { const w = y < 14 ? 16 : y < 20 ? 14 : 12, x = cx - w / 2, ond = Math.round(Math.sin(y * .7 + f) * .7); g.R(x + ond, y + hy, w, 1, SH.hair); if (y % 3 === 0) { g.R(x + 3 + ond, y + hy, 2, 1, SH.hair2); g.R(x + w - 5 + ond, y + hy, 2, 1, SH.hair3); } if (y % 3 === 2) g.R(cx - 1 + ond, y + hy, 2, 1, SH.hairD); }
    g.R(cx - 7, 23 + hy, 2, 1, SH.hairD); g.R(cx + 5, 23 + hy, 2, 1, SH.hairD);
    g.R(cx - 3, 2 + hy, 6, 1, K.gold2); g.R(cx - 3, 1 + hy, 6, 1, K.gold); g.px(cx - 8, 10 + hy, SH.skin2); g.px(cx + 7, 10 + hy, SH.skin2);
    return;
  }
  g.ellE(cx - 6, 4 + hy, 12, 12, SH.skin); g.R(cx - 6, 9 + hy, 1, 4, SH.skin2); g.R(cx - 1, 15 + hy, 2, 1, SH.skin2);
  // flequillo en ondas y mechones que enmarcan la cara
  for (let x = cx - 7; x <= cx + 6; x++) { const d = ([cx - 3, cx - 2, cx + 1, cx + 2].includes(x) ? 8 : 8 + ((x % 3 === 1) ? 1 : 0)); g.R(x, 3 + hy, 1, d - 3, SH.hair); if (x % 3 === 2) g.px(x, d - 1 + hy, SH.hairD); }
  g.px(cx - 3, 5 + hy, SH.hair3); g.px(cx + 1, 4 + hy, SH.hair3); g.px(cx + 3, 6 + hy, SH.hair2);
  g.R(cx - 8, 6 + hy, 2, 10, SH.hair); g.px(cx - 8, 9 + hy, SH.hair3); g.R(cx + 6, 6 + hy, 2, 10, SH.hair); g.px(cx + 7, 10 + hy, SH.hair2); g.px(cx - 7, 16 + hy, SH.hair2); g.px(cx + 6, 16 + hy, SH.hair2);
  // ojos grandes (los de Sarah: iris morado y brillo)
  const ojo = x => { if (ojos === 'blink') { g.R(x, 12 + hy, 2, 1, SH.eye); g.px(x - (x < cx ? 1 : -2), 11 + hy, SH.eye); return; } if (ojos === 'happy') { g.px(x, 11 + hy, SH.eye); g.px(x + 1, 11 + hy, SH.eye); g.px(x - 1, 12 + hy, SH.eye); g.px(x + 2, 12 + hy, SH.eye); return; }
    g.R(x, 9 + hy, 2, 4, SH.eye); g.px(x, 10 + hy, K.white); g.px(x, 9 + hy, '#4a2a66'); g.R(x, 12 + hy, 2, 1, SH.iris); g.px(x + 1, 12 + hy, '#c9a3ff'); };
  ojo(cx - 4); ojo(cx + 2); if (!ojos) { g.px(cx - 5, 9 + hy, SH.eye); g.px(cx + 4, 9 + hy, SH.eye); }
  g.R(cx - 6, 13 + hy, 2, 1, SH.blush); g.R(cx + 4, 13 + hy, 2, 1, SH.blush);
  if (ojos === 'happy') { g.R(cx - 1, 14 + hy, 3, 1, SH.mouth); g.px(cx, 15 + hy, '#ff8fb0'); } else { g.px(cx - 1, 14 + hy, SH.mouth); g.px(cx, 14 + hy, SH.mouth); g.px(cx + 1, 13 + hy, SH.mouth); }
  // la diadema con su corazón
  g.R(cx - 3, 2 + hy, 6, 1, K.gold); g.R(cx - 3, 3 + hy, 6, 1, K.gold2); g.px(cx - 3, 1 + hy, K.gold); g.px(cx + 2, 1 + hy, K.gold); g.R(cx - 1, hy, 2, 2, K.gem); g.px(cx - 1, hy, '#ffc1d6'); g.px(cx - 2, 1 + hy, K.gold3); g.px(cx + 1, 1 + hy, K.gold3);
  if (traje === 'barroco') { g.R(cx - 7, -1 + hy, 14, 2, '#fffaf4'); g.px(cx, -2 + hy, '#ff9cc4'); }
  if (traje === 'andino') { g.R(cx - 12, 3 + hy, 24, 2, '#e8d6a0'); g.R(cx - 7, -1 + hy, 14, 5, '#e8d6a0'); g.R(cx - 7, 2 + hy, 14, 1, '#2a1a3a'); }
}
// ---------- DAVID de frente y de espaldas ----------
function davidFA5(g, dir, f, ojos, traje) {
  const T = TRAJES_PJ5.david[traje] || {}, TU = T.tun || DV.tun, TU2 = T.tun2 || DV.tun2, TU3 = T.tun3 || DV.tun3, VE = T.vest || DV.vest, atras = dir === 'arriba';
  const b = f % 2 ? -1 : 0, [la, ra] = PASO_PJ5[f % 4], s = f === 1 ? 1 : f === 3 ? -1 : 0, cx = 16, CAPA = traje === 'viajero' ? ['#8a3a22', '#6a2a16'] : null;
  if (CAPA) { if (atras) { for (let y = 15; y <= 27; y++) { const w = 11 + Math.floor((y - 15) / 3); g.R(cx - w / 2, y + b, w, 1, y % 5 === 0 ? CAPA[1] : CAPA[0]); } } else { g.R(cx - 9, 16 + b, 3, 11, CAPA[0]); g.R(cx + 6, 16 + b, 3, 11, CAPA[0]); } }
  // piernas y sandalias
  const pierna = (x, alza, osc) => { g.R(x, 26, 2, 5 - alza, osc ? DV.skin2 : DV.skin); g.R(x - 1, 31 - alza, 4, 2, DV.sand); g.px(x, 30 - alza, DV.sand); };
  pierna(cx - 3, la, atras); pierna(cx + 1, ra, atras);
  // túnica con chaleco
  for (let y = 16; y <= 25; y++) { const yy = y + b, w = y < 21 ? 10 : 10 + Math.floor((y - 20) / 2), x = cx - Math.floor(w / 2);
    g.R(x, yy, w, 1, TU); g.px(x, yy, TU3); g.px(x + w - 1, yy, TU2);
    if (y < 22) { if (atras) g.R(x + 1, yy, w - 2, 1, VE); else { g.R(x, yy, 3, 1, VE); g.R(x + w - 3, yy, 3, 1, VE); g.px(x + w - 1, yy, DV.vest2); } }
    if (y === 25) for (let i = 0; i < w; i += 2) g.px(x + i, yy, TU3); }
  g.R(cx - 5, 21 + b, 10, 1, DV.belt); if (!atras) { g.px(cx + 2, 22 + b, DV.belt2); g.px(cx + 2, 23 + b, DV.belt); for (let i = 0; i < 6; i++) g.px(cx - 3 + i, 16 + i + b, DV.belt); }
  // brazos (se balancean), bolsita
  [[-1, s], [1, -s]].forEach(([lado, sw]) => { const x = lado < 0 ? cx - 7 : cx + 5; g.R(x, 17 + b + sw, 2, 5, DV.skin); g.R(x, 22 + b + sw, 2, 2, DV.skin2); g.R(x, 16 + b, 2, 2, TU2); });
  if (!atras) { g.R(cx + 5, 22 + b, 4, 4, DV.bag); g.R(cx + 5, 22 + b, 4, 1, '#d08a54'); }
  if (CAPA && !atras) { g.R(cx - 6, 15 + b, 12, 2, CAPA[0]); g.px(cx, 16 + b, '#ffd046'); }
  // cabeza: rizos rubio-rojizos y la cinta roja
  const hy = b;
  g.ellE(cx - 6, 4 + hy, 12, 12, DV.skin); g.R(cx - 6, 9 + hy, 1, 3, DV.skin2); g.R(cx - 1, 15 + hy, 2, 1, DV.skin2);
  const rizos = atras ? [[-5, 4], [-2, 3], [1, 3], [4, 4], [-6, 7], [5, 7], [-5, 10], [-1, 9], [3, 9], [-3, 6], [2, 6], [-6, 12], [5, 11], [0, 12]] : [[-5, 4], [-2, 3], [1, 3], [4, 4], [-6, 7], [5, 7], [-6, 10], [6, 10], [-3, 4], [2, 4]];
  for (const [dx, y] of rizos) { g.disc(cx + dx, y + hy, 2, DV.hair); g.px(cx + dx, y - 1 + hy, DV.hair3); g.px(cx + dx + 1, y + 1 + hy, DV.hairD); }
  if (!atras) { g.R(cx - 5, 4 + hy, 10, 3, DV.hair); g.px(cx - 2, 4 + hy, DV.hair3); g.px(cx + 2, 5 + hy, DV.hair2); }
  g.R(cx - 6, 7 + hy, 12, 2, DV.band); g.R(cx - 6, 8 + hy, 12, 1, DV.band2);
  if (atras) { g.R(cx - 1, 9 + hy, 2, 4, DV.band); g.R(cx + 1, 9 + hy, 1, 3, DV.band2); g.px(cx - 7, 11 + hy, DV.skin2); g.px(cx + 6, 11 + hy, DV.skin2); return; }
  g.R(cx - 8, 8 + hy, 2, 1, DV.band); g.R(cx - 9, 9 + hy, 2, 1, DV.band2);
  const ojo = x => { if (ojos === 'blink') { g.R(x, 12 + hy, 2, 1, DV.eye); return; } if (ojos === 'happy') { g.px(x, 11 + hy, DV.eye); g.px(x + 1, 11 + hy, DV.eye); g.px(x - 1, 12 + hy, DV.eye); g.px(x + 2, 12 + hy, DV.eye); return; } g.R(x, 10 + hy, 2, 3, DV.eye); g.px(x + 1, 10 + hy, K.white); };
  ojo(cx - 4); ojo(cx + 2); g.R(cx - 5, 9 + hy, 3, 1, DV.hairD); g.R(cx + 2, 9 + hy, 3, 1, DV.hairD);
  g.px(cx - 6, 13 + hy, DV.blush); g.px(cx + 5, 13 + hy, DV.blush);
  if (ojos === 'happy') { g.R(cx - 1, 14 + hy, 3, 1, DV.mouth); g.px(cx, 15 + hy, '#ff8f8f'); } else { g.px(cx - 1, 14 + hy, DV.mouth); g.px(cx, 14 + hy, DV.mouth); g.px(cx + 1, 13 + hy, DV.mouth); }
  if (traje === 'barroco') { g.R(cx - 10, 1 + hy, 20, 3, '#2a1a3a'); g.R(cx - 6, -1 + hy, 12, 3, '#2a1a3a'); g.px(cx, 1 + hy, '#ffd046'); }
  if (traje === 'andino') { g.R(cx - 12, 3 + hy, 24, 2, '#e8d6a0'); g.R(cx - 7, -1 + hy, 14, 5, '#e8d6a0'); g.R(cx - 7, 2 + hy, 14, 1, '#2a1a3a'); }
}
const TRAJES_PJ5 = { sarah: { medieval: { d: '#2e8b6a', d2: '#6fcfa6', d3: '#1f6a50' }, barroco: { d: '#c23345', d2: '#ff7a8a', d3: '#8a1f30', ruff: '#fffaf4' }, andino: { d: '#d2452e', d2: '#ff8a5a', d3: '#9a2a1a', ruff: '#fbf1d8' } },
  david: { medieval: { tun: '#6a8a5a', tun2: '#8fb07a', tun3: '#4a6a3a', vest: '#4a3226' }, barroco: { tun: '#2a4b9b', tun2: '#5a7dff', tun3: '#1d3672', vest: '#ffd046' }, andino: { tun: '#c98a52', tun2: '#e8b47c', tun3: '#8a5a34', vest: '#c23345' } } };
// el héroe en 4 direcciones: de lado, su sprite original (ciclo de caminar de heroes.js) con su traje
function spriteHeroeA5(dir, f, ojos) {
  const a7 = heroeArte7(dir, f); if (a7) return a7;   /* M7: la hoja de Gemini */
  const p = GUARDA.d.perfil || 'sarah', t = trajeActual5();
  if (p !== 'sarah' && p !== 'david') return sprPersona5(personaHeroe5(), dir, f, ojos);
  if (dir === 'lado') { const Q = f ? Object.assign({}, CAMINA5[f % 4]) : {}; if (p === 'sarah') Q.cross = 'up'; if (ojos) Q.eyes = ojos; const b = p === 'sarah' ? sprSarah(Q) : sprDavid(Q); b.clave = 'ha' + (f ? f % 4 : 'q') + (ojos || ''); return conTraje(b, t, p); }
  return cache('hFA' + p + t + dir + (f % 4) + (ojos || ''), () => sprite(32, 34, g => (p === 'sarah' ? sarahFA5 : davidFA5)(g, dir, f % 4, ojos, t), { ax: 16, ay: 34 }));
}
// papá y mamá caminan con su dibujo de adulto() original
function personaHeroe5() { const p = GUARDA.d.perfil || 'sarah';
  if (p === 'papa') return { id: 'papaA', adulto: true, barba: '#3a2418', pelo: '#3a2418', peinado: 'corto', ropa: '#fff6e6', saco: '#2c3a6b', pantalon: '#3a3a52', extraF: g => { g.R(1, 27, 6, 7, '#7a1f3d'); g.R(2, 28, 4, 5, '#a3243a'); g.R(3, 29, 2, 1, '#ffd046'); g.ell(17, 30, 5, 4, '#c98a52'); g.ell(20, 26, 4, 3, '#c98a52'); g.disc(18, 29, 1, '#3a2418'); g.line(9, 18, 18, 30, '#5a3418'); } };
  if (p === 'mama') return { id: 'mamaA', adulto: true, largo: true, falda: true, pelo: '#6b3826', pelo2: '#a0603a', piel: '#f2c4a0', piel2: '#d9a07a', ropa: '#ff8a7a', ropa2: '#e0606a', extraF: g => { g.R(17, 22, 7, 6, '#5fd36a'); g.R(18, 23, 5, 4, '#b9f2b0'); g.px(20, 24, NC.DO); g.px(21, 25, NC.LA); g.R(15, 3, 3, 2, '#ffd046'); } };
  return Object.assign(persona5(PERS5[p], null), { id: p }); }
// ---------- ADULTOS y NIÑOS (vecinos, papá, mamá): el dibujo de adulto()/chico() en 4 direcciones × 4 cuadros ----------
// o: { adulto, piel, piel2, pelo, pelo2, peinado ('corto'|'largo'|'rizos'|'calvo'), largo, barba (color), velo, sombrero, ropa, ropa2, saco,
//      pantalon, falda, larga (túnica hasta el tobillo), delantal, cinturon, capa, capa2, bolso, baculo, zapato, lazo, extraF (detalle al frente) }
function sprPersona5(o, dir = 'abajo', f = 0, ojos = null, resp = 0) {
  const clave = 'pA5' + (o.id || (o.ropa || '') + (o.pelo || '')) + dir + (f % 4) + (ojos || '');
  return cache(clave, () => o.adulto ? sprite(28, 46, g => adultoA5(g, o, dir, f % 4, ojosPJ5(ojos)), { ax: 14, ay: 46 }) : sprite(26, 34, g => chicoA5(g, o, dir, f % 4, ojosPJ5(ojos)), { ax: 13, ay: 34 }));
}
function coloresPJ5(o) { const ro = o.ropa || '#8a6a40'; return { pi: o.piel || '#e8b48c', pi2: o.piel2 || mezcla(o.piel || '#e8b48c', '#7a3a2a', .22), pe: o.pelo || '#3a2418', pe2: o.pelo2 || mezcla(o.pelo || '#3a2418', '#ffffff', .22), ro, ro2: o.ropa2 || mezcla(ro, '#000', .22), ro3: o.ropa3 || mezcla(ro, '#ffffff', .3), za: o.zapato || '#3a2418', pa: o.pantalon || o.pierna || '#3a4a6b' }; }
function adultoA5(g, o, dir, f, ojos) {
  const C = coloresPJ5(o), lado = dir === 'lado', atras = dir === 'arriba', b = f % 2 ? -1 : 0, [la, ra] = PASO_PJ5[f], s = f === 1 ? 1 : f === 3 ? -1 : 0, X = 1;
  const falda = o.falda || o.larga, largoPelo = o.largo || o.peinado === 'largo';
  // capa y pelo largo por detrás
  if (o.capa && !atras && !lado) { g.R(X + 4, 15 + b, 3, 15, o.capa); g.R(X + 19, 15 + b, 3, 15, o.capa); }
  if (largoPelo && !o.velo && !atras) { if (lado) g.R(X + 5, 6 + b, 6, 20, C.pe); else g.R(X + 5, 6 + b, 16, 22, C.pe); }
  if (o.baculo && atras) { g.R(X + 3, 4, 2, 42, '#8a5a2a'); g.R(X + 3, 2, 4, 2, '#8a5a2a'); }
  // piernas: falda/túnica o pantalón, con el paso
  if (falda) {
    const r0 = o.larga && !o.falda ? C.ro : C.ro2, top = o.larga ? 24 : 26;
    for (let y = top; y < 42; y++) { const half = Math.round(6 + (y - top) * (lado ? .22 : .32)); g.R(X + 13 - half + (lado ? 1 : 0), y + (y < 30 ? b : 0), half * 2, 1, r0); g.px(X + 13 - half + (lado ? 1 : 0), y, mezcla(r0, '#000', .2)); if (!lado) g.px(X + 13 + half - 1, y, mezcla(r0, '#fff', .2)); }
    g.R(X + 7, 41, 13, 1, mezcla(r0, '#000', .25));
    if (lado) { const st = f === 1 ? 3 : f === 3 ? -3 : 0; g.R(X + 11 + st, 42, 6, 3, C.za); g.R(X + 11 - st, 42, 5, 3, mezcla(C.za, '#000', .2)); }
    else { g.R(X + 8, 42 - la, 5, 3, C.za); g.R(X + 14, 42 - ra, 5, 3, C.za); g.R(X + 9, 41 - la, 3, 1, C.pi2); g.R(X + 15, 41 - ra, 3, 1, C.pi2); }
  } else if (lado) { const st = f === 1 ? 3 : f === 3 ? -3 : 0; g.R(X + 10 - st, 28, 4, 14, mezcla(C.pa, '#000', .2)); g.R(X + 9 - st, 42, 6, 4, mezcla(C.za, '#000', .2)); g.R(X + 11 + st, 28, 4, 14 - (f ? 1 : 0), C.pa); g.R(X + 11 + st, 42 - (f ? 1 : 0), 7, 4, C.za); }
  else { g.R(X + 8, 28, 4, 14 - la, C.pa); g.R(X + 14, 28, 4, 14 - ra, C.pa); g.R(X + 8, 28, 1, 14 - la, mezcla(C.pa, '#fff', .15)); g.R(X + 7, 42 - la, 6, 4, C.za); g.R(X + 14, 42 - ra, 6, 4, C.za); g.R(X + 8, 42 - la, 2, 1, mezcla(C.za, '#fff', .3)); g.R(X + 15, 42 - ra, 2, 1, mezcla(C.za, '#fff', .3)); }
  // torso (2–3 tonos), saco, delantal, cinturón
  const tx = lado ? X + 9 : X + 7, tw = lado ? 10 : 12;
  g.R(tx, 15 + b, tw, 14, C.ro); g.R(tx, 15 + b, tw, 1, C.ro3); g.R(tx, 15 + b, 1, 14, C.ro2); g.R(tx + tw - 1, 16 + b, 1, 13, C.ro3);
  if (o.saco && !atras) { if (lado) g.R(tx, 15 + b, 4, 14, o.saco); else { g.R(tx, 15 + b, 3, 14, o.saco); g.R(tx + tw - 3, 15 + b, 3, 14, o.saco); } }
  if (o.saco && atras) g.R(tx, 15 + b, tw, 14, o.saco);
  if (o.delantal && !atras) { g.R(lado ? tx + 5 : tx + 2, 19 + b, lado ? 5 : tw - 4, 16, o.delantal); g.R(lado ? tx + 5 : tx + 2, 19 + b, lado ? 5 : tw - 4, 1, mezcla(o.delantal, '#000', .15)); }
  if (o.cinturon) g.R(tx, 24 + b, tw, 1, o.cinturon);
  if (o.capa && atras) { for (let y = 15; y < 34; y++) g.R(X + 6, y + (y < 30 ? b : 0), 15, 1, y % 6 === 5 ? (o.capa2 || mezcla(o.capa, '#000', .25)) : o.capa); }
  if (o.bolso && !atras) { g.R(lado ? tx - 1 : tx + tw - 2, 24 + b, 4, 5, o.bolso); g.R(lado ? tx - 1 : tx + tw - 2, 24 + b, 4, 1, mezcla(o.bolso, '#fff', .3)); }
  // brazos que se balancean
  const ma = o.saco || C.ro;
  if (lado) { g.R(X + 12 + s * 2, 16 + b, 3, 10, mezcla(ma, '#000', .12)); g.R(X + 12 + s * 3, 26 + b, 3, 2, C.pi); }
  else { g.R(X + 5, 16 + b + s, 2, 10, ma); g.R(X + 19, 16 + b - s, 2, 10, ma); g.R(X + 5, 26 + b + s, 2, 2, atras ? C.pi2 : C.pi); g.R(X + 19, 26 + b - s, 2, 2, atras ? C.pi2 : C.pi); }
  if (o.baculo && !atras) { const bx = lado ? X + 20 : X + 21; g.R(bx, 6 + b, 2, 40 - b, '#8a5a2a'); g.R(bx - 2, 4 + b, 4, 2, '#8a5a2a'); g.R(bx - 3, 5 + b, 2, 3, '#8a5a2a'); g.px(bx, 7 + b, '#b8844a'); }
  // cabeza
  const hy = b, hx = lado ? X + 7 : X + 6;
  g.R(X + 11 + (lado ? 1 : 0), 13 + hy, 4, 3, C.pi2);
  if (atras) {
    g.ellE(hx, 1 + hy, 14, 14, o.peinado === 'calvo' ? C.pi : C.pe); if (o.peinado === 'calvo') { g.R(hx, 6 + hy, 14, 6, C.pe); g.px(hx + 4, 3 + hy, mezcla(C.pi, '#fff', .3)); } else { g.R(hx + 3, 2 + hy, 5, 1, C.pe2); g.R(hx + 2, 6 + hy, 3, 1, C.pe2); }
    if (largoPelo && !o.velo) { g.R(X + 6, 10 + hy, 14, 15, C.pe); for (let y = 12; y < 25; y += 3) { g.R(X + 9, y + hy, 2, 1, C.pe2); g.R(X + 15, y + 1 + hy, 2, 1, C.pe2); } }
    g.px(hx - 1, 8 + hy, C.pi); g.px(hx + 14, 8 + hy, C.pi);
  } else if (lado) {
    g.ellE(hx, 1 + hy, 13, 14, C.pi); g.R(hx + 12, 7 + hy, 2, 2, C.pi); g.px(hx + 13, 8 + hy, C.pi2);
    ojo(g, hx + 8, 6 + hy, ojos || 'abierto', '#2b1740'); g.R(hx + 7, 10 + hy, 2, 1, '#ff9fb4');
    if (o.barba) { g.R(hx + 4, 9 + hy, 9, 5, o.barba); g.R(hx + 6, 13 + hy, 6, 2, o.barba); g.R(hx + 9, 10 + hy, 3, 1, '#c25a5a'); } else g.R(hx + 10, 11 + hy, 3, 1, '#c25a5a');
    if (o.peinado !== 'calvo') { g.ellE(hx - 1, hy, 12, 7, C.pe); g.R(hx - 1, 3 + hy, 5, 9, C.pe); g.R(hx + 2, 1 + hy, 5, 1, C.pe2); } else { g.R(hx - 1, 5 + hy, 4, 6, C.pe); }
  } else {
    g.ellE(hx, 1 + hy, 14, 14, C.pi); g.R(hx, 5 + hy, 1, 6, C.pi2);
    ojo(g, hx + 3, 7 + hy, ojos || 'abierto', '#2b1740'); ojo(g, hx + 9, 7 + hy, ojos || 'abierto', '#2b1740'); g.R(hx + 2, 11 + hy, 2, 1, '#ff9fb4'); g.R(hx + 10, 11 + hy, 2, 1, '#ff9fb4');
    if (o.barba) { g.R(hx + 1, 10 + hy, 12, 5, o.barba); g.R(hx + 3, 14 + hy, 8, 2, o.barba); g.R(hx + 5, 11 + hy, 4, 1, '#c25a5a'); g.R(hx + 3, 10 + hy, 8, 1, C.pi); } else g.R(hx + 5, 11 + hy, 4, 1, '#c25a5a');
    if (o.peinado === 'calvo') { g.R(hx, 5 + hy, 2, 5, C.pe); g.R(hx + 12, 5 + hy, 2, 5, C.pe); g.px(hx + 5, 2 + hy, mezcla(C.pi, '#fff', .35)); }
    else if (largoPelo) { g.ellE(hx - 1, hy, 16, 7, C.pe); g.R(hx - 1, 3 + hy, 3, 12, C.pe); g.R(hx + 12, 3 + hy, 3, 12, C.pe); g.R(hx + 3, 1 + hy, 6, 1, C.pe2); }
    else if (o.peinado === 'rizos') { for (let i = 0; i < 7; i++) g.disc(hx + 1 + i * 2, 2 + (i % 2) + hy, 2, i % 2 ? C.pe : C.pe2); g.disc(hx, 6 + hy, 2, C.pe); g.disc(hx + 14, 6 + hy, 2, C.pe); }
    else { g.ellE(hx, hy, 14, 6, C.pe); g.R(hx, 3 + hy, 2, 5, C.pe); g.R(hx + 12, 3 + hy, 2, 5, C.pe); g.R(hx + 3, 1 + hy, 5, 1, C.pe2); }
  }
  // velo, sombrero y lo del frente
  if (o.velo) { const v = o.velo, v2 = mezcla(v, '#000', .2), v3 = mezcla(v, '#fff', .25);   // el manto de la cabeza: enmarca la cara sin taparla
    if (atras) { g.ellE(hx - 1, hy - 1, 16, 15, v); g.R(hx - 1, 8 + hy, 16, 14, v); g.R(hx + 6, 9 + hy, 2, 13, v2); g.R(hx + 2, hy + 1, 4, 1, v3); }
    else if (lado) { g.ellE(hx - 1, hy - 2, 13, 7, v); g.R(hx - 2, 2 + hy, 5, 17, v); g.R(hx - 2, 2 + hy, 2, 17, v2); g.R(hx + 2, hy - 1, 6, 1, v3); g.R(hx + 3, 3 + hy, 9, 1, v2); }
    else { g.ellE(hx - 1, hy - 2, 16, 7, v); g.R(hx - 2, 2 + hy, 3, 18, v); g.R(hx + 13, 2 + hy, 3, 18, v); g.R(hx - 2, 2 + hy, 1, 18, v2); g.R(hx + 15, 2 + hy, 1, 18, v2); g.R(hx + 3, hy - 1, 8, 1, v3); g.R(hx + 1, 3 + hy, 12, 1, v2); } }
  if (o.sombrero) { const S = o.sombrero; g.R(hx - 3, 2 + hy, 20, 2, S); g.ellE(hx + 1, -3 + hy, 12, 8, S); g.R(hx + 1, 1 + hy, 12, 1, mezcla(S, '#000', .3)); g.R(hx + 3, -2 + hy, 4, 1, mezcla(S, '#fff', .3)); }
  if (o.lazo && !atras) { g.R(hx + 10, hy, 5, 3, o.lazo); }
  if (o.extraF && dir === 'abajo') o.extraF(g);
}
function chicoA5(g, o, dir, f, ojos) {
  const C = coloresPJ5(Object.assign({ piel: '#ffd6b8', pelo: '#6b3826' }, o)), lado = dir === 'lado', atras = dir === 'arriba', b = f % 2 ? -1 : 0, [la, ra] = PASO_PJ5[f], s = f === 1 ? 1 : f === 3 ? -1 : 0;
  const largoPelo = o.peinado === 'largo';
  if (largoPelo && !atras) { if (lado) g.R(5, 7 + b, 6, 16, C.pe); else { g.R(5, 7 + b, 16, 14, C.pe); g.R(5, 18 + b, 3, 5, C.pe); g.R(18, 18 + b, 3, 5, C.pe); } }
  // piernas y zapatos
  if (lado) { const st = f === 1 ? 2 : f === 3 ? -2 : 0; g.R(11 - st, 27, 3, 5, C.pi2); g.R(10 - st, 31, 5, 3, mezcla(C.za, '#000', .2)); g.R(12 + st, 27, 3, 5 - (f ? 1 : 0), C.pi); g.R(12 + st, 31 - (f ? 1 : 0), 6, 3, C.za); }
  else { g.R(9, 27, 3, 5 - la, atras ? C.pi2 : C.pi); g.R(14, 27, 3, 5 - ra, atras ? C.pi2 : C.pi); g.R(8, 31 - la, 5, 3, C.za); g.R(13, 31 - ra, 5, 3, C.za); g.R(9, 31 - la, 2, 1, mezcla(C.za, '#fff', .3)); g.R(14, 31 - ra, 2, 1, mezcla(C.za, '#fff', .3)); }
  // cuerpo
  const tx = lado ? 9 : 8, tw = lado ? 9 : 10;
  if (o.falda) { for (let y = 17; y < 29; y++) { const half = Math.round(5 + (y - 17) * (lado ? .3 : .45)); g.R(13 - half + (lado ? 1 : 0), y + (y < 22 ? b : 0), half * 2, 1, C.ro); g.px(13 - half + (lado ? 1 : 0), y, C.ro2); if (!lado) g.px(13 + half - 1, y, C.ro3); } g.R(8, 27, 10, 1, C.ro2); }
  else { g.R(tx, 17 + b, tw, 11, C.ro); g.R(tx, 25 + b, tw, 3, C.ro2); g.R(tx, 17 + b, 1, 11, C.ro2); g.R(tx + tw - 1, 18 + b, 1, 7, C.ro3); }
  g.R(tx, 17 + b, tw, 1, C.ro3);
  if (o.cinturon) g.R(tx, 23 + b, tw, 1, o.cinturon);
  if (o.bolso && !atras) g.R(lado ? tx - 1 : tx + tw - 2, 22 + b, 4, 4, o.bolso);
  if (lado) { g.R(12 + s * 2, 18 + b, 2, 7, C.ro2); g.R(12 + s * 3, 24 + b, 2, 2, C.pi); }
  else { g.R(6, 18 + b + s, 2, 7, C.ro); g.R(18, 18 + b - s, 2, 7, C.ro); g.R(6, 24 + b + s, 2, 2, C.pi); g.R(18, 24 + b - s, 2, 2, C.pi); }
  // cabeza (grande, como los originales)
  const hy = b;
  if (atras) { g.ellE(5, 3 + hy, 16, 15, C.pe); g.R(8, 4 + hy, 6, 1, C.pe2); g.R(7, 8 + hy, 3, 1, C.pe2); if (largoPelo) { g.R(6, 12 + hy, 14, 11, C.pe); for (let y = 13; y < 23; y += 3) g.R(10, y + hy, 2, 1, C.pe2); } else if (o.peinado === 'rizos') { for (let i = 0; i < 12; i++) g.disc(7 + (i % 4) * 4, 5 + Math.floor(i / 4) * 4 + hy, 2, i % 2 ? C.pe : C.pe2); } g.px(4, 11 + hy, C.pi); g.px(21, 11 + hy, C.pi); }
  else if (lado) { g.ellE(6, 3 + hy, 15, 15, C.pi); g.R(20, 10 + hy, 2, 2, C.pi); ojo(g, 15, 9 + hy, ojos || 'abierto', '#2b1740'); g.R(14, 13 + hy, 2, 2, o.rubor || '#ff9fb4'); g.R(18, 14 + hy, 2, 1, '#d2476f');
    if (o.peinado === 'rizos') { for (let i = 0; i < 6; i++) g.disc(6 + i * 2, 4 + (i % 2) + hy, 3, i % 2 ? C.pe : C.pe2); g.disc(6, 9 + hy, 3, C.pe); } else { g.ellE(5, 1 + hy, 14, 9, C.pe); g.R(5, 6 + hy, 5, 8, C.pe); g.R(8, 2 + hy, 6, 1, C.pe2); } }
  else { g.ellE(5, 3 + hy, 16, 15, C.pi); g.R(5, 8 + hy, 1, 6, C.pi2); g.R(6, 13 + hy, 3, 2, o.rubor || '#ff9fb4'); g.R(17, 13 + hy, 3, 2, o.rubor || '#ff9fb4');
    ojo(g, 9, 9 + hy, ojos || 'abierto', '#2b1740'); ojo(g, 15, 9 + hy, ojos || 'abierto', '#2b1740'); g.R(12, 14 + hy, 2, 1, '#d2476f');
    if (o.peinado === 'rizos') { for (let i = 0; i < 9; i++) g.disc(6 + i * 1.8, 4 + (i % 2) + hy, 3, i % 2 ? C.pe : C.pe2); g.disc(5, 9 + hy, 2, C.pe); g.disc(21, 9 + hy, 2, C.pe); }
    else { g.ellE(4, 1 + hy, 18, 9, C.pe); g.R(4, 6 + hy, 3, 6, C.pe); g.R(19, 6 + hy, 3, 6, C.pe); g.R(8, 2 + hy, 7, 1, C.pe2); if (o.peinado !== 'corto') g.R(6, 6 + hy, 7, 2, C.pe); } }
  if (o.lazo && !atras) g.R(lado ? 7 : 16, 1 + hy, 5, 3, o.lazo);
}
// ---------- SANSÓN: el golden de pelo largo, caminando en 4 direcciones ----------
function sprSansonA5(dir = 'abajo', f = 0) {
  const a7 = sansonArte7(dir, f); if (a7) return a7;
  return cache('sanB' + dir + (f % 4), () => {
    const G = '#e8b060', G2 = '#c98a3a', G3 = '#ffd89a', G4 = '#a86a28', Gc = '#ffe4b8', N = PAL.tinta, k = f % 4;
    if (dir === 'lado') return sprite(46, 30, g => {
      const st = [0, 3, 0, -3][k], cola = k % 2;
      // cola de plumero (se menea)
      for (let i = 0; i < 9; i++) { const y = 6 - Math.round(Math.sin(i / 2.6 + cola * .6) * 3) - (cola ? 1 : 0); g.R(i, y, 3, 4, i % 2 ? G2 : G); g.px(i, y + 4, G3); }
      // patas (de atrás oscuras, de adelante claras) con flecos
      const pata = (x, c, alza) => { g.R(x, 18, 4, 9 - alza, c); g.R(x - 1, 26 - alza, 5, 2, G4); g.px(x - 1, 20, G3); g.px(x - 1, 22, G); };
      pata(10 - st, G2, k === 3 ? 2 : 0); pata(30 + st, G2, k === 1 ? 2 : 0); pata(13 + st, G, k === 1 ? 2 : 0); pata(33 - st, G, k === 3 ? 2 : 0);
      // cuerpo con el pelo largo
      g.ellE(6, 7, 32, 14, G2); g.ellE(7, 6, 30, 13, G); g.R(12, 8, 16, 1, G3); g.R(15, 10, 9, 1, G3);
      for (let x = 9; x < 34; x += 2) g.R(x, 18 + (x % 4 ? 0 : 1), 2, 2 + (x % 6 ? 0 : 1), x % 4 ? G : G2);   // flecos de la barriga
      g.ellE(28, 9, 10, 11, G3);   // pecho claro y esponjoso
      // cabeza
      g.ellE(29, 0, 15, 14, G2); g.ellE(30, 0, 13, 13, G); g.R(33, 2, 5, 1, G3);
      g.ellE(37, 6, 9, 7, G3); g.ellE(38, 8, 8, 5, Gc); g.R(44, 7, 2, 3, N); g.R(40, 12, 4, 1, G4);
      if (k % 2) { g.R(40, 13, 3, 2, '#ff8fb0'); }
      ojo(g, 36, 4, 'abierto');
      g.ellE(27, 2, 8, 15, G4); g.ellE(28, 2, 6, 14, G2); g.R(29, 6, 1, 8, G); g.px(30, 16, G2);   // la oreja larga
    }, { ax: 23, ay: 30 });
    if (dir === 'abajo') return sprite(28, 32, g => {
      const c = k % 2;
      g.R(2 + c, 12, 4, 4, G2); g.R(22 - c, 12, 4, 4, G2);   // la cola asoma
      // patas de adelante (paso)
      [[8, k === 1 ? 2 : 0], [16, k === 3 ? 2 : 0]].forEach(([x, a]) => { g.R(x, 22 - a, 4, 8, G); g.R(x, 29 - a, 4, 2, G4); g.px(x + 1, 29 - a, G3); });
      g.ellE(4, 10, 20, 16, G2); g.ellE(5, 10, 18, 15, G); g.ellE(8, 13, 12, 12, G3); for (let x = 7; x < 21; x += 2) g.px(x, 24 + (x % 4 ? 0 : 1), G2);   // pecho con flecos
      // cabeza
      g.ellE(5, 0, 18, 15, G2); g.ellE(6, 0, 16, 14, G); g.R(10, 2, 8, 1, G3);
      g.ellE(9, 7, 10, 7, G3); g.ellE(10, 9, 8, 5, Gc); g.R(12, 9, 4, 3, N); g.px(12, 9, '#6a5a6a'); g.R(13, 13, 2, 1, G4);
      if (c) g.R(12, 14, 4, 2, '#ff8fb0');
      ojo(g, 8, 4, 'abierto'); ojo(g, 18, 4, 'abierto');
      g.ellE(1, 2, 7, 15, G4); g.ellE(20, 2, 7, 15, G4); g.ellE(2, 2, 5, 14, G2); g.ellE(21, 2, 5, 14, G2); g.px(3, 8, G); g.px(23, 8, G);   // orejas largas
    }, { ax: 14, ay: 32 });
    return sprite(28, 32, g => {   // de espaldas: la cola de plumero arriba, meneándose
      const c = [0, 2, 0, -2][k];
      [[8, k === 1 ? 2 : 0], [16, k === 3 ? 2 : 0]].forEach(([x, a]) => { g.R(x, 23 - a, 4, 7, G2); g.R(x, 29 - a, 4, 2, G4); });
      g.ellE(4, 8, 20, 18, G2); g.ellE(5, 8, 18, 17, G); g.R(10, 10, 8, 10, G3); for (let x = 6; x < 22; x += 2) g.px(x, 25 + (x % 4 ? 0 : 1), G2);
      for (let i = 0; i < 8; i++) { g.R(11 + Math.round(c * i / 7), 18 - i * 2, 6, 3, i % 2 ? G2 : G3); }
      g.ellE(6, 0, 16, 12, G2); g.ellE(7, 0, 14, 11, G); g.R(11, 1, 6, 1, G3);
      g.ellE(3, 2, 6, 13, G4); g.ellE(19, 2, 6, 13, G4); g.ellE(4, 2, 4, 12, G2); g.ellE(20, 2, 4, 12, G2);
    }, { ax: 14, ay: 32 });
  });
}
