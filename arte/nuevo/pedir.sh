# copia el último original de Gemini y lo procesa como figuras sueltas. Uso: sh pedir.sh blob nombre id "uso" "pantalla" "personaje" "poses" "QUIENES"
B=/root/.claude/projects/-home-claude/729b4db2-b802-5fa9-9196-860bb9dcc9e0/tool-results
cp $B/$1 original/$2.jpg && SOLO=1 QUIENES="$8" python3 procesar.py figuras $2 $3 "$4" "$5" "$6" "$7"
