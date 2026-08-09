"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Code2, Zap, Layers, Play } from "lucide-react";

export default function Home() {
  const brandLogos = [
    { name: "VANTEL", glyph: "◆" },
    { name: "NORTHWIND", glyph: "▲" },
    { name: "LUMEA", glyph: "◉" },
    { name: "COREVO", glyph: "❖" },
    { name: "HALCYON", glyph: "◈" },
    { name: "METRIK", glyph: "■" }
  ];

  const features = [
    {
      num: "01",
      icon: <Layers size={20} className="text-white" />,
      title: "Prompt to pixel",
      desc: "Transform natural language briefs into production-grade multi-layer liquid vectors instantly."
    },
    {
      num: "02",
      icon: <Zap size={20} className="text-white" />,
      title: "Real-time render",
      desc: "Sub-millisecond photorealistic chrome shaders powered by distributed edge GPU clusters."
    },
    {
      num: "03",
      icon: <Code2 size={20} className="text-white" />,
      title: "Ship as clean code",
      desc: "Export clean React components, Tailwind tokens, and pure CSS keyframe animations."
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#07080d] text-[#eef1f8] overflow-hidden">
      {/* ========================================================
          BACKGROUND GRADIENT-MESH GLOW (Blurred Electric Colors)
         ======================================================== */}
      <div className="absolute top-[-10%] right-[5%] w-[600px] h-[600px] rounded-full bg-[#2e63ff]/25 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[10%] right-[20%] w-[480px] h-[480px] rounded-full bg-[#ff2e88]/20 blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[25%] right-[0%] w-[520px] h-[520px] rounded-full bg-[#25e0ff]/20 blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[60%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#2e63ff]/15 blur-[160px] pointer-events-none z-0" />

      {/* ========================================================
          HERO SECTION (Two-Column Split)
         ======================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 pt-36 sm:pt-44 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[85vh]">
        {/* Left Column: Hero Text Stack */}
        <div className="lg:col-span-7 space-y-7 text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-[0.16em] uppercase text-stone-300 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#c6ff3d] shadow-[0_0_10px_#c6ff3d] animate-pulse" />
            <span>v2.0 // NOW LIVE</span>
          </div>

          {/* Liquid Chrome Headline */}
          <h1 className="hero-headline font-bold chrome-text">
            Ideas in. <br />
            Chrome out.
          </h1>

          {/* Subhead */}
          <p className="text-[#8b93a8] text-base sm:text-lg leading-relaxed max-w-[500px] font-normal">
            The next-generation <strong className="text-white font-medium">generative creative engine</strong> for building polished 3D assets, fluid vectors, and <strong className="text-white font-medium">production UI components</strong> in seconds.
          </p>

          {/* Dual Aero CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/checkout"
              className="aero-btn-primary text-white text-sm font-semibold px-7 py-3.5 rounded-full uppercase tracking-wider flex items-center gap-2"
            >
              <span>Start creating free</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="#demo"
              className="aero-btn-secondary text-stone-200 text-sm font-medium px-6 py-3.5 rounded-full flex items-center gap-2 hover:text-white"
            >
              <Play size={14} className="fill-current" />
              <span>Watch the film</span>
            </Link>
          </div>

          {/* Avatar Trust Line */}
          <div className="flex items-center gap-3.5 pt-4">
            <div className="flex -space-x-2">
              {[
                "from-[#ff2e88] to-[#2e63ff]",
                "from-[#25e0ff] to-[#2e63ff]",
                "from-[#c6ff3d] to-[#25e0ff]",
                "from-[#ff2e88] to-[#ffaa40]"
              ].map((grad, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full bg-gradient-to-tr ${grad} border-2 border-[#07080d] flex items-center justify-center text-[10px] font-bold text-black shadow-md`}
                />
              ))}
            </div>
            <div className="text-xs text-[#8b93a8] font-normal">
              No card needed — <span className="text-stone-300 font-medium">12,000+ builders</span> already shipping with CHROMA.
            </div>
          </div>
        </div>

        {/* Right Column: Pure CSS 3D Chrome Orb */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-6">
          {/* Sparkle Stars */}
          <div className="absolute top-[12%] right-[15%] text-white animate-bounce pointer-events-none">
            <Sparkles size={24} className="text-[#25e0ff] drop-shadow-[0_0_12px_#25e0ff]" />
          </div>
          <div className="absolute bottom-[25%] left-[10%] text-white pointer-events-none animate-pulse">
            <Sparkles size={18} className="text-[#ff2e88] drop-shadow-[0_0_12px_#ff2e88]" />
          </div>
          <div className="absolute top-[45%] left-[5%] text-white pointer-events-none">
            <Sparkles size={14} className="text-white drop-shadow-[0_0_8px_#ffffff]" />
          </div>

          {/* The Chrome Sphere */}
          <div className="chrome-orb-sphere group cursor-pointer hover:scale-105 transition-transform duration-700">
            <div className="chrome-orb-specular" />
            <div className="chrome-orb-horizon" />
            <div className="chrome-orb-rim" />
          </div>

          {/* Ground Reflection Shadow */}
          <div className="chrome-orb-shadow" />
        </div>
      </section>

      {/* ========================================================
          BORDERED LOGO STRIP (Trusted by teams at)
         ======================================================== */}
      <section className="w-full border-y border-white/10 bg-[#090b11]/80 backdrop-blur-md py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-[11px] font-mono tracking-[0.16em] uppercase text-[#8b93a8]">
            TRUSTED BY TEAMS AT
          </span>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
            {brandLogos.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center gap-2 text-stone-400/70 hover:text-white transition-colors cursor-default text-xs sm:text-sm font-semibold tracking-wider font-space"
              >
                <span className="text-[10px] text-[#25e0ff]/70">{brand.glyph}</span>
                <span>{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURE TRIO ("WHAT YOU GET" - 3 Chrome-Bezel Dark Cards)
         ======================================================== */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-28 space-y-16">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="text-xs font-mono tracking-[0.18em] uppercase text-[#25e0ff]">
            WHAT YOU GET
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-space text-white tracking-tight">
            One prompt away from polished.
          </h2>
          <p className="text-sm text-[#8b93a8] font-normal leading-relaxed">
            Everything you need to turn raw concepts into high-fidelity tactile surfaces and ready-to-deploy code.
          </p>
        </div>

        {/* 3-Up Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item) => (
            <div
              key={item.num}
              className="chrome-card rounded-2xl p-8 flex flex-col justify-between space-y-8"
            >
              <div className="flex items-center justify-between">
                {/* Chrome-Gloss Rounded-Square Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-white/20 to-white/5 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] flex items-center justify-center">
                  {item.icon}
                </div>

                {/* Numbered Mono Corner Tag */}
                <span className="font-mono text-xs text-[#8b93a8] tracking-widest font-semibold">
                  {item.num}
                </span>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xl font-bold font-space text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8b93a8] leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
