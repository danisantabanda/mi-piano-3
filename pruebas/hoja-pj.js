// Hoja de sprites M5c: original (selector / personajes.js) vs nuevo desde arriba (4 direcciones + caminar de lado), a 3× → capturas/m5c/hoja-sprites.png
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.join(__dirname, '..', 'MI-PIANO-3-M3.html')); await pg.waitForFunction(() => window.__mp3 && window.__mp3.listo, null, { timeout: 60000 });
  const url = await pg.evaluate(() => {
    const V = VECINOS5, filas = [];
    const heroe = q => { GUARDA.d.perfil = q; return [d => spriteHeroeA5(d, 0, null), (d, f) => spriteHeroeA5(d, f, null)]; };
    const per = p => [d => sprPersona5(p, d, 0), (d, f) => sprPersona5(p, d, f)];
    const sel = q => () => { const x = q === 'sarah' ? sprSarah({ cross: 'up', eyes: 'happy' }) : sprDavid({ eyes: 'happy' }); x.clave = 'sel'; return conTraje(x, 'viajero', q); };
    filas.push(['Sarah', sel('sarah'), 'sarah'], ['David', sel('david'), 'david'], ['Papá', () => PAPA(), 'papa'], ['Mamá', () => MAMA(), 'mama']);
    filas.push(['Tic', () => sprRobotB({}), 'tic'], ['Sansón', () => sprSanson({}), 'sanson']);
    [['El pastor', () => NPC5.pastor(), V.pastor], ['La vecina', () => NPC5.cantora(), V.vecina], ['El abuelo', null, V.abuelo], ['El mesonero', () => NPC5.mesonero(), V.mesonero], ['El músico', () => NPC5.musico(), V.musico], ['El escriba', null, V.escriba], ['La panadera', null, V.panadera], ['El campanero', null, V.campanero], ['María', () => NAC.maria(), V.maria], ['José', () => NAC.jose(), V.jose], ['El pastorcito', () => sprPastorcito({}), V.pastorcito], ['Niña de la ronda', null, V.nina1], ['Niño de la ronda', null, V.nino1]].forEach(x => filas.push(x));
    const K = 3, CW = 120, RH = 160, c = canvas(140 + 170 + CW * 8 + 40, 70 + filas.length * RH), x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    x.fillStyle = '#fffaf4'; x.fillRect(0, 0, c.width, c.height); x.fillStyle = '#2a1a3a'; x.font = '700 30px Outfit'; x.fillText('Original (selector)  ·  Nuevo desde arriba: abajo · derecha · arriba · izquierda  ·  caminando de lado (4 cuadros)', 20, 44);
    filas.forEach(([nom, orig, nuevo], r) => { const y = 70 + r * RH + RH - 18; x.fillStyle = r % 2 ? '#f1ecf4' : '#fffaf4'; x.fillRect(0, 70 + r * RH, c.width, RH); x.fillStyle = '#2a1a3a'; x.font = '700 20px Outfit'; x.fillText(nom, 12, 70 + r * RH + 26);
      if (orig) { const s = orig(); sprK(x, s, 220, y, Math.min(K, (RH - 30) / s.height)); } else { x.font = '400 16px Outfit'; x.fillText('(nuevo)', 190, y - 40); }
      let F; if (nuevo === 'tic') F = [d => sprRobotB({ ang: d === 'lado' ? .3 : 0 }), (d, f) => sprRobotB({ ang: [-.3, 0, .3, 0][f], llama: f % 2 })];
      else if (nuevo === 'sanson') F = [d => sprSansonA5(d, 0), (d, f) => sprSansonA5(d, f)];
      else if (typeof nuevo === 'string') F = heroe(nuevo); else if (!nuevo) return; else F = per(nuevo);
      [['abajo', 0], ['lado', 0], ['arriba', 0], ['lado', 1]].forEach(([d, fl], i) => sprK(x, F[0](d), 360 + i * CW, y, K, { flip: !!fl }));
      [0, 1, 2, 3].forEach(f => sprK(x, F[1]('lado', f), 360 + (4 + f) * CW + 20, y, K));
      x.strokeStyle = '#2a1a3a'; x.lineWidth = 3; x.beginPath(); x.moveTo(300, 70 + r * RH + 8); x.lineTo(300, 70 + (r + 1) * RH - 8); x.moveTo(360 + 3.5 * CW + 10, 70 + r * RH + 8); x.lineTo(360 + 3.5 * CW + 10, 70 + (r + 1) * RH - 8); x.stroke(); });
    return c.toDataURL('image/png'); });
  fs.writeFileSync(path.join(__dirname, '..', 'capturas', 'm5c', 'hoja-sprites.png'), Buffer.from(url.split(',')[1], 'base64')); console.log(JSON.stringify({ errores: errs })); await b.close();
})();
