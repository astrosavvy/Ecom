"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { ShieldCheck, Lock, ArrowRight, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    telephone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    agreeTerms: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState("");

  const subtotal = 1099;
  const grandTotal = subtotal;

  // Free Official India Post Pincode Lookup API
  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
    setFormData({ ...formData, pincode: pin });

    if (pin.length === 6) {
      setPincodeLoading(true);
      setPincodeStatus("");
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();

        if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];
          const autoCity = postOffice.District || postOffice.Block || postOffice.Name;
          const autoState = postOffice.State;

          setFormData((prev) => ({
            ...prev,
            pincode: pin,
            city: autoCity,
            state: autoState
          }));
          setPincodeStatus(`✓ Detected: ${autoCity}, ${autoState}`);
        } else {
          setPincodeStatus("❌ Invalid PIN code or unserviceable region");
        }
      } catch (err) {
        console.error("PIN lookup error:", err);
      } finally {
        setPincodeLoading(false);
      }
    } else {
      setPincodeStatus("");
    }
  };

  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email || !formData.telephone || !formData.address || !formData.pincode) {
      setError("Please fill in all mandatory delivery details.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const res = await fetch("https://api.younoya.com/api/v1/checkout/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: grandTotal,
          items: [{ title: "Vedic Prosperity Rakhi Set", price: 1099, quantity: 1 }]
        })
      });

      const orderData = await res.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Order initialization failed");
      }

      // 2. Open Official Razorpay Checkout Modal
      if (typeof window.Razorpay !== "undefined") {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.key_id || "rzp_test_TNGgxOeUADZzEF",
          amount: orderData.amount, // in paise
          currency: orderData.currency || "INR",
          name: "YOUNOYA",
          description: "Consecrated Vedic Rakhi Order",
          image: "https://younoya.com/younoya_icon.png",
          order_id: orderData.razorpay_order_id,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.telephone
          },
          theme: {
            color: "#f59e0b" // Amber gold
          },
          handler: function (response: any) {
            // Payment success callback
            window.location.href = `/order/confirmed/${orderData.order_id}?payment_id=${response.razorpay_payment_id}`;
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (failResponse: any) {
          setError(`Payment Failed: ${failResponse.error.description}`);
          setLoading(false);
        });
        rzp.open();
      } else {
        // Direct fallback if script blocked
        window.location.href = `/order/confirmed/${orderData.order_id}`;
      }
    } catch (err: any) {
      setError(err.message || "Payment service unavailable. Please retry.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Razorpay Standard Checkout SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="relative min-h-screen bg-[#0c0e17] text-[#edf1f8] pt-32 pb-24 px-6 sm:px-12">
        {/* Background Atmosphere Glows */}
        <div className="absolute top-[10%] right-[10%] w-[550px] h-[550px] rounded-full bg-[#2e63ff]/18 blur-[140px] pointer-events-none" />
        <div className="absolute top-[35%] left-[5%] w-[500px] h-[500px] rounded-full bg-[#ff2e88]/15 blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/12 text-[11px] font-mono tracking-wider uppercase text-amber-400 backdrop-blur-md">
              <Lock size={12} />
              <span>256-BIT ENCRYPTED DIRECT CHECKOUT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-space text-white tracking-tight">
              Express Delivery & Checkout
            </h1>
            <p className="text-xs text-[#9ca6be]">
              Zero passwords required — enter delivery address and pay securely with UPI, Cards, or NetBanking.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-300 text-xs rounded-2xl flex items-center gap-2 max-w-2xl mx-auto">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRazorpayPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                      className="w-full bg-[#080a10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
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
                      className="w-full bg-[#080a10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1">Email Address (for order receipt)*</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@example.com"
                    className="w-full bg-[#080a10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Step 2: Delivery Address with Free Auto PIN API */}
              <div className="chrome-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-mono tracking-widest uppercase text-[#ff2e88] font-semibold flex items-center gap-2">
                    <span>02 // SHIPPING DESTINATION</span>
                  </h2>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    Auto City & State Detection
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1">Street Address / House / Flat*</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Flat 402, Nilgiri Heights, MG Road"
                    className="w-full bg-[#080a10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* PIN Code Field */}
                  <div>
                    <label className="block text-xs text-stone-300 mb-1 flex items-center justify-between">
                      <span>PIN Code*</span>
                      {pincodeLoading && <Loader2 size={12} className="animate-spin text-amber-400" />}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handlePincodeChange}
                      placeholder="e.g. 400001"
                      className="w-full bg-[#080a10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Auto-filled City */}
                  <div>
                    <label className="block text-xs text-stone-300 mb-1">City / District*</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Auto-detected"
                      className="w-full bg-[#080a10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Auto-filled State */}
                  <div>
                    <label className="block text-xs text-stone-300 mb-1">State*</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Auto-detected"
                      className="w-full bg-[#080a10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {pincodeStatus && (
                  <div className={`text-xs font-mono pt-1 ${pincodeStatus.startsWith("✓") ? "text-emerald-400" : "text-amber-400"}`}>
                    {pincodeStatus}
                  </div>
                )}
              </div>

              {/* Step 3: Razorpay Payment Card */}
              <div className="chrome-card rounded-2xl p-6 space-y-4">
                <h2 className="text-xs font-mono tracking-widest uppercase text-[#c6ff3d] font-semibold flex items-center gap-2">
                  <span>03 // RAZORPAY GATEWAY</span>
                </h2>

                <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24]" />
                    <div>
                      <div className="text-xs font-bold text-white">Razorpay Secure Modal</div>
                      <div className="text-[10px] text-[#9ca6be]">UPI (GPay, PhonePe, Paytm), All Bank Cards & NetBanking</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-black/60 px-3 py-1 rounded text-amber-300 border border-amber-400/25">
                    Official SDK
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

                <div className="space-y-2.5 text-xs text-[#9ca6be] border-y border-white/10 py-4">
                  <div className="flex justify-between">
                    <span>Item Subtotal</span>
                    <span className="text-white font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Air Shipping</span>
                    <span className="text-cyan-400 font-semibold">FREE (Pan India)</span>
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
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Opening Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay Securely — ₹{grandTotal}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 text-center">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>256-Bit SSL Protection • Instant Dispatch AWB</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
