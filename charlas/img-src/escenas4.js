// =====================================================================
//  Mapa del mundo en tren (6) y pantallas de juego (23–25, 27, 31, 32)
// =====================================================================
// mundo HD-2D en un lienzo aparte (para no teñir la interfaz): fn(ctx) pinta en 1280×720 y luego se posprocesa
function mundoHD(fn, post) { const c = canvas(W, H), x = c.getContext('2d'); fn(x); postHD(x, post || {}); return c; }
// calle lateral en píxel (sirve de franja de mundo): casas, empedrado, personajes
function calleLateral(o = {}) {
  const R = rng(o.semilla || 33), w = o.w || LW, h = o.h || LH, suelo = o.suelo || h - 30;
  return pix(w, h, (g, x) => {
    const gr = x.createLinearGradient(0, 0, 0, suelo); gr.addColorStop(0, o.cielo1 || '#8fd3ff'); gr.addColorStop(1, o.cielo2 || '#ffe2c4'); x.fillStyle = gr; x.fillRect(0, 0, w, suelo);
    for (let i = 0; i < w / 38 + 1; i++) { const bx = i * 38 - 10, bh = 30 + (i * 13) % 26; g.R(bx, suelo - 20 - bh, 34, bh + 20, '#c9b5e8'); for (let y = 0; y < 15; y++) g.R(bx + 15 - y, suelo - 20 - bh - 15 + y, 4 + y * 2, 1, '#b8a0dc'); }
    if (o.casas !== false) for (let i = 0; i < w / 70 + 1; i++) { const s = sprCasa({ w: 64, hf: o.hf || 50, hr: o.hr || 20, col: (i * 3 + 1) % 7, gablete: i % 2 === 0, flores: true }); spr(g, s, i * 70 - (o.desp || 0), suelo); }
    adoquines(g, 0, suelo, w, h - suelo, R); g.R(0, suelo, w, 2, TC.piedra2);
  });
}
// interfaz común
function botonPausa(ctx, x, y) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, 30, 0, 7); ctx.fillStyle = '#fffaf2'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.fillStyle = INK; rr(ctx, x - 11, y - 12, 8, 24, 3); ctx.fill(); rr(ctx, x + 3, y - 12, 8, 24, 3); ctx.fill(); ctx.restore(); }
function hud(ctx, o = {}) {
  botonPausa(ctx, W - 50, 46);
  ctx.save(); rr(ctx, W - 210, 22, 112, 48, 24); ctx.fillStyle = 'rgba(38,23,63,.88)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  estrella(ctx, W - 180, 46, 16); texto(ctx, String(o.estrellas || 12), W - 135, 47, { tam: 28 });
  if (o.progreso != null) { const x = 330, w = 520; ctx.save(); rr(ctx, x, 30, w, 20, 10); ctx.fillStyle = 'rgba(38,23,63,.85)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); rr(ctx, x + 4, 34, (w - 8) * o.progreso, 12, 6); ctx.fillStyle = lg(ctx, x, 0, x + w, 0, [[0, NC.MI], [1, NC.RE]]); ctx.fill(); ctx.restore(); }
}
// el robot-metrónomo en la esquina marcando el pulso (4 puntos, uno encendido)
function robotPulso(ctx, x, y, k, pulso = 1, ang = .4) {
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y - 60, 0, x, y - 60, 110); g.addColorStop(0, 'rgba(255,220,120,.45)'); g.addColorStop(1, 'rgba(255,220,120,0)'); ctx.fillStyle = g; ctx.fillRect(x - 110, y - 170, 220, 220); ctx.restore();
  sprK(ctx, sprRobotB({ ang, ojos: 'abierto' }), x, y, k);
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(x - 54 + i * 36, y + 26, i === pulso ? 13 : 9, 0, 7); ctx.fillStyle = i === pulso ? '#ffd046' : 'rgba(255,255,255,.35)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
  if (pulso != null) { ctx.save(); ctx.strokeStyle = 'rgba(255,208,70,.9)'; ctx.lineWidth = 4; ctx.lineCap = 'round'; const px = x - 54 + pulso * 36; for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 - .9 + i * .9; ctx.beginPath(); ctx.moveTo(px + Math.cos(a) * 19, y + 26 + Math.sin(a) * 19); ctx.lineTo(px + Math.cos(a) * 27, y + 26 + Math.sin(a) * 27); ctx.stroke(); } ctx.restore(); }
}
// teclado de 2 octavas abajo (DO4–SI5); luces por semitono desde DO4
function tecladoAbajo(ctx, luces = {}, o = {}) { return teclado(ctx, 64, o.y || 566, W - 128, o.h || 140, { blancas: 14, luces, colores: true, nombres: o.nombres }); }
const ST = { C4: 0, D4: 2, E4: 4, F4: 5, G4: 7, A4: 9, B4: 11, C5: 12, D5: 14, E5: 16, F5: 17, G5: 19, A5: 21, B5: 23 };

// ---------- 6 · el tren de la historia: 10 estaciones de Europa a Colombia ----------
ESCENAS['w-tren'] = ctx => {
  const m = mundoHD(x => {
    x.fillStyle = lg(x, 0, 0, W, H, [[0, '#5fb8e8'], [1, '#3f7fc8']]); x.fillRect(0, 0, W, H);
    // olas
    x.strokeStyle = 'rgba(255,255,255,.18)'; x.lineWidth = 3; const R = rng(4); for (let i = 0; i < 70; i++) { const a = R() * W, b = R() * H; x.beginPath(); x.arc(a, b, 10, Math.PI * 1.15, Math.PI * 1.85); x.stroke(); }
    const tierra = (pts, c1, c2) => { x.save(); x.shadowColor = 'rgba(20,40,80,.45)'; x.shadowBlur = 20; x.shadowOffsetY = 10; x.beginPath(); pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; i ? x.quadraticCurveTo(p[0], p[1], mx, my) : x.moveTo(mx, my); }); x.closePath(); x.fillStyle = lg(x, 0, 0, 0, H, [[0, c1], [1, c2]]); x.fill(); x.restore(); x.lineWidth = 5; x.strokeStyle = '#f6e7b8'; x.stroke(); };
    tierra([[640, 60], [820, 30], [1010, 40], [1240, 90], [1270, 300], [1200, 470], [1050, 520], [940, 560], [860, 470], [760, 520], [660, 430], [610, 260]], '#9be07a', '#5fbf5a');   // Europa
    tierra([[40, 330], [200, 280], [330, 320], [400, 420], [380, 560], [300, 690], [160, 700], [90, 600], [30, 480]], '#a6e08a', '#4aa04a');   // Colombia y el norte de Suramérica
    // montañas (Alpes y Andes) y bosques
    const monte = (mx, my, s, c = '#8a7a9b') => { x.beginPath(); x.moveTo(mx - s, my); x.lineTo(mx, my - s * 1.2); x.lineTo(mx + s, my); x.fillStyle = c; x.fill(); x.beginPath(); x.moveTo(mx - s * .35, my - s * .78); x.lineTo(mx, my - s * 1.2); x.lineTo(mx + s * .35, my - s * .78); x.fillStyle = '#fff'; x.fill(); };
    [[900, 300, 34], [950, 310, 28], [860, 320, 24]].forEach(a => monte(...a));
    [[150, 520, 40], [200, 560, 34], [110, 600, 30], [230, 470, 26]].forEach(a => monte(...a));
    // la vía: durmientes + rieles
    const via = [[705, 395], [790, 215], [900, 140], [985, 260], [1100, 210], [1170, 330], [1030, 440], [880, 480], [640, 480], [470, 470], [330, 470], [215, 410]];
    x.lineCap = 'round'; x.lineJoin = 'round';
    const camino = () => { x.beginPath(); via.forEach((p, i) => { if (!i) x.moveTo(p[0], p[1]); else { const q = via[i - 1]; x.quadraticCurveTo(q[0] + (p[0] - q[0]) * .5 + (i % 2 ? 30 : -30), q[1] + (p[1] - q[1]) * .5, p[0], p[1]); } }); };
    camino(); x.lineWidth = 26; x.strokeStyle = '#8a5a34'; x.setLineDash([6, 10]); x.stroke(); x.setLineDash([]);
    camino(); x.lineWidth = 14; x.strokeStyle = 'rgba(255,255,255,0)'; x.stroke();
    camino(); x.lineWidth = 4; x.strokeStyle = '#3a2a4a'; x.stroke();
  }, { bloom: .2, vin: .4, calidoA: .35, frioA: .3, polvo: 25, semilla: 2 });
  ctx.drawImage(m, 0, 0);
  // estaciones (10) con su insignia
  const E = [[705, 395, '♪', NC.DO], [790, 215, '✝', NC.RE], [900, 140, '♛', NC.MI], [985, 260, '♫', NC.FA], [1100, 210, '★', NC.SOL], [1170, 330, '✿', NC.LA], [1030, 440, '♬', NC.SI], [880, 480, '☀', NC.DO], [330, 470, '♥', NC.MI], [215, 410, '⌂', NC.FA]];
  E.forEach(([x, y, ic, c], i) => { insignia(ctx, x, y, 34, c, ic); ctx.save(); ctx.beginPath(); ctx.arc(x + 28, y - 28, 14, 0, 7); ctx.fillStyle = '#fffaf2'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); texto(ctx, String(i + 1), x + 28, y - 27, { tam: 18, c: INK }); });
  // estaciones ya visitadas (brillan) y el tren entre la 2 y la 3
  const tren = pix(60, 22, g => { g.R(0, 6, 16, 12, '#ff5a5a'); g.R(2, 2, 10, 5, '#ff5a5a'); g.R(3, 3, 3, 3, '#9fd8ff'); g.R(13, 0, 3, 6, '#3a2a4a'); g.R(20, 8, 18, 10, '#5a7dff'); g.R(40, 8, 18, 10, '#5fd36a'); [22, 26, 30, 42, 46, 50].forEach(x => g.R(x, 10, 3, 3, '#fff3b0')); [3, 11, 24, 34, 44, 54].forEach(x => g.disc(x, 19, 2, '#3a2a4a')); g.R(16, 13, 4, 2, '#3a2a4a'); g.R(38, 13, 2, 2, '#3a2a4a'); });
  ctx.save(); ctx.translate(742, 300); ctx.rotate(-1.15); ctx.imageSmoothingEnabled = false; ctx.drawImage(tren, -90, -33, 180, 66); ctx.restore();
  // humo
  [[770, 230, 14], [800, 210, 18], [830, 196, 22]].forEach(([x, y, r]) => elip(ctx, x, y, r, r * .8, 'rgba(255,255,255,.85)'));
};

// ---------- 23 · práctica A: mundo arriba (40 %), pentagrama al centro, teclado abajo ----------
function pistaPentagrama(ctx, y, o = {}) {
  ctx.save(); rr(ctx, 40, y - 12, W - 80, 196, 22); ctx.fillStyle = 'rgba(255,248,236,.96)'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  const gap = 22, sy = y + 46;
  const notas = (o.notas || [['C4', 'negra'], ['C4', 'negra'], ['G4', 'negra'], ['G4', 'negra'], ['A4', 'negra'], ['A4', 'negra'], ['G4', 'blanca'], ['F4', 'negra'], ['F4', 'negra'], ['E4', 'negra']]).map(([n, f], i) => ({ n, f, c: true, x: 300 + i * 92 + (i > 6 ? 46 : 0), halo: i === 0 ? 'rgba(255,208,70,.9)' : null }));
  const p = pentagrama(ctx, 70, sy, W - 140, gap, notas, { metrica: ['4', '4'], compases: [300 + 3.6 * 92, 300 + 7.6 * 92 + 46] });
  // línea de tocar
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createLinearGradient(270, 0, 330, 0); g.addColorStop(0, 'rgba(255,208,70,0)'); g.addColorStop(.5, 'rgba(255,208,70,.65)'); g.addColorStop(1, 'rgba(255,208,70,0)'); ctx.fillStyle = g; ctx.fillRect(270, y - 6, 60, 186); ctx.restore();
  ctx.save(); ctx.strokeStyle = '#ffd046'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(300, y - 4); ctx.lineTo(300, y + 178); ctx.stroke(); ctx.restore();
  return p;
}
ESCENAS['sc-practica-a'] = ctx => {
  const m = mundoHD(x => { const c = calleLateral({ h: 96, w: LW, desp: 20, hf: 36, hr: 16 }); subir(x, c, 3, 0, 0); sprK(x, sprSarah({ legA: { dx: -2 }, legB: { dx: 2 } }), 330, 280, 3); sprK(x, sprDavid({}), 420, 280, 3); sprK(x, sprRobotB({ ang: .4, ojos: 'feliz' }), 230, 250, 3); [['♪', 520, 120, NC.DO], ['♪', 600, 90, NC.DO]].forEach(([t, a, b, c]) => texto(x, t, a, b, { tam: 46, c, fuente: 'FreeSerif', borde: 4 })); }, { tilt: [.12, 0], blur: 3, bloom: .22, polvo: 20, polvoY: [0, 280], vin: 0, semilla: 23 });
  ctx.fillStyle = '#1c1030'; ctx.fillRect(0, 0, W, H); ctx.drawImage(m, 0, 0, W, 288, 0, 0, W, 288);
  ctx.fillStyle = lg(ctx, 0, 288, 0, H, [[0, '#33204d'], [1, '#1c1030']]); ctx.fillRect(0, 288, W, H - 288);
  pistaPentagrama(ctx, 316);
  tecladoAbajo(ctx, { 0: NC.DO });
  hud(ctx, { progreso: .3 });
};
// ---------- 24 · práctica B: partitura grande, mundo como franja delgada ----------
ESCENAS['sc-practica-b'] = ctx => {
  const m = mundoHD(x => { const c = calleLateral({ h: 40, w: LW, casas: false, desp: 0 }); subir(x, c, 3, 0, 0); sprK(x, sprSarah({}), 380, 118, 3); sprK(x, sprRobotB({ ang: -.4 }), 300, 100, 2.4); }, { bloom: .2, vin: 0, polvo: 10, polvoY: [0, 120], semilla: 24 });
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#33204d'], [1, '#1c1030']]); ctx.fillRect(0, 0, W, H); ctx.drawImage(m, 0, 0, W, 120, 0, 0, W, 120);
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(0, 118, W, 4); ctx.restore();
  // partitura grande sobre papel
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 20; rr(ctx, 60, 140, W - 120, 390, 18); ctx.fillStyle = lg(ctx, 0, 140, 0, 530, [[0, '#fffaf0'], [1, '#f6ead2']]); ctx.fill(); ctx.restore(); ctx.save(); rr(ctx, 60, 140, W - 120, 390, 18); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  const n1 = [['C4', 'negra'], ['C4', 'negra'], ['G4', 'negra'], ['G4', 'negra'], ['A4', 'negra'], ['A4', 'negra'], ['G4', 'blanca']];
  const n2 = [['F4', 'negra'], ['F4', 'negra'], ['E4', 'negra'], ['E4', 'negra'], ['D4', 'negra'], ['D4', 'negra'], ['C4', 'blanca']];
  const fila = (y, ns, act) => { const xs = [250, 340, 430, 520, 650, 740, 830]; const notas = ns.map(([n, f], i) => ({ n, f, c: true, x: xs[i] + (i > 3 ? 0 : 0), halo: i === act ? 'rgba(255,208,70,.95)' : null })); pentagrama(ctx, 100, y, W - 200, 26, notas, { metrica: y < 300 ? ['4', '4'] : null, compases: [590, 940] }); };
  fila(210, n1, 2); fila(380, n2.map(([n, f]) => [n, f]), -1);
  // segunda mitad del renglón 1 y 2 (más compases) — cabezas apagadas: lo que viene
  // dedito-guía sobre la nota que toca
  ctx.save(); ctx.strokeStyle = '#ffd046'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(430, 210 + 4 * 26 - (paso('G4') * 13), 30, 0, 7); ctx.stroke(); ctx.restore();
  tecladoAbajo(ctx, { 7: NC.SOL }, { y: 572, h: 130 });
  hud(ctx, { progreso: .2 });
};
// ---------- 25 · el corredor: carriles = líneas del pentagrama, robot marcando el pulso, «espera» en la nota que toca ----------
ESCENAS['sc-camino'] = ctx => {
  const m = mundoHD(x => {
    const c = calleLateral({ h: 190, w: LW, desp: 30, cielo1: '#ffcfa0', cielo2: '#ffe8c8' }); subir(x, c, 3, 0, 0);
  }, { tilt: [.18, 0], blur: 3, bloom: .25, polvo: 30, polvoY: [0, 520], vin: 0, calidoA: .5, semilla: 25, rayos: [{ x: 200, y: -60, ang: -.5, ancho: 140, largo: 700 }] });
  ctx.drawImage(m, 0, 0, W, 560, 0, 0, W, 560); ctx.fillStyle = '#1c1030'; ctx.fillRect(0, 560, W, 160);
  // carriles: las 5 líneas del pentagrama atraviesan el corredor
  const y0 = 230, gap = 46;
  ctx.save(); rr(ctx, 0, y0 - 40, W, gap * 4 + 80, 0); ctx.fillStyle = 'rgba(28,16,48,.42)'; ctx.fill(); ctx.restore();
  for (let i = 0; i < 5; i++) { ctx.save(); ctx.shadowColor = 'rgba(255,240,200,.9)'; ctx.shadowBlur = 10; ctx.strokeStyle = 'rgba(255,248,230,.95)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, y0 + i * gap); ctx.lineTo(W, y0 + i * gap); ctx.stroke(); ctx.restore(); }
  clave(ctx, 'sol', 20, y0, gap, 'rgba(255,248,230,.95)');
  // notas como orbes de su color (DO con su línea adicional)
  const fondo = y0 + 4 * gap, yN = n => fondo - paso(n) * gap / 2;
  const seq = [['E4', 380], ['G4', 560], ['G4', 700], ['A4', 840], ['G4', 980], ['C5', 1120], ['B4', 1250]];
  seq.forEach(([n, x], i) => { const y = yN(n), c = NC[solfeo(n)]; if (paso(n) <= -2) { ctx.strokeStyle = 'rgba(255,248,230,.9)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 34, y); ctx.lineTo(x + 34, y); ctx.stroke(); }
    ctx.save(); ctx.globalAlpha = i === 0 ? 1 : .92; ctx.shadowColor = c; ctx.shadowBlur = i === 0 ? 30 : 12; ctx.beginPath(); ctx.arc(x, y, 21, 0, 7); ctx.fillStyle = rg(ctx, x, y, 22, [[0, '#ffffff'], [.35, c], [1, mezcla(c, '#2a1a3a', .3)]], x - 7, y - 7); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); });
  // la nota que toca: espera (anillo que respira + reloj de arena)
  const [nE, xE] = seq[0], yE = yN(nE);
  ctx.save(); ctx.strokeStyle = '#ffd046'; ctx.lineWidth = 6; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.arc(xE, yE, 40, 0, 7); ctx.stroke(); ctx.restore();
  ctx.save(); rr(ctx, xE - 26, yE - 116, 52, 56, 14); ctx.fillStyle = '#fffaf2'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.moveTo(xE - 12, yE - 106); ctx.lineTo(xE + 12, yE - 106); ctx.lineTo(xE - 12, yE - 70); ctx.lineTo(xE + 12, yE - 70); ctx.closePath(); ctx.fillStyle = '#ffd046'; ctx.fill(); ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.moveTo(xE, yE - 60); ctx.lineTo(xE - 8, yE - 52); ctx.lineTo(xE + 8, yE - 52); ctx.fillStyle = '#fffaf2'; ctx.fill(); ctx.restore();
  // Sarah corre por el carril y se detiene frente a la nota
  sprK(ctx, sprSarah({ legA: { dx: -2 }, legB: { dx: 2 } }), 270, yE + 18, 3.2);
  // el robot marca el pulso, arriba
  robotPulso(ctx, 1120, 180, 3, 1, .45);
  tecladoAbajo(ctx, { 4: 'rgba(255,208,70,.0)' }, { y: 588, h: 118 });
  // en el teclado, la tecla MI respira suave (pista, sin obligar)
  const kx = 64 + 2.5 * (W - 128) / 14; ctx.save(); ctx.globalCompositeOperation = 'screen'; const gg = ctx.createRadialGradient(kx, 660, 0, kx, 660, 70); gg.addColorStop(0, 'rgba(255,208,70,.7)'); gg.addColorStop(1, 'rgba(255,208,70,0)'); ctx.fillStyle = gg; ctx.fillRect(kx - 70, 590, 140, 120); ctx.restore();
  hud(ctx, { progreso: .45 });
};
// ---------- 27 · pads de ritmo ----------
function figuraRitmo(ctx, x, y, tipo, s = 1) {   // tan (negra), taca (2 corcheas), taaan (blanca), con plica arriba
  const gap = 18 * s, cab = (cx, f) => cabeza(ctx, cx, y, gap, f, INK), plica = cx => { ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(cx + gap * .6, y - gap * .2); ctx.lineTo(cx + gap * .6, y - gap * 3.4); ctx.stroke(); ctx.restore(); };
  if (tipo === 'tan') { cab(x, 'negra'); plica(x); }
  if (tipo === 'taaan') { cab(x, 'blanca'); plica(x); }
  if (tipo === 'taca') { cab(x - gap * 1.4, 'negra'); cab(x + gap * 1.4, 'negra'); plica(x - gap * 1.4); plica(x + gap * 1.4); ctx.save(); ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(x - gap * .8, y - gap * 3.4); ctx.lineTo(x + gap * 2 + 2, y - gap * 3.4); ctx.lineTo(x + gap * 2 + 2, y - gap * 2.75); ctx.lineTo(x - gap * .8, y - gap * 2.75); ctx.fill(); ctx.restore(); }
}
ESCENAS['sc-pads'] = ctx => {
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#3a2566'], [1, '#140c26']]); ctx.fillRect(0, 0, W, H);
  // luces de escenario
  [[200, '#ff5a5a'], [640, '#ffd046'], [1080, '#3fc7f0']].forEach(([x, c]) => { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createLinearGradient(0, 0, 0, 500); g.addColorStop(0, c + '66'); g.addColorStop(1, c + '00'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 40, 0); ctx.lineTo(x + 40, 0); ctx.lineTo(x + 180, 500); ctx.lineTo(x - 180, 500); ctx.fill(); ctx.restore(); });
  // tarjetas de ritmo: tan · taca · taaan · tan
  const tarjetas = [['tan', 'tan', NC.DO], ['taca', 'ta-ca', NC.MI], ['taaan', 'taaan', NC.FA], ['tan', 'tan', NC.SOL]];
  tarjetas.forEach(([t, sil, c], i) => { const x = 150 + i * 260, y = 70, w = 200, h = 210, on = i === 1;
    ctx.save(); ctx.shadowColor = on ? c : 'rgba(0,0,0,.4)'; ctx.shadowBlur = on ? 40 : 14; rr(ctx, x, y, w, h, 22); ctx.fillStyle = '#fffaf2'; ctx.fill(); ctx.restore(); ctx.save(); rr(ctx, x, y, w, h, 22); ctx.lineWidth = on ? 7 : 5; ctx.strokeStyle = on ? c : INK; ctx.stroke(); ctx.restore();
    ctx.save(); rr(ctx, x, y, w, 30, 0); ctx.restore(); ctx.fillStyle = c; rr(ctx, x + 14, y + 14, w - 28, 12, 6); ctx.fill();
    figuraRitmo(ctx, x + w / 2 - (t === 'taca' ? 6 : 0), y + 140, t, 1.3); texto(ctx, sil, x + w / 2, y + 182, { tam: 30, c: INK }); });
  // el pulso que late
  for (let i = 0; i < 4; i++) { const x = 250 + i * 260; ctx.beginPath(); ctx.arc(x, 318, i === 1 ? 18 : 12, 0, 7); ctx.fillStyle = i === 1 ? '#ffd046' : 'rgba(255,255,255,.3)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const gp = ctx.createRadialGradient(510, 318, 0, 510, 318, 60); gp.addColorStop(0, 'rgba(255,208,70,.8)'); gp.addColorStop(1, 'rgba(255,208,70,0)'); ctx.fillStyle = gp; ctx.fillRect(450, 258, 120, 120); ctx.restore();
  // 4 pads grandes
  const pads = [[NC.DO, 'tambor'], [NC.MI, 'palmas'], [NC.FA, 'platillo'], [NC.LA, 'campana']];
  pads.forEach(([c, n], i) => { const x = 110 + i * 275, y = 370, w = 240, h = 300, on = i === 1;
    ctx.save(); ctx.shadowColor = on ? c : 'rgba(0,0,0,.5)'; ctx.shadowBlur = on ? 60 : 18; ctx.shadowOffsetY = on ? 0 : 8; rr(ctx, x, y, w, h, 34); ctx.fillStyle = rg(ctx, x + w / 2, y + h / 2, h * .8, [[0, on ? '#ffffff' : mezcla(c, '#fff', .35)], [.45, c], [1, mezcla(c, '#2a1a3a', .45)]], x + w * .35, y + h * .3); ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, x, y, w, h, 34); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); rr(ctx, x + 14, y + 14, w - 28, 40, 18); ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fill(); ctx.restore();
    // icono del sonido
    const cx = x + w / 2, cy = y + h / 2 + 10;
    ctx.save(); ctx.fillStyle = 'rgba(42,26,58,.75)'; ctx.strokeStyle = 'rgba(42,26,58,.75)'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    if (i === 0) { ctx.beginPath(); ctx.ellipse(cx, cy - 20, 52, 18, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx - 52, cy - 20); ctx.lineTo(cx - 52, cy + 30); ctx.moveTo(cx + 52, cy - 20); ctx.lineTo(cx + 52, cy + 30); ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, cy + 30, 52, 18, 0, 0, Math.PI); ctx.stroke(); }
    if (i === 1) { [[-22, 0, -.4], [22, 0, .4]].forEach(([dx, dy, a]) => { ctx.save(); ctx.translate(cx + dx, cy + dy); ctx.rotate(a); rr(ctx, -20, -34, 40, 64, 18); ctx.fill(); ctx.restore(); }); ctx.beginPath(); ctx.moveTo(cx - 50, cy - 60); ctx.lineTo(cx - 36, cy - 44); ctx.moveTo(cx, cy - 70); ctx.lineTo(cx, cy - 50); ctx.moveTo(cx + 50, cy - 60); ctx.lineTo(cx + 36, cy - 44); ctx.stroke(); }
    if (i === 2) { ctx.beginPath(); ctx.ellipse(cx, cy - 10, 70, 16, -.15, 0, 7); ctx.fill(); ctx.fillRect(cx - 4, cy - 10, 8, 70); }
    if (i === 3) { ctx.beginPath(); ctx.moveTo(cx - 40, cy + 30); ctx.quadraticCurveTo(cx - 40, cy - 50, cx, cy - 50); ctx.quadraticCurveTo(cx + 40, cy - 50, cx + 40, cy + 30); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(cx, cy + 40, 10, 0, 7); ctx.fill(); }
    ctx.restore();
    if (on) for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2, r1 = 150, r2 = 180; ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r1 * .9, cy + Math.sin(a) * r1 * .9); ctx.lineTo(cx + Math.cos(a) * r2 * .9, cy + Math.sin(a) * r2 * .9); ctx.stroke(); ctx.restore(); }
  });
  robotPulso(ctx, 1190, 300, 2.4, 1, -.4);
  botonPausa(ctx, W - 50, 46);
};
// ---------- 31 · el acierto: A estalla, B paso + onda, C palabra grande ----------
const MINI_X = 190;
function miniPantalla(ctx, x, y, w, h, letra, fn) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8; rr(ctx, x, y, w, h, 24); ctx.fillStyle = '#1c1030'; ctx.fill(); ctx.restore();
  ctx.save(); rr(ctx, x, y, w, h, 24); ctx.clip(); const c = canvas(W, H), cx = c.getContext('2d'); fn(cx, W, H); const sw = H * w / h; ctx.drawImage(c, MINI_X, 0, sw, H, x, y, w, h); ctx.restore();
  ctx.save(); rr(ctx, x, y, w, h, 24); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  rotulo(ctx, letra, x + 34, y + 34, { r: 24 });
}
function escenaJuegoBase(cx, o = {}) {   // mundo + carril + teclado (para las mini-pantallas)
  const m = mundoHD(x => { const c = calleLateral({ h: 190, w: LW, desp: 40 }); subir(x, c, 3); if (o.encima) o.encima(x); }, { bloom: .22, vin: .2, polvo: 15, semilla: 31 });
  cx.drawImage(m, 0, 0); cx.fillStyle = '#1c1030'; cx.fillRect(0, 560, W, 160); tecladoAbajo(cx, o.luces || {}, { y: 588, h: 118 });
}
ESCENAS['sc-acierto'] = ctx => {
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#33204d'], [1, '#140c26']]); ctx.fillRect(0, 0, W, H);
  const w = 392, h = 560, y = 80;
  miniPantalla(ctx, 30, y, w, h, 'A', (cx) => {
    escenaJuegoBase(cx, { luces: { 7: NC.SOL }, encima: x => { sprK(x, sprSarah({ eyes: 'happy' }), 330, 520, 4); } });
    // el bloque estalla en su color
    const bx = 520, by = 300, c = NC.SOL; cx.save(); cx.globalCompositeOperation = 'screen'; const g = cx.createRadialGradient(bx, by, 0, bx, by, 260); g.addColorStop(0, 'rgba(180,240,255,1)'); g.addColorStop(.3, 'rgba(63,199,240,.8)'); g.addColorStop(1, 'rgba(63,199,240,0)'); cx.fillStyle = g; cx.fillRect(bx - 260, by - 260, 520, 520); cx.restore();
    const R = rng(3); for (let i = 0; i < 26; i++) { const a = R() * 7, d = 60 + R() * 140, s = 14 + R() * 22; cx.save(); cx.translate(bx + Math.cos(a) * d, by + Math.sin(a) * d); cx.rotate(a); cx.fillStyle = i % 3 ? c : '#fffaf2'; cx.fillRect(-s / 2, -s / 2, s, s); cx.lineWidth = 3; cx.strokeStyle = INK; cx.strokeRect(-s / 2, -s / 2, s, s); cx.restore(); }
    for (let i = 0; i < 8; i++) estrella(cx, bx + Math.cos(i * .8) * 150, by + Math.sin(i * .8) * 140, 22);
    // contador
    cx.save(); rr(cx, 470, 30, 210, 100, 40); cx.fillStyle = 'rgba(38,23,63,.9)'; cx.fill(); cx.lineWidth = 6; cx.strokeStyle = INK; cx.stroke(); cx.restore(); texto(cx, '× 7', 575, 82, { tam: 70, c: '#ffd046', borde: 8 });
  });
  miniPantalla(ctx, 444, y, w, h, 'B', (cx) => {
    escenaJuegoBase(cx, { luces: { 7: NC.SOL }, encima: x => {
      sprK(x, sprSarah({ legA: { dx: -2 }, legB: { dx: 2 } }), 330, 520, 4, { alpha: .3 }); sprK(x, sprSarah({ legA: { dx: -2 }, legB: { dx: 2 } }), 450, 520, 4);
      x.save(); x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 8; x.lineCap = 'round'; [[400, 420], [410, 470]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(a - 60, b); x.stroke(); }); x.restore();
    } });
    // onda de sonido que sale de la tecla y del personaje
    const kx = 64 + 4.5 * (W - 128) / 14; for (let i = 1; i <= 4; i++) { cx.save(); cx.globalAlpha = 1 - i * .2; cx.strokeStyle = NC.SOL; cx.lineWidth = 10; cx.beginPath(); cx.ellipse(kx, 580, 70 * i, 30 * i, 0, Math.PI, 0); cx.stroke(); cx.restore(); }
    texto(cx, '♪', 560, 230, { tam: 150, c: NC.SOL, fuente: 'FreeSerif', borde: 10 });
  });
  miniPantalla(ctx, 858, y, w, h, 'C', (cx) => {
    escenaJuegoBase(cx, { luces: { 7: NC.SOL }, encima: x => sprK(x, sprSarah({ eyes: 'happy' }), 330, 520, 4) });
    cx.save(); cx.fillStyle = 'rgba(20,10,40,.35)'; cx.fillRect(0, 0, W, 560); cx.restore();
    texto(cx, '¡Bien!', 442, 280, { tam: 150, c: '#ffd046', borde: 18, peso: 700 });
    for (let i = 0; i < 4; i++) estrella(cx, 250 + i * 125, 420 + (i % 2) * 30, 26);
  });
  texto(ctx, '¿Qué pasa cuando aciertas?', 640, 40, { tam: 30, c: '#d8c9f0' });
};
// ---------- 32 · el error: A casi invisible, B claro y amable, C con consecuencia ----------
ESCENAS['sc-error'] = ctx => {
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#33204d'], [1, '#140c26']]); ctx.fillRect(0, 0, W, H);
  const w = 392, h = 560, y = 80;
  miniPantalla(ctx, 30, y, w, h, 'A', (cx) => {
    escenaJuegoBase(cx, { luces: { 5: 'rgba(201,181,255,.55)' }, encima: x => sprK(x, sprSarah({}), 330, 520, 4) });
    // apenas un destello lila sobre la tecla tocada
    const kx = 64 + 3.5 * (W - 128) / 14; cx.save(); cx.globalCompositeOperation = 'screen'; const g = cx.createRadialGradient(kx, 640, 0, kx, 640, 90); g.addColorStop(0, 'rgba(201,181,255,.55)'); g.addColorStop(1, 'rgba(201,181,255,0)'); cx.fillStyle = g; cx.fillRect(kx - 90, 550, 180, 170); cx.restore();
  });
  miniPantalla(ctx, 444, y, w, h, 'B', (cx) => {
    escenaJuegoBase(cx, { luces: { 5: 'rgba(201,181,255,.6)', 7: NC.SOL }, encima: x => { sprK(x, sprSarah({ eyes: 'hurt' }), 360, 520, 4); texto(x, '?', 380, 300, { tam: 70, c: '#fff3b0', borde: 8 }); } });
    // la tecla correcta brilla y una flechita amable
    const kx = 64 + 4.5 * (W - 128) / 14; cx.save(); cx.globalCompositeOperation = 'screen'; const g = cx.createRadialGradient(kx, 640, 0, kx, 640, 130); g.addColorStop(0, 'rgba(63,199,240,.95)'); g.addColorStop(1, 'rgba(63,199,240,0)'); cx.fillStyle = g; cx.fillRect(kx - 130, 520, 260, 200); cx.restore();
    cx.save(); cx.fillStyle = '#ffd046'; cx.strokeStyle = INK; cx.lineWidth = 6; cx.beginPath(); cx.moveTo(kx, 575); cx.lineTo(kx - 40, 515); cx.lineTo(kx - 16, 515); cx.lineTo(kx - 16, 460); cx.lineTo(kx + 16, 460); cx.lineTo(kx + 16, 515); cx.lineTo(kx + 40, 515); cx.closePath(); cx.fill(); cx.stroke(); cx.restore();
    sprK(cx, sprRobotB({ ojos: 'abierto', ang: 0 }), 600, 400, 4);
  });
  miniPantalla(ctx, 858, y, w, h, 'C', (cx) => {
    escenaJuegoBase(cx, { luces: { 5: 'rgba(255,90,90,.6)' }, encima: x => sprK(x, sprSarah({ eyes: 'hurt' }), 330, 520, 4) });
    cx.save(); rr(cx, 360, 30, 320, 100, 40); cx.fillStyle = 'rgba(38,23,63,.9)'; cx.fill(); cx.lineWidth = 6; cx.strokeStyle = INK; cx.stroke(); cx.restore();
    corazon(cx, 420, 82, 30); corazon(cx, 520, 82, 30); corazon(cx, 620, 82, 30, '#ff5a7a', true);
    // el corazón que se va
    cx.save(); cx.globalAlpha = .75; corazon(cx, 620, 220, 40); cx.restore(); cx.save(); cx.strokeStyle = 'rgba(255,255,255,.6)'; cx.lineWidth = 6; [[590, 150], [650, 160]].forEach(([a, b]) => { cx.beginPath(); cx.moveTo(a, b); cx.lineTo(a + 10, b + 30); cx.stroke(); }); cx.restore();
  });
  texto(ctx, '¿Qué pasa cuando te equivocas?', 640, 40, { tam: 30, c: '#d8c9f0' });
};
