// node voz/armar-guion-belen-5.js → voz/guion-belen-5.json (frases NUEVAS de M6 «contenido») + voz/belen5_dani.json (Chatterbox)
// Reglas: una frase por evento, ≤ 4 s, sin preguntas, números en palabras; «Bach» se escribe «Baj». Si una frase no está grabada, el juego muestra el texto.
const fs = require('fs'), path = require('path');
const G = ['guion-belen.json', 'guion-belen-2.json', 'guion-belen-3.json', 'guion-belen-4.json'].map(f => JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8')));
const CPS = { 'dani-maestro': 13, 'dani-celebra': 14, 'dani-narrador': 11.5, 'dani-suave': 12 };
const QUIEN = { 'dani-maestro': 'maestro', 'dani-celebra': 'celebra', 'dani-narrador': 'narrador', 'dani-suave': 'suave' };
const L = (id, g, cat, voz, emo, texto, cuando, acomp, personaje = 'bach') => ({ id, g, cat, voz, emo, texto, cuando, acomp, personaje });
const NUEVAS = [
  ...[['rapido', '¡Otra vez! Un poquito más rápido.'], ['banda', '¡Otra vez! Ahora te acompaña la banda.'], ['octava', '¡Otra vez! Ahora más arriba.'], ['suave', '¡Otra vez! Suavecito.'], ['fuerte', '¡Otra vez! Fuerte.'], ['tuEmpiezas', '¡Ahora tú empiezas!']]
    .map(([id, t]) => L('otra-vez-' + id, 'otra-vez-' + id, 'guia', 'dani-celebra', 'alegre', t, 'Repetición con UNA variación (' + id + ').', 'El letrero «¡Otra vez!» grande.')),
  L('ay-lento-01', 'ay-lento', 'ayuda', 'dani-suave', 'tierno', 'Mira, más despacito.', 'No salió: Tic lo muestra otra vez más lento.', 'Tic toca despacio.'),
  L('coro-sube-01', 'coro-sube', 'juego', 'dani-maestro', 'alegre', 'Escucha: sube o baja.', 'Coro: ¿subió o bajó?', 'Dos notas y dos flechas.'),
  L('coro-igual-01', 'coro-igual', 'juego', 'dani-maestro', 'alegre', 'Escucha: igual o diferente.', 'Coro: ¿igual o diferente?', 'Dos ritmos.'),
  L('coro-encontrar-01', 'coro-encontrar', 'juego', 'dani-suave', 'tierno', 'Canta conmigo y búscala en el piano.', 'Coro: canta y encuéntrala.', 'Tic canta una nota.'),
  L('salon-pregunta-01', 'salon-pregunta', 'ensena', 'dani-maestro', 'calmado', 'Yo pregunto y tú respondes.', 'Salón: Bach pregunta, el niño responde.', 'Bach toca la pregunta.'),
  L('teatro-todo-01', 'teatro-todo', 'juego', 'dani-narrador', 'alegre', 'Primero, toda la canción.', 'Teatro: la canción entera (todo–parte–todo).', 'Se abre el telón.'),
  ...[['panaderia', 'Amasamos al ritmo: repite mis palmadas.'], ['carpinteria', 'Un golpe de martillo en cada pulso.'], ['cuna', 'El bebé duerme. Toca suavecito.'], ['cuco', 'Cuenta los cucús y tócalos.'], ['gallo', 'Kikirikí: escucha si sube o baja.'], ['abuela', 'Te canto mi canción. Repítela.'], ['herreria', 'Repite los golpes del yunque.'], ['telar', 'Toca y mi telar teje tu música.'], ['lira', 'Toco una nota. Búscala en el piano.']]
    .map(([id, t]) => L('rincon-casa-' + id, 'rincon-casa-' + id, 'mundo', 'dani-maestro', 'alegre', t, 'Pedido de la casa: ' + id + '.', 'La tarjeta del pedido con el teclado.')),
];
const viejas = [].concat(...G.map(g => g.frases));
const frases = NUEVAS.map(f => {
  if (/[¿?]/.test(f.texto) || /\d/.test(f.texto) || /Bach/.test(f.texto)) throw new Error('regla: ' + f.id);
  if (viejas.some(v => v.id === f.id)) throw new Error('id repetido: ' + f.id);
  const dur = +(Math.max(.5, f.texto.replace(/[¡!¿?.,;:…«»]/g, '').length / CPS[f.voz] + .3)).toFixed(1);
  if (dur > 4) throw new Error('muy larga: ' + f.id + ' ' + dur);
  return { id: f.id, grupo: f.g, cat: f.cat, personaje: f.personaje, voz: f.voz, emocion: f.emo, texto: f.texto, cuando: f.cuando, acompana: f.acomp, dur_obj: dur, dur_max: 4, interrumpible: true, bloquea: false, archivo: 'voces/' + f.id + '.ogg' };
});
const guion = { version: 'guion-belen-v2', fecha: new Date().toISOString().slice(0, 10), app: 'MI PIANO 3 · Belén (M6 «contenido»)',
  resumen: { frases: frases.length, segundos: +frases.reduce((a, f) => a + f.dur_obj, 0).toFixed(1), nota: 'Se suma a guion-belen 1 a 4 (no los reemplaza).' },
  retirar: [], reglas_app: G[3].reglas_app, voces: G[0].voces, personajes: G[0].personajes, frases };
fs.writeFileSync(path.join(__dirname, 'guion-belen-5.json'), JSON.stringify(guion, null, 2));
fs.writeFileSync(path.join(__dirname, 'belen5_dani.json'), JSON.stringify(frases.map(f => ({ id: f.id, quien: QUIEN[f.voz], texto: f.texto })), null, 1));
console.log('guion-belen-5.json:', frases.length, 'frases nuevas · ' + guion.resumen.segundos + ' s');
