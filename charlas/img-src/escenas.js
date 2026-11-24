// =====================================================================
//  Escenas 1–4: el mismo pueblo barroco (Leipzig, Santo Tomás, plaza) en cuatro estilos
// =====================================================================
const ESCENAS = {};
const LW = 427, LH = 240, K3 = 3;   // lienzo de píxel 427×240 a 3× = 1281×720

// ---------- el pueblo (lista de objetos con su sombra y sus luces), en coordenadas de píxel ----------
function puebloLeipzig(o = {}) {
  const R = rng(o.semilla || 11), noche = !!o.noche;
  const suelo = pix(LW, LH, g => {
    pasto(g, 0, 0, LW, LH, R);
    adoquines(g, 0, 122, LW, 118, R);
    // calle que sube hacia la iglesia y bordes de la plaza
    g.R(0, 121, LW, 2, TC.piedra2);
    plazaCirculo(g, 213, 188, 88, 34, R);
    // jardineras con flores en las esquinas de abajo
    pasto(g, 0, 214, 70, 26, R); flores(g, 4, 218, 60, 20, R, 26); g.R(0, 213, 70, 2, TC.piedra2); g.R(69, 213, 2, 27, TC.piedra2);
    pasto(g, 357, 214, 70, 26, R); flores(g, 360, 218, 64, 20, R, 26); g.R(357, 213, 70, 2, TC.piedra2); g.R(356, 213, 2, 27, TC.piedra2);
    // camino de tierra arriba, detrás de las casas (sigue el pueblo)
    tierra(g, 0, 40, LW, 9, R);
    flores(g, 0, 0, LW, 38, R, 40);
  });
  const O = [];
  const add = (s, x, y, sh) => O.push({ s, x, y, sh });
  // fila de atrás (asoma el resto del pueblo)
  [[-10, 40, 3], [44, 40, 5], [300, 40, 2], [352, 40, 4], [398, 40, 0]].forEach(([x, y, c], i) => add(sprCasa({ w: 46, hf: 26, hr: 18, col: c, gablete: i % 2 === 0, noche, tejado: i === 3 ? 'pizarra' : 'rojo' }), x, y, null));
  [[110, 30], [126, 36], [290, 34], [24, 30]].forEach(([x, y], i) => add(sprArbol(i % 2), x, y, { rx: 9, ry: 3 }));
  // la iglesia
  add(sprIglesia({ noche }), 138, 128, { poly: true });
  // casas de la plaza
  const casas = [[0, 130, 46, 36, 24, 1, { tienda: NC.DO }], [44, 128, 46, 34, 22, 3, { flores: true }], [90, 132, 48, 38, 24, 0, { letrero: NC.MI }],
    [290, 132, 46, 36, 24, 2, { flores: true }], [334, 128, 48, 34, 22, 5, { tienda: NC.SOL }], [380, 130, 48, 38, 24, 4, {}]];
  casas.forEach(([x, y, w, hf, hr, col, ex], i) => add(sprCasa(Object.assign({ w, hf, hr, col, gablete: i % 2 === 0, noche, tejado: i === 4 ? 'pizarra' : 'rojo' }, ex)), x, y, { poly: true }));
  // fuente, faroles, árboles, bancos, puesto
  add(sprFuente(), 213, 198, { rx: 22, ry: 6 });
  [[128, 154], [298, 154], [118, 226], [306, 226]].forEach(([x, y]) => add(sprFarol(), x, y, { rx: 3, ry: 1 }));
  add(sprArbol(0, 1.3), 30, 236, { rx: 14, ry: 4 }); add(sprArbol(1, 1.2), 400, 238, { rx: 13, ry: 4 }); add(sprArbol(2), 56, 152, { rx: 9, ry: 3 }); add(sprArbol(0), 372, 150, { rx: 9, ry: 3 });
  add(sprBanco(), 160, 156, { rx: 8, ry: 2 }); add(sprBanco(), 268, 156, { rx: 8, ry: 2 });
  add(sprPuesto(NC.DO), 92, 200, { rx: 13, ry: 3 }); add(sprPuesto(NC.LA), 336, 196, { rx: 13, ry: 3 }); add(sprBarril(), 112, 202, { rx: 4, ry: 1 }); add(sprBarril(), 318, 198, { rx: 4, ry: 1 });
  [[176, 166, 0], [182, 169, 1], [250, 168, 0]].forEach(([x, y, f]) => add(sprPaloma(f), x, y, null));
  // Sarah, David y el robot-metrónomo
  add(sprSarah({}), 184, 234, { rx: 8, ry: 2.5 }); add(sprDavid({ eyes: 'happy' }), 226, 234, { rx: 8, ry: 2.5 });
  const rob = sprRobotB({ ang: .38, ojos: 'feliz' }); add(rob, 256, 226, null); O[O.length - 1].vuela = 12;
  add(sprSanson({}), 146, 238, { rx: 16, ry: 3 });
  O.sort((a, b) => a.y - b.y);
  // luces: ventanas cálidas, faroles, la fuente
  const luces = [];
  [[128, 137], [298, 137], [118, 209], [306, 209]].forEach(([x, y]) => luces.push({ x, y, r: 18, c: 'rgba(255,205,120,.6)' }));
  return { suelo, O, luces };
}
function pintarPueblo(ctx, P, estilo) {
  subir(ctx, P.suelo, K3);
  if (estilo === 'hd2d') {
    // sombras largas de atardecer (luz de arriba-izquierda → sombras abajo-derecha)
    const L = [];
    P.O.forEach(ob => {
      if (!ob.sh) return; const s = ob.s, x0 = (ob.x - (s.ax || 0)) * K3, y = ob.y * K3, w = s.width * K3;
      if (ob.sh.poly) L.push({ poly: [[x0 + w * .05, y - 4], [x0 + w, y - 4], [x0 + w + 110, y + 70], [x0 + w * .05 + 110, y + 70]], a: .42 });
      else L.push({ x: ob.x * K3 + 10, y: ob.y * K3 + 3, rx: ob.sh.rx * K3, ry: ob.sh.ry * K3, a: .4 });
    });
    sombras(ctx, L, 7);
  }
  P.O.forEach(ob => {
    if (estilo !== 'hd2d' && ob.sh && !ob.sh.poly) { const c = pix(1, 1, () => { }); ctx.save(); ctx.fillStyle = 'rgba(42,26,58,.35)'; const rx = ob.sh.rx * K3, ry = ob.sh.ry * K3; ctx.fillRect(Math.round((ob.x * K3 - rx) / 3) * 3, ob.y * K3 - ry, rx * 2, ry * 2); ctx.restore(); }
    if (ob.vuela) { // sombrita del robot en el suelo
      if (estilo === 'hd2d') sombras(ctx, [{ x: ob.x * K3, y: ob.y * K3 + 6, rx: 22, ry: 7, a: .3 }], 5); else { ctx.fillStyle = 'rgba(42,26,58,.3)'; ctx.fillRect(ob.x * K3 - 18, ob.y * K3, 36, 9); }
      sprK(ctx, ob.s, ob.x * K3, (ob.y - ob.vuela) * K3, K3);
    } else sprK(ctx, ob.s, ob.x * K3, ob.y * K3, K3);
  });
}

// ---------- 1 · píxel 16 bits clásico ----------
ESCENAS['s-pixel16'] = ctx => {
  const P = puebloLeipzig();
  pintarPueblo(ctx, P, 'pixel16');
  // un toque de época: un cuadro de diálogo pequeño, sin texto largo (♪ de Bach)
  const d = pix(150, 30, g => { g.R(0, 0, 150, 30, INK); g.R(1, 1, 148, 28, '#fffaf4'); g.R(2, 2, 146, 26, '#33204d'); g.R(3, 3, 144, 1, '#533477'); });
  sprK(ctx, Object.assign(d, { ax: 0, ay: 0 }), 819, 612, 3);
  const b = sprBach({}); sprK(ctx, b, 870, 693, 1.6);
  ['♪', '♫', '♪'].forEach((t, i) => texto(ctx, t, 960 + i * 54, 657, { tam: 40, c: [NC.SOL, NC.MI, NC.DO][i], fuente: 'FreeSerif', borde: 4 }));
};
// ---------- 2 · HD-2D (la recomendada) ----------
ESCENAS['s-hd2d'] = ctx => {
  const P = puebloLeipzig();
  pintarPueblo(ctx, P, 'hd2d');
  postHD(ctx, {
    base: 'contrast(1.12) saturate(1.18)', atardecer: ['#fff4e4', '#efe0ea', '#9c8cc4'], calidoA: .5, frioA: .4,
    tilt: [.3, .07], blur: 5, bloom: .3, bloomF: 'blur(12px) brightness(.9) contrast(1.9) saturate(1.5)', polvo: 45, polvoY: [60, 560], vin: .62, semilla: 3,
    rayos: [{ x: 100, y: -80, ang: -.6, ancho: 170, largo: 1000, c: 'rgba(255,214,150,.26)' }, { x: 430, y: -80, ang: -.6, ancho: 110, largo: 950, c: 'rgba(255,220,160,.2)' }, { x: 820, y: -80, ang: -.6, ancho: 140, largo: 850, c: 'rgba(255,214,160,.16)' }],
    luces: P.luces.map(l => ({ x: l.x * K3, y: l.y * K3, r: l.r * K3, c: 'rgba(255,200,110,.55)' })).concat([
      { x: 640, y: 580, r: 150, c: 'rgba(150,225,255,.35)', modo: 'soft-light' }, { x: 640, y: 640, r: 300, c: 'rgba(255,215,150,.55)', modo: 'soft-light' }, { x: 520, y: 470, r: 420, c: 'rgba(255,205,130,.5)', modo: 'soft-light' }]),
  });
};

// ---------- 3 · 2.5D ilustrado suave (Kirby de Switch) ----------
ESCENAS['s-25d'] = ctx => {
  ctx.fillStyle = lg(ctx, 0, 0, 0, 380, [[0, '#7cc6ff'], [.6, '#bfe6ff'], [1, '#ffe9cf']]); ctx.fillRect(0, 0, W, 400);
  nube(ctx, 180, 90, 70); nube(ctx, 1080, 70, 60); nube(ctx, 760, 40, 40);
  // colinas lejanas y techos de fondo
  ctx.fillStyle = lg(ctx, 0, 300, 0, 420, [[0, '#b9e6a8'], [1, '#8fd08a']]); ctx.beginPath(); ctx.moveTo(0, 360); ctx.bezierCurveTo(300, 280, 500, 330, 700, 320); ctx.bezierCurveTo(900, 300, 1100, 290, 1280, 330); ctx.lineTo(1280, 450); ctx.lineTo(0, 450); ctx.fill();
  [[60, 360, 90], [170, 350, 80], [1040, 350, 90], [1150, 360, 90]].forEach(([x, y, w]) => { ctx.fillStyle = 'rgba(190,170,220,.55)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w / 2, y - 70); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + 60); ctx.lineTo(x, y + 60); ctx.fill(); });
  // suelo de la plaza
  ctx.fillStyle = lg(ctx, 0, 430, 0, 720, [[0, '#e9dccb'], [1, '#c9b8a6']]); ctx.fillRect(0, 430, W, 290);
  for (let k = 1; k < 9; k++) { ctx.beginPath(); ctx.ellipse(640, 600, k * 90, k * 26, 0, 0, 7); ctx.strokeStyle = 'rgba(150,120,100,.18)'; ctx.lineWidth = 3; ctx.stroke(); }
  ctx.fillStyle = 'rgba(120,200,110,.9)'; [[0, 640, 200], [1080, 640, 200]].forEach(([x, y, w]) => { rr(ctx, x, y, w, 100, 30); ctx.fill(); });
  // iglesia al fondo
  vIglesia(ctx, 430, 470, 1);
  // casas (fondo y frente)
  vCasa(ctx, 230, 455, 160, 150, { col: ['#ffe9a8', '#f2c46a'], flores: true });
  vCasa(ctx, 880, 455, 160, 150, { col: ['#c4f0dc', '#8fd0b4'], tejado: ['#8c94c8', '#5f6798'], flores: true });
  vCasa(ctx, 10, 520, 200, 190, { col: ['#ffc9b0', '#f09a80'], toldo: '#ff5a5a', pisos: 2 });
  vCasa(ctx, 1070, 520, 200, 190, { col: ['#cfe0ff', '#9ab4e8'], toldo: '#5a7dff', pisos: 2 });
  vArbol(ctx, 225, 610, 70); vArbol(ctx, 1060, 615, 74, ['#b8ec8a', '#7fd06a', '#4aa04a']);
  // faroles
  [[300, 640], [980, 640]].forEach(([x, y]) => { ctx.fillStyle = '#3a2a4a'; rr(ctx, x - 4, y - 120, 8, 120, 4); ctx.fill(); rr(ctx, x - 14, y - 150, 28, 34, 8); ctx.fill(); elip(ctx, x, y - 133, 9, 12, '#fff3b0'); ctx.save(); ctx.globalCompositeOperation = 'screen'; elip(ctx, x, y - 133, 50, 50, rg(ctx, x, y - 133, 50, [[0, 'rgba(255,220,140,.7)'], [1, 'rgba(255,220,140,0)']])); ctx.restore(); });
  vFuente(ctx, 640, 600, .9);
  vSarah(ctx, 540, 700, .9); vDavid(ctx, 750, 700, .9); vRobotB(ctx, 880, 560, .75, .4);
  // notas que flotan
  [['♪', 470, 440, NC.SOL], ['♫', 860, 400, NC.MI], ['♪', 640, 380, NC.DO]].forEach(([t, x, y, c]) => texto(ctx, t, x, y, { tam: 54, c, fuente: 'FreeSerif', borde: 0 }));
  // luz suave de tarde
  ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = lg(ctx, 0, 0, W, H, [[0, 'rgba(255,220,170,.6)'], [1, 'rgba(120,110,200,.4)']]); ctx.fillRect(0, 0, W, H); ctx.restore();
  const v = ctx.createRadialGradient(640, 380, 300, 640, 360, 900); v.addColorStop(0, 'rgba(30,10,50,0)'); v.addColorStop(1, 'rgba(30,10,50,.35)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
};

// ---------- 4 · diorama isométrico en píxel ----------
// rombo de suelo de 2:1 con lado t
function isoP(cx, cy, i, j, t) { return [cx + (i - j) * t, cy + (i + j) * t / 2]; }
function isoTile(g, x, y, t, c, c2) { for (let k = 0; k < t; k++) { g.R(x - k * 2, y + k, k * 4 + 2, 1, c); g.R(x - (t - 1 - k) * 2, y + t + k, (t - 1 - k) * 4 + 2, 1, c); } if (c2) { g.R(x - (t - 1) * 2, y + t - 1, 2, 1, c2); } }
// bloque isométrico (casa): base en rombo (i,j) de tamaño a×b, alto h, con tejado a dos aguas
let ISO_T = 8;
function isoCasa(g, cx, cy, i, j, a, b, h, F, T, o = {}) {
  const t = ISO_T, p0 = isoP(cx, cy, i, j, t), pa = isoP(cx, cy, i + a, j, t), pb = isoP(cx, cy, i, j + b, t), pab = isoP(cx, cy, i + a, j + b, t);
  // caras: izquierda (a lo largo de j, desde pb a pab) y derecha (de pa a pab)
  for (let x = Math.round(pb[0]); x <= Math.round(pab[0]); x++) { const k = (x - pb[0]) / (pab[0] - pb[0] || 1), yb = pb[1] + (pab[1] - pb[1]) * k; g.R(x, Math.round(yb - h), 1, h, F[0]); }
  for (let x = Math.round(pab[0]); x <= Math.round(pa[0]); x++) { const k = (x - pab[0]) / (pa[0] - pab[0] || 1), yb = pab[1] + (pa[1] - pab[1]) * k; g.R(x, Math.round(yb - h), 1, h, F[1]); }
  // ventanas en ambas caras
  const vent = (A, B, n, sh) => { for (let q = 0; q < n; q++) { const k = (q + .5) / n, x = Math.round(A[0] + (B[0] - A[0]) * k), y = Math.round(A[1] + (B[1] - A[1]) * k); for (let f = 0; f < Math.floor(h / 12); f++) { const yy = y - h + 6 + f * 12; g.R(x - 2, yy, 4, 6, o.luz ? TC.luz : TC.vidrio); g.px(x - 2, yy, sh); } } };
  vent(pb, pab, Math.max(1, a + b > 6 ? 3 : 2), TC.vidrio3); vent(pab, pa, Math.max(1, 2), TC.vidrio3);
  if (o.puerta) { const x = Math.round((pb[0] + pab[0]) / 2), y = Math.round((pb[1] + pab[1]) / 2); g.R(x - 3, y - 9, 6, 9, '#7a4a2a'); g.px(x + 1, y - 5, TC.oro); }
  // tejado: cumbrera a lo largo de i (de p0+pb)/2 a (pa+pab)/2, alto rh
  const rh = o.rh || 14, m0 = [(p0[0] + pb[0]) / 2, (p0[1] + pb[1]) / 2 - h - rh], m1 = [(pa[0] + pab[0]) / 2, (pa[1] + pab[1]) / 2 - h - rh];
  const tri = (P1, P2, P3, c) => { const xs = [P1[0], P2[0], P3[0]], ys = [P1[1], P2[1], P3[1]]; const minX = Math.floor(Math.min(...xs)), maxX = Math.ceil(Math.max(...xs)), minY = Math.floor(Math.min(...ys)), maxY = Math.ceil(Math.max(...ys)); const s = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]); for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) { const P = [x + .5, y + .5], d1 = s(P, P1, P2), d2 = s(P, P2, P3), d3 = s(P, P3, P1); if (!((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0))) g.px(x, y, typeof c === 'function' ? c(x, y) : c); } };
  const top = p => [p[0], p[1] - h];
  // vertiente frontal (sobre la cara izquierda) y la del lado derecho
  const tej = (base) => (x, y) => (y % 3 === 0 ? mezcla(base, '#000', .18) : base);
  tri(top(pb), top(pab), m1, tej(T[0])); tri(top(pb), m1, m0, tej(T[0]));
  tri(top(pab), top(pa), m1, tej(T[1]));
  g.line(Math.round(m0[0]), Math.round(m0[1]), Math.round(m1[0]), Math.round(m1[1]), mezcla(T[0], '#fff', .3));
}
ESCENAS['s-iso'] = ctx => {
  const R = rng(5); ISO_T = 12;
  const c = pix(LW, LH, (g, x) => {
    const gr = x.createLinearGradient(0, 0, 0, LH); gr.addColorStop(0, '#2c2252'); gr.addColorStop(1, '#5a3f8a'); x.fillStyle = gr; x.fillRect(0, 0, LW, LH);
    for (let i = 0; i < 70; i++) g.px(Math.floor(R() * LW), Math.floor(R() * LH), R() < .5 ? '#fff3b0' : '#c9b5ff');
    const cx = 213, cy = 82, t = ISO_T, N = 12;
    for (let k = 0; k < 16; k++) { const L = isoP(cx, cy, 0, N, t), Rr = isoP(cx, cy, N, 0, t), B = isoP(cx, cy, N, N, t); g.line(Math.round(L[0]), Math.round(L[1] + k), Math.round(B[0]), Math.round(B[1] + k), k < 3 ? '#4a9447' : k % 5 === 4 ? '#6e4426' : '#8a5a34', 1); g.line(Math.round(B[0]), Math.round(B[1] + k), Math.round(Rr[0]), Math.round(Rr[1] + k), k < 3 ? '#3a7a3a' : k % 5 === 4 ? '#4e2e16' : '#6e4426', 1); }
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const [px, py] = isoP(cx, cy, i, j, t), plaza = i >= 3 && i <= 9 && j >= 4 && j <= 11, ch = (i + j) % 2;
      isoTile(g, Math.round(px), Math.round(py), t, plaza ? (ch ? TC.piedra : TC.piedra3) : (ch ? TC.pasto : '#86d272'));
      if (!plaza && R() < .35) { g.px(Math.round(px) + 3, Math.round(py) + 6, [NC.DO, NC.MI, '#fff'][Math.floor(R() * 3)]); }
    }
    // torre (oeste) y nave de Santo Tomás
    isoCasa(g, cx, cy, 0, 0, 2.5, 3, 62, ['#f1e6cc', '#d8c9a6'], [TC.cobre, TC.cobre2], { rh: 16 });
    const tp = isoP(cx, cy, 1.25, 1.5, t); g.R(Math.round(tp[0]), Math.round(tp[1]) - 104, 1, 14, TC.oro); g.R(Math.round(tp[0]) - 3, Math.round(tp[1]) - 100, 7, 1, TC.oro); g.disc(Math.round(tp[0]), Math.round(tp[1]) - 90, 2, TC.oro);
    const rel = isoP(cx, cy, 1.25, 3, t); g.disc(Math.round(rel[0]), Math.round(rel[1]) - 46, 4, '#fffaf2'); g.R(Math.round(rel[0]), Math.round(rel[1]) - 49, 1, 3, INK); g.R(Math.round(rel[0]), Math.round(rel[1]) - 46, 3, 1, INK);
    isoCasa(g, cx, cy, 2.5, 0, 9.5, 3, 40, ['#f1e6cc', '#d8c9a6'], [TC.pizarra, TC.pizarra2], { rh: 30, puerta: true });
    isoCasa(g, cx, cy, 0, 4.5, 2.6, 3, 36, FACHADAS[1].slice(0, 2), [TC.tejado, TC.tejado2], { puerta: true });
    isoCasa(g, cx, cy, 0, 8, 2.6, 3, 30, FACHADAS[3].slice(0, 2), [TC.tejado, TC.tejado2], { puerta: true });
    isoCasa(g, cx, cy, 10, 4, 2, 3, 34, FACHADAS[2].slice(0, 2), [TC.pizarra, TC.pizarra2], { puerta: true });
    [[1.2, 11.4], [11.2, 0.9], [11, 8.6], [11, 10.9], [3.4, 11.2]].forEach(([i, j], k) => { const p = isoP(cx, cy, i, j, t); spr(g, sprArbol(k % 3, 1.2), Math.round(p[0]), Math.round(p[1]) + 8); });
    const f = isoP(cx, cy, 6.5, 7.5, t); spr(g, sprFuente(), Math.round(f[0]), Math.round(f[1]) + 10);
    [[4, 5], [9, 5], [3.3, 9]].forEach(([i, j]) => { const p = isoP(cx, cy, i, j, t); spr(g, sprFarol(), Math.round(p[0]), Math.round(p[1]) + 6); });
    const s1 = isoP(cx, cy, 6.6, 10.6, t), s2 = isoP(cx, cy, 8.4, 9.6, t), r1 = isoP(cx, cy, 9.4, 8.4, t);
    g.ctx.fillStyle = 'rgba(42,26,58,.3)'; [s1, s2].forEach(p => g.ctx.fillRect(Math.round(p[0]) - 7, Math.round(p[1]) + 4, 14, 3)); g.ctx.fillRect(Math.round(r1[0]) - 6, Math.round(r1[1]) + 6, 12, 3);
    spr(g, sprRobotB({ ang: -.35, ojos: 'feliz' }), Math.round(r1[0]), Math.round(r1[1]) - 6);
    spr(g, sprDavid({ eyes: 'happy' }), Math.round(s2[0]), Math.round(s2[1]) + 5); spr(g, sprSarah({}), Math.round(s1[0]), Math.round(s1[1]) + 5);
  });
  subir(ctx, c, K3);
  postHD(ctx, { bloom: .22, calidoA: .35, frioA: .3, vin: .5, polvo: 40, semilla: 9, luces: [{ x: 640, y: 420, r: 420, c: 'rgba(255,210,150,.35)', modo: 'soft-light' }] });
};
