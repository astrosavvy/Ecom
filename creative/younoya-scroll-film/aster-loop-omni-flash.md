# Aster — silent seamless lady loop

Target: Gemini Omni Flash image-to-video. One continuous clip, six seconds (proposed default; duration can be adjusted in the generation interface). This is the archived generation prompt. The user subsequently supplied an eight-second MP4; the website now uses an optimized 7.958-second silent forward-and-return derivative with pixel-identical first/last frames. See aster-loop-media.md for provenance and integration.

## Reference and setup

- Upload `F:/Savvy_Ecom/younoya-web/public/media/aster-3d-guide.webp` as the character reference.
- Use square framing, preferably 1024 × 1024 if offered. Keep the full hairstyle, shoulders and both hands visible with comfortable margins.
- Background: uniform warm ivory `#faf7f0` matching the light gift-guide page. Ordinary MP4 does not preserve the reference's transparent background.
- If the interface provides first- and last-frame controls, use the same reference pose at both ends. Choose the available duration nearest six seconds.
- Generate one silent clip. Check the first/last-frame seam before integrating; do not assume prompting alone guarantees a seamless loop.

## Copyable video prompt

```text
Locked-off, eye-level medium portrait of Aster from the supplied reference, in the same refined 3D animated-film style, with her complete hairstyle and both hands comfortably inside a square frame. Soft diffused studio light illuminates a plain warm-ivory background (#faf7f0); preserve her face, brown updo, plum jacket, cream blouse and delicate gold details exactly. During one continuous six-second cycle, she breathes gently, blinks once and makes a very small welcoming movement with her raised palm, then settles back into the identical starting pose and expression with matching motion at the loop boundary. Keep the camera, framing, background and lighting fixed, her lips still and her anatomy stable; no cuts, text, props or effects, and completely silent audio with no dialogue, music or ambience.
```

## Image asset provenance

The current website uses an optimized 640 × 585 transparent WebP (61,508 bytes), created with the built-in image-generation tool from the original `guide-listen.webp`. It is 3D-style rendered artwork with gentle pointer movement, not a rigged character or a video.

Image-generation direction: Preserve the supplied lady's identity, warm brown hair in an elegant updo, plum tailored jacket, cream blouse and gold ornament; render a refined, friendly 3D animated-film portrait with natural face and hand proportions, subtle fabric and skin texture, warm soft studio light, a welcoming open-palm pose, both hands and full hairstyle visible, and a transparent background. No sphere, interface, text or additional character.

## Website integration after approval

Use the approved clip in `AsterStage.jsx` with muted, loop, playsInline and a matching poster. Keep the WebP for reduced motion and video errors. Encode a small web-ready MP4/WebM, remove the audio track, match the ivory background and avoid changing the layout footprint. Confirm no visible loop jump or added load delay on mobile before committing the integration.
