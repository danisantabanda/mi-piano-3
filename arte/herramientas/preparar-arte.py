# M7: de arte/gemini/ (originales 1376x768) a src/arte/ (lo que el build mete en el HTML).
# Fondos: WebP 1280 de ancho. Recortes de personajes (fondo verde): WebP con transparencia, sin los rótulos de texto.
import sys, os
import numpy as np
from PIL import Image
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from croma import quitar_verde, componentes
G = os.path.join(AQUI, '..', 'gemini'); S = os.path.join(AQUI, '..', '..', 'src', 'arte')
os.makedirs(S, exist_ok=True)

FONDOS = {  # nombre en el juego: archivo de gemini
    'titulo': '6-titulo', 'premio': 'premio',
    'int-salon': 'int-salon', 'int-coro': 'int-coro', 'int-teatro': 'int-teatro', 'int-patio': 'int-patio',
    'int-taller': 'int-taller', 'int-conservatorio': 'int-conservatorio', 'int-torre': 'int-torre',
    'int-ritmo': 'int-ritmo', 'int-biblioteca': 'int-biblioteca', 'int-arena': 'int-arena',
    'int-gimnasio': 'int-gimnasio', 'int-museo': 'int-museo',
    'casa-panaderia': 'casa-panaderia', 'casa-cuarto': 'casa-cuarto', 'casa-taller': 'casa-taller', 'casa-corral': 'casa-corral',
}
for n, f in FONDOS.items():
    im = Image.open(os.path.join(G, f + '.jpg')).convert('RGB')
    if im.width > 1280: im = im.resize((1280, round(im.height * 1280 / im.width)), Image.LANCZOS)
    im.save(os.path.join(S, n + '.webp'), 'WEBP', quality=72, method=6)

def figuras(archivo):
    im = quitar_verde(Image.open(os.path.join(G, archivo)))
    cajas = [b for b in componentes(im, 9000) if b[3] - b[1] > 110]       # los rótulos son bajitos: fuera
    cajas.sort(key=lambda b: (round(b[1] / 150), b[0]))                   # por filas, de izquierda a derecha
    return im, cajas

def guardar(im, caja, nombre, alto):
    x0, y0, x1, y1 = caja
    f = im.crop((max(0, x0 - 2), max(0, y0 - 2), x1 + 2, y1 + 2))
    filas = (np.asarray(f.getchannel('A')) > 60).any(axis=1)
    vacias = np.nonzero(~filas)[0]
    # rótulo pegado debajo: tras un hueco de filas vacías, lo de abajo es bajito -> fuera
    for y in range(int(f.height * 0.6), f.height - 4):
        if not filas[y:y + 4].any() and filas[y + 4:].sum() < 45:
            f = f.crop((0, 0, f.width, y)); break
    bb = f.getchannel('A').point(lambda v: 255 if v > 60 else 0).getbbox(); f = f.crop(bb)
    k = alto / f.height
    f = f.resize((round(f.width * k), alto), Image.LANCZOS)
    f.save(os.path.join(S, nombre + '.webp'), 'WEBP', quality=82, method=6)

im, cajas = figuras('m7-selector-verde.jpg')
print('selector', len(cajas), cajas[:6])
for i, n in [(0, 'sel-sarah'), (1, 'sel-david'), (2, 'sel-papa'), (5, 'sel-mama')]:
    guardar(im, cajas[i], n, 260)
im, cajas = figuras('m7-bach-tic-verde.jpg')
print('bach/tic', len(cajas))
for i, n in enumerate(['bach-contento', 'bach-dirige', 'bach-aplaude', 'bach-piensa', 'bach-rie', 'bach-senala',
                       'tic-contento', 'tic-pendulo', 'tic-cuenta', 'tic-sorpresa', 'tic-baila', 'tic-senala']):
    guardar(im, cajas[i], n, 230 if n.startswith('bach') else 150)
tot = 0
for f in sorted(os.listdir(S)):
    t = os.path.getsize(os.path.join(S, f)); tot += t
    print(f'{f:28s} {t/1024:7.1f} KB')
print('total', round(tot / 1024), 'KB')
