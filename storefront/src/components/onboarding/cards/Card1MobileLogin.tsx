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
    <div className="w-full flex flex-col justify-between h-full p-4 sm:p-6 select-none text-left">
      {/* Compact Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] font-mono uppercase tracking-wider">
          <Sparkles size={10} className="animate-spin" />
          <span>STEP 01 · VEDIC ONBOARDING</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#FDFCF8] tracking-tight">
          Unlock Your Sacred Kundali
        </h3>
        <p className="text-xs text-stone-300 leading-relaxed">
          Enter your mobile number for instant astral chart synchronization.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 my-auto">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
            Mobile Number (+91 India)
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 flex items-center gap-1.5 text-stone-400 border-r border-white/10 pr-2.5">
              <Phone size={14} className="text-[#D4AF37]" />
              <span className="text-xs font-mono font-bold text-stone-300">+91</span>
            </div>
            <input
              type="tel"
              maxLength={10}
              placeholder="98765 43210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              className="w-full pl-24 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-mono text-sm tracking-widest placeholder-stone-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
            />
          </div>
          {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading || phoneNumber.length < 10}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
        >
          <span>{isLoading ? "Generating Passcode..." : "Request Sacred OTP"}</span>
          <ArrowRight size={15} />
        </button>
      </form>

      {/* Footer Assurance */}
      <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[10px] text-stone-400 font-mono">
        <ShieldCheck size={12} className="text-[#D4AF37] shrink-0" />
        <span>100% Encrypted & Private. No Spam, Ever.</span>
      </div>
    </div>
  );
}
