// =====================================================================
//  Mapa del mundo (el camino es un pentagrama), selector «¿Quién toca hoy?», menús y arranque
// =====================================================================
const LUGARES5 = {};
function escudoLibre(ctx, x, y, s, c1, c2, icono) {   // escudos de la aldea y de Belén (estrella)
  const w = 120 * s, h = 140 * s; ctx.save(); formaEscudo(ctx, x, y, w + 14 * s, h + 14 * s); ctx.fillStyle = '#d9a930'; ctx.fill(); ctx.lineWidth = 3 * s; ctx.strokeStyle = '#3a2414'; ctx.stroke(); formaEscudo(ctx, x, y, w, h); ctx.fillStyle = c1; ctx.fill(); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = c2; ctx.strokeStyle = c2; ctx.lineWidth = 5;
  if (icono === 'estrella') { ctx.beginPath(); for (let k = 0; k < 16; k++) { const a = -Math.PI / 2 + k * Math.PI / 8, r = k % 2 ? 9 : (k % 4 === 0 ? 40 : 22); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r - 6); } ctx.closePath(); ctx.fill(); }
  if (icono === 'casa') { ctx.beginPath(); ctx.moveTo(-28, 30); ctx.lineTo(-28, -4); ctx.lineTo(0, -30); ctx.lineTo(28, -4); ctx.lineTo(28, 30); ctx.closePath(); ctx.stroke(); ctx.strokeRect(-8, 8, 16, 22); }
  if (icono === 'lira') iconoHeraldico(ctx, 'lira', 0, 0, 1, c2);
  ctx.restore();
}
// ---------- utilidades del mapa iluminado (grande, se desplaza) ----------
const MW = 2600, MH = 1500;
function monteM(ctx, x, y, s, nieve = true) { ctx.save(); ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * .15, y - s * 1.25); ctx.lineTo(x + s * .1, y - s * 1.05); ctx.lineTo(x + s, y); ctx.closePath(); ctx.fillStyle = '#d8c8a8'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#3a2414'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - s * .15, y - s * 1.25); ctx.lineTo(x + s * .1, y - s * 1.05); ctx.lineTo(x + s, y); ctx.lineTo(x + s * .05, y); ctx.closePath(); ctx.fillStyle = '#b8a07a'; ctx.fill();
  ctx.strokeStyle = 'rgba(58,36,20,.45)'; ctx.lineWidth = 1.2; for (let k = 1; k < 7; k++) { const t = k / 7; ctx.beginPath(); ctx.moveTo(x + s * .05 + t * s * .8, y - 2); ctx.lineTo(x - s * .1 + t * s * .5, y - s * .9 * (1 - t) - 4); ctx.stroke(); }
  if (nieve) { ctx.beginPath(); ctx.moveTo(x - s * .45, y - s * .78); ctx.lineTo(x - s * .15, y - s * 1.25); ctx.lineTo(x + s * .1, y - s * 1.05); ctx.lineTo(x + s * .35, y - s * .75); ctx.lineTo(x + s * .05, y - s * .85); ctx.lineTo(x - s * .2, y - s * .7); ctx.closePath(); ctx.fillStyle = '#fbf8f0'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = '#3a2414'; ctx.stroke(); }
  ctx.lineWidth = 2; ctx.strokeStyle = '#3a2414'; ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * .15, y - s * 1.25); ctx.lineTo(x + s * .1, y - s * 1.05); ctx.lineTo(x + s, y); ctx.stroke(); ctx.restore(); }
function arbolitoM(ctx, x, y, r, c) { ctx.save(); ctx.fillStyle = '#6a4a30'; ctx.fillRect(x - 1.5, y - 2, 3, r * .8); ctx.beginPath(); ctx.arc(x, y - r * .6, r, 0, 7); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = '#3a2414'; ctx.stroke(); ctx.beginPath(); ctx.arc(x - r * .35, y - r * .95, r * .35, 0, 7); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fill(); ctx.restore(); }
function bosqueM(ctx, x, y, n, R, ancho = 140) { const cs = ['#3f8f6a', '#2e8b6a', '#5aa070', '#4f7f50']; const pts = []; for (let k = 0; k < n; k++) pts.push([x + (R() - .5) * ancho, y + (R() - .5) * ancho * .45, 6 + R() * 8]); pts.sort((a, b) => a[1] - b[1]).forEach(([a, b, r], k) => arbolitoM(ctx, a, b, r, cs[k % 4])); }
function molino(ctx, x, y) { ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = '#3a2414'; ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.lineTo(x - 7, y - 30); ctx.lineTo(x + 7, y - 30); ctx.lineTo(x + 10, y); ctx.closePath(); ctx.fillStyle = '#fbf1d8'; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 9, y - 30); ctx.lineTo(x, y - 40); ctx.lineTo(x + 9, y - 30); ctx.fillStyle = '#d2452e'; ctx.fill(); ctx.stroke(); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + .4; ctx.beginPath(); ctx.moveTo(x, y - 30); ctx.lineTo(x + Math.cos(a) * 24, y - 30 + Math.sin(a) * 24); ctx.stroke(); ctx.save(); ctx.translate(x, y - 30); ctx.rotate(a); ctx.fillStyle = '#efdcb0'; ctx.fillRect(8, -3, 15, 6); ctx.strokeRect(8, -3, 15, 6); ctx.restore(); } ctx.restore(); }
function castilloM(ctx, x, y, s, c = '#2a4b9b') { ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = '#3a2414'; ctx.fillStyle = '#efe2c4'; ctx.fillRect(x - 22 * s, y - 22 * s, 44 * s, 22 * s); ctx.strokeRect(x - 22 * s, y - 22 * s, 44 * s, 22 * s); [-22, 12].forEach(dx => { ctx.fillStyle = '#e2d2b0'; ctx.fillRect(x + dx * s, y - 40 * s, 10 * s, 40 * s); ctx.strokeRect(x + dx * s, y - 40 * s, 10 * s, 40 * s); ctx.beginPath(); ctx.moveTo(x + (dx - 2) * s, y - 40 * s); ctx.lineTo(x + (dx + 5) * s, y - 54 * s); ctx.lineTo(x + (dx + 12) * s, y - 40 * s); ctx.fillStyle = c; ctx.fill(); ctx.stroke(); }); ctx.fillStyle = '#4a3a5a'; ctx.beginPath(); ctx.arc(x, y - 6 * s, 6 * s, Math.PI, 0); ctx.fillRect(x - 6 * s, y - 6 * s, 12 * s, 6 * s); ctx.fill(); ctx.restore(); }
function puenteM(ctx, x, y, ang) { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.lineWidth = 2; ctx.strokeStyle = '#3a2414'; ctx.fillStyle = '#e2d2b0'; ctx.beginPath(); ctx.moveTo(-26, 6); ctx.lineTo(-26, -6); ctx.lineTo(26, -6); ctx.lineTo(26, 6); ctx.lineTo(14, 6); ctx.arc(0, 6, 14, 0, Math.PI, true); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
function olaM(ctx, x, y) { ctx.beginPath(); ctx.moveTo(x - 12, y); ctx.quadraticCurveTo(x - 6, y - 6, x, y); ctx.quadraticCurveTo(x + 6, y - 6, x + 12, y); ctx.stroke(); }
const CIUDADES5 = [
  { id: 'natal', nombre: 'Mi aldea', t: .02, paso: -2, abierta: true },
  { id: 'belen', nombre: 'Belén', t: .1, paso: 0, abierta: true, mes: 'dic' },
  ...['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct'].map((m, k) => ({ id: 'u' + (k + 1), nombre: '', t: .18 + k * .074, paso: [1, 2, 3, 4, 5, 4, 3, 2, 3, 4][k], mes: m, escudo: k })),
  { id: 'gran', nombre: '', t: .97, paso: 5, mes: 'nov' },
];
const MESES5 = { ene: 'enero', feb: 'febrero', mar: 'marzo', abr: 'abril', may: 'mayo', jun: 'junio', jul: 'julio', ago: 'agosto', sep: 'septiembre', oct: 'octubre', nov: 'noviembre' };
// dibujo en gris: en un lienzo chico (el filtro sobre el lienzo grande del mapa costaba segundos)
function enGris5(w, h, fn, filtro) { const a = canvas(w, h); fn(a.getContext('2d')); const b = canvas(w, h), x = b.getContext('2d'); x.filter = filtro; x.drawImage(a, 0, 0); return b; }
const OLAS5 = [], NUBES5 = [[200, 300, .9, 9], [900, 650, 1.1, 6], [1500, 250, .8, 11], [2100, 900, 1, 7], [600, 1150, .85, 8], [1800, 520, .7, 10]];
function banderaMapa5(ctx, x, y, c, k) { ctx.save(); ctx.strokeStyle = '#3a2414'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y + 34); ctx.lineTo(x, y - 6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y - 6); for (let i = 0; i <= 8; i++) { const xx = x + i * 3.2, yy = y - 6 + Math.sin(RELOJ * 6 - i * .7 + k) * 2.2 * (i / 8); ctx.lineTo(xx, yy); } for (let i = 8; i >= 0; i--) { const xx = x + i * 3.2, yy = y + 8 + Math.sin(RELOJ * 6 - i * .7 + k) * 2.2 * (i / 8) - i * .3; ctx.lineTo(xx, yy); } ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore(); }
function crearMapa() {
  const M = { nombre: 'El mundo' }; let fondo = null, K = null, viaje = null; const cam = { x: 0, y: 0 };
  function prerender() {
    fondo = canvas(MW, MH); const ctx = fondo.getContext('2d'); PAL_ = PALS5.A; const R = rng(611);
    // mar de ultramar con olas de oro
    ctx.fillStyle = lg(ctx, 0, 0, MW, MH, [[0, '#2f55a8'], [1, '#1d3672']]); ctx.fillRect(0, 0, MW, MH);
    ctx.strokeStyle = 'rgba(217,169,48,.55)'; ctx.lineWidth = 2; for (let k = 0; k < 260; k++) olaM(ctx, R() * MW, R() * MH);
    // tierra de pergamino con lavados de malaquita (y sus costas a doble línea)
    const costa = [[180, 1050], [160, 720], [330, 520], [560, 430], [760, 300], [1050, 230], [1350, 180], [1700, 160], [2050, 210], [2380, 300], [2470, 560], [2400, 820], [2200, 1000], [1900, 1180], [1550, 1320], [1150, 1360], [800, 1340], [480, 1280], [260, 1180]];
    ctx.save(); blob(ctx, costa.map(p => [p[0] + 10, p[1] + 26])); ctx.fillStyle = '#8a6a3a'; ctx.fill(); ctx.restore();
    ctx.save(); blob(ctx, costa); ctx.fillStyle = '#f1e0b8'; ctx.fill(); ctx.clip();
    for (let k = 0; k < 40; k++) { const x = R() * MW, y = R() * MH, r = 80 + R() * 220; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, ['rgba(46,139,106,.28)', 'rgba(140,180,100,.3)', 'rgba(217,169,48,.18)'][k % 3]); g.addColorStop(1, 'rgba(46,139,106,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
    ctx.restore();
    ctx.save(); blob(ctx, costa); ctx.lineWidth = 4; ctx.strokeStyle = '#3a2414'; ctx.stroke(); ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(58,36,20,.45)'; ctx.setLineDash([2, 6]); blob(ctx, costa.map(([x, y]) => [x + (x - 1300) * -.02, y + (y - 760) * -.025])); ctx.stroke(); ctx.restore();
    // ríos con curvas
    const rios = [[[1150, 230], [1080, 520], [1290, 700], [1200, 1340]], [[2050, 220], [1900, 520], [2160, 760], [2100, 1080]], [[560, 430], [700, 700], [520, 900], [620, 1300]]];
    rios.forEach(P => { ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); for (let k = 0; k <= 40; k++) { const p = bez(P, k / 40); k ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.lineWidth = 12; ctx.strokeStyle = '#3a2414'; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = '#4f7fd0'; ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.stroke(); ctx.restore(); });
    // cordilleras (tamaños variados) y bosques
    const cord = [[1500, 330, 9, 70], [380, 640, 7, 46], [2250, 470, 8, 58], [900, 1150, 6, 36], [1750, 1120, 7, 44]];
    cord.forEach(([x, y, n, s]) => { const lista = []; for (let k = 0; k < n; k++) lista.push([x + (k - n / 2) * s * .9 + (R() - .5) * 20, y + (R() - .5) * 40, s * (.45 + R() * .7)]); lista.sort((a, b) => a[1] - b[1]).forEach(([a, b, c]) => monteM(ctx, a, b, c, c > s * .65)); });
    [[760, 520, 30], [1700, 700, 26], [2300, 900, 24], [420, 900, 24], [1350, 950, 30], [1000, 420, 18], [1950, 400, 20], [2100, 1050, 16], [700, 1220, 18]].forEach(([x, y, n]) => bosqueM(ctx, x, y, n, R, 120 + n * 3));
    // detalles medievales sutiles
    [[620, 1000], [1560, 560], [2280, 680], [960, 880]].forEach(([x, y]) => molino(ctx, x, y));
    [[1470, 470, 1, '#d2452e'], [2350, 1000, .9, '#2a4b9b'], [320, 860, .8, '#2e8b6a']].forEach(a => castilloM(ctx, ...a));
    for (let k = 0; k < 14; k++) { const x = 300 + R() * 2000, y = 450 + R() * 800; ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.ellipse(0, 0, 6, 4, 0, 0, 7); ctx.fillStyle = '#fffaf2'; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = '#3a2414'; ctx.stroke(); ctx.beginPath(); ctx.arc(5, -1, 2, 0, 7); ctx.fillStyle = '#3a2414'; ctx.fill(); ctx.restore(); }
    // el camino-pentagrama: atraviesa el mundo
    K = caminoPentagrama(ctx, [[260, 1000], [900, 1420], [900, 300], [2350, 500]], 20, { linea: '#3a2414', cinta: 'rgba(251,241,216,.96)' });
    // puentes donde el camino cruza los ríos
    [[.34, 0], [.62, 0], [.84, 0]].forEach(([t]) => { const [x, y, a] = K.at(t, 4); puenteM(ctx, x, y + 64, a); });
    const c0 = K.at(0.006, 4); ctx.save(); ctx.translate(c0[0], c0[1]); ctx.rotate(c0[2]); clave(ctx, 'sol', -12, -2 * 20 - 6, 20, '#d9a930'); ctx.restore();
    const [bx, by, ba] = K.at(.998, 4); ctx.save(); ctx.translate(bx, by); ctx.rotate(ba); ctx.fillStyle = '#3a2414'; ctx.fillRect(-2, -40, 5, 80); ctx.fillRect(8, -40, 9, 80); ctx.restore();
    CIUDADES5.forEach(c => {
      const [x, y, ang] = K.at(c.t, c.paso), col = NC[['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'][((c.paso + 2) % 7 + 7) % 7]]; c.x = x; c.y = y;
      if (c.paso <= -2) { const [lx, ly] = K.at(c.t, -2); ctx.save(); ctx.translate(lx, ly); ctx.rotate(ang); ctx.lineWidth = 3; ctx.strokeStyle = '#3a2414'; ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(34, 0); ctx.stroke(); ctx.restore(); }
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang - .35); ctx.beginPath(); ctx.ellipse(0, 0, 28, 19, 0, 0, 7); ctx.fillStyle = c.abierta ? col : '#8a7a9b'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#3a2414'; ctx.stroke(); ctx.restore();
      if (c.abierta) miniCiudad(ctx, x - 8, y - 6, 1.4, col); else { ctx.save(); ctx.globalAlpha = .5; ctx.drawImage(enGris5(160, 160, g => miniCiudad(g, 72, 104, 1.3, '#8a7a9b'), 'grayscale(1) brightness(.7)'), x - 80, y - 110); ctx.restore(); }
    });
    { const c2 = canvas(8, 8).getContext('2d'); blob(c2, costa); const R2 = rng(77); OLAS5.length = 0; for (let k = 0; k < 900 && OLAS5.length < 170; k++) { const x = R2() * MW, y = R2() * MH; if (!c2.isPointInPath(x, y)) OLAS5.push([x, y, R2() * 6.28]); } }
    serpienteMarina(ctx, 420, 260, 1.3); ballena(ctx, 1800, 1420, 1.1); barco(ctx, 2480, 1200, 1.1); barco(ctx, 120, 420, 1);
  }
  const limitar = () => { cam.x = Math.max(LW5 / 2, Math.min(MW - LW5 / 2, cam.x)); cam.y = Math.max(LH5 / 2, Math.min(MH - LH5 / 2, cam.y)); };
  M.entrar = () => { if (!fondo) prerender(); const p = GUARDA.perfil(); M.actual = CIUDADES5.findIndex(c => c.id === (p && p.lugar)); if (M.actual < 0) M.actual = 0; viaje = null; const c = CIUDADES5[M.actual]; cam.x = c.x + 300; cam.y = c.y - 120; limitar(); };
  M.arrastrar = (dx, dy) => { if (viaje) return; cam.x -= dx; cam.y -= dy; limitar(); };
  M.dibujar = (ctx, dt) => {
    const ox = Math.round(LW5 / 2 - cam.x), oy = Math.round(LH5 / 2 - cam.y);
    ctx.drawImage(fondo, ox, oy);
    // el mar se mueve: olitas de oro que van y vienen
    ctx.save(); ctx.lineWidth = 2.2; OLAS5.forEach(([x0, y0, f]) => { const x = x0 + ox + Math.sin(RELOJ * .8 + f) * 7, y = y0 + oy + Math.cos(RELOJ * .6 + f) * 2; if (x < -20 || x > LW5 + 20 || y < -20 || y > LH5 + 20) return; ctx.globalAlpha = .35 + .35 * Math.sin(RELOJ * 1.3 + f); ctx.strokeStyle = (f > 3 ? '#ffe9a0' : '#bcd8ff'); olaM(ctx, x, y); }); ctx.restore();
    CIUDADES5.forEach((c, k) => {
      const x = c.x + ox, y = c.y + oy; if (x < -200 || x > LW5 + 200 || y < -200 || y > LH5 + 200) return;
      if (c.abierta || GUARDA.d.verMundos) banderaMapa5(ctx, x + 14, y - 58, c.abierta ? (c.id === 'belen' ? '#2a4b9b' : '#d2452e') : NC[['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'][k % 7]], k);
      if (!c.abierta && !GUARDA.d.verMundos) { ctx.save(); [[-34, -30, 64], [30, -48, 56], [8, 10, 50]].forEach(([dx, dy, r], q) => { const g = ctx.createRadialGradient(x + dx + Math.sin(RELOJ * .4 + k + q) * 8, y + dy, 0, x + dx, y + dy, r); g.addColorStop(0, 'rgba(28,16,48,.82)'); g.addColorStop(1, 'rgba(28,16,48,0)'); ctx.fillStyle = g; ctx.fillRect(x + dx - r, y + dy - r, r * 2, r * 2); }); ctx.restore(); }
      const ex = x + 54, ey = y + 46;
      if (c.id === 'natal') escudoLibre(ctx, ex, ey, .3, '#d2452e', '#fbf1d8', 'casa');
      else if (c.id === 'belen') escudoLibre(ctx, ex, ey, .3, '#2a4b9b', '#ffd046', 'estrella');
      else if (c.id === 'gran') { ctx.save(); ctx.globalAlpha = .5; escudoLibre(ctx, ex, ey, .24, '#6a5a7a', '#cfc6dc', 'lira'); ctx.restore(); }
      else { c.gris = c.gris || enGris5(90, 100, g => escudo(g, c.escudo, 45, 50, .22), 'grayscale(1)'); ctx.save(); ctx.globalAlpha = .45; ctx.drawImage(c.gris, ex - 45, ey - 50); ctx.restore(); }
      if (c.abierta) titulo5(ctx, c.nombre, x, y - 96, 30, '#3a2414', { borde: 6 });
      else if (c.mes) titulo5(ctx, MESES5[c.mes], x, y - 86, GUARDA.d.verMundos ? 26 : 20, GUARDA.d.verMundos ? '#3a2414' : 'rgba(251,241,216,.85)', { borde: 4, bordeC: GUARDA.d.verMundos ? '#fbf1d8' : '#1c1030' });
      if (c.mes === 'ene' && (() => { const p = GUARDA.perfil(); return p && p.m2 && p.m2.llaves && p.m2.llaves.enero; })()) { llave5(ctx, x + 46, y - 30, .55); titulo5(ctx, 'Maelzel', x, y - 116, 26, '#ffd046', { borde: 5, bordeC: '#1c1030' }); }
    });
    let px, py;
    if (viaje) { viaje.t += dt; const p = Math.min(1, viaje.t / viaje.dur), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, t = viaje.t0 + (viaje.t1 - viaje.t0) * e; [px, py] = K.at(t, 0); cam.x += (px + 200 - cam.x) * .1; cam.y += (py - 100 - cam.y) * .1; limitar(); if (p >= 1 && !viaje.hecho) { viaje.hecho = true; irA(LUGARES5[viaje.id], { tipo: 'fundido' }); } }
    else { const c = CIUDADES5[M.actual]; px = c.x; py = c.y; }
    const anda = !!viaje, izq = viaje && viaje.t1 < viaje.t0;
    sombra(ctx, px - 38 + ox, py + 46 + oy, 14); sprK(ctx, destacado5(anda ? heroeAnim5({ camina: Math.floor(RELOJ * 9) % 4 }) : jugadorQuieto()), px - 38 + ox, py + 48 + oy - (anda && Math.floor(RELOJ * 9) % 2 ? 1 : 0), 2.4, { flip: izq });
    sprK(ctx, destacado5(sprRobotB({ ang: Math.round(Math.sin(RELOJ * Math.PI * 80 / 60) * 4) / 10, ojos: 'feliz', llama: Math.floor(RELOJ * 14) % 2 })), px + 26 + ox, py - 12 + oy + Math.sin(RELOJ * 2.4) * 4, 2.2);
    // nubes que pasan (con su sombra sobre el mapa)
    NUBES5.forEach((n, k) => { const x = ((n[0] + RELOJ * n[3]) % (MW + 600)) - 300 + ox, y = n[1] + oy; if (x < -300 || x > LW5 + 300 || y < -200 || y > LH5 + 200) return; ctx.save(); ctx.globalAlpha = .1; ctx.fillStyle = '#1c1030'; ctx.beginPath(); ctx.ellipse(x + 40, y + 90, 120 * n[2], 30 * n[2], 0, 0, 7); ctx.fill(); ctx.restore();
      ctx.save(); ctx.globalAlpha = .82; ctx.fillStyle = '#fffaf0'; ctx.strokeStyle = 'rgba(58,36,20,.35)'; ctx.lineWidth = 2; [[0, 0, 60], [55, -18, 50], [105, 2, 44], [-50, 8, 40], [35, 20, 52]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx * n[2], y + dy * n[2], r * n[2], 0, 7); ctx.fill(); }); ctx.restore(); });
    // marco iluminado fijo y rosa de los vientos
    marcoIluminado(ctx); rosaClave(ctx, LW5 - 110, LH5 - 110, 56);
    cinta5(ctx, 'El mundo', 44, 50, 230); botonRedondo5(ctx, LW5 - 50, 48, 'pausa'); botonRedondo5(ctx, LW5 - 122, 48, 'ajustes');
    if (M.aviso) { M.aviso.t -= dt; if (M.aviso.t <= 0) M.aviso = null; else { ctx.save(); ctx.globalAlpha = Math.min(1, M.aviso.t * 2); cinta5(ctx, M.aviso.texto, M.aviso.x + ox - 150, M.aviso.y + oy - 130, 300); ctx.restore(); } }
  };
  M.pantallaDe = id => { const c = CIUDADES5.find(z => z.id === id); return c ? [c.x - cam.x + LW5 / 2, c.y - cam.y + LH5 / 2] : null; };   // pruebas
  M.tocar = (x, y) => {
    if (viaje) return;
    if (Math.hypot(x - (LW5 - 50), y - 48) < 34) { MENU5.abrir('pausa'); return; } if (Math.hypot(x - (LW5 - 122), y - 48) < 34) { MENU5.abrir('papas'); return; }
    const wx = x - (LW5 / 2 - cam.x), wy = y - (LH5 / 2 - cam.y);
    for (let k = 0; k < CIUDADES5.length; k++) { const c = CIUDADES5[k]; if (Math.hypot(wx - c.x, wy - c.y) < 60) {
      if (!c.abierta) { M.aviso = { texto: c.mes ? 'Se abre en ' + MESES5[c.mes] : 'Pronto', x: c.x, y: c.y, t: 1.8 }; return; }
      if (k === M.actual) { irA(LUGARES5[c.id], { tipo: 'fundido' }); return; }
      viaje = { t: 0, dur: .9 + Math.abs(c.t - CIUDADES5[M.actual].t) * 3, t0: CIUDADES5[M.actual].t, t1: c.t, id: c.id }; M.actual = k; return; } }
  };
  return M;
}
// ---------- el héroe animado (M4): ciclo de caminar de 4 cuadros con bamboleo y brazos; quieto respira y parpadea; con su traje ----------
const CAMINA5 = [{ legA: { dx: -2 }, legB: { dx: 2 }, b: 0, armB: [7, 21], armF: [22, 22], hs: 0 }, { legA: { dx: -1, lift: 1 }, legB: { dx: 1 }, b: -1, armB: [8, 22], armF: [21, 23], hs: 1 },
  { legA: { dx: 2 }, legB: { dx: -2 }, b: 0, armB: [10, 22], armF: [20, 23], hs: 0 }, { legA: { dx: 1 }, legB: { dx: -1, lift: 1 }, b: -1, armB: [9, 22], armF: [21, 22], hs: -1 }];
function trajeActual5() { const p = GUARDA.perfil(); return (p && p.m2 && p.m2.traje) || 'viajero'; }
function heroeAnim5(o = {}) {
  const p = GUARDA.d.perfil || 'sarah';
  if (p !== 'sarah' && p !== 'david') return p === 'papa' ? PAPA() : MAMA();
  const Q = o.camina != null ? Object.assign({}, CAMINA5[o.camina % 4]) : {}; if (p === 'sarah') Q.cross = 'up'; if (o.ojos) Q.eyes = o.ojos;
  const b = p === 'sarah' ? sprSarah(Q) : sprDavid(Q); b.clave = 'ha' + (o.camina != null ? o.camina % 4 : 'q') + (o.ojos || ''); return conTraje(b, trajeActual5(), p);
}
function parpadeo5() { return (RELOJ % 3.7) < .13 ? 'blink' : null; }
function jugadorQuieto() { return heroeAnim5({ ojos: parpadeo5() }); }
// ---------- «¿Quién toca hoy?» ----------
function crearSelector() {
  const S = {}; let fondo = null; const cartas = [['sarah', 'Sarah', NC.DO], ['david', 'David', NC.SOL], ['papa', 'Papá', NC.LA], ['mama', 'Mamá', NC.RE]];
  // M5b: con el manual de marca: papel crema, franja de colores, el logo, cartas con borde de tinta y sombra dura
  S.entrar = () => { if (fondo) return; fondo = canvas(LW5, LH5); const c = fondo.getContext('2d'); c.fillStyle = MARCA5.crema; c.fillRect(0, 0, LW5, LH5);
    c.fillStyle = 'rgba(42,26,58,.06)'; for (let y = 24; y < LH5; y += 36) for (let x = (y / 36 % 2) * 18 + 10; x < LW5; x += 36) { c.beginPath(); c.arc(x, y, 2.4, 0, 7); c.fill(); }
    franja5(c, 0, 0, LW5, 16); c.fillStyle = MK5; c.fillRect(0, 16, LW5, 4); };
  const pos = k => [150 + k * 250, 214, 220, 360];
  S.dibujar = (ctx) => {
    ctx.drawImage(fondo, 0, 0);
    if (LOGO5.complete && LOGO5.naturalWidth) ctx.drawImage(LOGO5, 30, 34, 230, 120);
    marcador5(ctx, '¿Quién toca hoy?', LW5 / 2 + 60, 118, 66, NC.MI);
    cartas.forEach(([id, nombre, col], k) => { const [x, y, w, h] = pos(k), sel = GUARDA.d.perfil === id, ele = S.elegido && S.elegido.id === id, sal = ele ? Math.floor((RELOJ - S.elegido.t) * 5) % 2 : 0, cl = MARCA5.cla[{ sarah: 'DO', david: 'SOL', papa: 'LA', mama: 'RE' }[id]];
      const dy = ele ? -6 : 0; caja5(ctx, x, y + dy, w, h, { r: 22, borde: 5, sombra: ele ? 14 : 9, fondo: cl, cab: col, cabH: 22 });
      const s = id === 'sarah' || id === 'david' ? (() => { const b = id === 'sarah' ? sprSarah(ele ? { cross: 'none', eyes: 'happy', armF: sal ? [23, 11] : [21, 12] } : { cross: 'up', eyes: 'happy' }) : sprDavid(ele ? { eyes: 'happy', armF: sal ? [22, 11] : [20, 12] } : { eyes: 'happy' }); b.clave = 'sel' + (ele ? 'h' + sal : ''); return conTraje(b, 'viajero', id); })() : id === 'papa' ? PAPA() : MAMA();
      ctx.save(); ctx.fillStyle = 'rgba(42,26,58,.18)'; ctx.beginPath(); ctx.ellipse(x + w / 2, y + h - 94 + dy, 52, 12, 0, 0, 7); ctx.fill(); ctx.restore();
      const a7 = escalado7('sel-' + id, id === 'david' ? 226 : 244), sy = y + h - 92 + dy + (ele ? -Math.abs(Math.sin((RELOJ - S.elegido.t) * 7)) * 14 : Math.round(Math.sin(RELOJ * 3 + k) * 2));
      if (a7) ctx.drawImage(a7, Math.round(x + w / 2 - a7.width / 2), Math.round(sy - a7.height + 8)); else sprK(ctx, s, x + w / 2, sy, id === 'sarah' || id === 'david' ? 6 : 5.4);   /* M7: los retratos ilustrados */
      if (ele) { const q = Math.min(1, (RELOJ - S.elegido.t) * 4); ctx.save(); ctx.globalAlpha = q; ctx.translate(x + w / 2, y - 46); ctx.rotate(-.06); habla5(textoDeVoz5('hola-' + id, '¡Hola, ' + nombre + '!')); pildora5(ctx, -115, -28, textoDeVoz5('hola-' + id, '¡Hola, ' + nombre + '!'), { w: 230, h: 56, tam: 30, al: 'center', fondo: NC.MI, c: MK5, sombra: 5 }); ctx.restore(); }
      caja5(ctx, x + 22, y + h - 72 + dy, w - 44, 52, { r: 14, borde: 4, sombra: 0, fondo: MK5 }); titulo5(ctx, nombre, x + w / 2, y + h - 45 + dy, 34, MARCA5.papel); });
    caja5(ctx, 470, 626, 340, 70, { r: 35, borde: 4, sombra: 5, fondo: MARCA5.gris, alpha: .8 });
    ['Nina', 'Josué', 'Noah', 'Samuel', 'Isaac'].forEach((n, k) => { ctx.save(); ctx.globalAlpha = .7; sprK(ctx, PRIMOS[n](), 520 + k * 60, 690, 1.6); ctx.restore(); });
    titulo5(ctx, 'los primos, pronto', LW5 / 2, 728, 22, MARCA5.tinta2);
    botonRedondo5(ctx, LW5 - 50, 58, 'ajustes');
  };
  S.tocar = (x, y) => {
    if (Math.hypot(x - (LW5 - 50), y - 58) < 34) { MENU5.abrir('papas'); return; }
    if (S.elegido) return; cartas.forEach(([id], k) => { const [cx0, cy0, w, h] = pos(k); if (x > cx0 && x < cx0 + w && y > cy0 && y < cy0 + h) { GUARDA.d.perfil = id; GUARDA.perfil(); GUARDA.guardar(); S.elegido = { id, t: RELOJ }; SON5.iniciar(); try { Snd.boton(); } catch (e) { } voz5('hola-' + id, { forzar: true }); setTimeout(() => { S.elegido = null; empezarDia5(cx0 + w / 2, cy0 + h / 2); }, 950); } });
  };
  return S;
}
// ---------- menús (DOM, encima del lienzo) ----------
const MENU5 = {
  abrir(tipo) {
    const m = document.getElementById('menu'); m.innerHTML = ''; m.className = 'abierto ' + tipo;
    const caja = document.createElement('div'); caja.className = 'caja'; m.appendChild(caja);
    const boton = (t, fn, cls) => { const b = document.createElement('button'); b.textContent = t; if (cls) b.className = cls; b.onclick = () => { fn(); }; caja.appendChild(b); return b; };
    const h = (t) => { const e = document.createElement('h2'); e.textContent = t; caja.appendChild(e); };
    if (tipo === 'pausa') {
      h('Pausa');
      boton('Seguir', () => MENU5.cerrar(), 'grande');
      if (!(ESC && ESC.dia)) boton('El mapa del mundo', () => { MENU5.cerrar(); irA(ESCENA_MAPA, { tipo: 'fundido' }); });
      else boton('Ir a explorar Belén', () => { MENU5.cerrar(); const B = LUGARES5.belen; B.auto = false; B.extraHud = null; B.alEntrar = null; irA(B, { tipo: 'fundido' }); });
      if (!(ESC && ESC.dia)) { const d = GUARDA.perfil() && diaHoy5(); if (d && !d.completo) boton('La sesión de hoy', () => { MENU5.cerrar(); empezarDia5(LW5 / 2, LH5 / 2); }); }
      boton('¿Quién toca hoy?', () => { MENU5.cerrar(); irA(ESCENA_SELECTOR, { tipo: 'fundido' }); });
    } else if (tipo === 'tienda') menuTienda5(caja, boton, h);
    else if (tipo === 'vestidor') menuVestidor5(caja, boton, h);
    else if (tipo === 'concierto') menuConcierto5(caja, boton, h);
    else {
      panelPapas5(caja, boton, h);
      boton('Cerrar', () => MENU5.cerrar(), 'grande');
    }
  },
  cerrar() { const m = document.getElementById('menu'); m.className = ''; m.innerHTML = ''; },
};
// ---------- arranque ----------
let ESCENA_MAPA = null, ESCENA_SELECTOR = null;
async function arrancar5() {
  ajustar5();
  const barra = document.getElementById('cargando-barra');
  try { await Promise.all([document.fonts.load('700 30px Crimson'), document.fonts.load('500 30px Outfit'), document.fonts.load('20px "Pixelify Sans"')]); } catch (e) { }
  const t0 = performance.now(), pasos = [['natal', defNatal]];
  const tareas = pasos.map(([id, f]) => () => { LUGARES5[id] = crearLugar(f()); });
  tareas.push(() => { LUGARES5.belen = crearArriba(defBelenArriba5()); });   // M5: Belén desde arriba
  const ints = interiores(); Object.keys(ints).forEach(id => tareas.push(() => { LUGARES5[id] = crearLugar(ints[id]); }));
  tareas.push(() => { ESCENA_MAPA = crearMapaArriba5(); }, () => { ESCENA_SELECTOR = crearSelector(); hacerVelo(); iniciarDia5(); });
  for (let k = 0; k < tareas.length; k++) { tareas[k](); if (barra) barra.style.width = Math.round((k + 1) / tareas.length * 100) + '%'; await new Promise(r => setTimeout(r, 0)); }
  window.__carga = performance.now() - t0;
  document.getElementById('cargando').remove();
  cargarPiano5();
  irA(ESCENA_SELECTOR, { sinTransicion: true });
  requestAnimationFrame(cuadro5);
  window.__mp3 = {
    listo: true, escena: () => ESC === ESCENA_MAPA ? 'mapa' : ESC === ESCENA_SELECTOR ? 'selector' : (ESC && ESC.def && ESC.def.id),
    perfil: id => { GUARDA.d.perfil = id; GUARDA.perfil(); }, ir: (id, o) => irA(id === 'mapa' ? ESCENA_MAPA : id === 'selector' ? ESCENA_SELECTOR : LUGARES5[id], Object.assign({ sinTransicion: true }, o || {})),
    fps: () => FPS5.valor, cuadros: () => FPS5.cuadros.slice(), carga: () => window.__carga,
    jugador: () => ESC && ESC.jugador ? { i: ESC.jugador.fi, j: ESC.jugador.fj, camino: ESC.jugador.camino.length } : null,
    caminar: (i, j) => ESC && ESC.ir ? ESC.ir([i, j]) : false, revelarTodo: () => ESC && ESC.revelarTodo && ESC.revelarTodo(),
    dialogo: () => DIALOGO5.abierto,
    // M2: el día y el niño simulado
    nino: (tipo, fuente, o) => SIM5.iniciar(tipo, fuente, o), pararNino: () => { SIM5.activo = false; }, vel: v => { VEL5 = v; }, fecha: f => { FECHA5 = f; },
    borrarDia: () => { const p = GUARDA.perfil(); if (p) { delete p.m2; GUARDA.guardar(); } },
    empezar: () => empezarDia5(LW5 / 2, LH5 / 2), paradaDirecta: (id, k) => { irA(PARADA5[id], { sinTransicion: true }); if (k) PARADA5[id].irPaso(k); }, carta: () => irA(ESCENA_CARTA, { sinTransicion: true }), duelo: () => irA(PARADA5.conservatorio, { sinTransicion: true }), papas: t => { if (t) PESTANA5 = t; MENU5.abrir('papas'); }, voces: () => window.Voz5 ? Voz5.registro.slice() : [], organo: () => irA(ESCENA_ORGANO, { sinTransicion: true }), paseo: (a, b) => paseo5(a, b),
    dia: () => { const P = ESC; const S = P && P.paso; return { escena: ESC === ESCENA_CARTA ? 'carta' : ESC === ESCENA_ORGANO ? 'organo' : (PARADA5[P && P.id] === P ? 'parada:' + P.id : window.__mp3.escena()), k: P && P.k, modo: S && S.modo, intento: S && S.intento, t: P && P.t, corcheas: m2_() ? m2_().corcheas : 0, paradas: GUARDA.perfil() ? diaHoy5().paradas : null, completo: GUARDA.perfil() ? diaHoy5().completo : false, cancion: GUARDA.perfil() ? diaHoy5().cancion : null, m2: m2_() ? { dominio: m2_().dominio, insignias: m2_().insignias || {}, llaves: m2_().llaves || {}, corazones: PARADA5.conservatorio && PARADA5.conservatorio.corazones } : null, musica: { activa: MUSICA5.activa, id: MUSICA5.id, nivel: MUSICA5.nivel }, t0: SESION5.t0, tFin: SESION5.tFin, reloj: RELOJ, log: SESION5.log.slice(-60), notasSim: SIM5.notas, maxRep: typeof REP5 !== 'undefined' ? REP5.max : null, piano: Snd.estadoPiano ? Snd.estadoPiano() : null }; }, aPantalla: (i, j) => { if (!ESC || !ESC.ipW) return null; const [x, y] = ESC.ipW(i + .5, j + .5); return [x - ESC.cam.x + LW5 / 2, y - ESC.cam.y + LH5 / 2]; },
  };
}

