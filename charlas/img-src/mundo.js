// =====================================================================
//  Mundo en píxel: suelo, casas barrocas de Leipzig, la iglesia de Santo Tomás, árboles, fuente, faroles…
//  Todo con el pincel de Mi Piano (Pen) y contorno de tinta automático (sprite()).
// =====================================================================
const TC = {   // colores de la ciudad barroca
  pasto: '#7cc96a', pasto2: '#5fae55', pasto3: '#a6e08a', pasto4: '#4a9447',
  piedra: '#c9bcab', piedra2: '#a99b8b', piedra3: '#e2d8ca', junta: '#8c7f74',
  tierra: '#e0c08e', tierra2: '#c9a372', tierra3: '#f0d8a8',
  agua: '#5fc4ef', agua2: '#3f97d6', agua3: '#bdf0ff',
  tejado: '#c0533f', tejado2: '#9a3a2e', tejado3: '#de7a5a', pizarra: '#5d6384', pizarra2: '#454a68', pizarra3: '#7d84a6',
  cobre: '#6fbfa6', cobre2: '#4a9483', cobre3: '#a6e3cf', oro: '#ffd046', oro2: '#e6a21b',
  vidrio: '#2f4b7c', vidrio2: '#5a86c4', vidrio3: '#a9d4ff', luz: '#ffd889', marco: '#fff6e6',
};
const FACHADAS = [
  ['#f3e2bf', '#dcc69c', '#fff2d8'], ['#efb48e', '#d8946c', '#ffd3b6'], ['#a9d6c0', '#86b9a1', '#d1f0e0'], ['#f4d277', '#dcb352', '#fff0a8'],
  ['#b7cde8', '#94aed0', '#dbe8fb'], ['#e9a3a6', '#cf8286', '#ffc9cb'], ['#f6efe2', '#ddd2bf', '#ffffff'],
];
// ---------- suelo ----------
function pasto(g, x0, y0, w, h, R) {
  g.R(x0, y0, w, h, TC.pasto);
  for (let i = 0; i < w * h / 32; i++) { const x = x0 + Math.floor(R() * w), y = y0 + Math.floor(R() * h), t = R(); if (t < .5) { g.px(x, y, TC.pasto2); g.px(x, y - 1, TC.pasto2); } else if (t < .8) g.px(x, y, TC.pasto3); else g.px(x, y, TC.pasto4); }
}
function flores(g, x0, y0, w, h, R, n) { const cs = [NC.DO, NC.MI, '#fffaf4', NC.SI, NC.RE, '#ff9cc4']; for (let i = 0; i < n; i++) { const x = x0 + Math.floor(R() * w), y = y0 + Math.floor(R() * h), c = cs[Math.floor(R() * cs.length)]; g.px(x, y, c); g.px(x + 1, y, c); g.px(x, y + 1, mezcla(c, '#000', .2)); g.px(x, y + 2, TC.pasto4); } }
function adoquines(g, x0, y0, w, h, R, o = {}) {
  const A = o.a || TC.piedra, B = o.b || TC.piedra2, L = o.l || TC.piedra3, J = o.j || TC.junta;
  g.R(x0, y0, w, h, J);
  for (let y = 0, fila = 0; y < h; y += 4, fila++) { const off = fila % 2 ? 3 : 0; for (let x = -off, k = 0; x < w; x += 6, k++) { const c = ((k * 7 + fila * 3) % 11 === 0) ? B : A; const xx = Math.max(x0, x0 + x), ww = Math.min(5, x0 + x + 5 - xx, x0 + w - xx); if (ww <= 0) continue; g.R(xx, y0 + y, ww, Math.min(3, h - y), c); g.R(xx, y0 + y, Math.max(1, ww - 1), 1, L); } }
}
function plazaCirculo(g, cx, cy, rx, ry, R) {   // empedrado en anillos concéntricos (abanico)
  for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) {
    const t = Math.sqrt((x * x) / (rx * rx) + (y * y) / (ry * ry)); if (t > 1) continue;
    const anillo = Math.floor(t * 11), f = t * 11 - anillo, a = Math.atan2(y / ry, x / rx), n = 6 + anillo * 6, sg = (a + Math.PI) / (Math.PI * 2) * n, fs = sg - Math.floor(sg);
    let c = (anillo + Math.floor(sg)) % 2 ? TC.piedra : '#d6cab9'; if (f < .18 || fs < .12) c = TC.junta; else if (f < .34) c = TC.piedra3;
    if (anillo === 10) c = f < .3 ? TC.junta : TC.piedra2;
    g.px(cx + x, cy + y, c);
  }
}
function tierra(g, x0, y0, w, h, R) { g.R(x0, y0, w, h, TC.tierra); for (let i = 0; i < w * h / 18; i++) { const x = x0 + Math.floor(R() * w), y = y0 + Math.floor(R() * h); g.px(x, y, R() < .6 ? TC.tierra2 : TC.tierra3); } }
function agua(g, x0, y0, w, h, R) { g.R(x0, y0, w, h, TC.agua); for (let i = 0; i < w * h / 30; i++) { const x = x0 + Math.floor(R() * w), y = y0 + Math.floor(R() * h); g.R(x, y, 3, 1, R() < .5 ? TC.agua3 : TC.agua2); } }

// ---------- la casa barroca (vista 3/4 desde arriba: tejado al fondo, fachada al frente) ----------
// o: { w, hf (alto fachada), hr (alto tejado), col: índice de FACHADAS, tejado:'rojo'|'pizarra', gablete:true, pisos, tienda, puerta:'arco', noche, chimenea }
function sprCasa(o = {}) {
  const w = o.w || 44, hf = o.hf || 34, hr = o.hr || 22, F = FACHADAS[(o.col || 0) % FACHADAS.length];
  const T = o.tejado === 'pizarra' ? [TC.pizarra, TC.pizarra2, TC.pizarra3] : [TC.tejado, TC.tejado2, TC.tejado3];
  const gab = o.gablete !== false, gw = Math.round(w * .46), gh = Math.round(hr * .78), H = hr + hf;
  return sprite(w, H + 1, g => {
    // tejado: tejas en filas, alero oscuro
    g.R(1, 0, w - 2, hr, T[0]);
    for (let y = 2; y < hr; y += 3) { g.R(1, y, w - 2, 1, T[1]); for (let x = 1 + (y % 2) * 2; x < w - 1; x += 4) g.px(x, y - 1, T[2]); }
    g.R(1, 0, w - 2, 1, T[2]);
    if (o.chimenea !== false) { const cx = Math.round(w * .78); g.R(cx, -0, 4, 7, '#b8a48e'); g.R(cx, 0, 4, 1, '#8c7a66'); g.R(cx + 1, 2, 2, 5, '#9a8672'); }
    // buhardillas (si no hay gablete en medio)
    if (!gab) for (let k = 0; k < 2; k++) { const dx = Math.round(w * (k ? .62 : .22)); g.R(dx, hr - 12, 8, 8, F[0]); g.R(dx - 1, hr - 14, 10, 3, T[1]); g.R(dx + 2, hr - 10, 4, 5, TC.vidrio); g.px(dx + 2, hr - 10, TC.vidrio3); }
    // fachada
    g.R(0, hr, w, hf, F[0]); g.R(0, hr, w, 2, F[2]); g.R(0, hr + 2, w, 1, F[1]); g.R(w - 3, hr + 3, 3, hf - 3, F[1]); g.R(0, H - 3, w, 3, F[1]);
    // gablete barroco: sube desde la fachada al tejado, con volutas
    if (gab) {
      const gx = Math.round((w - gw) / 2), gy = hr - gh;
      for (let y = 0; y < gh; y++) { const t = y / gh, half = Math.round(gw / 2 * (y < gh * .35 ? .45 + .25 * Math.sin(t / .35 * Math.PI / 2) : .7 + .3 * ((y - gh * .35) / (gh * .65)))); g.R(gx + gw / 2 - half, gy + y, half * 2, 1, F[0]); }
      g.R(gx + gw / 2 - 2, gy - 2, 4, 2, F[2]); g.px(gx + gw / 2 - 1, gy - 3, F[2]);
      g.R(gx + gw / 2 - 3, gy + Math.round(gh * .38), 6, 6, F[2]); g.R(gx + gw / 2 - 2, gy + Math.round(gh * .38) + 1, 4, 4, TC.vidrio); g.px(gx + gw / 2 - 2, gy + Math.round(gh * .38) + 1, TC.vidrio3);
      g.R(gx + 2, gy + Math.round(gh * .35), 2, 2, F[2]); g.R(gx + gw - 4, gy + Math.round(gh * .35), 2, 2, F[2]);
    }
    // ventanas
    const pisos = o.pisos || 2, cols = Math.max(2, Math.round((w - 8) / 10)), vw = 5, vh = 7;
    for (let p = 0; p < pisos; p++) for (let c = 0; c < cols; c++) {
      const vx = Math.round(4 + c * (w - 8 - vw) / (cols - 1)), vy = hr + 5 + p * 11;
      if (p === pisos - 1 && o.puerta !== false && Math.abs(vx + vw / 2 - w / 2) < 6) continue;
      g.R(vx - 1, vy - 1, vw + 2, vh + 2, F[2]); g.R(vx, vy, vw, vh, o.noche ? TC.luz : TC.vidrio); g.R(vx + 2, vy, 1, vh, F[2]); g.R(vx, vy + 3, vw, 1, F[2]);
      if (!o.noche) { g.px(vx, vy, TC.vidrio3); g.px(vx + 3, vy, TC.vidrio2); }
      g.R(vx - 1, vy + vh + 1, vw + 2, 1, F[1]);
      if (o.flores && p === 0) { g.R(vx - 1, vy + vh + 1, vw + 2, 2, TC.tejado2); g.px(vx, vy + vh, NC.DO); g.px(vx + 2, vy + vh, NC.MI); g.px(vx + 4, vy + vh, '#ff9cc4'); }
    }
    // puerta con arco
    if (o.puerta !== false) {
      const dx = Math.round(w / 2 - 4), dy = H - 13;
      g.R(dx - 1, dy - 1, 10, 13, F[2]); g.R(dx, dy + 2, 8, 10, '#7a4a2a'); g.R(dx + 1, dy, 6, 2, '#7a4a2a'); g.R(dx + 1, dy + 3, 2, 8, '#94603a'); g.R(dx + 5, dy + 3, 2, 8, '#94603a'); g.px(dx + 4, dy + 7, TC.oro);
      g.R(dx - 2, H - 2, 12, 2, '#b8aa96');
      if (o.letrero) { g.R(dx + 10, dy - 3, 6, 5, o.letrero); g.R(dx + 9, dy - 4, 1, 2, INK); }
    }
    if (o.tienda) { const ty = H - 15; for (let x = 2; x < w - 2; x++) g.R(x, ty, 1, 4, Math.floor(x / 3) % 2 ? o.tienda : '#fffaf4'); g.R(2, ty + 4, w - 4, 1, mezcla(o.tienda, '#000', .3)); }
  }, { ax: 0, ay: H + 1 });
}
// ---------- la iglesia de Santo Tomás (Thomaskirche): nave alta, tejado empinadísimo, torre con chapitel barroco ----------
function sprIglesia(o = {}) {
  const w = 150, hn = 46, hr = 44, H = 134;   // nave: alto fachada, alto tejado; H total con torre
  return sprite(w, H, g => {
    const N0 = '#f1e6cc', N1 = '#d8c9a6', N2 = '#fff6e0', y0 = H - hn;   // y0 = arriba de la fachada de la nave
    // tejado de la nave (pizarra), muy alto
    g.R(36, y0 - hr, w - 38, hr, TC.pizarra);
    for (let y = y0 - hr + 3; y < y0; y += 3) { g.R(36, y, w - 38, 1, TC.pizarra2); for (let x = 37 + (y % 2) * 2; x < w - 2; x += 4) g.px(x, y - 1, TC.pizarra3); }
    g.R(36, y0 - hr, w - 38, 1, TC.pizarra3);
    // buhardillas pequeñas en el tejado
    [70, 100, 128].forEach(x => { g.R(x, y0 - 16, 6, 6, N0); g.R(x - 1, y0 - 18, 8, 3, TC.pizarra2); g.R(x + 2, y0 - 14, 2, 4, TC.vidrio); });
    // fachada larga de la nave con contrafuertes y ventanales góticos
    g.R(36, y0, w - 38, hn, N0); g.R(36, y0, w - 38, 2, N2); g.R(36, H - 4, w - 38, 4, N1);
    for (let k = 0; k < 5; k++) {
      const x = 44 + k * 21; g.R(x - 4, y0 + 2, 3, hn - 2, N1); g.R(x - 4, y0 + 2, 1, hn - 2, N2);
      const vx = x + 3, vy = y0 + 8, vw = 9, vh = 28;   // ventanal con arco ojival y vitral
      for (let y = 0; y < vh; y++) { const half = y < 5 ? Math.round(vw / 2 * Math.sqrt(y / 5)) : Math.round(vw / 2); g.R(vx + Math.round(vw / 2) - half - 1, vy + y, half * 2 + 2, 1, N1); }
      for (let y = 1; y < vh - 1; y++) { const half = y < 5 ? Math.round((vw / 2 - 1) * Math.sqrt(y / 5)) : Math.round(vw / 2 - 1); g.R(vx + Math.round(vw / 2) - half, vy + y, half * 2, 1, o.noche ? TC.luz : TC.vidrio); }
      if (!o.noche) { g.R(vx + Math.round(vw / 2), vy + 2, 1, vh - 3, TC.vidrio2); for (let y = vy + 6; y < vy + vh - 2; y += 5) g.R(vx + 1, y, vw - 2, 1, TC.vidrio2); g.px(vx + 2, vy + 7, NC.DO); g.px(vx + 6, vy + 12, NC.MI); g.px(vx + 3, vy + 17, NC.SOL); g.px(vx + 5, vy + 21, NC.SI); }
    }
    g.R(w - 6, y0 + 2, 4, hn - 2, N1);
    // la torre (oeste), adelante a la izquierda
    const tx = 6, tw = 40, tb = H;   // base de la torre
    g.R(tx, tb - 64, tw, 64, N0); g.R(tx, tb - 64, tw, 2, N2); g.R(tx + tw - 5, tb - 62, 5, 62, N1); g.R(tx, tb - 4, tw, 4, N1);
    g.R(tx, tb - 36, tw, 2, N1); g.R(tx, tb - 38, tw, 1, N2);
    // portal gótico
    const px = tx + 12, py = tb - 26;
    for (let y = 0; y < 26; y++) { const half = y < 8 ? Math.round(9 * Math.sqrt(y / 8)) : 9; g.R(px + 8 - half, py + y, half * 2, 1, N1); }
    for (let y = 2; y < 26; y++) { const half = y < 9 ? Math.round(6 * Math.sqrt((y - 2) / 7)) : 6; g.R(px + 8 - half, py + y, half * 2, 1, '#6e4426'); }
    g.R(px + 7, py + 8, 2, 18, '#8a5a34'); g.px(px + 6, py + 16, TC.oro); g.px(px + 9, py + 16, TC.oro);
    // reloj
    const rx = tx + tw / 2, ry = tb - 52; g.disc(rx, ry, 7, '#fffaf2'); g.ring(rx, ry, 7, TC.oro2, 1); g.R(rx, ry - 5, 1, 5, INK); g.R(rx, ry, 4, 1, INK); g.px(rx, ry - 6, INK); g.px(rx + 6, ry, INK); g.px(rx, ry + 6, INK); g.px(rx - 6, ry, INK);
    // octógono con arcos (campanario)
    const ox = tx + 5, ow = tw - 10, oy = tb - 90;
    g.R(ox, oy, ow, 26, N0); g.R(ox + ow - 4, oy, 4, 26, N1); g.R(ox - 2, oy + 24, ow + 4, 3, N2);
    [ox + 4, ox + 13, ox + 22].forEach(x => { g.R(x, oy + 6, 5, 14, '#3a2a4a'); g.R(x + 1, oy + 4, 3, 2, '#3a2a4a'); g.px(x + 2, oy + 14, TC.oro); });
    // chapitel barroco: campana de cobre, linterna, cupulita, bola y cruz
    const cx = tx + tw / 2;
    for (let y = 0; y < 16; y++) { const t = y / 16, half = Math.round(ow / 2 * (.35 + .65 * Math.sin(t * Math.PI / 2 + .2))); g.R(cx - half, oy - 16 + y, half * 2, 1, y % 4 === 3 ? TC.cobre2 : TC.cobre); g.px(cx - half + 2, oy - 16 + y, TC.cobre3); }
    g.R(cx - 5, oy - 26, 10, 10, N0); g.R(cx - 3, oy - 24, 2, 6, '#3a2a4a'); g.R(cx + 1, oy - 24, 2, 6, '#3a2a4a'); g.R(cx - 6, oy - 17, 12, 1, N1);
    for (let y = 0; y < 7; y++) { const half = Math.round(5 * Math.sin((y + 1) / 7 * Math.PI / 2)); g.R(cx - half, oy - 33 + y, half * 2, 1, TC.cobre); }
    g.R(cx, oy - 40, 1, 7, TC.oro2); g.disc(cx, oy - 36, 1, TC.oro); g.R(cx - 2, oy - 44, 5, 1, TC.oro); g.R(cx, oy - 46, 1, 6, TC.oro);
  }, { ax: 0, ay: H });
}
// ---------- vegetación y mobiliario ----------
function sprArbol(t = 0, k = 1) {
  return cache('arb' + t + k, () => { const r = Math.round(10 * k); return sprite(r * 2 + 2, r * 2 + 10, g => {
    const C = t ? ['#3fae5a', '#2a7d4a', '#7fd77a'] : ['#5fbf5a', '#3f9a4a', '#a6e08a'];
    g.R(r - 1, r * 2 - 2, 4, 11, '#7a4a2a'); g.R(r, r * 2 - 2, 1, 11, '#9a6038');
    g.disc(r + 1, r + 2, r, C[1]); g.disc(r, r, r - 1, C[0]); g.disc(r - Math.round(r * .35), r - Math.round(r * .35), Math.round(r * .45), C[2]);
    for (let i = 0; i < r * 2; i++) { const a = i * 2.4, q = r * .7; g.px(Math.round(r + Math.cos(a) * q), Math.round(r + Math.sin(a) * q), C[1]); }
    if (t === 2) [[-4, -2], [3, 2], [-1, 5], [5, -4]].forEach(([dx, dy]) => g.px(r + dx, r + dy, NC.DO));
  }, { ax: r + 1, ay: r * 2 + 10 }); });
}
function sprSeto(w = 20) { return cache('seto' + w, () => sprite(w, 8, g => { g.R(0, 2, w, 6, '#3f9a4a'); for (let x = 0; x < w; x += 4) g.disc(x + 2, 3, 3, '#5fbf5a'); for (let x = 1; x < w; x += 5) g.px(x, 1, '#a6e08a'); }, { ax: 0, ay: 8 })); }
function sprFarol() { return cache('farol', () => sprite(5, 24, g => { g.R(2, 6, 1, 18, INK); g.R(1, 22, 3, 2, INK); g.R(0, 1, 5, 6, '#3a2a4a'); g.R(1, 2, 3, 4, TC.luz); g.px(2, 0, INK); }, { ax: 2, ay: 24 })); }
function sprFuente() {
  return cache('fuente', () => sprite(44, 30, g => {
    g.ell(22, 18, 21, 10, TC.piedra2); g.ell(22, 17, 21, 10, TC.piedra3); g.ell(22, 17, 18, 8, TC.agua2); g.ell(22, 16, 17, 7, TC.agua);
    for (let i = 0; i < 9; i++) g.R(8 + i * 3.4, 15 + (i % 3), 3, 1, TC.agua3);
    g.R(19, 6, 6, 12, TC.piedra); g.R(19, 6, 2, 12, TC.piedra3); g.ell(22, 6, 7, 3, TC.piedra2); g.ell(22, 5, 7, 3, TC.piedra3); g.ell(22, 5, 5, 2, TC.agua);
    g.R(21, 0, 2, 5, TC.agua3); g.px(19, 1, TC.agua3); g.px(25, 1, TC.agua3); g.px(17, 3, TC.agua3); g.px(27, 3, TC.agua3);
    g.R(21, 27, 2, 1, TC.piedra2);
  }, { ax: 22, ay: 28 }));
}
function sprBanco() { return cache('banco', () => sprite(16, 8, g => { g.R(0, 2, 16, 2, '#9a6038'); g.R(0, 0, 16, 1, '#c98a52'); g.R(1, 4, 2, 4, INK); g.R(13, 4, 2, 4, INK); g.R(0, 4, 16, 1, '#7a4a2a'); }, { ax: 8, ay: 8 })); }
function sprPuesto(c = NC.DO) { return cache('puesto' + c, () => sprite(26, 20, g => { for (let x = 0; x < 26; x++) g.R(x, 0, 1, 6, Math.floor(x / 4) % 2 ? c : '#fffaf4'); g.R(0, 6, 26, 1, mezcla(c, '#000', .3)); g.R(1, 6, 1, 14, '#7a4a2a'); g.R(24, 6, 1, 14, '#7a4a2a'); g.R(0, 12, 26, 8, '#c98a52'); g.R(0, 12, 26, 1, '#e8b47c'); [3, 8, 13, 18].forEach((x, i) => g.disc(x + 2, 11, 2, [NC.DO, NC.MI, NC.FA, NC.RE][i])); }, { ax: 13, ay: 20 })); }
function sprPaloma(f = 0) { return cache('pal' + f, () => sprite(6, 5, g => { g.R(1, 2, 4, 3, '#b8aac8'); g.R(4, 1, 2, 2, '#8a7a9b'); g.px(5, 1, INK); g.px(1, 2, '#e2d8f0'); if (f) g.R(0, 0, 3, 2, '#e2d8f0'); }, { ax: 3, ay: 5 })); }
function sprBarril() { return cache('barril', () => sprite(8, 10, g => { g.R(0, 1, 8, 9, '#9a6038'); g.R(0, 0, 8, 2, '#c98a52'); g.R(0, 3, 8, 1, '#5a3418'); g.R(0, 7, 8, 1, '#5a3418'); g.R(1, 1, 1, 9, '#c98a52'); }, { ax: 4, ay: 10 })); }
// niebla de "lo que falta descubrir" (sobre un lienzo de píxel)
function nieblaBordes(ctx, w, h, k = 1) {
  ctx.save(); const gr = ctx.createRadialGradient(w / 2, h * .55, Math.min(w, h) * .32 * k, w / 2, h * .55, Math.max(w, h) * .62);
  gr.addColorStop(0, 'rgba(232,224,255,0)'); gr.addColorStop(.7, 'rgba(232,224,255,.55)'); gr.addColorStop(1, 'rgba(232,224,255,.95)'); ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h); ctx.restore();
}
