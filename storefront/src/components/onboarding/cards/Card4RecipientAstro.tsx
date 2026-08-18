"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, ArrowRight, User, Calendar, Clock, MapPin, HeartHandshake, ArrowLeft } from "lucide-react";
import { getWesternSunSign, AstroKundaliProfile } from "@/lib/astrologyEngine";

interface Card4RecipientAstroProps {
  relationship: string;
  userProfile: AstroKundaliProfile;
  onSubmit: (data: { name: string; dob: string; tob?: string; pob?: string }) => void;
  onBack?: () => void;
}

export function Card4RecipientAstro({
  relationship,
  userProfile,
  onSubmit,
  onBack,
}: Card4RecipientAstroProps) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("2000-08-10");
  const [tob, setTob] = useState("");
  const [pob, setPob] = useState("");

  const recipientSun = useMemo(() => {
    return getWesternSunSign(dob);
  }, [dob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name: name || relationship, dob, tob, pob });
  };

  return (
    <div className="w-full flex flex-col justify-between h-full p-6 sm:p-8 select-none text-left">
      {/* Header with Back Button */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider backdrop-blur-md">
            <HeartHandshake size={11} className="text-[#D4AF37]" />
            <span>STEP 04 · RECIPIENT ASTRAL HARMONY</span>
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-stone-300 hover:text-white text-[11px] font-mono transition-all cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </button>
          )}
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FDFCF8] tracking-tight">
          {relationship}&apos;s Cosmic Coordinates
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 font-light">
          Enter their sacred birth date to calculate cross-planetary synergy and consecrate personalized auspicious keepsakes.
        </p>
      </div>

      {/* 2-Column Desktop Grid with High-Contrast Pearl Inputs */}
      <form onSubmit={handleSubmit} className="space-y-3.5 my-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Recipient Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300 font-semibold pl-0.5">
              {relationship}&apos;s Name
            </label>
            <div className="relative flex items-center group">
              <User size={15} className="absolute left-3.5 text-stone-300 group-focus-within:text-[#D4AF37] transition-colors" />
              <input
                type="text"
                required
                placeholder={`e.g. ${relationship}'s Name`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.15] border border-white/20 text-white text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300 font-semibold pl-0.5">
              Date of Birth *
            </label>
            <div className="relative flex items-center group">
              <Calendar size={15} className="absolute left-3.5 text-stone-300 group-focus-within:text-[#D4AF37] transition-colors" />
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.15] border border-white/20 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Time of Birth */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300 font-semibold pl-0.5">
              Time of Birth (Optional)
            </label>
            <div className="relative flex items-center group">
              <Clock size={15} className="absolute left-3.5 text-stone-300 group-focus-within:text-[#D4AF37] transition-colors" />
              <input
                type="time"
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.15] border border-white/20 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Place of Birth */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300 font-semibold pl-0.5">
              Place of Birth (Optional)
            </label>
            <div className="relative flex items-center group">
              <MapPin size={15} className="absolute left-3.5 text-stone-300 group-focus-within:text-[#D4AF37] transition-colors" />
              <input
                type="text"
                placeholder="e.g. New Delhi, India"
                value={pob}
                onChange={(e) => setPob(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.15] border border-white/20 text-white text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Radiant Astral Synergy Pairing Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-white/10 via-[#D4AF37]/15 to-white/5 border border-[#D4AF37]/40 flex items-center justify-between backdrop-blur-md">
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold block">
              ✦ ASTRAL HARMONIZATION PAIRING
            </span>
            <span className="text-xs sm:text-sm font-semibold text-white">
              {userProfile.moonSign.name} (You) ⟷ {recipientSun.name} ({relationship})
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#07080E] text-[10px] font-mono font-extrabold uppercase shadow-sm">
            {userProfile.moonSign.element} + {recipientSun.element}
          </div>
        </div>

        {/* Fluid Golden Shimmer Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#FDF0CD] to-[#B8860B] text-[#07080E] font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.55)] hover:scale-[1.015] active:scale-[0.985] transition-all duration-300 cursor-pointer"
        >
          <Sparkles size={16} />
          <span>Synthesize Kundali & Consecrate</span>
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
