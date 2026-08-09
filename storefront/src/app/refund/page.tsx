"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, RefreshCw, AlertCircle, Check, Mail, ArrowRight } from "lucide-react";
import { MobileStickyCart } from "@/components/ui/MobileStickyCart";

export default function RefundPage() {
  return (
    <div className="relative min-h-screen bg-[#FDFCF8] text-[#1C1C1C] pt-36 pb-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Header Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E2E8E4] border border-[#C2D6C2] text-[11px] font-mono tracking-widest uppercase text-[#1C1C1C]">
            <RefreshCw size={12} className="text-[#D4AF37]" />
            <span>DEVOTEE PROTECTION GUARANTEE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#1C1C1C]">
            Refund & Unboxing Assistance Policy
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            We take immense pride in the sacred quality of our consecrated Rakhis. Your complete satisfaction and peace of mind are guaranteed.
          </p>
        </div>

        {/* Section 1: 360 Unboxing Guarantee */}
        <div className="clinical-card p-8 sm:p-12 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#E2E8E4] flex items-center justify-center text-[#1C1C1C]">
            <ShieldCheck size={24} className="text-[#D4AF37]" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-[#1C1C1C]">
            360° Transit Protection & Free Replacement
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            In the rare event that your keepsake box or consecrated Rakhi suffers damage during air transit, we provide a <strong>100% Free Instant Replacement</strong>. Simply record a quick 360° unboxing video when opening your package and send it to our support team at <strong>support@younoya.com</strong> within 7 days of delivery.
          </p>
        </div>

        {/* Section 2: 3-Step Claim Process */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold font-heading text-[#1C1C1C] text-center">
            Simple 3-Step Replacement Claim
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="clinical-card p-6 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white font-mono font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold font-heading text-[#1C1C1C]">Record Unboxing</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Take a brief video or photo showing the outer security bag and damaged item.
              </p>
            </div>

            <div className="clinical-card p-6 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white font-mono font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold font-heading text-[#1C1C1C]">Email Support</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Email support@younoya.com with your Order ID and photo/video proof.
              </p>
            </div>

            <div className="clinical-card p-6 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white font-mono font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold font-heading text-[#1C1C1C]">Priority Air Reship</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Our concierge dispatches an energized replacement via priority air within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Non-Returnable Items Notice */}
        <div className="p-6 rounded-2xl bg-[#E2E8E4]/60 border border-[#C2D6C2] space-y-2 text-xs text-[#1C1C1C]">
          <div className="font-bold flex items-center gap-2">
            <AlertCircle size={16} className="text-[#D4AF37]" />
            <span>Spiritual Consecration Hygiene Notice</span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            Due to the sacred spiritual nature of morning Gayatri mantra consecrations and hygiene guidelines, Rakhis that have been worn or used in rituals cannot be returned for a cash refund unless damaged upon initial arrival.
          </p>
        </div>
      </div>

      <MobileStickyCart />
    </div>
  );
}
