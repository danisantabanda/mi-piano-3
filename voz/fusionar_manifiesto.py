# -*- coding: utf-8 -*-
"""Fusiona dos voces/manifiesto.js (window.VOCES = {...};): el existente (Belén 1) + el nuevo (Belén 2). Lo nuevo gana si se repite un id.
   python fusionar_manifiesto.py <manifiesto_existente.js> <manifiesto_nuevo.js> <salida.js>"""
import json, re, sys
def leer(p):
    try:
        t = open(p, encoding='utf-8').read()
    except FileNotFoundError:
        return {}
    m = re.search(r'window\.VOCES\s*=\s*(\{.*\}|null)\s*;', t, re.S)
    return (json.loads(m.group(1)) or {}) if m else {}
a, b = leer(sys.argv[1]), leer(sys.argv[2])
a.update(b)
open(sys.argv[3], 'w', encoding='utf-8').write('/* fusionado: Belen 1 + Belen 2 */\nwindow.VOCES = %s;\n' % json.dumps(a, ensure_ascii=False))
print('manifiesto fusionado:', len(a), 'voces')
