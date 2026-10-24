# Premium gift editions

The reveal and unboxing URLs now share an ivory editorial page: compact logo/bag header, object-led split hero, a specific edition note, object details, a simple reflection and an optional share card. On mobile the edition identity precedes the image and the text follows it. No nested reading panels or animated text.

## Identity and content

`getRevealEdition` in `younoya-web/src/lib/giftReveal.js` validates category/rashi inputs strictly for public reveal pages. It accepts the existing aliases and transliterations; invalid input shows an unavailable state rather than silently selecting career/Aries. Shared category resolvers used by the admin are unchanged.

The 48 explicit bindings preserve the previous Mercury matrix keys, combination IDs, titles and object choices. This is a compatibility rule, not an assertion that a public QR URL contains a recipient birth chart or current dasha. `combinations.json` is unchanged; no Ketu text is copied into Mercury. New presentation notes and item descriptions live in reveal-only registries. Do not rerun the catalogue/matrix generator to change this UI.

There are 48 authored introductions and rationales. Missing factual care/application details stay absent. Unsupported universal placement, fragrance-for-bottle fallbacks, fixed 60-second rituals, future predictions and private-link claims have been removed. No health/financial outcome is promised. The three entries without suitable product photos use a designed text layout; generated bottle/itr/horse studies are visibly labelled illustrations, as authorized by the owner.

## Sharing

The shared SocialShareModal still accepts the original Q&A `data`/`onClose` contract. Its native dialog now contains keyboard focus, closes on Escape, restores the trigger and locks background scrolling. The optional gift presentation uses neutral edition text, an ivory initial style and its canonical reveal URL. Q&A defaults and its existing prophecy generator remain compatible. Post/Story exports wait for fonts. Cancellation is not an error, and failed native sharing no longer silently downloads a file.

Reveal exports have a separate quiet canvas branch; they do not include invented lunar-transit or consecration labels. No new provider, endpoint, private configuration, account requirement or ordering path is involved.

## Verification

- 24 automated tests: all 48 identities/object choices and source hash, aliases, invalid inputs, bottle/fragrance separation, image references, 96 Post/Story layout cases and existing QR/SEO/prophecy regressions.
- All 48 canonical reveal routes checked at 360px. Four representative routes checked at 320/430/768/1024/1440/1920px: no horizontal overflow or header overlap; hero images loaded.
- Native dialog keyboard cycle, Escape/focus restoration, 360px preview sizing, actual Post/Story downloads and original Q&A caller compatibility verified locally. Image-failure and invalid/alias routes checked in the isolated built-asset fixture.
- Shop, Navratri product, Q&A, admin login and mocked guest checkout checked for theme/layout regression. No policy/payment control clicked. All public reveal routes remain noindex and outside the sitemap. Existing QR destinations continue working.
- Frontend build and Worker dry-run passed. Built distributions match; source/export hashes and private-value scans passed. Real-device touch/keyboard and an operating-system reduced-motion toggle remain manual checks; the reveal has no JavaScript entrance animation and its reduced-motion stylesheet disables transitions.

Run from F:/Savvy_Ecom:

`node --test younoya-web/tests/gift-reveal.test.mjs younoya-web/tests/seo.test.mjs younoya-web/tests/qr-unboxing-and-social.test.mjs`

`npm run build`

The local fixture at `younoya-web/tests/fixtures/storefront-preview.cjs` mocks providers. `?image-failure=reveal` intentionally returns 404 for the black-horse exports. Use only for isolated QA and stop it afterward. GitHub push/frontend release requires fresh permission. No backend deployment is required.
