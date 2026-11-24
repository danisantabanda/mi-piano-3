// node voz/armar-guion-belen-4.js → voz/guion-belen-4.json (frases NUEVAS de M5 «Belén grande» + frases REHECHAS) + voz/belen4_dani.json (Chatterbox)
// Reglas: una frase por evento, ≤ 4 s (excepción: Tic en el Patio, decisión de Dani), sin preguntas, números en palabras.
// Pronunciación (decisión 23-nov): «Bach» se escribe «Baj» en lo que lee Chatterbox; la cuenta dice «un, dos, tres, cuá».
// Las frases rehechas llevan un id NUEVO (la tanda mipiano2-dani salta los ids ya hechos) con el mismo grupo y «reemplaza»:
// el juego usa la nueva en cuanto está en el manifiesto; mientras tanto, la vieja.
const fs = require('fs'), path = require('path');
const G = ['guion-belen.json', 'guion-belen-2.json', 'guion-belen-3.json'].map(f => JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8')));
const CPS = { 'dani-maestro': 13, 'dani-celebra': 14, 'dani-narrador': 11.5, 'dani-suave': 12 };
const QUIEN = { 'dani-maestro': 'maestro', 'dani-celebra': 'celebra', 'dani-narrador': 'narrador', 'dani-suave': 'suave' };
const MAX = { 'tic-patio-01': 5.5 };
const L = (id, g, cat, voz, emo, texto, cuando, acomp, personaje = 'bach') => ({ id, g, cat, voz, emo, texto, cuando, acomp, personaje });
const NUEVAS = [
  L('tic-patio-01', 'tic-patio', 'guia', 'dani-suave', 'tierno', 'Vamos a ponernos en modo música. Empezamos respirando.', 'Patio: Tic en plano cercano, antes de respirar.', 'Tic grande, respira con el niño.', 'tic'),
  L('hola-sarah', 'hola-sarah', 'saludo', 'dani-celebra', 'alegre', '¡Hola, Sarah!', 'Selector: Sarah escogida.', 'Sarah saluda con la mano.'),
  L('hola-david', 'hola-david', 'saludo', 'dani-celebra', 'alegre', '¡Hola, David!', 'Selector: David escogido.', 'David saluda con la mano.'),
  L('hola-papa', 'hola-papa', 'saludo', 'dani-celebra', 'alegre', '¡Hola, papá!', 'Selector: papá.', 'Papá saluda.'),
  L('hola-mama', 'hola-mama', 'saludo', 'dani-celebra', 'alegre', '¡Hola, mamá!', 'Selector: mamá.', 'Mamá saluda.'),
  ...[['torre', 'La Torre de notas.'], ['ritmo', 'La Casa del ritmo.'], ['biblioteca', 'La Biblioteca de teoría.'], ['arena', 'La Arena del eco.'], ['gimnasio', 'El Gimnasio de dedos.'], ['museo', 'El museo de Belén.'], ['kiosco', 'El kiosco de la banda.'], ['sala', 'La Sala de conciertos.'], ['luthier', 'La tienda del luthier.'], ['casa', 'Tu casa en Belén.']]
    .map(([id, t]) => L('lugar-' + id, 'lugar-' + id, 'mundo', 'dani-maestro', 'alegre', t, 'Al llegar caminando a la puerta: ' + id + '.', 'La tarjeta del lugar.')),
  L('anuncio-biblioteca', 'anuncio-biblioteca', 'juego', 'dani-maestro', 'alegre', 'Adivina nombres, figuras y sonidos.', 'Biblioteca de teoría.', 'La pregunta y sus botones.'),
  L('anuncio-ritmo', 'anuncio-ritmo', 'juego', 'dani-maestro', 'alegre', 'Ritmos en los tambores.', 'Casa del ritmo.', 'Los dos pads.'),
  L('anuncio-gimnasio', 'anuncio-gimnasio', 'juego', 'dani-maestro', 'alegre', 'Dedos rápidos: el tempo sube.', 'Gimnasio de dedos.', 'La carrera de cinco dedos.'),
  ...[['pastor', 'Escucha mi flauta y repite.'], ['campanas', 'Las campanas cantan: tan, tan, taaan.'], ['vecina', 'Canto una nota. Búscala en el piano.'], ['pozo', 'Toca algo y espera: el pozo contesta.'], ['posada', 'Toc, toc. Repite mi ritmo y te abro.'], ['ovejas', 'Cuenta las ovejas: un, dos, tres, cuá.'], ['ronda', 'Lleva el pulso de la ronda.'], ['estrella', 'Toca tus notas y la estrella brilla.']]
    .map(([id, t]) => L('rincon-' + id, 'rincon-' + id, 'mundo', 'dani-maestro', 'alegre', t, 'Rincón de la calle: ' + id + '.', 'La tarjeta del rincón con el teclado.')),
  L('rincon-bien-01', 'rincon-bien', 'celebra', 'dani-celebra', 'alegre', '¡Muy bien! Belén despierta.', 'Rincón terminado.', 'Corcheas que vuelan.'),
  L('ay-otra-01', 'ay-otra', 'ayuda', 'dani-suave', 'tierno', 'Otra vez, despacito.', 'Rincón: no salió; el modelo suena otra vez.', 'Se repite el modelo.'),
  ...['Despertó el pastor.', 'Las ovejas te esperan.', 'El pozo del eco despertó.', 'La vecina quiere cantar.', 'La posada tiene contraseña.', 'Los niños juegan a la ronda.', 'La clave de fa abre el museo.', 'Los pastores van al pesebre.', 'La banda afina en el kiosco.', 'Se abrió la Sala de conciertos.', 'Un ángel canta en el pesebre.', 'Unos sabios siguen la estrella.', 'Todo Belén está despierto.', '¡Nochebuena! A tocar en el pesebre.']
    .map((t, k) => L('despierta-' + (k + 1), 'despierta-' + (k + 1), 'historia', 'dani-narrador', 'tierno', t, 'Al volver a Belén tras la misión ' + ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce'][k] + ': la cámara va a lo que despertó.', 'Lo que despertó brilla.')),
  L('pesebre-bravo-01', 'pesebre-bravo', 'celebra', 'dani-celebra', 'alegre', '¡Gloria a Dios! ¡Qué concierto!', 'Final: el concierto en el pesebre.', 'Todo Belén aplaude.'),
];
// frases ya grabadas que se REHACEN: «Bach» → «Baj» y la cuenta «un, dos, tres, cuá»
const REHACER = { 'bach-titulo-01': ['bach-titulo-02', 'Bienvenidos a Mi Piano: el viaje de Baj.'], 'lugar-salon': ['lugar-salon-02', 'El Salón de Baj.'], 'anuncio-salon': ['anuncio-salon-02', 'Al Salón: algo nuevo con Baj.'], 'bach-tempo-01': ['bach-tempo-02', 'Ahora con el pulso de Tic: un, dos, tres, cuá.'], 'cuenta-1': ['cuenta-1b', 'Un.'], 'cuenta-4': ['cuenta-4b', 'Cuá.'] };
const viejas = [].concat(...G.map(g => g.frases));
const frases = NUEVAS.map(f => {
  if (/[¿?]/.test(f.texto) || /\d/.test(f.texto)) throw new Error('regla: ' + f.id);
  if (viejas.some(v => v.id === f.id)) throw new Error('id repetido: ' + f.id);
  const dur = +(Math.max(.5, f.texto.replace(/[¡!¿?.,;:…«»]/g, '').length / CPS[f.voz] + .3)).toFixed(1);
  if (dur > (MAX[f.id] || 4)) throw new Error('muy larga: ' + f.id + ' ' + dur);
  return { id: f.id, grupo: f.g, cat: f.cat, personaje: f.personaje, voz: f.voz, emocion: f.emo, texto: f.texto, cuando: f.cuando, acompana: f.acomp, dur_obj: dur, dur_max: MAX[f.id] || 4, interrumpible: true, bloquea: false, archivo: 'voces/' + f.id + '.ogg' };
}).concat(Object.entries(REHACER).map(([id, [nuevo, texto]]) => { const v = viejas.find(x => x.id === id); if (!v) throw new Error('no existe: ' + id);
  return Object.assign({}, v, { id: nuevo, reemplaza: id, archivo: 'voces/' + nuevo + '.ogg', texto, texto_pantalla: v.texto.replace('uno, dos, tres, cuatro', 'un, dos, tres, cuá').replace(/^Uno\.$/, 'Un.').replace(/^Cuatro\.$/, 'Cuá.'), rehecha: 'M5: pronunciación (Baj / cuá)' }); }));
const guion = {
  version: 'guion-belen-v2', fecha: new Date().toISOString().slice(0, 10), app: 'MI PIANO 3 · Belén (M5 «Belén grande»)',
  resumen: { frases: frases.length, nuevas: NUEVAS.length, rehechas: Object.keys(REHACER).length, segundos: +frases.reduce((a, f) => a + (f.dur_obj || 1), 0).toFixed(1), nota: 'Se suma a guion-belen 1, 2 y 3; las rehechas tienen id nuevo y «reemplaza»: el juego prefiere la nueva cuando ya está grabada.' },
  retirar: [], reglas_app: Object.assign({}, G[2].reglas_app, { pronunciacion: 'Chatterbox lee «Baj» donde la pantalla dice «Bach»; la cuenta es «un, dos, tres, cuá».' }),
  voces: G[0].voces, personajes: G[0].personajes, frases,
};
fs.writeFileSync(path.join(__dirname, 'guion-belen-4.json'), JSON.stringify(guion, null, 2));
fs.writeFileSync(path.join(__dirname, 'belen4_dani.json'), JSON.stringify(frases.map(f => ({ id: f.id, quien: QUIEN[f.voz], texto: f.texto })), null, 1));
console.log('guion-belen-4.json:', NUEVAS.length, 'nuevas +', Object.keys(REHACER).length, 'rehechas · ' + guion.resumen.segundos + ' s');
