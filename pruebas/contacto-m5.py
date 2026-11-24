# Hoja de contacto de M5: capturas/m5/_contacto.jpg (miniaturas numeradas con su descripción)
import json, os, sys
from PIL import Image, ImageDraw, ImageFont
SAL = os.environ.get('SALIDA', 'm5')
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'capturas', SAL)
L = json.load(open(os.path.join(D, 'lista.json'))); L.sort()
cols = 5; tw, th = 384, 240; pad = 10; cab = 46
rows = (len(L) + cols - 1) // cols
img = Image.new('RGB', (cols * (tw + pad) + pad, rows * (th + cab + pad) + pad + 60), '#1c1030')
dr = ImageDraw.Draw(img)
def fuente(t):
    for f in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']:
        if os.path.exists(f): return ImageFont.truetype(f, t)
    return ImageFont.load_default()
F, F2 = fuente(13), fuente(26)
dr.text((pad, 14), 'Mi Piano 3 · ' + ({'m5b': 'M5b · el manual de marca en el juego', 'm6': 'M6 · contenido: variación, edificios distintos, casas', 'm7': 'M7 · arte nuevo (ilustraciones de Gemini)'}.get(SAL, 'M5 «Belén grande»')) + ' — pantallas (1280×800)', fill='#ffe9b0', font=F2)
for k, (f, r) in enumerate(L):
    x = pad + (k % cols) * (tw + pad); y = 60 + pad + (k // cols) * (th + cab + pad)
    im = Image.open(os.path.join(D, f)).convert('RGB').resize((tw, th), Image.LANCZOS); img.paste(im, (x, y))
    t = f.replace('.png', '') + ' · ' + r; lines = []; cur = ''
    for w in t.split(' '):
        if dr.textlength(cur + w, font=F) > tw - 4: lines.append(cur); cur = ''
        cur += w + ' '
    lines.append(cur)
    for i, ln in enumerate(lines[:3]): dr.text((x + 2, y + th + 2 + i * 15), ln.strip(), fill='#fbf1d8', font=F)
img.save(os.path.join(D, '_contacto.jpg'), quality=84)
print(img.size)
