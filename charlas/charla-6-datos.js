const B=[
{id:"b0",nm:"Cómo leer esto",t:"Cómo leer esta charla",s:"Vamos pantalla por pantalla, con fotos del juego tal como está hoy. Toca una imagen para verla grande.",ins:[
 "Lo que ya me dijiste lo doy por decidido y no te lo pregunto: Bach se dirá «Baj» (o como escojas abajo), la cuenta será «un, dos, tres, cuá», el mundo se verá desde arriba con flechas grandes y el personaje caminando, habrá música por todo Belén, las guías tendrán manual de marca y a color, y Belén irá hacia una base azul-morada.",
 "Primero va mi propuesta del próximo avance, «el sueño». Luego cada pantalla, en el orden en que la vive el niño. Al final, las guías y cómo seguimos.",
 "Las preguntas sobre tu experiencia también traen mi recomendada; es solo lo que yo espero, no lo que debes sentir."],q:[]},
{id:"b1",nm:"El sueño",t:"El sueño: Belén, Nochebuena",s:"Mi propuesta para el próximo avance. La base está bien; esto es lo que la volvería espectacular.",ins:[
 "Una historia de 14 días: Belén se prepara para la Nochebuena, pero el pueblo se quedó callado. Cada día los niños despiertan un rincón con música: se encienden faroles, vuelven las campanas, el pastor saca la flauta. El día 14 es el concierto de Nochebuena en el pesebre, con todo el pueblo, y ellos tocan lo que dominaron.",
 "El mundo se ve desde arriba, como los juegos clásicos de Pokémon. Abajo a la izquierda, una cruz de flechas grandes; a la derecha, un botón «¡Toca!». Tic y Sansón siguen al niño por las calles.",
 "El mundo suena: 8 rincones musicales en Belén (el pastor que hace eco con la flauta, las campanas, la vecina que canta una nota para adivinar, el pozo del eco, la puerta de la posada que se abre con un ritmo, las ovejas que se cuentan con negras, los niños en ronda, la estrella). Cada rincón usa solo lo que ya aprendieron ese día.",
 "El día tiene dos partes: la clase (los edificios, unos 15 minutos) y el paseo por los rincones, sin prisa. El día termina solo: cae la noche, Bach dice buenas noches.",
 "El boceto de abajo es solo la idea (hecho rápido en código): noche azul-morada, luces cálidas, calles anchas, flechas y rincones."],q:[
 {id:"c6-s1",t:"¿El sueño en general?",img:["c6-s-belen-noche"],o:["*Sí, por ahí: constrúyelo","Sí, pero cambiaría cosas (las cuento abajo)","Prefiero otro rumbo"]},
 {id:"c6-s2",t:"¿La historia de los 14 días?",o:["*Belén se prepara para la Nochebuena y cada día se enciende un rincón con música","Sin historia: días sueltos","Otra historia (la cuento)"]},
 {id:"c6-s3",t:"¿Cómo termina el día 14?",o:["*Concierto de Nochebuena en el pesebre: el pueblo, Bach y la familia escuchan; tocan lo que dominaron","Un duelo final con el rival","Una fiesta en la plaza"]},
 {id:"c6-s4",t:"¿Quién acompaña al niño al caminar?",img:["c6-i-cenital"],o:["*Tic y Sansón","Solo Tic","Tic, Sansón y uno de los loros de la casa","Nadie"]},
 {id:"c6-s5",t:"¿Cuántos rincones musicales en Belén?",o:["*8: uno nuevo se abre cada uno o dos días","4, más largos","14: uno por día"]},
 {id:"c6-s6",t:"¿Qué piden los rincones?",o:["*Solo lo que ya aprendieron (el día 1, MI y «tan»)","Retos más difíciles, opcionales","Lo que sea: son libres"]},
 {id:"c6-s7",t:"¿Cuánto dura un día?",o:["*Clase de unos 15 minutos y paseo libre; termina solo cuando cae la noche","Un tiempo fijo con reloj","Sin fin: el papá decide"]}]},
{id:"b2",nm:"Entrada",t:"La entrada: quién toca, título y llegada",s:"Lo primero que ven.",ins:["El selector ya bajó el color, como pediste. Propongo que el muñeco escogido salude y diga su nombre: es un segundo de cariño que ayuda a que el niño sienta que es suyo."],q:[
 {id:"c6-e1",t:"«¿Quién toca hoy?»",img:["c6-selector"],o:["*Así, y que el muñeco escogido salude y diga su nombre","Así, sin cambios","Más grande y animado"]},
 {id:"c6-e2",t:"El título",img:["c6-titulo"],o:["*Así: corto, con el título y la frase","Más largo, con música","Más corto"]},
 {id:"c6-e3",t:"El recorrido de llegada que resalta los edificios",img:["c6-recorrido"],o:["*Completo solo el primer día; después, 5 segundos","Siempre completo","Quitarlo"]}]},
{id:"b3",nm:"Caminar",t:"Moverse por Belén",s:"Vista desde arriba, flechas grandes, el personaje camina.",ins:["Lo que hay hoy (abajo) es isométrico y se mueve tocando el piso. Lo cambio a vista desde arriba con flechas.","Me inclino por el estilo del boceto: se ven los techos y los frentes de las casas, como Pokémon. Es lo más fácil de leer para un niño de 4: arriba es arriba."],q:[
 {id:"c6-c1",t:"¿Qué vista desde arriba?",oi:["c6-s-belen-noche","c6-p-cenital"],o:["*Como el boceto nuevo: calles, techos y frentes, de noche","Como el de la charla 4: casitas de frente en el campo, de día"]},
 {id:"c6-c2",t:"¿Cómo se mueven?",o:["*Cruz de 4 flechas grandes abajo a la izquierda y botón «¡Toca!» abajo a la derecha","Flechas en los cuatro bordes de la pantalla","Flechas, y también tocar donde quiero ir"]},
 {id:"c6-c3",t:"¿Se puede caminar con el piano (MIDI)?",o:["*No: el piano es solo para música, así no se confunden las notas","Sí: cuatro teclas son las flechas"]},
 {id:"c6-c4",t:"¿A qué velocidad?",o:["*Paso tranquilo y seguro, con pasitos que suenan","Rápido","Dos velocidades: caminar y correr"]},
 {id:"c6-c5",t:"¿Cómo entran a un edificio?",o:["*Caminan hasta la puerta y entran solos","Se paran en la puerta y aprietan «¡Toca!»"]},
 {id:"c6-c6",t:"Así está hoy Belén: ¿qué te gusta y qué no?",img:["c6-belen"],o:[]}]},
{id:"b4",nm:"Mapa",t:"El mapa del mundo",s:"Dijiste que quieres más animación de personajes, sobre todo en el mapa.",ins:["Si el pueblo se ve desde arriba, el mapa también. El niño camina con las mismas flechas por el camino del pentagrama, entre ciudades; así el mapa es un lugar, no un menú."],q:[
 {id:"c6-m1",t:"¿El mapa con flechas?",img:["c6-14-mapa"],o:["*Sí: el niño camina con las flechas por el camino entre ciudades","Mapa ilustrado: toco la ciudad y voy","Solo lo abre el papá"]},
 {id:"c6-m2",t:"¿Qué se ve en diciembre?",o:["*Belén despierto y lo demás en niebla oscura, con siluetas de lo que viene","Todo el mundo abierto","Solo Belén"]}]},
{id:"b5",nm:"La clase",t:"La clase, edificio por edificio",s:"Dijiste que la actividad musical te gusta. Aquí afinamos cada parada.",ins:[
 "Lo central de la primera prueba con los niños fue no saber si iban bien o mal. Ahora cada nota acierta o falla con color, sonido y una carita; quiero confirmar que se siente así.",
 "Teatro: con la canción rotando cada día, en 14 días se domina una sola pieza. Te recomiendo una canción por semana."],q:[
 {id:"c6-d1",t:"El mini anuncio al entrar",img:["c6-anuncio"],o:["*Así: unos 3 segundos, y se salta tocando","Quitarlo","Más largo"]},
 {id:"c6-d2",t:"El Patio",img:["c6-patio"],o:["*Calentamiento de 1 minuto: respirar, sentarse bien, manos redondas","Pulso con el cuerpo: palmas y pies","Quitarlo"]},
 {id:"c6-d3",t:"El Coro: cantar con sílabas",img:["c6-coro"],o:["*Así: cantar antes de tocar","Que Bach cante primero y el niño repita","Quitarlo"]},
 {id:"c6-d4",t:"La tarjeta de nota nueva",img:["c6-nota-nueva"],o:["*Así, y que Bach la cante para que el niño la repita","Así, sin cambios","Más corta"]},
 {id:"c6-d5",t:"El Salón el día 1: bloques y sílabas, sin pentagrama",img:["c6-01-dia1"],o:["*Así: el ritmo antes que la lectura","Pentagrama desde el día 1"]},
 {id:"c6-d6",t:"El Teatro: villancico por pedazos",img:["c6-teatro"],o:["*Una canción por semana (2 en Belén), para dominarla","Que rote cada día, como ahora","Que el niño escoja"]},
 {id:"c6-d7",t:"El mini repaso «Escucha»",img:["c6-repaso"],o:["*Así: corto y en medio del juego","Más visual: la figura se anima","Quitarlo"]},
 {id:"c6-d8",t:"El Taller: inventar sobre la base de Tic",img:["c6-taller"],o:["*Más libre: todo lo que toque suena bonito, y se guarda para oírlo después","Retos de copiar","Quitarlo"]},
 {id:"c6-d9",t:"El duelo",img:["c6-duelo"],o:["*Solo al final de cada semana (días 7 y 14)","Cada día","Quitarlo"]},
 {id:"c6-d10",t:"El órgano del día",img:["c6-organo"],o:["*Así: un tubo por día y se llena la semana","Más grande y con fiesta"]},
 {id:"c6-d11",t:"¿Se nota si van bien o mal?",o:["*Sí, ahora se entiende","Todavía no del todo (cuento dónde)"]},
 {id:"c6-d12",t:"El tempo de inicio (56)",o:["*Bien para empezar","Más lento (50)","Más rápido"]},
 {id:"c6-d13",t:"El retraso con el piano de verdad (MIDI)",o:["*No se nota","Se nota un poco","Se nota mucho"]},
 {id:"c6-d14",t:"¿Cómo se dice Bach en la voz?",o:["*«Baj» (con jota suave, como lo dicen los músicos)","«Bak» (con k)","Otra (la escribo)"]}]},
{id:"b6",nm:"Modos",t:"Los modos de juego",s:"Dijiste que en Bach y el Patio no había más música. Los modos están, pero se encuentran por menús; propongo que vivan en el pueblo.",ins:["Cada modo sería un lugar de Belén: el kiosco en la plaza, la sala de conciertos dentro del Teatro, el museo, la tienda del luthier. Se abren de a uno, como regalo, para que siempre haya algo nuevo."],q:[
 {id:"c6-o1",t:"¿Dónde viven los modos?",img:["c6-08-kiosco","c6-07-concierto"],o:["*En lugares de Belén que se abren poco a poco","En un menú","Mitad y mitad"]},
 {id:"c6-o2",t:"¿Cuál te gustó más?",img:["c6-06-caen","c6-09-batalla"],o:["*Batalla de eco","Notas que caen","Kiosco","Concierto"]},
 {id:"c6-o3",t:"¿Cuál quitarías o cambiarías, y por qué?",o:[]},
 {id:"c6-o4",t:"¿Cuándo se abren?",o:["*Uno nuevo cada uno o dos días","Todos desde el día 1"]},
 {id:"c6-o5",t:"Corcheas doradas, tienda, vestidor y casa",img:["c6-11-tienda","c6-13-casa"],o:["*Se ganan tocando bien y se gastan en trajes y en decorar la casa","Sin tienda: los premios llegan solos"]}]},
{id:"b7",nm:"Color",t:"Color y animación",s:"Dijiste que el color mejoró y que quizá Belén iría mejor con una base azul-morada sutil.",ins:["La noche de Belén le da sentido a la base azul-morada: las ventanas y los faroles quedan cálidos, y la estrella brilla. Además los personajes resaltan solos sobre un fondo frío."],q:[
 {id:"c6-k1",t:"¿La base de Belén?",oi:["c6-s-belen-noche","c6-belen"],o:["*Noche azul-morada con ventanas y faroles cálidos","Día de arena, como ahora, con un toque más frío"]},
 {id:"c6-k2",t:"¿Cómo resaltan los personajes?",o:["*Borde oscuro y un poco más de color que el fondo","Igual que el fondo"]},
 {id:"c6-k3",t:"¿La animación de los personajes?",o:["*Caminan en 4 direcciones con 4 cuadros; quietos, parpadean y respiran","Más simple"]},
 {id:"c6-k4",t:"¿Y los vecinos?",o:["*Cada uno con una rutina pequeña: barre, da de comer a las palomas, canta","Quietos"]},
 {id:"c6-k5",t:"¿La música de fondo en Belén?",o:["*Un villancico suave en clavecín, que crece con cada rincón despierto","Solo sonidos del pueblo","Silencio"]}]},
{id:"b8",nm:"Guías",t:"Las guías y el manual de marca",s:"Pediste un estilo propio, con los muñequitos, a color sin exagerar.",ins:["Primero haría un manual de marca corto (logo, colores, letras, muñecos en poses, cómo se arma una página). Luego rehago las guías con él.","A color con fondo blanco gasta poca tinta y se ve alegre: el color va en los muñecos, las notas y los títulos."],q:[
 {id:"c6-g1",t:"Así están hoy las guías: ¿qué te gusta y qué no?",img:["c6-g-1","c6-g-2","c6-g-3"],o:[]},
 {id:"c6-g2",t:"¿Qué trae el manual de marca?",o:["*Logo, colores, letras, los muñecos (Bach, Tic, Sarah, David, Sansón) en poses, y reglas de página","Solo colores y letras"]},
 {id:"c6-g3",t:"¿Cuánto color al imprimir?",o:["*Fondo blanco; color en muñecos, notas y títulos","Páginas a todo color","Blanco y negro"]},
 {id:"c6-g4",t:"¿Qué guías?",o:["*Una ficha por día (lo que aprendió, algo para colorear y la estrella del día) y una hoja por semana para papá","Solo semanales"]},
 {id:"c6-g5",t:"¿Algo para recortar?",o:["*Tarjetas de notas y figuras para jugar en la mesa","Nada"]},
 {id:"c6-g6",t:"¿Diploma al terminar Belén?",o:["*Sí: el diploma de Belén, firmado por Bach, para el día 14","No"]}]},
{id:"b9",nm:"Papá",t:"Modo Papá y la prueba",s:"Lo que usas tú.",ins:["Propongo que tú pruebes el próximo avance solo, como hoy, y que los niños lo vean en enero."],q:[
 {id:"c6-p1",t:"El modo Papá",img:["c6-16-papa"],o:["*Me sirve así","Le falta algo (lo cuento)"]},
 {id:"c6-p2",t:"El informe",img:["c6-informe"],o:["*Así","Más simple: tres líneas y un botón"]},
 {id:"c6-p3",t:"¿Cómo pruebas el próximo avance?",o:["*Yo solo primero, y los niños en enero","Una prueba corta con ellos antes de enero"]}]},
{id:"b10",nm:"Seguir",t:"Para seguir",s:"Con tus respuestas armo el avance.",ins:["Mi orden: primero la vista desde arriba con flechas y los rincones musicales, porque es lo que más cambia el juego; después el manual de marca y las guías; al final el color y las animaciones finas."],q:[
 {id:"c6-z1",t:"¿Qué construyo primero?",o:["*Vista desde arriba, flechas y rincones musicales; después el manual de marca y las guías","Primero las guías","Todo junto"]},
 {id:"c6-z2",t:"Lo que no te pregunté y debí preguntar",o:[]}]}
];
