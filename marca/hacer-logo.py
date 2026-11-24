# Logo de «Mi Piano · El viaje de Bach»: letras convertidas a trazos (Outfit Bold, SIL OFL 1.1) + teclado de 7 colores.
# Uso: python3 marca/hacer-logo.py   → marca/logo-principal.svg, logo-horizontal.svg, logo-icono.svg, logo-tinta.svg, logo-blanco.svg
import os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

AQUI = os.path.dirname(os.path.abspath(__file__))
FUENTE = TTFont(os.path.join(AQUI, '..', 'src', 'fuentes', 'Outfit-Bold.ttf'))
GS, CM, HM = FUENTE.getGlyphSet(), FUENTE.getBestCmap(), FUENTE['hmtx']
INK, PAPEL = '#2a1a3a', '#ffffff'
NOTAS = ['#ff5a5a', '#ff9a3c', '#ffd046', '#5fd36a', '#3fc7f0', '#5a7dff', '#b86bff']   # DO RE MI FA SOL LA SI

def letras(texto, x, y, tam, esp=0):
    """[(caracter, path, x0, ancho)] con la línea base en y"""
    k, out = tam / 1000.0, []
    for ch in texto:
        g = CM[ord(ch)]; adv = HM[g][0] * k
        pen = SVGPathPen(GS); GS[g].draw(TransformPen(pen, (k, 0, 0, -k, x, y)))
        out.append((ch, pen.getCommands(), x, adv)); x += adv + esp
    return out

def ancho(texto, tam, esp=0):
    k = tam / 1000.0
    return sum(HM[CM[ord(c)]][0] * k for c in texto) + esp * (len(texto) - 1)

def teclado(x, y, w, h, borde, colores=True, sombra=14):
    s = '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="%.1f" fill="%s"/>' % (x + sombra, y + sombra, w, h, h * .16, INK) if sombra else ''
    s += '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="%.1f" fill="%s"/>' % (x, y, w, h, h * .16, PAPEL)
    kw = w / 7
    s += '<clipPath id="kb%d"><rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="%.1f"/></clipPath><g clip-path="url(#kb%d)">' % (int(x), x, y, w, h, h * .16, int(x))
    for i in range(7):
        s += '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s"/>' % (x + i * kw, y, kw, h, NOTAS[i] if colores else PAPEL)
    for i in range(1, 7):
        s += '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s"/>' % (x + i * kw - borde * .35, y, borde * .7, h, INK)
    for i in [1, 2, 4, 5, 6]:   # teclas negras entre DO-RE, RE-MI, FA-SOL, SOL-LA, LA-SI
        bw = kw * .56
        s += '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="%.1f" fill="%s"/>' % (x + i * kw - bw / 2, y - 2, bw, h * .56, bw * .14, INK)
    s += '</g><rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="%.1f" fill="none" stroke="%s" stroke-width="%.1f"/>' % (x, y, w, h, h * .16, INK, borde)
    return s

def palabra(texto, x, y, tam, colores, sombra, tinta=INK):
    s = ''
    ls = letras(texto, x, y, tam)
    k = 0
    for ch, d, x0, a in ls:   # la sombra de cada letra es una nota (DO → SI)
        if ch == ' ': continue
        if colores: s += '<path transform="translate(%.1f %.1f)" d="%s" fill="%s" stroke="%s" stroke-width="%.1f" stroke-linejoin="round"/>' % (sombra, sombra, d, colores[k % 7], tinta, tam * .022)
        k += 1
    for ch, d, x0, a in ls:
        if ch != ' ': s += '<path d="%s" fill="%s"/>' % (d, tinta)
    return s

def etiqueta(texto, cx, cy, tam, rot, fondo=INK, letra=PAPEL, esp=None):
    esp = tam * .12 if esp is None else esp
    w = ancho(texto, tam, esp) + tam * 1.3; h = tam * 1.75
    s = '<g transform="rotate(%.1f %.1f %.1f)">' % (rot, cx, cy)
    s += '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="%.1f" fill="%s" stroke="%s" stroke-width="%.1f"/>' % (cx - w / 2, cy - h / 2, w, h, h * .22, fondo, INK, tam * .16)
    for ch, d, x0, a in letras(texto, cx - w / 2 + tam * .65, cy + tam * .36, tam, esp): s += '<path d="%s" fill="%s"/>' % (d, letra)
    return s + '</g>'

def svg(w, h, cuerpo, nombre):
    t = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d">%s</svg>' % (w, h, w, h, cuerpo)
    open(os.path.join(AQUI, nombre), 'w').write(t); return t

# 1 · principal (apilado): «Mi Piano» con sombras de 7 colores, teclado, etiqueta «EL VIAJE DE BACH»
T = 230; aw = ancho('Mi Piano', T); W = 1000
c = palabra('Mi Piano', (W - aw) / 2 - 6, 250, T, NOTAS, 13)
c += teclado(110, 318, 760, 150, 10)
c += etiqueta('EL VIAJE DE BACH', W / 2, 318, 46, -2.5)
svg(W, 520, c, 'logo-principal.svg')
# 2 · tinta (una sola tinta: para sellos, fax, fotocopia)
c = palabra('Mi Piano', (W - aw) / 2 - 6, 250, T, [PAPEL] * 7, 13)
c += teclado(110, 318, 760, 150, 10, colores=False)
c += etiqueta('EL VIAJE DE BACH', W / 2, 318, 46, -2.5)
svg(W, 520, c, 'logo-tinta.svg')
# 3 · horizontal: teclado-ícono a la izquierda + palabra
T2 = 150
c = teclado(16, 40, 250, 150, 9, sombra=11)
c += palabra('Mi Piano', 316, 150, T2, NOTAS, 9)
c += etiqueta('EL VIAJE DE BACH', 316 + ancho('Mi Piano', T2) / 2, 212, 30, -2)
svg(316 + int(ancho('Mi Piano', T2)) + 30, 250, c, 'logo-horizontal.svg')
# 4 · ícono (cuadrado): teclado de 7 colores + una negra grande (la figura dibujada de figuras.js)
import json, subprocess
NEGRA = json.loads(subprocess.check_output(['node', '-e', "console.log(JSON.stringify(require('./figuras.js').partes('negra').p.map(x=>x.d)))"], cwd=AQUI))
def icono(nombre, fondo, nota):
    c = '<rect x="34" y="34" width="440" height="440" rx="80" fill="%s"/><rect x="20" y="20" width="440" height="440" rx="80" fill="%s" stroke="%s" stroke-width="14"/>' % (INK, fondo, INK)
    c += teclado(62, 318, 356, 112, 9, sombra=0)
    c += '<g transform="translate(214 246) scale(66)" fill="%s" stroke="%s" stroke-width=".1" stroke-linejoin="round">%s</g>' % (nota, INK, ''.join('<path d="%s"/>' % d for d in NEGRA))
    svg(500, 500, c, nombre)
icono('logo-icono.svg', PAPEL, NOTAS[0])
icono('logo-icono-mi.svg', NOTAS[2], INK)
print('logos listos en', AQUI)
