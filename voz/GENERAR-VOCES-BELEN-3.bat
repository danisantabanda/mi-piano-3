@echo off
setlocal
rem MI PIANO 3 - Belen, voces nuevas de M4 (progresion del Salon, modos, museo, tienda). Copiar a E:\CLONACION DE VOZ junto a
rem belen3_dani.json, guion-belen-3.json y fusionar_manifiesto.py. Misma tanda mipiano2-dani: salta lo ya hecho.
rem El manifiesto se FUSIONA con el que ya esta publicado (no se pierden las voces de Belen 1 y 2).
cd /d "%~dp0"
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1
set HF_HOME=%~dp0modelos\hf
set HF_HUB_DISABLE_SYMLINKS_WARNING=1
set PY=".venv-chatterbox\Scripts\python.exe"
set "SALIDA=E:\APP ECO FAMILIAR\APP\eco-familiar-app\pruebas\mi-piano-3\voces"
set "TEMP2=%~dp0salidas\belen3-empaque"
echo  [1/4] Bach: frases nuevas de Belen 3
%PY% chatterbox_voces.py --modo todo --frases belen3_dani.json --motor v3 --voz daniel-vanegas-v1 --tomas 2 --nombre mipiano2-dani || goto :error
echo  [2/4] Whisper escoge la mejor toma
".venv\Scripts\python.exe" elegir_tomas.py salidas\chatterbox\mipiano2-dani
echo  [3/4] Empacar aparte (Opus 32 kbps, recorte de silencios)
if exist "%TEMP2%" rmdir /s /q "%TEMP2%"
%PY% empacar_mipiano2.py guion-belen-3.json "%TEMP2%" || goto :error
echo  [4/4] Copiar los audios y FUSIONAR el manifiesto con el publicado
copy /y "%TEMP2%\*.ogg" "%SALIDA%\" > nul || goto :error
%PY% fusionar_manifiesto.py "%SALIDA%\manifiesto.js" "%TEMP2%\manifiesto.js" "%SALIDA%\manifiesto.js" || goto :error
echo  LISTO. Voces en %SALIDA%  (publicar con publicar-app.bat)
pause
exit /b 0
:error
echo  !! Algo fallo. Mira salidas\chatterbox\registro.txt
pause
exit /b 1
