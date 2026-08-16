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
    <div className="w-full flex flex-col justify-between h-full p-6 sm:p-8 select-none text-left overflow-y-auto">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider">
          <HeartHandshake size={11} className="text-[#D4AF37]" />
          <span>STEP 04 // RECIPIENT ASTRAL HARMONY</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FDFCF8] font-heading tracking-tight">
          {relationship}&apos;s Cosmic Chart
        </h3>
        <p className="text-xs text-stone-300">
          Enter their birth date to harmonize planetary energies and formulate personalized consecration.
        </p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-3.5 my-3">
        {/* Recipient Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
            {relationship}&apos;s Name
          </label>
          <div className="relative flex items-center">
            <User size={14} className="absolute left-3 text-stone-400" />
            <input
              type="text"
              required
              placeholder={`e.g. ${relationship}'s Name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Date of Birth & Optional Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
              Date of Birth *
            </label>
            <div className="relative flex items-center">
              <Calendar size={14} className="absolute left-3 text-stone-400" />
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full pl-9 pr-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
              Time (Optional)
            </label>
            <div className="relative flex items-center">
              <Clock size={14} className="absolute left-3 text-stone-400" />
              <input
                type="time"
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className="w-full pl-9 pr-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Optional Place of Birth */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
            Place of Birth (Optional)
          </label>
          <div className="relative flex items-center">
            <MapPin size={14} className="absolute left-3 text-stone-400" />
            <input
              type="text"
              placeholder="e.g. New Delhi, India"
              value={pob}
              onChange={(e) => setPob(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Dynamic Synergy Preview Badge */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-[#D4AF37]/15 to-[#B8860B]/10 border border-[#D4AF37]/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold block">
              ASTRAL HARMONIZATION PAIRING
            </span>
            <span className="text-xs font-semibold text-stone-200">
              {userProfile.moonSign.name} (You) ⟷ {recipientSun.name} ({relationship})
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-[#D4AF37] text-[#07080E] text-[10px] font-mono font-extrabold uppercase">
            {userProfile.moonSign.element} + {recipientSun.element}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] text-[#07080E] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <Sparkles size={15} />
          <span>Synthesize Kundali & Consecrate</span>
          <ArrowRight size={15} />
        </button>
      </form>
    </div>
  );
}
