"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Card1MobileLogin } from "@/components/onboarding/cards/Card1MobileLogin";
import { Card1BOtpDetached } from "@/components/onboarding/cards/Card1BOtpDetached";
import { Card2PersonalAstro } from "@/components/onboarding/cards/Card2PersonalAstro";
import { Card3GiftIntent } from "@/components/onboarding/cards/Card3GiftIntent";
import { Card4RecipientAstro } from "@/components/onboarding/cards/Card4RecipientAstro";
import { FluidBubbleDissolve } from "@/components/onboarding/transitions/FluidBubbleDissolve";
import { useOnboardingMachine } from "@/components/onboarding/useOnboardingMachine";
import { GridCrosshair } from "@/components/ui/GridCrosshair";

/**
 * OnboardingDeck — High-performance, luxury pearl-gold QnA deck featuring:
 * - Spacious max-w-2xl desktop proportions and balanced mobile side gutters
 * - Full backward navigation (goBack) on all steps
 * - High-contrast pearl & white UI components
 * - Horizontal card slide transitions isolated from parent wheel gestures
 */

const STEPS = [
  { key: "CARD_1_PHONE", label: "Mobile Pass", num: 1 },
  { key: "CARD_1B_OTP", label: "Verify Code", num: 1 },
  { key: "CARD_2_PERSONAL_ASTRO", label: "Your Blueprint", num: 2 },
  { key: "CARD_3_GIFT_INTENT", label: "Sacred Intent", num: 3 },
  { key: "CARD_4_RECIPIENT_ASTRO", label: "Recipient Synergy", num: 4 },
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
  // CRITICAL: Isolate wheel & touch events from parent tile swiper
  // ═══════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
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

  // Horizontal slide spring variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 280 : -280,
      opacity: 0,
      scale: 0.94,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -280 : 280,
      opacity: 0,
      scale: 0.94,
    }),
  };

  return (
    <div
      ref={containerRef}
      data-scroll-container
      className="w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-2 md:py-4"
    >
      <div className="w-full max-w-2xl z-10 flex flex-col items-center gap-2.5 sm:gap-3.5">
        {/* Test Mode Switcher */}
        <div className="w-full flex items-center justify-between p-1.5 rounded-2xl bg-black/60 border border-[#D4AF37]/35 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono text-stone-300 pl-2">
            <Sparkles size={11} className="text-[#D4AF37]" />
            <span>TEST SANDBOX:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={machine.loadDemoNewUser}
              className={`px-3 py-1 rounded-xl text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                machine.currentStep === "CARD_1_PHONE" || machine.currentStep === "CARD_1B_OTP"
                  ? "bg-[#D4AF37] text-[#07080E] shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                  : "bg-white/10 text-stone-200 hover:bg-white/20"
              }`}
            >
              ✦ New User
            </button>
            <button
              type="button"
              onClick={machine.loadDemoReturningUser}
              className={`px-3 py-1 rounded-xl text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                machine.currentStep === "CARD_3_GIFT_INTENT"
                  ? "bg-[#D4AF37] text-[#07080E] shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                  : "bg-white/10 text-stone-200 hover:bg-white/20"
              }`}
            >
              ✦ Returning
            </button>
          </div>
        </div>

        {/* Step Progress Bar with Connected Gold Fill */}
        {!isDissolving && (
          <div className="w-full flex items-center gap-2.5 px-2">
            {Array.from({ length: totalSteps }, (_, i) => {
              const stepNum = i + 1;
              const isActive = currentStepNum === stepNum;
              const isCompleted = currentStepNum > stepNum;
              return (
                <React.Fragment key={stepNum}>
                  {i > 0 && (
                    <div className="flex-1 h-[2px] relative rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-white/15" />
                      <motion.div
                        className="absolute inset-0 bg-[#D4AF37] origin-left shadow-[0_0_8px_#D4AF37]"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isCompleted ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  )}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300 shrink-0 ${
                      isActive
                        ? "bg-[#D4AF37] text-[#07080E] shadow-[0_0_16px_rgba(212,175,55,0.55)] scale-110"
                        : isCompleted
                        ? "bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]"
                        : "bg-white/10 text-stone-400 border border-white/20"
                    }`}
                  >
                    {stepNum}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Card Surface Container */}
        <div className="relative w-full min-h-[460px] md:min-h-[500px]">
          {/* Structural Crosshairs at Corners */}
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
            <div className="relative w-full h-[460px] md:h-[500px]">
              {/* Backing Depth Silhouettes with Gold Rim Glow */}
              <div className="absolute inset-0 translate-y-3 scale-[0.96] rounded-3xl bg-[#090b14]/70 border border-[#D4AF37]/20 blur-[1px] pointer-events-none" />
              <div className="absolute inset-0 translate-y-1.5 scale-[0.98] rounded-3xl bg-[#0c0e18]/85 border border-[#D4AF37]/30 pointer-events-none" />

              <AnimatePresence mode="wait" custom={direction}>
                {machine.currentStep === "CARD_1_PHONE" && (
                  <motion.div
                    key="card-1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                    className="absolute inset-0 rounded-3xl bg-[#0a0c16]/90 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.12)] overflow-hidden"
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
                    className="absolute inset-0 rounded-3xl bg-[#0a0c16]/90 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.12)] overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    <Card1BOtpDetached
                      phone={machine.phone}
                      otp={machine.otp}
                      setOtp={machine.setOtp}
                      onVerify={machine.verifyOtp}
                      onResend={() => machine.submitPhone(machine.phone)}
                      onBypass={machine.bypassOtp}
                      onBack={machine.goBack}
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
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                    className="absolute inset-0 rounded-3xl bg-[#0a0c16]/90 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.12)] overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    <Card2PersonalAstro
                      onSubmit={machine.submitPersonalAstro}
                      onBack={machine.goBack}
                    />
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
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                    className="absolute inset-0 rounded-3xl bg-[#0a0c16]/90 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.12)] overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    <Card3GiftIntent
                      onSelect={machine.selectGiftIntent}
                      onBack={machine.goBack}
                    />
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
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                    className="absolute inset-0 rounded-3xl bg-[#0a0c16]/90 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.12)] overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    <Card4RecipientAstro
                      relationship={machine.recipient.relationship}
                      userProfile={machine.userProfile}
                      onSubmit={machine.submitRecipientAstro}
                      onBack={machine.goBack}
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
