"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Star, Compass } from "lucide-react";
import { ZodiacMarquee } from "@/components/astrology/ZodiacMarquee";
import { OnboardingDeckModal } from "@/components/onboarding/OnboardingDeckModal";

const BG_VIDEO =
  "https://7jpz6d1nkrer2cbv.public.blob.vercel-storage.com/new-ecom";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Mouse cursor tracking values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth cursor-following parallax on the video & ambient glow
  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    
    // Normalized offset from center: -1 to +1
    const xOffset = ((clientX - left) / width - 0.5) * 2;
    const yOffset = ((clientY - top) / height - 0.5) * 2;

    // Shift video subtly by up to 25px in response to cursor
    mouseX.set(xOffset * -25);
    mouseY.set(yOffset * -25);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="relative w-full bg-[#07080E] text-[#FDFCF8] font-sans selection:bg-[#D4AF37] selection:text-[#07080E] overflow-x-hidden">
      {/* Interactive Onboarding Deck Modal */}
      <OnboardingDeckModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* 1. Enhanced Cursor-Tracked Cinematic Hero Video Section */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden flex items-center justify-center select-none"
      >
        {/* Cursor-Tracked Animated Video Canvas */}
        <motion.div
          style={{
            x: smoothMouseX,
            y: smoothMouseY,
            scale: 1.08, // Scale slightly to accommodate cursor motion without revealing edges
          }}
          className="absolute inset-0 z-0 w-full h-full pointer-events-none will-change-transform"
        >
          <video
            src={BG_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center"
          />
          
          {/* Seamless Bottom Vignette Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#07080E] via-[#07080E]/60 to-transparent" />
        </motion.div>

        {/* Hero Interactive Overlay CTA */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#07080E]/85 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono uppercase tracking-widest shadow-2xl">
            <Sparkles size={13} className="animate-spin-slow" />
            <span>SACRED VEDIC ALIGNMENT ENGINE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-heading text-[#FDFCF8] drop-shadow-2xl">
            Celestial Guidance Aligned To Your Birth Chart
          </h1>

          <p className="text-xs sm:text-base text-stone-200 max-w-xl mx-auto leading-relaxed drop-shadow-md">
            Enter your exact birth parameters. Our Vedic ephemeris engine calculates your planetary transits and prescribes your customized consecrated talisman.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] text-[#07080E] font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-[0_4px_30px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Compass size={16} />
              <span>✦ Calculate Your Kundali</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Twitch-Style Astrology Zodiac Sign Carousel (Right-to-Left Continuous Scrolling) */}
      <ZodiacMarquee />

      {/* 3. Bottom Sacred Alignment Prescription Gateway */}
      <section className="relative w-full px-4 sm:px-8 py-20 max-w-7xl mx-auto">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#080A10] to-[#121522] border border-[#D4AF37]/35 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-[#DC2626]/15 blur-3xl pointer-events-none" />

          <div className="space-y-3 relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] sm:text-xs font-mono uppercase tracking-wider">
              <Star size={12} />
              <span>INDIVIDUAL ASTRAL PRESCRIPTION</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-extrabold text-[#FDFCF8] font-heading tracking-tight">
              Bespoke Consecrated Talismans
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              Every seeker receives an energized sacred item tailored precisely to their planetary dasha, moon rashi, and elemental synergy.
            </p>
          </div>

          <div className="pt-3 relative z-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span>✦ Reveal My Astral Match</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
