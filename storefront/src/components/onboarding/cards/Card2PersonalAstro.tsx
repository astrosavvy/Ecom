"use client";

import React, { useState, useMemo } from "react";
import { ArrowRight, User, Calendar, Clock, MapPin, Compass } from "lucide-react";
import { getWesternSunSign, calculateVedicRashi } from "@/lib/astrologyEngine";

interface Card2PersonalAstroProps {
  onSubmit: (data: { name: string; dob: string; tob?: string; pob?: string }) => void;
}

export function Card2PersonalAstro({ onSubmit }: Card2PersonalAstroProps) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("1998-05-15");
  const [tob, setTob] = useState("08:30");
  const [pob, setPob] = useState("Mumbai, Maharashtra");

  // Real-time optimistic astrology computation preview
  const previewData = useMemo(() => {
    const sun = getWesternSunSign(dob);
    const { rashi, nakshatra } = calculateVedicRashi(dob, tob);
    return { sun, rashi, nakshatra };
  }, [dob, tob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name: name || "Seeker", dob, tob, pob });
  };

  return (
    <div className="w-full flex flex-col justify-between h-full p-4 sm:p-6 select-none text-left">
      {/* Compact Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] font-mono uppercase tracking-wider">
          <Compass size={10} className="animate-spin-slow" />
          <span>STEP 02 · KUNDALI BLUEPRINT</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#FDFCF8] tracking-tight">
          Your Celestial Coordinates
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
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* DOB & TOB in 2 cols */}
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
            placeholder="City, State"
            value={pob}
            onChange={(e) => setPob(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Live Calculation — Compact Inline Chips */}
        <div className="flex items-center gap-2 py-1.5">
          <div className="flex-1 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[8px] font-mono text-stone-400 uppercase block">Sun</span>
            <span className="text-[11px] font-bold text-white truncate block">{previewData.sun.name}</span>
          </div>
          <div className="flex-1 px-2.5 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-center">
            <span className="text-[8px] font-mono text-[#D4AF37] uppercase block">Rashi</span>
            <span className="text-[11px] font-bold text-[#D4AF37] truncate block">{previewData.rashi.name}</span>
          </div>
          <div className="flex-1 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[8px] font-mono text-stone-400 uppercase block">Nakshatra</span>
            <span className="text-[11px] font-bold text-white truncate block">{previewData.nakshatra.split(" ")[0]}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>Calculate Synergy & Continue</span>
          <ArrowRight size={14} />
        </button>
      </form>
    </div>
  );
}
