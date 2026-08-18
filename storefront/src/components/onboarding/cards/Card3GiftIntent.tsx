"use client";

import React, { useState } from "react";
import { Gift, ArrowRight } from "lucide-react";

interface Card3GiftIntentProps {
  onSelect: (relationship: string) => void;
}

const INTENT_OPTIONS = [
  { id: "Brother", label: "Brother", icon: "🛡️" },
  { id: "Sister", label: "Sister", icon: "✨" },
  { id: "Spouse", label: "Spouse", icon: "❤️" },
  { id: "Mother", label: "Mother", icon: "🌸" },
  { id: "Father", label: "Father", icon: "☀️" },
  { id: "Friend", label: "Friend", icon: "🤝" },
  { id: "Self", label: "Myself", icon: "🧘" },
  { id: "Boss/Other", label: "Mentor", icon: "💼" },
];

export function Card3GiftIntent({ onSelect }: Card3GiftIntentProps) {
  const [selectedIntent, setSelectedIntent] = useState<string>("Brother");

  return (
    <div className="w-full flex flex-col justify-between h-full p-4 sm:p-6 select-none text-left">
      {/* Compact Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] font-mono uppercase tracking-wider">
          <Gift size={10} />
          <span>STEP 03 · SACRED INTENT</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#FDFCF8] tracking-tight">
          Who is this Blessing for?
        </h3>
      </div>

      {/* Compact Grid — 4 cols desktop, 2 cols mobile */}
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 my-3">
        {INTENT_OPTIONS.map((opt) => {
          const isSelected = selectedIntent === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedIntent(opt.id)}
              className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all duration-200 flex flex-col items-center gap-1 ${
                isSelected
                  ? "bg-[#D4AF37]/15 border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)] scale-[1.03]"
                  : "bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/8"
              }`}
            >
              <span className="text-lg sm:text-xl">{opt.icon}</span>
              <span
                className={`text-[10px] sm:text-[11px] font-bold leading-tight ${
                  isSelected ? "text-[#D4AF37]" : "text-stone-300"
                }`}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => onSelect(selectedIntent)}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <span>
          {selectedIntent === "Self" ? "Reveal My Talismans" : "Enter Recipient Details"}
        </span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
