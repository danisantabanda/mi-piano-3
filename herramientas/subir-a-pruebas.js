// Sube web/ a app.ecofamiliar.org/pruebas/mi-piano-3/ (tabla pruebas_archivo de Supabase).
// Solo sube lo que cambió (compara sha256). Necesita SUPABASE_ACCESS_TOKEN.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const REF = 'udwkoxoxuzydufoeteeh', BASE = '/pruebas/mi-piano-3/', WEB = path.join(__dirname, '..', 'web');
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN, PARTE = 1024 * 1024;
if (!TOKEN) { console.error('Falta SUPABASE_ACCESS_TOKEN'); process.exit(1); }
async function sql(query) {
  for (let i = 1; ; i++) {
    const r = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
      method: 'POST', headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }) });
    if (r.ok) return r.json();
    const t = await r.text();
    if (i >= 4) throw new Error(r.status + ' ' + t.slice(0, 300));
    await new Promise(s => setTimeout(s, 2000 * i));
  }
}
const lit = s => "'" + s.replace(/'/g, "''") + "'";
function archivos(d, pre = '') {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? archivos(path.join(d, e.name), pre + e.name + '/') : [pre + e.name]);
}
(async () => {
  const nota = 'repo ' + (process.env.GITHUB_SHA || 'local').slice(0, 7);
  const hay = Object.fromEntries((await sql(`select ruta, sha from pruebas_archivo where ruta like '${BASE}%' and activo`)).map(f => [f.ruta, f.sha]));
  // index.html y sw.js al final, para que no apunten a algo que aún no está
  const lista = archivos(WEB).sort((a, b) => (/^(index\.html|sw\.js)$/.test(a) ? 1 : 0) - (/^(index\.html|sw\.js)$/.test(b) ? 1 : 0));
  let subidos = 0;
  for (const f of lista) {
    const b = fs.readFileSync(path.join(WEB, f)), sha = crypto.createHash('sha256').update(b).digest('hex'), ruta = BASE + f;
    if (hay[ruta] === sha) continue;
    const n = Math.max(1, Math.ceil(b.length / PARTE));
    for (let i = 0; i < n; i++) {
      const parte = b.subarray(i * PARTE, (i + 1) * PARTE).toString('base64');
      await sql(`select pruebas_subir(${lit(ruta)}, '${parte}', true, ${i + 1}, ${n}, ${lit(nota)})`);
    }
    console.log('subido', ruta, b.length, 'bytes'); subidos++;
  }
  console.log(subidos ? `${subidos} archivos subidos` : 'nada cambió');
})().catch(e => { console.error(e.message); process.exit(1); });
