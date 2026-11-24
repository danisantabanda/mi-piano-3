/* ============================================================
   MI PIANO 2 · kit-sonido.js  (prototipo del diseñador de sonido)
   Librería WebAudio SIN dependencias y SIN archivos: todo se sintetiza o se hornea en el momento.

   QUÉ TRAE
     Mezcla     buses piano / banda / efectos / musica / voz, reverb de sala generada, limitador suave
                sin retardo (no el DynamicsCompressor: bombea y añade 6 ms), perfil "tablet" o "audífonos",
                ducking cuando habla un maestro, micro-ducking de la banda en cada nota del niño y
                "hueco dinámico": la banda se aparta en la frecuencia de la nota que el niño toca.
     Piano      motor de muestras con capas de velocidad, apagadores, pedal y robo de voces
                (listo para el subconjunto de Salamander), y un piano horneado aquí mismo como respaldo
                (sostenido de hasta 9 s, no 3 s como el de MI PIANO 1.9).
     Voces      juno (sine lead tipo Juno), pad cálido, ep (piano eléctrico FM), marimba, celesta,
                arpa y pizzicato (Karplus-Strong horneado), cuerdas, acordeón, flauta, bajo,
                chip (pulso y triángulo de 4 bits), batería ligera, percusión de cumbia, clic de madera.
     Efectos    acierto (arpegio en la tonalidad y el acorde que suenan), racha, perfecto, error suave,
                desbloqueo, cofre, transición, botón, estrella, pista.
     Director   acompaña una melodía SIGUIENDO al niño: espera la nota, estima su tempo, cae con él en
                los cambios de acorde y sube de energía con las rachas. Cinco estilos.
     Música     de menú / mapa por mundo, compuesta por reglas (motivo + variaciones), sin cansar.

   USO RÁPIDO
     KitSonido.iniciar();                       // tras un toque (o con {contexto: offlineCtx} para hornear WAV)
     KitSonido.tonalidad('SOL', 'mayor');
     KitSonido.efectos.acierto();
     var d = KitSonido.director({ melodia:[{nota:60,dur:1},…], compas:4, tempo:76, estilo:'worship' });
     d.iniciar();  …  d.nota(60, 90);           // cada nota del niño (MIDI o pantalla)
     KitSonido.musica.tocar('bosque');
   ============================================================ */
(function (global) {
  'use strict';

  var K = { version: '0.2' };
  var ctx = null;
  var B = {};                  // buses
  var cache = {};              // buffers horneados
  var ondas = {};              // PeriodicWave
  var perfil = 'tablet';
  var directores = [];         // directores vivos (para cuantizar efectos)

  /* =========================================================
     1. TEORÍA
     ========================================================= */
  var NOMBRES = ['DO', 'DO#', 'RE', 'MIb', 'MI', 'FA', 'FA#', 'SOL', 'LAb', 'LA', 'SIb', 'SI'];
  var RAIZ = { DO: 0, 'DO#': 1, REB: 1, RE: 2, 'RE#': 3, MIB: 3, MI: 4, FA: 5, 'FA#': 6, SOLB: 6, SOL: 7, 'SOL#': 8, LAB: 8, LA: 9, 'LA#': 10, SIB: 10, SI: 11 };
  var ESCALAS = { mayor: [0, 2, 4, 5, 7, 9, 11], menor: [0, 2, 3, 5, 7, 8, 10], penta: [0, 2, 4, 7, 9] };
  function mtof(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function pc(n) { return ((n % 12) + 12) % 12; }
  function dB(x) { return Math.pow(10, x / 20); }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function rng(seed) { var s = seed >>> 0; return function () { s += 0x6D2B79F5; var t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  K.tono = { raiz: 0, modo: 'mayor' };
  K.tonalidad = function (raiz, modo) {
    var r = typeof raiz === 'string' ? RAIZ[raiz.toUpperCase()] : raiz;
    K.tono = { raiz: r == null ? 0 : r, modo: modo || 'mayor' };
    return K.tono;
  };
  K.nombre = function (n) { return NOMBRES[pc(n)] + (Math.floor(n / 12) - 1); };
  function escalaPcs(t) { t = t || K.tono; return ESCALAS[t.modo].map(function (x) { return (x + t.raiz) % 12; }); }
  // grado de la escala (0 = tónica; puede pasar de 7) → MIDI, con la tónica de la octava `oct` (4 → DO4 = 60)
  function grado(g, oct, t) {
    t = t || K.tono; var e = ESCALAS[t.modo], L = e.length;
    var o = Math.floor(g / L), i = ((g % L) + L) % L;
    return 12 * (oct + 1) + t.raiz + e[i] + 12 * o;
  }
  // tríada diatónica del grado gr (0..6) → pcs [fundamental, tercera, quinta]
  function triada(gr, t) {
    t = t || K.tono; var e = ESCALAS[t.modo].length === 7 ? ESCALAS[t.modo] : ESCALAS.mayor;
    return [0, 2, 4].map(function (k) { return (t.raiz + e[(gr + k) % 7]) % 12; });
  }
  var ROMANOS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'];
  // 'FA', 'LAm', 'SOL7' → {raiz, pcs}
  function acordeDeNombre(s) {
    var m = /^(DO#?|REb?|RE#?|MIb?|MI|FA#?|SOLb?|SOL#?|LAb?|LA#?|SIb?|SI)(m?)(7?)$/i.exec(String(s).trim());
    if (!m) return null;
    var r = RAIZ[m[1].toUpperCase()], menor = !!m[2], sep = !!m[3];
    var pcs = [r, (r + (menor ? 3 : 4)) % 12, (r + 7) % 12]; if (sep) pcs.push((r + 10) % 12);
    return { raiz: r, pcs: pcs, nombre: s };
  }
  // ubica las clases de nota pcs dentro de [lo, hi], de abajo arriba, cerca de la voz anterior (conducción de voces)
  function voicing(pcs, lo, hi, previo) {
    var cands = [];
    for (var inv = 0; inv < pcs.length; inv++) {
      var notas = [], base = lo - 1;
      for (var k = 0; k < pcs.length; k++) {
        var p = pcs[(inv + k) % pcs.length], n = base + 1; while (pc(n) !== p) n++;
        notas.push(n); base = n;
      }
      if (notas[notas.length - 1] <= hi + 2) cands.push(notas);
      var arriba = notas.map(function (n) { return n + 12; }); if (arriba[arriba.length - 1] <= hi) cands.push(arriba);
    }
    if (!cands.length) return pcs.map(function (p) { var n = lo; while (pc(n) !== p) n++; return n; });
    if (!previo || !previo.length) return cands[0];
    var mejor = cands[0], dm = 1e9;
    cands.forEach(function (c) { var d = 0; c.forEach(function (n, i) { d += Math.abs(n - (previo[i] != null ? previo[i] : previo[previo.length - 1])); }); if (d < dm) { dm = d; mejor = c; } });
    return mejor;
  }

  /* Armonizar una melodía: escoge I, ii, IV, V, vi por trozo (dos pulsos en 4/4, un compás en 3/4 y 2/4).
     Más rica que la banda de MI PIANO 1.9 (solo DO/FA/SOL): sirve en cualquier tonalidad, pone V antes
     del final de frase y prefiere quedarse en el acorde si la melodía lo permite.
     mel: [{nota, t, dur}] en pulsos.  op: {compas, tono, total, acordes:['DO','FA',…]} */
  function armonizar(mel, op) {
    var compas = op.compas || 4, t = op.tono || K.tono, total = op.total;
    var largo = compas >= 4 ? 2 : compas, segs = [];
    var cand = [{ g: 0, w: 1.0 }, { g: 4, w: 0.85 }, { g: 3, w: 0.8 }, { g: 5, w: 0.4 }, { g: 1, w: 0.3 }];
    var nSeg = Math.ceil(total / largo), prev = 0;
    for (var s = 0; s < nSeg; s++) {
      var a = s * largo, b = a + largo, peso = {};
      cand.forEach(function (c) { peso[c.g] = c.w * 0.3; });
      mel.forEach(function (e) {
        var ini = Math.max(a, e.t), fin = Math.min(b, e.t + e.dur); if (fin <= ini) return;
        var d = fin - ini, fuerte = Math.abs(e.t - a) < 1e-6 || (compas >= 4 && Math.abs(e.t % compas) < 1e-6) ? 1.8 : 1;
        cand.forEach(function (c) {
          var tr = triada(c.g, t), p = pc(e.nota);
          if (tr.indexOf(p) >= 0) peso[c.g] += d * fuerte;
          else if (fuerte > 1 && tr.some(function (q) { var x = Math.abs(q - p); return x === 1 || x === 11; })) peso[c.g] -= 0.6 * d;
        });
      });
      peso[prev] += 0.3;                                        // quedarse si se puede
      if (s === 0 || s === nSeg - 1) peso[0] += 1.2;            // empezar y terminar en casa
      if (s === nSeg - 2) peso[4] += 0.7;                       // dominante antes del final
      if ((s + 1) % (8 / largo) === 0 && s < nSeg - 1) peso[4] += 0.25;   // semicadencia al final de cada frase de 4 compases… o casi
      var mejor = 0, pm = -1e9;
      cand.forEach(function (c) { if (peso[c.g] > pm) { pm = peso[c.g]; mejor = c.g; } });
      var trM = triada(mejor, t), menorM = pc(trM[1] - trM[0]) === 3;
      var seg = { i: s, t: a, dur: largo, grado: mejor, pcs: trM, romano: ROMANOS[mejor], nombre: NOMBRES[trM[0]] + (menorM ? 'm' : '') };
      if (op.acordes && op.acordes.length) {
        var esc = acordeDeNombre(op.acordes[s % op.acordes.length]);
        if (esc) { seg.pcs = esc.pcs; seg.nombre = esc.nombre; seg.grado = null; }
      }
      seg.raiz = seg.pcs[0];
      segs.push(seg); prev = mejor;
    }
    return segs;
  }
  K.armonizar = armonizar;

  /* =========================================================
     2. MOTOR Y MEZCLA
     ========================================================= */
  var vNow = null;           // tiempo virtual al hornear sin tiempo real
  function ahora() { return vNow != null ? vNow : (ctx ? ctx.currentTime : 0); }
  K.contexto = function () { return ctx; };
  K.ahora = ahora;
  K.latenciaSalida = function () { if (!ctx) return 0.03; return (ctx.outputLatency || 0) || (ctx.baseLatency || 0) || 0.03; };
  K.offline = function () { return !!(ctx && global.OfflineAudioContext && ctx instanceof global.OfflineAudioContext); };

  var NIVELES = { piano: -3, banda: -14, efectos: -10, musica: -17, voz: 0 };
  var ENVIOS = { piano: 0.10, banda: 0.32, efectos: 0.22, musica: 0.30, voz: 0.0 };

  K.iniciar = function (op) {
    op = op || {};
    if (ctx && !op.contexto) { K.reanudar(); return K; }
    var AC = global.AudioContext || global.webkitAudioContext;
    ctx = op.contexto || new AC({ latencyHint: 'interactive' });
    cache = {}; ondas = {}; directores = [];
    construir();
    if (op.perfil) K.perfil(op.perfil);
    if (!K.offline() && global.document) {
      document.addEventListener('pointerdown', K.reanudar, true);
      document.addEventListener('keydown', K.reanudar, true);
    }
    return K;
  };
  K.reanudar = function () { if (ctx && ctx.state !== 'running' && ctx.resume) { try { ctx.resume(); } catch (e) {} } };

  // limitador suave sin retardo: lineal hasta 0,7 y curva tanh encima (nada de bombeo)
  function curvaSuave() {
    var n = 4096, c = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      var u = (i / (n - 1) * 2 - 1) * 2, a = Math.abs(u);
      var y = a < 0.7 ? a : 0.7 + 0.3 * Math.tanh((a - 0.7) / 0.3);
      c[i] = (u < 0 ? -y : y);
    }
    return c;
  }
  // respuesta de impulso de sala cálida: ruido estéreo con dos colas (brillante corta, oscura larga)
  function irSala(seg, pre) {
    var sr = ctx.sampleRate, n = Math.floor(sr * seg), buf = ctx.createBuffer(2, n, sr), r = rng(11);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch), lp = 0, p0 = Math.floor(sr * (pre || 0.018));
      for (var i = 0; i < n; i++) {
        if (i < p0) { d[i] = 0; continue; }
        var t = (i - p0) / sr, w = r() * 2 - 1;
        lp += 0.12 * (w - lp);                                  // ruido oscuro
        var cola = w * 0.55 * Math.exp(-t / 0.20) + lp * 2.4 * Math.exp(-t / (seg * 0.30));
        var ent = t < 0.012 ? t / 0.012 : 1;                    // entrada suave
        d[i] = cola * ent;
      }
      // primeras reflexiones
      [0.011, 0.019, 0.027, 0.041].forEach(function (x, k) { var j = p0 + Math.floor(sr * (x + ch * 0.003)); if (j < n) d[j] += (0.5 - k * 0.09) * (k % 2 ? -1 : 1); });
      var fin = Math.floor(sr * 0.25); for (var q = 0; q < fin; q++) d[n - 1 - q] *= q / fin;
    }
    // normalizar energía
    var e = 0; for (var c2 = 0; c2 < 2; c2++) { var dd = buf.getChannelData(c2); for (var k2 = 0; k2 < n; k2++) e += dd[k2] * dd[k2]; }
    var g = 1 / Math.sqrt(e / 2 + 1e-9) * 0.9;
    for (var c3 = 0; c3 < 2; c3++) { var d3 = buf.getChannelData(c3); for (var k3 = 0; k3 < n; k3++) d3[k3] *= g; }
    return buf;
  }
  function crearChorus(destino, prof, vel) {
    // chorus tipo Juno: dos retardos modulados en contrafase, mezclado con la señal seca
    var ent = ctx.createGain(), seco = ctx.createGain(); seco.gain.value = 0.75;
    var mL = ctx.createGain(), mR = ctx.createGain(); mL.gain.value = mR.gain.value = 0.55;
    var dL = ctx.createDelay(0.05), dR = ctx.createDelay(0.05); dL.delayTime.value = 0.0105; dR.delayTime.value = 0.0125;
    var lfo = ctx.createOscillator(); lfo.frequency.value = vel || 0.52;
    var pL = ctx.createGain(), pR = ctx.createGain(); pL.gain.value = prof || 0.0022; pR.gain.value = -(prof || 0.0022);
    lfo.connect(pL); lfo.connect(pR); pL.connect(dL.delayTime); pR.connect(dR.delayTime); lfo.start();
    var mez = ctx.createChannelMerger(2);
    ent.connect(seco); seco.connect(destino);
    ent.connect(dL); ent.connect(dR); dL.connect(mL); dR.connect(mR); mL.connect(mez, 0, 0); mR.connect(mez, 0, 1); mez.connect(destino);
    return ent;
  }
  function crearTremolo(destino, frec, prof) {
    // trémolo estéreo (autopan) del Rhodes
    var ent = ctx.createGain(), pan = ctx.createStereoPanner(), lfo = ctx.createOscillator(), g = ctx.createGain();
    lfo.frequency.value = frec || 4.2; g.gain.value = prof || 0.35; lfo.connect(g); g.connect(pan.pan); lfo.start();
    ent.connect(pan); pan.connect(destino); return ent;
  }
  function construir() {
    var suma = ctx.createGain();
    var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 110; hp.Q.value = 0.6;
    var presencia = ctx.createBiquadFilter(); presencia.type = 'peaking'; presencia.frequency.value = 2800; presencia.Q.value = 0.8; presencia.gain.value = 1.5;
    var master = ctx.createGain(); master.gain.value = 0.5;   // el limitador ve -6 dB: hay margen
    var lim = ctx.createWaveShaper(); lim.curve = curvaSuave(); lim.oversample = 'none';
    var medidor = ctx.createAnalyser(); medidor.fftSize = 2048;
    suma.connect(hp); hp.connect(presencia); presencia.connect(master); master.connect(lim); lim.connect(ctx.destination); lim.connect(medidor);
    var conv = ctx.createConvolver(); conv.buffer = irSala(1.9);
    var rev = ctx.createGain(); rev.gain.value = dB(-4); conv.connect(rev); rev.connect(suma);
    K._master = { suma: suma, hp: hp, presencia: presencia, master: master, lim: lim, medidor: medidor, reverb: conv };
    Object.keys(NIVELES).forEach(function (nombre) {
      var entrada = ctx.createGain(), duck = ctx.createGain(), nivel = ctx.createGain(), envio = ctx.createGain();
      nivel.gain.value = dB(NIVELES[nombre]); envio.gain.value = ENVIOS[nombre];
      var ultimo = entrada, bus = { nombre: nombre, entrada: entrada, duck: duck, nivel: nivel, envio: envio };
      if (nombre === 'banda' || nombre === 'musica') {
        // hueco dinámico: un valle de -6 dB que sigue a la nota del niño (el director lo mueve)
        var hueco = ctx.createBiquadFilter(); hueco.type = 'peaking'; hueco.frequency.value = 330; hueco.Q.value = 1.4; hueco.gain.value = nombre === 'banda' ? -6 : -3;
        var tilt = ctx.createBiquadFilter(); tilt.type = 'highshelf'; tilt.frequency.value = 5000; tilt.gain.value = -3;
        entrada.connect(hueco); hueco.connect(tilt); ultimo = tilt; bus.hueco = hueco;
      }
      var micro = ctx.createGain(); bus.micro = micro;
      ultimo.connect(micro); micro.connect(duck); duck.connect(nivel); nivel.connect(suma); nivel.connect(envio); envio.connect(conv);
      bus.chorus = crearChorus(entrada);
      bus.trem = crearTremolo(entrada);
      B[nombre] = bus;
    });
  }
  K.bus = function (n) { return B[n]; };
  K.medidor = function () { return K._master && K._master.medidor; };
  K.nivel = function (bus, db) { if (B[bus]) B[bus].nivel.gain.setTargetAtTime(dB(db), ahora(), 0.05); NIVELES[bus] = db; };
  K.envio = function (bus, x) { if (B[bus]) B[bus].envio.gain.setTargetAtTime(x, ahora(), 0.05); };
  // 'tablet': parlantes pequeños (corta subgraves que no suenan y solo gastan margen; el bajo lleva armónicos)
  // 'audifonos': rango completo
  K.perfil = function (p) {
    if (p) {
      perfil = p;
      if (ctx) {
        K._master.hp.frequency.setTargetAtTime(p === 'tablet' ? 110 : 28, ahora(), 0.05);
        K._master.presencia.gain.setTargetAtTime(p === 'tablet' ? 1.5 : 0, ahora(), 0.05);
      }
    }
    return perfil;
  };
  // ducking: el bus baja `db` mientras dure (ataque 80 ms, salida 400 ms)
  function duck(nombre, db, t, ataque) {
    var g = B[nombre].duck.gain; t = t == null ? ahora() : t;
    cancelar(g, t); g.setTargetAtTime(dB(db), t, ataque || 0.03);
  }
  K.hablaMaestro = function (si) {
    var t = ahora();
    if (si) { duck('banda', -9, t); duck('musica', -15, t); duck('efectos', -5, t); }
    else { ['banda', 'musica', 'efectos'].forEach(function (n) { var g = B[n].duck.gain; cancelar(g, t); g.setTargetAtTime(1, t + 0.25, 0.14); }); }
  };
  // engancha un <audio> o HTMLMediaElement de voz para que la música se aparte sola
  K.conectarVoz = function (el) {
    el.addEventListener('play', function () { K.hablaMaestro(true); });
    ['pause', 'ended'].forEach(function (ev) { el.addEventListener(ev, function () { K.hablaMaestro(false); }); });
  };
  // micro-ducking: cada nota del niño aparta la banda 2,5 dB un instante (se oye su ataque)
  K.alTocarNino = function (t, nota) {
    if (!ctx) return; t = t == null ? ahora() : t;
    var g = B.banda.micro.gain; cancelar(g, t);
    g.setTargetAtTime(dB(-2.5), t, 0.012); g.setTargetAtTime(1, t + 0.09, 0.12);
    if (nota != null && B.banda.hueco) B.banda.hueco.frequency.setTargetAtTime(clamp(mtof(nota), 180, 1400), t, 0.02);
  };

  /* ---------- utilidades de nodos y envolventes (todo sin clics) ---------- */
  function cancelar(param, t) {
    if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(t);
    else { var v = param.value; param.cancelScheduledValues(t); param.setValueAtTime(v, t); }
  }
  function osc(tipo, f, t) {
    var o = ctx.createOscillator();
    if (typeof tipo === 'string' && ['sine', 'square', 'sawtooth', 'triangle'].indexOf(tipo) >= 0) o.type = tipo; else o.setPeriodicWave(tipo);
    o.frequency.value = f; o.start(t); return o;
  }
  function gan(v) { var g = ctx.createGain(); g.gain.value = v == null ? 1 : v; return g; }
  function filtro(tipo, f, q) { var b = ctx.createBiquadFilter(); b.type = tipo; b.frequency.value = f; if (q != null) b.Q.value = q; return b; }
  function salida(dest, via) { if (!dest) return B.banda.entrada; if (dest.entrada) return (via && dest[via]) || dest.entrada; return dest; }
  /* ADSR: ataque lineal desde 0 (≥2 ms), caída exponencial a sustain, liberación exponencial.
     Si se da dur, la liberación queda programada; si no, la voz devuelve soltar(t). */
  function envolvente(param, t, o) {
    var a = Math.max(0.002, o.a || 0.005), pico = o.pico == null ? 1 : o.pico, s = o.s == null ? 1 : o.s;
    param.setValueAtTime(0, t); param.linearRampToValueAtTime(pico, t + a);
    if (s < 1) param.setTargetAtTime(pico * s, t + a, (o.d || 0.3) / 3);
  }
  function liberar(param, t, r) { cancelar(param, t); param.setTargetAtTime(0, t, Math.max(0.004, r / 4.5)); return t + r * 2; }
  function voz(nodos, vca, r, t0) {
    var v = {
      nodos: nodos, fin: Infinity, inicio: t0,
      soltar: function (t, rr) {
        if (v.fin !== Infinity) return v.fin;
        t = Math.max(t == null ? ahora() : t, t0 + 0.003);
        v.fin = liberar(vca.gain, t, rr == null ? r : rr);
        nodos.forEach(function (n) { if (n.stop) { try { n.stop(v.fin + 0.02); } catch (e) {} } });
        return v.fin;
      }
    };
    var ultimo = nodos.filter(function (n) { return n.stop; })[0];
    if (ultimo) ultimo.onended = function () { try { vca.disconnect(); } catch (e) {} };
    return v;
  }
  function ruido() {
    if (cache.ruido) return cache.ruido;
    var n = ctx.sampleRate * 2, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0), r = rng(3);
    for (var i = 0; i < n; i++) d[i] = r() * 2 - 1;
    return (cache.ruido = b);
  }
  function ruidoChip() {
    // ruido de registro LFSR de 15 bits a ~16 kHz, como el canal de ruido de una consola de 8 bits
    if (cache.ruidoChip) return cache.ruidoChip;
    var n = ctx.sampleRate, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0), reg = 1, paso = ctx.sampleRate / 16000, acc = 0, v = 1;
    for (var i = 0; i < n; i++) { acc += 1; if (acc >= paso) { acc -= paso; var bit = (reg ^ (reg >> 1)) & 1; reg = (reg >> 1) | (bit << 14); v = reg & 1 ? 1 : -1; } d[i] = v * 0.6; }
    return (cache.ruidoChip = b);
  }
  function fuenteRuido(t, dur, buf) {
    var s = ctx.createBufferSource(); s.buffer = buf || ruido(); s.loop = true;
    s.start(t, (t * 7.31) % 1.5); s.stop(t + dur + 0.05); return s;
  }
  function onda(nombre) {
    if (ondas[nombre]) return ondas[nombre];
    var N = 64, re = new Float32Array(N), im = new Float32Array(N), k;
    if (nombre === 'calido') for (k = 1; k < N; k++) im[k] = (1 / k) * Math.exp(-k / 11);                 // sierra cálida
    else if (nombre.indexOf('pulso') === 0) {                                                                // pulso de ancho d
      var d = +nombre.slice(5) / 100; for (k = 1; k < N; k++) { im[k] = (2 / (k * Math.PI)) * Math.sin(Math.PI * k * d) * Math.cos(Math.PI * k * d); re[k] = (2 / (k * Math.PI)) * Math.sin(Math.PI * k * d) * Math.sin(Math.PI * k * d); }
    } else if (nombre === 'tri4bit') {                                                                       // triángulo de 16 escalones
      var M = 32, x = new Float32Array(M); for (var i = 0; i < M; i++) { var p = i < 16 ? i : 31 - i; x[i] = p / 7.5 - 1; }
      for (k = 1; k < N; k++) { var a = 0, b2 = 0; for (var j = 0; j < M; j++) { a += x[j] * Math.cos(2 * Math.PI * k * j / M); b2 += x[j] * Math.sin(2 * Math.PI * k * j / M); } re[k] = a * 2 / M * (k < 24 ? 1 : 0.3); im[k] = b2 * 2 / M * (k < 24 ? 1 : 0.3); }
    } else if (nombre === 'lengueta') for (k = 1; k < N; k++) im[k] = (k % 2 ? 1 : 0.55) / Math.pow(k, 1.05) * Math.exp(-k / 18);   // acordeón
    ondas[nombre] = ctx.createPeriodicWave(re, im);
    return ondas[nombre];
  }

  /* =========================================================
     3. INSTRUMENTOS
     Todos: (dest, nota | [notas], t, dur, v 0..1, op) → voz {soltar(t)}. dest = bus u otro nodo.
     ========================================================= */
  var I = K.instrumentos = {};

  // Lead tipo "Juno Stage sine lead": seno + triángulo suave + sub, vibrato que entra tarde, chorus.
  I.juno = function (dest, nota, t, dur, v, op) {
    op = op || {}; v = v == null ? 0.7 : v;
    var f = mtof(nota), o1 = osc('sine', f, t), o2 = osc('triangle', f, t), sub = osc('sine', f / 2, t);
    var g2 = gan(0.10), gs = gan(0.16), lp = filtro('lowpass', 3200, 0.5), vca = gan(0);
    var lfo = osc('sine', 5.2, t), vib = gan(0); lfo.connect(vib); vib.connect(o1.frequency); vib.connect(o2.frequency);
    vib.gain.setValueAtTime(0, t); vib.gain.linearRampToValueAtTime(0, t + 0.3); vib.gain.linearRampToValueAtTime(f * 0.0045, t + 0.9);
    if (op.desde != null) { [o1, o2].forEach(function (o) { o.frequency.setValueAtTime(mtof(op.desde), t); o.frequency.exponentialRampToValueAtTime(f, t + 0.07); }); }
    o1.connect(lp); o2.connect(g2); g2.connect(lp); sub.connect(gs); gs.connect(lp); lp.connect(vca);
    vca.connect(salida(dest, 'chorus'));
    envolvente(vca.gain, t, { a: 0.012, d: 0.5, s: 0.78, pico: 0.42 * v });
    var vz = voz([o1, o2, sub, lfo], vca, op.r || 0.45, t);
    if (dur != null) vz.soltar(t + dur);
    return vz;
  };

  // Pad cálido: dos sierras cálidas desafinadas por nota, filtro que se abre despacio, chorus.
  I.pad = function (dest, notas, t, dur, v, op) {
    op = op || {}; v = v == null ? 0.5 : v; notas = [].concat(notas);
    var lp = filtro('lowpass', 300, 0.5), vca = gan(0), nodos = [], amp = 1 / Math.sqrt(notas.length + 1);
    notas.forEach(function (n, i) {
      var f = mtof(n);
      [-7, 6].forEach(function (c, j) { var o = osc(onda('calido'), f * Math.pow(2, (c + (i % 2 ? 2 : -2)) / 1200), t); var g = gan(amp * 0.5); o.connect(g); g.connect(lp); nodos.push(o); });
    });
    var a = op.a || 0.7, brillo = op.brillo == null ? 1 : op.brillo;
    lp.frequency.setValueAtTime(300, t); lp.frequency.linearRampToValueAtTime((500 + 1300 * v) * brillo, t + a * 1.3);
    lp.connect(vca); vca.connect(salida(dest, 'chorus'));
    envolvente(vca.gain, t, { a: a, pico: 0.30 * v });
    var vz = voz(nodos, vca, op.r || 1.3, t);
    if (dur != null) vz.soltar(t + dur);
    return vz;
  };

  // Cuerdas: tres sierras por nota, ataque de arco, vibrato leve.
  I.cuerdas = function (dest, notas, t, dur, v, op) {
    op = op || {}; v = v == null ? 0.5 : v; notas = [].concat(notas);
    var lp = filtro('lowpass', 1500 + 900 * v, 0.6), vca = gan(0), nodos = [], amp = 0.34 / Math.sqrt(notas.length);
    var lfo = osc('sine', 4.8, t), vib = gan(0); lfo.connect(vib); vib.gain.setValueAtTime(0, t); vib.gain.linearRampToValueAtTime(2.2, t + 0.8); nodos.push(lfo);
    notas.forEach(function (n) {
      var f = mtof(n);
      [-9, 0, 8].forEach(function (c) { var o = osc('sawtooth', f * Math.pow(2, c / 1200), t); vib.connect(o.detune); var g = gan(amp); o.connect(g); g.connect(lp); nodos.push(o); });
    });
    var cuerpo = filtro('peaking', 900, 1); cuerpo.gain.value = 3;
    lp.connect(cuerpo); cuerpo.connect(vca); vca.connect(salida(dest, 'chorus'));
    envolvente(vca.gain, t, { a: op.a || 0.35, pico: 0.30 * v });
    var vz = voz(nodos, vca, op.r || 0.7, t);
    if (dur != null) vz.soltar(t + dur);
    return vz;
  };

  // Acordeón (colchón de la cumbia): dos lengüetas desafinadas tipo musette.
  I.acordeon = function (dest, notas, t, dur, v, op) {
    op = op || {}; v = v == null ? 0.4 : v; notas = [].concat(notas);
    var lp = filtro('lowpass', 2400, 0.4), vca = gan(0), nodos = [], amp = 0.22 / Math.sqrt(notas.length);
    notas.forEach(function (n) { [-11, 11].forEach(function (c) { var o = osc(onda('lengueta'), mtof(n) * Math.pow(2, c / 1200), t); var g = gan(amp); o.connect(g); g.connect(lp); nodos.push(o); }); });
    lp.connect(vca); vca.connect(salida(dest));
    envolvente(vca.gain, t, { a: op.a || 0.06, pico: 0.5 * v });
    var vz = voz(nodos, vca, op.r || 0.25, t);
    if (dur != null) vz.soltar(t + dur);
    return vz;
  };

  // Piano eléctrico (FM 1:1 tipo Rhodes): índice que cae, "tine" agudo breve, trémolo estéreo.
  I.ep = function (dest, nota, t, dur, v, op) {
    op = op || {}; v = v == null ? 0.6 : v;
    var f = mtof(nota), car = osc('sine', f, t), mod = osc('sine', f, t), mg = gan(0);
    var ind = (0.8 + 2.6 * v) * f;
    mg.gain.setValueAtTime(ind, t); mg.gain.setTargetAtTime(ind * 0.18, t + 0.002, 0.22);
    mod.connect(mg); mg.connect(car.frequency);
    var tine = osc('sine', f * 7.02, t), tg = gan(0); tine.connect(tg);
    tg.gain.setValueAtTime(0, t); tg.gain.linearRampToValueAtTime(0.10 * v * v, t + 0.001); tg.gain.setTargetAtTime(0, t + 0.001, 0.035);
    var vca = gan(0); car.connect(vca); tg.connect(vca);
    vca.connect(salida(dest, 'trem'));
    var caida = 2.6 * Math.pow(261 / f, 0.45);
    envolvente(vca.gain, t, { a: 0.002, d: caida * 3, s: 0.0, pico: 0.36 * Math.pow(v, 0.8) });
    var vz = voz([car, mod, tine], vca, op.r || 0.22, t);
    if (dur != null) vz.soltar(t + dur);
    return vz;
  };

  // Marimba: fundamental + parcial 3,92 + 9,2 (barra de madera), golpe de baqueta.
  I.marimba = function (dest, nota, t, dur, v, op) {
    op = op || {}; v = v == null ? 0.6 : v;
    var f = mtof(nota), vca = gan(1), nodos = [], tau = clamp(0.5 * Math.pow(261 / f, 0.55), 0.12, 1.2);
    [[1, 1, tau], [3.92, 0.22, tau * 0.18], [9.2, 0.05, tau * 0.06]].forEach(function (p) {
      if (f * p[0] > ctx.sampleRate * 0.45) return;
      var o = osc('sine', f * p[0], t), g = gan(0); o.connect(g); g.connect(vca);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(p[1] * 0.5 * v, t + 0.002); g.gain.setTargetAtTime(0, t + 0.002, p[2]);
      o.stop(t + p[2] * 9 + 0.05); nodos.push(o);
    });
    var r = fuenteRuido(t, 0.02), bp = filtro('bandpass', 2600, 1.2), rg = gan(0); r.connect(bp); bp.connect(rg); rg.connect(vca);
    rg.gain.setValueAtTime(0, t); rg.gain.linearRampToValueAtTime(0.10 * v, t + 0.001); rg.gain.setTargetAtTime(0, t + 0.001, 0.004);
    vca.connect(salida(dest));
    var vz = { soltar: function () {}, fin: t + tau * 9, inicio: t }; return vz;
  };

  // Celesta / cajita de música: placas de acero, fundamental fuerte y parciales casi armónicos.
  I.celesta = function (dest, nota, t, dur, v, op) {
    op = op || {}; v = v == null ? 0.5 : v;
    var f = mtof(nota), vca = gan(1), tau = clamp(1.1 * Math.pow(523 / f, 0.35), 0.25, 1.6);
    [[1, 1, tau], [2.0, 0.12, tau * 0.5], [3.0, 0.07, tau * 0.3], [op.campana ? 2.76 : 4.1, op.campana ? 0.25 : 0.04, tau * 0.25]].forEach(function (p) {
      if (f * p[0] > ctx.sampleRate * 0.45) return;
      var o = osc('sine', f * p[0], t), g = gan(0); o.connect(g); g.connect(vca);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(p[1] * 0.32 * v, t + 0.0015); g.gain.setTargetAtTime(0, t + 0.0015, p[2]);
      o.stop(t + p[2] * 9 + 0.05);
    });
    vca.connect(salida(dest));
    return { soltar: function () {}, fin: t + tau * 9, inicio: t };
  };

  /* Cuerda pulsada horneada (Karplus-Strong) → AudioBuffer en caché. Arpa y pizzicato. */
  function cuerdaPulsada(nota, tipo) {
    var clave = tipo + ':' + nota; if (cache[clave]) return cache[clave];
    var sr = ctx.sampleRate, f = mtof(nota), r = rng(nota * 7 + tipo.length);
    var t60 = tipo === 'pizz' ? clamp(0.9 * Math.pow(110 / f, 0.4), 0.25, 1.0) : clamp(5.0 * Math.pow(110 / f, 0.4), 1.2, 6);
    var seg = Math.min(t60 * 1.1, 6), n = Math.floor(sr * seg), y = new Float32Array(n);
    var T = sr / f, Ki = Math.floor(T - 0.5), w = 1 - (T - 0.5 - Ki);
    // el promedio del lazo también apaga (cos(ω/2) por vuelta): se compensa para que t60 sea el pedido
    var perdida = Math.cos(Math.PI * f / sr);
    var g = Math.min(0.99995, Math.pow(0.001, 1 / (f * t60)) / perdida), P = Math.ceil(T), lp = 0, brillo = tipo === 'pizz' ? 0.25 : 0.5;
    for (var i = 0; i < n; i++) {
      var x = 0;
      if (i < P) { lp += brillo * ((r() * 2 - 1) - lp); x = lp; }
      var a = i - Ki >= 0 ? y[i - Ki] : 0, b = i - Ki - 1 >= 0 ? y[i - Ki - 1] : 0, c = i - Ki - 2 >= 0 ? y[i - Ki - 2] : 0;
      // filtro de lazo: promedio ponderado (afinación fina con w) y pérdida g
      y[i] = x + g * (w * 0.5 * (a + b) + (1 - w) * 0.5 * (b + c));
    }
    // posición de pulsado (peine) y quitar DC
    var out = new Float32Array(n), q = Math.floor(T / (tipo === 'pizz' ? 3 : 6)), m = 0, pico = 0;
    for (var j = 0; j < n; j++) { var s2 = y[j] - (j - q >= 0 ? y[j - q] : 0) * 0.6; m += 0.002 * (s2 - m); out[j] = s2 - m; if (Math.abs(out[j]) > pico) pico = Math.abs(out[j]); }
    var fade = Math.floor(sr * 0.05);
    for (var k = 0; k < n; k++) { out[k] /= (pico + 1e-9); if (k > n - fade) out[k] *= (n - k) / fade; }
    var buf = ctx.createBuffer(1, n, sr); buf.getChannelData(0).set(out);
    return (cache[clave] = buf);
  }
  function tocarBuffer(dest, buf, t, v, op) {
    op = op || {};
    var s = ctx.createBufferSource(); s.buffer = buf; if (op.tasa) s.playbackRate.value = op.tasa;
    var vca = gan(0); s.connect(vca);
    vca.gain.setValueAtTime(0, t); vca.gain.linearRampToValueAtTime(v, t + 0.002);
    var ultimo = vca;
    if (op.filtro) { var lp = filtro('lowpass', op.filtro, 0.5); vca.connect(lp); ultimo = lp; }
    ultimo.connect(salida(dest)); s.start(t);
    s.onended = function () { try { ultimo.disconnect(); } catch (e) {} };
    return voz([s], vca, op.r || 0.12, t);
  }
  I.arpa = function (dest, nota, t, dur, v) { return tocarBuffer(dest, cuerdaPulsada(nota, 'arpa'), t, 0.34 * (v == null ? 0.6 : v), { filtro: 6000 }); };
  I.pizz = function (dest, nota, t, dur, v) { var vz = tocarBuffer(dest, cuerdaPulsada(nota, 'pizz'), t, 0.5 * (v == null ? 0.6 : v), { filtro: 2400 }); if (dur != null) vz.soltar(t + Math.max(dur, 0.25), 0.15); return vz; };

  // Flauta: seno con soplo filtrado y vibrato natural.
  I.flauta = function (dest, nota, t, dur, v, op) {
    v = v == null ? 0.5 : v; var f = mtof(nota);
    var o = osc('sine', f, t), o2 = osc('sine', f * 2, t), g2 = gan(0.08), vca = gan(0);
    var lfo = osc('sine', 5.0, t), vib = gan(0); lfo.connect(vib); vib.connect(o.frequency); vib.gain.setValueAtTime(0, t); vib.gain.linearRampToValueAtTime(f * 0.005, t + 0.5);
    var r = fuenteRuido(t, (dur || 2) + 0.6), bp = filtro('bandpass', f * 1.5, 6), rg = gan(0.05); r.connect(bp); bp.connect(rg); rg.connect(vca);
    o.connect(vca); o2.connect(g2); g2.connect(vca); vca.connect(salida(dest));
    envolvente(vca.gain, t, { a: 0.06, d: 0.3, s: 0.85, pico: 0.38 * v });
    var vz = voz([o, o2, lfo, r], vca, 0.18, t); if (dur != null) vz.soltar(t + dur); return vz;
  };

  // Bajo. 'redondo' (worship), 'pizz', 'chip' (triángulo de 4 bits), 'cumbia' (redondo más corto).
  // En perfil tablet suma armónicos (saturación) y la octava, para que se oiga en un parlante pequeño.
  I.bajo = function (dest, nota, t, dur, v, op) {
    op = op || {}; v = v == null ? 0.6 : v; var tipo = op.tipo || 'redondo';
    if (tipo === 'pizz') return I.pizz(dest, nota, t, dur, v);
    var f = mtof(nota), nodos = [], mez = gan(1), vca = gan(0);
    if (tipo === 'chip') { var o = osc(onda('tri4bit'), f, t); o.connect(mez); nodos.push(o); if (perfil === 'tablet') { var o8 = osc(onda('tri4bit'), f * 2, t), g8 = gan(0.35); o8.connect(g8); g8.connect(mez); nodos.push(o8); } }
    else {
      var s1 = osc('sine', f, t), s2 = osc('triangle', f, t), g2 = gan(0.35); s1.connect(mez); s2.connect(g2); g2.connect(mez); nodos.push(s1, s2);
      if (perfil === 'tablet') { var s3 = osc('sine', f * 2, t), g3 = gan(0.32); s3.connect(g3); g3.connect(mez); nodos.push(s3); }
    }
    var sat = ctx.createWaveShaper(), c = new Float32Array(1024); for (var i = 0; i < 1024; i++) { var x = i / 511.5 - 1; c[i] = Math.tanh(x * (perfil === 'tablet' ? 2.4 : 1.4)) / Math.tanh(perfil === 'tablet' ? 2.4 : 1.4); }
    sat.curve = c;
    var lp = filtro('lowpass', tipo === 'chip' ? 3000 : 950, 0.6);
    mez.connect(sat); sat.connect(lp); lp.connect(vca); vca.connect(salida(dest));
    var corto = tipo === 'cumbia';
    envolvente(vca.gain, t, { a: tipo === 'chip' ? 0.003 : 0.008, d: corto ? 0.25 : 0.6, s: corto ? 0.35 : 0.65, pico: 0.55 * v });
    var vz = voz(nodos, vca, tipo === 'chip' ? 0.04 : 0.12, t); if (dur != null) vz.soltar(t + dur); return vz;
  };

  // Chip: pulso de ancho 12,5 / 25 / 50 % con vibrato tardío.
  I.chip = function (dest, nota, t, dur, v, op) {
    op = op || {}; v = v == null ? 0.5 : v; var f = mtof(nota);
    var o = osc(onda('pulso' + (op.ancho || 25)), f, t), vca = gan(0);
    if (op.vibrato !== false) { var lfo = osc('sine', 6, t), vib = gan(0); lfo.connect(vib); vib.connect(o.frequency); vib.gain.setValueAtTime(0, t); vib.gain.linearRampToValueAtTime(0, t + 0.25); vib.gain.linearRampToValueAtTime(f * 0.006, t + 0.5); }
    o.connect(vca); vca.connect(salida(dest));
    envolvente(vca.gain, t, { a: 0.003, d: 0.15, s: op.s == null ? 0.7 : op.s, pico: 0.20 * v });
    var vz = voz([o, lfo].filter(Boolean), vca, 0.03, t); if (dur != null) vz.soltar(t + dur); return vz;
  };

  /* ---------- percusión ligera (todo síntesis) ---------- */
  var P = K.percusion = {};
  function golpeRuido(dest, t, v, tipoF, f, q, tau, a, buf) {
    var s = fuenteRuido(t, tau * 9 + 0.02, buf), fl = filtro(tipoF, f, q), g = gan(0);
    s.connect(fl); fl.connect(g); g.connect(salida(dest));
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + (a || 0.001)); g.gain.setTargetAtTime(0, t + (a || 0.001), tau);
    return g;
  }
  function golpeTono(dest, t, v, f0, f1, tauF, tau, tipo) {
    var o = osc(tipo || 'sine', f0, t), g = gan(0); o.connect(g); g.connect(salida(dest));
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + tauF);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.0015); g.gain.setTargetAtTime(0, t + 0.0015, tau);
    o.stop(t + tau * 9 + 0.02);
  }
  P.bombo = function (dest, t, v) { v = v == null ? 0.7 : v; golpeTono(dest, t, 0.8 * v, 150, 46, 0.09, 0.11); golpeRuido(dest, t, 0.06 * v, 'lowpass', 2500, 0.7, 0.004); if (perfil === 'tablet') golpeTono(dest, t, 0.18 * v, 300, 120, 0.05, 0.04, 'triangle'); };
  P.escobilla = function (dest, t, v, largo) { v = v == null ? 0.5 : v; golpeRuido(dest, t, 0.22 * v, 'bandpass', 2600, 0.7, largo ? 0.16 : 0.05, largo ? 0.03 : 0.003); golpeTono(dest, t, 0.08 * v, 210, 170, 0.05, 0.05); };
  P.shaker = function (dest, t, v) { v = v == null ? 0.5 : v; golpeRuido(dest, t, 0.16 * v, 'highpass', 5800, 0.7, 0.028, 0.012); };
  P.hat = function (dest, t, v, abierto) { v = v == null ? 0.5 : v; golpeRuido(dest, t, 0.13 * v, 'highpass', 7800, 0.8, abierto ? 0.14 : 0.022); };
  P.rim = function (dest, t, v) { v = v == null ? 0.5 : v; golpeTono(dest, t, 0.22 * v, 1700, 1600, 0.01, 0.011); golpeTono(dest, t, 0.12 * v, 560, 540, 0.01, 0.018); };
  P.platillo = function (dest, t, v, crece) {          // platillo de seda: crece hacia el tiempo t (swell) o golpe suave
    v = v == null ? 0.4 : v; var s = fuenteRuido(Math.max(0, t - (crece || 0)), (crece || 0) + 2.2), hp = filtro('highpass', 5000, 0.5), g = gan(0);
    s.connect(hp); hp.connect(g); g.connect(salida(dest));
    var t0 = Math.max(ahora(), t - (crece || 0));
    if (crece) { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.12 * v, t); g.gain.setTargetAtTime(0, t, 0.06); }
    else { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12 * v, t + 0.004); g.gain.setTargetAtTime(0, t + 0.004, 0.5); }
  };
  P.timbal = function (dest, t, v, nota) { v = v == null ? 0.6 : v; var f = mtof(nota || 43); golpeTono(dest, t, 0.55 * v, f * 1.03, f, 0.08, 0.45); golpeRuido(dest, t, 0.10 * v, 'lowpass', 400, 0.7, 0.05); };
  // cumbia colombiana
  P.guacharaca = function (dest, t, v, dur) {
    v = v == null ? 0.5 : v; dur = dur || 0.1;
    var s = fuenteRuido(t, dur + 0.05), bp = filtro('bandpass', 3600, 2.2), g = gan(0), dientes = gan(0.5), lfo = osc('sawtooth', 92, t), lg = gan(0.5);
    lfo.connect(lg); lg.connect(dientes.gain); lfo.stop(t + dur + 0.06);
    s.connect(bp); bp.connect(dientes); dientes.connect(g); g.connect(salida(dest));
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.30 * v, t + Math.min(0.02, dur * 0.3)); g.gain.setValueAtTime(0.30 * v, t + dur * 0.7); g.gain.linearRampToValueAtTime(0, t + dur);
  };
  P.tambora = function (dest, t, v, aro) {
    v = v == null ? 0.6 : v;
    if (aro) { golpeTono(dest, t, 0.25 * v, 950, 880, 0.01, 0.014); golpeRuido(dest, t, 0.08 * v, 'bandpass', 3000, 1, 0.006); }
    else { golpeTono(dest, t, 0.6 * v, 120, 78, 0.06, 0.12); golpeRuido(dest, t, 0.10 * v, 'lowpass', 500, 0.7, 0.03); if (perfil === 'tablet') golpeTono(dest, t, 0.14 * v, 240, 160, 0.04, 0.05, 'triangle'); }
  };
  P.llamador = function (dest, t, v) { v = v == null ? 0.5 : v; golpeTono(dest, t, 0.30 * v, 260, 205, 0.03, 0.06); golpeRuido(dest, t, 0.07 * v, 'bandpass', 1400, 1.2, 0.015); };
  // chip
  P.chipBombo = function (dest, t, v) { v = v == null ? 0.6 : v; golpeTono(dest, t, 0.35 * v, 220, 45, 0.06, 0.07, 'square'); };
  P.chipRuido = function (dest, t, v, largo) { v = v == null ? 0.5 : v; golpeRuido(dest, t, 0.22 * v, 'highpass', largo ? 1800 : 6000, 0.5, largo ? 0.07 : 0.018, 0.001, ruidoChip()); };
  // palitos de la cuenta y clic de madera del metrónomo (afinado, corto, no tapa)
  P.palitos = function (dest, t, v) { v = v == null ? 0.6 : v; golpeTono(dest, t, 0.30 * v, 2900, 2700, 0.01, 0.008); golpeRuido(dest, t, 0.10 * v, 'bandpass', 4200, 2, 0.006); };
  K.clic = function (t, acento, v) {
    t = t == null ? ahora() : t; v = v == null ? 1 : v;
    var dest = B.efectos, f = acento ? 1568 : 1175;           // SOL6 / RE6: madera afinada
    golpeTono(dest, t, (acento ? 0.36 : 0.26) * v, f * 1.02, f, 0.008, 0.016);
    golpeRuido(dest, t, (acento ? 0.10 : 0.07) * v, 'bandpass', 2600, 1.5, 0.005);
  };

  /* =========================================================
     4. PIANO: motor de muestras (Salamander) + piano horneado de respaldo
     ========================================================= */
  var PIANO = K.piano = {
    listo: false, zonas: {}, notasZona: [], voces: {}, pedalAbajo: false, sostenidas: {}, fuente: null,
    max: 32, ultimaCarga: null
  };
  /* zonas[nota] = [{hasta: velMax 1..127, buffer, ganancia}] (capas ordenadas). Para Salamander:
     PIANO.cargarManifiesto('piano/', manifiesto)  (ver preparar-salamander.py) */
  PIANO.cargarManifiesto = function (base, man) {
    var tareas = [];
    PIANO.zonas = {}; PIANO.fuente = man.nombre || 'muestras';
    man.notas.forEach(function (n) {
      PIANO.zonas[n] = [];
      man.capas.forEach(function (capa, ci) {
        var url = base + man.archivo.replace('{nota}', n).replace('{capa}', capa.id);
        tareas.push(fetch(url).then(function (r) { return r.arrayBuffer(); }).then(function (ab) { return ctx.decodeAudioData(ab); }).then(function (buf) {
          PIANO.zonas[n][ci] = { hasta: capa.hasta, buffer: buf, ganancia: capa.ganancia || 1 };
        }).catch(function () {}));
      });
    });
    return (PIANO.ultimaCarga = Promise.all(tareas).then(function () { PIANO.notasZona = Object.keys(PIANO.zonas).map(Number).sort(function (a, b) { return a - b; }); PIANO.listo = true; PIANO.filtroVel = false; }));
  };
  /* Piano horneado aquí mismo (sin archivos): síntesis aditiva con inarmonicidad, dos etapas de caída
     (sonido inmediato + resonancia larga), batidos de las tres cuerdas, golpe de martillo.
     Una capa brillante; la velocidad abre un filtro por voz (hace de capas). 21 notas cada 3 semitonos. */
  PIANO.hornear = function (op) {
    op = op || {};
    var notas = []; for (var n = op.desde || 36; n <= (op.hasta || 96); n += 3) notas.push(n);
    var sr = op.sr || 32000, i = 0;
    PIANO.zonas = {}; PIANO.fuente = 'horneado'; PIANO.filtroVel = true;
    return (PIANO.ultimaCarga = new Promise(function (res) {
      function una() {
        if (i >= notas.length) { PIANO.notasZona = notas; PIANO.listo = true; res(); return; }
        var nota = notas[i++];
        PIANO.zonas[nota] = [{ hasta: 127, buffer: hornearNota(nota, sr), ganancia: 1 }];
        if (K.offline() || op.deUna) una(); else setTimeout(una, 0);
      }
      una();
    }));
  };
  function hornearNota(nota, sr) {
    var f0 = mtof(nota), dur = clamp(9 - (nota - 36) * 0.11, 2.6, 9), n = Math.floor(sr * dur), y = new Float32Array(n);
    var B2 = clamp(0.00038 * Math.pow(f0 / 261.6, 1.35), 0.00005, 0.01), r = rng(nota * 13 + 1);
    var tau1 = 0.42 * Math.pow(261.6 / f0, 0.35), tau2 = 3.4 * Math.pow(261.6 / f0, 0.5);
    var maxK = nota < 48 ? 44 : nota < 72 ? 30 : 18;
    for (var k = 1; k <= maxK; k++) {
      var fk = k * f0 * Math.sqrt(1 + B2 * k * k); if (fk > Math.min(11000, sr * 0.45)) break;
      var a = Math.pow(k, -1.05) * Math.pow(Math.abs(Math.sin(Math.PI * k / 7.3)), 0.7) / Math.sqrt(1 + Math.pow(fk / 3200, 2));
      if (a < 1e-4) continue;
      var t1 = tau1 / (1 + 0.012 * k * k), t2 = tau2 / (1 + 0.0035 * k * k) * (fk > 1500 ? Math.pow(1500 / fk, 0.4) : 1);
      var w = 2 * Math.PI * fk / sr, c = Math.cos(w), s = Math.sin(w), x = Math.cos(r() * 6.28), z = Math.sin(r() * 6.28);
      var e1 = 0.55 * a, e2 = 0.45 * a, r1 = Math.exp(-1 / (t1 * sr)), r2 = Math.exp(-1 / (t2 * sr));
      var wb = 2 * Math.PI * (0.25 + 0.11 * k * (r() * 0.5 + 0.75)) / sr, cb = Math.cos(wb), sb = Math.sin(wb), bx = 1, bz = 0, prof = nota < 44 ? 0.12 : 0.28;
      for (var j = 0; j < n; j++) {
        var nx = x * c - z * s; z = x * s + z * c; x = nx;
        var nb = bx * cb - bz * sb; bz = bx * sb + bz * cb; bx = nb;
        y[j] += z * (e1 + e2 * (1 - prof + prof * bx));
        e1 *= r1; e2 *= r2;
      }
    }
    // ataque del martillo (1-3 ms) y golpe de fieltro
    var at = Math.max(8, Math.floor(sr * (0.0032 - 0.00002 * (nota - 36)))); for (var q = 0; q < at; q++) y[q] *= Math.pow(q / at, 0.7);
    var nr = Math.floor(sr * 0.02), lp = 0, pk = 0; for (var u = 0; u < n; u++) if (Math.abs(y[u]) > pk) pk = Math.abs(y[u]);
    for (var h = 0; h < nr; h++) { lp += 0.35 * ((r() * 2 - 1) - lp); y[h] += lp * pk * 0.10 * Math.exp(-h / (sr * 0.004)); }
    // caja: realce cálido suave (un pasa-banda de un polo mezclado)
    var b1 = 0, b2 = 0, cw = 2 * Math.PI * 220 / sr;
    for (var m = 0; m < n; m++) { b1 += cw * (y[m] - b1 - b2 * 0.6); b2 += cw * b1; y[m] += b2 * 0.18; }
    // normalizar por sonoridad (graves un poco más) y cola
    var e = 0, L = Math.min(n, Math.floor(sr * 0.3)); for (var v2 = 0; v2 < L; v2++) e += y[v2] * y[v2];
    var g = 0.16 / Math.sqrt(e / L + 1e-12) * (1 + 0.3 * Math.max(0, (60 - nota) / 24));
    var fade = Math.floor(sr * 0.3);
    for (var o2 = 0; o2 < n; o2++) { y[o2] *= g; if (o2 > n - fade) y[o2] *= (n - o2) / fade; }
    var buf = ctx.createBuffer(1, n, sr); buf.getChannelData(0).set(y); return buf;
  }
  function zonaCercana(nota) {
    var L = PIANO.notasZona, mejor = L[0], d = 1e9;
    for (var i = 0; i < L.length; i++) { var dd = Math.abs(L[i] - nota) + (L[i] > nota ? 0.1 : 0); if (dd < d) { d = dd; mejor = L[i]; } }
    return mejor;
  }
  function apagarVozPiano(v, t, tau) {
    if (v.apagada) return; v.apagada = true;
    cancelar(v.vca.gain, t); v.vca.gain.setTargetAtTime(0, t, tau);
    v.fuentes.forEach(function (s) { try { s.stop(t + tau * 9 + 0.02); } catch (e) {} });
  }
  /* tocar(nota, fuerza 1..127, cuando) → voz. dest opcional (por defecto bus piano). */
  PIANO.tocar = function (nota, fuerza, cuando, dest) {
    if (!ctx || !PIANO.notasZona.length) return null;
    var t = Math.max(cuando == null ? ahora() : cuando, ahora());
    var v = clamp((fuerza == null ? 90 : fuerza) / 127, 0.01, 1);
    // misma tecla otra vez: el apagador corta la anterior en 25 ms
    (PIANO.voces[nota] || []).forEach(function (x) { apagarVozPiano(x, t, 0.008); });
    PIANO.voces[nota] = [];
    // robo de voces: primero las ya soltadas, luego las más viejas
    var vivas = []; for (var k in PIANO.voces) PIANO.voces[k].forEach(function (x) { if (!x.apagada) vivas.push(x); });
    if (vivas.length >= PIANO.max) { vivas.sort(function (a, b) { return (a.suelta === b.suelta ? 0 : a.suelta ? -1 : 1) || a.t - b.t; }); apagarVozPiano(vivas[0], t, 0.01); }
    var z = zonaCercana(nota), capas = PIANO.zonas[z].filter(Boolean), tasa = Math.pow(2, (nota - z) / 12);
    var vca = gan(1), fuentes = [], vel = fuerza || 90;
    // dos capas vecinas con fundido de igual potencia entre sus umbrales
    var ci = 0; while (ci < capas.length - 1 && vel > capas[ci].hasta) ci++;
    var mezcla = [[capas[ci], 1]];
    if (ci > 0) { var lo = capas[ci - 1].hasta, hi = capas[ci].hasta, x = clamp((vel - lo) / Math.max(1, hi - lo), 0, 1); mezcla = [[capas[ci], Math.sin(x * Math.PI / 2)], [capas[ci - 1], Math.cos(x * Math.PI / 2)]]; }
    var ultimo = vca;
    if (PIANO.filtroVel) { var lp = filtro('lowpass', 700 + 11000 * v * v, 0.4); vca.connect(lp); ultimo = lp; }
    ultimo.connect(salida(dest || B.piano));
    var nivel = PIANO.filtroVel ? (0.16 + 0.84 * Math.pow(v, 1.5)) : (0.35 + 0.65 * Math.pow(v, 1.2));
    vca.gain.setValueAtTime(nivel, t);
    mezcla.forEach(function (par) {
      var s = ctx.createBufferSource(); s.buffer = par[0].buffer; s.playbackRate.value = tasa;
      var g = gan(par[1] * par[0].ganancia); s.connect(g); g.connect(vca); s.start(t, PIANO.recorte || 0); fuentes.push(s);
    });
    fuentes[0].onended = function () { try { ultimo.disconnect(); } catch (e) {} };
    var vz = { nota: nota, t: t, vca: vca, fuentes: fuentes, apagada: false, suelta: false };
    PIANO.voces[nota].push(vz);
    delete PIANO.sostenidas[nota];
    return vz;
  };
  // apagadores: graves sueltan más despacio; de FA6 hacia arriba no hay apagador (suena hasta morir)
  PIANO.soltar = function (nota, cuando) {
    var l = PIANO.voces[nota]; if (!l || !l.length) return;
    var t = Math.max(cuando == null ? ahora() : cuando, ahora());
    if (PIANO.pedalAbajo) { PIANO.sostenidas[nota] = true; l.forEach(function (v) { v.suelta = true; }); return; }
    if (nota >= 89) { l.forEach(function (v) { v.suelta = true; }); return; }
    var tau = nota < 48 ? 0.11 : nota < 72 ? 0.07 : 0.05;
    l.forEach(function (v) { v.suelta = true; apagarVozPiano(v, t, tau); });
    PIANO.voces[nota] = [];
  };
  PIANO.pedal = function (abajo) {
    PIANO.pedalAbajo = !!abajo;
    if (B.piano) B.piano.envio.gain.setTargetAtTime(abajo ? 0.19 : ENVIOS.piano, ahora(), 0.1);   // resonancia simpática aproximada
    if (!abajo) Object.keys(PIANO.sostenidas).forEach(function (n) { delete PIANO.sostenidas[n]; PIANO.soltar(+n); });
  };
  PIANO.silencio = function () { PIANO.pedalAbajo = false; for (var n in PIANO.voces) PIANO.voces[n].forEach(function (v) { apagarVozPiano(v, ahora(), 0.02); }); PIANO.voces = {}; };
  I.piano = function (dest, nota, t, dur, v) { var vz = PIANO.tocar(nota, Math.round((v == null ? 0.6 : v) * 127), t, dest); if (vz && dur != null) PIANO.soltar(nota, t + dur); return vz; };

  /* =========================================================
     5. EFECTOS CON IDENTIDAD: todo en la tonalidad y en el acorde que suena
     ========================================================= */
  var E = K.efectos = { racha: 0 };
  function acordeActual() {
    for (var i = directores.length - 1; i >= 0; i--) { var a = directores[i].acordeActual(); if (a) return a.pcs; }
    return triada(0);
  }
  // si hay banda sonando, el efecto cae en la próxima corchea (si está a menos de 90 ms)
  function cuantizar(t) {
    t = t == null ? ahora() + 0.005 : t;
    for (var i = directores.length - 1; i >= 0; i--) { var q = directores[i].proximaCorchea(t); if (q != null && q - t < 0.09) return q; }
    return t;
  }
  function tonosDeAcorde(pcs, desde, cuantos) {
    var out = [], n = desde; while (out.length < cuantos) { if (pcs.indexOf(pc(n)) >= 0) out.push(n); n++; }
    return out;
  }
  // acierto: cada acierto es la nota siguiente de un arpegio que sube por el acorde del momento.
  // Seis aciertos seguidos ya son una frase; al llegar arriba vuelve a empezar un tono más arriba.
  E.acierto = function (op) {
    op = op || {}; var t = cuantizar(op.t), k = E.racha++;
    var esc = tonosDeAcorde(acordeActual(), 72 + (K.tono.raiz > 6 ? K.tono.raiz - 12 : K.tono.raiz), 8);
    var nota = esc[k % 6] + (Math.floor(k / 6) % 2 ? 12 : 0);
    I.celesta(B.efectos, nota, t, null, 0.32);
    I.marimba(B.efectos, nota, t, null, 0.2);
    return nota;
  };
  E.fallo = function () { E.racha = 0; };
  // racha (3, 5, 10…): un remate de cuatro notas por la escala que termina en tónica, con brillo
  E.racha3 = function (t) {
    t = cuantizar(t); var n = [4, 5, 6, 7];
    n.forEach(function (g, i) { var nota = grado(g, 5); I.celesta(B.efectos, nota, t + i * 0.075, null, 0.55); I.juno(B.efectos, nota, t + i * 0.075, 0.07, 0.35); });
    P.platillo(B.efectos, t + 0.3, 0.25, 0.25);
  };
  // perfecto: arpa que sube dos octavas por el acorde de tónica, colchón y campanita final
  E.perfecto = function (t) {
    t = t == null ? ahora() + 0.01 : t; var ac = triada(0), notas = tonosDeAcorde(ac, 55 + K.tono.raiz, 7);
    notas.forEach(function (n, i) { I.arpa(B.efectos, n, t + i * 0.06, null, 0.7); });
    I.pad(B.efectos, voicing(ac, 60, 76), t, 1.6, 0.6, { a: 0.25, r: 1.2 });
    var tonica = grado(7, 5);
    I.celesta(B.efectos, tonica, t + 0.45, null, 0.8, { campana: true }); I.juno(B.efectos, tonica, t + 0.45, 0.9, 0.45, { desde: tonica - 5 });
    P.platillo(B.efectos, t + 0.45, 0.3, 0.35);
  };
  // error suave: madera apagada en la fundamental del acorde, grave y corto. No suena a "castigo".
  E.error = function (t) {
    t = t == null ? ahora() + 0.005 : t; E.racha = 0;
    var raiz = acordeActual()[0], n = 48 + raiz; if (n > 54) n -= 12;
    var o = osc('triangle', mtof(n), t), g = gan(0), lp = filtro('lowpass', 520, 0.7); o.connect(lp); lp.connect(g); g.connect(B.efectos.entrada);
    o.frequency.setValueAtTime(mtof(n) * 1.04, t); o.frequency.exponentialRampToValueAtTime(mtof(n) * 0.97, t + 0.18);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.42, t + 0.006); g.gain.setTargetAtTime(0, t + 0.006, 0.06); o.stop(t + 0.6);
    I.marimba(B.efectos, n + 12, t + 0.09, null, 0.18);
  };
  // pista: la tablet sopla la nota que esperaba (celesta muy suave, con la nota de verdad)
  E.pista = function (nota, t) { I.celesta(B.efectos, nota + 12, t == null ? ahora() + 0.01 : t, null, 0.35); };
  // desbloqueo: subida de aire y acorde I–IV–I de campanas
  E.desbloqueo = function (t) {
    t = t == null ? ahora() + 0.01 : t;
    var s = fuenteRuido(t, 0.9), bp = filtro('bandpass', 400, 2.5), g = gan(0); s.connect(bp); bp.connect(g); g.connect(B.efectos.entrada);
    bp.frequency.setValueAtTime(400, t); bp.frequency.exponentialRampToValueAtTime(6500, t + 0.65);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.25, t + 0.55); g.gain.setTargetAtTime(0, t + 0.62, 0.05);
    var t2 = t + 0.65;
    [[0, 0], [3, 0.12], [0, 0.32]].forEach(function (par) { voicing(triada(par[0]), 67 + K.tono.raiz % 5, 84).forEach(function (n, i) { I.celesta(B.efectos, n, t2 + par[1] + i * 0.015, null, 0.6, { campana: true }); }); });
    I.pad(B.efectos, voicing(triada(0), 55, 72), t2, 1.4, 0.55, { a: 0.08, r: 1 });
    P.platillo(B.efectos, t2, 0.35);
  };
  // cofre: crujido de madera, "pop", monedas pentatónicas que caen y un ta-dá
  E.cofre = function (t) {
    t = t == null ? ahora() + 0.01 : t;
    var s = fuenteRuido(t, 0.5), bp = filtro('bandpass', 700, 9), g = gan(0), lfo = osc('sine', 17, t), lg = gan(260);
    lfo.connect(lg); lg.connect(bp.frequency); lfo.stop(t + 0.5); s.connect(bp); bp.connect(g); g.connect(B.efectos.entrada);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.35, t + 0.1); g.gain.setTargetAtTime(0, t + 0.38, 0.03);
    var t2 = t + 0.42; golpeTono(B.efectos, t2, 0.35, 420, 180, 0.05, 0.05);
    var r = rng(Math.floor(t * 1000)), penta = ESCALAS.penta, tt = t2 + 0.05, gap = 0.09;
    for (var i = 0; i < 9; i++) { var n = 12 * 7 + K.tono.raiz + penta[Math.floor(r() * 5)] + (r() < 0.4 ? 12 : 0); if (n > 100) n -= 12; I.celesta(B.efectos, n, tt, null, 0.5 - i * 0.03, { campana: true }); tt += gap; gap *= 0.84; }
    var t3 = tt + 0.05;
    voicing(triada(0), 60 + K.tono.raiz % 6, 79).forEach(function (n) { I.juno(B.efectos, n, t3, 0.8, 0.45); });
    I.juno(B.efectos, grado(7, 4), t3 - 0.12, 0.1, 0.35); I.juno(B.efectos, grado(7, 4), t3, 0.8, 0.35);
  };
  // transición: aire que cruza de izquierda a derecha (sin tono, sirve en cualquier tonalidad)
  E.transicion = function (t) {
    t = t == null ? ahora() + 0.01 : t;
    var s = fuenteRuido(t, 0.9), bp = filtro('bandpass', 300, 1.6), g = gan(0), pan = ctx.createStereoPanner();
    s.connect(bp); bp.connect(g); g.connect(pan); pan.connect(B.efectos.entrada);
    bp.frequency.setValueAtTime(300, t); bp.frequency.exponentialRampToValueAtTime(2800, t + 0.35); bp.frequency.exponentialRampToValueAtTime(700, t + 0.75);
    pan.pan.setValueAtTime(-0.8, t); pan.pan.linearRampToValueAtTime(0.8, t + 0.75);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.32, t + 0.3); g.gain.linearRampToValueAtTime(0, t + 0.8);
  };
  // botón: "pop" afinado a la tónica (adelante) o a la quinta de abajo (atrás); 'no' = madera sorda
  E.boton = function (tipo, t) {
    t = t == null ? ahora() + 0.003 : t;
    var n = tipo === 'atras' ? grado(-3, 5) : grado(0, 6);
    if (tipo === 'no') { golpeTono(B.efectos, t, 0.25, 260, 200, 0.03, 0.025, 'triangle'); return; }
    golpeTono(B.efectos, t, 0.28, mtof(n) * 1.5, mtof(n), 0.012, 0.03);
    golpeRuido(B.efectos, t, 0.04, 'bandpass', 3000, 1, 0.003);
  };
  // estrellas 1-2-3: tónica, tercera, quinta; la tercera estrella suma la octava y un brillo
  E.estrella = function (i, t) {
    t = t == null ? ahora() + 0.01 : t; var g = [0, 2, 4][Math.max(0, Math.min(2, i - 1))];
    var n = grado(g, 5); I.celesta(B.efectos, n, t, null, 0.7, { campana: true }); I.juno(B.efectos, n, t, 0.35, 0.3);
    if (i >= 3) { I.celesta(B.efectos, grado(7, 5), t + 0.16, null, 0.7, { campana: true }); P.platillo(B.efectos, t + 0.16, 0.25); }
  };

  /* =========================================================
     6. ESTILOS DE BANDA
     Cada estilo: colchón (pad que se sostiene mientras se espera al niño) + paso(c) por semicorchea.
     c = {i, pos, pulso, sub, compas, acorde, siguiente, t, periodo, energia, nota, voz previa…}
     Registro: la banda arropa por ABAJO (48-59) y por ARRIBA (74-86); el medio (60-72) es del niño.
     ========================================================= */
  var ESTILOS = K.estilos = {};
  function corchea(c) { return c.sub === 0 || c.sub === 2; }
  ESTILOS.worship = {
    nombre: 'Worship suave', reverb: 0.42,
    colchon: function (b, ac, t, v, prev) { var n = voicing(ac.pcs, 50, 62, prev).concat([voicing(ac.pcs, 76, 86)[1]]); return { voz: I.pad(b, n, t, null, 0.55 * v, { a: 0.6, r: 1.6 }), notas: n }; },
    paso: function (c) {
      var b = c.bus, ac = c.acorde.pcs, raiz = c.acorde.raiz;
      // bajo: fundamental al empezar cada acorde, y la quinta en el pulso 3 si el acorde dura un compás
      if (c.energia >= 2 && c.inicioAcorde) I.bajo(b, 36 + raiz + (raiz > 7 ? -12 : 0), c.t, c.periodo * c.acorde.dur * 0.92, 0.55);
      // piano eléctrico: corcheas por arriba del niño, suaves (energía 1: solo al cambiar de acorde)
      if (c.inicioAcorde) voicing(ac, 64, 76).forEach(function (n, k) { I.ep(b, n, c.t + k * 0.012, c.periodo * 1.6, 0.35); });
      else if (c.energia >= 2 && c.sub === 2) { var tonos = tonosDeAcorde(ac, 74, 3); I.ep(b, tonos[(c.pulso + (c.i >> 3)) % 3], c.t, c.periodo * 0.8, 0.22); }
      // batería de escobillas
      if (c.energia >= 3) {
        if (c.sub === 0 && c.pulso === 0) P.bombo(b, c.t, 0.55);
        if (c.sub === 2 && c.pulso === c.compas - 1 && c.compas >= 4) P.bombo(b, c.t, 0.3);
        if (corchea(c)) P.shaker(b, c.t, c.sub === 2 ? 0.55 : 0.3);
        if (c.sub === 0 && (c.pulso === 1 || c.pulso === 3)) P.escobilla(b, c.t, 0.35);
      }
      // respuesta del Juno: cuando el niño sostiene una nota larga, el lead contesta arriba
      if (c.energia >= 2 && c.notaLarga && c.sub === 0 && c.desdeNota === 1) I.juno(b, tonosDeAcorde(ac, 79, 2)[1], c.t, c.periodo * 1.4, 0.32, { desde: tonosDeAcorde(ac, 79, 2)[0] });
      if (c.energia >= 3 && c.inicioFrase) P.platillo(b, c.t, 0.25, c.periodo * 2);
    },
    final: function (b, t, periodo) {
      var I1 = triada(0); I.pad(b, voicing(I1, 50, 62).concat([grado(7, 5) + 12]), t, periodo * 5, 0.7, { a: 0.3, r: 2 });
      tonosDeAcorde(I1, 64, 6).forEach(function (n, k) { I.ep(b, n, t + k * periodo / 4, periodo * 4, 0.35); });
      I.bajo(b, 36 + K.tono.raiz, t, periodo * 4, 0.6); I.juno(b, grado(7, 5), t + periodo, periodo * 3, 0.35, { desde: grado(4, 5) });
      P.platillo(b, t, 0.35);
    }
  };
  ESTILOS.cuento = {
    nombre: 'Orquesta de cuento', reverb: 0.45, trim: 5.5,
    colchon: function (b, ac, t, v, prev) { var n = voicing(ac.pcs, 52, 64, prev).concat([voicing(ac.pcs, 76, 86)[2]]); return { voz: I.cuerdas(b, n, t, null, 0.45 * v, { a: 0.5, r: 1.0 }), notas: n }; },
    paso: function (c) {
      var b = c.bus, ac = c.acorde.pcs, raiz = c.acorde.raiz, bajo = 36 + raiz + (raiz > 7 ? -12 : 0);
      if (c.sub === 0) {
        if (c.compas === 3) {                                    // vals: um-pa-pa
          if (c.pulso === 0) { if (c.energia >= 2) I.pizz(b, bajo, c.t, null, 0.7); }
          else voicing(ac, 55, 64).forEach(function (n) { I.pizz(b, n, c.t, null, 0.35); });
        } else if (c.pulso % 2 === 0 && c.energia >= 2) I.pizz(b, c.pulso === 0 ? bajo : bajo + 7, c.t, null, 0.7);
        else if (c.energia >= 1 && c.pulso % 2 === 1) voicing(ac, 55, 64).forEach(function (n) { I.pizz(b, n, c.t, null, 0.28); });
      }
      if (c.inicioAcorde && c.energia >= 2) tonosDeAcorde(ac, 67, 5).forEach(function (n, k) { I.arpa(b, n, c.t + k * c.periodo / 8, null, 0.45); });
      if (c.energia >= 2 && c.sub === 2 && c.pulso === c.compas - 1 && (c.i >> 4) % 2 === 1) I.celesta(b, tonosDeAcorde(ac, 84, 2)[0], c.t, null, 0.4);
      if (c.energia >= 3 && c.inicioFrase) P.timbal(b, c.t, 0.4, 36 + raiz + (raiz < 5 ? 12 : 0));
    },
    final: function (b, t, periodo) {
      var I1 = triada(0); tonosDeAcorde(I1, 55, 10).forEach(function (n, k) { I.arpa(b, n, t + k * 0.05, null, 0.6); });
      I.cuerdas(b, voicing(I1, 52, 64).concat([grado(7, 5)]), t, periodo * 5, 0.6, { a: 0.2, r: 2 });
      I.pizz(b, 36 + K.tono.raiz, t, null, 0.8); I.celesta(b, grado(7, 6), t + 0.5, null, 0.6, { campana: true });
      for (var k = 0; k < 10; k++) P.timbal(b, t + periodo * 2 + k * 0.05, 0.1 + k * 0.03, 36 + K.tono.raiz);
    }
  };
  ESTILOS.cumbia = {
    nombre: 'Marimba y cumbia', reverb: 0.22,
    colchon: function (b, ac, t, v, prev) { var n = voicing(ac.pcs, 55, 66, prev); return { voz: I.acordeon(b, n, t, null, 0.30 * v, { a: 0.08, r: 0.4 }), notas: n }; },
    paso: function (c) {
      var b = c.bus, ac = c.acorde.pcs, raiz = c.acorde.raiz, bajo = 36 + raiz + (raiz > 7 ? -12 : 0);
      // guacharaca: "chaaa-ki-ki" en cada pulso
      if (c.sub === 0) P.guacharaca(b, c.t, 0.45, c.periodo * 0.42);
      if (c.sub === 2 || c.sub === 3) P.guacharaca(b, c.t, 0.3, c.periodo * 0.16);
      // marimba: golpes a contratiempo por arriba del niño
      if (c.sub === 2) voicing(ac, 72, 81).slice(0, 2).forEach(function (n) { I.marimba(b, n, c.t, null, 0.4); });
      if (c.energia >= 2) {
        // bajo de cumbia: fundamental y quinta, y la anticipación del acorde que viene
        if (c.sub === 0 && c.pulso % 2 === 0) I.bajo(b, bajo, c.t, c.periodo * 0.8, 0.6, { tipo: 'cumbia' });
        if (c.sub === 0 && c.pulso % 2 === 1) I.bajo(b, bajo + 7, c.t, c.periodo * 0.7, 0.5, { tipo: 'cumbia' });
        if (c.sub === 2 && c.ultimoPulsoAcorde && c.siguiente) I.bajo(b, 36 + c.siguiente.raiz + (c.siguiente.raiz > 7 ? -12 : 0), c.t, c.periodo * 0.45, 0.45, { tipo: 'cumbia' });
        if (c.sub === 2) P.llamador(b, c.t, 0.45);
      }
      if (c.energia >= 3) {
        if (c.sub === 0 && c.pulso % 2 === 0) P.tambora(b, c.t, c.pulso === 0 ? 0.6 : 0.4);
        if (c.sub === 2 && c.pulso % 2 === 1) P.tambora(b, c.t, 0.35, true);
        if (c.sub === 3 && c.pulso % 2 === 1) P.tambora(b, c.t, 0.3);
      }
    },
    final: function (b, t, periodo) {
      var I1 = triada(0); voicing(I1, 72, 84).forEach(function (n) { for (var k = 0; k < 12; k++) I.marimba(b, n, t + k * 0.06, null, 0.25 + 0.02 * k); });
      I.bajo(b, 36 + K.tono.raiz, t + 0.72, periodo, 0.7, { tipo: 'cumbia' }); P.tambora(b, t + 0.72, 0.8); P.guacharaca(b, t + 0.72, 0.5, 0.3);
      I.acordeon(b, voicing(I1, 55, 66), t + 0.72, periodo * 2, 0.4);
    }
  };
  ESTILOS.chip = {
    nombre: 'Chiptune de los juegos', reverb: 0.12, trim: 2,
    colchon: function (b, ac, t, v, prev) { var n = voicing(ac.pcs, 64, 76, prev).slice(0, 2); return { voz: I.chip(b, n[0], t, null, 0.22 * v, { ancho: 50, s: 0.6 }), notas: n }; },
    paso: function (c) {
      var b = c.bus, ac = c.acorde.pcs, raiz = c.acorde.raiz, bajo = 36 + raiz + (raiz > 7 ? -12 : 0);
      if (c.energia >= 1) { var t3 = tonosDeAcorde(ac, 76, 3); I.chip(b, t3[c.i % 3], c.t, c.periodo * 0.22, perfil === 'tablet' ? 1.0 : 0.6, { ancho: 12.5, vibrato: false, s: 0.5 }); }
      if (c.energia >= 2 && corchea(c)) I.bajo(b, bajo + (c.sub === 2 ? 12 : 0), c.t, c.periodo * 0.42, 0.45, { tipo: 'chip' });
      if (c.energia >= 3) {
        if (c.sub === 0 && c.pulso % 2 === 0) P.chipBombo(b, c.t, 0.35);
        if (c.sub === 0 && c.pulso % 2 === 1) P.chipRuido(b, c.t, 0.55, true);
        if (c.sub === 2) P.chipRuido(b, c.t, 0.3);
      }
    },
    final: function (b, t, periodo) {
      var tri = triada(0), notas = tonosDeAcorde(tri, 67, 4).concat([grado(7, 5)]);
      notas.forEach(function (n, k) { I.chip(b, n, t + k * 0.09, 0.08, 0.55, { ancho: 25, vibrato: false }); });
      I.chip(b, grado(7, 5), t + 0.45, 0.6, 0.6, { ancho: 25 }); I.bajo(b, 36 + K.tono.raiz, t + 0.45, 0.6, 0.6, { tipo: 'chip' });
      P.chipBombo(b, t + 0.45, 0.7);
    }
  };
  ESTILOS.nana = {
    nombre: 'Nana (cajita de música)', reverb: 0.5, trim: 0.5,
    colchon: function (b, ac, t, v, prev) { var n = voicing(ac.pcs, 52, 64, prev); return { voz: I.pad(b, n, t, null, 0.4 * v, { a: 1.0, r: 2, brillo: 0.7 }), notas: n }; },
    paso: function (c) {
      var b = c.bus, ac = c.acorde.pcs;
      if (corchea(c) && c.energia >= 1) { var t4 = tonosDeAcorde(ac, 76, 4); I.celesta(b, t4[(c.i >> 1) % 4], c.t, null, 0.32); }
      if (c.energia >= 2 && c.inicioAcorde) I.bajo(b, 48 + c.acorde.raiz - (c.acorde.raiz > 5 ? 12 : 0), c.t, c.periodo * c.acorde.dur, 0.35);
    },
    final: function (b, t, periodo) { tonosDeAcorde(triada(0), 72, 6).forEach(function (n, k) { I.celesta(b, n, t + k * periodo / 2, null, 0.45); }); I.pad(b, voicing(triada(0), 52, 64), t, periodo * 5, 0.5, { a: 0.4, r: 2.5 }); }
  };

  /* =========================================================
     7. EL DIRECTOR MUSICAL: la banda que SIGUE al niño
     ========================================================= */
  /* op = {
       melodia: [{nota, dur, silencio?}]  (pulsos; dur 1 = negra)
       compas: 4 | 3 | 2,   tempo: 76 (el de la partitura: solo es el punto de partida)
       estilo: 'worship'|'cuento'|'cumbia'|'chip'|'nana',   tono: {raiz, modo} (por defecto el del kit)
       acordes: ['DO','FA',…] (opcional, por trozo),   energia: 1..3 (de partida; sube con la racha)
       modo: 'sigue' (espera la nota; por defecto) | 'guia' (marca el tempo y se ajusta poco)
       octavaLibre: true (acepta la nota en cualquier octava),   pistas: true (sopla la nota tras 2 errores)
       latencia: s (salida de audio; por defecto la del contexto)
       autonomo: true (sin niño: toca la melodía sola; para la música de menú)
       instrumentoMelodia: 'juno'|'flauta'|… (con autonomo)
     }
     Métodos: iniciar(), nota(midi, fuerza, cuando, fuente), detener(), on(evento, fn), estado()
     Eventos: 'acierto' {indice}, 'error' {nota, esperada}, 'tempo' {bpm}, 'espera', 'pausa', 'fin', 'paso' */
  K.director = function (op) {
    op = op || {};
    var D = {}, oyentes = {}, est = ESTILOS[op.estilo] || ESTILOS.worship, compas = op.compas || 4;
    function BUS() { return B[op.bus || 'banda']; }
    var tono = op.tono || K.tono, modo = op.modo || (op.autonomo ? 'guia' : 'sigue');
    var nominal = 60 / (op.tempo || 76), LOOK = 0.12, timer = null;
    var mel = [], total = 0, arm = [];
    function cargar(melodia) {
      mel = []; var p = 0;
      melodia.forEach(function (e) { if (!e.silencio && e.nota != null) mel.push({ nota: e.nota, t: p, dur: e.dur || 1, fuerza: e.fuerza }); p += e.dur || 1; });
      total = p; arm = armonizar(mel, { compas: compas, tono: tono, total: total, acordes: op.acordes });
    }
    cargar(op.melodia || []);
    var st = { indice: 0, periodo: nominal, anclaT: null, anclaPos: 0, prog: -1, energia: clamp(op.energia || 1, 1, 3), seguidos: 0, errores: 0,
      hist: [], confianza: 0, colchon: null, colchonSeg: -1, previoVoicing: null, terminado: false, esperandoDesde: null, enPausa: false, finProgramado: false, vuelta: 0 };
    var LAT = op.latencia != null ? op.latencia : K.latenciaSalida();
    function emitir(ev, datos, t) {
      var l = oyentes[ev]; if (!l || !l.length) return;
      var lanzar = function () { l.forEach(function (fn) { try { fn(datos); } catch (e) {} }); };
      if (t == null || K.offline()) lanzar(); else setTimeout(lanzar, Math.max(0, (t - ahora()) * 1000));
    }
    D.on = function (ev, fn) { (oyentes[ev] = oyentes[ev] || []).push(fn); return D; };
    function posEn(t) { return st.anclaT == null ? -Infinity : st.anclaPos + (t - st.anclaT) / st.periodo; }
    function tiempoDe(pos) { return st.anclaT + (pos - st.anclaPos) * st.periodo; }
    function segEn(pos) { var s = arm[0]; for (var i = 0; i < arm.length; i++) if (arm[i].t <= pos + 1e-6) s = arm[i]; return s; }
    function notaEn(pos) { var m = null; for (var i = 0; i < mel.length; i++) if (mel[i].t <= pos + 1e-6) m = mel[i]; return m; }
    // hasta dónde puede avanzar la banda sin el niño: justo antes de la nota que espera
    // (si el niño viene muy parejo —confianza alta— la banda se atreve a caer CON él en ese tiempo)
    function tope() {
      if (modo === 'guia' || op.autonomo) return Infinity;
      var sig = mel[st.indice];
      if (!sig) return total + 0.001;
      return sig.t + (st.confianza > 0.65 ? 0.02 : -0.02);
    }
    D.acordeActual = function () { if (st.anclaT == null) return null; return segEn(Math.max(0, posEn(ahora()))); };
    D.proximaCorchea = function (t) {
      if (st.anclaT == null || st.terminado || st.enPausa) return null;
      var p = posEn(t); if (p >= tope()) return null;
      return tiempoDe(Math.ceil(p * 2 - 1e-6) / 2);
    };
    D.estado = function () {
      return { indice: st.indice, total: mel.length, bpm: Math.round(60 / st.periodo), energia: st.energia, confianza: +st.confianza.toFixed(2),
        esperando: st.anclaT != null && !st.terminado && posEn(ahora()) >= tope() - 0.03, pausa: st.enPausa, terminado: st.terminado,
        acorde: D.acordeActual() && D.acordeActual().nombre, siguiente: mel[st.indice] ? mel[st.indice].nota : null };
    };
    D.siguienteNota = function () { return mel[st.indice] ? mel[st.indice].nota : null; };
    D.melodia = function () { return mel; };
    D.armonia = function () { return arm; };

    function cambiarColchon(seg, t) {
      if (st.colchon) st.colchon.voz.soltar(t, 0.5);
      var c = est.colchon(BUS(), seg, t, 0.6 + 0.2 * st.energia, st.previoVoicing);
      st.colchon = c; st.previoVoicing = c.notas; st.colchonSeg = seg.i;
    }
    function programarPaso(i, pos, t) {
      var seg = segEn(pos); if (!seg) return;
      var dentro = pos - seg.t, n = notaEn(pos);
      if (st.colchonSeg !== seg.i || !st.colchon) cambiarColchon(seg, t);
      var pulsoAbs = Math.floor(pos + 1e-6), pulso = ((pulsoAbs % compas) + compas) % compas;
      var c = {
        bus: BUS(), i: i, pos: pos, t: t, periodo: st.periodo, compas: compas, pulso: pulso, sub: ((i % 4) + 4) % 4,
        acorde: seg, siguiente: arm[seg.i + 1], energia: st.energia, inicioAcorde: Math.abs(dentro) < 1e-6,
        ultimoPulsoAcorde: dentro >= seg.dur - 1 - 1e-6, inicioFrase: Math.abs(pos % (compas * 2)) < 1e-6,
        notaLarga: !!(n && n.dur >= 2 && pos < n.t + n.dur), desdeNota: n ? pos - n.t : 0
      };
      est.paso(c);
      if (op.autonomo) mel.forEach(function (m) {
        if (m.t >= pos - 1e-6 && m.t < pos + 0.25 - 1e-6) (I[op.instrumentoMelodia || 'juno'])(c.bus, m.nota, t + (m.t - pos) * st.periodo, m.dur * st.periodo * 0.9, m.fuerza != null ? m.fuerza : 0.5);
      });
      emitir('paso', { pos: pos, t: t, pulso: pulso, sub: c.sub, acorde: seg.nombre, inicioAcorde: c.inicioAcorde }, t);
    }
    function terminar(t) {
      if (st.finProgramado) return; st.finProgramado = true;
      if (op.autonomo) return;
      var tf = Math.max(t, ahora() + 0.01);
      if (st.colchon) st.colchon.voz.soltar(tf, 0.4);
      est.final(BUS(), tf, st.periodo * 1.12);              // ritardando: el final un pelín más lento
      st.terminado = true; emitir('fin', {}, tf);
      D.detener(true);
    }
    // el corazón: se llama cada 25 ms (o en tiempo virtual al hornear)
    D.tick = function (tAhora) {
      if (st.anclaT == null || st.terminado) return;
      var techo = tope(), pAhora = posEn(tAhora);
      // ¿esperando al niño?
      if (pAhora >= techo - 0.03 && !op.autonomo && modo === 'sigue') {
        if (st.esperandoDesde == null) { st.esperandoDesde = tAhora; emitir('espera', { nota: D.siguienteNota() }); }
        // si se demora mucho, la banda respira: suelta el colchón y queda en silencio esperando
        if (!st.enPausa && tAhora - st.esperandoDesde > Math.max(6, st.periodo * compas * 3)) {
          st.enPausa = true; if (st.colchon) { st.colchon.voz.soltar(tAhora, 2.5); st.colchon = null; } emitir('pausa', {});
        }
      }
      var hasta = Math.min(posEn(tAhora + LOOK), techo);
      var ultimo = Math.ceil(hasta * 4 - 1e-6) - 1;
      for (var i = st.prog + 1; i <= ultimo; i++) {
        var pos = i / 4;
        if (pos >= total - 1e-6) {
          if (op.autonomo) { otraVuelta(i); return; }
          terminar(tiempoDe(total)); return;
        }
        programarPaso(i, pos, Math.max(tiempoDe(pos), ahora() + 0.004));
        st.prog = i;
      }
    };
    function otraVuelta(i) {
      st.vuelta++;
      if (op.alVolver) { var nueva = op.alVolver(st.vuelta); if (nueva) { cargar(nueva.melodia); if (nueva.energia) st.energia = nueva.energia; } }
      st.anclaPos -= total;                                  // la vuelta empieza sin saltos
      st.prog = -1; st.colchonSeg = -1;
      D.tick(ahora());
    }
    /* el niño tocó: ¿es la nota que tocaba? (o la siguiente, si se saltó una) */
    D.nota = function (nota, fuerza, cuando, fuente) {
      if (st.terminado || op.autonomo) return;
      var t = cuando == null ? ahora() : cuando;
      // el niño toca contra lo que OYE: con piano MIDI oye su nota al instante; la banda sale LAT después
      var tAncla = fuente === 'pantalla' ? t : t - LAT;
      var esp = mel[st.indice], sig = mel[st.indice + 1];
      var igual = function (a, b) { return a === b || (op.octavaLibre !== false && pc(a) === pc(b)); };
      var salto = 0;
      if (esp && igual(nota, esp.nota)) salto = 0;
      else if (sig && igual(nota, sig.nota) && st.indice > 0) salto = 1;
      else {
        st.errores++; st.seguidos = 0;
        emitir('error', { nota: nota, esperada: esp && esp.nota });
        if (st.errores >= 2 && st.energia > 1 && modo === 'sigue') st.energia--;
        if (op.pistas !== false && st.errores === 2 && esp) E.pista(esp.nota);
        return false;
      }
      var e = mel[st.indice + salto];
      st.errores = 0; st.seguidos++;
      if (st.seguidos % 4 === 0 && st.energia < 3) st.energia++;
      K.alTocarNino(Math.max(ahora(), t), nota);
      // historia para el tempo: (posición en la partitura, tiempo)
      // si se detuvo a buscar la nota (o se adelantó muchísimo), eso no es tempo: la historia vuelve a empezar
      var ult = st.hist[st.hist.length - 1];
      if (ult) { var esperado = (e.t - ult.p) * st.periodo, real = tAncla - ult.t; if (real > esperado * 1.7 + 0.3 || real < esperado * 0.45) st.hist = []; }
      st.hist.push({ p: e.t, t: tAncla }); if (st.hist.length > 6) st.hist.shift();
      estimarTempo();
      var primera = st.anclaT == null;
      if (modo === 'sigue' || primera) {
        // anclar la banda a ESTA nota: si venía adelantado salta, si la banda esperaba arranca aquí
        st.anclaT = tAncla; st.anclaPos = e.t;
        var paso = Math.round(e.t * 4);
        if (st.prog >= paso) { /* la banda ya cayó con él (predicción): seguir desde ahí */ }
        else st.prog = paso - 1;
      } else {
        // modo guía: corrección suave de fase (25 %)
        var err = tAncla - tiempoDe(e.t); st.anclaT += 0.25 * err;
      }
      if (st.enPausa) { st.enPausa = false; st.energia = Math.max(1, st.energia); st.colchonSeg = -1; }
      st.esperandoDesde = null;
      st.indice += salto + 1;
      emitir('acierto', { indice: st.indice - 1, nota: nota, salto: salto });
      if (!timer && !K.offline()) arrancarReloj();
      D.tick(ahora());
      return true;
    };
    function estimarTempo() {
      var h = st.hist; if (h.length < 2) return;
      var span = h[h.length - 1].p - h[0].p; if (span < 1.5) return;
      // regresión lineal t = a + b·p con los últimos 6 aciertos (b = segundos por pulso)
      var n = h.length, sp = 0, stt = 0, spp = 0, spt = 0;
      h.forEach(function (x) { sp += x.p; stt += x.t; spp += x.p * x.p; spt += x.p * x.t; });
      var b = (n * spt - sp * stt) / (n * spp - sp * sp); if (!(b > 0)) return;
      var a = (stt - b * sp) / n, res = 0; h.forEach(function (x) { var r = x.t - (a + b * x.p); res += r * r; });
      var sd = Math.sqrt(res / n);
      st.confianza = clamp(1 - sd / (0.22 * b), 0, 1) * clamp((n - 1) / 4, 0, 1);
      b = clamp(b, nominal / 1.7, nominal / 0.55);                       // niño de 4 años: de muy lento a algo rápido
      b = clamp(b, st.periodo * 0.78, st.periodo * 1.28);                // nada de saltos bruscos
      var alfa = modo === 'sigue' ? 0.5 : 0.15;
      st.periodo += alfa * (b - st.periodo);
      emitir('tempo', { bpm: Math.round(60 / st.periodo), confianza: st.confianza });
    }
    function arrancarReloj() { timer = setInterval(function () { D.tick(ahora()); }, 25); }
    // iniciar: en 'sigue' la banda espera la PRIMERA nota del niño (no hay cuenta: entra con él).
    // En 'guia' o autónomo cuenta un compás con los palitos y arranca.
    D.iniciar = function (cuando) {
      directores.push(D);
      // cada estilo trae su ajuste de nivel para quedar ~7 dB por debajo del piano del niño
      if (!op.bus || op.bus === 'banda') BUS().nivel.gain.setTargetAtTime(dB(NIVELES.banda + (est.trim || 0)), ahora(), 0.05);
      if (modo === 'sigue' && !op.autonomo) { emitir('espera', { nota: D.siguienteNota() }); return D; }
      var t0 = (cuando == null ? ahora() + 0.1 : cuando);
      if (!op.autonomo && op.cuenta !== false) { for (var k = 0; k < compas; k++) P.palitos(BUS(), t0 + k * st.periodo, k === 0 ? 0.8 : 0.55); t0 += compas * st.periodo; }
      st.anclaT = t0; st.anclaPos = 0; st.prog = -1;
      if (!K.offline()) arrancarReloj();
      return D;
    };
    D.detener = function (suave) {
      if (timer) { clearInterval(timer); timer = null; }
      var i = directores.indexOf(D); if (i >= 0) directores.splice(i, 1);
      if (!suave && st.colchon) { st.colchon.voz.soltar(ahora(), 0.6); st.colchon = null; }
      if (!suave) st.terminado = true;
    };
    D.energia = function (e) { if (e != null) st.energia = clamp(e, 1, 3); return st.energia; };
    /* hornear sin tiempo real: notasNino = [{nota, t, fuerza, fuente}] (t en segundos del contexto).
       Toca también las notas del niño con el piano del kit. */
    D.simular = function (notasNino, hasta) {
      var paso = 0.01, k = 0;
      vNow = 0; D.iniciar(0.05);
      for (var t = 0; t < hasta && !st.terminado; t += paso) {
        vNow = t;
        while (k < notasNino.length && notasNino[k].t <= t + 1e-9) {
          var x = notasNino[k++]; vNow = x.t;
          var vz = PIANO.tocar(x.nota, x.fuerza || 85, x.t); if (vz) PIANO.soltar(x.nota, x.t + (x.dur || 0.4));
          D.nota(x.nota, x.fuerza || 85, x.t, x.fuente || 'midi');
          vNow = t;
        }
        D.tick(t);
      }
      vNow = null;
      return D;
    };
    // avanzar en tiempo virtual (música de menú al hornear)
    D.hornear = function (hasta) { for (var t = 0; t < hasta; t += 0.01) { vNow = t; D.tick(t); } vNow = null; return D; };
    return D;
  };

  /* =========================================================
     8. MÚSICA DE MENÚ / MAPA POR MUNDO (compuesta por reglas, no cansa)
     Un motivo propio por mundo + variaciones en cada vuelta; cada 3 vueltas cambia la
     instrumentación; a los 3 minutos queda solo el colchón y un brillo cada tanto.
     ========================================================= */
  var MUNDOS = K.mundos = {
    bosque:   { estilo: 'cumbia',  tono: ['SOL', 'mayor'], tempo: 96, compas: 4, mel: 'marimba', semilla: 101 },
    castillo: { estilo: 'cuento',  tono: ['FA', 'mayor'],  tempo: 84, compas: 3, mel: 'flauta',  semilla: 202 },
    mar:      { estilo: 'worship', tono: ['RE', 'mayor'],  tempo: 72, compas: 4, mel: 'juno',    semilla: 303 },
    estrellas:{ estilo: 'chip',    tono: ['DO', 'mayor'],  tempo: 112, compas: 4, mel: 'chip',   semilla: 404 },
    noche:    { estilo: 'nana',    tono: ['MIb', 'mayor'], tempo: 60, compas: 3, mel: 'celesta', semilla: 505 }
  };
  var PROGRESIONES = [[0, 4, 5, 3], [0, 3, 0, 4], [0, 5, 3, 4], [5, 3, 0, 4], [0, 3, 4, 0]];
  var CELDAS = { 4: [[1, 1, 1, 1], [1, 1, 2], [2, 1, 1], [1.5, 0.5, 2], [0.5, 0.5, 1, 2], [1, 1, 1, 0.5, 0.5], [2, 2]], 3: [[1, 1, 1], [2, 1], [1, 0.5, 0.5, 1], [3], [1.5, 0.5, 1]] };
  /* compone 8 compases: frase A (motivo, motivo en secuencia, respuesta) y A' que cierra en la tónica */
  function componer(semilla, vuelta, compas, tono) {
    var r = rng(semilla), rv = rng(semilla * 31 + vuelta * 7);
    var prog = PROGRESIONES[Math.floor(r() * PROGRESIONES.length)], celdas = CELDAS[compas] || CELDAS[4];
    var motivo = celdas[Math.floor(r() * celdas.length)], respuesta = celdas[Math.floor(r() * celdas.length)];
    var g = Math.floor(r() * 3) * 2, salida = [], dir = r() < 0.5 ? 1 : -1;
    for (var bar = 0; bar < 8; bar++) {
      var gr = prog[bar % 4], tr = [gr, gr + 2, gr + 4];
      var ritmo = bar % 4 === 3 ? (bar === 7 ? [compas] : respuesta) : (bar % 4 === 2 && rv() < 0.5 ? celdas[Math.floor(rv() * celdas.length)] : motivo);
      if (bar === 7) { g = 7; salida.push({ grado: g, dur: compas }); continue; }
      ritmo.forEach(function (d, j) {
        if (j === 0) { var mejor = tr[0], dm = 99; [tr[0], tr[1], tr[2], tr[0] + 7, tr[1] + 7].forEach(function (x) { var dd = Math.abs(x - g); if (dd < dm) { dm = dd; mejor = x; } }); g = mejor; }
        else { if (rv() < 0.72) g += dir; else g += dir * 2; if (g > 10 || g < 1 || rv() < 0.22) dir = -dir; }
        salida.push({ grado: g, dur: d, fuerza: j === 0 ? 0.55 : 0.42 });
      });
      if (bar === 3) dir = -1;
    }
    return salida.map(function (x) { return { nota: grado(x.grado, 4, tono), dur: x.dur, fuerza: x.fuerza }; });
  }
  K.componer = componer;
  var musicaActual = null;
  K.musica = {
    tocar: function (nombre, op) {
      op = op || {}; K.musica.parar(0.6);
      var m = MUNDOS[nombre] || MUNDOS.bosque, tono = { raiz: RAIZ[m.tono[0].toUpperCase()], modo: m.tono[1] }, t0 = ahora();
      var d = K.director({ melodia: componer(m.semilla, 0, m.compas, tono), compas: m.compas, tempo: m.tempo, estilo: m.estilo, tono: tono, autonomo: true, instrumentoMelodia: m.mel, energia: 2, bus: 'musica',
        alVolver: function (v) {
          var minutos = (ahora() - t0) / 60;
          var e = minutos > 3 ? 1 : [2, 3, 3, 2][v % 4];
          var melo = componer(m.semilla, v, m.compas, tono);
          if (minutos > 3 || v % 4 === 3) melo = melo.map(function (x, i) { return i % 3 ? { silencio: true, dur: x.dur } : x; });   // respira
          return { melodia: melo, energia: e };
        } });
      d.iniciar(t0 + 0.15);
      musicaActual = { d: d, nombre: nombre };
      return d;
    },
    parar: function (fundido) {
      if (!musicaActual) return; var d = musicaActual.d; musicaActual = null;
      var g = B.musica.nivel.gain, t = ahora(), nivel = dB(NIVELES.musica);
      cancelar(g, t); g.setTargetAtTime(0, t, (fundido || 0.6) / 3);
      setTimeout(function () { d.detener(); cancelar(g, ahora()); g.setTargetAtTime(nivel, ahora(), 0.05); }, (fundido || 0.6) * 1000 + 300);
    },
    actual: function () { return musicaActual && musicaActual.nombre; }
  };

  /* utilidades públicas */
  K.mtof = mtof; K.grado = grado; K.triada = triada; K.voicing = voicing; K.acordeDeNombre = acordeDeNombre;
  K.NOMBRES = NOMBRES;
  global.KitSonido = K;
})(typeof window !== 'undefined' ? window : this);
