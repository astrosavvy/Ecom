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
        {/* Top Control Bar & Mode / Tutorial Switcher */}
        <div className="w-full flex flex-col gap-2.5 px-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold flex items-center gap-1.5">
                <Sparkles size={12} className="animate-spin-slow" />
                <span>YOUNOYA // SACRED VEDIC ALIGNMENT</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Testing / Tutorial Sandbox Switcher */}
          <div className="flex items-center justify-between p-1.5 rounded-2xl bg-black/60 border border-[#D4AF37]/30 backdrop-blur-md">
            <div className="flex items-center gap-1 text-[10px] font-mono text-stone-400 pl-2">
              <span>TEST MODE:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={machine.loadDemoNewUser}
                className={`px-3 py-1 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
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
                className={`px-3 py-1 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  machine.currentStep === "CARD_3_GIFT_INTENT"
                    ? "bg-[#D4AF37] text-[#07080E] shadow-sm"
                    : "bg-white/5 text-stone-300 hover:bg-white/10"
                }`}
              >
                ✦ Returning User
              </button>
            </div>
          </div>
        </div>

        {/* Stacked Cards Deck Area with Realistic 3D Cascading & Spring Physics */}
        <div className="relative w-full min-h-[520px] flex items-center justify-center [perspective:1600px]">
          {machine.currentStep === "DISSOLVING" || machine.currentStep === "COMPLETED" ? (
            <FluidBubbleDissolve
              userProfile={machine.userProfile}
              recipient={machine.recipient}
              synergy={machine.synergy}
              onComplete={machine.completeDissolve}
            />
          ) : (
            <div className="relative w-full h-[520px]">
              {/* Backing Cascade Silhouette Cards for 3D Deck Depth */}
              <div className="absolute inset-0 translate-y-4 scale-[0.92] rounded-[32px] bg-[#0A0C14]/60 border border-[#D4AF37]/15 blur-[1px] pointer-events-none transition-transform duration-500" />
              <div className="absolute inset-0 translate-y-2 scale-[0.96] rounded-[32px] bg-[#0C0E18]/80 border border-[#D4AF37]/25 pointer-events-none transition-transform duration-500" />

              {/* Active Stacked Card with Organic Fluid Motion */}
              <AnimatePresence mode="wait">
                {machine.currentStep === "CARD_1_PHONE" && (
                  <motion.div
                    key="card-1"
                    initial={{ y: 80, opacity: 0, scale: 0.9, rotateX: 12 }}
                    animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ y: -90, opacity: 0, scale: 0.94, rotateX: -8, filter: "blur(4px)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 26, mass: 0.8 }}
                    className="absolute inset-0 rounded-3xl sm:rounded-[32px] bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden"
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
                    initial={{ y: 50, opacity: 0, scale: 0.92 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -90, opacity: 0, scale: 0.94, filter: "blur(4px)" }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    className="absolute inset-0 rounded-3xl sm:rounded-[32px] bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden"
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
                    initial={{ y: 80, opacity: 0, scale: 0.9, rotateX: 12 }}
                    animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ y: -90, opacity: 0, scale: 0.94, rotateX: -8, filter: "blur(4px)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 26, mass: 0.8 }}
                    className="absolute inset-0 rounded-3xl sm:rounded-[32px] bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    <Card2PersonalAstro onSubmit={machine.submitPersonalAstro} />
                  </motion.div>
                )}

                {machine.currentStep === "CARD_3_GIFT_INTENT" && (
                  <motion.div
                    key="card-3"
                    initial={{ y: 80, opacity: 0, scale: 0.9, rotateX: 12 }}
                    animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ y: -90, opacity: 0, scale: 0.94, rotateX: -8, filter: "blur(4px)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 26, mass: 0.8 }}
                    className="absolute inset-0 rounded-3xl sm:rounded-[32px] bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    <Card3GiftIntent onSelect={machine.selectGiftIntent} />
                  </motion.div>
                )}

                {machine.currentStep === "CARD_4_RECIPIENT_ASTRO" && (
                  <motion.div
                    key="card-4"
                    initial={{ y: 80, opacity: 0, scale: 0.9, rotateX: 12 }}
                    animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ y: -90, opacity: 0, scale: 0.94, rotateX: -8, filter: "blur(4px)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 26, mass: 0.8 }}
                    className="absolute inset-0 rounded-3xl sm:rounded-[32px] bg-[#080A10]/95 backdrop-blur-3xl border border-[#D4AF37]/45 shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden"
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
