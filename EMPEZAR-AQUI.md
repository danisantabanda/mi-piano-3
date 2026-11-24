# Mi Piano 3 · El viaje de Bach — cómo seguir en un proyecto nuevo

Proyecto de Dani para Sarah (6) y David (4). Juego de piano HTML/PWA (tablet Android apaisada o PC, piano MIDI o teclado en pantalla). Los niños empiezan a inicios de diciembre.

## Lo primero que lee el nuevo Claude
1. `PROYECTO.md` — TODAS las decisiones de Dani (charlas 1–6, M4–M7). Mandan sobre todo lo demás.
2. `ESTADO.md` — qué está hecho, qué falta y el «Pendiente inmediato».
3. `marca/MANUAL-DE-MARCA.pdf` — estilo (neobrutalismo amable, colores de nota DO–SI).
4. `arte/gemini/` — el nivel gráfico aprobado («rumbo indiscutible»). Ids de referencia de Gemini en PROYECTO.md (sección M7).

## Cómo trabajar con Dani
- Conversación FLUIDA: pasos cortos, avisos frecuentes, nada de dejarlo esperando con trabajos largos de agentes.
- Pedagogía: inductiva, lenta, repetición con variación (nunca >3 iguales), cada edificio con su gracia. Errores claros y amables; aporrear no avanza.
- Voz y texto en pantalla dicen lo mismo. «Bach» se escribe «Baj» en los guiones de voz. Cuenta: «un, dos, tres, cuá».
- Licencias limpias siempre. Biblia RVR1960.

## Carpetas del zip
- `f5/src/` código; `f5/build.js` → `node build.js` genera `MI-PIANO-3-M3.html` (autónomo) y `web/` (PWA: index.html, sw.js, manifest, íconos, piano-datos.js Salamander 9 MB).
- `f5/pruebas/` humo.js, sesion.js (`--minutos 15`, niño simulado), sonido.js, voz-texto.js, capturas-*.js. Requieren Playwright (Chromium).
- `f5/voz/` guiones y .bat de voces (Chatterbox V3 + LoRA de Dani en E:\CLONACION DE VOZ; patrón GENERAR-VOCES-BELEN-N.bat, fusionan el manifiesto).
- `f5/arte/` gemini/ (aprobadas), nuevo/ (39 procesadas + manifiesto), herramientas/ (croma.py, hoja-andar.py, preparar-arte.py).
- `f5/marca/` manual de marca, figuras.js (clave de sol y figuras), fuentes OFL.
- `f5/capturas/` hojas de contacto por momento (m4 … m7).
- `charlas/` las 6 charlas (cuestionarios HTML) y su arte.
- `voces/` las voces ya generadas y publicadas (ogg + manifiesto.js) — van en web/voces/ al publicar.

## Publicar
Copiar `web/index.html` y `web/sw.js` (y `voces/` si cambian) a `E:\APP ECO FAMILIAR\APP\eco-familiar-app\pruebas\mi-piano-3\` y doble clic en `E:\APP ECO FAMILIAR\APP\publicar-app.bat` → app.ecofamiliar.org/pruebas/mi-piano-3 (revisar publicar-log.txt).

## Mensaje para arrancar la sesión nueva (copiar y pegar)
«Retomamos Mi Piano 3. Descomprime el zip, lee EMPEZAR-AQUI.md, PROYECTO.md y ESTADO.md, mira arte/gemini y capturas/m7/_contacto.jpg, y sigue por el “Pendiente inmediato” de ESTADO.md. Trabaja en pasos cortos y cuéntame cada avance.»
