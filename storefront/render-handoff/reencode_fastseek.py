#!/usr/bin/env python3
"""
Re-encodes all video clips in storefront/assets/vid/ for zero-latency scroll scrubbing.
Uses All-Intra (-g 1) + fastdecode + faststart so seeking backwards or forwards takes 0-2ms.
"""
import pathlib
import subprocess
import tempfile
import sys
import shutil

HERE = pathlib.Path(__file__).parent
VID_DIR = HERE.parent / "assets" / "vid"

CLIPS = [
    "threshold.mp4",
    "intent.mp4",
    "cosmos.mp4",
    "seek.mp4",
    "reveal.mp4",
    "companion.mp4",
    "conn1.mp4",
    "conn2.mp4",
    "conn3.mp4",
    "conn4.mp4",
    "conn5.mp4"
]

def reencode_clip(filename):
    src_path = VID_DIR / filename
    if not src_path.exists():
        print(f"Skipping {filename} (not found)")
        return False

    orig_size = src_path.stat().st_size
    temp_dir = pathlib.Path(tempfile.gettempdir())
    temp_dst = temp_dir / f"fastseek_{filename}"

    cmd = [
        "ffmpeg", "-v", "error", "-y", "-i", str(src_path),
        "-an",
        "-c:v", "libx264",
        "-preset", "medium",
        "-tune", "fastdecode",
        "-crf", "22",
        "-g", "1",
        "-keyint_min", "1",
        "-sc_threshold", "0",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(temp_dst)
    ]

    print(f"Encoding {filename} with All-Intra (-g 1 + fastdecode)...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"[ERROR] Failed {filename}: {res.stderr}")
        return False

    new_size = temp_dst.stat().st_size
    shutil.move(str(temp_dst), str(src_path))
    
    orig_kb = orig_size // 1024
    new_kb = new_size // 1024
    print(f"[OK] {filename}: {orig_kb} KB -> {new_kb} KB (All-Intra Zero-Lag Seek Ready)")
    return True

def main():
    if shutil.which("ffmpeg") is None:
        print("[ERROR] ffmpeg is not found on PATH.")
        sys.exit(1)

    print("=" * 60)
    print("STARTING ZERO-LAG ALL-INTRA VIDEO RE-ENCODING")
    print("=" * 60)

    count = 0
    for clip in CLIPS:
        if reencode_clip(clip):
            count += 1

    print("=" * 60)
    print(f"Successfully re-encoded {count}/{len(CLIPS)} video clips!")
    print("=" * 60)

if __name__ == "__main__":
    main()
