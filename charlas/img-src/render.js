// node render.js id1 id2 …  (sin ids: todas) → ../img/<id>.jpg (1280×720, JPG ~82, ≤ 150 KB)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const OUT = path.join(__dirname, '..', 'img'), TMP = process.env.TMPDIR || '/tmp';
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  let ids = process.argv.slice(2);
  if (!ids.length) { await pg.goto('file://' + path.join(__dirname, 'pagina.html') + '#_'); await pg.waitForFunction(() => window.__listo); ids = await pg.evaluate(() => Object.keys(ESCENAS)); }
  for (const id of ids) {
    await pg.goto('about:blank'); await pg.goto('file://' + path.join(__dirname, 'pagina.html') + '#' + id);
    await pg.waitForFunction(() => window.__listo, null, { timeout: 60000 });
    const st = await pg.evaluate(() => window.__listo); if (st !== 'ok') { console.log(id, st); continue; }
    const png = path.join(TMP, 'il-' + id + '.png'); const data = await pg.evaluate(() => document.getElementById('c').toDataURL('image/png'));
    fs.writeFileSync(png, Buffer.from(data.split(',')[1], 'base64'));
    const r = execFileSync('python3', ['-c', `
import sys,io
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB'); q=82
while True:
    b=io.BytesIO(); im.save(b,'JPEG',quality=q,optimize=True,progressive=True)
    if b.tell()<=150*1024 or q<=55: break
    q-=4
open(sys.argv[2],'wb').write(b.getvalue()); print(q, b.tell()//1024)
`, png, path.join(OUT, id + '.jpg')]).toString().trim();
    console.log(id, 'q/KB', r);
  }
  if (errs.length) console.log('ERRORES', errs);
  await b.close();
})();
