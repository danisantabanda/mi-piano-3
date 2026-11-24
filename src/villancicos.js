// =====================================================================
//  M3 · LOS CINCO VILLANCICOS DEL PRELUDIO (dominio público / tradicionales), por pedazos.
//  Notación compacta: "E4 E4 E4:2 | …"  (duración en negras; por omisión 1; '|' solo para leer).
//  Cada villancico: compás, tempo (nunca más rápido que la canción), pedazos con su armonía por compás,
//  anacrusa (anac: tiempos de entrada antes del primer compás) y las versiones de Sarah y de David (más corta).
// =====================================================================
const LETRA_MIDI5 = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function notas5(txt) {
  return txt.split(/\s+/).filter(t => t && t !== '|').map(t => { const [nm, d] = t.split(':'), m = nm.match(/^([A-G])(#?)(\d)$/); return { n: (+m[3] + 1) * 12 + LETRA_MIDI5[m[1]] + (m[2] ? 1 : 0), d: d ? +d : 1 }; });
}
const VILLANCICOS5 = {
  jingle: {
    titulo: 'Jingle Bells', compas: 4, bpm: 80,
    pedazos: [
      { m: 'E4 E4 E4:2 | E4 E4 E4:2', ac: ['C', 'C'] },
      { m: 'E4 G4 C4:1.5 D4:.5 | E4:4', ac: ['C', 'C'] },
      { m: 'F4 F4 F4:1.5 F4:.5 | F4 E4 E4 E4:.5 E4:.5', ac: ['F', 'C'] },
      { m: 'E4 D4 D4 E4 | D4:2 G4:2', ac: ['D', 'G'] },
      { m: 'G4 G4 F4 D4 | C4:4', ac: ['G7', 'C'] },
    ],
    sarah: [0, 1, 2, 4], david: [0, 1],
  },
  noche: {
    titulo: 'Noche de paz', compas: 3, bpm: 72,
    pedazos: [
      { m: 'G4:1.5 A4:.5 G4 | E4:3 | G4:1.5 A4:.5 G4 | E4:3', ac: ['C', 'C', 'C', 'C'] },
      { m: 'D5:2 D5 | B4:3 | C5:2 C5 | G4:3', ac: ['G', 'G', 'C', 'C'] },
      { m: 'A4:2 A4 | C5:1.5 B4:.5 A4 | G4:1.5 A4:.5 G4 | E4:3', ac: ['F', 'F', 'C', 'C'] },
      { m: 'A4:2 A4 | C5:1.5 B4:.5 A4 | G4:1.5 A4:.5 G4 | E4:3', ac: ['F', 'F', 'C', 'C'] },
      { m: 'D5:2 D5 | F5:1.5 D5:.5 B4 | C5:3 | E5:3', ac: ['G', 'G7', 'C', 'C'] },
      { m: 'C5:1.5 G4:.5 E4 | G4:1.5 F4:.5 D4 | C4:3 | C4:3', ac: ['C', 'G7', 'C', 'C'] },
    ],
    sarah: [0, 1, 2, 3, 4, 5], david: [0, 1],
  },
  venid: {   // Adeste fideles, en DO (el original va en SOL): así todo cae en teclas blancas
    titulo: 'Venid, fieles todos', compas: 4, bpm: 76,
    pedazos: [
      { m: 'C5 | C5:2 G4 C5 | D5:2 G4:2 | E5 D5 E5 F5 | E5:2 D5', anac: 1, ac: ['C', 'G', 'C', 'G'] },
      { m: 'C5 | C5:2 B4 A4 | B4 C5 D5 E5 | B4:2 A4:1.5 G4:.5 | G4:4', anac: 1, ac: ['Am', 'G', 'G', 'G'] },
      { m: 'C5 | C5 B4 C5 D5 | C5:2 G4', anac: 1, ac: ['C', 'C'] },
      { m: 'E5 | E5 D5 E5 F5 | E5:2 D5', anac: 1, ac: ['C', 'G'] },
      { m: 'E5 | F5 E5 D5 C5 | B4:2 C5 F5 | E5:2 D5:1.5 C5:.5 | C5:4', anac: 1, ac: ['F', 'G', 'C', 'C'] },
    ],
    sarah: [0, 1, 2, 3, 4], david: [2, 3, 4],
  },
  // SIN VERIFICAR (transcritas de memoria; la red de la sesión no dejó bajar partituras): oír con Dani antes de los niños.
  peces: {
    titulo: 'Los peces en el río', compas: 2, bpm: 80, verificar: true,
    pedazos: [
      { m: 'E4:.5 A4:.5 A4:.5 B4:.5 | C5:.5 B4:.5 A4 | E4:.5 G#4:.5 G#4:.5 A4:.5 | B4:.5 A4:.5 G#4', ac: ['Am', 'Am', 'E', 'E'] },
      { m: 'E4:.5 A4:.5 A4:.5 B4:.5 | C5:.5 B4:.5 A4 | E4:.5 G#4:.5 B4:.5 G#4:.5 | A4:2', ac: ['Am', 'Am', 'E', 'Am'] },
      { m: 'C5:.5 C5:.5 C5:.5 D5:.5 | C5:.5 B4:.5 A4 | B4:.5 B4:.5 B4:.5 C5:.5 | B4:.5 A4:.5 G#4', ac: ['Am', 'Am', 'E', 'E'] },
      { m: 'C5:.5 C5:.5 B4:.5 A4:.5 | G#4:.5 A4:.5 B4 | E4:.5 G#4:.5 B4:.5 G#4:.5 | A4:2', ac: ['Am', 'Dm', 'E', 'Am'] },
    ],
    sarah: [0, 1, 2, 3], david: [2, 3],
  },
  campana: {
    titulo: 'Campana sobre campana', compas: 4, bpm: 80, verificar: true,
    pedazos: [
      { m: 'G4 C5 C5 C5 | B4 C5 D5 C5 | B4 C5 D5 E5 | D5:4', ac: ['C', 'C', 'G', 'G'] },
      { m: 'G4 C5 C5 C5 | B4 C5 D5 C5 | B4 A4 B4 G4 | C5:4', ac: ['C', 'C', 'G', 'C'] },
      { m: 'E5:2 D5:2 | C5 D5 E5 C5 | D5:2 B4:2 | G4:4', ac: ['C', 'C', 'G', 'G'] },
      { m: 'E5:2 D5:2 | C5 D5 E5 F5 | E5 D5 B4 G4 | C5:4', ac: ['C', 'C', 'G', 'C'] },
    ],
    sarah: [0, 1, 2, 3], david: [2, 3],
  },
};
const ROTACION5 = ['jingle', 'noche', 'peces', 'campana', 'venid'];   // el Teatro rota la canción del día
Object.values(VILLANCICOS5).forEach(V => V.pedazos.forEach(p => { p.notas = notas5(p.m); }));
function versionDe5(id) { const V = VILLANCICOS5[id], q = GUARDA.d.perfil === 'david' ? 'david' : 'sarah'; return V[q]; }
