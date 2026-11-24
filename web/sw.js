// Mi Piano 3 · service worker (cache-first, todo offline). Rutas RELATIVAS: sirve igual en /pruebas/mi-piano-3/ o en cualquier carpeta.
// - La app (index.html, manifiesto, iconos) va en un caché con la versión de este build: al publicar otro build, se renueva sola.
// - Las voces (voces/*.ogg + voces/manifiesto.js) y el piano opcional (piano-datos.js, ≈ 9 MB) van en otro caché que sobrevive a los builds.
//   Si existen, se guardan todas (las voces al instalar y al cambiar el manifiesto; el piano cuando la página avisa que ya cargó);
//   si no existen, se responde un JS vacío (sin errores en consola).
const VERSION = 'cca464492f';
const APP = 'mipiano3-app-' + VERSION, DATOS = 'mipiano3-datos';
const BASE = new URL('./', self.location).href;
const CASCARON = ['./', 'manifest.webmanifest', 'icono-192.png', 'icono-512.png', 'icono-maskable-512.png', 'apple-touch-icon.png'];
const STUB = { 'voces/manifiesto.js': 'window.VOCES = null;\n', 'piano-datos.js': 'window.PIANO_SALAMANDER = null;\n' };
const rel = url => url.startsWith(BASE) ? url.slice(BASE.length).split(/[?#]/)[0] : null;
// Cloudflare Pages redirige index.html -> ./ : una respuesta "redirigida" no se puede servir a una navegación (ERR_FAILED). Se limpia.
const limpia = async res => res && res.redirected ? new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers: res.headers }) : res;
const js = txt => new Response(txt, { status: 200, headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });

// guarda todas las voces del manifiesto (las que falten), sin bloquear ni fallar
async function guardarVoces(txtManifiesto) {
  const ids = []; (txtManifiesto || '').replace(/"([a-z0-9-]+)"\s*:\s*\{/g, (m, id) => { ids.push(id); return m; });
  if (!ids.length) return;
  const c = await caches.open(DATOS);
  for (let i = 0; i < ids.length; i += 8) {
    await Promise.all(ids.slice(i, i + 8).map(async id => {
      const u = new URL('voces/' + id + '.ogg', BASE).href;
      if (await c.match(u)) return;
      try { const r = await fetch(u); if (r.ok) await c.put(u, r); } catch (e) { }
    }));
  }
}
async function opcional(ruta) {   // descarga y guarda un archivo opcional; devuelve su texto o null
  try { const r = await fetch(new URL(ruta, BASE).href, { cache: 'no-cache' }); if (!r.ok) return null; const c = await caches.open(DATOS); await c.put(new URL(ruta, BASE).href, r.clone()); return ruta.endsWith('manifiesto.js') ? await r.text() : ''; } catch (e) { return null; }
}

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(APP);
    await Promise.all(CASCARON.map(async u => { const res = await fetch(new Request(u, { cache: 'reload' })); if (res.ok) await c.put(new URL(u, BASE).href, await limpia(res)); }));
    // las voces (si existen): el manifiesto es pequeño; las .ogg se bajan sin bloquear la instalación
    const man = await opcional('voces/manifiesto.js');
    if (man) guardarVoces(man);
    self.skipWaiting();
  })());
});
// la página avisa cuando ya cargó: entonces se baja lo grande (piano-datos.js ≈ 9 MB) sin frenar la instalación
self.addEventListener('message', e => {
  if (e.data !== 'opcionales') return;
  e.waitUntil((async () => {
    const d = await caches.open(DATOS);
    if (!(await d.match(new URL('piano-datos.js', BASE).href))) await opcional('piano-datos.js');
    const man = await d.match(new URL('voces/manifiesto.js', BASE).href);
    if (man) await guardarVoces(await man.text());
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('mipiano3-') && k !== APP && k !== DATOS) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const r = rel(req.url); if (r == null) return;
  // navegación: la app guardada (cualquier ?query o #fecha va a la misma página)
  if (req.mode === 'navigate') {
    e.respondWith((async () => { const hit = await caches.match(BASE, { ignoreSearch: true }); if (hit) return limpia(hit); try { return await fetch(req); } catch (err) { return new Response('Sin red', { status: 503 }); } })());
    return;
  }
  // manifiesto de voces: lo guardado al instante y se revisa en segundo plano (si trae voces nuevas, se bajan)
  if (r === 'voces/manifiesto.js') {
    e.respondWith((async () => {
      const c = await caches.open(DATOS), ya = await c.match(req.url);
      const red = fetch(req.url, { cache: 'no-cache' }).then(async res => { if (res.ok) { await c.put(req.url, res.clone()); const t = await res.clone().text(); guardarVoces(t); return res; } return null; }).catch(() => null);
      if (ya) { e.waitUntil(red); return ya; }
      return (await red) || js(STUB[r]);
    })());
    return;
  }
  // el resto: cache-first (app, voces, piano); lo que no está, de la red y se guarda
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true }); if (hit) return limpia(hit);
    try {
      const res = await fetch(req);
      if (res.status === 200 && (r.startsWith('voces/') || r === 'piano-datos.js')) { const c = await caches.open(DATOS); c.put(req, res.clone()).catch(() => { }); }
      else if (res.status === 200 && res.type === 'basic') { const c = await caches.open(APP); c.put(req, res.clone()).catch(() => { }); }
      if (!res.ok && STUB[r]) return js(STUB[r]);
      return res;
    } catch (err) {
      if (STUB[r]) return js(STUB[r]);
      return new Response('', { status: 504, statusText: 'sin red' });
    }
  })());
});
