// =====================================================================
//  M5 · BELÉN GRANDE, DE NOCHE, DESDE ARRIBA (Nochebuena)
//  64 × 50 baldosas: muralla con su puerta al sur, avenida ancha, plaza con el pesebre y la estrella,
//  muchos edificios con altura (cada edificio-juego con su forma y su letrero), casas con ventanas cálidas,
//  faroles, palmeras y olivos, vecinos con rutinas, rincones musicales en la calle.
// =====================================================================
const BW5 = 64, BH5 = 50;
const PUERTA_SUR5 = [30, 33];
function sueloBelen5(i, j) {
  if (j <= 1 || j >= BH5 - 2) return (j >= BH5 - 2 && i >= PUERTA_SUR5[0] && i <= PUERTA_SUR5[1]) ? 'c' : 'm';
  if (i <= 1 || i >= BW5 - 2) return 'm';
  if (i >= 22 && i <= 41 && j >= 26 && j <= 36) return 'z';
  if ((j >= 22 && j <= 25) || (j >= 10 && j <= 12) || (j >= 37 && j <= 39) || (j >= 46 && j <= 47)) return 'c';
  if ((i >= 14 && i <= 16) || (i >= 30 && i <= 33) || (i >= 48 && i <= 50)) return 'c';
  return 'g';
}
// los lugares de Belén: [id, nombre, i, j, w, h, forma]
const LUGARES_BELEN5 = [
  ['torre', 'Torre de notas', 3, 3, 5, 7, { techo: 'torre', cw: 50, th: 58, alto: 44, punta: 'nota', col: 1, ventanas: 2, letrero: { c: '#5a7dff', icono: 'notas' }, cupula: ['#5a7dff', '#3f5ad0', '#9fb4ff'] }],
  ['campanas', 'Las campanas', 9, 4, 4, 6, null],
  ['casa', 'Tu casa', 18, 4, 6, 6, { techo: 'teja', col: 0, flores: true, contraventanas: '#2e8b6a', letrero: { c: '#ff9cc4', icono: 'casa' } }],
  ['biblioteca', 'Biblioteca de teoría', 24, 3, 6, 7, { techo: 'plano', col: 2, columnas: 4, ventanas: 0, puerta: 'doble', letrero: { c: '#b86bff', icono: 'libro' }, pisos: 1 }],
  ['coro', 'El Coro', 35, 3, 6, 7, { techo: 'cupula', cw: 44, col: 0, ventanas: 4, letrero: { c: '#3fc7f0', icono: 'nota' }, cupula: ['#3fc7f0', '#2a9ac8', '#a6ecff'] }],
  ['museo', 'Museo', 42, 4, 6, 6, { techo: 'plano', col: 2, columnas: 3, ventanas: 0, puerta: 'doble', letrero: { c: '#d9a930', icono: 'columna' } }],
  ['gimnasio', 'Gimnasio de dedos', 52, 4, 7, 6, { techo: 'teja', col: 3, toldo: '#ff9a3c', letrero: { c: '#ff9a3c', icono: 'mano' }, teja: ['#b8743a', '#8a5226', '#d89a5a'] }],
  ['ritmo', 'Casa del ritmo', 3, 16, 7, 6, { techo: 'teja', col: 1, toldo: '#d2452e', letrero: { c: '#ff5a5a', icono: 'tambor' } }],
  ['salon', 'Salón de Bach', 18, 14, 8, 8, { techo: 'teja', fh: 4, pisos: 2, col: 2, toldo: '#3f6ad8', toldoAncho: 100, ventanas: 4, puerta: 'doble', letrero: { c: '#b86bff', icono: 'organo' }, teja: ['#5d6384', '#454a68', '#7d84a6'] }],
  ['luthier', 'Tienda del luthier', 26, 17, 4, 5, { techo: 'plano', col: 3, toldo: '#2e8b6a', toldoAncho: 56, ventanas: 2, letrero: { c: '#c98a52', icono: 'violin' } }],
  ['teatro', 'El Teatro', 35, 14, 8, 8, { techo: 'cupula', cw: 70, fh: 4, pisos: 2, col: 1, toldo: '#e8a43a', toldoAncho: 110, columnas: 2, ventanas: 4, puerta: 'doble', letrero: { c: '#ff5a5a', icono: 'mascara' }, cupula: ['#d2452e', '#9a2a1a', '#ff8a6a'] }],
  ['taller', 'El Taller', 43, 17, 5, 5, { techo: 'teja', col: 0, toldo: '#ff9a3c', toldoAncho: 64, letrero: { c: '#ff9a3c', icono: 'martillo' } }],
  ['conservatorio', 'Conservatorio', 52, 14, 8, 8, { techo: 'torre', cw: 40, th: 40, alto: 64, fh: 4, pisos: 2, col: 2, punta: 'estrella', ventanas: 4, puerta: 'doble', letrero: { c: '#5a7dff', icono: 'estrella' }, cupula: ['#6fbfa6', '#4a9483', '#a6e3cf'] }],
  ['patio', 'El Patio', 3, 31, 8, 6, null],
  ['posada', 'La posada', 17, 31, 5, 6, { techo: 'teja', col: 3, flores: true, contraventanas: '#7a3a1e', letrero: { c: '#c0533f', icono: 'cama' } }],
  ['establo', 'El pesebre', 29, 27, 6, 5, null],
  ['kiosco', 'Kiosco de la banda', 23, 32, 4, 4, null],
  ['sala', 'Sala de conciertos', 42, 30, 6, 7, { techo: 'plano', col: 2, columnas: 5, ventanas: 0, puerta: 'doble', fh: 4, letrero: { c: '#ff5a5a', icono: 'notas' } }],
  ['arena', 'Arena del eco', 52, 30, 8, 7, null],
];
const CASAS_BELEN5 = [[10, 17, 4, 5], [3, 41, 5, 5], [9, 41, 4, 5], [18, 41, 5, 5], [24, 41, 5, 5], [35, 41, 5, 5], [41, 41, 6, 5], [3, 26, 5, 4], [9, 26, 4, 4], [52, 26, 4, 4], [57, 26, 4, 4], [56, 4, 0, 0]].filter(c => c[2]);
function patioSpr5() { return sprEdificio5({ w: 8, h: 6, fh: 2, techo: 'abierto', col: 0, ventanas: 0, puerta: 'reja', extra: (g, W, Hs, Y0, yF) => {   // muro bajo y jardín adentro con un limonero
  g.R(0, Y0, W, yF - Y0, '#c9b48e'); g.R(4, Y0 + 4, W - 8, yF - Y0 - 4, '#7a9a5a'); for (let k = 0; k < 60; k++) g.px(6 + (k * 37) % (W - 12), Y0 + 6 + (k * 13) % (yF - Y0 - 8), k % 3 ? '#8fb06a' : '#5f7f4a');
  g.R(W / 2 - 12, Y0 + 14, 24, 20, '#d8c49a'); g.ellE(W / 2 - 9, Y0 + 2, 18, 16, '#4a8a4a'); g.ellE(W / 2 - 7, Y0 + 3, 14, 12, '#6aa85a'); [[-4, 6], [3, 9], [0, 4]].forEach(([dx, dy]) => g.px(W / 2 + dx, Y0 + dy, '#ffd046'));
  [[10, Y0 + 24], [W - 18, Y0 + 24]].forEach(([x, y]) => { g.R(x, y, 8, 3, '#9a6038'); g.R(x, y, 8, 1, '#c98a52'); }); } }); }
function casaBelen5(k, w, h) { return sprEdificio5({ w, h, fh: 3, techo: k % 3 === 1 ? 'teja' : 'plano', col: k % 4, contraventanas: ['#2e8b6a', '#7a3a1e', '#2a4b9b', null][k % 4], flores: k % 2 === 0, toldo: k % 5 === 2 ? ['#2a4b9b', '#d2452e', '#5fa05a'][k % 3] : null, techo2: k }); }
// ---------- los vecinos (personas en 4 direcciones) ----------
const VECINOS5 = {
  pastor: { id: 'vPastor', adulto: true, barba: '#3a2418', pelo: '#3a2418', velo: '#efe2c4', ropa: '#8a6a40', ropa2: '#6a4a2a', larga: true, piel: '#d9a07a', zapato: '#4a2a18', baculo: true },
  vecina: { id: 'vVecina', adulto: true, pelo: '#2a1810', peinado: 'largo', ropa: '#2a4b9b', ropa2: '#1d3672', ropa3: '#5a7dff', falda: true, larga: true, piel: '#e8b48c', zapato: '#3a2418' },
  mesonero: { id: 'vMeson', adulto: true, pelo: '#3a2418', peinado: 'corto', ropa: '#c0533f', ropa2: '#9a3a2e', delantal: '#fbf1d8', piel: '#d9a07a', pierna: '#5a3a24', zapato: '#3a2418' },
  panadera: { id: 'vPan', adulto: true, velo: '#e86a4a', ropa: '#f4d277', ropa2: '#dcb352', falda: true, larga: true, delantal: '#fbf1d8', piel: '#c98e62', zapato: '#5a3418' },
  abuelo: { id: 'vAbuelo', adulto: true, barba: '#e2d8ca', pelo: '#e2d8ca', peinado: 'calvo', ropa: '#5d6384', ropa2: '#454a68', larga: true, piel: '#e8b48c', zapato: '#3a2418', baculo: true },
  musico: { id: 'vMusico', adulto: true, barba: '#e2d8ca', pelo: '#fffaf4', peinado: 'corto', ropa: '#2e8b6a', ropa2: '#1f6a50', piel: '#d9a07a', pierna: '#3a3a52', zapato: '#2a1a1a' },
  escriba: { id: 'vEscriba', adulto: true, pelo: '#3a2418', sombrero: '#7a1f3d', ropa: '#e8d6a0', ropa2: '#c8b680', larga: true, piel: '#e8b48c', zapato: '#4a2a18' },
  pastorcito: { id: 'vPastorcito', pelo: '#5a3418', peinado: 'rizos', ropa: '#a8d0a0', ropa2: '#6a9a6a', cinturon: '#5a3418', piel: '#d9a07a', zapato: '#5a3418', bolso: '#8a5a34' },
  nina1: { id: 'vNina1', pelo: '#2a1810', peinado: 'largo', ropa: '#ff9cc4', ropa2: '#e070a0', falda: true, piel: '#c98e62', zapato: '#7a3a3a' },
  nina2: { id: 'vNina2', pelo: '#8a4a1a', peinado: 'largo', ropa: '#ffd046', ropa2: '#e6a21b', falda: true, piel: '#f2c4a0', zapato: '#7a3a3a' },
  nino1: { id: 'vNino1', pelo: '#1a1010', peinado: 'rizos', ropa: '#5fd36a', ropa2: '#3f9a4a', piel: '#a8704a', zapato: '#3a2418' },
  nino2: { id: 'vNino2', pelo: '#e8b83a', peinado: 'corto', ropa: '#3fc7f0', ropa2: '#2a8ab0', piel: '#f2c4a0', zapato: '#3a2418' },
  campanero: { id: 'vCampanero', adulto: true, pelo: '#5a3418', peinado: 'calvo', barba: '#5a3418', ropa: '#7a5a3a', ropa2: '#5a3a22', larga: true, cinturon: '#d9a930', piel: '#e8b48c', zapato: '#3a2418' },
  maria: { id: 'vMaria', adulto: true, velo: '#2a4b9b', ropa: '#fbf1d8', ropa2: '#e2d2b0', falda: true, larga: true, piel: '#e8b48c', zapato: '#7a4a2a' },
  jose: { id: 'vJose', adulto: true, barba: '#5a3418', velo: '#e8d6a0', ropa: '#a86e3e', ropa2: '#7a4a24', larga: true, piel: '#d9a07a', zapato: '#4a2a18', baculo: true },
  bach: { id: 'vBach', adulto: true, pelo: '#fffaf4', pelo2: '#e2d8ca', peinado: 'rizos', ropa: '#2a2a4a', ropa2: '#1a1a30', ropa3: '#4a4a6a', larga: true, piel: '#f2c4a0', zapato: '#1a1010' },
};
function defBelenArriba5() {
  const objetos = [], props = [], npcs = [];
  const libreDe = new Set(); // baldosas de senderos
  LUGARES_BELEN5.forEach(([id, nombre, i, j, w, h, forma]) => {
    let spr; if (id === 'patio') spr = patioSpr5(); else if (id === 'campanas') spr = sprCampanario5(); else if (id === 'establo') spr = sprEstablo5(); else if (id === 'kiosco') spr = sprKiosco5(); else if (id === 'arena') spr = sprArena5(); else spr = sprEdificio5(Object.assign({ w, h }, forma));
    objetos.push({ id, nombre, i, j, w, h, spr, entra: null, lugar: id, fhA: forma && forma.fh || (id === 'patio' ? 2 : id === 'arena' ? 2 : id === 'kiosco' ? 3.5 : 3) });
  });
  CASAS_BELEN5.forEach(([i, j, w, h], k) => objetos.push({ id: 'casa' + k, nombre: 'Casa', i, j, w, h, spr: casaBelen5(k + 1, w, h), cerrado: ['Aquí vive una familia de Belén.', 'Huele a pan recién hecho.', 'Adentro alguien afina una lira.', 'Una familia prepara la cena de Nochebuena.', 'Se oye una canción de cuna.'][k % 5] }));
  // muralla con su puerta (dos torres al sur)
  for (let i = 0; i < BW5; i += 4) { props.push({ i, j: 1, spr: sprMuralla5(4), bloquea: false }); if (i < PUERTA_SUR5[0] - 3 || i > PUERTA_SUR5[1]) props.push({ i, j: BH5 - 1, spr: sprMuralla5(4), bloquea: false }); }
  [[PUERTA_SUR5[0] - 2, BH5 - 1], [PUERTA_SUR5[1] + 1, BH5 - 1]].forEach(([i, j]) => props.push({ i, j, spr: sprEdificio5({ w: 2, h: 3, fh: 2.4, techo: 'plano', col: 1, ventanas: 0, puerta: false, techoCosas: false }), dx: 8, bloquea: true, ocupa: [[i + 1, j], [i, j - 1], [i + 1, j - 1]] }));
  const R = rng(1225), ocup = (i, j) => objetos.some(o => i >= o.i - 1 && i < o.i + o.w + 1 && j >= o.j && j < o.j + o.h + 1) || props.some(p => Math.abs(p.i - i) < 2 && Math.abs(p.j - j) < 2 && p.bloquea !== false);
  // senderos de cada puerta a la calle
  objetos.forEach(o => { const pi = o.i + Math.floor(o.w / 2); for (let j = o.j + o.h; j < BH5 - 2; j++) { if (sueloBelen5(pi, j) !== 'g') break; libreDe.add(pi + ',' + j); } });
  // faroles en las esquinas de las calles y alrededor de la plaza
  [[13, 21], [17, 21], [29, 21], [34, 21], [47, 21], [51, 21], [13, 26], [51, 26], [21, 26], [42, 26], [21, 36], [42, 36], [13, 9], [17, 9], [34, 9], [47, 9], [51, 9], [13, 40], [17, 40], [29, 40], [34, 40], [47, 40], [51, 40], [29, 45], [34, 45]]
    .forEach(([i, j]) => { if (!ocup(i, j) && !libreDe.has(i + ',' + j)) props.push({ i, j, spr: sprFarol5(), luz: 50, luzY: 26 * 1, sombra: 8 }); });
  // palmeras, olivos y cipreses en los patios de pasto
  for (let j = 2; j < BH5 - 2; j++) for (let i = 2; i < BW5 - 2; i++) { if (sueloBelen5(i, j) !== 'g' || libreDe.has(i + ',' + j) || ocup(i, j)) continue; const r = R(); if (r < .085) props.push({ i, j, spr: r < .03 ? sprPalmera5() : r < .065 ? sprOlivo5(Math.floor(R() * 2)) : sprCipres5(), mece: r < .03 }); }
  // la plaza: fuente, pozo del eco, puestos, cántaros
  props.push({ i: 39, j: 33, spr: sprPozo5(), rincon: 'pozo', toca: [[39, 34], [38, 33], [40, 33], [39, 32]] });
  [[36, 27, '#d2452e'], [24, 27, '#2e8b6a']].forEach(([i, j, c]) => props.push({ i, j, spr: sprPuestoA5(c), ocupa: [[i - 1, j], [i + 1, j]] }));
  [[27, 30], [37, 34], [21, 30], [28, 21 - 0]].forEach(([i, j], k) => { if (!ocup(i, j)) props.push({ i, j, spr: k % 2 ? sprBarril5() : sprCantaro5() }); });
  // el corral de las ovejas (al sureste) y la estrella sobre el pesebre
  for (let i = 52; i <= 60; i += 2) props.push({ i, j: 40, spr: sprCerca5(32), bloquea: true, ocupa: [[i + 1, 40]] });
  for (let i = 52; i <= 60; i += 2) if (i !== 56) props.push({ i, j: 45, spr: sprCerca5(32), bloquea: true, ocupa: [[i + 1, 45]] });
  for (let j = 41; j <= 44; j++) { props.push({ i: 51, j, spr: j === 41 ? sprCerca5(64, true) : null, bloquea: true, dx: -6 }); props.push({ i: 61, j, spr: j === 41 ? sprCerca5(64, true) : null, bloquea: true, dx: 6 }); }
  props.push({ i: 56, j: 45, spr: null, bloquea: true, rincon: 'ovejas', toca: [[56, 46], [57, 46]], ocupa: [[57, 45]] });
  // los vecinos
  const V = VECINOS5;
  npcs.push({ id: 'pastor', nombre: 'El pastor', persona: V.pastor, i: 53, j: 46, dir: 'abajo', rincon: 'pastor', mira: ['abajo', 'der', 'izq'] });
  npcs.push({ id: 'vecina', nombre: 'La vecina', persona: V.vecina, i: 45, j: 23, dir: 'abajo', rincon: 'vecina', mira: ['abajo', 'izq'] });
  npcs.push({ id: 'mesonero', nombre: 'El mesonero', persona: V.mesonero, i: 19, j: 37, ruta: [[19, 37], [22, 37]], vel: 1.1, dialogo: { sarah: ['¡No hay lugar en el mesón!', 'Pero en el establo hay paja limpia.', 'Si sabes la contraseña de ritmo, toca a mi puerta.'], david: ['¡No hay lugar!', 'Toca a mi puerta con el ritmo.'] } });
  npcs.push({ id: 'panadera', nombre: 'La panadera', persona: V.panadera, i: 6, j: 23, ruta: [[6, 23], [27, 23], [27, 24], [6, 24]], vel: 1.4, dialogo: { sarah: ['Esta noche todo Belén canta.', 'Cada canción despierta una calle.'], david: ['¡Pan para la fiesta!'] } });
  npcs.push({ id: 'abuelo', nombre: 'El abuelo', persona: V.abuelo, i: 40, j: 11, ruta: [[40, 11], [46, 11]], vel: .8, descanso: 4, dialogo: { sarah: ['Bienaventurados los que oyen la palabra de Dios,', 'y la guardan.', 'Lucas 11:28'], david: ['¡Escucha!', 'Y guarda la palabra.'] } });
  npcs.push({ id: 'musico', nombre: 'El músico', persona: V.musico, i: 26, j: 36, mira: ['abajo', 'der'], dialogo: { sarah: ['Mira: el pentagrama tiene cinco líneas.', 'Las notas viven en las líneas', 'y en los espacios.'], david: ['Cinco líneas.', '¡Un pentagrama!'] } });
  npcs.push({ id: 'escriba', nombre: 'El escriba', persona: V.escriba, i: 28, j: 11, ruta: [[28, 11], [24, 11]], vel: .9, dialogo: { sarah: ['En la biblioteca se aprende a leer la música.', 'Una nota en una línea, otra en un espacio.'], david: ['¡Libros de música!'] } });
  npcs.push({ id: 'pastorcito', nombre: 'El pastorcito', persona: V.pastorcito, i: 54, j: 23, mira: ['abajo', 'izq', 'der'], dialogo: { sarah: ['Toco la flauta en el Conservatorio.', 'En la misión siete te espero para un duelo de eco.'], david: ['¡Mi flauta!', '¡Duelo de eco!'] } });
  npcs.push({ id: 'campanero', nombre: 'El campanero', persona: V.campanero, i: 12, j: 10, dir: 'abajo', mira: ['abajo', 'izq'], rincon: 'campanas' });
  // niños en ronda alrededor del olivo de la plaza
  const ronda = [[24, 28], [27, 28], [27, 30], [24, 30]];
  ['nina1', 'nino1', 'nina2', 'nino2'].forEach((p, k) => npcs.push({ id: 'ronda' + k, nombre: 'Niños en ronda', persona: V[p], i: ronda[k][0], j: ronda[k][1], ruta: ronda.slice(k).concat(ronda.slice(0, k)), vel: 1.6, descanso: .05, pausa: 0, rincon: 'ronda' }));
  props.push({ i: 25, j: 29, spr: sprOlivo5(1), bloquea: true, ocupa: [[26, 29]] });
  // María y José en el pesebre; las ovejas del corral
  npcs.push({ id: 'maria', nombre: 'María', persona: V.maria, i: 31, j: 31, dir: 'abajo', quieto: true, dialogo: { sarah: ['Y María guardaba todas estas cosas,', 'meditándolas en su corazón.', 'Lucas 2:19'], david: ['¡Shhh!', 'El bebé duerme.'] } });
  npcs.push({ id: 'jose', nombre: 'José', persona: V.jose, i: 33, j: 31, dir: 'abajo', quieto: true, dialogo: { sarah: ['Esta noche vamos a cantar aquí,', 'todos juntos, en el pesebre.'], david: ['¡A cantar!'] } });
  props.push({ i: 32, j: 30, spr: () => NAC.pesebre(), bloquea: false, dx: -8, orden: 20 });
  props.push({ i: 34, j: 30, spr: sprBurroA5(), bloquea: false, flip: true, orden: 20, dx: -4 });
  const ovejas = [[53, 42], [55, 41], [57, 43], [59, 42], [54, 44], [58, 44]];
  ovejas.forEach(([i, j], k) => npcs.push({ id: 'oveja' + k, nombre: 'Oveja', i, j, ruta: [[i, j], [i + (k % 2 ? -1 : 1), j]], vel: .7, descanso: 3 + k, dibujo: n => sprOvejaA5(Math.floor(RELOJ * 2 + k) % 2), escala: 1, rincon: 'ovejas' }));
  return {
    id: 'belen', nombre: 'Belén', titulo: 'Belén · Nochebuena', W: BW5, H: BH5, nocheColor: '#6e70bc', luzA: .5, inicio: [31, 47, 'arriba'], vel: 6.6,
    suelo: sueloBelen5, bloqueaSuelo: t => t === 'm',
    pintarSuelo: (g, ctx, { tipo }) => pintarSueloBelen5(g, tipo, libreDe),
    objetos, props, npcs,
    salida: (i, j, d) => d === 'abajo' && j >= BH5, alSalir: () => irA(ESCENA_MAPA, { tipo: 'fundido' }),
    luces: [[32 * TA, 26 * TA, 160, .55, '255,236,170']],
    encima: (ctx, izq, arr, L, dt) => estrellaArriba5(ctx, 32 * TA * KA - izq, 26.2 * TA * KA - arr, L),
    subtitulo: () => typeof textoMision5 === 'function' ? textoMision5() : null,
  };
}
function pintarSueloBelen5(g, tipo, senderos) {
  const R = rng(503);
  for (let j = 0; j < BH5; j++) for (let i = 0; i < BW5; i++) {
    const t = tipo(i, j), x = i * TA, y = j * TA;
    /* M7: arena tibia, calles de adoquín gris azulado y la plaza de losas (como la ilustración de Belén de noche) */
    if (t === 'g') { const sen = senderos.has(i + ',' + j); g.R(x, y, TA, TA, sen ? '#d4b68a' : '#c4a47a'); for (let k = 0; k < 7; k++) { const px = x + Math.floor(R() * 15), py = y + Math.floor(R() * 15); g.px(px, py, R() < .5 ? '#b0905f' : '#dcc29a'); } if (!sen && R() < .07) { g.px(x + 5, y + 7, '#6f7f3f'); g.px(x + 6, y + 6, '#8a9a4a'); g.px(x + 7, y + 7, '#6f7f3f'); } }
    else if (t === 'c') { g.R(x, y, TA, TA, '#7e7c96'); for (let yy = 0; yy < TA; yy += 4) { const o = ((j * 4 + yy) / 4) % 2 ? 4 : 0; for (let xx = -o; xx < TA; xx += 8) { const v = R(); g.R(x + Math.max(0, xx), y + yy, Math.min(7, 7 + Math.min(0, xx), TA - Math.max(0, xx)), 3, v < .3 ? '#9a98b2' : v < .8 ? '#a6a4be' : '#b4b2ca'); if (xx >= 0) g.px(x + xx, y + yy, '#c0bed4'); } } }
    else if (t === 'z') { g.R(x, y, TA, TA, '#86849c'); for (let yy = 0; yy < TA; yy += 8) for (let xx = ((j * 2 + yy / 8) % 2) * 4; xx < TA; xx += 8) { g.R(x + xx, y + yy, 7, 7, ((i + j + xx + yy) % 3) ? '#acaac2' : '#a09eb8'); g.px(x + xx, y + yy, '#c4c2d6'); } }
    else if (t === 'm') { g.R(x, y, TA, TA, '#8a7a62'); }
  }
  // bordillos donde la calle toca el pasto
  for (let j = 1; j < BH5 - 1; j++) for (let i = 1; i < BW5 - 1; i++) { const t = tipo(i, j); if (t !== 'c' && t !== 'z') continue; const x = i * TA, y = j * TA; if (tipo(i, j - 1) === 'g' && !senderos.has(i + ',' + (j - 1))) g.R(x, y, TA, 2, '#6a6882'); if (tipo(i, j + 1) === 'g' && !senderos.has(i + ',' + (j + 1))) g.R(x, y + TA - 2, TA, 2, '#5e5c76'); if (tipo(i - 1, j) === 'g') g.R(x, y, 2, TA, '#6a6882'); if (tipo(i + 1, j) === 'g') g.R(x + TA - 2, y, 2, TA, '#5e5c76'); }
  // la plaza: un anillo de losas doradas alrededor del pesebre
  for (let a = 0; a < 360; a += 2) { const r = 7.2 * TA, cx = 32 * TA, cy = 30.5 * TA, px = Math.round(cx + Math.cos(a * Math.PI / 180) * r * 1.25), py = Math.round(cy + Math.sin(a * Math.PI / 180) * r * .78); g.R(px, py, 2, 2, '#c8a85a'); }
}
// la estrella de Belén sobre el pesebre (pocos efectos: un brillo, cuatro rayos y una luz que baja)
function estrellaArriba5(ctx, x, y, L) {
  const t = RELOJ, s = 1 + .06 * Math.sin(t * 1.7), b = typeof brilloEstrella5 === 'function' ? brilloEstrella5() : 1;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, 170 * s); g.addColorStop(0, 'rgba(255,245,200,' + (.75 * b) + ')'); g.addColorStop(.25, 'rgba(255,220,150,' + (.28 * b) + ')'); g.addColorStop(1, 'rgba(255,220,150,0)'); ctx.fillStyle = g; ctx.fillRect(x - 180, y - 180, 360, 360);
  const h = ctx.createLinearGradient(x, y, x, y + 300); h.addColorStop(0, 'rgba(255,240,190,' + (.22 * b) + ')'); h.addColorStop(1, 'rgba(255,240,190,0)'); ctx.fillStyle = h; ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y); ctx.lineTo(x + 120, y + 300); ctx.lineTo(x - 120, y + 300); ctx.fill();
  ctx.strokeStyle = 'rgba(255,242,200,' + (.85 * b) + ')'; ctx.lineWidth = 3; [[0, 64], [Math.PI / 2, 92], [Math.PI / 4, 30], [-Math.PI / 4, 30]].forEach(([a, l]) => { ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * l * s, y - Math.sin(a) * l * s); ctx.lineTo(x + Math.cos(a) * l * s, y + Math.sin(a) * l * s); ctx.stroke(); });
  ctx.restore(); estrella(ctx, x, y, 13 * s, '#fff6d0');
}
