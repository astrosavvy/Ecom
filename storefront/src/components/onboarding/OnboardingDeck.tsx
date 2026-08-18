"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Card1MobileLogin } from "@/components/onboarding/cards/Card1MobileLogin";
import { Card1BOtpDetached } from "@/components/onboarding/cards/Card1BOtpDetached";
import { Card2PersonalAstro } from "@/components/onboarding/cards/Card2PersonalAstro";
import { Card3GiftIntent } from "@/components/onboarding/cards/Card3GiftIntent";
import { Card4RecipientAstro } from "@/components/onboarding/cards/Card4RecipientAstro";
import { FluidBubbleDissolve } from "@/components/onboarding/transitions/FluidBubbleDissolve";
import { useOnboardingMachine } from "@/components/onboarding/useOnboardingMachine";
import { GridCrosshair } from "@/components/ui/GridCrosshair";

/**
 * OnboardingDeck — Complete self-contained QnA card deck with:
 * - Wheel/touch event isolation (prevents parent tile switching)
 * - Horizontal card slide transitions (no conflict with vertical deck)
 * - Step progress bar
 * - Compact mobile-first layout
 */

const STEPS = [
  { key: "CARD_1_PHONE", label: "Login", num: 1 },
  { key: "CARD_1B_OTP", label: "Verify", num: 1 },
  { key: "CARD_2_PERSONAL_ASTRO", label: "Birth Chart", num: 2 },
  { key: "CARD_3_GIFT_INTENT", label: "Intent", num: 3 },
  { key: "CARD_4_RECIPIENT_ASTRO", label: "Recipient", num: 4 },
];

function getStepIndex(step: string): number {
  const idx = STEPS.findIndex((s) => s.key === step);
  return idx >= 0 ? idx : 0;
}

function getStepNum(step: string): number {
  const found = STEPS.find((s) => s.key === step);
  return found ? found.num : 1;
}

export function OnboardingDeck() {
  const machine = useOnboardingMachine();
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(machine.currentStep);

  // Determine slide direction: 1 = forward (left), -1 = backward (right)
  const getDirection = useCallback(() => {
    const prev = getStepIndex(prevStepRef.current);
    const curr = getStepIndex(machine.currentStep);
    return curr >= prev ? 1 : -1;
  }, [machine.currentStep]);

  useEffect(() => {
    prevStepRef.current = machine.currentStep;
  }, [machine.currentStep]);

  // ═══════════════════════════════════════════
  // CRITICAL: Isolate wheel events from parent deck
  // ═══════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Stop wheel events from reaching the parent FluidCardDeck
      e.stopPropagation();
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.stopPropagation();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.stopPropagation();
    };

    container.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const direction = getDirection();
  const currentStepNum = getStepNum(machine.currentStep);
  const isDissolving = machine.currentStep === "DISSOLVING" || machine.currentStep === "COMPLETED";
  const totalSteps = 4;

  // Horizontal slide variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.92,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.92,
    }),
  };

  return (
    <div
      ref={containerRef}
      data-scroll-container
      className="w-full h-full flex flex-col items-center justify-center px-3 sm:px-4 py-4"
    >
      <div className="w-full max-w-lg z-10 flex flex-col items-center gap-3">
        {/* Test Mode Switcher */}
        <div className="w-full flex items-center justify-between p-1 sm:p-1.5 rounded-2xl bg-black/60 border border-[#D4AF37]/30 backdrop-blur-md">
          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-stone-400 pl-2">
            <Sparkles size={11} className="text-[#D4AF37]" />
            <span>TEST:</span>
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
              ✦ Returning
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        {!isDissolving && (
          <div className="w-full flex items-center gap-2 px-1">
            {Array.from({ length: totalSteps }, (_, i) => {
              const stepNum = i + 1;
              const isActive = currentStepNum === stepNum;
              const isCompleted = currentStepNum > stepNum;
              return (
                <React.Fragment key={stepNum}>
                  {i > 0 && (
                    <div className="flex-1 h-px relative">
                      <div className="absolute inset-0 bg-white/10" />
                      <motion.div
                        className="absolute inset-0 bg-[#D4AF37] origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isCompleted ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  )}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300 shrink-0 ${
                      isActive
                        ? "bg-[#D4AF37] text-[#07080E] shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                        : isCompleted
                        ? "bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/50"
                        : "bg-white/5 text-stone-500 border border-white/10"
                    }`}
                  >
                    {stepNum}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Card Surface with Crosshair Decorations */}
        <div className="relative w-full min-h-[400px] sm:min-h-[440px]">
          {/* Crosshair decorations at corners */}
          <GridCrosshair className="absolute -top-1.5 -left-1.5 z-20" />
          <GridCrosshair className="absolute -top-1.5 -right-1.5 z-20" />
          <GridCrosshair className="absolute -bottom-1.5 -left-1.5 z-20" />
          <GridCrosshair className="absolute -bottom-1.5 -right-1.5 z-20" />

          {isDissolving ? (
            <FluidBubbleDissolve
              userProfile={machine.userProfile}
              recipient={machine.recipient}
              synergy={machine.synergy}
              onComplete={machine.completeDissolve}
            />
          ) : (
            <div className="relative w-full h-[400px] sm:h-[440px]">
              {/* Backing Depth Silhouettes */}
              <div className="absolute inset-0 translate-y-2 scale-[0.95] rounded-2xl sm:rounded-3xl bg-[#0A0C14]/50 border border-[#D4AF37]/10 blur-[1px] pointer-events-none" />
              <div className="absolute inset-0 translate-y-1 scale-[0.98] rounded-2xl sm:rounded-3xl bg-[#0C0E18]/70 border border-[#D4AF37]/20 pointer-events-none" />

              <AnimatePresence mode="wait" custom={direction}>
                {machine.currentStep === "CARD_1_PHONE" && (
                  <motion.div
                    key="card-1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/40 shadow-[0_16px_48px_rgba(0,0,0,0.9)] overflow-hidden"
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
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                    className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/40 shadow-[0_16px_48px_rgba(0,0,0,0.9)] overflow-hidden"
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
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/40 shadow-[0_16px_48px_rgba(0,0,0,0.9)] overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    <Card2PersonalAstro onSubmit={machine.submitPersonalAstro} />
                  </motion.div>
                )}

                {machine.currentStep === "CARD_3_GIFT_INTENT" && (
                  <motion.div
                    key="card-3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/40 shadow-[0_16px_48px_rgba(0,0,0,0.9)] overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    <Card3GiftIntent onSelect={machine.selectGiftIntent} />
                  </motion.div>
                )}

                {machine.currentStep === "CARD_4_RECIPIENT_ASTRO" && (
                  <motion.div
                    key="card-4"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/40 shadow-[0_16px_48px_rgba(0,0,0,0.9)] overflow-hidden"
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
    </div>
  );
}
