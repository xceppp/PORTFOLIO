"""Strip ENSA patterned plate + frame so mono theme filters stay clean."""
from PIL import Image
import subprocess

path = r'c:\Users\hp\Desktop\PORTF\public\logos\ensa.png'
raw = subprocess.check_output(
    ['git', 'show', 'HEAD:public/logos/ensa.png'],
    cwd=r'c:\Users\hp\Desktop\PORTF',
)
src = path.replace('ensa.png', 'ensa-src.png')
open(src, 'wb').write(raw)
im = Image.open(src).convert('RGBA')
px = im.load()
w, h = im.size

for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a < 10:
            px[x, y] = (0, 0, 0, 0)
            continue
        avg = (r + g + b) / 3.0
        sat = max(r, g, b) - min(r, g, b)
        keep = (
            (avg < 95 and a > 40)
            or (sat >= 40 and avg < 230)
            or (r > 140 and g > 60 and b < 120 and sat > 35)
            or (b > r + 15 and b > g and sat > 25 and avg < 180)
        )
        if keep:
            if a < 200:
                px[x, y] = (r, g, b, min(255, a + 80))
        else:
            px[x, y] = (0, 0, 0, 0)

# Drop isolated vertical frame lines
for x in range(w):
    ys = [y for y in range(h) if px[x, y][3] > 40]
    if len(ys) < 40:
        continue
    left = sum(1 for y in range(h) if x > 0 and px[x - 1, y][3] > 40)
    right = sum(1 for y in range(h) if x + 1 < w and px[x + 1, y][3] > 40)
    if left == 0 and right == 0:
        for y in range(h):
            px[x, y] = (0, 0, 0, 0)

# Drop thin horizontal frame rows near edges
for y in list(range(0, 14)) + list(range(h - 14, h)):
    xs = [x for x in range(w) if px[x, y][3] > 40]
    if len(xs) > 100:
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 0 and max(r, g, b) - min(r, g, b) < 55:
                px[x, y] = (0, 0, 0, 0)

for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a < 30:
            px[x, y] = (0, 0, 0, 0)
        elif a >= 120:
            px[x, y] = (r, g, b, 255)

box = im.split()[-1].getbbox()
if box:
    l, t, r0, b0 = box
    im = im.crop((max(0, l - 4), max(0, t - 4), min(w, r0 + 4), min(h, b0 + 4)))

canvas = Image.new('RGBA', (300, 100), (0, 0, 0, 0))
scale = min(276 / im.width, 82 / im.height)
nw, nh = max(1, int(im.width * scale)), max(1, int(im.height * scale))
im2 = im.resize((nw, nh), Image.Resampling.LANCZOS)
canvas.paste(im2, ((300 - nw) // 2, (100 - nh) // 2), im2)
canvas.save(path, 'PNG')
import os

os.remove(src)
print('ensa cleaned', canvas.size)
