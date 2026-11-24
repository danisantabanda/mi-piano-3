// =====================================================================
//  M5 · EL MAPA DEL MUNDO, TAMBIÉN DESDE ARRIBA: se camina con las flechas por el camino (que es un pentagrama)
//  entre las ciudades. Diciembre: Belén despierto; lo demás en niebla oscura con siluetas.
// =====================================================================
const MAPW5 = 72, MAPH5 = 46;
const NODOS_MAPA5 = [['natal', 6, 38], ['belen', 15, 36], ['u1', 24, 39], ['u2', 32, 33], ['u3', 26, 25], ['u4', 34, 19], ['u5', 43, 23], ['u6', 51, 29], ['u7', 60, 32], ['u8', 65, 22], ['u9', 58, 14], ['u10', 47, 9], ['gran', 36, 7]];
function caminoMapa5() {   // trazos ortogonales (como las rutas de antes): primero horizontal y luego vertical
  const pts = []; NODOS_MAPA5.forEach(([, x, y], k) => { if (k === 0) { pts.push([x, y, 0]); return; } const [, px, py] = NODOS_MAPA5[k - 1]; if (k % 2) { pts.push([x, py, k - 1]); } else { pts.push([px, y, k - 1]); } pts.push([x, y, k - 1]); });
  const tiles = new Map(); for (let k = 1; k < pts.length; k++) { const [x0, y0] = pts[k - 1], [x1, y1, seg] = pts[k], n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let s = 0; s <= n; s++) { const x = Math.round(x0 + (x1 - x0) * s / n), y = Math.round(y0 + (y1 - y0) * s / n); [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([dx, dy]) => { const key = (x + dx) + ',' + (y + dy); if (!tiles.has(key)) tiles.set(key, seg); }); } }
  return { pts, tiles };
}
function sprCiudad5(id, viva) {   // una ciudad amurallada vista desde arriba (5×4 baldosas)
  return cache('ciu' + id + viva, () => { const W = 6 * TA, H = 5 * TA; const c = canvas(W + 2, H + 14), x = c.getContext('2d'); x.translate(1, 13); const g = Pen(x), R = rng(id.length * 97 + (id.charCodeAt(1) || 3));
    g.R(2, 20, W - 4, H - 24, '#c9b48e'); g.R(4, 22, W - 8, H - 28, '#a9a663');
    for (let k = 0; k < 7; k++) { const hx = 8 + Math.floor(R() * (W - 26)), hy = 24 + Math.floor(R() * (H - 50)), hw = 10 + Math.floor(R() * 6); g.R(hx, hy, hw, 8, k % 3 ? '#efe1c2' : '#c0603f'); g.R(hx, hy + 8, hw, 6, '#d8c49a'); g.R(hx + hw / 2 - 1, hy + 10, 2, 4, viva ? '#ffc860' : '#6a5a4a'); }
    g.R(0, H - 8, W, 8, '#d8c49a'); for (let xx = 0; xx < W; xx += 6) g.R(xx, H - 11, 4, 3, '#d8c49a'); g.R(W / 2 - 6, H - 12, 12, 12, '#3a2a22');
    [[0, H - 22], [W - 12, H - 22]].forEach(([tx, ty]) => { g.R(tx, ty, 12, 22, '#efe1c2'); g.R(tx - 1, ty - 3, 14, 4, '#c0603f'); g.R(tx + 4, ty + 6, 4, 6, viva ? '#ffc860' : '#3a2a3a'); });
    g.R(W / 2 - 5, 0, 10, 24, '#efe1c2'); g.ellE(W / 2 - 7, -12, 14, 14, id === 'belen' ? '#d9a930' : '#5a86c4'); g.R(W / 2 - 1, -12, 2, 4, '#ffd046');
    nocturno5(c); if (viva) { x.fillStyle = '#ffc860'; [[W / 2 - 2, 8, 4, 6]].forEach(([a, b, w, h]) => x.fillRect(a, b, w, h)); }
    c.ax = 1 + W / 2; c.ay = H + 13; return c; });
}
function sprMonte5(s = 1, nieve = true) { return cache('mon' + s + nieve, () => nocturno5(sprite(Math.round(40 * s), Math.round(34 * s), g => { const w = Math.round(40 * s), h = Math.round(34 * s); for (let y = 0; y < h; y++) { const half = Math.round(w / 2 * y / h); g.R(w / 2 - half, y, half, 1, '#8a7a9a'); g.R(w / 2, y, half, 1, '#6a5a7a'); if (nieve && y < h * .3) { g.R(w / 2 - half, y, half * 2, 1, y < h * .2 ? '#fffaf4' : '#e2d8f0'); } } }, { ax: Math.round(20 * s), ay: Math.round(34 * s) }))); }
function sprPino5() { return cache('pinoM', () => nocturno5(sprite(14, 22, g => { g.R(6, 17, 2, 5, '#6a4a2a'); for (let y = 0; y < 18; y++) { const w = Math.round(1 + y * .38) * 2; g.R(7 - w / 2, y, w, 1, y % 5 === 4 ? '#2f6a4a' : '#3f8a5a'); } }, { ax: 7, ay: 22 }))); }
function defMapaArriba5() {
  const C = caminoMapa5(), en = (i, j) => C.tiles.has(i + ',' + j), segDe = (i, j) => C.tiles.get(i + ',' + j);
  const costa = (i, j) => { const dx = (i - MAPW5 / 2) / (MAPW5 * .48), dy = (j - MAPH5 / 2) / (MAPH5 * .47), r = Math.sqrt(dx * dx + dy * dy) + .07 * Math.sin(i * .5) + .06 * Math.cos(j * .6 + i * .2); return r < 1; };
  const props = [], R = rng(2026), lejos = (i, j, d) => { for (let a = -d; a <= d; a++) for (let b = -d; b <= d; b++) if (en(i + a, j + b)) return false; return true; };
  const nodoEn = (i, j) => NODOS_MAPA5.find(([, x, y]) => (i === x || i === x + 1) && (j === y || j === y + 1));
  NODOS_MAPA5.forEach(([id, x, y]) => props.push({ i: x, j: y - 1, spr: sprCiudad5(id, id === 'belen'), bloquea: false, dx: 8, ciudad: id, dy: 0 }));
  // montes y bosques lejos del camino
  [[10, 8, 7], [52, 40, 5], [20, 18, 6], [42, 33, 5], [66, 9, 4], [28, 4, 4]].forEach(([cx, cy, n]) => { for (let k = 0; k < n; k++) { const i = cx + Math.floor((R() - .5) * 8), j = cy + Math.floor((R() - .5) * 5); if (costa(i, j) && lejos(i, j, 2)) props.push({ i, j, spr: sprMonte5(.9 + R() * .7, R() < .6) }); } });
  for (let k = 0; k < 260; k++) { const i = 2 + Math.floor(R() * (MAPW5 - 4)), j = 2 + Math.floor(R() * (MAPH5 - 4)); if (costa(i, j) && lejos(i, j, 1) && !props.some(p => p.i === i && p.j === j)) props.push({ i, j, spr: R() < .7 ? sprPino5() : sprOlivo5(0) }); }
  const permitido = (i, j) => { if (!en(i, j)) return false; if (GUARDA.d.verMundos) return true; const s = segDe(i, j); return s === 0 || Math.hypot(i - 15, j - 36) < 8; };
  return {
    id: 'mapa', nombre: 'El mundo', titulo: 'El mundo · diciembre', W: MAPW5, H: MAPH5, inicio: [15, 39, 'abajo'], vel: 8, recordar: false, sinMapa: true,
    suelo: (i, j) => en(i, j) ? 'c' : costa(i, j) ? 'g' : 'a',
    bloqueaSuelo: t => t !== 'c', libreExtra: permitido,
    pintarSuelo: (g, ctx, { tipo }) => {
      for (let j = 0; j < MAPH5; j++) for (let i = 0; i < MAPW5; i++) { const t = tipo(i, j), x = i * TA, y = j * TA; if (t === 'a') { g.R(x, y, TA, TA, '#3f6ab8'); if ((i * 7 + j * 13) % 9 === 0) { g.R(x + 3, y + 7, 6, 1, '#9fc4ef'); g.R(x + 5, y + 6, 2, 1, '#9fc4ef'); } } else { g.R(x, y, TA, TA, (i + j) % 5 ? '#93b064' : '#88a85e'); if ((i * 5 + j * 3) % 7 === 0) g.px(x + 6, y + 9, '#c2d088'); } }
      // la costa
      for (let j = 1; j < MAPH5 - 1; j++) for (let i = 1; i < MAPW5 - 1; i++) if (tipo(i, j) === 'a' && (tipo(i - 1, j) !== 'a' || tipo(i + 1, j) !== 'a' || tipo(i, j - 1) !== 'a' || tipo(i, j + 1) !== 'a')) { g.R(i * TA, j * TA, TA, TA, '#5f86c8'); for (let x = 0; x < TA; x += 4) g.R(i * TA + x, j * TA + ((x / 4) % 2) * 2, 3, 1, '#bcd8f4'); }
      // el camino es un pentagrama: arena ancha con cinco líneas finas
      const P = C.pts.map(([x, y]) => [x * TA + TA, y * TA + TA]); const linea = (w, c) => { ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); P.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore(); };
      linea(30, '#c9ad7a'); linea(27, '#ecdab0'); [[21, 19], [11, 9]].forEach(([a, b]) => { linea(a, '#8a6a4a'); linea(b, '#ecdab0'); }); linea(1.2, '#8a6a4a');
    },
    props, npcs: [], sanson: true,
    alPisar: (L, i, j) => { const nd = nodoEn(i, j); if (!nd || L.auto) return; const [id] = nd;
      if (id === 'belen') { MANDO5.soltarTodo(); irA(LUGARES5.belen, { tipo: 'iris', desde: [31, 47], dir: 'arriba' }); return; }
      if (id === 'natal') { DIALOGO5.abrir('Mi aldea', null, ['Tu aldea te espera.', 'Esta Navidad, la música está en Belén.']); return; }
      const c = CIUDADES5.find(c => c.id === id); DIALOGO5.abrir('', null, [id === 'gran' ? 'El gran concierto: en noviembre.' : 'Esta ciudad se abre en ' + (MESES5[c && c.mes] || 'el año nuevo') + '.']); },
    luces: [[15.5 * TA, 36 * TA, 90, .6]],
    encima: (ctx, izq, arr, L) => { niebla5(ctx, izq, arr, L); estrellaArriba5(ctx, 15.5 * TA * KA - izq, 30.5 * TA * KA - arr, L); },
    alEntrar: (L, o) => { },
  };
}
// la niebla oscura de lo que todavía no se abre, con las siluetas de las ciudades encima
let NIEBLA_MAPA5 = null;
function niebla5(ctx, izq, arr, L) {
  if (GUARDA.d.verMundos) return;
  if (!NIEBLA_MAPA5) { const k = 4, c = canvas(MAPW5 * TA / k, MAPH5 * TA / k), x = c.getContext('2d'); x.fillStyle = 'rgba(16,10,34,.9)'; x.fillRect(0, 0, c.width, c.height); x.globalCompositeOperation = 'destination-out';
    [[15.5, 36.5, 11], [8, 38, 6]].forEach(([i, j, r]) => { const g = x.createRadialGradient(i * TA / k, j * TA / k, 0, i * TA / k, j * TA / k, r * TA / k); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.6, 'rgba(0,0,0,.95)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, c.width, c.height); });
    x.globalCompositeOperation = 'source-over'; NODOS_MAPA5.forEach(([id, i, j]) => { if (id === 'belen') return; const s = sprCiudad5(id, false), t = teñido(s, '#4a3a6e'); x.globalAlpha = id === 'natal' ? 0 : .6; x.drawImage(t, (i * TA + 16) / k - s.ax / k, (j * TA) / k - s.ay / k, s.width / k, s.height / k); }); x.globalAlpha = 1; NIEBLA_MAPA5 = c; }
  ctx.save(); ctx.imageSmoothingEnabled = true; ctx.drawImage(NIEBLA_MAPA5, -izq, -arr, MAPW5 * TA * KA, MAPH5 * TA * KA); ctx.restore();
}
function crearMapaArriba5() { const M = crearArriba(defMapaArriba5()); M.nombre = 'El mundo';
  M.burbujas = () => NODOS_MAPA5.filter(([id]) => id === 'belen' || GUARDA.d.verMundos).map(([id, x, y]) => ({ x: x * TA + 16, y: y * TA - 98, c: '#ffd046', txt: id === 'belen' ? 'Belén · diciembre' : (CIUDADES5.find(c => c.id === id) || {}).nombre || MESES5[(CIUDADES5.find(c => c.id === id) || {}).mes] || '', ir: [x, y + 1, 'arriba'], lejos: 14, cerca: 12 }));
  return M; }
