/* Botón «Instalar» (solo en la versión web): aparece en «¿Quién toca hoy?» si el juego no está instalado. */
(function () {
  var DEF = null;
  var css = '#mp-inst{position:fixed;left:max(16px,env(safe-area-inset-left));bottom:max(16px,env(safe-area-inset-bottom));z-index:50;font:700 18px Outfit,system-ui,sans-serif;color:#2a1a3a;background:#ffd046;border:3px solid #2a1a3a;border-radius:14px;box-shadow:4px 4px 0 #2a1a3a;padding:10px 16px;cursor:pointer}'
    + '#mp-inst:active{transform:translate(3px,3px);box-shadow:1px 1px 0 #2a1a3a}'
    + '#mp-inst-m{position:fixed;inset:0;z-index:60;background:rgba(28,16,48,.6);display:flex;align-items:center;justify-content:center;padding:16px}'
    + '#mp-inst-m div{max-width:460px;background:#fffaf0;color:#2a1a3a;border:3px solid #2a1a3a;border-radius:18px;box-shadow:6px 6px 0 #2a1a3a;padding:22px;font:500 17px/1.5 Outfit,system-ui,sans-serif}'
    + '#mp-inst-m button{margin-top:14px;font:700 17px Outfit,system-ui,sans-serif;background:#ff5a5a;color:#fff;border:3px solid #2a1a3a;border-radius:12px;box-shadow:3px 3px 0 #2a1a3a;padding:8px 18px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var b = document.createElement('button'); b.id = 'mp-inst'; b.type = 'button'; b.textContent = '📲 Instalar'; b.hidden = true;
  document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(b); });
  var esStandalone = function () { return matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches && !document.fullscreenElement || navigator.standalone === true; };
  var ios = function () { return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); };
  function como() {
    if (ios()) return 'En el iPad o iPhone, abre esta página en <b>Safari</b>, toca <b>Compartir</b> (el cuadrito con la flecha) y luego <b>Agregar a pantalla de inicio</b>.';
    if (/Android/i.test(navigator.userAgent)) return 'Toca el menú <b>⋮</b> de Chrome (arriba a la derecha) y luego <b>Instalar app</b> o <b>Agregar a la pantalla principal</b>.';
    return 'En Chrome o Edge, toca el ícono de instalar en la barra de dirección, o el menú <b>⋮</b> → <b>Instalar Mi Piano</b>.';
  }
  function pintar() { var sel = !!(window.__mp3 && window.__mp3.escena && window.__mp3.escena() === 'selector'); b.hidden = esStandalone() || !sel; }
  b.addEventListener('click', function (e) {
    e.stopPropagation();
    if (DEF) { DEF.prompt(); DEF.userChoice.finally(function () { DEF = null; pintar(); }); return; }
    var m = document.createElement('div'); m.id = 'mp-inst-m';
    m.innerHTML = '<div><b>Para instalar Mi Piano:</b><br>' + como() + '<br><button type="button">Listo</button></div>';
    m.querySelector('button').addEventListener('click', function () { m.remove(); }); document.body.appendChild(m);
  });
  addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); DEF = e; pintar(); });
  addEventListener('appinstalled', function () { DEF = null; pintar(); });
  setInterval(pintar, 700);
})();
