// =====================================================================
//  M2 · EL DÍA: primer día (carta de Bach → Tic → traje → la primera nota abre la puerta),
//  las cinco paradas con sus juegos, el órgano del día, corcheas doradas y pentagrama de la semana.
//  Todo lo de música corre en el RELOJ DE LA ESCENA (P.t): se detiene en pausa y lo acelera VEL5 en pruebas.
// =====================================================================
const BPM5 = 80;
// Pedagogía de tiempos y notas (M3.1): se empieza LENTO y con UNA nota; cada día de práctica suma una nota (MI → SOL → DO → RE → FA → LA → SI)
// y sube el tempo de a poco (56 → 80), nunca más rápido que la canción.
const ORDEN_NOTAS5 = [4, 7, 0, 2, 5, 9, 11], NOTA_PC5 = { 0: 60, 2: 62, 4: 64, 5: 65, 7: 67, 9: 69, 11: 71 };
function diaPlan5() { const m = m2_(); return m && m.diaForzado != null ? m.diaForzado : diasHechos5(); }   // papá puede simular el día
function plan5() { return planDia5(diaPlan5()); }
function conocidas5() { return plan5().notas; }
function nivelLectura5() { return GUARDA.perfil() ? plan5().lectura : 2; }
const conoce5 = n => conocidas5().includes(((n % 12) + 12) % 12);
function tempoDia5() { return plan5().bpm; }
const tempo5 = bpm => Math.min(bpm || 80, tempoDia5());
const PARADAS5 = ['patio', 'coro', 'salon', 'teatro', 'taller'];
const NOMBRE_PARADA5 = { patio: 'El Patio', coro: 'El Coro', salon: 'Salón de Bach', teatro: 'El Teatro', taller: 'El Taller', conservatorio: 'El duelo', batalla: 'Batalla', partituras: 'Partituras al azar', concierto: 'Concierto', kiosco: 'El kiosco' };
const COLOR_PARADA5 = { patio: NC.FA, coro: NC.SOL, salon: NC.SI, teatro: NC.DO, taller: NC.RE, conservatorio: NC.LA, batalla: NC.LA, partituras: NC.SI, concierto: NC.DO, kiosco: NC.MI };
const SILABA5 = { .5: 'ta', 1: 'tan', 1.5: 'taan', 2: 'taaan', 3: 'taaaan', 4: 'taaaaan' }, FIGURA5 = { .5: 'corchea', 1: 'negra', 1.5: 'negra', 2: 'blanca', 3: 'blanca', 4: 'redonda' };
const figura5 = d => FIGURA5[d] || (d < 1 ? 'corchea' : d < 2 ? 'negra' : d < 4 ? 'blanca' : 'redonda');
function silaba5(S, k) { const d = S.notas[k].d; if (S.notas[k].n === 0) return 'sh'; if (d === .5) return (S.ini[k] + (S.o.anac ? (S.o.compas || 4) - S.o.anac : 0)) % 1 ? 'ca' : 'ta'; return SILABA5[d] || 'tan'; }
const LETRA_EN5 = n => ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][((n % 12) + 12) % 12] + (Math.floor(n / 12) - 1);
const q5 = n => ({ n, d: 1 }), h5 = n => ({ n, d: 2 }), w5 = n => ({ n, d: 4 });
// Jingle Bells (estribillo, en DO): pedazo 1 «jin-gle bells, jin-gle bells», pedazo 2 «jin-gle all the way»
const JB5 = { A: [q5(64), q5(64), h5(64), q5(64), q5(64), h5(64)], B: [q5(64), q5(67), q5(60), q5(62), w5(64)] };
const ventana5 = S => (ULTIMA_FUENTE5 === 'midi' ? .22 : .28) + (S.apoyo >= 2 ? .08 : 0);   // ±s: la pantalla táctil tiene más retraso
const estrellas5 = p => p >= .999 ? 3 : p >= .9 ? 2 : p >= .8 ? 1 : 0;
const pausado5 = () => document.getElementById('menu').classList.contains('abierto');
// ---------- guardado del día (por perfil) ----------
let FECHA5 = null;   // las pruebas fijan el día
function hoy5() { if (FECHA5) return FECHA5; const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function m2_() { const p = GUARDA.perfil(); if (!p) return null; p.m2 = p.m2 || { primerDia: false, corcheas: 0, dias: {}, dominio: {} }; return p.m2; }
// M5: MISIONES, no días: la sesión es la de la misión en curso (m.ses[n]); el día real queda como registro (minutos, informe)
function diaHoy5() { const m = m2_(), n = Math.min(13, m.mision || 0); m.ses = m.ses || {}; return m.ses[n] || (m.ses[n] = { paradas: {}, completo: false, mision: n }); }
function diaLog5() { const m = m2_(), k = hoy5(); return m.dias[k] || (m.dias[k] = { paradas: {}, completo: false }); }
function paradasMision5() { const n = Math.min(13, (m2_() || {}).mision || 0); return MISIONES5 && MISIONES5[n] && MISIONES5[n].duelo ? PARADAS5.concat(['conservatorio']) : PARADAS5; }
const claveDominio5 = () => 'M' + ((m2_() || {}).mision || 0);
function siguienteParada5() { const d = diaHoy5(); return paradasMision5().find(id => !d.paradas[id]) || null; }
const SESION5 = { t0: null, tFin: null, log: [] };
// ---------- voces (Voz5: opcionales, nunca bloquean; si no hay audios, el juego sigue callado) y pitidos de Tic ----------
function prepVoz5() { if (!window.Voz5) return false; Voz5.quien = GUARDA.d.perfil === 'david' ? 'david' : 'sarah'; Voz5.activa = GUARDA.d.voces !== false; const p = GUARDA.perfil(); if (p) Voz5.estado = p.voz || (p.voz = {}); return true; }
function voz5(cual, o = {}) { try { if (!prepVoz5()) return null; const pf = Voz5.quien, G = window.GUION || {}; return Voz5.decir(cual, Object.assign({ filtro: id => !(G[id] || {}).pf || G[id].pf === pf }, o)); } catch (e) { return null; } }
function vozPrimeras5(clave, n, cual, o) { try { if (!prepVoz5()) return null; return Voz5.primeras(clave, n, () => voz5(cual, o)); } catch (e) { return null; } }
function ticPita5(tipo) { const P = { hola: [84, 88, 91], feliz: [91, 95, 98, 103], ayuda: [79, 84], sueno: [91, 86, 79] }[tipo] || [88]; P.forEach((n, i) => setTimeout(() => SON5.ticCanta(n, .1), i * 95 / VEL5)); marca5('tic ' + tipo); }
function marca5(que) { SESION5.log.push({ que, t: +RELOJ.toFixed(1) }); }
// ---------- partículas y vuelos ----------
function fx5() {
  const L = [];
  return {
    lista: L,
    estallar(x, y, c, n = 18, f = 1) { if (window.LIGERO5) n = Math.ceil(n / 2); for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, v = (120 + Math.random() * 240) * f; L.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 140, t: 0, vida: .55 + Math.random() * .45, c, r: 5 + Math.random() * 6 }); } },
    polvo(x, y) { for (let i = 0; i < 9; i++) L.push({ tipo: 'polvo', x: x + (Math.random() - .5) * 26, y, vx: (Math.random() - .5) * 90, vy: -20 - Math.random() * 40, t: 0, vida: .55, c: 'rgba(150,128,110,.55)', r: 5 + Math.random() * 5 }); },
    vuela(x0, y0, x1, y1, dib, dur = .9, alFin) { L.push({ tipo: 'vuela', x0, y0, x1, y1, t: 0, vida: dur, dib, alFin }); },
    dibujar(ctx, dt) {
      for (let i = L.length - 1; i >= 0; i--) {
        const p = L[i]; p.t += dt; if (p.t >= p.vida) { L.splice(i, 1); if (p.alFin) p.alFin(); continue; }
        const q = p.t / p.vida;
        if (p.tipo === 'vuela') { const e = q < .5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2; p.dib(ctx, p.x0 + (p.x1 - p.x0) * e, p.y0 + (p.y1 - p.y0) * e - Math.sin(q * Math.PI) * 110, q); continue; }
        if (p.tipo !== 'polvo') p.vy += 640 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        ctx.save(); ctx.globalAlpha = 1 - q; ctx.fillStyle = p.c;
        if (p.tipo === 'polvo') { ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + q), 0, 7); ctx.fill(); }
        else { ctx.translate(p.x, p.y); ctx.rotate(p.t * 9); ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r); ctx.lineWidth = 1.5; ctx.strokeStyle = INK; ctx.strokeRect(-p.r / 2, -p.r / 2, p.r, p.r); }
        ctx.restore();
      }
    },
  };
}
// ---------- el pulso de Tic (bloque de madera; campanita en el uno) ----------
// El clic se PROGRAMA en el reloj de audio (no en el cuadro): una referencia escena→audio y 120 ms de anticipación.
function pulso5() {
  return {
    bpm: BPM5, t0: 0, ult: -1, sonar: true, compas: 4, ref: null, cuentas: [],
    anclar(t, bpm, compas) { this.bpm = bpm || this.bpm; if (compas) this.compas = compas; this.t0 = t; this.ult = -1; this.cuentas = []; },
    b() { return 60 / this.bpm; }, beat(t) { return (t - this.t0) / this.b(); }, tDe(k) { return this.t0 + k * this.b(); },
    audio(ts) { return this.ref ? this.ref.a + (ts - this.ref.s) / VEL5 : 0; },
    sincronizar(t) { if (!SON5.listo) return; const a = KitSonido.ahora(); if (!this.ref || Math.abs(this.audio(t) - a) > .05) this.ref = { s: t, a }; },
    paso(t) {
      this.sincronizar(t);
      const LA = .12 * VEL5, n = Math.floor(this.beat(t + LA) + 1e-6); if (n - this.ult > 4) this.ult = n - 1;
      while (this.ult < n) { this.ult++; if (this.ult < 0) continue; const tb = this.tDe(this.ult), at = SON5.listo ? Math.max(KitSonido.ahora(), this.audio(tb)) : 0;
        const deja = this.sonar && (!this.puedeSonar || this.puedeSonar());   // M7c: el clic calla si el ejercicio no es de pulso o si el niño dejó de responder
        if (deja) SON5.ticEn(this.ult % this.compas === 0, at);
        const c = this.cuentas.find(x => x.k === this.ult); if (c && !c.muda) SON5.cuenta(c.num, at, c.de); }
    },
    // la cuenta hablada («uno, dos, tres, cuatro») va pegada a los mismos pulsos
    contar(desde, cuantos, de, muda) { for (let i = 0; i < cuantos; i++) this.cuentas.push({ k: desde + i, num: i + 1, de, muda: !!muda }); },
  };
}
// ---------- dibujo común ----------
function pergamino5(ctx, x, y, w, h, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(10,4,25,.45)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; rr(ctx, x, y, w, h, 20); ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, '#fffaf4'], [1, '#ecd8aa']]); ctx.fill(); ctx.restore();
  ctx.save(); ctx.globalAlpha = a; rr(ctx, x, y, w, h, 20); ctx.lineWidth = 5; ctx.strokeStyle = '#2a1a3a'; ctx.stroke(); rr(ctx, x + 9, y + 9, w - 18, h - 18, 14); ctx.lineWidth = 2.5; ctx.strokeStyle = '#d9a930'; ctx.stroke(); ctx.restore();
}
function heroe5(est = '') { return heroeAnim5({ ojos: est === 'feliz' ? 'happy' : parpadeo5(), camina: est === 'paso' ? 1 : null }); }
function nombreNino5() { return { sarah: 'Querida Sarah:', david: 'Querido David:', papa: 'Querido papá:', mama: 'Querida mamá:' }[GUARDA.d.perfil] || 'Querida Sarah:'; }
function dibujarTic5(ctx, P, x, y, k = 4) {
  const b = P.pulso.beat(P.t), fr = b - Math.floor(b), CP = P.pulso.compas || 4, uno = ((Math.floor(b) % CP) + CP) % CP === 0 && b >= 0;
  const ang = Math.round(Math.cos(Math.PI * b) * 4) / 10, by = y + Math.sin(RELOJ * 2.4) * 4;
  if (b >= 0) { ctx.save(); ctx.globalAlpha = Math.max(0, 1 - fr * 2.2); brillo(ctx, x, by - 17 * k, uno ? 110 : 76, uno ? '255,208,70' : '255,236,190'); ctx.restore(); }
  const s = sprRobotB({ ang, ojos: P.ticOjos || ((RELOJ % 4.3) < .14 ? 'cerrado' : 'feliz'), boca: P.ticCanta > P.t ? 'canta' : '', llama: Math.floor(RELOJ * 14) % 2 });
  sombra(ctx, x, y + 46, 22, .2); if (!dibujarTicArte7(ctx, P, x, by, k, ang)) sprK(ctx, destacado5(s), x, by, k);
  // los cuatro tiempos del compás (el uno en oro)
  for (let i = 0; i < CP; i++) { const on = b >= 0 && ((Math.floor(b) % CP) + CP) % CP === i; ctx.beginPath(); ctx.arc(x - (CP - 1) * 9 + i * 18, y + 68, on ? 7 : 5, 0, 7); ctx.fillStyle = on ? (i === 0 ? '#ffd046' : '#fffaf4') : 'rgba(251,241,216,.3)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke(); }
}
function burbuja5(ctx, x, y, w, txt, t, o = {}) {   // globo de diálogo, palabra por palabra (t = segundos desde que abrió)
  const pal = txt.split(' '), act = Math.floor(t * 2.6);
  ctx.save(); ctx.font = '600 30px Outfit'; const lineas = []; let l = ''; pal.forEach(p => { const n = l ? l + ' ' + p : p; if (ctx.measureText(n).width > w - 56 && l) { lineas.push(l); l = p; } else l = n; }); lineas.push(l); ctx.restore();
  const h = 40 + lineas.length * 42;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5; rr(ctx, x, y, w, h, 18); ctx.fillStyle = '#fffaf4'; ctx.fill(); ctx.restore();
  ctx.save(); rr(ctx, x, y, w, h, 18); ctx.lineWidth = 4; ctx.strokeStyle = '#2a1a3a'; ctx.stroke();
  if (o.cola) { const [cx, cy] = o.cola; ctx.beginPath(); ctx.moveTo(cx - 14, y + h - 2); ctx.lineTo(cx + 14, y + h - 2); ctx.lineTo(cx + (o.colaDx || 20), cy); ctx.closePath(); ctx.fillStyle = '#fffaf4'; ctx.fill(); ctx.stroke(); ctx.fillRect(cx - 12, y + h - 6, 24, 5); }
  ctx.font = '600 30px Outfit'; ctx.textBaseline = 'middle'; let k = 0;
  lineas.forEach((ln, i) => { let px = x + 28; ln.split(' ').forEach(p => { ctx.fillStyle = k < act ? '#2a1a3a' : k === act ? '#c23345' : 'rgba(58,36,20,.22)'; ctx.fillText(p, px, y + 40 + i * 42); px += ctx.measureText(p + ' ').width; k++; }); });
  ctx.restore();
  return pal.length / 2.6;
}
// el órgano del día en chiquito (arriba, al centro): un tubo por parada
function hudOrgano5(ctx, actual) {
  const d = diaHoy5(), x0 = LW5 / 2 - 80;
  ctx.save(); rr(ctx, x0 - 18, 14, 196, 76, 14); ctx.fillStyle = 'rgba(28,16,48,.55)'; ctx.fill(); ctx.restore();
  PARADAS5.forEach((id, k) => {
    const hh = [44, 56, 66, 56, 44][k], x = x0 + k * 34, y = 82 - hh, hecho = d.paradas[id], act = id === actual;
    ctx.save(); rr(ctx, x, y, 22, hh, 6); ctx.fillStyle = hecho ? lg(ctx, x, 0, x + 22, 0, [[0, mezcla(COLOR_PARADA5[id], '#ffffff', .35)], [1, COLOR_PARADA5[id]]]) : 'rgba(251,241,216,.18)'; ctx.fill();
    ctx.lineWidth = act ? 3 + Math.sin(RELOJ * 6) : 2.5; ctx.strokeStyle = act ? '#ffd046' : INK; ctx.stroke(); ctx.fillStyle = INK; ctx.fillRect(x + 6, y + hh - 14, 10, 4); ctx.restore();
    if (hecho) { ctx.save(); ctx.globalAlpha = .5 + .2 * Math.sin(RELOJ * 3 + k); brillo(ctx, x + 11, y + 6, 18); ctx.restore(); }
  });
}
function hudCorcheas5(ctx, extra = 0) {
  const m = m2_(); const n = (m ? m.corcheas : 0) + extra, x = LW5 - 300;
  ctx.save(); rr(ctx, x - 50, 22, 104, 52, 26); ctx.fillStyle = '#fffaf4'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#2a1a3a'; ctx.stroke(); ctx.restore();
  sprK(ctx, corcheaDorada(), x - 22, 66, 2.3); titulo5(ctx, String(n), x + 20, 50, 32);
}
// foto del interior del edificio (fondo de la actividad), oscurecida para que la música resalte
const FOTOS5 = {};
function fotoInterior5(id) {
  const a7 = fondoArte7(id); if (a7) return a7;   /* M7: la ilustración del interior */
  if (FOTOS5[id]) return FOTOS5[id];
  const L = LUGARES5[id], c = canvas(LW5, LH5), x = c.getContext('2d');
  if (L) { const pf = GUARDA.perfil(), lu = pf && pf.lugar; L.foto = true; L.entrar({}); L.dibujar(x, 0); L.foto = false; if (pf) pf.lugar = lu; } else { x.fillStyle = '#3a2466'; x.fillRect(0, 0, LW5, LH5); }
  x.fillStyle = lg(x, 0, 0, 0, LH5, [[0, 'rgba(28,16,48,.34)'], [.5, 'rgba(28,16,48,.1)'], [1, 'rgba(28,16,48,.55)']]); x.fillRect(0, 0, LW5, LH5);
  return (FOTOS5[id] = c);
}
// ---------- pads (ritmo sin altura) ----------
const PADS5 = [[230, 632, 380, 150], [670, 632, 380, 150]];
function padEn5(x, y) { return PADS5.findIndex(([px, py, w, h]) => x > px && x < px + w && y > py && y < py + h); }
function dibujarPads5(ctx, P) {
  PADS5.forEach(([x, y, w, h], k) => {
    const g = Math.max(0, 1 - (P.t - (P.padGolpe[k] || -9)) * 5), cx = x + w / 2, cy = y + h / 2 - 6;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6; ctx.beginPath(); ctx.ellipse(cx, cy + 14, w / 2, h / 2 - 8, 0, 0, 7); ctx.fillStyle = '#7a4a2a'; ctx.fill(); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy + 14, w / 2, h / 2 - 8, 0, 0, 7); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, cy - 4 + g * 3, w / 2 - 10, h / 2 - 22, 0, 0, 7); ctx.fillStyle = g ? mezcla('#f3e2bc', '#ffd046', g) : '#f3e2bc'; ctx.fill(); ctx.lineWidth = 4; ctx.stroke();
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * (w / 2 - 6), cy + 10 + Math.sin(a) * (h / 2 - 14), 4, 0, 7); ctx.fillStyle = '#d9a930'; ctx.fill(); }
    ctx.restore();
  });
}
// =====================================================================
//  LA PARADA: una escena por edificio. Corre sus pasos en orden; si el niño termina antes del tiempo de la parada,
//  sigue con «repaso» (variaciones) hasta completarlo. Un paso evaluado PASA con 80 % o más; si no, se repite
//  (con la ayuda que ganó: demostración a los 3 fallos, tocar con él a los 5). Aporrear nunca pasa.
// =====================================================================
const PARADA5 = {};
function crearParada5(id, construir) {
  const P = { id, dia: true, t: 0, fx: fx5(), pulso: pulso5(), pasos: [], k: 0, padGolpe: [], ticPos: [100, 330, 4] };
  P.pulso.puedeSonar = () => { const S = P.paso; if (!S || P.fin) return false; if (P.tarjeta && !(P.finTempo != null && P.t - P.finTempo < 6)) return false;   /* M8: la tarjeta de estrellas entre rondas a tempo no apaga el clic */ if (S.libre) return true;
    if (S.tipo !== 'lectura') return false;                       // oído, encontrar, preguntas: sin clic
    if (S.estado === 'rep') return true;                           // Tic lo muestra con el pulso
    if (S.modo !== 'tempo') return false;                          // «espera» y «a tu ritmo»: sin clic
    return true; };   // M8: a tempo el clic no se apaga (ni entre rondas ni si el niño se queda quieto): es el reloj del momento
  P.reloj = () => P.t;
  P.entrar = () => {
    P.t = 0; P.k = 0; P.finTempo = null; P.tarjeta = null; P.fin = null; P.bono = 0; P.extra = 0; P.fx.lista.length = 0; P.salto = null; P.tropiezo = -9; P.ticCanta = 0;
    TECLADO5.guia = null; TECLADO5.dedos = dedosDia5();
    const d = construir(P); P.cfg = d; P.fondo = fotoInterior5(FONDO_PARADA7[id] || d.fondo || ('b-' + id)); if (d.vidas) P.corazones = d.vidas; P.pasos = d.pasos.slice(); P.repaso = d.repaso || null; P.minimo = d.minimo || 0;
    P.pulso.anclar(.4, tempoDia5()); P.pulso.sonar = true;
    if (SESION5.t0 == null) { SESION5.t0 = RELOJ; if (window.Voz5) { Voz5.empezarCamino(); Voz5.reiniciarSesion(); } } marca5('entra ' + id);
    ticPita5('hola');
    const intro = { patio: 'bach-patio', coro: 'bach-coro', taller: 'bach-taller', conservatorio: 'bach-duelo' }[id];
    if (intro) setTimeout(() => ESC === P && vozPrimeras5('intro-' + id, id === 'conservatorio' ? 9 : 2, intro, { forzar: true }), 5200 / VEL5);
    if (id === 'teatro') setTimeout(() => ESC === P && voz5('bach-teatro-' + (P.cancion || 'jingle'), { forzar: true }), 5200 / VEL5);
    SON5.musica(null);
    P.anuncio = { t0: P.t, dur: 4.6 }; P.presenta = null; P.paso = null;   // mini-anuncio (~5 s): qué parada es y qué vamos a hacer
    setTimeout(() => ESC === P && voz5('anuncio-' + id.replace(/L$/, ''), { forzar: true }), 250 / VEL5);
  };
  function empezar() {
    P.paso = P.pasos[P.k]; P.salto = null;
    const nuevas = notasNuevas5(P.paso); if (nuevas.length) { P.presenta = { lista: nuevas, i: 0, t0: P.t }; presentar(); return; }
    P.paso.iniciar(P);
  }
  function presentar() { const n = P.presenta.lista[P.presenta.i], m = m2_(); m.notasVistas = m.notasVistas || []; if (!m.notasVistas.includes(n)) m.notasVistas.push(n); GUARDA.guardar(); P.presenta.ok = false;
    voz5('nota-' + NOMBRE_NOTA5(n).toLowerCase().replace('#', '-sost'), { forzar: true, hito: true }); [0, 1.1].forEach(d => setTimeout(() => { if (ESC === P) { cantar5(n, .9); SON5.nota(n, 54); } }, (900 + d * 1000) / VEL5)); marca5('nota nueva ' + NOMBRE_NOTA5(n)); }   // Bach la canta (dos veces) y el niño repite
  P.saltarPaso = () => { P.atasco = false; P.avance = P.t; P.sg = null; if (P.fin) { P.fin.t = Math.min(P.fin.t, P.t - 3.5); P.fin.ido = false; return; }
    P.tarjeta = null; P.presenta = null; P.anuncio = null; if (!P.paso) return empezar(); if (P.paso.eval && !P.paso.reintentado) { P.paso.reintentado = true; P.paso.listo = false; P.paso.iniciar(P); } else { P.paso.listo = false; siguiente(); } };
  P.saltarPresenta = () => { const R = P.presenta; if (!R) return; R.i++; R.t0 = P.t; if (R.i >= R.lista.length) { P.presenta = null; P.paso.iniciar(P); } else presentar(); };
  function siguiente() {
    P.k++; if (P.k < P.pasos.length) return empezar();
    if (P.repaso && P.t < P.minimo) { P.pasos.push(P.repaso(P.extra++)); return empezar(); }
    terminar();
  }
  function revisar() {
    const S = P.paso; if (!S || !S.listo || P.tarjeta || P.fin) return;
    if (!S.eval) { S.listo = false; return siguiente(); }
    S.listo = false;
    const e = estrellas5(S.prec), pasa = S.prec >= .8;
    S.mejor = Math.max(S.mejor == null ? 0 : S.mejor, S.prec);
    estadistica5(S);
    if ((P.cfg.duelo || P.cfg.vidas) && !pasa) { P.corazones--; P.fx.estallar(276, 112, '#ff5a7a', 16); if (P.corazones <= 0) { P.fin = { t: P.t, e: 0, c: 0, perdio: true }; P.pulso.sonar = false; if (P.cfg.duelo && paradasMision5().includes('conservatorio')) { diaHoy5().paradas.conservatorio = { e: 0, c: 0, t: Math.round(P.t), perdio: true }; GUARDA.guardar(); } marca5(P.cfg.duelo ? 'duelo perdido' : P.id + ' perdido'); voz5('bach-duelo-pierde', { hito: true }); return; } }
    if (pasa && S.o.clave && S.prec >= .9) { const m = m2_(), f = claveDominio5(), L = m.dominio[S.o.clave] || (m.dominio[S.o.clave] = []); if (!L.includes(f)) { L.push(f); if (L.length === 2) { voz5('rx-dominado', { hito: true }); marca5('dominado ' + S.o.clave); } } GUARDA.guardar(); }
    if (S.prec >= .999 && S.eval) { ticPita5('feliz'); voz5('rx-fantastico'); } else if (pasa) voz5('rx-bien');
    if (P.cfg.duelo && !pasa) voz5('bach-duelo-corazon', { forzar: true });
    if (pasa && S.o.cancion && e === 3 && !P.bono) P.bono = 5;   // la canción entera con 3 estrellas: 5 corcheas
    P.tarjeta = { t: P.t, e, pasa, prec: S.prec, corto: !!S.o.corto, dur: S.o.corto ? 1.3 : 2.3 };
    for (let i = 0; i < e; i++) setTimeout(() => { try { Snd.estrella(i); } catch (er) { } }, (300 + i * 260) / VEL5);
    marca5(id + ' paso ' + P.k + ' ' + S.modo + ' ' + Math.round(S.prec * 100) + '%' + (pasa ? '' : ' (otra vez)'));
  }
  function terminar() {
    if (P.cfg.libre) { const m = m2_(), c = P.cfg.premio || 2; m.corcheas += c; GUARDA.guardar(); P.fin = { t: P.t, e: 3, c, gano: true }; P.pulso.sonar = false; marca5(id + ' ganado'); if (P.cfg.alGanar) P.cfg.alGanar(P); try { Snd.desbloqueo(); } catch (er) { } return; }
    if (P.cfg.duelo) { const m = m2_(); m.insignias = m.insignias || {}; m.llaves = m.llaves || {}; const n = m.mision || 0; if (n >= 13) { m.insignias.estrella = m.insignias.estrella || hoy5(); m.llaves.enero = true; m.premioDuelo = 'estrella'; } else { m.insignias.pastor = m.insignias.pastor || hoy5(); m.llaves.fa = m.llaves.fa || n + 1; m.premioDuelo = 'fa'; } if (paradasMision5().includes('conservatorio')) diaHoy5().paradas.conservatorio = { e: 3, c: 0, t: Math.round(P.t) }; GUARDA.guardar(); P.fin = { t: P.t, e: 3, c: 0, gano: true }; P.pulso.sonar = false; marca5('duelo ganado'); voz5('bach-duelo-gana', { hito: true }); return; }
    const evals = P.pasos.filter(s => s.eval && s.mejor != null);
    const e = P.cfg.estrellas ? P.cfg.estrellas(P) : estrellas5(evals.reduce((a, s) => a + s.mejor, 0) / Math.max(1, evals.length));
    const c = Math.min(3, P.cfg.corcheas ? P.cfg.corcheas(P) : e) + (P.bono || 0);
    const d = diaHoy5(), m = m2_(); d.paradas[id] = { e, c, t: Math.round(P.t) }; m.corcheas += c; GUARDA.guardar();
    P.fin = { t: P.t, e, c }; P.pulso.sonar = false; TECLADO5.guia = null;
    try { Snd.desbloqueo(); } catch (er) { }
    for (let i = 0; i < c; i++) setTimeout(() => P.fx.vuela(LW5 / 2 + (i - c / 2) * 40, 470, LW5 - 322, 48, (cx, x, y) => sprK(cx, corcheaDorada(), x, y + 20, 3), .9, () => { try { Snd.boton(); } catch (er) { } }), (900 + i * 160) / VEL5);
    marca5('fin ' + id + ' ' + e + '★ +' + c);
  }
  P.dibujar = (ctx, dtR) => {
    const dt = pausado5() ? 0 : dtR;
    if (dt) {
      P.t += dt; P.pulso.paso(P.t); { const d = diaHoy5(); d.seg = (d.seg || 0) + dt; const g = diaLog5(); g.seg = (g.seg || 0) + dt; }
      if (P.anuncio && P.t - P.anuncio.t0 > P.anuncio.dur) { P.anuncio = null; empezar(); }
      if (P.presenta && P.t - P.presenta.t0 > (P.presenta.ok ? .9 : 7)) P.saltarPresenta();
      if (P.paso && !P.tarjeta && !P.fin && !P.anuncio && !P.presenta) P.paso.paso(P, dt);
      revisar();
      // M7b · vigilante: si el paso no cambia en mucho rato y nadie toca hace 8 s → «¡Toca para seguir!»; 30 s más sin tocar → sigue solo
      { const sg = P.k + '|' + !!P.tarjeta + '|' + !!P.fin + '|' + !!P.anuncio + '|' + (P.presenta ? P.presenta.i : '') + '|' + ((P.paso && (P.paso.estado || P.paso.fase)) || '');
        if (sg !== P.sg) { P.sg = sg; P.avance = P.t; P.atasco = false; }
        const lim = P.fin ? 20 : P.paso && P.paso.eval ? 240 : 150, quieto = performance.now() - ULTIMA_ENTRADA5 > 8000;
        if (P.t - P.avance > lim && quieto) P.atasco = true; else if (!quieto) P.atasco = false;
        if (P.atasco && P.t - P.avance > lim + 30) P.saltarPaso(); }
      if (P.tarjeta && P.t - P.tarjeta.t > P.tarjeta.dur) { const tj = P.tarjeta; P.tarjeta = null; if (tj.pasa) siguiente(); else P.paso.iniciar(P); }
      if (P.fin && P.t - P.fin.t > 3.4 && !P.fin.ido) { P.fin.ido = true; if (P.cfg.libre) volverDeModo5(P); else if (P.cfg.duelo) { const B = LUGARES5.belen; if (P.fin.gano) irA(ESCENA_PREMIO5, { tipo: 'fundido' }); else if (siguienteParada5() === null && paradasMision5().includes('conservatorio') && !diaHoy5().completo) irA(ESCENA_ORGANO, { tipo: 'fundido', dur: .9 }); else { B.auto = false; B.extraHud = null; irA(B, { tipo: 'iris', desde: puertaDe5('conservatorio').puerta.slice() }); } } else seguirSesion5(id); }
    }
    ctx.drawImage(P.fondo, 0, 0);
    if (P.cfg.decor) P.cfg.decor(P, ctx);
    const capa = (f, n) => { ctx.save(); try { f(); } catch (e) { (window.__errores5 = window.__errores5 || []).push(n + ': ' + String(e && e.stack || e).slice(0, 300)); } ctx.restore(); };   // M7c: si una capa falla, el resto (HUD y piano) se sigue pintando
    capa(() => { if (P.paso && P.paso.dibujar && !P.anuncio && !P.presenta) P.paso.dibujar(P, ctx, dt); }, 'paso');
    capa(() => { if (!P.sinTic) dibujarTic5(ctx, P, P.ticPos[0], P.ticPos[1], P.ticPos[2]); }, 'tic');
    // barra de arriba: nombre, órgano del día, corcheas, pausa y papás
    capa(() => {
    cinta5(ctx, NOMBRE_PARADA5[id], 44, 50, Math.max(220, NOMBRE_PARADA5[id].length * 15 + 60));
    if (!P.cfg.duelo && !P.cfg.libre) hudOrgano5(ctx, id); if (!P.cfg.duelo) hudCorcheas5(ctx);
    if (P.cfg.vidas) for (let i = 0; i < P.cfg.vidas; i++) corazon(ctx, 230 + i * 46, 112, 15, i < P.corazones ? '#ff5a7a' : 'rgba(251,241,216,.3)');
    botonRedondo5(ctx, LW5 - 50, 48, 'pausa'); botonRedondo5(ctx, LW5 - 122, 48, 'ajustes');
    }, 'hud');
    capa(() => { if (P.paso && P.paso.pads) dibujarPads5(ctx, P); else dibujarTeclado5(ctx); }, 'teclado');
    capa(() => P.fx.dibujar(ctx, dt), 'fx');
    if (P.anuncio) dibujarAnuncio5(ctx, P);
    if (P.presenta) dibujarNotaNueva5(ctx, P);
    if (P.otraVez && typeof dibujarOtraVez5 === 'function') dibujarOtraVez5(ctx, P);
    if (P.tarjeta) dibujarTarjeta5(ctx, P, P.tarjeta);
    if (P.fin) dibujarFinParada5(ctx, P);
  };
  P.tocar = (x, y) => {
    if (Math.hypot(x - (LW5 - 50), y - 48) < 34) { MENU5.abrir('pausa'); return; }
    if (Math.hypot(x - (LW5 - 122), y - 48) < 34) { MENU5.abrir('papas'); return; }
    if (P.anuncio && P.t - P.anuncio.t0 > 1.2 && teclaEn(x, y) == null) { P.anuncio.dur = 0; return; }
    if (P.presenta && P.t - P.presenta.t0 > 1.5 && teclaEn(x, y) == null) { P.saltarPresenta(); return; }
    if (P.paso && P.paso.pads) { const k = padEn5(x, y); if (k >= 0) { P.padGolpe[k] = P.t; notaEntrante(k ? 64 : 60, 100, 'pantalla'); } return; }
    const n = teclaEn(x, y); if (n != null) { notaEntrante(n, 90, 'pantalla'); return; }
    if (P.paso && P.paso.tocar) P.paso.tocar(P, x, y);
  };
  P.nota = (n, t, fuente) => {
    if (P.presenta) { const q = P.presenta.lista[P.presenta.i]; if (n === q && !P.presenta.ok) { P.presenta.ok = true; P.presenta.t0 = P.t; SON5.acorde(n); P.fx.estallar(LW5 / 2 + 220, 520, COLOR_NOTA5(n), 22); voz5('nota-esa', { forzar: true }); return 'ok'; } return null; }
    if (P.anuncio) return null;
    if (P.paso && P.paso.pads && fuente === 'midi') P.padGolpe[n % 2] = P.t;
    if (P.tarjeta || P.fin || !P.paso || !P.paso.nota) return P.paso && P.paso.pads ? (SON5.palma(.5), 'pad') : null;
    return P.paso.nota(P, n, t, fuente);
  };
  P.irPaso = k => { P.k = k; P.tarjeta = null; P.fin = null; empezar(); };   // pruebas y capturas
  P.objetivo = () => { if (P.presenta && P.t - P.presenta.t0 > 1.6 && !P.presenta.ok) return { id: 'pres' + P.k + P.presenta.i, n: P.presenta.lista[P.presenta.i], t: P.presenta.t0 + 1.6, reaccion: true }; return (P.tarjeta || P.fin || P.anuncio || P.presenta || !P.paso || !P.paso.objetivo) ? null : P.paso.objetivo(P); };
  PARADA5[id] = P;
  return P;
}
function dibujarTarjeta5(ctx, P, tj) {
  const q = Math.min(1, (P.t - tj.t) * 5);
  if (tj.corto) {   // en el coro: estrellitas sobre el personaje
    for (let i = 0; i < 3; i++) { const on = i < tj.e && P.t - tj.t > .2 + i * .2; estrella(ctx, 1100 + i * 44, 168, on ? 18 : 13, on ? '#ffd046' : 'rgba(251,241,216,.55)'); }
    if (!tj.pasa) { ctx.save(); ctx.globalAlpha = q; titulo5(ctx, '↻', 1166, 214, 46, '#fffaf4', { borde: 6, bordeC: '#2a1a3a' }); ctx.restore(); }
    return;
  }
  ctx.save(); ctx.fillStyle = 'rgba(28,16,48,' + .35 * q + ')'; ctx.fillRect(0, 100, LW5, 500); ctx.restore();
  const w = 440, h = 210, x = LW5 / 2 - w / 2, y = 250 - (1 - q) * 30;
  pergamino5(ctx, x, y, w, h, q);
  for (let i = 0; i < 3; i++) { const ti = P.t - tj.t - .25 - i * .26, on = i < tj.e && ti > 0, s = on ? 34 + Math.max(0, 1 - ti * 4) * 18 : 26; estrella(ctx, x + w / 2 + (i - 1) * 96, y + 82, s, on ? '#ffd046' : '#e2d2b0'); }
  if (tj.prec >= .999) { const tf = textoDeVoz5('rx-fantastico', '¡Fantástico!'); habla5(tf); titulo5(ctx, tf, x + w / 2, y + 160, tf.length > 14 ? 30 : 40, '#c23345'); }
  else if (!tj.pasa) { ctx.save(); ctx.translate(x + w / 2, y + 160); ctx.rotate(-(P.t - tj.t) * 3); ctx.beginPath(); ctx.arc(0, 0, 22, .4, Math.PI * 1.7); ctx.lineWidth = 7; ctx.strokeStyle = '#2a1a3a'; ctx.stroke(); ctx.beginPath(); ctx.moveTo(22, -2); ctx.lineTo(32, 14); ctx.lineTo(12, 12); ctx.closePath(); ctx.fillStyle = '#2a1a3a'; ctx.fill(); ctx.restore(); }
  else { const x2 = x + w / 2; sprK(ctx, heroe5('feliz'), x2, y + 196, 2.4); }
}
function dibujarFinParada5(ctx, P) {
  const F = P.fin, t = P.t - F.t, q = Math.min(1, t * 3), col = COLOR_PARADA5[P.id];
  if (P.cfg.duelo || P.cfg.libre) { ctx.save(); ctx.fillStyle = 'rgba(28,16,48,' + .5 * q + ')'; ctx.fillRect(0, 0, LW5, LH5); ctx.restore();
    if (F.gano && P.cfg.libre) { rayosLuz5(ctx, LW5 / 2, 300, t); for (let i = 0; i < F.c; i++) sprK(ctx, corcheaDorada(), LW5 / 2 + (i - (F.c - 1) / 2) * 60, 340 - Math.abs(Math.sin(t * 4 + i)) * 20, 5); titulo5(ctx, '+' + F.c, LW5 / 2, 420, 50, '#fffaf4', { borde: 8, bordeC: '#2a1a3a' }); }
    else if (F.gano) { rayosLuz5(ctx, LW5 / 2, 300, t); insigniaEstrella5(ctx, LW5 / 2, 300, 30 + Math.min(1, t * 2) * 50, t); }
    else { for (let i = 0; i < 3; i++) corazon(ctx, LW5 / 2 - 60 + i * 60, 300, 26, 'rgba(251,241,216,.3)'); ctx.save(); ctx.translate(LW5 / 2, 420); ctx.rotate(-t * 3); ctx.beginPath(); ctx.arc(0, 0, 30, .4, Math.PI * 1.7); ctx.lineWidth = 9; ctx.strokeStyle = '#fffaf4'; ctx.stroke(); ctx.restore(); }
    return; }
  ctx.save(); ctx.fillStyle = 'rgba(28,16,48,' + .6 * q + ')'; ctx.fillRect(0, 0, LW5, LH5); ctx.restore();
  rayosLuz5(ctx, LW5 / 2, 300, t);
  // el tubo de esta parada sube al órgano
  const hh = 240, x = LW5 / 2 - 34, y = 420 - hh * Math.min(1, t * 1.4);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, LW5, 470); ctx.clip(); rr(ctx, x, y, 68, hh, 14); ctx.fillStyle = lg(ctx, x, 0, x + 68, 0, [[0, mezcla(col, '#ffffff', .45)], [.5, col], [1, mezcla(col, '#2a1a3a', .3)]]); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = INK; rr(ctx, x + 16, y + hh - 70, 36, 14, 7); ctx.fill(); ctx.restore();
  titulo5(ctx, NOMBRE_PARADA5[P.id], LW5 / 2, 510, 46, '#fffaf4', { borde: 8, bordeC: '#2a1a3a' });
  for (let i = 0; i < 3; i++) { const on = i < F.e && t > .5 + i * .25; estrella(ctx, LW5 / 2 + (i - 1) * 80, 574, on ? 30 : 22, on ? '#ffd046' : 'rgba(251,241,216,.4)'); }
}
// ---------- de una parada a la siguiente: la ciudad pasa animada (el personaje camina solo) ----------
function puertaDe5(id) { const B = LUGARES5.belen; return B && B.objetos.find(o => o.lugar === id || o.entra === 'b-' + id); }
function paseo5(desde, hacia, op = {}) {
  const B = LUGARES5.belen, o1 = desde && puertaDe5(desde), o2 = puertaDe5(hacia);
  B.auto = true; B.velAuto = 7; B.extraHud = () => hudOrgano5(cx5, hacia); B.panel = null;
  const caminar = () => { B.ir(o2.puerta, () => { B.jugador.dir = 'arriba'; setTimeout(() => { B.auto = false; B.velAuto = 0; B.extraHud = null; irA(PARADA5[hacia], B.irisEn(o2)); }, 250 / VEL5); }); };
  const m = m2_(), primera = !m.recorridoVisto;
  B.alEntrar = desde || op.sinRecorrido ? caminar : () => {
    if (primera) { m.recorridoVisto = true; GUARDA.guardar(); voz5('bach-recorrido', { hito: true }); B.alTurno = o => voz5('lugar-' + (o.lugar || ''), { hito: true, prioridad: 6 }); B.recorrido(['establo', 'patio', 'coro', 'salon', 'teatro', 'taller']   /* M8: el primer día solo los lugares del día; los demás se presentan cuando se abren */.map(id => B.objetos.find(o => o.lugar === id)).filter(Boolean), caminar, 1.7); }
    else { B.recorrido([B.objetos.find(o => o.lugar === 'establo'), o2].filter(Boolean), caminar, 2.5); }   // después: 5 s
    B.tour.saltable = !primera; };
  marca5('paseo ' + (desde || 'puerta') + ' → ' + hacia);
  irA(B, { tipo: 'fundido', desde: o1 ? o1.puerta.slice() : (op.sinRecorrido ? [B.jugador.i, B.jugador.j] : null), dir: 'abajo', dur: .8 });
}
function seguirSesion5(desde) { const sig = siguienteParada5(); if (sig) paseo5(desde, sig); else irA(ESCENA_ORGANO, { tipo: 'fundido', dur: .9 }); }
function empezarDia5(x, y) {
  SON5.iniciar(); try { Entrada.iniciarMidi(); } catch (e) { }
  const m = m2_(); SESION5.t0 = null; SESION5.tFin = null; SESION5.log = [];
  if (!m.primerDia) return irA(ESCENA_CARTA, { tipo: 'iris', x, y });
  const sig = siguienteParada5(), hoyHecha = diaLog5().completo, enCurso = sig && Object.keys(diaHoy5().paradas).length > 0;
  if (sig && (!hoyHecha || enCurso)) return irA(PARADA5[sig], { tipo: 'iris', x, y });
  const B = LUGARES5.belen; B.auto = false; B.extraHud = null; B.alEntrar = null; irA(B, { tipo: 'iris', x, y, desde: puertaDe5('salon').puerta.slice() });
}
// =====================================================================
//  PASO DE LECTURA: bloques de colores (el personaje camina sobre ellos) + las figuras en el pentagrama + sílabas.
//  modo: 'escucha' (suena primero, el símbolo aparece al sonar) · 'espera' (el juego espera la nota) ·
//        'ritmo' (a tu ritmo: el pulso suena, la figura dura lo que dura; tocar mientras dura = nota extra) ·
//        'tempo' (con cuenta de 4; ventana ±0,22 s).  o: {bpm, pads, unaTecla, introCanto, veces, base, clave, cancion, corto}
// =====================================================================
function pasoLectura5(notasIn, modo, o = {}) {
  const notas = notasIn.map(x => ({ n: x.n === 0 ? 0 : (o.unaTecla || x.n), d: x.d })), CP = o.compas || 4, AN = o.anac || 0; let bpm = o.sinTope ? o.bpm : tempo5(o.bpm); o.bpm = bpm; const bpm0 = bpm;
  const S = { tipo: 'lectura', notas, modo, o, eval: modo !== 'escucha', pads: !!o.pads, apoyo: 0, fallosTot: 0, mejor: null, intento: 0 };
  let acc = 0; S.ini = notas.map(x => { const b = acc; acc += x.d; return b; }); S.total = acc;
  const B = () => 60 / bpm;
  function reiniciar(P) { S.bandaI = null; S.grab = []; S.cur = 0; S.ok = 0; S.mal = 0; S.fallos = 0; S.hit = notas.map(x => x.n === 0 ? 2 : 0); S.hold = -9; S.ult = -9; S.ultErr = -9; S.sacude = null; S.compasBase = -1; S.cantado = -1; S.reinicios = (S.reinicios || 0) + 1; S.desdeCur = P.t; }
  S.iniciar = P => {
    S.intento++; S.listo = false; S.prec = null; S.rep = null; S.demoHecho = false; S.estado = 'nada'; reiniciar(P);
    // M6: repetir NUNCA igual: si no salió, Tic lo muestra otra vez más despacito (y se anuncia); la primera vez, la variación de este paso
    if (S.intento > 1 && modo !== 'escucha') { bpm = Math.max(40, bpm0 - 6 * (1 + (S.intento - 2) % 3)); /* cada intento cambia: nunca dos iguales seguidos */ avisoOtraVez5(P, 'Mira, más despacito', 'ay-lento'); }
    else if (S.intento === 1 && o.var && typeof avisoOtraVez5 === 'function') avisoOtraVez5(P, o.var.txt, 'otra-vez-' + o.var.id);
    if (S.eval && typeof contarRepeticion5 === 'function') contarRepeticion5(notas.map(x => x.n + ':' + x.d).join(' ') + '|' + bpm + '|' + (o.var ? o.var.id : '') + (S.pads ? '|p' : ''));
    if (S.intento > 1 && modo !== 'escucha') { S.visto = notas.map(() => true); reproducir(P, 1, false, () => arrancar(P)); return; }
    S.visto = notas.map(() => modo !== 'escucha' && !(o.introCanto && S.intento === 1));
    if (S.intento === 1 && modo !== 'escucha') { const k = S.pads ? 'pads' : o.cancion || (o.base && o.acordes && notas.length > 12) ? 'banda' : modo; const g = { espera: 'bach-espera', ritmo: 'bach-ritmo', tempo: 'bach-tempo', pads: 'bach-pads', banda: 'bach-banda' }[k]; if (g && !o.corto) vozPrimeras5('esc-' + k + '-' + hoy5(), 1, g, { forzar: true }); }
    if (modo === 'escucha') reproducir(P, o.veces || 2, false, () => { S.listo = true; });
    else if (o.introCanto && S.intento === 1) reproducir(P, o.introCanto, true, () => arrancar(P));
    else arrancar(P);
  };
  // Tic (o Bach) toca o canta el pasaje: cada nota suena y entonces aparece su bloque
  function reproducir(P, veces, canto, alFin) {
    const nb = Math.ceil(P.pulso.beat(P.t) + .15); P.pulso.anclar(P.pulso.tDe(nb), bpm, CP);
    const ent = AN ? CP - AN : 0, len = Math.ceil((S.total + ent + 1) / CP) * CP, ev = [];
    for (let v = 0; v < veces; v++) S.ini.forEach((b0, k) => ev.push({ t: P.pulso.t0 + (v * len + ent + b0) * B(), k, v }));
    S.rep = { ev, i: 0, canto, alFin, tFin: P.pulso.t0 + ((veces - 1) * len + ent + S.total + .6) * B(), veces };
    S.estado = 'rep';
  }
  function avanzarRep(P) {
    const R = S.rep;
    while (R.i < R.ev.length && P.t >= R.ev[R.i].t) {
      const e = R.ev[R.i++], x = notas[e.k], dur = x.d * B() * .9;
      if (x.n === 0) { /* silencio: Tic hace el gesto */ } else if (S.pads) SON5.palma(.8); else if (o.voz === 'flauta') SON5.flauta(x.n, dur); else if (R.canto) SON5.ticCanta(x.n, dur); else SON5.nota(x.n, 78);
      if (x.n === 0) { } else if (!S.pads) pista5(x.n, dur); else P.padGolpe[e.k % 2] = P.t;
      S.visto[e.k] = true; S.brilla = { k: e.k, t: P.t }; P.ticCanta = P.t + dur; R.v = e.v;
    }
    if (R.i >= R.ev.length && P.t >= R.tFin) { S.rep = null; R.alFin(); }
  }
  function arrancar(P) {
    S.estado = 'toca'; S.desdeCur = P.t;
    if (modo === 'tempo') { const seguida = P.finTempo != null && P.t - P.finTempo < 6 && Math.abs(P.pulso.bpm - bpm) < 1; const nb = Math.ceil(P.pulso.beat(P.t) + .25); P.pulso.anclar(P.pulso.tDe(nb), bpm, CP); S.tInicio = P.pulso.t0 + (CP - AN) * B(); P.pulso.contar(0, CP - AN, CP, seguida); }   // M8: si la ronda anterior acaba de terminar al mismo tempo, la cuenta no se vuelve a decir (el clic sigue)   // cuenta de un compás; la anacrusa entra en su tiempo
  }
  function terminar(P) { if (S.estado === 'fin') return; S.estado = 'fin'; if (modo === 'tempo') P.finTempo = P.t; S.prec = S.ok / Math.max(1, S.ok + S.mal); S.listo = true;
    // el informe guarda cómo tocó la canción (o el pedazo): el mejor intento del día
    if (o.clave && S.grab && S.grab.length && S.prec >= .8) { const m = m2_(); m.grab = m.grab || {}; const g = m.grab[o.clave]; if (!g || g.fecha !== hoy5() || g.prec <= S.prec) m.grab[o.clave] = { fecha: hoy5(), prec: +S.prec.toFixed(2), bpm, titulo: o.titulo || '', notas: S.grab.slice() }; } }
  function demostrar(P) { ticPita5('ayuda'); voz5('ay-demuestra'); S.demoHecho = true; S.apoyo = Math.max(S.apoyo, 1); reproducir(P, 1, false, () => { reiniciar(P); arrancar(P); }); }
  function fallo(P, k, extra) {
    S.mal++; S.fallos++; S.fallosTot++; S.ultErr = P.t;
    const kk = Math.max(0, Math.min(notas.length - 1, k));
    if (!S.pads && notas[kk].n) pista5(notas[kk].n, 1.3);
    S.sacude = { k: kk, t: P.t }; P.tropiezo = P.t; const [x, y] = pie5(P, S); P.fx.polvo(x, y);
    if (S.fallosTot >= 5) { if (S.apoyo < 2) voz5('ay-juntos'); S.apoyo = 2; }   // a los 5: Tic toca con él
    if (S.fallos >= 3 && !S.demoHecho) demostrar(P);          // a los 3: la tablet demuestra
  }
  function acierto(P, k, t) {
    S.hit[k] = 1; S.ok++; const x = notas[k];
    SON5.acorde(x.n);
    const [bx, by, bw] = bloque5(S, k); P.fx.estallar(bx + bw / 2, by + 16, S.pads ? '#c98a52' : COLOR_NOTA5(x.n), 20);
    P.salto = { de: pieX5(S, k), a: pieX5(S, k + 1), t: P.t };
    if (modo !== 'tempo') { S.cur = k + 1; S.hold = modo === 'ritmo' ? t + x.d * B() - .14 : -9; S.desdeCur = Math.max(P.t, S.hold); if (modo === 'espera' && S.cur >= notas.length) S.finEn = P.t + .45; }
  }
  S.paso = (P, dt) => {
    if (S.rep) return avanzarRep(P);
    if (S.estado !== 'toca') return;
    const b = B();
    if (o.base && modo === 'tempo') { const c = Math.floor((P.t - S.tInicio - AN * b) / (CP * b) + 1e-6); if (c > S.compasBase && c >= 0 && P.t < S.tInicio + S.total * b) { S.compasBase = c; SON5.base(o.acordes ? o.acordes[c % o.acordes.length] : 0, CP, bpm); } }
    if (o.banda && modo === 'tempo') { if (S.bandaI == null) { S.bandaI = 0; let b0 = 0; S.bandaEv = o.banda.map(x => { const e = { t: S.tInicio + (b0 - (o.anacBanda || 0)) * b, n: x.n, d: x.d }; b0 += x.d; return e; }); } while (S.bandaI < S.bandaEv.length && P.t >= S.bandaEv[S.bandaI].t) { const e = S.bandaEv[S.bandaI++]; SON5.flauta(e.n, e.d * b * .9); P.ticCanta = P.t + .2; } }
    if (modo === 'tempo') {
      const win = ventana5(S);
      for (let k = 0; k < notas.length; k++) {
        const tk = S.tInicio + S.ini[k] * b;
        if (S.apoyo >= 2 && S.cantado < k && P.t >= tk - .02) { S.cantado = k; if (!S.pads) SON5.ticCanta(notas[k].n, notas[k].d * b * .8); else SON5.palma(.4); P.ticCanta = P.t + .3; }
        if (S.apoyo >= 2 && !S.pads && S.hit[k] === 0 && P.t > tk - .5 && P.t < tk) pista5(notas[k].n, .5);
        if (S.hit[k] === 0 && P.t > tk + win) { S.hit[k] = -1; fallo(P, k); if (S.estado !== 'toca') return; P.salto = { de: pieX5(S, k), a: pieX5(S, k + 1), t: P.t }; }
      }
      S.cur = S.hit.findIndex(h => h === 0); if (S.cur < 0) S.cur = notas.length;
      if (P.t > S.tInicio + S.total * b + .25) terminar(P);
      return;
    }
    // en espera / a tu ritmo, el silencio corre solo: dura lo que dura y no se toca
    while (S.cur < notas.length && notas[S.cur].n === 0 && P.t >= S.hold) { S.hold = Math.max(P.t, S.hold) + notas[S.cur].d * b - .1; S.brilla = { k: S.cur, t: P.t }; P.salto = { de: pieX5(S, S.cur), a: pieX5(S, S.cur + 1), t: P.t }; S.cur++; S.desdeCur = S.hold; if (S.cur >= notas.length) S.finEn = S.hold + .2; }
    if (S.apoyo >= 2 && S.cur < notas.length && S.cantado !== S.cur && P.t >= S.desdeCur + .1) { S.cantado = S.cur; if (!S.pads) { SON5.ticCanta(notas[S.cur].n, .45); pista5(notas[S.cur].n, 3); } P.ticCanta = P.t + .4; }
    if (modo === 'ritmo' && S.cur >= notas.length && P.t >= S.hold) terminar(P);
    if (modo !== 'tempo' && S.finEn && P.t >= S.finEn) { S.finEn = 0; terminar(P); }
  };
  S.nota = (P, n, t) => {
    if (S.pads) SON5.palma(.8);
    const res = v => S.pads ? 'pad' : v;
    if (S.estado !== 'toca') return res(null);
    const b = B(), junto = t - S.ult < .1; S.ult = t;   // dos notas casi juntas = aporreo
    const vale = k => S.pads || n === notas[k].n || (notas[k].n > 0 && n % 12 === notas[k].n % 12);   // M7c: cualquier octava vale (el piano de casa puede estar corrido)
    if (modo === 'tempo' && !S.pads && S.grab && S.grab.length < 120) S.grab.push([n, +(t - S.tInicio).toFixed(3)]);
    if (modo === 'tempo') {
      if (t < S.tInicio - .35) return res(null);       // durante la cuenta: libre
      const win = ventana5(S); let best = -1, bd = 9;
      for (let k = 0; k < notas.length; k++) if (S.hit[k] === 0) { const d = Math.abs(t - (S.tInicio + S.ini[k] * b)); if (d <= win && d < bd) { bd = d; best = k; } }
      if (best >= 0 && vale(best) && !junto) { acierto(P, best, t); return res('ok'); }
      fallo(P, best >= 0 ? best : S.cur, best < 0); return res('error');
    }
    if (S.cur >= notas.length || t < S.hold || notas[S.cur].n === 0 || junto || t - S.ultErr < .25 || !vale(S.cur)) { fallo(P, Math.min(S.cur, notas.length - 1)); return res('error'); }
    acierto(P, S.cur, t); return res('ok');
  };
  S.objetivo = P => {
    if (S.estado !== 'toca' || S.listo) return null;
    const b = B(), id = S.intento + ':' + S.reinicios + ':' + S.mal + ':';
    if (modo === 'tempo') { const k = S.hit.findIndex(h => h === 0); if (k < 0) return null; return { id: 'T' + id + k, n: notas[k].n, t: S.tInicio + S.ini[k] * b, tempo: true, pad: S.pads }; }
    if (S.cur >= notas.length || notas[S.cur].n === 0) return null;
    return { id: 'E' + id + S.cur, n: notas[S.cur].n, t: Math.max(S.desdeCur, S.ultErr + .3, S.hold + .14), reaccion: true, pad: S.pads };
  };
  S.dibujar = (P, ctx) => dibujarLectura5(P, S, ctx);
  return S;
}
// geometría del panel de lectura
const PANEL5 = { x: 196, y: 128, w: 968, h: 452 };
// si la canción no cabe con bloques legibles (≥ 50 px por pulso), el pergamino se DESPLAZA: lo que se toca queda a un tercio
function escalaLectura5(S) { const a = PANEL5.x + 126, disp = PANEL5.x + PANEL5.w - 46 - a; if (S.total * 50 > disp) { const pxb = 50, sc = Math.max(0, Math.min(S.total * pxb - disp, (S.scrollBeat || 0) * pxb - disp * .3)); return { x0: a - sc, pxb, desliza: true }; } const pxb = Math.min(118, disp / S.total); return { x0: a + Math.max(0, (disp - S.total * pxb) / 2), pxb }; }
function bloque5(S, k) { const { x0, pxb } = escalaLectura5(S); return [x0 + S.ini[k] * pxb + 3, 300, S.notas[k].d * pxb - 6]; }
function pieX5(S, k) { const { x0, pxb } = escalaLectura5(S); if (k >= S.notas.length) return x0 + S.total * pxb + 22; return x0 + S.ini[k] * pxb + Math.min(30, S.notas[k].d * pxb / 2); }
function pie5(P, S) { let x = pieX5(S, Math.min(S.cur || 0, S.notas.length)); if (P.salto) { const q = Math.min(1, (P.t - P.salto.t) / .24); x = P.salto.de + (P.salto.a - P.salto.de) * q; } return [x, 300]; }
function dibujarLectura5(P, S, ctx) {
  const nivel = S.o.lectura != null ? S.o.lectura : nivelLectura5();
  { const bq = 60 / (S.o.bpm || BPM5), obj = S.modo === 'tempo' && S.tInicio != null ? Math.max(0, (P.t - S.tInicio) / bq) : (S.ini[Math.min(S.cur || 0, S.notas.length - 1)] || 0); S.scrollBeat = S.scrollBeat == null ? obj : S.scrollBeat + (obj - S.scrollBeat) * .15; }
  const { x: X, y: Y, w: Wd, h: Hd } = PANEL5, { x0, pxb } = escalaLectura5(S), b = 60 / (S.o.bpm || BPM5), modo = S.modo;
  pergamino5(ctx, X, Y, Wd, Hd);
  // la escalera de lo nuevo (espera → a tu ritmo → a tempo)
  if (modo !== 'escucha' && !S.o.corto && !(S.o.titulo && S.o.titulo.length > 22)) { const et = [['espera', 'espera'], ['ritmo', 'a tu ritmo'], ['tempo', 'a tempo']]; let px = X + 34; ctx.save(); ctx.font = '600 21px Outfit'; ctx.textBaseline = 'middle';
    et.forEach(([m, t], i) => { const on = m === modo; ctx.fillStyle = on ? '#c23345' : 'rgba(58,36,20,.4)'; ctx.font = (on ? '700 ' : '500 ') + '21px Outfit'; ctx.fillText(t, px, Y + 36); px += ctx.measureText(t).width + 12; if (i < 2) { ctx.fillStyle = 'rgba(58,36,20,.35)'; ctx.fillText('›', px, Y + 36); px += 22; } }); ctx.restore(); }
  if (S.o.titulo) titulo5(ctx, S.o.titulo, X + Wd / 2, Y + 38, 30, '#7f3fc8');
  if (S.pads) { ctx.save(); ctx.font = '700 21px Outfit'; ctx.fillStyle = '#7a4a2a'; ctx.textAlign = 'left'; ctx.fillText('ritmo', X + Wd - 300, Y + 37); ctx.restore(); }
  // contador de aciertos
  if (S.eval && S.notas.length <= 16) for (let k = 0; k < S.notas.length; k++) { const on = S.hit && S.hit[k] === 1; ctx.beginPath(); ctx.arc(X + Wd - 40 - (S.notas.length - 1 - k) * 22, Y + 36, on ? 8 : 6, 0, 7); ctx.fillStyle = on ? (S.pads ? '#c98a52' : COLOR_NOTA5(S.notas[k].n)) : (S.hit && S.hit[k] === -1 ? '#b8aac8' : 'rgba(58,36,20,.15)'); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(58,36,20,.6)'; ctx.stroke(); }
  if (GUARDA.d.dueto && S.o.acordes) { const CPa = S.o.compas || 4, ANa = S.o.anac || 0; for (let c = 0; ANa + c * CPa < S.total; c++) texto(ctx, S.o.acordes[c % S.o.acordes.length], x0 + (ANa + c * CPa) * pxb + 18, 284, { tam: 18, c: '#2a4b9b', peso: 700, al: 'left' }); }
  if (nivel > 0 && !S.pads) { ctx.save(); ctx.globalAlpha = nivel === 1 ? .38 : 1; pentagrama(ctx, X + 40, 392, Wd - 80, 15, [], {}); ctx.restore(); }   // la clave queda fija
  ctx.save(); ctx.beginPath(); ctx.rect(X + 100, Y + 60, Wd - 120, Hd - 60); ctx.clip();
  // bloques
  for (let k = 0; k < S.notas.length; k++) {
    if (!S.visto[k]) continue;
    let [bx, by, bw] = bloque5(S, k); const c = S.pads ? '#c98a52' : COLOR_NOTA5(S.notas[k].n), h = S.hit ? S.hit[k] : 0;
    if (S.sacude && S.sacude.k === k && P.t - S.sacude.t < .35) bx += Math.sin((P.t - S.sacude.t) * 60) * 5;
    const brilla = S.brilla && S.brilla.k === k && P.t - S.brilla.t < .35;
    if (S.notas[k].n === 0) { ctx.save(); rr(ctx, bx, by, bw, 34, 9); ctx.fillStyle = 'rgba(232,220,192,.6)'; ctx.fill(); ctx.setLineDash([6, 5]); ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(58,36,20,.55)'; ctx.stroke(); ctx.restore(); silencioGlifo5(ctx, bx + bw / 2, by + 17, 9, 'rgba(58,36,20,.7)'); }
    else { ctx.save(); ctx.globalAlpha = h === 1 ? .28 : 1; rr(ctx, bx, by, bw, 34, 9); ctx.fillStyle = h === -1 ? '#cfc4b4' : c; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.35)'; rr(ctx, bx + 5, by + 4, bw - 10, 7, 3); ctx.fill(); ctx.restore();
    if (nivel === 0 && !S.pads && bw > 30) texto(ctx, NOMBRE_NOTA5(S.notas[k].n), bx + bw / 2, by + 19, { tam: 15, c: '#fff8ec', borde: 4, bordeC: INK }); }
    const actual = S.estado === 'toca' && k === S.cur && modo !== 'tempo';
    if (actual || brilla) { ctx.save(); ctx.globalAlpha = .55 + .35 * Math.sin(RELOJ * 7); rr(ctx, bx - 5, by - 5, bw + 10, 44, 13); ctx.lineWidth = 4; ctx.strokeStyle = '#ffd046'; ctx.stroke(); ctx.restore(); }
    // en «a tu ritmo», la figura se llena mientras dura
    if (modo === 'ritmo' && h === 1 && P.t < S.hold + .14 && k === S.cur - 1) { const q = 1 - (S.hold + .14 - P.t) / (S.notas[k].d * b); ctx.save(); rr(ctx, bx, by, bw * Math.max(0, Math.min(1, q)), 34, 9); ctx.fillStyle = c; ctx.globalAlpha = .9; ctx.fill(); ctx.restore(); }
  }
  // pentagrama con las figuras (o una sola línea si es ritmo en pads)
  const nts = [], comp = [];
  for (let k = 0; k < S.notas.length; k++) if (S.visto[k] && S.notas[k].n !== 0) nts.push({ n: LETRA_EN5(S.notas[k].n), f: figura5(S.notas[k].d), punto: S.notas[k].d === 1.5 || S.notas[k].d === 3, c: S.pads ? INK : true, x: x0 + S.ini[k] * pxb + Math.min(24, pxb * .42) });
  const CPd = S.o.compas || 4, ANd = S.o.anac || 0; for (let m = ANd || CPd; m < S.total - .01; m += CPd) comp.push(x0 + m * pxb - 3);
  if (S.pads) {
    ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X + 40, 440); ctx.lineTo(X + Wd - 40, 440); ctx.stroke(); comp.forEach(cx => { ctx.beginPath(); ctx.moveTo(cx, 420); ctx.lineTo(cx, 460); ctx.stroke(); }); ctx.restore();
    nts.forEach(nt => { cabeza(ctx, nt.x, 440, 15, nt.f, null); if (nt.f !== 'redonda') { ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(nt.x + 9, 438); ctx.lineTo(nt.x + 9, 388); ctx.stroke(); ctx.restore(); } });
  } else if (nivel > 0) { ctx.save(); ctx.globalAlpha = nivel === 1 ? .38 : 1; pentagrama(ctx, X + 40, 392, Wd - 80, 15, nts, { compases: comp, sinClave: true }); S.notas.forEach((x, k) => { if (x.n === 0 && S.visto[k]) silencioGlifo5(ctx, x0 + S.ini[k] * pxb + Math.min(24, pxb * .42), 422, 13, INK); }); ctx.restore(); }
  else { ctx.save(); ctx.strokeStyle = 'rgba(58,36,20,.18)'; ctx.lineWidth = 2; ctx.setLineDash([3, 7]); ctx.beginPath(); ctx.moveTo(X + 40, 440); ctx.lineTo(X + Wd - 40, 440); ctx.stroke(); ctx.restore(); }   // todavía sin pentagrama: sonido antes que símbolo
  // nombre (diciembre: color + nombre) y sílaba
  for (let k = 0; k < S.notas.length; k++) {
    if (!S.visto[k]) continue; const x = x0 + S.ini[k] * pxb + Math.min(24, pxb * .42), d = S.notas[k].d;
    if (!S.pads && nivel > 0 && S.notas[k].n !== 0) texto(ctx, NOMBRE_NOTA5(S.notas[k].n), x, 506, { tam: 20, c: COLOR_NOTA5(S.notas[k].n), borde: 5, bordeC: INK });
    const on = S.brilla && S.brilla.k === k && P.t - S.brilla.t < d * b;
    if (pxb * d >= 26 || d >= 1 && pxb >= 26) texto(ctx, silaba5(S, k), x - (d > 1 ? 14 : 0), 540, { tam: on ? 25 : 22, c: on ? '#c23345' : '#2a1a3a', peso: on ? 700 : 600, fuente: 'Outfit', al: d > 1 ? 'left' : 'center' });
    if (d > 1) { const x1 = x - 14 + (d >= 3 ? 84 : 62); ctx.save(); ctx.strokeStyle = 'rgba(58,36,20,.35)'; ctx.lineWidth = 3; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.moveTo(x1, 541); ctx.lineTo(Math.max(x1, x + d * pxb - 28), 541); ctx.stroke(); ctx.restore(); }
  }
  ctx.restore();
  // el personaje, sobre los bloques: salta en el acierto, tropieza en el error
  let [px, py] = pie5(P, S); let hop = 0; if (P.salto) { const qq = Math.min(1, (P.t - P.salto.t) / .24); hop = Math.sin(qq * Math.PI) * 34; }
  const tro = P.t - P.tropiezo; ctx.save(); ctx.translate(px, py - hop); if (tro < .5) ctx.rotate(Math.sin(tro * 26) * .22 * (1 - tro * 2));
  sombra(ctx, 0, hop, 18, .25); sprK(ctx, destacado5(heroe5(hop > 2 ? 'feliz' : (S.estado === 'rep' && S.rep && S.rep.canto && S.rep.v === 1) ? 'feliz' : '')), 0, 0, 3); ctx.restore();
  // a tempo: cuenta de cuatro y la línea que avanza con el pulso
  if (modo === 'tempo' && S.estado === 'toca') {
    const bt = (P.t - (SON5.listo ? Math.min(.15, KitSonido.latenciaSalida()) : 0) - S.tInicio) / b;   // M7c: lo que se ve va con lo que se oye (latencia de salida)
    const CPc = S.o.compas || 4, ANc = S.o.anac || 0; if (bt < 0) { const n = Math.floor(bt + CPc - ANc) + 1; if (n >= 1 && n <= CPc) { const fr = (bt + CPc) % 1; ctx.save(); ctx.globalAlpha = 1 - fr * .5; ctx.beginPath(); ctx.arc(X + Wd - 150, 228, 44 + (1 - fr) * 10, 0, 7); ctx.fillStyle = n === 1 ? '#ffd046' : '#fffaf4'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); titulo5(ctx, String(n), X + Wd - 150, 232, 60); } }
    const lx = x0 + Math.max(0, Math.min(S.total, bt)) * pxb;
    ctx.save(); ctx.strokeStyle = 'rgba(210,69,46,.85)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(lx, 286); ctx.lineTo(lx, 556); ctx.stroke(); ctx.fillStyle = '#c23345'; ctx.beginPath(); ctx.moveTo(lx - 9, 280); ctx.lineTo(lx + 9, 280); ctx.lineTo(lx, 292); ctx.fill(); ctx.restore();
  }
  // canto: en la segunda vuelta, el niño canta con Tic
  if (S.estado === 'rep' && S.rep && S.rep.canto && S.rep.v === 1) for (let i = 0; i < 3; i++) { const t = (RELOJ * .8 + i / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - t; ctx.font = '700 30px Outfit'; ctx.fillStyle = '#c23345'; ctx.fillText('♪', px + 24 + Math.sin(t * 6 + i) * 10, py - 100 - t * 60); ctx.restore(); }
  if (S.estado === 'rep' && S.rep && !S.rep.canto && S.eval) { ctx.save(); ctx.globalAlpha = .8; texto(ctx, '♪', P.ticPos[0] + 46, P.ticPos[1] - 120, { tam: 40, c: '#ffd046', borde: 5 }); ctx.restore(); }
}
// paso de diálogo: una frase corta (Bach o Tic), palabra por palabra; tocar la pantalla lo adelanta
function pasoDialogo5(quien, txt, vozId) {
  const S = { eval: false, quien };
  S.iniciar = P => { const v = vozId ? voz5(vozId, { forzar: true }) : null; S.txt = textoDeVoz5(v || vozId, txt); S.t0 = P.t; S.listo = false; S.dur = S.txt.split(' ').length / 2.6 + 1.6; };
  S.paso = P => { if (P.t - S.t0 > S.dur) S.listo = true; };
  S.tocar = P => { if (P.t - S.t0 > .6) S.listo = true; };
  S.dibujar = (P, ctx) => { burbuja5(ctx, 330, 190, 700, S.txt || txt, P.t - S.t0, { cola: quien === 'bach' ? [940, 420] : [380, 330], colaDx: quien === 'bach' ? 130 : -160 }); };
  return S;
}
// =====================================================================
//  PATIO · Modo Piano con respiración (1'): inhala 4 tiempos, exhala 4 (dos veces); luego tocar libre sobre un colchón.
//  Cada nota sube como un farol de su color. Corcheas: por tocar con calma (una nota a la vez), hasta 3.
// =====================================================================
const PENTA5 = [60, 62, 64, 67, 69, 72, 74, 76];
function pasoPatio5(dur = 60) {
  const S = { eval: false, libre: true };
  const INTRO = 5.6, DICE = textoDeVoz5('tic-patio', 'Vamos a ponernos en modo música… Empezamos respirando.');
  S.iniciar = P => { S.t0 = P.t; S.listo = false; S.calma = 0; S.ultimas = []; S.faroles = []; S.ganadas = 0; S.compas = -1; P.pulso.anclar(P.t + INTRO + .3, tempoDia5()); P.sinTic = true; P.ticOjos = null; voz5('tic-patio', { forzar: true }); ticPita5('hola'); };
  const respira = P => P.pulso.beat(P.t) < 16;
  S.paso = P => {
    if (P.t - S.t0 > INTRO) P.sinTic = false;
    const bt = P.pulso.beat(P.t), c = Math.floor(bt / 4);
    if (!respira(P) && S.compas < 0) vozPrimeras5('patio-libre', 2, 'bach-patio-libre', { forzar: true });
    if (!respira(P) && c > S.compas) { S.compas = c; SON5.base(c, 4, P.pulso.bpm); }
    if (P.t - S.t0 >= dur) { S.listo = true; P.ganadasPatio = S.ganadas; }
  };
  S.nota = (P, n, t) => {
    // con calma = una nota a la vez (0,3 s desde la anterior); un golpe de varias notas borra la racha
    const gap = t - (S.ultimas.length ? S.ultimas[S.ultimas.length - 1] : -9), junto = gap < .15; S.ultimas.push(t); if (S.ultimas.length > 8) S.ultimas.shift();
    S.faroles.push({ n, x: xDeTecla(n), t: P.t, dx: (Math.random() - .5) * 60 });
    if (junto) { S.calma = 0; S.juntos = (S.juntos || 0) + 1; if (S.juntos === 6) voz5('ay-calma'); }
    else if (gap >= .3 && !respira(P)) { S.calma++; if (S.calma >= 10 && S.ganadas < 3) { S.calma = 0; S.ganadas++; P.fx.vuela(xDeTecla(n), 560, LW5 / 2 - 60 + S.ganadas * 40, 150, (cx, x, y) => sprK(cx, corcheaDorada(), x, y + 20, 3), .8, () => { try { Snd.boton(); } catch (e) { } }); } }
    return junto ? 'error' : 'ok';
  };
  S.objetivo = P => { if (respira(P)) return null; const nb = Math.ceil(P.pulso.beat(P.t) - .3); if (nb % 4 === 3) return null; return { id: 'P' + nb, n: PENTA5[(nb * 5 + (nb >> 2)) % PENTA5.length], t: P.pulso.tDe(nb), tempo: true, libre: true }; };
  S.dibujar = (P, ctx) => {
    const bt = P.pulso.beat(P.t), ti = P.t - S.t0;
    if (ti < INTRO) {   // Tic en plano cercano: habla (palabra por palabra) y respira
      const q = Math.min(1, ti * 3), z = 1 + .04 * Math.sin(ti * 2.2); ctx.save(); ctx.fillStyle = 'rgba(28,16,48,' + .45 * q + ')'; ctx.fillRect(0, 0, LW5, LH5); ctx.restore();
      ctx.save(); ctx.globalAlpha = q; brillo(ctx, 360, 300, 260, '255,226,160'); const s = sprRobotB({ ang: Math.round(Math.sin(ti * 2.4) * 3) / 10, ojos: (ti % 2.3) < .14 ? 'cerrado' : 'feliz', boca: Math.floor(ti * 7) % 2 && ti < 4.2 ? 'canta' : '', llama: Math.floor(RELOJ * 14) % 2 }); sombra(ctx, 360, 600, 90, .25); sprK(ctx, destacado5(s), 360, 560 + Math.sin(ti * 2.4) * 8, 11 * z); ctx.restore();
      burbuja5(ctx, 600, 170, 560, DICE, ti, { cola: [560, 330], colaDx: -80 }); return; }
    if (bt < 16) {   // respiración: el círculo crece (inhala) y se achica (exhala) con el pulso
      const f = (bt % 8) / 4, r = 70 + (f < 1 ? f : 2 - f) * 150, inh = f < 1;
      ctx.save(); ctx.beginPath(); ctx.arc(LW5 / 2, 340, r, 0, 7); ctx.fillStyle = rg(ctx, LW5 / 2, 340, r, [[0, 'rgba(255,236,190,.55)'], [1, 'rgba(95,211,106,.15)']]); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(251,241,216,.8)'; ctx.stroke(); ctx.restore();
      titulo5(ctx, inh ? 'inhala' : 'exhala', LW5 / 2, 344, 46, '#fffaf4', { borde: 7, bordeC: '#2a1a3a' });
      for (let i = 0; i < 4; i++) { const on = Math.floor(bt % 4) === i; ctx.beginPath(); ctx.arc(LW5 / 2 - 45 + i * 30, 400, on ? 9 : 6, 0, 7); ctx.fillStyle = on ? '#ffd046' : 'rgba(251,241,216,.4)'; ctx.fill(); }
    } else {
      // tres huecos para las corcheas del patio
      for (let i = 0; i < 3; i++) { const x = LW5 / 2 - 20 + i * 40; ctx.save(); ctx.globalAlpha = i < S.ganadas ? 1 : .3; sprK(ctx, corcheaDorada(), x, 170, 3); ctx.restore(); }
    }
    // faroles que suben
    for (let i = S.faroles.length - 1; i >= 0; i--) {
      const F = S.faroles[i], a = P.t - F.t; if (a > 4) { S.faroles.splice(i, 1); continue; }
      const x = F.x + Math.sin(a * 2 + F.dx) * 18 + F.dx * a * .3, y = 590 - a * 120, c = COLOR_NOTA5(F.n), al = Math.min(1, (4 - a));
      ctx.save(); ctx.globalAlpha = al; brillo(ctx, x, y, 50, '255,224,150'); rr(ctx, x - 19, y - 24, 38, 46, 10); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(x - 12, y - 18, 24, 5); ctx.restore();
      ctx.save(); ctx.globalAlpha = al; texto(ctx, NOMBRE_NOTA5(F.n), x, y + 4, { tam: 15, c: '#fff8ec', borde: 4, bordeC: INK }); ctx.restore();
    }
  };
  return S;
}
// =====================================================================
//  TALLER · inventar sobre una base (2'): DO – LAm – FA – SOL; las notas de la pentatónica brillan apenas en el teclado.
//  Lo que inventa se teje en un telar; al final Tic lo toca de vuelta. Corcheas: un bloque de 4 compases con 3+ notas tranquilas.
// =====================================================================
const ACORDES_TALLER5 = [0, 4, 1, 2];   // índices para SON5.base: DO, LAm, FA, SOL
function pasoTaller5(compases = 20) {
  const S = { eval: false, libre: true };
  S.iniciar = P => { S.listo = false; S.notas = []; S.ganadas = 0; S.compas = -1; S.bloques = {}; S.mash = {}; S.ult = -9; S.fase = 'inventa'; S.rep = null; P.pulso.anclar(P.t + .3, tempoDia5()); TECLADO5.guia = PENTA5.concat([79, 81]); };
  S.paso = P => {
    const bt = P.pulso.beat(P.t), c = Math.floor(bt / 4), b = P.pulso.b();
    if (c > S.compas) { S.compas = c; if (c < compases + 4) SON5.base(ACORDES_TALLER5[c % 4], 4, P.pulso.bpm);
      if (c > 0 && c % 4 === 0 && c <= compases) { const blq = c / 4 - 1; if ((S.bloques[blq] || 0) >= 3 && !((S.mash || {})[blq] >= 2) && S.ganadas < 3) { S.ganadas++; P.fx.vuela(LW5 / 2, 300, LW5 / 2 - 60 + S.ganadas * 40, 150, (cx, x, y) => sprK(cx, corcheaDorada(), x, y + 20, 3), .8, () => { try { Snd.boton(); } catch (e) { } }); } } }
    if (S.fase === 'inventa' && bt >= compases * 4) {   // Tic lo toca de vuelta: el bloque de 4 compases con más notas
      S.fase = 'escucha'; TECLADO5.guia = null; voz5('bach-taller-escucha', { forzar: true }); let mejor = 0, mx = -1; Object.keys(S.bloques).forEach(k => { if (S.bloques[k] > mx) { mx = S.bloques[k]; mejor = +k; } });
      const desde = mejor * 16; S.rep = S.notas.filter(x => x.b >= desde && x.b < desde + 16).map(x => ({ n: x.n, t: P.pulso.tDe(compases * 4 + Math.round((x.b - desde) * 2) / 2), hecho: false })); S.repBloque = mejor;
    }
    if (S.rep) S.rep.forEach(r => { if (!r.hecho && P.t >= r.t) { r.hecho = true; SON5.nota(r.n, 70); SON5.ticCanta(r.n, .3); pista5(r.n, .4); P.ticCanta = P.t + .35; } });
    if (bt >= (compases + 4) * 4 + .5) { S.listo = true; P.ganadasTaller = S.ganadas; }
  };
  S.nota = (P, n, t) => {
    if (S.fase !== 'inventa') return null;
    const bt = P.pulso.beat(t); if (bt < 0) return null;
    const gap = t - S.ult, junto = gap < .15; S.ult = t; S.notas.push({ n, b: bt, junto });
    const blq = Math.floor(bt / 16); S.mash = S.mash || {};
    if (junto) S.mash[blq] = (S.mash[blq] || 0) + 1; else if (gap >= .25) S.bloques[blq] = (S.bloques[blq] || 0) + 1;
    return junto ? 'error' : 'ok';
  };
  S.objetivo = P => { if (S.fase !== 'inventa') return null; const nb = Math.ceil((P.pulso.beat(P.t) - .2) * 2) / 2; if (nb < 0 || (nb * 2) % 3 === 2) return null; return { id: 'L' + nb, n: PENTA5[Math.floor(nb * 3.7) % PENTA5.length], t: P.pulso.tDe(nb), tempo: true, libre: true }; };
  S.dibujar = (P, ctx) => {
    // el telar: 16 columnas (4 compases) × las alturas; lo tejido sube como un tapiz
    const X = 250, Y = 150, Wd = 860, Hd = 410, bt = P.pulso.beat(P.t), b0 = S.fase === 'inventa' ? Math.floor(Math.max(0, bt) / 16) * 16 : S.repBloque * 16;
    pergamino5(ctx, X - 20, Y - 20, Wd + 40, Hd + 40);
    ctx.save(); ctx.strokeStyle = 'rgba(122,74,42,.35)'; ctx.lineWidth = 2; for (let c = 0; c <= 16; c++) { ctx.beginPath(); ctx.moveTo(X + c * Wd / 16, Y); ctx.lineTo(X + c * Wd / 16, Y + Hd); ctx.stroke(); } for (let r = 0; r <= 14; r++) { ctx.beginPath(); ctx.moveTo(X, Y + r * Hd / 14); ctx.lineTo(X + Wd, Y + r * Hd / 14); ctx.stroke(); } ctx.restore();
    [Y - 10, Y + Hd - 6].forEach(yy => { ctx.save(); rr(ctx, X - 26, yy, Wd + 52, 18, 9); ctx.fillStyle = lg(ctx, 0, yy, 0, yy + 18, [[0, '#c98a52'], [1, '#7a4a2a']]); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); });
    for (let c = 4; c < 16; c += 4) { ctx.save(); ctx.strokeStyle = 'rgba(122,74,42,.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X + c * Wd / 16, Y); ctx.lineTo(X + c * Wd / 16, Y + Hd); ctx.stroke(); ctx.restore(); }
    const fila = n => { const s = n - 60, oct = Math.floor(s / 12), wi = BLANCAS5.indexOf(((s % 12) + 12) % 12); return Math.max(0, Math.min(13, oct * 7 + (wi >= 0 ? wi : BLANCAS5.indexOf(((s % 12) + 11) % 12)))); };
    S.notas.forEach(x => { if (x.b < b0 || x.b >= b0 + 16) return; const c = Math.floor(x.b * 2) / 2 - b0, r = fila(x.n), sonando = S.rep && S.rep.some(rp => rp.hecho && rp.n === x.n && P.t - rp.t < .3);
      ctx.save(); ctx.globalAlpha = x.junto ? .3 : 1; rr(ctx, X + c * Wd / 16 + 3, Y + (13 - r) * Hd / 14 + 3, Wd / 32 - 6 + Wd / 32, Hd / 14 - 6, 6); ctx.fillStyle = COLOR_NOTA5(x.n); ctx.fill(); ctx.lineWidth = sonando ? 5 : 2.5; ctx.strokeStyle = sonando ? '#ffd046' : INK; ctx.stroke(); ctx.restore(); });
    const px = X + (S.fase === 'inventa' ? (Math.max(0, bt) - b0) % 16 : Math.max(0, Math.min(16, bt - compases * 4))) * Wd / 16;
    ctx.save(); ctx.strokeStyle = '#c23345'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(px, Y - 8); ctx.lineTo(px, Y + Hd + 8); ctx.stroke(); ctx.restore();
    // bloques ya tejidos (la tira de arriba)
    const nb = Math.floor(Math.max(0, Math.min(bt, compases * 4)) / 16); for (let k = 0; k < Math.ceil(compases / 4); k++) { const on = k < nb || (k === nb && S.fase === 'inventa'); ctx.save(); rr(ctx, X + k * 46, Y - 52, 38, 22, 6); ctx.fillStyle = on ? ((S.bloques[k] || 0) >= 3 ? '#ffd046' : '#e9e4ee') : 'rgba(251,241,216,.25)'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); }
    for (let i = 0; i < 3; i++) { ctx.save(); ctx.globalAlpha = i < S.ganadas ? 1 : .3; sprK(ctx, corcheaDorada(), X + Wd - 100 + i * 40, Y - 26, 2.6); ctx.restore(); }
  };
  return S;
}
// =====================================================================
//  LAS CINCO PARADAS DE BELÉN (diciembre: pulso, negra y blanca; villancicos, empezando por Jingle Bells)
// =====================================================================
function definirParadas5() {
  crearParada5('patio', () => ({ pasos: [pasoPatio5(60)], estrellas: P => P.ganadasPatio || 0, corcheas: P => P.ganadasPatio || 0 }));
  crearParada5('coro', () => { const M = motivos5(); return { pasos: M.slice(0, 4).map(m => pasoLectura5(m, 'ritmo', { introCanto: 2, corto: true })), repaso: i => pasoLectura5(M[(4 + i) % M.length], 'ritmo', { introCanto: 2, corto: true }), minimo: 100 }; });
  crearParada5('salon', P => { P.ticPos = [100, 300, 4];
    const pl = plan5(), V = patronesDia5(diaPlan5(), 14, 3), base = V[0];
    // lo nuevo: escucha → espera → a tu ritmo → a tempo, y después muchas variaciones pequeñas (la escalera baja si cuesta)
    const pasos = [pasoDialogo5('bach', pl.dice, 'salon-dia-' + pl.dia),
      pasoLectura5(base, 'escucha', { veces: 2 }), pasoLectura5(base, 'espera'), pasoLectura5(base, 'ritmo'), pasoLectura5(base, 'tempo', { clave: 'ritmo-dia-' + pl.dia }),
      pasoLectura5(V[1], 'ritmo'), pasoLectura5(V[1], 'tempo'), pasoLectura5(V[2], 'tempo'), pasoLectura5(V[3], 'tempo', { base: true })];
    return {
    decor: (P, ctx) => { const x = 1218, y = 592 + Math.sin(RELOJ * 2) * 1.5; sombra(ctx, x, y, 34, .3); dibujarBachParada7(ctx, x, y, 3); },
    pasos, repaso: i => { const v = V[(4 + i) % V.length]; return pasoLectura5(v, i % 3 === 0 ? 'ritmo' : 'tempo', { base: i % 2 === 1 }); }, minimo: 245 }; });
  crearParada5('teatro', P => teatroDelDia5(P));
  crearParada5('taller', () => ({ pasos: [pasoTaller5(16)], estrellas: P => P.ganadasTaller || 0, corcheas: P => P.ganadasTaller || 0 }));
}
// =====================================================================
//  EL TEATRO ROTA LA CANCIÓN DEL DÍA (Jingle Bells → Noche de paz → Los peces → Campana → Venid fieles).
//  Hoy: los dos pedazos que faltan por dominar (escucha → ritmo en pads → una tecla → melodía) y después
//  todo lo que ya sabe de la canción, con la banda. Un pedazo queda dominado bien tocado en 2 días distintos.
// =====================================================================
const dominada5 = clave => { const m = m2_(); return !!(m && (m.dominio[clave] || []).length >= 2); };
function diasHechos5() { const m = m2_(); return Math.min(13, m.mision || 0); }   // M5: la progresión avanza por misiones completadas
function cancionDelDia5() { const m = m2_(), d = diaHoy5(); if (!d.cancion || m.diaForzado != null) { d.cancion = plan5().cancion; GUARDA.guardar(); } return d.cancion; }
function pedazosDeHoy5(id) { const ver = versionDe5(id), pend = ver.filter(k => !dominada5(id + '-' + k)); return (pend.length ? pend : ver).slice(0, 2); }
function teatroDelDia5(P) {
  const id = cancionDelDia5(), V = VILLANCICOS5[id], ver = versionDe5(id), base = { compas: V.compas, bpm: V.bpm };
  const pl = plan5(), durOk = d => d === 1 || d === 2 || (d === .5 && pl.ritmos.includes('taca')) || (d === 4) || ((d === 1.5 || d === 3) && pl.punteadas);
  const sabeNotas = ns => ns.every(x => conoce5(x.n)), sabeRitmo = ns => ns.every(x => durOk(x.d)), MI = NOTA_PC5[conocidas5()[0]];
  const pend = ver.filter(k => !dominada5(id + '-' + k)), jug = ver.filter(k => sabeRitmo(V.pedazos[k].notas)), pj = pend.filter(k => jug.includes(k));
  const hoy = (pj.length ? pj : jug.length ? jug : pend.length ? pend : ver).slice(0, 2);
  const pasos = [];
  hoy.forEach((k, q) => {
    const pz = V.pedazos[k], t = V.titulo + ' · ' + (ver.indexOf(k) + 1), o = Object.assign({ titulo: t, anac: pz.anac || 0 }, base);
    pasos.push(pasoLectura5(pz.notas, 'escucha', Object.assign({ veces: 2 }, o)));
    if (!sabeRitmo(pz.notas)) { if (q === 0) pasos.push(pasoRepaso5()); return; }   // ritmo todavía no aprendido: solo se escucha y se canta
    pasos.push(pasoLectura5(pz.notas, 'tempo', Object.assign({ pads: true }, o)));
    const una = new Set(pz.notas.map(x => x.n)).size > 1;
    if (una || !sabeNotas(pz.notas)) pasos.push(pasoLectura5(pz.notas, 'tempo', Object.assign({ unaTecla: MI, base: !sabeNotas(pz.notas), acordes: pz.ac }, o)));
    if (sabeNotas(pz.notas)) pasos.push(pasoLectura5(pz.notas, 'tempo', Object.assign({ clave: id + '-' + k, base: true, acordes: pz.ac }, o)));
    if (q === 0) pasos.push(pasoRepaso5());   // un mini repaso en medio
  });
  // todo lo que ya sabe (de su versión, hasta el último pedazo de hoy), con la banda; en una tecla si faltan notas por conocer
  const hasta = Math.max(...hoy.map(k => ver.indexOf(k))), sabe = ver.slice(0, hasta + 1), notas = [], ac = [];
  sabe.forEach(k => { notas.push(...V.pedazos[k].notas); ac.push(...V.pedazos[k].ac); });
  const completa = sabe.length === ver.length, melo = sabeNotas(notas) && sabeRitmo(notas), an = V.pedazos[sabe[0]].anac || 0;
  const todo = () => pasoLectura5(notas, 'tempo', Object.assign({ base: true, acordes: ac, unaTecla: melo ? 0 : MI, cancion: completa && melo, clave: completa && melo ? id : null, titulo: V.titulo, anac: an }, base));
  if (sabe.length > 1 && sabeRitmo(notas)) pasos.push(todo());
  P.cancion = id;
  if (!jug.length) { const VV = patronesDia5(diaPlan5(), 10, 9); return { pasos, repaso: i => pasoLectura5(VV[i % VV.length], 'tempo', { base: true, titulo: V.titulo + ' · su ritmo' }), minimo: 245 }; }
  return { pasos, repaso: i => i % 3 === 2 ? pasoLectura5(notas, 'tempo', Object.assign({ pads: true, titulo: V.titulo, anac: an }, base)) : (sabe.length > 1 ? todo() : pasoLectura5(V.pedazos[hoy[0]].notas, 'tempo', Object.assign({ base: true, acordes: V.pedazos[hoy[0]].ac, unaTecla: sabeNotas(V.pedazos[hoy[0]].notas) ? 0 : MI, titulo: V.titulo, anac: V.pedazos[hoy[0]].anac || 0 }, base))), minimo: 245 };
}
// =====================================================================
//  PRIMER DÍA: la carta de Bach (se abre y se lee palabra por palabra) → Tic sale del sobre → el traje de viajero
//  → la puerta de Belén: la primera nota la abre. Sin toques obligatorios: todo pasa solo (tocar adelanta).
// =====================================================================
function crearCarta5() {
  const C = { dia: true, t: 0, pulso: pulso5(), fx: fx5(), ticPos: [0, 0, 4], padGolpe: [] };
  const FASES = [['titulo', 7.5], ['llega', 1.3], ['abre', 1.1], ['lee', 0], ['tic', 2.6], ['traje', 3.2], ['puerta', 0]];
  let paginas;
  C.reloj = () => C.t;
  C.entrar = () => { C.t = 0; C.f = 0; C.tf = 0; C.abierta = null; C.flash = 0; C.ido = false; C.vt = 0; C.fx.lista.length = 0; C.pulso.sonar = false; if (SESION5.t0 == null) SESION5.t0 = RELOJ; marca5('carta');
    paginas = [nombreNino5(), textoDeVoz5('bach-carta', 'Te espero en Belén. Allí empieza nuestro viaje de música.'), textoDeVoz5('bach-carta-tic', 'Te mando a Tic. Él lleva el pulso.'), 'Con cariño,  J. S. Bach'];
    C.palabras = paginas.join(' ').split(' ').filter(Boolean).length; SON5.musica(null); };
  const fase = () => FASES[C.f][0];
  function siguienteFase() { C.f = Math.min(FASES.length - 1, C.f + 1); C.tf = C.t; const f = fase();
    if (f === 'lee') voz5('bach-carta', { hito: true });
    if (f === 'tic') { let bd = BPM5; try { if (GUARDA.perfil()) bd = tempoDia5(); } catch (e) { } C.pulso.anclar(C.t + .9, bd); C.pulso.sonar = true; ticPita5('hola'); setTimeout(() => voz5('bach-carta-tic', { hito: true }), 600 / VEL5); C.fx.estallar(LW5 / 2, 470, '#ffd046', 24); }
    if (f === 'traje') { try { Snd.desbloqueo(); } catch (e) { } setTimeout(() => voz5('bach-traje', { hito: true }), 1500 / VEL5); }
    if (f === 'puerta') { marca5('puerta'); voz5('bach-puerta', { hito: true }); } }
  C.dibujar = (ctx, dtR) => {
    const dt = pausado5() ? 0 : dtR; C.t += dt; C.pulso.paso(C.t); const tf = C.t - C.tf, f = fase();
    if (FASES[C.f][1] && tf > FASES[C.f][1]) siguienteFase();
    if (f === 'lee' && tf > C.palabras / 2.6 + 1.8) siguienteFase();
    if (C.abierta && C.t - C.abierta > 2.2 && !C.ido) { C.ido = true; const m = m2_(); m.primerDia = true; GUARDA.guardar(); seguirSesion5(null); }
    // fondo: la mesa de noche, con la vela
    ctx.fillStyle = lg(ctx, 0, 0, 0, LH5, [[0, '#2a1840'], [1, '#1c1030']]); ctx.fillRect(0, 0, LW5, LH5);
    for (let i = 0; i < 70; i++) { const x = (i * 197) % LW5, y = (i * 113) % 420, a = .3 + .3 * Math.sin(RELOJ * 2 + i); ctx.fillStyle = 'rgba(255,240,200,' + a + ')'; ctx.fillRect(x, y, 2, 2); }
    if (f !== 'puerta' && f !== 'titulo') {
      ctx.fillStyle = lg(ctx, 0, 560, 0, LH5, [[0, '#7a4a2a'], [1, '#4a2a16']]); ctx.fillRect(0, 560, LW5, LH5 - 560); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(0, 560, LW5, 6);
      brillo(ctx, 1100, 420, 260, '255,190,110'); ctx.fillStyle = '#fffaf4'; ctx.fillRect(1086, 440, 28, 120); ctx.fillStyle = '#ffd046'; ctx.beginPath(); ctx.ellipse(1100, 424 + Math.sin(RELOJ * 9) * 2, 9, 18, 0, 0, 7); ctx.fill();
    }
    if (f === 'titulo') { dibujarTitulo5(ctx, tf); if (tf > .5 && !C.vt) { C.vt = 1; voz5('bach-titulo', { hito: true }); } if (tf > 4.2 && C.vt === 1) { C.vt = 2; voz5('bach-frase', { hito: true }); } }
    if (f === 'llega' || f === 'abre' || f === 'lee') dibujarCartaPapel(ctx, f, tf);
    if (f === 'tic' || f === 'traje') { dibujarSobre5(ctx, 1); }
    if (f === 'tic') { const q = Math.min(1, tf / .9), x = LW5 / 2 + (q < 1 ? 0 : 0), y = 470 - Math.sin(Math.min(1, q) * Math.PI / 2) * 200; C.ticPos = [x, y, 6]; dibujarTic5(ctx, C, x, y, 6); }
    if (f === 'traje') { dibujarTic5(ctx, C, 230, 300, 4); const q = tf / 1.4, x = LW5 / 2, y = 540;
      if (q < 1) { sprK(ctx, destacado5((GUARDA.d.perfil === 'david' ? sprDavid({ eyes: 'happy' }) : sprSarah({ eyes: 'happy', cross: 'up' }))), x, y, 7); for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283 + C.t * 4, r = 140 - q * 90; ctx.fillStyle = 'rgba(255,224,130,' + (.4 + q * .5) + ')'; ctx.beginPath(); ctx.arc(x + Math.cos(a) * r, y - 120 + Math.sin(a) * r * .6, 6, 0, 7); ctx.fill(); } }
      else { if (!C.flash) { C.flash = C.t; C.fx.estallar(x, y - 120, '#ffd046', 30, 1.3); } rayosLuz5(ctx, x, y - 120, C.t); sprK(ctx, destacado5(heroe5('feliz')), x, y, 7); }
      if (q >= 1 && C.t - C.flash < .3) { ctx.fillStyle = 'rgba(255,248,230,' + (1 - (C.t - C.flash) / .3) + ')'; ctx.fillRect(0, 0, LW5, LH5); } }
    if (f === 'puerta') dibujarPuerta5(ctx, C);
    C.fx.dibujar(ctx, dt);
    botonRedondo5(ctx, LW5 - 50, 48, 'pausa');
  };
  function dibujarCartaPapel(ctx, f, tf) {
    if (f === 'llega') { const q = Math.min(1, tf / 1.1), e = 1 - Math.pow(1 - q, 3); ctx.save(); ctx.translate(LW5 / 2 + (1 - e) * 500, 400 - (1 - e) * 420); ctx.rotate((1 - e) * 1.6); dibujarSobre5(ctx, 0, true); ctx.restore(); return; }
    const q = f === 'abre' ? Math.min(1, tf / 1) : 1;
    if (f === 'abre' && tf < .35) { dibujarSobre5(ctx, 0); C.fx.lista.length < 3 && tf > .25 && C.fx.estallar(LW5 / 2, 400, '#b5243a', 10); return; }
    const w = 820, h = 470 * q, x = LW5 / 2 - w / 2, y = 400 - h / 2;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, '#fffaf4'], [1, '#ead4a4']]); ctx.fillRect(x, y, w, h); ctx.restore();
    ctx.save(); ctx.strokeStyle = '#d9a930'; ctx.lineWidth = 3; ctx.strokeRect(x + 16, y + 16 * q, w - 32, h - 32 * q); ctx.restore();
    if (q < 1) return;
    // el texto, palabra por palabra (nombre arriba, firma abajo)
    const act = Math.floor((C.t - C.tf) * 2.6); let k = 0; ctx.save(); ctx.textBaseline = 'middle';
    paginas.forEach((pg, i) => { if (i === 1 || i === 2) habla5(pg); const firma = i === paginas.length - 1, yy = y + 80 + i * 92 + (firma ? 20 : 0); ctx.font = (i === 0 || firma ? '700 40px Crimson' : '600 33px Outfit'); let px = firma ? x + w - 60 - ctx.measureText(pg).width : x + 64; const lineas = [];
      // partir en líneas de ~ 700 px
      let l = ''; pg.split(' ').filter(Boolean).forEach(p => { const n = l ? l + ' ' + p : p; if (ctx.measureText(n).width > w - 130 && l) { lineas.push(l); l = p; } else l = n; }); lineas.push(l);
      lineas.forEach((ln, j) => { let lx = firma ? px : x + 64; ln.split(' ').forEach(p => { ctx.fillStyle = k < act ? '#2a1a3a' : k === act ? '#c23345' : 'rgba(58,36,20,.16)'; ctx.fillText(p, lx, yy + j * 44); lx += ctx.measureText(p + ' ').width; k++; }); });
    });
    ctx.restore();
    // el sello de Bach (clave de sol), abajo a la izquierda
    ctx.save(); ctx.beginPath(); ctx.arc(x + 110, y + h - 80, 42, 0, 7); ctx.fillStyle = '#b5243a'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#7a1424'; ctx.stroke(); ctx.restore(); clave(ctx, 'sol', x + 96, y + h - 104, 7, '#fbd0c0');
  }
  C.tocar = (x, y) => { if (Math.hypot(x - (LW5 - 50), y - 48) < 34) { MENU5.abrir('pausa'); return; } const f = fase(); if (f === 'puerta') { const n = teclaEn(x, y); if (n != null) notaEntrante(n, 90, 'pantalla'); return; } if (C.t - C.tf > .5 && f !== 'llega') siguienteFase(); };
  C.nota = (n, t) => { if (fase() !== 'puerta' || C.abierta) return null; C.abierta = C.t; SON5.acorde(n); try { Snd.desbloqueo(); } catch (e) { } C.fx.estallar(LW5 / 2, 380, '#ffd046', 40, 1.4); marca5('primera nota'); setTimeout(() => voz5('bach-bienvenida', { hito: true, forzar: true }), 400 / VEL5); return 'ok'; };
  C.objetivo = () => fase() === 'puerta' && !C.abierta ? { id: 'puerta', n: 60, t: C.tf + .8, reaccion: true } : null;
  return C;
}
function dibujarSobre5(ctx, abierto, enOrigen) {
  ctx.save(); if (!enOrigen) ctx.translate(LW5 / 2, 400 + (abierto ? 90 : 0));
  const w = 360, h = 230;
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; ctx.fillStyle = '#ead4a4'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.shadowColor = 'transparent';
  ctx.lineWidth = 4; ctx.strokeStyle = '#7a4a2a'; ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.beginPath(); ctx.moveTo(-w / 2, h / 2); ctx.lineTo(0, 10); ctx.lineTo(w / 2, h / 2); ctx.stroke();
  ctx.beginPath(); if (abierto) { ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(0, -h / 2 - 110); ctx.lineTo(w / 2, -h / 2); } else { ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(0, 20); ctx.lineTo(w / 2, -h / 2); } ctx.fillStyle = '#f3e2bc'; ctx.fill(); ctx.stroke();
  if (!abierto) { ctx.beginPath(); ctx.arc(0, 20, 34, 0, 7); ctx.fillStyle = '#b5243a'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#7a1424'; ctx.stroke(); ctx.restore(); clave(ctx, 'sol', (enOrigen ? 0 : LW5 / 2) - 13, (enOrigen ? 0 : 400) + 2, 6, '#fbd0c0'); return; }
  ctx.restore();
}
// la puerta de Belén: muro de piedra, arco, dos hojas de madera; la estrella arriba. La primera nota la abre.
let PUERTA5 = null;
function dibujarPuerta5(ctx, C) {
  if (!PUERTA5) { PUERTA5 = canvas(LW5, LH5); const x = PUERTA5.getContext('2d');
    x.fillStyle = lg(x, 0, 0, 0, LH5, [[0, '#1c1030'], [.6, '#3a2466'], [1, '#5a3a6a']]); x.fillRect(0, 0, LW5, LH5);
    const R = rng(25); for (let i = 0; i < 90; i++) { x.fillStyle = 'rgba(255,240,200,' + (.3 + R() * .5) + ')'; x.fillRect(R() * LW5, R() * 330, 2, 2); }
    // muro
    for (let fy = 130; fy < 560; fy += 34) for (let fx = ((fy / 34) % 2) * -40; fx < LW5; fx += 80) { const c = ['#d8c3a0', '#cbb48e', '#e2cfae', '#c4ab84'][Math.floor(R() * 4)]; x.fillStyle = c; x.fillRect(fx + 2, fy + 2, 76, 30); x.fillStyle = 'rgba(0,0,0,.12)'; x.fillRect(fx + 2, fy + 28, 76, 4); }
    x.fillStyle = '#9a8466'; x.fillRect(0, 120, LW5, 12); for (let fx = 0; fx < LW5; fx += 70) { x.fillStyle = '#cbb48e'; x.fillRect(fx, 80, 44, 44); x.strokeStyle = '#7a6448'; x.lineWidth = 3; x.strokeRect(fx, 80, 44, 44); }
    x.fillStyle = lg(x, 0, 556, 0, LH5, [[0, '#a88a5e'], [1, '#6a5236']]); x.fillRect(0, 556, LW5, LH5 - 556);
    // arco con dovelas
    const cx = LW5 / 2, top = 170, base = 560, rw = 180;
    x.fillStyle = '#2a1830'; x.beginPath(); x.moveTo(cx - rw, base); x.lineTo(cx - rw, top + rw); x.arc(cx, top + rw, rw, Math.PI, 0); x.lineTo(cx + rw, base); x.fill();
    for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; x.save(); x.translate(cx + Math.cos(a) * (rw + 22), top + rw + Math.sin(a) * (rw + 22)); x.rotate(a + Math.PI / 2); x.fillStyle = i === 6 ? '#e8d6b0' : '#d8c3a0'; x.fillRect(-24, -22, 48, 44); x.strokeStyle = '#7a6448'; x.lineWidth = 3; x.strokeRect(-24, -22, 48, 44); x.restore(); }
  }
  ctx.drawImage(PUERTA5, 0, 0);
  const cx = LW5 / 2, top = 170, base = 560, rw = 180, ab = C.abierta ? Math.min(1, (C.t - C.abierta) / 1.2) : 0, e = 1 - Math.pow(1 - ab, 3);
  // luz detrás (crece al abrir)
  ctx.save(); ctx.beginPath(); ctx.moveTo(cx - rw, base); ctx.lineTo(cx - rw, top + rw); ctx.arc(cx, top + rw, rw, Math.PI, 0); ctx.lineTo(cx + rw, base); ctx.clip();
  ctx.fillStyle = 'rgba(255,224,150,' + (.15 + e * .85) + ')'; ctx.fillRect(cx - rw, top, rw * 2, base - top);
  // las dos hojas de madera
  [-1, 1].forEach(lado => { const ww = rw * (1 - e * .82); ctx.save(); const x0 = lado < 0 ? cx - rw : cx + rw - ww; ctx.fillStyle = lg(ctx, x0, 0, x0 + ww, 0, [[0, '#8a5a34'], [1, '#6a4020']]); ctx.fillRect(x0, top, ww, base - top);
    for (let k = 1; k < 5; k++) { ctx.fillStyle = 'rgba(40,20,10,.35)'; ctx.fillRect(x0 + ww * k / 5, top, 3, base - top); }
    ctx.fillStyle = '#3a2a2a'; [top + rw * .9, base - 90].forEach(yy => ctx.fillRect(x0, yy, ww, 16)); for (let k = 0; k < 4; k++) [top + rw * .9 + 8, base - 82].forEach(yy => { ctx.beginPath(); ctx.arc(x0 + 20 + k * (ww - 40) / 3, yy, 5, 0, 7); ctx.fillStyle = '#c9a050'; ctx.fill(); });
    ctx.restore(); });
  ctx.restore();
  // la estrella de Belén
  const sy = 52 + Math.sin(RELOJ * 1.5) * 4; brillo(ctx, cx, sy, 120 + e * 80); estrella(ctx, cx, sy, 26, '#fff3b0');
  if (ab >= 1) { ctx.fillStyle = 'rgba(255,248,230,' + Math.min(.9, (C.t - C.abierta - 1.2) * .8) + ')'; ctx.fillRect(0, 0, LW5, LH5); }
  dibujarTic5(ctx, C, 250, 330, 4);
  sprK(ctx, destacado5(heroe5(C.abierta ? 'feliz' : '')), cx, 566, 4);
  // todas las teclas invitan (cualquiera abre)
  if (!C.abierta) for (let n = 60; n < 84; n++) if (BLANCAS5.includes(n % 12)) TECLADO5.pistas[n] = { c: 'rgba(255,224,130,' + (.35 + .25 * Math.sin(RELOJ * 4 + n)) + ')', hasta: RELOJ + .05 };
  dibujarTeclado5(ctx);
}
// =====================================================================
//  EL ÓRGANO DEL DÍA: un tubo por parada (con sus estrellas), las corcheas que ganó y el pentagrama de la semana.
//  Después: a explorar Belén con el dedo.
// =====================================================================
function crearOrgano5() {
  const O = { dia: true, t: 0, pulso: pulso5(), fx: fx5(), padGolpe: [] };
  O.reloj = () => O.t;
  const BOTON = [1090, 622];
  O.entrar = () => {
    O.t = 0; O.fx.lista.length = 0; O.sono = -1; O.fondo = fotoInterior5('b-conservatorio'); O.pulso.sonar = false;
    const d = diaHoy5(); O.d = d; const m = m2_(); if (!d.completo) { d.completo = true; d.fecha = hoy5(); m.mision = Math.min(14, (m.mision || 0) + 1); marca5('misión ' + m.mision + ' completa'); } diaLog5().completo = true; GUARDA.guardar(); O.hoy = PARADAS5.reduce((a, id) => a + (d.paradas[id] ? d.paradas[id].c : 0), 0);
    if (SESION5.tFin == null && SESION5.t0 != null) SESION5.tFin = RELOJ; marca5('órgano');
  };
  O.dibujar = (ctx, dtR) => {
    const dt = pausado5() ? 0 : dtR; O.t += dt; const d = O.d || diaHoy5();
    ctx.drawImage(O.fondo, 0, 0); ctx.fillStyle = 'rgba(28,16,48,.35)'; ctx.fillRect(0, 0, LW5, LH5);
    // los tubos se encienden uno por uno; al final, el acorde de todo el órgano
    const k = Math.floor((O.t - .6) / .7);
    while (O.sono < Math.min(4, k)) { O.sono++; const id = PARADAS5[O.sono]; if (d.paradas[id]) { SON5.nota([60, 64, 67, 72, 76][O.sono], 70); SON5.ticCanta([72, 76, 79, 84, 88][O.sono], .5); } if (O.sono === 4) setTimeout(() => { SON5.organo(); voz5('bach-organo', { hito: true }); }, 500 / VEL5); }
    const cx = LW5 / 2, base = 520;
    ctx.save(); rr(ctx, cx - 330, 150, 660, 400, 26); ctx.fillStyle = lg(ctx, 0, 150, 0, 550, [[0, '#7a4a2a'], [1, '#4a2a16']]); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
    ctx.save(); rr(ctx, cx - 312, 168, 624, 364, 18); ctx.lineWidth = 3; ctx.strokeStyle = '#d9a930'; ctx.stroke(); ctx.restore();
    PARADAS5.forEach((id, i) => {
      const hh = [190, 250, 300, 250, 190][i], x = cx - 270 + i * 112, y = base - hh, on = i <= O.sono && d.paradas[id], col = COLOR_PARADA5[id];
      if (on) { ctx.save(); ctx.globalAlpha = .6 + .2 * Math.sin(RELOJ * 3 + i); brillo(ctx, x + 38, y + 20, 90, '255,224,150'); ctx.restore(); }
      ctx.save(); rr(ctx, x, y, 76, hh, 16); ctx.fillStyle = on ? lg(ctx, x, 0, x + 76, 0, [[0, mezcla(col, '#ffffff', .45)], [.5, col], [1, mezcla(col, '#2a1a3a', .3)]]) : lg(ctx, x, 0, x + 76, 0, [[0, '#d8c8a8'], [1, '#9a8a6a']]); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
      ctx.fillStyle = INK; rr(ctx, x + 18, y + hh - 70, 40, 14, 7); ctx.fill(); ctx.restore();
      const e = d.paradas[id] ? d.paradas[id].e : 0; for (let s = 0; s < 3; s++) estrella(ctx, x + 14 + s * 24, base + 22, 10, on && s < e ? '#ffd046' : 'rgba(251,241,216,.35)');
    });
    titulo5(ctx, 'El órgano del día', cx, 120, 50, '#fffaf4', { borde: 9, bordeC: '#2a1a3a' });
    // corcheas de hoy y camino a los premios (traje 20, instrumento 40)
    const m = m2_(); if (O.t > 4.2 && !O.voló) { O.voló = true; for (let i = 0; i < Math.min(8, O.hoy); i++) setTimeout(() => O.fx.vuela(cx, 400, LW5 - 300, 48, (c2, x, y) => sprK(c2, corcheaDorada(), x, y + 20, 3), .8, () => { try { Snd.boton(); } catch (e) { } }), (i * 120) / VEL5); }
    hudCorcheas5(ctx); texto(ctx, '+' + O.hoy, LW5 - 300, 100, { tam: 26, c: '#ffd046', borde: 5, bordeC: INK });
    const meta = m.corcheas < 20 ? 20 : m.corcheas < 40 ? 40 : m.corcheas, q = Math.min(1, m.corcheas / meta);
    ctx.save(); rr(ctx, 60, 172, 220, 26, 13); ctx.fillStyle = 'rgba(251,241,216,.3)'; ctx.fill(); rr(ctx, 60, 172, 220 * q, 26, 13); ctx.fillStyle = '#ffd046'; ctx.fill(); rr(ctx, 60, 172, 220, 26, 13); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
    texto(ctx, m.corcheas + ' / ' + meta, 170, 186, { tam: 18, c: INK, peso: 700 }); texto(ctx, meta === 20 ? 'traje nuevo' : meta === 40 ? 'instrumento' : 'tienda del luthier', 170, 150, { tam: 20, c: '#fffaf4', borde: 4, bordeC: INK });
    // el pentagrama de la semana: una nota por cada día de práctica (lunes a domingo, subiendo la escala)
    if (O.t > 3.2) dibujarSemana5(ctx, O);
    if (O.t > 5) { const [bx, by] = BOTON, s = 1 + .05 * Math.sin(RELOJ * 4); ctx.save(); ctx.translate(bx, by); ctx.scale(s, s); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5; ctx.beginPath(); ctx.arc(0, 0, 50, 0, 7); ctx.fillStyle = '#c23345'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.moveTo(-14, -22); ctx.lineTo(24, 0); ctx.lineTo(-14, 22); ctx.closePath(); ctx.fillStyle = '#fffaf4'; ctx.fill(); ctx.restore(); }
    O.fx.dibujar(ctx, dt);
  };
  O.tocar = (x, y) => { if (O.t > 5 && Math.hypot(x - BOTON[0], y - BOTON[1]) < 60) { const B = LUGARES5.belen; B.auto = false; B.extraHud = null; B.alEntrar = null; marca5('explorar'); irA(B, { tipo: 'iris', x, y, desde: puertaDe5('salon').puerta.slice() }); } };
  O.nota = () => null;
  O.objetivo = () => O.t > 5.6 ? { id: 'explorar', toque: BOTON, t: O.t + .4, reaccion: true } : null;
  return O;
}
function dibujarSemana5(ctx, O) {
  const x = 330, y = 606, w = 620, m = m2_();
  ctx.save(); rr(ctx, x - 30, y - 50, w + 60, 132, 16); ctx.fillStyle = 'rgba(251,241,216,.92)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#2a1a3a'; ctx.stroke(); ctx.restore();
  const f = hoy5().split('-').map(Number), hoy = new Date(f[0], f[1] - 1, f[2]), lunes = new Date(hoy); lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
  const notas = [], DIAS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'], ESC = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
  for (let i = 0; i < 7; i++) { const d = new Date(lunes); d.setDate(lunes.getDate() + i); const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); const nx = x + 120 + i * 72;
    const hecho = m.dias[k] && m.dias[k].completo, esHoy = k === hoy5();
    if (hecho && (!esHoy || O.t > 3.8)) notas.push({ n: ESC[i], f: 'redonda', c: true, x: nx, halo: esHoy ? 'rgba(255,224,130,.9)' : null });
    texto(ctx, DIAS[i], nx, y + 64, { tam: 17, c: esHoy ? '#c23345' : '#6b5a7d', peso: esHoy ? 700 : 500 }); }
  pentagrama(ctx, x, y - 30, w, 14, notas, {});
}
// =====================================================================
//  EL NIÑO SIMULADO (pruebas): 'bueno' (acierta, con reacción humana, algún error) o 'aporrea' (golpes al azar)
//  Toca por MIDI (los mismos bytes del piano real) o por la pantalla (toques en el teclado o en los pads).
// =====================================================================
const SIM5 = {
  activo: false, tipo: 'bueno', fuente: 'midi', plan: null, prox: 0, R: rng(1225), errorP: .04, notas: 0, errores: 0,
  iniciar(tipo, fuente, o = {}) { this.activo = true; this.tipo = tipo || 'bueno'; this.fuente = fuente || 'midi'; this.plan = null; this.prox = 0; this.R = rng(o.semilla || 1225); this.errorP = o.errorP == null ? .04 : o.errorP; Entrada.simulado = true; },
  paso(dt = 0) {
    if (!this.activo || !ESC || TRANS) return; const t = relojEscena5() + (pausado5() ? 0 : dt), R = this.R;   // el reloj que tendrá la escena en este cuadro
    if (this.tipo === 'aporrea') {
      if (t < this.prox) return; this.prox = t + .1 + R() * .15;
      if (ESC.objetivo) { const o = ESC.objetivo(); if (o && o.toque) { this.toque(o.toque[0], o.toque[1]); return; } }
      const k = 1 + Math.floor(R() * 3); for (let i = 0; i < k; i++) this.tocar(60 + Math.floor(R() * 24), t, ESC.paso && ESC.paso.pads);
      return;
    }
    for (let vuelta = 0; vuelta < 6; vuelta++) {   // a velocidad alta, varias notas por cuadro
    const o = ESC.objetivo ? ESC.objetivo() : null; if (!o) { this.plan = null; return; }
    if (this.plan && this.plan.id === o.id && this.plan.hecho && t > this.plan.t + 3) this.plan = null;   // M8: si el objetivo sigue ahí (el toque se lo comió una tarjeta o falló), vuelve a intentar como un niño
    if (!this.plan || this.plan.id !== o.id) {
      const err = !o.libre && R() < this.errorP;
      let tt = o.reaccion ? o.t + .45 + R() * .45 : o.t + (R() + R() + R() - 1.5) * .045;
      let n = o.n; if (err) { if (o.pad || o.tempo) tt += .4; else n = n + (R() < .5 ? 2 : -1); }
      this.plan = { id: o.id, t: tt, n, toque: o.toque, hecho: false };
    }
    if (!this.plan.hecho && t >= this.plan.t) { this.plan.hecho = true; if (this.plan.toque) { this.toque(this.plan.toque[0], this.plan.toque[1]); return; } this.tocar(this.plan.n, this.plan.t, o.pad); } else return;
    }
  },
  tocar(n, t, pad) {
    this.notas++; T_SIM5 = t;
    try {
      if (this.fuente === 'midi') { Entrada.bytes([0x90, n, 96], performance.now(), 'midi', 'Piano simulado'); Entrada.bytes([0x80, n, 0], performance.now(), 'midi', 'Piano simulado'); }
      else if (pad) { const [px, py, w, h] = PADS5[n % 2]; this.toque(px + w / 2, py + h / 2, true); }
      else { const negra = !BLANCAS5.includes(((n - 60) % 12 + 12) % 12); this.toque(xDeTecla(n), TECLADO5.y + TECLADO5.h * (negra ? .3 : .82), true); }
    } finally { T_SIM5 = null; }
  },
  toque(x, y) {   // un toque de verdad en el lienzo (pasa por el mismo camino que el dedo)
    const r = lienzo5.getBoundingClientRect(), cx = r.left + (x * ESCALA5 + OFX5) / DPR5, cy = r.top + (y * ESCALA5 + OFY5) / DPR5;
    lienzo5.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, bubbles: true, pointerId: 7, isPrimary: true }));
    dispatchEvent(new PointerEvent('pointerup', { clientX: cx, clientY: cy, bubbles: true, pointerId: 7, isPrimary: true }));
  },
};
let ESCENA_CARTA = null, ESCENA_ORGANO = null;
function iniciarDia5() {
  definirParadas5(); definirDuelo5(); ESCENA_CARTA = crearCarta5(); ESCENA_ORGANO = crearOrgano5(); ESCENA_PREMIO5 = crearPremioDuelo5(); setTimeout(() => iniciarModos5(), 0);
  LUGARES5.belen.hudFijo = ctx => { if (!LUGARES5.belen.auto && MUSICA5.activa) hudMusica5(ctx); };
  setTimeout(() => { definirJuegos5(); ESCENA_BIBLIO5 = crearBiblioteca5(); iniciarBelenArriba5(); if (typeof iniciarCasas5 === 'function') iniciarCasas5(); }, 0);
}
// =====================================================================
//  LA MÚSICA DE BELÉN QUE DESPIERTA: el villancico del día en bucle, en estilo de época;
//  suma un instrumento por cada pedazo dominado: (dormida: colchón y una cajita) → flauta pastoril → cuerdas suaves
//  → campanitas → bajo en pizzicato → arpa.  Suena al pasear por Belén y sus casas; calla en las paradas.
// =====================================================================
const MUSICA5 = {
  activa: false, id: null, nivel: 0, t0: 0, vuelta: 0, i: 0, ev: null, len: 0,
  nivelDe(id) { return Math.min(5, Math.round(rinconesDespiertos5() * 5 / 8)); },   // M5: crece con cada rincón despierto
  preparar(id) {
    const V = VILLANCICOS5[id], ver = versionDe5(id), ev = [], CP = V.compas, b = 60 / (V.bpm * .9);
    let beat = 0, compasIni = []; const an = V.pedazos[ver[0]].anac || 0, ent = an ? CP - an : 0; beat = ent;
    ver.forEach(k => V.pedazos[k].notas.forEach(x => { ev.push({ b: beat, n: x.n, d: x.d }); beat += x.d; }));
    const ac = []; ver.forEach(k => ac.push(...V.pedazos[k].ac));
    const total = Math.ceil((beat + 1) / CP) * CP;
    for (let c = 0; c * CP < total; c++) ev.push({ b: c * CP + (an ? CP : 0), acorde: ac[c] || ac[ac.length - 1] || 'C', c });
    ev.sort((p, q) => p.b - q.b);
    this.ev = ev; this.len = total + CP; this.b = b; this.CP = CP;
  },
  iniciar(id) { if (!SON5.listo) return; if (this.activa && this.id === id) return; this.id = id; this.nivel = this.nivelDe(id);
    const m = m2_(); if (m) { m.nivelMusica = m.nivelMusica || {}; if (this.nivel > (m.nivelMusica[id] || 0)) { m.nivelMusica[id] = this.nivel; GUARDA.guardar(); voz5('bach-despierta', { hito: true }); } }
    if (!LUGARES5.belen.auto) vozPrimeras5('belen', 1, 'bach-belen', { hito: true }); this.preparar(id); this.t0 = KitSonido.ahora() + .3; this.vuelta = 0; this.i = 0; this.activa = true; },
  parar() { this.activa = false; },
  paso() {
    const B = LUGARES5.belen, aqui = ESC && (ESC === B || (ESC.def && /^b-/.test(ESC.def.id)));
    if (!aqui || !SON5.listo || !GUARDA.perfil()) { if (this.activa) this.parar(); return; }
    const m = m2_(); const id = (m && diaHoy5().cancion) || Object.keys(m.dias || {}).sort().map(k => m.dias[k].cancion).filter(Boolean).pop() || 'jingle';
    if (!this.activa || this.id !== id) this.iniciar(id);
    if (!this.activa) return;
    const K = KitSonido, ahora = K.ahora(), I = K.instrumentos, bus = K.bus('musica'), b = this.b, nv = this.nivel;
    let guard = 0;
    while (guard++ < 40) {
      if (this.i >= this.ev.length) { this.i = 0; this.vuelta++; this.nivel = this.nivelDe(this.id); }
      const e = this.ev[this.i], t = this.t0 + (this.vuelta * this.len + e.b) * b;
      if (t > ahora + .3) break; this.i++; if (t < ahora - .05) continue;
      if (e.acorde) {
        const ac = ACORDES5[e.acorde] || ACORDES5.C, barra = this.CP * b;
        I.pad(bus, ac.map(x => x + 12), t, barra * .98, nv >= 2 ? .16 : .22);                                   // colchón (siempre, muy bajo)
        if (nv >= 2) I.cuerdas(bus, ac.map(x => x + 12), t, barra * .98, .32);                                  // cuerdas suaves
        if (nv >= 3) I.celesta(bus, ac[0] + 36, t, null, .26);                                                // campanitas en el uno
        if (nv >= 4) { I.pizz(bus, ac[0] - 12, t, b, .6); if (this.CP > 2) I.pizz(bus, ac[2] - 12, t + 2 * b, b, .35); }   // bajo en pizzicato
        if (nv >= 5) for (let q = 0; q < this.CP * 2; q++) I.arpa(bus, ac[q % 3] + 12 + (q > 2 ? 12 : 0), t + q * b / 2, b, .28);   // arpa
      } else {
        if (nv === 0) { if (e.b < 8) I.celesta(bus, e.n + 12, t, null, .18); }                                  // dormida: la cajita apenas insinúa
        else { I.arpa(bus, e.n + 12, t, Math.min(.5, e.d * b), .42); I.pizz(bus, e.n + 24, t, .2, .16); }      // clavecín suave (arpa corta + pizzicato)
      }
    }
  },
};
// =====================================================================
//  EL CONSERVATORIO: duelo de eco con el pastorcito de la flauta (noble: aplaude cuando ganas).
//  Él toca, tú respondes. Tres corazones (solo aquí): un eco fallido cuesta uno. Ganar: insignia de la estrella
//  + la llave a la ciudad de enero (Maelzel, todavía en silueta en el mapa). Fanfarria corta.
// =====================================================================
function sprPastorcito(P = {}) {
  return chico({ id: 'pastorcito' + (P.toca ? 't' : '') + (P.ojos || ''), pelo: '#3a2418', pelo2: '#5a3a22', ropa: '#e8d6a0', ropa2: '#c9a86a', zapato: '#7a4a24', ojos: P.ojos || 'abierto', boca: P.toca ? 'picaro' : 'grande',
    extra: g => { g.R(4, 1, 18, 4, '#fffaf4'); g.R(4, 4, 3, 9, '#fffaf4'); g.R(19, 4, 3, 9, '#fffaf4'); g.R(5, 3, 16, 1, '#2a4b9b'); g.R(7, 18, 12, 1, '#2a4b9b');   // pañuelo y faja
      if (P.toca) { g.R(13, 14, 12, 2, '#9a6038'); g.px(16, 14, INK); g.px(19, 14, INK); g.px(22, 14, INK); g.R(18, 15, 3, 2, '#ffd6b8'); }                // flauta en la boca
      else { g.R(19, 16, 2, 12, '#9a6038'); g.px(19, 19, INK); g.px(19, 22, INK); } } });
}
const MOT_DUELO5 = [
  [q5(64), q5(67), h5(64)], [q5(60), q5(64), q5(67), q5(64)], [h5(67), q5(64), q5(62)], [q5(60), q5(62), q5(64), q5(65), w5(67)], [q5(67), q5(65), q5(64), q5(62), h5(60), h5(64)],
];
function definirDuelo5() {
  crearParada5('conservatorio', P => {
    P.corazones = 3; P.ticPos = [100, 300, 4];
    return {
      duelo: true, vidas: 3, minimo: 0,
      pasos: motivos5(true).map(m => pasoLectura5(m, 'ritmo', { introCanto: 1, voz: 'flauta', corto: true })),
      decor: (P, ctx) => {
        const x = 1222, y = 596, toca = P.ticCanta > P.t, aplaude = P.fin && P.fin.gano;
        sombra(ctx, x, y, 30, .3); sprK(ctx, destacado5(sprPastorcito({ toca, ojos: aplaude ? 'feliz' : 'abierto' })), x, y + (aplaude ? -Math.abs(Math.sin(RELOJ * 8)) * 10 : 0), 4, { flip: true });
        if (toca) for (let i = 0; i < 2; i++) { const t = (RELOJ * .9 + i / 2) % 1; ctx.save(); ctx.globalAlpha = 1 - t; texto(ctx, '♪', x - 70 - t * 40, y - 150 - t * 50, { tam: 30, c: '#3fc7f0', borde: 4, bordeC: INK }); ctx.restore(); }
      },
    };
  });
}
function insigniaEstrella5(ctx, x, y, r, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2) * .05);
  ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5;
  ctx.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, q = i % 2 ? r * .9 : r; ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q); } ctx.closePath(); ctx.fillStyle = '#e6a21b'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, r * .74, 0, 7); ctx.fillStyle = rg(ctx, 0, 0, r, [[0, '#3a5bb0'], [1, '#1d3672']], -r * .3, -r * .3); ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
  estrella(ctx, 0, -2, r * .5, '#ffd046'); ctx.restore();
}
function llave5(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#e6a21b'; ctx.strokeStyle = INK; ctx.lineWidth = 3 / s;
  ctx.beginPath(); ctx.arc(-26, 0, 16, 0, 7); ctx.moveTo(-17, 0); ctx.arc(-26, 0, 7, 0, 7, true); ctx.fill('evenodd'); ctx.stroke();
  ctx.beginPath(); ctx.rect(-10, -4, 46, 8); ctx.rect(26, 4, 6, 10); ctx.rect(16, 4, 6, 7); ctx.fill(); ctx.stroke(); ctx.restore();
}
// la escena del premio: insignia de la estrella + llave de enero; fanfarria corta
function crearPremioDuelo5() {
  const S = { dia: true, t: 0, fx: fx5() };
  S.reloj = () => S.t;
  S.entrar = () => { S.t = 0; S.sono = false; S.fx.lista.length = 0; };
  S.dibujar = (ctx, dtR) => {
    const dt = pausado5() ? 0 : dtR; S.t += dt;
    if (!S.sono && S.t > .3) { S.sono = true; fanfarria5(); S.fx.estallar(LW5 / 2, 300, '#ffd046', 40, 1.5); }
    if (!S.llave && S.t > 1.8) { S.llave = true; voz5('bach-llave', { hito: true }); }
    if (!S.mael && S.t > 4.2 && (m2_() || {}).premioDuelo !== 'fa') { S.mael = true; vozPrimeras5('maelzel', 1, 'bach-maelzel', { hito: true }); }
    const q = Math.min(1, S.t * 1.6), e = 1 - Math.pow(1 - q, 3), fa = (m2_() || {}).premioDuelo === 'fa', ped = fondoPremio7(ctx, S.t), IX = LW5 / 2, IY = ped ? ped.y : 300, CY = ped ? 560 : 400;   /* M7: el pedestal ilustrado */
    if (!ped) { ctx.fillStyle = lg(ctx, 0, 0, 0, LH5, [[0, '#2a1840'], [1, '#1c1030']]); ctx.fillRect(0, 0, LW5, LH5); rayosLuz5(ctx, LW5 / 2, 300, S.t); }
    else { ctx.save(); ctx.globalAlpha = .5 + .2 * Math.sin(S.t * 3); brillo(ctx, IX, IY, ped.r * 1.5, '255,226,160'); ctx.restore(); }
    caja5(ctx, LW5 / 2 - 380, CY, 760, ped ? 216 : 270, { r: 26, borde: 6, sombra: 12, fondo: MARCA5.crema, cab: NC.MI, cabH: 18, alpha: Math.min(1, S.t * 2) });
    if (fa) { ctx.save(); ctx.translate(IX, IY); ctx.scale(.4 + .6 * e, .4 + .6 * e); insigniaEstrella5(ctx, 0, 0, 110, S.t); ctx.fillStyle = '#3a5bb0'; ctx.beginPath(); ctx.arc(0, 0, 66, 0, 7); ctx.fill(); clave(ctx, 'fa', -34, -40, 26, '#ffd046'); ctx.restore(); } else insigniaEstrella5(ctx, IX, IY, 40 + 70 * e, S.t);
    marcador5(ctx, fa ? 'Insignia del pastor' : 'Insignia de la estrella', LW5 / 2, CY + 66, 46, NC.MI);
    if (S.t > 1.6) { const k = Math.min(1, (S.t - 1.6) * 2); ctx.save(); ctx.globalAlpha = k; llave5(ctx, LW5 / 2 - 20, ped ? 690 : 556, 1.6); texto(ctx, fa ? 'Llave de la clave de fa: abre el Museo' : 'Enero · Maelzel', LW5 / 2, ped ? 744 : 628, { tam: 28, c: MARCA5.tinta, peso: 700 }); ctx.restore(); }
    S.fx.dibujar(ctx, dt);
    if (S.t > 5 && !S.ido) { S.ido = true; if (paradasMision5().includes('conservatorio') && !siguienteParada5() && !diaHoy5().completo) { irA(ESCENA_ORGANO, { tipo: 'fundido', dur: .9 }); return; } const B = LUGARES5.belen; B.auto = false; B.extraHud = null; B.alEntrar = null; irA(B, { tipo: 'iris', desde: puertaDe5('conservatorio').puerta.slice() }); }
  };
  S.tocar = () => { if (S.t > 2.5) S.t = 5; };
  S.nota = () => null; S.objetivo = () => null;
  return S;
}
function fanfarria5() {
  if (!SON5.listo) return; const K = KitSonido, I = K.instrumentos, t = K.ahora() + .05, bus = K.bus('efectos'), b = .16;
  [[0, [67]], [1, [67]], [2, [67]], [3, [72, 76, 79]]].forEach(([k, ns]) => ns.forEach(n => I.juno(bus, n, t + k * b * (k === 3 ? 1 : 1), k === 3 ? .9 : .13, .5)));
  K.percusion.timbal(bus, t, .7, 43); K.percusion.timbal(bus, t + 3 * b, .9, 48); K.percusion.platillo(bus, t + 3 * b, .5);
  [84, 88, 91, 96].forEach((n, i) => I.celesta(bus, n, t + 3 * b + .1 + i * .09, null, .3));
}
let ESCENA_PREMIO5 = null;
function dueloDisponible5() { return paradasMision5().includes('conservatorio'); }   // M5: el duelo solo en las misiones 7 y 14
// estadística por paso (para «le cuesta» en el informe): intentos, fallidos, mejor precisión
function estadistica5(S) {
  const m = m2_(); if (!m) return; m.stats = m.stats || {}; const k = S.o.clave || [NOMBRE_PARADA5[ESC && ESC.id] || '', S.o.titulo || '', ({ espera: 'espera', ritmo: 'a tu ritmo', tempo: 'a tempo' })[S.modo] + (S.pads ? ' en pads' : '') + (S.o.unaTecla ? ' en una tecla' : '')].filter(Boolean).join(' · ');
  const st = m.stats[k] || (m.stats[k] = { intentos: 0, fallidos: 0, mejor: 0, dia: '' }); st.intentos++; if (S.prec < .8) st.fallidos++; st.mejor = Math.max(st.mejor, +S.prec.toFixed(2)); st.dia = hoy5();
}
// en Belén: qué instrumentos ya despertaron en la música de la ciudad (uno por pedazo dominado)
function hudMusica5(ctx) {
  const nv = MUSICA5.nivel, V = VILLANCICOS5[MUSICA5.id], x0 = LW5 / 2 - 190, y = 24, IN = [['flauta', NC.SOL], ['cuerdas', NC.DO], ['campanas', NC.MI], ['bajo', NC.SI], ['arpa', NC.FA]];
  ctx.save(); rr(ctx, x0, y, 380, 70, 16); ctx.fillStyle = 'rgba(251,241,216,.92)'; ctx.fill(); ctx.lineWidth = 3.5; ctx.strokeStyle = '#2a1a3a'; ctx.stroke(); ctx.restore();
  texto(ctx, V ? V.titulo : '', LW5 / 2, y + 18, { tam: 17, c: '#7f3fc8', peso: 700 });
  IN.forEach(([n, c], i) => { const on = i < nv, x = x0 + 46 + i * 72, yy = y + 46;
    if (on) { ctx.save(); ctx.globalAlpha = .5 + .3 * Math.sin(RELOJ * 4 + i); brillo(ctx, x, yy - 2, 26, '255,224,130'); ctx.restore(); }
    ctx.beginPath(); ctx.arc(x - 18, yy - 2, 7, 0, 7); ctx.fillStyle = on ? c : 'rgba(58,36,20,.15)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
    texto(ctx, n, x - 8, yy - 1, { tam: 15, c: on ? '#2a1a3a' : 'rgba(58,36,20,.35)', peso: on ? 700 : 500, al: 'left' }); });
  if (!nv) texto(ctx, 'dormida', x0 + 380 - 4, y + 18, { tam: 14, c: 'rgba(58,36,20,.5)', al: 'right', peso: 500 });
}
// motivos del coro (y del duelo): primero con una sola nota, luego dos, luego tres… solo las notas que ya conoce
function motivos5(largo) {
  const V = patronesDia5(diaPlan5(), 8, largo ? 11 : 5), out = [];
  V.forEach(p => { let b = 0; const a = [], z = []; p.forEach(x => { (b < 4 ? a : z).push(x); b += x.d; }); out.push(largo ? p : a); if (!largo) out.push(z.length && z.some(x => x.n) ? z : a); });
  return out.map(m => { const c = m.slice(); while (c.length && c[c.length - 1].n === 0) c.pop(); if (c[0] && c[0].n === 0) c[0] = { n: NOTA_PC5[conocidas5()[0]], d: c[0].d }; return c; }).filter(m => m.length);
}
// ---------- notas nuevas: antes de tocar una nota por primera vez, su tarjeta grande ----------
function notasNuevas5(S) { if (!S || S.tipo !== 'lectura' || S.pads) return []; const m = m2_(), vistas = (m && m.notasVistas) || []; return [...new Set(S.notas.map(x => x.n))].filter(n => n && conoce5(n) && !vistas.includes(n)).sort((a, b) => ORDEN_NOTAS5.indexOf(a % 12) - ORDEN_NOTAS5.indexOf(b % 12)); }
function dibujarNotaNueva5(ctx, P) {
  const R = P.presenta, n = R.lista[R.i], t = P.t - R.t0, q = Math.min(1, t * 3), e = 1 - Math.pow(1 - q, 3), col = COLOR_NOTA5(n), nom = NOMBRE_NOTA5(n), aguda = n >= 72;
  ctx.save(); ctx.fillStyle = 'rgba(28,16,48,' + .62 * q + ')'; ctx.fillRect(0, 0, LW5, LH5); ctx.restore();
  const X = 150, Y = 112 + (1 - e) * 40, W = 980, H = 482;
  pergamino5(ctx, X, Y, W, H, q);
  ctx.save(); ctx.globalAlpha = q;
  cinta5(ctx, 'Nota nueva', LW5 / 2 - 120, Y - 4, 240);
  // el nombre, enorme, en su color
  const lat = 1 + .04 * Math.sin(t * 5); ctx.save(); ctx.translate(X + 250, Y + 250); ctx.scale(lat, lat);
  brillo(ctx, 0, -10, 190, '255,224,150');
  ctx.font = '700 ' + (nom.length > 2 ? 150 : 190) + 'px Crimson'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(nom, 0, 0); ctx.fillStyle = col; ctx.fillText(nom, 0, 0); ctx.restore();
  texto(ctx, (aguda ? 'la ' + nom + ' de arriba' : 'esta es ' + nom) + (DEDO5[n] ? ' · dedo ' + DEDO5[n] : ''), X + 250, Y + 392, { tam: 30, c: '#2a1a3a', peso: 600 });
  // Bach la canta (con sus notitas) y después te toca a ti
  { const canta = t > .8 && t < 3.2 && !R.ok, bx = X + 64, by = Y + 470; sombra(ctx, bx, by, 26, .2); sprK(ctx, sprBachElegante(), bx, by - (canta ? Math.abs(Math.sin(t * 6)) * 4 : 0), 2.1); if (canta) for (let i = 0; i < 2; i++) { const k = (t * .9 + i / 2) % 1; ctx.save(); ctx.globalAlpha = 1 - k; texto(ctx, '♪', bx + 40 + k * 40, by - 120 - k * 40, { tam: 30, c: col, borde: 4, bordeC: INK }); ctx.restore(); }
    if (canta) texto(ctx, 'Bach la canta…', bx + 50, by - 112, { tam: 20, c: '#7f3fc8', peso: 700, al: 'left' }); }
  // su lugar en el pentagrama
  const sx = X + 520, sy = Y + 88, gap = 20, nx = sx + 240;
  pentagrama(ctx, sx, sy, 350, gap, [{ n: LETRA_EN5(n), f: 'redonda', c: true, x: nx, halo: 'rgba(255,224,130,' + (.5 + .4 * Math.sin(t * 6)) + ')' }], {});
  const ny = sy + 4 * gap - paso(LETRA_EN5(n), 'sol') * gap / 2;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(nx + 30, ny); ctx.lineTo(sx + 350 + 10, ny); ctx.stroke(); ctx.restore();
  texto(ctx, nom, sx + 350 + 44, ny, { tam: 26, c: col, borde: 6, bordeC: INK });
  // y su tecla, que brilla
  // el piano de la tarjeta: UNA octava (más grande y clara)
  const base = n >= 72 ? 72 : 60, kx = X + 560, ky = Y + 280, kw = 350, kh = 160, luz = {}; luz[n - base] = col;
  if (Math.sin(t * 6) > -.3 || R.ok) teclado(ctx, kx, ky, kw, kh, { blancas: 7, luces: luz, colores: true }); else teclado(ctx, kx, ky, kw, kh, { blancas: 7, colores: true });
  const tx = kx + (() => { const s2 = n - base, wi = BLANCAS5.indexOf(s2 % 12); return wi >= 0 ? (wi + .5) * kw / 7 : (BLANCAS5.indexOf(s2 % 12 - 1) + 1) * kw / 7; })();
  const by = ky - 26 + Math.sin(t * 6) * 6; ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx - 14, by - 22); ctx.lineTo(tx + 14, by - 22); ctx.lineTo(tx, by); ctx.closePath(); ctx.fill(); ctx.stroke();
  if (R.ok) texto(ctx, '¡Esa es!', X + 250, Y + 442, { tam: 34, c: '#c23345', borde: 6, bordeC: '#fffaf4' });
  else if (t > 3.2) texto(ctx, '¡Ahora tú: tócala!', X + 290, Y + 442, { tam: 28, c: '#c23345', peso: 700 });
  ctx.restore();
}
// ---------- mini-anuncio al entrar a cada parada (≈5 s; se salta tocando) ----------
const QUE_HACEMOS5 = { patio: 'Respiramos con Tic y tocamos libre.', coro: 'Tic canta y tú le respondes.', salon: 'Algo nuevo con Bach.', taller: 'Inventas tu música con la banda.', conservatorio: 'Duelo de eco con el pastorcito.', batalla: 'Eco con el pastorcito: tres corazones.', partituras: 'Lee y toca a primera vista: tres corazones.', concierto: 'Tu concierto para la familia.', kiosco: 'La banda toca; tú llevas el pulso.', patioL: 'Respiramos con Tic y tocamos libre.', coroL: 'Tic canta y tú le respondes.', teatroL: 'La canción de la semana.', tallerL: 'Inventa: todo suena bonito.', ritmo: 'Ritmos en los tambores: tres corazones.', gimnasio: 'Dedos rápidos: el tempo sube.' };
function dibujarAnuncio5(ctx, P) {
  const t = P.t - P.anuncio.t0, dur = P.anuncio.dur || .01, q = Math.min(1, t * 3, Math.max(0, (dur - t) * 3)), e = 1 - Math.pow(1 - Math.min(1, t * 2.5), 3);
  ctx.save(); ctx.globalAlpha = q; ctx.fillStyle = 'rgba(28,16,48,.5)'; ctx.fillRect(0, 0, LW5, LH5);
  const col = COLOR_PARADA5[P.id], w = 760, x = LW5 / 2 - w / 2, y = 190 + (1 - e) * 60;
  pergamino5(ctx, x, y, w, 250);
  ctx.save(); rr(ctx, x, y, w, 250, 20); ctx.clip(); ctx.fillStyle = col; ctx.globalAlpha = .9 * q; ctx.fillRect(x, y, w, 18); ctx.restore();
  titulo5(ctx, NOMBRE_PARADA5[P.id], LW5 / 2, y + 86, 64, '#2a1a3a');
  const linea = P.id === 'teatro' ? 'Hoy: ' + (VILLANCICOS5[P.cancion] || {}).titulo + ', pedazo por pedazo.' : QUE_HACEMOS5[P.id];
  texto(ctx, linea || '', LW5 / 2, y + 160, { tam: 32, c: '#2a1a3a', peso: 600 });
  // el camino del día: cinco tubos, el de hoy brillando
  if (PARADAS5.includes(P.id)) PARADAS5.forEach((id, k) => { const on = id === P.id, xx = LW5 / 2 - 100 + k * 50; ctx.beginPath(); ctx.arc(xx, y + 214, on ? 11 : 7, 0, 7); ctx.fillStyle = diaHoy5().paradas[id] ? COLOR_PARADA5[id] : on ? COLOR_PARADA5[id] : 'rgba(58,36,20,.18)'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke(); });
  ctx.restore();
}
// ---------- mini repaso de un concepto (10–20 s), en medio de la sesión ----------
function pasoRepaso5() {
  const C = ['negra', 'blanca', 'pulso'][diasHechos5() % 3], S = { tipo: 'repaso', eval: false, concepto: C };
  const PAT = { negra: [1, 1, 1, 1], blanca: [2, 2], pulso: [1, 1, 1, 1] }[C];
  S.iniciar = P => { S.listo = false; S.t0 = P.t; const nb = Math.ceil(P.pulso.beat(P.t) + .2); P.pulso.anclar(P.pulso.tDe(nb), tempoDia5(), 4); S.ev = []; for (let v = 0; v < 3; v++) { let b = 4 + v * 4; PAT.forEach(d => { S.ev.push({ b, d, v }); b += d; }); } S.i = 0; voz5('repaso-' + C, { forzar: true }); marca5('repaso ' + C); };
  S.paso = P => { const bt = P.pulso.beat(P.t); while (S.i < S.ev.length && bt >= S.ev[S.i].b) { const e = S.ev[S.i++]; if (C === 'pulso') SON5.palma(.7); else { SON5.ticCanta(NOTA_PC5[conocidas5()[0]], e.d * P.pulso.b() * .85); P.ticCanta = P.t + e.d * P.pulso.b() * .8; } S.brilla = { e, t: P.t }; } if (bt > 17) S.listo = true; };
  S.dibujar = (P, ctx) => {
    const X = 260, Y = 150, W = 760, H = 400, bt = P.pulso.beat(P.t); pergamino5(ctx, X, Y, W, H);
    titulo5(ctx, 'Escucha', LW5 / 2, Y + 50, 46, '#7f3fc8');
    texto(ctx, { negra: 'La negra dice «tan»', blanca: 'La blanca dice «taaan»', pulso: 'El pulso late como un corazón' }[C], LW5 / 2, Y + 100, { tam: 30, c: '#2a1a3a', peso: 600 });
    const n = PAT.length; let b = 0;
    PAT.forEach((d, k) => { const x = X + 140 + (b + d / 2 - .5) * (W - 280) / 4 + 30, y = Y + 250, on = S.brilla && P.t - S.brilla.t < .3 && S.ev.indexOf(S.brilla.e) % n === k, s = on ? 1.18 : 1;
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      if (C === 'pulso') corazon(ctx, 0, -10, 40, on ? '#ff5a7a' : 'rgba(255,90,122,.35)');
      else { cabeza(ctx, 0, 30, 28, C, on ? COLOR_NOTA5(NOTA_PC5[conocidas5()[0]]) : null); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(17, 26); ctx.lineTo(17, -80); ctx.stroke(); }
      ctx.restore(); texto(ctx, C === 'blanca' ? 'taaan' : 'tan', x, Y + 340, { tam: on ? 34 : 28, c: on ? '#c23345' : '#2a1a3a', peso: 700 }); b += d; });
    if (bt < 4) texto(ctx, 'escucha a Tic', LW5 / 2, Y + 380, { tam: 22, c: '#7a4a2a', peso: 500 });
  };
  return S;
}
// el título del juego (intro del primer día)
function dibujarTitulo5(ctx, t) {
  const q = Math.min(1, t / 1.2), cx = LW5 / 2;
  ctx.save(); ctx.globalAlpha = q; brillo(ctx, cx, 300, 380 + Math.sin(t * 1.5) * 20, '255,214,150'); ctx.restore();
  // la clave de sol grande, de oro, que se asoma
  ctx.save(); ctx.globalAlpha = Math.min(1, t / 1.8); clave(ctx, 'sol', cx - 330, 170, 30, '#d9a930'); ctx.restore();
  const e = 1 - Math.pow(1 - Math.min(1, t / 1.4), 3);
  ctx.save(); ctx.globalAlpha = e; ctx.translate(cx + 40, 250 + (1 - e) * 30);
  ctx.font = '700 128px Crimson'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 14; ctx.strokeStyle = '#2a1a3a'; ctx.strokeText('Mi Piano', 0, 0);
  ctx.fillStyle = lg(ctx, 0, -60, 0, 60, [[0, '#fff3b0'], [.5, '#ffd046'], [1, '#d9a930']]); ctx.fillText('Mi Piano', 0, 0); ctx.restore();
  const e2 = Math.max(0, Math.min(1, (t - 1) / 1.2));
  ctx.save(); ctx.globalAlpha = e2; ctx.fillStyle = '#d9a930'; ctx.fillRect(cx - 250, 342, 500, 3); ctx.restore();
  ctx.save(); ctx.globalAlpha = e2; titulo5(ctx, 'El viaje de Bach', cx + 40, 400, 64, '#fffaf4', { borde: 9, bordeC: '#2a1a3a' }); ctx.restore();
  const e3 = Math.max(0, Math.min(1, (t - 3.6) / 1.2));
  ctx.save(); ctx.globalAlpha = e3; ctx.font = 'italic 600 34px Crimson'; ctx.textAlign = 'center'; ctx.fillStyle = '#e9e4ee'; ctx.fillText('Cada nota es un paso del camino.', cx, 520); ctx.restore();
  // notitas que suben
  for (let i = 0; i < 10; i++) { const k = (t * .25 + i / 10) % 1, x = 160 + i * 106 + Math.sin(t + i) * 14; ctx.save(); ctx.globalAlpha = Math.sin(k * Math.PI) * .7; texto(ctx, i % 2 ? '♪' : '♫', x, 720 - k * 380, { tam: 30, c: Object.values(NC)[i % 7], borde: 3, bordeC: INK }); ctx.restore(); }
}
// el silencio de negra (gesto: «sh»)
function silencioGlifo5(ctx, x, y, s, c) { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = s * .32; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x - s * .3, y - s * 1.3); ctx.lineTo(x + s * .35, y - s * .5); ctx.lineTo(x - s * .3, y + s * .2); ctx.lineTo(x + s * .35, y + s * .9); ctx.quadraticCurveTo(x - s * .5, y + s * .6, x - s * .1, y + s * 1.5); ctx.stroke(); ctx.restore(); }
function dedosDia5() { const o = {}; conocidas5().forEach(pc => { const n = NOTA_PC5[pc]; if (DEDO5[n]) o[n] = DEDO5[n]; }); return o; }
