"use client";

import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, MapPin, Clock, ArrowRight, PackageCheck, HelpCircle } from "lucide-react";
import { MobileStickyCart } from "@/components/ui/MobileStickyCart";

export default function ShippingPage() {
  return (
    <div className="relative min-h-screen bg-[#FDFCF8] text-[#1C1C1C] pt-36 pb-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Header Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E2E8E4] border border-[#C2D6C2] text-[11px] font-mono tracking-widest uppercase text-[#1C1C1C]">
            <Truck size={12} className="text-[#D4AF37]" />
            <span>EXPRESS AIR SHIPPING POLICY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#1C1C1C]">
            100% Free Priority Air Shipping Across India
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Every consecrated Rakhi order is dispatched via priority air courier to ensure your keepsake arrives safely and swiftly before Raksha Bandhan.
          </p>
        </div>

        {/* Section 1: Coverage & Timelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="clinical-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E2E8E4] flex items-center justify-center text-[#1C1C1C]">
              <Truck size={20} className="text-[#D4AF37]" />
            </div>
            <h3 className="text-base font-bold font-heading text-[#1C1C1C]">100% Free Shipping</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              No hidden fees, no minimum order value. Express Air shipping is 100% complimentary on every order across India.
            </p>
          </div>

          <div className="clinical-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E2E8E4] flex items-center justify-center text-[#1C1C1C]">
              <Clock size={20} className="text-[#D4AF37]" />
            </div>
            <h3 className="text-base font-bold font-heading text-[#1C1C1C]">Same-Day Morning Dispatch</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Orders placed before 12:00 PM IST are energized during morning Vedic pujas and handed over to air couriers by 4:00 PM.
            </p>
          </div>

          <div className="clinical-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E2E8E4] flex items-center justify-center text-[#1C1C1C]">
              <MapPin size={20} className="text-[#D4AF37]" />
            </div>
            <h3 className="text-base font-bold font-heading text-[#1C1C1C]">19,000+ PIN Codes Covered</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Delivered via Blue Dart, Delhivery Air, and India Post Speed Post across all metros, tier-2 cities, and remote towns.
            </p>
          </div>
        </div>

        {/* Section 2: Detailed Delivery Table */}
        <div className="clinical-card p-8 space-y-6">
          <h2 className="text-xl font-bold font-heading text-[#1C1C1C]">Estimated Transit Times by Region</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8E4]">
                  <th className="py-3 font-bold text-[#1C1C1C]">Destination Region</th>
                  <th className="py-3 font-bold text-[#1C1C1C]">Courier Mode</th>
                  <th className="py-3 font-bold text-[#1C1C1C] text-right">Estimated Arrival</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E4]/60">
                <tr>
                  <td className="py-3 text-stone-700">Metro Cities (Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Hyd)</td>
                  <td className="py-3 text-stone-500 font-mono">Priority Express Air</td>
                  <td className="py-3 text-right font-bold text-emerald-700">24 – 48 Hours</td>
                </tr>
                <tr>
                  <td className="py-3 text-stone-700">State Capitals & Tier-2 Urban Centers</td>
                  <td className="py-3 text-stone-500 font-mono">Standard Air Cargo</td>
                  <td className="py-3 text-right font-bold text-emerald-700">2 – 3 Days</td>
                </tr>
                <tr>
                  <td className="py-3 text-stone-700">Rest of India & Rural District Pincodes</td>
                  <td className="py-3 text-stone-500 font-mono">India Post Speed Post</td>
                  <td className="py-3 text-right font-bold text-emerald-700">3 – 4 Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: FAQ Accordion Style */}
        <div className="clinical-card p-8 space-y-6">
          <h2 className="text-xl font-bold font-heading text-[#1C1C1C] flex items-center gap-2">
            <HelpCircle size={20} className="text-[#D4AF37]" />
            <span>Shipping Frequently Asked Questions</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm divide-y divide-[#E2E8E4]">
            <div className="pt-3 space-y-1">
              <div className="font-bold text-[#1C1C1C]">How can I track my consecrated Rakhi package?</div>
              <div className="text-stone-600 leading-relaxed">
                As soon as your package is dispatched, an automated tracking link is dispatched to your registered email and mobile number via SMS & WhatsApp.
              </div>
            </div>

            <div className="pt-3 space-y-1">
              <div className="font-bold text-[#1C1C1C]">Is the Rakhi package tamper-sealed?</div>
              <div className="text-stone-600 leading-relaxed">
                Yes! Every signature keepsake box is wrapped inside a 100% tamper-evident security bag to guarantee the purity of the consecration.
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileStickyCart />
    </div>
  );
}
