"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, ArrowRight, User, Calendar, Clock, MapPin, HeartHandshake } from "lucide-react";
import { getWesternSunSign, AstroKundaliProfile } from "@/lib/astrologyEngine";

interface Card4RecipientAstroProps {
  relationship: string;
  userProfile: AstroKundaliProfile;
  onSubmit: (data: { name: string; dob: string; tob?: string; pob?: string }) => void;
}

export function Card4RecipientAstro({
  relationship,
  userProfile,
  onSubmit,
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
    <div className="w-full flex flex-col justify-between h-full p-4 sm:p-6 select-none text-left">
      {/* Compact Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] font-mono uppercase tracking-wider">
          <HeartHandshake size={10} />
          <span>STEP 04 · RECIPIENT HARMONY</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#FDFCF8] tracking-tight">
          {relationship}&apos;s Cosmic Chart
        </h3>
      </div>

      {/* Compact Form */}
      <form onSubmit={handleSubmit} className="space-y-2.5 my-2">
        {/* Name */}
        <div className="relative flex items-center">
          <User size={13} className="absolute left-3 text-stone-400" />
          <input
            type="text"
            required
            placeholder={`${relationship}'s Name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* DOB & TOB */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative flex items-center">
            <Calendar size={13} className="absolute left-3 text-stone-400" />
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full pl-8 pr-2 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div className="relative flex items-center">
            <Clock size={13} className="absolute left-3 text-stone-400" />
            <input
              type="time"
              value={tob}
              onChange={(e) => setTob(e.target.value)}
              className="w-full pl-8 pr-2 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Place of Birth */}
        <div className="relative flex items-center">
          <MapPin size={13} className="absolute left-3 text-stone-400" />
          <input
            type="text"
            placeholder="City, State (Optional)"
            value={pob}
            onChange={(e) => setPob(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Synergy Preview — Compact Inline */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37]/10 to-[#B8860B]/5 border border-[#D4AF37]/25">
          <div className="flex-1 space-y-0.5">
            <span className="text-[8px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold block">
              ASTRAL PAIRING
            </span>
            <span className="text-[11px] font-semibold text-stone-200">
              {userProfile.moonSign.name} ⟷ {recipientSun.name}
            </span>
          </div>
          <div className="px-2 py-1 rounded-full bg-[#D4AF37] text-[#07080E] text-[9px] font-mono font-extrabold uppercase shrink-0">
            {userProfile.moonSign.element} + {recipientSun.element}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] text-[#07080E] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <Sparkles size={14} />
          <span>Consecrate & Reveal</span>
          <ArrowRight size={14} />
        </button>
      </form>
    </div>
  );
}
