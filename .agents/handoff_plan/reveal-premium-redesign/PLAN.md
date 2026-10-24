---
plan_id: reveal-premium-redesign
revision: 1
status: completed
created_at: "2026-10-24"
updated_at: "2026-10-24"
execution_authorization: granted
completed_at: "2026-10-24"
---

# Premium category and rashi reveal experience

## Entry point and boundaries

Read this file, `audit.json`, then the scoped source files below. This is a researched implementation plan, not an implemented redesign. The user requested planning and selected **warm ivory with product photography**. Do not implement until the user authorizes this revision. Nothing in this file grants deployment or GitHub push permission.

Goal: make the reveal feel like opening a considered gift and reading its accompanying note. Photography, useful information and carefully edited writing should carry the experience. Remove the ornamental dashboard of glowing panels.

Scope: all **four categories x twelve rashis = 48 canonical reveal combinations**, their existing `/unboxing/:category/:rashi` aliases, the reveal header/footer, and the reveal-specific share experience. Preserve printed QR destinations. There are no separate category landing pages in the inspected router; this plan does not invent them or turn the recipient experience into a zodiac directory.

Repository: `F:/Savvy_Ecom`, `main`, baseline `47b11ee760471c55b124aee9305bd473e31d35ac`. React 19, React Router 7, Vite 6, Framer Motion 11, existing CSS and fonts. Only `.agents/CHECKPOINT.md` was dirty at audit start; preserve its existing notes. No runtime dependency, backend API, checkout, catalogue, astrology calculation or database change is planned. Q&A design and shared recommendation data remain intact.

Readiness: design, routing and rendering contracts are ready. Final photography/factual product instructions are conditional on the per-item asset/fact audit in T01. Missing facts must not become invented content. An implementation can build the shell and truthful incomplete states independently; all 48 fully illustrated editions require their verified asset mappings before acceptance.

## Verified findings

| ID | Evidence | Diagnosis and remedy |
|---|---|---|
| F01 | Live career/Aries, wealth/Taurus, love/Cancer, vitality/Gemini, career/Sagittarius, wealth/Pisces and the Aries unboxing alias; `GiftReveal.jsx` and `GiftReveal.css`. Only one image in main content: the repeated brand emblem. | Actual gifts are absent. Lead with a verified photograph of the selected objects; show individual objects below. Remove repeated logo ornament. |
| F02 | CSS container max-width 860px; measured at 1440px. Repeated shell/core borders, shadow, blur, radial auras and stars; same structure across samples. | A narrow text column and layered decoration substitute for hierarchy. Use a 1240px editorial layout, one quiet canvas, open sections and deliberate image/text proportions. |
| F03 | All 96 source records audited. The render always prefers Mercury. Each category has 12 Mercury records but only Aries has story, rationale and both descriptions. Thus **44/48** rendered editions use fallback story/rationale/descriptions; no Mercury record maps imagery. | Missing data is hidden by generic prose. Add a reveal-only authored presentation registry, explicit completeness checks and truthful absence states. Do not copy Ketu content into Mercury or relabel objects to fill gaps. |
| F04 | Live wealth/Taurus names Tiger Eye Bottle; its fallback description calls it a botanical sensory product. Vitality/Gemini shows the same fallback for Howlite Bottle. Universal North-East placement and 60-second instructions are hard-coded at `GiftReveal.jsx:119,132`. | The component invents product-specific facts from generic fallbacks. Replace with verified item descriptions/use/care; omit unsupported instructions and universal placement prescriptions. |
| F05 | Route contains category/rashi only. `GiftReveal.jsx:18-20` selects Mercury, falling back to Ketu only if its entire record is absent. `shareData` invents a transit and future outcome. | This URL cannot establish a recipient's dasha, birth chart or actual order. Present an edition guide with symbolic interpretation; do not call it a live personal prediction or verified order inventory. Keep current matrix identity for compatibility. |
| F06 | `categoryMapping.js:68,77` silently maps unknown inputs to career/Aries. Used by admin labels as well as reveal pages; existing tests assert this default. | An invalid QR can appear valid but display the wrong edition. Add strict validation in a reveal-only resolver; preserve shared admin resolver behavior. |
| F07 | At actual 360px viewport, vitality/Gemini document measured ~3380px high; hero ends ~491px down before any gift appears; product body text is 14px. | Mobile opens with branding and generic text, followed by dense panels. Compact header/context, recognizable product image in the first viewport, 16px body text and a single reading column. No nested scroll areas. |
| F08 | `SocialShareModal.jsx` is a shared custom backdrop/div with no dialog semantics/focus containment in inspected source; generator and share text use generic prophecy language. Browser attempts did not open the panel in this audit environment. | Scope a neutral reveal share payload and accessible modal work; treat live share opening as unverified, not a passed check. Keep Q&A caller behavior compatible. |

Web reader could not retrieve the reveal URLs; live browser DOM and screenshots confirmed them. Source audit covers all 48 combinations; this was not a screenshot inspection of all 48 live pages. No current accessibility conformance or product-photo verification is claimed.

## Scoped source map

All paths below resolve under `F:/Savvy_Ecom/`.

| Existing file / entry | Responsibility |
|---|---|
| `younoya-web/src/pages/GiftReveal.jsx:10` | Page renderer; Mercury-first resolution at lines 18-20; invented fallbacks at 22-37; share data at 40; hard-coded instructions at 119/132. |
| `younoya-web/src/styles/GiftReveal.css:92` | 860px container, header clearance, layered panels, product list, mobile styles. Replace only reveal styles. |
| `younoya-web/src/lib/categoryMapping.js:6,53,68,77,84` | Four category definitions, twelve rashi definitions, shared permissive resolvers and matrix key. Keep shared behavior; add strict reveal adapter separately. |
| `younoya-web/src/data/combinations.json` | 96-record source. Read-only for this redesign; shared by ThemeManager and RecommendationRules. Backend has a separate copy. Do not rerun `backend/src/scripts/build-combinations.js`, which overwrites both copies. |
| `younoya-web/src/App.jsx:46` | StoreNavigation theme mode; reveal/unboxing routes at 76-77. |
| `younoya-web/src/components/Navbar.jsx:9` and `src/styles/Navbar.css` | Reveal detection, dark mode, fullNavigation. Introduce scoped compact light reveal behavior. |
| `younoya-web/src/components/gift-guide/SocialShareModal.jsx` and `src/lib/socialCardGenerator.js` | Shared modal/export API. Add optional reveal presentation/copy without changing Q&A defaults. |
| `younoya-web/src/admin/components/OrderBoxLabel.tsx:47` and `src/admin/pages/QrStickerStudio.tsx:27` | Existing printed QR destinations. Compatibility tests only; no inference rewrite. |
| `younoya-web/src/seo/metadata.js:157` and `tests/qr-unboxing-and-social.test.mjs` | Current noindex/route omission and mapping/QR/prophecy regression contracts. |

## Approved visual direction

**Warm ivory, charcoal type, restrained antique gold, authentic product photographs.** Maintain the existing Cormorant Garamond/Plus Jakarta Sans pairing. No new font/icon/framework package. Remove nebula colours by element, star fields, glass blur, luminous shadows, double borders, emoji zodiac badges, tiny uppercase labels on every section, and button-inside-button decoration.

Use scoped reveal variables: canvas `#FAF7F2`, photo ground `#F1EBE2`, main text `#241C17`, secondary text `#655B50`, fine divider `#DCD2C3`, deep gold `#8C6A24`, primary button charcoal/ivory. Gold is a detail, not the body text colour. Verify actual colour pairs; do not apply these tokens globally or alter Q&A.

Layout specifications:

- Desktop container max 1240px; horizontal gutters 48px above 1023px, 32px at 768-1023px, 20px at 360-767px, 16px at 320-359px.
- Eight-point spacing rhythm. Main section gaps 80-96px desktop, 48-56px mobile; internal gaps 16/24/32px. Deliberate whitespace, not empty full-screen panels.
- Display titles 64-76px at wide desktop, 48-56px at laptop, 36-42px mobile; line-height 1.05-1.12. Body 16px mobile / 17-18px desktop, line-height 1.6. Reading measure 58-65 characters. Labels 12-13px, sentence case except the existing brand mark.
- Product photography gets a 4:5 primary frame with the full object visible; paired set compositions may use 3:2 when necessary to preserve edges. Avoid forcing a landscape image into a crop that removes merchandise.
- Open composition, no bordered story/product/ritual cards. A single hairline separates substantive sections. Only photographs may have a small 4-8px corner radius.
- Rashi identity is readable text plus a restrained monochrome vector glyph, not platform-dependent emoji. Categories change content/photography, not the entire UI colour system.

## Page composition

1. **Quiet header.** YOUNOYA logo left; Collection link and bag right at desktop. Logo and accessible bag control on mobile. Use a light reveal-specific variant of the existing Navbar, 80px desktop / 68px mobile. Preserve bag state and opening behavior. Place it in normal/sticky flow with reserved space; remove arbitrary `16vh` clearance padding. No duplicate emblem, Shop Now pill, search/saved icons or full navigation on this recipient page.
2. **Identity and hero.** Small category label; rashi English/transliterated name on a separate quiet line. Use the existing edition title as the H1, after editorial review. Large photograph on the left (~58%), short gift note on the right (~42%). Add a discreet `Explore your gift` anchor to the contents section. At 1024px use 54/46 with a 32px gap. Below 768px: identity/title, photograph, short note, then the anchor. On 360x800 the image must begin within the first viewport; do not shrink all text to force the complete hero above the fold.
3. **The meaning behind the selection.** A short, authored explanation in open typography, with one concise rashi/intention connection. No quotation marks around every paragraph or stage directions such as internal anchors/exclusivity. Retain genuine cultural meaning without pretending a generic URL is a calculated reading.
4. **The pieces.** Item photographs, clean names, 25-45-word descriptions and a concise, verified usage/care line. Use two spacious editorial entries on desktop; stack on mobile. A compound keepsake remains a group of actual objects; the template must not fabricate a singular object or assume exactly two physical products. No unsupported quantities, materials, dimensions, certification or therapeutic outcomes.
5. **A moment with your gift.** Optional concise numbered list, not an activation dashboard. Common reflection may invite pausing, choosing an intention and finding a suitable place; product handling, fragrance application and directional prescriptions require specific reviewed guidance. Show only verified item-specific instructions; don't pad every route to three steps. Cultural terms may appear only with a short clear meaning and justified context.
6. **Keep the note.** One modest `Share this gift` action; a secondary text link `Choose a gift` retains the existing Q&A destination and attribution query. Footer with brand signature, Collection, Contact and existing legal destinations. Remove emotional pressure and generic upsell headings. This is a recipient guide, not a product checkout page.

Desktop and mobile share the same reading order. No pinned scroll scenes, forced carousel, autoplay video, parallax, letter-by-letter text, confetti, fake loading ritual or sticky purchase CTA. Motion is optional 160-240ms opacity/short translation; content must remain visible if motion is unavailable. Respect reduced motion.

## Content, identity and media contract

Existing source `src/data/combinations.json` is shared recommendation input: **do not rewrite it globally for this redesign**. Add proposed `src/data/giftRevealEditions.js`, `src/data/giftRevealItems.js` and a small `src/lib/giftReveal.js` adapter. These are proposed symbols, not discovered APIs.

- Edition registry keys use the existing canonical category/rashi pair and store its exact current `matrixKey`/`combinationId`, reviewed display title, intro, rationale, reflection and explicit ordered item IDs. Include source/review metadata internally, never display it to customers. Item IDs are manually verified, not inferred by name splitting or array position.
- Item registry stores clean display name, verified factual description, optional use/care, optional approved photograph with alt text/intrinsic dimensions/responsive sources, and internal provenance. Product material/use claims must have a source; missing information stays null. Similar bottle/itr names are not interchangeable.
- New `getRevealEdition` strictly accepts known category aliases and known rashi/transliteration aliases, normalizes to existing canonical identity, and returns either a resolved edition or a typed unavailable result. Keep `resolveCategory`/`resolveRashi` unchanged for admin callers.
- Canonical valid URLs continue selecting their current Mercury edition; this is compatibility, **not evidence of the recipient's actual dasha**. Do not borrow a Ketu story or object because Mercury fields are empty. Do not add dasha selection or order-specific retrieval in this design task. Those need a separate identity contract.
- Valid content missing copy: retain verified identity/title/item names; omit missing paragraphs and unsafe instructions. Never invent the default oil, keepsake, transit or personalization. Invalid route: branded `This gift guide is unavailable` state with Collection and Contact links, no wrong-edition fallback. Missing entire matrix record: the same unavailable state.
- Missing/failed photo: use a neutral reserved layout area plus `Photograph coming soon` only where useful, or collapse the image area on lower entries. Keep truthful names and reading flow; no stock gemstone or category image presented as the actual included product. Failure states are supported, but cannot be used to sign off all 48 illustrated pages as complete.
- Treat the category mapping and edition as static, public content. No new API or secrets, no customer names/orders in generic QR pages. Keep current noindex behavior and sitemap omission; noindex does not make the URL access-controlled. Remove the misleading private-link footer.

Editorial limits: intro 30-50 words, rationale 50-80 words, each item description 25-45 words, each optional instruction 15-30 words. Avoid repeating the same paragraph with the sign substituted. Write in natural active prose. Avoid blanket consecration claims, guaranteed financial/health/relationship outcomes and invented chart/transit precision. Keep the astrology as an interpretive rationale, not an asserted event forecast. Preserve factual inclusions and established edition identities.

Photography audit first: inspect existing approved catalogue/admin media and the physical archive for exact object matches. Filename resemblance is insufficient. Map a source to a stable item ID only after visual inspection. Prefer genuine object photography. If background editing is needed, use imagegen to preserve the merchandise and change only surroundings: ivory stone/paper, soft natural daylight, realistic shadow and sparse contextual props. Never synthesize missing included products or engraved branding. Use one visual family across categories; category differentiation comes from objects and their setting. Export responsive 480/800/1200px WebPs without upscaling; record provenance, compare to originals, preserve originals. Hero eager, lower images lazy, explicit dimensions. No unrequested image generation during this planning turn.

## Share and header integration boundaries

- `App.jsx` currently excludes reveal routes from `store-light`; update only reveal/unboxing handling when implementation starts. `Navbar.jsx` gets a light, compact reveal branch; guide/checkout/admin/shop branches retain existing behavior. Scope CSS to `.navbar--reveal` and `.gift-reveal`; avoid global token rewrites.
- Preserve the shared SocialShareModal public interface used by Q&A. Add optional presentation/copy props for reveal, with existing defaults retained elsewhere. Use an accessible native dialog or equivalent tested focus containment, Escape close, scroll locking and focus restoration; regress Q&A as well.
- Reveal share payload must use the same authored edition text/identity visible on the page, an ivory initial theme and an explicit current canonical reveal URL. Remove the hard-coded future prediction and the false transit claim. Preserve Post/Story export, optional themes and download/native-share/WhatsApp capabilities. No actual external send during tests.
- If `socialCardGenerator.js` needs neutral captions, add optional fields with existing Q&A defaults. No broad prophecyGenerator rewrite. A share title/reflection must not say an actual birth chart was calculated. Re-opening/changing edition must not leak stale share content.
- Keep all printed `/reveal/*` and `/unboxing/*` destinations and the admin QR generator output valid. Do not change order inference or reprint QR labels in this scope. Its existing inference defaults are a separate concern, not evidence for recipient-specific content.

## Ordered implementation tasks

| Task | Outcome / owned files | Prerequisites and evidence for completion |
|---|---|---|
| T01 — Lock edition and asset inventory | Read audit.json; inventory 48 visible editions, compound objects, all unique item references and available exact photographs. Establish reveal-only item IDs and a fact/media checklist. Preserve the 96-record source hash. | First task after authorization. Every media/claim link has provenance or explicit missing status. Stop only the affected content/media slice when the object is ambiguous; no invented substitutions. |
| T02 — Approve the visual pilot | Prepare desktop 1440px and mobile 390px visual compositions for the user's career/Aries page using verified assets. Establish the hero, one item section, typography and closing note before scaling. | T01 sufficient for the pilot. Review against the selected ivory/photography direction; do not generate 48 decorative variants. Final production code starts after the pilot demonstrates the hierarchy. |
| T03 — Author content and strict adapter | Add the proposed reveal registries/adapter and scoped resolver tests. Edit all 48 reveal presentations; exact source identity preserved, no global matrix edits. | T01. All 48 identity assertions pass; invalid/alias/missing content states pass; blank bottle descriptions cannot become oil text. Unsupported care/placement omitted. |
| T04 — Implement shared reveal layout | Refactor GiftReveal.jsx/CSS, scoped Navbar and App theme handling; use semantic sections, ordered content and image states. | T02/T03. Desktop split and mobile stack match contract; all text immediately available; no decorative shells/stars/emoji pills; header never overlaps content. No checkout/Q&A/cart regression. |
| T05 — Finish reveal sharing | Scoped props/copy, neutral payload, accessible dialog and ivory export styling using existing share implementation. | T03/T04. Share reflects the selected edition; keyboard open/close/focus return; Post/Story downloads render after fonts; cancellation is non-error; Q&A still works. Do not transmit to WhatsApp or a native share target in automated QA. |
| T06 — Complete edition QA and release preparation | Validate all 48 routes and aliases, imagery/content readiness, responsive screenshots and regressions; update docs/checkpoint and this plan's execution log. | T01-T05. Required checks below pass or explicitly blocked slices remain unfinished. One final local implementation commit only after authorization/build verification. Fresh permission before GitHub push. No backend release needed. |

Work sequentially; no delegation or parallel agents requested. The implementing agent owns shared contracts and integration. Bounded discretion: small optical spacing/crop adjustments within tokens are allowed; identity, object selection, cultural claims, route semantics and new APIs are not discretionary.

## Assumption safeguards

| Risk | Correct boundary | Verification |
|---|---|---|
| Dark Q&A preference implies dark reveals | User explicitly selected ivory for this task. Leave Q&A palette unchanged. | Compare both routes after navigation in either direction. |
| All 96 records can be copied into 48 routes interchangeably | Preserve the current selected matrix key. Ketu is not a fallback for missing Mercury prose. | All 48 route-to-ID assertions; keep original matrix hash unchanged. |
| A generic rashi URL proves order contents/transit | No order or dasha is encoded. Use edition-guide language; no personal names, computed dates or guaranteed outcome. | Copy review and share payload tests. |
| Words like bottle imply fragrance or a safe application method | Description and use need per-item evidence. | Blank/unknown factual fields render no invented guidance. |
| Visual matching means any similar stone photo is acceptable | Exact merchandise needs source-to-item visual verification. | Item media checklist and original comparison. |
| Change shared fallback to null everywhere | Add strict reveal-only adapter; preserve existing admin functions. | Existing category/QR tests remain green; invalid public URL shows unavailable state. |
| New gold/ivory CSS can be applied globally | Scope reveal/App/Nav changes; retain non-reveal themes. | Shop/product/checkout/Q&A/admin route checks. |
| Noindex means private | No access-control claims on generic public links. | Metadata remains noindex; no customer/order data introduced. |

## Verification: required during implementation, not run now

1. Pure-data tests for all 48 canonical mappings, supported aliases/transliterations, invalid category/rashi, missing record, missing copy/photo and duplicate item IDs. Verify IDs/names and render fields against independently reviewed inventory, not snapshots of the new adapter alone.
2. Browser content coverage for all 48 canonical URLs; alias coverage for all 48 in route/data checks and representative direct-entry browser checks. At least four full visual examples spanning each category and longest titles/compound keepsakes. No silent career/Aries fallback.
3. Responsive checks at 360x800, 430x932, 768x1024, 1024x768, 1440x900 and 1920x1080, plus 320px/reflow and zoom. No horizontal scroll, clipped logo/name, orphaned CTA, nested reading scroll or hidden instructions. Full object visible; no image stretching/late layout jump. Do not enforce a fixed document height.
4. Actual text/background contrast at least 4.5:1 for normal text, 3:1 for large text; visible keyboard focus; 44px target design minimum; logical H1/H2/H3 and landmark order, useful alt text, reduced motion. References: [W3C contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), read 2026-10-24. These are accessibility criteria, not proof that the current site fails them.
5. Image loading/failure, unavailable guide, long names, forward/back route transitions and reduced-motion cases. Product images visible without animation. Share open/close, Escape, focus return, changing editions and export failure/cancel. No real message send/order/payment.
6. Regress Shop, one product, cart drawer, checkout and Q&A; compare Q&A share before/after. Preserve QR URLs/admin label generation, noindex metadata and sitemap omission. Update only tests whose intended copy changes; retain existing mapping/QR/prophecy behavior tests.
7. From F:/Savvy_Ecom: `node --test younoya-web/tests/seo.test.mjs younoya-web/tests/qr-unboxing-and-social.test.mjs` plus new reveal adapter tests; `npm run build` must exit zero and sync both distributions. Worker dry-run when build/SEO integration changes; no deployment implied. Record actual command results, photo provenance and final responsive screenshots in plan evidence.

Acceptance: all 48 reviewed editions use the same premium ivory system with correct identities and verified imagery, clear descriptions and useful guidance; no generic fallback or fabricated personalization; existing QR/cart/share flows work and other storefront pages retain their behavior. Missing required media/content keeps that slice incomplete. A colour swap over the same card stack is not completion.

## Execution and release status

Implementation complete after user authorization. Current verified results are recorded below; initial audit findings remain historical evidence. No backend changes, production deployment or GitHub push performed.

First executable task after user authorization: T01. Recheck scoped baseline before editing. Use this same plan for task status/evidence; mark completed only after acceptance. Implementation ends in one final local commit with documentation/checkpoint; obtain fresh explicit GitHub push permission. Frontend-only release; no SSH/backend rollout. Recovery is a reviewed frontend revert retaining all QR URLs and catalogue/order data, not a database rollback.


## Execution log — 2026-10-24
- User authorized revision 1: "implement this carefully". Frontend implementation only; no push/deployment authorization.
- T01: inspected all 70 edited-photo groups and raw archive contacts. Source SKU numbers differ from photograph-folder numbers; mapped objects visually instead. Verified 12 object photographs. Missing bottle/itr and Selenite/Rose Quartz horse media requested from owner; no substitutions.


## Completion evidence — 2026-10-24

- Authorization: user said "implement this carefully", later "continue building from where it left". Owner answered "Build it on your own" to the missing-image question. Media adjustment: create clearly labelled illustrative studies for unavailable bottle/itr/horse photos rather than pretending to have exact merchandise photography. Original QR/data identities remain unchanged.
- T01 done: 12 source photographs visually identified independently of folder/SKU numbers. Fifteen media masters including three illustrations; 42 responsive WebPs, no upscaling. Fifty-seven source/export hashes verified. Three lower item entries intentionally remain text-only; all 48 editions have an image hero. Media provenance and prompts: creative/younoya-reveal/.
- T02 done: local desktop/mobile HTML pilot reviewed before production layout, then actual built-page screenshots reviewed/saved. User had already authorized the selected ivory direction; no extra approval gate invented.
- T03 done: 48 explicit identity bindings and authored notes, strict public resolver, explicit item aliases and safe factual descriptions. Original 96-record source hash unchanged. Invalid identity never becomes career/Aries. No Ketu fallback.
- T04 done: ivory editorial layout, compact light reveal header, genuine object imagery/labelled art, mobile stacking, semantic sections and scoped styles. Text names provide rashi identity; redundant zodiac badge/glyph omitted. Shop/Q&A/checkout/admin styling remains compatible.
- T05 done: neutral reveal share payload and export branch, accessible native dialog, explicit Tab cycle, Escape/focus return, font-aware export and error/cancel behavior. Verified actual 1080x1080 and 1080x1920 downloads. Original Q&A modal caller/default presentation verified in an isolated local harness. No message sent.
- T06 done: all 48 mobile canonical routes and 24 responsive sample cases passed; valid aliases, invalid route and forced missing-image state verified in the production-bundle fixture. Existing storefront routes checked. 24 automated tests passed; final root build exited 0 (24 indexable, four excluded, 12 admin shells). Worker dry-run exited 0: 56.67 KiB / 15.79 KiB gzip, ASSETS only. Root/frontend distributions: 258 matching files. Eleven known private values absent from browser/Worker bundles. Colour contrast on ivory: ink 15.68:1, body 6.21:1, gold 4.68:1.
- Browser evidence: creative/younoya-reveal/qa/checks.json and screenshots/downloads. Actual viewport sizes checked before capture; discarded wrong-tab captures replaced. Existing Vite large-chunk advisory remains. Physical-device touch/keyboard and system reduced-motion toggle were not tested; reduced-motion CSS reviewed and no reveal entrance animation remains. No real payment, order, OTP or external share.
- Implementation documentation: docs/premium-gift-reveal.md. One final local commit includes source/assets, generated distributions, tests, this plan and checkpoint. Fresh GitHub push permission is still required; this status does not authorize publication.
