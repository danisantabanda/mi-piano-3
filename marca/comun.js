// Piezas comunes de la marca (para el manual y las guías): datos de notas, teclado, estrella, mano, páginas y exportar a PDF.
const fs = require('fs'), path = require('path');
const F = require('./figuras.js');
const AQUI = __dirname, INK = '#2a1a3a';
const NOTAS = [   // pc, nombre, color, oscuro (para texto), claro, dedo de la mano derecha en posición de DO
  { pc: 0, n: 'DO', c: '#ff5a5a', o: '#c23345', l: '#ffe1de', dedo: 1, color: 'rojo' },
  { pc: 2, n: 'RE', c: '#ff9a3c', o: '#c8641c', l: '#ffead6', dedo: 2, color: 'naranja' },
  { pc: 4, n: 'MI', c: '#ffd046', o: '#a87a0a', l: '#fff4c8', dedo: 3, color: 'amarillo' },
  { pc: 5, n: 'FA', c: '#5fd36a', o: '#2f9a4a', l: '#ddf6da', dedo: 4, color: 'verde' },
  { pc: 7, n: 'SOL', c: '#3fc7f0', o: '#1e8bbd', l: '#d9f4fd', dedo: 5, color: 'azul cielo' },
  { pc: 9, n: 'LA', c: '#5a7dff', o: '#3450c4', l: '#e0e6ff', dedo: null, color: 'azul' },
  { pc: 11, n: 'SI', c: '#b86bff', o: '#7f3fc8', l: '#f0e2ff', dedo: null, color: 'morado' },
];
const NOTA_PC = {}; NOTAS.forEach((x, i) => { NOTA_PC[x.pc] = Object.assign({ i }, x); });
const r1 = v => Math.round(v * 10) / 10;
// muñeco pixel art (PNG ×10 exportado del juego)
const MED = JSON.parse(fs.readFileSync(path.join(AQUI, 'recursos', 'medidas.json'), 'utf8'));
function spr(id, alto, estilo = '', espejo = false) {
  const m = MED[id] || [10, 10]; const k = alto / m[1];
  return '<img class="px" src="recursos/' + id + '.png" style="height:' + r1(alto) + 'px;width:' + r1(m[0] * k) + 'px;' + (espejo ? 'transform:scaleX(-1);' : '') + estilo + '">';
}
// teclado de una octava (DO a SI) · o: { ancho, alto, colores: [7] | 'notas' | null, marcar: [i], dedos: bool, nombres: bool | [i], sombra, grosor }
function teclado(o = {}) {
  const W = o.ancho || 300, H = o.alto || 140, g = o.grosor || 3, sh = o.sombra == null ? 5 : o.sombra, kw = (W - g) / 7, rad = 10;
  let s = '<svg class="teclado" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (W + sh) + ' ' + (H + sh) + '" width="' + (W + sh) + '" height="' + (H + sh) + '">';
  if (sh) s += '<rect x="' + (sh + g / 2) + '" y="' + (sh + g / 2) + '" width="' + (W - g) + '" height="' + (H - g) + '" rx="' + rad + '" fill="' + INK + '"/>';
  for (let i = 0; i < 7; i++) {
    const x = g / 2 + i * kw, fill = Array.isArray(o.colores) ? (o.colores[i] || '#fff') : o.colores === 'notas' ? NOTAS[i].c : '#fff';
    const rx = i === 0 ? 'M' + r1(x + rad) + ' ' + g / 2 : 'M' + r1(x) + ' ' + g / 2;
    s += '<path d="' + (i === 0 ? 'M' + r1(x) + ' ' + g / 2 + 'H' + r1(x + kw) + 'V' + r1(H - g / 2) + 'H' + r1(x + rad) + 'Q' + r1(x) + ' ' + r1(H - g / 2) + ' ' + r1(x) + ' ' + r1(H - g / 2 - rad) + 'Z'
      : i === 6 ? 'M' + r1(x) + ' ' + g / 2 + 'H' + r1(x + kw) + 'V' + r1(H - g / 2 - rad) + 'Q' + r1(x + kw) + ' ' + r1(H - g / 2) + ' ' + r1(x + kw - rad) + ' ' + r1(H - g / 2) + 'H' + r1(x) + 'Z'
      : 'M' + r1(x) + ' ' + g / 2 + 'H' + r1(x + kw) + 'V' + r1(H - g / 2) + 'H' + r1(x) + 'Z') + '" fill="' + fill + '" stroke="' + INK + '" stroke-width="' + g + '" stroke-linejoin="round"/>';
    const lbl = o.nombres === true || (Array.isArray(o.nombres) && o.nombres.includes(i));
    if (lbl) s += '<text x="' + r1(x + kw / 2) + '" y="' + r1(H - g - 9) + '" text-anchor="middle" font-family="Outfit" font-weight="700" font-size="' + r1(Math.min(18, kw * .36)) + '" fill="' + INK + '">' + NOTAS[i].n + '</text>';
    if (o.dedos && NOTAS[i].dedo) { const cy = H - g - (lbl ? 36 : 18), r = Math.min(11, kw * .22); s += '<circle cx="' + r1(x + kw / 2) + '" cy="' + r1(cy) + '" r="' + r + '" fill="#fff" stroke="' + INK + '" stroke-width="2"/><text x="' + r1(x + kw / 2) + '" y="' + r1(cy + r * .42) + '" text-anchor="middle" font-family="Outfit" font-weight="700" font-size="' + r1(r * 1.2) + '" fill="' + INK + '">' + NOTAS[i].dedo + '</text>'; }
    if (o.marcar && o.marcar.includes(i)) s += estrellaPath(x + kw / 2, H * .72 - (lbl ? 10 : 0) - (o.dedos ? 26 : 0), Math.min(16, kw * .3), '#fff', 2.5);
  }
  [0, 1, 3, 4, 5].forEach(i => { const bw = kw * .58, x = g / 2 + (i + 1) * kw - bw / 2; s += '<rect x="' + r1(x) + '" y="' + g / 2 + '" width="' + r1(bw) + '" height="' + r1(H * .58) + '" rx="4" fill="' + INK + '"/>'; });
  s += '<rect x="' + g / 2 + '" y="' + g / 2 + '" width="' + r1(W - g) + '" height="' + r1(H - g) + '" rx="' + rad + '" fill="none" stroke="' + INK + '" stroke-width="' + g + '"/>';
  return s + '</svg>';
}
function estrellaPath(cx, cy, r, fill, g, rot = 0) {
  let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + rot + i * Math.PI / 5, q = i % 2 ? r * .48 : r; d += (i ? 'L' : 'M') + r1(cx + Math.cos(a) * q) + ' ' + r1(cy + Math.sin(a) * q); }
  return '<path d="' + d + 'Z" fill="' + fill + '" stroke="' + INK + '" stroke-width="' + g + '" stroke-linejoin="round"/>';
}
// estrella grande (para colorear o llena) con sombra dura
function estrella(tam, o = {}) {
  const r = tam / 2 - 6, sh = o.sombra == null ? 5 : o.sombra, c = tam / 2;
  return '<svg class="estrella" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (tam + sh) + ' ' + (tam + sh) + '" width="' + (tam + sh) + '" height="' + (tam + sh) + '">' + (sh ? estrellaPath(c + sh, c + sh + 3, r, INK, o.grosor || 4) : '') + estrellaPath(c, c + 3, r, o.relleno || '#fff', o.grosor || 4) + (o.texto ? '<text x="' + c + '" y="' + (c + 10) + '" text-anchor="middle" font-family="Outfit" font-weight="700" font-size="' + r1(tam * .2) + '" fill="' + INK + '">' + o.texto + '</text>' : '') + '</svg>';
}
// mano derecha vista desde arriba (pulgar = 1 a la izquierda) · o: { alto, colores: {dedo: color}, numeros }
function mano(o = {}) {
  const H = o.alto || 220, k = H / 220, W = 230 * k;
  const dedos = [[1, 64, 112, 30, 70, -52], [2, 70, 30, 29, 96, -8], [3, 106, 14, 30, 110, 0], [4, 143, 24, 29, 100, 6], [5, 176, 52, 26, 80, 14]];
  let s = '<svg class="mano" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + r1(W) + ' ' + r1(H) + '" width="' + r1(W) + '" height="' + r1(H) + '"><g transform="scale(' + r1(k * 100) / 100 + ')" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round">';
  dedos.forEach(([n, x, y, w, h, rot]) => { const col = (o.colores && o.colores[n]) || '#fff'; s += '<g transform="rotate(' + rot + ' ' + (x + w / 2) + ' ' + (y + h) + ')"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (h + 30) + '" rx="' + w / 2 + '" fill="' + col + '"/></g>'; });
  s += '<path d="M60 120 C 58 104 200 104 200 122 L 198 178 C 196 206 172 214 132 214 C 92 214 66 206 62 180 Z" fill="#fff"/>';
  if (o.numeros !== false) dedos.forEach(([n, x, y, w, h, rot]) => { const a = rot * Math.PI / 180, cx = x + w / 2, cy = y + h, tx = cx + Math.sin(a) * (h - 14) * 1, ty = cy - Math.cos(a) * (h - 14); s += '<circle cx="' + r1(tx) + '" cy="' + r1(ty - 4) + '" r="11" fill="#fff" stroke-width="2.5"/><text x="' + r1(tx) + '" y="' + r1(ty + 1.5) + '" text-anchor="middle" font-family="Outfit" font-weight="700" font-size="15" fill="' + INK + '" stroke="none">' + n + '</text>'; });
  return s + '</g></svg>';
}
function logo(nombre, alto) { return '<img src="' + nombre + '.svg" style="height:' + alto + 'px;display:block">'; }
function pie(izq, der) { return '<div class="pie"><img src="logo-horizontal.svg"><span>' + izq + '</span><span class="linea"></span><span>' + der + '</span></div>'; }
function documento(titulo, paginas) {
  return '<!doctype html><html lang="es-CO"><head><meta charset="utf-8"><title>' + titulo + '</title><link rel="stylesheet" href="marca.css"></head><body>' + paginas.join('\n') + '</body></html>';
}
// HTML → PDF tamaño carta (Chrome de Playwright); y páginas sueltas a PNG para revisar
async function aPDF(html, pdf, pngs) {
  const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1100, height: 1100 } });
  pg.on('pageerror', e => console.log('ERR', e.message));
  await pg.goto('file://' + html); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300);
  await pg.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });
  await b.close();
}
module.exports = { NOTAS, NOTA_PC, F, INK, spr, teclado, estrella, estrellaPath, mano, logo, pie, documento, aPDF, AQUI };
