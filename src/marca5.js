// =====================================================================
//  M5b · EL MANUAL DE MARCA DENTRO DEL JUEGO (marca/MANUAL-DE-MARCA.pdf): «neobrutalismo amable».
//  Bordes gruesos de tinta, sombras duras desplazadas, colores planos de la paleta (los 7 de las notas + tinta, papel,
//  crema, gris), letras del manual (Outfit para la interfaz, Crimson Pro para la voz de Bach), el logo, y las FIGURAS
//  de marca/figuras.js (clave de sol, cabezas, plicas, corchetes, silencio) en todos los pentagramas y tarjetas.
//  Solo la interfaz: el mundo en píxel no cambia. Este archivo va al final: sus funciones reemplazan a las viejas.
// =====================================================================
const MARCA5 = { tinta: '#2a1a3a', tinta2: '#6b5a7d', papel: '#ffffff', crema: '#fffaf4', gris: '#e9e4ee',
  osc: { DO: '#c23345', RE: '#c8641c', MI: '#a87a0a', FA: '#2f9a4a', SOL: '#1e8bbd', LA: '#3450c4', SI: '#7f3fc8' },
  cla: { DO: '#ffe1de', RE: '#ffead6', MI: '#fff4c8', FA: '#ddf6da', SOL: '#d9f4fd', LA: '#e0e6ff', SI: '#f0e2ff' } };
const MK5 = MARCA5.tinta;
// ---------- la caja de la marca: sombra dura desplazada + relleno plano + borde de tinta ----------
function caja5(ctx, x, y, w, h, o = {}) {
  const r = o.r == null ? 18 : o.r, b = o.borde || 5, s = o.sombra == null ? 7 : o.sombra;
  ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  if (s) { rr(ctx, x + s, y + s, w, h, r); ctx.fillStyle = MK5; ctx.fill(); }
  rr(ctx, x, y, w, h, r); ctx.fillStyle = o.fondo || MARCA5.papel; ctx.fill(); ctx.lineWidth = b; ctx.strokeStyle = MK5; ctx.stroke();
  if (o.cab) { ctx.save(); rr(ctx, x, y, w, h, r); ctx.clip(); ctx.fillStyle = o.cab; ctx.fillRect(x, y, w, o.cabH || 16); ctx.fillStyle = MK5; ctx.fillRect(x, y + (o.cabH || 16), w, b * .8); ctx.restore(); rr(ctx, x, y, w, h, r); ctx.lineWidth = b; ctx.strokeStyle = MK5; ctx.stroke(); }
  ctx.restore();
}
// el subrayado de marcador del manual (un bloque plano de color detrás de la palabra)
function marcador5(ctx, t, x, y, tam, c = NC.MI, o = {}) {
  ctx.save(); ctx.font = '700 ' + tam + 'px Outfit'; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; const w = ctx.measureText(t).width, x0 = o.al === 'left' ? x : x - w / 2;
  ctx.fillStyle = c; ctx.fillRect(x0 - 6, y + tam * .08, w + 12, tam * .36); ctx.fillStyle = o.c || MK5; ctx.fillText(t, x, y); ctx.restore();
}
// la franja de los siete colores (como el teclado del logo)
function franja5(ctx, x, y, w, h) { const c = [NC.DO, NC.RE, NC.MI, NC.FA, NC.SOL, NC.LA, NC.SI]; c.forEach((col, i) => { ctx.fillStyle = col; ctx.fillRect(x + i * w / 7, y, w / 7 + .5, h); }); }
// ---------- títulos: Outfit Bold (como el manual) ----------
function titulo5(ctx, t, x, y, tam = 40, c = MK5, o = {}) { ctx.save(); ctx.font = '700 ' + Math.round(tam * .92) + 'px Outfit'; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; if (o.borde) { ctx.lineJoin = 'round'; ctx.lineWidth = o.borde; ctx.strokeStyle = o.bordeC === '#3a2414' ? MK5 : (o.bordeC || MARCA5.crema); ctx.strokeText(t, x, y); } ctx.fillStyle = c === '#3a2414' ? MK5 : c; ctx.fillText(t, x, y); ctx.restore(); }
// cinta de título del lugar → «rótulo» del manual: caja con sombra dura y un taco de color
function cinta5(ctx, t, x, y, w = 300) {
  ctx.save(); ctx.font = '700 28px Outfit'; const ww = Math.max(ctx.measureText(t).width + 62, 160); ctx.restore();
  caja5(ctx, x - 12, y - 26, ww, 52, { r: 14, borde: 4, sombra: 5 });
  ctx.save(); rr(ctx, x - 12, y - 26, ww, 52, 14); ctx.clip(); franja5(ctx, x - 12, y - 26, 14, 52); ctx.restore();
  ctx.save(); ctx.strokeStyle = MK5; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 2, y - 26); ctx.lineTo(x + 2, y + 26); ctx.stroke(); ctx.restore();
  titulo5(ctx, t, x + 14, y + 1, 30, MK5, { al: 'left' });
}
// botones redondos (pausa, ajustes, mapa, salir): blancos, borde de tinta, sombra dura
function botonRedondo5(ctx, x, y, icono, on) {
  ctx.save(); ctx.beginPath(); ctx.arc(x + 4, y + 4, 30, 0, 7); ctx.fillStyle = MK5; ctx.fill(); ctx.beginPath(); ctx.arc(x, y, 30, 0, 7); ctx.fillStyle = on ? NC.MI : MARCA5.papel; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = MK5; ctx.stroke();
  ctx.fillStyle = MK5; ctx.strokeStyle = MK5;
  if (icono === 'pausa') { rr(ctx, x - 10, y - 12, 7, 24, 2); ctx.fill(); rr(ctx, x + 3, y - 12, 7, 24, 2); ctx.fill(); }
  if (icono === 'ajustes') { ctx.lineWidth = 5; for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9); ctx.lineTo(x + Math.cos(a) * 15, y + Math.sin(a) * 15); ctx.stroke(); } ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.lineWidth = 5; ctx.stroke(); }
  if (icono === 'mapa') { ctx.lineWidth = 3.5; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x - 14, y - 10); ctx.lineTo(x - 5, y - 14); ctx.lineTo(x + 5, y - 10); ctx.lineTo(x + 14, y - 14); ctx.lineTo(x + 14, y + 10); ctx.lineTo(x + 5, y + 14); ctx.lineTo(x - 5, y + 10); ctx.lineTo(x - 14, y + 14); ctx.closePath(); ctx.fillStyle = NC.FA; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 5, y - 14); ctx.lineTo(x - 5, y + 10); ctx.moveTo(x + 5, y - 10); ctx.lineTo(x + 5, y + 14); ctx.stroke(); }
  if (icono === 'salir') { ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x + 7, y - 12); ctx.lineTo(x - 6, y); ctx.lineTo(x + 7, y + 12); ctx.stroke(); }
  ctx.restore();
}
// la tarjeta grande (antes «pergamino»): papel blanco, borde grueso, sombra dura
function pergamino5(ctx, x, y, w, h, a = 1) { caja5(ctx, x, y, w, h, { r: 22, borde: 5, sombra: 9, alpha: a, fondo: MARCA5.crema }); }
// globo de diálogo (la voz de Bach: Crimson Pro Bold), palabra por palabra
function burbuja5(ctx, x, y, w, txt, t, o = {}) {
  habla5(txt);
  const pal = txt.split(' '), act = Math.floor(t * 2.6), F = '700 32px Crimson';
  ctx.save(); ctx.font = F; const lineas = []; let l = ''; pal.forEach(p => { const n = l ? l + ' ' + p : p; if (ctx.measureText(n).width > w - 56 && l) { lineas.push(l); l = p; } else l = n; }); lineas.push(l); ctx.restore();
  const h = 40 + lineas.length * 42;
  ctx.save(); rr(ctx, x + 6, y + 6, w, h, 18); ctx.fillStyle = MK5; ctx.fill(); ctx.restore();
  ctx.save(); if (o.cola) { const [cx, cy] = o.cola; ctx.beginPath(); ctx.moveTo(cx - 14, y + h - 2); ctx.lineTo(cx + 14, y + h - 2); ctx.lineTo(cx + (o.colaDx || 20), cy); ctx.closePath(); ctx.fillStyle = MARCA5.papel; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = MK5; ctx.stroke(); }
  rr(ctx, x, y, w, h, 18); ctx.fillStyle = MARCA5.papel; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = MK5; ctx.stroke();
  ctx.font = F; ctx.textBaseline = 'middle'; let k = 0;
  lineas.forEach((ln, i) => { let px = x + 28; ln.split(' ').forEach(p => { ctx.fillStyle = k < act ? MK5 : k === act ? MARCA5.osc.DO : 'rgba(42,26,58,.2)'; ctx.fillText(p, px, y + 40 + i * 42); px += ctx.measureText(p + ' ').width; k++; }); });
  ctx.restore();
  return pal.length / 2.6;
}
// el órgano del día en chiquito y las corcheas (HUD)
function hudOrgano5(ctx, actual) {
  const d = diaHoy5(), x0 = LW5 / 2 - 80;
  caja5(ctx, x0 - 18, 14, 196, 76, { r: 14, borde: 4, sombra: 5 });
  PARADAS5.forEach((id, k) => { const hh = [40, 52, 60, 52, 40][k], x = x0 + k * 34, y = 82 - hh, hecho = d.paradas[id], act = id === actual;
    ctx.save(); rr(ctx, x, y, 22, hh, 6); ctx.fillStyle = hecho ? COLOR_PARADA5[id] : act ? MARCA5.gris : MARCA5.crema; ctx.fill(); ctx.lineWidth = act ? 4 : 2.5; ctx.strokeStyle = MK5; ctx.stroke(); ctx.fillStyle = MK5; ctx.fillRect(x + 6, y + hh - 14, 10, 4); ctx.restore();
    if (act) { ctx.save(); ctx.fillStyle = MK5; ctx.beginPath(); const ay = 10 + Math.sin(RELOJ * 6) * 2; ctx.moveTo(x + 4, y - 14 + ay - 10); ctx.lineTo(x + 18, y - 14 + ay - 10); ctx.lineTo(x + 11, y - 4 + ay - 10); ctx.fill(); ctx.restore(); } });
}
function hudCorcheas5(ctx, extra = 0) {
  const m = m2_(), n = (m ? m.corcheas : 0) + extra, x = LW5 - 300;
  caja5(ctx, x - 52, 22, 108, 52, { r: 26, borde: 4, sombra: 4 });
  sprK(ctx, corcheaDorada(), x - 24, 66, 2.3); titulo5(ctx, String(n), x + 20, 49, 32, MK5);
}
function pildora5(ctx, x, y, txt, o = {}) {
  ctx.save(); ctx.font = '700 ' + (o.tam || 26) + 'px Outfit'; const w = o.w || ctx.measureText(txt).width + 36, h = o.h || 52; ctx.restore();
  caja5(ctx, x, y, w, h, { r: o.radio == null ? 14 : o.radio, borde: 4, sombra: o.sombra == null ? 4 : o.sombra, fondo: o.fondo === '#fbf1d8' || !o.fondo ? MARCA5.papel : o.fondo });
  ctx.save(); ctx.font = '700 ' + (o.tam || 26) + 'px Outfit'; ctx.fillStyle = o.c || MK5; ctx.textBaseline = 'middle'; ctx.textAlign = o.al || 'left'; ctx.fillText(txt, o.al === 'center' ? x + w / 2 : x + 18, y + h / 2 + 1); ctx.restore(); return w;
}
// el mini-anuncio al entrar a cada parada
function dibujarAnuncio5(ctx, P) {
  const t = P.t - P.anuncio.t0, dur = P.anuncio.dur || .01, q = Math.min(1, t * 3, Math.max(0, (dur - t) * 3)), e = 1 - Math.pow(1 - Math.min(1, t * 2.5), 3);
  ctx.save(); ctx.globalAlpha = q; ctx.fillStyle = 'rgba(42,26,58,.5)'; ctx.fillRect(0, 0, LW5, LH5);
  const col = COLOR_PARADA5[P.id] || NC.MI, w = 760, x = LW5 / 2 - w / 2, y = 190 + (1 - e) * 60;
  caja5(ctx, x, y, w, 250, { r: 22, borde: 5, sombra: 10, cab: col, cabH: 22 });
  marcador5(ctx, NOMBRE_PARADA5[P.id], LW5 / 2, y + 92, 60, col);
  const linea = textoDeVoz5('anuncio-' + P.id.replace(/L$/, ''), P.id === 'teatro' ? 'Hoy: ' + (VILLANCICOS5[P.cancion] || {}).titulo + ', pedazo por pedazo.' : QUE_HACEMOS5[P.id]); habla5(linea);
  texto(ctx, linea || '', LW5 / 2, y + 164, { tam: 32, c: MK5, peso: 700 });
  if (PARADAS5.includes(P.id)) PARADAS5.forEach((id, k) => { const on = id === P.id, xx = LW5 / 2 - 100 + k * 50; ctx.beginPath(); ctx.arc(xx, y + 214, on ? 12 : 8, 0, 7); ctx.fillStyle = diaHoy5().paradas[id] || on ? COLOR_PARADA5[id] : MARCA5.gris; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = MK5; ctx.stroke(); });
  ctx.restore();
}
// el diálogo de los vecinos (palabra por palabra, la letra de Bach)
DIALOGO5.dibujar = function (ctx, dt) {
  if (!this.abierto) return; this.t += dt; habla5(this.paginas[this.p]);
  const x = 140, y = LH5 - 236, w = LW5 - 280, h = 196;
  caja5(ctx, x, y, w, h, { r: 22, borde: 5, sombra: 9 });
  let tx = x + 40;
  if (this.retrato) { ctx.save(); rr(ctx, x + 28, y + 30, 136, 136, 18); ctx.fillStyle = MARCA5.cla.MI; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = MK5; ctx.stroke(); const s = this.retrato(), a7 = retratoArte7(s, 196, this.paginas[this.p]); if (a7) { ctx.restore(); ctx.save(); rr(ctx, x - 40, y - 200, 260, 366, 18); ctx.clip(); ctx.drawImage(a7, Math.round(x + 96 - a7.width / 2), y + 164 - a7.height); } else { ctx.clip(); sprK(ctx, s, x + 96, y + 158, Math.min(4, 124 / s.height)); } ctx.restore(); tx = x + 192; }
  if (this.nombre) { ctx.save(); ctx.font = '700 22px Outfit'; const nw = ctx.measureText(this.nombre).width + 28; ctx.restore(); caja5(ctx, tx - 6, y - 20, nw, 38, { r: 10, borde: 4, sombra: 4, fondo: MK5 }); titulo5(ctx, this.nombre, tx + 8, y - 1, 24, MARCA5.papel, { al: 'left' }); }
  const pal = this.paginas[this.p].split(' '), act = Math.floor(this.t * 2.6);
  ctx.save(); ctx.font = '700 36px Crimson'; ctx.textBaseline = 'middle'; let px = tx, py = y + 70; const maxX = x + w - 40;
  pal.forEach((p, k) => { const ww = ctx.measureText(p + ' ').width; if (px + ww > maxX) { px = tx; py += 46; } ctx.fillStyle = k < act ? MK5 : k === act ? MARCA5.osc.DO : 'rgba(42,26,58,.2)'; ctx.fillText(p, px, py); if (k === act) { ctx.fillStyle = NC.MI; ctx.fillRect(px, py + 14, ctx.measureText(p).width, 6); } px += ww; });
  ctx.restore();
  if (act >= pal.length) { ctx.save(); ctx.fillStyle = MK5; const bx = x + w - 46, by = y + h - 34 + Math.sin(RELOJ * 6) * 3; ctx.beginPath(); ctx.moveTo(bx - 12, by - 7); ctx.lineTo(bx + 12, by - 7); ctx.lineTo(bx, by + 7); ctx.fill(); ctx.restore(); }
};
// =====================================================================
//  FIGURAS DE LA MARCA en el lienzo (marca/figuras.js → Path2D, en unidades de «un espacio» del pentagrama)
// =====================================================================
const FIGP5 = {};
function figPartes5(tipo) { return FIGP5[tipo] || (FIGP5[tipo] = (() => { const f = FIG.partes(tipo); return { p: f.p.map(x => new Path2D(x.d)), x0: f.x0, x1: f.x1, y0: f.y0, y1: f.y1 }; })()); }
// dibuja una figura con la cabeza en (x, y) y k px por espacio; o = { color (de la cabeza), tinta, abajo (plica hacia abajo) }
function figura5c(ctx, tipo, x, y, k, o = {}) {
  const f = figPartes5(tipo), ink = o.tinta || MK5;
  ctx.save(); ctx.translate(x, y); if (o.abajo) ctx.rotate(Math.PI); ctx.scale(k, k);
  f.p.forEach((p, i) => { if (i === 0 && o.color && tipo !== 'silencio' && tipo !== 'clave') { const hueca = tipo === 'blanca' || tipo === 'redonda';
      if (hueca) { ctx.fillStyle = MARCA5.papel; ctx.beginPath(); tipo === 'redonda' ? ctx.ellipse(0, 0, .86, .5, 0, 0, 7) : ctx.ellipse(0, 0, .65, .46, -20 * Math.PI / 180, 0, 7); ctx.fill(); }
      ctx.fillStyle = o.color; ctx.fill(p); ctx.lineWidth = .1; ctx.strokeStyle = ink; ctx.stroke(p); }
    else { ctx.fillStyle = ink; ctx.fill(p); } });
  ctx.restore();
}
// la clave de sol de la marca: en el lienzo cacheado de clave() (unidades de 10 por espacio; la línea de SOL en y = 30)
function trazoClaveSol5(g) { const f = figPartes5('clave'); g.save(); g.translate(-9, 30); g.scale(10, 10); f.p.forEach(p => g.fill(p)); g.restore(); }
function cabeza(ctx, x, y, gap, tipo, color) {
  const t = tipo === 'blanca' || tipo === 'redonda' ? tipo : 'negra', f = figPartes5(t);
  ctx.save(); ctx.translate(x, y); ctx.scale(gap, gap);
  if (t !== 'negra') { ctx.fillStyle = MARCA5.papel; ctx.beginPath(); t === 'redonda' ? ctx.ellipse(0, 0, .86, .5, 0, 0, 7) : ctx.ellipse(0, 0, .65, .46, -.35, 0, 7); ctx.fill(); }
  ctx.fillStyle = color || MK5; ctx.fill(f.p[0]); if (color) { ctx.lineWidth = .1; ctx.strokeStyle = MK5; ctx.stroke(f.p[0]); }
  ctx.restore();
}
function silencioGlifo5(ctx, x, y, s, c) { const k = s * 1.15, f = figPartes5('silencio'); ctx.save(); ctx.translate(x - .55 * k, y); ctx.scale(k, k); ctx.fillStyle = c || MK5; f.p.forEach(p => ctx.fill(p)); ctx.restore(); }
function figuraSuelta5(ctx, tipo, x, y, s = 1, c = MK5) {   // la figura grande de la Biblioteca: la de la marca
  const k = 24 * s; if (tipo === 'silencio') { silencioGlifo5(ctx, x, y - 4 * s, 26 * s, c); return; }
  const f = figPartes5(tipo === 'corcheas' ? 'corcheas' : tipo), cx = x - (f.x0 + f.x1) / 2 * k, cy = y - (f.y0 + f.y1) / 2 * k; figura5c(ctx, tipo, cx, cy, k, { tinta: c });
}
// pentagrama con las figuras de la marca (cabezas del color de su nota con borde de tinta; plica, corchete y líneas de tinta)
function pentagrama(ctx, x, y, w, gap, notas = [], o = {}) {
  const cl = o.clave || 'sol', lc = o.lineaC || MK5, lw = o.grosor || Math.max(2, gap * .11);
  ctx.save(); ctx.strokeStyle = lc; ctx.lineWidth = lw; ctx.lineCap = 'butt';
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x, y + i * gap); ctx.lineTo(x + w, y + i * gap); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(x, y - lw / 2); ctx.lineTo(x, y + 4 * gap + lw / 2); ctx.moveTo(x + w, y - lw / 2); ctx.lineTo(x + w, y + 4 * gap + lw / 2); ctx.stroke();
  (o.compases || []).forEach(bx => { ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx, y + 4 * gap); ctx.stroke(); });
  ctx.restore();
  if (o.sinClave !== true) clave(ctx, cl, x + gap * .4, y, gap, lc);
  if (o.metrica) { texto(ctx, o.metrica[0], x + gap * 5.4, y + gap, { tam: gap * 2.1, c: lc, fuente: 'Outfit', peso: 700 }); texto(ctx, o.metrica[1], x + gap * 5.4, y + gap * 3, { tam: gap * 2.1, c: lc, fuente: 'Outfit', peso: 700 }); }
  const fondo = y + 4 * gap;
  notas.forEach(nt => {
    const p = paso(nt.n, cl), ny = fondo - p * gap / 2, nx = nt.x, col = nt.c === true ? NC[solfeo(nt.n)] : nt.c;
    ctx.save(); ctx.strokeStyle = lc; ctx.lineWidth = lw * 1.5;
    for (let q = -2; q >= p - (p % 2 === 0 ? 0 : 1) && p <= -2; q -= 2) { ctx.beginPath(); ctx.moveTo(nx - gap * 1.05, fondo - q * gap / 2); ctx.lineTo(nx + gap * 1.05, fondo - q * gap / 2); ctx.stroke(); }
    for (let q = 10; q <= p && p >= 10; q += 2) { ctx.beginPath(); ctx.moveTo(nx - gap * 1.05, fondo - q * gap / 2); ctx.lineTo(nx + gap * 1.05, fondo - q * gap / 2); ctx.stroke(); }
    ctx.restore();
    if (nt.halo) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, gap * 2.6); g.addColorStop(0, nt.halo); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(nx - gap * 3, ny - gap * 3, gap * 6, gap * 6); ctx.restore(); }
    const tipo = nt.f === 'corchea' ? 'corchea' : nt.f === 'blanca' ? 'blanca' : nt.f === 'redonda' ? 'redonda' : 'negra', abajo = p >= 4 && tipo !== 'redonda';
    figura5c(ctx, abajo && tipo === 'corchea' ? 'negra' : tipo, nx, ny, gap, { color: col, abajo });
    if (nt.punto) { ctx.save(); ctx.fillStyle = MK5; ctx.beginPath(); ctx.arc(nx + gap * 1.15, ny - (p % 2 === 0 ? gap * .35 : 0), gap * .2, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    if (nt.n[1] === '#') texto(ctx, '♯', nx - gap * 1.5, ny, { tam: gap * 1.9, c: MK5, peso: 700, fuente: 'Outfit' });
  });
  return { fondo, y, gap, yDe: n => fondo - paso(n, cl) * gap / 2 };
}
// =====================================================================
//  EL LOGO (marca/logo-principal.svg) y la pantalla de título
// =====================================================================
const LOGO5 = new Image(); LOGO5.src = 'data:image/svg+xml;base64,/*@marcab64 logo-principal.svg*/';
function dibujarTitulo5(ctx, t) {
  const q = Math.min(1, t / 1.2), cx = LW5 / 2, e = 1 - Math.pow(1 - Math.min(1, t / 1.1), 3);
  ctx.save(); ctx.globalAlpha = q * .9; caja5(ctx, cx - 420, 92, 840, 520, { r: 30, borde: 6, sombra: 12, fondo: MARCA5.crema }); ctx.restore();
  ctx.save(); ctx.globalAlpha = q; rr(ctx, cx - 420, 92, 840, 520, 30); ctx.clip(); franja5(ctx, cx - 420, 92, 840, 14); ctx.restore();
  if (LOGO5.complete && LOGO5.naturalWidth) { ctx.save(); ctx.globalAlpha = e; const s = .72 + .04 * e; ctx.drawImage(LOGO5, cx - 500 * s, 120 + (1 - e) * 30, 1000 * s, 520 * s); ctx.restore(); }
  else titulo5(ctx, 'Mi Piano · El viaje de Bach', cx, 300, 64, MK5);
  const e3 = Math.max(0, Math.min(1, (t - 2.4) / 1.2));
  ctx.save(); ctx.globalAlpha = e3; ctx.font = '700 38px Crimson'; ctx.textAlign = 'center'; ctx.fillStyle = MK5; ctx.fillText('«Cada nota es un paso del camino.»', cx, 570); ctx.restore();
  for (let i = 0; i < 10; i++) { const k = (t * .25 + i / 10) % 1, x = 160 + i * 106 + Math.sin(t + i) * 14; ctx.save(); ctx.globalAlpha = Math.sin(k * Math.PI) * .8; figura5c(ctx, i % 3 ? 'negra' : 'corchea', x, 760 - k * 120, 10, { color: Object.values(NC)[i % 7] }); ctx.restore(); }
}
// el teclado de flechas y el botón ¡Toca!, con la sombra dura del manual
function dibujarMando5(ctx, L) {
  const C = CRUZ5, on = MANDO5.dir();
  ctx.save(); ctx.globalAlpha = L.auto ? .35 : 1; ctx.fillStyle = 'rgba(42,26,58,.45)'; ctx.beginPath(); ctx.arc(C.x, C.y, C.r, 0, 7); ctx.fill();
  Object.entries(DIRS5).forEach(([d, [ax, ay]]) => { const bx = C.x + ax * C.d, by = C.y + ay * C.d, pr = on === d, o = pr ? 4 : 0;
    rr(ctx, bx - C.b / 2 + 5, by - C.b / 2 + 5, C.b, C.b, 18); ctx.fillStyle = MK5; ctx.fill();
    rr(ctx, bx - C.b / 2 + o, by - C.b / 2 + o, C.b, C.b, 18); ctx.fillStyle = pr ? NC.MI : MARCA5.papel; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = MK5; ctx.stroke();
    ctx.save(); ctx.translate(bx + o, by + o); ctx.rotate(Math.atan2(ay, ax)); ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(-12, -20); ctx.lineTo(-12, 20); ctx.closePath(); ctx.fillStyle = MK5; ctx.fill(); ctx.restore(); });
  ctx.restore();
  const T = TOCA5, hay = L.frente && L.frente(), pr = RELOJ - (L.tocaT || -9) < .15, o = pr ? 5 : 0;
  ctx.save(); ctx.globalAlpha = L.auto ? .35 : 1;
  ctx.beginPath(); ctx.arc(T.x + 7, T.y + 7, T.r, 0, 7); ctx.fillStyle = MK5; ctx.fill();
  ctx.beginPath(); ctx.arc(T.x + o, T.y + o, T.r, 0, 7); ctx.fillStyle = hay ? NC.DO : '#ff9a8a'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = MK5; ctx.stroke();
  if (hay && !L.auto) { ctx.beginPath(); ctx.arc(T.x + o, T.y + o, T.r + 10 + 4 * Math.sin(RELOJ * 5), 0, 7); ctx.lineWidth = 4; ctx.strokeStyle = NC.MI; ctx.stroke(); }
  figura5c(ctx, 'corchea', T.x + o - 10, T.y + o - 8, 9, { tinta: MARCA5.papel }); ctx.font = '700 26px Outfit'; ctx.fillStyle = MARCA5.papel; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('¡Toca!', T.x + o, T.y + o + 40); ctx.restore();
}
// la barra de arriba del mundo
function hudArriba5(ctx, L) {
  const def = L.def; cinta5(ctx, def.titulo || def.nombre, 38, 50);
  if (def.subtitulo) { const s = def.subtitulo(L); if (s) pildora5(ctx, 26, 92, s, { tam: 19, h: 40, fondo: MK5, c: MARCA5.papel, sombra: 4 }); }
  const m = m2_(); if (m) { ctx.save(); ctx.font = '700 28px Outfit'; const t = String(m.corcheas), w = ctx.measureText(t).width + 78; ctx.restore(); const x = LW5 - 236 - w; caja5(ctx, x, 22, w, 52, { r: 26, borde: 4, sombra: 4 }); sprK(ctx, corcheaDorada(), x + 28, 66, 2.3); titulo5(ctx, t, x + 50, 49, 30, MK5, { al: 'left' }); }
  BOTONES5.forEach(([ic, x, y]) => { if (ic === 'mapa' && def.sinMapa) return; botonRedondo5(ctx, x, y, ic); });
}
