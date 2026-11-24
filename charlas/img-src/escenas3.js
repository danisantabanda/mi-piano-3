// =====================================================================
//  Personajes (15–19): tarjetas A/B/C grandes sobre un fondo de escenario HD-2D
// =====================================================================
function fondoEscenario(ctx, c1 = '#3a2566', c2 = '#1c1030') {
  const g = ctx.createRadialGradient(W / 2, H * .45, 50, W / 2, H * .5, W * .75); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // cortinas y piso de tablas suaves
  ctx.fillStyle = lg(ctx, 0, 560, 0, 720, [[0, '#5a3418'], [1, '#2e1a0e']]); ctx.fillRect(0, 560, W, 160);
  for (let x = 0; x < W; x += 80) { ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(x, 560, 3, 160); }
  ctx.fillStyle = 'rgba(255,220,160,.12)'; ctx.fillRect(0, 560, W, 4);
}
function tarjetaPersonaje(ctx, x, y, w, h, letra, o = {}) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10; rr(ctx, x, y, w, h, 26); ctx.fillStyle = o.fondo || lg(ctx, x, y, x, y + h, [[0, '#4a3478'], [1, '#2a1a48']]); ctx.fill(); ctx.restore();
  ctx.save(); rr(ctx, x, y, w, h, 26); ctx.clip();
  if (o.pinta) o.pinta(ctx, x, y, w, h);
  // foco cenital
  const g = ctx.createRadialGradient(x + w / 2, y + h * .2, 10, x + w / 2, y + h * .55, h * .75); g.addColorStop(0, 'rgba(255,240,200,.35)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(x, y, w, h); ctx.globalCompositeOperation = 'source-over';
  // pedestal
  const py = y + h - 70; elip(ctx, x + w / 2, py + 8, w * .36, 26, 'rgba(0,0,0,.35)'); elip(ctx, x + w / 2, py, w * .36, 24, lg(ctx, 0, py - 24, 0, py + 24, [[0, '#fff1d6'], [1, '#c9a372']])); elip(ctx, x + w / 2, py - 4, w * .3, 16, 'rgba(255,255,255,.25)');
  ctx.restore();
  ctx.save(); rr(ctx, x, y, w, h, 26); ctx.lineWidth = 5; ctx.strokeStyle = o.borde || INK; ctx.stroke(); rr(ctx, x + 7, y + 7, w - 14, h - 14, 20); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.stroke(); ctx.restore();
  rotulo(ctx, letra, x + 40, y + 40, { r: 26, estrella: o.estrella });
  return { cx: x + w / 2, base: py };
}
function tres(ctx, fns, o = {}) {
  const n = fns.length, m = 36, gap = 30, w = (W - m * 2 - gap * (n - 1)) / n, h = H - m * 2;
  return fns.map((f, i) => { const t = tarjetaPersonaje(ctx, m + i * (w + gap), m, w, h, 'ABC'[i], f.o || {}); f(ctx, t.cx, t.base, w, h); return t; });
}
const ondas = (ctx, x, y, c, n = 3) => { ctx.save(); ctx.strokeStyle = c; ctx.lineCap = 'round'; for (let i = 1; i <= n; i++) { ctx.globalAlpha = 1 - i * .25; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, 20 + i * 18, -.6, .6); ctx.stroke(); } ctx.restore(); };
const notaFlota = (ctx, t, x, y, c, tam = 50) => texto(ctx, t, x, y, { tam, c, fuente: 'FreeSerif', borde: 5 });

// ---------- 15 · el robot compañero ----------
ESCENAS['c-robot'] = ctx => {
  fondoEscenario(ctx);
  const A = (ctx, cx, b) => { sprK(ctx, sprRobotA({ f: 0 }), cx, b - 40, 7); ctx.save(); ctx.strokeStyle = 'rgba(255,240,180,.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(cx, b - 268, 70, 10, 0, 0, 7); ctx.stroke(); ctx.restore(); notaFlota(ctx, '♪', cx + 120, b - 290, NC.SOL); };
  const B = (ctx, cx, b) => {
    // rastro del péndulo: late con el pulso
    const s0 = sprRobotB({ ang: -.42, ojos: 'feliz' }), s1 = sprRobotB({ ang: .42, ojos: 'feliz' });
    sprK(ctx, s0, cx, b - 40, 7, { alpha: .28 }); sprK(ctx, s1, cx, b - 40, 7);
    ctx.save(); ctx.strokeStyle = '#ffd046'; ctx.lineWidth = 5; ctx.setLineDash([4, 12]); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx, b - 40 - 10 * 7, 13 * 7 * .62, -Math.PI / 2 - .5, -Math.PI / 2 + .5); ctx.stroke(); ctx.restore();
    [-1, 1].forEach(d => { ctx.save(); ctx.globalCompositeOperation = 'screen'; const x = cx + d * 70, y = b - 120; const g = ctx.createRadialGradient(x, y, 0, x, y, 40); g.addColorStop(0, 'rgba(255,220,120,.9)'); g.addColorStop(1, 'rgba(255,220,120,0)'); ctx.fillStyle = g; ctx.fillRect(x - 40, y - 40, 80, 80); ctx.restore(); });
    // los pulsos: cuatro puntos que laten (uno encendido)
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(cx - 66 + i * 44, b + 40, i === 1 ? 14 : 10, 0, 7); ctx.fillStyle = i === 1 ? '#ffd046' : 'rgba(255,255,255,.25)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
  };
  B.o = { estrella: true };
  const C = (ctx, cx, b) => { sprK(ctx, sprRobotC(), cx, b - 50, 7); ondas(ctx, cx + 30, b - 120, '#7fe8ff'); notaFlota(ctx, '♫', cx + 130, b - 250, NC.MI); };
  tres(ctx, [A, B, C]);
  postHD(ctx, { bloom: .2, calido: false, vin: .3, polvo: 40, polvoY: [40, 500], semilla: 15 });
};
// ---------- 16 · Bach ----------
ESCENAS['c-bach'] = ctx => {
  fondoEscenario(ctx, '#2c3a6b', '#140c26');
  const A = (ctx, cx, b) => { sprK(ctx, sprBach({ cara: 'feliz' }), cx, b - 4, 7); notaFlota(ctx, '♪', cx - 170, b - 300, NC.DO); notaFlota(ctx, '♫', cx + 170, b - 330, NC.MI); };
  A.o = { fondo: lg(ctx, 0, 36, 0, 684, [[0, '#6a3f2a'], [1, '#2a1a20']]), pinta: (ctx, x, y, w, h) => { const org = sprOrgano(); sprK(ctx, teñido(org, '#8a5a40'), x + w / 2, y + h * .62, 6, { alpha: .35 }); } };
  const B = (ctx, cx, b) => { sprK(ctx, sprBachElegante(), cx, b - 4, 6); };
  B.o = { fondo: lg(ctx, 0, 36, 0, 684, [[0, '#3f5296'], [1, '#1c1838']]), pinta: (ctx, x, y, w, h) => { for (let k = 0; k < 4; k++) { const px = x + 60 + k * (w - 120) / 3; ctx.fillStyle = lg(ctx, px - 22, 0, px + 22, 0, [[0, 'rgba(255,255,255,.12)'], [1, 'rgba(255,255,255,.04)']]); ctx.fillRect(px - 22, y + 60, 44, h - 140); ctx.beginPath(); ctx.arc(px, y + 60, 22, Math.PI, 0); ctx.fill(); } for (let k = 0; k < 3; k++) { const ax = x + w / 2 + (k - 1) * 150; ctx.strokeStyle = 'rgba(255,215,140,.18)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(ax, y + 220, 70, Math.PI, 0); ctx.stroke(); } } };
  tres(ctx, [A, B]);
  postHD(ctx, { bloom: .2, calido: false, vin: .3, polvo: 40, polvoY: [40, 500], semilla: 16 });
};
// ---------- 17 · Sarah y David en tres proporciones ----------
ESCENAS['c-ninos'] = ctx => {
  fondoEscenario(ctx);
  const regla = (ctx, x, base, alto, n) => { ctx.save(); for (let i = 0; i < n; i++) { const y0 = base - alto + i * alto / n; ctx.beginPath(); ctx.ellipse(x, y0 + alto / n / 2, 11, alto / n / 2 - 3, 0, 0, 7); ctx.fillStyle = i === 0 ? 'rgba(255,208,70,.85)' : 'rgba(255,255,255,.18)'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.stroke(); } ctx.restore(); };
  const A = (ctx, cx, b, w) => { const k = 5.5; sprK(ctx, chibi('sarah'), cx - 70, b - 4, k); sprK(ctx, chibi('david'), cx + 92, b - 4, k); regla(ctx, cx - w / 2 + 34, b - 4, 30 * k - 6, 2); };
  const B = (ctx, cx, b, w) => { const k = 7; sprK(ctx, sprSarah({}), cx - 66, b - 4, k); sprK(ctx, sprDavid({ eyes: 'happy' }), cx + 70, b - 4, k); regla(ctx, cx - w / 2 + 34, b - 4, 34 * k - 10, 3); };
  const C = (ctx, cx, b, w) => { const k = 6; sprK(ctx, alto('sarah'), cx - 56, b - 4, k); sprK(ctx, alto('david'), cx + 60, b - 4, k); regla(ctx, cx - w / 2 + 34, b - 4, 52 * k - 6, 4.5 | 0 || 4); };
  tres(ctx, [A, B, C]);
  postHD(ctx, { bloom: .2, calido: false, vin: .3, polvo: 30, polvoY: [40, 400], semilla: 17 });
};
// ---------- 18 · el rival amistoso ----------
ESCENAS['c-rival'] = ctx => {
  fondoEscenario(ctx, '#4a2a5a', '#1c1030');
  const A = (ctx, cx, b) => { sprK(ctx, RIVALES.A(), cx, b - 4, 8); ondas(ctx, cx + 150, b - 150, '#ffd046'); notaFlota(ctx, '♪', cx + 150, b - 270, NC.RE); };
  A.o = { pinta: (ctx, x, y, w, h) => { ctx.fillStyle = 'rgba(255,154,60,.12)'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(x + w / 2, y + h * .9, 80 + i * 60, Math.PI, 0); ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(255,154,60,.08)'; ctx.stroke(); } } };
  const B = (ctx, cx, b) => { sprK(ctx, RIVALES.B(), cx, b - 4, 8); notaFlota(ctx, '♫', cx + 140, b - 300, NC.FA); notaFlota(ctx, '♪', cx - 150, b - 250, NC.SOL, 40); };
  B.o = { fondo: lg(ctx, 0, 36, 0, 684, [[0, '#2f6a5a'], [1, '#18302a']]) };
  const C = (ctx, cx, b) => { sprK(ctx, RIVALES.C(), cx, b - 4, 8); notaFlota(ctx, '♪', cx - 150, b - 300, NC.SI); notaFlota(ctx, '♫', cx + 150, b - 260, NC.LA, 44); texto(ctx, '★', cx + 110, b - 380, { tam: 40, c: '#fff3b0', borde: 4 }); };
  C.o = { fondo: lg(ctx, 0, 36, 0, 684, [[0, '#4a2f7a'], [1, '#221440']]) };
  tres(ctx, [A, B, C]);
  postHD(ctx, { bloom: .2, calido: false, vin: .3, polvo: 30, polvoY: [40, 400], semilla: 18 });
};
// ---------- 19 · la familia: papá, mamá y los seis primos ----------
ESCENAS['c-familia'] = ctx => {
  // sala de la casa al atardecer
  const c = pix(LW, LH, g => { tapiz(g, 0, 0, LW, 150, '#f3d9b0', '#e8c896'); tablas(g, 0, 150, LW, 90); });
  subir(ctx, c, K3);
  sprK(ctx, sprVentanal(), 210, 330, 5); sprK(ctx, sprVentanal(), 1100, 330, 5); sprK(ctx, sprCuadro('#ffd9a8'), 650, 210, 5);
  sombras(ctx, [{ x: 260, y: 600, rx: 70, ry: 14 }, { x: 440, y: 600, rx: 70, ry: 14 }], 8);
  sprK(ctx, PAPA(), 250, 600, 7); sprK(ctx, MAMA(), 430, 600, 7);
  const primos = ['Nina', 'Josué', 'Noah', 'Samuel', 'Isaac', 'Annie'];
  primos.forEach((n, i) => {
    const x = 610 + i * 108, y = 640;
    sombras(ctx, [{ x, y, rx: 40, ry: 9 }], 6);
    sprK(ctx, PRIMOS[n](), x, y, n === 'Annie' ? 5 : 5);
    ctx.save(); rr(ctx, x - 48, y + 18, 96, 34, 17); ctx.fillStyle = 'rgba(38,23,63,.9)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
    texto(ctx, n, x, y + 36, { tam: 22, c: '#fff8ec' });
  });
  postHD(ctx, { base: 'contrast(1.06) saturate(1.1)', bloom: .25, vin: .45, polvo: 40, calidoA: .5, frioA: .3, semilla: 19, luces: [{ x: 640, y: 420, r: 500, c: 'rgba(255,205,140,.45)', modo: 'soft-light' }], rayos: [{ x: 160, y: 120, ang: -.4, ancho: 90, largo: 600 }, { x: 1060, y: 120, ang: .4, ancho: 90, largo: 600 }] });
};
