// =====================================================================
//  LA PROGRESIÓN DE BELÉN (más lenta e inductiva, decisión 23-nov): sonido antes que símbolo.
//  Día 1: UNA nota (MI) y UN dedo (el 3); el ritmo varía primero (tan, taaan, silencio, taca) con muchas repeticiones
//  y pequeñas variaciones; las notas llegan de una en una; la lectura del pentagrama entra después y de a poco.
//  Este archivo es solo datos y funciones puras: lo usa el juego y también pruebas/progresion.js (la tabla y la curva).
// =====================================================================
const CELDAS5 = { tan: [1], taaan: [2], sh: [-1], taca: [.5, .5], taaaaan: [4] };   // -1 = silencio de negra
const DEDO5 = { 60: 1, 62: 2, 64: 3, 65: 4, 67: 5 };                                       // mano derecha en posición de DO
const NOMBRE_RITMO5 = { tan: 'negra «tan»', taaan: 'blanca «taaan»', sh: 'silencio «sh»', taca: 'corcheas «taca»', taaaaan: 'redonda «taaaaan»' };
//   misión: [notas, ritmos, lectura (0 bloques · 1 tenue · 2 pentagrama), tempo, lo nuevo del Salón, canción de la SEMANA (M5: una por bloque de misiones)]
const PLAN_BELEN5 = [
  [[4], ['tan', 'taaan'], 0, 56, 'tan y taaan en MI, con el dedo 3', 'jingle'],
  [[4], ['tan', 'taaan', 'sh'], 0, 56, 'el silencio: «sh» (no se toca)', 'jingle'],
  [[4], ['tan', 'taaan', 'sh', 'taca'], 0, 58, 'taca: dos notas en un pulso', 'jingle'],
  [[4, 7], ['tan', 'taaan', 'sh'], 0, 58, 'segunda nota: SOL, con el dedo 5', 'jingle'],
  [[4, 7], ['tan', 'taaan', 'sh', 'taca'], 1, 60, 'los bloques viven en el pentagrama (lectura tenue)', 'noche'],
  [[4, 7, 0], ['tan', 'taaan', 'sh'], 1, 60, 'tercera nota: DO, con el dedo 1', 'noche'],
  [[4, 7, 0], ['tan', 'taaan', 'sh', 'taca'], 1, 62, 'taca con tres notas', 'noche'],
  [[4, 7, 0, 2], ['tan', 'taaan', 'sh'], 2, 64, 'RE con el dedo 2; ya se lee el pentagrama', 'noche'],
  [[4, 7, 0, 2], ['tan', 'taaan', 'sh', 'taca', 'taaaaan'], 2, 66, 'la redonda: «taaaaan»', 'campana'],
  [[4, 7, 0, 2, 5], ['tan', 'taaan', 'sh', 'taca'], 2, 68, 'FA con el dedo 4: la mano completa', 'campana'],
  [[4, 7, 0, 2, 5], ['tan', 'taaan', 'sh', 'taca', 'taaaaan'], 2, 70, 'cinco dedos, cinco notas', 'campana'],
  [[4, 7, 0, 2, 5, 9], ['tan', 'taaan', 'sh', 'taca', 'taaaaan'], 2, 72, 'LA: la mano se estira', 'venid'],
  [[4, 7, 0, 2, 5, 9, 11], ['tan', 'taaan', 'sh', 'taca', 'taaaaan'], 2, 76, 'SI: ya están las siete', 'venid'],
  [[4, 7, 0, 2, 5, 9, 11], ['tan', 'taaan', 'sh', 'taca', 'taaaaan'], 2, 80, 'repaso de todo (a tempo de la canción)', 'venid'],
];
const DICE_SALON5 = ['Hoy, un solo dedo y una nota: MI.', 'El silencio también es música: sh.', 'Taca: dos notas en un solo pulso.', 'Una nota nueva: SOL, con el dedo cinco.', 'Ahora los bloques viven en el pentagrama.', 'Una nota nueva: DO, con el dedo uno.', 'Taca con tres notas.', 'Nota nueva: RE, con el dedo dos.', 'La redonda dura cuatro pulsos: taaaaan.', 'Nota nueva: FA, con el dedo cuatro.', 'Cinco dedos, cinco notas.', 'Nota nueva: LA; la mano se estira.', 'Nota nueva: SI; ya están las siete.', 'Hoy repasamos todo, a tempo.'];
function planDia5(d) { const p = PLAN_BELEN5[Math.min(PLAN_BELEN5.length - 1, Math.max(0, d))]; return { dice: DICE_SALON5[Math.min(DICE_SALON5.length - 1, Math.max(0, d))], dia: d + 1, notas: p[0], ritmos: p[1], lectura: p[2], bpm: p[3], nuevo: p[4], cancion: p[5], punteadas: d >= 6 }; }
// patrones de 8 pulsos (dos compases): compases-plantilla con las celdas del día; muchas repeticiones con pequeñas variaciones
const COMPASES5 = ['tan tan taaan', 'taaan tan tan', 'tan tan tan tan', 'taaan taaan', 'tan taaan tan',
  'tan tan tan sh', 'tan sh tan sh', 'taaan tan sh', 'tan sh taaan', 'sh tan tan tan',
  'taca taca taaan', 'tan taca tan tan', 'taca tan taca tan', 'taca taca tan sh', 'tan tan taca tan', 'taca taca taca tan'];
function rngP5(s) { let x = s >>> 0 || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
const PC_MIDI5 = { 0: 60, 2: 62, 4: 64, 5: 65, 7: 67, 9: 69, 11: 71 };
function patronesDia5(d, cuantos = 12, semilla = 7) {
  const P = planDia5(d), R = rngP5(semilla * 131 + d * 17), ok = new Set(P.ritmos);
  const bars = COMPASES5.filter(b => b.split(' ').every(c => ok.has(c))), cierre = bars.filter(b => /taaan$/.test(b) || b === 'taaan taaan');
  const nuevo = P.ritmos[P.ritmos.length - 1], conNuevo = bars.filter(b => b.split(' ').includes(nuevo));
  const pick = L => L[Math.floor(R() * L.length)];
  let A = d === 0 ? 'tan tan taaan' : pick(conNuevo.length ? conNuevo : bars), B = pick(cierre.length ? cierre : bars);
  const notas = P.notas.map(pc => PC_MIDI5[pc]), nn = notas[notas.length - 1], prev = notas.slice(-3);
  const lista = [];
  for (let i = 0; i < cuantos; i++) {
    // variación pequeña: cada dos patrones cambia UN compás (alternando cuál); a veces se repite igual
    if (i > 0 && i % 2 === 0) { if ((i / 2) % 2) A = pick(bars); else B = pick(cierre.length ? cierre : bars); }
    const cs = (A + ' ' + B).split(' '), esquema = notas.length === 1 ? 0 : i % 4;
    const out = []; cs.forEach((c, j) => { const enB = j >= A.split(' ').length;
      const n = esquema === 0 ? (i < 2 ? notas[0] : prev[0]) : esquema === 1 ? (enB ? nn : prev[0]) : esquema === 2 ? prev[j % prev.length] : (enB ? prev[0] : nn);
      CELDAS5[c].forEach(x => out.push(x < 0 ? { n: 0, d: -x } : { n, d: x })); });
    if (out[0].n === 0) out[0] = { n: notas[0], d: 1 };
    lista.push(out);
  }
  return lista;
}
function ritmoDe5(notas) { return notas.map(x => x.n === 0 ? 'sh' : x.d === .5 ? 'taca' : x.d === 1 ? 'tan' : x.d === 2 ? 'taaan' : x.d === 4 ? 'taaaaan' : 'punteada'); }
if (typeof module !== 'undefined') module.exports = { DICE_SALON5, PLAN_BELEN5, planDia5, patronesDia5, CELDAS5, DEDO5, NOMBRE_RITMO5, ritmoDe5 };
