# Making a longer video: chaining without a visible cut

A single Omni Flash generation is short — roughly 4 to 10 seconds depending on the interface. Anything longer is built by chaining multiple generations together. This file covers how to plan that chain and how to write the individual continuation prompts so the joins don't read as cuts.

## The native continuation mechanism ("Scene Extension")

This is the primary tool for "these two clips need to feel like one take." Google's Omni 1.1 update (August 2026) added it explicitly: take an existing clip and generate more footage that continues seamlessly from where it left off, carrying the same characters, environment, and physics forward automatically. Depending on the interface:

- **Gemini app** — a "continue"-style follow-up in the same conversation.
- **Google Flow** — select the clip, click **Extend**, describe how the action continues, generate. Note: once a clip has been extended, some other edit modes (insert/remove/re-light) may no longer apply to it in that interface — so do any restyle/relight edits *before* extending, not after.
- **API** — pass `previous_interaction_id` (the prior clip's interaction) along with a short new prompt.

As of the Omni 1.1 update, the model looks back at roughly the last 10 seconds of the existing clip as context (earlier versions only saw the final second — much less reliable for continuity), and each extension appends roughly 3–10 seconds, cumulative up to about 40 seconds total per continuous scene. Treat these numbers as the right order of magnitude rather than exact forever — interfaces and limits are still being adjusted; check the interface in front of the user if precision matters.

### Writing a continuation prompt

The single biggest mistake is re-describing the whole scene again. The model already has the prior footage as context — a continuation prompt should read like a director calling out the *next* beat, nothing else:

- **Weak** (redundant, invites drift): "A woman in a red coat is walking down a rain-soaked alley at night, neon signs reflecting in puddles, as she has been doing, and now she continues walking further down the alley before she reaches a door and stops and reaches for the handle and opens it slowly."
- **Strong** (one new beat, camera continuation stated): "Continue the scene: she reaches the door at the end of the alley and turns the handle. The camera's slow tracking movement continues alongside her."

If a hard cut to a new angle is wanted instead of a continuous move, say so plainly ("Cut to a low-angle shot as..."), since otherwise the model tends to keep the prior shot's camera logic going.

## First/last frame keyframing

A separate, complementary tool: give the model a start image and an end image, and it generates the motion that connects them. Reach for this when the exact destination of a shot is already known — a specific product-reveal frame, an exact hand-off point between two independently-built chains, a camera orbit, or a seamless loop back to the opening frame. It's not a substitute for Scene Extension's narrative continuation; think of it as "fill in the motion between two known pictures" rather than "keep telling the story."

## Beyond the extension cap: bridging separate scenes

Once a chain hits its cumulative cap (~40 seconds), the next block has to be a fresh base generation — you can't just keep extending. To keep that seam invisible:

1. **Grab the last frame** of the final clip in the finishing block as a still image.
2. **Feed it in as the first-frame anchor** for the new block's opening generation, so the new block visually begins exactly where the old one stopped.
3. **Carry reference images forward across the whole build**, not just block one — a clean mid-shot portrait for a person, a clean packshot for a product — so identity and palette don't drift between blocks.
4. **Write the new block's opening prompt as if it were a continuation**, not a fresh scene: match the wardrobe, lighting, and camera state exactly, even though it's technically a new generation call rather than a native extension.

## Planning the whole chain for a target duration

Work this out explicitly before writing any prompts:

1. **Target ≤ ~10s** → one base generation. No chain needed.
2. **Target ~10–40s** → one base generation plus a run of extension prompts, each covering the next beat, until the running total reaches the target. Round up to the nearest extension step.
3. **Target > ~40s** → split the target into consecutive blocks of ≤40s each. Plan each block as its own base-generation-plus-extensions chain (step 2), then bridge consecutive blocks with the frame-anchor + reference-image technique above.

### Worked example: a 65-second video

| Step | Mechanism | Covers | Continuity note |
|---|---|---|---|
| 1 | Base generation | 0:00–0:08 | Establishes character, setting, style, lighting |
| 2 | Extend | 0:08–0:18 | Next beat only; camera continues from step 1 |
| 3 | Extend | 0:18–0:28 | Next beat only |
| 4 | Extend | 0:28–0:40 | Final beat of Block A; note the exact ending pose/frame |
| — | *(grab the last frame of step 4 as the anchor)* | | |
| 5 | New base generation, anchored on step 4's last frame + character/style reference images | 0:40–0:50 | Opens exactly on the anchor; prompt written as a continuation, not a new scene |
| 6 | Extend | 0:50–1:00 | Next beat |
| 7 | Extend | 1:00–1:05 | Closing beat |

Two blocks (0:00–0:40 and 0:40–1:05), bridged once, seven generation calls total. The exact number of extension steps per block depends on how much actually happens in the story — don't force beats to hit a round number of seconds; let the action decide how many extensions a block needs.

## Audio across a long chain

Audio is generated fresh with every generation call. Within one continuous Scene Extension chain, the model carries audio context forward reasonably well since it's the same interaction thread — but across a block-to-block bridge (a new base generation), the ambient sound or music bed can shift slightly even when the picture matches perfectly. If a continuous score or ambience matters for the whole build, describe the same audio direction in every prompt across the entire chain, not just block one. For anything performance-critical (a continuous voiceover, a music cue that has to land on an exact beat), plan to add it as a separate audio layer in post rather than relying on it surviving a block bridge untouched.
