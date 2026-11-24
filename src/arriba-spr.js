// =====================================================================
//  M5 · BELÉN DESDE ARRIBA (3/4 top-down, tipo Pokémon clásico): sprites en píxel
//  Personas en 4 direcciones × 4 cuadros (parpadeo y respiración), Sansón caminando, edificios con altura,
//  utilería de la calle. Arte en píxeles de 1 (baldosa = 16), se pinta a ×3. Contorno de tinta automático (sprite()).
// =====================================================================
const KA = 3, TA = 16;                       // escala del arte y lado de la baldosa (en píxeles de arte)
const NOCHE5 = '#9a94da';                     // la noche azul-morada (multiplica), sutil
// tiñe un lienzo de noche conservando su transparencia
function nocturno5(c, color = NOCHE5) { const x = c.getContext('2d'), o = copia(c); x.save(); x.globalCompositeOperation = 'multiply'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height); x.globalCompositeOperation = 'destination-in'; x.drawImage(o, 0, 0); x.restore(); return c; }
// contorno de 1 px por fuera (como el de los sprites), para los lienzos que no pasan por sprite()
function contornoTinta5(c, col = '#2a1f3a') { const x = c.getContext('2d'), W = c.width, H = c.height, d = x.getImageData(0, 0, W, H), a = d.data, src = new Uint8ClampedArray(a), oc = hex2(col);
  for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) { const i = (yy * W + xx) * 4; if (src[i + 3] > 40) continue; let hit = false; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = xx + dx, ny = yy + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; if (src[(ny * W + nx) * 4 + 3] > 140) { hit = true; break; } } if (hit) { a[i] = oc[0]; a[i + 1] = oc[1]; a[i + 2] = oc[2]; a[i + 3] = 255; } }
  x.putImageData(d, 0, 0); return c; }
// ---------- PERSONAS ----------
// o: { piel, piel2, pelo, pelo2, ojo, ropa, ropa2, ropa3, falda, larga (túnica hasta el tobillo), pierna, zapato, capa, capa2,
//      peinado: 'largo'|'corto'|'rizos'|'calvo', barba, velo, cinta, tiara, adulto, baculo, bolso, delantal }
const PERS5 = {
  sarah: { piel: SH.skin, piel2: SH.skin2, pelo: SH.hair, pelo2: SH.hair2, pelo3: SH.hair3, ojo: SH.eye, iris: SH.iris, rubor: SH.blush, boca: SH.mouth, ropa: SH.d, ropa2: SH.d3, ropa3: SH.d2, falda: true, pierna: SH.skin, zapato: SH.shoe, peinado: 'largo', tiara: true, capa: '#2a4b9b', capa2: '#1d3672' },
  david: { piel: DV.skin, piel2: DV.skin2, pelo: DV.hair, pelo2: DV.hair2, pelo3: DV.hair3, ojo: DV.eye, rubor: DV.blush, boca: DV.mouth, ropa: DV.tun, ropa2: DV.tun3, ropa3: DV.tun2, chaleco: DV.vest, cinturon: DV.belt, pierna: DV.skin, zapato: DV.sand, peinado: 'rizos', cinta: DV.band, capa: '#8a3a22', capa2: '#6a2a16', bolso: DV.bag },
};
const TRAJES5 = { medieval: { ropa: '#2e8b6a', ropa2: '#1f6a50', ropa3: '#6fcfa6', capa: '#d9a930', capa2: '#a87a10' }, barroco: { ropa: '#7a3fc8', ropa2: '#55288f', ropa3: '#b48aff', capa: '#d2452e', capa2: '#9a2a1a' }, andino: { ropa: '#d2452e', ropa2: '#9a2a1a', ropa3: '#ff8a5a', capa: '#ffd046', capa2: '#c8901a', ruana: true } };
function persona5(base, traje) { return Object.assign({}, base, traje && TRAJES5[traje] || {}); }
const PIES5 = [[0, 0], [1, 0], [0, 0], [0, 1]];   // pie levantado (izq, der) por cuadro
function sprPersona5(o, dir = 'abajo', f = 0, ojos = null, resp = 0) {
  const clave = 'pa' + (o.id || JSON.stringify(o).length + (o.ropa || '') + (o.pelo || '')) + dir + f + (ojos || '') + resp;
  return cache(clave, () => {
    const A = !!o.adulto, W = A ? 20 : 18, H = A ? 33 : 28, cx = W / 2 - 1, camina = f % 2 === 1, b = (camina ? -1 : 0) + (resp ? -1 : 0) * 0, rr0 = resp ? 1 : 0;
    return sprite(W, H, g => {
      const P = o, piel = P.piel || '#e8b48c', piel2 = P.piel2 || '#c98e62', pelo = P.pelo || '#4a2a18', pelo2 = P.pelo2 || mezcla(pelo, '#ffffff', .2), pelo3 = P.pelo3 || mezcla(pelo, '#ffffff', .4);
      const ropa = P.ropa || '#8a6a40', ropa2 = P.ropa2 || mezcla(ropa, '#000', .25), ropa3 = P.ropa3 || mezcla(ropa, '#fff', .3), zap = P.zapato || '#5a3418', pier = P.pierna || piel;
      const yH = 1 + b + (A ? 0 : 0), cab = 12, yT = yH + cab + 1, tT = A ? 9 : 7, yL = H - (A ? 7 : 6);   // cabeza, tronco, piernas
      const [la, ra] = PIES5[f % 4];
      const lado = dir === 'lado', atras = dir === 'arriba';
      // ---- capa (detrás) ----
      if (P.capa && !lado) { const cw = atras ? 12 : 12; g.R(cx - cw / 2 + 1, yT, cw, tT + (atras ? 4 : 1), atras ? P.capa : P.capa2); if (atras) { g.R(cx - cw / 2 + 1, yT + tT + 3, cw, 1, P.capa2); g.px(cx - cw / 2 + 2, yT + 1, mezcla(P.capa, '#fff', .3)); } }
      if (P.capa && lado) { g.R(cx - 5, yT, 4, tT + 3, P.capa); g.R(cx - 5, yT + tT + 2, 4, 1, P.capa2); }
      // ---- piernas ----
      const pierna = (x, alza, oscuro) => { const y0 = yL, y1 = H - 2 - alza; g.R(x, y0, 2, y1 - y0, oscuro ? mezcla(pier, '#000', .2) : pier); g.R(x - (lado ? 0 : 0), y1, lado ? 3 : 2, 2, oscuro ? mezcla(zap, '#000', .25) : zap); };
      if (!lado) { pierna(cx - 2, la); pierna(cx + 1, ra); }
      else { const st = f === 1 ? 2 : f === 3 ? -2 : 0; pierna(cx - 1 - st, f === 3 ? 1 : 0, true); pierna(cx - 1 + st, f === 1 ? 1 : 0); }
      // ---- tronco ----
      const tw = A ? 10 : 8, tx = cx - tw / 2 + 1 - (lado ? 0 : 0), lw = lado ? tw - 2 : tw, lx = lado ? tx + 1 : tx;
      if (P.falda || P.larga) {   // falda o túnica acampanada
        const hasta = P.larga ? H - 3 : yL + 3;
        for (let y = yT; y < hasta; y++) { const k = Math.max(0, y - (yT + 3)), ww = lw + Math.min(lado ? 3 : 5, Math.floor(k * (P.larga ? .5 : .9))), xx = lx - Math.floor((ww - lw) / 2) - (lado && k > 0 ? 1 : 0);
          g.R(xx, y, ww, 1, ropa); g.px(xx, y, ropa2); if (!lado) g.px(xx + ww - 1, y, ropa3); }
        g.R(lx - (lado ? 1 : 2), hasta - 1, lw + (lado ? 3 : 4) + (P.larga ? 0 : 1), 1, P.falda ? ropa3 : ropa2);
        if (P.falda && !lado) [[1, 2], [4, 4], [6, 1]].forEach(([dx, dy]) => g.px(lx + dx, yT + 4 + dy, '#ffffff'));
      } else { g.R(lx, yT, lw, tT + 1, ropa); g.R(lx, yT, 1, tT + 1, ropa2); g.R(lx + lw - 1, yT, 1, tT + 1, ropa3); g.R(lx, yT + tT, lw, 1, ropa2); }
      if (P.chaleco && !atras) { if (lado) g.R(lx + 1, yT, 3, tT - 1, P.chaleco); else { g.R(lx, yT, 2, tT - 1, P.chaleco); g.R(lx + lw - 2, yT, 2, tT - 1, P.chaleco); } }
      if (P.cinturon) g.R(lx, yT + tT - 3, lw, 1, P.cinturon);
      if (P.delantal && !atras) g.R(lx + 1 + (lado ? 2 : 0), yT + 2, lado ? 3 : lw - 2, tT + 2, P.delantal);
      if (P.ruana && !lado) { g.R(lx - 1, yT, lw + 2, 4, P.capa); for (let x = lx - 1; x < lx + lw + 1; x += 2) g.px(x, yT + 4, P.capa2); }
      if (P.bolso && !atras) { if (lado) { g.R(lx - 1, yT + 3, 3, 4, P.bolso); } else { g.px(lx + 1, yT, '#6a3a1a'); g.px(lx + 2, yT + 1, '#6a3a1a'); g.R(lx + lw - 2, yT + tT - 3, 3, 3, P.bolso); } }
      // cuello de la capa (broche) al frente
      if (P.capa && dir === 'abajo') { g.R(lx, yT, lw, 1, P.capa); g.px(cx, yT + 1, '#ffd046'); }
      // ---- brazos (se balancean) ----
      const brazo = (x, dy, oscuro) => { g.R(x, yT + 1 + dy, 2, tT - 3, oscuro ? ropa2 : ropa); g.R(x, yT + tT - 2 + dy, 2, 2, oscuro ? piel2 : piel); };
      if (!lado) { const s = f === 1 ? 1 : f === 3 ? -1 : 0; brazo(lx - 2, atras ? -s : s); brazo(lx + lw, atras ? s : -s); }
      else { const s = f === 1 ? 2 : f === 3 ? -2 : 0; g.R(cx - 1 + s, yT + 1, 2, tT - 3, ropa2); g.R(cx - 1 + s + (s > 0 ? 1 : s < 0 ? -1 : 0), yT + tT - 2, 2, 2, piel); }
      if (P.baculo && !atras) { const bx = lado ? cx + 4 : lx + lw + 2; g.R(bx, yT - 8, 1, tT + 10 + (A ? 3 : 0), '#8a5a2a'); g.R(bx - 2, yT - 9, 3, 1, '#8a5a2a'); g.px(bx - 2, yT - 8, '#8a5a2a'); }
      // ---- cabeza ----
      const hy = yH + rr0 * 0, hc = hy + 6;
      // pelo largo por detrás (de espaldas o de lado)
      if (P.peinado === 'largo') { if (atras) { for (let y = hc; y < yT + tT - 1; y++) { const w = y < yT + 2 ? 12 : 10 - Math.floor((y - yT) / 3); g.R(cx - w / 2 + 1, y, w, 1, y % 3 ? pelo : pelo2); } } else if (lado) { for (let y = hc; y < yT + 6; y++) g.R(cx - 6, y, 5, 1, y % 3 ? pelo : pelo2); } else { g.R(cx - 6, hc, 2, 9, pelo); g.R(cx + 6, hc, 2, 9, pelo); g.px(cx - 6, hc + 9, pelo2); g.px(cx + 7, hc + 9, pelo2); } }
      if (P.velo) { const v = P.velo, v2 = mezcla(v, '#000', .2); g.ellE(cx - 6, hy - 1, 15, 14, v); if (!lado && !atras) { g.R(cx - 6, hc, 2, 9, v2); g.R(cx + 7, hc, 2, 9, v2); } else if (lado) g.R(cx - 6, hc, 5, 10, v2); else g.R(cx - 6, hc, 15, 9, v2); }
      // cráneo
      g.ellE(cx - 5, hy, 13, 12, P.velo ? P.velo : pelo);
      if (!atras) {   // cara
        if (lado) { g.ellE(cx - 1, hy + 2, 9, 10, piel); g.R(cx + 6, hy + 6, 2, 2, piel); g.px(cx + 7, hy + 7, piel2); }
        else { g.ellE(cx - 4, hy + 2, 11, 10, piel); g.R(cx - 4, hy + 6, 1, 4, piel2); }
        // flequillo
        if (!P.velo && P.peinado !== 'calvo') { if (lado) { g.R(cx - 4, hy, 9, 3, pelo); g.R(cx - 5, hy + 2, 5, 6, pelo); g.px(cx + 4, hy + 3, pelo); g.px(cx - 1, hy + 3, pelo2); }
          else { g.R(cx - 4, hy + 1, 11, 2, pelo); for (let x = cx - 4; x < cx + 7; x++) if ((x + 1) % 3) g.px(x, hy + 3, pelo); g.px(cx - 1, hy + 1, pelo3); g.px(cx + 3, hy + 2, pelo2); if (P.peinado === 'rizos') { [-5, 7].forEach(dx => { g.px(cx + dx, hy + 3, pelo2); g.px(cx + dx, hy + 5, pelo); }); } } }
        if (P.velo && !lado) { g.R(cx - 4, hy + 1, 11, 2, P.velo); g.R(cx - 5, hy + 3, 1, 7, mezcla(P.velo, '#000', .15)); g.R(cx + 7, hy + 3, 1, 7, mezcla(P.velo, '#000', .15)); }
        // ojos
        const ojo = x => { if (ojos === 'blink') { g.R(x, hy + 8, 2, 1, P.ojo || '#2b1740'); return; } if (ojos === 'happy') { g.px(x, hy + 7, P.ojo || INK); g.px(x + 1, hy + 7, P.ojo || INK); g.px(x - 1, hy + 8, P.ojo || INK); g.px(x + 2, hy + 8, P.ojo || INK); return; }
          g.R(x, hy + 6, 2, 3, P.ojo || '#2b1740'); g.px(x, hy + 6, '#ffffff'); if (P.iris) g.px(x + 1, hy + 8, P.iris); };
        if (lado) { ojo(cx + 3); g.px(cx + 1, hy + 9, P.rubor || '#f0a090'); g.px(cx + 5, hy + 10, P.boca || '#a0503a'); }
        else { ojo(cx - 2); ojo(cx + 3); g.px(cx - 3, hy + 9, P.rubor || '#f0a090'); g.px(cx + 6, hy + 9, P.rubor || '#f0a090'); g.R(cx, hy + 10, 2, 1, P.boca || '#a0503a'); }
        if (P.barba) { if (lado) { g.R(cx + 1, hy + 10, 6, 2, P.barba); g.R(cx + 2, hy + 12, 4, 1, P.barba); } else { g.R(cx - 3, hy + 10, 9, 2, P.barba); g.R(cx - 2, hy + 12, 7, 1, P.barba); g.px(cx - 3, hy + 9, P.barba); g.px(cx + 5, hy + 9, P.barba); g.R(cx, hy + 10, 2, 1, P.boca || '#7a3a2a'); } }
      } else {   // de espaldas: todo pelo, con brillo
        g.R(cx - 2, hy + 2, 4, 1, pelo3); g.R(cx - 3, hy + 5, 2, 1, pelo2);
        if (P.peinado === 'rizos') for (let y = hy + 3; y < hy + 11; y += 3) for (let x = cx - 4; x < cx + 7; x += 3) g.px(x, y, pelo2);
      }
      if (P.tiara) { if (atras) g.R(cx - 2, hy + 1, 6, 1, '#e6a21b'); else if (lado) { g.R(cx - 1, hy, 4, 1, '#ffd046'); g.px(cx + 1, hy - 1, '#ff4f86'); } else { g.R(cx - 2, hy, 6, 1, '#ffd046'); g.R(cx, hy - 1, 2, 1, '#ff4f86'); g.px(cx - 2, hy - 1, '#ffd046'); g.px(cx + 3, hy - 1, '#ffd046'); } }
      if (P.cinta) { const c2 = mezcla(P.cinta, '#000', .3); if (atras) { g.R(cx - 5, hy + 4, 13, 1, P.cinta); g.R(cx, hy + 5, 1, 4, c2); g.R(cx + 1, hy + 5, 1, 3, P.cinta); } else if (lado) { g.R(cx - 4, hy + 3, 10, 1, P.cinta); g.R(cx - 6, hy + 4, 2, 3, c2); } else g.R(cx - 5, hy + 3, 13, 1, P.cinta); }
      if (P.sombrero) { const s = P.sombrero; g.R(cx - 6, hy + 1, 15, 2, s); g.ellE(cx - 3, hy - 3, 9, 6, s); g.R(cx - 3, hy, 9, 1, mezcla(s, '#000', .3)); }
    }, { ax: W / 2, ay: H });
  });
}
// ---------- SANSÓN (golden de pelo largo) en 4 direcciones ----------
function sprSansonA5(dir = 'abajo', f = 0) {
  return cache('sanA' + dir + f, () => {
    const G = '#e8b060', G2 = '#c98a3a', G3 = '#ffd89a', G4 = '#a86a28', N = '#2a1a1a';
    if (dir === 'lado') return sprite(30, 21, g => {
      const st = [0, 2, 0, -2][f % 4], cola = f % 2;
      // cola de plumero
      for (let k = 0; k < 7; k++) g.R(0 + k, 5 - Math.round(Math.sin(k / 2 + cola) * 2) - (cola ? 1 : 0), 3, 3, k % 2 ? G2 : G);
      // patas de atrás y de adelante (paso alternado)
      [[8 - st, 1], [11 + st, 0], [19 + st, 1], [22 - st, 0]].forEach(([x, o2]) => { g.R(x, 13, 3, 6, o2 ? G2 : G); g.R(x, 18, 3, 1, G4); });
      // cuerpo con flecos
      g.ellE(5, 5, 20, 10, G2); g.ellE(5, 4, 20, 9, G); g.R(9, 6, 10, 1, G3); for (let x = 7; x < 23; x += 2) g.R(x, 13, 2, 1 + (x % 4 ? 1 : 0), G2);
      // cabeza
      g.ellE(19, 0, 9, 9, G2); g.ellE(19, 0, 8, 8, G); g.ellE(24, 4, 6, 4, G3); g.R(28, 5, 2, 2, N); g.px(25, 3, N); g.R(25, 7, 3, 1, G4);
      g.ellE(18, 2, 5, 9, G4); g.ellE(18, 2, 4, 8, G2);   // oreja larga
    }, { ax: 15, ay: 21 });
    if (dir === 'abajo') return sprite(20, 22, g => {
      const c = f % 2;
      g.R(1 + c, 9, 3, 3, G2); g.R(16 - c, 9, 3, 3, G2);   // cola que asoma
      g.ellE(3, 8, 14, 12, G2); g.ellE(4, 8, 12, 11, G); g.R(7, 12, 6, 4, G3);   // pecho
      [[5, 0], [12, 0]].forEach(([x], i) => { const l = (f === 1 && i === 0) || (f === 3 && i === 1) ? 1 : 0; g.R(x, 16 - l, 3, 5, G); g.R(x, 20 - l, 3, 1, G4); });
      g.ellE(3, 0, 14, 12, G2); g.ellE(4, 0, 12, 11, G); g.ellE(6, 5, 8, 6, G3); g.R(9, 8, 2, 2, N); g.R(8, 10, 4, 1, G4);
      g.px(7, 5, N); g.px(12, 5, N); g.px(7, 4, '#fff');
      g.ellE(1, 1, 5, 11, G4); g.ellE(14, 1, 5, 11, G4); g.ellE(2, 1, 4, 10, G2); g.ellE(14, 1, 4, 10, G2);   // orejas
    }, { ax: 10, ay: 22 });
    return sprite(20, 22, g => {   // de espaldas: la cola arriba meneándose
      const c = [0, 2, 0, -2][f % 4];
      g.ellE(3, 6, 14, 14, G2); g.ellE(4, 6, 12, 13, G); g.R(8, 8, 4, 6, G3);
      [[5], [12]].forEach(([x], i) => { const l = (f === 1 && i === 0) || (f === 3 && i === 1) ? 1 : 0; g.R(x, 17 - l, 3, 4, G2); });
      for (let k = 0; k < 6; k++) g.R(8 + c * (k / 6), 14 + k, 4, 2, k % 2 ? G2 : G3);
      g.ellE(4, 0, 12, 10, G2); g.ellE(5, 0, 10, 9, G); g.ellE(2, 2, 4, 9, G4); g.ellE(14, 2, 4, 9, G4);
    }, { ax: 10, ay: 22 });
  });
}
// ---------- EDIFICIOS (3/4 desde arriba: techo + fachada al frente) ----------
/* M7: adobe de Belén (como la ilustración de la noche): ocres y arena, más cálidos y oscuros que la piedra clara de antes */
const PIEDRA5 = [['#d6ad7e', '#b88c60', '#e8c89c', '#946a44'], ['#cfa274', '#b0845a', '#e2bf92', '#8c6440'], ['#dbb68a', '#bf9468', '#ecd2a8', '#9a7250'], ['#c99a6c', '#a87c54', '#ddb688', '#86603c']];
// o: { w, h (baldosas), fh (alto de fachada en baldosas), techo:'plano'|'teja'|'cupula'|'torre'|'abierto', col, toldo, letrero:{c, icono}, ventanas:n, pisos, alto (px de arte sobre la huella), puerta:'arco'|'doble'|'reja'|false, extra(g, W, Hs, Y0) }
function sprEdificio5(o) {
  return cache('ed' + JSON.stringify(o, (k, v) => typeof v === 'function' ? String(v).length : v), () => {
    const W = o.w * TA, Hh = o.h * TA, alto = o.alto || 0, Hs = Hh + alto, fh = Math.round((o.fh || 3) * TA), Y0 = alto, yF = Y0 + Hh - fh;
    const S = PIEDRA5[(o.col || 0) % PIEDRA5.length];
    const c = canvas(W + 2, Hs + 2), x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.translate(1, 1); const g = Pen(x);
    const luces = [];   // ventanas y faroles: se pintan DESPUÉS de la noche (brillan)
    // ---- techo ----
    const tc = o.techo || 'plano';
    if (tc === 'teja') {
      const T = o.teja || ['#c0603f', '#9a4430', '#de8a62'];
      g.R(0, Y0, W, yF - Y0, T[0]);
      const cum = Y0 + Math.round((yF - Y0) * .42);
      for (let y = Y0 + 2; y < yF; y += 4) { g.R(0, y, W, 1, T[1]); for (let xx = (y / 4 % 2) * 3; xx < W; xx += 6) g.R(xx, y - 2, 1, 2, T[1]); }
      g.R(0, cum, W, 2, T[2]); g.R(0, cum + 2, W, 1, T[1]);
      g.R(0, Y0, W, 1, T[2]); g.R(0, Y0, 1, yF - Y0, T[1]); g.R(W - 1, Y0, 1, yF - Y0, T[1]);
      g.R(0, yF - 2, W, 2, T[1]);
      if (o.chimenea !== false) { const cxh = Math.round(W * .76); g.R(cxh, Y0 + 3, 6, 9, S[1]); g.R(cxh, Y0 + 3, 6, 2, S[3]); g.R(cxh + 1, Y0 + 2, 4, 1, '#4a3a3a'); }
    } else if (tc !== 'abierto') {
      // techo plano de piedra con pretil (Belén) y cosas encima
      g.R(0, Y0, W, yF - Y0, S[1]); g.R(3, Y0 + 3, W - 6, yF - Y0 - 6, mezcla(S[0], S[1], .35)); for (let yy = Y0 + 3; yy < yF - 3; yy += 8) { g.R(3, yy, W - 6, 1, mezcla(S[0], S[3], .35)); for (let xx = 3 + ((yy / 8) % 2) * 6; xx < W - 3; xx += 12) g.R(xx, yy, 1, 8, mezcla(S[0], S[3], .3)); } g.R(3, Y0 + 3, W - 6, 2, mezcla(S[1], S[3], .5)); g.R(3, Y0 + 3, 2, yF - Y0 - 6, mezcla(S[1], S[3], .5));
      for (let k = 0; k < (W * (yF - Y0)) / 40; k++) { const R = (k * 9301 + 49297) % 233280 / 233280, R2 = (k * 7919 + 1237) % 1000 / 1000; g.px(3 + Math.floor(R * (W - 6)), Y0 + 3 + Math.floor(R2 * (yF - Y0 - 6)), k % 2 ? S[1] : S[2]); }
      g.R(0, Y0, W, 2, S[2]); g.R(0, Y0, 2, yF - Y0, S[2]); g.R(W - 2, Y0, 2, yF - Y0, S[3]); g.R(0, yF - 2, W, 2, S[3]);
      if (tc === 'cupula' || tc === 'torre') {
        const cw = Math.min(W - 10, o.cw || 34), cxh = Math.round(W / 2 - cw / 2), base = yF - 4, ch = Math.round(cw * .7), cupC = o.cupula || ['#5a86c4', '#3f6aa8', '#9fc4ef'];
        if (tc === 'torre') { const tw = cw, th = (o.th || 40); g.R(cxh, base - th, tw, th, S[0]); g.R(cxh, base - th, 2, th, S[2]); g.R(cxh + tw - 3, base - th, 3, th, S[1]); for (let y = base - th + 6; y < base; y += 6) g.R(cxh, y, tw, 1, S[3]);
          const ay = base - th + 6; [[cxh + 4], [cxh + tw - 10]].forEach(([ax]) => { g.R(ax, ay, 6, 10, '#3a2a4a'); g.R(ax + 1, ay - 2, 4, 2, '#3a2a4a'); });
          if (o.campana) { g.R(cxh + tw / 2 - 3, ay + 1, 6, 6, '#e6a21b'); g.R(cxh + tw / 2 - 4, ay + 6, 8, 1, '#c8901a'); }
          for (let y = 0; y < ch; y++) { const ww = Math.round(tw * Math.sqrt(1 - Math.pow(1 - y / ch, 2)) * .5) * 2; g.R(cxh + tw / 2 - ww / 2, base - th - ch + y, ww, 1, y % 5 === 4 ? cupC[1] : cupC[0]); g.px(cxh + tw / 2 - ww / 2 + 1, base - th - ch + y, cupC[2]); }
          if (o.punta) { g.R(cxh + tw / 2 - 1, base - th - ch - 8, 2, 8, '#ffd046'); if (o.punta === 'cruz') g.R(cxh + tw / 2 - 3, base - th - ch - 6, 6, 2, '#ffd046'); if (o.punta === 'estrella') { g.disc(cxh + tw / 2, base - th - ch - 10, 3, '#ffd046'); luces.push(['b', cxh + tw / 2, base - th - ch - 10, 10]); } if (o.punta === 'nota') { g.ellE(cxh + tw / 2 - 5, base - th - ch - 4, 6, 4, '#ffd046'); } }
        } else { for (let y = 0; y < ch; y++) { const ww = Math.round(cw * Math.sqrt(1 - Math.pow(1 - y / ch, 2)) * .5) * 2; g.R(cxh + cw / 2 - ww / 2, base - ch + y, ww, 1, y % 5 === 4 ? cupC[1] : cupC[0]); g.px(cxh + cw / 2 - ww / 2 + 1, base - ch + y, cupC[2]); } g.R(cxh, base, cw, 2, S[3]); g.R(cxh + cw / 2 - 1, base - ch - 5, 2, 5, '#ffd046'); }
      }
      if (o.techoCosas !== false && tc === 'plano') { const R = rng(o.w * 31 + o.h * 7 + (o.col || 0)); for (let k = 0; k < Math.max(2, Math.floor(o.w / 2)); k++) { const px = 5 + Math.floor(R() * (W - 16)), py = Y0 + 4 + Math.floor(R() * Math.max(1, yF - Y0 - 14)); const t = R(); if (t < .35) { g.ellE(px, py, 7, 8, '#c07a4a'); g.R(px + 2, py, 3, 1, '#7a4a2a'); } else if (t < .6) { g.R(px, py, 10, 1, '#8a6a4a'); [0, 3, 6].forEach((dx, i) => g.R(px + dx, py + 1, 3, 5, ['#fbf1d8', '#5a86c4', '#d2452e'][i])); } else if (t < .8) { g.ellE(px, py, 9, 7, '#4a8a4a'); g.px(px + 3, py + 2, '#ff9cc4'); } } }
    }
    // ---- fachada ----
    const pisos = o.pisos || (fh >= 52 ? 2 : 1);
    g.R(0, yF, W, fh, S[0]);
    for (let y = yF + 5; y < yF + fh - 4; y += 5) { g.R(0, y, W, 1, mezcla(S[0], S[1], .55)); for (let xx = (Math.floor(y / 5) % 2) * 5; xx < W; xx += 10) g.R(xx, y - 4, 1, 4, mezcla(S[0], S[1], .45)); }
    g.R(0, yF, W, 2, S[2]); g.R(0, yF + 2, W, 1, S[3]);   // cornisa
    g.R(0, yF + fh - 4, W, 4, S[1]); g.R(0, yF + fh - 4, W, 1, S[3]);   // zócalo
    g.R(0, yF, 2, fh, S[2]); g.R(W - 2, yF, 2, fh, S[3]);
    if (o.columnas) for (let k = 0; k <= o.columnas; k++) { const cxk = Math.round(4 + k * (W - 12) / o.columnas); g.R(cxk, yF + 4, 4, fh - 8, S[2]); g.R(cxk + 3, yF + 4, 1, fh - 8, S[3]); g.R(cxk - 1, yF + 3, 6, 2, S[2]); }
    // puerta
    const pw = o.puerta === 'doble' ? 18 : 12, ph = Math.min(fh - 6, 21), pxd = Math.round(W / 2 - pw / 2), pyd = yF + fh - ph;
    if (o.puerta !== false) {
      g.R(pxd - 2, pyd - 3, pw + 4, ph + 3, S[2]); g.R(pxd - 2, pyd - 3, pw + 4, 1, S[3]);
      for (let y = 0; y < ph; y++) { const r = pw / 2, dy = y < r ? r - y : 0, half = y < r ? Math.round(Math.sqrt(Math.max(0, r * r - dy * dy))) : r; g.R(pxd + r - half, pyd + y, half * 2, 1, o.puerta === 'reja' ? '#2a2030' : '#6e4426'); }
      if (o.puerta === 'reja') { for (let xx = pxd + 1; xx < pxd + pw; xx += 3) g.R(xx, pyd + 2, 1, ph - 2, '#8a7a6a'); }
      else { for (let xx = pxd + 2; xx < pxd + pw - 1; xx += 3) g.R(xx, pyd + 4, 1, ph - 4, '#8a5a34'); g.px(pxd + pw - 4, pyd + ph / 2 + 2, '#ffd046'); if (o.puerta === 'doble') g.R(pxd + pw / 2, pyd + 2, 1, ph - 2, '#4a2a16'); }
      g.R(pxd - 3, yF + fh - 1, pw + 6, 1, S[3]);
    }
    // ventanas (con luz cálida de noche)
    const nv = o.ventanas != null ? o.ventanas : Math.max(2, Math.floor(o.w / 2) * 2);
    for (let p = 0; p < pisos; p++) for (let k = 0; k < nv; k++) {
      const vx = Math.round(6 + k * (W - 18) / Math.max(1, nv - 1)), vy = yF + 7 + p * 18, vw = 7, vh = 10;
      if (p === pisos - 1 && o.puerta !== false && vx + vw > pxd - 4 && vx < pxd + pw + 4) continue;
      if (vy + vh > yF + fh - 5) continue;
      g.R(vx - 1, vy - 1, vw + 2, vh + 2, '#5a4632'); g.R(vx - 2, vy + vh + 1, vw + 4, 1, S[3]);
      if (o.contraventanas) { g.R(vx - 4, vy, 3, vh, o.contraventanas); g.R(vx + vw + 1, vy, 3, vh, o.contraventanas); }
      luces.push(['v', vx, vy, vw, vh]);
      if (o.flores && p === pisos - 1) { g.R(vx - 1, vy + vh + 1, vw + 2, 2, '#7a4a2a'); [0, 3, 5].forEach((dx, i) => g.px(vx + dx, vy + vh, ['#ff5a5a', '#ffd046', '#ff9cc4'][i])); }
    }
    if (o.toldo) { const ty = yF + 3, tw = o.toldoAncho || Math.min(W - 8, pw + 26), txx = Math.round(W / 2 - tw / 2); for (let xx = 0; xx < tw; xx++) g.R(txx + xx, ty, 1, 5, Math.floor(xx / 3) % 2 ? o.toldo : '#fbf1d8'); for (let xx = 0; xx < tw; xx += 3) g.px(txx + xx + 1, ty + 5, o.toldo); }
    if (o.letrero) { const lx = Math.round(W / 2 + pw / 2 + 4), ly = pyd - 2; g.R(lx, ly - 2, 1, 3, '#3a2414'); g.R(lx - 1, ly + 1, 13, 11, '#3a2414'); g.R(lx, ly + 2, 11, 9, o.letrero.c || '#d9a930'); iconoLetrero5(g, o.letrero.icono, lx + 5, ly + 6); }
    if (tc === 'plano' && fh > 30) for (let xx = 5; xx < W - 6; xx += 9) { g.R(xx, yF + 4, 3, 3, '#5a3a22'); g.px(xx, yF + 4, '#7a5232'); }   /* las vigas que asoman del adobe */
    if (o.extra) o.extra(g, W, Hs, Y0, yF, fh, luces);
    nocturno5(c, '#9896d4'); contornoTinta5(c, '#2a1f3a');
    // luces encima (no se tiñen)
    luces.forEach(L => { if (L[0] === 'v') { const [, vx, vy, vw, vh] = L; x.fillStyle = '#ffc860'; x.fillRect(vx, vy, vw, vh); x.fillStyle = '#ffe9a8'; x.fillRect(vx + 1, vy + 1, vw - 2, vh - 3); x.fillStyle = '#c88a3a'; x.fillRect(vx + 3, vy, 1, vh); x.fillRect(vx, vy + 4, vw, 1); }
      else if (L[0] === 'r') { x.fillStyle = L[5] || '#ffc860'; x.fillRect(L[1], L[2], L[3], L[4]); } else if (L[0] === 'b') { x.fillStyle = '#fff6c0'; x.beginPath(); x.arc(L[1], L[2], 3, 0, 7); x.fill(); } });
    c.ax = 1; c.ay = Hs + 1; c.luces = luces.map(L => L[0] === 'v' ? [L[1] + L[3] / 2, L[2] + L[4] / 2, 14] : L[0] === 'b' ? [L[1], L[2], L[3]] : [L[1] + L[3] / 2, L[2] + L[4] / 2, 12]); c.alto = alto;
    return c;
  });
}
function iconoLetrero5(g, ic, x, y) {
  const T = '#2a1a3a';
  if (ic === 'nota') { g.R(x + 1, y - 4, 1, 6, T); g.R(x - 2, y + 1, 3, 2, T); g.R(x + 2, y - 4, 2, 1, T); }
  else if (ic === 'notas') { g.R(x - 2, y - 4, 1, 6, T); g.R(x + 2, y - 4, 1, 6, T); g.R(x - 2, y - 4, 5, 1, T); g.R(x - 4, y + 1, 3, 2, T); g.R(x, y + 1, 3, 2, T); }
  else if (ic === 'libro') { g.R(x - 4, y - 3, 4, 6, T); g.R(x + 1, y - 3, 4, 6, T); g.px(x - 3, y - 2, '#fff'); g.px(x + 2, y - 2, '#fff'); }
  else if (ic === 'mascara') { g.R(x - 3, y - 3, 7, 4, T); g.R(x - 2, y + 1, 5, 2, T); g.px(x - 2, y - 2, '#fff'); g.px(x + 2, y - 2, '#fff'); }
  else if (ic === 'martillo') { g.R(x - 3, y - 3, 7, 2, T); g.R(x, y - 1, 1, 5, T); }
  else if (ic === 'estrella') { g.R(x - 3, y, 7, 1, T); g.R(x, y - 3, 1, 7, T); g.R(x - 1, y - 1, 3, 3, T); }
  else if (ic === 'tambor') { g.R(x - 3, y - 2, 7, 5, T); g.R(x - 3, y - 2, 7, 1, '#fff'); g.px(x - 4, y - 4, T); g.px(x + 4, y - 4, T); }
  else if (ic === 'mano') { g.R(x - 3, y - 1, 6, 4, T); for (let k = 0; k < 4; k++) g.R(x - 3 + k * 2, y - 4 + (k === 0 || k === 3 ? 1 : 0), 1, 3, T); g.R(x + 3, y, 1, 2, T); }
  else if (ic === 'violin') { g.ellE(x - 2, y - 1, 5, 4, T); g.ellE(x - 2, y + 1, 5, 3, T); g.R(x, y - 5, 1, 4, T); }
  else if (ic === 'casa') { g.R(x - 3, y - 1, 7, 4, T); g.R(x - 2, y - 2, 5, 1, T); g.R(x - 1, y - 3, 3, 1, T); g.px(x, y + 1, '#fff'); }
  else if (ic === 'columna') { g.R(x - 3, y - 3, 7, 1, T); g.R(x - 2, y - 2, 1, 5, T); g.R(x, y - 2, 1, 5, T); g.R(x + 2, y - 2, 1, 5, T); g.R(x - 3, y + 3, 7, 1, T); }
  else if (ic === 'oido') { g.R(x - 2, y - 3, 4, 1, T); g.R(x + 2, y - 2, 1, 4, T); g.R(x - 2, y - 2, 1, 2, T); g.R(x, y + 2, 2, 1, T); }
  else if (ic === 'organo') { [-3, -1, 1, 3].forEach((dx, i) => g.R(x + dx, y - 1 - (i % 2) * 2, 1, 5 + (i % 2) * 2, T)); }
  else if (ic === 'cama') { g.R(x - 4, y, 9, 3, T); g.R(x - 4, y - 2, 2, 2, T); }
}
// ---------- utilería ----------
function sprPalmera5() { return cache('palA', () => { const s = sprite(26, 34, g => { g.R(12, 12, 3, 22, '#8a5a32'); for (let y = 14; y < 34; y += 3) g.R(12, y, 3, 1, '#6a4222'); [[-11, -1], [11, -1], [-9, 5], [9, 5], [0, -7], [-5, -5], [5, -5]].forEach(([dx, dy]) => { for (let k = 0; k <= 9; k++) { const px = 13 + Math.round(dx * k / 9), py = 12 + Math.round(dy * k / 9 + (k * k) / 18); g.R(px - 1, py, 3, 2, k % 2 ? '#3f8a4a' : '#57a85a'); } }); g.R(11, 10, 5, 4, '#6a4222'); g.px(12, 13, '#a86a3a'); }, { ax: 13, ay: 34 }); return nocturno5(s); }); }
function sprOlivo5(v = 0) { return cache('oliA' + v, () => { const s = sprite(28, 30, g => { g.R(12, 16, 4, 14, '#7a5a3a'); g.R(10, 22, 3, 2, '#7a5a3a'); g.R(15, 19, 4, 2, '#6a4a2a'); g.ellE(1, 2, 26, 18, '#64804f'); g.ellE(2, 1, 23, 15, '#8fa572'); g.ellE(5, 2, 12, 8, '#b8c79a'); for (let k = 0; k < 14; k++) g.px(4 + (k * 7) % 20, 4 + (k * 5) % 12, k % 2 ? '#64804f' : '#c8d6aa'); if (v) [[8, 6], [16, 9], [12, 12]].forEach(([x, y]) => g.px(x, y, '#3a2a4a')); }, { ax: 14, ay: 30 }); return nocturno5(s); }); }
function sprCipres5() { return cache('cipA', () => nocturno5(sprite(12, 34, g => { g.R(5, 28, 2, 6, '#6a4a2a'); for (let y = 0; y < 29; y++) { const w = Math.round(Math.sin((y + 2) / 31 * Math.PI) * 5.5) * 2; g.R(6 - w / 2, y, w, 1, y % 4 ? '#3f6a4a' : '#2f5a3a'); } g.R(4, 6, 1, 14, '#5a8a5a'); }, { ax: 6, ay: 34 }))); }
function sprFarol5() { return cache('farA', () => { const s = sprite(8, 30, g => { g.R(3, 9, 2, 20, '#3a2a3a'); g.R(1, 28, 6, 2, '#3a2a3a'); g.R(0, 2, 8, 8, '#3a2a3a'); g.R(1, 3, 6, 6, '#ffc860'); g.R(2, 4, 4, 3, '#fff6c0'); g.R(2, 0, 4, 2, '#3a2a3a'); }, { ax: 4, ay: 30 }); return s; }); }
function sprPuestoA5(c = '#d2452e') { return cache('pueA' + c, () => { const s = sprite(36, 26, g => { g.R(2, 10, 2, 16, '#6a4222'); g.R(32, 10, 2, 16, '#6a4222'); g.R(1, 14, 34, 8, '#a8703a'); g.R(1, 14, 34, 1, '#c98a52'); [[4, '#ff5a5a'], [10, '#ffd046'], [16, '#5fd36a'], [22, '#ff9a3c'], [28, '#b86bff']].forEach(([x, cc]) => { g.disc(x + 2, 12, 2, cc); }); for (let x = 0; x < 36; x++) g.R(x, 0, 1, 9, Math.floor(x / 4) % 2 ? c : '#fbf1d8'); for (let x = 0; x < 36; x += 4) g.R(x, 9, 2, 1, c); }, { ax: 18, ay: 26 }); return nocturno5(s); }); }
function sprBarril5() { return cache('barA', () => nocturno5(sprite(12, 14, g => { g.ellE(0, 0, 12, 5, '#c98a52'); g.R(0, 2, 12, 11, '#9a6038'); g.ellE(0, 0, 12, 4, '#b8743a'); g.R(0, 5, 12, 1, '#5a3418'); g.R(0, 10, 12, 1, '#5a3418'); g.R(2, 3, 1, 10, '#c98a52'); }, { ax: 6, ay: 14 }))); }
function sprCantaro5() { return cache('canA', () => nocturno5(sprite(10, 13, g => { g.ellE(0, 3, 10, 10, '#c07a4a'); g.R(3, 0, 4, 4, '#c07a4a'); g.R(2, 0, 6, 1, '#9a5a32'); g.R(2, 6, 2, 3, '#de9a6a'); }, { ax: 5, ay: 13 }))); }
function sprPozo5() { return cache('pozA', () => { const s = sprite(34, 34, g => { g.ellE(0, 14, 34, 20, '#8a7a6a'); g.ellE(2, 14, 30, 16, '#d8c49a'); g.ellE(7, 17, 20, 10, '#1d2a4a'); g.ellE(11, 19, 8, 3, '#3f6aa8'); g.R(3, 2, 3, 22, '#6a4222'); g.R(28, 2, 3, 22, '#6a4222'); g.R(1, 0, 32, 3, '#8a5a32'); g.R(16, 3, 1, 14, '#c8a070'); g.R(14, 15, 5, 4, '#7a4a2a'); }, { ax: 17, ay: 34 }); return nocturno5(s); }); }
function sprFuenteA5() { return cache('fuA', () => { const s = sprite(44, 34, g => { g.ellE(0, 10, 44, 24, '#a99b8b'); g.ellE(2, 10, 40, 20, '#e2d8ca'); g.ellE(6, 13, 32, 14, '#3f7fd0'); g.ellE(10, 15, 24, 9, '#5fa4ef'); g.R(19, 2, 6, 16, '#e2d8ca'); g.R(19, 2, 2, 16, '#fff'); g.ellE(14, 0, 16, 6, '#c9bcab'); g.R(21, 0, 2, 3, '#bdf0ff'); }, { ax: 22, ay: 34 }); return nocturno5(s, '#b4b0e4'); }); }
function sprCerca5(w = 32, v = false) { return cache('cer' + w + v, () => nocturno5(sprite(v ? 6 : w, v ? w : 12, g => { if (v) { g.R(2, 0, 2, w, '#8a5a32'); for (let y = 0; y < w; y += 10) g.R(0, y, 6, 3, '#a8703a'); } else { g.R(0, 3, w, 2, '#a8703a'); g.R(0, 7, w, 2, '#a8703a'); for (let x = 0; x < w; x += 10) g.R(x, 0, 3, 12, '#8a5a32'); } }, { ax: v ? 3 : 0, ay: v ? w : 12 }))); }
function sprOvejaA5(f = 0, dir = 1) { return cache('ovA' + f, () => sprite(18, 14, g => { g.ellE(1, 2, 14, 10, '#fffaf2'); g.disc(4, 4, 2, '#efe6d8'); g.disc(9, 3, 2, '#efe6d8'); g.ellE(12, f ? 1 : 2, 6, 6, '#3a2a2a'); g.px(15, f ? 3 : 4, '#fff'); g.R(3, 11, 2, 3 - f, '#3a2a2a'); g.R(10, 11, 2, 2 + f, '#3a2a2a'); }, { ax: 9, ay: 14 })); }
function sprBurroA5() { return cache('burA', () => nocturno5(sprite(26, 20, g => { g.R(3, 6, 15, 8, '#9a8a8a'); g.R(3, 13, 2, 7, '#7a6a6a'); g.R(15, 13, 2, 7, '#7a6a6a'); g.R(16, 1, 6, 8, '#9a8a8a'); g.R(18, 0, 2, 3, '#7a6a6a'); g.R(21, 5, 3, 4, '#bcb0b0'); g.px(19, 3, '#2a1a1a'); g.R(0, 7, 3, 1, '#7a6a6a'); }, { ax: 13, ay: 20 }), '#c6c2ec')); }
function sprEstablo5() {   // el pesebre: cobertizo de madera abierto al frente, con paja; la luz de la estrella encima
  return cache('estA', () => { const W = 6 * TA, H = 5 * TA; const c = canvas(W + 2, H + 2), x = c.getContext('2d'); x.translate(1, 1); const g = Pen(x);
    g.R(0, 0, W, 34, '#8a6a4a'); for (let y = 2; y < 34; y += 4) g.R(0, y, W, 1, '#6a4a32'); for (let xx = 0; xx < W; xx += 7) g.R(xx, 0, 1, 34, '#9a7a5a'); g.R(0, 30, W, 4, '#5a3a22');
    g.R(0, 34, W, H - 34, '#3a2a22'); g.R(2, 34, 4, H - 34, '#7a5a3a'); g.R(W - 6, 34, 4, H - 34, '#7a5a3a'); g.R(W / 2 - 2, 34, 4, 10, '#7a5a3a');
    g.R(6, H - 10, W - 12, 10, '#d8b860'); for (let k = 0; k < 30; k++) g.px(6 + (k * 13) % (W - 12), H - 10 + (k * 7) % 10, k % 2 ? '#b89840' : '#f0d888');
    nocturno5(c, '#bcb4e4'); c.ax = 1; c.ay = H + 1; c.alto = 0; return c; });
}
function sprKiosco5() {   // el kiosco de la banda: octógono con techo de cobre
  return cache('kioA', () => { const W = 4 * TA, H = 4 * TA + 12; const c = canvas(W + 2, H + 2), x = c.getContext('2d'); x.translate(1, 1); const g = Pen(x);
    g.ellE(0, 28, W, 30, '#b9a47c'); g.ellE(2, 30, W - 4, 24, '#e9d6b0'); [4, W / 2 - 1, W - 6].forEach(px => g.R(px, 20, 3, 32, '#efe1c2'));
    for (let y = 0; y < 24; y++) { const w = Math.round((W - 2) * (.25 + .75 * y / 24) / 2) * 2; g.R(W / 2 - w / 2, y + 2, w, 1, y % 4 === 3 ? '#4a9483' : '#6fbfa6'); } g.R(W / 2 - 1, 0, 2, 4, '#ffd046');
    for (let k = 0; k < 5; k++) g.px(8 + k * 12, 24, '#ffd046');
    nocturno5(c); c.ax = 1; c.ay = H + 1; c.alto = 12; return c; });
}
function sprArena5() {   // la arena del eco: anfiteatro redondo de piedra con gradas
  return cache('areA', () => { const W = 8 * TA, H = 7 * TA; const c = canvas(W + 2, H + 2), x = c.getContext('2d'); x.translate(1, 1); const g = Pen(x);
    g.ellE(0, 0, W, H - 10, '#b9a47c'); for (let k = 0; k < 5; k++) g.ellE(4 + k * 6, 3 + k * 5, W - 8 - k * 12, H - 16 - k * 10, k % 2 ? '#e9d6b0' : '#d8c49a');
    g.ellE(36, 33, W - 72, H - 76, '#cdb68a'); g.ellE(W / 2 - 7, 46, 14, 8, '#ffd046'); g.R(0, H - 26, W, 16, '#d8c49a');
    for (let k = 0; k < 9; k++) { const px = 4 + k * (W - 12) / 8; g.R(px, H - 30, 6, 20, '#efe1c2'); g.R(px + 1, H - 34, 4, 4, '#3a2a4a'); }
    g.R(W / 2 - 9, H - 30, 18, 20, '#3a2a30'); g.R(0, H - 10, W, 10, '#b9a47c');
    nocturno5(c); c.ax = 1; c.ay = H + 1; c.alto = 0; return c; });
}
function sprCampanario5() { return sprEdificio5({ w: 4, h: 6, fh: 3, techo: 'torre', cw: 40, th: 30, campana: true, punta: 'cruz', alto: 52, col: 2, ventanas: 0, puerta: 'arco' }); }
function sprMuralla5(w) { return cache('mur' + w, () => nocturno5(sprite(w * TA, 26, g => { g.R(0, 6, w * TA, 20, '#c9b48e'); for (let x = 0; x < w * TA; x += 8) { g.R(x, 0, 5, 7, '#d8c49a'); g.R(x, 0, 5, 1, '#efe1c2'); } for (let y = 10; y < 26; y += 5) g.R(0, y, w * TA, 1, '#b39e78'); g.R(0, 6, w * TA, 1, '#efe1c2'); }, { ax: 0, ay: 26 }))); }
