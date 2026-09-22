# The five-element prompt formula

Google's own guidance for Omni Flash names five things the model is tuned to read directly. Hit all five at least once, then stop — three or four sentences total is the sweet spot. This is a checklist to not forget an element, not a checklist to maximize.

1. **Shot framing & camera movement** — put this first. The model treats early words as the load-bearing instruction for how the shot is filmed; a camera move buried at the end of a long prompt reads as decoration instead of direction.
2. **Style** — the photographic/visual treatment (cinematic photorealism, documentary handheld, anime, stop-motion, a named film stock, a specific painting style). Pick one; stacking contradictory styles confuses the model.
3. **Lighting** — one dominant light source and its quality (golden-hour backlight, a single hard key light, soft overcast, practical neon).
4. **Location** — where this happens. Skip it if the clip is a continuation of a location already established.
5. **Action** — a single continuous beat, described as a verb phrase, from the start of the clip to the end. Not a list of unrelated events — one beat.

## Why less is usually more here

Omni Flash leans on broad world knowledge to fill in what a more literal model would need spelled out. "Saturday morning at a small 1950s diner" already implies chrome trim, vinyl booths, and a period soundtrack — writing all of that out again doesn't add fidelity, it just makes the prompt slower to iterate on. Spend the words on what a director would actually decide: the camera move, the style, the light, and any specific deviation from what the setting obviously implies (a particular prop, an exact wardrobe detail, a specific line of dialogue). Leave the rest to the model.

The exception is anything that needs to be held exactly — a specific character's face, an exact brand color, a shot that's already been signed off. For those, don't try to out-describe a photo with more adjectives; use a reference image instead (see `advanced-editing.md`).

## Camera vocabulary worth using by name

The model reads industry terminology directly rather than needing it paraphrased into plain description. Reach for:

- **Shot size:** extreme close-up, close-up, medium shot, wide shot, extreme wide/establishing shot, two-shot, over-the-shoulder.
- **Angle:** eye-level, low-angle, high-angle, bird's-eye/overhead, Dutch angle (for unease).
- **Movement:** static/locked-off, pan, tilt, dolly-in/out, push-in, pull-back, tracking shot, crane shot, handheld, aerial/drone, whip pan, orbital/360°.
- **A few named "moves" the model treats as a single directorial instruction rather than a description:** a *oner* (one continuous unbroken shot carrying through several beats), a *dolly zoom* (the camera physically moves in while the lens zooms out, or the reverse — the Hitchcock/vertigo effect), a *natural smartphone zoom* (handheld, with the organic wobble of a phone camera rather than a locked-off rig).
- **Lens/focus:** shallow depth of field, deep focus, wide-angle, macro, telephoto compression, rack focus, anamorphic (horizontal flares, widescreen look).

Lead the sentence with whichever of these applies: "A slow dolly-in on..." reads as an instruction; "...and the camera slowly dollies in" three clauses later reads as an afterthought.

## Directing the audio

Audio is generated natively with every clip — there's no separate toggle or negative-prompt field for it, so whatever the prompt says (or doesn't say) about sound is what happens. Left unstated, the model guesses a plausible default (ambient room tone indoors, outdoor ambience outside, a gentle music bed under cinematic shots, no dialogue) — fine sometimes, wrong often enough to be worth directing on purpose. Three patterns cover almost everything:

- **Prescriptive foley** — name each specific sound in the mix ("the click of a screwdriver seating into a screw, the soft brush of a loupe lifting, a low room tone underneath"). Naming the list keeps the model from adding music you didn't ask for.
- **Layered ambient** — name each layer of a natural soundscape (wind, a distant bird call, water lapping against a shore). Naming the layers keeps them balanced instead of one drowning out the rest.
- **Directed dialogue** — quote the line exactly, in straight quotes, and name the delivery ("she says, in a calm, unhurried voice: 'Table for two, whenever you're ready.'"). A paraphrased description of what someone says ("she mentions something about the reservation") produces improvised, usually unrelated dialogue — always quote the actual line if the words matter.

Say "no music" or "no dialogue" explicitly any time silence matters on one of those channels — otherwise the model's default guess fills it in.

## Template

```
[Camera: shot size + movement], [style clause]. [Lighting clause]. [Location, if new]. [Action: one continuous beat]. [Audio direction, if it matters].
```

## Worked example (single clip, ~8 seconds)

```
A slow tracking shot at eye level, following alongside a street musician as he tunes a battered acoustic guitar on a rain-slicked city sidewalk at dusk. Documentary-style handheld cinematography, natural available light from shop windows and a single overhead streetlamp. He looks up, smiles slightly, and starts to play. Audio: the gentle scrape and tune of guitar strings, distant traffic hiss on wet pavement, no dialogue.
```

Four sentences, all five elements present (camera + movement, style, lighting, location, action), audio directed on purpose, nothing over-specified.
