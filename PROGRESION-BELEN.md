# Progresión de Belén (la gran prueba) — para revisar

Principios (PROYECTO.md, 23-nov): sonido antes que símbolo; **una nota y un dedo** al comienzo; el **ritmo** varía primero (tan, taaan, silencio, taca); las notas llegan **de una en una**; la **lectura** entra después y poco a poco; **muchas repeticiones con pequeñas variaciones**; nunca más rápido que la canción. En el juego: ⚙ → Modo Papá → «Simular el día» salta a cualquier fila. Fuente: `src/progresion.js` (se cambia ahí y todo se ajusta).

| Día | Notas (dedo) | Ritmos | Lectura | Tempo | Lo nuevo (Salón de Bach) | Teatro | Ejemplo de patrón (variaciones) |
|---|---|---|---|---|---|---|---|
| 1 | MI (3) | tan, taaan | bloques (sin pentagrama) | 56 | tan y taaan en MI, con el dedo 3 | Jingle Bells: 1 melodía · 2 escuchar · 3 escuchar · 4 una tecla | tan tan taaan tan tan taaan → tan tan taaan tan tan taaan |
| 2 | MI (3) | tan, taaan, silencio | bloques (sin pentagrama) | 56 | el silencio: «sh» (no se toca) | Jingle Bells: 1 melodía · 2 escuchar · 3 escuchar · 4 una tecla | tan tan tan sh taaan taaan → tan tan tan tan taaan taaan |
| 3 | MI (3) | tan, taaan, silencio, taca | bloques (sin pentagrama) | 58 | taca: dos notas en un pulso | Jingle Bells: 1 melodía · 2 escuchar · 3 escuchar · 4 una tecla | ta ta ta ta taaan tan sh taaan → taaan taaan tan sh taaan |
| 4 | MI (3), SOL (5) | tan, taaan, silencio | bloques (sin pentagrama) | 58 | segunda nota: SOL, con el dedo 5 | Jingle Bells: 1 melodía · 2 escuchar · 3 escuchar · 4 una tecla | tan tan tan sh tan sh taaan → tan tan·SOL taaan tan·SOL sh taaan·SOL |
| 5 | MI (3), SOL (5) | tan, taaan, silencio, taca | pentagrama tenue | 60 | los bloques viven en el pentagrama (lectura tenue) | Noche de paz: 1 escuchar · 2 escuchar · 3 escuchar · 4 escuchar · 5 escuchar · 6 escuchar | ta ta ta ta taaan tan tan taaan → tan tan·SOL ta ta tan·SOL tan tan·SOL taaan |
| 6 | MI (3), SOL (5), DO (1) | tan, taaan, silencio | pentagrama tenue | 60 | tercera nota: DO, con el dedo 1 | Noche de paz: 1 escuchar · 2 escuchar · 3 escuchar · 4 escuchar · 5 escuchar · 6 escuchar | tan tan tan sh taaan taaan → tan sh tan·DO sh taaan·SOL taaan·DO |
| 7 | MI (3), SOL (5), DO (1) | tan, taaan, silencio, taca | pentagrama tenue | 62 | taca con tres notas | Noche de paz: 1 una tecla · 2 una tecla · 3 una tecla · 4 una tecla · 5 una tecla · 6 una tecla | ta ta ta ta taaan tan sh taaan → tan tan·SOL tan·DO sh tan·SOL sh taaan |
| 8 | MI (3), SOL (5), DO (1), RE (2) | tan, taaan, silencio | pentagrama | 64 | RE con el dedo 2; ya se lee el pentagrama | Noche de paz: 1 escuchar · 2 una tecla · 3 escuchar · 4 escuchar · 5 escuchar · 6 escuchar | tan tan tan sh tan tan taaan → tan·SOL sh tan·RE sh tan·DO tan·RE taaan·SOL |
| 9 | MI (3), SOL (5), DO (1), RE (2) | tan, taaan, silencio, taca, taaaaan | pentagrama | 66 | la redonda: «taaaaan» | Campana sobre campana: 1 una tecla · 2 una tecla · 3 una tecla · 4 una tecla | tan tan taaan taaan taaan → ta·SOL ta·SOL ta·DO ta·DO ta·RE ta·RE tan·SOL taaan·DO taaan·RE |
| 10 | MI (3), SOL (5), DO (1), RE (2), FA (4) | tan, taaan, silencio, taca | pentagrama | 68 | FA con el dedo 4: la mano completa | Campana sobre campana: 1 una tecla · 2 una tecla · 3 una tecla · 4 una tecla | ta ta ta ta taaan tan sh taaan → taaan·DO tan·RE tan·FA tan·DO sh taaan·FA |
| 11 | MI (3), SOL (5), DO (1), RE (2), FA (4) | tan, taaan, silencio, taca, taaaaan | pentagrama | 70 | cinco dedos, cinco notas | Campana sobre campana: 1 una tecla · 2 una tecla · 3 una tecla · 4 una tecla | tan tan taaan ta ta ta ta taaan → tan·DO taaan·RE tan·FA ta·DO ta·DO ta·RE ta·RE taaan·FA |
| 12 | MI (3), SOL (5), DO (1), RE (2), FA (4), LA (—) | tan, taaan, silencio, taca, taaaaan | pentagrama | 72 | LA: la mano se estira | Venid, fieles todos: 1 melodía · 2 una tecla · 3 una tecla · 4 melodía · 5 una tecla | tan tan taaan tan tan taaan → ta·RE ta·RE tan·FA ta·LA ta·LA tan·RE tan·FA tan·LA taaan·RE |
| 13 | MI (3), SOL (5), DO (1), RE (2), FA (4), LA (—), SI (—) | tan, taaan, silencio, taca, taaaaan | pentagrama | 76 | SI: ya están las siete | Venid, fieles todos: 1 melodía · 2 melodía · 3 melodía · 4 melodía · 5 melodía | tan tan taaan taaan taaan → tan tan·LA tan·SI tan·FA taaan·LA taaan·SI |
| 14 | MI (3), SOL (5), DO (1), RE (2), FA (4), LA (—), SI (—) | tan, taaan, silencio, taca, taaaaan | pentagrama | 80 | repaso de todo (a tempo de la canción) | Venid, fieles todos: 1 melodía · 2 melodía · 3 melodía · 4 melodía · 5 melodía | tan tan taaan tan sh taaan → taaan·FA tan·LA sh tan·FA sh taaan·SI |

**Cada día**: Patio (respirar + tocar libre con las notas conocidas) → Coro (eco de 4 pulsos con el ritmo del día) → Salón de Bach (escucha → espera → a tu ritmo → a tempo + variaciones hasta ~4 min) → Teatro (pedazos: escucha → pads → una tecla → melodía, según lo que ya sabe; mini repaso en medio) → Taller (inventar con las notas conocidas) → órgano. La tablet demuestra a los 3 fallos y toca con el niño a los 5; aporrear no avanza.

## La curva (niño simulado, 4 % de errores, MIDI)

| Día | Canción | Minutos | Pasos evaluados | Repetidos | Precisión media | Notas nuevas | Dominado (acumulado) |
|---|---|---|---|---|---|---|---|
| 1 | Jingle Bells | 16 | 28 | 1 | 97 % | MI | 0 |
| 2 | Jingle Bells | 15.2 | 27 | 1 | 97 % |  | 1 |
| 3 | Jingle Bells | 15 | 24 | 1 | 97 % |  | 1 |
| 4 | Jingle Bells | 14.4 | 27 | 2 | 95 % | SOL | 1 |
| 5 | Noche de paz | 13.4 | 28 | 1 | 97 % |  | 1 |
| 6 | Jingle Bells | 14.3 | 26 | 0 | 99 % | DO | 1 |
| 7 | Venid, fieles todos | 13.6 | 24 | 1 | 98 % | MI, DO | 1 |
| 8 | Jingle Bells | 13.4 | 25 | 3 | 95 % | RE | 1 |
| 9 | Campana sobre campana | 13.6 | 26 | 2 | 97 % | RE | 1 |
| 10 | Noche de paz | 13.3 | 28 | 2 | 97 % | FA | 1 |
| 11 | Los peces en el río | 13.9 | 34 | 2 | 95 % |  | 1 |
| 12 | Venid, fieles todos | 13.2 | 30 | 2 | 96 % | LA, FA | 1 |
| 13 | Campana sobre campana | 13.4 | 32 | 1 | 96 % | SI | 1 |
| 14 | Jingle Bells | 13.1 | 37 | 2 | 96 % |  | 1 |

Lectura de la curva: cada sesión dura lo mismo (~15 min); lo que crece es la variedad (notas, ritmos, lectura), no la cantidad. Un niño real tendrá más «repetidos» al llegar cada novedad (días 2, 3, 4, 5, 8): ahí la escalera baja sola (demostración, tocar juntos).

## Para decidir con Dani

- ¿Una nota nueva por día de práctica es buen ritmo, o mejor una por semana (repetir cada fila 4 días)?
- ¿El pentagrama tenue el día 5 y completo el día 8, o antes/después?
- ¿El Teatro debe esperar a que la melodía sea «conocida» (como ahora) o dejar intentar la melodía antes, con más ayuda?
- Lo dominado crece muy lento (1 pedazo en 14 días en la simulación): los villancicos rotan y cada uno vuelve cada 3–5 días, y un pedazo se domina bien en 2 días distintos. ¿Una canción por semana (4 días seguidos) en vez de rotar cada día?
