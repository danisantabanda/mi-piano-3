// =====================================================================
//  MANUAL DE MARCA «Mi Piano · El viaje de Bach» → marca/manual.html + marca/MANUAL-DE-MARCA.pdf (carta)
//  Uso: node marca/hacer-manual.js   (antes: python3 marca/hacer-logo.py y node marca/hacer-guias.js, que dan los logos y las muestras)
// =====================================================================
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const C = require('./comun.js'), { NOTAS, F, INK, spr, teclado, estrella, mano, pie } = C;
const AQUI = __dirname, GUIAS = path.join(AQUI, '..', 'GUIAS-BELEN.pdf');
// muestras de las guías (miniaturas) para la página de ejemplos
const MUESTRAS = [[4, 'muestra-ficha'], [6, 'muestra-penta'], [16, 'muestra-papa'], [18, 'muestra-recorte'], [20, 'muestra-diploma']];
if (fs.existsSync(GUIAS)) MUESTRAS.forEach(([p, n]) => execSync('pdftoppm -r 60 -png -singlefile -f ' + p + ' -l ' + p + ' "' + GUIAS + '" "' + path.join(AQUI, 'recursos', n) + '"'));
const muestra = (n, w) => fs.existsSync(path.join(AQUI, 'recursos', n + '.png')) ? '<img class="muestra" src="recursos/' + n + '.png" style="width:' + w + 'px">' : '';
const num = (n, t) => '<div class="m-num"><span class="chip" style="--c:' + NOTAS[(n - 1) % 7].c + '">' + String(n).padStart(2, '0') + '</span><span class="etiqueta">' + t + '</span></div>';
const P = [];
// 1 · portada
P.push('<section class="pagina m-portada"><div class="mp-franja">' + NOTAS.map(x => '<i style="background:' + x.c + '"></i>').join('') + '</div>' +
  '<div class="mp-logo">' + C.logo('logo-principal', 330) + '</div><h1 class="mp-tit">Manual de marca</h1><p class="mp-sub">Neobrutalismo amable para pequeños pianistas.<br>Logo, color, letras, muñecos, figuras musicales y reglas de página.</p>' +
  '<div class="mp-elenco">' + spr('bach', 220) + spr('tic', 140) + spr('sarah', 150) + spr('david', 150) + spr('sanson', 74) + '</div>' +
  '<div class="mp-pie"><span class="chip">v1 · noviembre 2026</span><span>Para las guías impresas, el panel de papá y todo lo que sale del juego.</span></div></section>');
// 2 · la idea
const principio = (n, t, x, demo) => '<div class="pr"><div class="pr-demo">' + demo + '</div><div><h3><span class="pr-n">' + n + '</span>' + t + '</h3><p>' + x + '</p></div></div>';
P.push('<section class="pagina">' + num(1, 'La idea') + '<h1 class="m-h1"><span class="marcador" style="--c:var(--mi)">Neobrutalismo amable</span></h1>' +
  '<p class="m-lead">Bordes de tinta y sombras duras, como un libro de stickers: se ve fuerte y claro desde lejos, se imprime limpio y no cansa. Amable porque todo es redondeado, hay mucho blanco y los muñecos sonríen.</p>' +
  '<div class="principios">' +
  principio(1, 'Bordes gruesos de tinta', 'Todo lo que se toca o se lee va con borde de tinta de 3 px (2,25 pt). Esquinas redondeadas de 14 px.', '<div class="d-caja"></div>') +
  principio(2, 'Sombras duras', 'Sombra de tinta desplazada 5 px abajo y a la derecha. Nunca desenfocada, nunca gris.', '<div class="d-caja sombra"></div>') +
  principio(3, 'Bloques planos', 'Colores lisos, sin degradados ni texturas. Un bloque de color detrás de una palabra la subraya.', '<div class="d-plano"><span class="marcador" style="--c:var(--sol)">taca</span></div>') +
  principio(4, 'Mucho blanco', 'Fondo blanco siempre. Márgenes de media pulgada. Una idea por caja.', '<div class="d-blanco"><i></i></div>') +
  principio(5, 'El color es de la música', 'Los siete colores son de las notas. Se usan en notas, muñecos y títulos; el resto es tinta sobre blanco. Así la impresora a color no se gasta.', '<div class="d-notas">' + NOTAS.map(x => '<i style="background:' + x.c + '"></i>').join('') + '</div>') +
  '</div><div class="caja voz"><span class="rotulo">Así hablamos</span><div class="voz-col"><p><b>Corto.</b> Una frase por instrucción. Español de Colombia, de tú.</p><p><b>Sonido antes que símbolo.</b> Tan, taaan, sh, taca, taaaaan. El nombre de la figura va después.</p><p><b>Animamos sin exagerar.</b> «¡Esa es!» solo cuando de verdad salió.</p><p><b>Nunca</b> «¿Recuerdas…?». Se dice lo que hay que hacer: «Toca MI con el dedo 3».</p></div>' + spr('bach-feliz', 96) + '</div>' +
  pie('Manual de marca', '1 · La idea') + '</section>');
// 3 · logo
P.push('<section class="pagina">' + num(2, 'Logo') + '<h1 class="m-h1"><span class="marcador" style="--c:var(--do)">El logo</span></h1>' +
  '<p class="m-lead">«Mi Piano» en Outfit Bold con la sombra de cada letra en el color de una nota (DO → SI), sobre un teclado de siete colores. La etiqueta de tinta dice el viaje. Las letras están convertidas a trazos: no dependen de la fuente.</p>' +
  '<div class="lg-grande"><div class="lg-respeto">' + C.logo('logo-principal', 236) + '</div><div class="lg-nota"><h3>Zona de respeto</h3><p>Alrededor del logo, libre el alto de la «i» de «Mi» (la línea punteada). Nada entra ahí.</p><h3>Tamaño mínimo</h3><p>Principal 45 mm · horizontal 35 mm · ícono 10 mm.</p></div></div>' +
  '<div class="lg-versiones"><div class="caja plana"><span class="rotulo">Horizontal</span>' + C.logo('logo-horizontal', 74) + '<p class="chico">Encabezados y pies de página.</p></div>' +
  '<div class="caja plana"><span class="rotulo">Ícono</span><div class="fila">' + C.logo('logo-icono', 84) + C.logo('logo-icono-mi', 84) + '</div><p class="chico">App, pestañas, sellos.</p></div>' +
  '<div class="caja plana"><span class="rotulo">Una tinta</span>' + C.logo('logo-tinta', 84) + '<p class="chico">Fotocopia, sello de caucho.</p></div></div>' +
  '<h2 class="m-h2">Así no</h2><div class="lg-no">' +
  [['transform:scaleX(1.45)', 'No se estira'], ['filter:hue-rotate(140deg)', 'No se cambian los colores'], ['filter:drop-shadow(0 6px 8px rgba(0,0,0,.5))', 'No lleva sombra borrosa'], ['transform:rotate(-14deg)', 'No se gira']].map(([st, t]) => '<div class="no"><div class="no-img"><img src="logo-principal.svg" style="height:58px;' + st + '"></div><svg class="x" viewBox="0 0 30 30" width="30" height="30"><circle cx="15" cy="15" r="13" fill="#ff5a5a" stroke="' + INK + '" stroke-width="3"/><path d="M10 10L20 20M20 10L10 20" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/></svg><p>' + t + '</p></div>').join('') + '</div>' +
  pie('Manual de marca', '2 · Logo') + '</section>');
// 4 · color
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(', ');
P.push('<section class="pagina">' + num(3, 'Color') + '<h1 class="m-h1"><span class="marcador" style="--c:var(--fa)">Los siete colores de las notas</span></h1>' +
  '<p class="m-lead">Son los mismos del juego (src/pixel.js). Cada nota tiene su color de bloque, un oscuro para letras o bordes finos y un claro para fondos suaves.</p>' +
  '<div class="paleta">' + NOTAS.map(x => '<div class="sw"><div class="sw-blq" style="background:' + x.c + '"><b>' + x.n + '</b>' + spr('nota-' + x.n, 38) + '</div><div class="sw-dat"><code>' + x.c.toUpperCase() + '</code><small>RGB ' + rgb(x.c) + '</small><div class="sw-var"><i style="background:' + x.o + '"></i><code>' + x.o.toUpperCase() + '</code></div><div class="sw-var"><i style="background:' + x.l + '"></i><code>' + x.l.toUpperCase() + '</code></div><small>' + x.color + '</small></div></div>').join('') + '</div>' +
  '<div class="base"><div class="sw ancho"><div class="sw-blq" style="background:' + INK + ';color:#fff"><b>Tinta</b></div><div class="sw-dat"><code>#2A1A3A</code><small>bordes, letras, sombras</small></div></div>' +
  '<div class="sw ancho"><div class="sw-blq" style="background:#fff"><b>Papel</b></div><div class="sw-dat"><code>#FFFFFF</code><small>fondo de todo lo impreso</small></div></div>' +
  '<div class="sw ancho"><div class="sw-blq" style="background:#fffaf4"><b>Crema</b></div><div class="sw-dat"><code>#FFFAF4</code><small>solo en pantalla</small></div></div>' +
  '<div class="sw ancho"><div class="sw-blq" style="background:#e9e4ee"><b>Gris</b></div><div class="sw-dat"><code>#E9E4EE</code><small>líneas suaves, casillas hechas</small></div></div></div>' +
  '<div class="reglas-color"><div class="caja"><span class="rotulo">Proporción en una hoja</span><div class="prop"><i style="flex:78;background:#fff"></i><i style="flex:14;background:' + INK + '"></i><i style="flex:8;background:linear-gradient(90deg,' + NOTAS.map(x => x.c).join(',') + ')"></i></div><p class="chico">≈ 78 % blanco · 14 % tinta · 8 % color de notas.</p></div>' +
  '<div class="caja"><span class="rotulo">Reglas</span><p>• El texto siempre en tinta. Sobre MI amarillo, letra de tinta; nunca letra amarilla.</p><p>• Un color = una nota. No se usa el rojo de DO para decir «error».</p><p>• Para colorear: figuras en contorno, sin relleno.</p></div></div>' +
  pie('Manual de marca', '3 · Color') + '</section>');
// 5 · letras
const muestraLetra = (fam, peso, nombre, uso, txt, tam) => '<div class="lt"><div class="lt-cab"><b>' + nombre + '</b><span class="chico">' + uso + '</span></div><div class="lt-txt" style="font-family:' + fam + ';font-weight:' + peso + ';font-size:' + tam + 'px">' + txt + '</div><div class="lt-abc" style="font-family:' + fam + ';font-weight:' + peso + '">AaBbCcÑñ 0123456789 ¡¿?!</div></div>';
P.push('<section class="pagina">' + num(4, 'Letras') + '<h1 class="m-h1"><span class="marcador" style="--c:var(--sol)">Cuatro letras, todas libres</span></h1>' +
  '<p class="m-lead">Todas con licencia SIL Open Font License 1.1 (en marca/fuentes con su licencia). Se pueden usar, incrustar y repartir sin pagar.</p>' +
  muestraLetra('Outfit', 700, 'Outfit Bold', 'títulos, botones, sílabas', 'Taca: dos notas en un pulso', 40) +
  muestraLetra('Outfit', 400, 'Outfit Regular', 'textos e instrucciones', 'Pinta cada figura con el color de su nota. Dilas en voz alta con Tic.', 19) +
  muestraLetra('Crimson', 700, 'Crimson Pro Bold', 'la voz de Bach y los versículos', '«El silencio también es música.»', 30) +
  muestraLetra('Pixelify', 400, 'Pixelify Sans', 'detalles de juego: contadores, rótulos del mundo', 'CORCHEAS ×37 · MISIÓN 3', 24) +
  '<h2 class="m-h2">Escala</h2><div class="escala">' + [['H1 · título de hoja', 'Outfit Bold 34–40 px', 38], ['H2 · título de caja', 'Outfit Bold 24 px', 24], ['H3 · subtítulo', 'Outfit Bold 17 px', 17], ['Texto', 'Outfit Regular 14 px', 14], ['Chico', 'Outfit Regular 11,5 px', 11.5]].map(([a, b, t]) => '<div><span style="font:' + (t > 15 ? 700 : 400) + ' ' + t + 'px Outfit">' + a + '</span><small>' + b + '</small></div>').join('') + '</div>' +
  pie('Manual de marca', '4 · Letras') + '</section>');
// 6 · muñecos
const ficha = (nombre, quien, poses, alto, txt, voz) => '<div class="mu"><div class="mu-poses">' + poses.map(([id, t]) => '<figure>' + spr(id, id.startsWith('sanson') ? alto * .45 : alto) + '<figcaption>' + t + '</figcaption></figure>').join('') + '</div><div class="mu-txt"><h2>' + nombre + '</h2><p class="chico">' + quien + '</p><p>' + txt + '</p>' + (voz ? '<div class="globo izq">' + voz + '</div>' : '') + '</div></div>';
P.push('<section class="pagina">' + num(5, 'Muñecos') + '<h1 class="m-h1"><span class="marcador" style="--c:var(--re)">Los muñecos</span></h1>' +
  '<p class="m-lead m-lead-c">Pixel art del juego (src/sprites.js, src/personajes.js), con contorno de tinta. Se agrandan solo en múltiplos enteros y sin suavizar.</p>' +
  ficha('Bach', 'el maestro · maestro de capilla', [['bach', 'elegante'], ['bach-feliz', 'feliz'], ['bach-sorpresa', 'sorpresa']], 92, 'Enseña lo nuevo en el Salón. Habla poco, con calma, y canta la nota.', '«Una nota nueva: SOL, con el dedo cinco.»') +
  ficha('Tic', 'el robot metrónomo', [['tic', 'late'], ['tic-izq', 'atento'], ['tic-canta', 'canta']], 82, 'Marca el pulso, siempre visible. Su péndulo late; vuela con propulsores. Habla con pitidos.', '') +
  ficha('Sarah', 'la pianista · 6 años', [['sarah', 'feliz'], ['sarah-luz', 'la luz'], ['sarah-sienta', 'sentada']], 82, 'Traje de viajera con la luz-cruz. Valiente y curiosa.', '') +
  ficha('David', 'el pianista · 4 años', [['david', 'feliz'], ['david-honda', 'la honda'], ['david-sienta', 'sentado']], 82, 'Traje de viajero con la honda. Alegre, todo lo toca.', '') +
  ficha('Sansón', 'el golden de la casa', [['sanson', 'echado'], ['sanson-lengua', 'contento'], ['sanson-duerme', 'dormido']], 120, 'El público. Mueve la cola cuando la música sale bien.', '') +
  pie('Manual de marca', '5 · Muñecos') + '</section>');
// 7 · figuras musicales
const fg = (t, s, n, p, alto) => '<div class="fg"><div class="fg-img">' + F.figura(t, { alto }) + '</div><b>' + s + '</b><span>' + n + '</span><small>' + p + '</small></div>';
P.push('<section class="pagina">' + num(6, 'Figuras musicales') + '<h1 class="m-h1"><span class="marcador" style="--c:var(--la)">Figuras claras, como de partitura</span></h1>' +
  '<p class="m-lead">Dibujo propio en vector (marca/figuras.js) con las medidas del grabado musical. No se dibujan a mano alzada ni se deforman.</p>' +
  '<div class="fgs">' + fg('clave', '', 'clave de sol', 'abre el pentagrama', 130) + fg('redonda', 'taaaaan', 'redonda', '4 pulsos', 26) + fg('blanca', 'taaan', 'blanca', '2 pulsos', 92) + fg('negra', 'tan', 'negra', '1 pulso', 92) + fg('corcheas', 'taca', 'corcheas', '2 en 1 pulso', 92) + fg('corchea', 'ta', 'corchea', 'medio pulso', 92) + fg('silencio', 'sh', 'silencio', '1 pulso callado', 62) + '</div>' +
  '<div class="fg-medidas"><div class="caja plana"><span class="rotulo">Medidas (1 = un espacio)</span>' +
  '<svg viewBox="-2.2 -4.4 8 5.6" width="250" height="160"><g stroke="#c9c2d3" stroke-width=".04">' + [-3, -2, -1, 0].map(y => '<path d="M-2.2 ' + (y + .5) + 'H5.8"/>').join('') + '</g>' + C.F.camino('negra', 0, .5, 1, 'fill="' + INK + '"') +
  '<g font-family="Outfit" font-size=".34" fill="' + INK + '"><path d="M1.0 -3.2V.3" stroke="#ff5a5a" stroke-width=".04"/><text x="1.15" y="-1.2">plica 3,5 · grosor 0,12</text><path d="M-.65 1.15H.65" stroke="#1e8bbd" stroke-width=".04"/><text x="-.3" y="1.5" font-size=".3">1,26</text><text x="1.15" y=".55">cabeza inclinada 20°</text></g></svg>' +
  '<p class="chico">Cabeza 1,26 × 1 · plica a la derecha (arriba) o a la izquierda (abajo) · barra de corcheas 0,5 · líneas 0,11.</p></div>' +
  '<div class="caja plana"><span class="rotulo">Para colorear</span><div class="fila">' + ['negra', 'blanca', 'corcheas', 'silencio'].map(t => F.figura(t, { alto: t === 'silencio' ? 62 : 92, contorno: true, grosor: .11 })).join('') + '</div><p class="chico">Contorno de tinta, cabeza en blanco. La plica y la barra siguen siendo de tinta.</p></div></div>' +
  '<h2 class="m-h2">En el pentagrama</h2><div class="caja plana penta-ej">' + F.pentagrama([{ n: 'DO', f: 'negra', c: NOTAS[0].c, nombre: 'DO' }, { n: 'RE', f: 'negra', c: NOTAS[1].c, nombre: 'RE' }, { n: 'MI', f: 'blanca', c: NOTAS[2].c, nombre: 'MI' }, { f: 'silencio', nombre: 'sh' }, { n: 'FA', f: 'corchea', c: NOTAS[3].c, nombre: 'FA' }, { n: 'SOL', f: 'redonda', c: NOTAS[4].c, nombre: 'SOL' }, { n: 'LA', f: 'blanca', c: NOTAS[5].c, nombre: 'LA' }, { n: 'SI', f: 'negra', c: NOTAS[6].c, nombre: 'SI' }], { k: 15, ancho: 640, fin: true }) + '<p class="chico">La cabeza lleva el color de su nota con borde de tinta; plicas, líneas y clave en tinta. Desde el SI la plica va hacia abajo.</p></div>' +
  pie('Manual de marca', '6 · Figuras') + '</section>');
// 8 · componentes y reglas de página
P.push('<section class="pagina">' + num(7, 'Piezas y página') + '<h1 class="m-h1"><span class="marcador" style="--c:var(--si)">Piezas que se repiten</span></h1>' +
  '<div class="cmp"><div class="cmp-i"><div class="caja" style="padding:20px 14px 10px"><span class="rotulo">Rótulo</span>Una caja: borde 3 px, radio 14, sombra 5.</div><small>caja con rótulo</small></div>' +
  '<div class="cmp-i"><div class="fila" style="gap:8px;flex-wrap:wrap"><span class="chip" style="--c:var(--mi)">MISIÓN 3</span><span class="etiqueta">Belén</span><span class="sticker" style="--c:var(--sol)">¡nuevo!</span></div><small>chip · etiqueta · sticker</small></div>' +
  '<div class="cmp-i"><div class="fila" style="gap:6px">' + NOTAS.slice(0, 4).map(x => '<span class="nota" style="--c:' + x.c + '">' + x.n + '</span>').join('') + '</div><small>nota (pastilla de color)</small></div>' +
  '<div class="cmp-i"><div class="globo izq" style="margin-left:12px">«Taca: dos notas en un solo pulso.»</div><small>globo de Bach (Crimson)</small></div>' +
  '<div class="cmp-i">' + teclado({ ancho: 200, alto: 80, colores: NOTAS.map((x, i) => i < 3 ? x.c : '#fff'), marcar: [2], sombra: 4 }) + '<small>teclado de una octava</small></div>' +
  '<div class="cmp-i"><div class="fila">' + estrella(64) + mano({ alto: 80, colores: { 1: NOTAS[0].c, 3: NOTAS[2].c } }) + '</div><small>estrella del día · mano (dedos 1–5)</small></div></div>' +
  '<h2 class="m-h2">Reglas de página (carta, vertical)</h2><div class="rp"><div class="rp-dib"><div class="rp-h"><span>encabezado · chip + título + muñeco</span></div><div class="rp-c">caja 1</div><div class="rp-c alto">caja 2 (la actividad)</div><div class="rp-c bajo">cierre</div><div class="rp-p">pie · logo horizontal + línea + página</div><span class="rp-m">0,5 in</span></div>' +
  '<div class="rp-txt"><p><b>Márgenes</b> 0,5 in arriba, 0,55 in a los lados, pie a 0,3 in.</p><p><b>Una columna</b> de cajas apiladas, separadas 20–24 px. Cada caja, una idea.</p><p><b>Encabezado:</b> chip de color de la misión, título con marcador, y un muñeco que habla.</p><p><b>Muñecos y detalles</b> por la página, sin tapar la actividad. Máximo tres por hoja.</p><p><b>Pie:</b> logo horizontal, nombre del cuaderno y número de página.</p><p><b>Recortables:</b> línea punteada gris, tijera, tarjetas del mismo tamaño.</p><p><b>Horizontal</b> solo para el diploma.</p></div></div>' +
  pie('Manual de marca', '7 · Piezas y página') + '</section>');
// 9 · ejemplos
P.push('<section class="pagina">' + num(8, 'Ejemplos') + '<h1 class="m-h1"><span class="marcador" style="--c:var(--mi)">Así se ve en papel</span></h1><p class="m-lead">Del Cuaderno de Belén (GUIAS-BELEN.pdf), hecho con este manual.</p>' +
  '<div class="ej">' + muestra('muestra-ficha', 220) + muestra('muestra-penta', 220) + muestra('muestra-papa', 220) + '</div><div class="ej">' + muestra('muestra-recorte', 220) + muestra('muestra-diploma', 440) + '</div>' +
  pie('Manual de marca', '8 · Ejemplos') + '</section>');
const CSS = `
.m-num{display:flex;gap:8px;align-items:center}.m-h1{font-size:36px;margin:14px 0 10px}.m-h2{font-size:22px;margin:22px 0 12px}.m-lead{font-size:15px;max-width:640px;margin-bottom:18px}
.m-portada{display:flex;flex-direction:column;align-items:center;text-align:center}.mp-franja{position:absolute;left:0;right:0;top:0;height:22px;display:flex;border-bottom:4px solid var(--tinta)}.mp-franja i{flex:1;border-right:3px solid var(--tinta)}.mp-franja i:last-child{border-right:0}
.mp-logo{margin-top:70px}.mp-tit{font-size:64px;margin:48px 0 10px}.mp-sub{font-size:18px}.mp-elenco{display:flex;gap:26px;align-items:flex-end;margin-top:56px}.mp-pie{position:absolute;bottom:.5in;display:flex;gap:14px;align-items:center;font-size:13px;color:var(--tinta2)}
.principios{display:flex;flex-direction:column;gap:14px}.pr{display:flex;gap:18px;align-items:center}.pr-demo{width:132px;height:74px;display:flex;align-items:center;justify-content:center;flex:none}.pr h3{font-size:18px;margin-bottom:3px}.pr p{margin:0;font-size:13.5px}
.pr-n{display:inline-block;width:24px;height:24px;border:2.5px solid var(--tinta);border-radius:50%;text-align:center;font-size:13px;line-height:19px;margin-right:8px}
.d-caja{width:100px;height:56px;border:3px solid var(--tinta);border-radius:14px}.d-caja.sombra{box-shadow:var(--sombra)}.d-plano{font:700 30px Outfit}.d-blanco{width:100px;height:62px;border:2px solid var(--gris);display:flex;align-items:center;justify-content:center}.d-blanco i{width:34px;height:20px;border:3px solid var(--tinta);border-radius:6px}
.d-notas{display:flex;gap:3px}.d-notas i{width:15px;height:44px;border:2.5px solid var(--tinta);border-radius:5px}
.voz{margin-top:30px;display:flex;gap:16px;align-items:flex-end;padding-top:22px}.voz-col{flex:1;columns:2;column-gap:22px}.voz-col p{font-size:13.5px;break-inside:avoid}
.lg-grande{display:flex;gap:30px;align-items:center}.lg-respeto{padding:22px;border:2px dashed var(--tinta2);border-radius:8px}.lg-nota h3{margin:4px 0}.lg-nota p{font-size:13px}
.lg-versiones{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:16px;margin-top:30px}.lg-versiones .caja{padding-top:24px;display:flex;flex-direction:column;align-items:flex-start;gap:8px}.lg-versiones .fila{gap:10px}
.lg-no{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.no{position:relative;text-align:center;font-size:12px}.no-img{height:96px;display:flex;align-items:center;justify-content:center;border:2px solid var(--gris);border-radius:10px;overflow:hidden}.no .x{position:absolute;top:-10px;right:-8px}.no p{margin-top:6px}
.paleta{display:grid;grid-template-columns:repeat(7,1fr);gap:9px}.sw{border:3px solid var(--tinta);border-radius:12px;overflow:hidden;box-shadow:var(--sombra-s)}.sw-blq{height:96px;display:flex;flex-direction:column;justify-content:space-between;padding:6px 8px;border-bottom:3px solid var(--tinta)}.sw-blq b{font-size:20px}.sw-blq img{align-self:flex-end}
.sw-dat{padding:6px 7px;display:flex;flex-direction:column;gap:3px}.sw-dat code{font:700 11.5px Outfit}.sw-dat small{font-size:9.5px;color:var(--tinta2)}.sw-var{display:flex;gap:4px;align-items:center}.sw-var i{width:13px;height:13px;border:2px solid var(--tinta);border-radius:4px}.sw-var code{font-weight:400;font-size:10px}
.base{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:18px}.sw.ancho .sw-blq{height:54px}
.reglas-color{display:grid;grid-template-columns:1fr 1.3fr;gap:18px;margin-top:26px}.reglas-color .caja{padding-top:24px}.reglas-color p{font-size:13px}.prop{display:flex;height:34px;border:3px solid var(--tinta);border-radius:10px;overflow:hidden;margin-bottom:6px}.prop i{border-right:3px solid var(--tinta)}.prop i:last-child{border:0}
.lt{border-bottom:2px solid var(--gris);padding:12px 0}.lt-cab{display:flex;gap:12px;align-items:baseline}.lt-cab b{font-size:14px}.lt-txt{margin:4px 0;line-height:1.15}.lt-abc{font-size:15px;color:var(--tinta2)}
.escala{display:flex;flex-direction:column;gap:8px}.escala div{display:flex;align-items:baseline;gap:16px}.escala small{color:var(--tinta2);font-size:11.5px}
.mu{display:flex;gap:18px;align-items:center;border-bottom:2px solid var(--gris);padding:8px 0}.mu-poses{display:flex;gap:14px;align-items:flex-end;width:380px;flex:none}.mu figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:3px}.mu figcaption{font-size:10.5px;color:var(--tinta2)}
.mu-txt h2{font-size:22px}.mu-txt p{font-size:13px;margin:2px 0 6px}.mu-txt .globo{font-size:13px;margin-left:12px}.m-lead-c{margin-bottom:4px}
.fgs{display:flex;justify-content:space-between;align-items:flex-end;border:3px solid var(--tinta);border-radius:14px;box-shadow:var(--sombra);padding:16px 18px 12px}.fg{display:flex;flex-direction:column;align-items:center;gap:1px}.fg-img{height:132px;display:flex;align-items:flex-end}.fg b{font-size:18px;margin-top:6px;min-height:22px}.fg span{font-size:12.5px}.fg small{font-size:10.5px;color:var(--tinta2)}
.fg-medidas{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:22px}.fg-medidas .caja{padding-top:22px}.fg-medidas .fila{gap:18px;align-items:flex-end;height:110px}
.penta-ej{padding:10px 16px}
.cmp{display:grid;grid-template-columns:repeat(3,1fr);gap:24px 20px;margin-top:8px}.cmp-i{display:flex;flex-direction:column;gap:8px;justify-content:flex-end}.cmp-i small{font-size:11px;color:var(--tinta2)}.cmp-i .caja{font-size:12.5px}
.rp{display:flex;gap:26px}.rp-dib{position:relative;width:250px;height:324px;border:3px solid var(--tinta);border-radius:6px;padding:16px 17px;display:flex;flex-direction:column;gap:8px;flex:none;font-size:10px;color:var(--tinta2)}
.rp-h{height:42px;border:2px dashed var(--tinta2);border-radius:6px;padding:4px}.rp-c{height:52px;border:2.5px solid var(--tinta);border-radius:8px;box-shadow:3px 3px 0 var(--tinta);padding:4px}.rp-c.alto{height:104px}.rp-c.bajo{height:34px}.rp-p{margin-top:auto;border-top:2px solid var(--tinta);padding-top:3px}
.rp-m{position:absolute;top:-1px;left:30px;font-size:9px;background:#fff;padding:0 3px}.rp-txt p{font-size:13px;margin-bottom:7px}
.ej{display:flex;gap:18px;justify-content:center;margin-bottom:18px;align-items:flex-start}.muestra{border:3px solid var(--tinta);border-radius:6px;box-shadow:var(--sombra)}
`;
const html = C.documento('Manual de marca · Mi Piano', P).replace('</head>', '<style>' + CSS + '</style></head>');
const HTML = path.join(AQUI, 'manual.html'), PDF = path.join(AQUI, 'MANUAL-DE-MARCA.pdf');
fs.writeFileSync(HTML, html);
C.aPDF(HTML, PDF).then(() => console.log('MANUAL-DE-MARCA.pdf', P.length, 'páginas'));
