// node build.js → MI-PIANO-3-M3.html (autónomo; si hay un piano-datos.js al lado, usa el Salamander) + web/ (PWA, rutas relativas)
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const SRC = path.join(__dirname, 'src'), WEB = path.join(__dirname, 'web');
let html = fs.readFileSync(path.join(SRC, 'pagina.html'), 'utf8')
  .replace(/\/\*@inline ([\w.-]+)\*\//g, (m, f) => fs.readFileSync(path.join(SRC, f), 'utf8') + '\n')
  .replace(/\/\*@marca ([\w.-]+)\*\//g, (m, f) => fs.readFileSync(path.join(__dirname, 'marca', f), 'utf8') + '\n')   // M5b: el manual de marca (figuras)
  .replace(/\/\*@fuente ([\w.-]+)\*\//g, (m, f) => fs.readFileSync(path.join(SRC, 'fuentes', f)).toString('base64'))
  // el guion de voces (voz/guion-belen.json) → window.GUION = { id: { g, t, p, m, pf } }
  .replace('/*@guion*/', () => { const gs = ['guion-belen.json', 'guion-belen-2.json', 'guion-belen-3.json', 'guion-belen-4.json', 'guion-belen-5.json', 'guion-belen-8.json'].map(f => JSON.parse(fs.readFileSync(path.join(__dirname, 'voz', f), 'utf8'))), fuera = [].concat(...gs.map(g => g.retirar || [])), o = {}; [].concat(...gs.map(g => g.frases)).filter(f => !fuera.includes(f.id)).forEach(f => { o[f.id] = { g: f.grupo, t: f.texto_pantalla || f.texto, p: f.personaje, m: f.dur_max }; if (f.perfil) o[f.id].pf = f.perfil; if (f.reemplaza) o[f.id].r = f.reemplaza; }); return 'window.GUION = ' + JSON.stringify(o) + ';'; });
// M7: las ilustraciones (src/arte/*.webp|png|jpg) → window ARTE7_SRC = { nombre: 'data:…' }
const ARTE = path.join(SRC, 'arte'), MIME = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg' }; let pesoArte = 0;
html = html.replace('/*@arte*/{}', () => { const o = {}; fs.readdirSync(ARTE).filter(f => /\.(webp|png|jpg)$/.test(f)).sort().forEach(f => { const b = fs.readFileSync(path.join(ARTE, f)); pesoArte += b.length; o[f.replace(/\.\w+$/, '')] = 'data:' + MIME[f.split('.').pop()] + ';base64,' + b.toString('base64'); }); return JSON.stringify(o); });
html = html.replace(/\/\*@marcab64 ([\w.-]+)\*\//g, (m, f) => fs.readFileSync(path.join(__dirname, 'marca', f)).toString('base64'));
const solo = html.replace('<!--@web-->', '');
fs.writeFileSync(path.join(__dirname, 'MI-PIANO-3-M3.html'), solo);
// web: las voces se piden solo con el service worker al mando (si faltan, él responde un JS vacío: cero 404); en la primera visita llegan al tomar el control
const CARGADOR = '<script>(function(){var sw="serviceWorker" in navigator&&/^https?:$/.test(location.protocol);if(!sw||navigator.serviceWorker.controller){document.write(\'<script src="voces/manifiesto.js" onerror="window.VOCES=null"><\\/script>\');return;}window.VOCES=null;navigator.serviceWorker.addEventListener("controllerchange",function(){var s=document.createElement("script");s.src="voces/manifiesto.js";document.head.appendChild(s);},{once:true});})();<\/script>';
const TAGV = '<script src="voces/manifiesto.js" onerror="window.VOCES=null"></script>';
if (!html.includes(TAGV)) throw new Error('falta la etiqueta de voces');
const web = html.replace(TAGV, CARGADOR).replace('<title>Mi Piano 3</title>', '<title>Mi Piano 3</title><link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icono-192.png"><link rel="apple-touch-icon" href="apple-touch-icon.png">')
  .replace('<!--@web-->', `<script>(function(){if(/^https?:$/.test(location.protocol)&&'serviceWorker' in navigator)addEventListener('load',function(){navigator.serviceWorker.register('sw.js',{scope:'./'}).catch(function(){});});
var una=true;addEventListener('pointerdown',function(ev){if(!una||(ev.target&&ev.target.closest&&ev.target.closest('#mp-inst,#mp-inst-m')))return;una=false;var d=document.documentElement;if(matchMedia('(pointer: coarse)').matches&&!document.fullscreenElement&&d.requestFullscreen){d.requestFullscreen({navigationUI:'hide'}).then(function(){try{screen.orientation.lock('landscape').catch(function(){})}catch(e){}}).catch(function(){});}},{capture:true});})();</script><script>${fs.readFileSync(path.join(SRC, 'instalar-web.js'), 'utf8')}</script>`);
fs.mkdirSync(WEB, { recursive: true });
fs.writeFileSync(path.join(WEB, 'index.html'), web);
const version = crypto.createHash('sha1').update(web).digest('hex').slice(0, 10);
fs.writeFileSync(path.join(WEB, 'sw.js'), fs.readFileSync(path.join(SRC, 'sw.js'), 'utf8').replace('/*@version*/', version));
fs.writeFileSync(path.join(WEB, 'manifest.webmanifest'), JSON.stringify({ name: 'Mi Piano 3', short_name: 'Mi Piano', lang: 'es-CO', start_url: './', scope: './', id: './', display: 'fullscreen', orientation: 'landscape', background_color: '#1c1030', theme_color: '#1c1030',
  icons: [{ src: 'icono-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icono-512.png', sizes: '512x512', type: 'image/png' }, { src: 'icono-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }] }, null, 2));
['icono-192.png', 'icono-512.png', 'icono-maskable-512.png', 'apple-touch-icon.png'].forEach(f => fs.copyFileSync(path.join(__dirname, 'marca', 'iconos', f), path.join(WEB, f)));
// el piano opcional (Salamander, ≈ 9 MB): al lado del HTML y en web/ (el service worker lo guarda aparte)
const PIANO = ['/tmp/claude-0/piano/piano-datos.js', '/mnt/attach/outputs/piano-datos.js'].find(f => fs.existsSync(f));
if (PIANO) ['', 'web'].forEach(d => { const dst = path.join(__dirname, d, 'piano-datos.js'); if (!fs.existsSync(dst) || fs.statSync(dst).size !== fs.statSync(PIANO).size) fs.copyFileSync(PIANO, dst); });
// voces opcionales: un manifiesto vacío al lado (el generador de Dani lo reemplaza con el de verdad); así nunca hay un 404
// (solo al lado del HTML autónomo: en web/ NO, para no pisar el manifiesto de verdad publicado en /pruebas/mi-piano-3/voces)
[''].forEach(d => { const v = path.join(__dirname, d, 'voces'); fs.mkdirSync(v, { recursive: true }); const f = path.join(v, 'manifiesto.js'); if (!fs.existsSync(f)) fs.writeFileSync(f, 'window.VOCES = null;   /* sin voces todavía: GENERAR-VOCES-BELEN.bat escribe aquí el manifiesto de verdad */\n'); });
console.log('MI-PIANO-3-M3.html', (solo.length / 1024).toFixed(0) + ' KB (arte ' + (pesoArte / 1024).toFixed(0) + ' KB en disco) · web/index.html ' + (web.length / 1024).toFixed(0) + ' KB · sw ' + version);
