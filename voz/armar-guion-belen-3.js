// node voz/armar-guion-belen-3.js → voz/guion-belen-3.json (frases NUEVAS de M4 (la gran prueba), mismo formato que guion-v1) + voz/belen3_dani.json (Chatterbox)
// Reglas: una frase por evento, ≤ 4 s, sin preguntas, sin números en cifras. La cuenta («uno, dos, tres, cuatro») son muestras cortas
// que el juego programa en el reloj de audio, exactamente en cada pulso.
const fs = require('fs'), path = require('path');
const G1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'guion-belen.json'), 'utf8')), G2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'guion-belen-2.json'), 'utf8'));
const CPS = { 'dani-maestro': 13, 'dani-celebra': 14, 'dani-narrador': 11.5, 'dani-suave': 12 };
const QUIEN = { 'dani-maestro': 'maestro', 'dani-celebra': 'celebra', 'dani-narrador': 'narrador', 'dani-suave': 'suave' };
const F = [
  ['salon-dia-1', 'salon-dia-1', 'ensena', 'dani-maestro', 'calmado', 'Hoy, un solo dedo y una nota: MI.', 'Salón de Bach, día 1 de la progresión: lo nuevo.', 'Bach presenta lo nuevo con un globo.'],
  ['salon-dia-2', 'salon-dia-2', 'ensena', 'dani-maestro', 'calmado', 'El silencio también es música: sh.', 'Salón de Bach, día 2 de la progresión: lo nuevo.', 'Bach presenta lo nuevo con un globo.'],
  ['salon-dia-3', 'salon-dia-3', 'ensena', 'dani-maestro', 'calmado', 'Taca: dos notas en un solo pulso.', 'Salón de Bach, día 3 de la progresión: lo nuevo.', 'Bach presenta lo nuevo con un globo.'],
  ['salon-dia-4', 'salon-dia-4', 'ensena', 'dani-maestro', 'calmado', 'Una nota nueva: SOL, con el dedo cinco.', 'Salón de Bach, día 4 de la progresión: lo nuevo.', 'Bach presenta lo nuevo con un globo.'],
  ['salon-dia-5', 'salon-dia-5', 'ensena', 'dani-maestro', 'calmado', 'Ahora los bloques viven en el pentagrama.', 'Salón de Bach, día 5 de la progresión: lo nuevo.', 'Bach presenta lo nuevo con un globo.'],
  ['salon-dia-6', 'salon-dia-6', 'ensena', 'dani-maestro', 'calmado', 'Una nota nueva: DO, con el dedo uno.', 'Salón de Bach, día 6 de la progresión: lo nuevo.', 'Bach presenta lo nuevo con un globo.'],
  ['salon-dia-7', 'salon-dia-7', 'ensena', 'dani-maestro', 'calmado', 'Taca con tres notas.', 'Salón de Bach, día 7 de la progresión: lo nuevo.', 'Bach presenta lo nuevo con un globo.'],
  ['salon-dia-8', 'salon-dia-8', 'ensena', 'dani-maestro', 'calmado', 'Nota nueva: RE, con el dedo dos.', 'Salón de Bach, día 8 de la progresión: lo nuevo.', 'Bach presenta lo nuevo con un globo.'],
  ['salon-dia-9', 'salon-dia-9', 'ensena', 'dani-maestro', 'calmado', 'La redonda dura cuatro pulsos: taaaaan.', 'Salón de Bach, día 9 de la progresión: lo nuevo.', 'Bach presenta lo nuevo con un globo.'],
  ['salon-dia-10', 'salon-dia-10', 'ensena', 'dani-maestro', 'calmado', 'Nota nueva: FA, con el dedo cuatro.', 'Salón de Bach, día 10 de la progresión: lo nuevo.', 'Bach presenta lo nuevo con un globo.'],
  ['salon-dia-11', 'salon-dia-11', 'ensena', 'dani-maestro', 'calmado', 'Cinco dedos, cinco notas.', 'Salón de Bach, día 11 de la progresión: lo nuevo.', 'Bach presenta lo nuevo con un globo.'],
  ['salon-dia-12', 'salon-dia-12', 'ensena', 'dani-maestro', 'calmado', 'Nota nueva: LA; la mano se estira.', 'Salón de Bach, día 12 de la progresión: lo nuevo.', 'Bach presenta lo nuevo con un globo.'],
  ['salon-dia-13', 'salon-dia-13', 'ensena', 'dani-maestro', 'calmado', 'Nota nueva: SI; ya están las siete.', 'Salón de Bach, día 13 de la progresión: lo nuevo.', 'Bach presenta lo nuevo con un globo.'],
  ['salon-dia-14', 'salon-dia-14', 'ensena', 'dani-maestro', 'calmado', 'Hoy repasamos todo, a tempo.', 'Salón de Bach, día 14 de la progresión: lo nuevo.', 'Bach presenta lo nuevo con un globo.'],
  ['anuncio-batalla', 'anuncio-batalla', 'jefe', 'dani-celebra', 'alegre', 'El pastorcito te reta: duelo de eco.', 'Batalla con el rival (fuera del currículo, tres corazones).', 'El pastorcito levanta la flauta.'],
  ['anuncio-partituras', 'anuncio-partituras', 'juego', 'dani-maestro', 'alegre', 'Partitura al azar: lee y toca.', 'Partituras al azar (tres corazones).', 'Aparece el pentagrama completo.'],
  ['anuncio-caen', 'anuncio-caen', 'juego', 'dani-maestro', 'alegre', 'Toca cada nota cuando llegue a la línea.', 'Notas que caen (tres corazones).', 'Las notas bajan hacia su tecla.'],
  ['anuncio-concierto', 'anuncio-concierto', 'juego', 'dani-celebra', 'alegre', 'Tu familia vino a escucharte.', 'Sala de conciertos.', 'Papá, mamá, los primos y Sansón en la sala.'],
  ['anuncio-kiosco', 'anuncio-kiosco', 'juego', 'dani-maestro', 'alegre', 'La banda toca; tú llevas el pulso.', 'Kiosco: acompañar a la banda.', 'El director levanta la batuta.'],
  ['anuncio-museo', 'anuncio-museo', 'mundo', 'dani-narrador', 'tierno', 'Bienvenidos al museo de Belén.', 'Al entrar al museo.', 'Los retratos en sus marcos dorados.'],
  ['anuncio-tienda', 'anuncio-tienda', 'mundo', 'dani-maestro', 'alegre', 'El luthier tiene cosas lindas.', 'Al abrir la tienda del luthier.', 'Instrumentos, trajes y adornos.'],
  ['anuncio-vestidor', 'anuncio-vestidor', 'mundo', 'dani-maestro', 'alegre', 'Escoge tu traje.', 'Al abrir el vestidor.', 'Los trajes en el armario.'],
  ['concierto-bravo', 'concierto-bravo', 'celebra', 'dani-celebra', 'alegre', '¡Bravo! ¡Qué concierto!', 'Fin del concierto: aplauso.', 'La familia aplaude y salta.'],
  ['secreto-nota', 'secreto-nota', 'celebra', 'dani-celebra', 'alegre', '¡Una nota dorada!', 'Al hallar un secreto.', 'La corchea dorada gira.'],
];
const frases = F.map(([id, grupo, cat, voz, emocion, texto, cuando, acompana]) => {
  if (/[¿?]/.test(texto) || /\d/.test(texto)) throw new Error('regla: ' + id);
  if (G1.frases.some(f => f.id === id) || G2.frases.some(f => f.id === id)) throw new Error('id repetido con el guion 1: ' + id);
  const dur = +(Math.max(.5, texto.replace(/[¡!¿?.,;:…«»]/g, '').length / CPS[voz] + .3)).toFixed(1);
  if (dur > 4) throw new Error('más de 4 s: ' + id + ' ' + dur);
  return { id, grupo, cat, personaje: 'bach', voz, emocion, texto, cuando, acompana, dur_obj: dur, dur_max: /^cuenta-/.test(id) ? .6 : 4, interrumpible: !/^cuenta-/.test(id), bloquea: false, archivo: 'voces/' + id + '.ogg' };
});
const guion = {
  version: 'guion-belen-v2', fecha: new Date().toISOString().slice(0, 10), app: 'MI PIANO 3 · Belén (M4 (la gran prueba))',
  resumen: { frases: frases.length, segundos: +frases.reduce((a, f) => a + f.dur_obj, 0).toFixed(1), nota: 'Se suma a guion-belen.json y guion-belen-2.json (no los reemplaza).' },
  retirar: [],
  reglas_app: Object.assign({}, G1.reglas_app, { cuenta: 'La cuenta (cuenta-1…4) no pasa por el reproductor de frases: el juego la decodifica y la programa en el reloj de audio, en cada pulso de la cuenta, igual que el clic de Tic.' }),
  voces: G1.voces, personajes: G1.personajes, frases,
};
fs.writeFileSync(path.join(__dirname, 'guion-belen-3.json'), JSON.stringify(guion, null, 2));
fs.writeFileSync(path.join(__dirname, 'belen3_dani.json'), JSON.stringify(frases.map(f => ({ id: f.id, quien: QUIEN[f.voz], texto: f.texto })), null, 1));
console.log('guion-belen-3.json:', frases.length, 'frases nuevas · ' + guion.resumen.segundos + ' s');
