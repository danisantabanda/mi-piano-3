// =====================================================================
//  Charla 5 · trajes, duelo, luthier, premios, avance, primer día, Estrellita
// =====================================================================
// ---------- trajes (capas de píxel encima de los sprites originales: se conservan las caritas) ----------
function conTraje(base, tipo, quien) {
  return cache('traje' + tipo + quien, () => sprite(34, 36, g => {
    const S = quien === 'sarah';
    if (tipo === 'viajero') {   // capa corta detrás de los hombros y bolso de partituras
      const C = S ? '#2a4b9b' : '#8a3a22', C2 = S ? '#1d3672' : '#6a2a16';
      g.R(5, 18, 5, 11, C); g.R(22, 18, 5, 11, C); g.R(5, 28, 5, 1, C2); g.R(22, 28, 5, 1, C2);
    }
    g.ctx.drawImage(base, -1, -1);
    if (tipo === 'viajero') {
      const C = S ? '#2a4b9b' : '#8a3a22';
      g.R(9, 17, 14, 2, C); g.px(16, 18, '#d9a930'); g.px(15, 18, '#ffd046');
      g.line(10, 19, 21, 27, '#6a3a1a'); g.R(20, 25, 8, 7, '#8a5a34'); g.R(20, 25, 8, 1, '#a8703a'); g.R(21, 23, 5, 3, '#fffaf4'); g.px(22, 24, INK); g.px(24, 24, INK);
      if (!S) { g.line(4, 21, 2, 29, '#7a4a24'); g.line(2, 29, 5, 31, '#7a4a24'); g.R(4, 30, 3, 2, '#5a3418'); }   // la honda
    }
    if (tipo === 'medieval') {
      const C = S ? '#2e8b6a' : '#6a4a3a', C2 = S ? '#1f6a50' : '#4a3226';
      g.R(4, 3, 3, 13, C); g.R(25, 3, 3, 13, C); g.R(6, 0, 20, 3, C); g.R(7, 0, 18, 1, C2);   // capucha alrededor de la carita
      g.R(8, 18, 16, 11, C); g.R(8, 23, 16, 1, '#d9a930'); g.R(15, 18, 2, 11, C2); if (S) g.R(9, 28, 14, 3, C);
    }
    if (tipo === 'barroco') {
      const C = S ? '#d2452e' : '#2a4b9b';
      g.R(7, 18, 18, 11, C); g.R(14, 18, 4, 6, '#fffaf4'); for (let y = 20; y < 29; y += 3) { g.px(12, y, '#ffd046'); g.px(19, y, '#ffd046'); } g.R(7, 28, 18, 1, '#d9a930');
      if (S) { g.R(9, -1, 14, 2, '#fffaf4'); g.px(16, -2, '#ff9cc4'); } else { g.R(5, 0, 22, 3, '#2a1a3a'); g.R(10, -2, 12, 3, '#2a1a3a'); g.px(16, 0, '#ffd046'); }   // tricornio
    }
    if (tipo === 'andino') {
      const C = S ? '#d2452e' : '#8a5a34', C2 = '#fbf1d8';
      for (let y = 17; y < 28; y++) { const half = Math.round(6 + (y - 17) * .6); g.R(16 - half, y, half * 2, 1, (y % 4 === 0) ? C2 : C); }   // ruana con franjas
      g.R(15, 17, 2, 3, '#2a1a3a');
      g.R(3, 4, 26, 2, '#e8d6a0'); g.R(9, 0, 14, 5, '#e8d6a0'); g.R(9, 3, 14, 1, '#2a1a3a'); if (S) g.px(21, 2, NC.DO);   // sombrero
    }
  }, { ax: base.ax, ay: base.ay }));
}
ESCENAS['c-trajes'] = ctx => {
  fondoEscenario(ctx, '#3a2566', '#1c1030');
  const A = (ctx, cx, b) => { sprK(ctx, sprSarah({}), cx - 66, b - 4, 6); sprK(ctx, sprDavid({}), cx + 66, b - 4, 6); };
  const B = (ctx, cx, b) => { sprK(ctx, conTraje(sprSarah({ cross: 'up' }), 'viajero', 'sarah'), cx - 66, b - 4, 6); sprK(ctx, conTraje(sprDavid({}), 'viajero', 'david'), cx + 66, b - 4, 6); };
  const C = (ctx, cx, b) => {
    [['medieval', -230], ['barroco', -120], ['andino', 0]].forEach(([t, dy], f) => { sprK(ctx, conTraje(sprSarah({}), t, 'sarah'), cx - 50, b - 4 + dy, 3.2); sprK(ctx, conTraje(sprDavid({}), t, 'david'), cx + 50, b - 4 + dy, 3.2); });
  };
  tres(ctx, [A, B, C]);
  postHD(ctx, { bloom: .2, calido: false, vin: .3, polvo: 30, polvoY: [40, 400], semilla: 14 });
};
// ---------- 12 · duelo en el Conservatorio ----------
ESCENAS['rival-duelo'] = ctx => {
  // salón del conservatorio: piso de ajedrez suave, columnas y estandartes
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#2a3a7a'], [1, '#1c1438']]); ctx.fillRect(0, 0, W, H);
  for (let k = 0; k < 6; k++) { const x = 60 + k * 230; ctx.fillStyle = lg(ctx, x, 0, x + 50, 0, [[0, '#e8dcc4'], [1, '#b8a888']]); ctx.fillRect(x, 0, 50, 420); ctx.fillStyle = ['#d2452e', '#2a4b9b', '#d9a930'][k % 3]; ctx.beginPath(); ctx.moveTo(x + 70, 40); ctx.lineTo(x + 170, 40); ctx.lineTo(x + 170, 200); ctx.lineTo(x + 120, 170); ctx.lineTo(x + 70, 200); ctx.closePath(); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.fillStyle = '#c9b48e'; ctx.beginPath(); ctx.moveTo(0, 380); ctx.lineTo(W, 380); ctx.lineTo(W, 560); ctx.lineTo(0, 560); ctx.fill();
  for (let i = 0; i < 14; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) { ctx.fillStyle = '#a8946e'; ctx.fillRect(i * 92, 380 + j * 45, 92, 45); }
  // plataformas
  elip(ctx, 980, 330, 170, 40, '#8a5a34'); elip(ctx, 980, 320, 170, 40, '#c98a52');
  elip(ctx, 260, 520, 150, 34, '#8a5a34'); elip(ctx, 260, 512, 150, 34, '#c98a52');
  sprK(ctx, RIVALES.A(), 980, 322, 6); sprK(ctx, conTraje(sprSarah({ cross: 'up' }), 'viajero', 'sarah'), 260, 512, 6);
  // la frase del rival: notas que salen de la trompeta
  [['♪', 1150, 150, NC.SOL], ['♪', 1080, 90, NC.MI], ['♫', 1180, 60, NC.SOL], ['♪', 1110, 30, NC.LA]].forEach(([t, x, y, c]) => texto(ctx, t, x, y + 40, { tam: 58, c, fuente: 'FreeSerif', borde: 6 }));
  ctx.save(); ctx.strokeStyle = 'rgba(255,240,180,.7)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(1110, 190, 20 + i * 20, -1.4, -.2); ctx.stroke(); } ctx.restore();
  // marcador de estrellas
  panel(ctx, 470, 30, 340, 90, { fondo: 'rgba(38,23,63,.92)', r: 45 });
  [0, 1, 2].forEach(k => estrella(ctx, 520 + k * 42, 75, 17, '#ffd046')); texto(ctx, 'vs', 640, 76, { tam: 28, c: '#d8c9f0' }); [0, 1].forEach(k => estrella(ctx, 690 + k * 42, 75, 17, '#ffd046')); estrella(ctx, 774, 75, 17, 'rgba(255,255,255,.2)');
  sprK(ctx, sprRobotB({ ojos: 'abierto', ang: .4 }), 640, 300, 3);
  tecladoAbajo(ctx, { 7: 'rgba(255,208,70,.0)' }, { y: 588, h: 118 });
  postHD(ctx, { bloom: .25, calido: false, vin: .4, polvo: 30, polvoY: [0, 540], semilla: 12, rayos: [{ x: 980, y: -40, ang: 0, ancho: 140, largo: 380, c: 'rgba(255,230,170,.35)' }] });
};
// ---------- 13 · la tienda del luthier ----------
function violin(ctx, x, y, s, ang = 0, c = '#c96a2a') { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.beginPath(); ctx.ellipse(0, 22, 20, 22, 0, 0, 7); ctx.ellipse(0, -12, 16, 17, 0, 0, 7); ctx.fillStyle = lg(ctx, -20, 0, 20, 0, [[0, mezcla(c, '#fff', .25)], [1, mezcla(c, '#000', .3)]]); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#3a2418'; ctx.fillRect(-3, -50, 6, 60); ctx.strokeRect(-3, -50, 6, 60); ctx.beginPath(); ctx.arc(0, -56, 6, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#2a1a1a'; ctx.beginPath(); ctx.moveTo(-7, 8); ctx.quadraticCurveTo(-10, 2, -6, -2); ctx.moveTo(7, 8); ctx.quadraticCurveTo(10, 2, 6, -2); ctx.stroke(); ctx.restore(); }
function laud(ctx, x, y, s, ang = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.beginPath(); ctx.ellipse(0, 20, 26, 32, 0, 0, 7); ctx.fillStyle = lg(ctx, -26, 0, 26, 0, [[0, '#e8b47c'], [1, '#9a6038']]); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 14, 7, 0, 7); ctx.fillStyle = '#3a2418'; ctx.fill(); ctx.fillStyle = '#5a3418'; ctx.fillRect(-4, -46, 8, 40); ctx.strokeRect(-4, -46, 8, 40); ctx.beginPath(); ctx.moveTo(-4, -46); ctx.lineTo(-14, -60); ctx.lineTo(4, -48); ctx.fill(); ctx.stroke(); ctx.restore(); }
function trompeta(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.fillStyle = '#ffd046'; ctx.fillRect(-40, -4, 60, 8); ctx.strokeRect(-40, -4, 60, 8); ctx.beginPath(); ctx.moveTo(20, -4); ctx.lineTo(44, -16); ctx.lineTo(44, 16); ctx.lineTo(20, 4); ctx.closePath(); ctx.fill(); ctx.stroke(); [-24, -14, -4].forEach(k => { ctx.fillRect(k, -14, 5, 10); ctx.strokeRect(k, -14, 5, 10); }); ctx.restore(); }
function precio(ctx, x, y, n) { ctx.save(); ctx.strokeStyle = '#7a4a24'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - 34); ctx.lineTo(x, y - 12); ctx.stroke(); ctx.restore(); rr(ctx, x - 32, y - 14, 64, 34, 10); ctx.fillStyle = '#fff1d6'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke(); texto(ctx, '♪', x - 14, y + 4, { tam: 26, c: '#d9a930', fuente: 'FreeSerif', borde: 3, bordeC: '#7a4a10' }); texto(ctx, String(n), x + 12, y + 4, { tam: 20, c: INK }); }
ESCENAS['luthier'] = ctx => {
  const c = pix(LW, LH, g => { tablas(g, 0, 0, LW, 150, '#9a6038', '#7a4a2a'); for (let x = 0; x < LW; x += 24) g.R(x, 0, 2, 150, '#6e4426'); tablas(g, 0, 150, LW, 90, '#c98a52', '#a86e3e'); });
  subir(ctx, c, 3);
  // repisas
  [180, 330].forEach(y => { ctx.fillStyle = '#5a3418'; ctx.fillRect(40, y, 1200, 14); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(40, y + 14, 1200, 10); });
  violin(ctx, 120, 110, 1.1, -.15); violin(ctx, 230, 110, 1.1, .1, '#a84a1a'); laud(ctx, 360, 110, 1.05, -.1); violin(ctx, 480, 112, .9, 0, '#d8823a');
  ctx.save(); ctx.translate(600, 100); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.fillStyle = '#c98a52'; ctx.fillRect(-6, -60, 12, 120); ctx.strokeRect(-6, -60, 12, 120); [-40, -20, 0, 20, 40].forEach(k => { ctx.beginPath(); ctx.arc(0, k, 3, 0, 7); ctx.fillStyle = INK; ctx.fill(); }); ctx.restore();   // flauta
  trompeta(ctx, 760, 150, 1.3); laud(ctx, 900, 110, .9, .15);
  // tiple (andino) y un tamborcito
  violin(ctx, 1030, 112, 1, -.1, '#e8b47c'); ctx.save(); elip(ctx, 1150, 150, 44, 16, '#e8d6a0'); ctx.fillStyle = '#d2452e'; ctx.fillRect(1106, 150, 88, 40); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.strokeRect(1106, 150, 88, 40); ctx.restore();
  [[120, 0], [230, 1], [360, 2], [480, 3], [600, 4], [760, 5], [900, 6], [1030, 7], [1150, 8]].forEach(([x, k]) => precio(ctx, x, 222, [12, 15, 20, 9, 6, 18, 14, 25, 8][k]));
  // maniquíes con trajes
  [[230, 'viajero', 'sarah'], [380, 'medieval', 'david'], [900, 'barroco', 'sarah'], [1050, 'andino', 'david']].forEach(([x, t, q], i) => { const base = q === 'sarah' ? sprSarah({}) : sprDavid({}); ctx.save(); ctx.globalAlpha = 1; sprK(ctx, teñido(conTraje(base, t, q), 'rgba(0,0,0,0)'), 0, 0, 1); ctx.restore(); ctx.fillStyle = '#5a3418'; ctx.fillRect(x - 3, 560, 6, 60); elip(ctx, x, 620, 30, 8, '#5a3418'); sprK(ctx, conTraje(base, t, q), x, 570, 4); precio(ctx, x + 70, 470, [30, 24, 36, 28][i]); });
  // el luthier tras el mostrador
  ctx.fillStyle = lg(ctx, 0, 560, 0, 720, [[0, '#8a5a34'], [1, '#5a3418']]); rr(ctx, 520, 560, 260, 160, 10); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  sprK(ctx, adulto({ id: 'luthier', barba: true, pelo: '#e2d8ca', pelo2: '#fffaf4', ropa: '#fffaf2', saco: '#8a5a34', extra: g => { g.R(9, 6, 9, 3, 'rgba(0,0,0,0)'); g.R(8, 7, 4, 3, '#9fd8ff'); g.R(14, 7, 4, 3, '#9fd8ff'); g.R(12, 8, 2, 1, INK); } }), 650, 572, 5);
  violin(ctx, 720, 590, .8, 1.2); sprK(ctx, sprSarah({ eyes: 'happy' }), 440, 700, 4); sprK(ctx, sprRobotB({ ojos: 'feliz' }), 360, 640, 3);
  postHD(ctx, { bloom: .3, vin: .55, calidoA: .55, frioA: .25, polvo: 50, semilla: 13, luces: [{ x: 640, y: 300, r: 500, c: 'rgba(255,205,140,.45)', modo: 'soft-light' }] });
};
// ---------- premios ----------
function fondoCalido(ctx) { ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#3a2566'], [1, '#140c26']]); ctx.fillRect(0, 0, W, H); const g = ctx.createRadialGradient(640, 360, 0, 640, 360, 600); g.addColorStop(0, 'rgba(255,210,140,.35)'); g.addColorStop(1, 'rgba(255,210,140,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function rayosLuz(ctx, x, y, n = 14, L = 420, c = 'rgba(255,224,130,.5)') { ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < n; i++) { ctx.save(); ctx.translate(x, y); ctx.rotate(i / n * Math.PI * 2); const g = ctx.createLinearGradient(0, 0, 0, L); g.addColorStop(0, c); g.addColorStop(1, 'rgba(255,224,130,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.lineTo(50, L); ctx.lineTo(-50, L); ctx.fill(); ctx.restore(); } ctx.restore(); }
function regalo(ctx, x, y, s, c = NC.DO) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.fillStyle = c; ctx.fillRect(-40, -30, 80, 60); ctx.strokeRect(-40, -30, 80, 60); ctx.fillRect(-46, -46, 92, 18); ctx.strokeRect(-46, -46, 92, 18); ctx.fillStyle = '#ffd046'; ctx.fillRect(-7, -46, 14, 76); ctx.strokeRect(-7, -46, 14, 76); ctx.beginPath(); ctx.ellipse(-16, -54, 14, 8, -.4, 0, 7); ctx.ellipse(16, -54, 14, 8, .4, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
ESCENAS['premio-a'] = ctx => {   // caja de música que se abre
  fondoCalido(ctx); rayosLuz(ctx, 640, 330);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14;
  ctx.fillStyle = lg(ctx, 0, 380, 0, 620, [[0, '#a8603a'], [1, '#6a3418']]); ctx.beginPath(); ctx.moveTo(380, 420); ctx.lineTo(900, 420); ctx.lineTo(960, 470); ctx.lineTo(960, 640); ctx.lineTo(440, 640); ctx.lineTo(380, 590); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(380, 420); ctx.lineTo(900, 420); ctx.lineTo(960, 470); ctx.lineTo(960, 640); ctx.lineTo(440, 640); ctx.lineTo(380, 590); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(440, 640); ctx.lineTo(440, 470); ctx.lineTo(960, 470); ctx.moveTo(440, 470); ctx.lineTo(380, 420); ctx.stroke();
  ctx.fillStyle = '#3a1a2a'; ctx.beginPath(); ctx.moveTo(440, 470); ctx.lineTo(960, 470); ctx.lineTo(900, 420); ctx.lineTo(380, 420); ctx.fill();
  // tapa abierta con un paisaje pintado y el espejo
  ctx.fillStyle = lg(ctx, 0, 120, 0, 420, [[0, '#c87a4a'], [1, '#8a4a24']]); ctx.beginPath(); ctx.moveTo(380, 420); ctx.lineTo(900, 420); ctx.lineTo(860, 140); ctx.lineTo(420, 140); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = lg(ctx, 0, 160, 0, 400, [[0, '#9fd8ff'], [1, '#f6e4c4']]); ctx.beginPath(); ctx.moveTo(420, 400); ctx.lineTo(860, 400); ctx.lineTo(830, 170); ctx.lineTo(450, 170); ctx.closePath(); ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
  // cilindro de púas y peine
  ctx.fillStyle = '#d9a930'; rr(ctx, 520, 440, 260, 24, 12); ctx.fill(); ctx.stroke(); for (let k = 0; k < 16; k++) { ctx.fillStyle = '#fff3b0'; ctx.fillRect(530 + k * 15, 444, 3, 4); }
  // la bailarina-nota que gira
  ctx.save(); ctx.translate(640, 420); ctx.fillStyle = '#ffd046'; ctx.fillRect(-3, -40, 6, 40); texto(ctx, '♪', 0, -80, { tam: 90, c: NC.DO, fuente: 'FreeSerif', borde: 6 }); ctx.restore();
  [['♪', 480, 120, NC.SOL], ['♫', 800, 90, NC.MI], ['♪', 900, 200, NC.LA]].forEach(([t, x, y, c]) => texto(ctx, t, x, y, { tam: 60, c, fuente: 'FreeSerif', borde: 5 }));
  regalo(ctx, 1080, 560, 1, NC.SOL); sprK(ctx, sprSarah({ eyes: 'happy' }), 200, 660, 5);
  postHD(ctx, { bloom: .3, calido: false, vin: .4, polvo: 60, semilla: 15 });
};
ESCENAS['premio-b'] = ctx => {   // el órgano del día: 5 tubos que se encienden, suena y cae el premio
  fondoCalido(ctx);
  // fachada de órgano barroca
  ctx.fillStyle = lg(ctx, 0, 100, 0, 640, [[0, '#8a4a24'], [1, '#4a2410']]); ctx.beginPath(); ctx.moveTo(300, 640); ctx.lineTo(300, 200); ctx.quadraticCurveTo(640, 40, 980, 200); ctx.lineTo(980, 640); ctx.closePath(); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.strokeStyle = '#d9a930'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(320, 210); ctx.quadraticCurveTo(640, 64, 960, 210); ctx.stroke();
  const tubos = [[NC.DO, 300], [NC.MI, 360], [NC.FA, 420], [NC.SOL, 360], [NC.SI, 300]];
  tubos.forEach(([c, h], k) => { const x = 410 + k * 115, base = 560, w = 70;
    ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 40; rr(ctx, x - w / 2, base - h, w, h, 30); ctx.fillStyle = lg(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mezcla(c, '#fff', .55)], [.45, c], [1, mezcla(c, '#000', .35)]]); ctx.fill(); ctx.restore();
    rr(ctx, x - w / 2, base - h, w, h, 30); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 20, base - 60); ctx.lineTo(x, base - 84); ctx.lineTo(x + 20, base - 60); ctx.closePath(); ctx.fillStyle = '#2a1a3a'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.5)'; rr(ctx, x - w / 2 + 10, base - h + 30, 10, h - 120, 5); ctx.fill();
    marcador(ctx, x, 600, k + 1, 'hecho'); });
  ctx.fillStyle = '#6a3418'; ctx.fillRect(330, 560, 620, 20); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.strokeRect(330, 560, 620, 20);
  // suena: ondas doradas
  ctx.save(); ctx.strokeStyle = 'rgba(255,224,130,.8)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.arc(640, 150, 60 + i * 50, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); } ctx.restore();
  // cae el premio con su estela
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createLinearGradient(0, 0, 0, 160); g.addColorStop(0, 'rgba(255,240,180,0)'); g.addColorStop(1, 'rgba(255,240,180,.8)'); ctx.fillStyle = g; ctx.fillRect(1100, 40, 60, 200); ctx.restore();
  regalo(ctx, 1130, 300, 1.1, NC.LA); for (let k = 0; k < 7; k++) estrella(ctx, 1060 + (k * 37) % 150, 120 + (k * 53) % 200, 12, '#fff3b0');
  sprK(ctx, sprSarah({ eyes: 'happy' }), 160, 680, 5); sprK(ctx, sprRobotB({ ojos: 'feliz', ang: .45 }), 1000, 700, 3.4);
  [['♪', 220, 300, NC.SOL], ['♫', 270, 200, NC.MI], ['♪', 1000, 360, NC.DO]].forEach(([t, x, y, c]) => texto(ctx, t, x, y, { tam: 64, c, fuente: 'FreeSerif', borde: 6 }));
  postHD(ctx, { bloom: .4, bloomF: 'blur(12px) brightness(.95) contrast(1.6) saturate(1.5)', calido: false, vin: .4, polvo: 70, semilla: 16, rayos: [{ x: 640, y: -60, ang: 0, ancho: 220, largo: 760, c: 'rgba(255,230,170,.25)' }] });
};
ESCENAS['premio-c'] = ctx => {   // pergamino con sello de lacre
  fondoCalido(ctx); rayosLuz(ctx, 640, 360, 12, 400);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; rr(ctx, 330, 150, 620, 420, 10); ctx.fillStyle = lg(ctx, 0, 150, 0, 570, [[0, '#fbf1d8'], [1, '#e6cf9a']]); ctx.fill(); ctx.restore();
  [[150, -1], [570, 1]].forEach(([y, d]) => { ctx.save(); rr(ctx, 300, y - 26, 680, 52, 26); ctx.fillStyle = lg(ctx, 0, y - 26, 0, y + 26, [[0, '#f3e3bc'], [.5, '#d8be86'], [1, '#b89a5a']]); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#7a5a2a'; ctx.stroke(); ctx.restore(); });
  ctx.strokeStyle = 'rgba(122,90,42,.35)'; ctx.lineWidth = 3; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(400, 230 + k * 46); ctx.lineTo(880 - (k % 3) * 60, 230 + k * 46); ctx.stroke(); }
  pentagrama(ctx, 420, 250, 440, 14, [{ n: 'C4', f: 'negra', c: true, x: 540 }, { n: 'C4', f: 'negra', c: true, x: 590 }, { n: 'G4', f: 'negra', c: true, x: 640 }, { n: 'G4', f: 'negra', c: true, x: 690 }, { n: 'A4', f: 'negra', c: true, x: 740 }, { n: 'A4', f: 'negra', c: true, x: 790 }, { n: 'G4', f: 'blanca', c: true, x: 840 }], { lineaC: '#5a3a1a' });
  // sello de lacre con la clave de sol, recién roto
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 10; ctx.beginPath(); for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2, r = k % 2 ? 62 : 70; ctx.lineTo(640 + Math.cos(a) * r, 470 + Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = '#a8182a'; ctx.fill(); ctx.restore();
  ctx.beginPath(); ctx.arc(640, 470, 46, 0, 7); ctx.fillStyle = '#c8243a'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#6a0a1a'; ctx.stroke(); clave(ctx, 'sol', 618, 440, 9, '#6a0a1a');
  ctx.strokeStyle = '#4a0a14'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(600, 420); ctx.lineTo(624, 462); ctx.lineTo(610, 500); ctx.stroke();
  regalo(ctx, 1080, 520, .9, NC.MI); sprK(ctx, sprDavid({ eyes: 'happy' }), 190, 660, 5);
  postHD(ctx, { bloom: .3, calido: false, vin: .4, polvo: 50, semilla: 17 });
};
ESCENAS['premio-d'] = ctx => {   // la campana de la torre
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#ffb88a'], [1, '#6a5ab0']]); ctx.fillRect(0, 0, W, H); nube(ctx, 220, 160, 60); nube(ctx, 1060, 120, 50);
  // torre (vector suave)
  ctx.fillStyle = lg(ctx, 440, 0, 840, 0, [[0, '#fbf1d8'], [1, '#d8c49a']]); ctx.fillRect(440, 220, 400, 500); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.strokeRect(440, 220, 400, 500);
  ctx.beginPath(); ctx.moveTo(420, 230); ctx.lineTo(640, 40); ctx.lineTo(860, 230); ctx.closePath(); ctx.fillStyle = '#6fbfa6'; ctx.fill(); ctx.stroke(); cruzOro(ctx, 640, 44);
  ctx.beginPath(); ctx.moveTo(500, 700); ctx.lineTo(500, 360); ctx.arc(640, 360, 140, Math.PI, 0); ctx.lineTo(780, 700); ctx.closePath(); ctx.fillStyle = '#2a1a3a'; ctx.fill(); ctx.stroke();
  // la campana balanceándose
  ctx.save(); ctx.translate(640, 290); ctx.rotate(.28); ctx.fillStyle = lg(ctx, -120, 0, 120, 0, [[0, '#ffe68a'], [.5, '#d9a930'], [1, '#8a6008']]); ctx.beginPath(); ctx.moveTo(-40, 40); ctx.quadraticCurveTo(-50, 160, -120, 250); ctx.lineTo(120, 250); ctx.quadraticCurveTo(50, 160, 40, 40); ctx.quadraticCurveTo(0, 0, -40, 40); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 262, 24, 0, 7); ctx.fillStyle = '#8a6008'; ctx.fill(); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(255,240,180,.85)'; ctx.lineWidth = 8; ctx.lineCap = 'round'; for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.arc(640, 450, 160 + i * 50, -.6, .3); ctx.stroke(); ctx.beginPath(); ctx.arc(640, 450, 160 + i * 50, Math.PI - .3, Math.PI + .6); ctx.stroke(); } ctx.restore();
  // palomas que salen volando y notas
  [[300, 200], [980, 260], [1020, 180]].forEach(([x, y]) => sprK(ctx, sprPaloma(1), x, y, 6));
  [['♪', 260, 380, NC.SOL], ['♫', 1040, 420, NC.MI]].forEach(([t, x, y, c]) => texto(ctx, t, x, y, { tam: 70, c, fuente: 'FreeSerif', borde: 6 }));
  sprK(ctx, sprSarah({ eyes: 'happy' }), 180, 700, 5); sprK(ctx, sprDavid({ eyes: 'happy' }), 1100, 700, 5);
  postHD(ctx, { bloom: .3, calidoA: .5, frioA: .3, vin: .4, polvo: 50, semilla: 18 });
};
// ---------- avance ----------
ESCENAS['avance-a'] = ctx => {   // el pentagrama de la semana: cada día de estudio una nota que se enciende; los descansos, silencios
  PAL_ = PALS5.A; texturaPapel(ctx, '#f3e3bc', 'rgba(150,100,40,.35)', 51);
  const dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D'], tipo = ['silencio', 'on', 'on', 'on', 'siguiente', 'silencio', 'silencio'], notas = ['', 'C5', 'E5', 'G5', 'C5', '', ''];
  const gap = 34, y0 = 250, x0 = 120; pentagrama(ctx, x0, y0, 1040, gap, [], { lineaC: '#3a2414', metrica: ['7', '4'] });
  dias.forEach((d, k) => { const x = 330 + k * 120;
    if (tipo[k] === 'silencio') { texto(ctx, '\u{1D13D}', x, y0 + 2 * gap, { tam: gap * 3.4, c: '#8a6a4a', fuente: 'FreeSerif' }); }
    else { const on = tipo[k] === 'on', n = notas[k], yN = y0 + 4 * gap - paso(n) * gap / 2, c = NC[solfeo(n)];
      if (on) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.restore(); ctx.save(); const g = ctx.createRadialGradient(x, yN, 0, x, yN, 70); g.addColorStop(0, c + 'aa'); g.addColorStop(1, c + '00'); ctx.fillStyle = g; ctx.fillRect(x - 70, yN - 70, 140, 140); ctx.restore(); }
      if (on) { cabeza(ctx, x, yN, gap, 'negra', c); ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - gap * .6, yN + 4); ctx.lineTo(x - gap * .6, yN + gap * 3.4); ctx.stroke(); ctx.restore(); }
      else { ctx.save(); ctx.setLineDash([8, 6]); ctx.lineWidth = 4; ctx.strokeStyle = '#8a6a4a'; ctx.beginPath(); ctx.ellipse(x, yN, gap * .7, gap * .5, -.35, 0, 7); ctx.stroke(); ctx.restore(); } }
    ctx.save(); ctx.beginPath(); ctx.arc(x, 560, 30, 0, 7); ctx.fillStyle = tipo[k] === 'on' ? '#d9a930' : tipo[k] === 'siguiente' ? '#fbf1d8' : '#e6cf9a'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#3a2414'; ctx.stroke(); ctx.restore(); texto(ctx, d, x, 562, { tam: 28, c: '#3a2414' });
  });
  sprK(ctx, sprRobotB({ ojos: 'feliz', ang: .4 }), 1150, 650, 3);
  marcoIluminado(ctx);
};
ESCENAS['avance-b'] = ctx => {   // el árbol de canciones
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#9fd8ff'], [1, '#fbf1d8']]); ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = lg(ctx, 0, 560, 0, 720, [[0, '#8cc47a'], [1, '#5f9a5a']]); ctx.beginPath(); ctx.moveTo(0, 600); ctx.quadraticCurveTo(640, 540, 1280, 600); ctx.lineTo(1280, 720); ctx.lineTo(0, 720); ctx.fill();
  // tronco y ramas
  ctx.strokeStyle = '#6a3e22'; ctx.lineCap = 'round'; const rama = (x, y, a, l, w, d) => { if (d === 0) return; const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke(); rama(x2, y2, a - .45, l * .72, w * .66, d - 1); rama(x2, y2, a + .4, l * .7, w * .66, d - 1); };
  rama(640, 640, -Math.PI / 2, 170, 44, 5);
  ctx.save(); ctx.filter = 'blur(2px)'; [[640, 260, 260], [470, 330, 160], [810, 330, 170], [560, 200, 140], [740, 200, 150]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = 'rgba(111,174,106,.55)'; ctx.fill(); }); ctx.restore();
  // flores = canciones dominadas; botones = en camino
  const R = rng(5); const flores = [];
  for (let k = 0; k < 22; k++) { const a = R() * Math.PI * 2, d = Math.sqrt(R()) * 230; flores.push([640 + Math.cos(a) * d * 1.3, 270 + Math.sin(a) * d * .7, k]); }
  flores.forEach(([x, y, k]) => { const c = COL5[k % 7], abierta = k < 9;
    if (abierta) { for (let p = 0; p < 5; p++) { const a = p / 5 * Math.PI * 2; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 14, y + Math.sin(a) * 14, 12, 8, a, 0, 7); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke(); } ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fillStyle = '#fff3b0'; ctx.fill(); ctx.stroke(); }
    else { ctx.beginPath(); ctx.ellipse(x, y, 8, 11, 0, 0, 7); ctx.fillStyle = mezcla(c, '#5f9a5a', .5); ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke(); } });
  sprK(ctx, sprSarah({ eyes: 'happy' }), 400, 690, 5); sprK(ctx, sprDavid({ eyes: 'happy' }), 880, 690, 5); sprK(ctx, sprRobotB({ ojos: 'feliz' }), 1000, 560, 3);
  // regadera de notas
  [['♪', 330, 460, NC.SOL], ['♫', 960, 470, NC.MI]].forEach(([t, x, y, c]) => texto(ctx, t, x, y, { tam: 56, c, fuente: 'FreeSerif', borde: 5 }));
  postHD(ctx, { bloom: .25, calidoA: .45, frioA: .25, vin: .35, polvo: 50, semilla: 21 });
};
ESCENAS['avance-c'] = ctx => {   // la ciudad que se ilumina casa por casa
  PAL_ = PALS5.A; const S = PAL_;
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#2a2a6a'], [1, '#6a4a8a']]); ctx.fillRect(0, 0, W, H); const R = rng(7); for (let k = 0; k < 90; k++) { ctx.fillStyle = 'rgba(255,243,176,' + (.3 + R() * .6) + ')'; ctx.fillRect(R() * W, R() * 300, 2, 2); }
  ISO.t = 44; ISO.cx = 640; ISO.cy = 200; const N = 11;
  borde(ctx, 0, 0, N, N, .6, ['#5a4a6a', '#4a3a5a']); sueloIso(ctx, 0, 0, N, N, ['#5a7a6a', '#4f6e60']); sueloIso(ctx, 0, 5, N, 1.6, ['#8a8098', '#7a7088']);
  const casas = [[.4, .4, 2.2, true], [3, .3, 2.8, true], [6, .5, 2, true], [8.6, .6, 2.4, false], [.6, 7.2, 2.2, true], [3.4, 7.4, 1.8, false], [6.4, 7.2, 2.6, false], [8.8, 7.4, 2, false]];
  casas.forEach(([i, j, h, luz], k) => { casaIso(ctx, i, j, 2, 2, h, { luz, tejado: k % 2 ? S.tejado2 : S.tejado, oro: false, gablete: k % 3 === 0 }); if (luz) { const c = ip(i + 1, j + 2, h * .5); ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], 120); g.addColorStop(0, 'rgba(255,210,120,.55)'); g.addColorStop(1, 'rgba(255,210,120,0)'); ctx.fillStyle = g; ctx.fillRect(c[0] - 120, c[1] - 120, 240, 240); ctx.restore(); } });
  pjIso(ctx, sprSarah({}), 5.2, 6); pjIso(ctx, sprDavid({}), 6.2, 5.8); pjIso(ctx, sprRobotB({ ojos: 'feliz' }), 7, 5, 3, { z: .8 });
  // contador de casas encendidas
  panel(ctx, 1030, 40, 210, 70, { fondo: 'rgba(38,23,63,.9)', r: 35 }); texto(ctx, '4 / 8', 1135, 76, { tam: 34, c: '#ffd046' });
  postHD(ctx, { bloom: .4, bloomF: 'blur(12px) brightness(.9) contrast(1.8) saturate(1.5)', calido: false, vin: .45, polvo: 40, semilla: 22 });
};
// ---------- 23 · el primer día (storyboard de 4 viñetas) ----------
function vineta4(ctx, k, x, y, w, h, fn) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 18; rr(ctx, x, y, w, h, 18); ctx.fillStyle = '#1c1030'; ctx.fill(); ctx.restore();
  ctx.save(); rr(ctx, x, y, w, h, 18); ctx.clip(); ctx.translate(x, y); fn(ctx, w, h); ctx.restore();
  ctx.save(); rr(ctx, x, y, w, h, 18); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); rotulo(ctx, String(k), x + 32, y + 32, { r: 22 });
}
function cartaBach(ctx, x, y, s, abierta) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.fillStyle = '#fbf1d8'; ctx.fillRect(-80, -50, 160, 100); ctx.strokeRect(-80, -50, 160, 100);
  if (abierta) { ctx.beginPath(); ctx.moveTo(-80, -50); ctx.lineTo(0, -120); ctx.lineTo(80, -50); ctx.closePath(); ctx.fillStyle = '#efdcb0'; ctx.fill(); ctx.stroke(); } else { ctx.beginPath(); ctx.moveTo(-80, -50); ctx.lineTo(0, 10); ctx.lineTo(80, -50); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 4, 22, 0, 7); ctx.fillStyle = '#c8243a'; ctx.fill(); ctx.stroke(); clave(ctx, 'sol', -9, -10, 4.2, '#6a0a1a'); }
  ctx.restore(); }
ESCENAS['primer-dia'] = ctx => {
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#33204d'], [1, '#140c26']]); ctx.fillRect(0, 0, W, H);
  const w = 600, h = 320;
  vineta4(ctx, 1, 30, 30, w, h, (c, w, h) => { c.fillStyle = lg(c, 0, 0, 0, h, [[0, '#ffcf9a'], [1, '#ffe8c8']]); c.fillRect(0, 0, w, h); PAL_ = PALS5.A; ISO.t = 40; ISO.cx = 180; ISO.cy = 120; sueloIso(c, -1, -1, 5, 5, [PAL_.pasto[0], mezcla(PAL_.pasto[0], PAL_.pasto[1], .3)]); casaIso(c, 0, 0, 2.4, 2.2, 2, { gablete: true, simbolo: 'arbol' });
    c.save(); c.setLineDash([10, 10]); c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 5; c.beginPath(); c.moveTo(600, 40); c.quadraticCurveTo(480, 10, 420, 140); c.stroke(); c.restore(); cartaBach(c, 400, 160, .9, false); [[460, 90], [500, 60]].forEach(([a, b]) => estrella(c, a, b, 12, '#fff3b0')); });
  vineta4(ctx, 2, 650, 30, w, h, (c, w, h) => { fondoCalido(c); rayosLuz(c, 300, 200, 12, 300); cartaBach(c, 300, 230, 1.1, true); sprK(c, sprRobotB({ ojos: 'feliz', ang: .4 }), 300, 160, 4); for (let k = 0; k < 8; k++) estrella(c, 160 + (k * 53) % 300, 40 + (k * 37) % 140, 12, '#fff3b0'); });
  vineta4(ctx, 3, 30, 370, w, h, (c, w, h) => { const p = pix(Math.ceil(w / 3), Math.ceil(h / 3), g => { tapiz(g, 0, 0, 200, 80, '#ffd6e0', '#f8bccb'); tablas(g, 0, 80, 200, 30); }); subir(c, p, 3);
    // ropero abierto con tres trajes
    c.fillStyle = '#7a4a24'; c.fillRect(300, 30, 270, 260); c.strokeStyle = INK; c.lineWidth = 5; c.strokeRect(300, 30, 270, 260); c.fillStyle = '#3a2418'; c.fillRect(316, 46, 238, 228);
    [['viajero', 360], ['medieval', 435], ['andino', 510]].forEach(([t, x]) => sprK(c, conTraje(sprSarah({}), t, 'sarah'), x, 240, 2.4));
    c.save(); c.strokeStyle = '#ffd046'; c.lineWidth = 5; rr(c, 330, 120, 62, 130, 10); c.stroke(); c.restore();
    sprK(c, sprSarah({ eyes: 'happy' }), 170, 300, 6); });
  vineta4(ctx, 4, 650, 370, w, h, (c, w, h) => { c.fillStyle = lg(c, 0, 0, 0, h, [[0, '#8fc8f0'], [1, '#f6e4c4']]); c.fillRect(0, 0, w, h);
    // la puerta de la ciudad natal que se abre, con luz
    c.fillStyle = '#ddcca8'; c.fillRect(0, 40, w, 200); c.save(); c.globalCompositeOperation = 'screen'; const g = c.createRadialGradient(300, 150, 0, 300, 150, 200); g.addColorStop(0, 'rgba(255,240,180,1)'); g.addColorStop(1, 'rgba(255,240,180,0)'); c.fillStyle = g; c.fillRect(100, 0, 400, 300); c.restore();
    c.fillStyle = '#8a4a24'; c.strokeStyle = INK; c.lineWidth = 4; c.beginPath(); c.moveTo(220, 240); c.lineTo(170, 230); c.lineTo(170, 90); c.lineTo(220, 70); c.closePath(); c.fill(); c.stroke(); c.beginPath(); c.moveTo(380, 240); c.lineTo(430, 230); c.lineTo(430, 90); c.lineTo(380, 70); c.closePath(); c.fill(); c.stroke();
    teclado(c, 40, 248, w - 80, 62, { blancas: 14, luces: { 0: NC.DO }, colores: true }); texto(c, '♪', 70, 210, { tam: 56, c: NC.DO, fuente: 'FreeSerif', borde: 5 }); sprK(c, sprSarah({ eyes: 'happy' }), 120, 236, 3.4); });
  postHD(ctx, { bloom: .2, calido: false, vin: .25, polvo: 20, semilla: 23 });
};
// ---------- 24 · cómo se llega a Estrellita: pads → una tecla → la melodía ----------
ESCENAS['estrellita-llegar'] = ctx => {
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#33204d'], [1, '#140c26']]); ctx.fillRect(0, 0, W, H);
  const w = 392, h = 600, y = 70;
  const ritmo = ['tan', 'tan', 'tan', 'tan', 'tan', 'tan', 'taaan'];
  const panelBase = (x, letra, fn) => { panel(ctx, x, y, w, h, { fondo: lg(ctx, 0, y, 0, y + h, [[0, '#3a2566'], [1, '#26173f']]), r: 24 }); rotulo(ctx, letra, x + 34, y + 34, { r: 22 }); ctx.save(); rr(ctx, x, y, w, h, 24); ctx.clip(); fn(x); ctx.restore(); };
  // 1 · el ritmo en los pads
  panelBase(30, '1', x => { ritmo.forEach((t, k) => { const cx = x + 50 + (k % 4) * 92, cy = y + 120 + Math.floor(k / 4) * 120; rr(ctx, cx - 38, cy - 50, 76, 96, 12); ctx.fillStyle = '#fffaf2'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); figuraRitmo(ctx, cx - 4, cy + 22, t === 'tan' ? 'tan' : 'taaan', .9); });
    [[NC.MI, 0], [NC.DO, 1]].forEach(([c, k]) => { const px = x + 40 + k * 170, py = y + 380; ctx.save(); ctx.shadowColor = k === 0 ? c : 'transparent'; ctx.shadowBlur = 30; rr(ctx, px, py, 150, 170, 26); ctx.fillStyle = rg(ctx, px + 75, py + 85, 140, [[0, mezcla(c, '#fff', .4)], [.5, c], [1, mezcla(c, '#000', .4)]], px + 50, py + 50); ctx.fill(); ctx.restore(); rr(ctx, px, py, 150, 170, 26); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); }); });
  // 2 · el mismo ritmo en una sola tecla: DO
  panelBase(444, '2', x => { const gap = 16; const notas = ritmo.map((t, k) => ({ n: 'C4', f: t === 'tan' ? 'negra' : 'blanca', c: true, x: x + 110 + k * 38 })); pentagrama(ctx, x + 20, y + 120, w - 40, gap, notas, { lineaC: '#fff8ec' });
    teclado(ctx, x + 40, y + 380, w - 80, 170, { blancas: 7, luces: { 0: NC.DO }, colores: true }); texto(ctx, 'DO', x + 40 + (w - 80) / 14, y + 530, { tam: 26, c: INK });
    sprK(ctx, sprRobotB({ ojos: 'feliz', ang: .4 }), x + 300, y + 330, 2.6); });
  // 3 · la melodía con sus notas, pedazo a pedazo
  panelBase(858, '3', x => { const gap = 16, xs = [0, 1, 2, 3, 4, 5, 6].map(k => x + 104 + k * 38), ns = ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4']; pentagrama(ctx, x + 20, y + 120, w - 40, gap, ns.map((n, k) => ({ n, f: k === 6 ? 'blanca' : 'negra', c: true, x: xs[k] })), { lineaC: '#fff8ec' });
    // pedazos: (DO DO) (SOL SOL) (LA LA SOL)
    [[0, 1, NC.DO], [2, 3, NC.SOL], [4, 6, NC.LA]].forEach(([a, b, c], k) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(xs[a] - 14, y + 248); ctx.lineTo(xs[a] - 14, y + 260); ctx.lineTo(xs[b] + 14, y + 260); ctx.lineTo(xs[b] + 14, y + 248); ctx.stroke(); ctx.restore(); });
    teclado(ctx, x + 40, y + 380, w - 80, 170, { blancas: 7, luces: { 0: NC.DO, 7: NC.SOL, 9: NC.LA }, colores: true }); });
  // flechas entre paneles
  [[430, 370], [844, 370]].forEach(([x, yy]) => { ctx.save(); ctx.fillStyle = '#ffd046'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 10, yy - 22); ctx.lineTo(x + 14, yy); ctx.lineTo(x - 10, yy + 22); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); });
  texto(ctx, '«Estrellita»: del ritmo a la melodía', 640, 38, { tam: 28, c: '#d8c9f0' });
};
