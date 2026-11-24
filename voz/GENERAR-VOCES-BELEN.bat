@echo off
setlocal
rem MI PIANO 3 - Belen: voz de Bach (Dani, daniel-vanegas-v1). Copiar a E:\CLONACION DE VOZ junto a belen_dani.json y guion-belen.json.
rem Tic no se graba (pitidos sintetizados en el juego). Si se corta, doble clic otra vez: salta lo hecho.
cd /d "%~dp0"
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1
set HF_HOME=%~dp0modelos\hf
set HF_HUB_DISABLE_SYMLINKS_WARNING=1
set PY=".venv-chatterbox\Scripts\python.exe"
set "SALIDA=E:\APP ECO FAMILIAR\APP\eco-familiar-app\pruebas\mi-piano-3\voces"
echo  [1/3] Bach: frases de Belen (las mismas carpetas de Mi Piano 2; los id son nuevos)
%PY% chatterbox_voces.py --modo todo --frases belen_dani.json --motor v3 --voz daniel-vanegas-v1 --tomas 2 --nombre mipiano2-dani || goto :error
echo  [2/3] Whisper escoge la mejor toma
".venv\Scripts\python.exe" elegir_tomas.py salidas\chatterbox\mipiano2-dani
echo  [3/3] Empacar (solo las frases de Bach): Opus 32 kbps + manifiesto
%PY% -c "import json;g=json.load(open('guion-belen.json',encoding='utf-8'));g['frases']=[f for f in g['frases'] if f['personaje']=='bach'];json.dump(g,open('guion-belen-bach.json','w',encoding='utf-8'),ensure_ascii=False)" || goto :error
%PY% empacar_mipiano2.py guion-belen-bach.json "%SALIDA%" || goto :error
echo  LISTO. Las voces quedaron en %SALIDA%
pause
exit /b 0
:error
echo  !! Algo fallo. Mira salidas\chatterbox\registro.txt
pause
exit /b 1
