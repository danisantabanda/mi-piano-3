// =====================================================================
//  Personajes nuevos (píxel, contorno de tinta): robots compañeros, Bach elegante, primos, papá y mamá, rivales,
//  y Sarah/David en proporción chibi y alta. Sarah y David "normales" son los sprites originales (sprSarah/sprDavid).
// =====================================================================
// ---------- ROBOTS ----------
// B · robot-metrónomo: cuerpo de pirámide de madera, cara-pantalla con ojos LED, péndulo que late al pulso, vuela con propulsores
function sprRobotB(P = {}) {
  const ang = P.ang == null ? .35 : P.ang, ojos = P.ojos || 'abierto', llama = P.llama == null ? 1 : P.llama;
  return cache('robB' + ang + ojos + llama + (P.boca || ''), () => sprite(24, 34, g => {
    const M = '#c98a52', M2 = '#9a6038', M3 = '#e8b47c', B = '#e6a21b', B2 = '#ffd046', B3 = '#b87a10';
    // propulsores y llama
    g.R(6, 26, 4, 3, '#8a7a9b'); g.R(14, 26, 4, 3, '#8a7a9b'); g.R(6, 26, 4, 1, '#b8aac8'); g.R(14, 26, 4, 1, '#b8aac8');
    if (llama) { [[7, 29], [15, 29]].forEach(([x, y]) => { g.R(x, y, 2, 3, '#ff9a3c'); g.px(x, y + 3, '#ffd046'); g.px(x + 1, y, '#fff3b0'); }); }
    // cuerpo trapecio
    for (let y = 4; y < 27; y++) { const t = (y - 4) / 22, half = Math.round(4 + 7 * t); g.R(12 - half, y, half * 2, 1, M); g.px(12 - half, y, M3); g.R(12 + half - 2, y, 2, 1, M2); }
    g.R(1, 25, 22, 2, M2); g.R(1, 25, 22, 1, B);
    // tapa de bronce con antena-bolita
    g.R(8, 2, 8, 3, B); g.R(8, 2, 8, 1, B2); g.R(11, 0, 2, 2, B3); g.px(11, 0, B2);
    // pantalla-cara
    g.R(7, 6, 10, 7, '#1c2a3a'); g.R(7, 6, 10, 1, '#33465e');
    const E = '#7fe8ff';
    if (ojos === 'feliz') { g.R(8, 9, 3, 1, E); g.px(8, 8, E); g.px(10, 8, E); g.R(13, 9, 3, 1, E); g.px(13, 8, E); g.px(15, 8, E); }
    else if (ojos === 'cerrado') { g.R(8, 9, 3, 1, E); g.R(13, 9, 3, 1, E); }
    else { g.R(9, 8, 2, 3, E); g.R(13, 8, 2, 3, E); g.px(9, 8, '#ffffff'); g.px(13, 8, '#ffffff'); }
    if (P.boca === 'canta') { g.R(11, 11, 2, 2, '#ff9cc4'); } else { g.px(11, 11, E); g.px(12, 11, E); }
    g.px(8, 11, '#ff7a9a'); g.px(15, 11, '#ff7a9a');
    // escala del metrónomo
    for (let y = 15; y < 24; y += 2) g.R(11, y, 2, 1, M2);
    // péndulo (pivote abajo, en y=24) con su pesita
    const px = 12, py = 24, L = 13; for (let i = 0; i <= L; i++) { const x = px + Math.sin(ang) * i, y = py - Math.cos(ang) * i; g.px(Math.round(x), Math.round(y), i > L - 2 ? B2 : '#3a2a4a'); }
    const wx = Math.round(px + Math.sin(ang) * 8), wy = Math.round(py - Math.cos(ang) * 8); g.R(wx - 2, wy - 1, 4, 3, B); g.R(wx - 2, wy - 1, 4, 1, B2);
    // bracitos
    g.R(1, 15, 3, 2, B); g.R(0, 14, 2, 2, B2); g.R(20, 15, 3, 2, B); g.R(22, 14, 2, 2, B2);
  }, { ax: 12, ay: 34 }));
}
// A · robot de lata retro con hélice
function sprRobotA(P = {}) {
  return cache('robA' + (P.f || 0), () => sprite(22, 34, g => {
    const L = '#a9b8cc', L2 = '#7f90a8', L3 = '#dce6f2', R = '#ff5a5a';
    const f = P.f || 0;
    // hélice
    g.R(10, 2, 2, 4, '#5a6382'); if (f) { g.R(3, 1, 16, 2, '#ffd046'); } else { g.R(5, 0, 12, 2, '#ffd046'); g.R(9, 0, 4, 3, '#e6a21b'); }
    // cabeza cuadrada con remaches
    g.R(4, 6, 14, 11, L); g.R(4, 6, 14, 2, L3); g.R(16, 8, 2, 9, L2); g.px(5, 9, L2); g.px(16, 9, L2); g.px(5, 15, L2);
    g.R(6, 9, 10, 6, '#2a3a52'); g.R(8, 11, 2, 2, '#ffd046'); g.R(12, 11, 2, 2, '#ffd046'); g.R(9, 14, 4, 1, '#ff9a3c');
    g.R(1, 10, 3, 4, R); g.R(18, 10, 3, 4, R);   // orejas
    // cuerpo-lata
    g.R(5, 18, 12, 10, L); g.R(5, 18, 12, 1, L3); g.R(15, 18, 2, 10, L2); g.R(7, 20, 8, 4, '#2a3a52'); g.px(8, 21, NC.DO); g.px(10, 21, NC.MI); g.px(12, 21, NC.FA); g.px(14, 21, NC.SOL);
    g.R(5, 25, 12, 1, L2);
    // brazos de resorte
    for (let i = 0; i < 4; i++) { g.px(4 - i % 2, 19 + i * 2, L2); g.px(17 + i % 2, 19 + i * 2, L2); } g.R(1, 26, 3, 3, R); g.R(18, 26, 3, 3, R);
    // patitas que cuelgan (vuela)
    g.R(7, 28, 2, 3, L2); g.R(13, 28, 2, 3, L2); g.R(6, 31, 4, 2, R); g.R(12, 31, 4, 2, R);
  }, { ax: 11, ay: 34 }));
}
// C · esfera-parlante con ojos LED y propulsores laterales
function sprRobotC(P = {}) {
  return cache('robC', () => sprite(28, 30, g => {
    const S = '#e9e2f5', S2 = '#b8aac8', S3 = '#ffffff';
    g.R(0, 12, 4, 6, '#5a7dff'); g.R(24, 12, 4, 6, '#5a7dff'); g.R(0, 18, 3, 2, '#ff9a3c'); g.R(25, 18, 3, 2, '#ff9a3c'); g.px(1, 20, '#ffd046'); g.px(26, 20, '#ffd046');
    g.disc(14, 14, 12, S2); g.disc(13, 13, 11, S); g.disc(9, 8, 4, S3);
    // visor con ojos LED
    g.R(6, 7, 15, 6, '#1c2a3a'); g.R(8, 9, 3, 2, '#7fe8ff'); g.R(16, 9, 3, 2, '#7fe8ff'); g.px(8, 9, '#fff'); g.px(16, 9, '#fff');
    // parlante (boca)
    g.disc(14, 19, 5, '#3a2a4a'); g.ring(14, 19, 3, '#8a7a9b', 1); g.disc(14, 19, 1, '#b8aac8');
    g.R(13, 0, 2, 3, S2); g.disc(14, 0, 1, NC.DO);
    g.R(10, 26, 8, 2, S2); g.R(12, 28, 4, 2, '#ff9a3c');
  }, { ax: 14, ay: 30 }));
}

// ---------- niños genéricos (proporción de 3 cabezas, como los sprites de Sarah y David) ----------
// P: { piel, piel2, pelo, pelo2, peinado: corto|largo|coletas|rizos|punta|gorra, ropa, ropa2, falda, zapato, ojos, extra(g) }
function chico(P = {}) {
  const k = JSON.stringify(Object.assign({}, P, { extra: P.extra ? P.extra.toString().length : 0 })) + (P.id || '');
  return cache('chico' + k, () => sprite(26, 34, g => {
    const pi = P.piel || '#ffd6b8', pi2 = P.piel2 || '#f0b38e', pe = P.pelo || '#6b3826', pe2 = P.pelo2 || '#8f5236', ro = P.ropa || '#5a7dff', ro2 = P.ropa2 || mezcla(ro, '#000', .25), za = P.zapato || '#5a3418';
    const pein = P.peinado || 'corto';
    if (pein === 'largo') { g.R(5, 7, 16, 14, pe); g.R(5, 18, 3, 5, pe); g.R(18, 18, 3, 5, pe); }
    if (pein === 'coletas') { g.R(2, 8, 4, 8, pe); g.R(20, 8, 4, 8, pe); g.px(3, 8, NC.DO); g.px(21, 8, NC.DO); }
    // piernas y zapatos
    g.R(9, 27, 3, 5, pi2); g.R(14, 27, 3, 5, pi2); g.R(8, 31, 5, 3, za); g.R(13, 31, 5, 3, za);
    // cuerpo
    if (P.falda) { for (let y = 17; y < 29; y++) { const half = Math.round(5 + (y - 17) * .45); g.R(13 - half, y, half * 2, 1, ro); } g.R(8, 27, 10, 1, ro2); }
    else { g.R(8, 17, 10, 11, ro); g.R(8, 25, 10, 3, ro2); g.R(12, 25, 2, 3, mezcla(ro2, '#000', .2)); }
    g.R(8, 17, 10, 1, mezcla(ro, '#fff', .35));
    // brazos
    g.R(6, 18, 2, 7, ro); g.R(18, 18, 2, 7, ro); g.R(6, 24, 2, 2, pi); g.R(18, 24, 2, 2, pi);
    // cabeza
    g.ellE(5, 3, 16, 15, pi); g.R(6, 13, 3, 2, P.rubor || '#ff9fb4'); g.R(17, 13, 3, 2, P.rubor || '#ff9fb4');
    ojo(g, 9, 9, P.ojos || 'abierto', '#2b1740'); ojo(g, 15, 9, P.ojos || 'abierto', '#2b1740');
    if (P.boca === 'grande') { g.R(11, 13, 4, 2, '#d2476f'); g.R(12, 13, 2, 1, '#fff'); } else if (P.boca === 'picaro') { g.R(12, 14, 3, 1, '#d2476f'); g.px(15, 13, '#d2476f'); } else { g.R(12, 14, 2, 1, '#d2476f'); }
    // pelo encima
    if (pein === 'gorra') { g.R(4, 3, 18, 5, P.gorra || NC.LA); g.R(4, 7, 22, 2, mezcla(P.gorra || NC.LA, '#000', .3)); g.R(5, 8, 3, 3, pe); g.R(18, 8, 3, 3, pe); g.px(12, 4, '#fff'); }
    else if (pein === 'punta') { g.R(5, 2, 16, 6, pe); for (let x = 5; x < 21; x += 3) { g.R(x, 0, 2, 3, pe); } g.R(5, 7, 3, 3, pe); g.R(18, 7, 3, 3, pe); g.R(7, 3, 6, 1, pe2); }
    else if (pein === 'rizos') { for (let i = 0; i < 9; i++) g.disc(6 + i * 1.8, 4 + (i % 2), 3, i % 2 ? pe : pe2); g.disc(5, 9, 2, pe); g.disc(21, 9, 2, pe); }
    else { g.ellE(4, 1, 18, 9, pe); g.R(4, 6, 3, 6, pe); g.R(19, 6, 3, 6, pe); g.R(8, 2, 7, 1, pe2); if (pein !== 'corto') g.R(6, 6, 7, 2, pe); }
    if (P.lazo) { g.R(16, 1, 5, 3, P.lazo); g.px(18, 2, '#fff'); }
    if (P.extra) P.extra(g);
  }, { ax: 13, ay: 34 }));
}
function bebe(P = {}) {
  return cache('bebe' + JSON.stringify(P), () => sprite(18, 22, g => {
    const pi = P.piel || '#ffd6b8', ro = P.ropa || '#ff9cc4';
    g.ell(9, 17, 7, 5, ro); g.R(3, 18, 12, 4, ro); g.R(4, 20, 3, 2, pi); g.R(11, 20, 3, 2, pi);
    g.ellE(2, 1, 14, 13, pi); g.R(4, 9, 2, 2, '#ff9fb4'); g.R(12, 9, 2, 2, '#ff9fb4');
    ojo(g, 6, 5, 'abierto', '#2b1740'); ojo(g, 10, 5, 'abierto', '#2b1740'); g.R(8, 10, 2, 1, '#d2476f');
    g.R(7, 0, 4, 2, P.pelo || '#8f5236'); g.px(10, 2, P.pelo || '#8f5236');
    if (P.lazo) { g.R(3, 1, 4, 2, P.lazo); }
  }, { ax: 9, ay: 22 }));
}
// ---------- adultos: papá (músico y pastor) y mamá ----------
function adulto(P = {}) {
  return cache('adulto' + (P.id || ''), () => sprite(26, 46, g => {
    const pi = P.piel || '#e8b48c', pi2 = P.piel2 || '#c98e62', pe = P.pelo || '#3a2418', pe2 = P.pelo2 || '#5a3a24', ro = P.ropa, ro2 = P.ropa2;
    if (P.largo) { g.R(5, 6, 16, 22, pe); }
    // piernas
    if (P.falda) { for (let y = 26; y < 42; y++) { const half = Math.round(6 + (y - 26) * .32); g.R(13 - half, y, half * 2, 1, ro2); } g.R(9, 42, 3, 2, pi2); g.R(14, 42, 3, 2, pi2); g.R(8, 44, 5, 2, '#7a3a2a'); g.R(14, 44, 5, 2, '#7a3a2a'); }
    else { g.R(8, 28, 4, 14, P.pantalon || '#3a4a6b'); g.R(14, 28, 4, 14, P.pantalon || '#3a4a6b'); g.R(7, 42, 6, 4, '#3a2418'); g.R(14, 42, 6, 4, '#3a2418'); }
    // torso
    g.R(7, 15, 12, 14, ro); g.R(7, 15, 12, 1, mezcla(ro, '#fff', .3)); if (P.saco) { g.R(7, 15, 3, 14, P.saco); g.R(16, 15, 3, 14, P.saco); }
    g.R(5, 16, 2, 10, P.saco || ro); g.R(19, 16, 2, 10, P.saco || ro); g.R(5, 26, 2, 2, pi); g.R(19, 26, 2, 2, pi);
    // cabeza
    g.R(11, 13, 4, 3, pi2); g.ellE(6, 1, 14, 14, pi);
    ojo(g, 9, 7, P.ojos || 'abierto', '#2b1740'); ojo(g, 15, 7, P.ojos || 'abierto', '#2b1740'); g.R(8, 11, 2, 1, '#ff9fb4'); g.R(16, 11, 2, 1, '#ff9fb4');
    if (P.barba) { g.R(7, 10, 12, 5, pe); g.R(9, 14, 8, 2, pe); g.R(11, 11, 4, 1, '#c25a5a'); g.R(9, 10, 8, 1, pi); }
    else g.R(11, 11, 4, 1, '#c25a5a');
    if (P.largo) { g.ellE(5, 0, 16, 7, pe); g.R(5, 3, 3, 12, pe); g.R(18, 3, 3, 12, pe); g.R(9, 1, 6, 1, pe2); }
    else { g.ellE(6, 0, 14, 6, pe); g.R(6, 3, 2, 5, pe); g.R(18, 3, 2, 5, pe); g.R(9, 1, 5, 1, pe2); }
    if (P.extra) P.extra(g);
  }, { ax: 13, ay: 46 }));
}
const PAPA = () => adulto({ id: 'papa', barba: true, ropa: '#fff6e6', saco: '#2c3a6b', pantalon: '#3a3a52', extra: g => {   // guitarra cruzada y una Biblia bajo el brazo
  g.R(1, 27, 6, 7, '#7a1f3d'); g.R(2, 28, 4, 5, '#a3243a'); g.R(3, 29, 2, 1, '#ffd046');
  g.ell(17, 30, 5, 4, '#c98a52'); g.ell(20, 26, 4, 3, '#c98a52'); g.disc(18, 29, 1, '#3a2418'); g.line(9, 18, 18, 30, '#5a3418'); g.R(8, 16, 3, 3, '#3a2418');
} });
const MAMA = () => adulto({ id: 'mama', largo: true, falda: true, pelo: '#6b3826', pelo2: '#a0603a', piel: '#f2c4a0', piel2: '#d9a07a', ropa: '#ff8a7a', ropa2: '#e0606a', extra: g => {
  g.R(17, 22, 7, 6, '#5fd36a'); g.R(18, 23, 5, 4, '#b9f2b0'); g.px(20, 24, NC.DO); g.px(21, 25, NC.LA);   // cancionero
  g.R(15, 3, 3, 2, '#ffd046');
} });
// ---------- los primos (6) ----------
const PRIMOS = {
  Nina: () => chico({ id: 'nina', peinado: 'coletas', pelo: '#3a2418', ropa: '#ff9cc4', falda: true, lazo: '#ff5a5a' }),
  'Josué': () => chico({ id: 'josue', peinado: 'corto', pelo: '#2a1810', piel: '#e8b48c', piel2: '#c98e62', ropa: '#5fd36a', boca: 'grande' }),
  Noah: () => chico({ id: 'noah', peinado: 'punta', pelo: '#e8b83a', pelo2: '#f6d466', ropa: '#3fc7f0' }),
  Samuel: () => chico({ id: 'samuel', peinado: 'rizos', pelo: '#5a3418', pelo2: '#7a4a2a', ropa: '#ff9a3c', piel: '#e8b48c', piel2: '#c98e62' }),
  Isaac: () => chico({ id: 'isaac', peinado: 'gorra', gorra: '#b86bff', pelo: '#6b3826', ropa: '#ffd046', ropa2: '#e6a21b' }),
  Annie: () => bebe({ lazo: '#ff5a5a' }),
};
// ---------- los rivales amistosos ----------
const RIVALES = {
  A: () => chico({ id: 'rivalA', peinado: 'gorra', gorra: '#3f8cff', pelo: '#2a1810', piel: '#c98a5e', piel2: '#a86c44', ropa: '#ff5a5a', boca: 'grande', extra: g => { g.R(18, 18, 7, 2, '#ffd046'); g.R(23, 16, 3, 6, '#ffd046'); g.px(24, 17, '#fff3b0'); g.R(17, 17, 2, 2, '#e6a21b'); g.R(19, 20, 1, 2, '#e6a21b'); g.R(21, 20, 1, 2, '#e6a21b'); } }),
  B: () => chico({ id: 'rivalB', peinado: 'largo', pelo: '#e8b83a', pelo2: '#f6d466', ropa: '#5fd36a', falda: true, lazo: '#fffaf4', boca: 'grande', extra: g => { g.R(18, 13, 6, 9, '#c96a2a'); g.R(19, 15, 4, 5, '#e08a3a'); g.R(20, 11, 2, 3, '#7a3a1a'); g.line(16, 10, 25, 22, '#5a3418'); } }),
  C: () => chico({ id: 'rivalC', peinado: 'punta', pelo: '#3a2a4a', pelo2: '#5a3a6a', ropa: '#b86bff', boca: 'picaro', ojos: 'abierto', extra: g => { g.R(0, 20, 12, 5, '#fffaf4'); for (let x = 1; x < 12; x += 2) g.R(x, 20, 1, 3, INK); g.R(0, 25, 12, 1, '#7f3fc8'); g.R(17, 4, 3, 2, '#ffd046'); } }),
};
// ---------- Sarah y David en otras proporciones ----------
// chibi (2 cabezas): cabeza enorme, cuerpo de frijolito
function chibi(quien) {
  return cache('chibi' + quien, () => sprite(28, 30, g => {
    const S = quien === 'sarah';
    const pi = S ? '#ffd6b8' : '#eab58a', pi2 = S ? '#f0b38e' : '#c98e62', pe = S ? '#6b3826' : '#e8b83a', pe2 = S ? '#c07a4e' : '#fff2a8', ro = S ? '#ff6aa6' : '#e2c48e', ro2 = S ? '#d8397a' : '#8a4a24';
    if (S) { g.R(3, 8, 22, 14, pe); }
    g.R(9, 27, 4, 3, S ? '#c2346f' : '#6a3a1a'); g.R(15, 27, 4, 3, S ? '#c2346f' : '#6a3a1a');
    for (let y = 18; y < 28; y++) { const half = S ? Math.round(5 + (y - 18) * .5) : 6; g.R(14 - half, y, half * 2, 1, y > 21 && !S ? ro : (S ? ro : ro2)); }
    if (!S) { g.R(8, 18, 12, 4, ro2); g.R(8, 23, 12, 1, '#5a3418'); }
    g.R(6, 19, 3, 4, ro); g.R(19, 19, 3, 4, ro);
    g.ellE(2, 0, 24, 20, pi);
    ojo(g, 9, 9, 'abierto', '#2b1740'); ojo(g, 17, 9, 'abierto', '#2b1740'); g.R(9, 9, 2, 3, '#2b1740'); g.R(17, 9, 2, 3, '#2b1740'); g.px(9, 9, '#fff'); g.px(17, 9, '#fff');
    if (S) { g.px(10, 11, '#9a66d6'); g.px(18, 11, '#9a66d6'); }
    g.R(5, 13, 3, 2, '#ff9fb4'); g.R(20, 13, 3, 2, '#ff9fb4'); g.R(13, 14, 2, 1, '#d2476f');
    if (S) { g.ellE(2, -1, 24, 9, pe); g.R(2, 3, 4, 10, pe); g.R(22, 3, 4, 10, pe); g.R(7, 1, 8, 1, pe2); g.R(10, -1, 8, 2, '#ffd046'); g.px(13, -2, '#ff4f86'); g.px(14, -2, '#ffd046'); }
    else { g.ellE(2, -1, 24, 9, pe); g.R(2, 3, 3, 6, pe); g.R(23, 3, 3, 6, pe); g.R(3, 4, 22, 2, '#c8302a'); g.R(24, 5, 3, 4, '#c8302a'); g.R(8, 0, 7, 1, pe2); }
  }, { ax: 14, ay: 30 }));
}
// alto (HD-2D, ~4,5 cabezas): más esbelto, ropa con más detalle
function alto(quien) {
  return cache('alto' + quien, () => sprite(24, 52, g => {
    const S = quien === 'sarah';
    const pi = S ? '#ffd6b8' : '#eab58a', pi2 = S ? '#f0b38e' : '#c98e62', pe = S ? '#6b3826' : '#e8b83a', pe2 = S ? '#c07a4e' : '#fff2a8';
    if (S) { g.R(5, 6, 14, 24, pe); g.R(6, 28, 4, 3, pe); }
    // piernas
    if (S) { g.R(9, 42, 2, 6, pi2); g.R(13, 42, 2, 6, pi2); g.R(8, 48, 4, 3, '#c2346f'); g.R(12, 48, 4, 3, '#c2346f'); for (let y = 22; y < 43; y++) { const half = Math.round(4 + (y - 22) * .28); g.R(12 - half, y, half * 2, 1, y % 5 === 0 ? '#ffa6cc' : '#ff6aa6'); } g.R(6, 42, 12, 1, '#d8397a'); g.R(9, 20, 6, 3, '#ffd6e8'); }
    else { g.R(8, 36, 3, 12, '#b8945e'); g.R(13, 36, 3, 12, '#b8945e'); g.R(7, 47, 5, 4, '#6a3a1a'); g.R(12, 47, 5, 4, '#6a3a1a'); g.R(7, 21, 10, 17, '#e2c48e'); g.R(7, 21, 3, 15, '#8a4a24'); g.R(14, 21, 3, 15, '#8a4a24'); g.R(7, 32, 10, 2, '#5a3418'); g.R(15, 34, 4, 5, '#7a4a24'); }
    // brazos
    g.R(5, 22, 2, 11, S ? '#ff6aa6' : '#e2c48e'); g.R(17, 22, 2, 11, S ? '#ff6aa6' : '#e2c48e'); g.R(5, 33, 2, 2, pi); g.R(17, 33, 2, 2, pi);
    if (!S) { g.R(19, 6, 2, 44, '#a0703a'); g.R(18, 4, 4, 3, '#704a24'); }
    // cabeza
    g.R(10, 17, 4, 4, pi2); g.ellE(5, 3, 14, 15, pi);
    g.R(8, 10, 2, 3, '#2b1740'); g.R(14, 10, 2, 3, '#2b1740'); g.px(8, 10, '#fff'); g.px(14, 10, '#fff'); if (S) { g.px(9, 12, '#9a66d6'); g.px(15, 12, '#9a66d6'); }
    g.R(6, 14, 2, 1, '#ff9fb4'); g.R(16, 14, 2, 1, '#ff9fb4'); g.R(11, 15, 2, 1, '#d2476f');
    if (S) { g.ellE(4, 1, 16, 8, pe); g.R(4, 4, 3, 14, pe); g.R(17, 4, 3, 14, pe); g.R(7, 2, 6, 1, pe2); g.R(8, 0, 8, 2, '#ffd046'); g.px(11, -1, '#ff4f86'); g.px(12, -1, '#ffd046'); }
    else { g.ellE(4, 1, 16, 8, pe); g.R(4, 4, 2, 5, pe); g.R(18, 4, 2, 5, pe); g.R(4, 5, 16, 2, '#c8302a'); g.R(19, 6, 3, 4, '#c8302a'); g.R(7, 2, 6, 1, pe2); }
  }, { ax: 12, ay: 52 }));
}
// ---------- Bach elegante: maestro de capilla ----------
function sprBachElegante() {
  return cache('bachE', () => sprite(36, 64, g => {
    const W1 = '#f4efe6', W2 = '#d9cfc2', W3 = '#b5a998', C = '#2c3a6b', C2 = '#1f2a52', C3 = '#3f5296', O = '#e6a21b', O2 = '#ffd046', pi = '#f2c9a8', pi2 = '#d9a582';
    // piernas, medias blancas, zapatos con hebilla
    g.R(12, 50, 4, 10, '#fffaf4'); g.R(20, 50, 4, 10, '#fffaf4'); g.R(11, 60, 6, 4, INK); g.R(19, 60, 6, 4, INK); g.px(13, 60, O2); g.px(21, 60, O2);
    // casaca larga
    for (let y = 22; y < 52; y++) { const half = Math.round(8 + (y - 22) * .2); g.R(18 - half, y, half * 2, 1, C); }
    g.R(17, 24, 2, 26, C2); for (let y = 26; y < 48; y += 4) { g.px(15, y, O2); g.px(20, y, O2); }
    g.R(10, 48, 16, 2, O); g.R(9, 22, 2, 28, O); g.R(25, 22, 2, 28, O);
    // chorrera (jabot) blanca
    g.R(15, 21, 6, 8, '#fffaf4'); g.R(16, 29, 4, 2, '#fffaf4'); g.px(17, 23, '#e2d8ca'); g.px(18, 26, '#e2d8ca');
    // brazos y la partitura enrollada
    g.R(5, 24, 5, 16, C); g.R(26, 24, 5, 14, C); g.R(5, 38, 5, 2, '#fffaf4'); g.R(26, 36, 5, 2, '#fffaf4'); g.R(6, 40, 4, 3, pi); g.R(27, 38, 4, 3, pi);
    g.R(28, 30, 7, 10, '#fff1d6'); g.R(28, 30, 7, 1, '#e8d6b0'); for (let y = 32; y < 39; y += 2) g.R(29, y, 5, 1, '#8a7a9b'); g.px(30, 33, INK); g.px(32, 35, INK);
    // cabeza
    g.R(15, 17, 6, 4, pi2); g.ellE(11, 4, 14, 15, pi);
    g.R(14, 10, 2, 2, INK); g.R(20, 10, 2, 2, INK); g.R(13, 8, 3, 1, W3); g.R(20, 8, 3, 1, W3); g.R(17, 12, 2, 3, pi2); g.R(16, 16, 4, 1, '#b5524a'); g.R(13, 14, 2, 1, '#ffb0a8'); g.R(21, 14, 2, 1, '#ffb0a8');
    // peluca con rizos a los hombros
    g.ellE(9, 0, 18, 8, W1); g.R(11, 1, 14, 2, W2);
    for (let k = 0; k < 5; k++) { g.disc(9, 7 + k * 3.4, 3, k % 2 ? W2 : W1); g.disc(27, 7 + k * 3.4, 3, k % 2 ? W2 : W1); }
    g.R(7, 22, 6, 3, W1); g.R(23, 22, 6, 3, W1); g.px(9, 9, W3); g.px(27, 12, W3);
  }, { ax: 18, ay: 64 }));
}
