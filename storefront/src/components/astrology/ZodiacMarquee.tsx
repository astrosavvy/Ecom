"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Compass, ShieldCheck } from "lucide-react";

export interface ZodiacSign {
  id: string;
  name: string;
  sanskritName: string;
  element: string;
  dates: string;
  rulingPlanet: string;
  image: string;
  blessing: string;
  recommendedHandle: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: "aries",
    name: "Aries",
    sanskritName: "Mesha (मेष)",
    element: "Fire",
    dates: "Mar 21 – Apr 19",
    rulingPlanet: "Mars (Mangal)",
    image: "/zodiac/aries.png",
    blessing: "Vitality, Fearless Leadership, and Victory over Obstacles.",
    recommendedHandle: "vedic-prosperity-rakhi"
  },
  {
    id: "taurus",
    name: "Taurus",
    sanskritName: "Vrishabha (वृषभ)",
    element: "Earth",
    dates: "Apr 20 – May 20",
    rulingPlanet: "Venus (Shukra)",
    image: "/zodiac/tarus.png",
    blessing: "Abundant Wealth, Sensory Joy, and Enduring Family Bonds.",
    recommendedHandle: "vedic-abundance-blessing-rakhi"
  },
  {
    id: "gemini",
    name: "Gemini",
    sanskritName: "Mithuna (मिथुन)",
    element: "Air",
    dates: "May 21 – Jun 20",
    rulingPlanet: "Mercury (Budha)",
    image: "/zodiac/gemini.png",
    blessing: "Intellectual Brilliance, Eloquence, and Astral Clarity.",
    recommendedHandle: "navagraha-om-protection-kaudi-rakhi"
  },
  {
    id: "cancer",
    name: "Cancer",
    sanskritName: "Karka (कर्क)",
    element: "Water",
    dates: "Jun 21 – Jul 22",
    rulingPlanet: "Moon (Chandra)",
    image: "/zodiac/cancer.png",
    blessing: "Intuitive Protection, Emotional Serenity, and Maternal Grace.",
    recommendedHandle: "vedic-prosperity-rakhi"
  },
  {
    id: "leo",
    name: "Leo",
    sanskritName: "Simha (सिंह)",
    element: "Fire",
    dates: "Jul 23 – Aug 22",
    rulingPlanet: "Sun (Surya)",
    image: "/zodiac/leo.png",
    blessing: "Radiant Prana, Regal Authority, and Solar Aura Shielding.",
    recommendedHandle: "vedic-prosperity-wealth-attraction-rakhi"
  },
  {
    id: "virgo",
    name: "Virgo",
    sanskritName: "Kanya (कन्या)",
    element: "Earth",
    dates: "Aug 23 – Sep 22",
    rulingPlanet: "Mercury (Budha)",
    image: "/zodiac/virgo.png",
    blessing: "Healing Energy, Precision, and Unwavering Prosperity.",
    recommendedHandle: "vedic-abundance-blessing-rakhi"
  },
  {
    id: "libra",
    name: "Libra",
    sanskritName: "Tula (तुला)",
    element: "Air",
    dates: "Sep 23 – Oct 22",
    rulingPlanet: "Venus (Shukra)",
    image: "/zodiac/libra.png",
    blessing: "Harmonious Relationships, Aesthetic Splendor, and Balance.",
    recommendedHandle: "vedic-prosperity-rakhi"
  },
  {
    id: "scorpio",
    name: "Scorpio",
    sanskritName: "Vrishchika (वृश्चिक)",
    element: "Water",
    dates: "Oct 23 – Nov 21",
    rulingPlanet: "Mars & Ketu",
    image: "/zodiac/scorpio.png",
    blessing: "Spiritual Transformation, Psychic Defense, and Inner Power.",
    recommendedHandle: "navagraha-om-protection-kaudi-rakhi"
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    sanskritName: "Dhanu (धनु)",
    element: "Fire",
    dates: "Nov 22 – Dec 21",
    rulingPlanet: "Jupiter (Guru)",
    image: "/zodiac/sagatarius.png",
    blessing: "Higher Wisdom, Auspicious Fortune, and Boundless Expansion.",
    recommendedHandle: "vedic-prosperity-wealth-attraction-rakhi"
  },
  {
    id: "capricorn",
    name: "Capricorn",
    sanskritName: "Makara (मकर)",
    element: "Earth",
    dates: "Dec 22 – Jan 19",
    rulingPlanet: "Saturn (Shani)",
    image: "/zodiac/capricon.png",
    blessing: "Karmic Protection, Steadfast Resilience, and Legacy Triumph.",
    recommendedHandle: "navagraha-om-protection-kaudi-rakhi"
  },
  {
    id: "aquarius",
    name: "Aquarius",
    sanskritName: "Kumbha (कुम्भ)",
    element: "Air",
    dates: "Jan 20 – Feb 18",
    rulingPlanet: "Saturn & Rahu",
    image: "/zodiac/aquarius.png",
    blessing: "Visionary Innovation, Collective Harmony, and Cosmic Flow.",
    recommendedHandle: "vedic-abundance-blessing-rakhi"
  },
  {
    id: "pisces",
    name: "Pisces",
    sanskritName: "Meena (मीन)",
    element: "Water",
    dates: "Feb 19 – Mar 20",
    rulingPlanet: "Jupiter (Guru)",
    image: "/zodiac/pisces.png",
    blessing: "Divine Grace, Empathic Harmony, and Moksha Consciousness.",
    recommendedHandle: "vedic-prosperity-rakhi"
  }
];

export function ZodiacMarquee() {
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign | null>(null);

  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden bg-[#07080E] text-[#FDFCF8] select-none">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#DC2626]/10 blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-4 mb-12 sm:mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-mono tracking-widest uppercase shadow-sm">
          <Sparkles size={13} className="animate-spin-slow" />
          <span>ASTROLOGICAL HARMONIZATION // 12 RASHIS</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading text-[#FDFCF8]">
          Find Your Sacred Zodiac Alignment
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
          Hover over your Rashi to uncover the consecrated planetary elements, ruling devatas, and custom Vedic rakhi energized for your astrological sign.
        </p>
      </div>

      {/* Marquee Container with Gradient Edge Masks (Like Twitch Stream Carousel) */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* Continuous Right-to-Left Scrolling Track */}
        <div className="flex w-max gap-6 sm:gap-8 animate-marquee hover:[animation-play-state:paused] py-4">
          {/* Repeat twice for seamless infinite loop */}
          {[...ZODIAC_SIGNS, ...ZODIAC_SIGNS].map((sign, idx) => (
            <div
              key={`${sign.id}-${idx}`}
              onClick={() => setSelectedZodiac(sign)}
              className="relative w-60 sm:w-72 flex-shrink-0 group cursor-pointer transition-transform duration-500 hover:scale-105"
            >
              {/* Card Outer Golden Frame */}
              <div className="relative rounded-[26px] p-0.5 bg-gradient-to-b from-[#D4AF37]/60 via-[#1C1C1C] to-[#D4AF37]/30 shadow-[0_12px_40px_rgba(0,0,0,0.8)] group-hover:shadow-[0_16px_50px_rgba(212,175,55,0.35)] transition-all duration-300">
                <div className="relative rounded-[24px] overflow-hidden bg-[#0A0B10] flex flex-col">
                  {/* Image Display */}
                  <div className="relative w-full aspect-[9/16] overflow-hidden bg-[#07080E]">
                    <img
                      src={sign.image}
                      alt={sign.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Hover Highlight Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-transparent to-transparent opacity-80" />

                    {/* Element Pill Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#07080E]/85 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider">
                      {sign.element} // {sign.rulingPlanet.split(" ")[0]}
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="p-4 sm:p-5 text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-bold text-[#FDFCF8] group-hover:text-[#D4AF37] transition-colors">
                        {sign.name}
                      </h3>
                      <span className="text-[11px] font-mono text-[#D4AF37]/90 font-medium">
                        {sign.sanskritName.split(" ")[0]}
                      </span>
                    </div>

                    <p className="text-[11px] sm:text-xs text-stone-400 font-mono">
                      {sign.dates}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                      <span>View Blessing</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Zodiac Detail Modal (Opens smoothly upon clicking any card) */}
      {selectedZodiac && (
        <div
          onClick={() => setSelectedZodiac(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-3xl bg-[#0E1017] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
          >
            <div className="md:col-span-5 rounded-2xl overflow-hidden aspect-[9/16] bg-[#07080E] border border-white/10 shadow-inner">
              <img
                src={selectedZodiac.image}
                alt={selectedZodiac.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-7 space-y-4 text-left">
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest font-bold">
                  {selectedZodiac.element} ELEMENT // {selectedZodiac.dates}
                </div>
                <h3 className="text-3xl font-extrabold text-white">
                  {selectedZodiac.name} ({selectedZodiac.sanskritName})
                </h3>
                <div className="text-xs font-mono text-stone-400">
                  Ruling Planet: <span className="text-[#D4AF37]">{selectedZodiac.rulingPlanet}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="text-[11px] font-mono text-[#D4AF37] font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>VEDIC BLESSING & PROTECTION:</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  {selectedZodiac.blessing}
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <Link
                  href="/products"
                  onClick={() => setSelectedZodiac(null)}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] font-bold text-xs sm:text-sm text-center uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
                >
                  Shop Consecrated Rakhi
                </Link>
                <button
                  onClick={() => setSelectedZodiac(null)}
                  className="px-4 py-3 rounded-xl bg-white/10 text-stone-300 font-bold text-xs uppercase hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
