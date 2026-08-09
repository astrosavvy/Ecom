"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, FileText } from "lucide-react";
import { MobileStickyCart } from "@/components/ui/MobileStickyCart";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-[#FDFCF8] text-[#1C1C1C] pt-36 pb-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Header Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E2E8E4] border border-[#C2D6C2] text-[11px] font-mono tracking-widest uppercase text-[#1C1C1C]">
            <Lock size={12} className="text-[#D4AF37]" />
            <span>DATA PRIVACY & SECURITY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#1C1C1C]">
            Privacy Policy & Zero-Password Security
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Last updated: Raksha Bandhan 2026. YOUNOYA is committed to protecting your personal information and ensuring full transparency.
          </p>
        </div>

        {/* Content Document */}
        <div className="clinical-card p-8 sm:p-12 space-y-8 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <div className="space-y-3 border-b border-[#E2E8E4] pb-6">
            <h2 className="text-xl font-bold font-heading text-[#1C1C1C]">1. Zero-Password OTP Authentication</h2>
            <p>
              YOUNOYA operates exclusively on zero-password OTP (One-Time Password) authentication. We never ask you to create password credentials, nor do we store plain-text access tokens. When placing an order, your phone number or email is verified via single-use 6-digit numeric codes generated securely.
            </p>
          </div>

          <div className="space-y-3 border-b border-[#E2E8E4] pb-6">
            <h2 className="text-xl font-bold font-heading text-[#1C1C1C]">2. Information We Collect</h2>
            <p>
              To process and deliver your consecrated Rakhi keepsake boxes, we collect the following necessary order details:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-700">
              <li>Full Name and Shipping Destination Address</li>
              <li>10-Digit Mobile Phone Number (for courier SMS updates)</li>
              <li>Email Address (for order receipt, tracking links, and tax invoice)</li>
              <li>Personal Sibling Blessing Note (if customized during checkout)</li>
            </ul>
          </div>

          <div className="space-y-3 border-b border-[#E2E8E4] pb-6">
            <h2 className="text-xl font-bold font-heading text-[#1C1C1C]">3. Payment Processing Encryption</h2>
            <p>
              All online transactions are processed through Razorpay's official PCI-DSS Level 1 compliant payment gateway. YOUNOYA does not store, log, or transmit your credit/debit card numbers, UPI PINs, or net banking credentials.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold font-heading text-[#1C1C1C]">4. Data Protection Inquiries</h2>
            <p>
              For data access, correction, or deletion requests, please contact our Data Protection Concierge at <strong>support@younoya.com</strong>.
            </p>
          </div>
        </div>
      </div>

      <MobileStickyCart />
    </div>
  );
}
