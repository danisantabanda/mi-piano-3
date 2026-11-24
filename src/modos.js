// =====================================================================
//  M4 · TODOS LOS MODOS (Belén = la gran prueba de Dani): fuera del currículo, con 3 corazones donde corresponde.
//  Batallas con el rival, partituras al azar, notas que caen, sala de conciertos, kiosco (acompañar a la banda),
//  tienda del luthier, vestidor, casa que se decora, instrumentos que suenan, museo, secretos, modo Papá y atajos.
// =====================================================================
const TIENDA5 = [
  { id: 'marimba', tipo: 'instrumento', nombre: 'Marimba', precio: 12 }, { id: 'celesta', tipo: 'instrumento', nombre: 'Celesta', precio: 12 },
  { id: 'arpa', tipo: 'instrumento', nombre: 'Arpa', precio: 20 }, { id: 'flauta', tipo: 'instrumento', nombre: 'Flauta', precio: 20 },
  { id: 'medieval', tipo: 'traje', nombre: 'Traje medieval', precio: 20 }, { id: 'barroco', tipo: 'traje', nombre: 'Traje barroco', precio: 30 }, { id: 'andino', tipo: 'traje', nombre: 'Ruana andina', precio: 40 },
  { id: 'cuadro', tipo: 'casa', nombre: 'Cuadro', precio: 6 }, { id: 'candelabro', tipo: 'casa', nombre: 'Candelabro', precio: 6 }, { id: 'reloj', tipo: 'casa', nombre: 'Reloj de pie', precio: 10 },
  { id: 'estante', tipo: 'casa', nombre: 'Estante de partituras', precio: 10 }, { id: 'trofeos', tipo: 'casa', nombre: 'Repisa de trofeos', precio: 14 }, { id: 'marimbaCasa', tipo: 'casa', nombre: 'Marimba para la casa', precio: 16 },
];
const tiene5 = id => { const m = m2_(); return !!(m && m.compras && m.compras[id]); };
function comprar5(it) { const m = m2_(); m.compras = m.compras || {}; if (m.compras[it.id] || m.corcheas < it.precio) return false; m.corcheas -= it.precio; m.compras[it.id] = hoy5(); if (it.tipo === 'traje') m.traje = it.id; if (it.tipo === 'instrumento') m.instrumento = it.id; GUARDA.guardar(); try { Snd.cofre(); } catch (e) { } marca5('compra ' + it.id); return true; }
// el instrumento elegido suena en el teclado de pantalla FUERA de las clases (en las clases siempre el piano)
function instrumentoLibre5() { const m = m2_(); return m && m.instrumento && tiene5(m.instrumento) ? m.instrumento : null; }
// ---------- volver de un modo ----------
function volverDeModo5(P) { const v = P.volver || { lugar: LUGARES5.belen, desde: null }; const B = LUGARES5.belen; B.auto = false; B.extraHud = null; B.alEntrar = null; irA(v.lugar, { tipo: 'iris', desde: v.desde }); }
function abrirModo5(id, desde) { const P = PARADA5[id]; if (!P) return; const L = ESC && ESC.def ? ESC : LUGARES5.belen; P.volver = { lugar: L, desde: desde || (L.jugador ? [Math.round(L.jugador.fi), Math.round(L.jugador.fj)] : null) }; SON5.iniciar(); irA(P, { tipo: 'iris' }); }
// =====================================================================
//  Paradas «libres» (usan el motor de las paradas: Tic, pulso, acierto/error, demostración, corazones)
// =====================================================================
let CONCIERTO5 = { cancion: 'jingle' };
function definirModos5() {
  // batalla con el rival: eco con la flauta, motivos al azar de lo que ya sabe; 3 corazones
  crearParada5('batalla', P => { P.ticPos = [100, 300, 4]; const M = motivos5(true).sort(() => Math.random() - .5).slice(0, 4);
    return { libre: true, vidas: 3, premio: 3, fondo: 'b-conservatorio', pasos: M.map(m => pasoLectura5(m, 'ritmo', { introCanto: 1, voz: 'flauta', corto: true })),
      decor: (P, ctx) => { const x = 1222, y = 596, toca = P.ticCanta > P.t; sombra(ctx, x, y, 30, .3); sprK(ctx, destacado5(sprPastorcito({ toca })), x, y, 4, { flip: true }); } }; });
  // partituras al azar: leer y tocar a primera vista (pentagrama siempre visible); 3 corazones
  crearParada5('partituras', P => { const V = patronesDia5(diaPlan5(), 6, Math.floor(Math.random() * 999)).slice(2, 6);
    return { libre: true, vidas: 3, premio: 3, fondo: 'b-salon', pasos: V.map((v, i) => pasoLectura5(v, i < 2 ? 'ritmo' : 'tempo', { lectura: 2, titulo: 'Partitura al azar · ' + (i + 1) })) }; });
  // sala de conciertos: la canción que escojas, entera, con la banda y el público
  crearParada5('concierto', P => { const V = VILLANCICOS5[CONCIERTO5.cancion], ver = versionDe5(CONCIERTO5.cancion), notas = [], ac = []; ver.forEach(k => { notas.push(...V.pedazos[k].notas); ac.push(...V.pedazos[k].ac); });
    const MI = NOTA_PC5[conocidas5()[0]], melo = notas.every(x => conoce5(x.n));
    return { libre: true, premio: 3, fondo: 'n-sala', pasos: [pasoLectura5(notas, 'tempo', { base: true, acordes: ac, compas: V.compas, bpm: V.bpm, anac: V.pedazos[ver[0]].anac || 0, unaTecla: melo ? 0 : MI, titulo: V.titulo + ' · concierto', lectura: 2 })],
      alGanar: () => { aplauso5(); voz5(CONCIERTO5.pesebre ? 'pesebre-bravo' : 'concierto-bravo', { hito: true }); if (CONCIERTO5.pesebre) { const m = m2_(); m.insignias = m.insignias || {}; m.insignias.nochebuena = m.insignias.nochebuena || hoy5(); GUARDA.guardar(); } }, decor: (P, ctx) => CONCIERTO5.pesebre ? publicoPesebre5(ctx, P) : publico5(ctx, P) }; });
  // kiosco: la banda toca el villancico y tú la acompañas con el pulso en la nota del acorde
  crearParada5('kiosco', P => { const id = cancionDelDia5(), V = VILLANCICOS5[id], ver = versionDe5(id).slice(0, 2), mel = [], ac = []; ver.forEach(k => { mel.push(...V.pedazos[k].notas); ac.push(...V.pedazos[k].ac); });
    const RAIZ = { C: 60, F: 65, G: 67, G7: 67, D: 62, Am: 69, Dm: 62, Em: 64, E: 64 }, acomp = [];
    ac.forEach(a => { let n = RAIZ[a] || 60; if (!conoce5(n)) n = NOTA_PC5[conocidas5()[0]]; for (let i = 0; i < V.compas; i++) acomp.push({ n, d: 1 }); });
    return { libre: true, premio: 2, fondo: 'natal', pasos: [pasoLectura5(acomp, 'tempo', { base: true, acordes: ac, compas: V.compas, bpm: V.bpm, banda: mel, anacBanda: V.pedazos[ver[0]].anac || 0, titulo: 'La banda toca ' + V.titulo + ': tú llevas el pulso' })],
      decor: (P, ctx) => { [[1120, 600, () => adulto({ id: 'director', barba: true, ropa: '#fff6e6', saco: '#2a4b9b', pantalon: '#3a3a52' })], [1210, 590, NPC5.musico]].forEach(([x, y, f]) => { sombra(ctx, x, y, 26, .3); sprK(ctx, apagado5(f()), x, y - Math.abs(Math.sin(RELOJ * 4)) * 3, 2.6); }); } }; });
}
// el concierto en el pesebre (final de Belén): María, José, el niño, los pastores, la estrella y los vecinos escuchan
function publicoPesebre5(ctx, P) {
  ctx.save(); ctx.fillStyle = 'rgba(20,12,44,.55)'; ctx.fillRect(0, 0, LW5, 600); ctx.restore();
  estrellaArriba5(ctx, LW5 / 2, 70, null);
  const salta = i => P.fin ? Math.abs(Math.sin(RELOJ * 7 + i)) * 10 : 0;
  sprK(ctx, NAC.pesebre(), 140, 600, 3.2); sprK(ctx, sprPersona5(VECINOS5.maria, 'abajo', 0), 70, 600 - salta(1), 2.2); sprK(ctx, sprPersona5(VECINOS5.jose, 'abajo', 0), 215, 600 - salta(2), 2.2);
  [VECINOS5.pastor, VECINOS5.vecina, VECINOS5.nina1, VECINOS5.nino2, VECINOS5.abuelo].forEach((p, i) => sprK(ctx, sprPersona5(p, 'abajo', 0, (RELOJ + i) % 3.6 < .14 ? 'blink' : null), 1070 + (i % 3) * 64, 600 - (i > 2 ? 0 : 6) - salta(i + 3), 2));
  sprK(ctx, sprSansonA5('abajo', 0), 1220, 604, 2);
}
function aplauso5() { if (!SON5.listo) return; const K = KitSonido, t0 = K.ahora(); for (let i = 0; i < 40; i++) { const t = t0 + Math.random() * 2.2; K.percusion.rim(K.bus('efectos'), t, .25 + Math.random() * .3); K.percusion.shaker(K.bus('efectos'), t + .01, .3); } }
function publico5(ctx, P) {
  const gente = [() => PAPA(), () => MAMA(), () => sprSanson({}), ...['Nina', 'Josué', 'Noah', 'Samuel', 'Isaac'].map(n => () => PRIMOS[n]())];
  ctx.save(); ctx.fillStyle = 'rgba(28,16,48,.35)'; ctx.fillRect(0, 586, 200, 20); ctx.restore();
  gente.slice(0, 4).forEach((f, i) => { const x = 40 + i * 44, y = 600 - (P.fin ? Math.abs(Math.sin(RELOJ * 8 + i)) * 10 : 0); sprK(ctx, apagado5(f()), x, y, 1.7); });
  gente.slice(4).forEach((f, i) => { const x = 1135 + i * 36, y = 600 - (P.fin ? Math.abs(Math.sin(RELOJ * 8 + i)) * 10 : 0); sprK(ctx, apagado5(f()), x, y, 1.7); });
}
// =====================================================================
//  NOTAS QUE CAEN (3 corazones): las notas bajan hacia su tecla; se tocan cuando llegan a la línea dorada
// =====================================================================
function crearCaen5() {
  const S = { dia: true, t: 0, fx: fx5(), pulso: pulso5(), padGolpe: [], ticPos: [100, 330, 4] };
  const LINEA = TECLADO5.y - 30; let CAIDA = 2.6;
  S.reloj = () => S.t;
  S.entrar = () => {
    S.t = 0; S.fin = null; S.vidas = 3; S.ok = 0; S.fx.lista.length = 0; TECLADO5.dedos = dedosDia5();
    const nv = S.nivel = nivelJuego5('torre'), bpm = Math.min(96, tempoDia5() + 4 + nv * 3), b = 60 / bpm, K = conocidas5().map(pc => NOTA_PC5[pc]); S.caida = Math.max(1.5, 2.8 - nv * .12); S.notas = []; let tb = 4;
    for (let r = 0; r < 6; r++) retoGen5('melodia', nv, nv * 31 + r * 7 + (Date.now() % 97)).notas.forEach(x => { if (x.n) S.notas.push({ n: K.length > 1 ? x.n : K[0], t: 2 + tb * b, d: x.d, est: 0 }); tb += x.d; });
    S.notas = S.notas.slice(0, 12 + Math.min(24, nv * 4)); S.pulso.anclar(2, bpm); S.pulso.sonar = true; S.ult = -9; marca5('notas que caen'); SON5.musica(null); voz5('anuncio-caen', { forzar: true });
  };
  S.dibujar = (ctx, dtR) => {
    const dt = pausado5() ? 0 : dtR; S.t += dt; S.pulso.paso(S.t); CAIDA = S.caida || 2.6;
    if (!S.fin) {
      S.notas.forEach(x => { if (x.est === 0 && S.t > x.t + .22) { x.est = -1; S.vidas--; S.fx.estallar(276, 112, '#ff5a7a', 12); pista5(x.n, .6); if (S.vidas <= 0) { S.fin = { t: S.t, gano: false }; marca5('caen perdido'); subirNivel5('torre', false); } } });
      if (!S.fin && S.notas.every(x => x.est !== 0)) { S.fin = { t: S.t, gano: true }; const m = m2_(); m.corcheas += 3; GUARDA.guardar(); subirNivel5('torre', true); try { Snd.desbloqueo(); } catch (e) { } marca5('caen ganado'); }
    } else if (S.t - S.fin.t > 3.2 && !S.fin.ido) { S.fin.ido = true; volverDeModo5(S); }
    // cielo de Belén
    const f7 = fondoArte7('int-torre'); if (f7) { ctx.drawImage(f7, 0, 0); ctx.fillStyle = 'rgba(28,16,48,.42)'; ctx.fillRect(0, 0, LW5, LH5); } else {   /* M7: la torre ilustrada, oscurecida para que las notas que caen resalten */
    ctx.fillStyle = lg(ctx, 0, 0, 0, LH5, [[0, '#1d1446'], [.7, '#4a2a6a'], [1, '#7a3a5a']]); ctx.fillRect(0, 0, LW5, LH5);
    for (let i = 0; i < 80; i++) { const x = (i * 211) % LW5, y = (i * 97) % 560; ctx.fillStyle = 'rgba(255,240,200,' + (.3 + .3 * Math.sin(RELOJ * 2 + i)) + ')'; ctx.fillRect(x, y, 2, 2); }
    estrellaBelen(ctx, LW5 / 2, 110, RELOJ); }
    // carriles y línea dorada
    Object.keys(TECLADO5.dedos || {}).concat(conocidas5().map(pc => NOTA_PC5[pc])).forEach(n => { const x = xDeTecla(+n); ctx.fillStyle = 'rgba(251,241,216,.06)'; ctx.fillRect(x - 24, 0, 48, LINEA); });
    ctx.save(); ctx.strokeStyle = '#ffd046'; ctx.lineWidth = 5; ctx.shadowColor = '#ffd046'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(60, LINEA); ctx.lineTo(LW5 - 60, LINEA); ctx.stroke(); ctx.restore();
    S.notas.forEach(x => { if (x.est === 1) return; const q = 1 - (x.t - S.t) / CAIDA; if (q < 0 || q > 1.15) return; const xx = xDeTecla(x.n), y = 40 + q * (LINEA - 40), h = Math.max(30, x.d * 34);
      ctx.save(); ctx.globalAlpha = x.est === -1 ? .3 : 1; rr(ctx, xx - 24, y - h, 48, h, 10); ctx.fillStyle = COLOR_NOTA5(x.n); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
      texto(ctx, NOMBRE_NOTA5(x.n), xx, y - h / 2, { tam: 15, c: '#fff8ec', borde: 4, bordeC: INK }); });
    dibujarTic5(ctx, S, 100, 330, 4);
    cinta5(ctx, 'Torre de notas · nivel ' + ((S.nivel || 0) + 1), 44, 50, 360); for (let i = 0; i < 3; i++) corazon(ctx, 230 + i * 46, 116, 15, i < S.vidas ? '#ff5a7a' : 'rgba(251,241,216,.3)');
    texto(ctx, S.ok + ' / ' + S.notas.length, LW5 - 160, 50, { tam: 30, c: '#fffaf4', borde: 6, bordeC: INK }); botonRedondo5(ctx, LW5 - 50, 48, 'pausa');
    dibujarTeclado5(ctx); S.fx.dibujar(ctx, dt);
    if (S.fin) { ctx.save(); ctx.fillStyle = 'rgba(28,16,48,.5)'; ctx.fillRect(0, 0, LW5, LH5); ctx.restore(); if (S.fin.gano) { rayosLuz5(ctx, LW5 / 2, 300, S.t); titulo5(ctx, '+3', LW5 / 2, 320, 70, '#ffd046', { borde: 9, bordeC: '#2a1a3a' }); } else for (let i = 0; i < 3; i++) corazon(ctx, LW5 / 2 - 60 + i * 60, 300, 26, 'rgba(251,241,216,.3)'); }
  };
  S.tocar = (x, y) => { if (Math.hypot(x - (LW5 - 50), y - 48) < 34) { MENU5.abrir('pausa'); return; } const n = teclaEn(x, y); if (n != null) notaEntrante(n, 90, 'pantalla'); };
  S.nota = (n, t) => { if (S.fin) return null; const junto = t - S.ult < .1; S.ult = t; const w = ventana5({ apoyo: 0 }); const x = S.notas.find(z => z.est === 0 && Math.abs(z.t - t) <= w && z.n === n);
    if (x && !junto) { x.est = 1; S.ok++; S.fx.estallar(xDeTecla(n), LINEA - 10, COLOR_NOTA5(n), 16); SON5.acorde(n); return 'ok'; }
    return 'error'; };   // tocar sin nota cayendo no quita corazón (solo suena suave)
  S.objetivo = () => { if (S.fin) return null; const x = S.notas.find(z => z.est === 0); return x ? { id: 'C' + S.notas.indexOf(x), n: x.n, t: x.t, tempo: true } : null; };
  return S;
}
// =====================================================================
//  EL MUSEO DE BELÉN: retratos y objetos; al tocar uno, su historia corta (palabra por palabra)
// =====================================================================
const MUSEO5 = [
  ['Juan Sebastián Bach', () => sprBachElegante(), 'Escribía al final de sus partituras: solo a Dios la gloria. Tuvo veinte hijos y muchos fueron músicos.'],
  ['Wolfgang Amadeus Mozart', () => sprMozart({}), 'Compuso su primera música a los cinco años. Tocaba con los ojos vendados para jugar.'],
  ['Ludwig van Beethoven', () => sprBeethoven({}), 'Se quedó sordo y siguió componiendo: sentía la música en el piano con las manos.'],
  ['El señor Maelzel', () => cache('maelzelSil', () => teñido(adulto({ id: 'maelzel', ropa: '#2c3a6b', saco: '#1f2a52' }), '#3a2a4a')), 'Inventó el metrónomo, el abuelo de Tic. En enero lo vamos a conocer.'],
  ['El clavecín', () => sprClavecin({}), 'El piano de los tiempos de Bach: sus cuerdas no se golpean, se pellizcan con una plumita.'],
  ['El órgano', () => sprOrgano(), 'Suena con aire que pasa por los tubos. Bach lo tocaba en la iglesia cada domingo.'],
];
function crearMuseo5() {
  const S = { dia: true, t: 0 }; S.reloj = () => S.t;
  S.entrar = () => { S.t = 0; S.sel = -1; S.t0 = 0; S.fondo = fotoInterior5('int-museo'); marca5('museo'); voz5('anuncio-museo', { forzar: true }); };
  const pos = k => [190 + (k % 3) * 340, 150 + Math.floor(k / 3) * 250];
  S.dibujar = (ctx, dtR) => { const dt = pausado5() ? 0 : dtR; S.t += dt;
    ctx.drawImage(S.fondo, 0, 0); ctx.fillStyle = 'rgba(28,16,48,.35)'; ctx.fillRect(0, 0, LW5, LH5);
    cinta5(ctx, 'Museo de Belén', 44, 50, 280); botonRedondo5(ctx, LW5 - 50, 48, 'salir');
    MUSEO5.forEach(([nom, spr], k) => { const [x, y] = pos(k), on = S.sel === k;
      ctx.save(); ctx.shadowColor = on ? 'rgba(255,208,70,.9)' : 'rgba(0,0,0,.4)'; ctx.shadowBlur = on ? 26 : 14; rr(ctx, x, y, 240, 200, 10); ctx.fillStyle = '#d9a930'; ctx.fill(); ctx.restore();
      ctx.save(); rr(ctx, x + 12, y + 12, 216, 176, 6); ctx.fillStyle = lg(ctx, 0, y, 0, y + 200, [[0, '#3a5bb0'], [1, '#1d3672']]); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#7a4a10'; ctx.stroke(); ctx.restore();
      const s = spr(); sprK(ctx, s, x + 120, y + 176, Math.min(3, 150 / s.height)); texto(ctx, nom, x + 120, y + 222, { tam: 18, c: '#fffaf4', borde: 5, bordeC: INK }); });
    if (S.sel >= 0) burbuja5(ctx, 190, 640 - 60, 900, MUSEO5[S.sel][2], S.t - S.t0);
  };
  S.tocar = (x, y) => { if (Math.hypot(x - (LW5 - 50), y - 48) < 34) { volverDeModo5(S); return; } MUSEO5.forEach((m, k) => { const [px, py] = pos(k); if (x > px && x < px + 240 && y > py && y < py + 200) { S.sel = k; S.t0 = S.t; try { Snd.boton(); } catch (e) { } } }); };
  S.nota = () => null; S.objetivo = () => null;
  return S;
}
// =====================================================================
//  Menús de la tienda y el vestidor (DOM), modo Papá y atajos
// =====================================================================
function imgSprite5(s, k = 4) { const c = canvas(s.width * k, s.height * k), x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(s, 0, 0, c.width, c.height); return c.toDataURL(); }
function menuTienda5(caja, boton, h) {
  h('El luthier'); voz5('anuncio-tienda', { forzar: true }); const m = m2_(); const info = document.createElement('div'); info.className = 'info desliza'; caja.appendChild(info);
  const pinta = () => { info.innerHTML = '<p><b>' + m.corcheas + '</b> corcheas doradas</p>' + ['instrumento', 'traje', 'casa'].map(tp => '<div class="tarj"><h3>' + { instrumento: 'Instrumentos que suenan (en el teclado, fuera de las clases)', traje: 'Trajes (se cambian en el vestidor de tu casa)', casa: 'Para decorar tu casa' }[tp] + '</h3>' +
      TIENDA5.filter(it => it.tipo === tp).map(it => '<div class="fila"><button data-c="' + it.id + '"' + (tiene5(it.id) ? ' disabled' : '') + '>' + (tiene5(it.id) ? '✓ tuyo' : it.precio + ' ♪') + '</button> ' + it.nombre + (tp === 'instrumento' && tiene5(it.id) ? ' <button data-u="' + it.id + '">' + (m.instrumento === it.id ? 'sonando' : 'usar') + '</button>' : '') + '</div>').join('') + '</div>').join('') + '<div class="fila"><button data-u="">Volver al piano</button></div>';
    info.querySelectorAll('button[data-c]').forEach(b => b.onclick = () => { const it = TIENDA5.find(x => x.id === b.dataset.c); if (!comprar5(it)) { b.textContent = 'faltan corcheas'; return; } pinta(); });
    info.querySelectorAll('button[data-u]').forEach(b => b.onclick = () => { m.instrumento = b.dataset.u || null; GUARDA.guardar(); if (b.dataset.u) SON5.nota(64, 90); pinta(); }); };
  pinta();
}
function menuVestidor5(caja, boton, h) {
  h('El vestidor'); voz5('anuncio-vestidor', { forzar: true }); const m = m2_(), p = GUARDA.d.perfil, info = document.createElement('div'); info.className = 'info desliza'; caja.appendChild(info);
  if (p !== 'sarah' && p !== 'david') { info.innerHTML = '<p>Los trajes son para Sarah y David.</p>'; return; }
  const trajes = ['viajero'].concat(['medieval', 'barroco', 'andino'].filter(tiene5));
  info.innerHTML = '<div class="fila" style="gap:18px">' + trajes.map(t => { const b = p === 'sarah' ? sprSarah({ cross: 'up' }) : sprDavid({}); b.clave = 'vest'; return '<button data-t="' + t + '" style="padding:8px;border-radius:16px' + (trajeActual5() === t ? ';background:#ffd046' : '') + '"><img src="' + imgSprite5(conTraje(b, t, p), 4) + '" style="image-rendering:pixelated;display:block;margin:auto"><span style="font-size:17px">' + ({ viajero: 'viajero', medieval: 'medieval', barroco: 'barroco', andino: 'andino' }[t]) + '</span></button>'; }).join('') + '</div>' + (trajes.length < 4 ? '<p class="nota">Más trajes en la tienda del luthier.</p>' : '');
  info.querySelectorAll('button[data-t]').forEach(b => b.onclick = () => { m.traje = b.dataset.t; GUARDA.guardar(); try { Snd.boton(); } catch (e) { } MENU5.abrir('vestidor'); });
}
function menuConcierto5(caja, boton, h) {
  h('Sala de conciertos'); const info = document.createElement('div'); info.className = 'info desliza'; caja.appendChild(info);
  info.innerHTML = '<p>Escoge la canción del concierto (la familia escucha):</p>' + ROTACION5.map(id => '<div class="fila"><button data-s="' + id + '">▶ Tocar</button> ' + VILLANCICOS5[id].titulo + (VILLANCICOS5[id].verificar ? ' <span class="nota">(melodía por confirmar)</span>' : '') + '</div>').join('');
  info.querySelectorAll('button[data-s]').forEach(b => b.onclick = () => { CONCIERTO5.cancion = b.dataset.s; CONCIERTO5.pesebre = false; MENU5.cerrar(); abrirModo5('concierto'); });
}
// atajos de papá: saltar a cualquier modo; simular el día de la progresión; ver todos los mundos; dueto
const ATAJOS5 = [['La sesión de hoy', () => empezarDia5(LW5 / 2, LH5 / 2)], ['Patio', () => irA(PARADA5.patio, { tipo: 'iris' })], ['Coro', () => irA(PARADA5.coro, { tipo: 'iris' })], ['Salón de Bach', () => irA(PARADA5.salon, { tipo: 'iris' })],
  ['Teatro', () => irA(PARADA5.teatro, { tipo: 'iris' })], ['Taller', () => irA(PARADA5.taller, { tipo: 'iris' })], ['Órgano del día', () => irA(ESCENA_ORGANO, { tipo: 'iris' })], ['Duelo del Conservatorio', () => irA(PARADA5.conservatorio, { tipo: 'iris' })],
  ['Batalla con el rival', () => abrirModo5('batalla')], ['Partituras al azar', () => abrirModo5('partituras')], ['Notas que caen', () => { ESCENA_CAEN5.volver = { lugar: LUGARES5.belen }; irA(ESCENA_CAEN5, { tipo: 'iris' }); }],
  ['Sala de conciertos', () => MENU5.abrir('concierto')], ['Kiosco: acompañar a la banda', () => abrirModo5('kiosco')], ['Tienda del luthier', () => MENU5.abrir('tienda')], ['Vestidor', () => MENU5.abrir('vestidor')],
  ['Museo', () => { ESCENA_MUSEO5.volver = { lugar: LUGARES5.belen }; irA(ESCENA_MUSEO5, { tipo: 'iris' }); }], ['Mapa del mundo', () => irA(ESCENA_MAPA, { tipo: 'fundido' })], ['Mi aldea', () => irA(LUGARES5.natal, { tipo: 'iris' })], ['Belén (pasear)', () => { const B = LUGARES5.belen; B.auto = false; B.alEntrar = null; B.extraHud = null; irA(B, { tipo: 'iris' }); }],
  ['Primer día (carta)', () => irA(ESCENA_CARTA, { tipo: 'iris' })],
  ['Torre de notas', () => { ESCENA_CAEN5.volver = { lugar: LUGARES5.belen }; irA(ESCENA_CAEN5, { tipo: 'iris' }); }], ['Casa del ritmo', () => abrirModo5('ritmo')], ['Biblioteca de teoría', () => { ESCENA_BIBLIO5.volver = { lugar: LUGARES5.belen }; irA(ESCENA_BIBLIO5, { tipo: 'iris' }); }],
  ['Arena del eco', () => abrirModo5('batalla')], ['Gimnasio de dedos', () => abrirModo5('gimnasio')], ['Concierto en el pesebre', () => conciertoPesebre5()]];
function menuPapa5(info, esc) {
  const m = m2_(), d = diaPlan5(), pl = planDia5(d);
  info.innerHTML = '<div class="tarj"><h3>Ir directo a…</h3><div class="fila">' + ATAJOS5.map(([t], i) => '<button data-a="' + i + '">' + t + '</button>').join('') + '</div></div>' +
    '<div class="tarj"><h3>Saltar a una misión (la historia y lo que se abre)</h3><p>Ahora: <b>misión ' + (Math.min(14, (m.mision || 0)) + 1 > 14 ? '★ final' : (m.mision || 0) + 1) + '</b> — ' + esc(pl.nuevo) + ' · notas ' + pl.notas.map(pc => NOMBRE_NOTA5(NOTA_PC5[pc])).join(' ') + ' · ' + pl.bpm + ' bpm</p><div class="fila">' + PLAN_BELEN5.map((x, i) => '<button data-d="' + i + '"' + (i === (m.mision || 0) ? ' class="on"' : '') + '>' + (i + 1) + '</button>').join('') + '<button data-d="14"' + ((m.mision || 0) >= 14 ? ' class="on"' : '') + '>★</button></div></div>' +
    '<div class="tarj"><h3>Modo Papá</h3><div class="fila"><button data-t="dueto">' + (GUARDA.d.dueto ? '✓ ' : '') + 'Dueto: papá toca la mano izquierda (notas graves del piano MIDI, sin juzgar; la banda calla el bajo)</button></div><div class="fila"><button data-t="verMundos">' + (GUARDA.d.verMundos ? '✓ ' : '') + 'Ver todos los mundos en el mapa</button></div><div class="fila"><button data-x="corcheas">+50 corcheas</button><button data-x="hoy">Borrar la sesión de hoy</button></div></div>';
  info.querySelectorAll('button[data-a]').forEach(b => b.onclick = () => { MENU5.cerrar(); ATAJOS5[+b.dataset.a][1](); });
  info.querySelectorAll('button[data-d]').forEach(b => b.onclick = () => { const v = +b.dataset.d; m.mision = v; m.diaForzado = null; m.ses = {}; m.vistoDespertar = v; GUARDA.guardar(); MENU5.abrir('papas'); });
  info.querySelectorAll('button[data-t]').forEach(b => b.onclick = () => { GUARDA.d[b.dataset.t] = !GUARDA.d[b.dataset.t]; GUARDA.guardar(); MENU5.abrir('papas'); });
  info.querySelectorAll('button[data-x]').forEach(b => b.onclick = () => { if (b.dataset.x === 'corcheas') m.corcheas += 50; else { delete m.dias[hoy5()]; const n = Math.min(13, m.mision || 0); if (m.ses) delete m.ses[n]; } GUARDA.guardar(); MENU5.abrir('papas'); });
}
// =====================================================================
//  Dónde viven los modos en el mundo (NPCs con acción, puertas) y los secretos nuevos
// =====================================================================
let ESCENA_CAEN5 = null, ESCENA_MUSEO5 = null;
function iniciarModos5() {
  definirModos5(); ESCENA_CAEN5 = crearCaen5(); ESCENA_MUSEO5 = crearMuseo5();
  const B0 = LUGARES5.belen, B = B0.arriba ? { npcs: [], objetos: [], secretos: [], set alEntrarEdificio(v) { } } : B0, N = LUGARES5.natal, npc = (L, o) => { L.npcs.push(Object.assign({ dialogo: { sarah: [''] } }, o)); };
  npc(B, { i: 13, j: 16, nombre: 'Pastorcito', sprite: () => sprPastorcito({}), accion: () => abrirModo5('batalla') });
  npc(B, { i: 22, j: 16, nombre: 'Escriba', sprite: () => adulto({ id: 'escriba', ropa: '#e8d6a0', saco: '#7f3fc8', pantalon: '#5a3a2a' }), accion: () => abrirModo5('partituras') });
  npc(B, { i: 8, j: 18, nombre: 'Tamborilero', sprite: () => chico({ id: 'tambor', ropa: '#c23345', pelo: '#3a2418', extra: g => { g.R(14, 20, 9, 7, '#c98a52'); g.R(14, 20, 9, 1, '#fffaf4'); } }), flip: true, accion: () => { ESCENA_CAEN5.volver = { lugar: B, desde: [9, 18] }; irA(ESCENA_CAEN5, { tipo: 'iris' }); } });
  // el museo: la primera casa de piedra de Belén
  const casa = B.objetos.find(o => o.nombre === 'Casa' && o.i === 9 && o.j === 3); if (casa) casa.nombre = 'Museo';
  const ant = B.alEntrarEdificio; B.alEntrarEdificio = o => { if (o.nombre === 'Museo') { ESCENA_MUSEO5.volver = { lugar: B, desde: o.puerta.slice() }; irA(ESCENA_MUSEO5, { tipo: 'iris' }); return true; } return ant ? ant(o) : false; };
  N.alEntrarEdificio = o => { if (o.nombre === 'Kiosco') { abrirModo5('kiosco', o.puerta.slice()); return true; } if (o.entra === 'n-sala') { MENU5.abrir('concierto'); return true; } return false; };
  const LU = LUGARES5['n-luthier'], CA = LUGARES5['n-casa'];
  if (LU) npc(LU, { i: 4, j: 3, nombre: 'Luthier', sprite: () => adulto({ id: 'luthier', barba: true, ropa: '#fff6e6', saco: '#8a5a34', pantalon: '#4a3a2a' }), accion: () => MENU5.abrir('tienda') });
  if (CA) { npc(CA, { i: 6, j: 2, nombre: 'Vestidor', sprite: () => sprite(16, 30, g => { g.R(0, 0, 16, 30, '#8a5a34'); g.R(1, 1, 14, 28, '#a8703a'); g.R(7, 1, 2, 28, '#6a4020'); g.px(5, 15, '#ffd046'); g.px(10, 15, '#ffd046'); }, { ax: 8, ay: 30 }), accion: () => MENU5.abrir('vestidor') });
    // lo comprado decora la casa
    const vacio = canvas(1, 1); vacio.ax = 0; vacio.ay = 1;
    CA.def.pixeles = (CA.def.pixeles || []).concat([['cuadro', 2, 1, () => sprCuadro()], ['candelabro', 1.5, 4, () => sprCandelabro()], ['reloj', 7, 5, () => sprRelojPie()], ['estante', 1.5, 6.5, () => sprEstante()], ['trofeos', 4, 1, () => sprTrofeos()], ['marimbaCasa', 5, 6.5, () => sprMarimba()]]
      .map(([id, i, j, f]) => ({ i, j, k: 2, sombra: false, s: () => tiene5(id) ? f() : vacio })));
  }
  // secretos nuevos: notas doradas escondidas (cada una vale una corchea)
  [[3, 3, 'belen-nota-1', '¡Nota dorada!'], [31, 4, 'belen-nota-2', '¡Nota dorada!'], [6, 33, 'belen-nota-3', '¡Nota dorada!'], [26, 26, 'belen-nota-4', '¡Nota dorada!'], [12, 7, 'belen-nota-5', '¡Nota dorada detrás del pesebre!']].forEach(([i, j, id, texto]) => B.secretos.push({ i, j, id, texto }));
  [[20, 1, 'natal-nota-1', '¡Nota dorada!'], [1, 20, 'natal-nota-2', '¡Nota dorada!']].forEach(([i, j, id, texto]) => N.secretos.push({ i, j, id, texto }));
  [B0.arriba ? null : B, N].filter(Boolean).forEach(L => { L.alHallar = () => { const m = m2_(); if (m) { m.corcheas += 1; GUARDA.guardar(); } voz5('secreto-nota', { hito: true }); }; });
}
// =====================================================================
//  FPS automático: si no aguanta 60, aligera (menos partículas, resolución 1×) y, si hace falta, va a 30 cuadros
// =====================================================================
const FPSAUTO5 = { nivel: 0, acum: 0, n: 0, malos: 0,
  paso(dtReal) { this.acum += dtReal; this.n++; if (this.acum < 2) return; const fps = this.n / this.acum; this.acum = 0; this.n = 0;
    if (fps < (this.nivel === 0 ? 48 : 31)) this.malos++; else this.malos = 0;
    if (this.malos >= 2 && this.nivel < 2) { this.nivel++; this.malos = 0; if (this.nivel === 1) { window.LIGERO5 = true; MAXDPR5 = 1; ajustar5(); } marca5('fps automático: nivel ' + this.nivel + ' (' + Math.round(fps) + ' fps)'); } } };
