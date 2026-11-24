// =====================================================================
//  M7 · ARTE NUEVO: las ilustraciones de Gemini (src/arte/, metidas en el HTML por build.js como data:)
//  Fondos de título, premio e interiores; retratos (selector, Bach y Tic en poses); sprites que caminan
//  (Sarah, David y Sansón con el traje de viajero). Si una imagen falta o no ha cargado, queda el dibujo de antes.
// =====================================================================
const ARTE7_SRC = /*@arte*/{};
const ARTE7 = {};
function arte7(n) {
  let im = ARTE7[n];
  if (!im) { const src = ARTE7_SRC[n]; if (!src) return null; im = ARTE7[n] = new Image(); im.src = src; }
  return im.complete && im.naturalWidth ? im : null;
}
Object.keys(ARTE7_SRC).forEach(n => arte7(n));   // todas se cargan al empezar (el navegador las descomprime al dibujarlas)
// una imagen reducida una sola vez (suavizado de calidad) y guardada: dibujarla luego es solo copiar
const ESC7 = {};
function escalado7(n, alto, o = {}) {
  const k = n + '@' + alto; if (ESC7[k]) return ESC7[k];
  const im = arte7(n); if (!im) return null;
  const w = Math.round(im.naturalWidth * alto / im.naturalHeight), c = canvas(w, alto), g = c.getContext('2d');
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(im, 0, 0, w, alto);
  c.arte7 = true; if (o.kx) c.kx = o.kx;
  return (ESC7[k] = c);
}
// pinta una ilustración cubriendo todo el lienzo (recorta los lados, como object-fit: cover)
function cubrir7(ctx, im, dx = 0, dy = 0, zoom = 1) {
  const k = Math.max(LW5 / im.naturalWidth, LH5 / im.naturalHeight) * zoom, w = im.naturalWidth * k, h = im.naturalHeight * k;
  ctx.drawImage(im, (LW5 - w) / 2 + dx, (LH5 - h) / 2 + dy, w, h);
}
// ---------- fondos de interior (las paradas y los juegos de los edificios) ----------
const FONDO7 = { 'b-salon': 'int-salon', 'b-coro': 'int-coro', 'b-teatro': 'int-teatro', 'b-patio': 'int-patio', 'b-taller': 'int-taller', 'b-conservatorio': 'int-conservatorio' };
const FONDO_PARADA7 = { ritmo: 'int-ritmo', gimnasio: 'int-gimnasio', batalla: 'int-arena', partituras: 'int-biblioteca', kiosco: 'int-patio' };
const FOTOS7 = {}, FOTOS7_ORDEN = [];
function fondoArte7(id) {
  const n = FONDO7[id] || id; if (FOTOS7[n]) return FOTOS7[n];
  const im = arte7(n); if (!im) return null;
  const c = canvas(LW5, LH5), x = c.getContext('2d'); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; cubrir7(x, im);
  // velo: arriba un poco, el centro casi limpio y la parte del teclado (el 25 % de abajo) más oscura
  x.fillStyle = lg(x, 0, 0, 0, LH5, [[0, 'rgba(28,16,48,.30)'], [.4, 'rgba(28,16,48,.12)'], [.68, 'rgba(28,16,48,.30)'], [1, 'rgba(28,16,48,.72)']]); x.fillRect(0, 0, LW5, LH5);
  FOTOS7[n] = c; FOTOS7_ORDEN.push(n);
  if (FOTOS7_ORDEN.length > 4) delete FOTOS7[FOTOS7_ORDEN.shift()];   // como mucho 4 en memoria (la tableta lo agradece)
  return c;
}
// ---------- retratos: Bach y Tic en poses ----------
const POSES_BACH7 = ['contento', 'dirige', 'aplaude', 'piensa', 'rie', 'senala'];
function poseBach7(txt = '') {
  const t = txt.toLowerCase();
  if (/muy bien|bravo|lo lograste|excelente|felicit|¡qué bien|perfecto/.test(t)) return 'aplaude';
  if (/escucha|toca|canta|juntos|ritmo|pulso/.test(t)) return 'dirige';
  if (/mira|ahí|allá|ve al|entra|busca|te espera/.test(t)) return 'senala';
  if (/pens|record|aprend|nota|figura/.test(t)) return 'piensa';
  return t.length % 2 ? 'contento' : 'rie';
}
function bachArte7(pose, alto) { return escalado7('bach-' + pose, alto); }
function ticArte7(pose, alto, kx) { return escalado7('tic-' + pose, alto, { kx }); }
// si el retrato pedido es Bach, su ilustración (con la pose que va con lo que dice)
function retratoArte7(s, alto, txt) {
  try { if (s === sprBachElegante()) return bachArte7(poseBach7(txt), alto); } catch (e) { }
  return null;
}
// dibuja un retrato con los pies en (x, y): la ilustración a su alto, o el sprite de antes
function dibujarRetrato7(ctx, s, x, y, alto, kMax, txt) {
  const a = retratoArte7(s, alto, txt);
  if (a) { ctx.save(); ctx.globalAlpha *= 1; ctx.drawImage(a, Math.round(x - a.width / 2), Math.round(y - a.height)); ctx.restore(); return a; }
  sprK(ctx, s, x, y, Math.min(kMax, alto / s.height)); return null;
}
// Bach en una parada (el Salón): de pie, dirigiendo
function dibujarBachParada7(ctx, x, y, k) {
  const a = bachArte7(Math.floor(RELOJ / 4) % 2 ? 'dirige' : 'contento', Math.round(64 * k));
  if (a) ctx.drawImage(a, Math.round(x - a.width / 2), Math.round(y - a.height)); else sprK(ctx, destacado5(sprBachElegante()), x, y, k);
}
// Tic en las paradas: se mece como un metrónomo; cuenta al empezar, se sorprende si algo sale mal, baila al cantar
function dibujarTicArte7(ctx, P, x, by, k, ang) {
  const b = P.pulso ? P.pulso.beat(P.t) : 1, pose = P.t - (P.tropiezo == null ? -9 : P.tropiezo) < 1.2 ? 'sorpresa' : P.ticCanta > P.t ? 'baila' : b < 0 ? 'cuenta' : 'contento';
  const a = ticArte7(pose, Math.round(34 * k)); if (!a) return false;
  ctx.save(); ctx.translate(x, by); ctx.rotate(ang * .35); ctx.drawImage(a, -a.width / 2, -a.height); ctx.restore(); return true;
}
// Tic en el mundo (pequeño, flotando)
function ticMundo7() { return ticArte7('contento', 64, .5); }
// ---------- sprites que caminan (hoja de 3 filas: abajo, de lado [mira a la derecha], arriba × 4 cuadros) ----------
const ANDAR7 = {};
function cuadroAndar7(q, dir, f) {
  const im = arte7(q + '-andar'); if (!im) return null;
  const A = ANDAR7[q] || (ANDAR7[q] = { cw: im.naturalWidth / 4, ch: im.naturalHeight / 3 }), k = dir + (f % 4);
  if (A[k]) return A[k];
  const fila = { abajo: 0, lado: 1, arriba: 2 }[dir]; if (fila == null) return null;
  const c = canvas(A.cw, A.ch); c.getContext('2d').drawImage(im, (f % 4) * A.cw, fila * A.ch, A.cw, A.ch, 0, 0, A.cw, A.ch);
  c.kx = 1 / KP5;   // la hoja ya está a la escala de la pantalla: sprK la dibuja 1:1
  return (A[k] = c);
}
// el héroe: Sarah o David con su traje de viajero (los otros trajes y papá/mamá siguen con el dibujo de antes)
function heroeArte7(dir, f) {
  const p = GUARDA.d.perfil || 'sarah'; if ((p !== 'sarah' && p !== 'david') || trajeActual5() !== 'viajero') return null;
  return cuadroAndar7(p, dir, f || 0);
}
function sansonArte7(dir, f) { return cuadroAndar7('sanson', dir, f || 0); }
// ---------- la pantalla de título: la ilustración del camino de notas, con el logo en su hueco ----------
function dibujarTitulo5(ctx, t) {
  const im = arte7('titulo'), q = Math.min(1, t / 1.2), cx = LW5 / 2, e = 1 - Math.pow(1 - Math.min(1, t / 1.1), 3);
  if (!im) { ctx.save(); ctx.globalAlpha = q * .9; caja5(ctx, cx - 420, 92, 840, 520, { r: 30, borde: 6, sombra: 12, fondo: MARCA5.crema }); ctx.restore(); }
  else { ctx.save(); ctx.globalAlpha = q; ctx.imageSmoothingEnabled = true; cubrir7(ctx, im, 0, 0, 1 + .03 * (1 - e)); ctx.restore(); }
  // el hueco de la ilustración (arriba, al centro): la caja de la marca con el logo
  const bw = 520, bh = 250, bx = cx - bw / 2 - 1, by = 20 + (1 - e) * 24;
  ctx.save(); ctx.globalAlpha = e; caja5(ctx, bx, by, bw, bh, { r: 26, borde: 6, sombra: 10, fondo: MARCA5.crema }); ctx.restore();
  ctx.save(); ctx.globalAlpha = e; rr(ctx, bx, by, bw, bh, 26); ctx.clip(); franja5(ctx, bx, by, bw, 12); ctx.restore();
  if (LOGO5.complete && LOGO5.naturalWidth) { ctx.save(); ctx.globalAlpha = e; const w = 470, h = w * 520 / 1000; ctx.drawImage(LOGO5, cx - w / 2, by + 16 + (bh - 16 - h) / 2, w, h); ctx.restore(); }
  else titulo5(ctx, 'Mi Piano · El viaje de Bach', cx, by + bh / 2, 44, MK5);
  const e3 = Math.max(0, Math.min(1, (t - 2.4) / 1.2));
  if (e3 > 0) { ctx.save(); ctx.globalAlpha = e3; ctx.font = '700 32px Crimson'; const tx = '«Cada nota es un paso del camino.»', w = ctx.measureText(tx).width + 56; ctx.restore();
    caja5(ctx, cx - w / 2, by + bh + 22, w, 56, { r: 28, borde: 4, sombra: 5, fondo: MARCA5.papel, alpha: e3 });
    ctx.save(); ctx.globalAlpha = e3; ctx.font = '700 32px Crimson'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = MK5; ctx.fillText(tx, cx, by + bh + 51); ctx.restore(); }
}
// ---------- el premio: el pedestal dorado con la insignia en su círculo ----------
function fondoPremio7(ctx, t) {
  const im = arte7('premio'); if (!im) return null;
  ctx.save(); ctx.imageSmoothingEnabled = true; cubrir7(ctx, im); ctx.restore();
  // el círculo del pedestal: (688, 395) de 1376×768 → en el lienzo
  const k = Math.max(LW5 / im.naturalWidth, LH5 / im.naturalHeight); return { x: LW5 / 2 + (688 - im.naturalWidth / 2) * k, y: LH5 / 2 + (395 - im.naturalHeight / 2) * k, r: 118 * k };
}
// ---------- fondos de las casas del pueblo detrás del rincón ----------
const FONDO_CASA7 = { cocina: 'casa-panaderia', taller: 'casa-taller', cuarto: 'casa-cuarto', corral: 'casa-corral', sala: 'casa-cuarto' };
function fondoRincon7(ctx, L, q) {
  const n = L && L.fondo7; if (!n) return; const c = fondoArte7(n); if (!c) return;
  ctx.save(); ctx.globalAlpha = q; ctx.drawImage(c, 0, 0); ctx.restore();
}
