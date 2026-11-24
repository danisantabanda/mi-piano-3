// =====================================================================
//  M5 · MOTOR «DESDE ARRIBA» (3/4 top-down, tipo Pokémon clásico)
//  Mapa de baldosas (16 px de arte, se pinta a ×3), caminar SOLO en 4 direcciones con la cruz de flechas
//  (o las flechas del PC), botón «¡Toca!» (o Espacio / Enter), colisiones, cámara que sigue suave, pasitos que suenan,
//  se entra caminando hasta la puerta. Tic vuela detrás y Sansón sigue los pasos; vecinos con rutinas pequeñas.
//  El piano NO mueve al personaje. Compatible con lo que usa dia.js (ir, ipW, cam, objetos con puerta/entra, recorrido…).
// =====================================================================
const DIRS5 = { arriba: [0, -1], abajo: [0, 1], izq: [-1, 0], der: [1, 0] };
const CRUZ5 = { x: 150, y: 646, r: 132, b: 84, d: 80 }, TOCA5 = { x: 1138, y: 650, r: 82 };
// ---------- entrada: cruz de flechas (táctil, se mantiene), flechas del PC y botón ¡Toca! ----------
const MANDO5 = { dedos: {}, teclas: {}, toca: 0, dirDe(x, y) { const dx = x - CRUZ5.x, dy = y - CRUZ5.y; if (Math.hypot(dx, dy) > CRUZ5.r + 30 || Math.hypot(dx, dy) < 18) return null; return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'der' : 'izq') : (dy > 0 ? 'abajo' : 'arriba'); },
  dir() { const ks = Object.entries(this.teclas); if (ks.length) return ks.sort((a, b) => b[1] - a[1])[0][0]; const ds = Object.values(this.dedos); return ds.length ? ds[ds.length - 1] : null; },
  soltarTodo() { this.dedos = {}; this.teclas = {}; } };
const esArriba5 = () => ESC && ESC.arriba && !TRANS && !pausado5();
lienzo5.addEventListener('pointerdown', e => { if (!esArriba5() || ESC.auto) return; const [x, y] = aLogico(e), d = MANDO5.dirDe(x, y); if (d) { MANDO5.dedos[e.pointerId] = d; ESC.pulsada = d; } });
addEventListener('pointermove', e => { if (MANDO5.dedos[e.pointerId] == null || !esArriba5()) return; const [x, y] = aLogico(e), d = MANDO5.dirDe(x, y); if (d) MANDO5.dedos[e.pointerId] = d; });
['pointerup', 'pointercancel'].forEach(t => addEventListener(t, e => { delete MANDO5.dedos[e.pointerId]; }));
const TECLA_DIR5 = { ArrowUp: 'arriba', ArrowDown: 'abajo', ArrowLeft: 'izq', ArrowRight: 'der' };
addEventListener('keydown', e => { const d = TECLA_DIR5[e.key]; if (d) { e.preventDefault(); if (!e.repeat) MANDO5.teclas[d] = performance.now(); if (esArriba5() && !ESC.auto) ESC.pulsada = d; return; } if ((e.key === ' ' || e.key === 'Enter') && esArriba5()) { e.preventDefault(); if (!e.repeat) ESC.botonToca(); } });
addEventListener('keyup', e => { const d = TECLA_DIR5[e.key]; if (d) delete MANDO5.teclas[d]; });
addEventListener('blur', () => MANDO5.soltarTodo());
// pasitos: un toque suave de tierra (ruido filtrado), alternando pie
let PASO5 = 0;
function pasito5(v = 1) { if (!SON5.listo) return; try { const K = KitSonido, ac = K.contexto(), t = K.ahora() + .005; if (!pasito5.buf) { const n = Math.floor(ac.sampleRate * .09), b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3); pasito5.buf = b; }
  const s = ac.createBufferSource(); s.buffer = pasito5.buf; s.playbackRate.value = (PASO5++ % 2 ? .82 : .95) + Math.random() * .05; const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1100; const g = ac.createGain(); g.gain.value = .22 * v; s.connect(f); f.connect(g); g.connect(K.bus('efectos').entrada); s.start(t); } catch (e) { } }
function golpecito5() { if (!SON5.listo) return; try { const K = KitSonido; K.percusion.rim(K.bus('efectos'), K.ahora() + .01, .12); } catch (e) { } }
// ---------- burbuja con nota (rincones y lugares) ----------
function burbujaNota5(ctx, x, y, c, txt, o = {}) {
  ctx.save(); const r = o.r || 24, a = o.alpha == null ? 1 : o.alpha; ctx.globalAlpha = a;
  if (txt) { ctx.font = '700 17px Outfit'; const w = ctx.measureText(txt).width + 22; rr(ctx, x - w / 2, y - r - 42, w, 28, 14); ctx.fillStyle = 'rgba(28,16,48,.84)'; ctx.fill(); ctx.fillStyle = '#ffe9b0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, x, y - r - 28); }
  if (o.dormido) { ctx.fillStyle = 'rgba(251,241,216,.55)'; ctx.font = '700 ' + (r * .9) + 'px Outfit'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const k = (RELOJ * .7) % 1; ctx.globalAlpha = a * (1 - k); ctx.fillText('z', x + k * 14, y - k * 22); ctx.globalAlpha = a; ctx.fillText('z', x - 8, y + 6); ctx.restore(); return; }
  ctx.shadowColor = c; ctx.shadowBlur = 18; ctx.fillStyle = '#fff6e0'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
  ctx.lineWidth = 5; ctx.strokeStyle = c; ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 7, y + r - 4); ctx.lineTo(x, y + r + 12); ctx.lineTo(x + 7, y + r - 4); ctx.fillStyle = '#fff6e0'; ctx.fill();
  ctx.fillStyle = o.candado ? '#6a5a7a' : c; ctx.font = '700 ' + Math.round(r * 1.1) + 'px Outfit'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (o.candado) candado5(ctx, x, y + 1, r * .55); else ctx.fillText(o.icono || '♪', x, y + 2);
  ctx.restore();
}
function candado5(ctx, x, y, s) { ctx.save(); ctx.fillStyle = '#6a5a7a'; ctx.strokeStyle = '#6a5a7a'; ctx.lineWidth = s * .28; ctx.beginPath(); ctx.arc(x, y - s * .25, s * .42, Math.PI, 0); ctx.stroke(); rr(ctx, x - s * .62, y - s * .2, s * 1.24, s * .9, s * .18); ctx.fill(); ctx.restore(); }
function pildora5(ctx, x, y, txt, o = {}) { ctx.save(); ctx.font = '700 ' + (o.tam || 26) + 'px Outfit'; const w = o.w || ctx.measureText(txt).width + 36, h = o.h || 52; rr(ctx, x, y, w, h, o.radio == null ? 14 : o.radio); ctx.fillStyle = o.fondo || '#fffaf4'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#2a1a3a'; ctx.stroke(); ctx.fillStyle = o.c || '#2a1a3a'; ctx.textBaseline = 'middle'; ctx.textAlign = o.al || 'left'; ctx.fillText(txt, o.al === 'center' ? x + w / 2 : x + 18, y + h / 2 + 1); ctx.restore(); return w; }
// ---------- la cruz de flechas y el botón ¡Toca! ----------
function dibujarMando5(ctx, L) {
  const C = CRUZ5, on = MANDO5.dir() || (L.auto ? null : null);
  ctx.save(); ctx.globalAlpha = L.auto ? .35 : .95; ctx.fillStyle = 'rgba(28,16,48,.5)'; ctx.beginPath(); ctx.arc(C.x, C.y, C.r, 0, 7); ctx.fill();
  Object.entries(DIRS5).forEach(([d, [ax, ay]]) => { const bx = C.x + ax * C.d, by = C.y + ay * C.d, pr = on === d; rr(ctx, bx - C.b / 2, by - C.b / 2 + (pr ? 3 : 0), C.b, C.b, 20); ctx.fillStyle = pr ? '#ffd046' : '#fffaf4'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#2a1a3a'; ctx.stroke();
    ctx.save(); ctx.translate(bx, by + (pr ? 3 : 0)); ctx.rotate(Math.atan2(ay, ax)); ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(-12, -20); ctx.lineTo(-12, 20); ctx.closePath(); ctx.fillStyle = '#2a1a3a'; ctx.fill(); ctx.restore(); });
  ctx.restore();
  const T = TOCA5, hay = L.frente && L.frente(), pr = RELOJ - (L.tocaT || -9) < .15;
  ctx.save(); ctx.globalAlpha = L.auto ? .35 : 1; if (hay && !L.auto) { ctx.shadowColor = '#ffd046'; ctx.shadowBlur = 26 + 10 * Math.sin(RELOJ * 5); }
  ctx.beginPath(); ctx.arc(T.x, T.y + (pr ? 3 : 0), T.r, 0, 7); ctx.fillStyle = hay ? '#ff7a5a' : '#d9806a'; ctx.fill(); ctx.shadowBlur = 0; ctx.lineWidth = 6; ctx.strokeStyle = '#2a1a3a'; ctx.stroke();
  ctx.fillStyle = '#fff6e0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '700 46px Outfit'; ctx.fillText('♪', T.x, T.y - 16 + (pr ? 3 : 0)); ctx.font = '700 24px Outfit'; ctx.fillText('¡Toca!', T.x, T.y + 30 + (pr ? 3 : 0)); ctx.restore();
}
// =====================================================================
function crearArriba(def) {
  const W = def.W, H = def.H, PX = TA * KA;
  const L = { def, arriba: true, W, H, objetos: [], props: [], npcs: [], auto: false, velAuto: 0, cam: { x: 0, y: 0 }, pulsada: null };
  L.ipW = (i, j) => [i * PX, j * PX];
  // ---------- suelo y bloqueo ----------
  const tipo = [], bloq = [];
  for (let j = 0; j < H; j++) { tipo.push([]); bloq.push([]); for (let i = 0; i < W; i++) { const t = def.suelo(i, j); tipo[j].push(t); bloq[j].push(!!(def.bloqueaSuelo && def.bloqueaSuelo(t))); } }
  L.tipo = (i, j) => (i >= 0 && j >= 0 && i < W && j < H) ? tipo[j][i] : null;
  const dentro = (i, j) => i >= 0 && j >= 0 && i < W && j < H;
  // ---------- objetos (edificios) y utilería ----------
  (def.objetos || []).forEach(o => {
    const ob = Object.assign({}, o); ob.spr = typeof o.spr === 'function' ? o.spr() : o.spr; ob.esEdif = true;
    for (let j = ob.j; j < ob.j + ob.h; j++) for (let i = ob.i; i < ob.i + ob.w; i++) if (dentro(i, j)) bloq[j][i] = true;
    if (ob.puertaEn !== false) { const pi = ob.pi != null ? ob.pi : ob.i + Math.floor(ob.w / 2), pj = ob.j + ob.h - 1; ob.door = [pi, pj]; ob.puerta = [pi, pj + 1]; }
    ob.base = (ob.j + ob.h) * TA; L.objetos.push(ob);
  });
  (def.props || []).forEach(p => { const pr = Object.assign({ bloquea: true }, p); pr.base = (p.j + 1) * TA - (p.dy || 0); if (pr.bloquea && dentro(p.i, p.j)) bloq[p.j][p.i] = true; (pr.ocupa || []).forEach(([a, b]) => { if (dentro(a, b)) bloq[b][a] = true; }); L.props.push(pr); });
  L.bloq = bloq;
  const ocupadoNPC = (i, j, excepto) => L.npcs.some(n => n !== excepto && ((n.i === i && n.j === j) || (n.mov && n.mov.a[0] === i && n.mov.a[1] === j)));
  L.libre = (i, j, quien) => dentro(i, j) && !bloq[j][i] && !(quien !== 'npc' && ocupadoNPC(i, j)) && !(def.libreExtra && !def.libreExtra(i, j));
  const puertaEn = (i, j) => L.objetos.find(o => o.door && o.door[0] === i && o.door[1] === j);
  // ---------- prerender: suelo (de noche) y capa de luces ----------
  const suelo = canvas(W * TA, H * TA), sx = suelo.getContext('2d'); sx.imageSmoothingEnabled = false;
  def.pintarSuelo(Pen(sx), sx, { tipo: L.tipo, W, H });
  if (def.noche !== false) nocturno5(suelo, def.nocheColor || NOCHE5);
  if (def.sobreSuelo) def.sobreSuelo(Pen(sx), sx, { tipo: L.tipo, W, H });
  L.suelo = suelo;
  const LZ = 4, luz = canvas(Math.ceil(W * TA / LZ), Math.ceil(H * TA / LZ)), lx = luz.getContext('2d');
  const halo = (x, y, r, a = .5, c = '255,200,110') => { const g = lx.createRadialGradient(x / LZ, y / LZ, 0, x / LZ, y / LZ, r / LZ); g.addColorStop(0, 'rgba(' + c + ',' + a + ')'); g.addColorStop(1, 'rgba(' + c + ',0)'); lx.fillStyle = g; lx.fillRect((x - r) / LZ, (y - r) / LZ, 2 * r / LZ, 2 * r / LZ); };
  L.objetos.forEach(o => (o.spr.luces || []).forEach(([x, y, r]) => halo(o.i * TA + x, o.j * TA + o.h * TA - (o.spr.height - 2 - (o.spr.alto || 0)) - (o.spr.alto || 0) + y, r * 1.6, .32)));
  L.props.forEach(p => { if (p.luz) halo(p.i * TA + 8, (p.j + 1) * TA - (p.luzY || 26), p.luz, p.luzA || .55); });
  (def.luces || []).forEach(([x, y, r, a, c]) => halo(x, y, r, a, c));
  L.luz = luz;
  // ---------- jugador, seguidores, vecinos ----------
  const J = L.jugador = { i: 0, j: 0, x: 0, y: 0, dir: 'arriba', mov: null, f: 0, camino: [], fi: 0, fj: 0, quieto: 0 };
  const SAN = L.sanson = { i: 0, j: 0, x: 0, y: 0, dir: 'arriba', mov: null, f: 0, activo: def.sanson !== false };
  const TIC = L.tic = { x: 0, y: 0 };
  L.npcs = (def.npcs || []).map(n => Object.assign({ dir: 'abajo', x: n.i * TA + 8, y: (n.j + 1) * TA, mov: null, espera: 1 + Math.random() * 2, k: 0, f: 0 }, n));
  // ---------- movimiento por baldosas ----------
  const VEL = def.vel || 3.3;   // baldosas por segundo: paso tranquilo
  function empezarMov(e, d, vel) { const [dx, dy] = DIRS5[d]; e.dir = d; e.mov = { de: [e.i, e.j], a: [e.i + dx, e.j + dy], t: 0, vel }; }
  function avanzar(e, dt) { if (!e.mov) return false; e.mov.t += dt * e.mov.vel; const q = Math.min(1, e.mov.t); e.x = (e.mov.de[0] + (e.mov.a[0] - e.mov.de[0]) * q) * TA + 8; e.y = (e.mov.de[1] + (e.mov.a[1] - e.mov.de[1]) * q + 1) * TA; e.f = q < .5 ? (e.paso ? 3 : 1) : 0;
    if (q >= 1) { e.i = e.mov.a[0]; e.j = e.mov.a[1]; e.mov = null; e.paso = !e.paso; return true; } return false; }
  const colocar = (e, i, j, d) => { e.i = i; e.j = j; e.x = i * TA + 8; e.y = (j + 1) * TA; e.mov = null; if (d) e.dir = d; };
  function intentar(d) {
    const [dx, dy] = DIRS5[d], ni = J.i + dx, nj = J.j + dy; J.dir = d;
    const pu = puertaEn(ni, nj); if (pu && d === 'arriba') { entrarEdificio(pu); return; }
    if (def.salida && def.salida(ni, nj, d)) { MANDO5.soltarTodo(); def.alSalir(L, ni, nj); return; }
    if (!L.libre(ni, nj)) { if (RELOJ - (J.golpe || 0) > .5) { J.golpe = RELOJ; golpecito5(); } return; }
    if (SAN.activo) { (SAN.cola = SAN.cola || []).push([J.i, J.j]); if (SAN.cola.length > 1) SAN.antes = SAN.cola.shift(); }   // Sansón va dos pasos atrás
    empezarMov(J, d, L.auto ? L.velAuto || 5 : VEL);
  }
  L.pasoJugador = dt => {
    if (J.mov) { const llego = avanzar(J, dt); if (J.mov && J.mov.t >= .5 && !J.mov.sono) { J.mov.sono = true; pasito5(); } if (!llego) return; J.fi = J.i; J.fj = J.j; if (def.alPisar) def.alPisar(L, J.i, J.j); }
    if (DIALOGO5.abierto || L.festejo || L.panel || L.tour) return;
    if (J.espera > 0) { J.espera -= dt; return; }
    if (J.camino.length) { const d = J.camino.shift(); intentar(d); if (J.mov) return;
      // un vecino en el camino: se rodea (o se espera un poquito)
      if (J.dest && (J.i !== J.dest[0] || J.j !== J.dest[1]) && ESC === L && (J.reintentos = (J.reintentos || 0) + 1) < 8) { const c = bfs([J.i, J.j], J.dest, true); if (c && c.length) { J.camino = c; return; } J.camino.unshift(d); J.espera = .4; return; }
      J.camino = []; const f = J.al; J.al = null; if (f) f(); return; }
    if (J.al && !J.camino.length) { const f = J.al; J.al = null; f(); return; }
    if (L.auto) return;
    const d = MANDO5.dir() || L.pulsada; L.pulsada = null;
    if (d) { J.quieto = 0; intentar(d); }
  };
  function pasoSanson(dt) {
    if (!SAN.activo) return;
    if (!SAN.mov && SAN.antes && J.mov) { const [ti, tj] = SAN.antes; SAN.antes = null; const dx = ti - SAN.i, dy = tj - SAN.j; if (Math.abs(dx) + Math.abs(dy) === 1) empezarMov(SAN, dx > 0 ? 'der' : dx < 0 ? 'izq' : dy > 0 ? 'abajo' : 'arriba', J.mov.vel); else if (dx || dy) colocar(SAN, ti, tj); }
    avanzar(SAN, dt);
  }
  function pasoTic(dt) { const k = 1 - Math.exp(-dt * 3), ox = J.dir === 'izq' ? 34 : -34; TIC.x += (J.x + ox - TIC.x) * k; TIC.y += (J.y - 30 - TIC.y) * k; }
  function pasoNPC(n, dt) {
    if (n.mov) { if (avanzar(n, dt)) n.espera = n.pausa != null ? n.pausa : .2; return; }
    if (n.hablando && RELOJ - n.hablando < 4) return; n.hablando = 0;
    if (!n.ruta || n.ruta.length < 2) { n.espera -= dt; if (n.espera < 0) { n.espera = 2.5 + Math.random() * 3; if (n.mira) n.dir = n.mira[Math.floor(Math.random() * n.mira.length)]; } return; }
    n.espera -= dt; if (n.espera > 0) return;
    const [ti, tj] = n.ruta[n.k % n.ruta.length]; if (n.i === ti && n.j === tj) { n.k++; n.espera = n.descanso != null ? n.descanso : 1.5 + Math.random() * 2.5; return; }
    const d = Math.abs(ti - n.i) >= Math.abs(tj - n.j) && ti !== n.i ? (ti > n.i ? 'der' : 'izq') : (tj > n.j ? 'abajo' : 'arriba'), [dx, dy] = DIRS5[d], ni = n.i + dx, nj = n.j + dy;
    if (!L.libre(ni, nj, 'npc') || (J.i === ni && J.j === nj) || (J.mov && J.mov.a[0] === ni && J.mov.a[1] === nj) || ocupadoNPC(ni, nj, n)) { n.dir = d; n.espera = .6; return; }
    empezarMov(n, d, n.vel || 1.6);
  }
  // ---------- caminos automáticos (BFS, 4 direcciones) ----------
  function bfs(a, b, conNpc) {
    const k = (i, j) => j * W + i, de = new Map([[k(...a), null]]), cola = [a];
    while (cola.length) { const [ci, cj] = cola.shift(); if (ci === b[0] && cj === b[1]) { const r = []; let c = k(ci, cj); while (de.get(c) != null) { const [p, d] = de.get(c); r.unshift(d); c = p; } return r; }
      for (const [d, [dx, dy]] of Object.entries(DIRS5)) { const ni = ci + dx, nj = cj + dy, kk = k(ni, nj); if (de.has(kk) || !(L.libre(ni, nj, conNpc ? undefined : 'npc') || (ni === b[0] && nj === b[1]))) continue; de.set(kk, [k(ci, cj), d]); cola.push([ni, nj]); } }
    return null;
  }
  L.ir = (destino, al, o = {}) => { if (J.mov) { J.i = J.mov.a[0]; J.j = J.mov.a[1]; } const c = bfs([J.i, J.j], destino); if (!c) return false; J.camino = c; J.dest = destino.slice(); J.reintentos = 0; if (o.mirar) J.camino.push(o.mirar); J.al = al || null; if (!c.length && al) { J.al = null; al(); } return true; };
  // ---------- qué hay enfrente (para ¡Toca!) ----------
  L.frente = () => { const [dx, dy] = DIRS5[J.dir], fi = J.i + dx, fj = J.j + dy;
    const n = L.npcs.find(n => (n.i === fi && n.j === fj) || (n.mov && n.mov.a[0] === fi && n.mov.a[1] === fj)); if (n && (n.accion || n.dialogo || n.rincon)) return { npc: n };
    const p = L.props.find(p => (p.accion || p.rincon) && ((p.i === fi && p.j === fj) || (p.toca || []).some(([a, b]) => a === fi && b === fj))); if (p) return { prop: p };
    const o = L.objetos.find(o => o.door && o.door[0] === fi && o.door[1] === fj); if (o) return { edif: o };
    return null; };
  L.botonToca = () => { if (L.auto || L.tour) return; L.tocaT = RELOJ; if (DIALOGO5.abierto) { DIALOGO5.tocar(); return; } if (L.panel) { if (L.panel.toca) L.panel.toca(); return; }
    const f = L.frente(); if (!f) { try { Snd.boton(); } catch (e) { } if (def.tocaVacio) def.tocaVacio(L); return; }
    if (f.npc) { const n = f.npc; n.dir = { arriba: 'abajo', abajo: 'arriba', izq: 'der', der: 'izq' }[J.dir]; n.hablando = RELOJ; actuar(n); }
    else if (f.prop) actuar(f.prop); else if (f.edif) entrarEdificio(f.edif); };
  function actuar(x) { if (def.alActuar && def.alActuar(L, x)) return; if (x.accion) { x.accion(L, x); return; } if (x.dialogo) { const quien = GUARDA.d.perfil === 'david' ? 'david' : 'sarah'; DIALOGO5.abrir(x.nombre || '', x.retrato || (x.persona ? () => sprPersona5(x.persona, 'abajo', 0) : null), x.dialogo[quien] || x.dialogo.sarah); } }
  function entrarEdificio(o) { MANDO5.soltarTodo(); if (L.alEntrarEdificio && L.alEntrarEdificio(o)) return; if (o.accion) { o.accion(L, o); return; }
    if (!o.entra || !LUGARES5[o.entra]) { DIALOGO5.abrir(o.nombre || '', null, [o.cerrado || 'Aquí vive una familia de Belén.']); return; }
    LUGARES5[o.entra].volver = { lugar: L, desde: o.puerta.slice() }; irA(LUGARES5[o.entra], L.irisEn(o)); }
  L.irisEn = o => { const [x, y] = L.ipW(o.puerta[0] + .5, o.puerta[1]); return { tipo: 'iris', x: x - L.cam.x + LW5 / 2, y: y - L.cam.y + LH5 / 2 - 30 }; };
  L.entrarEdificio = entrarEdificio;
  // ---------- recorrido de la cámara (la primera vez completo; después corto) ----------
  L.recorrido = (lista, alFin, cada = 2.1) => { L.tour = { lista, i: 0, t: 0, o: lista[0], alFin, cada }; };
  function pasoTour(dt) { const R = L.tour; if (!R.dicho && R.t > .5) { R.dicho = true; if (L.alTurno && R.i > 0) L.alTurno(R.o); } R.t += dt; if (R.t > R.cada) { R.i++; R.t = 0; R.dicho = false; R.o = R.lista[R.i]; if (!R.o) { L.tour = null; R.alFin && R.alFin(); } } }
  // ---------- cámara ----------
  function apuntar(inst, dt) { let tx = J.x * KA, ty = (J.y - 10) * KA; if (L.tour && L.tour.o) { const o = L.tour.o; tx = (o.i + o.w / 2) * PX; ty = (o.j + o.h / 2) * PX; }
    tx = W * PX <= LW5 ? W * PX / 2 : Math.max(LW5 / 2, Math.min(W * PX - LW5 / 2, tx)); ty = H * PX <= LH5 ? H * PX / 2 - 40 : Math.max(LH5 / 2, Math.min(H * PX - LH5 / 2, ty));   // un cuarto chico queda centrado
    if (inst) { L.cam.x = tx; L.cam.y = ty; } else { const k = 1 - Math.exp(-dt * (L.tour ? 3 : 6)); L.cam.x += (tx - L.cam.x) * k; L.cam.y += (ty - L.cam.y) * k; } }
  // ---------- dibujo ----------
  const vin = canvas(LW5, LH5); { const x = vin.getContext('2d'), g = x.createRadialGradient(LW5 / 2, LH5 / 2, LH5 * .45, LW5 / 2, LH5 / 2, LW5 * .72); g.addColorStop(0, 'rgba(20,10,40,0)'); g.addColorStop(1, 'rgba(20,10,40,.42)'); x.fillStyle = g; x.fillRect(0, 0, LW5, LH5); }
  L.vista = () => { const izq = Math.round(L.cam.x - LW5 / 2), arr = Math.round(L.cam.y - LH5 / 2); return { izq, arr }; };
  L.dibujar = (ctx, dtR) => {
    const dt = pausado5() ? 0 : dtR;
    if (dt) { L.pasoJugador(dt); pasoSanson(dt); pasoTic(dt); L.npcs.forEach(n => pasoNPC(n, dt)); if (L.tour) pasoTour(dt); if (def.paso) def.paso(L, dt);
      if (!J.mov) { J.quieto += dt; J.f = 0; } }
    apuntar(false, dt || .016);
    const { izq, arr } = L.vista();
    ctx.fillStyle = def.fondoColor || '#1a1430'; ctx.fillRect(0, 0, LW5, LH5);
    ctx.save(); ctx.imageSmoothingEnabled = false;
    { const sx0 = Math.max(0, Math.floor(izq / KA)), sy0 = Math.max(0, Math.floor(arr / KA)), sw = Math.min(suelo.width - sx0, Math.ceil(LW5 / KA) + 2), sh = Math.min(suelo.height - sy0, Math.ceil(LH5 / KA) + 2); if (sw > 0 && sh > 0) ctx.drawImage(suelo, sx0, sy0, sw, sh, sx0 * KA - izq, sy0 * KA - arr, sw * KA, sh * KA); }
    if (def.bajo) def.bajo(ctx, izq, arr, L);
    // todo lo que tiene altura, ordenado por su base
    const din = [], dentroV = (x, y, m = 140) => x * KA > izq - m * KA && x * KA < izq + LW5 + m * KA && y * KA > arr - 40 && y * KA < arr + LH5 + 200 * KA;
    L.objetos.forEach(o => { if (dentroV(o.i * TA + o.w * 8, o.base, o.w * 10)) din.push({ b: o.base, f: () => { const s = o.spr; ctx.drawImage(s, o.i * TA * KA - izq - KA, (o.j + o.h) * TA * KA - arr - s.ay * KA, s.width * KA, s.height * KA); if (o.dibujarEncima) o.dibujarEncima(ctx, o.i * TA * KA - izq, o.j * TA * KA - arr, L); } }); });
    L.props.forEach(p => { const bx = p.i * TA + 8 + (p.dx || 0), by = p.base; if (!dentroV(bx, by)) return; din.push({ b: by + (p.orden || 0), f: () => { const s = typeof p.spr === 'function' ? p.spr(L, p) : p.spr; if (!s) return; if (p.sombra) sombra(ctx, bx * KA - izq, by * KA - arr - 2, p.sombra, .25); if (p.mece) { ctx.save(); ctx.translate(bx * KA - izq, by * KA - arr); ctx.transform(1, 0, Math.sin(RELOJ * 1.2 + p.i) * .03, 1, 0, 0); sprK(ctx, s, 0, 0, KA); ctx.restore(); } else sprK(ctx, s, bx * KA - izq, by * KA - arr, KA, { flip: p.flip }); } }); });
    const ojosDe = (e, s) => ((RELOJ + s) % 3.9) < .14 ? 'blink' : null;
    L.npcs.forEach(n => { if (!dentroV(n.x, n.y)) return; din.push({ b: n.y, f: () => { sombra(ctx, n.x * KA - izq, n.y * KA - arr - 2, 20, .3); const d = n.dir === 'izq' ? 'lado' : n.dir === 'der' ? 'lado' : n.dir, s = n.dibujo ? n.dibujo(n) : sprPersona5(n.persona, d, n.mov ? n.f : 0, ojosDe(n, n.i * 1.7), 0), resp = !n.mov && (RELOJ * .9 + n.i) % 2 < 1 ? 1 : 0;
      sprK(ctx, s, n.x * KA - izq, n.y * KA - arr - resp * (n.mov ? 0 : 1), n.dibujo ? KA * (n.escala || 1) : KP5, { flip: n.dir === 'izq' }); } }); });
    if (SAN.activo && !L.foto) din.push({ b: SAN.y, f: () => { const d = SAN.dir === 'izq' || SAN.dir === 'der' ? 'lado' : SAN.dir; sombra(ctx, SAN.x * KA - izq, SAN.y * KA - arr - 2, 24, .3); sprK(ctx, sprSansonA5(d, SAN.mov ? (SAN.f || 0) + (Math.floor(RELOJ * 6) % 2) * 2 : Math.floor(RELOJ * 2.5) % 2 * 2), SAN.x * KA - izq, SAN.y * KA - arr, KP5, { flip: SAN.dir === 'izq' }); } });
    if (!L.foto) din.push({ b: J.y + .1, f: () => { sombra(ctx, J.x * KA - izq, J.y * KA - arr - 2, 22, .32); const d = J.dir === 'izq' || J.dir === 'der' ? 'lado' : J.dir, resp = !J.mov && (RELOJ * .8) % 2 < 1 ? 1 : 0;
      sprK(ctx, spriteHeroeA5(d, J.mov ? J.f : 0, ojosDe(J, 0)), J.x * KA - izq, J.y * KA - arr - resp * 2, KP5, { flip: J.dir === 'izq' }); } });
    if (def.dinamicos) def.dinamicos(L, din, izq, arr, ctx);
    din.sort((a, b) => a.b - b.b).forEach(d => d.f());
    ctx.restore();
    // luces cálidas (una sola capa, suave)
    { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = def.luzA || .85; ctx.imageSmoothingEnabled = true; const k = KA * LZ, sx0 = Math.max(0, Math.floor(izq / k)), sy0 = Math.max(0, Math.floor(arr / k)), sw = Math.min(luz.width - sx0, Math.ceil(LW5 / k) + 2), sh = Math.min(luz.height - sy0, Math.ceil(LH5 / k) + 2); if (sw > 0 && sh > 0) ctx.drawImage(luz, sx0, sy0, sw, sh, sx0 * k - izq, sy0 * k - arr, sw * k, sh * k); ctx.restore(); }
    // Tic vuela por encima de todo
    if (!L.foto) { const ang = Math.round(Math.sin(RELOJ * Math.PI * 80 / 60) * 4) / 10, s = ticMundo7() || sprRobotB({ ang, ojos: (RELOJ % 4.3) < .14 ? 'cerrado' : 'feliz', llama: Math.floor(RELOJ * 14) % 2 }); sombra(ctx, TIC.x * KA - izq, (TIC.y + 30) * KA - arr, 14, .16); sprK(ctx, s, TIC.x * KA - izq, TIC.y * KA - arr + Math.sin(RELOJ * 2.4) * 5, KP5); }
    if (def.encima) def.encima(ctx, izq, arr, L, dt);
    ctx.drawImage(vin, 0, 0);
    if (L.foto) return;
    // burbujas de los lugares y rincones (cerca)
    if (!L.tour && !L.panel) (L.burbujas ? L.burbujas() : []).forEach(B => { const bx = B.x * KA - izq, by = B.y * KA - arr; if (bx < -60 || bx > LW5 + 60 || by < -40 || by > LH5 + 60) return; const dist = Math.hypot(B.x - J.x, B.y - J.y) / TA; if (dist > (B.lejos || 9)) return; const a = Math.max(0, Math.min(1, ((B.lejos || 9) - dist) / 2.5)); burbujaNota5(ctx, bx, by + Math.sin(RELOJ * 2.2 + B.x) * 3, B.c, dist < (B.cerca || 6) ? B.txt : null, { alpha: a, dormido: B.dormido, candado: B.candado, icono: B.icono }); B.pant = [bx, by]; });
    // recorrido: el lugar de turno brilla y muestra su nombre
    if (L.tour && L.tour.o) { const o = L.tour.o, nm = o.nombre || '', w = Math.max(220, nm.length * 17 + 80), q = Math.min(1, L.tour.t * 3); ctx.save(); ctx.globalAlpha = q; cinta5(ctx, nm, LW5 / 2 - w / 2, LH5 / 2 - 150, w); ctx.restore(); }
    // interfaz
    hudArriba5(ctx, L);
    if (L.extraHud) L.extraHud(ctx, dt); if (L.hudFijo) L.hudFijo(ctx, dt);
    if (!L.tour) dibujarMando5(ctx, L);
    if (L.panel) L.panel.dibujar(ctx, dt);
    DIALOGO5.dibujar(ctx, dt);
    if (L.festejo) dibujarFestejo(ctx, dt, L);
  };
  // ---------- toques: botones, ¡Toca!, burbujas (lleva hasta allá) ----------
  L.tocar = (x, y) => {
    if (L.tour) { if (L.tour.saltable) { const R = L.tour; L.tour = null; R.alFin && R.alFin(); } return; }
    if (DIALOGO5.abierto) { DIALOGO5.tocar(); return; }
    if (L.panel) { L.panel.tocar(x, y); return; }
    if (L.festejo || L.auto) return;
    if (Math.hypot(x - TOCA5.x, y - TOCA5.y) < TOCA5.r + 8) { L.botonToca(); return; }
    if (MANDO5.dirDe(x, y)) return;
    if (tocaHud5(x, y, { sinMapa: def.sinMapa })) return;
    if (def.tocarHud && def.tocarHud(L, x, y)) return;
    for (const B of (L.burbujas ? L.burbujas() : [])) { if (!B.pant || !B.ir) continue; if (Math.hypot(x - B.pant[0], y - B.pant[1]) < 34) { const [ti, tj, d, fn] = B.ir; L.ir([ti, tj], () => { J.dir = d || J.dir; if (fn) fn(); else L.botonToca(); }); return; } }
  };
  L.entrar = (o = {}) => {
    MANDO5.soltarTodo(); L.pulsada = null; J.camino = []; J.al = null;
    const [i0, j0, d0] = o.desde ? [o.desde[0], o.desde[1], o.dir || 'abajo'] : def.inicio;
    colocar(J, i0, j0, d0); J.fi = i0; J.fj = j0;
    const atras = { arriba: [0, 1], abajo: [0, -1], izq: [1, 0], der: [-1, 0] }[J.dir]; let si = i0 + atras[0] * 2, sj = j0 + atras[1] * 2; if (!L.libre(si, sj) || !L.libre(i0 + atras[0], j0 + atras[1])) { si = i0 + atras[0]; sj = j0 + atras[1]; } if (!L.libre(si, sj)) { si = i0; sj = j0; } colocar(SAN, si, sj, J.dir); SAN.antes = null; SAN.cola = Math.abs(si - i0) + Math.abs(sj - j0) === 2 ? [[i0 + atras[0], j0 + atras[1]]] : []; L.despierta = null;
    TIC.x = J.x - 30; TIC.y = J.y - 30; apuntar(true, 0);
    const p = GUARDA.perfil(); if (p && def.recordar !== false) { p.lugar = def.id; GUARDA.guardar(); }
    if (def.alEntrar) def.alEntrar(L, o);
    if (L.alEntrar) { const f = L.alEntrar; L.alEntrar = null; f(); }
  };
  L.salir = () => { MANDO5.soltarTodo(); };
  L.revelarTodo = () => { };
  L.colocar = (i, j, d) => { colocar(J, i, j, d); J.fi = i; J.fj = j; const at = { arriba: [0, 1], abajo: [0, -1], izq: [1, 0], der: [-1, 0] }[J.dir], d2 = L.libre(i + at[0], j + at[1]) && L.libre(i + 2 * at[0], j + 2 * at[1]) ? 2 : L.libre(i + at[0], j + at[1]) ? 1 : 0; colocar(SAN, i + at[0] * d2, j + at[1] * d2, J.dir); SAN.antes = null; SAN.cola = d2 === 2 ? [[i + at[0], j + at[1]]] : []; TIC.x = J.x - 30; TIC.y = J.y - 30; apuntar(true, 0); };
  return L;
}
// el héroe (Sarah o David; papá y mamá también caminan) en 4 direcciones, con su traje
function personaHeroe5() { const p = GUARDA.d.perfil || 'sarah', t = trajeActual5();
  if (p === 'sarah' || p === 'david') return Object.assign(persona5(PERS5[p], t !== 'viajero' ? t : null), { id: p + t });
  return p === 'papa' ? { id: 'papaA', adulto: true, pelo: '#3a2418', barba: '#3a2418', peinado: 'corto', ropa: '#2c3a6b', ropa2: '#1f2a52', piel: '#e8b48c', pierna: '#3a3a52', zapato: '#2a1a1a' } : { id: 'mamaA', adulto: true, pelo: '#6b3826', peinado: 'largo', ropa: '#ff8a7a', ropa2: '#e0606a', falda: true, larga: true, piel: '#f2c4a0', zapato: '#8a3a3a' }; }
function spriteHeroeA5(dir, f, ojos) { return sprPersona5(personaHeroe5(), dir, f, ojos); }
// la tarjeta cercana de un lugar (lo que se juega adentro): «Jugar» / «Volver», con el nivel y el candado
function panelLugar5(L, o) {
  const P = { t: 0, o };
  const bt = () => o.bloqueado ? [] : [[LW5 / 2 - 210, 520, 200, 70, o.boton || '¡Jugar!', '#ff7a5a', () => { L.panel = null; o.jugar(); }], [LW5 / 2 + 20, 520, 190, 70, 'Volver', '#fffaf4', () => { L.panel = null; }]];
  P.dibujar = (ctx, dt) => { P.t += dt; const q = Math.min(1, P.t * 4), x = LW5 / 2 - 330, y = 160 - (1 - q) * 20, w = 660, h = 470;
    ctx.save(); ctx.fillStyle = 'rgba(28,16,48,' + .5 * q + ')'; ctx.fillRect(0, 0, LW5, LH5); ctx.globalAlpha = q;
    rr(ctx, x + 8, y + 10, w, h, 22); ctx.fillStyle = '#2a1a3a'; ctx.fill(); rr(ctx, x, y, w, h, 22); ctx.fillStyle = '#fffaf4'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#2a1a3a'; ctx.stroke();
    rr(ctx, x, y, w, 70, 22); ctx.fillStyle = o.color || '#ffd046'; ctx.fill(); ctx.stroke();
    habla5(o.nombre); (o.lineas || []).forEach(habla5); titulo5(ctx, o.nombre, x + w / 2, y + 36, o.nombre.length > 22 ? 32 : 40, '#2a1a3a');
    if (o.retrato) { const s = o.retrato(), a7 = retratoArte7(s, 240, (o.lineas || []).join(' ')); if (a7) ctx.drawImage(a7, Math.round(x + 110 - a7.width / 2), y + 330 - a7.height); else sprK(ctx, s, x + 110, y + 270, Math.min(6, 150 / s.height)); }
    ctx.font = '600 25px Outfit'; ctx.fillStyle = '#2a1a3a'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    const tx = x + (o.retrato ? 210 : 50), tw = w - (o.retrato ? 250 : 100); let ty = y + 104;
    (o.lineas || []).forEach((ln, k) => { const pal = ln.split(' '); let lin = ''; pal.forEach(p => { if (ctx.measureText(lin + p).width > tw) { ctx.fillText(lin, tx, ty); ty += 33; lin = ''; } lin += p + ' '; }); ctx.font = k === 0 ? '600 25px Outfit' : '500 23px Outfit'; ctx.fillStyle = k === 0 ? '#2a1a3a' : '#6b5a7d'; ctx.fillText(lin, tx, ty); ty += 44; });
    if (o.nivel != null) { for (let k = 0; k < 10; k++) { estrella(ctx, tx + 16 + k * 36, y + 380, k < o.nivel ? 15 : 11, k < o.nivel ? '#ffd046' : '#e2d2b0'); } ctx.font = '700 20px Outfit'; ctx.fillStyle = '#6b5a7d'; ctx.fillText('nivel ' + (o.nivel + 1), tx, y + 404); }
    if (o.bloqueado) { candado5(ctx, x + w / 2, y + 470 - 70, 40); }
    bt().forEach(([bx, by, bw, bh, t, c]) => { rr(ctx, bx + 4, by + 6, bw, bh, 18); ctx.fillStyle = '#2a1a3a'; ctx.fill(); rr(ctx, bx, by, bw, bh, 18); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = 4; ctx.stroke(); titulo5(ctx, t, bx + bw / 2, by + bh / 2 + 2, 32, c === '#fffaf4' ? '#2a1a3a' : '#fff6e0'); });
    if (o.bloqueado) { rr(ctx, LW5 / 2 - 95, 540, 190, 60, 18); ctx.fillStyle = '#fffaf4'; ctx.fill(); ctx.lineWidth = 4; ctx.stroke(); titulo5(ctx, 'Volver', LW5 / 2, 572, 30, '#2a1a3a'); }
    ctx.restore(); };
  P.tocar = (x, y) => { if (P.t < .25) return; if (o.bloqueado) { L.panel = null; return; } for (const [bx, by, bw, bh, , , fn] of bt()) if (x > bx && x < bx + bw && y > by && y < by + bh) { try { Snd.boton(); } catch (e) { } fn(); return; } };
  P.toca = () => { if (P.t < .25) return; L.panel = null; if (!o.bloqueado) o.jugar(); };
  L.panel = P; try { Snd.boton(); } catch (e) { }
  return P;
}
// barra de arriba del mundo: nombre del lugar, misión, corcheas, botones
function hudArriba5(ctx, L) {
  const def = L.def; pildora5(ctx, 26, 22, def.titulo || def.nombre, { tam: 26 });
  if (def.subtitulo) { const s = def.subtitulo(L); if (s) pildora5(ctx, 26, 82, s, { tam: 19, h: 40, fondo: '#2a1a3a', c: '#ffe9b0' }); }
  const m = m2_(); if (m) { ctx.save(); const t = '♪ ' + m.corcheas; ctx.font = '700 28px Outfit'; const w = ctx.measureText(t).width + 40; rr(ctx, LW5 - 236 - w, 22, w, 52, 26); ctx.fillStyle = '#fffaf4'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#2a1a3a'; ctx.stroke(); ctx.fillStyle = '#c8901a'; ctx.textBaseline = 'middle'; ctx.fillText(t, LW5 - 236 - w + 20, 50); ctx.restore(); }
  BOTONES5.forEach(([ic, x, y]) => { if (ic === 'mapa' && def.sinMapa) return; botonRedondo5(ctx, x, y, ic); });
}
