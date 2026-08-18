"use client";

import React, { useState } from "react";
import { Gift, ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";

interface Card3GiftIntentProps {
  onSelect: (relationship: string) => void;
  onBack?: () => void;
}

const INTENT_OPTIONS = [
  { id: "Brother", label: "Brother (भाई)", icon: "🛡️", desc: "Vitality & Raksha Shield" },
  { id: "Sister", label: "Sister (बहन)", icon: "✨", desc: "Auspicious Grace & Health" },
  { id: "Spouse", label: "Spouse / Partner", icon: "❤️", desc: "Shukra Love Harmony" },
  { id: "Mother", label: "Mother (माता)", icon: "🌸", desc: "Matru-Chhaya Peace" },
  { id: "Father", label: "Father (पिता)", icon: "☀️", desc: "Pitru-Deva Honor" },
  { id: "Friend", label: "Friend / Bestie", icon: "🤝", desc: "Karmic Bond & Growth" },
  { id: "Self", label: "Myself (आत्मन)", icon: "🧘", desc: "Personal Aura Power" },
  { id: "Boss/Other", label: "Mentor / Leader", icon: "💼", desc: "Budha Intellect & Wealth" },
];

export function Card3GiftIntent({ onSelect, onBack }: Card3GiftIntentProps) {
  const [selectedIntent, setSelectedIntent] = useState<string>("Brother");

  return (
    <div className="w-full flex flex-col justify-between h-full p-6 sm:p-8 select-none text-left">
      {/* Header with Back Button */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider backdrop-blur-md">
            <Gift size={11} className="text-[#D4AF37]" />
            <span>STEP 03 · SACRED GIFT INTENTION</span>
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
          Who is this Consecrated Blessing for?
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 font-light">
          Vedic charms are formulated and energized differently depending on the sacred relationship and karmic intent.
        </p>
      </div>

      {/* 4-Col Desktop / 2-Col Mobile Grid of Luxury Pearl Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-3">
        {INTENT_OPTIONS.map((opt) => {
          const isSelected = selectedIntent === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedIntent(opt.id)}
              className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 relative group cursor-pointer ${
                isSelected
                  ? "bg-white/[0.14] border-[#D4AF37] shadow-[0_0_24px_rgba(212,175,55,0.35)] scale-[1.02]"
                  : "bg-white/[0.06] hover:bg-white/[0.10] border-white/15 hover:border-white/30"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xl sm:text-2xl">{opt.icon}</span>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#D4AF37] text-[#07080E]"
                      : "border border-white/20 bg-white/5"
                  }`}
                >
                  {isSelected && <Check size={10} strokeWidth={3} />}
                </div>
              </div>

              <div>
                <span
                  className={`text-xs font-bold block ${
                    isSelected ? "text-[#D4AF37]" : "text-white group-hover:text-stone-100"
                  }`}
                >
                  {opt.label}
                </span>
                <span className="text-[10px] text-stone-300 leading-tight block font-light mt-0.5">
                  {opt.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Fluid Golden Shimmer Button */}
      <button
        type="button"
        onClick={() => onSelect(selectedIntent)}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#FDF0CD] to-[#B8860B] text-[#07080E] font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.55)] hover:scale-[1.015] active:scale-[0.985] transition-all duration-300 cursor-pointer"
      >
        <span>
          {selectedIntent === "Self" ? "Reveal My Auspicious Talismans" : "Enter Recipient Astrology Details"}
        </span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
