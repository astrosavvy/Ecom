"use client";

import React, { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { AnimatedStepper, Step } from "@/components/ui/AnimatedStepper";
import { ShieldCheck, Lock, CheckCircle2, ArrowRight, Loader2, Sparkles } from "lucide-react";

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
    giftMessage: ""
  });

  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = 1099;
  const grandTotal = subtotal;

  // Free Silent India Post Pincode Auto-Detection
  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: pin }));

    if (pin.length === 6) {
      setPincodeLoading(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            pincode: pin,
            city: postOffice.District || postOffice.Block || postOffice.Name,
            state: postOffice.State
          }));
        }
      } catch (err) {
        console.error("PIN lookup error:", err);
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleTriggerRazorpay = async () => {
    if (!formData.fullName || !formData.email || !formData.telephone || !formData.address || !formData.pincode) {
      setError("Please complete all shipping details to proceed.");
      return;
    }

    setLoading(true);
    setError("");

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

      const orderData = await res.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Order creation failed");
      }

      if (typeof window.Razorpay !== "undefined") {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.key_id || "rzp_test_TNGgxOeUADZzEF",
          amount: orderData.amount,
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
            color: "#f59e0b"
          },
          handler: function (response: any) {
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
        window.location.href = `/order/confirmed/${orderData.order_id}`;
      }
    } catch (err: any) {
      setError(err.message || "Payment service unavailable. Please retry.");
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="relative min-h-screen bg-[#0c0d12] text-[#edf1f8] pt-32 pb-24 px-4 sm:px-8">
        {/* Background Atmosphere */}
        <div className="absolute top-[8%] right-[10%] w-[550px] h-[550px] rounded-full bg-[#2e63ff]/15 blur-[140px] pointer-events-none" />
        <div className="absolute top-[40%] left-[5%] w-[500px] h-[500px] rounded-full bg-[#ff2e88]/12 blur-[150px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-wider uppercase text-amber-400">
              <Lock size={12} />
              <span>SECURE ZERO-PASSWORD CHECKOUT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-space text-white tracking-tight">
              Express Delivery & Consecration
            </h1>
            <p className="text-xs text-[#9ca6be]">
              Complete your shipping details below for same-day Vedic energization and Bluedart express dispatch.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-950/60 border border-red-500/40 text-red-300 text-xs rounded-xl flex items-center gap-2 max-w-lg mx-auto">
              <span>{error}</span>
            </div>
          )}

          {/* AnimatedStepper Integration */}
          <AnimatedStepper
            onFinalStepCompleted={handleTriggerRazorpay}
            nextButtonText="Continue"
            backButtonText="Back"
          >
            {/* Step 1: Contact & Delivery Address */}
            <Step title="1. Delivery Destination">
              <div className="space-y-4 pt-1">
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
                  <label className="block text-xs text-stone-300 mb-1">Email (for tracking & receipt)*</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@example.com"
                    className="w-full bg-[#080a10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1">House / Flat / Street Address*</label>
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
                      placeholder="6-digit PIN"
                      className="w-full bg-[#080a10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-300 mb-1">City / District*</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="w-full bg-[#080a10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-300 mb-1">State*</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                      className="w-full bg-[#080a10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </Step>

            {/* Step 2: Sacred Package Review */}
            <Step title="2. Keepsake & Blessing Review">
              <div className="space-y-4 pt-1">
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800"
                      alt="Rakhi"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="text-xs font-bold font-space text-white">
                      Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread
                    </div>
                    <div className="text-[11px] text-stone-400">
                      Signature Consecration Keepsake Box (Includes Roli, Akshat, & Almonds)
                    </div>
                    <div className="text-xs font-bold text-amber-400">₹{grandTotal}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1">Personal Blessing Note for Sibling (Optional)</label>
                  <textarea
                    rows={2}
                    value={formData.giftMessage}
                    onChange={(e) => setFormData({ ...formData, giftMessage: e.target.value })}
                    placeholder="Write a heartfelt sacred blessing to be printed inside the keepsake box..."
                    className="w-full bg-[#080a10] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </Step>

            {/* Step 3: Instant Payment */}
            <Step title="3. Confirm & Pay">
              <div className="space-y-4 pt-1 text-xs">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white text-sm">Razorpay Official Gateway</div>
                    <div className="text-stone-400 text-[11px]">Instant UPI (GPay, PhonePe), Cards, NetBanking</div>
                  </div>
                  <div className="text-lg font-bold font-space text-amber-400">
                    ₹{grandTotal}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 flex items-center gap-2 text-[11px]">
                  <ShieldCheck size={16} className="flex-shrink-0" />
                  <span>100% Free Express Air Shipping included • Zero transit charges</span>
                </div>
              </div>
            </Step>
          </AnimatedStepper>
        </div>
      </div>
    </>
  );
}
