// =====================================================================
//  M2 · sonido y entrada: KitSonido + Salamander (piano-datos.js opcional) + MIDI con calibración
//  + teclado de pantalla espejo (con sonido) + el pulso de Tic (bloque de madera, campanita en el uno)
// =====================================================================
const ACORDES5 = { C: [48, 52, 55], F: [53, 57, 60], G: [55, 59, 62], G7: [55, 59, 65], D: [50, 54, 57], Am: [57, 60, 64], Dm: [50, 53, 57], Em: [52, 55, 59], E: [52, 56, 59] };
// muestras de la cuenta (voz de Bach) para programarlas con precisión de muestra: solo por http(s) (file:// no deja decodificarlas)
const CUENTA5 = { bufs: {}, cargar() { if (this.pedido || !SON5.listo || !/^https?:$/.test(location.protocol) || !window.VOCES) return; this.pedido = true; const c = KitSonido.contexto();
  [1, 2, 3, 4].forEach(k => { const id = window.VOCES['cuenta-' + k + 'b'] ? 'cuenta-' + k + 'b' : 'cuenta-' + k; if (!window.VOCES[id]) return; /* M5: «un… cuá» */ fetch('voces/' + id + '.ogg').then(r => r.arrayBuffer()).then(b => c.decodeAudioData(b)).then(buf => { this.bufs[k] = buf; }).catch(() => { }); }); } };
let ULTIMA_FUENTE5 = 'pantalla', ULTIMA_ENTRADA5 = 0;
const SON5 = {
  listo: false,
  iniciar() { if (this.listo) { try { KitSonido.reanudar(); } catch (e) { } return; } try { Snd.iniciar(); this.listo = Snd.ok; if (this.listo) { try { KitSonido.piano.recorte = .004; } catch (e) { } setTimeout(() => CUENTA5.cargar(), 500); } if (this.listo) KitSonido.mundos.belen = { estilo: 'nana', tono: ['DO', 'mayor'], tempo: 80, compas: 4, mel: 'celesta', semilla: 1225 }; } catch (e) { this.listo = false; } },
  K: () => window.KitSonido,
  ahora() { return this.listo ? KitSonido.ahora() : 0; },
  nota(n, v = 90) { if (this.listo) Snd.piano(n, v); },
  suave(n) { if (this.listo) Snd.piano(n, 34); },
  // acorde corto en tono que «encaja» (DO, FA o SOL según la nota)
  acorde(n) { if (!this.listo) return; const K = KitSonido, t = K.ahora() + .09, pc = ((n % 12) + 12) % 12; const ac = [0, 4, 7].includes(pc) ? [60, 64, 67] : [5, 9].includes(pc) ? [65, 69, 72] : [67, 71, 74]; ac.forEach(x => { K.instrumentos.ep(K.bus('efectos'), x + 12, t, .22, .32); K.instrumentos.marimba(K.bus('efectos'), x + 12, t + .01, .2, .22); }); },
  // clic en un instante exacto del reloj de audio (bloque de madera; campanita en el uno)
  ticEn(uno, at) { if (!this.listo) return; const K = KitSonido, t = Math.max(at || 0, K.ahora()); K.percusion.palitos(K.bus('efectos'), t, uno ? .7 : .45); if (uno) K.instrumentos.celesta(K.bus('efectos'), 91, t, .5, .32); },
  // «uno, dos, tres, cuatro»: muestras cortas de voz programadas en el pulso; sin muestras, un pitido de Tic que sube en el uno
  cuenta(num, at, de) { if (!this.listo) return; if (!CUENTA5.pedido) CUENTA5.cargar(); const K = KitSonido, t = Math.max(at || 0, K.ahora()), buf = CUENTA5.bufs[num];
    if (buf && GUARDA.d.voces !== false) { const s = K.contexto().createBufferSource(); s.buffer = buf; const g = K.contexto().createGain(); g.gain.value = .9; s.connect(g); g.connect(K.bus('efectos').entrada); s.start(t); return; }
    K.instrumentos.flauta(K.bus('efectos'), num === 1 ? 91 : 86, t, .09, .35); },
  tic(uno) { if (!this.listo) return; const K = KitSonido, t = K.ahora() + .005; K.percusion.palitos(K.bus('efectos'), t, uno ? .7 : .45); if (uno) K.instrumentos.celesta(K.bus('efectos'), 91, t, .5, .32); },
  ticCanta(n, dur = .4) { if (!this.listo) return; const K = KitSonido, t = K.ahora() + .01; K.instrumentos.flauta(K.bus('efectos'), n + 12, t, dur, .55); K.instrumentos.celesta(K.bus('efectos'), n + 12, t, dur, .25); },
  palma(v = .7) { if (!this.listo) return; const K = KitSonido, t = K.ahora() + .005; K.percusion.rim(K.bus('efectos'), t, v); K.percusion.shaker(K.bus('efectos'), t + .01, v * .6); },
  // colchón de la banda: un acorde por compás (pad + bajo en el uno y a mitad). i: nombre ('C','Am','G7',…) o índice (0 DO, 1 FA, 2 SOL, 3 DO, 4 LAm)
  base(i, compas = 4, bpm = 80) { if (!this.listo) return; const K = KitSonido, t = K.ahora() + .02, b = 60 / bpm / VEL5, ac = ACORDES5[typeof i === 'string' ? i : ['C', 'F', 'G', 'C', 'Am'][((i | 0) % 5 + 5) % 5]] || ACORDES5.C;
    K.instrumentos.pad(K.bus('musica'), ac.map(x => x + 12), t, b * compas, .3); if (GUARDA.d.dueto) return; K.instrumentos.bajo(K.bus('musica'), ac[0] - 12, t, b * (compas > 3 ? 1.8 : 1.4), .5); if (compas > 2) K.instrumentos.bajo(K.bus('musica'), ac[2] - 12, t + b * (compas > 3 ? 2 : 2), b * .9, .35); },
  flauta(n, dur = .5) { if (!this.listo) return; const K = KitSonido, t = K.ahora() + .01; K.instrumentos.flauta(K.bus('efectos'), n + 12, t, dur, .7); },
  organo() { if (!this.listo) return; const K = KitSonido, t = K.ahora() + .05; [48, 55, 60, 64, 67, 72].forEach((n, k) => K.instrumentos.pad(K.bus('musica'), [n], t + k * .12, 3.5, .5)); [84, 88, 91, 96].forEach((n, k) => K.instrumentos.celesta(K.bus('efectos'), n, t + .8 + k * .18, 1, .4)); },
  premio() { if (!this.listo) return; try { Snd.cofre(); } catch (e) { } },
  musica(nombre) { if (!this.listo) return; try { if (nombre) Snd.musica(nombre); else Snd.pararMusica(); } catch (e) { } },
};
// ---------- teclado de pantalla (DO4–SI5): dibujo, toque y espejo de lo que suena ----------
const TECLADO5 = { x: 56, y: 618, w: LW5 - 112, h: 166, desde: 60, abajo: {}, pistas: {}, luces: {} };
const BLANCAS5 = [0, 2, 4, 5, 7, 9, 11];
function teclaEn(x, y) {
  const T = TECLADO5, bw = T.w / 14, kw = bw * .6, kh = T.h * .62;
  if (x < T.x || x > T.x + T.w || y < T.y - 4 || y > T.y + T.h) return null;
  if (y < T.y + kh) for (let i = 0; i < 13; i++) { const letra = i % 7; if (![0, 1, 3, 4, 5].includes(letra)) continue; const cx = T.x + (i + 1) * bw + ({ 0: -.12, 1: .12, 3: -.14, 4: 0, 5: .14 }[letra]) * kw; if (Math.abs(x - cx) < kw / 2) return T.desde + Math.floor(i / 7) * 12 + BLANCAS5[letra] + 1; }
  const i = Math.floor((x - T.x) / bw); return T.desde + Math.floor(i / 7) * 12 + BLANCAS5[i % 7];
}
function teclaVisible5(n) { let s = Math.round(+n) - TECLADO5.desde; if (!isFinite(s)) return TECLADO5.desde; while (s < 0) s += 12; while (s > 23) s -= 12; return TECLADO5.desde + s; }   /* M7b: notas del MIDI fuera de DO4–SI5 → la misma nota en el teclado */
function xDeTecla(n) { n = teclaVisible5(n); const T = TECLADO5, bw = T.w / 14, s = n - T.desde, oct = Math.floor(s / 12), pc = s % 12, wi = BLANCAS5.indexOf(pc); if (wi >= 0) return T.x + (oct * 7 + wi + .5) * bw; const L = BLANCAS5.indexOf(pc - 1); return T.x + (oct * 7 + L + 1) * bw + ({ 0: -.12, 1: .12, 3: -.14, 4: 0, 5: .14 }[L]) * bw * .6; }
function dibujarTeclado5(ctx) {
  const T = TECLADO5, luces = {};
  Object.keys(T.pistas).forEach(n => { const p = T.pistas[n]; if (p.hasta > RELOJ) luces[n - T.desde] = p.c; else delete T.pistas[n]; });
  Object.keys(T.abajo).forEach(n => { luces[n - T.desde] = T.abajo[n]; });
  teclado(ctx, T.x, T.y, T.w, T.h, { blancas: 14, luces, colores: true });
  // los dedos (mano derecha en DO): un número en la tecla de cada nota que ya conoce
  if (T.dedos) Object.keys(T.dedos).forEach(n => { const x = xDeTecla(+n), y = T.y + T.h * .5; ctx.beginPath(); ctx.arc(x, y, 13, 0, 7); ctx.fillStyle = '#fbf1d8'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = COLOR_NOTA5(+n); ctx.stroke(); texto(ctx, String(T.dedos[n]), x, y + 1, { tam: 17, c: '#3a2414', peso: 700 }); });
  // las pistas (la tecla correcta que brilla) respiran
  Object.keys(T.pistas).forEach(n => { const x = xDeTecla(+n); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const a = .35 + .25 * Math.sin(RELOJ * 8); const g = ctx.createRadialGradient(x, T.y + T.h * .72, 0, x, T.y + T.h * .72, 70); g.addColorStop(0, 'rgba(255,224,130,' + a + ')'); g.addColorStop(1, 'rgba(255,224,130,0)'); ctx.fillStyle = g; ctx.fillRect(x - 70, T.y, 140, T.h); ctx.restore(); });
}
const NOMBRE_NOTA5 = n => ['DO', 'DO#', 'RE', 'RE#', 'MI', 'FA', 'FA#', 'SOL', 'SOL#', 'LA', 'LA#', 'SI'][((n % 12) + 12) % 12];
const COLOR_NOTA5 = n => NC[NOMBRE_NOTA5(n)] || mezcla(NC[NOMBRE_NOTA5(n - 1)] || '#b8aac8', '#2a1a3a', .35);
function pista5(n, seg = 1.6) { TECLADO5.pistas[n] = { c: COLOR_NOTA5(n), hasta: RELOJ + seg }; }
// ---------- entrada: MIDI, teclado del PC y pantalla terminan aquí ----------
// el tiempo de una nota es el reloj de la escena (se detiene en pausa); el niño simulado trae su tiempo exacto (T_SIM5)
let T_SIM5 = null;
function relojEscena5() { return ESC && ESC.reloj ? ESC.reloj() : RELOJ; }
function notaEntrante(n, fuerza, fuente) {
  ULTIMA_ENTRADA5 = performance.now(); if (typeof hayAtasco5 === 'function' && hayAtasco5()) rescatar5();
  SON5.iniciar(); try { window.Voz5 && Voz5.bajar(); } catch (e) { }   /* M7b: tocar ya NO corta la voz: la baja un poco mientras suena el piano */
  if (fuente === 'midi' && !Snd.corre()) avisoSonido5();   // Chrome no deja sonar hasta un toque en la pantalla (el MIDI no cuenta como gesto)
  const suenaAqui = fuente !== 'midi' || !GUARDA.d.midiPropio;   // M7b: el piano MIDI también suena aquí (salvo que papá diga que tiene parlante propio)
  if (typeof MEDIR5 !== 'undefined' && MEDIR5.activo && fuente !== 'pantalla') { tapMedir5(KitSonido.ahora(), fuente === 'midi' ? 'midi' : 'pantalla'); return; }
  ULTIMA_FUENTE5 = fuente === 'midi' ? 'midi' : 'pantalla';
  // lo que el niño oye llega tarde (salida de audio) y lo que toca llega tarde (pantalla/MIDI): se compensa (medido en el panel de papás)
  const t = T_SIM5 != null ? T_SIM5 : relojEscena5() - latencia5(fuente) * VEL5;
  // dueto: papá toca la mano izquierda (graves del piano MIDI): suena y no se juzga
  if (GUARDA.d.dueto && n < 60) { if (suenaAqui) SON5.nota(n, fuerza || 90); return; }
  let veredicto = null; if (ESC && ESC.nota) { try { veredicto = ESC.nota(n, t, fuente); } catch (e) { console.error(e); } }
  // todo suena aquí: pantalla, teclado del PC y piano MIDI (salvo «el piano tiene parlante propio» en el panel de papá); el error, suave
  const inst = typeof instrumentoLibre5 === 'function' && !(ESC && ESC.dia && !(ESC.cfg && ESC.cfg.libre)) ? instrumentoLibre5() : null;   // fuera de las clases suena el instrumento comprado
  if (suenaAqui && veredicto !== 'pad') { if (inst && SON5.listo) { const K = KitSonido; K.instrumentos[inst](K.bus('piano'), n, K.ahora(), .9, (fuerza || 90) / 127); } else SON5.nota(n, veredicto === 'error' ? 34 : (fuerza || 90)); }
  const nv = teclaVisible5(n); TECLADO5.abajo[nv] = veredicto === 'error' ? '#b8aac8' : COLOR_NOTA5(n); setTimeout(() => { delete TECLADO5.abajo[nv]; }, 260 / VEL5);
}
Entrada.on(ev => { if (ev.on) notaEntrante(ev.nota, ev.fuerza, ev.fuente); else if (ev.fuente === 'midi' && !GUARDA.d.midiPropio && !Entrada.pedal) { try { Snd.soltar(ev.nota); } catch (e) { } } });
// M7b: el primer toque o tecla, en cualquier pantalla, enciende el audio (dentro del gesto, como exige Chrome) y busca el piano MIDI
function desbloquear5() { ULTIMA_ENTRADA5 = performance.now(); try { SON5.iniciar(); } catch (e) { } try { if (Entrada.estado === 'sin-midi') Entrada.iniciarMidi(); } catch (e) { } const a = document.getElementById('aviso-sonido5'); if (a && Snd.corre()) a.remove(); }
['pointerdown', 'keydown', 'touchend'].forEach(t => addEventListener(t, desbloquear5, { capture: true }));
// si llega una nota MIDI con el audio todavía en pausa: un aviso claro arriba (se quita solo al tocar la pantalla)
function avisoSonido5() {
  if (document.getElementById('aviso-sonido5')) return; const d = document.createElement('div'); d.id = 'aviso-sonido5'; d.textContent = '🔈 Toca la pantalla una vez para que suene el piano';
  d.style.cssText = 'position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:50;background:#fffaf4;color:#2a1a3a;border:4px solid #2a1a3a;box-shadow:5px 6px 0 #2a1a3a;border-radius:18px;padding:12px 22px;font:700 24px Outfit,sans-serif;cursor:pointer';
  d.onclick = () => { desbloquear5(); d.remove(); }; document.body.appendChild(d); setTimeout(() => { if (Snd.corre()) d.remove(); }, 4000);
}
// estado para el panel de papá y la prueba de sonido
function estadoSonido5() {
  const pi = Snd.estadoPiano ? Snd.estadoPiano() : {}, corre = Snd.corre && Snd.corre();
  const piano = !SON5.listo ? 'se enciende con el primer toque' : !pi.listo || (window.PIANO_SALAMANDER && window.PIANO_SALAMANDER.datos && !pi.salamander) || window.PIANO_SALAMANDER === undefined && pi.fuente !== 'salamander' ? 'cargando…' : pi.fuente === 'salamander' ? 'listo (Salamander)' : 'de respaldo (sin piano-datos.js)';
  const midi = Entrada.dispositivos && Entrada.dispositivos.length ? 'conectado: ' + Entrada.dispositivos.join(', ') : ({ 'sin-soporte': 'este navegador no tiene MIDI', 'sin-permiso': 'sin permiso (revisa el candado de la barra de direcciones)', 'sin-midi': 'se busca con el primer toque' }[Entrada.estado] || 'no hay piano conectado');
  return { piano, midi, audio: !SON5.listo ? 'apagado' : corre ? 'sonando' : 'en pausa: toca la pantalla' };
}
function probarSonido5() { desbloquear5(); if (!SON5.listo) return; const t = KitSonido.ahora() + .08; [60, 64, 67, 72].forEach((n, i) => Snd.piano(n, 92, t + i * .22)); }
try { Entrada.calib = Object.assign({}, GUARDA.d.calib || {}); } catch (e) { }
function calibrar5(alListo) { Entrada.calibrando = (n, disp) => { const aj = Math.round((60 - n) / 12) * 12; Entrada.calib[disp] = aj; GUARDA.d.calib = Object.assign({}, Entrada.calib); GUARDA.guardar(); alListo && alListo(disp, aj); }; }
// el piano Salamander (piano-datos.js, opcional, ≈ 9 MB) llega después de la pantalla de carga, sin frenarla
function cargarPiano5() {
  if (window.PIANO_SALAMANDER !== undefined) return;
  const s = document.createElement('script'); s.src = 'piano-datos.js'; s.async = true;
  s.onload = () => {
    if (SON5.listo && window.PIANO_SALAMANDER) Snd.cargarSalamander(window.PIANO_SALAMANDER);
    // que el service worker lo guarde para jugar sin red (en la primera visita, apenas tome el control)
    try { const sw = navigator.serviceWorker; if (sw && /^https?:$/.test(location.protocol)) { if (sw.controller) sw.controller.postMessage('opcionales'); else sw.addEventListener('controllerchange', () => sw.controller && sw.controller.postMessage('opcionales'), { once: true }); } } catch (e) { }
  };
  s.onerror = () => { window.PIANO_SALAMANDER = null; };
  document.head.appendChild(s);
}
function latencia5(fuente) { const f = fuente === 'midi' ? 'midi' : 'pantalla', c = (GUARDA.d.latencia || {})[f]; if (c != null) return c; return (SON5.listo ? Math.min(.15, KitSonido.latenciaSalida()) : .03) + (f === 'midi' ? .005 : .035); }
