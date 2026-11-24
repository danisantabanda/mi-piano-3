// =====================================================================
//  MI PIANO 2 · motor de píxel (mismo idioma que "Sarah: La Luz del Reino" y "David Rey Pastor")
//  - todo se pinta en código con un "pincel" de rectángulos enteros
//  - contorno automático de 1 px en tinta (#2a1a3a): lo que hace que todo se lea en la tablet
//  - escala entera siempre (4× en 1280×800, 3× en 1024×600)
// =====================================================================
const PAL = {
  tinta: '#2a1a3a', tinta2: '#45305c', blanco: '#fffaf4', crema: '#fff1d6',
  n0: '#1c1030', n1: '#33204d', n2: '#533477', n3: '#7a52a6', n4: '#a983d6',
  oro: '#ffd046', oro2: '#e6a21b', oro3: '#fff3b0', oro4: '#b87a10',
  piel: '#f7c9a4', piel2: '#e3a47e', piel3: '#c98263', rubor: '#ff8fa3',
  rojo: '#ff5a5a', rojo2: '#d63a4a', rojo3: '#a3243a', vino: '#7a1f3d',
  verde: '#5fd36a', verde2: '#3fae5a', verde3: '#2a7d4a', menta: '#7fe0c0',
  cielo: '#8fd3ff', azul: '#3fc7f0', azul2: '#3f8cff', azul3: '#2c5bb8', marino: '#2c3a6b', marino2: '#3f5296',
  lila: '#c9b5ff', rosa: '#ff5f9e', rosa2: '#ff9cc4', rosa3: '#d22f72',
  madera: '#c98a52', madera2: '#9a6038', madera3: '#e8b47c', madera4: '#6e3f22',
  gris: '#b8aac8', gris2: '#8a7a9b', peluca: '#f4efe6', peluca2: '#d9cfc2', peluca3: '#b5a998',
};
// colores de las 7 notas (iguales en píxel y en vector)
const NOTA = {
  DO: { c: '#ff5a5a', o: '#c23345', l: '#ffb0a8' }, RE: { c: '#ff9a3c', o: '#c8641c', l: '#ffd0a0' },
  MI: { c: '#ffd046', o: '#c99412', l: '#fff0a8' }, FA: { c: '#5fd36a', o: '#2f9a4a', l: '#b9f2b0' },
  SOL: { c: '#3fc7f0', o: '#1e8bbd', l: '#b4ecff' }, LA: { c: '#5a7dff', o: '#3450c4', l: '#bccbff' },
  SI: { c: '#b86bff', o: '#7f3fc8', l: '#e2c4ff' },
};
const NOMBRES = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'];

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, p) => a + (b - a) * p;
const EASE = {
  lin: p => p, inQ: p => p * p, outQ: p => 1 - (1 - p) * (1 - p),
  outC: p => 1 - Math.pow(1 - p, 3), inC: p => p * p * p,
  inOut: p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2,
  outBack: p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  outElastic: p => p === 0 ? 0 : p === 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - .75) * (2 * Math.PI) / 3) + 1,
};
function hex2(c) { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function mezcla(a, b, p) { const x = hex2(a), y = hex2(b); return '#' + x.map((v, i) => Math.round(lerp(v, y[i], p)).toString(16).padStart(2, '0')).join(''); }

function Pen(ctx) {
  const R = (x, y, w, h, c) => { if (w <= 0 || h <= 0) return; ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  return {
    ctx, R,
    px: (x, y, c) => R(x, y, 1, 1, c),
    disc(cx, cy, r, c) { for (let y = -r; y <= r; y++) { const w = Math.round(Math.sqrt(Math.max(0, r * r - y * y))); R(cx - w, cy + y, w * 2 + 1, 1, c); } },
    ell(cx, cy, rx, ry, c) { for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry)))); R(cx - w, cy + y, w * 2 + 1, 1, c); } },
    // elipse con media fila (para tamaños pares)
    ellE(x0, y0, w, h, c) { const rx = w / 2, ry = h / 2; for (let y = 0; y < h; y++) { const dy = (y + .5 - ry) / ry; const half = rx * Math.sqrt(Math.max(0, 1 - dy * dy)); R(Math.round(x0 + rx - half), y0 + y, Math.round(half * 2), 1, c); } },
    line(x0, y0, x1, y1, c, th = 1) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1; for (let i = 0; i <= n; i++) R(Math.round(lerp(x0, x1, i / n) - th / 2 + .5), Math.round(lerp(y0, y1, i / n) - th / 2 + .5), th, th, c); },
    ring(cx, cy, r, c, th = 1) { if (!(r > .3)) return; for (let a = 0; a < Math.PI * 2; a += .6 / r) R(cx + Math.cos(a) * r - th / 2, cy + Math.sin(a) * r - th / 2, th, th, c); },
    map(rows, pal, ox = 0, oy = 0) { for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[y].length; x++) { const ch = rows[y][x]; if (pal[ch]) R(ox + x, oy + y, 1, 1, pal[ch]); } },
    alpha(a, fn) { const o = ctx.globalAlpha; ctx.globalAlpha = o * a; fn(); ctx.globalAlpha = o; },
  };
}
function lienzo(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, w); c.height = Math.max(1, h); return c; }
// Sprite con contorno automático de 1 px (ancla en los pies)
function sprite(w, h, fn, o = {}) {
  const pad = o.contorno === false ? 0 : 1;
  const c = lienzo(w + pad * 2, h + pad * 2), x = c.getContext('2d');
  x.translate(pad, pad); fn(Pen(x)); x.setTransform(1, 0, 0, 1, 0, 0);
  if (pad) {
    const W = c.width, H = c.height, d = x.getImageData(0, 0, W, H), a = d.data, src = new Uint8ClampedArray(a);
    const oc = hex2(o.contorno || PAL.tinta);
    for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) {
      const i = (yy * W + xx) * 4; if (src[i + 3] > 40) continue;
      let hit = false;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = xx + dx, ny = yy + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; if (src[(ny * W + nx) * 4 + 3] > 140) { hit = true; break; } }
      if (hit) { a[i] = oc[0]; a[i + 1] = oc[1]; a[i + 2] = oc[2]; a[i + 3] = 255; }
    }
    x.putImageData(d, 0, 0);
  }
  c.ax = (o.ax != null ? o.ax : w / 2) + pad; c.ay = (o.ay != null ? o.ay : h) + pad;
  return c;
}
function teñido(s, color) { const c = lienzo(s.width, s.height), x = c.getContext('2d'); x.drawImage(s, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height); c.ax = s.ax; c.ay = s.ay; return c; }
function pintar(ctx, s, x, y, o = {}) {
  if (!s) return; const sx = o.sx || 1, sy = o.sy || 1, flip = o.flip ? -1 : 1;
  ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  ctx.translate(Math.round(x), Math.round(y)); if (o.rot) ctx.rotate(o.rot);
  ctx.scale(sx * flip, sy); ctx.drawImage(s, -s.ax, -s.ay); ctx.restore();
}
// letras de píxel 3×5 para las notitas (DO RE MI FA SOL LA SI) y números
const LETRA = {
  D: ['110', '101', '101', '101', '110'], O: ['010', '101', '101', '101', '010'], R: ['110', '101', '110', '101', '101'],
  E: ['111', '100', '110', '100', '111'], M: ['10001', '11011', '10101', '10001', '10001'], I: ['111', '010', '010', '010', '111'],
  F: ['111', '100', '110', '100', '100'], A: ['010', '101', '111', '101', '101'], S: ['011', '100', '010', '001', '110'],
  L: ['100', '100', '100', '100', '111'],
  1: ['010', '110', '010', '010', '111'], 2: ['110', '001', '010', '100', '111'], 3: ['110', '001', '010', '001', '110'],
  4: ['101', '101', '111', '001', '001'], 5: ['111', '100', '110', '001', '110'],
};
function anchoTexto(t) { let w = 0; for (const ch of t) w += (LETRA[ch] ? LETRA[ch][0].length : 2) + 1; return w - 1; }
function textoPix(g, t, x, y, c) { for (const ch of t) { const L = LETRA[ch]; if (L) { L.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] === '1') g.px(x + i, y + j, c); }); x += L[0].length + 1; } else x += 3; } }
