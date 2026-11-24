// =====================================================================
//  Los lugares de la Entrega 1: la ciudad natal, BELÉN (diciembre) y los interiores
// =====================================================================
const PIEDRA = [['#f8eed6', '#e9d7ae', '#cfb784'], ['#f3e6c8', '#e0cb9c', '#c4a974'], ['#fbf3e0', '#ecdcb6', '#d4be8e'], ['#f1e2c0', '#dcc596', '#bea06a']];
const OLIVO = ['#b8c79a', '#8fa572', '#64804f'];
// ---------- piezas de arquitectura ----------
function casaPiedra(ctx, o) {   // casa de piedra de Belén: techo plano con pretil, a veces cúpula
  const M = PIEDRA[o.v % PIEDRA.length];
  casaIso(ctx, o.i, o.j, o.a, o.b, o.h, { muro: M, techo: o.cupula ? 'cupula' : 'plano', tejado: o.cupula ? ['#e8dcc0', '#c9b48e'] : [M[0], M[1]], simbolo: o.simbolo, puerta: o.puerta !== false, oro: false, luz: o.luz, vsep: o.simbolo ? 1.6 : 2.2, ventana: '#4a3a5a', sinCruz: !o.simbolo });
  // hiladas de piedra (textura, sin tapar ventanas: muy suaves)
  const F1 = caraIzqF(o.i, o.j, o.a, o.b, o.h), F2 = caraDerF(o.i, o.j, o.a, o.b, o.h); ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(120,90,50,.22)';
  for (let v = .14; v < 1; v += .14) [F1, F2].forEach((F, q) => { ctx.beginPath(); ctx.moveTo(...F(0, v)); ctx.lineTo(...F(1, v)); ctx.stroke(); const n = Math.round((q ? o.b : o.a) * 3); for (let k = 0; k < n; k++) { const u = (k + ((v * 7.14) % 2 ? .5 : 0)) / n; ctx.beginPath(); ctx.moveTo(...F(u, v)); ctx.lineTo(...F(u, Math.min(1, v + .14))); ctx.stroke(); } });
  ctx.restore();
  if (!o.cupula) { const h = o.h, e = .14; cara(ctx, [ip(o.i, o.j + o.b, h), ip(o.i + o.a, o.j + o.b, h), ip(o.i + o.a, o.j + o.b, h + e), ip(o.i, o.j + o.b, h + e)], M[1], { lw: 1.2 }); cara(ctx, [ip(o.i + o.a, o.j + o.b, h), ip(o.i + o.a, o.j, h), ip(o.i + o.a, o.j, h + e), ip(o.i + o.a, o.j + o.b, h + e)], M[2], { lw: 1.2 }); }
  if (o.toldo) { const F = caraIzqF(o.i, o.j, o.a, o.b, o.h); cara(ctx, [F(.15, .52), F(.85, .52), ip(o.i + o.a * .85, o.j + o.b + .45, o.h * .42), ip(o.i + o.a * .15, o.j + o.b + .45, o.h * .42)], o.toldo, { lw: 1.5 }); }
  if (o.maceta) { const p = ip(o.i + o.a * .2, o.j + o.b + .1); ctx.save(); ctx.fillStyle = '#c0533f'; ctx.fillRect(p[0] - 6, p[1] - 12, 12, 12); ctx.beginPath(); ctx.arc(p[0], p[1] - 16, 9, 0, 7); ctx.fillStyle = '#6fae6a'; ctx.fill(); ctx.restore(); }
}
function olivo(ctx, o) {   // olivo: tronco torcido, copa gris-verde
  const c = ip(o.i + .5, o.j + .5), s = o.s || 1;
  ctx.save(); ctx.strokeStyle = '#6a4a30'; ctx.lineWidth = 7 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.bezierCurveTo(c[0] - 10 * s, c[1] - 14 * s, c[0] + 8 * s, c[1] - 24 * s, c[0] - 2 * s, c[1] - 38 * s); ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = '#3a2414'; ctx.stroke(); ctx.restore();
  [[0, -56, 24], [-18, -44, 18], [18, -46, 19], [-6, -70, 16], [10, -64, 14]].forEach(([dx, dy, r]) => { ctx.save(); ctx.beginPath(); ctx.arc(c[0] + dx * s, c[1] + dy * s, r * s, 0, 7); const g = ctx.createRadialGradient(c[0] + dx * s - r * .4 * s, c[1] + dy * s - r * .5 * s, 0, c[0] + dx * s, c[1] + dy * s, r * s); g.addColorStop(0, OLIVO[0]); g.addColorStop(.6, OLIVO[1]); g.addColorStop(1, OLIVO[2]); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = '#3a2414'; ctx.stroke(); ctx.restore(); });
  ctx.save(); ctx.fillStyle = '#4a3a5a'; [[-12, -50], [8, -58], [14, -42], [-4, -64]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(c[0] + dx * s, c[1] + dy * s, 2.2, 0, 7); ctx.fill(); }); ctx.restore();
}
function palmera(ctx, o) { const c = ip(o.i + .5, o.j + .5); ctx.save(); ctx.strokeStyle = '#8a6a40'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.quadraticCurveTo(c[0] + 10, c[1] - 50, c[0] + 4, c[1] - 96); ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = '#3a2414'; ctx.stroke(); for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * .5; ctx.beginPath(); ctx.moveTo(c[0] + 4, c[1] - 96); ctx.quadraticCurveTo(c[0] + 4 + Math.cos(a) * 30, c[1] - 96 + Math.sin(a) * 30 - 10, c[0] + 4 + Math.cos(a) * 52, c[1] - 96 + Math.sin(a) * 40 + 16); ctx.lineWidth = 7; ctx.strokeStyle = '#5f9a5a'; ctx.stroke(); ctx.lineWidth = 1.5; ctx.strokeStyle = '#2a4a2a'; ctx.stroke(); } ctx.restore(); }
function muroBajo(ctx, i0, j0, i1, j1, h = .5) {   // tramo de muralla baja (a lo largo de i o de j)
  const M = PIEDRA[1];
  if (j0 === j1) cara(ctx, [ip(i0, j0), ip(i1, j0), ip(i1, j0, h), ip(i0, j0, h)], M[1], { lw: 1.4 });
  else cara(ctx, [ip(i0, j0), ip(i0, j1), ip(i0, j1, h), ip(i0, j0, h)], M[2], { lw: 1.4 });
  const top = j0 === j1 ? [ip(i0, j0 - .25, h), ip(i1, j0 - .25, h), ip(i1, j0, h), ip(i0, j0, h)] : [ip(i0 - .25, j0, h), ip(i0 - .25, j1, h), ip(i0, j1, h), ip(i0, j0, h)];
  cara(ctx, top, M[0], { lw: 1.4 });
}
function pozo(ctx, i, j) { const c = ip(i, j); ctx.save(); ctx.beginPath(); ctx.ellipse(c[0], c[1], 26, 13, 0, 0, 7); ctx.fillStyle = '#d4be8e'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#3a2414'; ctx.stroke(); ctx.beginPath(); ctx.ellipse(c[0], c[1] - 12, 26, 13, 0, 0, 7); ctx.fillStyle = '#ecdcb6'; ctx.fill(); ctx.stroke(); ctx.fillRect(c[0] - 26, c[1] - 12, 0, 0); ctx.beginPath(); ctx.ellipse(c[0], c[1] - 12, 18, 8, 0, 0, 7); ctx.fillStyle = '#2f5a8a'; ctx.fill(); ctx.strokeStyle = '#5a3a24'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(c[0] - 22, c[1] - 12); ctx.lineTo(c[0] - 22, c[1] - 52); ctx.lineTo(c[0] + 22, c[1] - 52); ctx.lineTo(c[0] + 22, c[1] - 12); ctx.stroke(); ctx.restore(); }
// ---------- los SEIS edificios de Belén (forma y símbolo reconocibles) ----------
const BELEN_EDIF = {
  patio: o => (ctx) => { const M = PIEDRA[2]; for (let i = o.i; i < o.i + o.a; i++) for (let j = o.j; j < o.j + o.b; j++) cara(ctx, [ip(i, j), ip(i + 1, j), ip(i + 1, j + 1), ip(i, j + 1)], (i + j) % 2 ? '#e8dcc0' : '#dccfae', { lw: .8 });
    muroBajo(ctx, o.i, o.j, o.i + o.a, o.j, .7); muroBajo(ctx, o.i, o.j, o.i, o.j + o.b, .7); olivo(ctx, { i: o.i + 1, j: o.j + 1, s: 1.25 }); pozo(ctx, o.i + o.a - 1.2, o.j + 1.4);
    muroBajo(ctx, o.i, o.j + o.b, o.i + o.a / 2 - .6, o.j + o.b, .7); muroBajo(ctx, o.i + o.a / 2 + .6, o.j + o.b, o.i + o.a, o.j + o.b, .7); muroBajo(ctx, o.i + o.a, o.j, o.i + o.a, o.j + o.b, .7);
    // arco de la entrada con su símbolo
    const L = ip(o.i + o.a / 2 - .6, o.j + o.b), R = ip(o.i + o.a / 2 + .6, o.j + o.b); ctx.save(); ctx.strokeStyle = '#3a2414'; ctx.lineWidth = 2; ctx.fillStyle = M[1]; ctx.beginPath(); ctx.moveTo(L[0], L[1]); ctx.lineTo(L[0], L[1] - 50); ctx.quadraticCurveTo((L[0] + R[0]) / 2, (L[1] + R[1]) / 2 - 86, R[0], R[1] - 50); ctx.lineTo(R[0], R[1]); ctx.lineTo(R[0] + 8, R[1]); ctx.lineTo(R[0] + 8, R[1] - 56); ctx.quadraticCurveTo((L[0] + R[0]) / 2, (L[1] + R[1]) / 2 - 98, L[0] - 8, L[1] - 56); ctx.lineTo(L[0] - 8, L[1]); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    simboloPuerta(ctx, 'arbol', (L[0] + R[0]) / 2, (L[1] + R[1]) / 2 - 76, 13); },
  coro: o => (ctx) => { casaPiedra(ctx, Object.assign({}, o, { v: 2, simbolo: 'coro' })); casaIso(ctx, o.i + o.a * .3, o.j + o.b * .25, 1.2, 1.2, o.h + .4, { techo: 'cupula', tejado: ['#6fbfa6', '#4a9483'], muro: PIEDRA[2], puerta: false, oro: false }); casaIso(ctx, o.i + o.a - 1.1, o.j + .1, 1, 1, o.h + 1.8, { techo: 'torre', rh: .8, tejado: ['#d2452e', '#a8321f'], muro: PIEDRA[2], puerta: false, oro: false }); },
  salon: o => (ctx) => { casaPiedra(ctx, Object.assign({}, o, { v: 0, simbolo: 'libro' })); const F = caraIzqF(o.i, o.j, o.a, o.b, o.h); for (let k = 0; k < 4; k++) ventanaArco(ctx, F, .08 + k * .23, .55, .14, .35, '#2a4b9b', { cruz: true }); estandarte(ctx, ...ip(o.i + o.a, o.j + o.b, o.h + .2), '#2a4b9b'); },
  teatro: o => (ctx) => { casaPiedra(ctx, Object.assign({}, o, { v: 3, simbolo: 'mascara', cupula: true })); const F = caraIzqF(o.i, o.j, o.a, o.b, o.h); [.12, .3, .7, .88].forEach(u => cara(ctx, [F(u - .03, 0), F(u + .03, 0), F(u + .03, .9), F(u - .03, .9)], '#fbf3e0', { lw: 1.2 })); },
  taller: o => (ctx) => { casaPiedra(ctx, Object.assign({}, o, { v: 1, simbolo: 'martillo', toldo: '#d2452e' })); const c = ip(o.i + o.a * .75, o.j + o.b * .3, o.h + .5); ctx.save(); ctx.fillStyle = '#b8a48e'; ctx.fillRect(c[0] - 8, c[1] - 6, 16, 30); ctx.strokeStyle = '#3a2414'; ctx.lineWidth = 2; ctx.strokeRect(c[0] - 8, c[1] - 6, 16, 30); ctx.filter = 'blur(3px)'; [[2, -20, 9], [8, -38, 12], [16, -58, 14]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(c[0] + dx, c[1] + dy, r, 0, 7); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fill(); }); ctx.restore(); },
  conservatorio: o => (ctx) => { casaPiedra(ctx, Object.assign({}, o, { v: 2, simbolo: 'estrella' })); casaIso(ctx, o.i - .1, o.j - .1, 1.3, 1.3, o.h + 1.6, { techo: 'torre', rh: 1, tejado: ['#2a4b9b', '#1d3672'], muro: PIEDRA[2], puerta: false, oro: false }); casaIso(ctx, o.i + o.a - 1.2, o.j - .1, 1.3, 1.3, o.h + 1.6, { techo: 'torre', rh: 1, tejado: ['#2a4b9b', '#1d3672'], muro: PIEDRA[2], puerta: false, oro: false }); estandarte(ctx, ...ip(o.i + o.a * .5, o.j + o.b, o.h + .2), '#d2452e'); estandarte(ctx, ...ip(o.i + o.a, o.j + o.b * .5, o.h + .2), '#d9a930'); },
};
// ---------- pesebre y figuras del nacimiento (píxel) ----------
function establo(ctx, o) {
  const c = (u, v, z) => ip(o.i + u, o.j + v, z);
  ctx.save(); ctx.strokeStyle = '#3a2414'; ctx.lineWidth = 2;
  // muro de fondo de piedra
  cara(ctx, [c(0, 0, 0), c(o.a, 0, 0), c(o.a, 0, 1.4), c(0, 0, 1.4)], '#dcc596', { lw: 1.6 }); cara(ctx, [c(0, 0, 0), c(0, o.b, 0), c(0, o.b, 1.4), c(0, 0, 1.4)], '#cfb784', { lw: 1.6 });
  // paja en el suelo
  for (let k = 0; k < 30; k++) { const p = c(.3 + (k * 37 % 100) / 100 * (o.a - .6), .3 + (k * 53 % 100) / 100 * (o.b - .6), 0); ctx.strokeStyle = '#e8c86a'; ctx.beginPath(); ctx.moveTo(p[0] - 5, p[1]); ctx.lineTo(p[0] + 5, p[1] - 2); ctx.stroke(); }
  // postes y techo de paja
  ctx.strokeStyle = '#3a2414';
  [[o.a, o.b], [o.a, 0], [0, o.b]].forEach(([u, v]) => { const b = c(u, v, 0), t = c(u, v, 1.6); ctx.fillStyle = '#8a5a34'; ctx.fillRect(b[0] - 4, t[1], 8, b[1] - t[1]); ctx.strokeRect(b[0] - 4, t[1], 8, b[1] - t[1]); });
  cara(ctx, [c(-.2, o.b + .3, 1.6), c(o.a + .3, o.b + .3, 1.6), c(o.a + .3, o.b / 2, 2.4), c(-.2, o.b / 2, 2.4)], '#d8b45a', { lw: 1.6 });
  cara(ctx, [c(o.a + .3, o.b + .3, 1.6), c(o.a + .3, -.2, 1.6), c(o.a + .3, o.b / 2, 2.4)], '#c4a04a', { lw: 1.6 });
  ctx.restore();
}
const NAC = {
  pesebre: () => cache('pesebre', () => sprite(22, 14, g => { g.R(0, 6, 22, 6, '#8a5a34'); g.R(1, 12, 3, 2, '#5a3418'); g.R(18, 12, 3, 2, '#5a3418'); for (let x = 1; x < 21; x += 2) g.px(x, 5, '#e8c86a'); g.R(3, 3, 16, 3, '#e8c86a'); g.ellE(7, 0, 8, 6, '#fffaf2'); g.ellE(8, 1, 5, 4, '#f2c9a8'); g.px(9, 3, INK); g.px(11, 3, INK); g.R(3, 6, 16, 1, '#a86e3e'); }, { ax: 11, ay: 14 })),
  maria: () => adulto({ id: 'maria', largo: true, falda: true, pelo: '#4a2a18', ropa: '#fbf1d8', ropa2: '#2a4b9b', piel: '#e8b48c', piel2: '#c98e62', extra: g => { g.R(3, 0, 20, 4, '#2a4b9b'); g.R(3, 3, 3, 24, '#2a4b9b'); g.R(20, 3, 3, 24, '#2a4b9b'); g.ojos = 0; } }),
  jose: () => adulto({ id: 'jose', barba: true, pelo: '#5a3418', pelo2: '#7a4a2a', ropa: '#a86e3e', saco: '#7a4a24', pantalon: '#7a4a24', piel: '#d9a07a', piel2: '#b8805a', extra: g => { g.R(23, 6, 2, 40, '#6a4a30'); g.R(21, 4, 4, 3, '#6a4a30'); } }),
  oveja: () => cache('oveja', () => sprite(18, 13, g => { g.ellE(2, 1, 14, 9, '#fffaf2'); g.disc(5, 3, 2, '#f0e6d8'); g.disc(10, 2, 2, '#f0e6d8'); g.ellE(13, 3, 5, 5, '#3a2a2a'); g.R(4, 9, 2, 4, '#3a2a2a'); g.R(11, 9, 2, 4, '#3a2a2a'); g.px(15, 5, '#fff'); }, { ax: 9, ay: 13 })),
  burro: () => cache('burro', () => sprite(24, 20, g => { g.R(3, 6, 15, 8, '#9a8a8a'); g.R(3, 13, 2, 7, '#7a6a6a'); g.R(15, 13, 2, 7, '#7a6a6a'); g.R(16, 1, 6, 8, '#9a8a8a'); g.R(17, 0, 2, 3, '#7a6a6a'); g.R(20, 0, 2, 3, '#7a6a6a'); g.R(19, 6, 4, 3, '#d8d0c8'); g.px(18, 3, INK); g.R(3, 6, 15, 2, '#b0a2a2'); }, { ax: 12, ay: 20 })),
};
// ---------- NPCs ----------
const NPC5 = {
  pastor: () => adulto({ id: 'pastor', barba: true, pelo: '#3a2418', ropa: '#e8d6a0', saco: '#8a6a40', pantalon: '#8a6a40', extra: g => { g.R(5, 0, 16, 4, '#fbf1d8'); g.R(5, 2, 2, 8, '#fbf1d8'); g.R(19, 2, 2, 8, '#fbf1d8'); g.R(6, 2, 14, 1, '#d2452e'); g.R(23, 4, 2, 42, '#7a4a24'); g.R(22, 2, 4, 3, '#7a4a24'); } }),
  cantora: () => chico({ id: 'cantora', peinado: 'largo', pelo: '#2a1810', pelo2: '#4a2a18', piel: '#e8b48c', piel2: '#c98e62', ropa: '#2a4b9b', falda: true, lazo: '#d2452e', boca: 'grande', extra: g => { g.R(18, 14, 6, 8, '#fbf1d8'); g.R(19, 16, 4, 1, INK); g.R(19, 18, 4, 1, INK); } }),
  musico: () => adulto({ id: 'musico', barba: true, pelo: '#e2d8ca', pelo2: '#fffaf4', ropa: '#2e8b6a', saco: '#1f6a50', pantalon: '#3a3a52', piel: '#d9a07a', piel2: '#b8805a', extra: g => { g.R(17, 20, 8, 10, '#d9a930'); g.R(18, 21, 6, 8, '#3a2414'); for (let x = 19; x < 24; x += 2) g.R(x, 21, 1, 8, '#fff3b0'); g.R(17, 18, 2, 3, '#d9a930'); g.R(23, 18, 2, 3, '#d9a930'); } }),
  mesonero: () => adulto({ id: 'mesonero', pelo: '#3a2418', ropa: '#c0533f', saco: '#fbf1d8', pantalon: '#5a3a24', extra: g => { g.R(8, 22, 10, 10, '#fbf1d8'); g.R(1, 22, 5, 6, '#e6a21b'); g.R(2, 23, 3, 4, '#fff3b0'); } }),
  abuela: () => adulto({ id: 'abuela', largo: true, falda: true, pelo: '#e2d8ca', pelo2: '#fffaf4', ropa: '#b86bff', ropa2: '#7f3fc8', piel: '#f2c4a0', piel2: '#d9a07a' }),
};
const DIAL_BELEN = {
  pastor: { sarah: ['Pero el ángel les dijo:', 'No temáis; porque he aquí', 'os doy nuevas de gran gozo,', 'que será para todo el pueblo:', 'que os ha nacido hoy,', 'en la ciudad de David,', 'un Salvador, que es CRISTO el Señor.', 'Lucas 2:10–11'], david: ['¡Nació Jesús!', 'Lucas 2:11'] },
  cantora: { sarah: ['Cantadle cántico nuevo;', 'hacedlo bien,', 'tañendo con júbilo.', 'Salmo 33:3'], david: ['¡Canta!', '¡Toca con alegría!'] },
  musico: { sarah: ['Mira: el pentagrama tiene cinco líneas.', 'Las notas viven en las líneas', 'y en los espacios.'], david: ['Cinco líneas.', '¡Un pentagrama!'] },
  mesonero: { sarah: ['Y dio a luz a su hijo primogénito,', 'y lo envolvió en pañales,', 'y lo acostó en un pesebre,', 'porque no había lugar para ellos en el mesón.', 'Lucas 2:7'], david: ['Jesús', 'en el pesebre.'] },
};
// ---------- cielo de Belén (de día) con colinas de Judea y la estrella ----------
function cieloBelen(ctx, ox, oy) {
  const g = ctx.createLinearGradient(0, 0, 0, LH5); g.addColorStop(0, '#8fc4ec'); g.addColorStop(.55, '#f6e0bc'); g.addColorStop(1, '#efd6a8'); ctx.fillStyle = g; ctx.fillRect(0, 0, LW5, LH5);
  const par = ox * .25; ctx.save(); ctx.translate(par, oy * .2);
  [['#c9b8a0', 340, .9], ['#b8a890', 380, 1.2]].forEach(([c, base, a]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-800, base + 200); for (let x = -800; x <= 2400; x += 80) ctx.lineTo(x, base - 40 * a - Math.sin(x * .004 + a) * 50 * a); ctx.lineTo(2400, base + 400); ctx.fill(); });
  ctx.restore();
}
function estrellaBelen(ctx, x, y, t) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, 170); g.addColorStop(0, 'rgba(255,248,210,.95)'); g.addColorStop(.25, 'rgba(255,228,150,.45)'); g.addColorStop(1, 'rgba(255,228,150,0)'); ctx.fillStyle = g; ctx.fillRect(x - 170, y - 170, 340, 340);
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4 + t * .05, L = k % 2 ? 70 : 140 + Math.sin(t * 2 + k) * 14; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a - .05) * L, y + Math.sin(a - .05) * L); ctx.lineTo(x + Math.cos(a + .05) * L, y + Math.sin(a + .05) * L); ctx.closePath(); ctx.fillStyle = 'rgba(255,240,190,.55)'; ctx.fill(); }
  ctx.restore();
  ctx.save(); ctx.beginPath(); for (let k = 0; k < 16; k++) { const a = -Math.PI / 2 + k * Math.PI / 8, r = k % 2 ? 8 : (k % 4 === 0 ? 30 : 18); ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = '#fff8dc'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#d9a930'; ctx.stroke(); ctx.restore();
}
// ---------- BELÉN ----------
function defBelen() {
  const G = 36;
  const calle = (i, j) => (j >= 15 && j <= 19) || (i >= 15 && i <= 19 && j <= 19) || (i >= 7 && i <= 31 && j >= 25 && j <= 28);
  const plaza = (i, j) => i >= 11 && i <= 22 && j >= 9 && j <= 15;
  const olivar = (i, j) => (i + j <= 9) || (i >= 27 && j >= 28) || (i >= 29 && j <= 8);
  const objetos = [];
  const E = (tipo, i, j, a, b, h, entra, nombre) => objetos.push({ i, j, a, b, h, alto: h + 4, dibujar: BELEN_EDIF[tipo]({ i, j, a, b, h }), puerta: [i + Math.floor(a / 2), j + b], entra, nombre });
  E('teatro', 3, 10, 4, 4, 2.2, 'b-teatro', 'Teatro');
  E('salon', 24, 10, 5, 4, 2.6, 'b-salon', 'Salón de Bach');
  E('coro', 4, 20, 4, 4, 2.2, 'b-coro', 'Coro');
  E('patio', 10, 20, 5, 4, 1, 'b-patio', 'Patio');
  E('taller', 21, 21, 4, 3, 2, 'b-taller', 'Taller');
  E('conservatorio', 22, 29, 6, 4, 2.8, 'b-conservatorio', 'Conservatorio');
  // casas de piedra (sin entrada todavía)
  const casas = [[9, 3, 3, 3, 2], [11, 2, 3, 3, 1.6, true], [20, 2, 3, 4, 2.2], [24, 4, 3, 3, 1.6], [9, 11, 2, 3, 1.4], [31, 11, 3, 3, 1.6, true], [12, 29, 3, 3, 1.8], [16, 29, 3, 3, 2.2, true], [6, 29, 3, 3, 1.6], [31, 20, 3, 4, 2], [27, 21, 3, 3, 1.6], [20, 11, 0, 0, 0]].filter(c => c[2]);
  casas.forEach(([i, j, a, b, h, cup], k) => objetos.push({ i, j, a, b, h, alto: h + 3, dibujar: ctx => casaPiedra(ctx, { i, j, a, b, h, v: k, cupula: cup, maceta: k % 3 === 0, toldo: k % 4 === 1 ? ['#2a4b9b', '#2e8b6a', '#d2452e'][k % 3] : null }), puerta: [i + Math.floor(a / 2), j + b], cerrado: 'Aquí vive una familia de Belén.', nombre: 'Casa' }));
  // establo (pesebre) en la plaza, al norte
  objetos.push({ i: 15, j: 9, a: 3, b: 2, alto: 4, dibujar: ctx => establo(ctx, { i: 15, j: 9, a: 3, b: 2 }) });
  // puerta de la ciudad (dos torres) al sur
  [[33, 13], [33, 19]].forEach(([i, j]) => objetos.push({ i, j, a: 2, b: 2, alto: 6, dibujar: ctx => casaIso(ctx, i, j, 2, 2, 3.2, { techo: 'plano', tejado: PIEDRA[1], muro: PIEDRA[1], puerta: false, oro: false }) }));
  // olivos, palmeras, pozo de la plaza
  const R = rng(77);
  for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) if (olivar(i, j) && !calle(i, j) && (i * 3 + j * 5) % 4 === 0 && R() < .8) objetos.push({ i, j, alto: 3, mece: true, dibujar: ctx => olivo(ctx, { i, j, s: .9 + R() * .3 }) });
  [[10, 14], [22, 14], [20, 23], [8, 23], [30, 23]].forEach(([i, j]) => objetos.push({ i, j, alto: 4, mece: true, dibujar: ctx => palmera(ctx, { i, j }) }));
  objetos.push({ i: 20, j: 13, alto: 2, dibujar: ctx => pozo(ctx, 20.5, 13.5) });
  return {
    id: 'belen', nombre: 'Belén', G, niebla: true, radio: 6, inicio: [35, 17], oy: 380, cieloAlto: 120,
    suelo: (i, j) => plaza(i, j) ? 'z' : calle(i, j) ? 'c' : olivar(i, j) ? 'o' : 'h',
    colores: { h: ['#dccb84', '#d2bd76', '#e2d290', '#d6c27e'], c: ['#e8d2a4', '#ddc492', '#eedab0'], z: ['#f4e0b6', '#ead2a2'], o: ['#b9c06e', '#acb462', '#c3c97a'] },
    decorarSuelo: (ctx, { ipW }) => { const R2 = rng(5); for (let k = 0; k < 500; k++) { const i = R2() * G, j = R2() * G, p = ip(i, j); if (plaza(Math.floor(i), Math.floor(j)) || calle(Math.floor(i), Math.floor(j))) continue; ctx.fillStyle = R2() < .5 ? 'rgba(120,140,60,.35)' : 'rgba(255,255,255,.25)'; ctx.fillRect(p[0], p[1], 3, 2); }
      // anillo de losas más oscuras alrededor del pesebre
      ctx.save(); const c = ip(16.5, 11.5); ctx.translate(c[0], c[1]); ctx.scale(1, .5); ctx.strokeStyle = 'rgba(160,130,80,.35)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(0, 0, 150, 0, 7); ctx.stroke(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(217,169,48,.45)'; ctx.beginPath(); ctx.arc(0, 0, 166, 0, 7); ctx.stroke(); ctx.restore(); },
    objetos,
    npcs: [{ i: 25, j: 17, nombre: 'Pastor', sprite: NPC5.pastor, dialogo: DIAL_BELEN.pastor }, { i: 14, j: 18, nombre: 'Cantora', sprite: NPC5.cantora, dialogo: DIAL_BELEN.cantora, flip: true }, { i: 19, j: 24, nombre: 'Músico', sprite: NPC5.musico, dialogo: DIAL_BELEN.musico }, { i: 12, j: 14, nombre: 'Mesonero', sprite: NPC5.mesonero, dialogo: DIAL_BELEN.mesonero, flip: true }],
    secretos: [{ i: 33, j: 33, id: 'belen-corchea', texto: '¡Corchea dorada!' }],
    pixeles: [{ i: 16, j: 11.6, s: NAC.pesebre, k: 2 }, { i: 15.2, j: 11.8, s: NAC.maria, k: 1.6 }, { i: 17.6, j: 11, s: NAC.jose, k: 1.6, flip: true }, { i: 14.4, j: 12.6, s: NAC.oveja, k: 2 }, { i: 18.4, j: 12.4, s: NAC.burro, k: 2, flip: true }, { i: 13.6, j: 11.4, s: NAC.oveja, k: 2, flip: true }, { i: 26, j: 18, s: NAC.oveja, k: 2 }, { i: 27, j: 17.4, s: NAC.oveja, k: 2, flip: true }, { i: 3, j: 4, s: NAC.oveja, k: 2 }],
    fondo: cieloBelen,
    encima: (ctx, ox, oy) => { const p = ip(0, 0); const c = [OX_B(16.5, 10.5)[0] + ox, OX_B(16.5, 10.5)[1] + oy - 250]; estrellaBelen(ctx, c[0], c[1], RELOJ);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(c[0], c[1], c[0], c[1] + 320); g.addColorStop(0, 'rgba(255,240,190,.35)'); g.addColorStop(1, 'rgba(255,240,190,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(c[0] - 6, c[1]); ctx.lineTo(c[0] + 6, c[1]); ctx.lineTo(c[0] + 70, c[1] + 250); ctx.lineTo(c[0] - 70, c[1] + 250); ctx.fill(); ctx.restore(); },
  };
}
function OX_B(i, j) { return LUGARES5.belen ? LUGARES5.belen.ipW(i, j) : [0, 0]; }
// ---------- CIUDAD NATAL (pequeña) ----------
function kiosco(ctx, o) {
  const c = ip(o.i + 1.5, o.j + 1.5), r = T5 * 1.5;
  ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = '#3a2414';
  ctx.beginPath(); ctx.ellipse(c[0], c[1], r * 1.05, r * .55, 0, 0, 7); ctx.fillStyle = '#e8dcc0'; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(c[0], c[1] - 8, r * 1.05, r * .55, 0, 0, 7); ctx.fillStyle = '#fbf3e0'; ctx.fill(); ctx.stroke();
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2, x = c[0] + Math.cos(a) * r * .95, y = c[1] - 8 + Math.sin(a) * r * .5; if (Math.sin(a) < -.2) continue; ctx.fillStyle = '#fbf1d8'; ctx.fillRect(x - 3, y - 70, 6, 70); ctx.strokeRect(x - 3, y - 70, 6, 70); }
  ctx.beginPath(); ctx.moveTo(c[0] - r * 1.2, c[1] - 76); ctx.lineTo(c[0], c[1] - 130); ctx.lineTo(c[0] + r * 1.2, c[1] - 76); ctx.quadraticCurveTo(c[0], c[1] - 50, c[0] - r * 1.2, c[1] - 76); ctx.fillStyle = '#d2452e'; ctx.fill(); ctx.stroke();
  for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(c[0], c[1] - 130); ctx.lineTo(c[0] + k * r * .34, c[1] - 66 + Math.abs(k) * 2); ctx.strokeStyle = 'rgba(58,36,20,.4)'; ctx.stroke(); }
  ctx.fillStyle = '#d9a930'; ctx.beginPath(); ctx.arc(c[0], c[1] - 134, 6, 0, 7); ctx.fill(); ctx.strokeStyle = '#3a2414'; ctx.stroke();
  ctx.restore();
}
function defNatal() {
  const G = 22; const camino = (i, j) => (j >= 9 && j <= 11) || (i >= 9 && i <= 11) || (i >= 4 && i <= 7 && j >= 4 && j <= 6);
  const objetos = [];
  const casa = (i, j, a, b, h, o, entra, nombre) => objetos.push({ i, j, a, b, h, alto: h + 4, dibujar: ctx => casaIso(ctx, i, j, a, b, h, Object.assign({ gablete: true }, o)), puerta: [i + Math.floor(a / 2), j + b], entra, nombre });
  casa(3, 1, 4, 3, 2, { tejado: PALS5.A.tejado, simbolo: 'arbol' }, 'n-casa', 'Mi casa');
  casa(14, 2, 3, 3, 1.8, { tejado: PALS5.A.tejado2, simbolo: 'martillo' }, 'n-luthier', 'Luthier');
  casa(13, 13, 5, 4, 2.6, { tejado: [NC.SI, '#7f3fc8'], simbolo: 'estrella', estandarte: '#d2452e' }, 'n-sala', 'Sala de conciertos');
  objetos.push({ i: 3, j: 13, a: 3, b: 3, alto: 5, dibujar: ctx => kiosco(ctx, { i: 3, j: 13 }), puerta: [4, 16], nombre: 'Kiosco', cerrado: 'Aquí toca la banda los domingos.' });
  [[1, 8], [8, 1], [19, 8], [19, 19], [8, 19], [1, 19], [12, 8], [19, 4]].forEach(([i, j], k) => objetos.push({ i, j, alto: 3, mece: true, dibujar: ctx => arbolIso(ctx, i + .5, j + .5, 1) }));
  objetos.push({ i: 8, j: 8, a: 1, b: 1, alto: 3, dibujar: ctx => fuenteIso(ctx, 8.5, 8.5, .7) });
  return {
    id: 'natal', nombre: 'Mi aldea', G, niebla: false, inicio: [5, 5], oy: 300,
    suelo: (i, j) => camino(i, j) ? 'c' : 'p',
    colores: { p: ['#8fd27a', '#84c96f', '#9ad985'], c: ['#ecd49c', '#e0c384', '#e6cc90'] },
    decorarSuelo: ctx => { const R = rng(9); for (let k = 0; k < 160; k++) { const p = ip(R() * G, R() * G); ctx.fillStyle = [NC.DO, NC.MI, '#fffaf2', NC.SI][k % 4]; ctx.beginPath(); ctx.arc(p[0], p[1], 2.4, 0, 7); ctx.fill(); } },
    objetos, npcs: [{ i: 9, j: 12, nombre: 'Abuela', sprite: NPC5.abuela, dialogo: { sarah: ['Hoy empieza el viaje.', 'Bach te escribió una carta.'], david: ['¡Hola!', '¡A tocar!'] } }],
    pixeles: [{ i: 7, j: 5, s: () => sprSanson({}), k: 2, r: 22 }],
    fondo: (ctx, ox, oy) => { const g = ctx.createLinearGradient(0, 0, 0, LH5); g.addColorStop(0, '#9fd4f4'); g.addColorStop(1, '#e8f0d8'); ctx.fillStyle = g; ctx.fillRect(0, 0, LW5, LH5); },
  };
}
// ---------- interiores ----------
function defInterior(id, nombre, o) {
  const G = o.G || 9;
  return {
    id, nombre, interior: true, G, T: 48, oy: 360, inicio: [Math.floor(G / 2), G - 1], salida: [Math.floor(G / 2), G - 1], kPj: 2.4, vel: 3.4, luz: true,
    suelo: (i, j) => o.suelo ? o.suelo(i, j) : 'm',
    colores: Object.assign({ m: ['#c98a52', '#bd7e48', '#c4844e'], p: ['#e8dcc0', '#ddd0b0'], a: ['#c8324a', '#b82a40'], d: ['#d8a04a', '#c8903a'] }, o.colores || {}),
    base: (ctx) => {   // paredes del fondo (izquierda: a lo largo de j; derecha: a lo largo de i)
      const hw = o.alto || 3.2, M = o.muro || ['#f3e2c0', '#e6d0a4'];
      cara(ctx, [ip(0, 0), ip(0, G), ip(0, G, hw), ip(0, 0, hw)], M[0], { lw: 2 }); cara(ctx, [ip(0, 0), ip(G, 0), ip(G, 0, hw), ip(0, 0, hw)], M[1], { lw: 2 });
      cara(ctx, [ip(0, 0), ip(0, G), ip(0, G, .35), ip(0, 0, .35)], o.zocalo || '#9a6038', { lw: 1.4 }); cara(ctx, [ip(0, 0), ip(G, 0), ip(G, 0, .35), ip(0, 0, .35)], mezcla(o.zocalo || '#9a6038', '#000', .1), { lw: 1.4 });
      // grosor del piso
      cara(ctx, [ip(0, G), ip(G, G), ip(G, G, -.4), ip(0, G, -.4)], '#7a4a24'); cara(ctx, [ip(G, G), ip(G, 0), ip(G, 0, -.4), ip(G, G, -.4)], '#5a3418');
      if (o.paredes) o.paredes(ctx, { G, hw });
    },
    decorarSuelo: (ctx) => { const p = ip(Math.floor(G / 2) + .5, G - .4); ctx.save(); ctx.beginPath(); ctx.ellipse(p[0], p[1], 34, 14, 0, 0, 7); ctx.fillStyle = '#d2452e'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#3a2414'; ctx.stroke(); ctx.restore(); if (o.piso) o.piso(ctx, { G }); },
    objetos: (o.objetos || []).concat([]), pixeles: (o.muebles || []), npcs: o.npcs || [],
    fondo: (ctx) => { const g = ctx.createRadialGradient(LW5 / 2, LH5 / 2, 100, LW5 / 2, LH5 / 2, 800); g.addColorStop(0, o.fondo1 || '#5a3a2a'); g.addColorStop(1, o.fondo2 || '#1c1030'); ctx.fillStyle = g; ctx.fillRect(0, 0, LW5, LH5); },
  };
}
// ventanal en una pared (lado: 'izq' a lo largo de j en i=0; 'der' a lo largo de i en j=0)
function ventanalPared(ctx, lado, u, G, hw, c = '#9fd8ff', vitral) {
  const F = lado === 'izq' ? ((uu, v) => ip(0, uu * G, v * hw)) : ((uu, v) => ip(uu * G, 0, v * hw));
  ventanaArco(ctx, F, u - .07, .3, .14, .5, c, { cruz: true });
  if (vitral) { [NC.DO, NC.MI, NC.SOL, NC.SI].forEach((cc, k) => { const p = F(u - .035 + (k % 2) * .07, .42 + Math.floor(k / 2) * .14); ctx.save(); ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, 7); ctx.fillStyle = cc; ctx.fill(); ctx.restore(); }); }
}
function mueble(i, j, s, k = 2.4, o = {}) { return Object.assign({ i, j, s, k }, o); }
function bloquear(lista) { return lista.map(m => ({ i: Math.floor(m.i), j: Math.floor(m.j), a: 1, b: 1, bloquea: true })); }
function interiores() {
  const I = {};
  const conMuebles = (o) => { o.objetos = (o.objetos || []).concat(bloquear(o.muebles || [])); return o; };
  I['b-patio'] = defInterior('b-patio', 'Patio', conMuebles({ alto: 1.6, muro: ['#f3e6c8', '#e0cb9c'], suelo: () => 'p', fondo1: '#8fc4ec', fondo2: '#e8d6b0',
    paredes: (ctx, { G, hw }) => { [.25, .5, .75].forEach(u => { ventanalPared(ctx, 'izq', u, G, hw, '#8fc4ec'); ventanalPared(ctx, 'der', u, G, hw, '#8fc4ec'); }); },
    objetos: [{ i: 1, j: 1, a: 2, b: 2, alto: 4, dibujar: ctx => olivo(ctx, { i: 1.5, j: 1.5, s: 1.6 }) }, { i: 6, j: 2, a: 1, b: 1, alto: 3, dibujar: ctx => fuenteIso(ctx, 6.5, 2.5, .8) }],
    muebles: [mueble(4, 4, sprClavecin(), 2.4)] }));
  I['b-coro'] = defInterior('b-coro', 'Coro', conMuebles({ alto: 4, muro: ['#f3e6c8', '#e3d0a6'], suelo: (i, j) => i === 4 ? 'a' : 'p', fondo1: '#3a2a5a',
    paredes: (ctx, { G, hw }) => { [.3, .7].forEach(u => { ventanalPared(ctx, 'izq', u, G, hw, '#7f8fe0', true); ventanalPared(ctx, 'der', u, G, hw, '#e07f9a', true); }); },
    muebles: [mueble(2, 2, sprOrgano(), 1.8), mueble(6, 1.2, sprCandelabro(), 2.4), mueble(1.2, 6, sprCandelabro(), 2.4)].concat([2, 3, 5, 6].map(i => mueble(i, 5, banco5(), 2.2))) }));
  I['b-salon'] = defInterior('b-salon', 'Salón de Bach', conMuebles({ alto: 3.4, muro: ['#fbefd6', '#eedcb4'], suelo: (i, j) => (i >= 3 && i <= 5 && j >= 3 && j <= 5) ? 'a' : 'm',
    paredes: (ctx, { G, hw }) => { ventanalPared(ctx, 'izq', .3, G, hw); ventanalPared(ctx, 'izq', .75, G, hw); pizarra5(ctx, G, hw); },
    muebles: [mueble(1.5, 2, sprClavecin(), 2.4), mueble(3, 1, sprBachElegante(), 2.2, { destacar: true }), mueble(6, 4, sprAtril(), 2.4), mueble(4, 6, sprAtril(), 2.4), mueble(7.4, 1, sprEstante(), 2.4), mueble(1, 7, sprRelojPie(), 2.4)], npcs: [] }));
  I['b-teatro'] = defInterior('b-teatro', 'Teatro', conMuebles({ alto: 4, muro: ['#7a1f3d', '#5a1430'], zocalo: '#3a1020', suelo: (i, j) => (i <= 3 || j <= 2) ? 'd' : 'm', fondo1: '#3a1030',
    paredes: (ctx, { G, hw }) => { telon5(ctx, G, hw); },
    muebles: [4, 5, 6, 7].map(i => mueble(i, 6.2, banco5(), 2.2)).concat([mueble(2, 1.2, sprCandelabro(), 2.6), mueble(1.2, 2.4, sprAtril(), 2.4)]) }));
  I['b-taller'] = defInterior('b-taller', 'Taller', conMuebles({ alto: 3, muro: ['#e8d0a4', '#d8bc88'], suelo: () => 'm',
    paredes: (ctx, { G, hw }) => { ventanalPared(ctx, 'der', .7, G, hw); herramientas5(ctx, G, hw); },
    muebles: [mueble(2, 2, mesa5(), 2.4), mueble(5, 1.2, sprEstante(), 2.4), mueble(1.2, 5, sprMarimba(), 2.2), mueble(6, 5, sprBarril(), 2.4), mueble(7, 5, sprBarril(), 2.4)] }));
  I['b-conservatorio'] = defInterior('b-conservatorio', 'Conservatorio', conMuebles({ G: 11, alto: 4.2, muro: ['#e8e0f0', '#d4c8e4'], suelo: (i, j) => (i + j) % 2 ? 'p' : 'd', colores: { p: ['#e8dcc0'], d: ['#2a4b9b'] },
    paredes: (ctx, { G, hw }) => { estandartesPared5(ctx, G, hw); },
    muebles: [mueble(2.5, 2.5, plataforma5(), 2.4), mueble(7.5, 7, plataforma5(), 2.4), mueble(5, 1.2, sprTrofeos(), 2.4)] }));
  I['n-casa'] = defInterior('n-casa', 'Mi casa', conMuebles({ alto: 3, muro: ['#ffe0e6', '#f8c8d2'], suelo: (i, j) => (i >= 3 && i <= 5 && j >= 3 && j <= 5) ? 'a' : 'm',
    paredes: (ctx, { G, hw }) => { ventanalPared(ctx, 'izq', .35, G, hw); ventanalPared(ctx, 'der', .65, G, hw); },
    muebles: [mueble(1.4, 1.4, sprChimenea(), 2.2), mueble(5, 1.2, sprEstante(), 2.4), mueble(4, 4, sprAlbum(), 2.4, { sombra: false }), mueble(7, 2, sprClavecin(), 2), mueble(2, 6, cama5(), 2.4)] }));
  I['n-luthier'] = defInterior('n-luthier', 'Luthier', conMuebles({ alto: 3, muro: ['#e8d0a4', '#d8bc88'], suelo: () => 'm',
    paredes: (ctx, { G, hw }) => { herramientas5(ctx, G, hw); },
    muebles: [mueble(4, 3, mesa5(), 2.4), mueble(2, 1.2, sprEstante(), 2.4), mueble(6, 1.2, sprEstante(), 2.4), mueble(4, 2, adulto({ id: 'luthier5', barba: true, pelo: '#e2d8ca', ropa: '#fffaf2', saco: '#8a5a34' }), 2)] }));
  I['n-sala'] = defInterior('n-sala', 'Sala de conciertos', conMuebles({ alto: 4, muro: ['#7a1f3d', '#5a1430'], zocalo: '#3a1020', suelo: (i, j) => (i <= 3 || j <= 2) ? 'd' : 'm', fondo1: '#3a1030',
    paredes: (ctx, { G, hw }) => { telon5(ctx, G, hw); },
    muebles: [mueble(2, 2, sprClavecin(), 2.4)].concat([4, 5, 6, 7].map(i => mueble(i, 6.2, banco5(), 2.2))) }));
  return I;
}
// muebles nuevos en píxel
function banco5() { return cache('banco5', () => sprite(26, 12, g => { g.R(0, 0, 26, 3, '#9a6038'); g.R(0, 3, 26, 3, '#7a4a2a'); g.R(1, 6, 3, 6, '#5a3418'); g.R(22, 6, 3, 6, '#5a3418'); g.R(0, 0, 26, 1, '#c98a52'); }, { ax: 13, ay: 12 })); }
function mesa5() { return cache('mesa5', () => sprite(30, 18, g => { g.R(0, 4, 30, 4, '#9a6038'); g.R(0, 4, 30, 1, '#c98a52'); g.R(2, 8, 3, 10, '#5a3418'); g.R(25, 8, 3, 10, '#5a3418'); g.R(4, 0, 8, 4, '#c96a2a'); g.R(5, 1, 6, 2, '#e08a3a'); g.R(16, 2, 10, 2, '#a0a8b8'); g.R(24, 0, 2, 4, '#5a3418'); }, { ax: 15, ay: 18 })); }
function cama5() { return cache('cama5', () => sprite(28, 18, g => { g.R(0, 2, 28, 12, '#7a4a2a'); g.R(2, 4, 24, 8, '#ff9cc4'); g.R(2, 4, 8, 8, '#fffaf2'); g.R(10, 6, 16, 1, '#ffd6e0'); g.R(0, 0, 3, 18, '#5a3418'); g.R(25, 6, 3, 12, '#5a3418'); }, { ax: 14, ay: 18 })); }
function plataforma5() { return cache('plat5', () => sprite(30, 10, g => { g.ellE(0, 0, 30, 10, '#c98a52'); g.ellE(2, 1, 26, 6, '#e8b47c'); g.ellE(10, 2, 10, 3, '#ffd046'); }, { ax: 15, ay: 10 })); }
function pizarra5(ctx, G, hw) { const F = (u, v) => ip(u * G, 0, v * hw); cara(ctx, [F(.35, .35), F(.85, .35), F(.85, .85), F(.35, .85)], '#2f5a4a', { lw: 3, lineaC: '#8a5a34' }); ctx.save(); ctx.strokeStyle = 'rgba(246,244,236,.85)'; ctx.lineWidth = 1.5; for (let k = 0; k < 5; k++) { const a = F(.39, .48 + k * .06), b = F(.81, .48 + k * .06); ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); } [[.48, .5, NC.DO], [.58, .56, NC.MI], [.68, .62, NC.SOL]].forEach(([u, v, c]) => { const p = F(u, v); ctx.beginPath(); ctx.ellipse(p[0], p[1], 6, 4.5, -.4, 0, 7); ctx.fillStyle = c; ctx.fill(); }); ctx.restore(); }
function telon5(ctx, G, hw) { const F = (u, v) => ip(u * G, 0, v * hw); cara(ctx, [F(.15, 0), F(.95, 0), F(.95, .95), F(.15, .95)], '#a3243a', { lw: 2 }); ctx.save(); ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 3; for (let k = 0; k < 12; k++) { const a = F(.18 + k * .065, .05), b = F(.18 + k * .065, .92); ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); } ctx.restore(); cara(ctx, [F(.12, .88), F(.98, .88), F(.98, .98), F(.12, .98)], '#d9a930', { lw: 1.5 }); const L = (u, v) => ip(0, u * G, v * hw); [.3, .7].forEach(u => cara(ctx, [L(u - .05, .5), L(u + .05, .5), L(u + .05, .75), L(u - .05, .75)], '#d9a930', { lw: 1.5 })); }
function herramientas5(ctx, G, hw) { const F = (u, v) => ip(0, u * G, v * hw); cara(ctx, [F(.2, .4), F(.8, .4), F(.8, .8), F(.2, .8)], '#c9a06a', { lw: 2 }); ctx.save(); [.3, .45, .6, .72].forEach((u, k) => { const p = F(u, .72); ctx.strokeStyle = '#3a2414'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0], p[1] + 30); ctx.stroke(); ctx.beginPath(); ctx.ellipse(p[0], p[1] + 40, 8, 11, 0, 0, 7); ctx.fillStyle = ['#c96a2a', '#a84a1a', '#e8b47c', '#d8823a'][k]; ctx.fill(); ctx.stroke(); }); ctx.restore(); }
function estandartesPared5(ctx, G, hw) { const F = (u, v) => ip(u * G, 0, v * hw), L = (u, v) => ip(0, u * G, v * hw); [[F, .25, '#d2452e'], [F, .5, '#2a4b9b'], [F, .75, '#d9a930'], [L, .35, '#2e8b6a'], [L, .7, '#7a2fa0']].forEach(([P, u, c]) => cara(ctx, [P(u - .06, .85), P(u + .06, .85), P(u + .06, .4), P(u, .32), P(u - .06, .4)], c, { lw: 2 })); }
