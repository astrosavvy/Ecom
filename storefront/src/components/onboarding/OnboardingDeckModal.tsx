"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { GooeyFilterDefs } from "./GooeyFilterDefs";
import { useOnboardingMachine, OnboardingStep } from "./useOnboardingMachine";
import { Card1MobileLogin } from "./cards/Card1MobileLogin";
import { Card1BOtpDetached } from "./cards/Card1BOtpDetached";
import { Card2PersonalAstro } from "./cards/Card2PersonalAstro";
import { Card3GiftIntent } from "./cards/Card3GiftIntent";
import { Card4RecipientAstro } from "./cards/Card4RecipientAstro";
import { FluidBubbleDissolve } from "./transitions/FluidBubbleDissolve";

interface OnboardingDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingDeckModal({ isOpen, onClose }: OnboardingDeckModalProps) {
  const machine = useOnboardingMachine();

  // Reset machine if reopened
  useEffect(() => {
    if (isOpen) {
      // Keep state or reset if completed
      if (machine.currentStep === "COMPLETED") {
        machine.reset();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl selection:bg-[#D4AF37] selection:text-[#07080E]">
      {/* Hidden SVG Filter Definitions for Gooey & Bubble Shimmer */}
      <GooeyFilterDefs />

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-[#DC2626]/10 blur-[120px]" />
      </div>

      {/* Main Modal Shell */}
      <div className="relative w-full max-w-lg z-10 flex flex-col items-center">
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between px-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
              YOUNOYA // CONSECRATION ONBOARDING
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stacked Cards Deck Area */}
        <div className="relative w-full min-h-[480px] flex items-center justify-center [perspective:1200px]">
          {machine.currentStep === "DISSOLVING" || machine.currentStep === "COMPLETED" ? (
            <FluidBubbleDissolve
              userProfile={machine.userProfile}
              recipient={machine.recipient}
              synergy={machine.synergy}
              onComplete={machine.completeDissolve}
            />
          ) : (
            <div className="relative w-full h-[480px]">
              {/* Card 1 & 1B Container (with Gooey Detachment) */}
              <AnimatePresence mode="wait">
                {machine.currentStep === "CARD_1_PHONE" && (
                  <motion.div
                    key="card-1"
                    initial={{ y: 60, opacity: 0, scale: 0.92, rotateX: 10 }}
                    animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ y: -60, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="absolute inset-0 rounded-3xl sm:rounded-[32px] bg-[#0E1017]/95 backdrop-blur-2xl border border-[#D4AF37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
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
                    initial={{ y: 40, opacity: 0, scale: 0.94 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -60, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                    className="absolute inset-0 rounded-3xl sm:rounded-[32px] bg-[#0E1017]/95 backdrop-blur-2xl border border-[#D4AF37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    <Card1BOtpDetached
                      phone={machine.phone}
                      otp={machine.otp}
                      setOtp={machine.setOtp}
                      onVerify={machine.verifyOtp}
                      onResend={() => machine.submitPhone(machine.phone)}
                      isLoading={machine.isLoading}
                      error={machine.error}
                    />
                  </motion.div>
                )}

                {machine.currentStep === "CARD_2_PERSONAL_ASTRO" && (
                  <motion.div
                    key="card-2"
                    initial={{ y: 60, opacity: 0, scale: 0.92, rotateX: 10 }}
                    animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ y: -60, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="absolute inset-0 rounded-3xl sm:rounded-[32px] bg-[#0E1017]/95 backdrop-blur-2xl border border-[#D4AF37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    <Card2PersonalAstro onSubmit={machine.submitPersonalAstro} />
                  </motion.div>
                )}

                {machine.currentStep === "CARD_3_GIFT_INTENT" && (
                  <motion.div
                    key="card-3"
                    initial={{ y: 60, opacity: 0, scale: 0.92, rotateX: 10 }}
                    animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ y: -60, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="absolute inset-0 rounded-3xl sm:rounded-[32px] bg-[#0E1017]/95 backdrop-blur-2xl border border-[#D4AF37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    <Card3GiftIntent onSelect={machine.selectGiftIntent} />
                  </motion.div>
                )}

                {machine.currentStep === "CARD_4_RECIPIENT_ASTRO" && (
                  <motion.div
                    key="card-4"
                    initial={{ y: 60, opacity: 0, scale: 0.92, rotateX: 10 }}
                    animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ y: -60, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="absolute inset-0 rounded-3xl sm:rounded-[32px] bg-[#0E1017]/95 backdrop-blur-2xl border border-[#D4AF37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
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
