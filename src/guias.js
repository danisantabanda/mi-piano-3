// =====================================================================
//  M3.1 · LA CLASE DEL VIERNES y LAS GUÍAS PARA IMPRIMIR (desde Chrome: Imprimir → tamaño carta, vertical).
//  Todo se arma con lo que la app sabe de la semana: notas conocidas, canción, lo dominado y lo que le cuesta.
// =====================================================================
const SVG5 = {
  clave(x, y, gap, c = '#2a1a3a') { const k = gap / 10; return '<g transform="translate(' + (x + 9 * k) + ',' + y + ') scale(' + k + ')"><path d="' + CLAVE_SOL5 + '" fill="none" stroke="' + c + '" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="-1.8" cy="49.8" r="3.2" fill="' + c + '"/></g>'; },
  pauta(x, y, w, gap) { let s = ''; for (let i = 0; i < 5; i++) s += '<line x1="' + x + '" y1="' + (y + i * gap) + '" x2="' + (x + w) + '" y2="' + (y + i * gap) + '" stroke="#2a1a3a" stroke-width="1.6"/>'; return s; },
  // fig: 'negra' | 'blanca' | 'redonda'; vacia: solo contorno (para colorear)
  figura(fig, x, y, gap, vacia, color) {
    const rx = gap * .68, ry = gap * .47, hueca = fig !== 'negra' || vacia;
    let s = '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" transform="rotate(-20 ' + x + ' ' + y + ')" fill="' + (hueca ? (color && !vacia ? color : '#fff') : (color || '#2a1a3a')) + '" stroke="#2a1a3a" stroke-width="' + (gap * .16) + '"/>';
    if (fig !== 'redonda') s += '<line x1="' + (x + rx - 1) + '" y1="' + y + '" x2="' + (x + rx - 1) + '" y2="' + (y - gap * 3.4) + '" stroke="#2a1a3a" stroke-width="' + (gap * .16) + '"/>';
    return s;
  },
  teclado(x, y, w, h, marcar) { let s = ''; const bw = w / 7; for (let i = 0; i < 7; i++) s += '<rect x="' + (x + i * bw) + '" y="' + y + '" width="' + bw + '" height="' + h + '" rx="4" fill="' + (marcar === i ? '#ffe8a0' : '#fff') + '" stroke="#2a1a3a" stroke-width="2"/>'; [0, 1, 3, 4, 5].forEach(i => { s += '<rect x="' + (x + (i + 1) * bw - bw * .3) + '" y="' + y + '" width="' + (bw * .6) + '" height="' + (h * .6) + '" rx="3" fill="#2a1a3a"/>'; }); if (marcar != null) s += '<circle cx="' + (x + (marcar + .5) * bw) + '" cy="' + (y + h * .8) + '" r="' + (bw * .18) + '" fill="#2a1a3a"/>'; return s; },
  corazon(x, y, r) { return '<path d="M' + x + ',' + (y + r * .9) + ' C' + (x - r * 1.6) + ',' + (y - r * .1) + ' ' + (x - r * .7) + ',' + (y - r * 1.3) + ' ' + x + ',' + (y - r * .45) + ' C' + (x + r * .7) + ',' + (y - r * 1.3) + ' ' + (x + r * 1.6) + ',' + (y - r * .1) + ' ' + x + ',' + (y + r * .9) + ' Z" fill="#fff" stroke="#d2452e" stroke-width="2.5"/>'; },
};
const PASO_SVG5 = { 60: -2, 62: -1, 64: 0, 65: 1, 67: 2, 69: 3, 71: 4, 72: 5, 74: 6, 76: 7, 77: 8, 79: 9 };
function nombreNino5Txt() { return NOMBRE_PERFIL5[GUARDA.d.perfil] || ''; }
function pieGuia5(n) { return '<div class="pie">Mi Piano · El viaje de Bach · Belén · guía ' + n + ' de 4</div>'; }
function hojaRitmos5() {
  const pl = plan5(), V = patronesDia5(diaPlan5(), 10, 5).filter((v, i) => i % 2 === 0).slice(0, 5);
  let svg = '<svg viewBox="0 0 700 560" width="100%">';
  V.forEach((p, r) => { const y = 40 + r * 105; svg += '<line x1="20" y1="' + (y + 40) + '" x2="680" y2="' + (y + 40) + '" stroke="#2a1a3a" stroke-width="1.6"/>';
    let x = 60, bt = 0, ant = null;
    p.forEach((nt, k) => { if (Math.abs(bt - 4) < .01) { svg += '<line x1="' + (x - 12) + '" y1="' + (y + 22) + '" x2="' + (x - 12) + '" y2="' + (y + 58) + '" stroke="#2a1a3a" stroke-width="1.6"/>'; x += 12; }
      const sil = nt.n === 0 ? 'sh' : nt.d === .5 ? ((bt % 1) ? 'ca' : 'ta') : nt.d === 1 ? 'tan' : nt.d === 2 ? 'taaan' : 'taaaaan';
      if (nt.n === 0) svg += '<path d="M' + (x - 4) + ',' + (y + 22) + ' l9,10 l-9,9 l9,10 q-12,-4 -6,10" fill="none" stroke="#2a1a3a" stroke-width="3.2" stroke-linejoin="round"/>';
      else { svg += SVG5.figura(nt.d >= 2 ? 'blanca' : 'negra', x, y + 40, 16, true); if (nt.d === .5) { if (bt % 1) svg += '<line x1="' + (ant + 10) + '" y1="' + (y + 40 - 54) + '" x2="' + (x + 10) + '" y2="' + (y + 40 - 54) + '" stroke="#2a1a3a" stroke-width="5"/>'; ant = x; } }
      svg += '<text x="' + (x - 6) + '" y="' + (y + 82) + '" font-size="17" font-family="Outfit" fill="#7a5a3a">' + sil + '</text>';
      x += nt.d * 72; bt += nt.d; }); });
  svg += '</svg>';
  const usa = pl.ritmos.filter(r => r !== 'taaaaan').map(r => NOMBRE_RITMO5[r]).join(', ');
  return '<div class="hoja"><h1>Colorea los ritmos</h1><p class="nombre">Nombre: ' + nombreNino5Txt() + ' ______________________ Fecha: ________</p>' +
    '<p>Esta semana: ' + usa + '. Colorea de <b style="color:#d2452e">rojo</b> lo que suena corto (tan, taca) y de <b style="color:#2a4b9b">azul</b> lo que suena largo (taaan). El silencio no se colorea: se hace el gesto «sh» con el dedo en los labios. Después dilo en voz alta con palmas.</p>' + svg + pieGuia5(1) + '</div>';
}
function hojaCorazones5() {
  let svg = '<svg viewBox="0 0 700 600" width="100%">';
  for (let r = 0; r < 5; r++) { const y = 60 + r * 112; for (let i = 0; i < 8; i++) svg += SVG5.corazon(60 + i * 82, y + 40, 20); if (r === 0) { [[60, 1], [142, 1], [224, 2], [388, 1], [470, 1], [552, 2]].forEach(([x, d]) => { svg += SVG5.figura(d === 1 ? 'negra' : 'blanca', x + (d === 2 ? 0 : 0), y - 6, 12, false); }); svg += '<text x="20" y="' + (y + 90) + '" font-size="15" font-family="Outfit" fill="#7a5a3a">Ejemplo: Jin-gle bells, jin-gle bells (la blanca ocupa dos corazones)</text>'; } }
  svg += '</svg>';
  return '<div class="hoja"><h1>El pulso es un corazón</h1><p class="nombre">Nombre: ' + nombreNino5Txt() + ' ______________________</p>' +
    '<p>Papá o mamá canta el villancico y tú tocas un corazón en cada pulso (como Tic). Encima de cada corazón dibuja lo que oyes: una <b>negra</b> en un corazón, una <b>blanca</b> sobre dos corazones.</p>' + svg + pieGuia5(2) + '</div>';
}
function hojaUnir5() {
  const ns = conocidas5().map(pc => NOTA_PC5[pc]).concat([64, 67, 60, 62, 65]).filter((v, i, a) => a.indexOf(v) === i).slice(0, 5), orden = [2, 0, 4, 1, 3];
  let svg = '<svg viewBox="0 0 700 640" width="100%">';
  ns.forEach((n, i) => { const y = 40 + i * 120; svg += SVG5.pauta(30, y, 230, 12) + SVG5.clave(30, y, 12) + SVG5.figura('redonda', 190, y + 48 - PASO_SVG5[n] * 6, 12) ; if (n === 60) svg += '<line x1="176" y1="' + (y + 60) + '" x2="204" y2="' + (y + 60) + '" stroke="#2a1a3a" stroke-width="1.6"/>'; svg += '<circle cx="285" cy="' + (y + 24) + '" r="7" fill="#2a1a3a"/>'; });
  ns.forEach((n, i) => { const y = 40 + orden.indexOf(i) * 120, wi = [0, 2, 4, 5, 7, 9, 11].indexOf(n % 12); svg += '<circle cx="415" cy="' + (y + 24) + '" r="7" fill="#2a1a3a"/>' + SVG5.teclado(440, y - 6, 230, 70, wi); });
  svg += '</svg>';
  return '<div class="hoja"><h1>Une la nota con su tecla</h1><p class="nombre">Nombre: ' + nombreNino5Txt() + ' ______________________</p>' +
    '<p>Traza una línea desde cada nota del pentagrama hasta la tecla que tiene el puntico. Escribe el nombre de la nota y con qué dedo se toca (mano derecha: DO 1, RE 2, MI 3, FA 4, SOL 5). Píntala de su color (DO rojo, RE naranja, MI amarillo, FA verde, SOL azul claro, LA azul, SI morado). Al principio basta con MI y SOL: las otras se pintan cuando lleguen.</p>' + svg + pieGuia5(3) + '</div>';
}
function hojaPedazos5() {
  const m = m2_(), id = (m && (diaHoy5().cancion || cancionDelDia5())) || 'jingle', V = VILLANCICOS5[id], ver = versionDe5(id);
  const LETRA = { jingle: ['Jin-gle bells, jin-gle bells', 'jin-gle all the way', 'Oh what fun it is to ride', 'in a one-horse o-pen sleigh', 'in a one-horse o-pen sleigh'], noche: ['No-che de paz, no-che de a-mor', 'To-do duer-me en de-rre-dor', 'En-tre los as-tros que es-par-cen su luz', 'be-lla a-nun-cian-do al ni-ñi-to Je-sús', 'Bri-lla la es-tre-lla de paz', 'bri-lla la es-tre-lla de paz'], venid: ['Ve-nid, fie-les to-dos', 'a Be-lén va-ya-mos', 'Ve-nid a-do-re-mos', 've-nid a-do-re-mos', 've-nid a-do-re-mos a Cris-to el Se-ñor'], peces: ['La Vir-gen se es-tá pei-nan-do', 'en-tre cor-ti-na y cor-ti-na', 'Pe-ro mi-ra có-mo be-ben', 'los pe-ces en el rí-o'], campana: ['Cam-pa-na so-bre cam-pa-na', 'y so-bre cam-pa-na u-na', 'Be-lén, cam-pa-nas de Be-lén', 'que los án-ge-les to-can'] }[id] || [];
  let svg = '<svg viewBox="0 0 700 ' + (ver.length * 118 + 20) + '" width="100%">';
  ver.forEach((k, i) => { const y = 14 + i * 118, pz = V.pedazos[k], tot = pz.notas.reduce((a, x) => a + x.d, 0), pxb = 600 / tot; let b = 0;
    svg += '<rect x="20" y="' + y + '" width="660" height="100" rx="18" fill="#fff" stroke="#2a1a3a" stroke-width="3" stroke-dasharray="' + (dominada5(id + '-' + k) ? '0' : '10 6') + '"/>';
    svg += '<text x="38" y="' + (y + 30) + '" font-size="19" font-family="Crimson" font-weight="700">Pedazo ' + (i + 1) + '</text><text x="140" y="' + (y + 30) + '" font-size="16" font-family="Outfit" fill="#6a4a2a">' + (LETRA[k] || '') + '</text>';
    pz.notas.forEach(x => { svg += '<rect x="' + (50 + b * pxb) + '" y="' + (y + 48) + '" width="' + (x.d * pxb - 6) + '" height="30" rx="8" fill="#fff" stroke="#2a1a3a" stroke-width="2"/><text x="' + (50 + b * pxb + 6) + '" y="' + (y + 69) + '" font-size="13" font-family="Outfit" font-weight="700">' + NOMBRE_NOTA5(x.n) + '</text>'; b += x.d; }); });
  svg += '</svg>';
  return '<div class="hoja"><h1>Pinta los pedazos: ' + V.titulo + '</h1><p class="nombre">Nombre: ' + nombreNino5Txt() + ' ______________________</p>' +
    '<p>Cada vez que un pedazo te salga bien en el piano, pinta sus bloques con el color de cada nota. Cuando te salga bien <b>dos días distintos</b>, ya es tuyo: dibújale una estrella.' + (V.verificar ? ' <i>(Melodía por confirmar con papá.)</i>' : '') + '</p>' + svg + pieGuia5(4) + '</div>';
}
function planClase5() {
  const m = m2_(), K = m ? conocidas5().map(pc => NOMBRE_NOTA5(NOTA_PC5[pc])) : ['MI'], id = m ? (diaHoy5().cancion || cancionDelDia5()) : 'jingle', V = VILLANCICOS5[id];
  const dom = m ? Object.keys(m.dominio).filter(k => m.dominio[k].length >= 2).map(nombreClave5) : [];
  const cuesta = m ? Object.entries(m.stats || {}).filter(([k, v]) => v.fallidos > 0).sort((a, b) => b[1].fallidos / b[1].intentos - a[1].fallidos / a[1].intentos).slice(0, 3).map(([k]) => nombreClave5(k)) : [];
  const fila = (min, que, como) => '<tr><td style="width:16mm"><b>' + min + '</b></td><td style="width:44mm"><b>' + que + '</b></td><td>' + como + '</td></tr>';
  return '<div class="hoja"><h1>Plan de la clase del viernes · Belén</h1>' +
    '<p><b>Para:</b> ' + nombreNino5Txt() + ' · <b>Duración:</b> 40 minutos · <b>Materiales:</b> el piano, la tablet con Tic (' + plan5().bpm + ' por minuto), tarjetas de negra y blanca, las cuatro guías impresas, colores.</p>' +
    '<h2>Lo de la semana</h2><p>Día ' + plan5().dia + ' de la progresión: <b>' + plan5().nuevo + '</b>. Ritmos: ' + plan5().ritmos.map(r => NOMBRE_RITMO5[r]).join(', ') + '. Notas: <b>' + K.join(', ') + '</b> (un dedo por nota; la lectura del pentagrama ' + ['todavía no: solo bloques de color y sonido', 'empieza tenue, debajo de los bloques', 'ya va completa'][plan5().lectura] + '). Villancico: <b>' + V.titulo + '</b>.</p>' +
    '<table>' +
    fila('5 min', 'Saludo y pulso', 'Caminar por la sala al pulso de Tic (empezar lento, 56–60). Palma fuerte en el uno. Que el niño sea Tic: él marca el pulso con la mano y papá canta.') +
    fila('8 min', 'Ritmo con sílabas', 'Tarjetas de negra y blanca en el piso: pisar y decir «tan» o «taaan». Leer en voz alta la guía 1 (Colorea los ritmos) y colorearla. Sonido antes que símbolo: primero lo dice papá, luego aparece la tarjeta.') +
    fila('7 min', 'Canto y eco', 'Papá canta un motivo corto con ' + K.slice(0, 2).join(' y ') + ' y el niño responde cantando; después lo responde en el piano. Guía 2 (el pulso es un corazón) mientras papá canta el villancico.') +
    fila('12 min', 'Piano: el villancico', 'Notas faro: el DO del medio y ' + K[0] + '. ' + V.titulo + ' por pedazos: primero el ritmo en una tecla, luego la melodía si ya conoce las notas. Nunca más rápido que la canción: metrónomo a 56–60 y subir solo si sale limpio dos veces.') +
    fila('5 min', 'Inventar', 'Papá hace DO – LAm – FA – SOL en el piano (o la tablet en el Taller); el niño inventa con ' + K.slice(0, 3).join(', ') + '. Grabar un pedacito con el celular.') +
    fila('3 min', 'Cierre', 'Tocar lo aprendido para la familia (aplauso de los primos). Guía 4: pintar los pedazos que ya salen. Oración de gracias por la música.') +
    '</table>' +
    '<h2>Según la app esta semana</h2><p><b>Ya domina:</b> ' + (dom.length ? dom.join(', ') : 'todavía nada (se domina tocando bien en dos días distintos)') + '.</p><p><b>Reforzar:</b> ' + (cuesta.length ? cuesta.join('; ') : 'nada se le atascó') + '.</p>' +
    '<p><b>Consejo:</b> si aporrea, parar y decir «una nota a la vez»; si se frustra, volver a la escalera: espera → a su ritmo → a tempo.</p>' +
    '<div class="pie">Mi Piano · El viaje de Bach · plan de la clase del viernes</div></div>';
}
function imprimir5(html) { const d = document.getElementById('impresion'); d.innerHTML = html; setTimeout(() => { try { window.print(); } catch (e) { } }, 60); }
const GUIAS5 = [['Colorea los ritmos', hojaRitmos5], ['El pulso es un corazón', hojaCorazones5], ['Une la nota con su tecla', hojaUnir5], ['Pinta los pedazos del villancico', hojaPedazos5]];
