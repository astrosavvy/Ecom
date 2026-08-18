"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { Sparkles, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { ZodiacMarquee } from "@/components/astrology/ZodiacMarquee";
import { useDeck } from "@/components/home/DeckContext";
import { OnboardingDeck } from "@/components/onboarding/OnboardingDeck";
import { GooeyFilterDefs } from "@/components/onboarding/GooeyFilterDefs";
import { GridCrosshair } from "@/components/ui/GridCrosshair";
import { TextReveal } from "@/components/ui/TextReveal";
import Link from "next/link";

const BG_VIDEO = "https://7jpz6d1nkrer2cbv.public.blob.vercel-storage.com/new-ecom";

const TILES = [
  { id: "hero", label: "Celestial Vision" },
  { id: "zodiac", label: "12 Rashis Stream" },
  { id: "kundali", label: "Kundali Prescription" },
  { id: "footer", label: "Sanctuary & Details" },
];

export function FluidCardDeck() {
  const { activeTile, setActiveTile, totalTiles } = useDeck();
  const [direction, setDirection] = useState<1 | -1>(1);
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);

  // Mouse cursor tracking values on hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const xOffset = ((clientX - left) / width - 0.5) * 2;
    const yOffset = ((clientY - top) / height - 0.5) * 2;
    mouseX.set(xOffset * -25);
    mouseY.set(yOffset * -25);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const switchTile = useCallback(
    (newIndex: number) => {
      if (newIndex === activeTile || isAnimating.current) return;
      if (newIndex < 0 || newIndex >= totalTiles) return;

      isAnimating.current = true;
      setDirection(newIndex > activeTile ? 1 : -1);
      setActiveTile(newIndex);

      setTimeout(() => {
        isAnimating.current = false;
      }, 700);
    },
    [activeTile, totalTiles, setActiveTile]
  );

  // ═══════════════════════════════════════════
  // WHEEL HANDLER — with scroll-container isolation
  // ═══════════════════════════════════════════
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Check if event originates inside a [data-scroll-container]
      const target = e.target as HTMLElement;
      if (target.closest("[data-scroll-container]")) {
        // Let the container handle it — don't switch tiles
        return;
      }

      // Ignore small movements and form elements
      if (
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (Math.abs(e.deltaY) < 50) return; // Higher threshold for deliberate swipes

      if (e.deltaY > 0) {
        if (activeTile < totalTiles - 1 && !isAnimating.current) {
          switchTile(activeTile + 1);
        }
      } else {
        if (activeTile > 0 && !isAnimating.current) {
          switchTile(activeTile - 1);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeTile, totalTiles, switchTile]);

  // Touch gesture listeners for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't capture if inside scroll container
    const target = e.target as HTMLElement;
    if (target.closest("[data-scroll-container]")) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-scroll-container]")) return;

    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) < 50) return; // Higher threshold

    if (deltaY > 0) {
      if (activeTile < totalTiles - 1) switchTile(activeTile + 1);
    } else {
      if (activeTile > 0) switchTile(activeTile - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't switch tiles if user is in an input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA") return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (activeTile < totalTiles - 1) switchTile(activeTile + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (activeTile > 0) switchTile(activeTile - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTile, totalTiles, switchTile]);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[100dvh] overflow-hidden bg-[#040508] text-[#FDFCF8] select-none [perspective:1800px]"
    >
      <GooeyFilterDefs />

      {/* Floating Right Deck Indicator */}
      <div className="fixed right-3 sm:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2.5 sm:gap-3 py-2.5 sm:py-3 px-1.5 sm:px-2 rounded-full bg-[#080A10]/70 backdrop-blur-xl border border-[#D4AF37]/30 shadow-2xl">
        {TILES.map((tile, idx) => (
          <button
            key={tile.id}
            onClick={() => switchTile(idx)}
            title={tile.label}
            className="group relative flex items-center justify-center p-1 cursor-pointer"
            aria-label={`Jump to ${tile.label}`}
          >
            <div
              className={`transition-all duration-500 rounded-full ${
                activeTile === idx
                  ? "w-2.5 sm:w-3 h-6 sm:h-8 bg-gradient-to-b from-[#D4AF37] to-[#B8860B] shadow-[0_0_12px_#D4AF37]"
                  : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/20 hover:bg-[#D4AF37]/60"
              }`}
            />
            <span className="hidden md:block absolute right-8 px-2.5 py-1 rounded-lg bg-[#0E1017] border border-[#D4AF37]/30 text-[10px] font-mono text-[#D4AF37] tracking-wider whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
              {tile.label}
            </span>
          </button>
        ))}
      </div>

      {/* Fluid Cascading Card Stack */}
      <AnimatePresence mode="wait" custom={direction}>
        {/* ═══════ TILE 0: Video Hero ═══════ */}
        {activeTile === 0 && (
          <motion.div
            key="tile-0-hero"
            custom={direction}
            initial={{ opacity: 0, y: direction > 0 ? 80 : -80, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction > 0 ? -80 : 80, scale: 0.94, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
          >
            <motion.div
              style={{ x: smoothMouseX, y: smoothMouseY, scale: 1.08 }}
              className="absolute inset-0 z-0 w-full h-full pointer-events-none will-change-transform"
            >
              <video
                key={BG_VIDEO}
                src={BG_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#040508] via-[#040508]/40 to-transparent pointer-events-none" />
            </motion.div>

            <button
              onClick={() => switchTile(1)}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-stone-400 hover:text-[#D4AF37] transition-colors cursor-pointer group"
              data-cursor="hover"
            >
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase opacity-75 group-hover:opacity-100">
                Scroll to Explore ✦
              </span>
              <ChevronDown size={15} className="animate-bounce text-[#D4AF37]" />
            </button>
          </motion.div>
        )}

        {/* ═══════ TILE 1: Zodiac Stream ═══════ */}
        {activeTile === 1 && (
          <motion.div
            key="tile-1-zodiac"
            custom={direction}
            initial={{ opacity: 0, y: direction > 0 ? 80 : -80, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction > 0 ? -80 : 80, scale: 0.94, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="absolute inset-0 w-full h-full flex flex-col justify-between items-center px-2 sm:px-4 pt-16 sm:pt-20 pb-4 overflow-hidden bg-gradient-to-b from-[#07080E]/80 via-[#080A12]/80 to-[#040508]/80"
          >
            <div className="w-full max-w-7xl mx-auto my-auto flex flex-col items-center justify-center">
              <ZodiacMarquee />
            </div>

            <div className="flex items-center gap-3 sm:gap-4 pb-2 z-20">
              <button
                onClick={() => switchTile(0)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-all cursor-pointer"
                aria-label="Previous Tile"
                data-cursor="hover"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => switchTile(2)}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] sm:text-xs font-mono uppercase tracking-wider hover:bg-[#D4AF37] hover:text-[#07080E] transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                data-cursor="hover"
              >
                <span>✦ Calculate Kundali</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════ TILE 2: Kundali Onboarding Deck ═══════ */}
        {activeTile === 2 && (
          <motion.div
            key="tile-2-kundali"
            custom={direction}
            initial={{ opacity: 0, y: direction > 0 ? 80 : -80, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction > 0 ? -80 : 80, scale: 0.94, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="absolute inset-0 w-full h-full flex flex-col justify-between items-center pt-14 sm:pt-18 pb-4 overflow-hidden bg-gradient-to-b from-[#080A12]/80 via-[#0D101C]/80 to-[#040508]/80"
          >
            {/* Self-contained OnboardingDeck with wheel isolation */}
            <OnboardingDeck />

            {/* Bottom Navigation */}
            <div className="flex items-center gap-3 sm:gap-4 pb-2 z-20">
              <button
                onClick={() => switchTile(1)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-all cursor-pointer"
                aria-label="Previous Tile"
                data-cursor="hover"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => switchTile(3)}
                className="px-5 sm:px-6 py-2 rounded-full bg-white/5 border border-white/10 text-stone-300 text-[11px] sm:text-xs font-mono uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5"
                data-cursor="hover"
              >
                <span>Explore Sanctuary</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════ TILE 3: Compact Luxury Footer ═══════ */}
        {activeTile === 3 && (
          <motion.div
            key="tile-3-footer"
            custom={direction}
            initial={{ opacity: 0, y: direction > 0 ? 80 : -80, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction > 0 ? -80 : 80, scale: 0.94, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-[#0D101C]/80 via-[#090B14]/80 to-[#040508]/80"
          >
            <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center gap-6 sm:gap-8">
              {/* Centered Clean Logo with Ambient Glow */}
              <div className="logo-ambient-glow">
                <img
                  src="/younoya_celestial_gold_clean.png"
                  alt="YOUNOYA"
                  className="h-14 sm:h-18 w-auto object-contain drop-shadow-[0_2px_16px_rgba(212,175,55,0.35)]"
                />
              </div>

              {/* Tagline */}
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-md">
                Sacred Vedic Astrology-Blessed talismans & consecrated ritual keepsakes energized under auspicious cosmic transits.
              </p>

              {/* Crosshair Divider */}
              <div className="w-full flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <GridCrosshair color="rgba(212, 175, 55, 0.35)" />
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Navigation Links — Horizontal Centered */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-sm text-stone-300">
                <Link href="/about" className="hover:text-white transition-colors" data-cursor="hover">Sacred Heritage</Link>
                <span className="text-white/20">·</span>
                <button onClick={() => switchTile(1)} className="hover:text-white transition-colors cursor-pointer" data-cursor="hover">12 Rashis Matrix</button>
                <span className="text-white/20">·</span>
                <button onClick={() => switchTile(2)} className="hover:text-white transition-colors cursor-pointer" data-cursor="hover">Kundali Alignment</button>
                <span className="text-white/20">·</span>
                <Link href="/contact" className="hover:text-white transition-colors" data-cursor="hover">Reach Priests</Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-stone-400">
                <Link href="/shipping" className="hover:text-white transition-colors" data-cursor="hover">Express Shipping</Link>
                <span className="text-white/15">·</span>
                <Link href="/refund" className="hover:text-white transition-colors" data-cursor="hover">Refund & Returns</Link>
                <span className="text-white/15">·</span>
                <Link href="/terms" className="hover:text-white transition-colors" data-cursor="hover">Terms</Link>
                <span className="text-white/15">·</span>
                <Link href="/privacy" className="hover:text-white transition-colors" data-cursor="hover">Privacy</Link>
              </div>

              {/* Frosted Glass CTA Strip */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-[#D4AF37]/20">
                <div className="text-xs font-mono text-[#D4AF37] font-bold">
                  support@younoya.com
                </div>
                <button
                  onClick={() => switchTile(2)}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:scale-105 transition-all cursor-pointer shadow-lg"
                  data-cursor="hover"
                >
                  <span>✦ Calculate Kundali</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Bottom Copyright */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-[10px] sm:text-xs text-stone-500 font-mono">
                <span>© {new Date().getFullYear()} YOUNOYA. All Rights Reserved.</span>
                <span className="hidden sm:inline">·</span>
                <span>Free Express Air · Razorpay 256-Bit Encrypted</span>
              </div>

              {/* Back to top */}
              <button
                onClick={() => switchTile(0)}
                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-stone-300 text-[11px] font-mono uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5"
                data-cursor="hover"
              >
                <ChevronUp size={13} />
                <span>Back to Top</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
