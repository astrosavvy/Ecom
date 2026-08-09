"use client";

import React from "react";
import Link from "next/link";
import { Truck, Clock, ShieldCheck, ArrowLeft, MapPin } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="relative min-h-screen bg-[#07080d] text-[#eef1f8] pt-32 pb-24 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <div className="text-xs font-mono tracking-[0.16em] uppercase text-[#25e0ff]">
            LOGISTICS & DISPATCH
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-space text-white tracking-tight">
            Express Shipping Policy
          </h1>
          <p className="text-xs text-[#8b93a8]">
            Fast, secure pan-India delivery for consecrated rakhis and spiritual essentials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="chrome-card rounded-2xl p-5 space-y-2 text-center">
            <div className="text-2xl font-bold font-space text-amber-400">100% FREE</div>
            <div className="text-xs font-semibold text-white">Shipping Across India</div>
            <div className="text-[10px] text-stone-400">Zero hidden transit charges</div>
          </div>
          <div className="chrome-card rounded-2xl p-5 space-y-2 text-center">
            <div className="text-2xl font-bold font-space text-cyan-400">2-4 Days</div>
            <div className="text-xs font-semibold text-white">Metro Cities Delivery</div>
            <div className="text-[10px] text-stone-400">Bluedart & Delhivery Air</div>
          </div>
          <div className="chrome-card rounded-2xl p-5 space-y-2 text-center">
            <div className="text-2xl font-bold font-space text-emerald-400">Live AWB</div>
            <div className="text-xs font-semibold text-white">Real-Time SMS Updates</div>
            <div className="text-[10px] text-stone-400">Instant tracking link on dispatch</div>
          </div>
        </div>

        <div className="chrome-card rounded-2xl p-8 space-y-6 text-xs text-[#8b93a8] leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-sm font-bold font-space text-white uppercase tracking-wider">
              1. Consecration & Dispatch Schedule
            </h2>
            <p>
              Orders placed before 2:00 PM IST undergo morning Vedic consecration rituals and are dispatched on the same business day. Orders placed afterwards are dispatched the following morning.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-bold font-space text-white uppercase tracking-wider">
              2. Tamper-Evident Sacred Packaging
            </h2>
            <p>
              Each item is encased in a premium keepsake box and sealed with a tamper-evident holographic warranty sticker to preserve consecrated purity during transit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
