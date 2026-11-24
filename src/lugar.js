// =====================================================================
//  LUGAR: un pueblo o un interior isométrico que se recorre tocando con el dedo
//  suelo y edificios prerenderizados (vector suave), personajes en píxel, niebla de lo no explorado,
//  caminos con A*, entrar/salir de edificios, NPCs con mensajes leídos palabra por palabra, secretos.
// =====================================================================
function crearLugar(def) {
  const T = def.T || T5, G = def.G, GJ = def.GJ || G, PAD = 120, OY = def.oy || 340, OX = GJ * T + PAD;
  const AW = (G + GJ) * T + PAD * 2, AH = (G + GJ) * T / 2 + OY + 160;
  const ipW = (i, j) => [OX + (i - j) * T, OY + (i + j) * T / 2];
  const L = { def, T, G, GJ, ipW, objetos: [], dinamicos: [], visto: null };
  const tipo = [], bloq = [];
  for (let i = 0; i < G; i++) { tipo.push([]); bloq.push([]); for (let j = 0; j < GJ; j++) { const t = def.suelo(i, j); tipo[i].push(t); bloq[i].push(t === 'agua' || t === 'muro' || t === 'x'); } }
  L.tipo = tipo; L.bloq = bloq;
  const dentro = (i, j) => i >= 0 && j >= 0 && i < G && j < GJ;
  L.libre = (i, j) => dentro(i, j) && !bloq[i][j];
  // ---------- prerender del suelo ----------
  function conISO(cx, cy, fn) { const g = { cx: ISO.cx, cy: ISO.cy, t: ISO.t }; ISO.cx = cx; ISO.cy = cy; ISO.t = T; try { fn(); } finally { Object.assign(ISO, g); } }
  const suelo = canvas(AW, AH), sx = suelo.getContext('2d');
  PAL_ = def.paleta || PALS5.A;
  conISO(OX, OY, () => {
    if (def.base) def.base(sx, { AW, AH, ipW, G, GJ });   // grosor del diorama, paredes, etc.
    for (let i = 0; i < G; i++) for (let j = 0; j < GJ; j++) { const t = tipo[i][j], C = def.colores[t] || def.colores.def; if (!C) continue; const pts = [ip(i, j), ip(i + 1, j), ip(i + 1, j + 1), ip(i, j + 1)]; const c = C[(i * 7 + j * 3) % C.length]; cara(sx, pts, c, { lw: .8, lineaC: mezcla(c, '#2a1a3a', .18) }); }
    if (def.decorarSuelo) def.decorarSuelo(sx, { tipo, ipW, G, GJ });
  });
  L.suelo = suelo;
  // ---------- objetos ----------
  def.objetos.forEach(o => {
    const ob = Object.assign({ a: 1, b: 1 }, o);
    if (ob.bloquea !== false) for (let i = Math.floor(ob.i); i < Math.ceil(ob.i + ob.a); i++) for (let j = Math.floor(ob.j); j < Math.ceil(ob.j + ob.b); j++) if (dentro(i, j)) bloq[i][j] = true;
    if (ob.dibujar) {   // vector: a su propio lienzo
      const alto = (ob.alto || 6) * T;
      const x0 = Math.floor(OX + (ob.i - (ob.j + ob.b)) * T - 90), x1 = Math.ceil(OX + (ob.i + ob.a - ob.j) * T + 90), y0 = Math.floor(OY + (ob.i + ob.j) * T / 2 - alto), y1 = Math.ceil(OY + (ob.i + ob.a + ob.j + ob.b) * T / 2 + 40);
      const c = canvas(x1 - x0, y1 - y0), x = c.getContext('2d'); conISO(OX - x0, OY - y0, () => ob.dibujar(x, ob)); ob.lienzo = c; ob.x0 = x0; ob.y0 = y0;
    }
    ob.clave = ob.i + ob.a + ob.j + ob.b;
    L.objetos.push(ob);
  });
  L.objetos.sort((a, b) => a.clave - b.clave);
  // puertas: la baldosa de enfrente queda libre
  L.objetos.forEach(o => { if (o.puerta) { const [pi, pj] = o.puerta; if (dentro(pi, pj)) bloq[pi][pj] = false; } });
  // ---------- jugador, Tic, NPCs ----------
  const J = L.jugador = { fi: def.inicio[0], fj: def.inicio[1], camino: [], paso: 0, mira: 1, quieto: 0, al: null };
  const TIC = L.tic = { x: 0, y: 0, rastro: [] };
  L.npcs = (def.npcs || []).map(n => { const o = Object.assign({}, n); bloq[n.i][n.j] = true; return o; });
  L.secretos = (def.secretos || []).map(s => Object.assign({}, s));
  // ---------- niebla (lo no explorado) ----------
  const NB = 8, niebla = def.niebla ? canvas(Math.ceil(AW / NB), Math.ceil(AH / NB)) : null;
  function pintarNiebla() {
    if (!niebla) return; const x = niebla.getContext('2d'); x.clearRect(0, 0, niebla.width, niebla.height);
    x.fillStyle = 'rgba(28,16,48,.93)'; x.beginPath(); const P = [ipW(-2, -2), ipW(G + 2, -2), ipW(G + 2, GJ + 2), ipW(-2, GJ + 2)]; P.forEach((p, k) => k ? x.lineTo(p[0] / NB, p[1] / NB - 40 / NB) : x.moveTo(p[0] / NB, p[1] / NB - 40 / NB)); x.closePath(); x.fill();
    x.fillRect(0, 0, niebla.width, (OY - 6 * T) / NB);   // lo alto (techos lejanos) también
    x.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < G; i++) for (let j = 0; j < GJ; j++) if (L.visto[i][j]) { const [px, py] = ipW(i + .5, j + .5); const g = x.createRadialGradient(px / NB, (py - 60) / NB, 0, px / NB, (py - 60) / NB, 150 / NB); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.6, 'rgba(0,0,0,.9)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(px / NB - 160 / NB, (py - 60) / NB - 160 / NB, 320 / NB, 320 / NB); }
    x.globalCompositeOperation = 'source-over';
  }
  function cargarVisto() {
    const p = GUARDA.perfil(), guard = p && p.visto[def.id]; L.visto = []; for (let i = 0; i < G; i++) { L.visto.push([]); for (let j = 0; j < GJ; j++) L.visto[i].push(!def.niebla || !!(guard && guard[i * GJ + j] === '1')); }
  }
  function guardarVisto() { const p = GUARDA.perfil(); if (!p || !def.niebla) return; let s = ''; for (let i = 0; i < G; i++) for (let j = 0; j < GJ; j++) s += L.visto[i][j] ? '1' : '0'; p.visto[def.id] = s; GUARDA.guardar(); }
  function revelar(ci, cj, r = def.radio || 5) { if (!def.niebla) return; let cambio = false; for (let i = ci - r; i <= ci + r; i++) for (let j = cj - r; j <= cj + r; j++) if (dentro(i, j) && !L.visto[i][j] && (i - ci) ** 2 + (j - cj) ** 2 <= r * r) { L.visto[i][j] = true; cambio = true; } if (cambio) { pintarNiebla(); guardarVisto(); } }
  // ---------- caminos (A*, 4 direcciones) ----------
  function camino(a, b) {
    const k = (i, j) => i * GJ + j, abiertos = [[a[0], a[1]]], de = new Map(), g = new Map([[k(...a), 0]]), f = new Map([[k(...a), 0]]);
    const h = (i, j) => Math.abs(i - b[0]) + Math.abs(j - b[1]);
    let vueltas = 0;
    while (abiertos.length && vueltas++ < 6000) {
      abiertos.sort((p, q) => f.get(k(...p)) - f.get(k(...q))); const [ci, cj] = abiertos.shift();
      if (ci === b[0] && cj === b[1]) { const r = [[ci, cj]]; let c = k(ci, cj); while (de.has(c)) { c = de.get(c); r.unshift([Math.floor(c / GJ), c % GJ]); } return r.slice(1); }
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ni = ci + di, nj = cj + dj; if (!L.libre(ni, nj)) continue; const ng = g.get(k(ci, cj)) + 1; if (ng < (g.has(k(ni, nj)) ? g.get(k(ni, nj)) : 1e9)) { de.set(k(ni, nj), k(ci, cj)); g.set(k(ni, nj), ng); f.set(k(ni, nj), ng + h(ni, nj)); if (!abiertos.some(p => p[0] === ni && p[1] === nj)) abiertos.push([ni, nj]); } }
    }
    return null;
  }
  function libreCerca(i, j) { if (L.libre(i, j)) return [i, j]; for (let r = 1; r < 4; r++) { let mejor = null, d = 1e9; for (let a = i - r; a <= i + r; a++) for (let b = j - r; b <= j + r; b++) if (L.libre(a, b)) { const dd = Math.hypot(a - i, b - j) + Math.hypot(a - J.fi, b - J.fj) * .01; if (dd < d) { d = dd; mejor = [a, b]; } } if (mejor) return mejor; } return null; }
  function ir(destino, al) { const d = libreCerca(...destino); if (!d) return false; const desde = [Math.round(J.fi), Math.round(J.fj)]; const c = camino(desde, d); if (!c) return false; J.camino = c; J.al = al || null; if (!c.length && al) { J.al = null; al(); } return true; }
  L.ir = ir;
  // ---------- cámara ----------
  const cam = L.cam = { x: 0, y: 0 };
  function apuntar(inst) { let [px, py] = ipW(J.fi + .5, J.fj + .5); if (L.tour && L.tour.o) { const o = L.tour.o; [px, py] = ipW(o.i + o.a / 2, o.j + o.b / 2); py -= 40; } const tx = Math.max(LW5 / 2, Math.min(AW - LW5 / 2, px)), ty = Math.max(LH5 / 2 - (def.cieloAlto || 0), Math.min(AH - LH5 / 2, py - 40)); if (inst) { cam.x = tx; cam.y = ty; } else { cam.x += (tx - cam.x) * .08; cam.y += (ty - cam.y) * .08; } }
  // ---------- sprites del jugador ----------
  function spriteJugador(frame, mov) { return heroeAnim5(mov ? { camina: frame } : { ojos: parpadeo5() }); }
  // ---------- dibujo ----------
  const motas = []; { const R = rng(def.id.length * 7); for (let k = 0; k < 36; k++) motas.push({ x: R() * LW5, y: R() * LH5, v: 6 + R() * 12, f: R() * 6, r: 1.5 + R() * (k < 6 && !def.interior ? 4 : 2.5) }); }
  L.dibujar = (ctx, dt) => {
    mover(dt); if (L.tour) pasoRecorrido(dt); apuntar(false);
    const ox = Math.round(LW5 / 2 - cam.x), oy = Math.round(LH5 / 2 - cam.y);
    if (def.fondo) def.fondo(ctx, ox, oy, L); else { ctx.fillStyle = '#1c1030'; ctx.fillRect(0, 0, LW5, LH5); }
    ctx.drawImage(L.suelo, ox, oy);
    // dinámicos (jugador, Tic, NPCs, secretos, props en píxel)
    const din = [];
    din.push({ fi: J.fi, fj: J.fj, dib: () => { const [x, y] = ipW(J.fi + .5, J.fj + .5); sombra(ctx, x + ox, y + oy, 18); const mov = J.camino.length > 0; if (L.foto) return; const s = destacado5(spriteJugador(Math.floor(RELOJ * 9) % 4, mov)); sprK(ctx, s, x + ox, y + oy + 4 + (mov ? 0 : Math.round(Math.sin(RELOJ * 2.2) * .6)), def.kPj || 2, { flip: J.mira < 0 }); } });
    // Tic flota detrás, con el péndulo al pulso (80 por minuto)
    const [jx, jy] = ipW(J.fi + .5, J.fj + .5); TIC.rastro.push([jx, jy]); if (TIC.rastro.length > 22) TIC.rastro.shift(); const [tx0, ty0] = TIC.rastro[0];
    TIC.x += (tx0 + 38 - TIC.x) * .1; TIC.y += (ty0 - 10 - TIC.y) * .1;
    din.push({ fi: J.fi - .3, fj: J.fj - .3, dib: () => { if (!L.foto) sombra(ctx, TIC.x + ox, TIC.y + oy + 30, 12, .18); } });
    L.npcs.forEach(n => din.push({ fi: n.i, fj: n.j, dib: () => { const [x, y] = ipW(n.i + .5, n.j + .5); sombra(ctx, x + ox, y + oy, 16); sprK(ctx, apagado5(n.sprite()), x + ox, y + oy + 4 - ((RELOJ * 1.3 + n.i) % 2 < 1 ? 0 : 1), def.kPj || 2, { flip: n.flip }); if (!n.leido) { const by = y + oy - (def.kPj || 2) * 38 - 8 + Math.sin(RELOJ * 3) * 3; ctx.save(); ctx.beginPath(); ctx.arc(x + ox, by, 13, 0, 7); ctx.fillStyle = '#fffaf4'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#2a1a3a'; ctx.stroke(); ctx.restore(); titulo5(ctx, '…', x + ox, by - 3, 22, '#c23345'); } } }));
    L.secretos.forEach(s => { if (s.hallado) return; din.push({ fi: s.i, fj: s.j, dib: () => { const [x, y] = ipW(s.i + .5, s.j + .5); const yy = y + oy - 24 + Math.sin(RELOJ * 2) * 5; brillo(ctx, x + ox, yy, 40); sprK(ctx, corcheaDorada(), x + ox, yy + 16, 2); } }); });
    (def.pixeles || []).forEach(p => din.push({ fi: p.i, fj: p.j, dib: () => { const [x, y] = ipW(p.i + .5, p.j + .5); if (p.sombra !== false) sombra(ctx, x + ox, y + oy, p.r || 14); const sp = typeof p.s === 'function' ? p.s() : p.s; sprK(ctx, p.destacar ? destacado5(sp) : sp, x + ox, y + oy + 4, p.k || def.kPj || 2, { flip: p.flip }); } }));
    din.sort((a, b) => (a.fi + a.fj) - (b.fi + b.fj));
    // orden con los edificios: cada dinámico va justo antes del primer edificio que lo tapa
    const ante = L.objetos.map(() => []), fin = [];
    din.forEach(d => { const k = L.objetos.findIndex(o => o.lienzo && d.fi < o.i + o.a - .05 && d.fj < o.j + o.b - .05 && (d.fi + d.fj) < o.i + o.a + o.j + o.b - 1); if (k < 0) fin.push(d); else ante[k].push(d); });
    L.objetos.forEach((o, k) => { ante[k].forEach(d => d.dib()); if (!o.lienzo) return;
      if (o.mece) { const [bx, by] = ipW(o.i + .5, o.j + .5), sh = Math.sin(RELOJ * 1.3 + o.i * .7 + o.j) * .028; ctx.save(); ctx.translate(bx + ox, by + oy); ctx.transform(1, 0, sh, 1, 0, 0); ctx.drawImage(o.lienzo, o.x0 - bx, o.y0 - by); ctx.restore(); }
      else ctx.drawImage(o.lienzo, o.x0 + ox, o.y0 + oy); });
    fin.forEach(d => d.dib());
    // recorrido: el edificio de turno brilla y muestra su nombre
    if (L.tour && L.tour.o && L.tour.o.lienzo) { const o = L.tour.o, a = Math.min(1, L.tour.t * 3) * (.65 + .35 * Math.sin(RELOJ * 6)); o.halo = o.halo || teñido(o.lienzo, '#ffd046');
      ctx.save(); ctx.globalAlpha = a; [[-5, 0], [5, 0], [0, -5], [0, 5], [-4, -4], [4, -4], [-4, 4], [4, 4]].forEach(([dx, dy]) => ctx.drawImage(o.halo, o.x0 + ox + dx, o.y0 + oy + dy)); ctx.restore();
      ctx.drawImage(o.lienzo, o.x0 + ox, o.y0 + oy);
      const [lx, ly] = ipW(o.i + o.a / 2, o.j + o.b / 2), nm = o.nombre || '', w = Math.max(200, nm.length * 17 + 70); ctx.save(); ctx.globalAlpha = Math.min(1, L.tour.t * 3); cinta5(ctx, nm, lx + ox - w / 2, o.y0 + oy + 30, w); ctx.restore(); }
    // silueta de los personajes principales cuando quedan detrás de un edificio (y Tic siempre por encima: vuela)
    const tapado = (fi, fj, sx, sy) => L.objetos.some(o => { if (!o.lienzo || !(fi < o.i + o.a - .05 && fj < o.j + o.b - .05 && (fi + fj) < o.i + o.a + o.j + o.b - 1)) return false; const lx = Math.floor(sx - o.x0), ly = Math.floor(sy - o.y0); if (lx < 0 || ly < 0 || lx >= o.lienzo.width || ly >= o.lienzo.height) return false; return alfa5(o, lx, ly) > 30; });
    { const [px, py] = ipW(J.fi + .5, J.fj + .5); if (tapado(J.fi, J.fj, px, py - 30)) { const s = spriteJugador(0); sprK(ctx, silueta5(s), px + ox, py + oy + 4, def.kPj || 2, { flip: J.mira < 0, alpha: .55 }); } }
    if (!L.foto) { const ang = Math.round(Math.sin(RELOJ * Math.PI * 80 / 60) * 4) / 10, s = sprRobotB({ ang, ojos: (RELOJ % 4.3) < .14 ? 'cerrado' : 'feliz', llama: Math.floor(RELOJ * 14) % 2 }), tx = TIC.x + ox, ty = TIC.y + oy - 16 + Math.sin(RELOJ * 2.4) * 4;
      if (tapado(J.fi - .3, J.fj - .3, TIC.x, TIC.y - 40)) sprK(ctx, silueta5(s), tx, ty, def.kPj || 2, { alpha: .6 }); else sprK(ctx, destacado5(s), tx, ty, def.kPj || 2); }
    if (def.encima) def.encima(ctx, ox, oy, L);
    if (niebla) { ctx.save(); ctx.imageSmoothingEnabled = true; ctx.drawImage(niebla, ox, oy, niebla.width * NB, niebla.height * NB); ctx.restore(); }
    // luz cálida y motas
    if (def.luz !== false && !L.foto) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; (window.LIGERO5 ? motas.slice(0, 14) : motas).forEach(m => { m.y -= m.v * dt; m.x += Math.sin(RELOJ + m.f) * 6 * dt; if (m.y < -10) { m.y = LH5 + 10; } const a = .25 + .2 * Math.sin(RELOJ * 2 + m.f); if (m.r > 3.6) { ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(120,150,80,.7)'; ctx.save(); ctx.translate(m.x, LH5 - m.y); ctx.rotate(RELOJ * 2 + m.f); ctx.beginPath(); ctx.ellipse(0, 0, 4, 2, 0, 0, 7); ctx.fill(); ctx.restore(); ctx.globalCompositeOperation = 'lighter'; } else { ctx.fillStyle = 'rgba(255,226,160,' + a.toFixed(2) + ')'; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 7); ctx.fill(); } }); ctx.restore(); }
    if (VELO5) ctx.drawImage(VELO5, 0, 0);
    // destino tocado
    if (J.marca && J.camino.length) { const [mx, my] = ipW(J.marca[0] + .5, J.marca[1] + .5); ctx.save(); ctx.strokeStyle = 'rgba(255,208,70,' + (.6 + .3 * Math.sin(RELOJ * 8)) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(mx + ox, my + oy, 22, 11, 0, 0, 7); ctx.stroke(); ctx.restore(); }
    if (L.foto) return;
    hud5(ctx, def.nombre, { sinMapa: def.interior });
    if (L.extraHud) L.extraHud(ctx, dt);
    if (L.hudFijo) L.hudFijo(ctx, dt);
    if (def.interior) botonRedondo5(ctx, 50, LH5 - 50, 'salir');
    DIALOGO5.dibujar(ctx, dt);
    if (L.festejo) dibujarFestejo(ctx, dt, L);
  };
  function mover(dt) {
    if (DIALOGO5.abierto) return;
    if (J.camino.length) {
      const [ti, tj] = J.camino[0], v = (L.velAuto || def.vel || 4) * dt, di = ti - J.fi, dj = tj - J.fj, d = Math.hypot(di, dj);
      const sxDir = (di - dj); if (Math.abs(sxDir) > .01) J.mira = sxDir > 0 ? 1 : -1;
      if (d <= v) { J.fi = ti; J.fj = tj; J.camino.shift(); revelar(ti, tj); if (!J.camino.length && J.al) { const f = J.al; J.al = null; f(); } }
      else { J.fi += di / d * v; J.fj += dj / d * v; }
    }
  }
  L.entrar = (o = {}) => {
    PAL_ = def.paleta || PALS5.A; cargarVisto();
    if (o.desde) { J.fi = o.desde[0]; J.fj = o.desde[1]; } else { J.fi = def.inicio[0]; J.fj = def.inicio[1]; }
    J.camino = []; revelar(J.fi, J.fj, (def.radio || 5) + 1); pintarNiebla(); apuntar(true); TIC.x = ipW(J.fi + .5, J.fj + .5)[0] + 40; TIC.y = ipW(J.fi + .5, J.fj + .5)[1] - 10; TIC.rastro = [];
    const p = GUARDA.perfil(); L.secretos.forEach(s => { s.hallado = !!(p && p.secretos[s.id]); }); if (p && !def.interior) { p.lugar = def.id; GUARDA.guardar(); }
    if (L.alEntrar) { const f = L.alEntrar; L.alEntrar = null; f(); }
  };
  L.tocar = (x, y) => {
    if (L.auto) return;
    if (DIALOGO5.abierto) { DIALOGO5.tocar(); return; }
    if (L.festejo) return;
    if (tocaHud5(x, y, { sinMapa: def.interior })) return;
    if (def.interior && Math.hypot(x - 50, y - (LH5 - 50)) < 36) { salirInterior(); return; }
    const wx = x - (LW5 / 2 - cam.x), wy = y - (LH5 / 2 - cam.y);
    // NPCs y secretos (por cercanía al sprite)
    for (const n of L.npcs) { const [nx, ny] = ipW(n.i + .5, n.j + .5); if (Math.abs(wx - nx) < 30 && wy > ny - 90 && wy < ny + 12) { J.marca = [n.i, n.j]; ir([n.i + 1, n.j], () => hablar(n)) || ir([n.i, n.j + 1], () => hablar(n)); return; } }
    for (const s of L.secretos) { if (s.hallado) continue; const [sx2, sy2] = ipW(s.i + .5, s.j + .5); if (Math.hypot(wx - sx2, wy - (sy2 - 24)) < 40) { J.marca = [s.i, s.j]; ir([s.i, s.j], () => hallar(s)); return; } }
    // edificios (prueba de píxel sobre su lienzo, de adelante hacia atrás)
    for (let k = L.objetos.length - 1; k >= 0; k--) { const o = L.objetos[k]; if (!o.lienzo || !o.puerta) continue; const lx = Math.floor(wx - o.x0), ly = Math.floor(wy - o.y0); if (lx < 0 || ly < 0 || lx >= o.lienzo.width || ly >= o.lienzo.height) continue; const a = alfa5(o, lx, ly); if (a > 30) { J.marca = o.puerta; ir(o.puerta, () => entrarEdificio(o)); return; } }
    // el suelo
    const u = (wx - OX) / T, v = (wy - OY) / (T / 2), i = Math.floor((u + v) / 2), j = Math.floor((v - u) / 2);
    if (def.interior && def.salida && Math.abs(i - def.salida[0]) <= 0 && j >= def.salida[1]) { ir(def.salida, salirInterior); J.marca = def.salida; return; }
    if (dentro(i, j)) { J.marca = [i, j]; ir([i, j], def.interior && def.salida && i === def.salida[0] && j === def.salida[1] ? salirInterior : null); }
  };
  function hablar(n) { n.leido = true; if (n.accion) { n.accion(n); return; } const quien = GUARDA.d.perfil === 'david' ? 'david' : 'sarah'; DIALOGO5.abrir(n.nombre, n.sprite, n.dialogo[quien] || n.dialogo.sarah); }
  function hallar(s) { s.hallado = true; const p = GUARDA.perfil(); if (p) { p.secretos[s.id] = true; GUARDA.guardar(); } L.festejo = { t: 0, texto: s.texto || '¡Un secreto!' }; if (L.alHallar) L.alHallar(s); }
  function entrarEdificio(o) { if (L.alEntrarEdificio && L.alEntrarEdificio(o)) return;
    if (!o.entra || !LUGARES5[o.entra]) { DIALOGO5.abrir(o.nombre || '', null, [o.cerrado || 'Pronto se abrirá.']); return; } const [x, y] = ipW(o.puerta[0] + .5, o.puerta[1] + .5); LUGARES5[o.entra].volver = { lugar: L, desde: o.puerta.slice() }; irA(LUGARES5[o.entra], { tipo: 'iris', x: x - cam.x + LW5 / 2, y: y - cam.y + LH5 / 2 - 30 }); }
  function salirInterior() { const v = L.volver; if (!v) return; irA(v.lugar, { tipo: 'iris', desde: v.desde }); }
  // recorrido de llegada: la cámara va de edificio en edificio (≈2 s cada uno) y vuelve al personaje
  L.recorrido = (lista, alFin) => { L.tour = { lista, i: 0, t: 0, o: lista[0], alFin }; lista.forEach(o => { if (o.puerta) revelar(o.puerta[0] - 1, o.puerta[1] - 2, 9); }); };
  function pasoRecorrido(dt) { const R = L.tour; if (!R.dicho && R.t > .5) { R.dicho = true; if (L.alTurno && R.i > 0) L.alTurno(R.o); } R.t += dt; if (R.t > 2.1) { R.i++; R.t = 0; R.dicho = false; R.o = R.lista[R.i]; if (!R.o) { L.tour = null; R.alFin && R.alFin(); } } }
  L.revelarTodo = () => { for (let i = 0; i < G; i++) for (let j = 0; j < GJ; j++) L.visto[i][j] = true; pintarNiebla(); };
  return L;
}
// opacidad de un objeto en un punto: máscara a 1/4 hecha una sola vez (sin leer el lienzo en cada cuadro)
function alfa5(o, lx, ly) {
  if (!o.mascara) { const w = Math.ceil(o.lienzo.width / 4), h = Math.ceil(o.lienzo.height / 4), c = canvas(w, h), x = c.getContext('2d'); x.drawImage(o.lienzo, 0, 0, w, h); const d = x.getImageData(0, 0, w, h).data, m = new Uint8Array(w * h); for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3]; o.mascara = { w, h, m }; }
  const M = o.mascara, i = Math.floor(lx / 4), j = Math.floor(ly / 4); return i < 0 || j < 0 || i >= M.w || j >= M.h ? 0 : M.m[j * M.w + i];
}
function sombra(ctx, x, y, r, a = .3) { ctx.save(); ctx.fillStyle = 'rgba(40,20,40,' + a + ')'; ctx.beginPath(); ctx.ellipse(x, y, r, r * .38, 0, 0, 7); ctx.fill(); ctx.restore(); }
function brillo(ctx, x, y, r, c = '255,224,130') { if (!isFinite(x) || !isFinite(y) || !(r > 0) || !isFinite(r)) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(' + c + ',.75)'); g.addColorStop(1, 'rgba(' + c + ',0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }
function corcheaDorada() { return cache('corcheaD', () => sprite(12, 18, g => { g.R(7, 0, 2, 13, '#e6a21b'); g.R(9, 1, 2, 2, '#e6a21b'); g.R(10, 3, 2, 3, '#e6a21b'); g.R(11, 6, 1, 3, '#e6a21b'); g.ellE(1, 11, 8, 6, '#ffd046'); g.R(2, 12, 3, 1, '#fff3b0'); g.px(8, 2, '#fff3b0'); }, { ax: 6, ay: 18 })); }
// el velo de luz cálida (una vez)
let VELO5 = null;
function hacerVelo() { VELO5 = canvas(LW5, LH5); const x = VELO5.getContext('2d'); const g = x.createRadialGradient(LW5 * .35, LH5 * .2, 50, LW5 / 2, LH5 / 2, LW5 * .8); g.addColorStop(0, 'rgba(255,214,150,.16)'); g.addColorStop(.6, 'rgba(255,214,150,0)'); g.addColorStop(1, 'rgba(40,20,60,.28)'); x.fillStyle = g; x.fillRect(0, 0, LW5, LH5); }
// festejo del secreto
function dibujarFestejo(ctx, dt, L) {
  const F = L.festejo; F.t += dt; const a = Math.min(1, F.t * 3);
  ctx.save(); ctx.fillStyle = 'rgba(28,16,48,' + (.45 * a) + ')'; ctx.fillRect(0, 0, LW5, LH5); ctx.restore();
  rayosLuz5(ctx, LW5 / 2, LH5 / 2 - 40, F.t);
  sprK(ctx, corcheaDorada(), LW5 / 2, LH5 / 2 + 40 - Math.sin(F.t * 3) * 6, 9);
  cinta5(ctx, F.texto, LW5 / 2 - 190, LH5 / 2 + 150, 380);
  if (F.t > 2.6) L.festejo = null;
}
function rayosLuz5(ctx, x, y, t) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 12; i++) { ctx.save(); ctx.translate(x, y); ctx.rotate(i / 12 * Math.PI * 2 + t * .4); const g = ctx.createLinearGradient(0, 0, 0, 380); g.addColorStop(0, 'rgba(255,224,130,.4)'); g.addColorStop(1, 'rgba(255,224,130,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(10, 0); ctx.lineTo(44, 380); ctx.lineTo(-44, 380); ctx.fill(); ctx.restore(); } ctx.restore(); }
// ---------- diálogo: el texto se lee palabra por palabra ----------
const DIALOGO5 = {
  abierto: false, paginas: [], p: 0, t: 0, nombre: '', retrato: null,
  abrir(nombre, retrato, paginas) { this.abierto = true; this.nombre = nombre; this.retrato = retrato; this.paginas = paginas; this.p = 0; this.t = 0; },
  tocar() { const pal = this.paginas[this.p].split(' '); const leidas = Math.floor(this.t * 2.6); if (leidas < pal.length) { this.t = pal.length / 2.6; return; } this.p++; this.t = 0; if (this.p >= this.paginas.length) this.abierto = false; },
  dibujar(ctx, dt) {
    if (!this.abierto) return; this.t += dt;
    const x = 140, y = LH5 - 230, w = LW5 - 280, h = 190;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8; rr(ctx, x, y, w, h, 18); ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, '#fffaf4'], [1, '#fffaf4']]); ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, x, y, w, h, 18); ctx.lineWidth = 5; ctx.strokeStyle = '#2a1a3a'; ctx.stroke(); rr(ctx, x + 8, y + 8, w - 16, h - 16, 12); ctx.lineWidth = 2.5; ctx.strokeStyle = '#d9a930'; ctx.stroke(); ctx.restore();
    let tx = x + 40;
    if (this.retrato) { ctx.save(); ctx.beginPath(); ctx.arc(x + 95, y + h / 2, 62, 0, 7); ctx.fillStyle = '#e9e4ee'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#2a1a3a'; ctx.stroke(); ctx.clip(); sprK(ctx, this.retrato(), x + 95, y + h / 2 + 118, 4); ctx.restore(); tx = x + 190; }
    if (this.nombre) titulo5(ctx, this.nombre, tx, y + 34, 28, '#c23345', { al: 'left' });
    // palabra por palabra: las leídas en tinta, la actual en bermellón, las que vienen apenas visibles
    const pal = this.paginas[this.p].split(' '), act = Math.floor(this.t * 2.6);
    ctx.save(); ctx.font = '500 34px Outfit'; ctx.textBaseline = 'middle'; let px = tx, py = y + 92; const maxX = x + w - 40;
    pal.forEach((p, k) => { const ww = ctx.measureText(p + ' ').width; if (px + ww > maxX) { px = tx; py += 46; } ctx.fillStyle = k < act ? '#2a1a3a' : k === act ? '#c23345' : 'rgba(58,36,20,.22)'; ctx.fillText(p, px, py); if (k === act) { ctx.fillStyle = '#c23345'; ctx.fillRect(px, py + 20, ctx.measureText(p).width, 3); } px += ww; });
    ctx.restore();
    if (act >= pal.length) { ctx.save(); ctx.fillStyle = '#c23345'; const bx = x + w - 46, by = y + h - 34 + Math.sin(RELOJ * 6) * 3; ctx.beginPath(); ctx.moveTo(bx - 10, by - 6); ctx.lineTo(bx + 10, by - 6); ctx.lineTo(bx, by + 6); ctx.fill(); ctx.restore(); }
  },
};

// contorno claro + brillo para los personajes principales; NPCs un poco apagados
function destacado5(s) { if (s._dest) return s._dest; const c = canvas(s.width + 4, s.height + 4), x = c.getContext('2d'); const t = teñido(s, '#fff6dc'); [[0, 2], [4, 2], [2, 0], [2, 4], [1, 1], [3, 1], [1, 3], [3, 3]].forEach(([dx, dy]) => x.drawImage(t, dx, dy)); x.drawImage(s, 2, 2); c.ax = s.ax + 2; c.ay = s.ay + 2; s._dest = c; return c; }
function apagado5(s) { if (s._apag) return s._apag; const c = canvas(s.width, s.height), x = c.getContext('2d'); x.filter = 'saturate(.55) brightness(.96)'; x.drawImage(s, 0, 0); c.ax = s.ax; c.ay = s.ay; s._apag = c; return c; }
function silueta5(s) { if (s._sil) return s._sil; const c = teñido(s, '#3a2466'); s._sil = c; return c; }
