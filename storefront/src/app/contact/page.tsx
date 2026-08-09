"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, Clock, ArrowLeft, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", orderNumber: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="relative min-h-screen bg-[#07080d] text-[#eef1f8] pt-32 pb-24 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <div className="text-xs font-mono tracking-[0.16em] uppercase text-[#c6ff3d]">
            CONCIERGE DESK
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-space text-white tracking-tight">
            Contact & Support
          </h1>
          <p className="text-xs text-[#8b93a8]">
            We are here to assist with order tracking, Vedic recommendations, and custom gifting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-4">
            <div className="chrome-card rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold font-space text-white">Direct Assistance</h3>
              
              <div className="space-y-3 text-xs text-[#8b93a8]">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-amber-400" />
                  <span>support@younoya.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-cyan-400" />
                  <span>Mon – Sun (9:00 AM – 9:00 PM IST)</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare size={16} className="text-pink-400" />
                  <span>Average response time: &lt; 2 hours</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="chrome-card rounded-2xl p-6 space-y-4">
              {sent ? (
                <div className="p-8 text-center space-y-3">
                  <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold font-space text-white">Message Dispatched</h3>
                  <p className="text-xs text-stone-400">Our concierge desk will respond to your email shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-stone-300 mb-1">Your Full Name*</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full bg-[#07080d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 mb-1">Email Address*</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="priya@example.com"
                      className="w-full bg-[#07080d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 mb-1">Order Number (if inquiring about an order)</label>
                    <input
                      type="text"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="e.g. YN-66D9A1"
                      className="w-full bg-[#07080d] border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 mb-1">Your Message*</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we assist you today?"
                      className="w-full bg-[#07080d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full aero-btn-primary text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                  >
                    <span>Send Message to Concierge</span>
                    <Send size={13} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
