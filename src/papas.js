// =====================================================================
//  PANEL DE PAPÁS (el ícono de ajustes): informe semanal, modo Papá, clase del viernes, guías, perfiles, piano y voces, créditos.
//  El informe: minutos por día, lo dominado, lo que le cuesta y «cómo lo tocó» (se oye otra vez con el piano).
//  Estilo (M5): marfil, tinta y terracota (como la app devocional: Source Serif 4 + DM Sans, con Crimson y Outfit de respaldo)
//  con toques neobrutalistas del manual de marca (bordes de tinta y sombras duras). Pantalla completa, cosas grandes.
//  API que usa el resto del código: PESTANA5, NOMBRE_PERFIL5, semana5, nombreClave5, oirGrab5, panelPapas5,
//  MEDIR5, medirLatencia5, tapMedir5, terminarMedir5.
// =====================================================================
let PESTANA5 = 'informe';
const NOMBRE_PERFIL5 = { sarah: 'Sarah', david: 'David', papa: 'Papá', mama: 'Mamá' };
function semana5() { const f = hoy5().split('-').map(Number), h = new Date(f[0], f[1] - 1, f[2]), l = new Date(h); l.setDate(h.getDate() - ((h.getDay() + 6) % 7)); return [0, 1, 2, 3, 4, 5, 6].map(i => { const d = new Date(l); d.setDate(l.getDate() + i); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }); }
function nombreClave5(k) { if (k.includes(' · ')) return k; const [id, pz] = k.split('-'); const V = VILLANCICOS5[id]; if (V) return V.titulo + (pz != null && pz !== '' && !isNaN(+pz) ? ' · pedazo ' + (versionDe5(id).indexOf(+pz) + 1 || (+pz + 1)) : ' (entera)'); return { 'negra-blanca': 'Negra y blanca', 'blanca-negra': 'Blanca y negra' }[k] || k; }
function oirGrab5(g) { SON5.iniciar(); if (!SON5.listo) return; const K = KitSonido, t0 = K.ahora() + .2; g.notas.forEach(([n, t]) => Snd.piano(n, 80, t0 + Math.max(0, t))); }
// ---------- estilo del panel (se inyecta una vez; todo queda dentro de #menu.papas) ----------
const COLORES_NOTA_PAPAS5 = ['#ff5a5a', '#ff9a3c', '#ffd046', '#5fd36a', '#3fc7f0', '#5a7dff', '#b86bff'];
function estiloPapas5() {
  if (document.getElementById('papas5-estilo')) return;
  const s = document.createElement('style'); s.id = 'papas5-estilo';
  s.textContent = `
#menu.papas{background:rgba(31,30,29,.5)}
#menu.papas .caja{--bg:#FAF9F5;--sup:#FFFFFF;--ink:#1F1E1D;--mut:#6f6b63;--lin:#E6E3DA;--acc:#C96442;--acc2:#F3D2C1;--ok:#3d7a4f;--okl:#dcefe0;
  --serif:"Source Serif 4",Crimson,Georgia,serif;--sans:"DM Sans",Outfit,system-ui,sans-serif;
  position:absolute;inset:22px 26px;width:auto;max-width:none;min-width:0;max-height:none;padding:0;gap:0;display:grid;grid-template-columns:262px 1fr;grid-template-rows:96px 1fr;
  background:var(--bg);border:3px solid var(--ink);outline:none;border-radius:24px;box-shadow:9px 9px 0 var(--ink);color:var(--ink);font-family:var(--sans);overflow:hidden}
#menu.papas .p5-cab{grid-column:1/-1;display:flex;align-items:center;gap:18px;padding:0 200px 0 28px;border-bottom:3px solid var(--ink);background:var(--sup)}
#menu.papas .p5-marca{display:grid;grid-template-columns:repeat(4,13px);gap:3px}#menu.papas .p5-marca i{width:13px;height:13px;border-radius:3px;border:2px solid var(--ink);display:block}
#menu.papas .p5-cab h2{font:600 34px/1 var(--serif);letter-spacing:-.4px;margin:0;text-align:left}
#menu.papas .p5-quien{margin-left:auto;display:flex;align-items:center;gap:10px;font:600 19px var(--sans);border:2.5px solid var(--ink);border-radius:999px;padding:4px 18px 4px 6px;background:var(--bg);box-shadow:3px 3px 0 var(--ink)}
#menu.papas .p5-quien img,#menu.papas .p5-av img{image-rendering:pixelated;display:block}
#menu.papas .p5-quien .p5-av{width:42px;height:42px;border-radius:50%;background:var(--acc2);border:2px solid var(--ink);display:flex;align-items:flex-end;justify-content:center;overflow:hidden}
#menu.papas .caja>button.grande{position:absolute;top:22px;right:26px;font:700 20px var(--sans);background:var(--acc);color:#fff;border:3px solid var(--ink);border-radius:14px;padding:11px 26px;box-shadow:4px 4px 0 var(--ink)}
#menu.papas .caja>button.grande:active{transform:translate(3px,3px);box-shadow:1px 1px 0 var(--ink)}
#menu.papas .pest{grid-row:2;flex-direction:column;flex-wrap:nowrap;gap:9px;padding:22px 18px;border-right:3px solid var(--ink);background:var(--bg);overflow:auto}
#menu.papas .pest button{display:flex;align-items:center;gap:14px;text-align:left;font:600 20px var(--sans);color:var(--ink);background:transparent;border:2.5px solid transparent;border-radius:14px;padding:12px 14px;min-height:58px;box-shadow:none}
#menu.papas .pest button svg{flex:none;width:26px;height:26px}
#menu.papas .pest button.on{background:var(--acc);color:#fff;border-color:var(--ink);box-shadow:4px 4px 0 var(--ink)}
#menu.papas .pest button:not(.on):active{background:var(--lin)}
#menu.papas .info{grid-row:2;max-height:none;overflow:auto;padding:26px 30px 40px;font:400 19px/1.45 var(--sans)}
#menu.papas .info p{margin:0 0 8px}
#menu.papas .info h3,#menu.papas .tarj h3{font:600 25px/1.15 var(--serif);margin:0 0 12px;letter-spacing:-.2px}
#menu.papas .tarj{background:var(--sup);border:2.5px solid var(--ink);border-radius:18px;box-shadow:5px 5px 0 var(--ink);padding:20px 22px;margin:0 0 22px}
#menu.papas .nota{font-size:16px;color:var(--mut)}
#menu.papas .info button,#menu.papas .tarj button{font:600 18px var(--sans);color:var(--ink);background:var(--sup);border:2.5px solid var(--ink);border-radius:12px;padding:10px 18px;box-shadow:3px 3px 0 var(--ink)}
#menu.papas .info button:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--ink)}
#menu.papas .info button.on{background:var(--ink);color:#fff}
#menu.papas .info button.p5-prim{background:var(--acc);color:#fff}
#menu.papas .fila{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:8px 0}
#menu.papas .fila button{font-size:17px;padding:9px 15px}
#menu.papas .p5-titulo{display:flex;align-items:baseline;gap:14px;margin:0 0 18px}#menu.papas .p5-titulo h3{margin:0;font-size:30px}#menu.papas .p5-titulo span{color:var(--mut);font-size:17px}
#menu.papas .p5-cifras{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:22px}
#menu.papas .p5-cifra{background:var(--sup);border:2.5px solid var(--ink);border-radius:18px;box-shadow:5px 5px 0 var(--ink);padding:14px 18px 12px;position:relative;overflow:hidden}
#menu.papas .p5-cifra::before{content:'';position:absolute;left:0;top:0;bottom:0;width:10px;background:var(--c);border-right:2.5px solid var(--ink)}
#menu.papas .p5-cifra b{display:block;font:600 46px/1 var(--serif);margin:2px 0 4px 8px}#menu.papas .p5-cifra span{display:block;font-size:16px;color:var(--mut);margin-left:8px}
#menu.papas .barras{display:flex;gap:14px;align-items:flex-end;height:190px;margin:6px 0 0}
#menu.papas .barras div{flex:1;text-align:center;font-size:16px;color:var(--mut);display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}
#menu.papas .barras i{display:block;width:76%;background:var(--acc);border:2.5px solid var(--ink);border-radius:10px 10px 4px 4px;box-shadow:3px 3px 0 var(--ink);margin-bottom:8px}
#menu.papas .barras i.vacio{background:none;border-style:dashed;box-shadow:none;border-color:#b9b4a8}
#menu.papas .barras b{color:var(--ink);font-weight:600;font-size:17px}
#menu.papas .p5-dos{display:grid;grid-template-columns:1fr 1fr;gap:22px}
#menu.papas .ok{display:inline-flex;align-items:center;gap:8px;background:var(--okl);color:var(--ink);border:2px solid var(--ink);border-radius:999px;padding:4px 14px;margin:0 6px 8px 0;font-weight:600;font-size:17px}
#menu.papas .ok::before{content:'✓';font-weight:700;color:var(--ok)}
#menu.papas .p5-cuesta{margin:0 0 14px}#menu.papas .p5-cuesta .cuesta{font-weight:600;color:var(--ink)}
#menu.papas .p5-medidor{height:14px;border:2px solid var(--ink);border-radius:99px;background:var(--bg);overflow:hidden;margin:6px 0 3px}#menu.papas .p5-medidor i{display:block;height:100%;background:var(--acc);border-right:2px solid var(--ink)}
#menu.papas .p5-oir{display:flex;align-items:center;gap:16px;padding:10px 0;border-top:2px solid var(--lin)}#menu.papas .p5-oir:first-of-type{border-top:0}
#menu.papas .p5-oir button{background:var(--acc);color:#fff;min-width:110px}#menu.papas .p5-oir .p5-pct{margin-left:auto;font:600 22px var(--serif)}
#menu.papas .p5-ajuste{display:flex;align-items:center;gap:18px;padding:16px 0;border-top:2px solid var(--lin)}#menu.papas .p5-ajuste:first-child{border-top:0;padding-top:0}
#menu.papas .p5-ajuste>div{flex:1}#menu.papas .p5-ajuste b{display:block;font-size:20px}#menu.papas .p5-ajuste span{color:var(--mut);font-size:17px}
#menu.papas .p5-perfiles{display:grid;grid-template-columns:1fr 1fr;gap:20px}
#menu.papas .p5-perfil{display:flex;align-items:center;gap:16px}#menu.papas .p5-perfil .p5-av{width:84px;height:84px;border-radius:20px;border:2.5px solid var(--ink);background:var(--acc2);display:flex;align-items:flex-end;justify-content:center;overflow:hidden;flex:none}
#menu.papas .p5-perfil h3{margin:0 0 4px}#menu.papas .p5-perfil.ahora{outline:4px solid var(--acc);outline-offset:3px}
#menu.papas .p5-guia{display:flex;align-items:center;gap:16px;padding:12px 0;border-top:2px solid var(--lin)}#menu.papas .p5-guia:first-of-type{border-top:0}
#menu.papas .p5-guia .p5-n{width:40px;height:40px;border:2.5px solid var(--ink);border-radius:12px;display:flex;align-items:center;justify-content:center;font:700 19px var(--sans);background:var(--c)}
#menu.papas .p5-guia button{margin-left:auto}
#menu.papas .tarj table{border-collapse:collapse;width:100%;font-size:16px}#menu.papas .tarj td{border:0;border-top:2px solid var(--lin);padding:8px 10px;vertical-align:top}
#menu.papas .tarj h1{font:600 26px var(--serif);margin:0 0 8px}#menu.papas .tarj h2{font:600 21px var(--serif);text-align:left;margin:16px 0 6px}#menu.papas .tarj p{font-size:17px}
#menu.papas .p5-acciones{display:flex;gap:12px;flex-wrap:wrap;margin:0 0 22px}
`;
  document.head.appendChild(s);
}
// íconos de las pestañas (trazo simple)
const ICONO_PAPAS5 = {
  informe: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', papa: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
  clase: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', guias: '<path d="M6 9V3h12v6M6 18H4a1 1 0 01-1-1v-6a2 2 0 012-2h14a2 2 0 012 2v6a1 1 0 01-1 1h-2"/><rect x="6" y="14" width="12" height="7" rx="1"/>',
  perfiles: '<circle cx="8" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.8"/><path d="M2 20c0-3.5 2.7-6 6-6s6 2.5 6 6M14 15.5c.9-.6 1.9-.9 3-.9 2.8 0 5 2 5 5"/>',
  piano: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 4v16M12 4v16M17 4v16"/><rect x="5.5" y="4" width="3" height="9" fill="currentColor"/><rect x="15.5" y="4" width="3" height="9" fill="currentColor"/>',
  creditos: '<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>',
};
const icono5 = k => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + (ICONO_PAPAS5[k] || '') + '</svg>';
// el muñeco de cada perfil como imagen (pixel art del juego); si algo falla, queda la inicial
function avatar5(k, alto) {
  try { const s = k === 'sarah' ? sprSarah({ eyes: 'happy', cross: 'none' }) : k === 'david' ? sprDavid({ eyes: 'happy' }) : k === 'papa' ? PAPA() : MAMA(); const c = document.createElement('canvas'), z = Math.max(1, Math.floor(alto * 1.5 / s.height)); c.width = s.width * z; c.height = s.height * z; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(s, 0, 0, c.width, c.height); return '<img src="' + c.toDataURL() + '" style="height:' + Math.round(alto * 1.5) + 'px;margin-bottom:-' + Math.round(alto * .62) + 'px">'; }
  catch (e) { return '<b style="font-size:' + Math.round(alto * .5) + 'px;margin:auto">' + (NOMBRE_PERFIL5[k] || '?')[0] + '</b>'; }
}
function panelPapas5(caja, boton, h) {
  estiloPapas5();
  const p = GUARDA.perfil(), quien = GUARDA.d.perfil, m = p && m2_();
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  // encabezado: marca, título y quién toca
  const cab = document.createElement('div'); cab.className = 'p5-cab'; caja.appendChild(cab);
  cab.innerHTML = '<div class="p5-marca">' + [0, 2, 4, 6].map(i => '<i style="background:' + COLORES_NOTA_PAPAS5[i] + '"></i>').join('') + [1, 3, 5, 0].map(i => '<i style="background:' + (i ? COLORES_NOTA_PAPAS5[i] : 'transparent') + ';border-color:' + (i ? '' : 'transparent') + '"></i>').join('') + '</div><h2>Para papá y mamá</h2>' +
    (quien ? '<div class="p5-quien"><span class="p5-av">' + avatar5(quien, 34) + '</span>' + esc(NOMBRE_PERFIL5[quien] || '') + '</div>' : '');
  const pest = document.createElement('div'); pest.className = 'pest'; caja.appendChild(pest);
  const info = document.createElement('div'); info.className = 'info desliza'; caja.appendChild(info);
  [['informe', 'Informe'], ['papa', 'Modo Papá'], ['clase', 'Clase del viernes'], ['guias', 'Guías para imprimir'], ['perfiles', 'Perfiles'], ['piano', 'Piano y voces'], ['creditos', 'Créditos']].forEach(([k, t]) => { const b = document.createElement('button'); b.innerHTML = icono5(k) + '<span>' + t + '</span>'; if (k === PESTANA5) b.className = 'on'; b.onclick = () => { PESTANA5 = k; MENU5.abrir('papas'); }; pest.appendChild(b); });
  // botones de acción dentro del contenido (no abajo de la caja)
  const acciones = () => { const d = document.createElement('div'); d.className = 'p5-acciones'; info.appendChild(d); return (t, fn, prim) => { const b = document.createElement('button'); b.textContent = t; if (prim) b.className = 'p5-prim'; b.onclick = fn; d.appendChild(b); return b; }; };
  const sinPerfil = () => { info.innerHTML = '<div class="tarj"><h3>Primero escojan quién toca hoy</h3><p class="nota">Cierren este panel y toquen un muñeco en la pantalla de inicio.</p></div>'; };
  if (PESTANA5 === 'informe') {
    if (!m) return sinPerfil();
    const dias = m.dias || {}, sem = semana5(), DIAS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'], min = sem.map(k => Math.round(((dias[k] || {}).seg || 0) / 60)), tot = min.reduce((a, b) => a + b, 0), mx = Math.max(15, ...min);
    const comp = sem.filter(k => (dias[k] || {}).completo).length, ins = m.insignias && m.insignias.estrella;
    let html = '<div class="p5-titulo"><h3>' + esc(NOMBRE_PERFIL5[quien] || '') + '</h3><span>semana del ' + sem[0].slice(8) + '/' + sem[0].slice(5, 7) + '</span></div>';
    html += '<div class="p5-cifras">' + [[tot, 'minutos de práctica', COLORES_NOTA_PAPAS5[0]], [comp, comp === 1 ? 'sesión completa' : 'sesiones completas', COLORES_NOTA_PAPAS5[4]], [m.corcheas || 0, 'corcheas doradas', COLORES_NOTA_PAPAS5[2]], [ins ? '★' : '—', ins ? 'insignia de la estrella' : 'insignias', COLORES_NOTA_PAPAS5[6]]].map(([n, t, c]) => '<div class="p5-cifra" style="--c:' + c + '"><b>' + n + '</b><span>' + t + '</span></div>').join('') + '</div>';
    html += '<div class="tarj"><h3>Minutos por día</h3><div class="barras">' + sem.map((k, i) => '<div>' + (min[i] ? '<b>' + min[i] + ' min</b>' : '') + '<i' + (min[i] ? '' : ' class="vacio"') + ' style="height:' + Math.round(min[i] / mx * 120 + (min[i] ? 8 : 8)) + 'px"></i>' + DIAS[i] + '</div>').join('') + '</div></div>';
    // dominado (bien en dos días distintos) y en camino
    const dominio = m.dominio || {}, dom = Object.keys(dominio).filter(k => dominio[k].length >= 2), camino = Object.keys(dominio).filter(k => dominio[k].length === 1);
    html += '<div class="p5-dos"><div class="tarj"><h3>Dominado</h3>' + (dom.length ? dom.map(k => '<span class="ok">' + esc(nombreClave5(k)) + '</span>').join('') : '<p class="nota">Todavía nada: un pedazo queda dominado cuando sale bien en dos días distintos.</p>') + (camino.length ? '<p class="nota" style="margin-top:6px"><b>En camino</b> (bien un día): ' + camino.map(k => esc(nombreClave5(k))).join(', ') + '</p>' : '') + '</div>';
    // le cuesta: lo que más se repitió esta semana
    const st = Object.entries(m.stats || {}).filter(([k, v]) => sem.includes(v.dia) && v.fallidos > 0).sort((a, b) => (b[1].fallidos / b[1].intentos) - (a[1].fallidos / a[1].intentos) || a[1].mejor - b[1].mejor).slice(0, 4);
    html += '<div class="tarj"><h3>Le cuesta</h3>' + (st.length ? st.map(([k, v]) => '<div class="p5-cuesta"><span class="cuesta">' + esc(nombreClave5(k)) + '</span><div class="p5-medidor"><i style="width:' + Math.round(v.mejor * 100) + '%"></i></div><span class="nota">' + v.intentos + ' intentos · ' + v.fallidos + ' por repetir · mejor ' + Math.round(v.mejor * 100) + ' %</span></div>').join('') : '<p class="nota">Nada se le atascó esta semana.</p>') + '</div></div>';
    // cómo lo tocó
    const gr = Object.entries(m.grab || {}).filter(([k, g]) => sem.includes(g.fecha)).sort((a, b) => (a[1].fecha < b[1].fecha ? 1 : -1));
    html += '<div class="tarj"><h3>Cómo lo tocó</h3>' + (gr.length ? gr.map(([k, g]) => '<div class="p5-oir"><button data-g="' + esc(k) + '">▶ Oír</button><span>' + esc(nombreClave5(k)) + ' <span class="nota">· ' + DIAS[sem.indexOf(g.fecha)] + '</span></span><span class="p5-pct">' + Math.round(g.prec * 100) + ' %</span></div>').join('') : '<p class="nota">Aquí aparecen las canciones y los pedazos que tocó bien (se oyen con el piano, tal como los tocó).</p>') + '</div>';
    info.innerHTML = html;
    info.querySelectorAll('button[data-g]').forEach(b => { b.onclick = () => oirGrab5(m.grab[b.dataset.g]); });
  } else if (PESTANA5 === 'papa') {
    if (!m) return sinPerfil(); menuPapa5(info, esc);
  } else if (PESTANA5 === 'clase') {
    if (!m) return sinPerfil();
    const accion = acciones(); accion('Imprimir el plan', () => imprimir5(planClase5()), true);
    const t = document.createElement('div'); t.className = 'tarj'; t.innerHTML = planClase5().replace(/<div class="pie">[\s\S]*?<\/div>/, '').replace('<div class="hoja">', '').replace(/<\/div>$/, ''); info.appendChild(t);
  } else if (PESTANA5 === 'guias') {
    if (!m) return sinPerfil();
    info.innerHTML = '<div class="tarj"><h3>Hojas de esta semana</h3><p class="nota">Salen con las notas y el villancico de ' + esc(NOMBRE_PERFIL5[quien] || '') + '. Se imprimen desde Chrome en tamaño carta, vertical.</p>' +
      GUIAS5.map(([t], i) => '<div class="p5-guia"><span class="p5-n" style="--c:' + COLORES_NOTA_PAPAS5[i * 2 % 7] + '">' + (i + 1) + '</span><span>' + esc(t) + '</span><button data-i="' + i + '">Imprimir</button></div>').join('') + '</div>' +
      '<div class="tarj"><h3>Cuaderno de Belén</h3><p>El cuaderno completo está en <b>GUIAS-BELEN.pdf</b>: una ficha por misión (lo que aprendió, algo para colorear y la estrella del día), la hoja de papá, tarjetas recortables y el diploma firmado por Bach.</p></div>';
    info.querySelectorAll('button[data-i]').forEach(b => { b.onclick = () => imprimir5(GUIAS5[+b.dataset.i][1]()); });
    const accion = acciones(); info.insertBefore(info.lastChild, info.firstChild); accion('Imprimir las cuatro', () => imprimir5(GUIAS5.map(g => g[1]()).join('')), true);
  } else if (PESTANA5 === 'perfiles') {
    const tarjetas = Object.keys(NOMBRE_PERFIL5).map(k => { const q = GUARDA.d.perfiles[k], mm = q && q.m2; const ses = mm ? Object.keys(mm.dias || {}).filter(d => mm.dias[d].completo).length : 0;
      return '<div class="tarj p5-perfil' + (k === quien ? ' ahora' : '') + '"><span class="p5-av">' + avatar5(k, 64) + '</span><div><h3>' + NOMBRE_PERFIL5[k] + (k === quien ? ' <span class="nota">(ahora)</span>' : '') + '</h3><p class="nota">' + ses + (ses === 1 ? ' sesión' : ' sesiones') + ' · ' + (mm ? mm.corcheas : 0) + ' corcheas' + (mm && mm.insignias && mm.insignias.estrella ? ' · ★ insignia' : '') + '</p>' + (k === quien ? '' : '<button data-p="' + k + '">Tocar con este perfil</button>') + '</div></div>'; }).join('');
    info.innerHTML = '<div class="p5-perfiles">' + tarjetas + '</div><p class="nota">Cada perfil guarda su avance, sus voces y su informe aparte.</p>';
    info.querySelectorAll('button[data-p]').forEach(b => { b.onclick = () => { GUARDA.d.perfil = b.dataset.p; GUARDA.perfil(); GUARDA.guardar(); MENU5.cerrar(); empezarDia5(LW5 / 2, LH5 / 2); }; });
    if (quien) { const accion = acciones(); accion('Borrar el avance de ' + (NOMBRE_PERFIL5[quien] || 'este perfil'), () => { if (!confirm('¿Borrar el avance de ' + (NOMBRE_PERFIL5[quien] || '') + '?')) return; delete GUARDA.d.perfiles[GUARDA.d.perfil]; GUARDA.guardar(); MENU5.cerrar(); irA(ESCENA_SELECTOR, { tipo: 'fundido' }); }); }
  } else if (PESTANA5 === 'piano') {
    const midi = Entrada.dispositivos && Entrada.dispositivos.length ? Entrada.dispositivos.join(', ') : ({ 'sin-soporte': 'este navegador no tiene MIDI', 'sin-permiso': 'sin permiso para el MIDI' }[Entrada.estado] || 'no hay piano conectado (se puede tocar en la pantalla)');
    const pi = Snd.estadoPiano ? Snd.estadoPiano() : {}, nv = window.Voz5 ? Voz5.disponibles() : 0, lat = GUARDA.d.latencia || {};
    const fila = (t, d, b) => '<div class="p5-ajuste"><div><b>' + t + '</b><span>' + d + '</span></div>' + (b || '') + '</div>';
    const es = estadoSonido5();
    info.innerHTML = '<div class="tarj"><h3>¿Suena?</h3><p id="est-piano5"><b>Piano:</b> ' + esc(es.piano) + '</p><p id="est-midi5"><b>MIDI:</b> ' + esc(es.midi) + '</p><p id="est-audio5"><b>Audio:</b> ' + esc(es.audio) + '</p>' +
      '<div class="p5-acciones"><button data-x="probar" class="p5-prim">Probar sonido</button><button data-x="propio">' + (GUARDA.d.midiPropio ? 'El piano MIDI suena por su parlante (cambiar)' : 'El piano MIDI suena por el juego (cambiar)') + '</button></div>' + ((window.__errores5 || []).length ? '<p style="font:12px/1.4 monospace;color:#b3522d;white-space:pre-wrap;max-height:120px;overflow:auto">Errores (mándale una foto a Claude):\n' + window.__errores5.slice(-4).join('\n').replace(/</g, '&lt;') + '</p>' : '') + '</div>' +
      '<div class="tarj">' +
      fila('Octava del piano MIDI', '<span id="midi5">Si suena una octava corrida: «Calibrar» y tocar el DO del medio.</span>', '<button data-x="cal">Calibrar el piano</button>') +
      fila('Retraso compensado', 'pantalla ' + Math.round(latencia5('pantalla') * 1000) + ' ms' + (lat.pantalla != null ? ' (medido)' : ' (estimado)') + ' · piano MIDI ' + Math.round(latencia5('midi') * 1000) + ' ms' + (lat.midi != null ? ' (medido)' : ' (estimado)'), '<button data-x="lat">Medir tocando</button>') +
      fila('Voces', (GUARDA.d.voces === false ? 'apagadas' : 'encendidas') + ' · ' + (nv ? nv + ' frases grabadas' : 'todavía no hay audios (el juego sigue callado)'), '<button data-x="voz">' + (GUARDA.d.voces === false ? 'Encender las voces' : 'Apagar las voces') + '</button>') +
      '</div><div id="medir5"></div>';
    info.querySelector('[data-x="cal"]').onclick = () => { const e = document.getElementById('midi5'); if (e) e.textContent = 'Toca el DO del medio en tu piano…'; calibrar5((disp, aj) => { const e2 = document.getElementById('midi5'); if (e2) e2.textContent = disp + ': listo' + (aj ? ' (ajuste de ' + (aj > 0 ? '+' : '') + aj / 12 + ' octava)' : ''); }); };
    info.querySelector('[data-x="lat"]').onclick = () => medirLatencia5();
    info.querySelector('[data-x="probar"]').onclick = () => probarSonido5();
    info.querySelector('[data-x="propio"]').onclick = () => { GUARDA.d.midiPropio = !GUARDA.d.midiPropio; GUARDA.guardar(); MENU5.abrir('papas'); };
    clearInterval(window.__estSon5); window.__estSon5 = setInterval(() => { const p = document.getElementById('est-piano5'); if (!p) { clearInterval(window.__estSon5); return; } const e = estadoSonido5(); p.innerHTML = '<b>Piano:</b> ' + esc(e.piano); document.getElementById('est-midi5').innerHTML = '<b>MIDI:</b> ' + esc(e.midi); document.getElementById('est-audio5').innerHTML = '<b>Audio:</b> ' + esc(e.audio); }, 600);
    info.querySelector('[data-x="voz"]').onclick = () => { GUARDA.d.voces = GUARDA.d.voces === false; GUARDA.guardar(); if (window.Voz5) Voz5.activa = GUARDA.d.voces !== false; MENU5.abrir('papas'); };
  } else {
    info.innerHTML = '<div class="tarj"><h3>Mi Piano 3 · «El viaje de Bach»</h3><p class="nota">Belén · fps ' + Math.round(FPS5.valor) + '</p>' +
      '<p><b>Piano:</b> «Salamander Grand Piano V3», Alexander Holm (CC BY 3.0).</p><p><b>Voz de Bach:</b> Daniel Vanegas.</p>' +
      '<p><b>Letras:</b> Crimson Pro, Outfit y Pixelify Sans (SIL Open Font License 1.1).</p><p><b>Versículos:</b> Santa Biblia Reina-Valera 1960 © Sociedades Bíblicas en América Latina, 1960; renovado © Sociedades Bíblicas Unidas, 1988.</p>' +
      '<p><b>Villancicos:</b> tradicionales, dominio público (Jingle Bells, Noche de paz, Los peces en el río, Campana sobre campana, Venid fieles todos).</p><p><b>Arte, música, figuras musicales y código:</b> propios.</p></div>';
  }
}
// medir el retraso tocando: 4 clics de cuenta y 12 para tocar junto con ellos (pantalla o piano); se guarda la mediana
const MEDIR5 = { activo: false, taps: [], clics: [] };
function medirLatencia5() {
  SON5.iniciar(); if (!SON5.listo) return; const box = document.getElementById('medir5'); if (!box) return;
  const K = KitSonido, b = 60 / 72, a0 = K.ahora() + .6; MEDIR5.activo = true; MEDIR5.taps = []; MEDIR5.clics = []; MEDIR5.fuente = 'pantalla';
  for (let i = 0; i < 16; i++) { const t = a0 + i * b; MEDIR5.clics.push(t); SON5.ticEn(i % 4 === 0, t); if (i < 4) SON5.cuenta(i + 1, t, 4); }
  box.innerHTML = '<div class="tarj" style="text-align:center"><p>Escucha la cuenta y toca <b>junto con cada clic</b> (en el piano o en el botón).</p><button id="toca5" class="grande p5-prim" style="font-size:34px;padding:26px 60px;margin:6px auto">TOCA</button><p id="medir5r" class="nota"></p></div>';
  box.scrollIntoView({ block: 'nearest' });
  const btn = document.getElementById('toca5');
  btn.addEventListener('pointerdown', e => { e.preventDefault(); tapMedir5(K.ahora() - Math.max(0, performance.now() - e.timeStamp) / 1000, 'pantalla'); SON5.nota(64, 80); }, { passive: false });
  setTimeout(() => terminarMedir5(), (a0 - K.ahora() + 16 * b + .6) * 1000);
}
function tapMedir5(a, fuente) { if (!MEDIR5.activo) return; MEDIR5.fuente = fuente; const c = MEDIR5.clics.slice(4).reduce((m, x) => Math.abs(x - a) < Math.abs(m - a) ? x : m, 1e9); if (Math.abs(c - a) < .35) MEDIR5.taps.push(a - c); const r = document.getElementById('medir5r'); if (r) r.textContent = MEDIR5.taps.length + ' toques'; }
function terminarMedir5() {
  MEDIR5.activo = false; const r = document.getElementById('medir5r'); const L = MEDIR5.taps.slice().sort((a, b) => a - b);
  if (L.length < 5) { if (r) r.textContent = 'Muy pocos toques: inténtalo otra vez.'; return; }
  const med = Math.max(0, Math.min(.3, L[Math.floor(L.length / 2)])); GUARDA.d.latencia = Object.assign({}, GUARDA.d.latencia, { [MEDIR5.fuente]: +med.toFixed(3) }); GUARDA.guardar();
  if (r) r.textContent = 'Listo: retraso de ' + Math.round(med * 1000) + ' ms (' + (MEDIR5.fuente === 'midi' ? 'piano MIDI' : 'pantalla') + '). La app lo compensa al juzgar.';
}
