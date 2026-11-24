// Exporta GUIAS-BELEN.pdf con el manual de marca (M5): portada, una ficha por misión de src/progresion.js,
// hoja de papá (2 semanas), recortables y diploma de Belén. El trabajo lo hace marca/hacer-guias.js.
// (Las 4 hojas que se imprimen desde el panel de papá siguen saliendo de src/guias.js.)
require('child_process').execFileSync('node', [require('path').join(__dirname, '..', 'marca', 'hacer-guias.js')].concat(process.argv.slice(2)), { stdio: 'inherit' });
