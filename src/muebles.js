// muebles y utilidades de píxel (de los bocetos de la charla 4 y 5)
function sprClavecin(o = {}) { return cache('clav' + (o.lado || ''), () => sprite(56, 30, g => {
  const M = '#7a3a2a', M2 = '#5a2418', M3 = '#a85a3a', O = '#e6a21b';
  g.R(4, 22, 3, 8, M2); g.R(48, 22, 3, 8, M2); g.R(26, 22, 3, 8, M2);
  // caja con curva (ala) y tapa abierta
  for (let x = 0; x < 56; x++) { const t = x / 55, hh = Math.round(10 + 6 * Math.cos(t * Math.PI / 2)); g.R(x, 22 - hh, 1, hh, x < 2 ? M3 : M); }
  g.R(0, 12, 56, 2, O); g.R(0, 21, 56, 2, M2);
  for (let k = 0; k < 15; k++) { g.R(2 + k * 2, 14, 1, 4, '#fffaf2'); } for (let k = 0; k < 15; k++) if ([0, 1, 3, 4, 5].includes(k % 7)) g.R(3 + k * 2, 14, 1, 2, INK);
  // tapa abierta pintada (paisaje)
  for (let y = 0; y < 11; y++) g.R(18 + y, 1 + y, 36 - y * 2, 1, y < 2 ? O : y < 8 ? '#9fd8ff' : '#7fc96a'); g.R(18, 0, 36, 1, O); g.R(30, 2, 1, 10, M2);
  g.px(24, 4, '#fffaf4'); g.px(25, 4, '#fffaf4'); g.px(40, 3, '#fffaf4');
}, { ax: 28, ay: 30 })); }
function sprOrgano() { return cache('organo', () => sprite(64, 70, g => {
  const M = '#8a4a2a', M2 = '#6a3418', O = '#e6a21b', O2 = '#ffd046', P = '#d6dbe6', P2 = '#9aa3b8';
  g.R(4, 40, 56, 30, M); g.R(4, 40, 56, 2, O); g.R(10, 48, 44, 3, '#fffaf2'); for (let k = 0; k < 22; k++) if ([0, 1, 3, 4, 5].includes(k % 7)) g.R(10 + k * 2, 48, 1, 2, INK); g.R(8, 52, 48, 2, M2);
  for (let k = 0; k < 12; k++) { const h = 12 + Math.round(22 * Math.sin((k + .5) / 12 * Math.PI)), x = 6 + k * 4.4; g.R(Math.round(x), 40 - h, 3, h, P); g.R(Math.round(x), 40 - h, 1, h, '#fff'); g.R(Math.round(x) + 2, 40 - h, 1, h, P2); g.R(Math.round(x), 40 - 8, 3, 2, INK); }
  g.R(0, 2, 64, 4, O); g.R(28, 0, 8, 4, O2); g.R(2, 6, 4, 34, M); g.R(58, 6, 4, 34, M);
}, { ax: 32, ay: 70 })); }
function sprEstante() { return cache('estante', () => sprite(30, 40, g => { g.R(0, 0, 30, 40, '#7a4a2a'); g.R(2, 2, 26, 36, '#5a3418'); const C = [NC.DO, NC.LA, NC.FA, NC.MI, '#a85a3a', NC.SI, '#e8d6b0']; for (let f = 0; f < 4; f++) { g.R(2, 10 + f * 9, 26, 1, '#9a6038'); for (let k = 0; k < 8; k++) { const h = 6 + (k * 3 + f) % 3; g.R(3 + k * 3, 10 + f * 9 - h, 2, h, C[(k + f * 2) % C.length]); } } }, { ax: 15, ay: 40 })); }
function sprAtril() { return cache('atril', () => sprite(14, 22, g => { g.R(6, 8, 2, 14, '#7a4a2a'); g.R(3, 20, 8, 2, '#7a4a2a'); g.R(0, 0, 14, 10, '#fff1d6'); for (let y = 2; y < 9; y += 2) g.R(1, y, 12, 1, '#8a7a9b'); g.px(3, 3, INK); g.px(6, 5, INK); g.px(9, 4, INK); g.R(0, 9, 14, 1, '#c98a52'); }, { ax: 7, ay: 22 })); }
function sprCandelabro() { return cache('cand', () => sprite(12, 16, g => { g.R(5, 6, 2, 10, '#e6a21b'); g.R(1, 6, 10, 1, '#e6a21b'); [1, 5, 10].forEach(x => { g.R(x, 2, 1, 4, '#fffaf2'); g.px(x, 0, '#ffd046'); g.px(x, 1, '#ff9a3c'); }); g.R(3, 15, 6, 1, '#b87a10'); }, { ax: 6, ay: 16 })); }
function sprRelojPie() { return cache('relojp', () => sprite(12, 34, g => { g.R(1, 0, 10, 34, '#7a4a2a'); g.R(0, 0, 12, 3, '#9a6038'); g.disc(6, 7, 4, '#fffaf2'); g.R(6, 4, 1, 3, INK); g.R(6, 7, 3, 1, INK); g.R(4, 13, 4, 14, '#3a2418'); g.R(5, 22, 2, 3, '#ffd046'); g.R(6, 14, 1, 8, '#ffd046'); }, { ax: 6, ay: 34 })); }
function sprVentanal() { return cache('ventanal', () => sprite(24, 34, g => { g.R(0, 4, 24, 30, '#e8d6b0'); g.R(2, 6, 20, 26, '#9fd8ff'); for (let y = 0; y < 4; y++) g.R(2 + y, 6 + y * 0, 20 - y * 2, 1, '#9fd8ff'); g.R(11, 6, 2, 26, '#e8d6b0'); g.R(2, 18, 20, 2, '#e8d6b0'); g.R(3, 7, 3, 8, '#e0f6ff'); for (let y = 0; y < 5; y++) g.R(y * 2, 4 - y, 24 - y * 4, 1, '#e8d6b0'); g.R(0, 33, 24, 1, '#c9a372'); }, { ax: 12, ay: 34 })); }
function sprAlfombra(w, h) { return sprite(w, h, g => { g.R(0, 0, w, h, '#a3243a'); g.R(2, 2, w - 4, h - 4, '#c8324a'); g.R(4, 4, w - 8, h - 8, '#a3243a'); g.R(6, 6, w - 12, h - 12, '#d8a04a'); g.R(8, 8, w - 16, h - 16, '#c8324a'); for (let x = 10; x < w - 10; x += 6) for (let y = 10; y < h - 10; y += 6) g.px(x, y, '#ffd046'); }, { contorno: false, ax: 0, ay: 0 }); }
function sprCuadro(c = '#9fd8ff') { return cache('cuad' + c, () => sprite(14, 12, g => { g.R(0, 0, 14, 12, '#e6a21b'); g.R(2, 2, 10, 8, c); g.R(2, 7, 10, 3, '#7fc96a'); g.disc(9, 4, 1, '#fff3b0'); }, { ax: 7, ay: 12 })); }
function sprChimenea() { return cache('chim', () => sprite(36, 32, g => { g.R(0, 0, 36, 4, '#e8d6b0'); g.R(2, 4, 32, 28, '#c9bcab'); g.R(8, 10, 20, 22, '#3a2418'); g.R(10, 22, 16, 10, '#2a1a3a'); [[12, 24], [16, 20], [20, 23], [24, 25]].forEach(([x, y]) => { g.R(x, y, 3, 32 - y, '#ff9a3c'); g.R(x + 1, y + 2, 1, 30 - y - 2, '#ffd046'); }); g.R(10, 29, 16, 3, '#6e4426'); }, { ax: 18, ay: 32 })); }

function tapiz(g, x0, y0, w, h, A = '#f3d9b0', B = '#e8c896') { g.R(x0, y0, w, h, A); for (let x = x0 + 3; x < x0 + w; x += 8) for (let y = y0 + 3; y < y0 + h; y += 8) { g.px(x, y, B); g.px(x + 1, y + 1, B); g.px(x - 1, y + 1, B); g.px(x, y + 2, B); } g.R(x0, y0 + h - 4, w, 4, '#9a6038'); g.R(x0, y0 + h - 4, w, 1, '#c98a52'); }
function tablas(g, x0, y0, w, h, A = '#c98a52', B = '#a86e3e') { g.R(x0, y0, w, h, A); for (let y = y0; y < y0 + h; y += 5) { g.R(x0, y, w, 1, B); for (let x = x0 + ((y - y0) / 5 % 2) * 12; x < x0 + w; x += 24) g.R(x, y, 1, 5, B); } }

function sprMarimba() { return cache('marimba', () => sprite(50, 22, g => { for (let k = 0; k < 10; k++) { const h = 14 - k; g.R(2 + k * 4.6, 2 + (14 - h) / 2, 4, h, k % 2 ? '#c98a52' : '#a86e3e'); g.R(2 + k * 4.6, 2 + (14 - h) / 2, 4, 1, '#e8b47c'); } g.R(0, 16, 50, 2, '#5a3418'); g.R(3, 18, 2, 4, '#5a3418'); g.R(45, 18, 2, 4, '#5a3418'); for (let k = 0; k < 10; k++) g.R(3 + k * 4.6, 18, 2, 3, '#e6a21b'); }, { ax: 25, ay: 22 })); }
function sprAlbum() { return cache('album', () => sprite(26, 18, g => { g.R(0, 2, 26, 16, '#7a1f3d'); g.R(1, 1, 12, 16, '#fff1d6'); g.R(13, 1, 12, 16, '#fff1d6'); g.R(12, 1, 2, 16, '#c9a372'); g.R(3, 4, 8, 6, '#9fd8ff'); g.R(3, 8, 8, 2, '#7fc96a'); g.R(15, 4, 8, 6, '#ffd9a8'); g.disc(19, 7, 2, '#ff5a5a'); for (let y = 12; y < 16; y += 2) { g.R(3, y, 8, 1, '#c9a372'); g.R(15, y, 8, 1, '#c9a372'); } }, { ax: 13, ay: 18 })); }
function sprTrofeos() { return cache('trofeos', () => sprite(40, 30, g => { g.R(0, 26, 40, 4, '#7a4a2a'); g.R(0, 12, 40, 2, '#7a4a2a'); [[4, NC.MI], [14, '#e2d8ca'], [26, '#e8a060']].forEach(([x, c]) => { g.R(x, 4, 8, 6, c); g.R(x + 3, 10, 2, 2, c); g.R(x + 1, 0, 6, 4, c); }); [[4, NC.DO], [12, NC.FA], [20, NC.SOL], [28, NC.SI]].forEach(([x, c]) => { g.disc(x + 3, 20, 3, c); g.R(x + 2, 15, 2, 3, '#3a2a4a'); }); }, { ax: 20, ay: 30 })); }
