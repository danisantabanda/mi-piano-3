// =====================================================================
//  Charla 5 · heráldica, insignias, llave, ciudad tipo, edificios por época
// =====================================================================
const ESCUDOS = [
  ['metronomo', '#2a4b9b', '#d9a930'], ['guido', '#d2452e', '#fbf1d8'], ['organo', '#2e8b6a', '#d9a930'], ['cuaderno', '#7a2fa0', '#fbf1d8'], ['minueto', '#2a4b9b', '#fbf1d8'],
  ['violin', '#d2452e', '#d9a930'], ['pianoforte', '#3a2414', '#d9a930'], ['tiple', '#2e8b6a', '#fbf1d8'], ['espiga', '#c98a12', '#2a4b9b'], ['lira', '#2a4b9b', '#d9a930'],
];
function formaEscudo(ctx, x, y, w, h) { ctx.beginPath(); ctx.moveTo(x - w / 2, y - h / 2); ctx.lineTo(x + w / 2, y - h / 2); ctx.lineTo(x + w / 2, y + h * .05); ctx.quadraticCurveTo(x + w / 2, y + h * .38, x, y + h / 2); ctx.quadraticCurveTo(x - w / 2, y + h * .38, x - w / 2, y + h * .05); ctx.closePath(); }
function iconoHeraldico(ctx, tipo, x, y, s, c) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = c; ctx.strokeStyle = c; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const L = (pts) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke(); };
  if (tipo === 'metronomo') { ctx.beginPath(); ctx.moveTo(-16, 30); ctx.lineTo(-8, -30); ctx.lineTo(8, -30); ctx.lineTo(16, 30); ctx.closePath(); ctx.stroke(); L([[0, 24], [12, -22]]); ctx.fillRect(4, -8, 10, 7); }
  if (tipo === 'guido') { ctx.beginPath(); ctx.moveTo(-18, 32); ctx.lineTo(-18, 0); ctx.lineTo(-24, -10); ctx.moveTo(-18, 0); ctx.stroke(); [[-12, -30], [-3, -36], [6, -33], [14, -24]].forEach(([fx, fy]) => L([[fx, 2], [fx, fy]])); L([[-18, 32], [16, 32], [16, 0]]); [[-12, -20], [-3, -26], [6, -22], [14, -14], [-3, -8]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a, b, 2.5, 0, 7); ctx.fill(); }); }
  if (tipo === 'organo') { [-24, -12, 0, 12, 24].forEach((px, k) => { const h = 50 - Math.abs(k - 2) * 10; ctx.strokeRect(px - 4, 26 - h, 8, h); ctx.beginPath(); ctx.moveTo(px - 4, 14); ctx.lineTo(px + 4, 14); ctx.stroke(); }); L([[-30, 28], [30, 28]]); }
  if (tipo === 'cuaderno') { ctx.strokeRect(-24, -26, 48, 54); L([[-24, -26], [-24, 28]]); for (let k = 0; k < 4; k++) L([[-14, -14 + k * 9], [18, -14 + k * 9]]); ctx.beginPath(); ctx.ellipse(-4, 8, 4, 3, -.4, 0, 7); ctx.fill(); L([[0, 8], [0, -10]]); }
  if (tipo === 'minueto') { [[-14, 1], [14, -1]].forEach(([px, d]) => { ctx.beginPath(); ctx.arc(px, -22, 7, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(px - 10, 30); ctx.lineTo(px, -12); ctx.lineTo(px + 10, 30); ctx.closePath(); ctx.fill(); }); L([[-8, -4], [8, -4]]); }
  if (tipo === 'violin') { ctx.beginPath(); ctx.ellipse(0, 14, 13, 15, 0, 0, 7); ctx.ellipse(0, -10, 10, 11, 0, 0, 7); ctx.stroke(); L([[0, -21], [0, -38]]); L([[-26, 28], [26, -30]]); }
  if (tipo === 'pianoforte') { ctx.beginPath(); ctx.moveTo(-30, -6); ctx.lineTo(10, -6); ctx.quadraticCurveTo(30, -6, 30, 14); ctx.lineTo(-30, 14); ctx.closePath(); ctx.stroke(); for (let k = -26; k < 10; k += 6) L([[k, 14], [k, 22]]); L([[-24, 14], [-24, 30]]); L([[22, 14], [22, 30]]); L([[-30, -6], [0, -30]]); }
  if (tipo === 'tiple') { ctx.beginPath(); ctx.moveTo(-34, 30); ctx.lineTo(-10, -10); ctx.lineTo(4, 8); ctx.lineTo(14, -2); ctx.lineTo(34, 30); ctx.closePath(); ctx.globalAlpha = .45; ctx.fill(); ctx.globalAlpha = 1; ctx.beginPath(); ctx.ellipse(0, 16, 11, 12, 0, 0, 7); ctx.stroke(); L([[0, 4], [0, -34]]); ctx.beginPath(); ctx.arc(0, 16, 3, 0, 7); ctx.fill(); }
  if (tipo === 'espiga') { L([[-14, 32], [-14, -30]]); for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.ellipse(-20, -22 + k * 10, 6, 3, -.6, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(-8, -22 + k * 10, 6, 3, .6, 0, 7); ctx.fill(); } ctx.beginPath(); ctx.ellipse(14, 14, 9, 11, 0, 0, 7); ctx.ellipse(14, -4, 7, 8, 0, 0, 7); ctx.stroke(); L([[14, -12], [14, -30]]); }
  if (tipo === 'lira') { L([[-6, -34], [6, -34]]); L([[0, -40], [0, -24]]); ctx.beginPath(); ctx.moveTo(-18, -16); ctx.quadraticCurveTo(-30, 20, -6, 30); ctx.lineTo(6, 30); ctx.quadraticCurveTo(30, 20, 18, -16); ctx.stroke(); L([[-18, -16], [18, -16]]); [-8, 0, 8].forEach(k => L([[k, -16], [k, 26]])); }
  ctx.restore();
}
function escudo(ctx, k, x, y, s = 1, o = {}) {
  const [tipo, c1, c2] = ESCUDOS[k], w = 120 * s, h = 140 * s;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 10 * s; ctx.shadowOffsetY = 4 * s; formaEscudo(ctx, x, y, w + 14 * s, h + 14 * s); ctx.fillStyle = '#d9a930'; ctx.fill(); ctx.restore();
  ctx.save(); formaEscudo(ctx, x, y, w + 14 * s, h + 14 * s); ctx.lineWidth = 3 * s; ctx.strokeStyle = '#3a2414'; ctx.stroke(); formaEscudo(ctx, x, y, w, h); ctx.fillStyle = c1; ctx.fill(); ctx.clip();
  // partición: una franja diagonal suave y un brillo
  ctx.fillStyle = mezcla(c1, '#ffffff', .12); ctx.beginPath(); ctx.moveTo(x - w / 2, y - h / 2); ctx.lineTo(x + w / 2, y - h / 2); ctx.lineTo(x - w / 2, y + h * .2); ctx.fill();
  const g = ctx.createLinearGradient(x - w / 2, y - h / 2, x + w / 2, y + h / 2); g.addColorStop(0, 'rgba(255,255,255,.25)'); g.addColorStop(.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.2)'); ctx.fillStyle = g; ctx.fillRect(x - w, y - h, w * 2, h * 2);
  ctx.restore();
  ctx.save(); formaEscudo(ctx, x, y, w, h); ctx.lineWidth = 2.5 * s; ctx.strokeStyle = '#3a2414'; ctx.stroke(); ctx.restore();
  iconoHeraldico(ctx, tipo, x, y + 2 * s, s * 1.05, c2);
}
// ---------- 8 · heráldica: 10 escudos en 5×2 ----------
ESCENAS['heraldica'] = ctx => {
  PAL_ = PALS5.A; texturaPapel(ctx, '#f3e3bc', 'rgba(150,100,40,.35)', 21);
  for (let k = 0; k < 10; k++) { const x = 168 + (k % 5) * 236, y = 210 + Math.floor(k / 5) * 290; escudo(ctx, k, x, y, 1.35); // cinta bajo cada escudo
    ctx.save(); ctx.beginPath(); ctx.moveTo(x - 80, y + 118); ctx.lineTo(x + 80, y + 118); ctx.lineTo(x + 92, y + 132); ctx.lineTo(x + 80, y + 146); ctx.lineTo(x - 80, y + 146); ctx.lineTo(x - 92, y + 132); ctx.closePath(); ctx.fillStyle = '#d2452e'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = '#3a2414'; ctx.stroke(); ctx.restore();
    texto(ctx, String(k + 1), x, y + 133, { tam: 20, c: '#fbf1d8', fuente: 'FreeSerif' }); }
  marcoIluminado(ctx);
};
// ---------- 19 · insignias en su estuche ----------
function medalla(ctx, k, x, y, r, ganada) {
  ctx.save(); if (!ganada) ctx.filter = 'grayscale(1) brightness(.45)';
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5; ctx.beginPath(); for (let q = 0; q < 24; q++) { const a = q / 24 * Math.PI * 2, rr2 = q % 2 ? r * .92 : r; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } ctx.closePath(); ctx.fillStyle = '#e6a21b'; ctx.fill(); ctx.restore();
  ctx.beginPath(); ctx.arc(x, y, r * .82, 0, 7); const g = ctx.createRadialGradient(x - r * .3, y - r * .3, 0, x, y, r); g.addColorStop(0, '#fff3b0'); g.addColorStop(.5, '#ffd046'); g.addColorStop(1, '#b87a10'); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#3a2414'; ctx.stroke();
  escudo(ctx, k, x, y + 2, r / 120 * 1.15);
  if (ganada) { ctx.globalCompositeOperation = 'screen'; ctx.beginPath(); ctx.ellipse(x - r * .35, y - r * .4, r * .25, r * .1, -.6, 0, 7); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill(); }
  ctx.restore();
}
ESCENAS['insignias'] = ctx => {
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#3a2414'], [1, '#1c0e06']]); ctx.fillRect(0, 0, W, H);
  // estuche abierto: tapa arriba (con el escudo grabado) y fondo de terciopelo
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30; rr(ctx, 90, 40, 1100, 140, 24); ctx.fillStyle = lg(ctx, 0, 40, 0, 180, [[0, '#8a4a24'], [1, '#5a2e14']]); ctx.fill(); ctx.restore();
  ctx.save(); rr(ctx, 90, 40, 1100, 140, 24); ctx.lineWidth = 5; ctx.strokeStyle = '#d9a930'; ctx.stroke(); ctx.restore();
  rr(ctx, 130, 70, 1020, 80, 16); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill(); clave(ctx, 'sol', 610, 80, 12, '#d9a930'); texto(ctx, '3 / 10', 760, 110, { tam: 40, c: '#ffd046', fuente: 'FreeSerif' });
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30; rr(ctx, 90, 200, 1100, 490, 26); ctx.fillStyle = '#7a4a24'; ctx.fill(); ctx.restore();
  rr(ctx, 120, 226, 1040, 440, 18); ctx.fillStyle = lg(ctx, 0, 226, 0, 666, [[0, '#2a3a8a'], [1, '#1a2460']]); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#d9a930'; ctx.stroke();
  for (let k = 0; k < 10; k++) { const x = 230 + (k % 5) * 205, y = 340 + Math.floor(k / 5) * 210; ctx.beginPath(); ctx.arc(x, y + 4, 82, 0, 7); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fill(); medalla(ctx, k, x, y, 74, k < 3); if (k >= 3) { ctx.save(); ctx.globalAlpha = .9; texto(ctx, '?', x, y + 4, { tam: 54, c: 'rgba(255,255,255,.35)', fuente: 'FreeSerif' }); ctx.restore(); } }
  postHD(ctx, { bloom: .25, calido: false, vin: .45, polvo: 30, polvoY: [200, 700], semilla: 19 });
};
// ---------- 9 · la llave: puerta con cerradura de clave de sol ----------
ESCENAS['llave'] = ctx => {
  PAL_ = PALS5.A; const S = PAL_;
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#8fc8f0'], [1, '#f6e4c4']]); ctx.fillRect(0, 0, W, H); nube(ctx, 200, 110, 60); nube(ctx, 1080, 90, 50);
  // muralla de piedra
  ctx.fillStyle = lg(ctx, 0, 120, 0, 720, [[0, '#e6d8bc'], [1, '#c8b48e']]); ctx.fillRect(0, 150, W, 570);
  ctx.strokeStyle = 'rgba(90,60,30,.35)'; ctx.lineWidth = 3; for (let y = 180; y < 720; y += 44) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); for (let x = ((y / 44) % 2) * 60; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 44); ctx.stroke(); } }
  for (let x = 0; x < W; x += 100) { ctx.fillStyle = '#e6d8bc'; ctx.fillRect(x, 110, 60, 50); ctx.strokeRect(x, 110, 60, 50); }
  // torres a los lados con estandartes
  [[120, '#d2452e'], [1160, '#2a4b9b']].forEach(([x, c]) => { ctx.fillStyle = '#ddcca8'; ctx.fillRect(x - 70, 60, 140, 660); ctx.strokeStyle = S.tinta; ctx.lineWidth = 3; ctx.strokeRect(x - 70, 60, 140, 660); ctx.beginPath(); ctx.moveTo(x - 86, 70); ctx.lineTo(x, -40); ctx.lineTo(x + 86, 70); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ctx.stroke(); ventanaArco(ctx, (u, v) => [x - 20 + u * 40, 300 - v * 70], 0, 0, 1, 1, '#2a4b9b'); ctx.fillStyle = c; ctx.fillRect(x - 40, 400, 80, 140); ctx.strokeRect(x - 40, 400, 80, 140); iconoHeraldico(ctx, 'lira', x, 466, .9, '#d9a930'); });
  // el gran portón de madera en arco
  ctx.save(); ctx.beginPath(); ctx.moveTo(400, 720); ctx.lineTo(400, 360); ctx.arc(640, 360, 240, Math.PI, 0); ctx.lineTo(880, 720); ctx.closePath(); ctx.fillStyle = '#c8b48e'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = S.tinta; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.moveTo(430, 720); ctx.lineTo(430, 370); ctx.arc(640, 370, 210, Math.PI, 0); ctx.lineTo(850, 720); ctx.closePath(); ctx.fillStyle = lg(ctx, 430, 0, 850, 0, [[0, '#8a4a24'], [.5, '#a8603a'], [1, '#7a3e1e']]); ctx.fill(); ctx.lineWidth = 5; ctx.stroke(); ctx.clip();
  for (let x = 430; x < 850; x += 52) { ctx.strokeStyle = 'rgba(40,20,10,.45)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, 150); ctx.lineTo(x, 720); ctx.stroke(); }
  [300, 470, 640].forEach(y => { ctx.fillStyle = '#3a2a2a'; ctx.fillRect(430, y, 420, 18); for (let x = 450; x < 850; x += 60) { ctx.beginPath(); ctx.arc(x, y + 9, 5, 0, 7); ctx.fillStyle = '#d9a930'; ctx.fill(); } });
  ctx.restore(); ctx.fillStyle = S.tinta; ctx.fillRect(637, 160, 6, 560);
  // cerradura: placa dorada con el ojo en forma de clave de sol
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 14; rr(ctx, 560, 400, 160, 220, 24); ctx.fillStyle = lg(ctx, 560, 400, 720, 620, [[0, '#ffe68a'], [.5, '#d9a930'], [1, '#a8780e']]); ctx.fill(); ctx.restore(); rr(ctx, 560, 400, 160, 220, 24); ctx.lineWidth = 4; ctx.strokeStyle = S.tinta; ctx.stroke();
  clave(ctx, 'sol', 606, 470, 20, '#1c0e06');
  // la llave dorada flotando, con brillo
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const gg = ctx.createRadialGradient(900, 260, 0, 900, 260, 180); gg.addColorStop(0, 'rgba(255,240,170,.9)'); gg.addColorStop(1, 'rgba(255,240,170,0)'); ctx.fillStyle = gg; ctx.fillRect(700, 60, 400, 400); ctx.restore();
  ctx.save(); ctx.translate(900, 260); ctx.rotate(-.5); ctx.lineWidth = 4; ctx.strokeStyle = S.tinta; const oro = lg(ctx, -60, -30, 120, 30, [[0, '#fff3b0'], [.5, '#ffd046'], [1, '#c98a12']]);
  ctx.beginPath(); ctx.arc(-70, 0, 38, 0, 7); ctx.fillStyle = oro; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(-70, 0, 18, 0, 7); ctx.fillStyle = '#8fc8f0'; ctx.fill(); ctx.stroke();
  ctx.fillStyle = oro; ctx.fillRect(-34, -9, 150, 18); ctx.strokeRect(-34, -9, 150, 18); ctx.fillRect(80, 9, 14, 26); ctx.strokeRect(80, 9, 14, 26); ctx.fillRect(100, 9, 14, 18); ctx.strokeRect(100, 9, 14, 18);
  ctx.restore(); clave(ctx, 'sol', 815, 228, 5.5, '#3a2414');
  for (let k = 0; k < 6; k++) estrella(ctx, 800 + Math.cos(k) * 170, 260 + Math.sin(k * 1.7) * 110, 12, '#fff3b0');
  sprK(ctx, sprRobotB({ ojos: 'feliz' }), 1010, 640, 4); sprK(ctx, sprSarah({ eyes: 'happy' }), 300, 700, 5); sprK(ctx, sprDavid({ eyes: 'happy' }), 380, 708, 5);
  postHD(ctx, { bloom: .2, calidoA: .45, frioA: .25, vin: .4, polvo: 40, semilla: 9 });
};

// ---------- edificios tipo (iso) ----------
const EDIF = {
  patio: { a: 2.6, b: 2.6 }, coro: { a: 1.6, b: 2.2, h: 1.6, s: 'coro' }, salon: { a: 2.6, b: 2, h: 1.8, s: 'libro' },
  teatro: { a: 2.4, b: 2.4, h: 1.8, s: 'mascara' }, taller: { a: 2, b: 1.8, h: 1.4, s: 'martillo' }, conservatorio: { a: 3, b: 2.4, h: 2.4, s: 'estrella' },
};
function edificio(ctx, tipo, i, j, epoca = 'barroco') {
  const S = PAL_, E = EDIF[tipo], med = epoca === 'medieval';
  const muro = med ? ['#e8e0cc', '#cfc3a6', '#ada186'] : S.muro, techoM = med ? ['#6a4a3a', '#4a3226'] : S.tejado, techoA = med ? ['#5d6384', '#454a68'] : S.tejado2;
  if (tipo === 'patio') {
    sueloIso(ctx, i, j, E.a, E.b, [S.piedra[0], mezcla(S.piedra[0], S.piedra[1], .5)]);
    // murete bajo
    cara(ctx, [ip(i, j + E.b), ip(i + E.a, j + E.b), ip(i + E.a, j + E.b, .25), ip(i, j + E.b, .25)], muro[1]);
    arbolIso(ctx, i + .7, j + .8, med ? .9 : 1); fuenteIso(ctx, i + 1.7, j + 1.6, .55); simboloPuerta(ctx, 'arbol', ...ip(i + E.a * .5, j + E.b, .45), 13);
    if (med) { ctx.save(); ctx.strokeStyle = S.tinta; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...ip(i, j + E.b, .25)); ctx.lineTo(...ip(i + E.a, j + E.b, .25)); ctx.stroke(); ctx.restore(); }
    return;
  }
  const o = { simbolo: E.s, muro };
  if (tipo === 'coro') { casaIso(ctx, i, j, E.a, E.b, E.h, Object.assign(o, { tejado: techoM, rh: med ? 1.4 : 1 })); casaIso(ctx, i + E.a * .2, j + E.b - .9, .9, .9, E.h + (med ? 1.6 : 1.2), { techo: 'torre', rh: med ? 1.4 : .9, puerta: false, tejado: med ? techoA : [S.oro, mezcla(S.oro, '#000', .3)], muro, oro: false }); }
  if (tipo === 'salon') casaIso(ctx, i, j, E.a, E.b, E.h, Object.assign(o, { tejado: techoA, gablete: !med, rh: med ? 1.5 : 1 }));
  if (tipo === 'teatro') { casaIso(ctx, i, j, E.a, E.b, E.h, Object.assign(o, med ? { tejado: techoM, rh: 1.4 } : { techo: 'cupula', tejado: ['#6fbfa6', '#4a9483'] })); }
  if (tipo === 'taller') { casaIso(ctx, i, j, E.a, E.b, E.h, Object.assign(o, { tejado: techoM, rh: med ? 1.3 : .9 })); const c = ip(i + E.a * .7, j + E.b * .3, E.h + .9); ctx.fillStyle = '#b8a48e'; ctx.fillRect(c[0] - 8, c[1] - 10, 16, 34); ctx.strokeStyle = S.tinta; ctx.lineWidth = 2; ctx.strokeRect(c[0] - 8, c[1] - 10, 16, 34); ctx.save(); ctx.filter = 'blur(3px)'; [[0, -24, 10], [8, -44, 13], [18, -66, 16]].forEach(([dx, dy, r]) => elip(ctx, c[0] + dx, c[1] + dy, r, r * .8, 'rgba(255,255,255,.8)')); ctx.restore(); }
  if (tipo === 'conservatorio') { casaIso(ctx, i, j, E.a, E.b, E.h, Object.assign(o, { tejado: techoA, rh: med ? 1.6 : 1.1, gablete: !med, estandarte: '#d2452e' })); }
  // entramado de madera (medieval)
  if (med) { const F = caraIzqF(i, j, E.a, E.b, E.h); ctx.save(); ctx.strokeStyle = '#5a3a24'; ctx.lineWidth = 3; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(...F(k / 4, 0)); ctx.lineTo(...F(k / 4, 1)); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(...F(0, .5)); ctx.lineTo(...F(1, .5)); ctx.stroke(); ctx.restore(); }
}
// ---------- 10 · ciudad tipo ----------
ESCENAS['ciudad-tipo'] = ctx => {
  PAL_ = PALS5.A; const S = PAL_; texturaPapel(ctx, S.papel, 'rgba(150,100,40,.3)', 31);
  // niebla y siluetas de la ciudad siguiente, al fondo
  ctx.save(); ctx.globalAlpha = .35; ISO.t = 30; ISO.cx = 980; ISO.cy = 40; [[0, 0, 1.4], [1.6, -.2, 2.4], [3, .4, 1.2], [-1.4, .6, 1.8]].forEach(([i, j, h]) => casaIso(ctx, i, j, 1.4, 1.2, h, { puerta: false, oro: false, techo: h > 2 ? 'torre' : null, rh: .9 })); ctx.restore();
  ctx.save(); ctx.filter = 'blur(26px)'; ctx.fillStyle = 'rgba(244,238,250,.85)'; [[1000, 90, 260], [760, 70, 200], [1180, 140, 200]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.ellipse(x, y, r, r * .45, 0, 0, 7); ctx.fill(); }); ctx.restore();
  ISO.t = 44; ISO.cx = 600; ISO.cy = 170; const N = 12;
  borde(ctx, 0, 0, N, N, .6, [mezcla(S.suelo[1], '#000', .2), mezcla(S.suelo[1], '#000', .35)]);
  sueloIso(ctx, 0, 0, N, N, [S.pasto[0], mezcla(S.pasto[0], S.pasto[1], .3)]);
  sueloIso(ctx, 0, 5, N, 2, [S.piedra[0], mezcla(S.piedra[0], S.piedra[1], .5)]); sueloIso(ctx, 5, 0, 2, 5, [S.piedra[0], mezcla(S.piedra[0], S.piedra[1], .5)]); sueloIso(ctx, 5, 7, 2, 5, [S.piedra[0], mezcla(S.piedra[0], S.piedra[1], .5)]);
  edificio(ctx, 'coro', 1, 1.2); edificio(ctx, 'salon', 7.6, .6); edificio(ctx, 'conservatorio', 1.4, 8);
  edificio(ctx, 'patio', 2.5, 2.3); edificio(ctx, 'teatro', 8, 8.6); edificio(ctx, 'taller', 8.6, 3.2);
  pjIso(ctx, sprSarah({}), 5.6, 6.4); pjIso(ctx, sprDavid({}), 6.5, 6.2); pjIso(ctx, sprRobotB({ ojos: 'feliz' }), 7.2, 5.4, 3, { z: .8 });
  postHD(ctx, { bloom: .18, calidoA: .45, frioA: .25, vin: .35, polvo: 30, semilla: 10 });
  marcoIluminado(ctx);
};
// ---------- 11 · los 6 edificios en dos épocas ----------
ESCENAS['edificios'] = ctx => {
  PAL_ = PALS5.A; const S = PAL_; texturaPapel(ctx, S.papel, 'rgba(150,100,40,.3)', 41);
  const tipos = ['patio', 'coro', 'salon', 'teatro', 'taller', 'conservatorio'];
  ['medieval', 'barroco'].forEach((ep, f) => {
    ctx.save(); rr(ctx, 50, 50 + f * 320, 1180, 300, 20); ctx.fillStyle = f ? 'rgba(42,75,155,.08)' : 'rgba(106,74,58,.1)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(58,36,20,.35)'; ctx.stroke(); ctx.restore();
    tipos.forEach((t, k) => { ISO.t = 30; ISO.cx = 150 + k * 196; ISO.cy = 150 + f * 320; sueloIso(ctx, -.4, -.4, 4, 4, [S.pasto[0], mezcla(S.pasto[0], S.pasto[1], .3)]); edificio(ctx, t, .2, .2, ep); });
  });
  marcoIluminado(ctx);
};
