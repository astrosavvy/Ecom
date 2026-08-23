#!/usr/bin/env python3
"""
Final encode pass (SKILL Step 6 + pipeline.md §6b) -- run after ALL clips render.

Reads   raw/dive_<name>.mp4  raw/conn_<i>.mp4          (masters, any res)
        raw/dive_<name>-m.mp4 raw/conn_<i>-m.mp4        (portrait masters)
Writes  ../assets/vid/<name>.mp4   ../assets/vid/conn<i>.mp4      crf20, GOP 8
        ../assets/vid/<name>-m.mp4 ../assets/vid/conn<i>-m.mp4    720w, GOP 4, crf23

Settings follow the skill exactly: native resolution (never upscale), light
unsharp to counter video softness, no audio, faststart. The tight mobile GOP
is what makes phone seeks cheap; blob-loading in scrub-engine.js makes HTTP
byte-range support irrelevant.

Requires ffmpeg on PATH.  Usage:  python encode_all.py
"""
import pathlib
import subprocess
import shutil
import sys

HERE = pathlib.Path(__file__).parent
RAW = HERE / "raw"
OUT = HERE.parent / "assets" / "vid"

NAMES = ["threshold", "intent", "cosmos", "seek", "reveal", "companion"]
NCONN = 5


def enc(src, dst, mobile=False):
    if not src.exists():
        print(f"- {src.name}: missing (skipped)")
        return False
    OUT.mkdir(parents=True, exist_ok=True)
    if mobile:
        vf = "scale=720:-2,unsharp=5:5:0.6:5:5:0.0"
        gop, crf = "4", "23"
    else:
        vf = "unsharp=5:5:0.8:5:5:0.0"
        gop, crf = "8", "20"
    cmd = [
        "ffmpeg", "-v", "error", "-y", "-i", str(src),
        "-an", "-vf", vf,
        "-c:v", "libx264", "-preset", "slow", "-crf", crf,
        "-pix_fmt", "yuv420p",
        "-g", gop, "-keyint_min", gop, "-sc_threshold", "0",
        "-movflags", "+faststart", str(dst),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"[FAIL] {src.name}:", r.stderr[-400:])
        return False
    kb = dst.stat().st_size // 1024
    print(f"+ {dst.name}  ({kb//1024} MB {kb%1024} KB)" if kb > 2048 else f"+ {dst.name}  ({kb} KB)")
    return True


def main():
    if shutil.which("ffmpeg") is None:
        print("[FAIL] ffmpeg not on PATH — winget install Gyan.FFmpeg")
        sys.exit(1)
    done = 0
    total = 0
    for n in NAMES:
        total += 2
        done += enc(RAW / f"dive_{n}.mp4", OUT / f"{n}.mp4")
        done += enc(RAW / f"dive_{n}-m.mp4", OUT / f"{n}-m.mp4", mobile=True)
    for i in range(1, NCONN + 1):
        total += 2
        done += enc(RAW / f"conn_{i}.mp4", OUT / f"conn{i}.mp4")
        done += enc(RAW / f"conn_{i}-m.mp4", OUT / f"conn{i}-m.mp4", mobile=True)
    print(f"\n{done}/{total} clips encoded into storefront/assets/vid/")
    if done < total:
        print("Missing masters stay skipped — the site keeps running on stills until they land.")


if __name__ == "__main__":
    main()
