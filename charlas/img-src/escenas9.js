// ---------- Charla 6 · el sueño: Belén desde arriba, de noche, con flechas ----------
function casaPlana(g, x, y, w, d, hw, o = {}) {   // techo plano visto desde arriba + fachada al frente (3/4)
  const techo = o.techo || '#f4e8cc', borde = o.borde || '#b89c6a', muro = o.muro || '#b8a07a', muro2 = o.muro2 || '#8a7050';
  g.R(x, y, w, d, techo); g.R(x, y, w, 2, borde); g.R(x, y, 2, d, borde); g.R(x + w - 2, y, 2, d, borde);
  if (o.cupula) { for (let k = 0; k < 9; k++) { const h = Math.round(Math.sqrt(81 - (k - 4) * (k - 4))); g.R(x + w / 2 - 9 + k * 2, y + d / 2 - h / 2, 2, h, k < 4 ? '#f6ecd6' : '#e2d0aa'); } }
  g.R(x - 1, y - 1, w + 2, d + hw + 2, '#5a4632'); g.R(x, y, w, d, techo); g.R(x, y, w, 2, borde); g.R(x, y, 2, d, borde); g.R(x + w - 2, y, 2, d, borde); g.R(x, y + d, w, hw, muro); g.R(x, y + d + hw - 2, w, 2, muro2);
  const pu = Math.round(x + w * (o.pu || .5)) - 3; g.R(pu, y + d + hw - 9, 6, 9, '#6a3e22'); g.R(pu + 1, y + d + hw - 8, 4, 1, '#8a5a32');
  (o.ventanas || [.2, .8]).forEach(t => { const vx = Math.round(x + w * t) - 2; g.R(vx - 1, y + d + 2, 6, 6, '#5a4632'); g.R(vx, y + d + 3, 4, 4, '#ffd27a'); g.R(vx, y + d + 3, 4, 1, '#fff6d0'); });
  if (o.toldo) { g.R(x + 3, y + d - 1, w - 6, 3, o.toldo); for (let i = x + 3; i < x + w - 3; i += 4) g.R(i, y + d + 2, 2, 1, o.toldo); }
}
function palmera(g, x, y) { g.R(x, y - 16, 2, 16, '#8a5a32'); g.R(x + 1, y - 16, 1, 16, '#6a4222'); [[-8, -2], [8, -2], [-6, 3], [6, 3], [0, -6]].forEach(([dx, dy]) => { for (let k = 0; k <= 8; k++) { const px = x + 1 + Math.round(dx * k / 8), py = y - 17 + Math.round(dy * k / 8 + (k * k) / 20); g.R(px - 1, py, 3, 2, k % 2 ? '#3f8a4a' : '#57a85a'); } }); }
function burbujaNota(ctx, x, y, c, t) {
  ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 24; ctx.fillStyle = '#fff6e0'; ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
  ctx.lineWidth = 5; ctx.strokeStyle = c; ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 8, y + 22); ctx.lineTo(x, y + 38); ctx.lineTo(x + 8, y + 22); ctx.fillStyle = '#fff6e0'; ctx.fill();
  ctx.fillStyle = c; ctx.font = '700 30px Outfit'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('♪', x, y + 2);
  if (t) { ctx.font = '700 17px Outfit'; const w = ctx.measureText(t).width + 22; rr(ctx, x - w / 2, y - 66, w, 28, 14); ctx.fillStyle = 'rgba(28,16,48,.82)'; ctx.fill(); ctx.fillStyle = '#ffe9b0'; ctx.fillText(t, x, y - 52); }
  ctx.restore();
}
ESCENAS['s-belen-noche'] = ctx => {
  const R = rng(91);
  const c = pix(LW, LH, (g, x) => {
    g.R(0, 0, LW, LH, '#d9c49a'); for (let i = 0; i < 900; i++) g.R(Math.floor(R() * LW), Math.floor(R() * LH), 1, 1, R() < .5 ? '#ccb488' : '#e4d2aa');
    // calles anchas de tierra clara
    g.R(0, 112, LW, 30, '#ecdcb6'); g.R(196, 0, 34, LH, '#ecdcb6'); adoquines(g, 196, 112, 34, 30, R);
    for (let i = 0; i < 260; i++) { const px = Math.floor(R() * LW), py = Math.floor(R() * LH); if ((py > 112 && py < 142) || (px > 196 && px < 230)) g.R(px, py, 1, 1, R() < .5 ? '#d8c08e' : '#f0e0bc'); }
    // plaza
    for (let yy = -26; yy <= 26; yy++) for (let xx = -40; xx <= 40; xx++) if (xx * xx / 1600 + yy * yy / 676 < 1) g.px(213 + xx, 127 + yy, (xx + yy) % 7 === 0 ? '#d8c493' : '#ead8b0');
    casaPlana(g, 14, 18, 60, 34, 14, { ventanas: [.25, .75], toldo: '#c8324a' });
    casaPlana(g, 90, 10, 52, 40, 14, { cupula: true, ventanas: [.3, .7] });
    casaPlana(g, 252, 14, 72, 38, 16, { ventanas: [.2, .5, .8], toldo: '#3f6ad8', pu: .5 });   // Salón de Bach
    casaPlana(g, 340, 22, 70, 32, 14, { ventanas: [.3, .7] });
    casaPlana(g, 20, 160, 66, 34, 14, { ventanas: [.25, .75], toldo: '#5fa05a' });
    casaPlana(g, 104, 172, 60, 30, 13, { ventanas: [.3, .7] });
    casaPlana(g, 262, 166, 58, 34, 14, { cupula: true, ventanas: [.25, .75] });
    casaPlana(g, 338, 158, 74, 40, 15, { ventanas: [.2, .5, .8], toldo: '#e8a43a' });   // Teatro
    // campanario
    g.R(158, 30, 22, 22, '#efe1c2'); g.R(158, 30, 22, 2, '#d2bd92'); g.R(164, 36, 10, 10, '#b88a3a'); g.R(166, 38, 6, 6, '#ffd046'); g.R(158, 52, 22, 26, '#dcc79c'); g.R(165, 66, 8, 12, '#6a3e22'); g.R(166, 56, 6, 6, '#ffd27a');
    [[8, 100], [96, 98], [180, 108], [246, 100], [330, 104], [412, 108], [4, 228], [92, 236], [244, 236], [184, 232], [326, 236]].forEach(([px, py]) => palmera(g, px, py));
  });
  subir(ctx, c, K3);
  const O = [];
  O.push({ s: sprFuente(), x: 213, y: 132 });
  O.push({ s: sprSarah({}), x: 206, y: 150 }); O.push({ s: sprRobotB({ ojos: 'feliz', ang: .3 }), x: 186, y: 140 }); O.push({ s: sprSanson({}), x: 228, y: 156 });
  O.push({ s: adulto({ id: 'pastorN', ropa: '#8a6a4a', ropa2: '#6a4a2a', barba: true, pelo: '#5a3a24' }), x: 92, y: 132 });
  O.push({ s: adulto({ id: 'vecina', largo: true, falda: true, ropa: '#5a7dff', ropa2: '#3f5ad0', pelo: '#3a2418' }), x: 360, y: 128 });
  [[60, 140], [72, 146]].forEach(([px, py]) => O.push({ s: sprPaloma(0), x: px, y: py }));
  O.push({ s: sprFarol(), x: 180, y: 118 }); O.push({ s: sprFarol(), x: 246, y: 118 }); O.push({ s: sprPuesto(NC.DO), x: 140, y: 150 });
  O.sort((a, b) => a.y - b.y);
  sombras(ctx, O.map(o => ({ x: o.x * K3, y: o.y * K3, rx: 22, ry: 7, a: .35 })), 6);
  O.forEach(o => sprK(ctx, o.s, o.x * K3, o.y * K3, K3));
  postHD(ctx, { base: 'contrast(1.06) saturate(1.1)', atardecer: ['#a4a8e6', '#7c72c8', '#3e3290'], calidoA: .2, frioA: .55, bloom: .18, polvo: 25, vin: .6, semilla: 9,
    luces: [[57, 60], [78, 60], [122, 62], [144, 62], [228, 66], [264, 66], [312, 66], [312, 168], [276, 168], [270, 248], [288, 248], [362, 255], [396, 255], [420, 255]].map(([x, y]) => ({ x: x * 3, y: y * 3 + 6, r: 34, c: 'rgba(255,200,110,.85)' }))
      .concat([{ x: 540, y: 340, r: 90, c: 'rgba(255,190,100,.8)' }, { x: 738, y: 340, r: 90, c: 'rgba(255,190,100,.8)' }, { x: 640, y: 420, r: 220, c: 'rgba(255,210,150,.3)', modo: 'soft-light' }]) });
  // la estrella
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const sx = 1150, sy = 70;
  const gr = ctx.createRadialGradient(sx, sy, 0, sx, sy, 160); gr.addColorStop(0, 'rgba(255,245,200,.95)'); gr.addColorStop(.2, 'rgba(255,220,150,.45)'); gr.addColorStop(1, 'rgba(255,220,150,0)'); ctx.fillStyle = gr; ctx.fillRect(sx - 160, sy - 160, 320, 320);
  ctx.strokeStyle = 'rgba(255,240,200,.85)'; ctx.lineWidth = 3; [[0, 70], [Math.PI / 2, 90], [Math.PI / 4, 34], [-Math.PI / 4, 34]].forEach(([a, l]) => { ctx.beginPath(); ctx.moveTo(sx - Math.cos(a) * l, sy - Math.sin(a) * l); ctx.lineTo(sx + Math.cos(a) * l, sy + Math.sin(a) * l); ctx.stroke(); });
  ctx.restore();
  // rincones musicales
  burbujaNota(ctx, 92 * 3 - 4, 132 * 3 - 170, NC.FA, 'El pastor: eco con la flauta');
  burbujaNota(ctx, 169 * 3, 30 * 3 + 20, NC.MI, 'Campanas: tan tan taaan');
  burbujaNota(ctx, 288 * 3, 52 * 3 + 10, NC.SI, 'Salón de Bach');
  burbujaNota(ctx, 360 * 3, 128 * 3 - 170, NC.SOL, 'La vecina canta: ¿qué nota es?');
  // interfaz: cinta, corcheas, flechas grandes y botón
  ctx.save(); ctx.font = '700 26px Outfit'; rr(ctx, 26, 22, 270, 52, 12); ctx.fillStyle = '#fbf1d8'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#2a1a3a'; ctx.stroke(); ctx.fillStyle = '#2a1a3a'; ctx.textBaseline = 'middle'; ctx.fillText('Belén · Nochebuena', 44, 49);
  rr(ctx, 1110, 22, 140, 52, 26); ctx.fillStyle = '#fbf1d8'; ctx.fill(); ctx.stroke(); ctx.fillStyle = '#c8901a'; ctx.font = '700 30px Outfit'; ctx.fillText('♪ 12', 1140, 50);
  const dx = 150, dy = 580, s = 62;
  ctx.globalAlpha = .9; ctx.fillStyle = 'rgba(28,16,48,.55)'; ctx.beginPath(); ctx.arc(dx, dy, 128, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([ax, ay], i) => { const bx = dx + ax * s * 1.25, by = dy + ay * s * 1.25; rr(ctx, bx - 42, by - 42, 84, 84, 20); ctx.fillStyle = i === 3 ? '#ffd046' : '#fbf1d8'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#2a1a3a'; ctx.stroke();
    ctx.save(); ctx.translate(bx, by); ctx.rotate(Math.atan2(ay, ax)); ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(-12, -20); ctx.lineTo(-12, 20); ctx.closePath(); ctx.fillStyle = '#2a1a3a'; ctx.fill(); ctx.restore(); });
  ctx.beginPath(); ctx.arc(1130, 590, 78, 0, Math.PI * 2); ctx.fillStyle = '#ff7a5a'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#2a1a3a'; ctx.stroke();
  ctx.fillStyle = '#fff6e0'; ctx.font = '700 46px Outfit'; ctx.textAlign = 'center'; ctx.fillText('♪', 1130, 574); ctx.font = '700 24px Outfit'; ctx.fillText('¡Toca!', 1130, 622);
  ctx.restore();
};
ESCENAS['ref-personajes'] = ctx => {
  ctx.fillStyle = '#f6ecd6'; ctx.fillRect(0, 0, 1280, 720);
  const L = [['Bach', sprBach({ cara: 'feliz' })], ['Sarah', sprSarah({})], ['David', sprDavid({})], ['Tic', sprRobotB({ ojos: 'feliz' })], ['Papá', PAPA()], ['Mamá', MAMA()], ['Sansón', sprSanson({})]];
  const W = 1280 / L.length;
  L.forEach(([n, s], i) => { const k = Math.min(6, Math.floor(420 / s.height), Math.floor((W - 20) / s.width)); sprK(ctx, s, W * i + W / 2, 560, k); ctx.fillStyle = '#1b1626'; ctx.font = '700 28px Outfit'; ctx.textAlign = 'center'; ctx.fillText(n, W * i + W / 2, 620); });
};
