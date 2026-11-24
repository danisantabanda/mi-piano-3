# Procesa un original de Gemini (arte/nuevo/original) → arte/nuevo/listo (WebP ≤1280 px) y anota en manifiesto.json.
# Uso: python3 procesar.py MODO nombre id_gemini "uso" "pantalla" "personaje" "pose1,pose2,…" [filas cols]
#  MODO hoja   : cuadrícula estricta filas×cols sobre verde → hoja WebP con transparencia (celdas iguales, pies alineados)
#  MODO figuras: verde → cada figura suelta (de izquierda a derecha, por filas) como WebP con transparencia, nombradas por pose
#  MODO fondo  : ilustración completa → WebP 1280 de ancho
#  MODO objeto : verde → una sola figura recortada
import sys, os, json
import numpy as np
from PIL import Image
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, '..', 'herramientas'))
from croma import quitar_verde, componentes, recortar
modo, nombre, idg, uso, pantalla, quien = sys.argv[1:7]
poses = [p for p in (sys.argv[7] if len(sys.argv) > 7 else '').split(',') if p]
O = os.path.join(AQUI, 'original', nombre + '.jpg'); L = os.path.join(AQUI, 'listo')
MAN = os.path.join(AQUI, 'manifiesto.json')
man = json.load(open(MAN)) if os.path.exists(MAN) else []
SOLO = os.environ.get('SOLO')   # las poses traen el personaje: «pastor-quieto» → pastor-quieto.webp (personaje según QUIENES)
QUIENES = dict(q.split('=') for q in os.environ.get('QUIENES', '').split(';') if '=' in q)
def anota(archivo, pose):
    global man
    man = [m for m in man if m['archivo'] != archivo]
    pj = QUIENES.get(pose.split('-')[0], quien) if SOLO else quien
    man.append({'archivo': archivo, 'uso': uso, 'pantalla': pantalla, 'personaje': pj, 'pose': pose.split('-', 1)[1] if SOLO and '-' in pose else pose, 'id_gemini': idg, 'original': 'original/' + nombre + '.jpg'})
def guarda(im, archivo, q=80):
    if max(im.size) > 1280: k = 1280 / max(im.size); im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    im.save(os.path.join(L, archivo), 'WEBP', quality=q, method=6)
def limpia(im):   # solo la figura más grande de la celda (quita rayitas sueltas)
    from scipy import ndimage
    a = np.asarray(im).copy(); m = a[..., 3] > 60
    lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=int(os.environ.get("DIL", "3"))))
    if n > 1:
        tam = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); keep = 1 + int(np.argmax(tam))
        a[..., 3] = np.where(lab == keep, a[..., 3], 0)
    return Image.fromarray(a, 'RGBA')
im = Image.open(O)
if modo == 'fondo':
    im = im.convert('RGB')
    if im.width > 1280: im = im.resize((1280, round(im.height * 1280 / im.width)), Image.LANCZOS)
    guarda(im, nombre + '.webp', 76); anota(nombre + '.webp', poses[0] if poses else 'fondo')
elif modo == 'hoja':
    F, C = int(sys.argv[8]), int(sys.argv[9]); a = quitar_verde(im); cw, ch = a.width / C, a.height / F
    celdas = []
    for r in range(F):
        for c in range(C):
            cel = limpia(a.crop((int(c * cw), int(r * ch), int((c + 1) * cw), int((r + 1) * ch))))
            celdas.append((cel, cel.getchannel('A').point(lambda v: 255 if v > 60 else 0).getbbox()))
    W = max(b[2] - b[0] for _, b in celdas if b) + 8; H = max(b[3] - b[1] for _, b in celdas if b) + 8
    hoja = Image.new('RGBA', (W * C, H * F), (0, 0, 0, 0))
    for k, (cel, b) in enumerate(celdas):
        if not b: continue
        fig = cel.crop(b); r, c = divmod(k, C)
        hoja.paste(fig, (c * W + (W - fig.width) // 2, r * H + H - 4 - fig.height), fig)   # centrada y con los pies abajo
    guarda(hoja, nombre + '.webp', 85); anota(nombre + '.webp', 'hoja %dx%d: %s' % (F, C, ','.join(poses) or 'abajo,izquierda,derecha,arriba'))
else:
    a = quitar_verde(im)
    if modo == 'objeto':
        guarda(recortar(limpia(a)), nombre + '.webp', 85); anota(nombre + '.webp', poses[0] if poses else 'objeto')
    else:
        cajas = [b for b in componentes(a, 6000) if b[3] - b[1] > 60]
        alto = np.median([b[3] - b[1] for b in cajas]) if cajas else 1
        cajas.sort(key=lambda b: (round(b[1] / (alto * .8)), b[0]))
        for k, b in enumerate(cajas):
            p = poses[k] if k < len(poses) else 'extra%d' % k
            fig = recortar(limpia(a.crop(b))); f = (p if SOLO else nombre + '-' + p) + '.webp'; guarda(fig, f, 85); anota(f, p)
        print(len(cajas), 'figuras', '(esperadas %d)' % len(poses))
json.dump(sorted(man, key=lambda m: m['archivo']), open(MAN, 'w'), ensure_ascii=False, indent=1)
print('ok', nombre)
