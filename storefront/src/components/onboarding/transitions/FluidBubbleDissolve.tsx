"use client";

import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Star, ArrowRight, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { AstroKundaliProfile, SynergyResult } from "@/lib/astrologyEngine";

interface FluidBubbleDissolveProps {
  userProfile: AstroKundaliProfile;
  recipient: { relationship: string; name: string };
  synergy: SynergyResult | null;
  onComplete: () => void;
}

interface BubbleParticle {
  id: number;
  size: number;
  startX: number;
  startY: number;
  driftX: number;
  driftY: number;
  scale: number;
  delay: number;
  duration: number;
}

export function FluidBubbleDissolve({
  userProfile,
  recipient,
  synergy,
  onComplete,
}: FluidBubbleDissolveProps) {
  // Generate 20 organic fluid metaball bubbles
  const bubbles: BubbleParticle[] = useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => {
      const angle = (i / 22) * 2 * Math.PI;
      const distance = 40 + Math.random() * 120;
      return {
        id: i,
        size: 24 + Math.random() * 64, // 24px to 88px
        startX: (Math.random() - 0.5) * 160,
        startY: (Math.random() - 0.5) * 160,
        driftX: Math.cos(angle) * distance * 1.5,
        driftY: -100 - Math.random() * 220, // Float strongly upward
        scale: 1.2 + Math.random() * 0.8,
        delay: i * 0.035,
        duration: 1.2 + Math.random() * 0.6,
      };
    });
  }, []);

  const [phase, setPhase] = React.useState<"dissolving" | "revealed">("dissolving");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("revealed");
      onComplete();
    }, 1400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative w-full min-h-[460px] flex items-center justify-center">
      {/* 1. Fluid Bubble Gooey Explosion Layer */}
      {phase === "dissolving" && (
        <div
          className="relative w-full h-96 flex items-center justify-center overflow-visible pointer-events-none"
          style={{ filter: "url(#younoya-gooey-filter)" }}
        >
          {/* Central Golden Prana Core */}
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="w-44 h-44 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F59E0B] to-[#DC2626] shadow-[0_0_80px_#D4AF37]"
          />

          {/* Orbiting / Ascending Metaball Bubbles */}
          {bubbles.map((b) => (
            <motion.div
              key={b.id}
              initial={{
                x: b.startX,
                y: b.startY,
                scale: 0.4,
                opacity: 0.9,
              }}
              animate={{
                x: b.startX + b.driftX,
                y: b.startY + b.driftY,
                scale: [0.4, b.scale, 0],
                opacity: [0.9, 1, 0],
              }}
              transition={{
                duration: b.duration,
                delay: b.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute rounded-full bg-gradient-to-b from-[#FFF2B2] via-[#D4AF37] to-[#B8860B]"
              style={{
                width: b.size,
                height: b.size,
                boxShadow: "0 0 25px rgba(212,175,55,0.7)",
              }}
            />
          ))}
        </div>
      )}

      {/* 2. Revealed Personalized Consecrated Result View */}
      {phase === "revealed" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full text-left space-y-6"
        >
          {/* Celestial Synergy Header */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#141724] to-[#0A0C13] border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden space-y-4">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider font-bold">
                <Sparkles size={11} className="animate-spin-slow" />
                <span>CONSECRATED KUNDALI ALIGNMENT COMPLETED</span>
              </div>
              {synergy && (
                <div className="px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-xs font-mono font-bold">
                  {synergy.score}% SYNERGY
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FDFCF8] font-heading tracking-tight">
                {userProfile.moonSign.name} ⟷ {recipient.relationship} ({recipient.name || "Recipient"})
              </h3>
              <p className="text-xs sm:text-sm text-[#D4AF37] font-mono">
                {synergy?.harmonyTitle || "Auspicious Kundali Synergy"}
              </p>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {synergy?.synergyDescription ||
                "Your celestial energies create a protective pranic aura. Consecrated with 108 Gayatri Mantras."}
            </p>

            {/* Inclusions & Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2 text-stone-200">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>Rashi Gemstone: <strong className="text-white">{userProfile.moonSign.gemstone}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-stone-200">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>Protective Bead: <strong className="text-white">{userProfile.moonSign.rudraksha}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-stone-200">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>Nakshatra: <strong className="text-white">{userProfile.nakshatra}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-stone-200">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>Deity Blessing: <strong className="text-white">{userProfile.moonSign.deity}</strong></span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/products/${userProfile.moonSign.recommendedHandle}`}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] font-extrabold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:scale-105 transition-all"
              >
                <span>View Harmonized Sacred Rakhi</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
