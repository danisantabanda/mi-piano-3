// =====================================================================
//  Estilo 2.5D ilustrado suave (tipo Kirby de Switch): volúmenes redondeados, degradados, sombras suaves, sin píxel.
// =====================================================================
function lg(ctx, x0, y0, x1, y1, stops) { if (![x0, y0, x1, y1].every(isFinite)) return 'rgba(0,0,0,0)'; const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function rg(ctx, x, y, r, stops, fx, fy) { if (![x, y, r, fx == null ? 0 : fx, fy == null ? 0 : fy].every(isFinite) || r < 0) return 'rgba(0,0,0,0)'; const g = ctx.createRadialGradient(fx == null ? x : fx, fy == null ? y : fy, 0, x, y, r); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function blando(ctx, fn, blur = 14, c = 'rgba(40,20,60,.28)') { ctx.save(); ctx.filter = 'blur(' + blur + 'px)'; ctx.fillStyle = c; fn(); ctx.restore(); }
function elip(ctx, x, y, rx, ry, fill) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }
function nube(ctx, x, y, s) {
  ctx.save(); const ps = [[0, 0, 1], [-.9, .25, .7], [.9, .3, .75], [-.4, -.35, .75], [.45, -.3, .7]];
  blando(ctx, () => ps.forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s + s * .25, r * s * .62, 0, 7); ctx.fill(); }), 12, 'rgba(120,140,200,.25)');
  ps.forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s * .62, 0, 7); ctx.fillStyle = rg(ctx, x + dx * s, y + dy * s, r * s * .62, [[0, '#ffffff'], [.7, '#fbfbff'], [1, '#dfe6ff']], x + dx * s - s * .2, y + dy * s - s * .25); ctx.fill(); });
  ctx.restore();
}
function vArbol(ctx, x, y, s, c = ['#9be07a', '#5fbf5a', '#3f9a4a']) {
  blando(ctx, () => elip(ctx, x + s * .25, y + s * .05, s * .8, s * .2, '#000'), 10);
  ctx.fillStyle = lg(ctx, x, y - s, x, y, [[0, '#a8744a'], [1, '#7a4a2a']]); rr(ctx, x - s * .1, y - s * .9, s * .2, s * .9, s * .08); ctx.fill();
  [[0, -1.25, .75], [-.5, -1, .55], [.5, -1.02, .58], [0, -1.7, .5]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, 7); ctx.fillStyle = rg(ctx, x + dx * s, y + dy * s, r * s, [[0, c[0]], [.55, c[1]], [1, c[2]]], x + dx * s - r * s * .4, y + dy * s - r * s * .45); ctx.fill(); });
}
// casa redondeada: fachada, tejado empinado de tejas suaves, gablete barroco, ventanas con marco blanco
function vCasa(ctx, x, y, w, h, o = {}) {   // (x,y) = esquina inferior izquierda de la fachada
  const F = o.col || ['#ffe2b8', '#f2c38f'], T = o.tejado || ['#ff8a6a', '#d0533f'], rh = o.rh || w * .55;
  blando(ctx, () => { ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w + 90, y + 50); ctx.lineTo(x + 40, y + 50); ctx.lineTo(x, y); ctx.fill(); }, 16, 'rgba(60,30,90,.22)');
  // tejado
  ctx.beginPath(); ctx.moveTo(x - 10, y - h + 6); ctx.quadraticCurveTo(x + w * .5, y - h - rh * 1.25, x + w + 10, y - h + 6); ctx.closePath();
  ctx.fillStyle = lg(ctx, x, y - h - rh, x + w, y - h, [[0, T[0]], [1, T[1]]]); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(120,30,30,.18)'; ctx.lineWidth = 3; for (let k = 1; k < 8; k++) { ctx.beginPath(); ctx.moveTo(x - 10, y - h + 6 - k * rh * .14); ctx.lineTo(x + w + 10, y - h + 6 - k * rh * .14); ctx.stroke(); } ctx.restore();
  // fachada
  rr(ctx, x, y - h, w, h, 10); ctx.fillStyle = lg(ctx, x, y - h, x + w, y, [[0, F[0]], [1, F[1]]]); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.35)'; rr(ctx, x + 4, y - h + 3, w - 8, 6, 3); ctx.fill();
  // gablete
  if (o.gablete !== false) { const gw = w * .5, gx = x + w * .25; ctx.beginPath(); ctx.moveTo(gx, y - h + 2); ctx.bezierCurveTo(gx - 8, y - h - rh * .4, gx + gw * .3, y - h - rh * .45, gx + gw * .3, y - h - rh * .7); ctx.quadraticCurveTo(gx + gw * .5, y - h - rh * .95, gx + gw * .7, y - h - rh * .7); ctx.bezierCurveTo(gx + gw * .7, y - h - rh * .45, gx + gw + 8, y - h - rh * .4, gx + gw, y - h + 2); ctx.closePath(); ctx.fillStyle = lg(ctx, gx, y - h - rh, gx + gw, y - h, [[0, F[0]], [1, F[1]]]); ctx.fill();
    elip(ctx, gx + gw / 2, y - h - rh * .42, gw * .13, gw * .13, '#fffaf2'); elip(ctx, gx + gw / 2, y - h - rh * .42, gw * .09, gw * .09, rg(ctx, gx + gw / 2, y - h - rh * .42, gw * .09, [[0, '#9fd8ff'], [1, '#4a7cc4']])); }
  // ventanas
  const cols = Math.max(2, Math.round(w / 52)), filas = o.pisos || 2;
  for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++) {
    const vw = w * .16, vh = vw * 1.35, vx = x + (c + .5) * w / cols - vw / 2, vy = y - h + 22 + f * (vh + 20);
    if (f === filas - 1 && o.puerta !== false && Math.abs(vx + vw / 2 - (x + w / 2)) < vw) continue;
    rr(ctx, vx - 4, vy - 4, vw + 8, vh + 8, 8); ctx.fillStyle = '#fffaf2'; ctx.fill();
    rr(ctx, vx, vy, vw, vh, 6); ctx.fillStyle = o.luz ? rg(ctx, vx + vw / 2, vy + vh / 2, vh, [[0, '#fff3b0'], [1, '#ffb84a']]) : lg(ctx, vx, vy, vx + vw, vy + vh, [[0, '#a9dcff'], [1, '#4f7fc8']]); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.55)'; rr(ctx, vx + 4, vy + 4, vw * .25, vh * .4, 3); ctx.fill();
    if (o.flores && f === 0) { rr(ctx, vx - 6, vy + vh + 2, vw + 12, 10, 4); ctx.fillStyle = '#b5523f'; ctx.fill(); [NC.DO, NC.MI, '#ff9cc4', NC.DO].forEach((cc, i) => elip(ctx, vx + i * vw / 3, vy + vh, 6, 6, cc)); }
  }
  if (o.puerta !== false) { const dw = w * .2, dh = dw * 1.6, dx = x + w / 2 - dw / 2; ctx.beginPath(); ctx.moveTo(dx, y); ctx.lineTo(dx, y - dh + dw / 2); ctx.arc(dx + dw / 2, y - dh + dw / 2, dw / 2, Math.PI, 0); ctx.lineTo(dx + dw, y); ctx.closePath(); ctx.fillStyle = lg(ctx, dx, y - dh, dx + dw, y, [[0, '#b0703a'], [1, '#7a4426']]); ctx.fill(); elip(ctx, dx + dw * .75, y - dh * .4, 3, 3, '#ffd046'); }
  if (o.toldo) { const ty = y - h * .38; for (let i = 0; i < 8; i++) { ctx.beginPath(); const tx = x + i * w / 8; ctx.moveTo(tx, ty); ctx.lineTo(tx + w / 8, ty); ctx.lineTo(tx + w / 8, ty + 18); ctx.quadraticCurveTo(tx + w / 16, ty + 28, tx, ty + 18); ctx.fillStyle = i % 2 ? '#fffaf2' : o.toldo; ctx.fill(); } }
}
function vIglesia(ctx, x, y, s) {   // x,y: base izquierda de la torre; s: escala
  const N = ['#fff6e2', '#ead9b8'], S = ['#7d84b8', '#4f5688'];
  blando(ctx, () => { ctx.beginPath(); ctx.moveTo(x + 40 * s, y); ctx.lineTo(x + 420 * s, y); ctx.lineTo(x + 520 * s, y + 60); ctx.lineTo(x + 120 * s, y + 60); ctx.fill(); }, 20, 'rgba(60,30,90,.2)');
  // nave
  const nx = x + 70 * s, nw = 330 * s, nh = 150 * s;
  ctx.beginPath(); ctx.moveTo(nx - 8, y - nh + 4); ctx.lineTo(nx + 30 * s, y - nh - 140 * s); ctx.lineTo(nx + nw - 30 * s, y - nh - 140 * s); ctx.lineTo(nx + nw + 8, y - nh + 4); ctx.closePath(); ctx.fillStyle = lg(ctx, 0, y - nh - 140 * s, 0, y - nh, [[0, S[0]], [1, S[1]]]); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 3; for (let k = 1; k < 10; k++) { ctx.beginPath(); ctx.moveTo(nx - 10, y - nh - k * 14 * s); ctx.lineTo(nx + nw + 10, y - nh - k * 14 * s); ctx.stroke(); } ctx.restore();
  rr(ctx, nx, y - nh, nw, nh, 12); ctx.fillStyle = lg(ctx, nx, y - nh, nx, y, [[0, N[0]], [1, N[1]]]); ctx.fill();
  for (let k = 0; k < 5; k++) { const vx = nx + 26 * s + k * 62 * s, vw = 30 * s, vh = 100 * s, vy = y - nh + 24 * s; ctx.beginPath(); ctx.moveTo(vx, vy + vh); ctx.lineTo(vx, vy + vw * .6); ctx.quadraticCurveTo(vx, vy - vw * .2, vx + vw / 2, vy - vw * .45); ctx.quadraticCurveTo(vx + vw, vy - vw * .2, vx + vw, vy + vw * .6); ctx.lineTo(vx + vw, vy + vh); ctx.closePath(); ctx.fillStyle = lg(ctx, vx, vy, vx, vy + vh, [[0, '#b9a7ff'], [.5, '#6f8fe8'], [1, '#3f5cb8']]); ctx.fill(); ctx.strokeStyle = '#fffaf2'; ctx.lineWidth = 5 * s; ctx.stroke(); [NC.DO, NC.MI, NC.SOL, NC.SI].forEach((c, i) => elip(ctx, vx + vw * (.3 + .4 * (i % 2)), vy + 20 * s + i * 18 * s, 4 * s, 4 * s, c)); }
  // torre
  const tw = 100 * s, th = 210 * s;
  rr(ctx, x, y - th, tw, th, 12); ctx.fillStyle = lg(ctx, x, 0, x + tw, 0, [[0, N[0]], [.7, N[0]], [1, N[1]]]); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + tw * .28, y); ctx.lineTo(x + tw * .28, y - 60 * s); ctx.quadraticCurveTo(x + tw * .5, y - 100 * s, x + tw * .72, y - 60 * s); ctx.lineTo(x + tw * .72, y); ctx.fillStyle = lg(ctx, 0, y - 90 * s, 0, y, [[0, '#a8683a'], [1, '#6e3e22']]); ctx.fill();
  elip(ctx, x + tw / 2, y - 150 * s, 24 * s, 24 * s, '#fffaf2'); ctx.strokeStyle = '#e6a21b'; ctx.lineWidth = 5 * s; ctx.stroke(); ctx.strokeStyle = INK; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(x + tw / 2, y - 150 * s); ctx.lineTo(x + tw / 2, y - 166 * s); ctx.moveTo(x + tw / 2, y - 150 * s); ctx.lineTo(x + tw / 2 + 12 * s, y - 150 * s); ctx.stroke();
  // campanario octogonal y chapitel de cobre
  const ox = x + 12 * s, ow = tw - 24 * s, oy = y - th - 70 * s;
  rr(ctx, ox, oy, ow, 74 * s, 10); ctx.fillStyle = lg(ctx, ox, 0, ox + ow, 0, [[0, N[0]], [1, N[1]]]); ctx.fill();
  [0, 1, 2].forEach(i => { rr(ctx, ox + 10 * s + i * 20 * s, oy + 16 * s, 12 * s, 40 * s, 6 * s); ctx.fillStyle = '#4a3a66'; ctx.fill(); });
  ctx.beginPath(); ctx.moveTo(ox - 6, oy + 4); ctx.bezierCurveTo(ox, oy - 50 * s, ox + ow * .3, oy - 50 * s, ox + ow / 2, oy - 64 * s); ctx.bezierCurveTo(ox + ow * .7, oy - 50 * s, ox + ow, oy - 50 * s, ox + ow + 6, oy + 4); ctx.closePath();
  ctx.fillStyle = rg(ctx, ox + ow * .35, oy - 30 * s, ow, [[0, '#b8f0dc'], [.5, '#6fbfa6'], [1, '#3f8a78']]); ctx.fill();
  rr(ctx, ox + ow / 2 - 12 * s, oy - 92 * s, 24 * s, 30 * s, 6); ctx.fillStyle = N[0]; ctx.fill();
  elip(ctx, ox + ow / 2, oy - 96 * s, 14 * s, 10 * s, '#6fbfa6'); ctx.fillStyle = '#ffd046'; ctx.fillRect(ox + ow / 2 - 2 * s, oy - 130 * s, 4 * s, 30 * s); ctx.fillRect(ox + ow / 2 - 9 * s, oy - 122 * s, 18 * s, 4 * s); elip(ctx, ox + ow / 2, oy - 104 * s, 6 * s, 6 * s, '#ffd046');
}
function vFuente(ctx, x, y, s) {
  blando(ctx, () => elip(ctx, x + 20, y + 10, 150 * s, 30 * s, '#000'), 14, 'rgba(50,30,80,.3)');
  elip(ctx, x, y, 140 * s, 42 * s, lg(ctx, 0, y - 42 * s, 0, y + 42 * s, [[0, '#f2ebe0'], [1, '#bdb0a0']]));
  elip(ctx, x, y - 8 * s, 120 * s, 32 * s, lg(ctx, 0, y - 40 * s, 0, y + 30 * s, [[0, '#8fe0ff'], [1, '#3f97d6']]));
  for (let i = 0; i < 6; i++) elip(ctx, x - 80 * s + i * 32 * s, y - 6 * s + (i % 2) * 6 * s, 14 * s, 3 * s, 'rgba(255,255,255,.6)');
  ctx.fillStyle = lg(ctx, x - 16 * s, 0, x + 16 * s, 0, [[0, '#fff6ea'], [1, '#c8bba8']]); rr(ctx, x - 16 * s, y - 110 * s, 32 * s, 100 * s, 10); ctx.fill();
  elip(ctx, x, y - 110 * s, 50 * s, 14 * s, lg(ctx, 0, y - 124 * s, 0, y - 96 * s, [[0, '#f2ebe0'], [1, '#bdb0a0']])); elip(ctx, x, y - 114 * s, 40 * s, 9 * s, '#7fd0ff');
  ctx.strokeStyle = 'rgba(200,240,255,.9)'; ctx.lineWidth = 5 * s; ctx.lineCap = 'round'; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(x, y - 140 * s); ctx.quadraticCurveTo(x + d * 50 * s, y - 175 * s, x + d * 70 * s, y - 40 * s); ctx.stroke(); });
  elip(ctx, x, y - 150 * s, 10 * s, 14 * s, '#c8f0ff');
}
// ---- personajes redondos ----
function vSarah(ctx, x, y, s) {   // (x,y) = pies
  blando(ctx, () => elip(ctx, x + 8 * s, y, 42 * s, 10 * s, '#000'), 8, 'rgba(50,20,70,.35)');
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#6b3826'; rr(ctx, -40, -150, 80, 96, 34); ctx.fill();   // pelo atrás
  elip(ctx, -14, -6, 12, 7, '#c2346f'); elip(ctx, 14, -6, 12, 7, '#c2346f');
  ctx.beginPath(); ctx.moveTo(-18, -78); ctx.quadraticCurveTo(-50, -10, -40, -12); ctx.lineTo(40, -12); ctx.quadraticCurveTo(50, -10, 18, -78); ctx.closePath(); ctx.fillStyle = lg(ctx, 0, -80, 0, -10, [[0, '#ff8ab8'], [1, '#e04b8a']]); ctx.fill();
  for (let i = 0; i < 6; i++) elip(ctx, -34 + i * 13.6, -14, 8, 6, '#ffd6e8');
  elip(ctx, -26, -60, 9, 18, '#ff8ab8'); elip(ctx, 26, -60, 9, 18, '#ff8ab8'); elip(ctx, -28, -44, 7, 7, '#ffd6b8'); elip(ctx, 28, -44, 7, 7, '#ffd6b8');
  elip(ctx, 0, -112, 42, 40, rg(ctx, 0, -112, 44, [[0, '#ffe6d4'], [.8, '#ffd6b8'], [1, '#f0b38e']], -12, -126));
  elip(ctx, -14, -108, 6, 9, '#2b1740'); elip(ctx, 14, -108, 6, 9, '#2b1740'); elip(ctx, -12, -111, 2.5, 3, '#fff'); elip(ctx, 16, -111, 2.5, 3, '#fff'); elip(ctx, -14, -103, 3, 2, '#9a66d6'); elip(ctx, 14, -103, 3, 2, '#9a66d6');
  elip(ctx, -26, -96, 7, 4, 'rgba(255,140,170,.6)'); elip(ctx, 26, -96, 7, 4, 'rgba(255,140,170,.6)');
  ctx.beginPath(); ctx.arc(0, -96, 6, .2, Math.PI - .2); ctx.strokeStyle = '#d2476f'; ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-44, -110); ctx.quadraticCurveTo(-42, -160, 0, -156); ctx.quadraticCurveTo(42, -160, 44, -110); ctx.quadraticCurveTo(20, -140, 0, -132); ctx.quadraticCurveTo(-24, -142, -44, -110); ctx.fillStyle = lg(ctx, 0, -160, 0, -110, [[0, '#a0603a'], [1, '#6b3826']]); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-16, -150); ctx.lineTo(-10, -170); ctx.lineTo(0, -158); ctx.lineTo(10, -170); ctx.lineTo(16, -150); ctx.closePath(); ctx.fillStyle = '#ffd046'; ctx.fill(); elip(ctx, 0, -158, 4, 4, '#ff4f86');
  ctx.restore();
}
function vDavid(ctx, x, y, s) {
  blando(ctx, () => elip(ctx, x + 8 * s, y, 42 * s, 10 * s, '#000'), 8, 'rgba(50,20,70,.35)');
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = lg(ctx, 0, -180, 0, 0, [[0, '#c08a50'], [1, '#8a5a30']]); rr(ctx, 34, -170, 8, 170, 4); ctx.fill();
  elip(ctx, -14, -6, 12, 7, '#6a3a1a'); elip(ctx, 14, -6, 12, 7, '#6a3a1a');
  ctx.fillStyle = '#b8945e'; rr(ctx, -16, -30, 12, 26, 5); ctx.fill(); rr(ctx, 4, -30, 12, 26, 5); ctx.fill();
  rr(ctx, -30, -80, 60, 56, 22); ctx.fillStyle = lg(ctx, 0, -80, 0, -24, [[0, '#f4dcae'], [1, '#d6b47e']]); ctx.fill();
  ctx.fillStyle = '#8a4a24'; rr(ctx, -30, -80, 18, 52, 10); ctx.fill(); rr(ctx, 12, -80, 18, 52, 10); ctx.fill(); ctx.fillStyle = '#5a3418'; ctx.fillRect(-30, -44, 60, 7);
  elip(ctx, -32, -58, 9, 16, '#e2c48e'); elip(ctx, 34, -58, 9, 16, '#e2c48e'); elip(ctx, 36, -44, 7, 7, '#eab58a'); elip(ctx, -34, -42, 7, 7, '#eab58a');
  elip(ctx, 0, -112, 42, 40, rg(ctx, 0, -112, 44, [[0, '#f6cfa8'], [.8, '#eab58a'], [1, '#c98e62']], -12, -126));
  elip(ctx, -14, -108, 6, 9, '#1e1410'); elip(ctx, 14, -108, 6, 9, '#1e1410'); elip(ctx, -12, -111, 2.5, 3, '#fff'); elip(ctx, 16, -111, 2.5, 3, '#fff');
  elip(ctx, -26, -96, 7, 4, 'rgba(230,140,110,.55)'); elip(ctx, 26, -96, 7, 4, 'rgba(230,140,110,.55)');
  ctx.beginPath(); ctx.arc(0, -96, 7, .2, Math.PI - .2); ctx.strokeStyle = '#9a4a3a'; ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-44, -112); ctx.quadraticCurveTo(-46, -162, 0, -158); ctx.quadraticCurveTo(46, -162, 44, -112); ctx.lineTo(36, -128); ctx.lineTo(26, -118); ctx.lineTo(14, -132); ctx.lineTo(0, -122); ctx.lineTo(-14, -132); ctx.lineTo(-26, -118); ctx.lineTo(-36, -128); ctx.closePath(); ctx.fillStyle = lg(ctx, 0, -160, 0, -112, [[0, '#fff2a8'], [1, '#e8b83a']]); ctx.fill();
  ctx.fillStyle = '#c8302a'; rr(ctx, -44, -136, 88, 10, 5); ctx.fill(); ctx.beginPath(); ctx.moveTo(42, -134); ctx.quadraticCurveTo(62, -128, 58, -110); ctx.lineTo(50, -114); ctx.quadraticCurveTo(54, -124, 42, -126); ctx.fill();
  ctx.restore();
}
function vRobotB(ctx, x, y, s, ang = .35) {   // (x,y) = punto bajo el robot (flota)
  blando(ctx, () => elip(ctx, x, y + 40 * s, 40 * s, 9 * s, '#000'), 8, 'rgba(50,20,70,.3)');
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  [-24, 24].forEach(dx => { elip(ctx, dx, 4, 10, 6, '#8a7a9b'); ctx.save(); ctx.globalCompositeOperation = 'screen'; elip(ctx, dx, 20, 9, 18, rg(ctx, dx, 14, 22, [[0, 'rgba(255,240,180,1)'], [.4, 'rgba(255,160,60,.8)'], [1, 'rgba(255,120,40,0)']])); ctx.restore(); });
  ctx.beginPath(); ctx.moveTo(-22, -110); ctx.lineTo(22, -110); ctx.quadraticCurveTo(28, -110, 30, -102); ctx.lineTo(48, -6); ctx.quadraticCurveTo(48, 0, 40, 0); ctx.lineTo(-40, 0); ctx.quadraticCurveTo(-48, 0, -48, -6); ctx.lineTo(-30, -102); ctx.quadraticCurveTo(-28, -110, -22, -110); ctx.closePath();
  ctx.fillStyle = lg(ctx, -48, 0, 48, 0, [[0, '#f0b47a'], [.45, '#d8925a'], [1, '#9a6038']]); ctx.fill();
  rr(ctx, -50, -10, 100, 14, 7); ctx.fillStyle = lg(ctx, 0, -10, 0, 4, [[0, '#ffd046'], [1, '#c98a12']]); ctx.fill();
  rr(ctx, -20, -124, 40, 16, 7); ctx.fillStyle = lg(ctx, 0, -124, 0, -108, [[0, '#ffe07a'], [1, '#d99a1a']]); ctx.fill(); elip(ctx, 0, -130, 7, 7, '#ffd046');
  rr(ctx, -26, -100, 52, 36, 10); ctx.fillStyle = '#1c2a3a'; ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; elip(ctx, -11, -84, 6, 7, '#7fe8ff'); elip(ctx, 11, -84, 6, 7, '#7fe8ff'); ctx.restore(); elip(ctx, -9, -87, 2, 2, '#fff'); elip(ctx, 13, -87, 2, 2, '#fff');
  ctx.beginPath(); ctx.arc(0, -76, 5, .2, Math.PI - .2); ctx.strokeStyle = '#7fe8ff'; ctx.lineWidth = 2.5; ctx.stroke();
  for (let i = 0; i < 5; i++) { ctx.fillStyle = 'rgba(90,50,20,.45)'; ctx.fillRect(-6, -54 + i * 9, 12, 2.5); }
  ctx.save(); ctx.translate(0, -8); ctx.rotate(ang); ctx.fillStyle = '#3a2a4a'; rr(ctx, -2.5, -62, 5, 62, 2); ctx.fill(); rr(ctx, -9, -44, 18, 12, 4); ctx.fillStyle = '#ffd046'; ctx.fill(); ctx.restore();
  elip(ctx, -50, -50, 9, 9, '#ffd046'); elip(ctx, 50, -50, 9, 9, '#ffd046');
  ctx.restore();
}
