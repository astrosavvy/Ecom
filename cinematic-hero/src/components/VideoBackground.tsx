import React, { useEffect, useRef } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

export const VideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;
    let isResetting = false;

    // Initial state: hidden
    video.style.opacity = '0';

    const monitorPlayback = () => {
      if (!video) return;

      if (!isResetting && video.duration && !isNaN(video.duration) && video.duration > 0) {
        const { currentTime, duration } = video;
        const fadeInDuration = 0.5;
        const fadeOutDuration = 0.5;
        const timeLeft = duration - currentTime;

        let targetOpacity = 1;

        if (currentTime < fadeInDuration) {
          // Fade in over 0.5s at the start (0 to 1)
          targetOpacity = Math.max(0, Math.min(1, currentTime / fadeInDuration));
        } else if (timeLeft < fadeOutDuration) {
          // Fade out over 0.5s before the end (1 to 0)
          targetOpacity = Math.max(0, Math.min(1, timeLeft / fadeOutDuration));
        } else {
          targetOpacity = 1;
        }

        video.style.opacity = targetOpacity.toFixed(4);
      }

      animationFrameId = requestAnimationFrame(monitorPlayback);
    };

    animationFrameId = requestAnimationFrame(monitorPlayback);

    const handleEnded = () => {
      if (!video) return;
      isResetting = true;
      video.style.opacity = '0';

      setTimeout(() => {
        if (!video) return;
        video.currentTime = 0;
        video
          .play()
          .then(() => {
            isResetting = false;
          })
          .catch((err) => {
            console.warn('Video replay encountered error:', err);
            isResetting = false;
          });
      }, 100);
    };

    video.addEventListener('ended', handleEnded);

    // Start video playback
    const startPlayback = () => {
      video.play().catch(() => {
        // Fallback for browsers requiring user gesture or muting
        video.muted = true;
        video.play().catch((e) => console.log('Video autoplay error:', e));
      });
    };

    if (video.readyState >= 2) {
      startPlayback();
    } else {
      video.addEventListener('canplay', startPlayback, { once: true });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', startPlayback);
    };
  }, []);

  return (
    <div
      className="absolute z-0 overflow-hidden pointer-events-none"
      style={{
        top: '300px',
        inset: 'auto 0 0 0',
        height: 'calc(100vh - 300px)',
        minHeight: '600px',
      }}
    >
      {/* Background Video Element */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        autoPlay
        preload="auto"
        className="w-full h-full object-cover object-center transition-opacity duration-75"
        style={{ opacity: 0 }}
      />

      {/* Gradient Overlays positioned over video */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/90 pointer-events-none" />
    </div>
  );
};
