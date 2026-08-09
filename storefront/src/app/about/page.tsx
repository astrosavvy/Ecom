"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, HeartHandshake, ShieldCheck, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#07080d] text-[#eef1f8] pt-32 pb-24 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <div className="text-xs font-mono tracking-[0.16em] uppercase text-[#ff2e88]">
            OUR GENESIS
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-space text-white tracking-tight">
            About YOUNOYA
          </h1>
          <p className="text-xs text-[#8b93a8]">
            Consecrated Vedic Artistry & Spiritual Kinship for the Modern World.
          </p>
        </div>

        <div className="chrome-card rounded-2xl p-8 space-y-6 text-xs text-[#8b93a8] leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base font-bold font-space text-white">The Sacred Philosophy</h2>
            <p>
              YOUNOYA was born from a realization: in an era of mass-manufactured festive threads, the ancient soul of Raksha Bandhan was being diluted. In traditional Vedic wisdom, a Rakhi is not an ornamental trinket — it is an energized shield of planetary grace and eternal sibling protection.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold font-space text-white">Authentic Vedic Consecration</h2>
            <p>
              Every YOUNOYA piece is individually energized with Prana Pratishtha rituals recited with 108 Gayatri mantras by experienced pandits in sacred spiritual centers across India.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold font-space text-white">Zero-Password Commerce Experience</h2>
            <p>
              We believe gifting should be effortless and serene. With our zero-password, one-page checkout, you can send consecrated love across India in under 30 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
