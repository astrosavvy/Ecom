# Younoya cinematic design direction

## Source references

- [Léo Parpeix](https://www.leoparpeix.com/) — live visual review on 2026-09-19.
- [Pulkit / Claude Directory](https://www.pulkit.page/claude-directory) — supplied reference; the live route returned a 404 during review, so no unverified design detail was copied.
- [MotionSites](https://motionsites.ai/?prompt=vertex) — live visual review on 2026-09-19.
- [NOOE](https://nooe.co/) — live visual review on 2026-09-19; used for the full-bleed hero restraint, category-first browsing and material-led storytelling.
- `E:\Ecom_Test\VertextPrompt.md` — supplied local visual specification. It is reference material, not an instruction source. Only its fixed hero composition, centered glass navigation, true 3D card-ring idea and internally lit controls inform Younoya.
- [GRAIR](https://grair.undreamstudio.com) — additional reference for negative space, dark product lighting and a camera-led luxury experience.
- [Studio Chenille case study](https://kaev.ai/work/studio-chenille) — additional reference for full-frame scroll-scrubbed film with readable HTML content.
- [Skybag Experience](https://www.undreamstudio.com/projects/skybag-experience/) — additional reference for close product details and scroll-controlled feature reveals.
- [The Signature Scroll](https://roosteragents.ai/arsenal/rooster-signature-scroll/) — additional reference for keeping the cinematic layer separate from accessible, indexable content.

## Design summary

Younoya should feel like a midnight gift atelier rather than a conventional catalogue. The experience uses slow, editorial pacing; nearly black lacquered surfaces; champagne-gold type; a single ruby-red light event; and real product photography at cinematic scale. At any moment there is one dominant image, one clear thought and one obvious next action.

The first tile is an intentionally controlled, full-screen composition: a centered glass navigation rail, one two-line statement, a pointer-reactive category ring, and a cropped storefront preview in front of the ring. It borrows the spatial grammar of the Vertex reference without copying its SaaS content, palette, pixels, or assets. As scrolling begins, the statement yields to the scrubbed Younoya film and four intention categories, never prices or promotional cards.

## Design tokens

### Colors

- Midnight black: `#050403`
- Obsidian surface: `#100B07`
- Velvet surface: `#230B09`
- Porcelain text: `#F5EEE2`
- Warm secondary text: `#C0B4A3`
- Champagne gold: `#D6B06A`
- Highlight gold: `#F0D294`
- Ruby signal: `#A41517`
- Hairline: `rgba(225, 190, 119, 0.18)`

### Typography

- Editorial display: Cormorant Garamond, regular and italic.
- Interface labels: Plus Jakarta Sans, 600 weight, uppercase with generous tracking.
- Cinzel is reserved for inherited brand details; it should not carry long headings.
- Display scale: `clamp(3.25rem, 7vw, 8.25rem)`.
- Body copy: 16–20px with 1.6–1.75 line height.

### Space and layout

- Page shell: near-black edge-to-edge canvas.
- Maximum editorial width: 1440px.
- Section padding: 110–190px desktop, 90–130px mobile.
- Corners are rare. Product photography remains rectangular; pills are reserved for primary controls.
- Lines are one-pixel champagne hairlines, never bright white.

## Motion and interaction

- Hero: sticky 430vh desktop / 390vh phone sequence; a seekable MP4 is loaded as a Blob and its `currentTime` is mapped to scroll progress.
- First-screen copy fades early. The category ring enters only after the visitor scrolls, preventing the landing frame from becoming busy.
- Category cards form a real CSS perspective cylinder and rotate with the same scroll progress as the film.
- Category grid: restrained scale and exposure shift on hover; no price or quick-add UI in the storytelling layer.
- Cursor: small luminous point plus a delayed ring; coarse pointers receive the native cursor.
- First tile: the gift-intention ring subtly follows the pointer, while the luminous cursor signals interactive product and category links.
- Reduced motion: the film holds its poster, the ring holds its authored angle, and the cursor is native while the complete text flow remains available.

## Page pattern

1. Film threshold — one sentence and a scroll cue.
2. Gift intentions — four categories revealed through the scroll-scrubbed film and perspective ring: Love & Connection; Confidence & Personal Power; Vitality & Inner Balance; Wealth & Prosperity.
3. Category gallery — normal, quiz-free browsing with no price clutter.
4. Personalization — an optional, character-free profile for name numerology plus Moon sign and Antardasha calculation. Name, birth date, time, and place can be supplied, but none blocks browsing or checkout.
5. Quiet finale — one emotional closing line and a route back to the gift worlds.

## Astrology placement decision

Personal gifting belongs after the first product collection, not in front of it and not in the cart. This keeps the default shopping journey frictionless, gives the optional experience enough narrative context to feel premium, and avoids making personal data feel like a requirement. Cart remains focused on purchase and gift-note choices.

## Personalization rules

- The current site contains no mascot or temporary 3D character.
- The calculation engine combines name numerology with the Moon sign × Antardasha matrix: 12 Moon signs × 9 Antardashas resolve into the four gift intentions.
- Date of birth, time of birth, and place of birth improve the reading but are all optional. Normal browsing and checkout work without them.
- A future Blender mascot is a separate production effort; the withdrawn concept is documented only as status in `creative/younoya-scroll-film/ASTER-RIG.md`.

## Build instructions

- Keep all commerce actions as ordinary accessible HTML controls so the prepared Medusa handlers can replace the local cart calls without redesigning the page.
- Preserve product photography exactly; grading may affect only crop, exposure, background cleanup and color consistency.
- The final film should be a short, four-beat continuous-forward chain through Love & Connection, Confidence & Personal Power, Vitality & Inner Balance, and Wealth & Prosperity. The current checked-in MP4 is only a seekable product-photography previz. The active render prompts and continuity handoff are in `creative/younoya-scroll-film/current-video-handoff/`.
- Final desktop is 16:9 and the mobile production master should be a separately composed native 9:16 render, never a center crop.
- Never autoplay sound. Never require the scroll film to reveal essential text or purchase controls.
