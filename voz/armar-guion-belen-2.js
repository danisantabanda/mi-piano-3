// node voz/armar-guion-belen-2.js → voz/guion-belen-2.json (frases NUEVAS de M3.1, mismo formato que guion-v1) + voz/belen2_dani.json (Chatterbox)
// Reglas: una frase por evento, ≤ 4 s, sin preguntas, sin números en cifras. La cuenta («uno, dos, tres, cuatro») son muestras cortas
// que el juego programa en el reloj de audio, exactamente en cada pulso.
const fs = require('fs'), path = require('path');
const G1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'guion-belen.json'), 'utf8'));
const CPS = { 'dani-maestro': 13, 'dani-celebra': 14, 'dani-narrador': 11.5, 'dani-suave': 12 };
const QUIEN = { 'dani-maestro': 'maestro', 'dani-celebra': 'celebra', 'dani-narrador': 'narrador', 'dani-suave': 'suave' };
const F = [
  ['bach-titulo-01', 'bach-titulo', 'mundo', 'dani-narrador', 'tierno', 'Bienvenidos a Mi Piano: el viaje de Bach.', 'Intro del primer día: aparece el título.', 'El título de oro y la clave de sol.'],
  ['bach-frase-01', 'bach-frase', 'mundo', 'dani-narrador', 'tierno', 'Cada nota es un paso del camino.', 'Intro: aparece la frase de inicio.', 'La frase en cursiva bajo el título.'],
  ['bach-recorrido-01', 'bach-recorrido', 'mundo', 'dani-maestro', 'alegre', 'Estos son los lugares de Belén.', 'Primer día: la cámara recorre los edificios.', 'Cada edificio brilla con su nombre.'],
  ['lugar-patio', 'lugar-patio', 'mundo', 'dani-maestro', 'alegre', 'El Patio.', 'Recorrido: brilla el Patio.', 'Brillo y nombre.'],
  ['lugar-coro', 'lugar-coro', 'mundo', 'dani-maestro', 'alegre', 'El Coro.', 'Recorrido: brilla el Coro.', 'Brillo y nombre.'],
  ['lugar-salon', 'lugar-salon', 'mundo', 'dani-maestro', 'alegre', 'El Salón de Bach.', 'Recorrido: brilla el Salón.', 'Brillo y nombre.'],
  ['lugar-teatro', 'lugar-teatro', 'mundo', 'dani-maestro', 'alegre', 'El Teatro.', 'Recorrido: brilla el Teatro.', 'Brillo y nombre.'],
  ['lugar-taller', 'lugar-taller', 'mundo', 'dani-maestro', 'alegre', 'El Taller.', 'Recorrido: brilla el Taller.', 'Brillo y nombre.'],
  ['lugar-conservatorio', 'lugar-conservatorio', 'mundo', 'dani-maestro', 'alegre', 'El Conservatorio.', 'Recorrido: brilla el Conservatorio.', 'Brillo y nombre.'],
  ['anuncio-patio', 'anuncio-patio', 'sistema', 'dani-maestro', 'calmado', 'Al Patio: respiramos y tocamos libre.', 'Mini-anuncio al entrar al Patio.', 'Tarjeta con el nombre de la parada.'],
  ['anuncio-coro', 'anuncio-coro', 'sistema', 'dani-maestro', 'alegre', 'Al Coro: Tic canta y tú respondes.', 'Mini-anuncio al entrar al Coro.', 'Tarjeta con el nombre de la parada.'],
  ['anuncio-salon', 'anuncio-salon', 'sistema', 'dani-maestro', 'calmado', 'Al Salón: algo nuevo con Bach.', 'Mini-anuncio al entrar al Salón de Bach.', 'Tarjeta con el nombre de la parada.'],
  ['anuncio-teatro', 'anuncio-teatro', 'sistema', 'dani-celebra', 'alegre', 'Al Teatro: un villancico, pedazo por pedazo.', 'Mini-anuncio al entrar al Teatro.', 'Tarjeta con el título de la canción del día.'],
  ['anuncio-taller', 'anuncio-taller', 'sistema', 'dani-maestro', 'alegre', 'Al Taller: hoy inventas tú.', 'Mini-anuncio al entrar al Taller.', 'Tarjeta con el nombre de la parada.'],
  ['anuncio-conservatorio', 'anuncio-conservatorio', 'sistema', 'dani-maestro', 'alegre', 'Al Conservatorio: duelo de eco.', 'Mini-anuncio al entrar al duelo.', 'Tarjeta con el nombre del duelo.'],
  ['nota-do', 'nota-do', 'ensena', 'dani-maestro', 'calmado', 'Esta es DO.', 'Tarjeta de nota nueva: DO.', 'DO enorme, su tecla brilla y su lugar en el pentagrama.'],
  ['nota-re', 'nota-re', 'ensena', 'dani-maestro', 'calmado', 'Esta es RE.', 'Tarjeta de nota nueva: RE.', 'RE enorme, su tecla y su lugar.'],
  ['nota-mi', 'nota-mi', 'ensena', 'dani-maestro', 'calmado', 'Esta es MI.', 'Tarjeta de nota nueva: MI (la primera de todas).', 'MI enorme, su tecla y su lugar.'],
  ['nota-fa', 'nota-fa', 'ensena', 'dani-maestro', 'calmado', 'Esta es FA.', 'Tarjeta de nota nueva: FA.', 'FA enorme, su tecla y su lugar.'],
  ['nota-sol', 'nota-sol', 'ensena', 'dani-maestro', 'calmado', 'Esta es SOL.', 'Tarjeta de nota nueva: SOL.', 'SOL enorme, su tecla y su lugar.'],
  ['nota-la', 'nota-la', 'ensena', 'dani-maestro', 'calmado', 'Esta es LA.', 'Tarjeta de nota nueva: LA.', 'LA enorme, su tecla y su lugar.'],
  ['nota-si', 'nota-si', 'ensena', 'dani-maestro', 'calmado', 'Esta es SI.', 'Tarjeta de nota nueva: SI.', 'SI enorme, su tecla y su lugar.'],
  ['nota-sol-sost', 'nota-sol-sost', 'ensena', 'dani-maestro', 'calmado', 'Esta es SOL sostenido: la negra de al lado.', 'Tarjeta de nota nueva: SOL sostenido (Los peces en el río).', 'La tecla negra brilla.'],
  ['nota-esa-01', 'nota-esa', 'reaccion', 'dani-celebra', 'alegre', '¡Esa es!', 'Tarjeta de nota nueva: el niño tocó la tecla correcta.', 'La tecla estalla en su color.'],
  ['cuenta-1', 'cuenta-1', 'sistema', 'dani-maestro', 'firme', 'Uno.', 'Cuenta antes de tocar a tempo: el uno (programada en el pulso).', 'El número grande; la campanita del uno.'],
  ['cuenta-2', 'cuenta-2', 'sistema', 'dani-maestro', 'firme', 'Dos.', 'Cuenta: el dos (programada en el pulso).', 'El número grande.'],
  ['cuenta-3', 'cuenta-3', 'sistema', 'dani-maestro', 'firme', 'Tres.', 'Cuenta: el tres (programada en el pulso).', 'El número grande.'],
  ['cuenta-4', 'cuenta-4', 'sistema', 'dani-maestro', 'firme', 'Cuatro.', 'Cuenta: el cuatro (programada en el pulso).', 'El número grande.'],
  ['repaso-negra', 'repaso-negra', 'ensena', 'dani-maestro', 'calmado', 'Recuerda: la negra dice tan.', 'Mini repaso en medio de la sesión: la negra.', 'Cuatro negras laten con Tic.'],
  ['repaso-blanca', 'repaso-blanca', 'ensena', 'dani-maestro', 'calmado', 'Recuerda: la blanca dice taaan.', 'Mini repaso: la blanca.', 'Dos blancas largas con Tic.'],
  ['repaso-pulso', 'repaso-pulso', 'ensena', 'dani-maestro', 'calmado', 'Recuerda: el pulso late como un corazón.', 'Mini repaso: el pulso.', 'Corazones que laten con las palmas de Tic.'],
  ['bach-tempo-02', 'bach-tempo', 'ensena', 'dani-maestro', 'alegre', 'Ahora con el pulso de Tic.', 'Escalera: primer paso «a tempo» del día (ANTES de la cuenta; la cuenta va aparte, sincronizada).', 'Tic levanta el péndulo.'],
];
const frases = F.map(([id, grupo, cat, voz, emocion, texto, cuando, acompana]) => {
  if (/[¿?]/.test(texto) || /\d/.test(texto)) throw new Error('regla: ' + id);
  if (G1.frases.some(f => f.id === id)) throw new Error('id repetido con el guion 1: ' + id);
  const dur = +(Math.max(.5, texto.replace(/[¡!¿?.,;:…«»]/g, '').length / CPS[voz] + .3)).toFixed(1);
  if (dur > 4) throw new Error('más de 4 s: ' + id + ' ' + dur);
  return { id, grupo, cat, personaje: 'bach', voz, emocion, texto, cuando, acompana, dur_obj: dur, dur_max: /^cuenta-/.test(id) ? .6 : 4, interrumpible: !/^cuenta-/.test(id), bloquea: false, archivo: 'voces/' + id + '.ogg' };
});
const guion = {
  version: 'guion-belen-v2', fecha: new Date().toISOString().slice(0, 10), app: 'MI PIANO 3 · Belén (M3.1)',
  resumen: { frases: frases.length, segundos: +frases.reduce((a, f) => a + f.dur_obj, 0).toFixed(1), nota: 'Se suma al guion-belen.json (no lo reemplaza). Retira bach-tempo-01 (decía la cuenta encima del clic).' },
  retirar: ['bach-tempo-01'],
  reglas_app: Object.assign({}, G1.reglas_app, { cuenta: 'La cuenta (cuenta-1…4) no pasa por el reproductor de frases: el juego la decodifica y la programa en el reloj de audio, en cada pulso de la cuenta, igual que el clic de Tic.' }),
  voces: G1.voces, personajes: G1.personajes, frases,
};
fs.writeFileSync(path.join(__dirname, 'guion-belen-2.json'), JSON.stringify(guion, null, 2));
fs.writeFileSync(path.join(__dirname, 'belen2_dani.json'), JSON.stringify(frases.map(f => ({ id: f.id, quien: QUIEN[f.voz], texto: f.texto })), null, 1));
console.log('guion-belen-2.json:', frases.length, 'frases nuevas · ' + guion.resumen.segundos + ' s');
