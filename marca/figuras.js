// =====================================================================
//  FIGURAS MUSICALES de la marca «Mi Piano · El viaje de Bach» — dibujo propio en vector (SVG), sin fuentes de terceros.
//  Unidad = 1 espacio del pentagrama (distancia entre dos líneas). Medidas al estilo de grabado (SMuFL):
//  cabeza 1,26 × 1,0 inclinada 20°, plica 0,12 de grueso y 3,5 de largo, barra de corcheas 0,5, líneas 0,11.
//  Los trazos caligráficos se generan de una línea central: grosor variable (clave de sol) o plumilla inclinada (silencio).
//  Uso: const F = require('./figuras.js');  F.figura('negra', { alto: 120 })  → '<svg …>'
// =====================================================================
(function (raiz) {
  const INK = '#2a1a3a';
  const r3 = v => Math.round(v * 1000) / 1000;
  const P2 = q => r3(q[0]) + ' ' + r3(q[1]);
  // Catmull-Rom por puntos [x, y, grosor] → muestras
  function curva(P, pasos = 26) {
    const pts = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (let s = 0; s < pasos; s++) {
        const t = s / pasos, t2 = t * t, t3 = t2 * t, f = (a, b, c, d) => .5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
        pts.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1]), p1[2] + (p2[2] - p1[2]) * (t2 * (3 - 2 * t))]);
      }
    }
    pts.push(P[P.length - 1].slice()); return pts;
  }
  // trazo de grosor variable (perpendicular a la dirección) → un contorno cerrado
  function trazo(P) {
    const pts = curva(P), L = [], R = [];
    pts.forEach((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; let dx = b[0] - a[0], dy = b[1] - a[1]; const n = Math.hypot(dx, dy) || 1; dx /= n; dy /= n; const w = p[2] / 2; L.push([p[0] - dy * w, p[1] + dx * w]); R.push([p[0] + dy * w, p[1] - dx * w]); });
    return 'M' + L.concat(R.reverse()).map(P2).join('L') + 'Z';
  }
  // plumilla de punta ancha (ángulo fijo): unión de cuadriláteros, todos con la misma orientación (relleno nonzero)
  function pluma(P, ang, ancho) {
    const pts = curva(P, 30), ux = Math.cos(ang * Math.PI / 180), uy = Math.sin(ang * Math.PI / 180); let d = '';
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], wa = ancho * a[2] / 2, wb = ancho * b[2] / 2;
      let q = [[a[0] - ux * wa, a[1] - uy * wa], [a[0] + ux * wa, a[1] + uy * wa], [b[0] + ux * wb, b[1] + uy * wb], [b[0] - ux * wb, b[1] - uy * wb]];
      const area = q.reduce((s, p, k) => { const n = q[(k + 1) % 4]; return s + p[0] * n[1] - n[0] * p[1]; }, 0); if (area < 0) q = q.reverse();
      d += 'M' + q.map(P2).join('L') + 'Z';
    }
    return d;
  }
  const elipse = (cx, cy, rx, ry, rot, inv) => {
    const a = rot * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), n = 56; let d = '';
    for (let i = 0; i <= n; i++) { const t = (inv ? -1 : 1) * i / n * Math.PI * 2, x = rx * Math.cos(t), y = ry * Math.sin(t); d += (i ? 'L' : 'M') + r3(cx + x * c - y * s) + ' ' + r3(cy + x * s + y * c); }
    return d + 'Z';
  };
  const rect = (x, y, w, h) => 'M' + r3(x) + ' ' + r3(y) + 'H' + r3(x + w) + 'V' + r3(y + h) + 'H' + r3(x) + 'Z';
  // ---------- piezas (y hacia abajo; cabezas centradas en 0,0) ----------
  const ST = .12, SX = .63 - ST, SY = -.2, LARGO = 3.5;   // plica a la derecha de la cabeza
  const PZ = {
    negra: () => elipse(0, 0, .65, .46, -20),
    blanca: () => elipse(0, 0, .65, .46, -20) + elipse(0, 0, .52, .16, -32, true),        // agujero en sentido contrario: hueco con nonzero
    redonda: () => elipse(0, 0, .86, .5, 0) + elipse(0, 0, .27, .41, 50, true),
    plica: (dx = 0) => rect(SX + dx - .002, SY - LARGO + .2, ST, LARGO - .2 + .05),
    corchete: () => { const x = SX + ST, y = SY - LARGO + .2; return 'M' + P2([x - ST, y]) + 'H' + r3(x) + 'C' + [[x + .05, y + .6], [x + .38, y + .98], [x + .66, y + 1.3], [x + 1.04, y + 1.74], [x + 1.2, y + 2.3], [x + 1.04, y + 2.95], [x + .99, y + 3.18], [x + .93, y + 3.32], [x + .86, y + 3.44], [x + .93, y + 3.15], [x + .99, y + 2.88], [x + .97, y + 2.6], [x + .93, y + 2.08], [x + .62, y + 1.74], [x + .27, y + 1.62], [x + .12, y + 1.57], [x, y + 1.56], [x - ST, y + 1.58]].map(P2).join(' ') + 'Z'; },
    // clave de sol: la línea de SOL en y = 0 (pentagrama de y = -3 a y = 1)
    clave: () => trazo([[1.24, .52, .05], [.84, .1, .14], [1.0, -.68, .18], [1.72, -.98, .15], [2.33, -.48, .38], [2.42, .32, .52], [1.92, .92, .3], [1.22, 1.06, .12], [.48, .82, .36], [.06, .05, .54],
      [.12, -.88, .54], [.6, -1.72, .54], [1.22, -2.42, .5], [1.74, -3.08, .42], [2.06, -3.66, .3], [1.92, -4.24, .16], [1.52, -4.46, .07], [1.18, -4.12, .1], [1.03, -3.5, .15], [1.02, -2.9, .17]])
      + trazo([[1.03, -3.2, .16], [1.02, -2.86, .16], [1.1, -2.0, .16], [1.33, -.8, .17], [1.6, .67, .18], [1.86, 1.7, .19], [1.9, 2.2, .17], [1.7, 2.6, .13], [1.28, 2.72, .1], [.84, 2.56, .07]])
      + elipse(.98, 2.12, .41, .41, 0),
    // silencio de negra: centro en la línea del medio (y = 0); zigzag de tres trazos + gancho en «c»
    silencio: () => 'M.17 -1.45L.5 -1.45C.62 -1.18 .84 -.92 1.04 -.7C.84 -.5 .64 -.3 .56 -.08C.68 .22 .86 .5 1.0 .8C.6 .68 .28 .42 .06 -.18C.2 -.42 .4 -.62 .52 -.78C.4 -1.0 .26 -1.24 .17 -1.45Z',
    gancho: () => 'M1.0 .8C.72 .7 .3 .72 .18 .98C.1 1.22 .36 1.42 .6 1.52C.47 1.38 .42 1.2 .5 1.07C.6 .93 .8 .87 1.0 .8Z',
    silencioBlanca: () => rect(.1, -.5, 1.1, .5),
    silencioRedonda: () => rect(.1, 0, 1.1, .5),
  };
  // figura completa: lista de caminos y su caja
  function partes(tipo) {
    const C = (d, ee) => ({ d, ee });
    if (tipo === 'negra') return { p: [C(PZ.negra()), C(PZ.plica())], x0: -.68, x1: .68, y0: -3.5, y1: .55 };
    if (tipo === 'blanca') return { p: [C(PZ.blanca()), C(PZ.plica())], x0: -.68, x1: .68, y0: -3.5, y1: .55 };
    if (tipo === 'redonda') return { p: [C(PZ.redonda())], x0: -.88, x1: .88, y0: -.55, y1: .55 };
    if (tipo === 'corchea') return { p: [C(PZ.negra()), C(PZ.plica()), C(PZ.corchete())], x0: -.68, x1: 1.85, y0: -3.5, y1: .55 };
    if (tipo === 'corcheas') { const dx = 2.3, top = SY - LARGO + .2; return { p: [C(PZ.negra()), C(elipse(dx, 0, .65, .46, -20)), C(PZ.plica()), C(PZ.plica(dx)), C(rect(SX, top, dx + ST, .5))], x0: -.68, x1: dx + .68, y0: -3.5, y1: .55 }; }
    if (tipo === 'silencio') return { p: [C(PZ.silencio()), C(PZ.gancho())], x0: .05, x1: 1.0, y0: -1.6, y1: 1.4 };
    if (tipo === 'silencioBlanca') return { p: [C(PZ.silencioBlanca()), C(rect(-.15, -.055, 1.6, .11))], x0: -.2, x1: 1.5, y0: -.7, y1: .2 };
    if (tipo === 'silencioRedonda') return { p: [C(PZ.silencioRedonda()), C(rect(-.15, -.055, 1.6, .11))], x0: -.2, x1: 1.5, y0: -.2, y1: .7 };
    if (tipo === 'clave') return { p: [C(PZ.clave())], x0: -.05, x1: 2.7, y0: -4.5, y1: 2.65 };
    throw new Error('figura desconocida ' + tipo);
  }
  const pinta = (f, attrs) => f.p.map(x => '<path d="' + x.d + '" ' + attrs + '/>').join('');
  // una figura como <svg>: o = { alto (px), color, contorno (solo borde, para colorear), relleno, grosor }
  function figura(tipo, o = {}) {
    const f = partes(tipo), pad = o.pad == null ? .2 : o.pad, c = o.color || INK;
    const x0 = f.x0 - pad, y0 = f.y0 - pad, w = f.x1 - f.x0 + pad * 2, h = f.y1 - f.y0 + pad * 2, alto = o.alto || 100;
    let cuerpo;
    if (o.contorno) {   // para colorear: el borde de tinta y el relleno blanco (o el que digan); las líneas finas se rellenan de tinta
      const g = o.grosor || .1;
      cuerpo = '<g stroke="' + c + '" stroke-width="' + g * 2 + '" stroke-linejoin="round" fill="' + c + '">' + pinta(f, '') + '</g><g fill="' + (o.relleno || '#fff') + '">' + f.p.filter(x => !/^M[-\d. ]+H/.test(x.d) || tipo.startsWith('silencio')).map(x => '<path d="' + x.d + '"/>').join('') + '</g>';
    } else cuerpo = '<g fill="' + c + '">' + pinta(f, '') + '</g>';
    return '<svg class="fig" xmlns="http://www.w3.org/2000/svg" viewBox="' + [x0, y0, w, h].map(r3).join(' ') + '" width="' + r3(alto * w / h) + '" height="' + r3(alto) + '">' + cuerpo + '</svg>';
  }
  // el grupo suelto (para componer en otro SVG): en (x, y), k px por espacio
  // nota con la cabeza de color (borde de tinta) y plica, corchete y barra de tinta
  function caminoNota(tipo, x, y, k, c, g) { const f = partes(tipo); return '<g transform="translate(' + r3(x) + ' ' + r3(y) + ') scale(' + r3(k) + ')"><path d="' + f.p[0].d + '" fill="' + c + '" stroke="' + INK + '" stroke-width="' + g + '"/>' + f.p.slice(1).map(q => '<path d="' + q.d + '" fill="' + INK + '"/>').join('') + '</g>'; }
  function camino(tipo, x, y, k, attrs = '') { return '<g transform="translate(' + r3(x) + ' ' + r3(y) + ') scale(' + r3(k) + ')" ' + attrs + '>' + pinta(partes(tipo), '') + '</g>'; }
  // ---------- pentagrama con clave y notas ----------
  // notas: [{ n: 'DO'…'SI' (DO4–SI4), f: 'negra'|'blanca'|'redonda'|'corchea'|'silencio', c: color, nombre }]
  const PASO = { DO: -2, RE: -1, MI: 0, FA: 1, SOL: 2, LA: 3, SI: 4 };   // pasos desde la 1.ª línea (MI4)
  function pentagrama(notas, o = {}) {
    const k = o.k || 14, ancho = o.ancho || 520, ink = o.tinta || INK, lw = r3(.11 * k), top = (o.arriba != null ? o.arriba : 2.4) * k, H = top + 4 * k + (o.abajo != null ? o.abajo : 2.8) * k;
    let s = '<svg class="penta" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + ancho + ' ' + r3(H) + '" width="' + ancho + '" height="' + r3(H) + '">';
    for (let i = 0; i < 5; i++) s += '<path d="M0 ' + r3(top + i * k) + 'H' + ancho + '" stroke="' + ink + '" stroke-width="' + lw + '"/>';
    s += '<path d="M' + r3(lw / 2) + ' ' + r3(top - lw / 2) + 'V' + r3(top + 4 * k + lw / 2) + '" stroke="' + ink + '" stroke-width="' + lw + '"/>';
    s += o.fin ? '<path d="M' + r3(ancho - .7 * k) + ' ' + r3(top) + 'V' + r3(top + 4 * k) + '" stroke="' + ink + '" stroke-width="' + lw + '"/><path d="M' + r3(ancho - .22 * k) + ' ' + r3(top - lw / 2) + 'V' + r3(top + 4 * k + lw / 2) + '" stroke="' + ink + '" stroke-width="' + r3(.45 * k) + '"/>'
      : '<path d="M' + r3(ancho - lw / 2) + ' ' + r3(top - lw / 2) + 'V' + r3(top + 4 * k + lw / 2) + '" stroke="' + ink + '" stroke-width="' + lw + '"/>';
    if (o.clave !== false) s += camino('clave', .45 * k, top + 3 * k, k, 'fill="' + ink + '"');
    const x0 = (o.clave !== false ? 3.8 : 1.2) * k, paso = (ancho - x0 - (o.fin ? 1.6 : 1) * k) / Math.max(1, notas.length);
    (o.barras || []).forEach(i => { const x = x0 + paso * i; s += '<path d="M' + r3(x) + ' ' + r3(top) + 'V' + r3(top + 4 * k) + '" stroke="' + ink + '" stroke-width="' + lw + '"/>'; });
    notas.forEach((nt, i) => {
      const x = x0 + paso * (i + .5), c = nt.c || ink, tipo = nt.f || 'negra', borde = 'stroke="' + ink + '" stroke-width="' + r3(o.borde != null ? o.borde : .06) + '"';
      if (tipo === 'silencio') { s += camino('silencio', x - .5 * k, top + 2 * k, k, 'fill="' + ink + '"'); if (nt.nombre) s += '<text x="' + r3(x) + '" y="' + r3(H - .35 * k) + '" text-anchor="middle" class="sil" font-size="' + r3(1.05 * k) + '" fill="' + ink + '">' + nt.nombre + '</text>'; return; }
      const p = PASO[nt.n], y = top + 4 * k - p * k / 2;
      if (p <= -2) for (let q = -2; q >= p; q -= 2) s += '<path d="M' + r3(x - 1.05 * k) + ' ' + r3(top + 4 * k - q * k / 2) + 'H' + r3(x + 1.05 * k) + '" stroke="' + ink + '" stroke-width="' + r3(lw * 1.5) + '"/>';
      const g = r3(o.borde != null ? o.borde : .06);
      if (p >= 4 && tipo !== 'redonda') s += '<g transform="rotate(180 ' + r3(x) + ' ' + r3(y) + ')">' + caminoNota(tipo === 'corchea' ? 'negra' : tipo, x, y, k, c, g) + '</g>';
      else s += caminoNota(tipo, x, y, k, c, g);
      if (nt.nombre) s += '<text x="' + r3(x) + '" y="' + r3(H - .35 * k) + '" text-anchor="middle" class="nom" font-size="' + r3(1.15 * k) + '" fill="' + ink + '">' + nt.nombre + '</text>';
    });
    return s + '</svg>';
  }
  const API = { figura, camino, pentagrama, trazo, pluma, partes, INK };
  if (typeof module !== 'undefined') module.exports = API; else raiz.FIG = API;
})(typeof window !== 'undefined' ? window : globalThis);
