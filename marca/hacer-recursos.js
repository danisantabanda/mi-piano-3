// Exporta los muñecos pixel art del juego (los mismos sprites del código) a PNG nítidos para el manual y las guías.
// Uso: node marca/hacer-recursos.js [ruta del HTML compilado del juego]   → marca/recursos/*.png (escala ×10, sin suavizado)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const HTML = process.argv[2] || '/tmp/claude-0/f5b/MI-PIANO-3-M3.html', OUT = path.join(__dirname, 'recursos'), K = 10;
const LISTA = {
  'bach': 'sprBachElegante()', 'bach-feliz': "sprBach({cara:'feliz'})", 'bach-sonrie': "sprBach({})", 'bach-sorpresa': "sprBach({cara:'sorpresa'})",
  'tic': "sprRobotB({ojos:'feliz',ang:.35})", 'tic-izq': "sprRobotB({ojos:'abierto',ang:-.35})", 'tic-canta': "sprRobotB({ojos:'cerrado',boca:'canta',ang:0})", 'tic-centro': "sprRobotB({ojos:'feliz',ang:0,llama:0})",
  'sarah': "sprSarah({eyes:'happy',cross:'up'})", 'sarah-quieta': "sprSarah({})", 'sarah-luz': "sprSarah({eyes:'open2',cross:'fwd'})", 'sarah-sienta': "sprSarah({eyes:'happy',sit:true})",
  'david': "sprDavid({eyes:'happy'})", 'david-quieto': "sprDavid({})", 'david-honda': "sprDavid({eyes:'open2',cross:'fwd'})", 'david-sienta': "sprDavid({eyes:'happy',sit:true})",
  'sanson': "sprSanson({})", 'sanson-lengua': "sprSanson({lengua:true,f:1})", 'sanson-duerme': "sprSanson({ojos:'cerrado'})",
  'estrella': 'sprEstrella(true)', 'estrella-vacia': 'sprEstrella(false)', 'papa': 'PAPA()', 'mama': 'MAMA()',
};
['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'].forEach(n => { LISTA['nota-' + n] = "sprNotita('" + n + "',{ojos:'feliz'})"; });
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  pg.on('pageerror', e => console.log('ERR', e.message));
  await pg.goto('file://' + HTML); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  const r = await pg.evaluate(({ L, K }) => { const o = {}; for (const [id, ex] of Object.entries(L)) { try { const s = eval(ex), c = document.createElement('canvas'); c.width = s.width * K; c.height = s.height * K; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(s, 0, 0, c.width, c.height); o[id] = { png: c.toDataURL('image/png'), w: s.width, h: s.height }; } catch (e) { o[id] = { err: e.message }; } } return o; }, { L: LISTA, K });
  const medidas = {};
  for (const [id, v] of Object.entries(r)) { if (v.err) { console.log('falla', id, v.err); continue; } fs.writeFileSync(path.join(OUT, id + '.png'), Buffer.from(v.png.split(',')[1], 'base64')); medidas[id] = [v.w, v.h]; }
  fs.writeFileSync(path.join(OUT, 'medidas.json'), JSON.stringify(medidas, null, 1)); console.log(Object.keys(medidas).length, 'sprites →', OUT); await b.close();
})();
