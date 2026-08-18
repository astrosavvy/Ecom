"use client";

import React, { useState } from "react";
import { Phone, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface Card1MobileLoginProps {
  onSubmit: (phone: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export function Card1MobileLogin({ onSubmit, isLoading, error }: Card1MobileLoginProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(phoneNumber);
  };

  return (
    <div className="w-full flex flex-col justify-between h-full p-6 sm:p-8 select-none text-left">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider backdrop-blur-md">
          <Sparkles size={11} className="animate-spin-slow text-[#D4AF37]" />
          <span>STEP 01 · VEDIC ASTRAL ONBOARDING</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FDFCF8] tracking-tight">
          Unlock Your Sacred Kundali
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
          Enter your mobile number to synchronize ancient Vedic planetary ephemeris and receive your personalized authentication pass.
        </p>
      </div>

      {/* Form with Pearl/Light Fields */}
      <form onSubmit={handleSubmit} className="space-y-4 my-auto">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-stone-300 font-semibold flex items-center justify-between">
            <span>Mobile Number</span>
            <span className="text-[10px] text-[#D4AF37] font-normal">India (+91)</span>
          </label>
          <div className="relative flex items-center group">
            <div className="absolute left-3.5 flex items-center gap-1.5 text-stone-300 border-r border-white/20 pr-3">
              <Phone size={15} className="text-[#D4AF37]" />
              <span className="text-xs font-mono font-bold text-white">+91</span>
            </div>
            <input
              type="tel"
              maxLength={10}
              placeholder="98765 43210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              className="w-full pl-24 pr-4 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.15] border border-white/20 text-white font-mono text-base tracking-widest placeholder-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300 shadow-inner"
            />
          </div>
          {error && <p className="text-xs text-red-400 font-medium pl-1">{error}</p>}
        </div>

        {/* Fluid Golden Shimmer Button */}
        <button
          type="submit"
          disabled={isLoading || phoneNumber.length < 10}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#FDF0CD] to-[#B8860B] text-[#07080E] font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.55)] hover:scale-[1.015] active:scale-[0.985] disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
        >
          <span>{isLoading ? "Generating Sacred Passcode..." : "Request Sacred OTP"}</span>
          <ArrowRight size={16} />
        </button>
      </form>

      {/* Footer Assurance */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-stone-400 font-mono">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-[#D4AF37]" />
          <span>256-Bit Encrypted & Private</span>
        </div>
        <span className="text-[#D4AF37]">Zero-Password Flow</span>
      </div>
    </div>
  );
}
