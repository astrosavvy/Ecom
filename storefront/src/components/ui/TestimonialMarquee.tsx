"use client";

import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";

interface Testimonial {
  name: string;
  location: string;
  review: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dr. Ananya Iyer",
    location: "Bengaluru, Karnataka",
    review: "The consecration energy is truly palpable. The natural Gomti Chakra and Kaudi craftsmanship feels sacred and pure. Far beyond ordinary commercial rakhis.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Vikramaditya Rathore",
    location: "Jaipur, Rajasthan",
    review: "The uncut unboxing experience and keepsake box are stunning. Arrived via express air in under 48 hours to Jaipur. My sister was genuinely touched.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Pooja Deshmukh",
    location: "Pune, Maharashtra",
    review: "Zero-password checkout was so fast! Ordered in 20 seconds and paid via UPI. The Roli, Akshat, and energized Rudraksha beads are exceptionally authentic.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Rohan Malhotra",
    location: "New Delhi",
    review: "The Navagraha threads and sacred Om brass centerpiece are exquisite. It feels like wearing an astrological protective talisman. Highly recommended.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Meera Subramanian",
    location: "Chennai, Tamil Nadu",
    review: "Exquisite presentation. The California dry fruits were fresh, and the Gayatri mantra energization certificate gave deep spiritual comfort to our family.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
  }
];

export function TestimonialMarquee() {
  return (
    <section id="reviews" className="w-full py-20 overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-3 mb-12">
        <div className="text-xs font-mono tracking-[0.18em] uppercase text-[#D4AF37] font-bold">
          DEVOTEE EXPERIENCES
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1C1C1C] tracking-tight">
          Blessed by Families Across India
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Real feedback from devotees who chose consecrated Vedic rakhis for their siblings.
        </p>
      </div>

      {/* 3-Column Social Proof Grid Cards with 90s Slow Right-to-Left Drift */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-6 w-max animate-[marquee_90s_linear_infinite] hover:[animation-play-state:paused]">
          {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((item, idx) => (
            <div
              key={idx}
              className="w-[320px] sm:w-[380px] p-6 rounded-[24px] bg-white border border-[#E2E8E4] shadow-sm flex flex-col justify-between space-y-4 flex-shrink-0 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-[#D4AF37]">
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-[#E2E8E4] px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={11} />
                    <span>Verified Buyer</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                  "{item.review}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#E2E8E4]/60">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/50"
                />
                <div>
                  <div className="text-xs font-bold text-[#1C1C1C] font-heading">{item.name}</div>
                  <div className="text-[10px] text-stone-400 font-mono">{item.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
