// mapa del mundo: utilidades (de los bocetos de la charla 5)
function texturaPapel(ctx, c1, c2, semilla = 3, n = 2500) {
  ctx.fillStyle = c1; ctx.fillRect(0, 0, W, H); const R = rng(semilla);
  for (let k = 0; k < n; k++) { ctx.fillStyle = R() < .5 ? 'rgba(120,80,30,.05)' : 'rgba(255,255,255,.06)'; const r = 2 + R() * 18; ctx.beginPath(); ctx.arc(R() * W, R() * H, r, 0, 7); ctx.fill(); }
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, W * .7); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function marcoIluminado(ctx, o = {}) {
  const m = o.m || 22, S = PALS5.A;
  ctx.save(); ctx.lineJoin = 'round';
  const banda = (d, c, w) => { ctx.strokeStyle = c; ctx.lineWidth = w; rr(ctx, m + d, m + d, W - 2 * (m + d), H - 2 * (m + d), 14); ctx.stroke(); };
  banda(0, S.tinta, 3); banda(6, S.tejado2[0], 9); banda(14, S.oro, 5); banda(20, S.tejado[0], 3);
  // puntitos de oro a lo largo de la banda azul
  ctx.fillStyle = S.oro2; for (let x = m + 40; x < W - m - 40; x += 26) { ctx.beginPath(); ctx.arc(x, m + 6, 2.2, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(x, H - m - 6, 2.2, 0, 7); ctx.fill(); }
  for (let y = m + 40; y < H - m - 40; y += 26) { ctx.beginPath(); ctx.arc(m + 6, y, 2.2, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(W - m - 6, y, 2.2, 0, 7); ctx.fill(); }
  // esquinas: medallón de oro con una flor de cuatro pétalos
  [[m + 10, m + 10], [W - m - 10, m + 10], [m + 10, H - m - 10], [W - m - 10, H - m - 10]].forEach(([x, y]) => {
    ctx.beginPath(); ctx.arc(x, y, 24, 0, 7); ctx.fillStyle = S.oro; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = S.tinta; ctx.stroke();
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 10, y + Math.sin(a) * 10, 8, 5, a, 0, 7); ctx.fillStyle = k % 2 ? S.tejado[0] : S.tejado2[0]; ctx.fill(); ctx.lineWidth = 1.5; ctx.stroke(); }
    ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fillStyle = S.oro2; ctx.fill(); ctx.stroke();
  });
  // ramas de vid en los bordes (sencillas)
  ctx.strokeStyle = S.pasto[1]; ctx.lineWidth = 2.5; [[m + 50, m + 34, 1], [W - m - 50, H - m - 34, -1]].forEach(([x, y, d]) => { ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 8; k++) ctx.quadraticCurveTo(x + d * (k * 40 + 20), y + (k % 2 ? 10 : -10) * d, x + d * (k + 1) * 40, y); ctx.stroke(); for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.ellipse(x + d * (k * 40 + 30), y + (k % 2 ? 9 : -9) * d, 6, 3, .6, 0, 7); ctx.fillStyle = S.pasto[0]; ctx.fill(); } });
  ctx.restore();
}
function blob(ctx, pts) { ctx.beginPath(); pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; i ? ctx.quadraticCurveTo(p[0], p[1], mx, my) : ctx.moveTo(mx, my); }); ctx.closePath(); }
function tierraAlta(ctx, pts, c1, c2, grosor = 18) {
  const S = PAL_;
  ctx.save(); blob(ctx, pts.map(p => [p[0], p[1] + grosor])); ctx.fillStyle = c2; ctx.fill(); ctx.lineWidth = S.lw; ctx.strokeStyle = S.tinta; ctx.stroke(); ctx.restore();
  ctx.save(); blob(ctx, pts); ctx.fillStyle = c1; ctx.fill(); ctx.lineWidth = S.lw; ctx.strokeStyle = S.tinta; ctx.stroke(); ctx.restore();
}
function mar(ctx, x, y, w, h, semilla = 2) {
  const S = PAL_; ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, mezcla(S.agua[0], '#fff', .25)], [1, S.agua[1]]]); ctx.fillRect(x, y, w, h);
  const R = rng(semilla); ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 2; for (let k = 0; k < 90; k++) { const a = x + R() * w, b = y + R() * h; ctx.beginPath(); ctx.arc(a, b, 7, Math.PI * 1.1, Math.PI * 1.9); ctx.arc(a + 13, b, 7, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
}
function monte(ctx, x, y, s) { const S = PAL_; ctx.save(); ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x, y - s * 1.3); ctx.lineTo(x + s, y); ctx.closePath(); ctx.fillStyle = lg(ctx, x - s, 0, x + s, 0, [[0, '#b9a8c8'], [.5, '#a090b8'], [1, '#7a6a98']]); if (S.vidrio) ctx.fillStyle = '#6a5aa0'; ctx.fill(); ctx.lineWidth = S.lw; ctx.strokeStyle = S.tinta; ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - s * .38, y - s * .8); ctx.lineTo(x, y - s * 1.3); ctx.lineTo(x + s * .38, y - s * .8); ctx.lineTo(x + s * .15, y - s * .7); ctx.lineTo(x, y - s * .85); ctx.lineTo(x - s * .15, y - s * .7); ctx.closePath(); ctx.fillStyle = '#fffaf2'; ctx.fill(); ctx.stroke(); ctx.restore(); }
function bosque(ctx, x, y, n, R) { for (let k = 0; k < n; k++) { const a = x + (R() - .5) * 90, b = y + (R() - .5) * 40; ctx.save(); ctx.beginPath(); ctx.arc(a, b, 11, 0, 7); ctx.fillStyle = PAL_.arbol[k % 2]; ctx.fill(); ctx.lineWidth = PAL_.lw * .8; ctx.strokeStyle = PAL_.tinta; ctx.stroke(); ctx.restore(); } }
function miniCiudad(ctx, x, y, s, col) {
  const g = { cx: ISO.cx, cy: ISO.cy, t: ISO.t }; ISO.t = 10 * s; ISO.cx = x; ISO.cy = y - 12 * s;
  casaIso(ctx, 0, 0, 1.4, 1.2, 1.4, { puerta: false, tejado: PAL_.tejado, oro: false }); casaIso(ctx, 1.6, .2, 1, 1, 3.2, { techo: 'torre', rh: 1.2, puerta: false, tejado: [col, mezcla(col, '#000', .3)], oro: false }); casaIso(ctx, .2, 1.5, 1.2, 1, 1.1, { puerta: false, tejado: PAL_.tejado2, oro: false });
  Object.assign(ISO, g);
}
function rosaClave(ctx, x, y, r) {
  const S = PALS5.A; ctx.save(); ctx.translate(x, y);
  for (let k = 0; k < 8; k++) { ctx.save(); ctx.rotate(k * Math.PI / 4); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r * .16, -r * (k % 2 ? .55 : .95) * .5); ctx.lineTo(0, -r * (k % 2 ? .55 : .95)); ctx.lineTo(-r * .16, -r * (k % 2 ? .55 : .95) * .5); ctx.closePath(); ctx.fillStyle = k % 2 ? S.tejado2[0] : S.oro; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = S.tinta; ctx.stroke(); ctx.restore(); }
  ctx.beginPath(); ctx.arc(0, 0, r * .42, 0, 7); ctx.fillStyle = '#fbf1d8'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = S.oro; ctx.stroke();
  ctx.restore(); clave(ctx, 'sol', x - r * .2, y - r * .3, r * .085, S.tejado[0]);
}
function serpienteMarina(ctx, x, y, s, c = '#5fb8a0') { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineWidth = 3; ctx.strokeStyle = PAL_.tinta;
  [[-50, 0], [-15, 0], [20, 0]].forEach(([dx]) => { ctx.beginPath(); ctx.arc(dx, 4, 14, Math.PI, 0); ctx.fillStyle = c; ctx.fill(); ctx.stroke(); });
  ctx.beginPath(); ctx.ellipse(52, -12, 18, 15, 0, 0, 7); ctx.fillStyle = c; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(58, -16, 3.5, 0, 7); ctx.fillStyle = PAL_.tinta; ctx.fill(); ctx.beginPath(); ctx.arc(52, -6, 6, .2, Math.PI - .2); ctx.stroke(); ctx.beginPath(); ctx.ellipse(44, -8, 4, 2.5, 0, 0, 7); ctx.fillStyle = '#ff9fb4'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(40, -26); ctx.lineTo(46, -38); ctx.lineTo(52, -27); ctx.lineTo(58, -38); ctx.lineTo(62, -24); ctx.fillStyle = '#ffd046'; ctx.fill(); ctx.stroke(); ctx.restore(); }
function ballena(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineWidth = 3; ctx.strokeStyle = PAL_.tinta; ctx.beginPath(); ctx.moveTo(-40, 0); ctx.quadraticCurveTo(-30, -36, 10, -30); ctx.quadraticCurveTo(44, -26, 40, 0); ctx.closePath(); ctx.fillStyle = '#6a8ad8'; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(-58, -16); ctx.lineTo(-56, 6); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(20, -14, 3.5, 0, 7); ctx.fillStyle = PAL_.tinta; ctx.fill(); ctx.strokeStyle = '#bfe8ff'; ctx.lineWidth = 3; [-8, 0, 8].forEach(d => { ctx.beginPath(); ctx.moveTo(6, -32); ctx.quadraticCurveTo(6 + d, -48, 6 + d * 1.8, -54); ctx.stroke(); }); ctx.restore(); }
function barco(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineWidth = 2.5; ctx.strokeStyle = PAL_.tinta; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.lineTo(20, 14); ctx.lineTo(-20, 14); ctx.closePath(); ctx.fillStyle = '#9a6038'; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -44); ctx.stroke(); ctx.beginPath(); ctx.moveTo(2, -42); ctx.quadraticCurveTo(26, -24, 2, -6); ctx.closePath(); ctx.fillStyle = '#fbf1d8'; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -44); ctx.lineTo(14, -40); ctx.lineTo(0, -36); ctx.fillStyle = PALS5.A.tejado[0]; ctx.fill(); ctx.restore(); }

function caminoPentagrama(ctx, P, gap, o = {}) {
  const N = 140, pts = [], nor = [];
  for (let k = 0; k <= N; k++) { const t = k / N; pts.push(bez(P, t)); }
  for (let k = 0; k <= N; k++) { const a = pts[Math.max(0, k - 1)], b = pts[Math.min(N, k + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); nor.push([dy / l, -dx / l]); }   // normal "hacia arriba"
  const linea = off => pts.map((p, k) => [p[0] + nor[k][0] * off, p[1] + nor[k][1] * off]);
  // cinta de camino (tierra) bajo las líneas
  ctx.save(); ctx.beginPath(); linea(2.6 * gap).forEach((p, k) => k ? ctx.lineTo(...p) : ctx.moveTo(...p)); linea(-2.6 * gap).reverse().forEach(p => ctx.lineTo(...p)); ctx.closePath(); ctx.fillStyle = o.cinta || 'rgba(251,241,216,.92)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = o.bordeCinta || 'rgba(58,36,20,.5)'; ctx.stroke(); ctx.restore();
  for (let q = -2; q <= 2; q++) { ctx.save(); ctx.beginPath(); linea(q * gap).forEach((p, k) => k ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.lineWidth = o.lw || 3; ctx.strokeStyle = o.linea || PALS5.A.tinta; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
  const at = (t, step) => { const k = Math.round(t * N), off = (step - 4) / 2 * gap; return [pts[k][0] + nor[k][0] * off, pts[k][1] + nor[k][1] * off, Math.atan2(pts[Math.min(N, k + 1)][1] - pts[Math.max(0, k - 1)][1], pts[Math.min(N, k + 1)][0] - pts[Math.max(0, k - 1)][0]), nor[k]]; };
  return { at, pts, nor };
}
function bez(P, t) { const [a, b, c, d] = P, u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]; }
