import React, { useEffect, useRef } from 'react';

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260713_140344_79e1296a-86d7-43fd-9b5f-63ffe560f291.png&w=1280&q=85';

const FRONT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260713_162101_0d7498c5-29bb-47bf-a99f-2773c0a880a9.mp4';

const OVERLAY_IMAGE =
  'https://soft-zoom-63098134.figma.site/_assets/v11/3f10f1876e118f72a396e05a6c2d099569478272.png';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const gridPatternRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.7;
    let smoothX = targetX;
    let smoothY = targetY;

    let targetGridX = 0;
    let targetGridY = 0;
    let smoothGridX = 0;
    let smoothGridY = 0;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      targetGridX = ((e.clientX - centerX) / centerX) * 16;
      targetGridY = ((e.clientY - centerY) / centerY) * 16;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || !e.touches[0]) return;
      const rect = containerRef.current.getBoundingClientRect();
      targetX = e.touches[0].clientX - rect.left;
      targetY = e.touches[0].clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      targetGridX = ((e.touches[0].clientX - centerX) / centerX) * 16;
      targetGridY = ((e.touches[0].clientY - centerY) / centerY) * 16;
    };

    const updateLoop = () => {
      smoothX += (targetX - smoothX) * 0.1;
      smoothY += (targetY - smoothY) * 0.1;

      smoothGridX += (targetGridX - smoothGridX) * 0.06;
      smoothGridY += (targetGridY - smoothGridY) * 0.06;

      if (spotlightRef.current) {
        const maskGradient = `radial-gradient(circle 260px at ${smoothX.toFixed(
          1
        )}px ${smoothY.toFixed(
          1
        )}px, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.4) 75%, rgba(255,255,255,0.12) 88%, rgba(255,255,255,0) 100%)`;

        spotlightRef.current.style.maskImage = maskGradient;
        spotlightRef.current.style.webkitMaskImage = maskGradient;
      }

      if (gridPatternRef.current) {
        gridPatternRef.current.style.transform = `translate3d(${smoothGridX.toFixed(
          2
        )}px, ${smoothGridY.toFixed(2)}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen h-[100dvh] overflow-hidden bg-[#0a0a0a] text-white select-none cursor-default font-sans"
    >
      {/* LAYER 1 — GRID BACKGROUND (z-0, opacity 0.1) */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
        <svg
          ref={gridPatternRef}
          className="w-[120%] h-[120%] -left-[10%] -top-[10%] absolute transition-transform ease-out will-change-transform"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid-pattern-48"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="#64748b"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern-48)" />
        </svg>
      </div>

      {/* LAYER 2 — BACKGROUND IMAGE (z-10) */}
      <div
        className="absolute inset-0 z-10 bg-center bg-cover bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('${BG_IMAGE_1}')` }}
      />

      {/* LAYER 3 — HERO TEXT (z-20) */}
      <div className="absolute inset-x-0 z-20 flex flex-col items-center justify-start text-center pointer-events-none top-20 sm:top-28 md:top-32 px-4">
        <h1
          className="font-serif text-[4.5rem] xs:text-[5.5rem] sm:text-[10rem] md:text-[13rem] lg:text-[16rem] leading-[0.9] text-white uppercase tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] animate-fade-rise"
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
          }}
        >
          YOUNOYA
        </h1>

        <p className="font-sans text-xs sm:text-sm md:text-base font-normal tracking-[0.25em] text-white/70 uppercase mt-4 max-w-xl animate-fade-rise-delay">
          For Every Chapter // Consecrated Astrological Grace
        </p>
      </div>

      {/* LAYER 4 — OVERLAY IMAGE (z-25) */}
      <img
        src={OVERLAY_IMAGE}
        alt="Atmospheric Overlay"
        className="absolute inset-0 z-25 w-full h-full object-cover pointer-events-none opacity-90 mix-blend-screen"
      />

      {/* LAYER 5 — SPOTLIGHT REVEAL (z-30) */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 z-30 pointer-events-none will-change-[mask-image]"
        style={{
          clipPath: 'inset(40% 0 0 0)',
        }}
      >
        <video
          src={FRONT_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Bottom Floating Bar (z-40) */}
      <div className="absolute bottom-8 inset-x-0 z-40 flex items-center justify-between max-w-7xl mx-auto px-8 pointer-events-none">
        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono tracking-widest text-white/50 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Vedic Consecration • Zero-Password Flow</span>
        </div>

        <div className="pointer-events-auto ml-auto sm:ml-0">
          <a
            href="#collection"
            className="liquid-glass rounded-full px-6 py-3 text-xs font-medium text-white/90 hover:text-white uppercase tracking-wider transition-transform hover:scale-105 active:scale-95 inline-flex items-center gap-2 shadow-xl"
          >
            <span>Explore Collection</span>
            <span className="text-emerald-400">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
