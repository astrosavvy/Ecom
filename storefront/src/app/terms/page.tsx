"use client";

import React from "react";
import Link from "next/link";
import { FileText, ShieldCheck } from "lucide-react";
import { MobileStickyCart } from "@/components/ui/MobileStickyCart";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-[#FDFCF8] text-[#1C1C1C] pt-36 pb-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Header Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E2E8E4] border border-[#C2D6C2] text-[11px] font-mono tracking-widest uppercase text-[#1C1C1C]">
            <FileText size={12} className="text-[#D4AF37]" />
            <span>TERMS OF SERVICE & PURCHASE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#1C1C1C]">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Please review the legal terms governing purchases and services offered on YOUNOYA storefront.
          </p>
        </div>

        {/* Content Document */}
        <div className="clinical-card p-8 sm:p-12 space-y-8 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <div className="space-y-3 border-b border-[#E2E8E4] pb-6">
            <h2 className="text-xl font-bold font-heading text-[#1C1C1C]">1. Commercial Storefront Agreement</h2>
            <p>
              By accessing or purchasing from YOUNOYA, you agree to be bound by these Terms of Service. All products, including consecrated Vedic Rakhis, authentic Gomti Chakras, Rudrakshas, and dry fruit keepsake boxes, are sold for personal festive use.
            </p>
          </div>

          <div className="space-y-3 border-b border-[#E2E8E4] pb-6">
            <h2 className="text-xl font-bold font-heading text-[#1C1C1C]">2. Pricing & Currency</h2>
            <p>
              All prices listed on the storefront are denominated in Indian Rupees (INR, ₹) and include all applicable taxes. Express Air Shipping is 100% complimentary across all Indian PIN codes.
            </p>
          </div>

          <div className="space-y-3 border-b border-[#E2E8E4] pb-6">
            <h2 className="text-xl font-bold font-heading text-[#1C1C1C]">3. Order Fulfillment & Consecration</h2>
            <p>
              Orders are submitted for morning Gayatri mantra energization rituals upon confirmation. Orders placed before 12:00 PM IST are dispatched on the same business day via priority air couriers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold font-heading text-[#1C1C1C]">4. Contact & Legal Notices</h2>
            <p>
              For legal inquiries or business contact, reach our administrative team at <strong>support@younoya.com</strong>.
            </p>
          </div>
        </div>
      </div>

      <MobileStickyCart />
    </div>
  );
}
