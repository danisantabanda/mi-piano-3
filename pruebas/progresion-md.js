// Escribe PROGRESION-BELEN.md: la tabla día × qué se pide (de src/progresion.js) + qué pide el Teatro + la curva del niño simulado.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = { console, GUARDA: { d: { perfil: 'sarah' } }, module: {} }; vm.createContext(ctx);
['progresion.js', 'villancicos.js'].forEach(f => vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', f), 'utf8').replace(/^const /gm, 'var ').replace(/^let /gm, 'var '), ctx));
const { PLAN_BELEN5, planDia5, patronesDia5, VILLANCICOS5, NOMBRE_RITMO5 } = ctx;
const NOM = { 0: 'DO', 2: 'RE', 4: 'MI', 5: 'FA', 7: 'SOL', 9: 'LA', 11: 'SI' }, MIDI = { 0: 60, 2: 62, 4: 64, 5: 65, 7: 67, 9: 69, 11: 71 };
const sim = fs.existsSync('/tmp/claude-0/curva.json') ? JSON.parse(fs.readFileSync('/tmp/claude-0/curva.json', 'utf8')).dias : [];
const txtP = p => p.map(x => x.n === 0 ? 'sh' : (x.d === .5 ? 'ta' : x.d === 1 ? 'tan' : x.d === 2 ? 'taaan' : 'taaaaan') + (x.n !== 64 ? '·' + NOM[x.n % 12] : '')).join(' ');
let md = '# Progresión de Belén (la gran prueba) — para revisar\n\n' +
  'Principios (PROYECTO.md, 23-nov): sonido antes que símbolo; **una nota y un dedo** al comienzo; el **ritmo** varía primero (tan, taaan, silencio, taca); las notas llegan **de una en una**; la **lectura** entra después y poco a poco; **muchas repeticiones con pequeñas variaciones**; nunca más rápido que la canción. ' +
  'En el juego: ⚙ → Modo Papá → «Simular el día» salta a cualquier fila. Fuente: `src/progresion.js` (se cambia ahí y todo se ajusta).\n\n' +
  '| Día | Notas (dedo) | Ritmos | Lectura | Tempo | Lo nuevo (Salón de Bach) | Teatro | Ejemplo de patrón (variaciones) |\n|---|---|---|---|---|---|---|---|\n';
PLAN_BELEN5.forEach((x, d) => {
  const P = planDia5(d), notas = P.notas.map(pc => NOM[pc] + ' (' + ({ 60: 1, 62: 2, 64: 3, 65: 4, 67: 5 }[MIDI[pc]] || '—') + ')').join(', ');
  const V = VILLANCICOS5[P.cancion], ok = n => P.notas.includes(n % 12), dur = dd => dd === 1 || dd === 2 || dd === 4 || (dd === .5 && P.ritmos.includes('taca')) || ((dd === 1.5 || dd === 3) && P.punteadas);
  const pz = V.sarah.map(k => { const ns = V.pedazos[k].notas; return !ns.every(z => dur(z.d)) ? 'escuchar' : ns.every(z => ok(z.n)) ? 'melodía' : 'una tecla'; });
  const ej = patronesDia5(d, 4, 3).map(txtP);
  md += '| ' + (d + 1) + ' | ' + notas + ' | ' + P.ritmos.map(r => r === 'sh' ? 'silencio' : r).join(', ') + ' | ' + ['bloques (sin pentagrama)', 'pentagrama tenue', 'pentagrama'][P.lectura] + ' | ' + P.bpm + ' | ' + P.nuevo + ' | ' + V.titulo + ': ' + pz.map((t, i) => (i + 1) + ' ' + t).join(' · ') + ' | ' + ej[0] + ' → ' + ej[2] + ' |\n';
});
md += '\n**Cada día**: Patio (respirar + tocar libre con las notas conocidas) → Coro (eco de 4 pulsos con el ritmo del día) → Salón de Bach (escucha → espera → a tu ritmo → a tempo + variaciones hasta ~4 min) → Teatro (pedazos: escucha → pads → una tecla → melodía, según lo que ya sabe; mini repaso en medio) → Taller (inventar con las notas conocidas) → órgano. La tablet demuestra a los 3 fallos y toca con el niño a los 5; aporrear no avanza.\n\n';
if (sim.length) {
  md += '## La curva (niño simulado, 4 % de errores, MIDI)\n\n| Día | Canción | Minutos | Pasos evaluados | Repetidos | Precisión media | Notas nuevas | Dominado (acumulado) |\n|---|---|---|---|---|---|---|---|\n';
  sim.forEach((s, i) => { md += '| ' + (i + 1) + ' | ' + (VILLANCICOS5[s.cancion] || {}).titulo + ' | ' + s.min + ' | ' + s.pasosEval + ' | ' + s.repetidos + ' | ' + s.precMedia + ' % | ' + (s.notasNuevas || []).join(', ') + ' | ' + s.dominados + ' |\n'; });
  md += '\nLectura de la curva: cada sesión dura lo mismo (~15 min); lo que crece es la variedad (notas, ritmos, lectura), no la cantidad. Un niño real tendrá más «repetidos» al llegar cada novedad (días 2, 3, 4, 5, 8): ahí la escalera baja sola (demostración, tocar juntos).\n';
}
md += '\n## Para decidir con Dani\n\n- ¿Una nota nueva por día de práctica es buen ritmo, o mejor una por semana (repetir cada fila 4 días)?\n- ¿El pentagrama tenue el día 5 y completo el día 8, o antes/después?\n- ¿El Teatro debe esperar a que la melodía sea «conocida» (como ahora) o dejar intentar la melodía antes, con más ayuda?\n- Lo dominado crece muy lento (1 pedazo en 14 días en la simulación): los villancicos rotan y cada uno vuelve cada 3–5 días, y un pedazo se domina bien en 2 días distintos. ¿Una canción por semana (4 días seguidos) en vez de rotar cada día?\n';
fs.writeFileSync(path.join(__dirname, '..', 'PROGRESION-BELEN.md'), md); console.log('PROGRESION-BELEN.md', md.length, 'caracteres; días simulados:', sim.length);
