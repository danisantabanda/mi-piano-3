// =====================================================================
//  MI PIANO 2 · F1 · capa de sonido del juego sobre KitSonido (si el audio no está, todo calla en paz)
// =====================================================================
const Snd = (function () {
  const K = window.KitSonido, S = { ok: false, pianoListo: false, ultimoAcorde: null };
  let musica = null;
  // mundos propios: la música gemela del valle (misma semilla, tono y tempo; apagada = nana, encendida = cumbia)
  K.mundos.valleCallado = { estilo: 'nana', tono: ['DO', 'mayor'], tempo: 88, compas: 4, mel: 'celesta', semilla: 707 };
  K.mundos.valleEncendido = { estilo: 'cumbia', tono: ['DO', 'mayor'], tempo: 88, compas: 4, mel: 'marimba', semilla: 707 };
  K.mundos.valleGloria = { estilo: 'worship', tono: ['DO', 'mayor'], tempo: 88, compas: 4, mel: 'juno', semilla: 707 };
  S.iniciar = function () {
    if (S.ok) { K.reanudar(); return; }
    try { K.iniciar({ perfil: 'tablet' }); S.ok = true; } catch (e) { S.ok = false; return; }
    // ¿hay un piano-datos.js al lado del HTML (Salamander Grand V3)? Si no, el piano horneado de respaldo.
    if (window.PIANO_SALAMANDER && window.PIANO_SALAMANDER.datos) cargarSalamander(window.PIANO_SALAMANDER).catch(e => { console.warn('Salamander', e); hornear(); });
    else hornear();
  };
  function hornear() { try { K.piano.hornear({ desde: 36, hasta: 96 }).then(() => { S.pianoListo = true; }); } catch (e) { } }
  // Salamander: base64 → decodeAudioData → zonas del piano del kit (capas por velocity con fundido; transposición a la zona más cercana)
  function b64(s) { const bin = atob(s), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u.buffer; }
  function cargarSalamander(P) {
    const ctx = K.contexto(), man = P.manifiesto || {}, zonas = man.zonas || [];
    const dec = buf => new Promise((res, rej) => { const pr = ctx.decodeAudioData(buf, res, rej); if (pr && pr.then) pr.then(res, rej); });
    return Promise.all(zonas.map(z => P.datos[z.archivo] ? dec(b64(P.datos[z.archivo])).then(buffer => ({ z, buffer })).catch(() => null) : Promise.resolve(null))).then(lista => {
      const porNota = {};
      lista.filter(Boolean).forEach(({ z, buffer }) => { (porNota[z.nota] = porNota[z.nota] || []).push({ hasta: z.velMax || (man.capas && man.capas[z.capa]) || 127, buffer, ganancia: 1 }); });
      const notas = Object.keys(porNota).map(Number).sort((a, b) => a - b);
      if (!notas.length) throw new Error('sin muestras');
      const PI = K.piano; PI.zonas = {}; notas.forEach(n => { PI.zonas[n] = porNota[n].sort((a, b) => a.hasta - b.hasta); });
      PI.notasZona = notas; PI.filtroVel = false; PI.fuente = 'salamander'; PI.listo = true;
      S.pianoListo = true; S.salamander = { notas: notas.length, muestras: lista.filter(Boolean).length, capas: Math.max(...notas.map(n => PI.zonas[n].length)) };
    });
  }
  S.cargarSalamander = P => S.ok && P && P.datos && !S.salamander ? cargarSalamander(P).catch(e => console.warn('Salamander', e)) : null;
  S.estadoPiano = () => { const PI = K.piano; return { fuente: PI.fuente, listo: !!S.pianoListo, zonas: PI.notasZona ? PI.notasZona.length : 0, salamander: S.salamander || null }; };
  S.ctx = () => S.ok ? K.contexto() : null;
  S.corre = () => { const c = S.ctx(); return !!(c && c.state === 'running'); };
  S.ahora = () => S.ok ? K.ahora() : performance.now() / 1000;
  S.lat = () => S.ok ? K.latenciaSalida() : 0;
  const seguro = fn => { if (!S.ok) return; try { return fn(); } catch (e) { console.warn('sonido', e); } };
  // la nota del niño (pantalla / teclado del PC); el piano MIDI suena solo
  S.piano = (n, fuerza = 90, cuando) => seguro(() => { if (S.pianoListo) return K.piano.tocar(n, fuerza, cuando); return K.instrumentos.ep(K.bus('piano'), n, cuando == null ? K.ahora() : cuando, .6, fuerza / 127 * .8); });
  S.soltar = (n, cuando) => seguro(() => { if (S.pianoListo) K.piano.soltar(n, cuando); });
  S.premio = null; // sonido ganado en el cofre para el teclado de pantalla ('marimba' | 'celesta' | null)
  S.notaPantalla = (n, fuerza) => { if (S.premio && S.ok) return seguro(() => K.instrumentos[S.premio](K.bus('piano'), n, K.ahora(), .9, fuerza / 127)); return S.piano(n, fuerza); };
  S.loro = (n, cuando) => seguro(() => { const t = cuando == null ? K.ahora() + .01 : cuando; K.instrumentos.flauta(K.bus('efectos'), n + 12, t, .32, .75); K.instrumentos.celesta(K.bus('efectos'), n + 12, t, null, .25); });
  S.acierto = () => seguro(() => K.efectos.acierto());
  S.error = () => seguro(() => K.efectos.error());
  S.racha = () => seguro(() => K.efectos.racha3());
  S.perfecto = () => seguro(() => K.efectos.perfecto());
  S.pista = n => seguro(() => K.efectos.pista(n));
  S.cofre = () => seguro(() => K.efectos.cofre());
  S.desbloqueo = () => seguro(() => K.efectos.desbloqueo());
  S.transicion = () => seguro(() => K.efectos.transicion());
  S.boton = t => seguro(() => K.efectos.boton(t));
  S.estrella = i => seguro(() => K.efectos.estrella(i));
  S.palitos = (t, v) => seguro(() => K.percusion.palitos(K.bus('banda'), t, v));
  S.tonalidad = (r, m) => seguro(() => K.tonalidad(r, m || 'mayor'));
  S.director = op => S.ok ? seguro(() => K.director(op)) : null;
  S.musica = function (nombre) {
    if (!S.ok) return; if (musica === nombre && K.musica.actual() === nombre) return;
    musica = nombre; seguro(() => { const m = K.mundos[nombre]; K.tonalidad(m.tono[0], m.tono[1]); K.musica.tocar(nombre); });
  };
  S.pararMusica = () => { musica = null; seguro(() => K.musica.parar(.5)); };
  // el "pulso" de la música de menú (para que todo baile en el mapa)
  S.tempoMusica = () => { const m = musica && K.mundos[musica]; return m ? m.tempo : 88; };
  return S;
})();
