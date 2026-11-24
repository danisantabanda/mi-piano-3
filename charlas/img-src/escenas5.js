// =====================================================================
//  Lugares de la historia (5, 7, 14) y pantallas restantes (20–22, 26, 28–30, 33–35)
// =====================================================================
// ---------- hitos de cada época (píxel) ----------
function sprAbadia() { return cache('abadia', () => sprite(60, 56, g => {
  const P = '#d8cdb8', P2 = '#b7aa92', P3 = '#efe6d4', T = '#8a3a2e';
  g.R(4, 26, 40, 30, P); g.R(4, 26, 40, 2, P3); g.R(40, 28, 4, 28, P2); for (let y = 0; y < 12; y++) g.R(4 + y * 1.6, 14 + y, 40 - y * 3.2, 1, y % 2 ? T : '#a84a3a');
  [10, 22, 34].forEach(x => { g.R(x, 34, 5, 10, '#3a2a4a'); g.R(x + 1, 32, 3, 2, '#3a2a4a'); });
  g.R(42, 6, 16, 50, P); g.R(42, 6, 16, 2, P3); g.R(54, 8, 4, 48, P2); for (let y = 0; y < 8; y++) g.R(42 + y, y - 2, 16 - y * 2, 1, T);
  g.R(47, 14, 5, 8, '#3a2a4a'); g.R(48, 12, 3, 2, '#3a2a4a'); g.R(48, 26, 4, 6, '#3a2a4a'); g.R(49, -6, 1, 5, TC.oro); g.R(47, -4, 5, 1, TC.oro);
  g.R(20, 44, 8, 12, '#6e4426'); g.R(21, 42, 6, 2, '#6e4426');
}, { ax: 30, ay: 56 })); }
function sprCastillo() { return cache('castillo', () => sprite(64, 50, g => {
  const P = '#f1ead8', P2 = '#d4c8ae', T = '#8a7a9b';
  for (let y = 0; y < 12; y++) g.R(0 + y * 2, 38 + y, 64 - y * 4, 1, '#7fc96a');
  g.R(4, 18, 56, 22, P); g.R(56, 18, 4, 22, P2); for (let x = 4; x < 60; x += 6) g.R(x, 15, 4, 3, P);
  g.R(10, 4, 14, 36, P); g.R(22, 4, 2, 36, P2); for (let x = 10; x < 24; x += 4) g.R(x, 1, 3, 3, P); g.R(36, 8, 12, 32, P); for (let x = 36; x < 48; x += 4) g.R(x, 5, 3, 3, P);
  for (let y = 0; y < 6; y++) g.R(40 + y * .5, -6 + y, 4 - y, 1, '#c0533f');
  [[14, 12], [14, 24], [40, 16], [40, 28], [30, 26], [50, 26]].forEach(([x, y]) => g.R(x, y, 3, 5, '#3a2a4a'));
  g.R(28, 30, 6, 10, '#6e4426');
}, { ax: 32, ay: 50 })); }
function sprTaller() { return cache('taller', () => sprite(60, 50, g => {
  const P = '#f0d8b0', P2 = '#d8b88a', T = '#c0533f';
  g.R(2, 22, 56, 28, P); g.R(54, 22, 4, 28, P2); g.R(0, 18, 60, 4, T); g.R(0, 18, 60, 1, '#de7a5a');
  // cúpula florentina
  for (let y = 0; y < 16; y++) { const half = Math.round(12 * Math.sin((y + 2) / 18 * Math.PI / 2)); g.R(30 - half, 2 + y, half * 2, 1, y % 3 ? T : '#9a3a2e'); } g.R(29, -4, 3, 6, '#fff6e6'); g.R(30, -7, 1, 3, TC.oro);
  [8, 20, 40, 50].forEach(x => { g.R(x, 28, 5, 8, '#3a2a4a'); g.R(x - 1, 27, 7, 1, '#fff6e6'); });
  g.R(24, 34, 12, 16, '#6e4426'); g.R(25, 35, 10, 14, '#8a5a34');
  // un pianoforte en la puerta (la tapa de un instrumento)
  g.R(-2, 42, 18, 6, '#7a3a2a'); g.R(0, 40, 14, 2, '#fffaf2'); for (let k = 0; k < 7; k++) if (k % 2) g.R(k * 2, 40, 1, 1, INK);
}, { ax: 30, ay: 50 })); }
function sprBahareque() { return cache('bahareque', () => sprite(64, 48, g => {
  const P = '#fffaf2', P2 = '#e6ddd0', T = '#c0533f', M = '#7a4a2a';
  for (let y = 0; y < 12; y++) g.R(-2 + y * 1.5, 8 + y, 68 - y * 3, 1, y % 2 ? T : '#de7a5a'); g.R(-4, 19, 72, 2, '#9a3a2e');
  g.R(2, 21, 60, 27, P); g.R(58, 21, 4, 27, P2); g.R(2, 40, 60, 8, '#5a9a4a'); g.R(2, 40, 60, 1, '#7fc96a');   // zócalo verde
  g.R(6, 26, 10, 12, '#2f7d5a'); g.R(7, 27, 8, 10, '#3fae7a'); g.R(46, 26, 10, 12, '#2f7d5a'); g.R(47, 27, 8, 10, '#3fae7a'); g.R(26, 26, 12, 22, M); g.R(27, 27, 10, 21, '#9a6038');
  // balcón de madera
  g.R(0, 22, 64, 2, M); for (let x = 1; x < 64; x += 3) g.R(x, 24, 1, 2, M);
  g.R(10, 4, 3, 6, '#b8a48e');
}, { ax: 32, ay: 48 })); }
function sprCasaHungara() { return cache('hungara', () => sprite(60, 46, g => {
  const P = '#fffaf2', P2 = '#e6ddd0', T = '#d8b45a', T2 = '#b8923a';
  for (let y = 0; y < 18; y++) g.R(6 + y * .6, 4 + y, 48 - y * 1.2, 1, y % 3 ? T : T2); for (let y = 0; y < 18; y++) g.R(6 - y * .6, 4 + y, 6, 1, T2);
  g.R(4, 22, 52, 24, P); g.R(52, 22, 4, 24, P2);
  // flores pintadas (arte popular)
  [[10, 28, NC.DO], [46, 28, NC.LA], [28, 26, NC.DO]].forEach(([x, y, c]) => { g.disc(x, y, 2, c); g.px(x - 3, y, NC.FA); g.px(x + 3, y, NC.FA); g.px(x, y + 3, NC.FA); });
  g.R(16, 30, 7, 8, '#2c5bb8'); g.R(17, 31, 5, 6, '#9fd8ff'); g.R(38, 30, 7, 8, '#2c5bb8'); g.R(39, 31, 5, 6, '#9fd8ff'); g.R(26, 32, 8, 14, '#6e4426');
  g.R(0, 44, 60, 2, '#c9a372');
}, { ax: 30, ay: 46 })); }
// compositores (adultos genéricos)
const COMPOSITORES = {
  guido: () => adulto({ id: 'guido', ropa: '#7a5a3a', saco: '#5a3a24', pantalon: '#5a3a24', pelo: '#c9b59a', pelo2: '#e2d8ca', extra: g => { g.R(6, 0, 14, 4, '#5a3a24'); g.R(10, 26, 6, 2, '#e8d6b0'); g.R(18, 18, 6, 8, '#fff1d6'); g.R(19, 20, 4, 1, INK); g.R(19, 22, 4, 1, INK); } }),
  cristofori: () => adulto({ id: 'cristo', ropa: '#fff6e6', saco: '#8a5a34', pantalon: '#5a3a24', pelo: '#3a2418', extra: g => { g.R(8, 18, 10, 12, '#c9a372'); g.R(19, 24, 6, 2, '#a0a8b8'); } }),
  morales: () => adulto({ id: 'morales', barba: true, ropa: '#fffaf2', saco: '#3a3a52', pantalon: '#3a3a52', pelo: '#2a1810', piel: '#d9a07a', piel2: '#b8805a', extra: g => { g.ell(19, 26, 5, 4, '#c98a52'); g.R(14, 16, 2, 10, '#7a4a2a'); g.R(13, 14, 4, 2, '#5a3418'); } }),
  bartok: () => adulto({ id: 'bartok', ropa: '#fffaf2', saco: '#2a2a3a', pantalon: '#2a2a3a', pelo: '#e2d8ca', pelo2: '#fffaf4', extra: g => { g.R(12, 16, 2, 3, '#a3243a'); } }),
};

// ---------- 5 · islas, una por unidad ----------
ESCENAS['w-islas'] = ctx => {
  const R = rng(55);
  const islas = [[70, 80, sprAbadia, '#9be07a'], [190, 60, () => sprIglesiaMini(), '#9be07a'], [320, 85, sprCastillo, '#b9e6a8'], [100, 180, sprTaller, '#c9e8a0'], [235, 175, sprBahareque, '#7fd06a'], [360, 185, sprCasaHungara, '#b9e6a8']];
  const c = pix(LW, LH, g => {
    agua(g, 0, 0, LW, LH, R);
    // rutas punteadas entre islas
    for (let i = 0; i < islas.length - 1; i++) { const [a, b] = islas[i], [c2, d] = islas[i + 1]; const n = Math.hypot(c2 - a, d - b) / 6; for (let k = 1; k < n; k++) { const t = k / n; if (k % 2) g.R(Math.round(a + (c2 - a) * t), Math.round(b + 16 + (d - b) * t), 2, 2, '#fffaf2'); } }
    islas.forEach(([x, y, , col], i) => { g.ell(x, y + 14, 46, 18, '#e0c08e'); g.ell(x, y + 12, 44, 16, '#f0d8a8'); g.ell(x, y + 9, 40, 14, col); g.ell(x - 8, y + 6, 22, 7, mezcla(col, '#fff', .25)); for (let k = 0; k < 10; k++) g.px(x - 30 + Math.floor(R() * 60), y + 4 + Math.floor(R() * 12), [NC.DO, NC.MI, '#fff'][k % 3]); });
  });
  subir(ctx, c, K3);
  const sh = islas.map(([x, y]) => ({ x: x * K3 + 20, y: (y + 24) * K3, rx: 150, ry: 30, a: .25 })); sombras(ctx, sh, 12);
  islas.forEach(([x, y, f], i) => { sprK(ctx, f(), x * K3, (y + 12) * K3, K3); });
  // barco con Sarah, David y el robot
  const barco = pix(40, 22, g => { g.R(4, 12, 32, 6, '#9a6038'); g.R(2, 10, 36, 2, '#c98a52'); g.R(8, 18, 24, 2, '#7a4a2a'); g.R(19, 0, 2, 12, '#7a4a2a'); for (let y = 0; y < 9; y++) g.R(21, 1 + y, 9 - y, 1, '#fffaf2'); g.R(21, 1, 6, 1, NC.DO); });
  sprK(ctx, Object.assign(barco, { ax: 20, ay: 22 }), 290 * K3, 140 * K3, K3);
  sprK(ctx, sprSarah({}), 284 * K3, 132 * K3, 2); sprK(ctx, sprDavid({}), 298 * K3, 132 * K3, 2); sprK(ctx, sprRobotB({ ojos: 'feliz' }), 312 * K3, 118 * K3, 2);
  postHD(ctx, { bloom: .25, vin: .45, calidoA: .45, frioA: .35, polvo: 30, semilla: 5, tilt: [.12, .12], blur: 3, luces: [{ x: 640, y: 360, r: 500, c: 'rgba(255,215,150,.35)', modo: 'soft-light' }] });
  // número de unidad en cada isla
  islas.forEach(([x, y], i) => marcador(ctx, x * K3 + 110, (y - 30) * K3, i + 1, i < 2 ? 'hecho' : i === 2 ? 'hoy' : 'futuro'));
};
function sprIglesiaMini() { return cache('iglMini', () => { const s = sprIglesia({}), c = lienzo(Math.ceil(s.width / 2), Math.ceil(s.height / 2)), x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(s, 0, 0, c.width, c.height); c.ax = c.width / 2; c.ay = c.height; return c; }); }

// ---------- 7 · libro-mapa pop-up de pergamino ----------
ESCENAS['w-libro'] = ctx => {
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#5a3a2a'], [1, '#2e1a10']]); ctx.fillRect(0, 0, W, H);
  for (let x = 0; x < W; x += 90) { ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fillRect(x, 0, 4, H); }
  // el libro abierto
  const L = (x0, sign) => { ctx.beginPath(); ctx.moveTo(640, 250); ctx.quadraticCurveTo(640 + sign * 300, 210, 640 + sign * 580, 236); ctx.lineTo(640 + sign * 600, 640); ctx.quadraticCurveTo(640 + sign * 300, 610, 640, 660); ctx.closePath(); };
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; ctx.fillStyle = '#7a1f3d'; rr(ctx, 30, 220, 1220, 460, 26); ctx.fill(); ctx.restore();
  [-1, 1].forEach(sg => { L(0, sg); ctx.fillStyle = lg(ctx, 640, 0, 640 + sg * 600, 0, [[0, '#d9c08a'], [.08, '#f3e3b8'], [1, '#ead39c']]); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#8a6a3a'; ctx.stroke(); });
  // tinta: mapa dibujado en las páginas
  ctx.save(); ctx.strokeStyle = 'rgba(110,70,30,.55)'; ctx.lineWidth = 3; ctx.setLineDash([12, 10]);
  ctx.beginPath(); ctx.moveTo(150, 560); ctx.bezierCurveTo(300, 450, 420, 600, 560, 500); ctx.bezierCurveTo(700, 420, 800, 600, 960, 520); ctx.bezierCurveTo(1060, 470, 1100, 560, 1160, 470); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(110, 400); ctx.bezierCurveTo(200, 330, 330, 360, 420, 330); ctx.stroke(); ctx.beginPath(); ctx.moveTo(860, 330); ctx.bezierCurveTo(960, 300, 1080, 340, 1180, 320); ctx.stroke();
  for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.arc(160 + i * 70, 600 + Math.sin(i) * 12, 8, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
  // rosa de los vientos
  ctx.translate(1120, 590); for (let i = 0; i < 8; i++) { ctx.rotate(Math.PI / 4); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(8, -(i % 2 ? 26 : 44)); ctx.lineTo(-8, -(i % 2 ? 26 : 44)); ctx.closePath(); ctx.fillStyle = i % 2 ? 'rgba(110,70,30,.35)' : 'rgba(160,40,40,.6)'; ctx.fill(); }
  ctx.restore();
  // figuras de papel que se levantan (pop-up): sombra, base doblada y la figura
  const pop = (s, x, y, k) => { blando(ctx, () => elip(ctx, x + 40, y + 6, s.width * k * .45, 16, '#000'), 10, 'rgba(60,30,10,.35)'); const t = teñido(s, '#f8edd2'); sprK(ctx, t, x + 6, y + 4, k, { alpha: .9 }); sprK(ctx, s, x, y, k); ctx.fillStyle = 'rgba(140,100,50,.35)'; ctx.fillRect(x - s.width * k * .42, y - 2, s.width * k * .84, 6); };
  pop(sprAbadia(), 220, 470, 2.6); pop(sprIglesiaMini(), 470, 420, 2.2); pop(sprCastillo(), 830, 410, 2.6); pop(sprTaller(), 1010, 470, 2.4); pop(sprBahareque(), 330, 640, 2.4); pop(sprCasaHungara(), 760, 640, 2.4);
  // Bach de papel señalando, y los niños
  pop(sprBach({ cara: 'feliz' }), 600, 560, 2.6); pop(sprSarah({}), 980, 650, 3); pop(sprDavid({}), 1080, 650, 3);
  // cinta marcapáginas
  ctx.fillStyle = '#c8324a'; ctx.beginPath(); ctx.moveTo(620, 230); ctx.lineTo(660, 230); ctx.lineTo(660, 300); ctx.lineTo(640, 285); ctx.lineTo(620, 300); ctx.fill();
  postHD(ctx, { bloom: .2, vin: .55, calidoA: .55, frioA: .2, polvo: 50, semilla: 7, luces: [{ x: 640, y: 380, r: 520, c: 'rgba(255,215,150,.45)', modo: 'soft-light' }], rayos: [{ x: 300, y: -80, ang: -.35, ancho: 160, largo: 900 }] });
};

// ---------- 14 · tira de 6 épocas ----------
ESCENAS['a-epocas'] = ctx => {
  ctx.fillStyle = '#1c1030'; ctx.fillRect(0, 0, W, H);
  const V = [
    { cielo: ['#7fa8d8', '#e8d8b8'], hito: sprAbadia, quien: COMPOSITORES.guido, suelo: '#7fc96a' },
    { cielo: ['#8fd3ff', '#ffe2c4'], hito: sprIglesiaMini, quien: () => sprBach({ cara: 'feliz' }), suelo: TC.piedra },
    { cielo: ['#b8a0ff', '#ffd9e8'], hito: sprCastillo, quien: () => sprMozart({}), suelo: '#9fd38a' },
    { cielo: ['#ffb88a', '#ffe8c4'], hito: sprTaller, quien: COMPOSITORES.cristofori, suelo: '#d8b88a' },
    { cielo: ['#7fd0ff', '#d8f6ff'], hito: sprBahareque, quien: COMPOSITORES.morales, suelo: '#5fbf5a', andes: true },
    { cielo: ['#ffd27a', '#fff2c8'], hito: sprCasaHungara, quien: COMPOSITORES.bartok, suelo: '#b9e6a8' },
  ];
  const w = 196, gap = 12, x0 = (W - (w * 6 + gap * 5)) / 2, y0 = 70, h = 580;
  V.forEach((v, i) => {
    const x = x0 + i * (w + gap), lw = Math.ceil(w / 3), lh = Math.ceil(h / 3);
    const c = pix(lw, lh, (g, cx) => {
      const gr = cx.createLinearGradient(0, 0, 0, lh); gr.addColorStop(0, v.cielo[0]); gr.addColorStop(1, v.cielo[1]); cx.fillStyle = gr; cx.fillRect(0, 0, lw, lh);
      if (v.andes) { for (let k = 0; k < 3; k++) { const mx = 10 + k * 24, s = 22 + k * 4; for (let y = 0; y < s; y++) g.R(mx - y, lh - 70 - s + y, y * 2 + 1, 1, k % 2 ? '#6fa86a' : '#5a9a5a'); } g.R(54, lh - 96, 2, 26, '#7a4a2a'); g.disc(55, lh - 98, 6, '#3fae5a'); }
      else for (let k = 0; k < 4; k++) g.disc(10 + k * 20, lh - 70, 12, mezcla(v.cielo[1], '#7a6aa8', .25));
      g.R(0, lh - 66, lw, 66, v.suelo); g.R(0, lh - 66, lw, 2, mezcla(v.suelo, '#fff', .3));
      spr(g, v.hito(), Math.round(lw / 2), lh - 62); spr(g, v.quien(), Math.round(lw / 2) + 6, lh - 18);
    });
    ctx.save(); rr(ctx, x, y0, w, h, 18); ctx.clip(); const tmp = canvas(W, H), tx = tmp.getContext('2d'); subir(tx, c, 3); postHD(tx, { bloom: .2, vin: .35, calidoA: .4, frioA: .3, polvo: 8, semilla: i + 1 }); ctx.drawImage(tmp, 0, 0, lw * 3, lh * 3, x, y0, lw * 3, lh * 3); ctx.restore();
    ctx.save(); rr(ctx, x, y0, w, h, 18); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
    // una notita de su color y su número
    marcador(ctx, x + w / 2, y0 - 6 + 30, i + 1, 'neutro');
  });
  // la línea del tiempo debajo
  ctx.save(); ctx.strokeStyle = '#ffd046'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, 690); ctx.lineTo(W - x0, 690); ctx.stroke(); ctx.restore();
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(x0 + w / 2 + i * (w + gap), 690, 10, 0, 7); ctx.fillStyle = COL5[i % 5]; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
};

// ---------- 20 · inicio: «¿Quién toca hoy?» ----------
ESCENAS['sc-inicio'] = ctx => {
  const m = mundoHD(x => { const P = puebloLeipzig({ noche: true }); pintarPueblo(x, P, 'hd2d'); }, { atardecer: ['#ffd9b0', '#b8a0c8', '#4a3a7a'], bloom: .4, bloomF: 'blur(10px) brightness(.85) contrast(2) saturate(1.5)', vin: .5, polvo: 50, semilla: 20 });
  ctx.filter = 'blur(6px)'; ctx.drawImage(m, 0, 0); ctx.filter = 'none'; ctx.fillStyle = 'rgba(28,16,48,.45)'; ctx.fillRect(0, 0, W, H);
  texto(ctx, '¿Quién toca hoy?', 640, 64, { tam: 52, c: '#fff8ec', borde: 10 });
  const carta = (x, y, w, h, s, k, nombre, c, grande) => {
    ctx.save(); ctx.shadowColor = grande ? c : 'rgba(0,0,0,.4)'; ctx.shadowBlur = grande ? 30 : 14; rr(ctx, x, y, w, h, 22); ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, mezcla(c, '#fff', .55)], [1, mezcla(c, '#2a1a3a', .15)]]); ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, x, y, w, h, 22); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
    elip(ctx, x + w / 2, y + h - 58, w * .32, 12, 'rgba(42,26,58,.25)'); sprK(ctx, s, x + w / 2, y + h - 56, k);
    ctx.save(); rr(ctx, x + 10, y + h - 46, w - 20, 36, 18); ctx.fillStyle = 'rgba(38,23,63,.9)'; ctx.fill(); ctx.restore(); texto(ctx, nombre, x + w / 2, y + h - 27, { tam: grande ? 26 : 20 });
  };
  carta(250, 110, 360, 340, sprSarah({ eyes: 'happy' }), 7, 'Sarah', NC.DO, true); carta(670, 110, 360, 340, sprDavid({ eyes: 'happy' }), 7, 'David', NC.SOL, true);
  const otros = [[PAPA(), 'Papá', NC.LA, 4.4], [MAMA(), 'Mamá', NC.RE, 4.4]].concat(['Nina', 'Josué', 'Noah', 'Samuel', 'Isaac', 'Annie'].map((n, i) => [PRIMOS[n](), n, COL5[i % 5], 4.6]));
  otros.forEach(([s, n, c, k], i) => carta(52 + i * 147, 480, 136, 220, s, k * .9, n, c, false));
};
// ---------- 21 · salón A: Bach a la izquierda, tarjeta de concepto, teclado grande ----------
function fondoSalon() { return mundoHD(x => { const c = pix(LW, LH, g => { tapiz(g, 0, 0, LW, 150, '#f3d9b0', '#e8c896'); tablas(g, 0, 150, LW, 90); }); subir(x, c, 3); sprK(x, sprOrgano(), 640, 450, 5); sprK(x, sprVentanal(), 170, 380, 4); sprK(x, sprVentanal(), 1110, 380, 4); sprK(x, sprEstante(), 340, 450, 4); sprK(x, sprEstante(), 940, 450, 4); }, { bloom: .3, vin: .5, calidoA: .55, frioA: .3, polvo: 50, semilla: 21, rayos: [{ x: 160, y: 140, ang: -.4, ancho: 80, largo: 600 }, { x: 1120, y: 140, ang: .4, ancho: 80, largo: 600 }] }); }
ESCENAS['sc-salon-a'] = ctx => {
  const f = fondoSalon(); ctx.filter = 'blur(3px)'; ctx.drawImage(f, 0, 0); ctx.filter = 'none';
  sombras(ctx, [{ x: 205, y: 500, rx: 100, ry: 18 }], 8); sprK(ctx, sprBach({ cara: 'feliz' }), 205, 500, 6);
  // tarjeta de concepto: la blanca = taaan
  panel(ctx, 430, 70, 520, 400, { fondo: lg(ctx, 0, 70, 0, 470, [[0, '#fffaf0'], [1, '#f3e6cc']]), r: 30, brillo: false, lw: 6 });
  ctx.fillStyle = NC.FA; rr(ctx, 460, 96, 460, 14, 7); ctx.fill();
  cabeza(ctx, 600, 330, 36, 'blanca', null); ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(600 + 36 * .6, 330 - 5); ctx.lineTo(600 + 36 * .6, 330 - 130); ctx.stroke(); ctx.restore();
  texto(ctx, 'la blanca', 790, 220, { tam: 44, c: INK }); texto(ctx, 'taaan', 790, 300, { tam: 62, c: NC.FA, borde: 8 });
  // dos pulsos: la blanca dura dos
  for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.arc(740 + i * 60, 380, 16, 0, 7); ctx.fillStyle = '#ffd046'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.save(); ctx.strokeStyle = NC.FA; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(720, 412); ctx.lineTo(860, 412); ctx.stroke(); ctx.restore();
  sprK(ctx, sprRobotB({ ojos: 'feliz', ang: .4 }), 1090, 430, 4);
  teclado(ctx, 64, 520, W - 128, 186, { blancas: 14, luces: { 5: NC.FA }, colores: true });
  botonPausa(ctx, W - 50, 46);
};
// ---------- 22 · salón B: pizarra grande al centro, Bach pequeño en una esquina ----------
ESCENAS['sc-salon-b'] = ctx => {
  const f = fondoSalon(); ctx.filter = 'blur(4px)'; ctx.drawImage(f, 0, 0); ctx.filter = 'none';
  // pizarra con marco de madera
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24; rr(ctx, 120, 40, 1040, 460, 20); ctx.fillStyle = '#8a5a34'; ctx.fill(); ctx.restore();
  rr(ctx, 140, 60, 1000, 420, 12); ctx.fillStyle = lg(ctx, 0, 60, 0, 480, [[0, '#2f5a4a'], [1, '#1f3f34']]); ctx.fill();
  ctx.save(); ctx.globalAlpha = .12; ctx.fillStyle = '#fff'; for (let i = 0; i < 40; i++) ctx.fillRect(160 + (i * 97) % 960, 80 + (i * 53) % 380, 60, 2); ctx.restore();
  const tiza = 'rgba(246,244,236,.95)';
  pentagrama(ctx, 200, 170, 880, 34, [{ n: 'C4', f: 'redonda', c: true, x: 420 }, { n: 'E4', f: 'blanca', c: true, x: 580 }, { n: 'G4', f: 'negra', c: true, x: 720 }, { n: 'G4', f: 'negra', c: true, x: 820 }, { n: 'C5', f: 'redonda', c: true, x: 980 }], { lineaC: tiza, metrica: ['4', '4'], compases: [520, 900] });
  texto(ctx, 'DO', 420, 420, { tam: 36, c: NC.DO }); texto(ctx, 'MI', 580, 420, { tam: 36, c: NC.MI }); texto(ctx, 'SOL', 770, 420, { tam: 36, c: NC.SOL }); texto(ctx, 'DO', 980, 420, { tam: 36, c: NC.DO });
  ctx.fillStyle = '#fffaf2'; rr(ctx, 1000, 486, 50, 12, 4); ctx.fill();
  sprK(ctx, sprBach({ cara: 'feliz' }), 1190, 560, 3.4); sprK(ctx, sprRobotB({ ojos: 'feliz' }), 90, 560, 3);
  teclado(ctx, 64, 586, W - 128, 120, { blancas: 14, luces: { 0: NC.DO, 4: NC.MI, 7: NC.SOL, 12: NC.DO }, colores: true });
  botonPausa(ctx, W - 50, 46);
};
// ---------- 26 · tarjeta grande con una nota en el gran pentagrama ----------
ESCENAS['sc-tarjetas'] = ctx => {
  const f = fondoSalon(); ctx.filter = 'blur(8px)'; ctx.drawImage(f, 0, 0); ctx.filter = 'none'; ctx.fillStyle = 'rgba(28,16,48,.35)'; ctx.fillRect(0, 0, W, H);
  // mazo detrás
  [[-.08, 30], [.06, 16]].forEach(([a, d]) => { ctx.save(); ctx.translate(640, 300); ctx.rotate(a); panel(ctx, -250 + d, -250 + d / 2, 500, 470, { fondo: '#e8dcc4', r: 30 }); ctx.restore(); });
  panel(ctx, 390, 40, 500, 480, { fondo: lg(ctx, 0, 40, 0, 520, [[0, '#fffaf0'], [1, '#f3e6cc']]), r: 30, lw: 6, brillo: false });
  granPentagrama(ctx, 500, 110, 340, 24, [{ n: 'C4', f: 'redonda', c: true, x: 700, halo: 'rgba(255,90,90,.6)' }], [], {});
  texto(ctx, '?', 800, 470, { tam: 46, c: '#b8aac8' });
  ctx.fillStyle = NC.DO; rr(ctx, 420, 64, 440, 12, 6); ctx.fill();
  sprK(ctx, sprRobotB({ ojos: 'abierto', ang: .3 }), 1080, 470, 4); sprK(ctx, sprSarah({}), 200, 520, 5);
  teclado(ctx, 64, 586, W - 128, 120, { blancas: 14, luces: {}, colores: true });
  botonPausa(ctx, W - 50, 46);
};
// ---------- 28 · eco: el robot canta, teclas sin luces, «tu turno» ----------
ESCENAS['sc-eco'] = ctx => {
  const m = mundoHD(x => { const c = calleLateral({ h: 190, w: LW, desp: 10, cielo1: '#a8c8ff', cielo2: '#ffe2f0' }); subir(x, c, 3); sprK(x, sprSarah({}), 300, 520, 4); sprK(x, sprDavid({}), 390, 520, 4); }, { bloom: .25, vin: .3, polvo: 25, semilla: 28, tilt: [.15, 0], blur: 3 });
  ctx.drawImage(m, 0, 0); ctx.fillStyle = '#1c1030'; ctx.fillRect(0, 560, W, 160);
  sprK(ctx, sprRobotB({ ojos: 'feliz', boca: 'canta', ang: -.3 }), 720, 430, 6);
  // notas que salen cantando (las del eco: SOL MI · SOL MI LA)
  [['♪', 840, 220, NC.SOL, 70], ['♪', 930, 170, NC.MI, 64], ['♫', 1030, 130, NC.SOL, 70], ['♪', 1120, 100, NC.LA, 60]].forEach(([t, x, y, c, s]) => texto(ctx, t, x, y, { tam: s, c, fuente: 'FreeSerif', borde: 6 }));
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(760, 330, 40 + i * 22, -1, -.2); ctx.stroke(); } ctx.restore();
  // «tu turno»: el globo apunta al teclado
  ctx.save(); rr(ctx, 470, 440, 340, 92, 46); ctx.fillStyle = '#ffd046'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.moveTo(620, 530); ctx.lineTo(640, 566); ctx.lineTo(660, 530); ctx.fillStyle = '#ffd046'; ctx.fill(); ctx.stroke(); ctx.restore();
  texto(ctx, '¡Tu turno!', 640, 487, { tam: 46, c: INK });
  tecladoAbajo(ctx, {}, { y: 590, h: 116 });
  hud(ctx, { progreso: .55 });
};
// ---------- 29 · la banda en el escenario, luces de acordes DO/FA/SOL sobre el teclado ----------
ESCENAS['sc-banda'] = ctx => {
  const m = mundoHD(x => {
    const c = pix(LW, 190, (g, cx) => { const gr = cx.createLinearGradient(0, 0, 0, 190); gr.addColorStop(0, '#1c1030'); gr.addColorStop(1, '#3a2566'); cx.fillStyle = gr; cx.fillRect(0, 0, LW, 190);
      for (let x = 0; x < LW; x++) g.R(x, 0, 1, 22, Math.floor(x / 7) % 2 ? PAL.rojo2 : PAL.rojo3); for (let x = 0; x < 60; x++) { g.R(x, 0, 1, 150 - x, PAL.rojo2); g.R(LW - 1 - x, 0, 1, 150 - x, PAL.rojo2); }
      tablas(g, 0, 140, LW, 50, '#9a6038', '#7a4a2a'); g.R(0, 140, LW, 2, '#e8b47c'); });
    subir(x, c, 3);
    // focos de colores (acordes)
    [[300, NC.DO], [640, NC.FA], [980, NC.SOL]].forEach(([fx, col]) => { x.save(); x.globalCompositeOperation = 'screen'; const g = x.createLinearGradient(0, 60, 0, 520); g.addColorStop(0, col + 'aa'); g.addColorStop(1, col + '00'); x.fillStyle = g; x.beginPath(); x.moveTo(fx - 30, 60); x.lineTo(fx + 30, 60); x.lineTo(fx + 170, 520); x.lineTo(fx - 170, 520); x.fill(); x.restore(); });
    // la banda: primos con instrumentos, Sarah al teclado, David con el tambor, el robot marca el pulso
    sprK(x, PRIMOS['Josué'](), 260, 470, 4); sprK(x, PRIMOS.Noah(), 460, 470, 4); sprK(x, sprSarah({ eyes: 'happy' }), 640, 470, 4.4); sprK(x, sprDavid({ eyes: 'happy' }), 820, 470, 4.4); sprK(x, PRIMOS.Nina(), 1020, 470, 4);
    const bat = pix(30, 20, g => { g.ell(8, 14, 7, 5, '#ff5a5a'); g.R(1, 9, 14, 6, '#ff5a5a'); g.ell(8, 9, 7, 3, '#fffaf2'); g.ell(23, 14, 6, 5, '#5a7dff'); g.R(17, 10, 12, 5, '#5a7dff'); g.ell(23, 10, 6, 3, '#fffaf2'); g.R(26, 0, 1, 8, '#e6a21b'); g.ell(26, 1, 5, 1, '#ffd046'); });
    sprK(x, Object.assign(bat, { ax: 15, ay: 20 }), 900, 470, 3.6);
    sprK(x, sprRobotB({ ojos: 'feliz', ang: .45 }), 1170, 330, 3.4);
    [['♪', 380, 200, NC.DO], ['♫', 700, 160, NC.FA], ['♪', 1000, 210, NC.SOL]].forEach(([t, a, b, cc]) => texto(x, t, a, b, { tam: 60, c: cc, fuente: 'FreeSerif', borde: 6 }));
  }, { bloom: .45, bloomF: 'blur(12px) brightness(.9) contrast(1.8) saturate(1.6)', vin: .4, polvo: 60, polvoY: [60, 520], calido: false, semilla: 29 });
  ctx.drawImage(m, 0, 0); ctx.fillStyle = '#1c1030'; ctx.fillRect(0, 560, W, 160);
  // acordes de colores sobre el teclado: DO (do-mi-sol) rojo, FA (fa-la-do) verde, SOL (sol-si-re) celeste
  const t = tecladoAbajo(ctx, { 0: NC.DO, 4: NC.DO, 7: NC.DO, 5: NC.FA, 9: NC.FA, 12: NC.FA, 14: NC.SOL, 19: NC.SOL, 23: NC.SOL }, { y: 590, h: 116 });
  [[[0, 4, 7], NC.DO, 'DO'], [[5, 9, 12], NC.FA, 'FA'], [[14, 19, 23], NC.SOL, 'SOL']].forEach(([ks, c, n], i) => { const xs = ks.map(t.cx), mx = (Math.min(...xs) + Math.max(...xs)) / 2 + (i === 0 ? -40 : i === 1 ? 40 : 0); ctx.save(); rr(ctx, mx - 60, 548 - i * 0, 120, 40, 20); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); texto(ctx, n, mx, 569, { tam: 24, c: INK }); });
  botonPausa(ctx, W - 50, 46);
};
// ---------- 30 · estudio de grabación ----------
ESCENAS['sc-estudio'] = ctx => {
  const m = mundoHD(x => {
    const c = pix(LW, LH, g => { g.R(0, 0, LW, LH, '#3a2a4a'); for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) { const px = 8 + i * 47, py = 8 + j * 34; g.R(px, py, 42, 30, (i + j) % 2 ? '#533477' : '#45305c'); for (let k = 0; k < 6; k++) g.R(px + 3 + k * 7, py + 3, 4, 24, (i + j) % 2 ? '#5f3f8a' : '#533477'); } tablas(g, 0, 150, LW, 90, '#7a4a2a', '#5a3418'); });
    subir(x, c, 3);
    // la cabina con luz ON AIR
    x.save(); rr(x, 520, 40, 240, 60, 14); x.fillStyle = '#ff5a5a'; x.shadowColor = '#ff5a5a'; x.shadowBlur = 30; x.fill(); x.restore(); texto(x, 'GRABANDO', 640, 72, { tam: 34, c: '#fff8ec', borde: 0 });
    // micrófono
    x.strokeStyle = '#2a1a3a'; x.lineWidth = 12; x.beginPath(); x.moveTo(330, 520); x.lineTo(330, 300); x.lineTo(380, 250); x.stroke(); rr(x, 360, 160, 70, 110, 35); x.fillStyle = lg(x, 360, 0, 430, 0, [[0, '#e2d8ca'], [1, '#8a7a9b']]); x.fill(); x.lineWidth = 5; x.strokeStyle = INK; x.stroke(); for (let i = 0; i < 6; i++) { x.fillStyle = 'rgba(42,26,58,.4)'; x.fillRect(368, 180 + i * 12, 54, 3); }
    sprK(x, sprSarah({ eyes: 'happy' }), 470, 520, 4.6); sprK(x, sprRobotB({ ojos: 'feliz' }), 960, 380, 3.6);
  }, { bloom: .35, vin: .4, polvo: 40, calidoA: .4, frioA: .4, semilla: 30 });
  ctx.drawImage(m, 0, 0);
  // consola con faders
  panel(ctx, 640, 150, 600, 260, { fondo: lg(ctx, 0, 150, 0, 410, [[0, '#4a3a66'], [1, '#2a1a3a']]), r: 20 });
  for (let i = 0; i < 8; i++) { const fx = 690 + i * 68; ctx.fillStyle = '#1c1030'; rr(ctx, fx - 4, 200, 8, 160, 4); ctx.fill(); const fy = 220 + ((i * 37) % 110); rr(ctx, fx - 18, fy, 36, 22, 6); ctx.fillStyle = COL5[i % 5]; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(fx, 176, 7, 0, 7); ctx.fillStyle = k < 1 ? '#fffaf2' : '#fffaf2'; } ctx.beginPath(); ctx.arc(fx, 178, 9, 0, 7); ctx.fillStyle = '#e2d8ca'; ctx.fill(); ctx.stroke(); }
  // onda que se dibuja
  panel(ctx, 60, 440, 1060, 110, { fondo: '#140c26', r: 18 });
  ctx.save(); rr(ctx, 64, 444, 1052, 102, 16); ctx.clip(); const R = rng(9);
  for (let x = 80; x < 860; x += 6) { const a = (Math.sin(x * .021) * .5 + .7) * (20 + R() * 26), c = COL5[Math.floor(x / 160) % 5]; ctx.fillStyle = c; rr(ctx, x, 495 - a, 4, a * 2, 2); ctx.fill(); }
  ctx.fillStyle = '#fff3b0'; ctx.fillRect(862, 448, 4, 94); ctx.restore();
  // botón rojo
  ctx.save(); ctx.shadowColor = '#ff5a5a'; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(1180, 495, 50, 0, 7); ctx.fillStyle = '#ff5a5a'; ctx.fill(); ctx.restore(); ctx.beginPath(); ctx.arc(1180, 495, 50, 0, 7); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.arc(1180, 495, 22, 0, 7); ctx.fillStyle = '#fffaf2'; ctx.fill();
  tecladoAbajo(ctx, { 7: NC.SOL }, { y: 596, h: 110 });
};
// ---------- 33 · el cofre del fin del día ----------
ESCENAS['sc-cofre'] = ctx => {
  ESCENAS['p-cenital'](ctx, { todo: true });
  ctx.fillStyle = 'rgba(28,16,48,.5)'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; ctx.save(); ctx.translate(640, 380); ctx.rotate(a); const g = ctx.createLinearGradient(0, 0, 0, 520); g.addColorStop(0, 'rgba(255,224,130,.55)'); g.addColorStop(1, 'rgba(255,224,130,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(18, 0); ctx.lineTo(70, 520); ctx.lineTo(-70, 520); ctx.fill(); ctx.restore(); } const gg = ctx.createRadialGradient(640, 380, 0, 640, 380, 260); gg.addColorStop(0, 'rgba(255,240,180,.95)'); gg.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = gg; ctx.fillRect(380, 120, 520, 520); ctx.restore();
  sprK(ctx, sprCofre('abierto'), 640, 520, 12);
  const R = rng(33); for (let i = 0; i < 14; i++) { const x = 440 + R() * 400, y = 160 + R() * 220; i % 3 ? estrella(ctx, x, y, 14 + R() * 14) : texto(ctx, '♪', x, y, { tam: 46, c: COL5[i % 5], fuente: 'FreeSerif', borde: 5 }); }
  // las 5 paradas encendidas
  ctx.save(); rr(ctx, 400, 600, 480, 80, 40); ctx.fillStyle = 'rgba(38,23,63,.9)'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  for (let i = 0; i < 5; i++) marcador(ctx, 480 + i * 80, 636, i + 1, 'hecho');
};
// ---------- 34 · la casa propia por dentro ----------
function sprMarimba() { return cache('marimba', () => sprite(50, 22, g => { for (let k = 0; k < 10; k++) { const h = 14 - k; g.R(2 + k * 4.6, 2 + (14 - h) / 2, 4, h, k % 2 ? '#c98a52' : '#a86e3e'); g.R(2 + k * 4.6, 2 + (14 - h) / 2, 4, 1, '#e8b47c'); } g.R(0, 16, 50, 2, '#5a3418'); g.R(3, 18, 2, 4, '#5a3418'); g.R(45, 18, 2, 4, '#5a3418'); for (let k = 0; k < 10; k++) g.R(3 + k * 4.6, 18, 2, 3, '#e6a21b'); }, { ax: 25, ay: 22 })); }
function sprAlbum() { return cache('album', () => sprite(26, 18, g => { g.R(0, 2, 26, 16, '#7a1f3d'); g.R(1, 1, 12, 16, '#fff1d6'); g.R(13, 1, 12, 16, '#fff1d6'); g.R(12, 1, 2, 16, '#c9a372'); g.R(3, 4, 8, 6, '#9fd8ff'); g.R(3, 8, 8, 2, '#7fc96a'); g.R(15, 4, 8, 6, '#ffd9a8'); g.disc(19, 7, 2, '#ff5a5a'); for (let y = 12; y < 16; y += 2) { g.R(3, y, 8, 1, '#c9a372'); g.R(15, y, 8, 1, '#c9a372'); } }, { ax: 13, ay: 18 })); }
function sprTrofeos() { return cache('trofeos', () => sprite(40, 30, g => { g.R(0, 26, 40, 4, '#7a4a2a'); g.R(0, 12, 40, 2, '#7a4a2a'); [[4, NC.MI], [14, '#e2d8ca'], [26, '#e8a060']].forEach(([x, c]) => { g.R(x, 4, 8, 6, c); g.R(x + 3, 10, 2, 2, c); g.R(x + 1, 0, 6, 4, c); }); [[4, NC.DO], [12, NC.FA], [20, NC.SOL], [28, NC.SI]].forEach(([x, c]) => { g.disc(x + 3, 20, 3, c); g.R(x + 2, 15, 2, 3, '#3a2a4a'); }); }, { ax: 20, ay: 30 })); }
ESCENAS['sc-casa'] = ctx => {
  const c = pix(LW, LH, g => { g.R(0, 0, LW, LH, '#2a1a3a'); tapiz(g, 30, 4, 367, 70, '#ffd6e0', '#f8bccb'); tablas(g, 30, 74, 367, 160, '#d8a06a', '#b8804a'); g.R(24, 0, 6, 240, '#6e4426'); g.R(397, 0, 6, 240, '#6e4426'); });
  subir(ctx, c, K3);
  sprK(ctx, sprAlfombra(130, 64), 150 * K3, 124 * K3, K3);
  const O = [[sprVentanal(), 74, 64], [sprVentanal(), 354, 64], [sprTrofeos(), 214, 52], [sprCuadro('#ffd9a8'), 150, 40], [sprCuadro('#c9f0ff'), 280, 40], [sprEstante(), 120, 72],
    [sprClavecin(), 92, 140], [sprMarimba(), 330, 136], [sprAlbum(), 214, 172], [sprCandelabro(), 260, 112], [sprArbol(2, .8), 50, 224], [sprArbol(0, .8), 380, 226], [sprCofre('abierto'), 300, 224],
    [sprSarah({ eyes: 'happy' }), 190, 226], [sprDavid({ eyes: 'happy' }), 224, 226], [sprRobotB({ ojos: 'feliz' }), 252, 210], [sprSanson({}), 130, 224]];
  O.sort((a, b) => a[2] - b[2]);
  sombras(ctx, O.map(([s, x, y]) => ({ x: x * K3 + 8, y: y * K3, rx: s.width * K3 * .42, ry: 10, a: .3 })), 6);
  O.forEach(([s, x, y]) => sprK(ctx, s, x * K3, y * K3, K3));
  // mesita bajo el álbum, con brillo
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(214 * K3, 162 * K3, 0, 214 * K3, 162 * K3, 120); g.addColorStop(0, 'rgba(255,230,150,.7)'); g.addColorStop(1, 'rgba(255,230,150,0)'); ctx.fillStyle = g; ctx.fillRect(214 * K3 - 120, 162 * K3 - 120, 240, 240); ctx.restore();
  // banderines de colores
  ctx.save(); ctx.strokeStyle = '#7a4a2a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(100, 40); ctx.quadraticCurveTo(640, 140, 1180, 40); ctx.stroke(); for (let i = 0; i < 16; i++) { const t = (i + .5) / 16, x = 100 + 1080 * t, y = 40 + 4 * 100 * t * (1 - t) * .5 * 2; ctx.beginPath(); ctx.moveTo(x - 18, y); ctx.lineTo(x + 18, y); ctx.lineTo(x, y + 36); ctx.closePath(); ctx.fillStyle = COL5[i % 5]; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); } ctx.restore();
  postHD(ctx, { base: 'contrast(1.06) saturate(1.12)', bloom: .3, vin: .55, calidoA: .55, frioA: .3, polvo: 50, semilla: 34, tilt: [.1, .06], blur: 3, rayos: [{ x: 222, y: 120, ang: -.35, ancho: 70, largo: 520 }, { x: 1062, y: 120, ang: .35, ancho: 70, largo: 520 }], luces: [{ x: 780, y: 330, r: 60, c: 'rgba(255,210,130,.8)' }, { x: 640, y: 420, r: 380, c: 'rgba(255,205,150,.45)', modo: 'soft-light' }] });
};
// ---------- 35 · el informe del viernes para papá ----------
ESCENAS['sc-informe'] = ctx => {
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#2f1e4d'], [1, '#1c1030']]); ctx.fillRect(0, 0, W, H);
  texto(ctx, 'La semana · viernes', 70, 52, { tam: 34, al: 'left', c: '#fff8ec' }); texto(ctx, 'para papá', 70, 88, { tam: 20, al: 'left', c: '#b9a8d6', peso: 500 });
  insignia(ctx, 1190, 66, 40, NC.MI, '★');
  const ninos = [{ n: 'Sarah', s: sprSarah({ eyes: 'happy' }), c: NC.DO, min: [12, 14, 0, 11, 16], dom: ['Estrellita', 'Corderito', 'Gotas'], cuesta: 'la blanca: contar 2', ins: [NC.SOL, '♪'] },
                 { n: 'David', s: sprDavid({ eyes: 'happy' }), c: NC.SOL, min: [8, 10, 9, 0, 11], dom: ['Tambor de David', 'Dos negras'], cuesta: 'mano izquierda', ins: [NC.FA, '♫'] }];
  ninos.forEach((k, i) => {
    const x = 60 + i * 590, y = 120, w = 570, h = 570;
    panel(ctx, x, y, w, h, { fondo: lg(ctx, 0, y, 0, y + h, [[0, '#3a2566'], [1, '#26173f']]), r: 26 });
    ctx.save(); ctx.beginPath(); ctx.arc(x + 80, y + 82, 54, 0, 7); ctx.fillStyle = mezcla(k.c, '#fff', .55); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.clip(); sprK(ctx, k.s, x + 80, y + 150, 4.2); ctx.restore();
    texto(ctx, k.n, x + 156, y + 64, { tam: 38, al: 'left' }); const tot = k.min.reduce((a, b) => a + b); texto(ctx, tot + ' minutos', x + 156, y + 104, { tam: 24, al: 'left', c: '#ffd046' });
    insignia(ctx, x + w - 70, y + 80, 34, k.ins[0], k.ins[1]);
    // barras por día
    const dias = ['L', 'M', 'M', 'J', 'V'], bx = x + 40, by = y + 330;
    texto(ctx, 'minutos por día', bx, y + 168, { tam: 18, al: 'left', c: '#b9a8d6', peso: 500 });
    k.min.forEach((m, d) => { const bh = m * 8, xx = bx + d * 100; ctx.fillStyle = 'rgba(255,255,255,.08)'; rr(ctx, xx, by - 140, 64, 140, 10); ctx.fill(); if (m) { rr(ctx, xx, by - bh, 64, bh, 10); ctx.fillStyle = lg(ctx, 0, by - bh, 0, by, [[0, mezcla(k.c, '#fff', .3)], [1, k.c]]); ctx.fill(); texto(ctx, String(m), xx + 32, by - bh - 16, { tam: 18 }); } else texto(ctx, 'descanso', xx + 32, by - 16, { tam: 14, c: '#8a7a9b', peso: 500 }); texto(ctx, dias[d], xx + 32, by + 22, { tam: 20, c: '#d8c9f0' }); });
    // dominado
    texto(ctx, 'ya le salen', bx, by + 70, { tam: 18, al: 'left', c: '#b9a8d6', peso: 500 });
    let cx = bx; k.dom.forEach(d => { ctx.font = '700 18px Outfit'; const tw = ctx.measureText(d).width + 50; rr(ctx, cx, by + 86, tw, 40, 20); ctx.fillStyle = 'rgba(95,211,106,.22)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#5fd36a'; ctx.stroke(); texto(ctx, '✓', cx + 18, by + 107, { tam: 18, c: '#5fd36a' }); texto(ctx, d, cx + 32, by + 107, { tam: 18, al: 'left' }); cx += tw + 10; });
    // le cuesta
    texto(ctx, 'le cuesta', bx, by + 156, { tam: 18, al: 'left', c: '#b9a8d6', peso: 500 });
    ctx.font = '700 18px Outfit'; const cw = ctx.measureText(k.cuesta).width + 30; rr(ctx, bx, by + 172, cw, 40, 20); ctx.fillStyle = 'rgba(255,154,60,.2)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#ff9a3c'; ctx.stroke(); texto(ctx, k.cuesta, bx + 15, by + 193, { tam: 18, al: 'left' });
    // botón de audio: oír su concierto
    const ax = x + w - 150, ay = by + 160; rr(ctx, ax, ay, 120, 64, 32); ctx.fillStyle = '#ffd046'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.moveTo(ax + 30, ay + 18); ctx.lineTo(ax + 30, ay + 46); ctx.lineTo(ax + 54, ay + 32); ctx.closePath(); ctx.fillStyle = INK; ctx.fill(); for (let q = 0; q < 4; q++) { ctx.fillStyle = INK; rr(ctx, ax + 66 + q * 10, ay + 32 - (6 + (q % 2) * 8), 5, 2 * (6 + (q % 2) * 8), 2); ctx.fill(); }
  });
};
