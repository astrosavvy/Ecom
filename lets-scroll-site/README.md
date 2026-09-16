# YOUNOYA — lets-scroll Standalone Experience

Standalone, zero-dependency scroll-scrubbed camera flight website built per the `lets-scroll` skill specification.

## Architecture

- **Scroll-Driven Flight**: Uses `mountLetsScroll` (`scrub-engine.js`) to scrub time through continuous video and atmospheric scenes without visible cuts.
- **Blob Seekability**: Videos are loaded as Blobs in memory, ensuring full seekability across all browsers and static hosting environments without requiring HTTP byte-range support.
- **Mobile Hardening**: Auto-coalesces seeks on coarse pointers and touch viewports, primes video on first user interaction for iOS Safari, and falls back cleanly under `prefers-reduced-motion`.
- **Atmosphere & Pacing**: Custom starfield drifting particles, per-section `linger` time remapping, and luxury color tokens (`#07080E`, `#D4AF37`, `#FFFBF0`).

## Running Locally

From `f:\Savvy_Ecom\lets-scroll-site`:
```bash
python -m http.server 3000
```
Then navigate to: `http://localhost:3000`

## Production Storefront Integration

The engine and experience are also integrated directly into the production Vite storefront at:
- `/world`
- `/lets-scroll`
