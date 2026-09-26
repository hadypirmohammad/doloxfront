"""Generate Dolox 'D' favicon assets."""
from PIL import Image, ImageDraw
import os

OUT = os.path.join(os.path.dirname(__file__), '..', 'public')
NAVY = (36, 59, 83, 255)  # #243b53
ORANGE = (255, 94, 0, 255)  # #FF5E00
WHITE = (255, 255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)


def draw_d_icon(size: int) -> Image.Image:
    img = Image.new('RGBA', (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(img)

    pad = max(1, round(size * 0.02))
    radius = max(2, round(size * 0.22))
    draw.rounded_rectangle(
        [pad, pad, size - 1 - pad, size - 1 - pad],
        radius=radius,
        fill=NAVY,
    )

    left = size * 0.22
    top = size * 0.18
    right = size * 0.78
    bottom = size * 0.72
    stem = size * 0.18
    bowl_r = size * 0.16

    outer = Image.new('RGBA', (size, size), TRANSPARENT)
    od = ImageDraw.Draw(outer)
    od.rounded_rectangle([left, top, right, bottom], radius=bowl_r, fill=WHITE)
    od.rectangle([left, top, left + stem + size * 0.08, bottom], fill=WHITE)

    counter = Image.new('L', (size, size), 0)
    cd = ImageDraw.Draw(counter)
    c_left = left + stem
    c_top = top + size * 0.12
    c_right = right - size * 0.14
    c_bottom = bottom - size * 0.12
    c_r = max(1, size * 0.08)
    cd.rounded_rectangle([c_left, c_top, c_right, c_bottom], radius=c_r, fill=255)

    outer_px = outer.load()
    for y in range(size):
        for x in range(size):
            if counter.getpixel((x, y)) > 128:
                outer_px[x, y] = TRANSPARENT

    img = Image.alpha_composite(img, outer)

    draw = ImageDraw.Draw(img)
    bar_h = max(2, round(size * 0.07))
    bar_y = size * 0.78
    bar_x0 = size * 0.26
    bar_x1 = size * 0.74
    draw.rounded_rectangle(
        [bar_x0, bar_y, bar_x1, bar_y + bar_h],
        radius=max(1, bar_h // 2),
        fill=ORANGE,
    )
    return img


SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Dolox">
  <rect width="64" height="64" rx="14" fill="#243b53"/>
  <path fill="#FFFFFF" d="M14.1 11.5h24.3c6.9 0 12.5 5.2 12.5 13.4v14.2c0 8.2-5.6 13.4-12.5 13.4H14.1V11.5zm11.5 8.3v24.4h11.7c3.9 0 6.7-2.9 6.7-7.5V27.3c0-4.6-2.8-7.5-6.7-7.5H25.6z"/>
  <rect x="16.6" y="50" width="30.8" height="4.5" rx="2.25" fill="#FF5E00"/>
</svg>
'''


def main() -> None:
    os.makedirs(OUT, exist_ok=True)

    with open(os.path.join(OUT, 'favicon.svg'), 'w', encoding='utf-8') as f:
        f.write(SVG)

    images = {s: draw_d_icon(s) for s in (16, 32, 48, 64, 180)}
    images[32].save(os.path.join(OUT, 'favicon-32.png'), 'PNG')
    images[180].save(os.path.join(OUT, 'apple-touch-icon.png'), 'PNG')

    ico_path = os.path.join(OUT, 'favicon.ico')
    # Pillow builds ICO sizes by downscaling the source image.
    images[48].save(
        ico_path,
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    print('wrote', ico_path, os.path.getsize(ico_path), 'bytes')
    print('wrote favicon.svg, favicon-32.png, apple-touch-icon.png')


if __name__ == '__main__':
    main()
