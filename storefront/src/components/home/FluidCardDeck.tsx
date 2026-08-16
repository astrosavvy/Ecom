"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { Sparkles, Compass, ShieldCheck, ArrowDown, Star, ChevronDown, ChevronUp } from "lucide-react";
import { ZodiacMarquee } from "@/components/astrology/ZodiacMarquee";
import { useDeck } from "@/components/home/DeckContext";
import { Card1MobileLogin } from "@/components/onboarding/cards/Card1MobileLogin";
import { Card1BOtpDetached } from "@/components/onboarding/cards/Card1BOtpDetached";
import { Card2PersonalAstro } from "@/components/onboarding/cards/Card2PersonalAstro";
import { Card3GiftIntent } from "@/components/onboarding/cards/Card3GiftIntent";
import { Card4RecipientAstro } from "@/components/onboarding/cards/Card4RecipientAstro";
import { FluidBubbleDissolve } from "@/components/onboarding/transitions/FluidBubbleDissolve";
import { useOnboardingMachine } from "@/components/onboarding/useOnboardingMachine";
import { GooeyFilterDefs } from "@/components/onboarding/GooeyFilterDefs";
import Link from "next/link";
import { ArrowRight as ArrowIcon } from "lucide-react";

const BG_VIDEO = "https://7jpz6d1nkrer2cbv.public.blob.vercel-storage.com/new-ecom";

const TILES = [
  { id: "hero", label: "Celestial Vision" },
  { id: "zodiac", label: "12 Rashis Stream" },
  { id: "kundali", label: "Kundali Prescription" },
  { id: "footer", label: "Sanctuary & Details" },
];

export function FluidCardDeck() {
  const { activeTile, setActiveTile, nextTile, prevTile, totalTiles } = useDeck();
  const [direction, setDirection] = useState<1 | -1>(1);
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);
  const machine = useOnboardingMachine();

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

  // Wheel listener with debounce throttle
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If user is inside an interactive input field, ignore
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "SELECT") {
        return;
      }

      if (Math.abs(e.deltaY) < 30) return;

      if (e.deltaY > 0) {
        // Scroll Down -> Next Tile
        if (activeTile < totalTiles - 1 && !isAnimating.current) {
          switchTile(activeTile + 1);
        }
      } else {
        // Scroll Up -> Prev Tile
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
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) < 40) return;

    if (deltaY > 0) {
      if (activeTile < totalTiles - 1) switchTile(activeTile + 1);
    } else {
      if (activeTile > 0) switchTile(activeTile - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

      {/* Floating Minimalist Right Deck Indicator */}
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
            {/* Tooltip on hover (desktop only) */}
            <span className="hidden md:block absolute right-8 px-2.5 py-1 rounded-lg bg-[#0E1017] border border-[#D4AF37]/30 text-[10px] font-mono text-[#D4AF37] tracking-wider whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
              {tile.label}
            </span>
          </button>
        ))}
      </div>

      {/* Fluid Cascading Card Stack */}
      <AnimatePresence mode="wait" custom={direction}>
        {/* TILE 0: Unobstructed Cursor-Tracked Video Hero */}
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
            {/* Edge-to-Edge Cursor-Tracked Video Canvas (Zero Obstructions) */}
            <motion.div
              style={{
                x: smoothMouseX,
                y: smoothMouseY,
                scale: 1.08,
              }}
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

            {/* Subtle floating swipe hint at the very bottom */}
            <button
              onClick={() => switchTile(1)}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-stone-400 hover:text-[#D4AF37] transition-colors cursor-pointer group"
            >
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase opacity-75 group-hover:opacity-100">
                Scroll to Explore ✦
              </span>
              <ChevronDown size={15} className="animate-bounce text-[#D4AF37]" />
            </button>
          </motion.div>
        )}

        {/* TILE 1: 12 Astrological Zodiac Stream */}
        {activeTile === 1 && (
          <motion.div
            key="tile-1-zodiac"
            custom={direction}
            initial={{ opacity: 0, y: direction > 0 ? 80 : -80, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction > 0 ? -80 : 80, scale: 0.94, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="absolute inset-0 w-full h-full flex flex-col justify-between items-center px-2 sm:px-4 pt-16 sm:pt-20 pb-4 overflow-hidden bg-gradient-to-b from-[#07080E] via-[#080A12] to-[#040508]"
          >
            <div className="w-full max-w-7xl mx-auto my-auto flex flex-col items-center justify-center">
              <ZodiacMarquee />
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3 sm:gap-4 pb-2 z-20">
              <button
                onClick={() => switchTile(0)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-all cursor-pointer"
                aria-label="Previous Tile"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => switchTile(2)}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] sm:text-xs font-mono uppercase tracking-wider hover:bg-[#D4AF37] hover:text-[#07080E] transition-all cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <span>✦ Calculate Kundali</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* TILE 2: Interactive Stacked Kundali Onboarding Deck */}
        {activeTile === 2 && (
          <motion.div
            key="tile-2-kundali"
            custom={direction}
            initial={{ opacity: 0, y: direction > 0 ? 80 : -80, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction > 0 ? -80 : 80, scale: 0.94, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="absolute inset-0 w-full h-full flex flex-col justify-between items-center px-3 sm:px-4 pt-16 sm:pt-20 pb-4 overflow-hidden bg-gradient-to-b from-[#080A12] via-[#0D101C] to-[#040508]"
          >
            <div className="w-full max-w-lg z-10 my-auto flex flex-col items-center">
              {/* Test Mode Switcher */}
              <div className="w-full flex items-center justify-between p-1 sm:p-1.5 mb-2 sm:mb-3 rounded-2xl bg-black/60 border border-[#D4AF37]/30 backdrop-blur-md">
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-stone-400 pl-2">
                  <Sparkles size={11} className="text-[#D4AF37]" />
                  <span>TEST MODE:</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <button
                    type="button"
                    onClick={machine.loadDemoNewUser}
                    className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-xl text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      machine.currentStep === "CARD_1_PHONE" || machine.currentStep === "CARD_1B_OTP"
                        ? "bg-[#D4AF37] text-[#07080E] shadow-sm"
                        : "bg-white/5 text-stone-300 hover:bg-white/10"
                    }`}
                  >
                    ✦ New User
                  </button>
                  <button
                    type="button"
                    onClick={machine.loadDemoReturningUser}
                    className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-xl text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      machine.currentStep === "CARD_3_GIFT_INTENT"
                        ? "bg-[#D4AF37] text-[#07080E] shadow-sm"
                        : "bg-white/5 text-stone-300 hover:bg-white/10"
                    }`}
                  >
                    ✦ Returning User
                  </button>
                </div>
              </div>

              {/* 3D Stacked Card Swapping Surface */}
              <div className="relative w-full min-h-[460px] sm:min-h-[490px] [perspective:1600px]">
                {machine.currentStep === "DISSOLVING" || machine.currentStep === "COMPLETED" ? (
                  <FluidBubbleDissolve
                    userProfile={machine.userProfile}
                    recipient={machine.recipient}
                    synergy={machine.synergy}
                    onComplete={machine.completeDissolve}
                  />
                ) : (
                  <div className="relative w-full h-[460px] sm:h-[490px]">
                    {/* Backing Depth Silhouettes */}
                    <div className="absolute inset-0 translate-y-3 sm:translate-y-4 scale-[0.93] rounded-[28px] sm:rounded-[32px] bg-[#0A0C14]/60 border border-[#D4AF37]/15 blur-[1px] pointer-events-none" />
                    <div className="absolute inset-0 translate-y-1.5 sm:translate-y-2 scale-[0.97] rounded-[28px] sm:rounded-[32px] bg-[#0C0E18]/80 border border-[#D4AF37]/25 pointer-events-none" />

                    <AnimatePresence mode="wait">
                      {machine.currentStep === "CARD_1_PHONE" && (
                        <motion.div
                          key="card-1"
                          initial={{ y: 60, opacity: 0, scale: 0.9, rotateX: 10 }}
                          animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                          exit={{ y: -70, opacity: 0, scale: 0.94, filter: "blur(4px)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 26 }}
                          className="absolute inset-0 rounded-2xl sm:rounded-[32px] bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden"
                        >
                          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                          <Card1MobileLogin
                            onSubmit={machine.submitPhone}
                            isLoading={machine.isLoading}
                            error={machine.error}
                          />
                        </motion.div>
                      )}

                      {machine.currentStep === "CARD_1B_OTP" && (
                        <motion.div
                          key="card-1b"
                          initial={{ y: 40, opacity: 0, scale: 0.92 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          exit={{ y: -70, opacity: 0, scale: 0.94, filter: "blur(4px)" }}
                          transition={{ type: "spring", stiffness: 280, damping: 24 }}
                          className="absolute inset-0 rounded-2xl sm:rounded-[32px] bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden"
                        >
                          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                          <Card1BOtpDetached
                            phone={machine.phone}
                            otp={machine.otp}
                            setOtp={machine.setOtp}
                            onVerify={machine.verifyOtp}
                            onResend={() => machine.submitPhone(machine.phone)}
                            onBypass={machine.bypassOtp}
                            isLoading={machine.isLoading}
                            error={machine.error}
                          />
                        </motion.div>
                      )}

                      {machine.currentStep === "CARD_2_PERSONAL_ASTRO" && (
                        <motion.div
                          key="card-2"
                          initial={{ y: 60, opacity: 0, scale: 0.9, rotateX: 10 }}
                          animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                          exit={{ y: -70, opacity: 0, scale: 0.94, filter: "blur(4px)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 26 }}
                          className="absolute inset-0 rounded-2xl sm:rounded-[32px] bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden"
                        >
                          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                          <Card2PersonalAstro onSubmit={machine.submitPersonalAstro} />
                        </motion.div>
                      )}

                      {machine.currentStep === "CARD_3_GIFT_INTENT" && (
                        <motion.div
                          key="card-3"
                          initial={{ y: 60, opacity: 0, scale: 0.9, rotateX: 10 }}
                          animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                          exit={{ y: -70, opacity: 0, scale: 0.94, filter: "blur(4px)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 26 }}
                          className="absolute inset-0 rounded-2xl sm:rounded-[32px] bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden"
                        >
                          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                          <Card3GiftIntent onSelect={machine.selectGiftIntent} />
                        </motion.div>
                      )}

                      {machine.currentStep === "CARD_4_RECIPIENT_ASTRO" && (
                        <motion.div
                          key="card-4"
                          initial={{ y: 60, opacity: 0, scale: 0.9, rotateX: 10 }}
                          animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                          exit={{ y: -70, opacity: 0, scale: 0.94, filter: "blur(4px)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 26 }}
                          className="absolute inset-0 rounded-2xl sm:rounded-[32px] bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden"
                        >
                          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                          <Card4RecipientAstro
                            relationship={machine.recipient.relationship}
                            userProfile={machine.userProfile}
                            onSubmit={machine.submitRecipientAstro}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Deck Navigation */}
            <div className="flex items-center gap-3 sm:gap-4 pb-2 z-20">
              <button
                onClick={() => switchTile(1)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-all cursor-pointer"
                aria-label="Previous Tile"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => switchTile(3)}
                className="px-5 sm:px-6 py-2 rounded-full bg-white/5 border border-white/10 text-stone-300 text-[11px] sm:text-xs font-mono uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Explore Sanctuary</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* TILE 3: Full Luxury Footer Card (Replacing old 4th tile) */}
        {activeTile === 3 && (
          <motion.div
            key="tile-3-footer"
            custom={direction}
            initial={{ opacity: 0, y: direction > 0 ? 80 : -80, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction > 0 ? -80 : 80, scale: 0.94, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="absolute inset-0 w-full h-full flex flex-col justify-between items-center px-4 sm:px-8 pt-16 sm:pt-20 pb-6 overflow-y-auto bg-gradient-to-b from-[#0D101C] via-[#090B14] to-[#040508]"
          >
            <div className="w-full max-w-7xl mx-auto my-auto space-y-8 sm:space-y-12">
              {/* Top Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 border-b border-white/10 pb-8 sm:pb-12">
                {/* Column 1: Brand */}
                <div className="md:col-span-5 space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(212,175,55,0.35)] inline-block">
                    <img
                      src="/younoya_celestial_nebula_logo.png"
                      alt="YOUNOYA"
                      className="h-10 sm:h-12 w-auto object-cover"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-md font-normal">
                    Sacred Vedic Astrology-Blessed talismans and consecrated ritual keepsakes energized with 108 Gayatri Mantras under auspicious cosmic transits.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
                    <Sparkles size={11} />
                    <span>TIMELESS CONSECRATION & ZERO-PASSWORD FLOW</span>
                  </div>
                </div>

                {/* Column 2: Sanctuary */}
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400 font-bold">
                    Sanctuary
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-300">
                    <li>
                      <Link href="/about" className="hover:text-white transition-colors">
                        Sacred Heritage
                      </Link>
                    </li>
                    <li>
                      <button onClick={() => switchTile(1)} className="hover:text-white transition-colors cursor-pointer text-left">
                        12 Rashis Matrix
                      </button>
                    </li>
                    <li>
                      <button onClick={() => switchTile(2)} className="hover:text-white transition-colors cursor-pointer text-left">
                        Kundali Alignment
                      </button>
                    </li>
                    <li>
                      <Link href="/contact" className="hover:text-white transition-colors">
                        Reach Priests
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Policies */}
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400 font-bold">
                    Policies
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-300">
                    <li>
                      <Link href="/shipping" className="hover:text-white transition-colors">
                        Express Shipping
                      </Link>
                    </li>
                    <li>
                      <Link href="/refund" className="hover:text-white transition-colors">
                        Refund & Returns
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="hover:text-white transition-colors">
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="hover:text-white transition-colors">
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 4: Concierge */}
                <div className="md:col-span-3 space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400 font-bold">
                    Concierge
                  </h4>
                  <p className="text-xs text-stone-400">
                    Direct Astrological Inquiries:
                  </p>
                  <div className="text-xs font-mono text-[#D4AF37] font-bold">
                    support@younoya.com
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => switchTile(2)}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:scale-105 transition-all cursor-pointer shadow-lg"
                    >
                      <span>✦ Calculate Kundali</span>
                      <ArrowIcon size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Copyright */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400 pb-2">
                <div>
                  © {new Date().getFullYear()} YOUNOYA. All Rights Reserved.
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-stone-400">
                  <span>Free Express Air Delivery</span>
                  <span>•</span>
                  <span>Razorpay 256-Bit Encrypted</span>
                </div>
              </div>
            </div>

            {/* Back to top Button */}
            <div className="pt-2 z-20">
              <button
                onClick={() => switchTile(0)}
                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-stone-300 text-[11px] font-mono uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5"
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
