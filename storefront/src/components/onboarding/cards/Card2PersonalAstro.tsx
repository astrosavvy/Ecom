"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, ArrowRight, User, Calendar, Clock, MapPin, Compass } from "lucide-react";
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
    <div className="w-full flex flex-col justify-between h-full p-6 sm:p-8 select-none text-left overflow-y-auto">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider">
          <Compass size={11} className="animate-spin-slow" />
          <span>STEP 02 // PERSONAL KUNDALI BLUEPRINT</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FDFCF8] font-heading tracking-tight">
          Your Celestial Coordinates
        </h3>
        <p className="text-xs text-stone-300">
          We use ancient Vedic ephemeris to compute your Rashi, Nakshatra, and ruling deities.
        </p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-3.5 my-3">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User size={14} className="absolute left-3 text-stone-400" />
            <input
              type="text"
              required
              placeholder="e.g. Aryan Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Date of Birth & Time of Birth in 2 Cols */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
              Date of Birth
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
              Time of Birth
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

        {/* Place of Birth */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
            Place of Birth (City, State)
          </label>
          <div className="relative flex items-center">
            <MapPin size={14} className="absolute left-3 text-stone-400" />
            <input
              type="text"
              placeholder="e.g. Jaipur, Rajasthan"
              value={pob}
              onChange={(e) => setPob(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Live Calculation Pill Badges */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-white/5 to-[#D4AF37]/5 border border-[#D4AF37]/20 grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="text-[9px] font-mono text-stone-400 uppercase block">Sun Sign</span>
            <span className="text-xs font-bold text-white truncate block">{previewData.sun.name}</span>
          </div>
          <div className="border-x border-white/10">
            <span className="text-[9px] font-mono text-[#D4AF37] uppercase block">Vedic Rashi</span>
            <span className="text-xs font-bold text-[#D4AF37] truncate block">{previewData.rashi.name}</span>
          </div>
          <div>
            <span className="text-[9px] font-mono text-stone-400 uppercase block">Nakshatra</span>
            <span className="text-xs font-bold text-white truncate block">{previewData.nakshatra.split(" ")[0]}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>Calculate Synergy & Continue</span>
          <ArrowRight size={14} />
        </button>
      </form>
    </div>
  );
}
