"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

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
    <section id="reviews" className="w-full py-24 overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-3 mb-12">
        <div className="text-xs font-mono tracking-[0.18em] uppercase text-amber-400">
          DEVOTEE EXPERIENCES
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-space text-white tracking-tight">
          Blessed by Families Across India
        </h2>
        <p className="text-xs sm:text-sm text-[#9ca6be] max-w-md mx-auto">
          Real feedback from devotees who chose consecrated Vedic rakhis for their siblings.
        </p>
      </div>

      {/* Infinite Horizontal Marquee Container with 75s Gentle Glide and Alpha Fade Masks */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex gap-6 w-max animate-[marquee_75s_linear_infinite] hover:[animation-play-state:paused]">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((item, idx) => (
            <div
              key={idx}
              className="w-[320px] sm:w-[380px] p-6 rounded-2xl bg-[#121520]/80 border border-white/10 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-4 flex-shrink-0"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-400">
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                  </div>
                  <Quote size={20} className="text-white/15" />
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                  "{item.review}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-9 h-9 rounded-full object-cover border border-amber-400/40"
                />
                <div>
                  <div className="text-xs font-bold text-white font-space">{item.name}</div>
                  <div className="text-[10px] text-[#9ca6be]">{item.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
