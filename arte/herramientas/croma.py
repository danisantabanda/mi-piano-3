# Quita el fondo verde (#00FF00) con alfa suave y sin halo verde (despill). Uso como módulo.
import numpy as np
from PIL import Image
def quitar_verde(im):
    a = np.asarray(im.convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    dom = g - np.maximum(r, b)                      # cuánto domina el verde
    alfa = np.clip(1 - (dom - 40) / 90, 0, 1)        # >130: fondo · <40: figura · entre: borde suave
    g2 = np.where(dom > 0, np.maximum(r, b) + np.minimum(dom, 0) , g)   # despill: el verde no pasa del mayor de r/b
    g2 = np.minimum(g, np.maximum(r, b) * 1.05 + 4)
    out = np.dstack([r, g2, b, alfa * 255]).clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')
def recortar(im, pad=2):
    bb = im.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox()
    if not bb: return im
    x0, y0, x1, y1 = bb; return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))
def componentes(im, minimo=400):
    """cajas de las figuras separadas (por la máscara de alfa)"""
    from scipy import ndimage
    m = np.asarray(im.getchannel('A')) > 60
    lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=6))
    cajas = []
    for sl in ndimage.find_objects(lab):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if h * w >= minimo: cajas.append((sl[1].start, sl[0].start, sl[1].stop, sl[0].stop))
    return cajas
