// =====================================================================
//  El pueblo del día (8–10) e interiores: el salón de Bach (11–13)
// =====================================================================
const COL5 = [NC.DO, NC.MI, NC.FA, NC.SOL, NC.SI, NC.LA, NC.RE];
// marcador de parada (en alta resolución): círculo con número, encendido/apagado
function marcador(ctx, x, y, n, estado) {
  const on = estado !== 'futuro', c = COL5[n - 1];
  ctx.save();
  if (estado === 'hoy') { ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 0, x, y, 70); g.addColorStop(0, 'rgba(255,230,140,.85)'); g.addColorStop(1, 'rgba(255,230,140,0)'); ctx.fillStyle = g; ctx.fillRect(x - 70, y - 70, 140, 140); ctx.globalCompositeOperation = 'source-over'; }
  ctx.beginPath(); ctx.moveTo(x, y + 34); ctx.lineTo(x - 13, y + 12); ctx.lineTo(x + 13, y + 12); ctx.closePath(); ctx.fillStyle = on ? c : '#8a7a9b'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, 22, 0, 7); ctx.fillStyle = on ? c : '#b8aac8'; ctx.fill(); ctx.lineWidth = 4; ctx.stroke();
  ctx.beginPath(); ctx.arc(x - 6, y - 7, 6, 0, 7); ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fill();
  texto(ctx, String(n), x, y + 2, { tam: 28, c: on ? INK : '#6e5f80', fuente: 'Outfit' });
  if (estado === 'hecho') { ctx.beginPath(); ctx.arc(x + 18, y - 18, 11, 0, 7); ctx.fillStyle = '#5fd36a'; ctx.fill(); ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 12, y - 18); ctx.lineTo(x + 17, y - 13); ctx.lineTo(x + 25, y - 23); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3.5; ctx.stroke(); }
  ctx.restore();
}
// niebla de "mañana hay más" en alta resolución, con siluetas que asoman
function nieblaMas(ctx, o = {}) {
  ctx.save(); const g = ctx.createRadialGradient(W / 2, H * .52, H * (o.r0 || .42), W / 2, H * .5, H * (o.r1 || 1.05));
  g.addColorStop(0, 'rgba(236,228,255,0)'); g.addColorStop(.55, 'rgba(236,228,255,.6)'); g.addColorStop(1, 'rgba(236,228,255,.97)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function silueta(ctx, s, x, y, k, a = .35) { const t = teñido(s, '#9c8cc4'); sprK(ctx, t, x, y, k, { alpha: a }); }

// ---------- 8 · cenital: camino en lazo con 5 casas ----------
ESCENAS['p-cenital'] = (ctx, o = {}) => {
  const R = rng(21), cx = 213, cy = 132, rx = 140, ry = 70;
  const casas = [[0.62, 1, 'hecho'], [1.52, 3, 'hecho'], [2.55, 0, 'hoy'], [3.6, 2, 'futuro'], [4.75, 5, 'futuro']].map(([a, col, est], i) => ({ x: Math.round(cx + Math.cos(a + Math.PI / 2) * rx), y: Math.round(cy + Math.sin(a + Math.PI / 2) * ry), col, est: o.todo ? 'hecho' : est, n: i + 1 }));
  const sh = [];
  const c = pix(LW, LH, g => {
    pasto(g, 0, 0, LW, LH, R); flores(g, 0, 0, LW, LH, R, 120);
    // camino en lazo (anillo de tierra con bordes)
    for (let y = -ry - 10; y <= ry + 10; y++) for (let x = -rx - 10; x <= rx + 10; x++) { const t = Math.sqrt((x * x) / (rx * rx) + (y * y) / (ry * ry)); if (Math.abs(t - 1) < .065) g.px(cx + x, cy + y, Math.abs(t - 1) > .05 ? TC.tierra2 : ((x * 7 + y * 3) % 11 === 0 ? TC.tierra3 : TC.tierra)); }
    // estanque y árboles en el centro del lazo
    agua(g, cx - 34, cy - 12, 68, 24, R); g.R(cx - 34, cy - 13, 68, 1, '#e0f6ff');
  });
  const O = [];
  casas.forEach(h => O.push({ s: sprCasa({ w: 44, hf: 30, hr: 20, col: h.col, gablete: h.n % 2 === 1, flores: true }), x: h.x - 22, y: h.y - 10, h }));
  [[cx - 50, cy + 6], [cx + 54, cy + 8], [cx, cy - 22], [40, 40], [380, 200], [30, 214], [395, 50], [110, 222], [320, 30]].forEach(([x, y], i) => O.push({ s: sprArbol(i % 3), x, y }));
  O.push({ s: sprBanco(), x: cx, y: cy + 26 });
  const hoy = casas[2]; O.push({ s: sprSarah({}), x: hoy.x - 22, y: hoy.y + 26 }); O.push({ s: sprDavid({}), x: hoy.x + 2, y: hoy.y + 26 }); O.push({ s: sprRobotB({ ojos: 'feliz' }), x: hoy.x + 26, y: hoy.y + 12 });
  O.sort((a, b) => a.y - b.y);
  subir(ctx, c, K3);
  sombras(ctx, O.map(o => ({ x: (o.x + (o.h ? 22 : 0)) * K3 + 12, y: o.y * K3, rx: o.h ? 80 : 20, ry: o.h ? 16 : 6, a: .35 })), 7);
  O.forEach(o => sprK(ctx, o.s, o.x * K3, o.y * K3, K3));
  // siluetas en la niebla: más pueblo mañana
  silueta(ctx, sprIglesia({}), 1040, 180, 1.4, .45); silueta(ctx, sprArbol(1, 1.6), 60, 200, 3, .4); silueta(ctx, sprArbol(0, 1.6), 1200, 720, 3, .4);
  postHD(ctx, { base: 'contrast(1.08) saturate(1.15)', tilt: [.22, .14], blur: 4, bloom: .22, polvo: 40, vin: 0, calidoA: .45, frioA: .3, semilla: 4, rayos: [{ x: 200, y: -60, ang: -.55, ancho: 140, largo: 900 }] });
  nieblaMas(ctx, { r0: .5, r1: 1.0 });
  casas.forEach(h => marcador(ctx, h.x * K3, (h.y - 62) * K3, h.n, h.est));
};
// ---------- 9 · calle lateral tipo plataformas con 5 puertas ----------
ESCENAS['p-calle'] = ctx => {
  const R = rng(31);
  const c = pix(LW, LH, (g, x) => {
    const gr = x.createLinearGradient(0, 0, 0, 170); gr.addColorStop(0, '#8fd3ff'); gr.addColorStop(1, '#ffe2c4'); x.fillStyle = gr; x.fillRect(0, 0, LW, 170);
    // fondo: siluetas de techos y la torre de Santo Tomás
    for (let i = 0; i < 12; i++) { const bx = i * 38 - 10, bh = 40 + (i * 13) % 30; g.R(bx, 150 - bh, 34, bh, '#c9b5e8'); for (let y = 0; y < 15; y++) g.R(bx + 15 - y, 150 - bh - 15 + y, 4 + y * 2, 1, '#b8a0dc'); }
    g.R(300, 40, 22, 110, '#b8a0dc'); for (let y = 0; y < 16; y++) { const half = Math.round(11 * Math.sin((y + 2) / 18 * Math.PI / 2)); g.R(311 - half, 24 + y, half * 2, 1, '#a890d0'); } g.R(311, 10, 1, 14, '#a890d0');
    g.R(0, 150, LW, 20, '#9fd38a');
    adoquines(g, 0, 200, LW, 40, R); g.R(0, 198, LW, 3, TC.piedra2);
  });
  subir(ctx, c, K3);
  const ests = ['hecho', 'hecho', 'hoy', 'futuro', 'futuro'];
  for (let i = 0; i < 5; i++) {
    const x0 = 8 + i * 84, s = sprCasa({ w: 76, hf: 66, hr: 26, col: [0, 3, 1, 2, 5][i], gablete: true, pisos: 3, flores: i % 2 === 0, chimenea: true });
    sombras(ctx, [{ x: (x0 + 44) * K3, y: 200 * K3 + 4, rx: 130, ry: 14, a: .3 }], 6);
    sprK(ctx, s, x0 * K3, 200 * K3, K3);
  }
  [[100, 214], [250, 214], [330, 214]].forEach(([x, y]) => sprK(ctx, sprFarol(), x * K3, y * K3, K3));
  sprK(ctx, sprSarah({ legA: { dx: -2 }, legB: { dx: 2 } }), 196 * K3, 226 * K3, K3); sprK(ctx, sprDavid({}), 226 * K3, 226 * K3, K3); sprK(ctx, sprRobotB({ ang: -.4, ojos: 'feliz' }), 254 * K3, 208 * K3, K3);
  sprK(ctx, sprSanson({}), 150 * K3, 230 * K3, K3);
  postHD(ctx, { base: 'contrast(1.08) saturate(1.15)', tilt: [.18, .08], blur: 4, bloom: .22, polvo: 35, vin: .35, calidoA: .45, frioA: .3, semilla: 8, rayos: [{ x: 150, y: -60, ang: -.5, ancho: 130, largo: 800 }] });
  // niebla hacia la derecha: la calle sigue mañana
  const f = ctx.createLinearGradient(980, 0, 1280, 0); f.addColorStop(0, 'rgba(236,228,255,0)'); f.addColorStop(1, 'rgba(236,228,255,.97)'); ctx.fillStyle = f; ctx.fillRect(900, 0, 380, H);
  const f2 = ctx.createLinearGradient(0, 0, 160, 0); f2.addColorStop(0, 'rgba(236,228,255,.8)'); f2.addColorStop(1, 'rgba(236,228,255,0)'); ctx.fillStyle = f2; ctx.fillRect(0, 0, 160, H);
  for (let i = 0; i < 5; i++) marcador(ctx, (8 + i * 84 + 38) * K3, 190 * K3 - 36 * K3 - 92, i + 1, ests[i]);
};
// ---------- 10 · plaza circular con fuente y 5 edificios ----------
ESCENAS['p-plaza'] = ctx => {
  const R = rng(41), cx = 213, cy = 150;
  const c = pix(LW, LH, g => { pasto(g, 0, 0, LW, LH, R); flores(g, 0, 0, LW, LH, R, 80); plazaCirculo(g, cx, cy + 6, 118, 56, R); });
  subir(ctx, c, K3);
  const pos = [[-2.95, 'hecho'], [-2.25, 'hecho'], [-1.57, 'hoy'], [-.89, 'futuro'], [-.19, 'futuro']].map(([a, est], i) => ({ a, est, n: i + 1 }));
  const O = [];
  pos.forEach((p, i) => { const x = cx + Math.cos(p.a) * 160 - 24, y = cy + 10 + Math.sin(p.a) * 72 + 6; p.x = x + 24; p.y = y; O.push({ s: sprCasa({ w: 48, hf: 32, hr: 22, col: [4, 0, 3, 2, 5][i], gablete: true, flores: true }), x, y, casa: true }); });
  O.push({ s: sprFuente(), x: cx, y: cy + 22 });
  O.push({ s: sprSarah({}), x: cx - 26, y: cy + 56 }); O.push({ s: sprDavid({}), x: cx + 4, y: cy + 56 }); O.push({ s: sprRobotB({ ojos: 'feliz', ang: .4 }), x: cx + 34, y: cy + 40 });
  [[cx - 140, cy + 60], [cx + 140, cy + 60], [cx - 80, cy + 80], [cx + 84, cy + 80]].forEach(([x, y], i) => O.push({ s: i < 2 ? sprArbol(i) : sprFarol(), x, y }));
  O.sort((a, b) => a.y - b.y);
  sombras(ctx, O.map(o => ({ x: (o.x + (o.casa ? 24 : 0)) * K3 + 14, y: o.y * K3, rx: o.casa ? 86 : 26, ry: o.casa ? 16 : 7, a: .35 })), 7);
  O.forEach(o => sprK(ctx, o.s, o.x * K3, o.y * K3, K3));
  silueta(ctx, sprArbol(1, 1.6), 80, 720, 3, .4); silueta(ctx, sprArbol(0, 1.6), 1200, 720, 3, .4);
  postHD(ctx, { base: 'contrast(1.08) saturate(1.15)', tilt: [.2, .12], blur: 4, bloom: .22, polvo: 40, vin: 0, calidoA: .45, frioA: .3, semilla: 6, luces: [{ x: 640, y: 440, r: 300, c: 'rgba(255,210,150,.5)', modo: 'soft-light' }] });
  nieblaMas(ctx, { r0: .45, r1: 1.05 });
  pos.forEach(p => marcador(ctx, p.x * K3, (p.y - 62) * K3, p.n, p.est));
};

// ---------- muebles del salón de Bach ----------
function sprClavecin(o = {}) { return cache('clav' + (o.lado || ''), () => sprite(56, 30, g => {
  const M = '#7a3a2a', M2 = '#5a2418', M3 = '#a85a3a', O = '#e6a21b';
  g.R(4, 22, 3, 8, M2); g.R(48, 22, 3, 8, M2); g.R(26, 22, 3, 8, M2);
  // caja con curva (ala) y tapa abierta
  for (let x = 0; x < 56; x++) { const t = x / 55, hh = Math.round(10 + 6 * Math.cos(t * Math.PI / 2)); g.R(x, 22 - hh, 1, hh, x < 2 ? M3 : M); }
  g.R(0, 12, 56, 2, O); g.R(0, 21, 56, 2, M2);
  for (let k = 0; k < 15; k++) { g.R(2 + k * 2, 14, 1, 4, '#fffaf2'); } for (let k = 0; k < 15; k++) if ([0, 1, 3, 4, 5].includes(k % 7)) g.R(3 + k * 2, 14, 1, 2, INK);
  // tapa abierta pintada (paisaje)
  for (let y = 0; y < 11; y++) g.R(18 + y, 1 + y, 36 - y * 2, 1, y < 2 ? O : y < 8 ? '#9fd8ff' : '#7fc96a'); g.R(18, 0, 36, 1, O); g.R(30, 2, 1, 10, M2);
  g.px(24, 4, '#fffaf4'); g.px(25, 4, '#fffaf4'); g.px(40, 3, '#fffaf4');
}, { ax: 28, ay: 30 })); }
function sprOrgano() { return cache('organo', () => sprite(64, 70, g => {
  const M = '#8a4a2a', M2 = '#6a3418', O = '#e6a21b', O2 = '#ffd046', P = '#d6dbe6', P2 = '#9aa3b8';
  g.R(4, 40, 56, 30, M); g.R(4, 40, 56, 2, O); g.R(10, 48, 44, 3, '#fffaf2'); for (let k = 0; k < 22; k++) if ([0, 1, 3, 4, 5].includes(k % 7)) g.R(10 + k * 2, 48, 1, 2, INK); g.R(8, 52, 48, 2, M2);
  for (let k = 0; k < 12; k++) { const h = 12 + Math.round(22 * Math.sin((k + .5) / 12 * Math.PI)), x = 6 + k * 4.4; g.R(Math.round(x), 40 - h, 3, h, P); g.R(Math.round(x), 40 - h, 1, h, '#fff'); g.R(Math.round(x) + 2, 40 - h, 1, h, P2); g.R(Math.round(x), 40 - 8, 3, 2, INK); }
  g.R(0, 2, 64, 4, O); g.R(28, 0, 8, 4, O2); g.R(2, 6, 4, 34, M); g.R(58, 6, 4, 34, M);
}, { ax: 32, ay: 70 })); }
function sprEstante() { return cache('estante', () => sprite(30, 40, g => { g.R(0, 0, 30, 40, '#7a4a2a'); g.R(2, 2, 26, 36, '#5a3418'); const C = [NC.DO, NC.LA, NC.FA, NC.MI, '#a85a3a', NC.SI, '#e8d6b0']; for (let f = 0; f < 4; f++) { g.R(2, 10 + f * 9, 26, 1, '#9a6038'); for (let k = 0; k < 8; k++) { const h = 6 + (k * 3 + f) % 3; g.R(3 + k * 3, 10 + f * 9 - h, 2, h, C[(k + f * 2) % C.length]); } } }, { ax: 15, ay: 40 })); }
function sprAtril() { return cache('atril', () => sprite(14, 22, g => { g.R(6, 8, 2, 14, '#7a4a2a'); g.R(3, 20, 8, 2, '#7a4a2a'); g.R(0, 0, 14, 10, '#fff1d6'); for (let y = 2; y < 9; y += 2) g.R(1, y, 12, 1, '#8a7a9b'); g.px(3, 3, INK); g.px(6, 5, INK); g.px(9, 4, INK); g.R(0, 9, 14, 1, '#c98a52'); }, { ax: 7, ay: 22 })); }
function sprCandelabro() { return cache('cand', () => sprite(12, 16, g => { g.R(5, 6, 2, 10, '#e6a21b'); g.R(1, 6, 10, 1, '#e6a21b'); [1, 5, 10].forEach(x => { g.R(x, 2, 1, 4, '#fffaf2'); g.px(x, 0, '#ffd046'); g.px(x, 1, '#ff9a3c'); }); g.R(3, 15, 6, 1, '#b87a10'); }, { ax: 6, ay: 16 })); }
function sprRelojPie() { return cache('relojp', () => sprite(12, 34, g => { g.R(1, 0, 10, 34, '#7a4a2a'); g.R(0, 0, 12, 3, '#9a6038'); g.disc(6, 7, 4, '#fffaf2'); g.R(6, 4, 1, 3, INK); g.R(6, 7, 3, 1, INK); g.R(4, 13, 4, 14, '#3a2418'); g.R(5, 22, 2, 3, '#ffd046'); g.R(6, 14, 1, 8, '#ffd046'); }, { ax: 6, ay: 34 })); }
function sprVentanal() { return cache('ventanal', () => sprite(24, 34, g => { g.R(0, 4, 24, 30, '#e8d6b0'); g.R(2, 6, 20, 26, '#9fd8ff'); for (let y = 0; y < 4; y++) g.R(2 + y, 6 + y * 0, 20 - y * 2, 1, '#9fd8ff'); g.R(11, 6, 2, 26, '#e8d6b0'); g.R(2, 18, 20, 2, '#e8d6b0'); g.R(3, 7, 3, 8, '#e0f6ff'); for (let y = 0; y < 5; y++) g.R(y * 2, 4 - y, 24 - y * 4, 1, '#e8d6b0'); g.R(0, 33, 24, 1, '#c9a372'); }, { ax: 12, ay: 34 })); }
function sprAlfombra(w, h) { return sprite(w, h, g => { g.R(0, 0, w, h, '#a3243a'); g.R(2, 2, w - 4, h - 4, '#c8324a'); g.R(4, 4, w - 8, h - 8, '#a3243a'); g.R(6, 6, w - 12, h - 12, '#d8a04a'); g.R(8, 8, w - 16, h - 16, '#c8324a'); for (let x = 10; x < w - 10; x += 6) for (let y = 10; y < h - 10; y += 6) g.px(x, y, '#ffd046'); }, { contorno: false, ax: 0, ay: 0 }); }
function sprCuadro(c = '#9fd8ff') { return cache('cuad' + c, () => sprite(14, 12, g => { g.R(0, 0, 14, 12, '#e6a21b'); g.R(2, 2, 10, 8, c); g.R(2, 7, 10, 3, '#7fc96a'); g.disc(9, 4, 1, '#fff3b0'); }, { ax: 7, ay: 12 })); }
function sprChimenea() { return cache('chim', () => sprite(36, 32, g => { g.R(0, 0, 36, 4, '#e8d6b0'); g.R(2, 4, 32, 28, '#c9bcab'); g.R(8, 10, 20, 22, '#3a2418'); g.R(10, 22, 16, 10, '#2a1a3a'); [[12, 24], [16, 20], [20, 23], [24, 25]].forEach(([x, y]) => { g.R(x, y, 3, 32 - y, '#ff9a3c'); g.R(x + 1, y + 2, 1, 30 - y - 2, '#ffd046'); }); g.R(10, 29, 16, 3, '#6e4426'); }, { ax: 18, ay: 32 })); }

// papel tapiz y piso de madera
function tapiz(g, x0, y0, w, h, A = '#f3d9b0', B = '#e8c896') { g.R(x0, y0, w, h, A); for (let x = x0 + 3; x < x0 + w; x += 8) for (let y = y0 + 3; y < y0 + h; y += 8) { g.px(x, y, B); g.px(x + 1, y + 1, B); g.px(x - 1, y + 1, B); g.px(x, y + 2, B); } g.R(x0, y0 + h - 4, w, 4, '#9a6038'); g.R(x0, y0 + h - 4, w, 1, '#c98a52'); }
function tablas(g, x0, y0, w, h, A = '#c98a52', B = '#a86e3e') { g.R(x0, y0, w, h, A); for (let y = y0; y < y0 + h; y += 5) { g.R(x0, y, w, 1, B); for (let x = x0 + ((y - y0) / 5 % 2) * 12; x < x0 + w; x += 24) g.R(x, y, 1, 5, B); } }

// ---------- 11 · casa de muñecas en corte lateral ----------
ESCENAS['i-corte'] = ctx => {
  const R = rng(51);
  const c = pix(LW, LH, (g, x) => {
    const gr = x.createLinearGradient(0, 0, 0, LH); gr.addColorStop(0, '#ffd9a8'); gr.addColorStop(1, '#c9b5ff'); x.fillStyle = gr; x.fillRect(0, 0, LW, LH);
    pasto(g, 0, 222, LW, 18, R);
    const X0 = 46, X1 = 381, G = 222, F1 = 150, F2 = 82, T = 30;   // suelo, piso 1, piso 2, cumbre
    // tejado a dos aguas (cortado)
    for (let y = T; y < F2; y++) { const t = (y - T) / (F2 - T), half = Math.round((X1 - X0) / 2 * t) + 10; g.R((X0 + X1) / 2 - half, y, half * 2, 1, (y % 3) ? TC.tejado : TC.tejado2); }
    for (let y = T + 6; y < F2 - 2; y++) { const t = (y - T) / (F2 - T), half = Math.round((X1 - X0) / 2 * t) - 2; if (half > 0) g.R((X0 + X1) / 2 - half, y, half * 2, 1, '#6e4426'); }
    // ático: baúl, instrumentos guardados, una ventanita redonda
    g.disc(213, 52, 6, '#e8d6b0'); g.disc(213, 52, 4, '#9fd8ff'); g.R(213, 48, 1, 9, '#e8d6b0');
    // pisos
    tapiz(g, X0, F2, X1 - X0, F1 - F2, '#cfe0ff', '#b0c4ec'); tapiz(g, X0, F1, X1 - X0, G - F1, '#f3d9b0', '#e8c896');
    // paredes interiores (divisiones)
    g.R(200, F2, 4, F1 - F2, '#e8d6b0'); g.R(200, F2, 1, F1 - F2, '#fff6e6');
    // vigas de piso cortadas (grosor) y muros cortados
    [F2, F1, G].forEach(y => { g.R(X0 - 6, y - 1, X1 - X0 + 12, 6, '#8a5a34'); g.R(X0 - 6, y - 1, X1 - X0 + 12, 1, '#c98a52'); for (let k = X0; k < X1; k += 18) g.R(k, y + 1, 2, 3, '#6e4426'); });
    g.R(X0 - 6, F2, 6, G - F2 + 5, '#d6c6a6'); g.R(X1, F2, 6, G - F2 + 5, '#d6c6a6'); for (let y = F2; y < G; y += 6) { g.R(X0 - 6, y, 6, 1, '#b8a888'); g.R(X1, y, 6, 1, '#b8a888'); }
    // escalera
    for (let k = 0; k < 13; k++) g.R(320 - k * 5, G - 4 - k * 5.5, 12, 3, '#9a6038');
  });
  subir(ctx, c, K3);
  const O = [];
  // piso 1: el salón de música con Bach al clavecín
  O.push({ s: sprVentanal(), x: 90, y: 200 }); O.push({ s: sprVentanal(), x: 250, y: 200 }); O.push({ s: sprCuadro(), x: 170, y: 176 });
  O.push({ s: sprClavecin(), x: 150, y: 220 }); O.push({ s: sprBach({ cara: 'feliz' }), x: 112, y: 220 }); O.push({ s: sprAtril(), x: 200, y: 220 }); O.push({ s: sprCandelabro(), x: 182, y: 196 });
  O.push({ s: sprSarah({}), x: 236, y: 220 }); O.push({ s: sprDavid({ eyes: 'happy' }), x: 262, y: 220 }); O.push({ s: sprRobotB({ ojos: 'feliz', ang: -.4 }), x: 292, y: 204 });
  O.push({ s: sprRelojPie(), x: 362, y: 220 });
  // piso 2: estudio (libros, escritorio) y sala del órgano
  O.push({ s: sprEstante(), x: 70, y: 148 }); O.push({ s: sprEstante(), x: 102, y: 148 }); O.push({ s: sprChimenea(), x: 150, y: 148 }); O.push({ s: sprCandelabro(), x: 182, y: 132 });
  O.push({ s: sprOrgano(), x: 290, y: 148 }); O.push({ s: sprCuadro('#ffd9a8'), x: 236, y: 112 });
  // ático
  O.push({ s: sprCofre('cerrado'), x: 170, y: 80 }); O.push({ s: sprArpa(), x: 250, y: 80 }); O.push({ s: sprBarril(), x: 268, y: 80 });
  O.forEach(o => sprK(ctx, o.s, o.x * K3, o.y * K3, K3));
  postHD(ctx, { base: 'contrast(1.08) saturate(1.15)', bloom: .3, polvo: 40, vin: .55, calidoA: .45, frioA: .35, semilla: 12,
    luces: [{ x: 180 * K3, y: 190 * K3, r: 90 * K3, c: 'rgba(255,200,120,.45)', modo: 'soft-light' }, { x: 182 * K3, y: 186 * K3, r: 50, c: 'rgba(255,210,130,.8)' }, { x: 182 * K3, y: 122 * K3, r: 50, c: 'rgba(255,210,130,.8)' }, { x: 150 * K3, y: 140 * K3, r: 120, c: 'rgba(255,150,60,.55)' }] });
};
// ---------- 12 · interior cenital (RPG) ----------
ESCENAS['i-cenital'] = ctx => {
  const R = rng(61);
  const c = pix(LW, LH, g => {
    g.R(0, 0, LW, LH, '#2a1a3a');
    tapiz(g, 40, 6, 347, 62, '#f3d9b0', '#e8c896'); tablas(g, 40, 68, 347, 166);
    g.R(34, 0, 6, 240, '#6e4426'); g.R(387, 0, 6, 240, '#6e4426'); g.R(34, 234, 359, 6, '#6e4426'); g.R(196, 234, 36, 6, '#c98a52');
  });
  subir(ctx, c, K3);
  const alf = sprAlfombra(150, 70); sprK(ctx, alf, 140 * K3, 120 * K3, K3);
  const O = [];
  [[80, 60], [348, 60]].forEach(([x, y]) => O.push({ s: sprVentanal(), x, y }));
  O.push({ s: sprOrgano(), x: 214, y: 68 }); O.push({ s: sprEstante(), x: 130, y: 66 }); O.push({ s: sprEstante(), x: 300, y: 66 }); O.push({ s: sprRelojPie(), x: 372, y: 100 });
  O.push({ s: sprClavecin(), x: 100, y: 150 }); O.push({ s: sprBach({ cara: 'feliz' }), x: 214, y: 156 }); O.push({ s: sprAtril(), x: 250, y: 150 }); O.push({ s: sprAtril(), x: 178, y: 150 });
  O.push({ s: sprCandelabro(), x: 60, y: 110 }); O.push({ s: sprChimenea(), x: 340, y: 168 });
  O.push({ s: sprSarah({}), x: 196, y: 224 }); O.push({ s: sprDavid({}), x: 226, y: 224 }); O.push({ s: sprRobotB({ ojos: 'feliz', ang: .4 }), x: 258, y: 210 }); O.push({ s: sprSanson({}), x: 130, y: 220 });
  O.push({ s: sprArbol(0, .8), x: 60, y: 228 }); O.push({ s: sprCofre('cerrado'), x: 360, y: 226 });
  O.sort((a, b) => a.y - b.y);
  sombras(ctx, O.map(o => ({ x: o.x * K3 + 8, y: o.y * K3, rx: o.s.width * K3 * .45, ry: 10, a: .3 })), 6);
  O.forEach(o => sprK(ctx, o.s, o.x * K3, o.y * K3, K3));
  postHD(ctx, { base: 'contrast(1.08) saturate(1.12)', bloom: .28, polvo: 50, vin: .6, calidoA: .5, frioA: .3, semilla: 13, tilt: [.12, .06], blur: 3,
    rayos: [{ x: 240, y: 60, ang: -.35, ancho: 70, largo: 520, c: 'rgba(255,230,170,.3)' }, { x: 1044, y: 60, ang: .35, ancho: 70, largo: 520, c: 'rgba(255,230,170,.3)' }],
    luces: [{ x: 180, y: 300, r: 70, c: 'rgba(255,210,130,.8)' }, { x: 1020, y: 470, r: 140, c: 'rgba(255,140,60,.6)' }, { x: 640, y: 420, r: 360, c: 'rgba(255,210,150,.45)', modo: 'soft-light' }] });
};
// ---------- 13 · cuarto isométrico ----------
ESCENAS['i-iso'] = ctx => {
  const R = rng(71); ISO_T = 12;
  const c = pix(LW, LH, (g, x) => {
    const gr = x.createLinearGradient(0, 0, 0, LH); gr.addColorStop(0, '#2c2252'); gr.addColorStop(1, '#4a3a7a'); x.fillStyle = gr; x.fillRect(0, 0, LW, LH);
    const cx = 213, cy = 70, t = ISO_T, N = 10, hw = 70;
    // paredes: izquierda (a lo largo de j en i=0) y derecha (a lo largo de i en j=0)
    for (let j = 0; j < N; j++) { const a = isoP(cx, cy, 0, j, t), b = isoP(cx, cy, 0, j + 1, t); for (let xx = Math.round(b[0]); xx <= Math.round(a[0]); xx++) { const k = (a[0] - xx) / (a[0] - b[0]), yb = a[1] + (b[1] - a[1]) * k; g.R(xx, Math.round(yb - hw), 1, hw, (j % 2) ? '#f3d9b0' : '#ecd0a2'); g.R(xx, Math.round(yb - 6), 1, 6, '#9a6038'); } }
    for (let i = 0; i < N; i++) { const a = isoP(cx, cy, i, 0, t), b = isoP(cx, cy, i + 1, 0, t); for (let xx = Math.round(a[0]); xx <= Math.round(b[0]); xx++) { const k = (xx - a[0]) / (b[0] - a[0]), yb = a[1] + (b[1] - a[1]) * k; g.R(xx, Math.round(yb - hw), 1, hw, (i % 2) ? '#e0c294' : '#d6b888'); g.R(xx, Math.round(yb - 6), 1, 6, '#7a4a2a'); } }
    const top = isoP(cx, cy, 0, 0, t); g.R(Math.round(top[0]), Math.round(top[1]) - hw, 1, hw, '#b89a6a');
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { const [px, py] = isoP(cx, cy, i, j, t); const alf = i >= 3 && i <= 7 && j >= 3 && j <= 7; isoTile(g, Math.round(px), Math.round(py), t, alf ? ((i + j) % 2 ? '#c8324a' : '#d8a04a') : ((i + j) % 2 ? '#c98a52' : '#b87a46')); }
    // grosor del piso
    for (let k = 0; k < 10; k++) { const L = isoP(cx, cy, 0, N, t), Rr = isoP(cx, cy, N, 0, t), B = isoP(cx, cy, N, N, t); g.line(Math.round(L[0]), Math.round(L[1] + t + k), Math.round(B[0]), Math.round(B[1] + t + k), '#6e4426', 1); g.line(Math.round(B[0]), Math.round(B[1] + t + k), Math.round(Rr[0]), Math.round(Rr[1] + t + k), '#4e2e16', 1); }
    // ventanas en las paredes
    [[0, 2.5], [0, 7]].forEach(([i, j]) => { const p = isoP(cx, cy, i, j, t); spr(g, sprVentanal(), Math.round(p[0]) - 2, Math.round(p[1]) - 22); });
    const pp = isoP(cx, cy, 5, 0, t); spr(g, sprOrgano(), Math.round(pp[0]) + 4, Math.round(pp[1]) + 2);
    const es = isoP(cx, cy, 8.6, 0, t); spr(g, sprEstante(), Math.round(es[0]), Math.round(es[1]) + 2);
    const cu = isoP(cx, cy, 0, 5, t); spr(g, sprCuadro(), Math.round(cu[0]), Math.round(cu[1]) - 30);
    const put = (s, i, j, dy = 0) => { const p = isoP(cx, cy, i, j, t); spr(g, s, Math.round(p[0]), Math.round(p[1]) + t + dy); };
    put(sprClavecin(), 2, 3.5); put(sprBach({ cara: 'feliz' }), 3.6, 2.4); put(sprAtril(), 6.2, 3); put(sprCandelabro(), 1, 1); put(sprRelojPie(), 9, 1.4);
    put(sprSarah({}), 6, 7); put(sprDavid({ eyes: 'happy' }), 7.4, 6); put(sprRobotB({ ojos: 'feliz', ang: -.35 }), 8.4, 4.6, -12); put(sprCofre('cerrado'), 2, 8.6); put(sprArbol(0, .8), 1, 9);
  });
  subir(ctx, c, K3);
  postHD(ctx, { bloom: .28, calidoA: .45, frioA: .3, vin: .5, polvo: 40, semilla: 14, luces: [{ x: 640, y: 380, r: 380, c: 'rgba(255,205,140,.5)', modo: 'soft-light' }, { x: 300, y: 300, r: 90, c: 'rgba(255,210,130,.6)' }] });
};
