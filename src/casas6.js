// =====================================================================
//  M6 · LAS CASAS DE BELÉN SE PUEDEN ENTRAR: interior desde arriba (estilo del pueblo), un vecino y su PEDIDO musical
//  según la casa (panadería = ritmo de amasar, carpintería = martillo en el pulso, cuna = suave, reloj de cuco = contar,
//  gallo = ¿sube o baja?, abuela = su canción, herrería = golpes de yunque, telar = inventar, lira = ¿qué nota es?).
//  Varias casas comparten plantilla de interior, con muebles y pedido distintos. Dan corcheas (premioRincon5).
// =====================================================================
const TIPOS_CASA5 = [
  { id: 'panaderia', nombre: 'La panadería', plantilla: 'cocina', color: NC.RE, persona: { id: 'cPanadero', adulto: true, barba: '#5a3418', pelo: '#5a3418', peinado: 'corto', ropa: '#fbf1d8', ropa2: '#d8c8a8', delantal: '#ffffff', pantalon: '#6a4a2a', sombrero: '#ffffff' },
    pedido: { tipo: 'ritmo', posada: true, rondas: 3, nombre: 'El panadero: amasa al ritmo', dice: 'Amasamos al ritmo: repite mis palmadas.' } },
  { id: 'carpinteria', nombre: 'La carpintería', plantilla: 'taller', color: NC.FA, persona: { id: 'cCarpintero', adulto: true, barba: '#3a2418', pelo: '#3a2418', peinado: 'rizos', ropa: '#7a9a5a', delantal: '#a8703a', pantalon: '#4a3a2a' },
    pedido: { tipo: 'pulso', martillo: true, rondas: 2, nombre: 'El carpintero: martillo en el pulso', dice: 'Un golpe de martillo en cada pulso.' } },
  { id: 'cuna', nombre: 'La casa del bebé', plantilla: 'cuarto', color: NC.SI, persona: { id: 'cMamaBebe', adulto: true, velo: '#b86bff', ropa: '#e2d2f0', ropa2: '#c8b6e0', falda: true, larga: true, piel: '#d9a07a' },
    pedido: { tipo: 'suave', rondas: 1, nombre: 'El bebé duerme: toca suavecito', dice: 'El bebé duerme. Toca suavecito y despacio.' } },
  { id: 'cuco', nombre: 'La casa del reloj', plantilla: 'sala', color: NC.SOL, persona: { id: 'cRelojero', adulto: true, pelo: '#e2d8ca', peinado: 'calvo', barba: '#e2d8ca', ropa: '#5a7dff', saco: '#3450c4', pantalon: '#3a3a52' },
    pedido: { tipo: 'contar', rondas: 3, nombre: 'El reloj de cuco: cuenta y toca', dice: 'Cuenta los cucús del reloj y tócalos.' } },
  { id: 'gallo', nombre: 'El corral del gallo', plantilla: 'corral', color: NC.DO, persona: { id: 'cGranjera', adulto: true, velo: '#ff9a3c', ropa: '#5fa05a', ropa2: '#3f7a3f', falda: true, larga: true, delantal: '#fbf1d8' },
    pedido: { tipo: 'subeBaja', rondas: 3, nombre: 'El gallo canta: ¿subió o bajó?', dice: 'Kikirikí: escucha si la voz sube o baja.' } },
  { id: 'abuela', nombre: 'La casa de la abuela', plantilla: 'sala', color: NC.LA, persona: { id: 'cAbuela', adulto: true, pelo: '#e2d8ca', peinado: 'largo', ropa: '#b86bff', ropa2: '#7f3fc8', falda: true, larga: true, piel: '#f2c4a0', baculo: true },
    pedido: { tipo: 'eco', canta: true, rondas: 3, nombre: 'La abuela: su canción', dice: 'Te canto mi canción; repítela en el piano.' } },
  { id: 'herreria', nombre: 'La herrería', plantilla: 'taller', color: '#8a8aa0', persona: { id: 'cHerrero', adulto: true, barba: '#2a1a1a', pelo: '#2a1a1a', peinado: 'corto', ropa: '#6a5a5a', delantal: '#3a2a2a', pantalon: '#3a3a3a', piel: '#c98e62' },
    pedido: { tipo: 'ritmo', posada: true, rondas: 3, nombre: 'El herrero: golpes de yunque', dice: '¡Clang! Repite los golpes del yunque.' } },
  { id: 'telar', nombre: 'La casa del telar', plantilla: 'cuarto', color: NC.MI, persona: { id: 'cTejedora', adulto: true, pelo: '#2a1810', peinado: 'largo', ropa: '#ffd046', ropa2: '#e6a21b', falda: true, larga: true, piel: '#a8704a' },
    pedido: { tipo: 'libre', rondas: 3, nombre: 'La tejedora: teje tu música', dice: 'Toca lo que quieras y mi telar lo teje.' } },
  { id: 'lira', nombre: 'La casa del músico', plantilla: 'sala', color: NC.SOL, persona: { id: 'cLira', adulto: true, pelo: '#3a2418', peinado: 'rizos', ropa: '#2e8b6a', ropa2: '#1f6a50', larga: true, cinturon: '#d9a930', piel: '#e8b48c' },
    pedido: { tipo: 'nota', rondas: 4, nombre: 'El músico: ¿qué nota toqué?', dice: 'Toco una nota en mi lira. Búscala en el piano.' } },
];
TIPOS_CASA5.forEach(T => { RINCONES5['casa-' + T.id] = Object.assign({ casa: true, color: T.color, retrato: () => sprPersona5(T.persona, 'abajo', 0) }, T.pedido); COLOR_RINCON5['casa-' + T.id] = T.color; });
// ---------- muebles (píxel con contorno) ----------
function sprCuna5() { return cache('cunaM', () => sprite(26, 18, g => { g.ellE(0, 10, 26, 8, '#8a5a32'); g.R(2, 4, 22, 8, '#a8703a'); g.R(3, 5, 20, 5, '#e2d2f0'); g.R(5, 4, 7, 4, '#ffd6b8'); g.px(7, 5, '#2b1740'); g.px(10, 5, '#2b1740'); g.R(12, 5, 10, 4, '#b8aaff'); for (let x = 3; x < 24; x += 3) g.R(x, 1, 1, 4, '#8a5a32'); g.R(2, 0, 22, 2, '#a8703a'); }, { ax: 13, ay: 18 })); }
function sprCuco5(abierto) { return cache('cuco' + !!abierto, () => sprite(22, 34, g => { g.R(10, 22, 2, 12, '#3a2a2a'); g.R(1, 4, 20, 18, '#8a5a32'); g.R(0, 0, 22, 5, '#6a3a1a'); g.R(9, -1, 4, 3, '#6a3a1a'); g.disc(11, 14, 5, '#fbf1d8'); g.R(11, 10, 1, 4, '#2a1a3a'); g.R(11, 14, 3, 1, '#2a1a3a'); g.R(8, 5, 6, 4, abierto ? '#2a1a1a' : '#a8703a'); if (abierto) { g.R(10, 3, 5, 4, '#ffd046'); g.px(15, 4, '#ff9a3c'); g.px(11, 4, '#2a1a3a'); } g.R(4, 30, 3, 4, '#d9a930'); g.R(15, 27, 3, 4, '#d9a930'); }, { ax: 11, ay: 34 })); }
const MUEBLE5 = {
  horno: () => cache('mHorno', () => sprite(40, 34, g => { g.ellE(0, 0, 40, 34, '#b8743a'); g.ellE(3, 3, 34, 28, '#d89a5a'); g.ellE(10, 12, 20, 16, '#2a1a1a'); g.ellE(13, 18, 14, 9, '#ff9a3c'); g.ellE(16, 21, 8, 5, '#ffd046'); g.R(0, 28, 40, 6, '#8a5a32'); }, { ax: 20, ay: 34 })),
  mesa: () => cache('mMesa', () => sprite(36, 22, g => { g.R(0, 2, 36, 12, '#a8703a'); g.R(0, 2, 36, 2, '#c98a52'); g.R(2, 14, 3, 8, '#6a3a1a'); g.R(31, 14, 3, 8, '#6a3a1a'); g.ellE(6, 4, 9, 6, '#e8b47c'); g.ellE(20, 4, 10, 6, '#d89a5a'); g.R(22, 5, 6, 1, '#fbf1d8'); }, { ax: 18, ay: 22 })),
  sacos: () => cache('mSacos', () => sprite(26, 20, g => { g.ellE(0, 4, 13, 16, '#e8dcc0'); g.ellE(12, 3, 14, 17, '#f0e6d0'); g.R(4, 4, 5, 2, '#c8b890'); g.R(16, 3, 6, 2, '#c8b890'); }, { ax: 13, ay: 20 })),
  banco: () => cache('mBanco', () => sprite(44, 22, g => { g.R(0, 4, 44, 8, '#a8703a'); g.R(0, 4, 44, 2, '#c98a52'); g.R(2, 12, 4, 10, '#6a3a1a'); g.R(38, 12, 4, 10, '#6a3a1a'); g.R(8, 1, 14, 4, '#e8c890'); g.R(26, 2, 6, 3, '#6a6a7a'); g.R(30, 0, 2, 3, '#8a5a2a'); }, { ax: 22, ay: 22 })),
  tablas: () => cache('mTablas', () => sprite(18, 34, g => { for (let k = 0; k < 4; k++) g.R(k * 4, 2 + k, 4, 32 - k, ['#c98a52', '#a8703a', '#d8a060', '#b8803a'][k]); }, { ax: 9, ay: 34 })),
  yunque: () => cache('mYunque', () => sprite(30, 22, g => { g.R(4, 0, 22, 6, '#6a6a7a'); g.R(0, 1, 6, 3, '#6a6a7a'); g.R(10, 6, 10, 8, '#4a4a5a'); g.R(6, 14, 18, 8, '#5a3a2a'); g.R(5, 0, 18, 1, '#a0a0b0'); }, { ax: 15, ay: 22 })),
  fragua: () => cache('mFragua', () => sprite(32, 30, g => { g.R(0, 8, 32, 22, '#8a7a6a'); g.R(4, 12, 24, 10, '#2a1a1a'); g.R(7, 15, 18, 6, '#ff5a2a'); g.R(10, 16, 10, 3, '#ffd046'); g.R(10, 0, 12, 9, '#6a5a4a'); }, { ax: 16, ay: 30 })),
  cama: () => cache('mCama', () => sprite(30, 40, g => { g.R(0, 0, 30, 40, '#7a4a2a'); g.R(2, 2, 26, 36, '#fbf1d8'); g.R(2, 12, 26, 26, '#5a7dff'); for (let y = 14; y < 38; y += 6) g.R(2, y, 26, 1, '#3f5ad0'); g.R(5, 3, 20, 7, '#ffffff'); }, { ax: 15, ay: 40 })),
  comoda: () => cache('mComoda', () => sprite(28, 24, g => { g.R(0, 4, 28, 20, '#a8703a'); g.R(0, 4, 28, 2, '#c98a52'); g.R(2, 9, 24, 6, '#8a5a32'); g.R(2, 17, 24, 6, '#8a5a32'); g.px(13, 11, '#ffd046'); g.px(13, 19, '#ffd046'); g.R(4, 0, 6, 5, '#ff9cc4'); g.R(18, 0, 5, 5, '#fbf1d8'); }, { ax: 14, ay: 24 })),
  telar: () => cache('mTelar', () => sprite(36, 34, g => { g.R(0, 0, 4, 34, '#8a5a32'); g.R(32, 0, 4, 34, '#8a5a32'); g.R(0, 2, 36, 3, '#a8703a'); g.R(0, 26, 36, 3, '#a8703a'); for (let x = 5; x < 32; x += 2) g.R(x, 5, 1, 21, '#e2d8ca'); for (let y = 8; y < 24; y += 3) g.R(5, y, 26, 2, [NC.DO, NC.MI, NC.SOL, NC.SI, NC.FA, NC.RE][(y / 3) % 6 | 0]); }, { ax: 18, ay: 34 })),
  mecedora: () => cache('mMece', () => sprite(22, 26, g => { g.R(2, 0, 18, 14, '#8a5a32'); g.R(4, 2, 14, 10, '#c0533f'); g.R(2, 14, 18, 6, '#a8703a'); g.ellE(0, 21, 22, 5, '#6a3a1a'); }, { ax: 11, ay: 26 })),
  clavicordio: () => cache('mClavi', () => sprite(44, 26, g => { g.R(0, 0, 44, 14, '#6a3a1a'); g.R(2, 2, 40, 6, '#8a5a32'); for (let k = 0; k < 13; k++) g.R(2 + k * 3, 8, 2, 6, '#fffaf4'); for (let k = 0; k < 13; k++) if ([0, 1, 3, 4, 5].includes(k % 7)) g.R(3 + k * 3, 8, 2, 3, '#2a1a1a'); g.R(3, 14, 3, 12, '#4a2a12'); g.R(38, 14, 3, 12, '#4a2a12'); g.R(16, 18, 12, 4, '#a8703a'); }, { ax: 22, ay: 26 })),
  lira: () => cache('mLira', () => sprite(20, 30, g => { g.R(2, 2, 3, 24, '#d9a930'); g.R(15, 2, 3, 24, '#d9a930'); g.R(2, 0, 16, 3, '#d9a930'); g.ellE(1, 20, 18, 10, '#a8703a'); for (let x = 6; x < 15; x += 2) g.R(x, 3, 1, 19, '#fffaf4'); }, { ax: 10, ay: 30 })),
  gallina: f => cache('mGall' + f, () => sprite(14, 14, g => { g.ellE(0, 4, 12, 10, '#fffaf2'); g.ellE(7, 0 + f, 7, 7, '#fffaf2'); g.R(11, 2 + f, 3, 2, '#ffd046'); g.R(8, -1 + f, 3, 2, NC.DO); g.px(9, 2 + f, '#2a1a3a'); g.R(3, 13, 1, 1, '#ffd046'); g.R(7, 13, 1, 1, '#ffd046'); }, { ax: 7, ay: 14 })),
  gallo: f => cache('mGallo' + f, () => sprite(18, 20, g => { for (let k = 0; k < 4; k++) g.R(0 + k, 2 + k * 2, 3, 6, ['#2e8b6a', '#3450c4', '#c23345', '#2e8b6a'][k]); g.ellE(2, 6, 13, 11, '#c0533f'); g.ellE(9, 0 + f, 8, 8, '#e06a3a'); g.R(15, 3 + f, 3, 2, '#ffd046'); g.R(10, -2 + f, 5, 3, NC.DO); g.R(13, 6 + f, 2, 3, NC.DO); g.px(13, 3 + f, '#2a1a3a'); g.R(6, 17, 1, 3, '#ffd046'); g.R(10, 17, 1, 3, '#ffd046'); }, { ax: 9, ay: 20 })),
  cuna: () => sprCuna5(),
  maceta: () => cache('mMaceta', () => sprite(14, 20, g => { g.R(2, 12, 10, 8, '#c07a4a'); g.ellE(0, 0, 14, 13, '#4a8a4a'); g.px(4, 3, '#ff9cc4'); g.px(9, 5, '#ffd046'); }, { ax: 7, ay: 20 })),
};
// ---------- el interior (13 × 10 baldosas): pared al fondo, piso, puerta abajo ----------
const PLANT5 = {
  cocina: { piso: ['#b88a5a', '#a8784a'], pared: '#efdcb8', muebles: [['horno', 2, 4], ['mesa', 7, 5], ['sacos', 10, 3], ['clavicordio', 3, 7], ['maceta', 11, 7]], vecino: [7, 4] },
  taller: { piso: ['#9a8a72', '#8a7a62'], pared: '#d8c49a', muebles: [['banco', 3, 4], ['tablas', 10, 3], ['clavicordio', 3, 7], ['mesa', 9, 7]], vecino: [7, 5] },
  cuarto: { piso: ['#c8a070', '#b8905e'], pared: '#f2e2d2', muebles: [['cama', 10, 4], ['comoda', 6, 3], ['clavicordio', 3, 7], ['maceta', 1, 3]], vecino: [5, 5] },
  sala: { piso: ['#b8865a', '#a87648'], pared: '#ead2b4', muebles: [['mecedora', 3, 4], ['mesa', 8, 6], ['clavicordio', 3, 7], ['maceta', 11, 3]], vecino: [6, 4] },
  corral: { piso: ['#c8b070', '#b8a060'], pared: '#c9b48e', muebles: [['sacos', 2, 3], ['clavicordio', 3, 7], ['maceta', 11, 7]], vecino: [7, 4], paja: true },
};
const EXTRA_CASA5 = { carpinteria: [['mesa', 9, 7]], herreria: [['yunque', 7, 7], ['fragua', 10, 3]], cuna: [['cuna', 2, 4]], telar: [['telar', 2, 4]], cuco: [], abuela: [], lira: [['lira', 9, 3]], panaderia: [], gallo: [] };
function defCasa5(o, T) {
  const P = PLANT5[T.plantilla], W = 13, H = 10, objetos = [], props = [], npcs = [];
  (P.muebles.filter(m => !(T.id === 'herreria' && m[0] === 'mesa')).concat(EXTRA_CASA5[T.id] || [])).forEach(([id, i, j]) => { const a = id === 'clavicordio' || id === 'mesa' || id === 'banco' || id === 'telar' || id === 'fragua' ? [[i - 1, j], [i + 1, j]] : id === 'cama' ? [[i, j + 1], [i - 1, j], [i - 1, j + 1]] : []; props.push({ i, j, spr: MUEBLE5[id](0), ocupa: a, rincon: id === 'clavicordio' ? 'casa-' + T.id : null, toca: id === 'clavicordio' ? [[i, j + 1]] : null }); });
  if (T.id === 'cuco') props.push({ i: 10, j: 2, spr: sprCuco5(false), bloquea: false, orden: -40 });
  if (T.plantilla === 'corral') { npcs.push({ id: 'gallo', nombre: 'El gallo', i: 9, j: 5, ruta: [[9, 5], [10, 5]], vel: 1, descanso: 2, dibujo: n => MUEBLE5.gallo(Math.floor(RELOJ * 2) % 2), escala: 1, rincon: 'casa-' + T.id });
    [[4, 5], [5, 6], [10, 7]].forEach(([i, j], k) => npcs.push({ id: 'gal' + k, nombre: 'Gallina', i, j, ruta: [[i, j], [i + 1, j]], vel: .8, descanso: 2 + k, dibujo: n => MUEBLE5.gallina(Math.floor(RELOJ * 2 + k) % 2), escala: 1 })); }
  const [vi, vj] = P.vecino; npcs.push({ id: 'vecino', nombre: T.nombre, persona: T.persona, i: vi, j: vj, dir: 'abajo', mira: ['abajo', 'izq', 'der'], rincon: 'casa-' + T.id });
  return {
    id: 'casa-' + T.id + o.id, nombre: T.nombre, titulo: T.nombre, W, H, inicio: [6, 8, 'arriba'], vel: 6.6, recordar: false, sinMapa: true, noche: false, luzA: .6, fondoColor: '#1a1430',
    suelo: (i, j) => (j <= 2 || j === H - 1 || i === 0 || i === W - 1) ? (j === H - 1 && i === 6 ? 'c' : 'm') : 'p', bloqueaSuelo: t => t === 'm',
    pintarSuelo: (g, ctx, { tipo }) => {
      for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const x = i * TA, y = j * TA, t = tipo(i, j);
        if (t === 'p' || t === 'c') { g.R(x, y, TA, TA, P.piso[(i + j) % 2]); if (P.paja) { for (let k = 0; k < 6; k++) g.R(x + (k * 5 + j * 3) % 14, y + (k * 7 + i) % 14, 3, 1, k % 2 ? '#e8d090' : '#a89048'); } else { g.R(x, y + 15, TA, 1, mezcla(P.piso[1], '#000', .25)); g.R(x + ((j * 7) % 16), y, 1, 15, mezcla(P.piso[1], '#000', .18)); } }
        else { g.R(x, y, TA, TA, j <= 2 && i > 0 && i < W - 1 ? P.pared : '#5a4632'); } }
      // la pared del fondo: zócalo, viga, ventana con luna, un cuadro y un estante con cántaros
      g.R(TA, 2 * TA + 8, (W - 2) * TA, 8, mezcla(P.pared, '#7a4a2a', .45)); g.R(TA, 6, (W - 2) * TA, 4, '#8a5a32');
      g.R(6 * TA, 14, 26, 20, '#5a4632'); g.R(6 * TA + 2, 16, 22, 16, '#2f4b7c'); g.disc(6 * TA + 17, 22, 3, '#fff6c0'); g.R(6 * TA + 12, 16, 1, 16, '#5a4632');
      g.R(2 * TA, 16, 22, 16, '#d9a930'); g.R(2 * TA + 2, 18, 18, 12, [NC.SOL, NC.FA, NC.SI, NC.DO, NC.RE][T.id.length % 5]); g.R(2 * TA + 6, 22, 10, 6, '#fffaf4');
      g.R(9 * TA, 26, 40, 3, '#8a5a32'); [0, 12, 24].forEach((dx, k) => g.ellE(9 * TA + 4 + dx, 15, 9, 11, ['#c07a4a', '#5a86c4', '#e8b47c'][k]));
      g.R(6 * TA, (H - 1) * TA, TA, TA, '#6e4426'); g.R(6 * TA + 2, (H - 1) * TA, TA - 4, 4, '#8a5a34');
      // alfombra
      g.R(4 * TA, 5 * TA + 4, 5 * TA, 3 * TA - 8, '#c23345'); g.R(4 * TA + 4, 5 * TA + 8, 5 * TA - 8, 3 * TA - 16, '#ff9a8a'); for (let k = 0; k < 5; k++) g.R(4 * TA + 10 + k * 14, 6 * TA + 4, 6, 6, [NC.MI, NC.SOL, NC.FA, NC.SI, NC.DO][k]);
    },
    objetos, props, npcs, sanson: true,
    salida: (i, j, d) => d === 'abajo' && j >= H, alSalir: L => { const B = LUGARES5.belen; B.auto = false; B.alEntrar = null; irA(B, { tipo: 'iris', desde: o.puerta.slice(), dir: 'abajo' }); },
    luces: [[6.5 * TA, 1.5 * TA, 60, .35, '255,226,160'], [3 * TA, 6.5 * TA, 90, .4, '255,200,120'], [10 * TA, 6 * TA, 90, .35, '255,200,120']],
    subtitulo: () => '♪ ' + RINCONES5['casa-' + T.id].nombre,
  };
}
function entrarCasa5(L, o) {
  const T = TIPOS_CASA5[o.casaK % TIPOS_CASA5.length], k = 'casa-' + o.id;
  if (!LUGARES5[k]) { const C = crearArriba(defCasa5(o, T)); C.def.alActuar = (L2, x) => { if (x.rincon) { abrirRincon5(L2, x.rincon, x); return true; } return false; }; C.nota = (n, t, f) => C.panel && C.panel.nota ? C.panel.nota(n, t, f) : null; C.objetivo = () => C.panel && C.panel.objetivo ? C.panel.objetivo() : null; C.reloj = () => C.panel && C.panel.t != null ? C.panel.t : RELOJ; C.fondo7 = FONDO_CASA7[T.plantilla]; LUGARES5[k] = C; }
  marca5('entra a ' + T.nombre); irA(LUGARES5[k], L.irisEn(o));
}
function iniciarCasas5() {
  const B = LUGARES5.belen; if (!B) return; let k = 0;
  B.objetos.forEach(o => { if (/^casa\d/.test(o.id)) { o.casaK = k++; const T = TIPOS_CASA5[o.casaK % TIPOS_CASA5.length]; o.nombre = T.nombre; o.accion = (L, ob) => entrarCasa5(L, ob); } });
  const ant = B.burbujas; B.burbujas = () => { const out = ant ? ant() : []; B.objetos.forEach(o => { if (o.casaK == null) return; const T = TIPOS_CASA5[o.casaK % TIPOS_CASA5.length], hecho = rinconDe5('casa-' + T.id); out.push({ x: (o.i + o.w / 2) * TA, y: (o.j + o.h) * TA - 3 * TA - 8, c: T.color, txt: T.nombre + (hecho ? '' : ' · ¡pedido!'), icono: hecho ? '✓' : '♪', ir: [o.puerta[0], o.puerta[1], 'arriba'], lejos: 9, cerca: 6 }); }); return out; };
}
