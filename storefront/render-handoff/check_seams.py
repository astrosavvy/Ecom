#!/usr/bin/env python3
"""
Triage check: does each dive's frame 0 actually match the still it was
conditioned on? (SKILL Step 8 seam QA, first half.)

Compares stills_raw/still_<n>.png against frames/first_<n>.png on a small
RGB grid. Mean-abs-diff guide:  <14 excellent · 14-22 fine (codec shimmer)
                                22-35 suspicious · >35 likely ignored start-frame
"""
import pathlib

from PIL import Image

HERE = pathlib.Path(__file__).parent
NAMES = ["threshold", "intent", "cosmos", "seek", "reveal", "companion"]
GW, GH = 48, 32


def sig(img):
    return list(img.resize((GW, GH), Image.LANCZOS).getdata())


def mad(a, b):
    return sum(abs(pa[i] - pb[i]) for pa, pb in zip(a, b) for i in range(3)) / (len(a) * 3)


def main():
    print(f"{'scene':<11} {'mean-abs-diff':>13}  verdict")
    for n in NAMES:
        s = HERE / "stills_raw" / f"still_{n}.png"
        f = HERE / "frames" / f"first_{n}.png"
        if not (s.exists() and f.exists()):
            print(f"{n:<11}  MISSING INPUTS")
            continue
        d = mad(sig(Image.open(s).convert("RGB")), sig(Image.open(f).convert("RGB")))
        v = "excellent" if d < 14 else "fine" if d < 22 else "SUSPICIOUS - eyeball it" if d < 35 else "LIKELY IGNORED START FRAME - re-roll"
        print(f"{n:<11} {d:>13.1f}  {v}")


if __name__ == "__main__":
    main()
