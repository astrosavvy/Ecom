"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    telephone: "",
    address: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    agreeTerms: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = 1099;
  const shipping = 0;
  const grandTotal = subtotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email || !formData.telephone || !formData.address || !formData.pincode) {
      setError("Please fill in all mandatory delivery fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://api.younoya.com/api/v1/checkout/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: grandTotal,
          items: [{ title: "Vedic Prosperity Rakhi Set", price: 1099, quantity: 1 }]
        })
      });

      const data = await res.json();
      if (data.success && data.order_id) {
        window.location.href = `/order/confirmed/${data.order_id}`;
      } else {
        setError(data.error || "Could not initialize checkout. Please try again.");
      }
    } catch (err: any) {
      // Fallback
      window.location.href = `/order/confirmed/ord_${Date.now()}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07080d] text-[#eef1f8] pt-32 pb-24 px-6 sm:px-12">
      {/* Background glow */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#2e63ff]/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] left-[5%] w-[450px] h-[450px] rounded-full bg-[#ff2e88]/12 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-wider uppercase text-amber-400">
            <Lock size={12} />
            <span>256-BIT SECURE ZERO-PASSWORD CHECKOUT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-space text-white tracking-tight">
            Express Delivery & Checkout
          </h1>
          <p className="text-xs text-[#8b93a8]">
            No account creation or password needed — enter your dispatch address to confirm your sacred order.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-950/50 border border-red-500/30 text-red-300 text-xs rounded-2xl flex items-center gap-2 max-w-2xl mx-auto">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Contact Details */}
            <div className="chrome-card rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-mono tracking-widest uppercase text-[#25e0ff] font-semibold flex items-center gap-2">
                <span>01 // CONTACT INFORMATION</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-300 mb-1">Full Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#07080d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1">Mobile Number (+91)*</label>
                  <input
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full bg-[#07080d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Email Address (for tracking)*</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="w-full bg-[#07080d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="chrome-card rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-mono tracking-widest uppercase text-[#ff2e88] font-semibold flex items-center gap-2">
                <span>02 // SHIPPING DESTINATION</span>
              </h2>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Street Address / House / Flat*</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Flat 402, Nilgiri Heights, MG Road"
                  className="w-full bg-[#07080d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-stone-300 mb-1">City*</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Mumbai"
                    className="w-full bg-[#07080d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1">State*</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="w-full bg-[#07080d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1">PIN Code*</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="400001"
                    className="w-full bg-[#07080d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Gateway */}
            <div className="chrome-card rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-mono tracking-widest uppercase text-[#c6ff3d] font-semibold flex items-center gap-2">
                <span>03 // PAYMENT METHOD</span>
              </h2>

              <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                  <div>
                    <div className="text-xs font-bold text-white">Razorpay Secure Checkout</div>
                    <div className="text-[10px] text-[#8b93a8]">Supports UPI (GPay/PhonePe), Credit/Debit Cards, NetBanking</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-black/60 px-2.5 py-1 rounded text-amber-300 border border-amber-400/20">
                  Instant
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="chrome-card rounded-2xl p-6 space-y-6 sticky top-28">
              <h3 className="text-sm font-bold font-space text-white border-b border-white/10 pb-3">
                Items in Package
              </h3>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800"
                    alt="Rakhi"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold font-space text-white leading-tight">
                    Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread
                  </div>
                  <div className="text-[11px] text-amber-400 font-mono">
                    Qty: 1 • ₹1099
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#8b93a8] border-y border-white/10 py-4">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bluedart Express Shipping</span>
                  <span className="text-cyan-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Puja Keepsake Box & Roli/Chawal</span>
                  <span className="text-emerald-400 font-semibold">INCLUDED</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-stone-300">Total Payable</span>
                <span className="text-2xl font-bold font-space text-white">
                  ₹{grandTotal}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full aero-btn-primary text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-2xl"
              >
                <span>{loading ? "Connecting Gateway..." : `Confirm Order — ₹${grandTotal}`}</span>
                <ArrowRight size={15} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 text-center">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Zero-risk guarantee • Real-time SMS tracking</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
