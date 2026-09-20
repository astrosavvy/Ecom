# Glossary & Luxury Design Tokens

## 1. Color Palette (SSOT)
- **Midnight Black**: `#050403` (Primary canvas background)
- **Obsidian Surface**: `#100B07` (Cards, drawers, navigation rail)
- **Velvet Surface**: `#230B09` (Active selection highlights)
- **Porcelain Text**: `#F5EEE2` (Primary typography)
- **Warm Muted Text**: `#C0B4A3` / `#A99B8B` (Secondary copy & labels)
- **Champagne Gold**: `#D6B06A` / `#D5AE63` (Borders, accents, cues)
- **Highlight Gold**: `#F0D294` / `#F0D08F` (Glows, cursor dot)
- **Ruby Signal**: `#A41517` / `#B7271E` (Single warm accent, CTAs)
- **Gold Hairline**: `rgba(225, 190, 119, 0.18)`

## 2. Typography Hierarchy
- **Editorial Headings**: Cormorant Garamond (`italic` and `regular`), Cinzel (sparingly for brand identity).
- **Interface Labels**: Plus Jakarta Sans, `font-weight: 600` / `700`, uppercase with generous tracking (`0.18em`–`0.22em`).
- **Body Text**: Plus Jakarta Sans / Inter, `15px`–`17px`, `1.6` line-height.

## 3. Interaction Nomenclature
- **Cursor Aura**: Dual-element pointer (`cursor-dot` 5px gold point + `cursor-ring` 34px/52px expanding ring). Disabled on touch/coarse devices.
- **Scroll Scrubbing**: Mapping scroll offset directly to `video.currentTime`.
- **Card Ring**: CSS 3D perspective cylinder (`transform-style: preserve-3d`) rotating on scroll.
