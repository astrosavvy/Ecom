# Gift-guide Q&A presentation

Updated 2026-10-06 by Codex. User selected dark champagne and gold.

## Design and boundaries
- Preserve the supplied Aster video, responsive asset selection, rounded feathering and loop. Q&A uses warm off-white display type, muted champagne accents and matte dark surfaces.
- GuideProgress renders five named chapters, completed marks, current-step semantics and a numeric count. Mobile hides visible chapter names but keeps accessible labels and progress semantics.
- Questions and reply controls sit together without a surrounding panel or a large internal spacer. GuideConversation.css is imported after GiftFinder.css and scopes Q&A rules to the conversation; the recommendation dossier retains its current structure. The existing guide-specific navbar class receives matching dark styling.
- Numbered reply rows have concise secondary copy, restrained pointer illumination, selected-state checkmarks and visible keyboard focus. Framer Motion values update the hover light without React renders on each pointer move. Reduced motion disables entrance/tap motion and the light.
- Name and optional birth fields have consistent dark surfaces, clear labels and 44px-or-larger action targets. The final prompt correctly refers to the recipient when gifting to someone else. Answer values, intention IDs and API contracts are unchanged.
- useGuideLayout measures the full question as a minimum chat-region height. History and reply docks remain independently scrollable with hidden rails; the portrait contracts on small screens as content increases.

## Validation
- Root npm run build exited 0; existing >500KB main-bundle warning remains.
- Checked 1440 x 900 and 1024 x 768 desktop, plus 430 x 932 and 360 x 800 mobile. No horizontal overflow. Correct desktop 880 x 720 and mobile 480 x 392 videos retained.
- Exercised self and recipient branches, required name/relationship validation, keyboard selection/submission, back navigation with selected choices, optional date picker and subsequent time/city fields, and history/reply scrolling.
- Guest recommendation handoff completed against the configured live API with synthetic answers. Save opened the login gate; no OTP, account save, checkout or payment was submitted.
- Reduced-motion behavior verified in component/CSS source; OS preferences were not changed. During development an import arrived before its new stylesheet and caused a transient Vite reload error; reloading after the stylesheet existed resolved it.
- Proof images are ignored local artifacts: .tmp/gift-guide-luxury-desktop.jpg and .tmp/gift-guide-luxury-mobile.jpg.

## Next
Review the local preview at http://127.0.0.1:5175/find-a-gift. Push only after fresh explicit user permission. No backend deployment is required for this UI change.
