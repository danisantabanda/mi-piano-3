// =====================================================================
//  M5 · MISIONES (no días reales): los 14 pasos de la progresión inductiva son 14 misiones.
//  La historia: Belén se prepara para Nochebuena; cada misión despierta un rincón; la final es el concierto en el pesebre.
//  Lugares que se abren con misiones, LLAVES (flauta, clave de fa, un instrumento, un reto) y corcheas doradas.
// =====================================================================
const MISIONES5 = PLAN_BELEN5.map((p, k) => ({ n: k + 1, nuevo: p[4], duelo: k === 6 || k === 13 }));
// lo que despierta al completar cada misión (0 = desde la primera exploración)
const DESPIERTA5 = [
  { rincones: ['campanas', 'estrella'], lugares: ['salon', 'patio', 'coro', 'teatro', 'taller', 'torre', 'casa', 'luthier'], txt: 'Belén duerme. Las campanas y la estrella ya te esperan.' },
  { rincones: ['pastor'], lugares: ['ritmo'], txt: 'Despertó el pastor: toca su eco. Y se abrió la Casa del ritmo.' },
  { rincones: ['ovejas'], txt: 'Las ovejas del corral quieren que las cuentes con negras.' },
  { rincones: ['pozo'], lugares: ['conservatorio'], txt: 'El pozo del eco devuelve tu música.' },
  { rincones: ['vecina'], lugares: ['biblioteca'], txt: 'La vecina canta: ¿qué nota es? Y abrió la Biblioteca.' },
  { rincones: ['posada'], txt: 'La posada tiene una contraseña de ritmo.' },
  { rincones: ['ronda'], txt: 'Los niños de Belén juegan a la ronda.' },
  { txt: 'Ganaste el duelo: la llave de la clave de fa abre el Museo.' },
  { visita: 'pastores', txt: 'Los pastores bajan del monte hacia el pesebre.' },
  { txt: 'La banda afina en el kiosco.' },
  { lugares: ['sala'], txt: 'Se abrió la Sala de conciertos.' },
  { visita: 'angel', txt: 'Un ángel canta sobre el pesebre.' },
  { visita: 'reyes', txt: 'Unos sabios siguen la estrella.' },
  { txt: 'Todo Belén está despierto.' },
  { final: true, txt: '¡Nochebuena! El concierto en el pesebre.' },
];
const misionesHechas5 = () => { const m = m2_(); return m ? (m.mision || 0) : 0; };
function despierto5(id) { const n = misionesHechas5(); for (let k = 0; k <= Math.min(n, DESPIERTA5.length - 1); k++) if ((DESPIERTA5[k].rincones || []).includes(id) || (DESPIERTA5[k].lugares || []).includes(id)) return true; return false; }
function rinconesDespiertos5() { return ['campanas', 'estrella', 'pastor', 'ovejas', 'pozo', 'vecina', 'posada', 'ronda'].filter(despierto5).length; }
const tieneLlave5 = id => { const m = m2_(); return !!(m && m.llaves && m.llaves[id]); };
function darLlave5(id) { const m = m2_(); m.llaves = m.llaves || {}; if (m.llaves[id]) return false; m.llaves[id] = misionesHechas5() + 1; GUARDA.guardar(); return true; }
const NOMBRE_LLAVE5 = { flauta: 'la flauta del pastor', fa: 'la llave de la clave de fa', instrumento: 'un instrumento del luthier', reto: 'el reto de la Torre (nivel 3)' };
function textoMision5() { const n = misionesHechas5(); if (n >= 14) return '★ Nochebuena: ¡el concierto en el pesebre!'; const P = planDia5(n); return 'Misión ' + (n + 1) + ' de 14 · ' + P.nuevo; }
function brilloEstrella5() { return .45 + .55 * Math.min(1, (misionesHechas5() + (rinconDe5('estrella') ? 1 : 0)) / 15); }
// ---------- registro de rincones (lo hecho) ----------
function rinconDe5(id) { const m = m2_(); return m && m.rinc && m.rinc[id]; }
function premioRincon5(id) { const m = m2_(); m.rinc = m.rinc || {}; const r = m.rinc[id] || (m.rinc[id] = { veces: 0, dias: {} }); r.veces++; const hoy = hoy5(), c = r.veces === 1 ? 2 : r.dias[hoy] ? 0 : 1; r.dias[hoy] = true; m.corcheas += c; GUARDA.guardar(); marca5('rincón ' + id + ' +' + c); return c; }
// ---------- niveles de los juegos infinitos ----------
function nivelJuego5(id) { const m = m2_(); return m && m.juegos && m.juegos[id] ? m.juegos[id].nivel : 0; }
function subirNivel5(id, gano) { const m = m2_(); m.juegos = m.juegos || {}; const J = m.juegos[id] || (m.juegos[id] = { nivel: 0, veces: 0, ganadas: 0 }); J.veces++; if (gano) { J.ganadas++; J.nivel = Math.min(19, J.nivel + 1); } if (id === 'torre' && J.nivel >= 3) darLlave5('reto'); GUARDA.guardar(); marca5('juego ' + id + (gano ? ' sube a nivel ' + (J.nivel + 1) : ' sigue en nivel ' + (J.nivel + 1))); }
// =====================================================================
//  LOS LUGARES (lo que pasa al entrar caminando por la puerta)
// =====================================================================
const COLOR_LUGAR5 = { salon: NC.SI, patio: NC.FA, coro: NC.SOL, teatro: NC.DO, taller: NC.RE, torre: NC.LA, ritmo: NC.DO, biblioteca: NC.SI, arena: NC.SOL, gimnasio: NC.RE, museo: '#d9a930', kiosco: NC.FA, sala: NC.DO, luthier: '#c98a52', casa: '#ff9cc4', conservatorio: NC.LA, campanas: NC.MI, posada: '#c0533f', establo: '#ffd046' };
function abiertoLugar5(id) {
  if (id === 'museo') return tieneLlave5('fa') ? true : 'Se abre con ' + NOMBRE_LLAVE5.fa + ' (el duelo de la misión siete).';
  if (id === 'arena') return tieneLlave5('flauta') ? true : 'Se abre con ' + NOMBRE_LLAVE5.flauta + '. Ayuda al pastor con su eco.';
  if (id === 'kiosco') return tieneLlave5('instrumento') || ['marimba', 'celesta', 'arpa', 'flauta'].some(tiene5) ? true : 'Para tocar con la banda necesitas un instrumento del luthier.';
  if (id === 'gimnasio') return tieneLlave5('reto') ? true : 'Se abre con un reto: llega al nivel tres de la Torre de notas.';
  if (['salon', 'patio', 'coro', 'teatro', 'taller', 'torre', 'casa', 'luthier', 'ritmo', 'biblioteca', 'conservatorio', 'sala'].includes(id)) { if (despierto5(id)) return true; const k = DESPIERTA5.findIndex(d => (d.lugares || []).includes(id)); return 'Se abre al terminar la misión ' + k + '.'; }
  return true;
}
const INFO_LUGAR5 = {
  salon: () => { const n = misionesHechas5(); if (n >= 14) return { lineas: ['¡Terminaste las catorce misiones de Belén!', 'Bach te espera en el pesebre para el gran concierto.'], boton: 'Repasar', jugar: () => empezarMision5() };
    const P = planDia5(n), hecha = diaLog5().completo; return { retrato: () => sprBachElegante(), lineas: ['Misión ' + (n + 1) + ': ' + P.nuevo + '.', hecha ? '¡Ya hiciste la misión de hoy! Puedes seguir con la siguiente o explorar Belén.' : 'Patio, Coro, Salón, Teatro y Taller' + (MISIONES5[n].duelo ? ', y el duelo de eco.' : '.')], boton: '¡Empezar!', jugar: () => empezarMision5() }; },
  patio: () => ({ lineas: ['Respira con Tic y toca libre.', 'Cada nota sube como un farol.'], jugar: () => abrirModo5('patioL') }),
  coro: () => ({ lineas: ['Tic canta y tú le respondes.', 'Eco cantado, una y otra vez.'], jugar: () => abrirModo5('coroL') }),
  teatro: () => { const id = cancionSemana5(); return { lineas: ['La canción de esta semana:', VILLANCICOS5[id].titulo + '.'], jugar: () => abrirModo5('teatroL') }; },
  taller: () => ({ lineas: ['Inventa tu música: todo suena bonito.', 'Tic la toca de vuelta y se guarda.'], jugar: () => abrirModo5('tallerL') }),
  torre: () => ({ juego: 'torre', lineas: ['Las notas caen desde lo alto de la torre.', 'Tócalas cuando lleguen a la línea dorada.'], jugar: () => { ESCENA_CAEN5.volver = volverAqui5(); irA(ESCENA_CAEN5, { tipo: 'iris' }); } }),
  ritmo: () => ({ juego: 'ritmo', lineas: ['Ritmos en los tambores (pads).', 'Tan, taaan, sh, taca… cada nivel un poco más.'], jugar: () => abrirModo5('ritmo') }),
  biblioteca: () => ({ juego: 'biblioteca', retrato: () => sprPersona5(VECINOS5.escriba, 'abajo', 0), lineas: ['Adivina el nombre, la figura y el sonido.', '¿Línea o espacio?'], jugar: () => { ESCENA_BIBLIO5.volver = volverAqui5(); irA(ESCENA_BIBLIO5, { tipo: 'iris' }); } }),
  arena: () => ({ juego: 'arena', retrato: () => sprPastorcito({}), lineas: ['Batalla de eco con la flauta.', 'Tres corazones.'], jugar: () => abrirModo5('batalla') }),
  gimnasio: () => ({ juego: 'gimnasio', lineas: ['Dedos rápidos con lo que ya sabes.', 'El tempo sube un poquito cada vez.'], jugar: () => abrirModo5('gimnasio') }),
  museo: () => ({ lineas: ['Retratos de músicos y sus historias.'], jugar: () => { ESCENA_MUSEO5.volver = volverAqui5(); irA(ESCENA_MUSEO5, { tipo: 'iris' }); } }),
  kiosco: () => ({ lineas: ['La banda toca: tú llevas el pulso.'], jugar: () => abrirModo5('kiosco') }),
  sala: () => ({ lineas: ['Tu concierto: la familia escucha.'], boton: 'Escoger', jugar: () => MENU5.abrir('concierto') }),
  luthier: () => ({ retrato: () => sprPersona5({ id: 'vLuthier', adulto: true, barba: '#7a4a2a', pelo: '#7a4a2a', peinado: 'corto', ropa: '#fff6e6', delantal: '#8a5a34', piel: '#e8b48c', pierna: '#4a3a2a', zapato: '#2a1a1a' }, 'abajo', 0), lineas: ['Instrumentos, trajes y cosas para tu casa.', 'Se pagan con corcheas doradas.'], boton: 'Ver', jugar: () => MENU5.abrir('tienda') }),
  casa: () => ({ lineas: ['Tu cuarto en Belén: el vestidor y lo que compraste.'], boton: 'Entrar', jugar: () => { const C = LUGARES5['n-casa']; if (!C) return MENU5.abrir('vestidor'); C.volver = volverAqui5(); irA(C, { tipo: 'iris' }); } }),
  conservatorio: () => { const n = misionesHechas5(); return { retrato: () => sprPastorcito({}), lineas: ['Partituras al azar: lee y toca.', MISIONES5[Math.min(13, n)].duelo ? 'En esta misión, ¡el duelo de eco!' : 'El duelo de eco es en las misiones siete y catorce.'], jugar: () => abrirModo5('partituras') }; },
};
function volverAqui5() { const B = LUGARES5.belen; return { lugar: B, desde: [B.jugador.i, B.jugador.j] }; }
function abrirLugar5(L, o) {
  const id = o.lugar; if (!id) { DIALOGO5.abrir(o.nombre || '', null, [o.cerrado || 'Aquí vive una familia de Belén.']); return; }
  if (id === 'campanas' || id === 'posada') { abrirRincon5(L, id); return; }
  if (id === 'establo') { if (misionesHechas5() >= 14) return panelLugar5(L, { nombre: 'Concierto en el pesebre', color: '#ffd046', retrato: () => NAC.maria(), lineas: ['¡Nochebuena!', 'Todo Belén vino a escucharte.'], boton: '¡Tocar!', jugar: () => conciertoPesebre5() }); abrirRincon5(L, 'estrella'); return; }
  const ab = abiertoLugar5(id), I = INFO_LUGAR5[id] ? INFO_LUGAR5[id]() : { lineas: [''], jugar: () => { } };
  voz5('lugar-' + id, { forzar: true });
  panelLugar5(L, Object.assign({ nombre: textoDeVoz5('lugar-' + id, o.nombre).replace(/\.$/, ''), color: COLOR_LUGAR5[id] || '#ffd046' }, I, ab === true ? {} : { bloqueado: true, lineas: [ab], retrato: I.retrato }, I.juego ? { nivel: nivelJuego5(I.juego) } : {}));
}
function empezarMision5() { const m = m2_(); SESION5.t0 = null; SESION5.tFin = null; SESION5.log = []; const d = diaHoy5(); const sig = siguienteParada5(); if (!sig) { d.paradas = {}; d.completo = false; } SON5.iniciar(); paseo5(null, siguienteParada5() || 'patio', { sinRecorrido: true }); }
function conciertoPesebre5() { CONCIERTO5.cancion = 'noche'; CONCIERTO5.pesebre = true; abrirModo5('concierto'); }
// la canción de la semana (Teatro): una por bloque de misiones
function cancionSemana5() { return planDia5(diaPlan5()).cancion; }
// =====================================================================
//  Belén: burbujas, lugares, rincones, despertares, notas doradas escondidas
// =====================================================================
const NOTAS_DORADAS5 = [[2, 13, 'bel-d1'], [61, 13, 'bel-d2'], [8, 29, 'bel-d3'], [60, 28, 'bel-d4'], [28, 45, 'bel-d5'], [45, 2, 'bel-d6']];
function iniciarBelenArriba5() {
  const B = LUGARES5.belen; if (!B || !B.arriba) return;
  B.objetos.forEach(o => { if (o.lugar) o.accion = (L, ob) => abrirLugar5(L, ob); });
  B.alEntrarEdificio = null;
  B.def.alActuar = (L, x) => { if (x.rincon) { abrirRincon5(L, x.rincon, x); return true; } return false; };
  B.nota = (n, t, fuente) => { if (B.panel && B.panel.nota) return B.panel.nota(n, t, fuente); return null; };
  B.objetivo = () => B.panel && B.panel.objetivo ? B.panel.objetivo() : null;
  B.reloj = () => B.panel && B.panel.t != null ? B.panel.t : RELOJ;   /* M7b: con un rincón abierto, el reloj es el del rincón (sus tiempos están en él) */
  // las notas doradas escondidas (se pisan)
  NOTAS_DORADAS5.forEach(([i, j, id]) => B.props.push({ i, j, bloquea: false, base: (j + 1) * TA, secreto: id, spr: () => { const p = GUARDA.perfil(); if (p && p.secretos[id]) return null; return corcheaDorada(); }, dy: 0 }));
  B.def.alPisar = (L, i, j) => { const s = NOTAS_DORADAS5.find(x => x[0] === i && x[1] === j); if (!s) return; const p = GUARDA.perfil(); if (!p || p.secretos[s[2]]) return; p.secretos[s[2]] = true; const m = m2_(); m.corcheas += 1; GUARDA.guardar(); L.festejo = { t: 0, texto: '¡Nota dorada!' }; voz5('secreto-nota', { hito: true }); try { Snd.cofre(); } catch (e) { } };
  B.burbujas = () => {
    const out = [], J = B.jugador;
    B.objetos.forEach(o => { if (!o.lugar) return; const ab = o.lugar === 'campanas' || o.lugar === 'posada' || o.lugar === 'establo' ? (despierto5(o.lugar === 'establo' ? 'estrella' : o.lugar) ? true : 'x') : abiertoLugar5(o.lugar);
      const top = o.lugar === 'establo' ? o.j * TA - 4 : (o.j + o.h) * TA - Math.round((o.fhA || 3) * TA) - 8, mis = o.lugar === 'salon' && !diaLog5().completo;
      out.push({ x: (o.i + o.w / 2) * TA, y: top, c: COLOR_LUGAR5[o.lugar] || '#ffd046', txt: o.nombre + (mis ? ' · ¡misión!' : ''), candado: ab !== true && o.lugar !== 'campanas' && o.lugar !== 'posada', dormido: ab === 'x', ir: [o.puerta[0], o.puerta[1], 'arriba'], lejos: 10, cerca: 7 }); });
    B.npcs.forEach(n => { if (!n.rincon || n.id.startsWith('oveja') || (n.id.startsWith('ronda') && n.id !== 'ronda0')) return; const d = despierto5(n.rincon); out.push({ x: n.x, y: n.y - 44, c: COLOR_RINCON5[n.rincon], txt: RINCONES5[n.rincon].nombre, dormido: !d, ir: [n.i, n.j + 1, 'arriba'], lejos: 8, cerca: 5 }); });
    B.props.forEach(p => { if (!p.rincon) return; const d = despierto5(p.rincon), t = p.toca && p.toca[0]; out.push({ x: p.i * TA + 8, y: p.j * TA - 22, c: COLOR_RINCON5[p.rincon], txt: RINCONES5[p.rincon].nombre, dormido: !d, ir: t ? [t[0], t[1], t[1] > p.j ? 'arriba' : t[1] < p.j ? 'abajo' : t[0] < p.i ? 'der' : 'izq'] : null, lejos: 8, cerca: 5 }); });
    return out; };
  // al volver a Belén después de una misión: la cámara va al rincón que despertó
  B.def.alEntrar = (L) => {
    const m = m2_(); if (!m) return; const n = m.mision || 0; m.vistoDespertar = m.vistoDespertar == null ? 0 : m.vistoDespertar;
    visitasPesebre5(L);
    if (n > m.vistoDespertar && !L.auto) { const D = DESPIERTA5[Math.min(n, DESPIERTA5.length - 1)]; m.vistoDespertar = n; GUARDA.guardar();
      const r = (D.rincones || [])[0], lug = (D.lugares || [])[0], objetivo = r ? (B.npcs.find(x => x.rincon === r) || B.props.find(x => x.rincon === r) || B.objetos.find(o => o.lugar === r)) : lug ? B.objetos.find(o => o.lugar === lug) : B.objetos.find(o => o.lugar === 'establo');
      const o2 = objetivo ? (objetivo.w ? objetivo : { i: objetivo.i - 1, j: objetivo.j - 2, w: 3, h: 3, nombre: (RINCONES5[r] || {}).nombre }) : null;
      if (o2) { o2.nombre = '¡Despertó! ' + (o2.nombre || ''); setTimeout(() => { if (ESC !== L) return; L.recorrido([o2], () => { L.despierta = null; }, 3.6); L.tour.saltable = true; L.despierta = { t: RELOJ, txt: textoDeVoz5('despierta-' + n, D.txt) }; try { Snd.desbloqueo(); } catch (e) { } voz5('despierta-' + n, { hito: true }); }, 500); }
    }
  };
  const encOrig = B.def.encima; B.def.encima = (ctx, izq, arr, L, dt) => { encOrig(ctx, izq, arr, L, dt); if (L.despierta) { const t = RELOJ - L.despierta.t; ctx.save(); ctx.globalAlpha = Math.min(1, t * 3); habla5(L.despierta.txt); pildora5(ctx, LW5 / 2 - 400, LH5 - 150, L.despierta.txt, { w: 800, h: 64, tam: 26, al: 'center', fondo: '#fffaf4' }); ctx.restore(); } };
}
// los visitantes del pesebre que llegan con las misiones (pastores, ángel, sabios)
function visitasPesebre5(L) {
  const n = misionesHechas5(); const quiere = []; DESPIERTA5.slice(0, n + 1).forEach(d => { if (d.visita) quiere.push(d.visita); });
  const ya = id => L.npcs.some(x => x.id === id);
  if (quiere.includes('pastores') && !ya('pastorV1')) { L.npcs.push({ id: 'pastorV1', nombre: 'Pastor', persona: Object.assign({}, VECINOS5.pastor, { id: 'vPastorB', velo: '#c8b680', ropa: '#6a5a3a' }), i: 28, j: 32, dir: 'der', x: 28 * TA + 8, y: 33 * TA, espera: 3, k: 0, f: 0, mira: ['der', 'abajo'], dialogo: { sarah: ['¡Vamos a Belén!', 'Veamos esto que ha sucedido.', 'Lucas 2:15'], david: ['¡Vamos a Belén!'] } }); }
  if (quiere.includes('angel') && !ya('angel')) { L.npcs.push({ id: 'angel', nombre: 'Ángel', persona: { id: 'vAngel', adulto: true, pelo: '#ffe9a8', peinado: 'largo', ropa: '#fffaf0', ropa2: '#e2d8f0', ropa3: '#ffffff', larga: true, falda: true, piel: '#f2c4a0', capa: '#ffe08a', capa2: '#e6c060' }, i: 36, j: 28, dir: 'abajo', x: 36 * TA + 8, y: 29 * TA, espera: 3, k: 0, f: 0, dialogo: { sarah: ['¡Gloria a Dios en las alturas,', 'y en la tierra paz,', 'buena voluntad para con los hombres!', 'Lucas 2:14'], david: ['¡Gloria a Dios!'] } }); }
  if (quiere.includes('reyes') && !ya('sabio')) { L.npcs.push({ id: 'sabio', nombre: 'Un sabio', persona: { id: 'vSabio', adulto: true, barba: '#e2d8ca', sombrero: '#d9a930', ropa: '#7a3fc8', ropa2: '#55288f', larga: true, piel: '#a8704a', zapato: '#3a2418', capa: '#c23345', capa2: '#9a2a1a' }, i: 38, j: 31, dir: 'izq', x: 38 * TA + 8, y: 32 * TA, espera: 3, k: 0, f: 0, dialogo: { sarah: ['Hemos visto su estrella en el oriente,', 'y venimos a adorarle.', 'Mateo 2:2'], david: ['¡La estrella!'] } }); }
}
