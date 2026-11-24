# hoja de contacto: todas las ilustraciones en miniatura, en el orden del encargo
import sys
from PIL import Image, ImageDraw, ImageFont
ORDEN = ['s-pixel16','s-hd2d','s-25d','s-iso','w-islas','w-tren','w-libro','p-cenital','p-calle','p-plaza','i-corte','i-cenital','i-iso','a-epocas',
 'c-robot','c-bach','c-ninos','c-rival','c-familia','sc-inicio','sc-salon-a','sc-salon-b','sc-practica-a','sc-practica-b','sc-camino','sc-tarjetas',
 'sc-pads','sc-eco','sc-banda','sc-estudio','sc-acierto','sc-error','sc-cofre','sc-casa','sc-informe']
D = sys.argv[1]
if len(sys.argv) > 2 and sys.argv[2] == '5':
    ORDEN = ['pal-a','pal-b','pal-c','pal-d','mapa-a','mapa-b','mapa-c','heraldica','llave','ciudad-tipo','edificios','rival-duelo','luthier','c-trajes','premio-a','premio-b','premio-c','premio-d','insignias','avance-a','avance-b','avance-c','primer-dia','estrellita-llegar']
SALIDA = '_contacto5.jpg' if len(sys.argv) > 2 else '_contacto.jpg'
cols = 5; tw, th = 320, 180; pad = 14; lab = 26
rows = (len(ORDEN) + cols - 1) // cols
out = Image.new('RGB', (cols * (tw + pad) + pad, rows * (th + lab + pad) + pad), '#1c1030'); d = ImageDraw.Draw(out)
try: f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
except Exception: f = None
for i, n in enumerate(ORDEN):
    x = pad + (i % cols) * (tw + pad); y = pad + (i // cols) * (th + lab + pad)
    try: im = Image.open(f'{D}/{n}.jpg').resize((tw, th), Image.LANCZOS); out.paste(im, (x, y))
    except Exception: d.rectangle([x, y, x + tw, y + th], outline='#ff5a5a', width=3)
    d.text((x, y + th + 4), f'{i+1} · {n}', fill='#fff3b0', font=f)
out.save(f'{D}/' + SALIDA, quality=82, optimize=True); print(out.size)
