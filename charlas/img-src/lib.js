// =====================================================================
//  Ilustraciones «El mundo y las pantallas» · núcleo: lienzos, capas, posproceso HD-2D, UI vectorial (teclado, pentagrama)
//  Se carga después de los módulos de píxel de Mi Piano (f4/src: pixel, heroes, sprites, arte*).
// =====================================================================
const W = 1280, H = 720;
const NC = { DO: '#ff5a5a', RE: '#ff9a3c', MI: '#ffd046', FA: '#5fd36a', SOL: '#3fc7f0', LA: '#5a7dff', SI: '#b86bff' };
const LETRAS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'], SOLF = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'];
const INK = '#2a1a3a';
// azar con semilla (todo reproducible)
function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function copia(c) { const d = canvas(c.width, c.height); d.getContext('2d').drawImage(c, 0, 0); return d; }
// lienzo de píxel: fn(g, ctx, w, h) → canvas
function pix(w, h, fn) { const c = canvas(w, h), x = c.getContext('2d'); x.imageSmoothingEnabled = false; fn(Pen(x), x, w, h); return c; }
function subir(ctx, c, k = 3, ox = 0, oy = 0) { ctx.imageSmoothingEnabled = false; ctx.drawImage(c, ox, oy, c.width * k, c.height * k); ctx.imageSmoothingEnabled = true; }
function spr(g, s, x, y, o = {}) { const c = g.ctx; c.save(); c.imageSmoothingEnabled = false; const ax = s.ax != null ? s.ax : s.width / 2, ay = s.ay != null ? s.ay : s.height; if (o.flip) { c.translate(Math.round(x), 0); c.scale(-1, 1); c.drawImage(s, Math.round(-ax), Math.round(y - ay)); } else c.drawImage(s, Math.round(x - ax), Math.round(y - ay)); c.restore(); }
function sprK(ctx, s, x, y, k, o = {}) { ctx.save(); ctx.imageSmoothingEnabled = false; const ax = s.ax != null ? s.ax : s.width / 2, ay = s.ay != null ? s.ay : s.height; if (o.alpha != null) ctx.globalAlpha = o.alpha; if (o.flip) { ctx.translate(x, y); ctx.scale(-k, k); ctx.drawImage(s, -ax, -ay); } else ctx.drawImage(s, x - ax * k, y - ay * k, s.width * k, s.height * k); ctx.restore(); }

// ---------------- posproceso HD-2D ----------------
// o: { tilt:[arriba, abajo] (0..1 de alto), blur, bloom, calido, luces:[{x,y,r,c,a}], rayos:[{x,y,ang,ancho,largo,c,a}], polvo:n, vin }
function postHD(ctx, o = {}) {
  const src = copia(ctx.canvas), R = rng(o.semilla || 7);
  // 0 · contraste y saturación de base
  if (o.base) { const c0 = copia(ctx.canvas); ctx.save(); ctx.filter = o.base; ctx.drawImage(c0, 0, 0); ctx.restore(); }
  // 1 · gradación: cálido arriba, frío abajo (suave)
  if (o.calido !== false) {
    ctx.save(); ctx.globalCompositeOperation = 'soft-light';
    const gr = ctx.createLinearGradient(0, 0, W * .4, H); gr.addColorStop(0, 'rgba(255,170,90,' + (o.calidoA || .45) + ')'); gr.addColorStop(.55, 'rgba(255,220,170,.08)'); gr.addColorStop(1, 'rgba(60,50,140,' + (o.frioA || .5) + ')');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  // 1b · atardecer: todo baja a lila (multiply) y las luces lo vuelven a encender
  if (o.atardecer) {
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; const gr = ctx.createLinearGradient(0, 0, W * .3, H);
    gr.addColorStop(0, o.atardecer[0] || '#e8c8b0'); gr.addColorStop(.5, o.atardecer[1] || '#b8a0c8'); gr.addColorStop(1, o.atardecer[2] || '#6f5c9c'); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  // 2 · rayos de luz
  (o.rayos || []).forEach(r => {
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.translate(r.x, r.y); ctx.rotate(r.ang);
    const gr = ctx.createLinearGradient(0, 0, 0, r.largo); gr.addColorStop(0, r.c || 'rgba(255,225,160,.32)'); gr.addColorStop(1, 'rgba(255,225,160,0)');
    ctx.fillStyle = gr; ctx.filter = 'blur(10px)'; ctx.beginPath(); ctx.moveTo(-r.ancho * .3, 0); ctx.lineTo(r.ancho * .3, 0); ctx.lineTo(r.ancho, r.largo); ctx.lineTo(-r.ancho, r.largo); ctx.fill(); ctx.restore();
  });
  // 3 · charcos de luz (ventanas, faroles, el sol en la plaza)
  (o.luces || []).forEach(l => {
    ctx.save(); ctx.globalCompositeOperation = l.modo || 'screen';
    const gr = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r); gr.addColorStop(0, l.c || 'rgba(255,200,110,.55)'); gr.addColorStop(1, 'rgba(255,200,110,0)');
    ctx.fillStyle = gr; ctx.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2); ctx.restore();
  });
  // 4 · bloom
  if (o.bloom !== 0) {
    const b = canvas(W / 2, H / 2), bx = b.getContext('2d'); bx.filter = o.bloomF || 'blur(9px) brightness(1.15) saturate(1.35) contrast(1.25)'; bx.drawImage(ctx.canvas, 0, 0, W / 2, H / 2);
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = o.bloom || .28; ctx.drawImage(b, 0, 0, W, H); ctx.restore();
  }
  // 5 · tilt-shift (desenfoque arriba y abajo)
  if (o.tilt) {
    const [ta, tb] = o.tilt, bl = canvas(W, H), bx = bl.getContext('2d');
    bx.filter = 'blur(' + (o.blur || 4) + 'px)'; bx.drawImage(ctx.canvas, 0, 0); bx.filter = 'none';
    bx.globalCompositeOperation = 'destination-in'; const m = bx.createLinearGradient(0, 0, 0, H);
    m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(Math.max(0.001, ta * .45), 'rgba(0,0,0,.85)'); m.addColorStop(ta, 'rgba(0,0,0,0)'); m.addColorStop(1 - tb, 'rgba(0,0,0,0)'); m.addColorStop(1 - tb * .45, 'rgba(0,0,0,.85)'); m.addColorStop(1, 'rgba(0,0,0,1)');
    bx.fillStyle = m; bx.fillRect(0, 0, W, H); ctx.drawImage(bl, 0, 0);
  }
  // 6 · polvo de luz / luciérnagas
  for (let i = 0; i < (o.polvo || 0); i++) {
    const x = R() * W, y = (o.polvoY || [0, H])[0] + R() * ((o.polvoY || [0, H])[1] - (o.polvoY || [0, H])[0]), r = 1.5 + R() * 3.5;
    ctx.save(); ctx.globalCompositeOperation = 'screen'; const gr = ctx.createRadialGradient(x, y, 0, x, y, r * 4); gr.addColorStop(0, o.polvoC || 'rgba(255,240,190,.9)'); gr.addColorStop(.25, 'rgba(255,220,150,.35)'); gr.addColorStop(1, 'rgba(255,220,150,0)');
    ctx.fillStyle = gr; ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8); ctx.restore();
  }
  // 7 · viñeta
  if (o.vin !== 0) { const gr = ctx.createRadialGradient(W / 2, H * .52, H * .35, W / 2, H / 2, H * .95); gr.addColorStop(0, 'rgba(20,10,40,0)'); gr.addColorStop(1, 'rgba(20,10,40,' + (o.vin || .5) + ')'); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); }
}
// sombras suaves (vector, en alta) bajo objetos: lista [{x,y,rx,ry,a}] en coordenadas de alta resolución
function sombras(ctx, L, blur = 6) { ctx.save(); ctx.filter = 'blur(' + blur + 'px)'; L.forEach(s => { ctx.fillStyle = 'rgba(30,15,45,' + (s.a || .35) + ')'; if (s.poly) { ctx.beginPath(); s.poly.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.fill(); } else { ctx.beginPath(); ctx.ellipse(s.x, s.y, s.rx, s.ry, 0, 0, Math.PI * 2); ctx.fill(); } }); ctx.restore(); }

// ---------------- UI vectorial ----------------
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function panel(ctx, x, y, w, h, o = {}) {
  ctx.save(); ctx.shadowColor = 'rgba(15,5,30,.45)'; ctx.shadowBlur = o.sombra == null ? 18 : o.sombra; ctx.shadowOffsetY = 6;
  rr(ctx, x, y, w, h, o.r || 18); ctx.fillStyle = o.fondo || 'rgba(38,23,63,.92)'; ctx.fill(); ctx.restore();
  ctx.save(); rr(ctx, x, y, w, h, o.r || 18); ctx.lineWidth = o.lw || 4; ctx.strokeStyle = o.borde || INK; ctx.stroke();
  if (o.brillo !== false) { rr(ctx, x + 5, y + 5, w - 10, h - 10, Math.max(2, (o.r || 18) - 5)); ctx.lineWidth = 2; ctx.strokeStyle = o.brilloC || 'rgba(255,255,255,.14)'; ctx.stroke(); }
  ctx.restore();
}
function texto(ctx, t, x, y, o = {}) {
  ctx.save(); ctx.font = (o.peso || 700) + ' ' + (o.tam || 28) + 'px ' + (o.fuente || 'Outfit'); ctx.textAlign = o.al || 'center'; ctx.textBaseline = o.base || 'middle';
  if (o.borde) { ctx.lineJoin = 'round'; ctx.lineWidth = o.borde; ctx.strokeStyle = o.bordeC || INK; ctx.strokeText(t, x, y); }
  ctx.fillStyle = o.c || '#fff8ec'; ctx.fillText(t, x, y); ctx.restore();
}
// rótulo A/B/C (pequeño, para comparar opciones)
function rotulo(ctx, letra, x, y, o = {}) {
  const r = o.r || 24; ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = o.c || '#ffd046'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  texto(ctx, letra, x, y + 2, { tam: r * 1.25, c: INK, fuente: 'Outfit' });
  if (o.estrella) { texto(ctx, '★', x + r * .95, y - r * .85, { tam: r * .9, c: '#fff3b0', borde: 4 }); }
}
// ---- teclado de piano (vector) con negras bien puestas ----
// o: { blancas: n (desde DO), octava inicial (para nombrar), luces:{indiceSemitono: color}, colores:true (franjitas de nota), sombra }
const NEGRA_DE = [0, 1, 3, 4, 5]; // blanca a cuya derecha hay negra (DO, RE, FA, SOL, LA)
const NEG_OFF = { 0: -.12, 1: .12, 3: -.14, 4: 0, 5: .14 };
function teclado(ctx, x, y, w, h, o = {}) {
  const nb = o.blancas || 14, bw = w / nb, bh = h, kw = bw * .6, kh = h * .62, luces = o.luces || {};
  ctx.save();
  // cuerpo
  ctx.shadowColor = 'rgba(10,4,25,.5)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
  rr(ctx, x - 14, y - 26, w + 28, h + 40, 14); ctx.fillStyle = o.cuerpo || '#33204d'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = o.fieltro || '#c8324a'; ctx.fillRect(x - 2, y - 8, w + 4, 8);
  ctx.fillStyle = 'rgba(255,208,70,.8)'; ctx.fillRect(x - 6, y - 18, w + 12, 2);
  const semi = [0, 2, 4, 5, 7, 9, 11];
  for (let i = 0; i < nb; i++) {
    const kx = x + i * bw, letra = i % 7, st = Math.floor(i / 7) * 12 + semi[letra], l = luces[st];
    const gr = ctx.createLinearGradient(0, y, 0, y + bh); gr.addColorStop(0, l ? l : '#fffaf2'); gr.addColorStop(.85, l ? l : '#f3eadc'); gr.addColorStop(1, l ? l : '#d9ccb8');
    rr(ctx, kx + 1.5, y, bw - 3, bh, 6); ctx.fillStyle = gr; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke();
    if (l) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g2 = ctx.createRadialGradient(kx + bw / 2, y + bh * .7, 0, kx + bw / 2, y + bh * .7, bw * 1.4); g2.addColorStop(0, 'rgba(255,255,255,.7)'); g2.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g2; ctx.fillRect(kx - bw, y, bw * 3, bh); ctx.restore(); }
    if (o.colores !== false && !l) { ctx.fillStyle = NC[SOLF[letra]]; rr(ctx, kx + bw * .25, y + bh - 16, bw * .5, 6, 3); ctx.fill(); }
    if (o.nombres) texto(ctx, SOLF[letra], kx + bw / 2, y + bh - 34, { tam: Math.min(20, bw * .38), c: l ? INK : '#8a7a9b', peso: 700 });
    if (o.marcaDo && letra === 0) { ctx.fillStyle = 'rgba(255,90,90,.25)'; ctx.fillRect(kx + 3, y + 2, bw - 6, 5); }
  }
  for (let i = 0; i < nb - 1; i++) {
    const letra = i % 7; if (!NEGRA_DE.includes(letra)) continue;
    const st = Math.floor(i / 7) * 12 + semi[letra] + 1, l = luces[st];
    const cx = x + (i + 1) * bw + NEG_OFF[letra] * kw;
    const gr = ctx.createLinearGradient(0, y, 0, y + kh); gr.addColorStop(0, l || '#4a3566'); gr.addColorStop(1, l || '#241634');
    rr(ctx, cx - kw / 2, y - 2, kw, kh, 5); ctx.fillStyle = gr; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(cx - kw / 2 + 5, y + 4, 3, kh * .7);
  }
  ctx.restore();
  return { bw, cx: st => { const oct = Math.floor(st / 12), s = st % 12, wi = semi.indexOf(s); if (wi >= 0) return x + (oct * 7 + wi + .5) * bw; const L = semi.indexOf(s - 1); return x + (oct * 7 + L + 1) * bw + NEG_OFF[L] * kw; } };
}
// ---- pentagrama ----
// nota: 'C4' … ; paso respecto de la línea de abajo (sol: E4, fa: G2)
function paso(n, clave = 'sol') { const L = LETRAS.indexOf(n[0]), oc = +n.slice(-1); const ref = clave === 'sol' ? 4 * 7 + 2 : 2 * 7 + 4; return oc * 7 + L - ref; }
function solfeo(n) { return SOLF[LETRAS.indexOf(n[0])]; }
function clave(ctx, tipo, x, yTop, gap, c = INK) {
  ctx.save(); ctx.fillStyle = c; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  const ch = tipo === 'sol' ? '\u{1D11E}' : '\u{1D122}', S = 100; ctx.font = S + 'px FreeSerif';
  const m = ctx.measureText(ch), alto = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  const quiero = tipo === 'sol' ? gap * 7.4 : gap * 3.3, k = quiero / alto, top = tipo === 'sol' ? yTop - gap * 1.65 : yTop - gap * .05;
  ctx.font = (S * k) + 'px FreeSerif'; ctx.fillText(ch, x, top + m.actualBoundingBoxAscent * k); ctx.restore();
}
function cabeza(ctx, x, y, gap, tipo, color) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.35); ctx.beginPath(); ctx.ellipse(0, 0, gap * .68, gap * .47, 0, 0, Math.PI * 2);
  if (tipo === 'blanca' || tipo === 'redonda') { ctx.fillStyle = color ? color : '#fffaf2'; ctx.fill(); ctx.lineWidth = gap * .2; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, gap * .42, gap * .2, 0, 0, Math.PI * 2); ctx.fillStyle = '#fffaf2'; ctx.fill(); }
  else { ctx.fillStyle = color || INK; ctx.fill(); ctx.lineWidth = gap * .14; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.restore();
}
// notas: [{n:'E4', f:'negra'|'blanca'|'redonda'|'corchea', c: color o true (color de su nota), x}] ; o:{clave, lineaC, grosor, compases:[x]}
function pentagrama(ctx, x, y, w, gap, notas = [], o = {}) {
  const cl = o.clave || 'sol', lc = o.lineaC || INK, lw = o.grosor || Math.max(2, gap * .12);
  ctx.save(); ctx.strokeStyle = lc; ctx.lineWidth = lw; ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x, y + i * gap); ctx.lineTo(x + w, y + i * gap); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 4 * gap); ctx.moveTo(x + w, y); ctx.lineTo(x + w, y + 4 * gap); ctx.stroke();
  (o.compases || []).forEach(bx => { ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx, y + 4 * gap); ctx.stroke(); });
  ctx.restore();
  if (o.sinClave !== true) clave(ctx, cl, x + gap * .4, y, gap, lc);
  if (o.metrica) { texto(ctx, o.metrica[0], x + gap * 5.4, y + gap, { tam: gap * 2.1, c: lc, fuente: 'FreeSerif', peso: 700 }); texto(ctx, o.metrica[1], x + gap * 5.4, y + gap * 3, { tam: gap * 2.1, c: lc, fuente: 'FreeSerif', peso: 700 }); }
  const fondo = y + 4 * gap;
  notas.forEach(nt => {
    const p = paso(nt.n, cl), ny = fondo - p * gap / 2, nx = nt.x, col = nt.c === true ? NC[solfeo(nt.n)] : nt.c;
    // líneas adicionales
    ctx.save(); ctx.strokeStyle = lc; ctx.lineWidth = lw;
    for (let q = -2; q >= p - (p % 2 === 0 ? 0 : 1) && p <= -2; q -= 2) { ctx.beginPath(); ctx.moveTo(nx - gap * 1.05, fondo - q * gap / 2); ctx.lineTo(nx + gap * 1.05, fondo - q * gap / 2); ctx.stroke(); }
    for (let q = 10; q <= p && p >= 10; q += 2) { ctx.beginPath(); ctx.moveTo(nx - gap * 1.05, fondo - q * gap / 2); ctx.lineTo(nx + gap * 1.05, fondo - q * gap / 2); ctx.stroke(); }
    ctx.restore();
    if (nt.halo) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, gap * 2.6); g.addColorStop(0, nt.halo); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(nx - gap * 3, ny - gap * 3, gap * 6, gap * 6); ctx.restore(); }
    cabeza(ctx, nx, ny, gap, nt.f || 'negra', col);
    if (nt.f !== 'redonda') {
      const arriba = p < 4, sx = arriba ? nx + gap * .6 : nx - gap * .6;
      ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = Math.max(2, gap * .14); ctx.beginPath(); ctx.moveTo(sx, ny + (arriba ? -gap * .15 : gap * .15)); ctx.lineTo(sx, ny + (arriba ? -gap * 3.4 : gap * 3.4)); ctx.stroke();
      if (nt.f === 'corchea') { ctx.beginPath(); const ty = ny + (arriba ? -gap * 3.4 : gap * 3.4), d = arriba ? 1 : -1; ctx.moveTo(sx, ty); ctx.bezierCurveTo(sx + gap * .2, ty + d * gap * 1, sx + gap * 1.3, ty + d * gap * 1.3, sx + gap * .9, ty + d * gap * 2.4); ctx.lineWidth = gap * .28; ctx.stroke(); }
      ctx.restore();
    }
  });
  return { fondo, y, gap, yDe: n => fondo - paso(n, cl) * gap / 2 };
}
// gran pentagrama (sol + fa con llave)
function granPentagrama(ctx, x, y, w, gap, notasSol = [], notasFa = [], o = {}) {
  const sep = gap * 7;
  const a = pentagrama(ctx, x, y, w, gap, notasSol, Object.assign({}, o, { clave: 'sol' }));
  const b = pentagrama(ctx, x, y + 4 * gap + sep, w, gap, notasFa, Object.assign({}, o, { clave: 'fa' }));
  ctx.save(); ctx.strokeStyle = o.lineaC || INK; ctx.lineWidth = Math.max(2, gap * .12); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 8 * gap + sep); ctx.stroke();
  // llave
  ctx.fillStyle = o.lineaC || INK; ctx.beginPath(); const bx = x - gap * 1.1, t = y, bt = y + 8 * gap + sep, m = (t + bt) / 2;
  ctx.moveTo(bx + gap * .6, t); ctx.quadraticCurveTo(bx - gap * .3, t + (m - t) * .3, bx + gap * .1, m - gap * .6); ctx.quadraticCurveTo(bx, m - gap * .2, bx - gap * .5, m); ctx.quadraticCurveTo(bx, m + gap * .2, bx + gap * .1, m + gap * .6);
  ctx.quadraticCurveTo(bx - gap * .3, bt - (bt - m) * .3, bx + gap * .6, bt); ctx.quadraticCurveTo(bx + gap * .1, bt - (bt - m) * .35, bx + gap * .45, m + gap * .4); ctx.quadraticCurveTo(bx + gap * .3, m, bx - gap * .2, m);
  ctx.quadraticCurveTo(bx + gap * .3, m, bx + gap * .45, m - gap * .4); ctx.quadraticCurveTo(bx + gap * .1, t + (m - t) * .35, bx + gap * .6, t); ctx.fill(); ctx.restore();
  return { sol: a, fa: b };
}
// insignia redonda con brillo
function insignia(ctx, x, y, r, c, ic) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
  ctx.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, rr2 = i % 2 ? r * .9 : r; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } ctx.closePath(); ctx.fillStyle = '#e6a21b'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * .78, 0, Math.PI * 2); const g = ctx.createRadialGradient(x - r * .3, y - r * .3, 0, x, y, r); g.addColorStop(0, '#fff'); g.addColorStop(.3, c); g.addColorStop(1, mezcla(c, '#2a1a3a', .35)); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  if (ic) texto(ctx, ic, x, y + 1, { tam: r * .9, c: '#fff', borde: 4 });
}
function estrella(ctx, x, y, r, c = '#ffd046') { ctx.save(); ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .45 : r; ctx.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = Math.max(2, r * .16); ctx.lineJoin = 'round'; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); }
function corazon(ctx, x, y, r, c = '#ff5a7a', vacio) { ctx.save(); ctx.beginPath(); ctx.moveTo(x, y + r * .9); ctx.bezierCurveTo(x - r * 1.6, y - r * .1, x - r * .7, y - r * 1.3, x, y - r * .45); ctx.bezierCurveTo(x + r * .7, y - r * 1.3, x + r * 1.6, y - r * .1, x, y + r * .9); ctx.fillStyle = vacio ? 'rgba(255,255,255,.12)' : c; ctx.fill(); ctx.lineWidth = r * .18; ctx.strokeStyle = INK; ctx.stroke(); if (!vacio) { ctx.beginPath(); ctx.ellipse(x - r * .45, y - r * .35, r * .2, r * .13, -.6, 0, 7); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill(); } ctx.restore(); }
