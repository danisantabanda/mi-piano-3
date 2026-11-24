const B=[
{id:"b0",nm:"Cómo leer esto",t:"Cómo leer este cuestionario",s:"Escoges mirando. Toca cualquier imagen para verla grande.",ins:[
 "Todas las imágenes las dibujé hoy en código, sin artistas ni IA de imágenes, para que veas de qué somos capaces. Son bocetos: muestran la dirección, no el acabado final.",
 "Donde una imagen compara opciones, las letras A, B y C de la imagen son las mismas de las respuestas. La estrella es mi recomendada.",
 "Lo del sonido, la música y las voces queda para la charla 5."],q:[
 {id:"c4-00",t:"¿Qué te parece el nivel de los bocetos?",o:["*Buen punto de partida; se puede subir mucho más","Me sorprenden; así ya está muy bien","Esperaba más; hay que cambiar de camino"]}]},
{id:"b1",nm:"Estilo",t:"El estilo del mundo",s:"La misma plaza de Leipzig, con la iglesia de Santo Tomás, en cuatro estilos.",ins:[
 "Pediste la estética pixel de sus juegos, pero moderna, como el Kirby de Switch, y con arquitectura de verdad. El HD-2D (sprites en pixel con luz y profundidad de cine, como Octopath Traveler) da exactamente eso: lo clásico y el asombro a la vez.",
 "Un estilo base no impide momentos especiales: entrar a una catedral en 3D, o ver el mapa como un diorama isométrico."],q:[
 {id:"c4-e1",t:"¿Qué estilo para el mundo?",oi:["s-pixel16","s-hd2d","s-25d","s-iso"],o:["Pixel clásico de 16 bits","*Pixel moderno con luz y profundidad (HD-2D)","2.5D ilustrado suave","Diorama isométrico"]},
 {id:"c4-e2",t:"¿Un solo estilo o varios?",o:["*Un estilo base, con momentos especiales en otro (el mapa en isométrico, una catedral en 3D)","Un solo estilo siempre","Cada época con su propio estilo"]},
 {id:"c4-e3",t:"¿Cómo es la arquitectura?",img:["a-epocas"],o:["*Cada lugar con su arquitectura real estilizada: enseña dónde y cuándo vivió cada músico","Un mismo pueblo de fantasía que cambia de color","Solo la Europa barroca"]},
 {id:"c4-e4",t:"¿Hora del día y clima?",o:["*La hora del día real (mañana, tarde) y el clima de cada lugar","Siempre de día","Ciclo completo con lluvia y nieve"]},
 {id:"c4-e5",t:"¿Cómo se hacen las ilustraciones finales?",op:"En código todo es nuestro y la licencia es limpia. Un artista de pixel art subiría mucho los personajes y lugares clave; si lo contratas, que nos ceda los derechos por escrito.",o:["*Las sigo haciendo yo en código, subiendo el nivel en cada ronda","Contratar un artista de pixel art para personajes y lugares clave","Imágenes generadas con IA y retocadas"]}]},
{id:"b2",nm:"Mapa",t:"El mapa del mundo",s:"Diez unidades, diez lugares, de la Edad Media hasta Colombia y la iglesia.",ins:["Un tren que viaja por la historia dice tres cosas sin palabras: hay un orden, se avanza, y cada estación es una época. Las islas y el libro son más libres pero dicen menos del viaje."],q:[
 {id:"c4-w1",t:"¿Cómo es el mapa?",oi:["w-islas","w-tren","w-libro"],o:["Islas, una por unidad","*Una línea de tren por la historia, de estación en estación","Un libro-mapa que se abre"]},
 {id:"c4-w2",t:"¿Cómo se ve lo que no han visitado?",o:["*Se ve a lo lejos, con niebla, para dar curiosidad","Oculto del todo","Todo visible desde el inicio"]},
 {id:"c4-w3",t:"¿Cómo se entra a un lugar?",o:["*Una entrada corta animada (el tren llega y se abre el pueblo, unos 3 segundos)","Directo, sin animación","Una escena larga"]}]},
{id:"b3",nm:"Pueblo",t:"El pueblo del día",s:"Cinco casas, una por parada (Modo Piano, canto y oído, lo nuevo, la canción, inventar), y bordes que dejan ver que hay más mañana.",ins:["En los 15 minutos el niño no debe perder tiempo caminando: toca la casa encendida y su personaje va solo. Explorar a fondo es para el tiempo libre."],q:[
 {id:"c4-p1",t:"¿Cómo es el pueblo?",oi:["p-cenital","p-calle","p-plaza"],o:["*Camino en lazo, visto desde arriba","Calle lateral, como plataformas","Plaza circular con fuente"]},
 {id:"c4-p2",t:"¿Cómo va de casa en casa en los 15 minutos?",o:["*Toca la casa encendida y el personaje camina solo (2 o 3 segundos)","Lo mueve el niño con el dedo","Salto directo, sin caminar"]},
 {id:"c4-p3",t:"¿Y en el tiempo libre?",o:["*Lo mueve el niño con el dedo, explora y entra a todo","Igual que en los 15 minutos"]},
 {id:"c4-p4",t:"¿Se camina con el piano?",o:["Sí, teclas como flechas","*No: el piano es solo para la música, para no confundir","Solo en el mundo libre"]}]},
{id:"b4",nm:"Interiores",t:"Los interiores",s:"El salón de Bach visto de tres maneras.",ins:["Prefieres los personajes de perfil, como en tus juegos de Sarah y David. El corte lateral los muestra así, deja ver el piano completo y cabe bien encima del teclado."],q:[
 {id:"c4-i1",t:"¿Cómo se ve por dentro?",oi:["i-corte","i-cenital","i-iso"],o:["*Casa de muñecas en corte, de perfil","Desde arriba, como RPG","Cuarto isométrico"]}]},
{id:"b5",nm:"Personajes",t:"Personajes",s:"Los que viven en el juego.",ins:["El robot-metrónomo hace algo que ningún otro compañero hace: su péndulo late con el pulso. Es el pulso que se ve, justo lo que faltó en la prueba.",
 "El rival trae otro instrumento: así sus duelos suenan distinto y los niños conocen la orquesta."],q:[
 {id:"c4-c1",t:"¿Cuál robot volador?",img:["c-robot"],o:["A · Robot de lata retro con hélice","*B · Robot-metrónomo: su péndulo marca el pulso","C · Esfera con cara de parlante"]},
 {id:"c4-c2",t:"¿Cómo se llama?",o:["*Tic (por el tic-tac del metrónomo)","Pulso","Bit"]},
 {id:"c4-c3",t:"¿Qué Bach?",img:["c-bach"],o:["*A · Tierno y gordito amable","B · Elegante maestro de capilla"]},
 {id:"c4-c4",t:"¿Qué proporción para Sarah y David?",img:["c-ninos"],o:["A · Chibi, dos cabezas","*B · Tres cabezas, como en sus juegos","C · Más altos"]},
 {id:"c4-c5",t:"¿Qué rival?",img:["c-rival"],o:["*A · Niño trompetista de otra ciudad","B · Niña violinista","C · Gemelo pianista travieso"]},
 {id:"c4-c6",t:"¿Cómo es el rival?",o:["*Presumido pero noble: los reta, pierde con gracia y al final toca con ellos","Rival siempre","Amigo desde el inicio"]},
 {id:"c4-c7",t:"¿Papá, mamá y los primos así?",img:["c-familia"],o:["*Sí, y los hago más fieles con lo que me contaste de cada uno","Más sencillos","Sin primos por ahora"]},
 {id:"c4-c8",t:"¿Sansón en el juego?",q:"En los bocetos está echado en la plaza.",o:["*Sí, los acompaña como en el juego de Navidad","No"]}]},
{id:"b6",nm:"Pantallas",t:"Las pantallas",s:"Cada momento del día, como lo vería el niño en la tablet.",ins:["Lo decidido en la charla 1 manda: acierto que se ve y se oye, error claro y amable, demostración, pulso que suena y se ve.",
 "Las pantallas de tocar dejan siempre el teclado abajo y la música en el centro; el mundo acompaña sin tapar."],q:[
 {id:"c4-s1",t:"¿Quién toca hoy?",img:["sc-inicio"],o:["*Así: Sarah y David grandes, la familia abajo","Solo Sarah y David","Sin selector: cada tablet es de un niño"]},
 {id:"c4-s2",t:"¿Cómo es el salón de Bach (la clase)?",oi:["sc-salon-a","sc-salon-b"],o:["*Bach al lado y una tarjeta grande con el concepto","Pizarra grande y Bach en una esquina"]},
 {id:"c4-s3",t:"¿Cómo es la pantalla de práctica?",oi:["sc-practica-a","sc-practica-b"],o:["Mundo arriba, partitura al centro","Partitura grande, mundo como franja","*Las dos: la primera para canciones cortas, la segunda cuando la partitura crece (cambia sola)"]},
 {id:"c4-s4",t:"¿El camino para leer así?",img:["sc-camino"],o:["*Así: Tic late el pulso, los carriles son las líneas y un marcador espera en la nota","Más simple, sin mundo detrás","Notas que caen en vez de correr"]},
 {id:"c4-s5",t:"¿Las tarjetas así?",img:["sc-tarjetas"],o:["*Así, con el gran pentagrama desde el inicio","Solo clave de sol al comienzo"]},
 {id:"c4-s6",t:"¿Los pads de ritmo así?",img:["sc-pads"],o:["*Así: tarjetas de ritmo arriba, pads grandes abajo, de 2 a 4 y a 6","Pads en el piano (teclas graves como tambores)","Las dos cosas"]},
 {id:"c4-s7",t:"¿El eco así?",img:["sc-eco"],o:["*Así: Tic canta y las teclas no se encienden","Que cante Bach"]},
 {id:"c4-s8",t:"¿La banda así?",img:["sc-banda"],o:["*Así: luces de acordes de color sobre el teclado","Con el cifrado escrito encima"]},
 {id:"c4-s9",t:"¿El estudio así?",img:["sc-estudio"],o:["*Así, como tu estudio","Más sencillo"]},
 {id:"c4-s10",t:"¿Cómo se ve un acierto?",img:["sc-acierto"],o:["A · El bloque estalla y sube el contador","B · El personaje da un paso y la nota suena","*A y B juntas (lo que decidimos en la charla 1)","C · Una palabra grande"]},
 {id:"c4-s11",t:"¿Cómo se ve un error?",img:["sc-error"],o:["A · Casi invisible","*B · Claro y amable: tropieza y brilla la tecla correcta","C · Con consecuencia (un corazón menos), solo fuera del currículo"]},
 {id:"c4-s12",t:"¿El cofre del día así?",img:["sc-cofre"],o:["*Así: las cinco paradas encendidas y el cofre que se abre","Más sobrio"]},
 {id:"c4-s13",t:"¿La casa propia así?",img:["sc-casa"],o:["*Así, y crece con lo que ganan","Solo una habitación"]},
 {id:"c4-s14",t:"¿El informe del viernes así?",img:["sc-informe"],o:["*Así, en la app de papá cada viernes, con los audios","En PDF para imprimir","Las dos cosas"]}]},
{id:"b7",nm:"Flujo",t:"El flujo",s:"Las reglas que valen en todas las pantallas.",ins:["Un niño de 4 años se pierde con cada toque de más. La regla de oro: de abrir la app a tocar la primera nota, máximo dos toques."],q:[
 {id:"c4-f1",t:"¿Cuántos toques hasta la primera nota?",o:["*Máximo dos, desde que abren la app","Los que hagan falta"]},
 {id:"c4-f2",t:"¿Orientación?",o:["*Siempre horizontal","También vertical, para celular"]},
 {id:"c4-f3",t:"¿Cuánto texto?",o:["*Sarah lee frases cortas; para David todo va con dibujos, demostración y voz","Igual para los dos","Nada de texto"]},
 {id:"c4-f4",t:"¿Pausa y salir?",o:["*Siempre arriba a la derecha, grande","Escondido"]},
 {id:"c4-f5",t:"¿Cómo se entra al panel de papás?",o:["*Esquina inferior izquierda, apretada 3 segundos, como en Letras","Con una clave","Un botón visible"]},
 {id:"c4-f6",t:"¿El teclado de la pantalla con el piano conectado?",o:["*Se ve como espejo de lo que tocan (no se toca) y se oculta si estorba","Siempre se puede tocar","Oculto"]}]},
{id:"b8",nm:"Seguir",t:"Para seguir",s:"Queda la charla 5: arte, sonido y voces.",ins:["Con cuatro charlas resueltas ya tenemos casi todo para construir. Una idea: hacer la unidad de enero completa como prototipo mientras charlamos la 5, y que la pruebes tú antes que ellos."],q:[
 {id:"c4-z1",t:"¿Cómo seguimos?",o:["*La charla 5 y, en paralelo, el prototipo de la unidad de enero para que lo pruebes tú primero","Solo la charla 5; construir después","Construir ya todo"]},
 {id:"c4-z2",t:"Lo que no te pregunté y debí preguntar",o:[]}]}
];
