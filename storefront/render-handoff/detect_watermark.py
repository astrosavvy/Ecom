#!/usr/bin/env python3
"""
Detect the Gemini/Veo watermark location by scanning the bottom-right region of a
sample frame for bright/textured pixels against the surrounding darkness.

Outputs the (x, y, w, h) rectangle to feed into ffmpeg's delogo filter.
"""
import pathlib
import sys

from PIL import Image

if len(sys.argv) < 2:
    print("usage: python detect_watermark.py <frame.png>"); sys.exit(1)

img = Image.open(sys.argv[1]).convert("RGB")
W, H = img.size
px = img.load()
print(f"image: {W}x{H}")

# scan only the bottom 25% + right 50% (common watermark zones)
x0, y0 = W // 2, int(H * 0.75)
luma_grid = []
for y in range(y0, H):
    row = []
    for x in range(x0, W):
        r, g, b = px[x, y]
        # perceptual luma
        row.append(0.299 * r + 0.587 * g + 0.114 * b)
    luma_grid.append(row)

# find bright outliers (mean luma ~40 for night scenes; watermark pixels ~120+)
flat = [v for row in luma_grid for v in row]
mean = sum(flat) / len(flat)
thr = mean + 35   # pixels significantly brighter than the scene average
print(f"region luma: mean={mean:.1f}  threshold={thr:.1f}")

bright_pts = [
    (x0 + ix, y0 + iy)
    for iy, row in enumerate(luma_grid)
    for ix, v in enumerate(row)
    if v > thr
]

if not bright_pts:
    print("no watermark detected in the scanned region")
    sys.exit(0)

xs = [p[0] for p in bright_pts]
ys = [p[1] for p in bright_pts]
pad = 6
x = max(0, min(xs) - pad)
y = max(0, min(ys) - pad)
w = min(W - x, max(xs) - min(xs) + pad * 2)
h = min(H - y, max(ys) - min(ys) + pad * 2)
print(f"watermark bbox: x={x} y={y} w={w} h={h}  ({len(bright_pts)} bright pixels)")
print(f"ffmpeg delogo: x={x}:y={y}:w={w}:h={h}")
