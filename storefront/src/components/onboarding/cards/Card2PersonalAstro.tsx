"use client";

import React, { useState, useMemo } from "react";
import { ArrowRight, User, Calendar, Clock, MapPin, Compass, ArrowLeft, Sparkles } from "lucide-react";
import { getWesternSunSign, calculateVedicRashi } from "@/lib/astrologyEngine";

interface Card2PersonalAstroProps {
  onSubmit: (data: { name: string; dob: string; tob?: string; pob?: string }) => void;
  onBack?: () => void;
}

export function Card2PersonalAstro({ onSubmit, onBack }: Card2PersonalAstroProps) {
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
    <div className="w-full flex flex-col justify-between h-full p-6 sm:p-8 select-none text-left">
      {/* Header with Back Button */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider backdrop-blur-md">
            <Compass size={11} className="animate-spin-slow text-[#D4AF37]" />
            <span>STEP 02 · PERSONAL KUNDALI BLUEPRINT</span>
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
          Your Sacred Birth Coordinates
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 font-light">
          We use ancient Vedic ephemeris to compute your exact Rashi, Nakshatra, and ruling planetary deities.
        </p>
      </div>

      {/* 2-Column Desktop Grid with High-Contrast Pearl Inputs */}
      <form onSubmit={handleSubmit} className="space-y-3.5 my-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300 font-semibold pl-0.5">
              Full Name
            </label>
            <div className="relative flex items-center group">
              <User size={15} className="absolute left-3.5 text-stone-300 group-focus-within:text-[#D4AF37] transition-colors" />
              <input
                type="text"
                required
                placeholder="e.g. Aryan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.15] border border-white/20 text-white text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300 font-semibold pl-0.5">
              Date of Birth
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
              Time of Birth (Accurate Rashi)
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
              Place of Birth (City, State)
            </label>
            <div className="relative flex items-center group">
              <MapPin size={15} className="absolute left-3.5 text-stone-300 group-focus-within:text-[#D4AF37] transition-colors" />
              <input
                type="text"
                placeholder="e.g. Jaipur, Rajasthan"
                value={pob}
                onChange={(e) => setPob(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.15] border border-white/20 text-white text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Live Astrology Preview Badges */}
        <div className="p-3 rounded-2xl bg-white/5 border border-[#D4AF37]/30 grid grid-cols-3 gap-2 text-center backdrop-blur-md">
          <div className="p-1">
            <span className="text-[9px] font-mono text-stone-300 uppercase block font-medium">Western Sun</span>
            <span className="text-xs sm:text-sm font-bold text-white truncate block">{previewData.sun.name}</span>
          </div>
          <div className="border-x border-white/15 p-1">
            <span className="text-[9px] font-mono text-[#D4AF37] uppercase block font-semibold">Vedic Rashi</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#D4AF37] truncate block">{previewData.rashi.name}</span>
          </div>
          <div className="p-1">
            <span className="text-[9px] font-mono text-stone-300 uppercase block font-medium">Nakshatra</span>
            <span className="text-xs sm:text-sm font-bold text-white truncate block">{previewData.nakshatra.split(" ")[0]}</span>
          </div>
        </div>

        {/* Fluid Golden Shimmer Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#FDF0CD] to-[#B8860B] text-[#07080E] font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.55)] hover:scale-[1.015] active:scale-[0.985] transition-all duration-300 cursor-pointer"
        >
          <span>Calculate Synergy & Continue</span>
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
