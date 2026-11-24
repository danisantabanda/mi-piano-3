// =====================================================================
//  MI PIANO 2 · F1 · entrada: piano MIDI (Web MIDI), teclado del computador y teclado de pantalla
//  Todo termina en Entrada._nota(n, fuerza, on, t, fuente) → los oyentes del juego.
//  Web MIDI: conexión en caliente, ignora el canal 10 (batería del acompañamiento), note-on con
//  velocidad 0 = note-off, pedal CC64.
// =====================================================================
const Entrada = (function () {
  const oy = [], E = { calib: {}, calibrando: null, ultimoDispositivo: null, piano: false, dispositivos: [], abajo: {}, ultima: 0, estado: 'sin-midi', simulado: false, ultimaNotaT: 0 };
  E.on = fn => oy.push(fn);
  E._nota = function (n, fuerza, on, t, fuente) {
    t = t == null ? performance.now() : t;
    // M7c: el mismo note-on repetido en <40 ms (teclado visto por dos puertos MIDI, o doble mensaje) se ignora
    if (on) { const prev = E.abajo[n]; if (prev && Math.abs(t - prev.t) < 40) return; E.abajo[n] = { t, fuerza }; E.ultimaNotaT = t; } else { if (!E.abajo[n]) return; delete E.abajo[n]; }
    const ev = { nota: n, fuerza: fuerza || 0, on, t, fuente, recibida: performance.now() };
    for (const f of oy) { try { f(ev); } catch (e) { console.error(e); } }
  };
  // el camino común de los bytes MIDI (el piano real y el niño simulado pasan por aquí)
  E.bytes = function (b, t, fuente = 'midi', disp = 'simulado') {
    if (!b || b.length < 2) return;
    const st = b[0] & 0xf0, canal = b[0] & 0x0f;
    if ((st === 0x90 || st === 0x80) && canal === 9) return;           // canal 10: batería del teclado
    E.ultimoDispositivo = disp;
    // calibración: "toca el DO del medio" (se traga esa nota)
    if (st === 0x90 && b[2] > 0 && E.calibrando) { const f = E.calibrando; E.calibrando = null; f(b[1], disp); return; }
    const n = b[1] + (E.calib[disp] || 0);                              // ajuste de octava guardado por nombre de piano
    if (st === 0x90 && b[2] > 0) E._nota(n, b[2], true, t, fuente);
    else if (st === 0x80 || (st === 0x90 && b[2] === 0)) E._nota(n, 0, false, t, fuente);
    else if (st === 0xb0 && b[1] === 64) { E.pedal = b[2] >= 64; }
  };
  function enganchar(acc) {
    const lista = [];
    acc.inputs.forEach(inp => { inp.onmidimessage = m => E.bytes(m.data, m.timeStamp || performance.now(), 'midi', inp.name || 'Piano MIDI'); if (inp.state !== 'disconnected') lista.push(inp.name || 'Piano MIDI'); });
    E.dispositivos = lista; E.piano = lista.length > 0 || E.simulado; E.estado = E.piano ? 'listo' : 'sin-teclado';
    E.alCambiar && E.alCambiar();
  }
  E.iniciarMidi = function () {
    if (!navigator.requestMIDIAccess) { E.estado = 'sin-soporte'; return Promise.resolve(); }
    return navigator.requestMIDIAccess({ sysex: false }).then(acc => { enganchar(acc); acc.onstatechange = () => enganchar(acc); }).catch(() => { E.estado = 'sin-permiso'; });
  };
  // teclado del computador: A S D F G H J K L = blancas (DO4…RE5), W E T Y U = negras; Z X C V B N M = octava grave
  const MAPA = { KeyA: 60, KeyW: 61, KeyS: 62, KeyE: 63, KeyD: 64, KeyF: 65, KeyT: 66, KeyG: 67, KeyY: 68, KeyH: 69, KeyU: 70, KeyJ: 71, KeyK: 72, KeyO: 73, KeyL: 74,
    KeyZ: 48, KeyX: 50, KeyC: 52, KeyV: 53, KeyB: 55, KeyN: 57, KeyM: 59 };
  E.mapaTeclas = MAPA;
  addEventListener('keydown', e => { const n = MAPA[e.code]; if (n == null || e.repeat || e.metaKey || e.ctrlKey) return; e.preventDefault(); E._nota(n, 90, true, e.timeStamp || performance.now(), 'teclado'); });
  addEventListener('keyup', e => { const n = MAPA[e.code]; if (n == null) return; E._nota(n, 0, false, e.timeStamp || performance.now(), 'teclado'); });
  return E;
})();

// =====================================================================
//  almacén: localStorage envuelto (en una ventana privada, o si falla, queda en memoria)
// =====================================================================
const Almacen = (function () {
  const CLAVE = 'mipiano2.f2', mem = {};
  function leer() { try { const v = localStorage.getItem(CLAVE); if (v) return JSON.parse(v); } catch (e) { } return mem[CLAVE] ? JSON.parse(mem[CLAVE]) : null; }
  function escribir(d) { const s = JSON.stringify(d); mem[CLAVE] = s; try { localStorage.setItem(CLAVE, s); } catch (e) { } }
  function borrar() { delete mem[CLAVE]; try { localStorage.removeItem(CLAVE); } catch (e) { } }
  return { leer, escribir, borrar };
})();
