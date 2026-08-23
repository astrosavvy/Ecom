#!/usr/bin/env python3
"""
Placeholder posters so the site is fully alive BEFORE any AI renders arrive.

Generates, per section:
  ../assets/<name>.webp    1536x1024 landscape poster (3:2)
  ../assets/<name>-m.webp  1080x1920 portrait poster  (9:16)

Design language: midnight field + per-section accent glow + faint gold ring
arcs + bokeh motes + film grain. No text, centered composition with headroom
-- deliberately abstract so real renders replace them without layout shifts.
"""
import math
import random
import pathlib

from PIL import Image, ImageDraw, ImageFilter

HERE = pathlib.Path(__file__).parent
ASSETS = HERE.parent / "assets"
ASSETS.mkdir(exist_ok=True)

BG = (11, 14, 24)          # #0B0E18 -- must equal page + prompt background
ACCENTS = {
    "threshold": (212, 175, 55),
    "intent": (232, 160, 191),
    "cosmos": (155, 181, 214),
    "seek": (52, 211, 153),
    "reveal": (245, 158, 11),
    "companion": (212, 175, 55),
}
GOLD = (212, 175, 55)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def base_canvas(w, h):
    """Vertical midnight gradient, slightly lifted toward the horizon line."""
    img = Image.new("RGB", (w, h))
    top = lerp(BG, (18, 23, 38), 0.9)
    mid = lerp(BG, (22, 28, 46), 0.5)
    px = img.load()
    for y in range(h):
        t = y / h
        c = lerp(top, mid, min(1.0, t * 1.6)) if t < 0.62 else lerp(mid, BG, (t - 0.62) / 0.38 * 0.7)
        for x in range(w):
            px[x, y] = c
    return img


def glow(img, cx, cy, r, color, strength=110):
    layer = Image.new("RGB", img.size, (0, 0, 0))
    d = ImageDraw.Draw(layer)
    steps = 40
    for i in range(steps, 0, -1):
        t = i / steps
        rr = r * t
        a = int(strength * (1 - t) ** 2)
        col = tuple(int(color[k] * a / 255) for k in range(3))
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=col)
    img.paste(ImageChops := layer.filter(ImageFilter.GaussianBlur(r * 0.12)), (0, 0))
    return img


def rings(img, cx, cy, radii, color=GOLD, alpha=42, dash=True):
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    w, h = img.size
    for r in radii:
        if dash:
            step = max(6, int(2 * math.pi * r / 90))
            seg = max(3, step // 3)
            for a0 in range(0, 360, step):
                a1 = a0 + seg
                bbox = [cx - r, cy - r, cx + r, cy + r]
                d.arc(bbox, a0, a1, fill=color + (alpha,), width=2)
        else:
            d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color + (alpha,), width=2)
    img.paste(Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB"), (0, 0))
    return img


def island_shadow(img, cx, cy, rw, rh):
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    d.ellipse([cx - rw, cy - rh, cx + rw, cy + rh], fill=(0, 0, 0, 160))
    img.paste(Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB"), (0, 0))
    return img


def bokeh(img, accent, n=26, seed=7):
    rnd = random.Random(seed)
    w, h = img.size
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    palette = [accent, GOLD, (245, 237, 224)]
    for _ in range(n):
        r = rnd.randint(2, 7)
        x = rnd.randint(int(w * 0.06), int(w * 0.94))
        y = rnd.randint(int(h * 0.10), int(h * 0.86))
        col = palette[rnd.randrange(len(palette))]
        a = rnd.randint(36, 120)
        d.ellipse([x - r, y - r, x + r, y + r], fill=col + (a,))
    ov = ov.filter(ImageFilter.GaussianBlur(1.2))
    img.paste(Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB"), (0, 0))
    return img


def grain(img, amount=5):
    rnd = random.Random(11)
    w, h = img.size
    noise = Image.new("L", (w // 2, h // 2))
    noise.putdata([128 + rnd.randint(-amount, amount) for _ in range((w // 2) * (h // 2))])
    noise = noise.resize((w, h)).filter(ImageFilter.GaussianBlur(0.4))
    return Image.composite(img.point(lambda v: min(255, v + 8)), img, noise)


def vignette(img):
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    m = int(min(w, h) * 0.16)
    d.ellipse([-m // 2, -m // 2, w + m // 2, h + m // 2], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(min(w, h) * 0.08))
    dark = img.point(lambda v: int(v * 0.82))
    return Image.composite(img, dark, mask)


def make(name, accent, landscape=True):
    if landscape:
        W, H = 1536, 1024          # 3:2
        cy_island = int(H * 0.56)  # headroom above
    else:
        W, H = 1080, 1920          # 9:16
        cy_island = int(H * 0.45)  # §6b: visual centre ~45% height

    img = base_canvas(W, H)

    # big soft accent glow behind the "island" position
    img = glow(img, W // 2, cy_island, int(W * 0.34), accent, strength=95)
    # secondary counter-glow low corner for depth
    img = glow(img, int(W * 0.82), int(H * 0.86), int(W * 0.20), GOLD, strength=34)

    # island contact shadow + implied ground line of light
    img = island_shadow(img, W // 2, cy_island + int(H * 0.055), int(W * 0.21), int(H * 0.02))

    # celestial ring arcs around the focal centre
    R = int(W * 0.30)
    img = rings(img, W // 2, cy_island, [int(R * 0.72), R, int(R * 1.28)], alpha=44)
    img = rings(img, W // 2, cy_island, [int(R * 0.46)], alpha=30)

    img = bokeh(img, accent, seed=sum(ord(c) for c in name))
    img = vignette(img)
    img = grain(img)

    out = ASSETS / (f"{name}.webp" if landscape else f"{name}-m.webp")
    img.save(out, "WEBP", quality=84, method=6)
    print("wrote", out.name, f"{W}x{H}")


def main():
    for name, acc in ACCENTS.items():
        make(name, acc, landscape=True)
        make(name, acc, landscape=False)
    print("\nPlaceholders ready. Real renders replace these same filenames via finalize_stills.py / encode_all.py.")


if __name__ == "__main__":
    main()
