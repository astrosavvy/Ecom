"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Video, RefreshCw, AlertTriangle, ArrowLeft } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="relative min-h-screen bg-[#07080d] text-[#eef1f8] pt-32 pb-24 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <div className="text-xs font-mono tracking-[0.16em] uppercase text-[#ff2e88]">
            SACRED ASSURANCE
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-space text-white tracking-tight">
            Replacement & Refund Policy
          </h1>
          <p className="text-xs text-[#8b93a8]">
            Last updated: February 2026 • Governing all Consecrated Items & Keepsakes
          </p>
        </div>

        {/* Video Requirement Notice */}
        <div className="chrome-card rounded-2xl p-6 border border-amber-500/30 bg-amber-500/[0.03] space-y-3">
          <div className="flex items-center gap-3 text-amber-300 font-bold text-sm font-space">
            <Video size={18} className="text-amber-400" />
            <span>Mandatory Uncut Unboxing Video Requirement</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Due to the consecrated spiritual nature and authentic precious materials used in YOUNOYA items, an <strong>uncut, continuous 360-degree unboxing video</strong> from opening the outer courier flyer to revealing the item is strictly required to claim a free replacement or refund for transit damage.
          </p>
        </div>

        <div className="chrome-card rounded-2xl p-8 space-y-6 text-xs text-[#8b93a8] leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-sm font-bold font-space text-white uppercase tracking-wider">
              1. 7-Day Replacement Guarantee
            </h2>
            <p>
              If your consecrated Rakhi or Puja kit arrives physically broken or defective, you may report it within 7 days of delivery with your unboxing video to receive an immediate complimentary replacement dispatched via Express Courier.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-bold font-space text-white uppercase tracking-wider">
              2. Cancellation Before Dispatch
            </h2>
            <p>
              Orders can be cancelled free of charge prior to consecration and dispatch (typically within 4 hours of placement). Once handed over to Bluedart Express, transit cancellations cannot be accepted.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-bold font-space text-white uppercase tracking-wider">
              3. Refund Timelines
            </h2>
            <p>
              Approved refunds are credited back to the original source account (UPI, NetBanking, or Card) within 3–5 business days via Razorpay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
