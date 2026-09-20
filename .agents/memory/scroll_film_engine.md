# Scroll Film Engine Specification

## 1. The Active Media Asset
- **File**: `public/media/younoya-category-film-mobile.mp4`
- **Specs**: 720×1280 (9:16 portrait), 24 fps, H.264 video, silent, ~32.0 seconds duration.
- **Viewports**: Currently deployed cross-viewport (phone, tablet, desktop). On desktop, the stage maintains full portrait height with dark obsidian cinematic wings (`object-fit: contain` within `height: 100svh`).
- **Seam Lock**: Four 8-second legs (`hf_mobile_leg_1.mp4` through `4.mp4`), frame-locked at transitions.

## 2. Blob Seeking Architecture (CRITICAL)
Static HTTP servers frequently fail to provide proper byte-range seeking on large `.mp4` files, freezing scroll scrubbing on frame zero.
**Mandatory Implementation**:
```javascript
useEffect(() => {
  let objectUrl;
  fetch('/media/younoya-category-film-mobile.mp4')
    .then((res) => res.blob())
    .then((blob) => {
      objectUrl = URL.createObjectURL(blob);
      setFilmSrc(objectUrl);
    });
  return () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  };
}, []);
```
This guarantees instant seeking in browser memory across all devices.

## 3. Progress Mapping & Category Bands
The film container has a scroll height of `430vh` (`min-height: 2500px`):
- `progress = window.scrollY / (scrollHeight - clientHeight)` clamped to `[0, 1]`.
- Video seek: `video.currentTime = progress * video.duration`.
- Category index: `Math.floor(progress * CATEGORIES.length)` clamped to `0..3`.
- Opening copy fades out as `progress > 0.12`. Category cards enter as `progress > 0.15`.
