"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from "lucide-react";
import { MobileStickyCart } from "@/components/ui/MobileStickyCart";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    orderId: "",
    inquiryType: "Order Status",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-[#FDFCF8] text-[#1C1C1C] pt-36 pb-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Header Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E2E8E4] border border-[#C2D6C2] text-[11px] font-mono tracking-widest uppercase text-[#1C1C1C]">
            <Mail size={12} className="text-[#D4AF37]" />
            <span>DEVOTEE CONCIERGE & SUPPORT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#1C1C1C]">
            Direct Order Assistance & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Have questions about your morning consecration batch or tracking your express air package? Our concierge team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 clinical-card p-8 space-y-6">
            <h2 className="text-xl font-bold font-heading text-[#1C1C1C]">Send Direct Inquiry</h2>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-[#E2E8E4] text-[#1C1C1C] space-y-3 text-center">
                <CheckCircle2 size={32} className="text-emerald-700 mx-auto" />
                <h3 className="text-lg font-bold font-heading">Inquiry Received</h3>
                <p className="text-xs text-stone-600">
                  Thank you! Our devotee support concierge will review your message and reply via email within 2-4 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Full Name*</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Rahul Sharma"
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Email Address*</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="rahul@example.com"
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Number (+91)</label>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      placeholder="9876543210"
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Order ID (If Applicable)</label>
                    <input
                      type="text"
                      value={form.orderId}
                      onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                      placeholder="e.g. ord_123456"
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Inquiry Category</label>
                  <select
                    value={form.inquiryType}
                    onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="Order Status">Order Tracking & Status</option>
                    <option value="Consecration">Consecration & Ritual Inquiry</option>
                    <option value="Bulk Order">Corporate / Bulk Sibling Orders</option>
                    <option value="Damage Claim">Transit Damage & Replacement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Message*</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Provide details about your inquiry..."
                    className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#333333] transition-all shadow-md"
                >
                  <Send size={14} />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="clinical-card p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#E2E8E4] flex items-center justify-center text-[#1C1C1C]">
                <Mail size={20} className="text-[#D4AF37]" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase text-stone-400 font-bold">Email Concierge</div>
                <div className="text-sm font-bold text-[#1C1C1C] font-mono pt-1">support@younoya.com</div>
                <div className="text-xs text-stone-500 pt-0.5">Average response time: 2 - 4 Hours</div>
              </div>
            </div>

            <div className="clinical-card p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#E2E8E4] flex items-center justify-center text-[#1C1C1C]">
                <Clock size={20} className="text-[#D4AF37]" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase text-stone-400 font-bold">Support Operating Hours</div>
                <div className="text-sm font-bold text-[#1C1C1C] pt-1">Monday – Saturday</div>
                <div className="text-xs text-stone-500 pt-0.5">9:00 AM – 8:00 PM IST</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileStickyCart />
    </div>
  );
}
