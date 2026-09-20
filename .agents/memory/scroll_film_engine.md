# Scroll Film Engine & Hero First Tile Specification

> **Source of Truth**: Younoya Website Identity Document (Updated 2026-09-20)

---

## 1. First Tile Hero Concept & Narrative Arc

The first tile introduces the emotional and sensory world of Younoya through an interactive scroll-scrubbed hero film:

- **Core Message**:  
  > *“Astrology-backed gifting, curated for what matters. Each Younoya hamper is a thoughtful combination of 2–3 meaningful products, chosen with intention and guided by astrological insight.”*

- **Visual Subject**:  
  A beautifully arranged **gift hamper** (basket/tray) containing **2–3 meaningful products** (signature metallic ruby-red apple candle `1A8A2284.JPG`, ornate carved brass urn crowned with purple amethyst crystal cluster `1A8A2075.JPG`, and sacred gold ceremonial heirloom keepsake `1A8A2150.JPG`).
  
- **Atmosphere**:  
  Dark, luxury celestial environment (midnight ink navy, deep plum, subtle smoky violet). Subtle golden astrological motifs (constellation dots, fine stardust, orbital light arcs) illuminate as the visitor scrolls.

- **Negative Space Rule**:  
  - **Desktop (16:9)**: Hamper positioned on the right half, leaving generous clean dark negative space on the left for H1, subtext, and CTA buttons.
  - **Mobile (9:16)**: Hamper framed in the lower-middle portion, preserving clean breathing room at top and bottom for UI headers and CTAs.

---

## 2. Scroll Scrubbing Progression (0.0 to 1.0)

| Scroll Band | Visual State | Editorial Headline / Copy | Primary Action |
|---|---|---|---|
| **0% – 20%** | Hamper resting in soft amber rim light, dark celestial background | *“Astrology-backed gifting, curated for what matters.”* | Scroll indicator |
| **20% – 50%** | Subtle camera push-in, illumination blooms, first product (ruby apple candle) gently highlighted | *“Each hamper is a thoughtful combination of 2–3 meaningful products.”* | — |
| **50% – 80%** | Celestial constellation arcs and stardust ignite, raw amethyst and sacred gold keepsake illuminated | *“Chosen with intention. Guided by astrology.”* | — |
| **80% – 100%** | Hamper fully revealed in golden celestial radiance, soft cosmic glow | *“Discover your personalised gift hamper.”* | `[Build My Hamper]` `[Explore Gift Hampers]` |

---

## 3. Reference Frames & Production Media

- **Keyframe Assets**:
  - **Desktop 16:9 Reference**:  
    `creative/younoya-scroll-film/younoya-hamper-hero-landscape-16x9.jpg`  
    `younoya-web/public/media/younoya-hamper-hero-landscape-16x9.jpg`
  - **Mobile 9:16 Reference**:  
    `creative/younoya-scroll-film/younoya-hamper-hero-portrait-9x16.jpg`  
    `younoya-web/public/media/younoya-hamper-hero-portrait-9x16.jpg`
- **Video Specifications**:
  - Duration: **10–12 seconds** continuous render.
  - Framerate: 24 fps, silent, H.264 / WebM VP9.
  - **Strict Rule**: Zero baked-in text, typography, prices, or logos in the video file. All typography and interactive buttons are rendered dynamically in React.
- **Static Poster Fallback**:
  - High-resolution WebP/JPG posters deployed so low-bandwidth or `prefers-reduced-motion` users immediately see the pristine hero state with active CTAs.

---

## 4. Blob Seeking Architecture (CRITICAL)

Static HTTP hosts (Cloudflare Pages, standard edge CDNs) often struggle with byte-range requests (`206 Partial Content`) on scrubbing video elements, which can freeze playback on frame zero.

**Mandatory Browser-Memory Blob Pattern**:
```javascript
useEffect(() => {
  let objectUrl;
  const videoSrc = isMobile
    ? '/media/younoya-hamper-hero-mobile.mp4'
    : '/media/younoya-hamper-hero-desktop.mp4';

  fetch(videoSrc)
    .then((res) => res.blob())
    .then((blob) => {
      objectUrl = URL.createObjectURL(blob);
      setFilmSrc(objectUrl);
    })
    .catch((err) => console.warn('Blob seek fallback to direct source', err));

  return () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  };
}, [isMobile]);
```
This ensures zero-latency forward and backward scrubbing across all desktop and mobile browsers.
