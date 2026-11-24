// Sprites ORIGINALES de Sarah y David, copiados tal cual de los juegos de Dani
// (juegos/sarah-luz/index.html: SH, line2, holyCross, drawSarah · juegos/david/index.html: DV, davidStaff, drawDavid)
// para que los niños se reconozcan: es la misma Sarah y el mismo David de sus juegos.
const K = { white: PAL.blanco, gold: '#ffd046', gold2: '#e6a21b', gold3: '#fff3b0', gem: '#ff4f86', ink: PAL.tinta };
const SH = {
  hair: '#6b3826', hair2: '#8f5236', hair3: '#c07a4e', hairD: '#4a2418',
  skin: '#ffd6b8', skin2: '#f0b38e', blush: '#ff9fb4', eye: '#2b1740', iris: '#9a66d6', mouth: '#d2476f',
  d: '#ff6aa6', d2: '#ffa6cc', d3: '#d8397a', ruff: '#ffd6e8', shoe: '#c2346f',
};
function line2(g, x0, y0, x1, y1, c, th = 2) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) { const t = i / n; g.R(Math.round(lerp(x0, x1, t)), Math.round(lerp(y0, y1, t)), th, th, c); }
}
// Cetro de luz: vara dorada con una cruz y una estrella-gema
function holyCross(g, hx, hy, mode) {
  const G = K.gold, D = K.gold2, L = K.gold3;
  if (mode === 'up') { g.R(hx, hy - 6, 1, 8, D); g.R(hx, hy - 10, 1, 5, G); g.R(hx - 2, hy - 8, 5, 1, G); g.px(hx, hy - 8, K.white); g.px(hx, hy + 2, G); }
  else if (mode === 'fwd') { g.R(hx, hy, 11, 1, D); g.R(hx + 8, hy - 2, 1, 5, G); g.R(hx + 7, hy, 5, 1, G); g.px(hx + 8, hy, K.white); g.px(hx + 12, hy, L); }
  else if (mode === 'down') { g.R(hx, hy, 1, 10, D); g.R(hx - 2, hy + 7, 5, 1, G); g.R(hx, hy + 5, 1, 6, G); g.px(hx, hy + 7, K.white); }
}
function drawSarah(g, P) {
  const b = P.b || 0, hs = P.hs || 0, fl = P.flare || 0, sit = P.sit, T = P.tw || 0;
  const oy = sit ? 6 : 0, hy = b + oy;
  // pelo largo detrás, con ondas
  for (let y = 7; y <= 25; y++) {
    const t = (y - 7) / 18, sh = Math.round(hs * t * 2 + Math.sin(y * 0.7) * 0.6 * t);
    const w = y < 12 ? 5 : y > 22 ? 3 : 4, x0 = 6 - sh - (y > 12 ? 1 : 0);
    if (sit && y > 20) continue;
    g.R(x0, y + hy, w, 1, SH.hair);
    if (y % 4 === 1) g.px(x0 + 1, y + hy, SH.hair3); else if (y % 4 === 3) g.px(x0 + 2, y + hy, SH.hair2);
    g.px(x0, y + hy, SH.hairD);
  }
  // brazo de atrás
  const [bx, by] = P.armB;
  if (!sit) { line2(g, 9, 18 + b, bx, by + b, SH.skin2, 1); g.R(bx - 1, by + b, 2, 2, SH.skin2); g.R(8, 16 + b, 2, 3, SH.d3); }
  // piernas y zapatitos
  const leg = (hip, L, back) => {
    const fx = hip + L.dx, fy = 31 - (L.lift || 0);
    line2(g, hip, 27, fx, fy - 1, back ? SH.skin2 : SH.skin, 2);
    g.R(fx - 1, fy, 4, 2, back ? '#9a2658' : SH.shoe); if (!back) g.px(fx + 1, fy, '#ff9fc7');
  };
  if (sit) { g.R(10, 29, 9, 2, SH.skin); g.R(19, 28, 3, 3, SH.shoe); g.R(16, 29, 2, 2, '#9a2658'); }
  else { leg(11, P.legA, true); leg(13, P.legB, false); }
  // falda acampanada con volantes
  const rows = [[20, 9, 7], [21, 8, 9], [22, 8, 9], [23, 7, 11], [24, 7, 11], [25, 6, 13], [26, 6, 13], [27, 5, 15]];
  for (const [y, x, w] of rows) {
    const yy = y + b + oy, tr = y >= 23 ? -Math.round(fl * (y - 22) / 3) : 0;
    const xx = x + tr - (sit && y >= 24 ? 2 : 0), ww = w + (sit && y >= 24 ? 4 : 0) + (T && y >= 23 ? 2 : 0) - (T && y >= 23 ? 0 : 0);
    const X = xx - (T && y >= 23 ? 1 : 0);
    if (y === 27) { g.R(X, yy, ww, 1, SH.ruff); for (let i = 0; i < ww; i += 2) g.px(X + i, yy + 1, SH.ruff); g.px(X, yy, SH.d2); continue; }
    g.R(X, yy, ww, 1, SH.d);
    g.px(X, yy, SH.d3); g.px(X + 1, yy, SH.d3); g.px(X + ww - 1, yy, SH.d2); g.px(X + ww - 2, yy, SH.d2);
    if (y >= 23) { g.px(X + Math.floor(ww / 3), yy, SH.d3); g.px(X + Math.floor(ww * 2 / 3), yy, SH.d2); }
    if (y === 26) g.R(X + 1, yy, ww - 2, 1, SH.d2);
  }
  // brillitos en la falda (titilan según el cuadro)
  const tw = P.twinkle || 0;
  [[9, 23], [14, 25], [11, 26], [16, 22], [8, 25]].forEach(([x, y], i) => { if ((i + tw) % 3 === 0) g.px(x - (y >= 23 ? Math.round(fl * (y - 22) / 3) : 0), y + b + oy, K.white); });
  // corpiño
  const ty = 16 + b + oy;
  g.R(9, ty, 7, 5, SH.d); g.R(9, ty, 1, 5, SH.d3); g.R(14, ty + 1, 2, 3, SH.d2);
  g.R(10, ty, 5, 1, K.white); g.px(12, ty + 1, K.white); // escote
  g.px(12, ty + 2, K.gold); g.px(13, ty + 2, K.gold); g.px(12, ty + 3, K.gem); // broche de corazón
  g.R(9, ty + 4, 7, 1, SH.d2);
  // cabeza: melena, cara, flequillo
  g.ell(12, 8 + hy, 7, 7, SH.hair); g.ell(11, 7 + hy, 5, 4, SH.hair2); g.R(9, 3 + hy, 5, 1, SH.hair3);
  g.ell(14, 11 + hy, 5, 5, SH.skin); g.R(10, 11 + hy, 1, 4, SH.skin2);
  g.R(12, 16 + hy, 2, 1, SH.skin2); // cuello
  // flequillo en ondas
  for (let x = 8; x <= 19; x++) { const d = ([12, 13, 16, 17].includes(x) ? 9 : 9 + ((x % 3 === 1) ? 1 : 0)) - (x === 19 ? 2 : 0); g.R(x, 3 + hy, 1, d - 3, SH.hair); if (x % 3 === 2) g.px(x, d - 1 + hy, SH.hairD); }
  g.px(12, 5 + hy, SH.hair3); g.px(15, 5 + hy, SH.hair3); g.px(16, 4 + hy, SH.hair3); g.px(13, 6 + hy, SH.hair2); g.px(17, 6 + hy, SH.hair2);
  // mechones que enmarcan la cara
  g.R(8, 6 + hy, 2, 9, SH.hair); g.px(9, 15 + hy, SH.hair); g.px(10, 15 + hy, SH.hair2); g.px(8, 9 + hy, SH.hair3);
  g.R(19, 6 + hy, 1, 5, SH.hair); g.px(19, 11 + hy, SH.hair2);
  // ojos grandes
  const eye = (x) => {
    if (P.eyes === 'blink' || P.eyes === 'sleep') { g.R(x, 12 + hy, 2, 1, SH.eye); g.px(x - 1, 11 + hy, SH.eye); return; }
    if (P.eyes === 'happy') { g.px(x, 11 + hy, SH.eye); g.px(x + 1, 11 + hy, SH.eye); g.px(x - 1, 12 + hy, SH.eye); g.px(x + 2, 12 + hy, SH.eye); return; }
    if (P.eyes === 'hurt') { g.px(x - 1, 10 + hy, SH.eye); g.px(x, 11 + hy, SH.eye); g.px(x + 1, 11 + hy, SH.eye); g.px(x + 2, 10 + hy, SH.eye); g.px(x, 12 + hy, SH.eye); g.px(x + 1, 12 + hy, SH.eye); return; }
    g.R(x, 9 + hy, 2, 4, SH.eye); g.px(x, 10 + hy, K.white); g.px(x, 9 + hy, '#4a2a66'); g.R(x, 12 + hy, 2, 1, SH.iris); g.px(x + 1, 12 + hy, '#c9a3ff');
  };
  eye(12); eye(16); if (!P.eyes || P.eyes === 'open' || P.eyes === 'open2') { g.px(11, 9 + hy, SH.eye); g.px(18, 9 + hy, SH.eye); }
  g.R(11, 13 + hy, 2, 1, SH.blush); g.R(17, 13 + hy, 2, 1, SH.blush);
  if (P.eyes === 'happy' || P.eyes === 'open2') { g.R(14, 14 + hy, 3, 1, SH.mouth); g.px(15, 15 + hy, '#ff8fb0'); }
  else if (P.eyes === 'hurt') { g.R(15, 14 + hy, 2, 2, SH.mouth); }
  else { g.px(14, 14 + hy, SH.mouth); g.px(15, 14 + hy, SH.mouth); g.px(16, 13 + hy, SH.mouth); }
  // tiara con corazón
  const tx = 11, tyy = 0 + hy;
  g.R(tx, tyy + 2, 6, 1, K.gold); g.R(tx, tyy + 3, 6, 1, K.gold2);
  g.px(tx, tyy + 1, K.gold); g.px(tx + 5, tyy + 1, K.gold); g.R(tx + 2, tyy, 2, 2, K.gem); g.px(tx + 2, tyy, '#ffc1d6'); g.px(tx + 1, tyy + 1, K.gold3); g.px(tx + 4, tyy + 1, K.gold3);
  // brazo de adelante con manga abullonada y el cetro
  if (!sit) {
    const [fx, fy] = P.armF;
    line2(g, 16, 18 + b, fx, fy + b, SH.skin, 1); g.R(fx - 1, fy + b, 2, 2, SH.skin);
    g.R(15, 16 + b, 3, 3, SH.d2); g.px(17, 16 + b, K.white);
    if (P.cross && P.cross !== 'none') holyCross(g, fx, fy + b, P.cross);
  } else { g.R(15, 20 + oy, 3, 3, SH.d2); g.R(17, 23 + oy, 2, 2, SH.skin); holyCross(g, 19, 29, 'up'); }
}
const DV = {
  hair: '#e8b83a', hair2: '#f6d466', hair3: '#fff2a8', hairD: '#b8862a',
  skin: '#eab58a', skin2: '#c98e62', blush: '#e0a080', eye: '#1e1410', mouth: '#9a4a3a',
  tun: '#e2c48e', tun2: '#f4dcae', tun3: '#b8945e', vest: '#8a4a24', vest2: '#6a3418', belt: '#5a3418', belt2: '#3a2010', sand: '#6a3a1a', bag: '#7a4a24',
  band: '#c8302a', band2: '#8a1a18', staff: '#a0703a', staff2: '#704a24',
};
function davidStaff(g, hx, hy, mode) {
  const S = DV.staff, D = DV.staff2;
  if (mode === 'up') { g.R(hx, hy - 14, 1, 17, S); g.px(hx + 1, hy - 14, D); g.R(hx - 1, hy - 17, 3, 1, S); g.px(hx - 2, hy - 16, S); g.px(hx - 2, hy - 15, S); g.px(hx + 1, hy - 16, S); }
  else if (mode === 'fwd') { g.R(hx, hy, 14, 1, S); g.R(hx, hy + 1, 14, 1, D); g.R(hx + 14, hy - 3, 1, 3, S); g.R(hx + 12, hy - 4, 2, 1, S); }
  else if (mode === 'down') { g.R(hx, hy, 1, 12, S); g.R(hx + 1, hy + 9, 2, 1, S); g.px(hx + 3, hy + 8, S); }
}
function drawDavid(g, P) {
  const b = P.b || 0, sit = P.sit, oy = sit ? 6 : 0, hy = b + oy, fl = P.flare || 0;
  // capa (el manto que le regaló Jonatán) o la bolsita de pastor
  if (DV.cape) { const w = Math.round(fl); for (let y = 15; y <= 27 - (sit ? 3 : 0); y++) { const k = (y - 15) / 12, x0 = 9 - Math.round(k * (3 + w)); g.R(x0, y + b + oy, 5 + Math.round(k * 2), 1, y % 5 === 0 ? DV.cape2 : DV.cape); } }
  else if (!sit) { g.R(6, 20 + b, 4, 5, DV.bag); g.R(6, 20 + b, 4, 1, '#d08a54'); }
  // brazo de atrás
  const [bx, by] = P.armB;
  if (P.staffBack) davidStaff(g, bx, by + b, 'up');
  if (!sit) { line2(g, 9, 18 + b, bx, by + b, DV.skin2, 1); g.R(bx - 1, by + b, 2, 2, DV.skin2); }
  // piernas y sandalias
  const leg = (hip, L, back) => { const fx = hip + L.dx, fy = 31 - (L.lift || 0); line2(g, hip, 26, fx, fy - 1, back ? DV.skin2 : DV.skin, 2); g.R(fx - 1, fy, 4, 2, DV.sand); g.px(fx, fy - 1, DV.sand); };
  if (sit) { g.R(10, 29, 9, 2, DV.skin); g.R(19, 29, 3, 2, DV.sand); }
  else { leg(11, P.legA, true); leg(14, P.legB, false); }
  // túnica
  for (let y = 16; y <= 25; y++) {
    const yy = y + b + oy, w = y < 21 ? 9 : 9 + Math.floor((y - 20) / 3), x = 13 - Math.floor(w / 2) - (y >= 23 ? Math.round(fl * (y - 22) / 4) : 0);
    g.R(x, yy, w, 1, DV.tun); g.px(x, yy, DV.tun3); g.px(x + w - 1, yy, DV.tun2);
    if (y < 22) { g.R(x, yy, 2, 1, DV.vest); g.R(x + w - 3, yy, 3, 1, DV.vest); g.px(x + w - 1, yy, DV.vest2); }
    if (y === 25) for (let i = 0; i < w; i += 2) g.px(x + i, yy, DV.tun3);
  }
  g.R(8, 21 + b + oy, 10, 1, DV.belt); g.px(15, 22 + b + oy, DV.belt2); g.px(15, 23 + b + oy, DV.belt); // cinturón de cuerda
  for (let i = 0; i < 6; i++) g.px(10 + i, 16 + i + b + oy, DV.belt); // correa de la honda cruzada al pecho
  // cabeza
  g.ell(14, 11 + hy, 5, 5, DV.skin); g.R(10, 11 + hy, 1, 3, DV.skin2); g.R(13, 16 + hy, 2, 1, DV.skin2);
  // pelo rizado (rubio-rojizo)
  const curls = [[10, 6], [12, 4], [15, 4], [18, 6], [9, 9], [11, 7], [16, 5], [13, 5], [9, 11]];
  for (const [x, y] of curls) { g.disc(x, y + hy, 2, DV.hair); g.px(x, y - 1 + hy, DV.hair3); g.px(x + 1, y + 1 + hy, DV.hairD); }
  g.R(10, 5 + hy, 9, 3, DV.hair); g.px(13, 5 + hy, DV.hair3); g.px(16, 6 + hy, DV.hair2);
  if (DV.crown) { g.R(9, 5 + hy, 11, 3, K.gold); g.R(9, 7 + hy, 11, 1, K.gold2); for (const cx of [10, 14, 18]) { g.R(cx, 2 + hy, 2, 3, K.gold); g.px(cx, 1 + hy, K.gold3); } g.px(14, 6 + hy, '#d0302a'); g.px(11, 6 + hy, '#3f86ff'); g.px(17, 6 + hy, '#4fd05a'); }
  else {
  // cinta en la frente (con las puntas al viento)
  g.R(9, 7 + hy, 11, 2, DV.band); g.R(9, 8 + hy, 11, 1, DV.band2); g.R(6, 8 + hy, 3, 1, DV.band); g.R(5, 9 + hy, 3, 1, DV.band2); g.px(4, 10 + hy, DV.band); }
  // ojos
  const eye = x => {
    if (P.eyes === 'blink' || P.eyes === 'sleep') { g.R(x, 12 + hy, 2, 1, DV.eye); return; }
    if (P.eyes === 'happy') { g.px(x, 11 + hy, DV.eye); g.px(x + 1, 11 + hy, DV.eye); g.px(x - 1, 12 + hy, DV.eye); g.px(x + 2, 12 + hy, DV.eye); return; }
    if (P.eyes === 'hurt') { g.px(x - 1, 10 + hy, DV.eye); g.px(x, 11 + hy, DV.eye); g.px(x + 1, 11 + hy, DV.eye); g.px(x + 2, 10 + hy, DV.eye); return; }
    g.R(x, 10 + hy, 2, 3, DV.eye); g.px(x + 1, 10 + hy, K.white);
  };
  eye(13); eye(17);
  g.R(12, 9 + hy, 3, 1, DV.hairD); g.R(16, 9 + hy, 3, 1, DV.hairD); // cejas
  g.px(19, 12 + hy, DV.skin2);
  if (P.eyes === 'happy' || P.eyes === 'open2') { g.R(15, 14 + hy, 3, 1, DV.mouth); g.px(16, 15 + hy, '#ff8f8f'); }
  else if (P.eyes === 'hurt') g.R(15, 14 + hy, 2, 2, DV.mouth);
  else { g.px(15, 14 + hy, DV.mouth); g.px(16, 14 + hy, DV.mouth); g.px(17, 13 + hy, DV.mouth); }
  // brazo de adelante con el cayado
  if (!sit) {
    const [fx, fy] = P.armF;
    line2(g, 16, 18 + b, fx, fy + b, DV.skin, 1); g.R(fx - 1, fy + b, 2, 2, DV.skin); g.R(15, 16 + b, 3, 2, DV.tun2);
    if (P.cross && P.cross !== 'none') davidStaff(g, fx, fy + b, P.cross);
  } else { g.R(16, 20 + oy, 2, 2, DV.skin); davidStaff(g, 19, 29, 'up'); }
}
