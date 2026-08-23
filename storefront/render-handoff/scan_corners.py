#!/usr/bin/env python3
"""Scan all 4 corners + edges for any watermark pattern."""
import sys
from PIL import Image

img = Image.open(sys.argv[1]).convert("RGB")
W, H = img.size
px = img.load()
print(f"image: {W}x{H}")

zones = {
    "TR": (int(W*0.78), int(H*0.00), W, int(H*0.10)),
    "TL": (0, int(H*0.00), int(W*0.22), int(H*0.10)),
    "BR": (int(W*0.78), int(H*0.90), W, H),
    "BL": (0, int(H*0.90), int(W*0.22), H),
    "B-strip": (0, int(H*0.93), W, H),  # full bottom strip
}
for name,(x0,y0,x1,y1) in zones.items():
    bright=0; total=(x1-x0)*(y1-y0); mx=0
    for y in range(y0,y1):
        for x in range(x0,x1):
            r,g,b=px[x,y]; l=0.299*r+0.587*g+0.114*b
            if l>140: bright+=1
            mx=max(mx,l)
    print(f"{name:8} region {x0},{y0}-{x1},{y1}: bright(>140)={bright}/{total} ({100*bright/total:.1f}%)  maxL={mx:.0f}")
