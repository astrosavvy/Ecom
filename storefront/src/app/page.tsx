"use client";

import React from "react";
import Link from "next/link";

const BG_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4";

export default function Home() {
  return (
    <section className="relative h-[calc(100vh-72px)] sm:h-[calc(100vh-80px)] w-full overflow-hidden flex flex-col items-center justify-start text-center px-4 font-sans select-none">
      {/* Background Video (z-0) */}
      <video
        src={BG_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 w-full h-[130%] object-cover object-top pointer-events-none"
      />

      {/* Hero Content (z-10) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center mt-8 md:mt-16 max-w-4xl mx-auto px-4">
        {/* Badge: YOUNOYA Signature */}
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-xl border border-[#1B133C]/10 bg-white/70 backdrop-blur-sm px-4 py-2 text-sm font-medium text-[#1B133C] shadow-xs animate-fade-rise">
          <div className="bg-[#B8860B] rounded w-5 h-5 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            ✦
          </div>
          <span>YOUNOYA // For Every Chapter</span>
        </div>

        {/* Heading */}
        <h1
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-[#1B133C] max-w-4xl animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Consecrated grace
          <br />
          for every chapter
        </h1>

        {/* Subtitle */}
        <p className="mt-5 sm:mt-6 max-w-3xl text-xs sm:text-sm md:text-base leading-relaxed text-[#1B133C]/70 font-normal animate-fade-rise-delay">
          Handcrafted spiritual keepsakes, sacred elements, and timeless
          artistry energized with authentic Vedic blessings. Delivered across
          India with frictionless zero-password express checkout.
        </p>

        {/* CTA Button */}
        <Link
          href="/products"
          className="mt-7 sm:mt-8 rounded-xl bg-[#FEFEFE] px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-[#1B133C] shadow-[0px_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_16px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-fade-rise-delay-2 cursor-pointer inline-flex items-center justify-center"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  );
}
