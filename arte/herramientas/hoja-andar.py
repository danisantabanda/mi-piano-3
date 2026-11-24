# Hoja de andar de Gemini (fondo verde, cuadrícula) -> PNG pequeño para el juego (3 filas: abajo, der, arriba x 4 cuadros).
# Uso: python hoja-andar.py entrada.jpg salida.png filas cols "r,c r,c r,c r,c|..." altoAbajo altoDer altoArriba [anchoDer]
import sys
import numpy as np
from PIL import Image
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from croma import quitar_verde, componentes

ent, sal, F, C = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
grupos = [[tuple(map(int, rc.split(','))) for rc in g.split()] for g in sys.argv[5].split('|')]
altos = [int(v) for v in sys.argv[6:9]]
anchoDer = int(sys.argv[9]) if len(sys.argv) > 9 else 0
im = Image.open(ent).convert('RGB')
cw, ch = im.width / C, im.height / F

def figura(r, c):
    celda = quitar_verde(im.crop((int(c * cw), int(r * ch), int((c + 1) * cw), int((r + 1) * ch))))
    cajas = componentes(celda, 2000)
    cajas.sort(key=lambda b: (b[2] - b[0]) * (b[3] - b[1]), reverse=True)
    x0, y0, x1, y1 = cajas[0]
    from scipy import ndimage
    arr = np.asarray(celda).copy()
    m = arr[..., 3] > 60
    lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=1))
    if n > 1:   # quita rayitas sueltas (marcas de movimiento): solo la figura más grande
        tam = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
        arr[..., 3] = np.where(lab == 1 + int(np.argmax(tam)), arr[..., 3], 0)
        celda = Image.fromarray(arr, 'RGBA')
    a = np.asarray(celda.getchannel('A'))[y0:y1, x0:x1] > 60
    ys, xs = np.nonzero(a)
    return celda.crop((x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1))

filas = []
for gi, g in enumerate(grupos):
    figs = [figura(r, c) for r, c in g]
    hmax = max(f.height for f in figs)
    k = altos[gi] / hmax
    if gi == 1 and anchoDer:
        k = min(k, anchoDer / max(f.width for f in figs))
    filas.append([f.resize((max(1, round(f.width * k)), max(1, round(f.height * k))), Image.LANCZOS) for f in figs])
CW = max(f.width for fl in filas for f in fl) + 2
CH = max(f.height for fl in filas for f in fl) + 1
hoja = Image.new('RGBA', (CW * 4, CH * len(filas)), (0, 0, 0, 0))
for ri, fl in enumerate(filas):
    for ci, f in enumerate(fl):
        hoja.alpha_composite(f, (ci * CW + (CW - f.width) // 2, ri * CH + CH - f.height))
a = np.asarray(hoja).copy()
a[..., 3] = np.where(a[..., 3] > 110, 255, 0)
rgb = Image.fromarray(a[..., :3].copy()).quantize(40, Image.MEDIANCUT).convert('RGB')
out = np.dstack([np.asarray(rgb), a[..., 3]])
Image.fromarray(out.astype(np.uint8), 'RGBA').save(sal, optimize=True)
print(sal, 'celda', CW, CH, 'hoja', hoja.size)
