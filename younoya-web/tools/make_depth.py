#!/usr/bin/env python3
"""Generate monocular depth maps for the 6 scene stills with Depth Anything V2.

Runs fully local (CPU is fine, ~1 min per image). Downloads the small HF
checkpoint once (~100 MB) into the default cache.

Input : assets-src/stills/still_<id>.png
Output: public/scenes/<id>-d.webp   grayscale depth, 640w, near = bright
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).parent.parent
SRC = ROOT / "assets-src" / "stills"
OUT = ROOT / "public" / "scenes"
IDS = ["threshold", "intent", "cosmos", "seek", "reveal", "companion"]

MODEL = "depth-anything/Depth-Anything-V2-Small-hf"


def main() -> int:
    try:
        import torch
        from transformers import pipeline
    except ImportError as e:
        print(f"[deps] missing: {e}\n  pip install torch transformers")
        return 1

    OUT.mkdir(parents=True, exist_ok=True)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"[depth] loading {MODEL} on {device} ...")
    pipe = pipeline("depth-estimation", model=MODEL, device=device)

    for sid in IDS:
        src = SRC / f"still_{sid}.png"
        if not src.exists():
            print(f"- skip {sid}: no still")
            continue
        print(f"[depth] {sid} ...", flush=True)
        result = pipe(Image.open(src).convert("RGB"))
        # predicted_depth: tensor HxW (relative); image output already normalised
        arr = np.array(result["depth"]).astype(np.float32)
        arr -= arr.min()
        m = arr.max()
        if m > 0:
            arr /= m
        # Depth Anything outputs disparity-like values where NEAR = bright already;
        # keep orientation, just encode.
        img = Image.fromarray((arr * 255).astype(np.uint8), mode="L")
        w = 640
        h = round(img.height * w / img.width)
        img = img.resize((w, h), Image.LANCZOS)
        dst = OUT / f"{sid}-d.webp"
        img.save(dst, "WEBP", quality=72, method=6)
        print(f"  -> {dst.name} {dst.stat().st_size/1024:.0f} KB")

    print("[depth] done")
    return 0


if __name__ == "__main__":
    sys.exit(main())
