from pathlib import Path
from PIL import Image


def knock_white(src: Path, dst: Path, threshold: int = 245) -> None:
    im = Image.open(src).convert('RGBA')
    pixels = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                pixels[x, y] = (r, g, b, 0)
            elif r > 230 and g > 230 and b > 230:
                fade = int(255 * (threshold - min(r, g, b)) / max(1, threshold - 230))
                pixels[x, y] = (r, g, b, max(0, min(255, fade)))
    im.save(dst, 'PNG')
    print(f'wrote {dst.name} {im.size}')


base = Path(__file__).resolve().parents[1] / 'public' / 'logos'
for name in ('esi2a.png', 'euromed.png', 'fst.png', 'ensa.png'):
    path = base / name
    if path.exists():
        knock_white(path, path)
print('done')
