# Gift-guide Q&A presentation

Updated 2026-10-06 by Codex. User selected dark champagne and gold.

## Design and boundaries
- Preserve the supplied Aster video, responsive asset selection, rounded feathering and loop. Q&A uses warm off-white display type, muted champagne accents and matte dark surfaces.
- GuideProgress renders five named chapters, completed marks, current-step semantics and a numeric count. Mobile hides visible chapter names but keeps accessible labels and progress semantics.
- Questions and reply controls sit together without a surrounding panel or a large internal spacer. GuideConversation.css is imported after GiftFinder.css and scopes Q&A rules to the conversation; the recommendation dossier retains its current structure. The existing guide-specific navbar class receives matching dark styling.
- Numbered reply rows have concise secondary copy, restrained pointer illumination, selected-state checkmarks and visible keyboard focus. Framer Motion values update the hover light without React renders on each pointer move. Reduced motion disables entrance/tap motion and the light.
- Name and optional birth fields have consistent dark surfaces, clear labels and 44px-or-larger action targets. The final prompt correctly refers to the recipient when gifting to someone else. Answer values, intention IDs and API contracts are unchanged.
- useGuideLayout measures the full active question and its reply controls. One flexible current-question region replaces the capped, independently scrolling docks. Earlier replies stay accessible in the Your replies dialog, and Aster contracts on smaller screens to give controls priority.

## Validation
- Root npm run build exited 0; existing >500KB main-bundle warning remains.
- Checked 1440 x 900 and 1024 x 768 desktop, plus 430 x 932 and 360 x 800 mobile. No horizontal overflow. Correct desktop 880 x 720 and mobile 480 x 392 videos retained.
- Exercised self and recipient branches, required name/relationship validation, keyboard selection/submission, back navigation with selected choices, optional date picker and subsequent time/city fields, and history/reply scrolling.
- Guest recommendation handoff completed against the configured live API with synthetic answers. Save opened the login gate; no OTP, account save, checkout or payment was submitted.
- Reduced-motion behavior verified in component/CSS source; OS preferences were not changed. During development an import arrived before its new stylesheet and caused a transient Vite reload error; reloading after the stylesheet existed resolved it.
- Proof images are ignored local artifacts: .tmp/gift-guide-luxury-desktop.jpg and .tmp/gift-guide-luxury-mobile.jpg.

## Next
Review the local preview at http://127.0.0.1:5175/find-a-gift. Push only after fresh explicit user permission. No backend deployment is required for this UI change.


## Available-space correction (2026-10-06)
- Removed history from the active question flow and removed percentage ceilings on replies. Progress stays above one flexible question-and-controls region; the latter scrolls only when short screens or the keyboard leave insufficient room. Steps reset to the top and focus the name input only on the name question.
- Tightened progress, heading and row spacing for shorter screens. Tablet occasion choices and very short desktop occasion choices use two columns. Preserved all choices, selected states, back controls, desktop split composition and responsive Aster media.
- Birth date, time and city are visible together from the final step. A shared native GuideDialog presents the calendar outside overflowing ancestors, with Escape, close/backdrop dismissal, focus containment and focus restoration. Six-row months fit on the tested phone. Calendar selects and mobile text fields use 16px type to avoid focus zoom.
- City suggestions open upward without increasing form height. Selecting a city announces confirmation without a redundant visible paragraph; Escape dismisses suggestions. Reduced-motion behavior remains supported; dialogs introduce no animation.
- Verified self/recipient progression, name and relationship controls, five occasion choices, four intentions, optional fields, synthetic date/time entry, city search/selection, retained history and keyboard calendar dismissal. No production save, OTP, order or payment was submitted.
- At 1024 x 768 and 1280 x 720 laptops, 430 x 932 and 360 x 800 phones, and 794 x 884 tablet, tested normal question controls fit without answer scrolling or horizontal overflow. At 430 x 500, End scrolled the single region to the back/action controls. Browser logs had no errors/warnings. Actual OS keyboard and reduced-motion emulation were not performed; visualViewport handling and reduced-motion rules were inspected in source.
- Final root npm run build exited 0; existing large-bundle warning remains. Proof: .tmp/gift-guide-options-laptop.jpg and .tmp/gift-guide-fields-mobile.jpg. No backend/API changes; local Vite remains on port 5175. Batch source, generated dist and documentation in one final commit; await explicit push permission.
