---
name: gemini-omni-flash-prompts
description: Use whenever the user wants to write, plan, or improve a video prompt for Google's Gemini Omni Flash model (also "Gemini Omni," "Omni Flash," or misspelled "Google Omni Flash" / "Gemini Omini Flash") — in the Gemini app, Google Flow, AI Studio, the Gemini API, or a third-party host. Trigger for a cinematic prompt, a shot list, a single clip, or especially a video LONGER than ~10 seconds, since Omni Flash only generates short clips per call and longer videos need a planned sequence of chained/extended prompts that merge into one continuous take with no visible cut. Also trigger to keep a character/product/style consistent across scenes, fix a visible seam between two AI clips, edit existing Omni Flash footage (relight, restyle, swap weather, add a character), or build a reusable prompt template for this model — even if the user never names the model.
---

# Gemini Omni Flash Video Prompt Builder

Gemini Omni Flash is Google's multimodal video-generation and -editing model (first released May 2026, updated to "Omni 1.1 Flash" in August 2026 with scene extension, first/last-frame keyframing, and 4K upscaling). It takes text, images, audio, and video as input and produces short clips with native, synchronized audio. It's reachable through the Gemini app, Google Flow, Google AI Studio / the Gemini API, and some third-party hosts.

Two things make prompting it different from most other video models:

1. **It wants less, not more.** Google's own guidance says you don't have to be as prescriptive as with Veo — the model leans on broad world knowledge to fill in details a more literal model would need spelled out. Over-stuffed prompts don't add fidelity; they just make the prompt slower to write and harder to iterate on.
2. **Every call is short.** A single generation runs roughly 4–10 seconds. There's no way to ask for one straight 45-second clip — longer videos are always built by chaining several calls together, and the real skill is planning that chain so the joins are invisible.

This skill covers both: writing one strong prompt, and — the harder part — planning a multi-clip sequence for any target length so each new clip picks up exactly where the last one left off, with no visible restart.

## Step 1 — Find out how long the video needs to be

Don't guess this. A 6-second product shot and a 90-second brand film are built completely differently — one is a single prompt, the other is a planned chain of a dozen-plus calls. If the user hasn't already said how long they want the finished video, ask before writing anything. Duration buckets work well as quick options — "Under 10s (one clip)," "10–40s (one continued scene)," "40s+ (multiple chained scenes)" — and `ask_user_input_v0` is a good way to surface them if it's available, since this is a real decision that changes the shape of the whole deliverable, not busywork. If you genuinely can't ask, say plainly that you're assuming a single ~8-second clip and offer to re-plan once they confirm the real target.

Worth folding into the same question round (don't turn this into an interrogation): orientation (16:9 vs 9:16), whether dialogue is wanted, and whether a specific character, product, or style has to stay identical throughout — that last one means reference images will matter (Step 4).

## Step 2 — Decide: single clip, or a chain?

- **Target ≤ ~10 seconds** → one prompt, one call. Go to Step 3 and stop there.
- **Target ~10–40 seconds** → one opening prompt plus a chain of "continue/extend the scene" prompts, all inside a single continuous scene. Go to Step 3, then Step 4.
- **Target beyond ~40 seconds** → the continuation mechanism itself has a cumulative cap around 40 seconds per scene (Google's published figure as of the Omni 1.1 update — treat it as the right order of magnitude and re-check if an interface shows something different). Past that, split the target into consecutive blocks of about 40 seconds or less, plan each block as its own extension chain, and bridge block-to-block with the frame-anchor + reference-image technique in `references/chaining-and-continuity.md` so the seam between blocks is invisible too. Go to Step 3, then Step 4, then that file's bridging section.

Do this arithmetic explicitly and show the user a short numbered plan before writing any prompts — e.g., "65 seconds → Block A: 0:00–0:40 (base clip + 3 extensions), Block B: 0:40–1:05 (new base anchored on Block A's last frame + 2 extensions)." A plan is much easier to sanity-check than a wall of prompts.

## Step 3 — Write each clip's prompt

Every individual prompt — the opening clip or the fifth extension in a chain — uses the same five-element formula. Full detail, camera vocabulary, and audio-direction technique are in `references/prompt-formula.md`; read it before writing prompts. The short version:

1. **Lead with the camera** — shot size + movement, in the first few words.
2. **Style** — the visual/photographic treatment, one clause.
3. **Lighting** — one clear light source and its quality.
4. **Location** — where this happens (skip it if the clip is an unchanged continuation of an already-established location).
5. **Action** — one continuous beat, start to finish, for *this* clip only.

Three or four sentences is the sweet spot. Don't spell out what the setting already implies — spend the words on the camera move, the style, the light, and anything that must deviate from the obvious. Direct audio on purpose if it matters; silence leaves it to the model's default guess.

## Step 4 — For anything longer than one clip: make it merge

This is the part that actually answers "how do I stop this looking like two clips stuck together." Full mechanics, the native continuation mechanism, first/last-frame keyframing, and the beyond-40-second bridging technique are in `references/chaining-and-continuity.md` — read it before planning any multi-clip sequence. The core ideas:

- **Continuation prompts describe only the next beat.** Never re-describe the whole scene again — the model already has recent prior footage as context when you use the native continue/extend mechanism. Re-stating the subject's appearance, the setting, and the action so far isn't just wasted; it can make the model second-guess and restart something that should just keep going.
- **State camera continuation, not camera reset.** If the previous clip ended mid push-in, say the push-in continues — don't let the prompt default the model to a fresh static shot.
- **Lock identity with reference images across the whole build**, not just the first clip — a clean portrait or packshot passed alongside every call in the sequence keeps a face, wardrobe, or product looking like itself for the full length, independent of the continuation mechanism.
- **Plan any restyle/relight edits before extending, not after** — some interfaces won't let you re-edit a clip once it's already been extended.

## Step 5 — Deliver the plan

Give the user a numbered sequence, one prompt per step, each in its own copy-pasteable block, labeled with which mechanism runs it (e.g., "Base generation," "Extend — Flow's Extend button / Gemini app follow-up / API `previous_interaction_id`," "New scene, anchored on the last frame of Step 4"). Under each step, add a one-line continuity note: what has to carry over from the previous step (character description, wardrobe, camera state, lighting) so nothing drifts. For a single-clip request this is just one prompt — don't pad it into a fake sequence.

If the user wants more than plain prompt writing — editing footage they already generated, locking a style or character across otherwise-unrelated shots, or using several reference images as storyboard beats — see `references/advanced-editing.md`.

## A note on how fast this product is moving

Omni Flash launched in May 2026 and got a significant update (scene extension, first/last-frame keyframing, 4K upscaling) about three months later. Exact numbers — seconds per call, the cumulative extension cap, resolution tiers, which interface exposes which button — are exactly the kind of detail Google keeps adjusting, and they vary by which surface (Gemini app vs. Flow vs. API vs. a third-party host) the user is actually on. Treat the figures in this skill as the right order of magnitude and the right technique; if the user needs an exact current number and it matters, say so plainly and point to the interface in front of them or https://ai.google.dev/gemini-api/docs/omni rather than asserting a number with false confidence.
