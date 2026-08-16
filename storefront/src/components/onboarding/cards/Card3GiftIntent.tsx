"use client";

import React, { useState } from "react";
import { Gift, Heart, ArrowRight, ShieldAlert, Sparkles, User, Users } from "lucide-react";

interface Card3GiftIntentProps {
  onSelect: (relationship: string) => void;
}

const INTENT_OPTIONS = [
  { id: "Brother", label: "Brother (भाई)", icon: "🛡️", desc: "Raksha protection & vitality" },
  { id: "Sister", label: "Sister (बहन)", icon: "✨", desc: "Auspicious grace & prosperity" },
  { id: "Spouse", label: "Spouse / Partner", icon: "❤️", desc: "Shukra-Chandra love harmonizer" },
  { id: "Mother", label: "Mother (माता)", icon: "🌸", desc: "Matru-Chhaya blessings & health" },
  { id: "Father", label: "Father (पिता)", icon: "☀️", desc: "Pitru-Deva longevity & honor" },
  { id: "Friend", label: "Friend / Bestie", icon: "🤝", desc: "Karmic bond & joyful expansion" },
  { id: "Self", label: "Myself (आत्मन)", icon: "🧘", desc: "Personal aura strengthening" },
  { id: "Boss/Other", label: "Mentor / Colleague", icon: "💼", desc: "Budha intellect & career elevation" },
];

export function Card3GiftIntent({ onSelect }: Card3GiftIntentProps) {
  const [selectedIntent, setSelectedIntent] = useState<string>("Brother");

  return (
    <div className="w-full flex flex-col justify-between h-full p-6 sm:p-8 select-none text-left overflow-y-auto">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider">
          <Gift size={11} className="text-[#D4AF37]" />
          <span>STEP 03 // SACRED GIFT INTENTION</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FDFCF8] font-heading tracking-tight">
          Who is this Consecrated Blessing for?
        </h3>
        <p className="text-xs text-stone-300">
          Vedic charms are energized differently depending on the sacred relationship and karmic intent.
        </p>
      </div>

      {/* Grid of Chips */}
      <div className="grid grid-cols-2 gap-2.5 my-4">
        {INTENT_OPTIONS.map((opt) => {
          const isSelected = selectedIntent === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedIntent(opt.id)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-1 group ${
                isSelected
                  ? "bg-[#D4AF37]/15 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)] scale-[1.02]"
                  : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base">{opt.icon}</span>
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    isSelected ? "bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" : "bg-white/10"
                  }`}
                />
              </div>
              <div>
                <span
                  className={`text-xs font-bold block ${
                    isSelected ? "text-[#D4AF37]" : "text-stone-200 group-hover:text-white"
                  }`}
                >
                  {opt.label}
                </span>
                <span className="text-[10px] text-stone-400 leading-tight block">
                  {opt.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={() => onSelect(selectedIntent)}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <span>
          {selectedIntent === "Self" ? "Reveal My Auspicious Talismans" : "Enter Recipient Astrology"}
        </span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
