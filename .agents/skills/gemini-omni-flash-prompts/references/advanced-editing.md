# Editing existing footage & reference-image workflows

Two more tools worth knowing, for anything beyond writing a fresh prompt from scratch.

## Editing a clip you already have

Instead of generating new footage, Omni Flash can take a clip already in hand and change one thing about it while holding everything else — the framing, the cuts, the motion, every untouched part of the frame — fixed. Useful for a day-for-night pass, a seasonal swap, a brand-mandated color change, or dropping a character into a shot that didn't have one, all without losing a shot that's already been approved.

Write these prompts as a **transformation, not a re-description**:

1. Lead with a transformation verb: *change, replace, restyle, relight, add, remove.*
2. Name the target attribute.
3. Close with a short clause naming exactly what must stay the same ("keep the exact framing, the camera motion, and the [specific object/character]").

That closing clause is what keeps a "change the season to winter" prompt from also nudging the camera or redrawing the path. Without it, the model has to guess which parts of the source are load-bearing and which are up for grabs.

If the target look is hard to put into words (a specific film stock, a brand identity, an exact period aesthetic), attach a reference image alongside the source clip instead of writing paragraphs about it — the reference defines the *how*, the prompt defines *what to hold*. The same applies to dropping a specific person or product into a shot: pass a clean reference image and name where they belong in the scene.

**Chaining edits:** when one change builds on the previous one (relight, then add weather, then add a character), feed each edit's *output* back in as the next edit's source, and describe only the new delta each time. When two edits don't depend on each other (a color grade and an unrelated relight, say), run them in parallel off the same original source instead — that keeps more options open than chaining them would.

**One caveat:** a shaky or poorly lit source clip edits messily — the model has to fight the existing motion blur or noise on top of whatever change is being asked for. Stabilize and grade a source clip first if possible, before layering an edit on top of it.

## Reference images beyond editing

Reference images aren't only for fixing existing footage — they're also how something specific gets locked into a *new* generation:

- **Style transfer** — one reference image whose look (watercolor, claymation, a specific film stock) is wanted; the prompt describes an entirely different scene. Name the actual technique cues visible in the reference (visible brushwork, paper texture, halftone dots) rather than just saying "in this style" — that forces the model to honor the specific signals instead of drifting to a plausible-but-different look.
- **Character or product consistency** — one clean reference (a mid-shot portrait for a person, a clean packshot for a product) carried into new poses, actions, and backgrounds across a set of shots. Works best with a simple, well-lit, waist-up (or full-product) reference — busy backgrounds or extreme angles in the reference weaken the lock.
- **Storyboard / multi-beat guidance** — pass several reference images as an ordered sequence of key beats, and state that order explicitly in the prompt ("begin with the first reference, cut to the second, end on the third"). The model treats each as a visual destination and generates the motion connecting them — useful for a fixed sequence like a product-plating shot or a reveal that has to hit specific compositions.
- **Combined frame-anchor + reference cast** — when the opening frame has to be exact (a product reveal, a logo splash) *and* a specific character has to be in it, stack a first-frame anchor with a character/style reference in the same call: the anchor locks the opening composition, the reference holds identity through the rest of the clip.
