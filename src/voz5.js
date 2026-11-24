// =====================================================================
//  MI PIANO 3 · M3 · Voz5: las voces del guion de Belén (voz/guion-belen.json), con las reglas del guion v1 de Mi Piano 2
//  - Las voces son opcionales: voces/manifiesto.js (escrito por empacar_mipiano2.py) define
//    window.VOCES = { "<id>": { g: "<grupo>", d: <segundos> }, … } y cada audio vive en voces/<id>.ogg.
//    Si no está el manifiesto o falta un audio, no suena nada y el juego sigue igual (respaldo: el gesto).
//  - Nunca bloquea (nada espera a que termine). Al tocar una nota la voz BAJA un poco (M7b: ya no se corta) y vuelve sola.
//  - Una frase por evento, sin cola: si ya suena una, gana la de mayor prioridad y la otra se descarta.
//  - ≤ 4 s (salvo un momento de historia que el niño pidió: el 🔊 del álbum, las viñetas del jefe).
//  - Los errores no tienen voz. Nunca se pregunta nada.
//  - Variantes de cada grupo por bolsa barajada (ninguna se repite hasta que salen todas; nunca la misma dos seguidas).
//  - Mientras habla, la música y la banda bajan 8 dB y vuelven en 300 ms.
//  - Presupuesto: hitos (bienvenida, jefe ganado, cofre, día cumplido, región nueva, concierto) siempre;
//    lo demás, máx. 1 frase cada 25 s, 4 por camino del día (David 3), y en estudio libre 1 cada 2 min.
// =====================================================================
const Voz5 = (function () {
  const G = window.GUION || {};                      // id → { g, t (texto), p (personaje), m (dur_max) }
  const pregunta = id => /[¿?]/.test((G[id] || {}).t || '');   // nunca se le pregunta nada al niño: esas variantes no suenan
  const porGrupo = {}; Object.entries(G).forEach(([id, f]) => { if (!pregunta(id)) (porGrupo[f.g] = porGrupo[f.g] || []).push(id); });
  const ENFRIA = { 'rx-bien': 25, 'rx-fantastico': 40, 'ay-demuestra': 12, 'ay-juntos': 12, 'ay-calma': 20 };
  const PROB = { 'rx-bien': .25, 'rx-fantastico': .6 };
  const V = {
    activa: true, subtitulos: false, quien: 'sarah', estado: null,     // estado persistente por perfil (lo guarda la app)
    sonando: null, ultimaFin: -1e9, ultimaInicio: -1e9, enCamino: false, gastadas: 0, libreDesde: -1e9, oyentes: [],
    registro: [],                                    // lo que sonó (o habría sonado): para las pruebas y el panel
  };
  const ahora = () => performance.now() / 1000;
  const hay = () => !!(window.VOCES && typeof window.VOCES === 'object');
  V.disponibles = () => hay() ? Object.keys(window.VOCES).length : 0;
  V.ruta = id => 'voces/' + id + '.ogg';
  // ---------- bolsas barajadas ----------
  function sacar(grupo, filtro) {
    const st = V.estado || (V.estado = {}); st.bolsas = st.bolsas || {}; st.ult = st.ult || {};
    const V0 = window.VOCES || {}, nueva = Object.keys(G).filter(x => G[x].r && V0[x]).map(x => G[x].r);   // M5: una frase rehecha (Baj, cuá) reemplaza a la vieja cuando ya está grabada
    let ids = (porGrupo[grupo] || []).filter(id => (!filtro || filtro(id)) && !nueva.includes(id) && (!G[id].r || V0[id])); if (!ids.length) return null;
    const clave = grupo + (filtro ? ':' + ids.join(',') : '');
    let b = (st.bolsas[clave] || []).filter(id => ids.includes(id));
    if (!b.length) { b = ids.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } if (b.length > 1 && b[0] === st.ult[grupo]) b.push(b.shift()); }
    const id = b.shift(); st.bolsas[clave] = b; st.ult[grupo] = id; return id;
  }
  // ---------- reproducir (elemento <audio>: funciona igual desde file:// y desde la PWA) ----------
  const cache = {};
  function audioDe(id) { if (cache[id]) return cache[id]; const a = new Audio(); a.preload = 'auto'; a.src = V.ruta(id); a.addEventListener('error', () => { a._malo = true; }); cache[id] = a; return a; }
  V.precargar = ids => { if (!hay()) return; ids.forEach(id => { if (window.VOCES[id]) audioDe(id); }); };
  function ducking(on) {   // el nodo "duck" de cada bus del kit (independiente del nivel y de los fundidos de la música)
    try { const K = window.KitSonido; if (!K || !K.contexto || !K.contexto()) return; const t = K.ahora();
      ['musica', 'banda'].forEach(n => { const b = K.bus(n); if (!b || !b.duck) return; const g = b.duck.gain; g.cancelScheduledValues(t); g.setValueAtTime(g.value, t);
        if (on) g.setTargetAtTime(0.398, t, 0.03); else g.setTargetAtTime(1, t, 0.1); }); } catch (e) { }
  }
  function soltar(fundido) {
    const s = V.sonando; if (!s) return; V.sonando = null; clearTimeout(s.tope);
    const a = s.a, v0 = a.volume, t0 = performance.now(), ms = fundido == null ? 80 : fundido;
    const paso = () => { const k = (performance.now() - t0) / ms; if (k >= 1 || ms <= 0) { try { a.pause(); a.currentTime = 0; } catch (e) { } a.volume = 1; return; } a.volume = Math.max(0, v0 * (1 - k)); requestAnimationFrame(paso); };
    paso(); ducking(false); V.ultimaFin = ahora(); V.oyentes.forEach(f => { try { f(null); } catch (e) { } });
  }
  // M7b: al tocar, la voz baja (no se corta) y vuelve sola cuando el piano calla un momento
  V.bajar = function () { const s = V.sonando; if (!s) return; s.a.volume = .55; clearTimeout(V._sube); V._sube = setTimeout(() => { if (V.sonando === s) s.a.volume = 1; }, 900); };
  V.callar = function () { if (V.sonando && ahora() - V.sonando.t0 > .12) soltar(80); };   // (el mismo toque que la disparó no la corta)
  /* decir(grupo | id, o) — o = { hito, prioridad, historia, filtro(id), forzar } */
  V.decir = function (cual, o = {}) {
    if (!cual) return null;
    const grupo = G[cual] ? G[cual].g : cual, t = ahora();
    if (!G[cual] && !(porGrupo[grupo] || []).length) { if (hay() && window.VOCES[cual]) G[cual] = { g: cual, t: '', p: 'bach', m: window.VOCES[cual].d }; else return null; }   // ids fuera del guion (p. ej. versiculo-saul) si llegan grabados
    const pr = o.prioridad || (o.hito ? 5 : 1);
    if (V.sonando && V.sonando.pr >= pr) return null;                     // sin cola: la que suena gana (o empata)
    if (!o.hito && !o.forzar) {
      if (t - Math.max(V.ultimaInicio, V.ultimaFin - 3) < 25) return null;          // ≥ 25 s entre frases que no son hitos
      if (V.enCamino && V.gastadas >= (V.quien === 'david' ? 3 : 4)) return null;   // presupuesto del camino del día
      if (!V.enCamino && t - V.libreDesde < 120 && V.gastadasLibre >= 1) return null;
      const cd = ENFRIA[grupo]; const st = V.estado || {}; st.ultGrupo = st.ultGrupo || {};
      if (cd && t - (st.ultGrupo[grupo] || -1e9) < cd) return null;
      if (PROB[grupo] && Math.random() > PROB[grupo]) return null;
    }
    const id = G[cual] ? cual : sacarSiPuede(grupo, o); if (!id || pregunta(id)) return null;
    // sale de la bolsa: queda registrada aunque no haya audio (así el orden de variantes es real)
    const f = G[id] || {}; V.registro.push({ t: +t.toFixed(1), id, grupo, hito: !!o.hito, audio: !!(hay() && window.VOCES[id]) }); if (V.registro.length > 60) V.registro.shift();
    const st = V.estado || (V.estado = {}); st.ultGrupo = st.ultGrupo || {}; st.ultGrupo[grupo] = t;
    if (!o.hito) { if (V.enCamino) V.gastadas++; else { if (t - V.libreDesde >= 120) { V.libreDesde = t; V.gastadasLibre = 0; } V.gastadasLibre = (V.gastadasLibre || 0) + 1; } }
    V.ultimaInicio = t;
    if (!V.activa || !hay() || !window.VOCES[id]) { V.oyentes.forEach(fn => { try { fn({ id, texto: f.t, personaje: f.p, sinAudio: true, d: 2.2 }); } catch (e) { } }); return id; }
    const a = audioDe(id); if (a._malo) return id;
    if (V.sonando) soltar(60);
    const d = Math.min((window.VOCES[id].d || f.m || 3), o.historia ? 12 : 4);
    try { a.currentTime = 0; } catch (e) { } a.volume = 1;
    const pl = a.play(); if (pl && pl.catch) pl.catch(() => { a._noPudo = true; });
    ducking(true);
    V.sonando = { id, a, pr, t0: t, tope: setTimeout(() => { if (V.sonando && V.sonando.id === id) soltar(o.historia ? 120 : 150); }, d * 1000 + 60) };
    a.onended = () => { if (V.sonando && V.sonando.id === id) { clearTimeout(V.sonando.tope); V.sonando = null; ducking(false); V.ultimaFin = ahora(); V.oyentes.forEach(fn => { try { fn(null); } catch (e) { } }); } };
    V.oyentes.forEach(fn => { try { fn({ id, texto: f.t, personaje: f.p, d }); } catch (e) { } });
    return id;
  };
  function sacarSiPuede(grupo, o) { return sacar(grupo, o.filtro); }
  // una vez en la vida (por perfil): presentaciones, Mozart/Beethoven, enseñanzas
  V.vecesDe = k => ((V.estado || {}).veces || {})[k] || 0;
  V.contar = k => { const st = V.estado || (V.estado = {}); st.veces = st.veces || {}; st.veces[k] = (st.veces[k] || 0) + 1; };
  V.primeras = (k, n, fn) => { if (V.vecesDe(k) >= n) return null; const r = fn(); if (r) V.contar(k); return r; };
  V.empezarCamino = () => { V.enCamino = true; };
  V.estudioLibre = () => { V.enCamino = false; };
  V.reiniciarSesion = () => { V.gastadas = 0; };
  V.texto = id => (G[id] || {}).t || '';
  return V;
})();
window.Voz5 = Voz5;
// M7b · transparencia: lo que se ve = lo que suena. Si una frase está en el guion de voces, el texto en pantalla es el suyo
// (id exacto o grupo: el de la variante que sonó). Sin frase en el guion, el texto queda como está.
function textoDeVoz5(id, propio) { const G = window.GUION || {}; const f = id && (G[id] || G[id + '-01']); return f && f.t ? f.t : propio; }
// registro de lo que se muestra como «habla» en cada momento (para la prueba voz = texto)
const HABLA5 = [];
function habla5(txt) { if (!txt) return; const now = performance.now(), esc = typeof ESC !== 'undefined' ? ESC : null, e = HABLA5.find(x => x.txt === txt && x.esc === esc); if (e) e.t = now; else { HABLA5.push({ txt, t: now, esc }); if (HABLA5.length > 40) HABLA5.shift(); } }
