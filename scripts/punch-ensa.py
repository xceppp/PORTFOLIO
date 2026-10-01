from PIL import Image, ImageEnhance
import os

path = r'c:\Users\hp\Desktop\PORTF\public\logos\ensa.png'
im = Image.open(path).convert('RGBA')
w, h = im.size
px = im.load()

for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a < 8:
            continue
        avg = (r + g + b) / 3.0
        spread = max(r, g, b) - min(r, g, b)
        # kill cream / white / pale pattern everywhere
        if avg >= 200 and spread <= 55:
            px[x, y] = (0, 0, 0, 0)
        elif avg >= 235:
            px[x, y] = (0, 0, 0, 0)

a = im.split()[-1]
box = a.getbbox()
if box:
    l, t, r, b = box
    im = im.crop((max(0, l - 4), max(0, t - 4), min(w, r + 4), min(h, b + 4)))

# Boost ink for light-mode mono conversion
im = ImageEnhance.Contrast(im).enhance(1.3)
im = ImageEnhance.Color(im).enhance(1.05)
im.save(path, 'PNG')
print('ensa', im.size, 'alpha bbox ok')
