// node voz/armar-guion-belen.js → voz/guion-belen.json (mismo formato que prototipos/voz/guion-v1.json)
//                                 + voz/belen_dani.json (formato de exportar/mipiano2_dani.json, para Chatterbox)
// Reglas: una frase por evento, ≤ 4 s, sin preguntas, sin números en cifras. Bach = Dani. Tic = pitidos sintetizados (no se graba).
const fs = require('fs'), path = require('path');
const V1 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'prototipos', 'voz', 'guion-v1.json'), 'utf8'));
const CPS = { 'dani-maestro': 13, 'dani-celebra': 14, 'dani-narrador': 11.5, 'dani-suave': 12, 'tic-pitidos': 14 };
// [id, grupo, cat, voz, emocion, texto, cuando, acompana, perfil?]
const F = [
  // ---- primer día ----
  ['bach-carta-01', 'bach-carta', 'mundo', 'dani-narrador', 'tierno', 'Te espero en Belén: allí empieza el viaje.', 'Primer día: la carta se abre (una sola vez en la vida).', 'La carta se despliega; las palabras se iluminan una por una.'],
  ['bach-carta-tic-01', 'bach-carta-tic', 'mundo', 'dani-narrador', 'alegre', 'Te mando a Tic: él lleva el pulso.', 'Primer día: Tic sale del sobre.', 'Tic salta del sobre con pitidos y empieza el tic-tac.'],
  ['bach-traje-01', 'bach-traje', 'celebra', 'dani-celebra', 'alegre', '¡Este es tu traje de músico viajero!', 'Primer día: aparece el traje.', 'Remolino de luz dorada y destello.'],
  ['bach-puerta-01', 'bach-puerta', 'sistema', 'dani-maestro', 'calmado', 'Toca una tecla y se abre la puerta.', 'Primer día: la puerta de Belén espera la primera nota.', 'Todas las teclas brillan suave.'],
  ['bach-bienvenida-01', 'bach-bienvenida', 'celebra', 'dani-celebra', 'alegre', '¡Bienvenida a Belén!', 'La puerta se abre (primer día).', 'Las hojas de madera se abren; luz.', 'sarah'],
  ['bach-bienvenida-02', 'bach-bienvenida', 'celebra', 'dani-celebra', 'alegre', '¡Bienvenido a Belén!', 'La puerta se abre (primer día).', 'Las hojas de madera se abren; luz.', 'david'],
  // ---- paradas (se dicen al entrar, las dos primeras veces) ----
  ['bach-patio-01', 'bach-patio', 'ensena', 'dani-suave', 'calmado', 'Respira con Tic: entra el aire, sale el aire.', 'Patio: empieza la respiración.', 'El círculo crece y se achica con el pulso.'],
  ['bach-patio-libre-01', 'bach-patio-libre', 'juego', 'dani-maestro', 'alegre', 'Ahora toca lo que quieras.', 'Patio: termina la respiración, empieza el Modo Piano.', 'Los faroles de colores suben.'],
  ['bach-coro-01', 'bach-coro', 'ensena', 'dani-maestro', 'alegre', 'Tic canta primero; después cantas tú.', 'Coro: antes del primer eco.', 'Tic canta el motivo con sus sílabas.'],
  ['bach-salon-01', 'bach-salon', 'ensena', 'dani-maestro', 'calmado', 'La negra dice tan; la blanca dice taaan.', 'Salón de Bach: lo nuevo (negra y blanca), durante la demostración.', 'Bach señala los bloques; suenan tan, tan, taaan.'],
  ['bach-salon-02', 'bach-salon-blanca', 'ensena', 'dani-maestro', 'calmado', 'Ahora la blanca va primero.', 'Salón de Bach: segundo patrón.', 'Aparece taaan, tan, tan.'],
  ['bach-espera-01', 'bach-espera', 'ensena', 'dani-suave', 'calmado', 'Yo te espero: toca cuando estés listo.', 'Escalera: primer paso «espera» del día.', 'La tecla y el bloque brillan.'],
  ['bach-ritmo-01', 'bach-ritmo', 'ensena', 'dani-suave', 'calmado', 'Ahora a tu ritmo: la blanca dura más.', 'Escalera: primer paso «a tu ritmo» del día.', 'El bloque se llena mientras dura.'],
  ['bach-tempo-01', 'bach-tempo', 'ensena', 'dani-maestro', 'alegre', 'Ahora con el pulso de Tic: uno, dos, tres, cuatro.', 'Escalera: primer paso «a tempo» del día (sobre la cuenta).', 'La cuenta grande y la línea roja.'],
  ['bach-teatro-jingle', 'bach-teatro', 'juego', 'dani-celebra', 'alegre', 'Hoy tocamos Jingle Bells, pedazo por pedazo.', 'Teatro: la canción del día es Jingle Bells.', 'El título aparece en el pergamino.'],
  ['bach-teatro-noche', 'bach-teatro', 'juego', 'dani-maestro', 'tierno', 'Hoy tocamos Noche de paz.', 'Teatro: la canción del día es Noche de paz.', 'El título aparece en el pergamino.'],
  ['bach-teatro-peces', 'bach-teatro', 'juego', 'dani-celebra', 'alegre', 'Hoy tocamos Los peces en el río.', 'Teatro: la canción del día es Los peces en el río.', 'El título aparece en el pergamino.'],
  ['bach-teatro-campana', 'bach-teatro', 'juego', 'dani-celebra', 'alegre', 'Hoy tocamos Campana sobre campana.', 'Teatro: la canción del día es Campana sobre campana.', 'El título aparece en el pergamino.'],
  ['bach-teatro-venid', 'bach-teatro', 'juego', 'dani-narrador', 'tierno', 'Hoy tocamos Venid, fieles todos.', 'Teatro: la canción del día es Venid, fieles todos.', 'El título aparece en el pergamino.'],
  ['bach-pads-01', 'bach-pads', 'ensena', 'dani-maestro', 'alegre', 'Primero el ritmo, en los tambores.', 'Teatro: primer paso con pads del día.', 'Los dos tambores aparecen donde estaba el teclado.'],
  ['bach-banda-01', 'bach-banda', 'celebra', 'dani-celebra', 'alegre', 'Ahora todo lo que sabes, con la banda.', 'Teatro: la canción con la banda.', 'Entra el colchón de la banda.'],
  ['bach-taller-01', 'bach-taller', 'juego', 'dani-maestro', 'alegre', 'Inventa tu música; la banda te acompaña.', 'Taller: empieza la base.', 'El telar se prepara; brillan las notas sugeridas.'],
  ['bach-taller-escucha-01', 'bach-taller-escucha', 'celebra', 'dani-celebra', 'alegre', '¡Escucha lo que inventaste!', 'Taller: Tic toca de vuelta lo inventado.', 'El telar se ilumina con cada nota.'],
  // ---- reacciones (pocas: probabilidad y enfriamiento) ----
  ['rx-bien-01', 'rx-bien', 'reaccion', 'dani-celebra', 'alegre', '¡Eso es!', 'Paso aprobado (a veces).', 'Estrellas.'],
  ['rx-bien-02', 'rx-bien', 'reaccion', 'dani-celebra', 'alegre', '¡Qué belleza!', 'Paso aprobado (a veces).', 'Estrellas.'],
  ['rx-bien-03', 'rx-bien', 'reaccion', 'dani-celebra', 'alegre', '¡Muy bien tocado!', 'Paso aprobado (a veces).', 'Estrellas.'],
  ['rx-fantastico-01', 'rx-fantastico', 'reaccion', 'dani-celebra', 'alegre', '¡Fantástico, sin un error!', 'Paso al cien por ciento.', 'Tres estrellas y la palabra «¡Fantástico!».'],
  ['rx-dominado-01', 'rx-dominado', 'celebra', 'dani-celebra', 'alegre', '¡Ese pedazo ya es tuyo!', 'Un pedazo queda dominado (segundo día bien).', 'Destello dorado en el pedazo.'],
  // ---- ayuda (nunca en el error: solo cuando Tic demuestra o toca con el niño) ----
  ['ay-demuestra-01', 'ay-demuestra', 'ayuda', 'dani-suave', 'calmado', 'Mira, Tic te lo muestra.', 'A los tres fallos: la tablet demuestra.', 'Tic toca el pasaje; las teclas brillan.'],
  ['ay-juntos-01', 'ay-juntos', 'ayuda', 'dani-suave', 'calmado', 'Ahora tocamos juntos.', 'A los cinco fallos: Tic toca con el niño.', 'Tic canta cada nota con él.'],
  ['ay-calma-01', 'ay-calma', 'ayuda', 'dani-suave', 'calmado', 'Una nota a la vez.', 'Aporreo detectado (varias notas juntas).', 'Tic muestra un dedito.'],
  // ---- órgano y semana ----
  ['bach-organo-01', 'bach-organo', 'celebra', 'dani-celebra', 'alegre', '¡Tu órgano suena completo!', 'Órgano del día: suena el acorde final.', 'Los cinco tubos encendidos.'],
  ['bach-semana-01', 'bach-semana', 'celebra', 'dani-maestro', 'tierno', 'Una nota más en tu semana.', 'Pentagrama de la semana: aparece la nota de hoy.', 'La nota del día brilla.'],
  ['bach-despierta-01', 'bach-despierta', 'mundo', 'dani-narrador', 'tierno', 'La música de Belén despertó un poco más.', 'Al salir a Belén con un instrumento nuevo en la música.', 'Se suma un instrumento al villancico de la ciudad.'],
  // ---- Belén ----
  ['bach-belen-01', 'bach-belen', 'fe', 'dani-narrador', 'tierno', 'Aquí, en Belén, nació Jesús.', 'La primera vez que se explora Belén con el dedo.', 'La estrella sobre el pesebre brilla.'],
  // ---- el duelo del Conservatorio ----
  ['bach-duelo-01', 'bach-duelo', 'jefe', 'dani-maestro', 'alegre', 'Él toca la flauta; tú respondes en el piano.', 'Duelo: antes del primer eco.', 'El pastorcito levanta su flauta.'],
  ['bach-duelo-corazon-01', 'bach-duelo-corazon', 'jefe', 'dani-suave', 'calmado', 'Escucha otra vez, con calma.', 'Duelo: se pierde un corazón.', 'Un corazón se apaga.'],
  ['bach-duelo-gana-01', 'bach-duelo-gana', 'jefe', 'dani-celebra', 'alegre', '¡Ganaste la insignia de la estrella!', 'Duelo ganado.', 'Fanfarria corta; la insignia gira y brilla.'],
  ['bach-llave-01', 'bach-llave', 'jefe', 'dani-narrador', 'tierno', 'Esta llave abre la ciudad de enero.', 'Después de la insignia: aparece la llave.', 'La llave dorada baja girando.'],
  ['bach-maelzel-01', 'bach-maelzel', 'compositor', 'dani-maestro', 'tierno', 'En enero nos espera Maelzel, el del metrónomo.', 'Al ver la llave (una vez).', 'Maelzel en silueta en el mapa.'],
  ['bach-duelo-pierde-01', 'bach-duelo-pierde', 'jefe', 'dani-suave', 'tierno', 'Casi; mañana lo intentamos otra vez.', 'Duelo perdido (sin corazones).', 'El pastorcito le da la mano.'],
  // ---- Tic: pitidos sintetizados en el juego (no se graban) ----
  ['tic-hola-01', 'tic-hola', 'personaje', 'tic-pitidos', 'alegre', '¡Pi-pi-píí!', 'Tic sale del sobre / llega a una parada.', 'Tres pitidos subiendo.'],
  ['tic-feliz-01', 'tic-feliz', 'personaje', 'tic-pitidos', 'alegre', '¡Pi-ri-pí!', 'Acierto fantástico.', 'Arpegio corto agudo.'],
  ['tic-ayuda-01', 'tic-ayuda', 'personaje', 'tic-pitidos', 'calmado', 'Pu-pí.', 'Antes de demostrar.', 'Dos pitidos suaves.'],
  ['tic-sueno-01', 'tic-sueno', 'personaje', 'tic-pitidos', 'tierno', 'Pííí… pu.', 'Fin del órgano del día.', 'Pitido que baja.'],
];
const PERS = { 'tic-pitidos': 'tic' };
const QUIEN = { 'dani-maestro': 'maestro', 'dani-celebra': 'celebra', 'dani-narrador': 'narrador', 'dani-suave': 'suave' };
const frases = F.map(([id, grupo, cat, voz, emocion, texto, cuando, acompana, perfil]) => {
  if (/[¿?]/.test(texto) || /\d/.test(texto)) throw new Error('regla: ' + id);
  const dur = +(Math.max(1, texto.replace(/[¡!¿?.,;:…«»]/g, '').length / (CPS[voz] || 13) + .4)).toFixed(1);
  if (dur > 4) throw new Error('más de 4 s: ' + id + ' ' + dur);
  const f = { id, grupo, cat, personaje: PERS[voz] || 'bach', voz, emocion, texto, cuando, acompana, dur_obj: dur, dur_max: 4, interrumpible: true, bloquea: false, archivo: PERS[voz] ? null : 'voces/' + id + '.ogg' };
  if (perfil) f.perfil = perfil;
  return f;
});
const bach = frases.filter(f => f.personaje === 'bach');
const porVoz = {}; frases.forEach(f => { porVoz[f.voz] = (porVoz[f.voz] || 0) + 1; });
const guion = {
  version: 'guion-belen-v1', fecha: new Date().toISOString().slice(0, 10), app: 'MI PIANO 3 · Belén',
  resumen: { frases: frases.length, frases_bach: bach.length, frases_tic: frases.length - bach.length, segundos_bach: +bach.reduce((a, f) => a + f.dur_obj, 0).toFixed(1), por_voz: porVoz, nota: 'Mozart y Beethoven no aparecen en Belén.' },
  reglas_app: Object.assign({}, V1.reglas_app, { tic: 'Tic no habla: pitidos sintetizados en el juego (no se graban).' }),
  voces: Object.assign({}, Object.fromEntries(Object.entries(V1.voces).filter(([k]) => /^dani-(maestro|celebra|narrador|suave)$/.test(k))), { 'tic-pitidos': { personaje: 'tic', quien: 'personaje', motor: 'sintetizado en el juego (KitSonido)', nota: 'Celesta + flauta muy agudas; nunca palabras.' } }),
  personajes: { bach: V1.personajes.bach, tic: { nombre: 'Tic', rol: 'El robot-metrónomo: lleva el pulso (bloque de madera, campanita en el uno). Habla solo con pitidos.', voz: 'pitidos sintetizados', muletilla: '¡Pi-pi-píí!' } },
  frases,
};
fs.writeFileSync(path.join(__dirname, 'guion-belen.json'), JSON.stringify(guion, null, 2));
fs.writeFileSync(path.join(__dirname, 'belen_dani.json'), JSON.stringify(bach.map(f => ({ id: f.id, quien: QUIEN[f.voz], texto: f.texto })), null, 1));
console.log('guion-belen.json:', frases.length, 'frases (Bach ' + bach.length + ', Tic ' + (frases.length - bach.length) + ') · ' + guion.resumen.segundos_bach + ' s de Bach');
