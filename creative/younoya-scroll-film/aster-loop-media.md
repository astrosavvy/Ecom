# Aster supplied loop — production media

Updated: 2026-09-30. The user supplied an eight-second, 1280 × 720, 24fps H.264/AAC MP4 and a 400 × 225 GIF. Originals remain untouched in D:/C Downloads.

## Inputs

- D:/C Downloads/Woman_gesturing_in_animation_style-clip-1_20260930214011_processed.mp4 (981,207 bytes)
- D:/C Downloads/Woman_gesturing_in_animation_style-clip-1_20260930214011_processed.gif (4,000,535 bytes)

## Website assets

- younoya-web/public/media/aster-lady-loop-v2.mp4: 480 × 392, 24fps CFR, 191 frames, 7.958 seconds, 607,634 bytes; H.264/yuv420p, fast-start metadata, no audio stream.
- younoya-web/public/media/aster-lady-loop-poster-v2.webp: matching first displayed frame, 14,916 bytes.

The MP4 preserves smoother color and is substantially smaller than the GIF. The lady’s full hairstyle and hands remain visible. Native video playback requires no canvas or WebGL. The superseded crossfade derivative is excluded from production.

## Processing recipe and seam correction

Decode the original with OpenCV. Crop each frame to 880 × 720 at x=200/y=0 and resize to 480 × 392 using INTER_AREA. Send BGR24 raw frames to FFmpeg at a fixed 24fps: source frames 32–127 forward, then 126–32 in reverse. The return gesture ends on the same pose as the opening. One repeated boundary frame creates a brief, approximately 83ms rest at that pose.

Encode the raw stream using libx264, slow preset, QP18, yuv420p and +faststart. Set x264 parameters ipratio=1:pbratio=1:aq-mode=0 and force keyframes at 0 and 7.9 seconds (the latter selects the final frame at 7.9167s). Remove audio. Export the first output frame as an 88-quality WebP poster. Versioned URLs prevent the earlier visible seam from remaining cached.

Verification on decoded output: 191 frames, first and last frames are pixel-identical (mean absolute difference 0.0). The normal opening motion difference is 0.3000 on an 8-bit scale. This replaces the earlier crossfade that still showed a jump between different poses.

## Runtime behavior

AsterStage fetches the small MP4 into an object URL, aborts unfinished requests and revokes URLs when unmounted. The video uses muted autoplay, loop and playsInline. It pauses when hidden/offscreen; interrupted play requests are handled. Reduced motion prevents video mounting/fetching and shows the poster; load or autoplay failure also falls back to the poster.

Below 960px, the centered lady keeps the largest size that fits beside the current history, question and replies. A ResizeObserver updates her height when the viewport or composer changes; she contracts smoothly only when more content needs space. At 960px and above, desktop has a dedicated two-column composition: a large Aster stage and editorial introduction on the left, and a borderless conversation area on the right. Desktop overrides do not change the mobile layout. The redundant welcome bubble is removed at the user’s request. The rounded progress panel names the current chapter and displays accessible step progress. Question prefaces use 14px text. All steps place history and the current question at the top of their available region, avoiding a large blank area above the name step. Chat and replies remain independently scrollable by touch, wheel and keyboard; scrollbar rails are hidden. Go back is a bordered, high-contrast 44px button.

## Verification

Inspected twelve source frames plus opening/closing pairs. Checked encoded frame count, duration and absence of audio. Browser confirmed Blob URL, readyState 4, muted looping playback and full 0–7.958s seekable range. Desktop 1440 × 900 and mobile 430 × 932 and 390 × 844 checks show no horizontal overflow. Checked first reply/name progression, the compact name step, keyboard access to previous messages and the last reply, and hidden scrollbar computed styles. No captured console errors. Reduced-motion and media-failure handling checked in source; OS preferences were not changed. Root npm run build exited 0; the existing main-bundle size warning remains. No backend or live payment/auth tests were run for this UI/media change.

Proof screenshots are ignored local artifacts: .tmp/aster-loop-desktop.jpg, .tmp/aster-loop-mobile.jpg, .tmp/aster-loop-name-mobile.jpg and .tmp/aster-loop-moment-mobile.jpg.

## Adaptive layout follow-up verification

Checked the final desktop layout at 1024 × 768 and 1440 × 900, and mobile at 430 × 932 and 360 × 800. The 430px name step keeps Aster’s stage at 332px rather than immediately collapsing to 116px; the reply controls end near 916px in a 932px viewport. More history and five moment choices contract the stage to 116px and scroll the chat upward. Home reaches earlier messages. Desktop conversation computed styles confirm a zero-width outer border and transparent background. Mobile retains a flex layout with the desktop introduction hidden. Self/recipient progression, reply scrolling, visible back button and no horizontal overflow verified; no captured console errors. Root build passed after the final desktop border removal. Proof: .tmp/aster-adaptive-desktop.jpg and .tmp/aster-adaptive-name-mobile.jpg.

## Desktop quality and rounded feather update — 2026-10-02

Desktop uses `aster-lady-loop-desktop-v3.mp4` at native 880 × 720 (1,493,759 bytes) plus its matching WebP poster. The original 1280 × 720 source is cropped x=200..1080 without resizing; frame sequence, QP18 encoding and forced boundary keyframes match the v2 recipe above. Decoded output remains 191 frames / 7.958333s, with pixel-identical first and last frames (mean absolute difference 0.0). Mobile retains the existing 480 × 392 v2 assets. A media-query listener switches Blob sources and posters at 960px, with abort/revoke cleanup.

The media surface now fits its intrinsic aspect ratio inside the stage, clips rounded corners and feathers all four edges. A registered CSS number changes only the mask shoulder opacity from .85 to .65 and back over 20 seconds; the center stays opaque. Reduced motion disables this animation and retains the static poster. The mobile height override excludes this fitted video surface.

Verified running desktop playback at 1920 × 1000 and 1024 × 768, plus mobile 430 × 932 and the self/name transition: expected native asset dimensions, no horizontal overflow, no captured console warnings/errors, hair and hands visible, rounded actual media boundaries. Source checks confirm reduced-motion and failed-load poster fallback; OS motion preferences and network failures were not simulated. Proof: `.tmp/aster-rounded-desktop.jpg`. Root build passed (existing bundle-size warning).
