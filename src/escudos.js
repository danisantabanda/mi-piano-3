// escudos de heráldica musical y trajes (de los bocetos de la charla 5)
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

function conTraje(base, tipo, quien) {
  return cache('traje' + tipo + quien + (base.clave || ''), () => sprite(34, 36, g => {
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

// clave de sol / fa en píxel (de Mi Piano 2)
function sprClave(tipo) {
  return cache('clave' + tipo, () => sprite(9, tipo === 'sol' ? 22 : 11, g => {
    if (tipo === 'sol') { g.R(4, 0, 2, 20, PAL.tinta); g.R(5, 0, 2, 2, PAL.tinta); g.R(6, 2, 2, 3, PAL.tinta); g.R(3, 5, 3, 2, PAL.tinta); g.R(1, 8, 2, 6, PAL.tinta); g.R(2, 14, 6, 2, PAL.tinta); g.R(7, 9, 2, 6, PAL.tinta); g.R(3, 8, 5, 2, PAL.tinta); g.R(2, 20, 3, 2, PAL.tinta); }
    else g.map(['.xxxx....', 'x....x.x.', 'xx...x...', 'xx...x.x.', '.....x...', '....x....', '...x.....', '.xx......', 'x........'], { x: PAL.tinta }, 0, 1);   // clave de fa: la curva y sus dos puntos
  }, { ax: 4, ay: tipo === 'sol' ? 15 : 3 }));
}
