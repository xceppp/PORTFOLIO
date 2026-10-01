from PIL import Image, ImageChops, ImageEnhance, ImageFilter, ImageOps
import os

base = r'c:\Users\hp\Desktop\PORTF\public\logos'


def punch_white(im, thr=245):
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            if min(r, g, b) >= thr:
                px[x, y] = (255, 255, 255, 0)
            elif min(r, g, b) > 225 and max(r, g, b) - min(r, g, b) < 22:
                px[x, y] = (r, g, b, 0)
    return im


def trim(im, pad=2):
    a = im.split()[-1]
    box = a.getbbox()
    if not box:
        # fallback: non-white
        bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
        diff = ImageChops.difference(im.convert('RGBA'), bg).convert('L')
        box = diff.point(lambda p: 255 if p > 10 else 0).getbbox()
    if not box:
        return im
    l, t, r, b = box
    return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))


# --- UMI mark from clean icon ---
umi = Image.open(os.path.join(base, 'umi-icon.png')).convert('RGBA')
umi = punch_white(umi, thr=248)
umi = trim(umi, pad=4)
umi.save(os.path.join(base, 'umi-mark.png'), 'PNG')
print('umi-mark', umi.size)

# --- EST mark: crop leftover UMI fragment from current est-mark ---
est = Image.open(os.path.join(base, 'est-mark.png')).convert('RGBA')
est = punch_white(est, thr=248)
# Find first column where EST graphic density is high and not just the orange I-dot
px = est.load()
w, h = est.size
col_scores = []
for x in range(w):
    score = 0
    for y in range(h):
        r, g, b, a = px[x, y]
        if a > 30 and min(r, g, b) < 240:
            score += 1
    col_scores.append(score)

# find a gap after the left fragment then content resume
threshold = max(4, int(h * 0.08))
start = 0
seen = False
gap = 0
for x, s in enumerate(col_scores):
    if s > threshold:
        if not seen:
            seen = True
        elif gap >= 6:
            start = x
            break
        gap = 0
    elif seen:
        gap += 1

# Prefer cutting near ~18% if auto failed
if start < 20:
    start = int(w * 0.18)
est = trim(est.crop((start, 0, w, h)), pad=4)
est.save(os.path.join(base, 'est-mark.png'), 'PNG')
print('est-mark', est.size, 'cut@', start)

# Combined preview aligned by vertical center
th = 160
umi_r = umi.resize((int(umi.width * th / umi.height), th), Image.Resampling.LANCZOS)
est_r = est.resize((int(est.width * th / est.height), th), Image.Resampling.LANCZOS)
gap = 22
combo = Image.new('RGBA', (umi_r.width + gap + est_r.width + 16, th + 16), (0, 0, 0, 0))
combo.paste(umi_r, (8, 8), umi_r)
combo.paste(est_r, (8 + umi_r.width + gap, 8), est_r)
combo.save(os.path.join(base, 'umi-est.png'), 'PNG')
print('umi-est', combo.size)

# --- ENSA: aggressive cream/noise punch + ink boost ---
ensa = Image.open(os.path.join(base, 'ensa.png')).convert('RGBA')
px = ensa.load()
w, h = ensa.size
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a < 8:
            continue
        mx, mn = max(r, g, b), min(r, g, b)
        avg = (r + g + b) / 3
        # cream plate / speckles
        if avg > 210 and (mx - mn) < 45:
            px[x, y] = (r, g, b, 0)
        elif avg > 190 and (mx - mn) < 28:
            px[x, y] = (r, g, b, 0)
ensa = punch_white(ensa, thr=235)
a = ensa.split()[-1].filter(ImageFilter.MedianFilter(3))
r, g, b, _ = ensa.split()
ensa = Image.merge('RGBA', (r, g, b, a))
ensa = trim(ensa, pad=6)
# darken for light-mode mono readability
ensa = ImageEnhance.Contrast(ensa).enhance(1.25)
ensa = ImageEnhance.Brightness(ensa).enhance(0.92)
ensa.save(os.path.join(base, 'ensa.png'), 'PNG')
print('ensa', ensa.size)
print('done')
