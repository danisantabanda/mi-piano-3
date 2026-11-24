// =====================================================================
//  MI PIANO 3 · «El viaje de Bach» · E1 · MOTOR
//  Lienzo lógico 1280×800 (siempre horizontal), escenas, cámara, toques, transiciones, guardado.
//  Mundo isométrico SUAVE (vector prerenderizado en capas) + personajes y detalles en PÍXEL.
// =====================================================================
const LW5 = 1280, LH5 = 800, T5 = 32;   // T5 = media anchura de una baldosa
const lienzo5 = document.getElementById('juego'), cx5 = lienzo5.getContext('2d');
let ESCALA5 = 1, OFX5 = 0, OFY5 = 0, DPR5 = 1, MAXDPR5 = 1.5;
function ajustar5() {
  DPR5 = Math.min(window.devicePixelRatio || 1, MAXDPR5);
  lienzo5.width = Math.round(innerWidth * DPR5); lienzo5.height = Math.round(innerHeight * DPR5);
  lienzo5.style.width = innerWidth + 'px'; lienzo5.style.height = innerHeight + 'px';
  ESCALA5 = Math.min(lienzo5.width / LW5, lienzo5.height / LH5); OFX5 = (lienzo5.width - LW5 * ESCALA5) / 2; OFY5 = (lienzo5.height - LH5 * ESCALA5) / 2;
  const ui = document.getElementById('ui'); const k = ESCALA5 / DPR5; ui.style.transform = 'translate(' + (OFX5 / DPR5) + 'px,' + (OFY5 / DPR5) + 'px) scale(' + k + ')';
}
addEventListener('resize', ajustar5);
// ---------- guardado (por perfil) ----------
const GUARDA = (() => { let d = {}; try { d = JSON.parse(localStorage.getItem('mipiano3') || '{}') || {}; } catch (e) { d = {}; } d.perfiles = d.perfiles || {};
  return { d, perfil() { const p = d.perfil; if (!p) return null; return d.perfiles[p] || (d.perfiles[p] = { visto: {}, secretos: {}, lugar: 'natal' }); }, guardar() { try { localStorage.setItem('mipiano3', JSON.stringify(d)); } catch (e) { } } }; })();
// ---------- escenas ----------
let ESC = null, TRANS = null, RELOJ = 0, VEL5 = 1;   // VEL5: acelera el tiempo del juego (solo pruebas)
function irA(esc, o = {}) {
  const cambiar = () => { if (typeof DIALOGO5 !== 'undefined') DIALOGO5.abierto = false; if (ESC && ESC.salir) ESC.salir(); ESC = esc; if (esc.entrar) esc.entrar(o); };
  if (o.sinTransicion || !ESC) { cambiar(); return; }
  TRANS = { t: 0, dur: o.dur || .6, medio: false, alMedio: cambiar, tipo: o.tipo || 'iris', x: o.x || LW5 / 2, y: o.y || LH5 / 2 };
}
function dibujarTransicion(ctx, dt) {
  if (!TRANS) return; TRANS.t += dt; const p = TRANS.t / TRANS.dur;
  if (!TRANS.medio && p >= .5) { TRANS.medio = true; TRANS.alMedio(); }
  const q = p < .5 ? p * 2 : 2 - p * 2;   // 0 → 1 → 0
  ctx.save();
  if (TRANS.tipo === 'iris') { ctx.fillStyle = '#1c1030'; ctx.beginPath(); ctx.rect(0, 0, LW5, LH5); ctx.arc(TRANS.x, TRANS.y, Math.max(0, (1 - q) * 900), 0, Math.PI * 2, true); ctx.fill('evenodd'); }
  else { ctx.fillStyle = 'rgba(28,16,48,' + q + ')'; ctx.fillRect(0, 0, LW5, LH5); }
  ctx.restore();
  if (p >= 1) TRANS = null;
}
// M7c · una imagen rota o sin cargar nunca rompe un cuadro (drawImage lanzaría InvalidStateError)
(function () { const di = CanvasRenderingContext2D.prototype.drawImage; CanvasRenderingContext2D.prototype.drawImage = function (img) {
  if (img && typeof HTMLImageElement !== 'undefined' && img instanceof HTMLImageElement && (!img.complete || !img.naturalWidth)) return;
  if (img && (img.width === 0 || img.height === 0)) return;
  try { return di.apply(this, arguments); } catch (e) { (window.__errores5 = window.__errores5 || []).push('drawImage: ' + e.message); } }; })();
// ---------- bucle ----------
let ULT5 = 0; const FPS5 = { n: 0, t: 0, valor: 60, cuadros: [] };
function cuadro5(ts) {
  if (typeof FPSAUTO5 !== 'undefined' && FPSAUTO5.nivel >= 2 && ULT5 && ts - ULT5 < 28) { requestAnimationFrame(cuadro5); return; }   // a 30 cuadros si no aguanta
  const dtReal = Math.min(.05, ULT5 ? (ts - ULT5) / 1000 : .016), dt = dtReal * VEL5; ULT5 = ts; RELOJ += dt;
  if (typeof FPSAUTO5 !== 'undefined' && VEL5 === 1) FPSAUTO5.paso(dtReal);
  FPS5.n++; FPS5.t += dtReal; FPS5.cuadros.push(dtReal * 1000); if (FPS5.cuadros.length > 240) FPS5.cuadros.shift(); if (FPS5.t >= 1) { FPS5.valor = FPS5.n / FPS5.t; FPS5.n = 0; FPS5.t = 0; }
  const ctx = cx5; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#1c1030'; ctx.fillRect(0, 0, lienzo5.width, lienzo5.height);
  ctx.setTransform(ESCALA5, 0, 0, ESCALA5, OFX5, OFY5);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, LW5, LH5); ctx.clip();
  if (typeof SIM5 !== 'undefined') SIM5.paso(dt);   // el niño simulado toca ANTES de que la escena avance (a velocidad alta no se le pasan las notas)
  try { if (ESC && ESC.dibujar) ESC.dibujar(ctx, dt); VIGIA5.errores = 0; }
  catch (e) {   // M7b: un error en una escena ya no congela el juego (antes mataba el bucle: pantalla quieta y teclado sin pintar)
    VIGIA5.errores++; if (VIGIA5.ultimo !== e.message) { VIGIA5.ultimo = e.message; console.error('escena', e); (window.__errores5 = window.__errores5 || []).push(String(e && e.stack || e).slice(0, 300)); }
    try { if (ctx.reset) ctx.reset(); } catch (er) { } ctx.setTransform(ESCALA5, 0, 0, ESCALA5, OFX5, OFY5);
    if (VIGIA5.errores > 20) VIGIA5.roto = true;
  }
  try { if (typeof MUSICA5 !== 'undefined') MUSICA5.paso(); dibujarTransicion(ctx, dt); if (hayAtasco5()) avisoSeguir5(ctx); } catch (e) { console.error(e); }
  ctx.restore();
  requestAnimationFrame(cuadro5);
}
// ---------- vigilante: nada se queda sin salida ----------
// roto: la escena falla cuadro tras cuadro; atasco: una actividad no avanza hace rato y nadie toca. En ambos casos «¡Toca para seguir!»
const VIGIA5 = { errores: 0, ultimo: '', roto: false };
function atascado5() { if (!ESC) return null; if (ESC.atasco) return ESC; if (ESC.panel && ESC.panel.atasco) return ESC.panel; return null; }
function hayAtasco5() { return VIGIA5.roto || !!atascado5(); }
function rescatar5() {
  const a = atascado5(); if (a && a.saltarPaso && !VIGIA5.roto) { try { a.saltarPaso(); return; } catch (e) { } }
  VIGIA5.roto = false; VIGIA5.errores = 0;
  try { if (ESC && ESC.saltarPaso && !ESC.fin) { ESC.saltarPaso(); return; } } catch (e) { }
  const B = typeof LUGARES5 !== 'undefined' && LUGARES5.belen; if (!B) return; B.panel = null; B.auto = false; B.alEntrar = null; if (ESC !== B) irA(B, { tipo: 'fundido' });
}
function avisoSeguir5(ctx) {
  const y = 470 + Math.sin(RELOJ * 4) * 4; ctx.save(); ctx.fillStyle = 'rgba(28,16,48,.35)'; ctx.fillRect(0, 0, LW5, LH5); ctx.restore();
  if (typeof caja5 === 'function') { caja5(ctx, LW5 / 2 - 230, y - 44, 460, 88, { r: 26, borde: 5, sombra: 8, fondo: '#ffd046' }); titulo5(ctx, '¡Toca para seguir!', LW5 / 2, y + 2, 44, '#2a1a3a'); }
}
// ---------- toques (dedo o mouse) → coordenadas lógicas ----------
let ARR5 = null;
const aLogico = e => { const r = lienzo5.getBoundingClientRect(); return [((e.clientX - r.left) * DPR5 - OFX5) / ESCALA5, ((e.clientY - r.top) * DPR5 - OFY5) / ESCALA5]; };
lienzo5.addEventListener('pointerdown', e => {
  if (TRANS) return; const [x, y] = aLogico(e);
  if (x < 0 || y < 0 || x > LW5 || y > LH5) return;
  if (hayAtasco5()) { rescatar5(); return; }   // «¡Toca para seguir!»
  if (ESC && ESC.arrastrar) { ARR5 = { x0: x, y0: y, x, y, mov: 0 }; return; }   // escenas que se desplazan (el mapa): toque al soltar
  if (ESC && ESC.tocar) ESC.tocar(x, y);
});
addEventListener('pointermove', e => { if (!ARR5) return; const [x, y] = aLogico(e); const dx = x - ARR5.x, dy = y - ARR5.y; ARR5.x = x; ARR5.y = y; ARR5.mov += Math.abs(dx) + Math.abs(dy); if (ARR5.mov > 10 && ESC && ESC.arrastrar) ESC.arrastrar(dx, dy); });
addEventListener('pointerup', e => { if (!ARR5) return; const a = ARR5; ARR5 = null; if (a.mov <= 10 && ESC && ESC.tocar) ESC.tocar(a.x0, a.y0); });
['contextmenu', 'selectstart', 'dblclick', 'gesturestart'].forEach(t => addEventListener(t, e => e.preventDefault(), { passive: false }));
addEventListener('touchmove', e => { if (!e.target.closest('.desliza')) e.preventDefault(); }, { passive: false });
// ---------- texto ----------
function titulo5(ctx, t, x, y, tam = 40, c = '#3a2414', o = {}) { ctx.save(); ctx.font = '700 ' + tam + 'px Crimson'; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; if (o.borde) { ctx.lineJoin = 'round'; ctx.lineWidth = o.borde; ctx.strokeStyle = o.bordeC || '#fbf1d8'; ctx.strokeText(t, x, y); } ctx.fillStyle = c; ctx.fillText(t, x, y); ctx.restore(); }
// cinta de pergamino con un título (el nombre del lugar)
function cinta5(ctx, t, x, y, w = 300) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
  ctx.beginPath(); ctx.moveTo(x - 18, y - 24); ctx.lineTo(x + w + 18, y - 24); ctx.lineTo(x + w + 4, y); ctx.lineTo(x + w + 18, y + 24); ctx.lineTo(x - 18, y + 24); ctx.lineTo(x - 4, y); ctx.closePath(); ctx.fillStyle = '#d2452e'; ctx.fill(); ctx.restore();
  ctx.save(); rr(ctx, x, y - 26, w, 52, 6); ctx.fillStyle = lg(ctx, 0, y - 26, 0, y + 26, [[0, '#fbf1d8'], [1, '#e8d2a0']]); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#3a2414'; ctx.stroke(); ctx.strokeStyle = '#d9a930'; ctx.lineWidth = 2; rr(ctx, x + 5, y - 21, w - 10, 42, 4); ctx.stroke(); ctx.restore();
  titulo5(ctx, t, x + w / 2, y + 2, 30);
}
// botones redondos de la esquina (pausa, ajustes, mapa)
function botonRedondo5(ctx, x, y, icono, on) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3; ctx.beginPath(); ctx.arc(x, y, 30, 0, 7); ctx.fillStyle = '#fbf1d8'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, 30, 0, 7); ctx.lineWidth = 4; ctx.strokeStyle = '#3a2414'; ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 24, 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = '#d9a930'; ctx.stroke();
  ctx.fillStyle = '#3a2414'; ctx.strokeStyle = '#3a2414';
  if (icono === 'pausa') { rr(ctx, x - 10, y - 12, 7, 24, 2); ctx.fill(); rr(ctx, x + 3, y - 12, 7, 24, 2); ctx.fill(); }
  if (icono === 'ajustes') { ctx.lineWidth = 5; for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9); ctx.lineTo(x + Math.cos(a) * 15, y + Math.sin(a) * 15); ctx.stroke(); } ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.lineWidth = 5; ctx.stroke(); }
  if (icono === 'mapa') { ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 14, y - 10); ctx.lineTo(x - 5, y - 14); ctx.lineTo(x + 5, y - 10); ctx.lineTo(x + 14, y - 14); ctx.lineTo(x + 14, y + 10); ctx.lineTo(x + 5, y + 14); ctx.lineTo(x - 5, y + 10); ctx.lineTo(x - 14, y + 14); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 5, y - 14); ctx.lineTo(x - 5, y + 10); ctx.moveTo(x + 5, y - 10); ctx.lineTo(x + 5, y + 14); ctx.stroke(); ctx.fillStyle = '#d2452e'; ctx.beginPath(); ctx.arc(x + 9, y - 2, 3, 0, 7); ctx.fill(); }
  if (icono === 'salir') { ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 8, y - 12); ctx.lineTo(x - 6, y); ctx.lineTo(x + 8, y + 12); ctx.stroke(); }
  ctx.restore();
}
const BOTONES5 = [['pausa', LW5 - 50, 48], ['ajustes', LW5 - 122, 48], ['mapa', LW5 - 194, 48]];
function hud5(ctx, nombre, o = {}) { if (nombre) cinta5(ctx, nombre, 44, 50, o.w || Math.max(220, nombre.length * 15 + 60)); BOTONES5.forEach(([ic, x, y]) => { if (ic === 'mapa' && o.sinMapa) return; botonRedondo5(ctx, x, y, ic); }); }
function tocaHud5(x, y, o = {}) { for (const [ic, bx, by] of BOTONES5) if (Math.hypot(x - bx, y - by) < 34) { if (ic === 'mapa' && o.sinMapa) continue; if (ic === 'pausa') MENU5.abrir('pausa'); if (ic === 'ajustes') MENU5.abrir('papas'); if (ic === 'mapa') irA(ESCENA_MAPA, { tipo: 'fundido' }); return true; } return false; }
