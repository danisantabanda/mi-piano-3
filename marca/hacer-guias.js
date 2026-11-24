// =====================================================================
//  GUÍAS DE BELÉN con el manual de marca: portada, una ficha por misión (las 14 de src/progresion.js),
//  hoja de papá (2 semanas), recortables (notas y figuras) y el diploma de Belén firmado por Bach.
//  Uso: node marca/hacer-guias.js   → marca/guias.html + GUIAS-BELEN.pdf (en la raíz del proyecto)
//  Todo sale de src/progresion.js: si cambia la progresión, se vuelve a correr y las fichas se ajustan solas.
// =====================================================================
const fs = require('fs'), path = require('path'), vm = require('vm');
const C = require('./comun.js'), { NOTAS, NOTA_PC, F, INK, spr, teclado, estrella, mano, pie } = C;
const RAIZ = path.join(__dirname, '..');
// ---------- datos de la progresión (los mismos del juego) ----------
const ctx = { console, GUARDA: { d: { perfil: 'sarah' } }, module: {} }; vm.createContext(ctx);
['progresion.js', 'villancicos.js'].forEach(f => vm.runInContext(fs.readFileSync(path.join(RAIZ, 'src', f), 'utf8').replace(/^const /gm, 'var ').replace(/^let /gm, 'var '), ctx));
const PLAN = ctx.PLAN_BELEN5, plan = d => ctx.planDia5(d), V = ctx.VILLANCICOS5;
const N = PLAN.length;
const FIGURA = { tan: 'negra', taaan: 'blanca', sh: 'silencio', taca: 'corcheas', taaaaan: 'redonda' };
const NOMBRE_FIG = { tan: 'negra', taaan: 'blanca', sh: 'silencio', taca: 'corcheas', taaaaan: 'redonda' };
const PULSOS = { tan: '1 pulso', taaan: '2 pulsos', sh: '1 pulso callado', taca: '2 notas en 1 pulso', taaaaan: '4 pulsos' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const mayus = s => s.charAt(0).toUpperCase() + s.slice(1);
// lo nuevo de cada misión (comparado con la anterior)
function nuevo(d) { const P = plan(d), A = d ? plan(d - 1) : { notas: [], ritmos: [], lectura: 0 }; return { notas: P.notas.filter(n => !A.notas.includes(n)), ritmos: P.ritmos.filter(r => !A.ritmos.includes(r)), lectura: P.lectura > A.lectura }; }
function colorMision(d) { const P = plan(d), nv = nuevo(d), pc = nv.notas.length ? nv.notas[nv.notas.length - 1] : P.notas[P.notas.length - 1]; return NOTA_PC[pc]; }
const DUELO = d => d === 6 || d === 13;
// ---------- piezas de la ficha ----------
function chipNota(pc, o = {}) { const x = NOTA_PC[pc]; return '<span class="nota" style="--c:' + (o.vacia ? '#fff' : x.c) + '">' + x.n + '</span>'; }
function figRitmo(r, alto, o = {}) { return F.figura(FIGURA[r], Object.assign({ alto }, o)); }
// fila de ritmo para colorear: un patrón de 8 pulsos; el ancho de cada figura es su duración
function filaRitmo(notas, ancho, conNombre) {
  const fichas = []; for (let i = 0; i < notas.length; i++) { const x = notas[i];
    if (x.d === .5 && notas[i + 1] && notas[i + 1].d === .5) { fichas.push({ r: 'taca', d: 1, n: [x.n, notas[i + 1].n] }); i++; continue; }
    fichas.push({ r: x.n === 0 ? 'sh' : x.d === 1 ? 'tan' : x.d === 2 ? 'taaan' : x.d === 4 ? 'taaaaan' : 'tan', d: x.d, n: [x.n] }); }
  const total = fichas.reduce((s, f) => s + f.d, 0), pp = ancho / total;
  let h = '<div class="ritmo" style="width:' + ancho + 'px">';
  fichas.forEach(f => {
    const nom = f.n.map(n => n ? NOTA_PC[n % 12].n : '').filter(Boolean);
    h += '<div class="rt" style="width:' + (f.d * pp) + 'px"><div class="rt-fig">' + F.figura(FIGURA[f.r], { alto: f.r === 'taaaaan' ? 32 : f.r === 'sh' ? 68 : 86, contorno: true, grosor: .11 }) + '</div>' +
      '<div class="rt-sil">' + f.r + '</div>' + (conNombre && nom.length ? '<div class="rt-nom">' + nom.map(n => '<span>' + n + '</span>').join('') + '</div>' : '') +
      '<div class="rt-pul">' + '<i></i>'.repeat(Math.max(1, Math.round(f.d))) + '</div></div>';
  });
  return h + '</div>';
}
const PERSONAJES = ['tic', 'sarah', 'david', 'sanson-lengua', 'tic-canta', 'sarah-luz', 'david-honda'];
function fichaMision(d) {
  const P = plan(d), nv = nuevo(d), col = colorMision(d), cancion = V[P.cancion] ? V[P.cancion].titulo : '';
  const titulo = mayus(P.nuevo.replace(/^los bloques viven/, 'los bloques viven'));
  const tituloH = titulo.replace(/^([^:,(]+)/, (m) => '<span class="marcador">' + m.trim() + '</span>' + (m.endsWith(' ') ? ' ' : ''));
  // lo que aprendí
  const notasH = P.notas.slice().sort((a, b) => a - b).map(pc => '<div class="nt' + (nv.notas.includes(pc) ? ' nueva' : '') + '">' + chipNota(pc) + (NOTA_PC[pc].dedo ? '<small>dedo ' + NOTA_PC[pc].dedo + '</small>' : '<small>&nbsp;</small>') + '</div>').join('');
  const ritmosH = P.ritmos.map(r => '<div class="rf' + (nv.ritmos.includes(r) ? ' nueva' : '') + '"><div class="rf-fig">' + figRitmo(r, r === 'taaaaan' ? 22 : r === 'sh' ? 50 : 62) + '</div><b>' + r + '</b><small>' + NOMBRE_FIG[r] + '</small>' + (nv.ritmos.includes(r) ? '<span class="sticker" style="--c:' + col.c + '">¡nuevo!</span>' : '') + '</div>').join('');
  const lectura = ['Sin pentagrama: bloques de color y sonido.', 'El pentagrama aparece tenue, debajo de los bloques.', 'Ya se lee el pentagrama.'][P.lectura];
  const aprendi = '<div class="caja aprendi"><span class="rotulo" style="--c:' + INK + '">Lo que aprendí</span>' +
    '<div class="ap-fila"><div class="ap-notas"><h3>Mis notas</h3><div class="nts">' + notasH + '</div>' +
    teclado({ ancho: 236, alto: 96, colores: NOTAS.map(x => P.notas.includes(x.pc) ? x.c : '#fff'), marcar: nv.notas.map(pc => NOTA_PC[pc].i), sombra: 4 }) + '</div>' +
    '<div class="ap-ritmos"><h3>Mis ritmos</h3><div class="rfs">' + ritmosH + '</div></div></div>' +
    '<div class="ap-pie"><span class="chip" style="--c:#fff">' + spr('tic-centro', 26) + 'Tic late a ' + P.bpm + '</span><span class="chip" style="--c:#fff">♪ ' + esc(cancion) + '</span><span class="chico">' + lectura + '</span></div></div>';
  // para colorear
  const actividad = colorear(d, P, nv, col);
  // estrella del día
  const quien = PERSONAJES[d % PERSONAJES.length];
  const estrellaDia = '<div class="estrella-dia"><div class="ed-grande">' + estrella(84, { grosor: 4 }) + '<div><h2>La estrella del día</h2><p>Termina la misión en la tablet<br>y pinta tu estrella.</p></div></div>' +
    '<div class="ed-tres"><p><b>¿Cuántas te dio Tic?</b></p><div class="fila">' + [1, 2, 3].map(() => estrella(40, { sombra: 3, grosor: 3 })).join('') + '</div></div>' +
    '<div class="ed-papa"><p>Minutos: <span class="raya"></span></p><p>Firma de papá: <span class="raya larga"></span></p></div></div>';
  const progreso = '<div class="progreso">' + PLAN.map((x, i) => '<span' + (i === d ? ' class="aqui" style="--c:' + col.c + '"' : i < d ? ' class="hecha"' : '') + '>' + (i + 1) + '</span>').join('') + '</div>';
  return '<section class="pagina ficha" style="--c:' + col.c + ';--cl:' + col.l + '">' +
    '<header class="f-cab"><div class="f-tit"><div class="fila"><span class="chip" style="--c:' + col.c + '">MISIÓN ' + (d + 1) + '</span><span class="etiqueta">Belén</span>' + (DUELO(d) ? '<span class="chip" style="--c:#fff">⚔ Duelo en el Conservatorio</span>' : '') + '</div>' +
    '<h1>' + tituloH + '</h1><p class="nombre">Nombre <span class="raya larga"></span> Fecha <span class="raya"></span></p></div>' +
    '<div class="f-bach"><div class="globo der">' + esc(ctx.DICE_SALON5[d]) + '</div>' + spr('bach', 136) + '</div></header>' +
    aprendi + actividad +
    '<div class="f-bajo">' + estrellaDia + '<div class="f-muneco">' + spr(quien, quien.startsWith('sanson') ? 62 : 104) + '</div></div>' +
    progreso + pie('Cuaderno de Belén', 'Misión ' + (d + 1) + ' de ' + N) + '</section>';
}
// la actividad para colorear de cada misión (según lo nuevo)
function colorear(d, P, nv, col) {
  const caja = (titulo, instr, cuerpo, extra = '') => '<div class="caja colorear"><span class="rotulo" style="--c:' + col.c + ';--tc:' + INK + '">Para colorear</span><div class="co-cab"><h2>' + titulo + '</h2><p>' + instr + '</p></div>' + cuerpo + extra + '</div>';
  const leyenda = '<div class="leyenda">' + P.notas.slice().sort((a, b) => a - b).map(pc => '<span><i style="background:' + NOTA_PC[pc].c + '"></i>' + NOTA_PC[pc].n + ' = ' + NOTA_PC[pc].color + '</span>').join('') + '</div>';
  const pats = ctx.patronesDia5(d, 6, 3 + d);
  if (d === N - 1) {   // repaso final: la escalera de las siete notas
    const notas = NOTAS.map(x => ({ n: x.n, f: 'negra', c: '#fff', nombre: x.n }));
    return caja('La escalera de las siete', 'Pinta cada nota con su color. Luego tócalas subiendo: DO, RE, MI, FA, SOL, LA, SI.', '<div class="co-centro">' + F.pentagrama(notas, { k: 22, ancho: 660, borde: .12, fin: true }) + '</div>', leyenda);
  }
  if (nv.notas.length && !nv.ritmos.length) {   // nota nueva: la tecla y el dedo
    const pc = nv.notas[nv.notas.length - 1], x = NOTA_PC[pc];
    const cuerpo = '<div class="co-dos">' + teclado({ ancho: 430, alto: 168, nombres: true, dedos: true, marcar: [x.i], sombra: 6, grosor: 3.5 }) +
      (x.dedo ? '<div class="co-mano">' + mano({ alto: 172 }) + '<p class="chico">Pinta el dedo ' + x.dedo + ' de ' + x.color + '.</p></div>' : '<div class="co-mano">' + F.pentagrama([{ n: x.n, f: 'redonda', c: '#fff', nombre: x.n }], { k: 18, ancho: 180, borde: .12 }) + '<p class="chico">' + x.n + ' en el pentagrama: píntala.</p></div>') + '</div>';
    return caja('Pinta la tecla de ' + x.n, 'Pinta cada tecla que ya conoces con su color. La de la estrella es la nueva: ' + x.n + ', ' + x.color + '.', cuerpo, leyenda);
  }
  if (nv.lectura || (P.lectura >= 1 && !nv.ritmos.length)) {   // el pentagrama
    const pat = pats[1].filter(x => x.n).slice(0, 8);
    const notas = pat.map(x => ({ n: NOTA_PC[x.n % 12].n, f: x.d === 2 ? 'blanca' : x.d === 4 ? 'redonda' : 'negra', c: '#fff', nombre: NOTA_PC[x.n % 12].n }));
    return caja('Las notas viven en el pentagrama', P.lectura === 1 ? 'Cada nota tiene su casa: una línea o un espacio. Píntalas con su color.' : 'Lee cada nota, di su nombre y píntala con su color.', '<div class="co-centro">' + F.pentagrama(notas, { k: 22, ancho: 660, borde: .12, fin: true }) + '</div>', leyenda);
  }
  // ritmo: dos patrones del día, figuras para colorear, con su sílaba y sus pulsos
  const nuevoR = nv.ritmos[nv.ritmos.length - 1] || P.ritmos[P.ritmos.length - 1];
  const una = P.notas.length === 1;
  const instr = una ? 'Pinta las figuras de ' + NOTA_PC[P.notas[0]].color + ' (' + NOTA_PC[P.notas[0]].n + '). Dilas en voz alta con Tic.' : 'Pinta cada figura con el color de su nota. Dilas en voz alta con Tic.';
  const silencio = P.ritmos.includes('sh') ? ' El silencio no se pinta: dedo en la boca, «sh».' : '';
  const elegidos = [pats[0], pats.find(p => ctx.ritmoDe5(p).includes(nuevoR) && p !== pats[0]) || pats[2]];
  return caja('Colorea el ritmo', instr + silencio, '<div class="co-ritmos">' + elegidos.map(p => filaRitmo(p, 690, !una)).join('') + '</div>', una ? '' : leyenda);
}
// ---------- portada del cuaderno ----------
function portada() {
  return '<section class="pagina portada"><div class="po-logo">' + C.logo('logo-principal', 300) + '</div>' +
    '<h1 class="po-tit"><span class="marcador" style="--c:var(--sol)">Cuaderno de Belén</span></h1><p class="po-sub">' + N + ' misiones para despertar Belén antes de Nochebuena.</p>' +
    '<div class="caja po-nombre"><span class="rotulo">Este cuaderno es de</span><span class="raya enorme"></span></div>' +
    '<div class="po-elenco">' + spr('bach', 230) + spr('tic', 150) + spr('sarah', 160) + spr('david', 160) + spr('sanson', 78) + '</div>' +
    '<div class="po-notas">' + NOTAS.map(x => spr('nota-' + x.n, 46)).join('') + '</div>' +
    '<p class="po-como chico">Una ficha por misión: lo que aprendió, algo para colorear y la estrella del día. Al final: hoja de papá, recortables y el diploma.</p>' +
    pie('Cuaderno de Belén', 'Mi Piano · El viaje de Bach') + '</section>';
}
// ---------- hoja semanal de papá ----------
function hojaPapa(sem) {
  const ds = [...Array(7)].map((_, i) => sem * 7 + i).filter(d => d < N);
  const filas = ds.map(d => { const P = plan(d), col = colorMision(d), nv = nuevo(d);
    return '<tr><td><span class="chip mini" style="--c:' + col.c + '">' + (d + 1) + '</span></td><td><b>' + esc(mayus(P.nuevo)) + '</b>' + (DUELO(d) ? '<br><span class="chico">⚔ duelo del Conservatorio</span>' : '') + '</td>' +
      '<td class="tn">' + P.notas.slice().sort((a, b) => a - b).map(pc => '<i style="background:' + NOTA_PC[pc].c + '"' + (nv.notas.includes(pc) ? ' class="nv"' : '') + '>' + NOTA_PC[pc].n + '</i>').join('') + '</td>' +
      '<td class="tr">' + P.ritmos.map(r => figRitmo(r, r === 'taaaaan' ? 9 : r === 'sh' ? 20 : 24)).join('') + '</td><td>' + P.bpm + '</td><td class="chico">' + esc(V[P.cancion] ? V[P.cancion].titulo : '') + '</td>' +
      '<td><span class="caja-check"></span></td><td class="es">' + [0, 1, 2].map(() => C.estrellaPath ? '<svg width="15" height="15" viewBox="0 0 18 18">' + C.estrellaPath(9, 9.5, 8, '#fff', 1.8) + '</svg>' : '').join('') + '</td><td><span class="raya"></span></td></tr>'; }).join('');
  const bloques = [['5', 'Saludo y pulso', 'Caminar al pulso de Tic. Palma fuerte en el uno.'], ['8', 'Ritmo con sílabas', 'Tarjetas en el piso: pisar y decir tan, taaan, sh, taca.'], ['7', 'Canto y eco', 'Papá canta, el niño responde cantando y luego en el piano.'], ['12', 'Piano', 'El villancico por pedazos: ritmo en una tecla, después la melodía.'], ['5', 'Inventar', 'Papá hace DO – LAm – FA – SOL; el niño inventa encima.'], ['3', 'Cierre', 'Tocar para la familia. Oración de gracias por la música.']];
  return '<section class="pagina papa"><header class="pp-cab"><div><span class="etiqueta">Para papá</span><h1><span class="marcador" style="--c:var(--la)">Semana ' + (sem + 1) + '</span> · misiones ' + (ds[0] + 1) + ' a ' + (ds[ds.length - 1] + 1) + '</h1><p>Martes a jueves la app enseña; el viernes, la clase con papá. Una misión por sesión, sin afán: si una cuesta, se repite.</p></div>' + spr('bach-feliz', 104) + '</header>' +
    '<table class="pp-tabla"><thead><tr><th style="width:36px">#</th><th style="width:158px">Lo nuevo</th><th style="width:112px">Notas</th><th style="width:96px">Ritmos</th><th style="width:48px">Tempo</th><th style="width:84px">Canción</th><th style="width:44px">Hecha</th><th style="width:62px">Estrellas</th><th>Notas de papá</th></tr></thead><tbody>' + filas + '</tbody></table>' +
    '<h2 class="pp-h2">La clase del viernes · 40 minutos</h2><div class="pp-clase">' + bloques.map(([m, t, x], i) => '<div class="caja plana"><span class="min" style="--c:' + NOTAS[i].c + '">' + m + "'</span><h3>" + t + '</h3><p>' + x + '</p></div>').join('') + '</div>' +
    '<div class="pp-bajo"><div class="caja"><span class="rotulo">Si pasa esto…</span><p><b>Aporrea:</b> parar y decir «una nota a la vez».</p><p><b>Se frustra:</b> bajar la escalera: Tic espera → a su ritmo → a tempo.</p><p><b>Lo logra:</b> que lo toque para la familia. El aplauso cuenta.</p><p><b>Nunca</b> más rápido que la canción.</p></div>' +
    '<div class="caja"><span class="rotulo" style="--c:var(--fa);--tc:var(--tinta)">Lo que vi esta semana</span><div class="lineas">' + '<span class="raya total"></span>'.repeat(3) + '</div></div>' + spr('tic-canta', 96, 'align-self:flex-end') + '</div>' +
    pie('Hoja de papá', 'Semana ' + (sem + 1) + ' de 2') + '</section>';
}
// ---------- recortables ----------
function tarjetasNotas() {
  const t = NOTAS.map(x => '<div class="tj corte"><div class="tj-cab" style="background:' + x.c + '"><b>' + x.n + '</b>' + spr('nota-' + x.n, 40) + '</div><div class="tj-cuerpo">' +
    F.pentagrama([{ n: x.n, f: 'redonda', c: x.c }], { k: 11, ancho: 150, arriba: 1.6, abajo: 1.8, borde: .1 }) + teclado({ ancho: 150, alto: 56, colores: NOTAS.map(y => y.n === x.n ? x.c : '#fff'), sombra: 0, grosor: 2.5 }) +
    '</div><div class="tj-pie">' + (x.dedo ? 'dedo ' + x.dedo : 'la mano se estira') + ' · ' + x.color + '</div></div>').join('') +
    '<div class="tj corte comodin"><div class="tj-cab" style="background:#fff"><b>¡Tic!</b></div><div class="tj-cuerpo">' + spr('tic', 92) + '</div><div class="tj-pie">comodín: toca la nota que quieras</div></div>';
  return '<section class="pagina recorte"><header class="rc-cab"><div><span class="etiqueta">Recortables</span><h1><span class="marcador" style="--c:var(--re)">Tarjetas de notas</span></h1><p>Recorta por la línea punteada. Juego: papá saca una tarjeta y el niño la busca en el piano. Si la toca bien, se la gana.</p></div>' + spr('sarah-luz', 100) + '</header><div class="rejilla r4">' + t + '</div><p class="tijera">✂ - - - recorta por la línea - - -</p>' + pie('Recortables', 'Tarjetas de notas') + '</section>';
}
function tarjetasFiguras() {
  const L = [['tan', 'negra', 1], ['tan', 'negra', 1], ['taaan', 'blanca', 2], ['taaan', 'blanca', 2], ['taca', 'corcheas', 1], ['taca', 'corcheas', 1], ['sh', 'silencio', 1], ['sh', 'silencio', 1], ['taaaaan', 'redonda', 4]];
  const t = L.map(([s, n, p]) => '<div class="tj corte fg"><div class="fg-fig">' + figRitmo(s, s === 'taaaaan' ? 40 : s === 'sh' ? 90 : 116) + '</div><div class="fg-sil">' + s + '</div><div class="fg-nom">' + n + '</div><div class="fg-pul">' + '<i></i>'.repeat(p) + '</div></div>').join('') +
    '<div class="tj corte fg comodin"><div class="fg-fig">' + spr('tic-canta', 96) + '</div><div class="fg-sil">¡pulso!</div><div class="fg-nom">Tic marca el pulso</div></div>';
  return '<section class="pagina recorte"><header class="rc-cab"><div><span class="etiqueta">Recortables</span><h1><span class="marcador" style="--c:var(--fa)">Tarjetas de figuras</span></h1><p>Pongan 4 tarjetas en fila: eso es un compás. Lean juntos en voz alta y luego tóquenlo en una tecla. Los puntos son los pulsos.</p></div>' + spr('david-honda', 100) + '</header><div class="rejilla r5">' + t + '</div><p class="tijera">✂ - - - recorta por la línea - - -</p>' + pie('Recortables', 'Tarjetas de figuras') + '</section>';
}
// ---------- diploma (horizontal) ----------
function firmaBach() {   // firma a pulso: «J. S. Bach» en letra serif inclinada + rúbrica caligráfica
  const rub = F.trazo([[10, 72, 1], [60, 80, 3], [150, 78, 4], [230, 66, 3], [262, 52, 2], [240, 46, 2], [200, 62, 3], [150, 86, 3], [96, 92, 1.5]]);
  return '<svg class="firma" viewBox="0 0 280 100" width="280" height="100"><text x="18" y="58" font-family="Crimson" font-weight="700" font-size="50" fill="' + INK + '" transform="skewX(-14) translate(14 0)">J. S. Bach</text><path d="' + rub + '" fill="' + INK + '"/></svg>';
}
function diploma(quien) {
  const nom = quien === 'sarah' ? 'Sarah' : 'David';
  return '<section class="pagina horizontal diploma"><div class="dp-marco">' +
    '<div class="dp-notas">' + NOTAS.map(x => '<i style="background:' + x.c + '"></i>').join('') + '</div>' +
    '<div class="dp-cab">' + C.logo('logo-horizontal', 64) + '<span class="etiqueta">Belén · diciembre</span></div>' +
    '<h1 class="dp-tit"><span class="marcador" style="--c:var(--mi)">Diploma de Belén</span></h1>' +
    '<p class="dp-txt">Bach y Tic entregan este diploma a</p><div class="dp-nombre">' + nom + '</div>' +
    '<p class="dp-txt">por despertar los rincones de Belén, una misión a la vez,<br>y tocar en el concierto del pesebre.</p>' +
    '<p class="dp-verso serif">«Cantad alegres a Dios, habitantes de toda la tierra.» <span>Salmo 100:1 (RV1960)</span></p>' +
    '<div class="dp-firmas"><div class="dp-f">' + firmaBach() + '<span class="raya total"></span><small>Johann Sebastian Bach · maestro de capilla</small></div>' +
    '<div class="dp-sello"><svg viewBox="0 0 130 130" width="124" height="124"><circle cx="68" cy="68" r="56" fill="' + INK + '"/><circle cx="62" cy="62" r="56" fill="#ff5a5a" stroke="' + INK + '" stroke-width="4"/><circle cx="62" cy="62" r="42" fill="none" stroke="' + INK + '" stroke-width="2.5" stroke-dasharray="4 5"/>' + C.estrellaPath(62, 64, 30, '#ffd046', 3.5) + '</svg></div>' +
    '<div class="dp-f"><span class="raya total" style="margin-top:62px"></span><small>Papá · Fecha</small></div></div>' +
    '<div class="dp-elenco">' + spr('bach-feliz', 120) + spr(quien === 'sarah' ? 'sarah' : 'david', 130) + spr('tic', 104) + '</div>' + spr('sanson-lengua', 60, 'position:absolute;left:46px;bottom:40px') +
    '</div></section>';
}
// ---------- estilos propios de las guías ----------
const CSS = `
.raya{display:inline-block;width:90px;border-bottom:2px solid var(--tinta);height:1em;vertical-align:baseline}.raya.larga{width:220px}.raya.enorme{display:block;width:100%;height:40px}.raya.total{display:block;width:100%;height:28px}
.ficha .f-cab{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;height:150px}
.ficha .f-tit{flex:1;padding-top:4px}.ficha .f-tit h1{margin:12px 0 10px;font-size:34px;max-width:480px}.ficha .nombre{font-size:14px;margin-top:4px}
.ficha .f-bach{display:flex;align-items:flex-end;gap:14px;margin-top:-6px}.ficha .f-bach .globo{max-width:178px;margin-bottom:50px;font-size:15.5px}
.aprendi{margin-top:12px;padding:20px 18px 12px}.ap-fila{display:flex;gap:22px}.ap-notas{width:262px}.ap-ritmos{flex:1}
.aprendi h3{font-size:13px;letter-spacing:1px;text-transform:uppercase;color:var(--tinta2);margin:0 0 8px}
.nts{display:flex;flex-wrap:wrap;gap:6px 8px;margin-bottom:10px}.nt{display:flex;flex-direction:column;align-items:center;gap:1px;position:relative}.nt small{font-size:10.5px;color:var(--tinta2)}
.nt.nueva .nota{box-shadow:var(--sombra-s);transform:rotate(-3deg)}
.rfs{display:flex;flex-wrap:wrap;gap:8px 10px;align-items:flex-end}.rf{position:relative;display:flex;flex-direction:column;align-items:center;width:78px;padding:6px 2px 6px;border:2px solid var(--gris);border-radius:12px}
.rf.nueva{border:var(--borde) solid var(--tinta);box-shadow:var(--sombra-s);background:var(--cl)}.rf-fig{height:66px;display:flex;align-items:flex-end}.rf b{font-size:17px;margin-top:4px}.rf small{font-size:10.5px;color:var(--tinta2)}
.rf .sticker{position:absolute;top:-14px;right:-14px;font-size:10px;padding:2px 6px}
.ap-pie{display:flex;gap:10px;align-items:center;margin-top:10px;flex-wrap:wrap}.ap-pie .chip{font-size:13px;padding:2px 10px 3px 4px;box-shadow:none;border-width:2px}.ap-pie .chip img{margin:-2px 0}.ap-pie .chico{flex:1;text-align:right}
.colorear{margin-top:22px;padding:22px 18px 12px;height:336px;display:flex;flex-direction:column}
.co-cab{display:flex;align-items:baseline;gap:14px;margin-bottom:6px}.co-cab h2{white-space:nowrap}.co-cab p{margin:0;font-size:14px}
.co-ritmos{flex:1;display:flex;flex-direction:column;justify-content:space-around;align-items:center}
.ritmo{display:flex;align-items:flex-end;border-bottom:0}.rt{display:flex;flex-direction:column;align-items:center}.rt-fig{height:88px;display:flex;align-items:flex-end;justify-content:center}
.rt-sil{font:700 17px Outfit;margin-top:4px}.rt-nom{display:flex;gap:14px;font:700 11px Outfit}.rt-nom span{border:2px solid var(--tinta);border-radius:99px;padding:0 6px;min-width:30px;text-align:center}
.rt-pul{display:flex;gap:4px;margin-top:4px;width:100%;justify-content:space-around;border-top:2px solid var(--tinta);padding-top:5px}.rt-pul i{width:9px;height:9px;border-radius:50%;background:var(--tinta);display:block}
.co-centro{flex:1;display:flex;align-items:center;justify-content:center}
.co-dos{flex:1;display:flex;align-items:center;justify-content:space-around}.co-mano{display:flex;flex-direction:column;align-items:center;gap:4px}
.leyenda{display:flex;flex-wrap:wrap;gap:6px 14px;justify-content:center;font-size:12.5px}.leyenda span{display:inline-flex;align-items:center;gap:5px}.leyenda i{width:16px;height:16px;border:2px solid var(--tinta);border-radius:50%;display:inline-block}
.f-bajo{display:flex;align-items:flex-end;gap:10px;margin-top:20px}
.estrella-dia{flex:1;display:flex;align-items:center;gap:16px;border:var(--borde) solid var(--tinta);border-radius:var(--radio);padding:6px 14px;box-shadow:var(--sombra)}
.ed-grande{display:flex;align-items:center;gap:10px;width:290px}.ed-grande h2{font-size:20px;margin-bottom:4px}.ed-grande p{font-size:12.5px;margin:0}
.ed-tres p{font-size:12.5px;margin-bottom:4px}.ed-tres .fila{gap:4px}.ed-papa{flex:1}.ed-papa p{font-size:12.5px;margin:6px 0}.ed-papa .raya{width:70px}.ed-papa .raya.larga{width:90px}
.f-muneco{width:96px;display:flex;justify-content:center}
.progreso{position:absolute;left:.55in;right:.55in;bottom:.66in;display:flex;gap:5px}.progreso span{flex:1;height:20px;border:2px solid var(--tinta);border-radius:6px;font:700 11px/16px Outfit;text-align:center;color:var(--tinta2)}
.progreso span.hecha{background:var(--gris);color:var(--tinta)}.progreso span.aqui{background:var(--c);color:var(--tinta);border-width:3px;box-shadow:var(--sombra-s)}
.portada{text-align:center}.po-logo{display:flex;justify-content:center;margin-top:40px}.po-tit{font-size:56px;margin:44px 0 8px}.po-sub{font-size:18px}
.po-nombre{margin:46px auto 0;width:520px;padding:30px 24px 18px}.po-elenco{display:flex;justify-content:center;align-items:flex-end;gap:26px;margin-top:64px}
.po-notas{display:flex;justify-content:center;gap:16px;margin-top:26px}.po-como{margin-top:26px}
.pp-cab{display:flex;justify-content:space-between;align-items:flex-end;gap:20px}.pp-cab h1{font-size:34px;margin:10px 0 8px}.pp-cab p{font-size:14px;max-width:520px}
.pp-tabla{width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;margin-top:14px;border:var(--borde) solid var(--tinta);border-radius:var(--radio);box-shadow:var(--sombra);font-size:12.5px;overflow:hidden}
.pp-tabla th{background:var(--tinta);color:#fff;font:700 11px Outfit;letter-spacing:.8px;text-transform:uppercase;padding:7px 6px;text-align:left}
.pp-tabla td{padding:6px 6px;border-top:2px solid var(--gris);vertical-align:middle}.pp-tabla tr:first-child td{border-top:0}
.chip.mini{padding:0 8px;font-size:13px;box-shadow:none;border-width:2px}
.tn{white-space:nowrap}.tn i{display:inline-block;font-size:0;width:15px;height:15px;border:2px solid var(--tinta);border-radius:50%;margin:0 1px;vertical-align:middle}.tn i.nv{box-shadow:2px 2px 0 var(--tinta)}
.tr{white-space:nowrap}.tr svg{display:inline-block;margin-right:3px;vertical-align:bottom}.es svg{margin-right:1px}
.caja-check{display:inline-block;width:20px;height:20px;border:2.5px solid var(--tinta);border-radius:5px}.pp-tabla .raya{width:100%}.pp-tabla th{font-size:10px;letter-spacing:.4px;padding:7px 5px}
.pp-h2{margin:20px 0 10px}.pp-clase{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.pp-clase .caja{padding:10px 9px;border-width:2.5px}.pp-clase h3{font-size:13.5px;margin:6px 0 4px}.pp-clase p{font-size:11px;margin:0;line-height:1.3}
.min{display:inline-block;background:var(--c);border:2px solid var(--tinta);border-radius:7px;padding:0 6px;font:700 14px Outfit}
.pp-bajo{display:flex;gap:18px;margin-top:24px;align-items:stretch}.pp-bajo .caja{flex:1;padding-top:22px}.pp-bajo p{font-size:12.5px;margin-bottom:4px}.pp-bajo .caja{padding-bottom:8px}.lineas .raya{height:30px}
.rc-cab{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:16px}.rc-cab h1{font-size:34px;margin:10px 0 8px}.rc-cab p{font-size:14px;max-width:520px}
.rejilla{display:grid;gap:0;border:0}.rejilla.r4{grid-template-columns:repeat(4,1fr)}.rejilla.r5{grid-template-columns:repeat(5,1fr)}
.tj{height:3.6in;display:flex;flex-direction:column;align-items:center;padding:10px 8px;margin:-1px 0 0 -1px}
.tj-cab{width:100%;display:flex;justify-content:space-between;align-items:center;border:var(--borde) solid var(--tinta);border-radius:12px;padding:4px 8px 4px 12px;box-shadow:var(--sombra-s)}.tj-cab b{font-size:30px}
.tj-cuerpo{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:space-around}.tj-pie{font-size:11.5px;color:var(--tinta2);text-align:center}
.comodin .tj-cab{justify-content:center}
.fg{height:3.45in;justify-content:flex-end;padding-bottom:16px}.fg-fig{flex:1;display:flex;align-items:center}.fg-sil{font:700 28px Outfit}.fg-nom{font-size:12px;color:var(--tinta2);margin-bottom:8px}.fg-pul{display:flex;gap:7px}.fg-pul i{width:13px;height:13px;border-radius:50%;border:2.5px solid var(--tinta);display:block}
.tijera{text-align:center;margin-top:8px}
.diploma{padding:.4in}.dp-marco{position:relative;height:100%;border:6px solid var(--tinta);border-radius:26px;box-shadow:10px 10px 0 var(--tinta);padding:30px 48px;text-align:center}
.dp-notas{position:absolute;left:24px;right:24px;top:-6px;height:14px;display:flex;gap:0}.dp-notas i{flex:1;border:3px solid var(--tinta);border-top:0;border-left-width:0;display:block}.dp-notas i:first-child{border-left-width:3px}
.dp-cab{display:flex;justify-content:space-between;align-items:center;margin-top:8px}
.dp-tit{font-size:58px;margin:26px 0 12px}.dp-txt{font-size:18px;margin:4px 0}.dp-nombre{font:700 54px Crimson,serif;margin:4px auto 6px;border-bottom:3px solid var(--tinta);display:inline-block;padding:0 60px}
.dp-verso{font-size:19px;margin:16px 0 0}.dp-verso span{font:400 12px Outfit;color:var(--tinta2);margin-left:6px}
.dp-firmas{display:flex;justify-content:center;align-items:flex-end;gap:40px;margin-top:6px}.dp-f{width:270px;display:flex;flex-direction:column;align-items:center}.dp-f small{font-size:11.5px;color:var(--tinta2);margin-top:4px}.dp-f .firma{margin-bottom:-36px}
.dp-elenco{position:absolute;right:40px;bottom:34px;display:flex;align-items:flex-end;gap:10px}.dp-elenco img:first-child{margin-right:-10px}
`;
// ---------- armar ----------
const paginas = [portada()];
for (let d = 0; d < N; d++) paginas.push(fichaMision(d));
paginas.push(hojaPapa(0), hojaPapa(1), tarjetasNotas(), tarjetasFiguras(), diploma('sarah'), diploma('david'));
const html = C.documento('Cuaderno de Belén · Mi Piano', paginas).replace('</head>', '<style>' + CSS + '</style></head>');
const HTML = path.join(__dirname, 'guias.html'), PDF = process.argv[2] || path.join(RAIZ, 'GUIAS-BELEN.pdf');
fs.writeFileSync(HTML, html);
C.aPDF(HTML, PDF).then(() => console.log(path.basename(PDF), paginas.length, 'páginas'));
