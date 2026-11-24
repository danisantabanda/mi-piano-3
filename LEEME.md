# MI PIANO 3 · «El viaje de Bach» · M4: BELÉN, LA GRAN PRUEBA

Para probar todo: `GUIA-DE-PRUEBA.md`. La progresión día por día: `PROGRESION-BELEN.md`. Las guías de la semana: `GUIAS-BELEN.pdf`.

**M4:**
- **Pedagogía (`src/progresion.js`).** Día 1: MI con el dedo 3 y solo bloques de color (sin pentagrama).
  - El ritmo crece primero: tan/taaan → silencio → taca.
  - Las notas llegan de una en una: SOL (día 4), DO, RE, FA, LA, SI.
  - La lectura entra tenue el día 5 y completa el día 8.
  - El tempo va de 56 a 80.
  - Muchas variaciones pequeñas (`patronesDia5`).
  - El Teatro pide la melodía solo con notas y ritmos ya conocidos; si no, se escucha y se canta.
  - Silencios de verdad: no se tocan, y tocarlos es error.
  - Las canciones largas se desplazan en el pergamino.
- **Modos (`src/modos.js`):** batalla de eco, partituras al azar, notas que caen (las tres con 3 corazones), sala de conciertos con la familia, kiosco (acompañar a la banda), tienda del luthier, vestidor, casa decorada, instrumentos que suenan fuera de las clases, museo, 6+2 notas doradas y fps automático (de 60 baja a 30 si hace falta).
- **Modo Papá:** atajos a todo, simular el día 1 a 14, dueto (mano izquierda sin juzgar) y ver todos los mundos.
- **Visual.** Ciclo de caminar de 4 cuadros, parpadeo, Tic con llama, NPCs que respiran y más color.
  - En el mapa: olas, nubes con sombra, banderas y el viaje caminando.
- **Voces 3:** `voz/guion-belen-3.json` (24 frases), `belen3_dani.json` y `GENERAR-VOCES-BELEN-3.bat` (fusiona el manifiesto).



**M3.1:**
- **Intro.** Título «Mi Piano · El viaje de Bach» con la frase de inicio. Al llegar a Belén la cámara recorre los edificios: cada uno brilla y muestra su nombre.
- **En cada parada.** Mini-anuncio de 5 s al entrar. Antes de cada nota nueva aparece su tarjeta (nombre grande, pentagrama, tecla que brilla).
- **Tiempos y notas.** Se empieza lento (56) con UNA nota (MI); cada día suma una nota y un poco de tempo.
- **Cuenta.** Va arriba a la derecha, así el personaje no la tapa. El clic y la cuenta hablada se programan en el reloj de audio; sin las muestras de voz, la cuenta suena con pitidos.
- **Latencia.** Ventana de juicio más ancha en pantalla táctil, compensación estimada y botón «Medir el retraso tocando».
- **Mini repaso** a mitad de la sesión.
- **Panel de papás.** Plan de la clase del viernes y cuatro guías imprimibles desde Chrome (`src/guias.js`).
- **Voces nuevas.** `voz/guion-belen-2.json`, `voz/belen2_dani.json` y `voz/GENERAR-VOCES-BELEN-2.bat`, que fusiona el manifiesto con `fusionar_manifiesto.py`.
- **web/.** Ya no trae `voces/`, para no pisar las voces publicadas.



Las decisiones del proyecto están en `PROYECTO.md` y el estado en `ESTADO.md`. Lo de M2 sigue igual (más abajo).

## M3

**Entrega:**
- `MI-PIANO-3-M3.html` (695 KB, autónomo).
- `web/`: lista para copiar a `/pruebas/mi-piano-3/`. Usa rutas relativas y el SW de f4 adaptado (arreglo de redirecciones; piano y voces en un caché aparte).
- `capturas/_contacto.jpg`.
- `capturas/m3-belen.mp4` (1 min, con sonido).

**Lo que cambia:**
- **Clave de sol.** Ahora es un trazo propio: un path con plumilla inclinada, en `base.js`. La de fa también.
- **Villancicos** (`src/villancicos.js`): los cinco están en pedazos, con armonía por compás, anacrusa y una versión para Sarah y otra más corta para David.
  - El Teatro rota la canción de cada día.
  - Cada día trabaja los dos pedazos que faltan (escucha → pads → una tecla → melodía) y después todo lo que ya sabe, con la banda.
  - Un pedazo cuenta como dominado si sale bien (90 % o más) en dos días distintos.
  - **Sin verificar:** «Los peces en el río» y «Campana sobre campana» están transcritas de memoria, porque la red no dejó bajar partituras. Dani tiene que oírlas antes que los niños. Las otras tres están verificadas.
- **Música de Belén que despierta.** Es el villancico del día en bucle. Cada pedazo dominado suma un instrumento:
  1. flauta pastoril,
  2. cuerdas,
  3. campanitas,
  4. bajo pizzicato,
  5. arpa.
  - Arriba se ven los instrumentos que ya despertaron.
- **Conservatorio.** Duelo de eco con el pastorcito de la flauta.
  - Hay 3 corazones, y solo aquí.
  - Si se gana: insignia de la estrella, llave de enero y una fanfarria. Maelzel aparece en silueta en el mapa.
  - Se abre después de la primera sesión completa.
- **Voces.**
  - Guion: `voz/guion-belen.json`, con el formato del guion v1 (41 frases de Bach y 4 pitidos de Tic).
  - Exportación para Chatterbox: `voz/belen_dani.json`.
  - Para generarlas: `voz/GENERAR-VOCES-BELEN.bat`.
  - El juego carga `voces/manifiesto.js` (va un manifiesto vacío) y queda callado si no hay audios.
  - Tic solo pita (sonido sintetizado).
- **Panel de papás** (ícono de ajustes), con cuatro pestañas:
  - informe de la semana (minutos por día, lo dominado, lo que le cuesta, y «cómo lo tocó» con botón ▶ para volver a oírlo),
  - perfiles,
  - piano (MIDI, calibración) y voces sí/no,
  - créditos.

**Pruebas** (`pruebas/preludio.js`, `pwa.js`, `humo.js`):

| Caso | Resultado |
|---|---|
| Preludio, Sarah con MIDI, 10 días seguidos | Las 10 sesiones completas, cada una de 14 a 16 min; 8 pedazos dominados; duelo ganado |
| Preludio, David con pantalla, 2 días | Sesiones completas y duelo ganado |
| Aporrear | Se queda en el Coro, en el paso 0, con 0 corcheas; el duelo se pierde (0 corazones) |
| `pwa.js` | Funciona sin red, con el Salamander guardado |
| Prueba con voces falsas | Suenan y una nota las corta |
| Errores | 0 en todas |

## Archivos

| Qué | Dónde |
|---|---|
| Archivo autónomo (648 KB) | `MI-PIANO-3-M2.html` |
| Piano Salamander (opcional, 9 MB) | `piano-datos.js`, al lado del HTML. Si falta, se usa el piano horneado. |
| PWA | `web/` (rutas relativas; el SW guarda el piano en su propio caché) |
| Fuentes | `src/`. Se arma con `node build.js`. |
| Lo nuevo | `src/dia.js` (sesión, paradas, primer día, órgano, niño simulado) y `src/sonido5.js` (Tic, teclado espejo, MIDI) |

`MI-PIANO-3-E1.html` queda como la entrega anterior.

## Ajustes de M1

1. **Niebla oscura.**
2. **Calles más anchas** en Belén.
3. **Árboles** que se mecen y hojas que caen.
4. **Tic vuela por encima de todo.** Si queda tapado, él y el personaje se ven en silueta.
5. **«¿Quién toca hoy?»** con tonos de pergamino.
6. **Personajes principales** con contorno claro; los NPC, un poco desaturados.
7. **Mapa del mundo** más grande y desplazable, en paleta de manuscrito. Tiene cordilleras, bosques, ríos con curvas, puentes, molinos y castillos.

## El día

- **Primer día** (sin toques obligatorios):
  - La carta de Bach se lee palabra por palabra.
  - Tic sale del sobre y empieza el pulso.
  - El personaje recibe el traje de viajero.
  - La primera nota abre la puerta de Belén.
- **Los demás días:** un toque en «¿Quién toca hoy?» lleva directo al Patio.
- **Entre paradas:** Belén pasa animado y el personaje camina solo hasta la siguiente puerta.

**Las paradas:**
- **Patio (1').** Primero, respiración con el pulso. Después, Modo Piano: cada nota sube como un farol.
- **Coro (≈2').** Tic canta, el niño canta con él y después hace el eco en el piano.
- **Salón de Bach (≈4,5').** Negra «tan» y blanca «taaan». Escucha → espera → a tu ritmo → a tempo (72, luego 80 con banda).
- **Teatro (≈4,5').** Jingle Bells en pedazos: ritmo en pads → una tecla → melodía → la canción entera con la banda.
- **Taller (≈1,5').** Se inventa sobre DO–LAm–FA–SOL; las notas se tejen en un telar y Tic lo toca de vuelta.
- **Órgano del día.** Un tubo por parada, con sus estrellas. Muestra las corcheas ganadas, el camino al traje (20) y al instrumento (40), y el pentagrama de la semana.

**Reglas de PROYECTO.md:**
- **Acierto.** Suena la nota y un acorde, el bloque estalla en su color, el personaje salta y avanza el contador.
- **Error.** La nota suena suave, brilla la tecla correcta y el personaje tropieza. A los 3 fallos Tic demuestra; a los 5, toca con él.
- **Estrellas.** 80/90/100 %. Un paso pasa con 80 %; si no, se repite.
- **Aporreo.** Notas casi juntas cuentan como error. En Patio y Taller borran la racha de corcheas.
- **Corcheas.** Hasta 3 por parada. La canción entera con 3★ da +5.
- **Dominada.** Bien en 2 días distintos.

**Sonido y entrada:**
- **Pulso de Tic.** Bloque de madera, con campanita en el uno.
- **Piano.** Salamander.
- **MIDI.** Conexión en caliente.
- **Teclado de pantalla.** Hace de espejo y suena.
- **Teclado del PC.** A S D F…
- **Calibración.** Desde el panel de papás: «toca el DO del medio».

## Pruebas (`pruebas/`)

| Prueba | Resultado |
|---|---|
| `sesion.js bueno midi 8` / `bueno pantalla 8` | Sesión completa en **14,3 / 14,6 min** de juego, 17–18 corcheas, 0 errores |
| `sesion.js aporrea midi` / `aporrea pantalla` (10 min) | Se queda en el Coro (paso 0, 12–13 repeticiones), **0 corcheas** |
| `humo.js 1280 800` / `1024 600` | 0 errores, carga **0,25 s**, 57–60 fps |
| `pwa.js` | SW activo, piano guardado, funciona sin red con el Salamander |

`capturas-m2.js` hace las capturas y `video.js` el montaje.

## Capturas

- `capturas/_contacto.jpg`: hoja de contacto.
- `capturas/m2-sesion.mp4`: 2 min, **sin audio**. Es un montaje del niño simulado: los tramos a velocidad real y el resto cortado.

## Flojo / pendiente

- **Canto.** El canto del Coro no se escucha (no hay micrófono); solo se invita a cantar.
- **Voz.** No hay voz todavía (M3).
- **Duración.** Las paradas se alargan con «repaso» hasta su tiempo. Conviene ajustarlas con Dani y con niños reales.
- **Rendimiento.** El Patio baja a ≈51 fps en 1024×600 sin GPU.
- **Pendiente para M3:** 4 villancicos, la música que despierta, el duelo y el informe.
