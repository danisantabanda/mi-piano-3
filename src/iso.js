// =====================================================================
//  Charla 5 · motor isométrico SUAVE (vector) con paletas intercambiables; personajes en píxel encima.
//  Paletas: manuscrito iluminado (A), vitral (B), grabado y acuarela (C), colores genéricos de niños (D).
// =====================================================================
const ISO = { cx: 640, cy: 160, t: 40 };
function ip(i, j, z = 0) { return [ISO.cx + (i - j) * ISO.t, ISO.cy + (i + j) * ISO.t / 2 - z * ISO.t]; }
const PALS5 = {
  A: { nombre: 'manuscrito', papel: '#f3e3bc', papel2: '#e6cf9a', tinta: '#3a2414', lw: 2.2, oro: '#d9a930', oro2: '#f6d878',
    muro: ['#fbf1d8', '#efdcb0', '#d9be86'], tejado: ['#d2452e', '#a8321f'], tejado2: ['#2a4b9b', '#1d3672'], ventana: '#2a4b9b', vluz: '#f6d878', puerta: '#7a3a1e',
    suelo: ['#e8d4a2', '#dcc38a'], piedra: ['#d8c49a', '#c4ad80'], pasto: ['#6fae7a', '#2e8b6a'], agua: ['#4f7fd0', '#2a4b9b'], arbol: ['#4fa070', '#2e8b6a', '#1f6a50'], cielo: null },
  B: { nombre: 'vitral', papel: '#1a1420', papel2: '#2a2030', tinta: '#141018', lw: 5, oro: '#e8a10c', oro2: '#ffd060', vidrio: true,
    muro: ['#f0d27a', '#e8a10c', '#b87a08'], tejado: ['#c8183f', '#8a0e2a'], tejado2: ['#2f5fd0', '#1a3a90'], ventana: '#1f4fb5', vluz: '#ffe28a', puerta: '#7a2fa0',
    suelo: ['#7a6aa0', '#5a4a80'], piedra: ['#9a8ab8', '#7a6aa0'], pasto: ['#1aa86a', '#0e7a4a'], agua: ['#2f7fe0', '#1a4fb0'], arbol: ['#2ac07a', '#11845a', '#0a5a3a'] },
  C: { nombre: 'grabado', papel: '#efe4cc', papel2: '#e2d2b0', tinta: '#4a3220', lw: 1.6, oro: '#c9973a', oro2: '#e8c070', acuarela: true,
    muro: ['#f4ead4', '#e6d2a8', '#c9a878'], tejado: ['#b8743a', '#8a5226'], tejado2: ['#4f8a86', '#356662'], ventana: '#4f8a86', vluz: '#f0d080', puerta: '#6a4426',
    suelo: ['#e8dcbe', '#d8c8a0'], piedra: ['#d6c6a2', '#c0ac84'], pasto: ['#9ab88a', '#6f9a70'], agua: ['#7fb0b0', '#4f8a86'], arbol: ['#8ab07a', '#5f8a5a', '#456a42'] },
  D: { nombre: 'genérico', papel: '#7fd0ff', papel2: '#5fb8f0', tinta: '#2a1a3a', lw: 3, oro: '#ffd046', oro2: '#fff3b0',
    muro: ['#ffe14d', '#ffb800', '#e08a00'], tejado: ['#ff3b3b', '#d01f1f'], tejado2: ['#2f6bff', '#1a4fd0'], ventana: '#2f9bff', vluz: '#fff3b0', puerta: '#a020f0',
    suelo: ['#ff9ad0', '#ff70b8'], piedra: ['#c0c0c0', '#a0a0a0'], pasto: ['#3fdd3f', '#1fb81f'], agua: ['#1fc8ff', '#0fa0e0'], arbol: ['#3fdd3f', '#1fb81f', '#0f8a0f'] },
};
let PAL_ = PALS5.A;
// relleno según la paleta (acuarela: borde lavado; vitral: brillo interior)
function cara(ctx, pts, color, o = {}) {
  const S = PAL_;
  ctx.save(); ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
  if (S.acuarela) { ctx.fillStyle = color; ctx.globalAlpha = .92; ctx.fill(); ctx.globalAlpha = 1; ctx.save(); ctx.clip(); ctx.filter = 'blur(6px)'; ctx.strokeStyle = mezcla(color, '#5a3a20', .25); ctx.lineWidth = 10; ctx.stroke(); ctx.restore(); }
  else if (S.vidrio) { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); const g = ctx.createLinearGradient(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)); g.addColorStop(0, mezcla(color, '#ffffff', .35)); g.addColorStop(.5, color); g.addColorStop(1, mezcla(color, '#000000', .25)); ctx.fillStyle = g; ctx.fill(); }
  else { ctx.fillStyle = color; ctx.fill(); }
  if (o.rayado && S.acuarela) { ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(74,50,32,.35)'; ctx.lineWidth = 1; const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); for (let x = Math.min(...xs) - 200; x < Math.max(...xs); x += 7) { ctx.beginPath(); ctx.moveTo(x, Math.min(...ys)); ctx.lineTo(x + 120, Math.max(...ys)); ctx.stroke(); } ctx.restore(); }
  if (o.linea !== false) { ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.lineJoin = 'round'; ctx.lineWidth = o.lw || S.lw; ctx.strokeStyle = o.lineaC || S.tinta; ctx.stroke(); }
  ctx.restore();
}
// mapa de coordenadas de una cara: f(u,v) → pantalla
function caraIzqF(i, j, a, b, h) { return (u, v) => ip(i + u * a, j + b, v * h); }
function caraDerF(i, j, a, b, h) { return (u, v) => ip(i + a, j + b - u * b, v * h); }
function ventanaArco(ctx, F, u0, v0, uw, vh, color, o = {}) {
  const pts = []; const n = 10; pts.push(F(u0, v0)); pts.push(F(u0 + uw, v0));
  for (let k = 0; k <= n; k++) { const a = k / n * Math.PI, u = u0 + uw / 2 + Math.cos(a) * uw / 2, v = v0 + vh - uw * .55 + Math.sin(a) * uw * .55; pts.push(F(u, v)); }
  cara(ctx, pts, color, { lw: Math.max(1.2, PAL_.lw * .8) });
  if (o.cruz) { ctx.save(); ctx.strokeStyle = PAL_.vidrio ? PAL_.tinta : 'rgba(255,255,255,.7)'; ctx.lineWidth = PAL_.vidrio ? 3 : 1.5; const a = F(u0 + uw / 2, v0), b = F(u0 + uw / 2, v0 + vh * .9), c = F(u0, v0 + vh * .45), d = F(u0 + uw, v0 + vh * .45); ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.moveTo(...c); ctx.lineTo(...d); ctx.stroke(); ctx.restore(); }
}
// casa: caja + tejado a dos aguas (cumbrera a lo largo de i) + ventanas + puerta con símbolo
function casaIso(ctx, i, j, a, b, h, o = {}) {
  const S = PAL_, M = o.muro || S.muro, T = o.tejado || S.tejado, rh = o.rh || Math.max(a, b) * .7;
  const L = caraIzqF(i, j, a, b, h), R = caraDerF(i, j, a, b, h);
  cara(ctx, [L(0, 0), L(1, 0), L(1, 1), L(0, 1)], M[1], { rayado: true });
  cara(ctx, [R(0, 0), R(1, 0), R(1, 1), R(0, 1)], M[2], { rayado: true });
  // ventanas
  const pisos = Math.max(1, Math.round(h / 1.1));
  for (let p = 0; p < pisos; p++) {
    const v0 = (p + .28) / pisos, vh = .5 / pisos;
    const vs = o.vsep || 1.1, nI = Math.max(1, Math.round(a / vs)); for (let k = 0; k < nI; k++) { const u = (k + .5) / nI; if (p === 0 && o.puerta !== false && Math.abs(u - .5) < .2) continue; ventanaArco(ctx, L, u - .12 / a * 1.1, v0, .24 / a * 1.1, vh, o.luz ? S.vluz : (o.ventana || S.ventana), { cruz: !o.sinCruz }); }
    const nD = Math.max(1, Math.round(b / vs)); for (let k = 0; k < nD; k++) { const u = (k + .5) / nD; ventanaArco(ctx, R, u - .12 / b * 1.1, v0, .24 / b * 1.1, vh, o.luz ? S.vluz : (o.ventana || S.ventana), { cruz: !o.sinCruz }); }
  }
  if (o.puerta !== false) { const pu = .5 - .13 / a * 1.1; ventanaArco(ctx, L, pu, 0, .26 / a * 1.1, .62 / pisos, S.puerta); if (o.simbolo) { const c = L(.5, .5 / pisos + .02); simboloPuerta(ctx, o.simbolo, c[0], c[1] - 4, ISO.t * .26); } }
  // tejado
  if (o.techo === 'plano') { cara(ctx, [ip(i, j, h), ip(i + a, j, h), ip(i + a, j + b, h), ip(i, j + b, h)], T[0]); }
  else if (o.techo === 'cupula') { const c = ip(i + a / 2, j + b / 2, h); cara(ctx, [ip(i, j, h), ip(i + a, j, h), ip(i + a, j + b, h), ip(i, j + b, h)], M[0]); ctx.save(); ctx.beginPath(); ctx.ellipse(c[0], c[1], ISO.t * a * .55, ISO.t * a * .3, 0, Math.PI, 0); ctx.bezierCurveTo(c[0] + ISO.t * a * .55, c[1] - ISO.t * a * .9, c[0] - ISO.t * a * .55, c[1] - ISO.t * a * .9, c[0] - ISO.t * a * .55, c[1]); ctx.closePath(); ctx.restore(); cara(ctx, arcoCupula(c, ISO.t * a * .55, ISO.t * a), T[0]); }
  else if (o.techo === 'torre') { const c = ip(i + a / 2, j + b / 2, h); cara(ctx, [ip(i, j + b, h), ip(i + a, j + b, h), [c[0], c[1] - rh * ISO.t * 1.6]], T[0]); cara(ctx, [ip(i + a, j + b, h), ip(i + a, j, h), [c[0], c[1] - rh * ISO.t * 1.6]], T[1]); if (o.cruz !== false) cruzOro(ctx, c[0], c[1] - rh * ISO.t * 1.6); }
  else {
    const R0 = ip(i - .12, j + b / 2, h + rh), R1 = ip(i + a + .12, j + b / 2, h + rh);
    cara(ctx, [ip(i - .12, j + b + .15, h - .05), ip(i + a + .12, j + b + .15, h - .05), R1, R0], T[0], { rayado: true });
    cara(ctx, [ip(i + a, j + b, h), ip(i + a, j, h), R1], M[0]);
    // tejas
    ctx.save(); ctx.strokeStyle = 'rgba(0,0,0,.14)'; ctx.lineWidth = 2; for (let k = 1; k < 5; k++) { const p = ip(i - .1, j + b + .15 - k * (b / 2 + .15) / 5, h - .05 + k * (rh + .05) / 5), q = ip(i + a + .1, j + b + .15 - k * (b / 2 + .15) / 5, h - .05 + k * (rh + .05) / 5); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); } ctx.restore();
    if (o.gablete) { const g = ip(i + a / 2, j + b * .82, h + rh * .3); const F2 = (u, v) => [g[0] + (u - .5) * ISO.t * .7, g[1] - v * ISO.t * .75 + (u - .5) * ISO.t * .17]; ventanaArco(ctx, F2, 0, 0, 1, 1, M[0]); ventanaArco(ctx, F2, .3, .15, .4, .55, o.luz ? S.vluz : S.ventana); }
    if (o.estandarte) estandarte(ctx, R1[0], R1[1], o.estandarte);
  }
  if (S.nombre === 'manuscrito' && o.oro !== false) { ctx.save(); ctx.strokeStyle = S.oro; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...ip(i, j + b, h)); ctx.lineTo(...ip(i + a, j + b, h)); ctx.lineTo(...ip(i + a, j, h)); ctx.stroke(); ctx.restore(); }
}
function arcoCupula(c, rx, alto) { const pts = []; for (let k = 0; k <= 16; k++) { const a = Math.PI + k / 16 * Math.PI; pts.push([c[0] + Math.cos(a) * rx, c[1] + Math.sin(a) * rx * .5 - Math.sin(k / 16 * Math.PI) * alto * .55]); } return pts; }
function cruzOro(ctx, x, y) { ctx.save(); ctx.fillStyle = PAL_.oro; ctx.strokeStyle = PAL_.tinta; ctx.lineWidth = 1.5; ctx.fillRect(x - 2, y - 22, 4, 22); ctx.strokeRect(x - 2, y - 22, 4, 22); ctx.fillRect(x - 8, y - 16, 16, 4); ctx.strokeRect(x - 8, y - 16, 16, 4); ctx.restore(); }
function estandarte(ctx, x, y, c) { ctx.save(); ctx.strokeStyle = PAL_.tinta; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 60); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y - 58); ctx.lineTo(x + 34, y - 52); ctx.lineTo(x + 26, y - 42); ctx.lineTo(x + 34, y - 32); ctx.lineTo(x, y - 34); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
// suelo en rombos con dos tonos (adoquín o pasto)
function sueloIso(ctx, i0, j0, a, b, cols, o = {}) {
  for (let i = i0; i < i0 + a; i++) for (let j = j0; j < j0 + b; j++) {
    const pts = [ip(i, j), ip(i + 1, j), ip(i + 1, j + 1), ip(i, j + 1)];
    cara(ctx, pts, cols[(i + j) % 2], { lw: o.lw || PAL_.lw * .5, lineaC: o.lineaC || mezcla(cols[1], '#000', .2) });
  }
}
function borde(ctx, i0, j0, a, b, alto, cols) {   // grosor del diorama
  cara(ctx, [ip(i0, j0 + b), ip(i0 + a, j0 + b), ip(i0 + a, j0 + b, -alto), ip(i0, j0 + b, -alto)], cols[0]);
  cara(ctx, [ip(i0 + a, j0 + b), ip(i0 + a, j0), ip(i0 + a, j0, -alto), ip(i0 + a, j0 + b, -alto)], cols[1]);
}
function fuenteIso(ctx, i, j, s = 1) {
  const S = PAL_, c = ip(i, j), rx = ISO.t * 1.1 * s, ry = rx / 2;
  ctx.save(); ctx.beginPath(); ctx.ellipse(c[0], c[1] + 8, rx, ry, 0, 0, 7); ctx.fillStyle = S.piedra[1]; ctx.fill(); ctx.lineWidth = S.lw; ctx.strokeStyle = S.tinta; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(c[0], c[1], rx, ry, 0, 0, 7); ctx.fillStyle = S.piedra[0]; ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(c[0], c[1], rx * .82, ry * .78, 0, 0, 7); ctx.fillStyle = S.agua[0]; ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.6)'; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(c[0] - rx * .4 + k * rx * .26, c[1] - 2 + (k % 2) * 6, 10, 2.5, 0, 0, 7); ctx.fill(); }
  ctx.fillStyle = S.piedra[0]; ctx.fillRect(c[0] - 6, c[1] - 44, 12, 44); ctx.strokeRect(c[0] - 6, c[1] - 44, 12, 44);
  ctx.beginPath(); ctx.ellipse(c[0], c[1] - 44, 22, 9, 0, 0, 7); ctx.fillStyle = S.piedra[0]; ctx.fill(); ctx.stroke();
  ctx.strokeStyle = S.agua[0]; ctx.lineWidth = 3; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(c[0], c[1] - 50); ctx.quadraticCurveTo(c[0] + d * 26, c[1] - 74, c[0] + d * 34, c[1] - 6); ctx.stroke(); });
  ctx.restore();
}
function arbolIso(ctx, i, j, s = 1) {
  const S = PAL_, c = ip(i, j), A = S.arbol;
  ctx.save(); ctx.fillStyle = S.vidrio ? '#5a3a20' : '#7a4a2a'; ctx.fillRect(c[0] - 4, c[1] - 30 * s, 8, 30 * s); ctx.strokeStyle = S.tinta; ctx.lineWidth = S.lw * .7; ctx.strokeRect(c[0] - 4, c[1] - 30 * s, 8, 30 * s);
  [[0, -60, 30], [-16, -44, 22], [16, -44, 22]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(c[0] + dx * s, c[1] + dy * s, r * s, 0, 7); const g = ctx.createRadialGradient(c[0] + dx * s - r * .4 * s, c[1] + dy * s - r * .4 * s, 0, c[0] + dx * s, c[1] + dy * s, r * s); g.addColorStop(0, A[0]); g.addColorStop(.6, A[1]); g.addColorStop(1, A[2]); ctx.fillStyle = S.vidrio || S.acuarela ? A[1] : g; ctx.fill(); ctx.lineWidth = S.lw; ctx.strokeStyle = S.tinta; ctx.stroke(); });
  ctx.restore();
}
// personajes en píxel sobre el mundo suave
function pjIso(ctx, s, i, j, k = 3, o = {}) { const c = ip(i, j, o.z || 0); ctx.save(); ctx.filter = 'blur(4px)'; ctx.fillStyle = 'rgba(30,15,40,.3)'; ctx.beginPath(); ctx.ellipse(c[0] + 4, c[1] + 2 + (o.z || 0) * ISO.t, 20 * k / 3, 7 * k / 3, 0, 0, 7); ctx.fill(); ctx.restore(); sprK(ctx, s, c[0], c[1], k); }
// símbolos de las puertas y de los escudos (vector simple)
function simboloPuerta(ctx, tipo, x, y, r) {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = PAL_.oro2 || '#ffd046'; ctx.strokeStyle = PAL_.tinta; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = PAL_.tinta;
  const s = r / 10;
  if (tipo === 'arbol') { ctx.beginPath(); ctx.arc(0, -2 * s, 5 * s, 0, 7); ctx.fill(); ctx.fillRect(-1 * s, 2 * s, 2 * s, 5 * s); }
  if (tipo === 'coro') { ctx.beginPath(); ctx.moveTo(-5 * s, 6 * s); ctx.lineTo(-5 * s, -1 * s); ctx.lineTo(0, -6 * s); ctx.lineTo(5 * s, -1 * s); ctx.lineTo(5 * s, 6 * s); ctx.fill(); }
  if (tipo === 'libro') { ctx.fillRect(-6 * s, -4 * s, 5.5 * s, 9 * s); ctx.fillRect(0.5 * s, -4 * s, 5.5 * s, 9 * s); }
  if (tipo === 'mascara') { ctx.beginPath(); ctx.arc(0, 0, 6 * s, 0, Math.PI); ctx.fill(); ctx.fillRect(-6 * s, -4 * s, 12 * s, 4 * s); }
  if (tipo === 'martillo') { ctx.fillRect(-1 * s, -3 * s, 2 * s, 10 * s); ctx.fillRect(-5 * s, -6 * s, 10 * s, 4 * s); }
  if (tipo === 'estrella') { ctx.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, q = k % 2 ? 3 * s : 7 * s; ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q); } ctx.fill(); }
  ctx.restore();
}
