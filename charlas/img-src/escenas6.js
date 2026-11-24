// =====================================================================
//  Charla 5 · paletas (pal-a..d), mapas, heráldica, llave, ciudad tipo, edificios
// =====================================================================
function texturaPapel(ctx, c1, c2, semilla = 3, n = 2500) {
  ctx.fillStyle = c1; ctx.fillRect(0, 0, W, H); const R = rng(semilla);
  for (let k = 0; k < n; k++) { ctx.fillStyle = R() < .5 ? 'rgba(120,80,30,.05)' : 'rgba(255,255,255,.06)'; const r = 2 + R() * 18; ctx.beginPath(); ctx.arc(R() * W, R() * H, r, 0, 7); ctx.fill(); }
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, W * .7); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
// marco de manuscrito iluminado: bandas de ultramar y bermellón, filete de oro, esquinas con flores y una inicial
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
// la misma esquina de ciudad en la paleta dada
function esquinaCiudad(ctx, clave) {
  PAL_ = PALS5[clave]; const S = PAL_;
  ISO.t = 50; ISO.cx = 640; ISO.cy = 232;
  // fondo
  if (clave === 'A') texturaPapel(ctx, S.papel, 'rgba(150,100,40,.35)', 3);
  else if (clave === 'B') { ctx.fillStyle = S.papel; ctx.fillRect(0, 0, W, H); const R = rng(8); for (let k = 0; k < 70; k++) { const x = R() * W, y = R() * H, r = 40 + R() * 90; ctx.beginPath(); for (let q = 0; q < 6; q++) { const a = q / 6 * Math.PI * 2 + R(); ctx.lineTo(x + Math.cos(a) * r * (.6 + R() * .4), y + Math.sin(a) * r * (.6 + R() * .4)); } ctx.closePath(); ctx.fillStyle = ['#3a1a4a', '#1a2a5a', '#3a1a2a', '#1a3a3a'][k % 4]; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#0c0810'; ctx.stroke(); } }
  else if (clave === 'C') { texturaPapel(ctx, S.papel, 'rgba(120,90,50,.3)', 5, 1500); ctx.save(); ctx.filter = 'blur(30px)'; [[300, 160, '#b8d4d0'], [980, 140, '#e8d0a0'], [640, 620, '#d0c0e0']].forEach(([x, y, c]) => { ctx.fillStyle = c; ctx.globalAlpha = .55; ctx.beginPath(); ctx.ellipse(x, y, 300, 120, 0, 0, 7); ctx.fill(); }); ctx.restore(); ctx.globalAlpha = 1; }
  else { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#7fd0ff'); g.addColorStop(1, '#c8f0ff'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); [[220, 120], [1050, 90]].forEach(([x, y]) => nube(ctx, x, y, 50)); }
  // diorama
  const N = 9;
  borde(ctx, 0, 0, N, N, .7, [mezcla(S.suelo[1], '#000', .2), mezcla(S.suelo[1], '#000', .35)]);
  sueloIso(ctx, 0, 0, N, N, [S.pasto[0], mezcla(S.pasto[0], S.pasto[1], .3)]);
  sueloIso(ctx, 0, 4, N, 3, [S.piedra[0], mezcla(S.piedra[0], S.piedra[1], .5)]);   // la calle
  sueloIso(ctx, 3, 3, 4, 1, S.suelo);   // la acera de la plaza
  // casas al fondo
  casaIso(ctx, 0.3, 0.4, 2.6, 2.4, 2.2, { gablete: true, tejado: S.tejado, simbolo: 'libro' });
  casaIso(ctx, 3.3, 0.2, 2.6, 2.6, 2.9, { gablete: true, tejado: S.tejado2, simbolo: 'coro' });
  casaIso(ctx, 6.3, 0.5, 2.4, 2.3, 2.0, { tejado: S.tejado, simbolo: 'arbol' });
  fuenteIso(ctx, 7.2, 7.8, .9);
  arbolIso(ctx, 0.9, 8.2, 1.1); arbolIso(ctx, 8.4, 3.6, .9);
  pjIso(ctx, sprSarah({}), 3.6, 6.2); pjIso(ctx, sprDavid({ eyes: 'happy' }), 5, 6.0); pjIso(ctx, sprRobotB({ ojos: 'feliz', ang: .4 }), 6.4, 5.0, 3, { z: .9 });
  // acabado por paleta
  if (clave === 'A') marcoIluminado(ctx);
  if (clave === 'B') { postHD(ctx, { bloom: .4, bloomF: 'blur(12px) brightness(1.1) saturate(1.6)', calido: false, vin: .45, polvo: 20, semilla: 4 }); ctx.save(); ctx.lineWidth = 26; ctx.strokeStyle = '#0c0810'; ctx.strokeRect(13, 13, W - 26, H - 26); const cols = ['#c8183f', '#2f5fd0', '#1aa86a', '#e8a10c', '#7a2fa0']; for (let k = 0; k < 40; k++) { ctx.fillStyle = cols[k % 5]; const x = (k % 20) * 64 + 6; const y = k < 20 ? 6 : H - 18; ctx.fillRect(x + 4, y, 54, 12); } ctx.restore(); }
  if (clave === 'C') { ctx.save(); ctx.strokeStyle = 'rgba(74,50,32,.6)'; ctx.lineWidth = 2; rr(ctx, 26, 26, W - 52, H - 52, 4); ctx.stroke(); ctx.lineWidth = 1; rr(ctx, 34, 34, W - 68, H - 68, 4); ctx.stroke(); ctx.restore(); }
}
['A', 'B', 'C', 'D'].forEach(k => { ESCENAS['pal-' + k.toLowerCase()] = ctx => esquinaCiudad(ctx, k); });

// ---------- mapas ----------
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

// el camino-pentagrama: espina, normales y las cinco líneas
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
function mapaPentagrama(ctx, clave5 = 'A') {
  PAL_ = PALS5[clave5]; const S = PAL_, R = rng(61);
  if (clave5 === 'A') texturaPapel(ctx, S.papel, 'rgba(150,100,40,.35)', 9); else { ctx.fillStyle = S.papel; ctx.fillRect(0, 0, W, H); }
  mar(ctx, 40, 40, W - 80, H - 80, 3);
  // el continente (con grosor) y una isla
  const verde = clave5 === 'A' ? lg(ctx, 0, 90, 0, 650, [[0, '#a8d08a'], [.6, '#8cc47a'], [1, '#6fae6a']]) : mezcla(S.pasto[0], '#fff', .15);
  tierraAlta(ctx, [[110, 520], [160, 330], [330, 230], [520, 200], [700, 120], [930, 90], [1150, 130], [1210, 300], [1120, 420], [980, 500], [820, 610], [600, 650], [380, 640], [180, 640]], verde, clave5 === 'A' ? '#8a6a3a' : mezcla(S.pasto[1], '#000', .25), 22);
  tierraAlta(ctx, [[1000, 560], [1100, 540], [1170, 600], [1120, 650], [1020, 640]], verde, clave5 === 'A' ? '#8a6a3a' : mezcla(S.pasto[1], '#000', .25), 14);
  // campos de labranza (parcelas) y ovejitas
  [[300, 450, '#e8d68a'], [380, 470, '#c8dc8a'], [880, 440, '#e8d68a'], [960, 420, '#d8c87a'], [520, 520, '#c8dc8a'], [1040, 330, '#e8d68a'], [400, 280, '#d8e8a0']].forEach(([x, y, c]) => { ctx.save(); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 60, y - 20); ctx.lineTo(x + 100, y); ctx.lineTo(x + 40, y + 20); ctx.closePath(); ctx.fillStyle = S.vidrio ? mezcla(c, '#000', .2) : c; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = S.tinta; ctx.stroke(); ctx.clip(); ctx.strokeStyle = 'rgba(90,60,20,.3)'; for (let k = -6; k < 8; k++) { ctx.beginPath(); ctx.moveTo(x + k * 12, y + 30); ctx.lineTo(x + k * 12 + 60, y - 30); ctx.stroke(); } ctx.restore(); });
  [[340, 520], [356, 528], [930, 470]].forEach(([x, y]) => { elip(ctx, x, y, 7, 5, '#fffaf2'); ctx.strokeStyle = S.tinta; ctx.lineWidth = 1.5; ctx.stroke(); elip(ctx, x + 6, y - 1, 3, 3, S.tinta); });
  // ríos, montes, bosques
  ctx.save(); ctx.strokeStyle = S.agua[0]; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(760, 140); ctx.bezierCurveTo(720, 260, 860, 330, 820, 600); ctx.stroke(); ctx.restore();
  [[980, 210, 40], [1040, 222, 34], [930, 240, 28], [1090, 236, 26], [280, 330, 34], [330, 345, 28], [380, 350, 22], [610, 210, 30], [650, 220, 24]].forEach(a => monte(ctx, ...a));
  [[470, 300], [1090, 380], [250, 560], [700, 540], [560, 300]].forEach(([x, y]) => bosque(ctx, x, y, 7, R));
  // el camino-pentagrama
  const C = caminoPentagrama(ctx, [[150, 580], [420, 600], [480, 260], [760, 330], ].concat([]).slice(0, 4), 0, {}) && null;
  const spine = [[190, 560], [470, 620], [600, 250], [1130, 230]];
  const K = caminoPentagrama(ctx, spine, 17, { linea: clave5 === 'A' ? S.tinta : '#0c0810', cinta: clave5 === 'A' ? 'rgba(251,241,216,.95)' : 'rgba(255,230,160,.35)' });
  // clave de sol dorada al inicio del camino
  const c0 = K.at(0.02, 4); ctx.save(); ctx.translate(c0[0], c0[1]); ctx.rotate(c0[2]); clave(ctx, 'sol', -14, -2 * 17 - 6, 17, S.oro); ctx.restore();
  // ciudades = notas de «Estrellita»: DO DO SOL SOL LA LA SOL (y la ciudad de mañana en niebla)
  const notas = [[.15, -2, NC.DO], [.26, -2, NC.DO], [.38, 2, NC.SOL], [.5, 2, NC.SOL], [.62, 3, NC.LA], [.74, 3, NC.LA], [.88, 2, NC.SOL]];
  notas.forEach(([t, step, col], i) => {
    const [x, y, ang, n] = K.at(t, step);
    if (step <= -2) { const [lx, ly] = K.at(t, -2); ctx.save(); ctx.translate(lx, ly); ctx.rotate(ang); ctx.lineWidth = 3; ctx.strokeStyle = S.tinta; ctx.beginPath(); ctx.moveTo(-32, 0); ctx.lineTo(32, 0); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang - .35); ctx.beginPath(); ctx.ellipse(0, 0, 26, 17, 0, 0, 7); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = S.tinta; ctx.stroke(); ctx.beginPath(); ctx.ellipse(-8, -6, 8, 4, -.2, 0, 7); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fill(); ctx.restore();
    miniCiudad(ctx, x - 6, y - 4, 1.05, col);
    if (i > 4) { ctx.save(); ctx.filter = 'blur(14px)'; ctx.globalAlpha = .5; ctx.fillStyle = '#f4eefa'; [[-30, -20, 50], [20, -40, 46], [10, 10, 40]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx, y + dy, r, 0, 7); ctx.fill(); }); ctx.restore(); }
  });
  // la barra final del pentagrama (puerta a la región siguiente)
  const [bx, by, ba] = K.at(.97, 4); ctx.save(); ctx.translate(bx, by); ctx.rotate(ba); ctx.fillStyle = S.tinta; ctx.fillRect(-2, -2 * 17, 4, 4 * 17); ctx.fillRect(6, -2 * 17, 8, 4 * 17); ctx.restore();
  // Sarah, David y Tic en la primera ciudad
  sprK(ctx, sprSarah({}), 250, 500, 2.2); sprK(ctx, sprDavid({}), 284, 506, 2.2); sprK(ctx, sprRobotB({ ojos: 'feliz' }), 318, 476, 2.2);
  // mar con su vida
  barco(ctx, 980, 680 - 30, 1); serpienteMarina(ctx, 200, 150, 1); ballena(ctx, 540, 690 - 40, .9);
  rosaClave(ctx, 1160, 600, 60);
  if (clave5 === 'A') { postHD(ctx, { bloom: .18, calidoA: .45, frioA: .2, vin: .35, polvo: 30, semilla: 6 }); marcoIluminado(ctx); }
  return K;
}
ESCENAS['mapa-b'] = ctx => mapaPentagrama(ctx, 'A');
ESCENAS['mapa-c'] = ctx => {
  mapaPentagrama(ctx, 'B');
  // plomos del vitral: grietas que reparten el mapa en vidrios
  const R = rng(12); ctx.save(); ctx.strokeStyle = '#0c0810'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let k = 0; k < 140; k++) { let x = R() * W, y = R() * H; ctx.beginPath(); ctx.moveTo(x, y); for (let q = 0; q < 3; q++) { x += (R() - .5) * 120; y += (R() - .5) * 120; ctx.lineTo(x, y); } ctx.globalAlpha = .55; ctx.stroke(); }
  ctx.restore(); ctx.globalAlpha = 1;
  postHD(ctx, { bloom: .45, bloomF: 'blur(14px) brightness(1.1) saturate(1.7)', calido: false, vin: .5, polvo: 25, semilla: 13, rayos: [{ x: 300, y: -80, ang: -.4, ancho: 180, largo: 900, c: 'rgba(255,240,200,.25)' }] });
  ctx.save(); ctx.lineWidth = 26; ctx.strokeStyle = '#0c0810'; rr(ctx, 13, 13, W - 26, H - 26, 30); ctx.stroke(); ctx.restore();
  // arco gótico superior del vitral
  ctx.save(); ctx.fillStyle = '#0c0810'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, 120); ctx.quadraticCurveTo(W * .75, 10, W / 2, 0); ctx.quadraticCurveTo(W * .25, 10, 0, 120); ctx.closePath(); ctx.globalAlpha = .7; ctx.fill(); ctx.restore();
};
// ---------- 5 · mapamundi iluminado ----------
ESCENAS['mapa-a'] = ctx => {
  PAL_ = PALS5.A; const S = PAL_, R = rng(71);
  texturaPapel(ctx, S.papel, 'rgba(150,100,40,.35)', 11); mar(ctx, 40, 40, W - 80, H - 80, 5);
  const islas = [
    { pts: [[120, 200], [260, 130], [400, 170], [420, 290], [300, 340], [150, 310]], c: NC.DO, x: 270, y: 240 },
    { pts: [[520, 140], [700, 90], [860, 130], [880, 260], [720, 300], [560, 260]], c: NC.MI, x: 700, y: 200 },
    { pts: [[960, 180], [1120, 150], [1200, 260], [1130, 360], [990, 330]], c: NC.FA, x: 1080, y: 260 },
    { pts: [[180, 450], [340, 410], [480, 470], [430, 600], [250, 620], [160, 560]], c: NC.SOL, x: 320, y: 520 },
    { pts: [[600, 430], [800, 400], [900, 480], [830, 600], [640, 610], [570, 530]], c: NC.LA, x: 740, y: 510 },
  ];
  // ruta punteada entre islas
  ctx.save(); ctx.setLineDash([10, 10]); ctx.lineWidth = 4; ctx.strokeStyle = S.tejado[0]; ctx.beginPath(); islas.forEach((s, i) => i ? ctx.lineTo(s.x, s.y + 20) : ctx.moveTo(s.x, s.y + 20)); ctx.stroke(); ctx.restore();
  islas.forEach((s, i) => { tierraAlta(ctx, s.pts, mezcla(S.pasto[0], '#fff', .2), mezcla(S.pasto[1], '#000', .25), 18); bosque(ctx, s.x - 80, s.y + 20, 4, R); if (i % 2) monte(ctx, s.x + 90, s.y + 10, 26); miniCiudad(ctx, s.x, s.y + 20, 1.3, s.c); });
  serpienteMarina(ctx, 560, 380, 1.1); ballena(ctx, 1000, 520, 1); barco(ctx, 480, 330, .9); barco(ctx, 960, 420, .8);
  rosaClave(ctx, 1120, 600, 70);
  pjIso && sprK(ctx, sprRobotB({ ojos: 'feliz' }), 230, 300, 2);
  postHD(ctx, { bloom: .18, calidoA: .45, frioA: .2, vin: .35, polvo: 30, semilla: 6 });
  marcoIluminado(ctx);
  // inicial iluminada (sin texto largo): una «M» de mundo dentro de un cuadro de oro
  ctx.save(); rr(ctx, 70, 600, 70, 70, 8); ctx.fillStyle = S.tejado2[0]; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = S.oro; ctx.stroke(); ctx.restore(); texto(ctx, 'M', 105, 637, { tam: 54, c: S.oro, fuente: 'FreeSerif' });
};
