"use client";

import React, { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { AnimatedStepper, Step } from "@/components/ui/AnimatedStepper";
import { ShieldCheck, Lock, ArrowRight, Loader2, MapPin, Package, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/CartContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, subtotal, discountAmount, appliedCoupon, applyCoupon, clearCart } = useCart();

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

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [error, setError] = useState("");

  const activeItems = items.length > 0 ? items : [
    {
      id: "prod_1",
      handle: "vedic-prosperity-rakhi",
      title: "Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread",
      subtitle: "Signature Consecration Keepsake Box",
      price: 1099,
      original_price: 1299,
      image: "/younoya_logo.png",
      quantity: 1
    }
  ];

  const calculatedSubtotal = items.length > 0 ? subtotal : 1099;
  const grandTotal = Math.max(0, calculatedSubtotal - discountAmount);

  // Strict Mandatory Form Validation Guard
  const handleValidateStep = (step: number) => {
    if (step === 1) {
      if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
        setError("Full Name is required (minimum 2 characters).");
        return false;
      }
      const cleanPhone = formData.telephone.replace(/\D/g, "");
      if (cleanPhone.length < 10) {
        setError("Valid 10-digit mobile number (+91) is required.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setError("Valid email address is required for order tracking & invoice.");
        return false;
      }
      if (!formData.address.trim() || formData.address.trim().length < 5) {
        setError("House / Flat / Street Address is required (minimum 5 characters).");
        return false;
      }
      if (formData.pincode.trim().length !== 6) {
        setError("Valid 6-digit PIN code is required.");
        return false;
      }
      if (!formData.city.trim() || !formData.state.trim()) {
        setError("City and State are required. Please check your PIN code.");
        return false;
      }
    }
    setError("");
    return true;
  };

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
          setError("");
        }
      } catch (err) {
        console.error("PIN lookup error:", err);
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    setCouponMsg(res.message);
  };

  const handleTriggerRazorpay = async () => {
    if (!handleValidateStep(1)) {
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
          subtotal: calculatedSubtotal,
          discountAmount,
          items: activeItems
        })
      });

      const orderData = await res.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Order creation failed");
      }

      if (typeof window.Razorpay !== "undefined") {
        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.key_id;
        const options: any = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "YOUNOYA",
          description: "Consecrated Vedic Rakhi Order",
          image: "https://younoya.com/younoya_icon.png",
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.telephone
          },
          theme: {
            color: "#1C1C1C"
          },
          handler: function (response: any) {
            clearCart();
            window.location.href = `/order/confirmed/${orderData.order_id}?payment_id=${response.razorpay_payment_id || 'pay_demo'}`;
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          }
        };

        // Attach order_id if real Razorpay order was generated
        if (orderData.razorpay_order_id && !orderData.razorpay_order_id.startsWith("order_rzp_")) {
          options.order_id = orderData.razorpay_order_id;
        }

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (failResponse: any) {
          setError(`Payment Failed: ${failResponse?.error?.description || 'Transaction declined'}`);
          setLoading(false);
        });
        rzp.open();
      } else {
        clearCart();
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

      <div className="relative min-h-screen bg-[#FDFCF8] text-[#1C1C1C] pt-36 pb-24 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E2E8E4] border border-[#C2D6C2] text-[11px] font-mono tracking-wider uppercase text-[#1C1C1C]">
              <Lock size={12} />
              <span>SECURE ZERO-PASSWORD CHECKOUT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1C1C1C] tracking-tight">
              Express Delivery & Consecration
            </h1>
            <p className="text-xs text-stone-600">
              Complete your shipping details below for morning Vedic energization and express air dispatch.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-3 max-w-lg mx-auto shadow-sm">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* AnimatedStepper Integration with Clinical Luxury Light Styling */}
          <AnimatedStepper
            onBeforeStepChange={handleValidateStep}
            onFinalStepCompleted={handleTriggerRazorpay}
            nextButtonText="Continue"
            backButtonText="Back"
          >
            {/* Step 1: Contact & Delivery Address */}
            <Step title="1. Delivery Destination (Required)">
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Full Name*</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (error) setError("");
                      }}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Number (+91)*</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.telephone}
                      onChange={(e) => {
                        setFormData({ ...formData, telephone: e.target.value.replace(/\D/g, "") });
                        if (error) setError("");
                      }}
                      placeholder="9876543210"
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email (for tracking & invoice receipt)*</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (error) setError("");
                    }}
                    placeholder="rahul@example.com"
                    className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">House / Flat / Street Address*</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      if (error) setError("");
                    }}
                    placeholder="Flat 402, Nilgiri Heights, MG Road"
                    className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                      <span>PIN Code*</span>
                      {pincodeLoading && <Loader2 size={12} className="animate-spin text-[#D4AF37]" />}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handlePincodeChange}
                      placeholder="6-digit PIN"
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1C1C] font-mono font-bold focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">City / District*</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">State*</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>
                </div>
              </div>
            </Step>

            {/* Step 2: Package Customization & Offers */}
            <Step title="2. Package Customization & Offers">
              <div className="space-y-6 pt-1">
                {/* Cart Items List */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 font-bold">
                    Items Selected in Package ({activeItems.length})
                  </label>
                  {activeItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-white border border-[#E2E8E4] flex items-center gap-4 shadow-sm">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#E8E6E1] border border-[#E2E8E4] flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="text-xs font-bold font-heading text-[#1C1C1C] truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">
                          {item.subtitle || "Signature Consecration Keepsake Box"} (Qty: {item.quantity})
                        </div>
                        <div className="text-xs font-extrabold font-mono text-[#1C1C1C]">₹{item.price * item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sibling Blessing Note */}
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8E4] space-y-2 shadow-sm">
                  <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                    Personal Sibling Blessing Note (Printed on Sacred Card)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.giftMessage}
                    onChange={(e) => setFormData({ ...formData, giftMessage: e.target.value })}
                    placeholder="Write a heartfelt message to be printed inside the keepsake box..."
                    className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-3 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>

                {/* Coupon Code Section */}
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8E4] space-y-3 shadow-sm">
                  <label className="block text-xs font-bold text-[#1C1C1C]">Apply Promo Coupon</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. VEDIC10"
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-3 text-xs text-[#1C1C1C] font-mono uppercase focus:outline-none focus:border-[#1C1C1C]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-6 py-3 rounded-xl bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#333333] transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <div className="text-xs text-emerald-700 font-medium pt-1">{couponMsg}</div>
                  )}
                </div>
              </div>
            </Step>

            {/* Step 3: Granular Full Final Order Confirmation & Payment */}
            <Step title="3. Final Order Confirmation & Payment">
              <div className="space-y-6 pt-1">
                <div className="p-5 rounded-2xl bg-[#F5F5F0] border border-[#E2E8E4] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E2E8E4] pb-2.5">
                    <div className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#D4AF37]" />
                      <span>Delivery Destination</span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-700 space-y-1">
                    <div className="font-bold text-[#1C1C1C] text-sm">{formData.fullName}</div>
                    <div>{formData.telephone} • {formData.email}</div>
                    <div>{formData.address}</div>
                    <div>{formData.city}, {formData.state} - <span className="font-mono font-bold text-[#1C1C1C]">{formData.pincode}</span></div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#F5F5F0] border border-[#E2E8E4] space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold flex items-center gap-1.5 border-b border-[#E2E8E4] pb-2.5">
                    <Package size={13} className="text-[#D4AF37]" />
                    <span>Package Items ({activeItems.length})</span>
                  </div>

                  <div className="space-y-2.5">
                    {activeItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-[#1C1C1C]">{item.title}</div>
                          <div className="text-[11px] text-stone-500">Qty: {item.quantity} • Keepsake Box Included</div>
                        </div>
                        <div className="font-mono font-bold text-[#1C1C1C]">₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#F5F5F0] border border-[#E2E8E4] space-y-3">
                  <div className="space-y-2 text-xs text-stone-600 border-b border-[#E2E8E4] pb-3">
                    <div className="flex justify-between">
                      <span>Item Subtotal</span>
                      <span className="text-[#1C1C1C]">₹{calculatedSubtotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Coupon Discount ({appliedCoupon})</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Express Air Shipping</span>
                      <span className="text-[#D4AF37] font-bold">FREE (100% Covered)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Consecration Ritual</span>
                      <span className="text-stone-400">Included</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-sm font-bold text-[#1C1C1C]">Total Payable Amount</span>
                    <span className="text-2xl font-extrabold font-mono text-[#1C1C1C]">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#E2E8E4] border border-[#C2D6C2] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-[#1C1C1C] text-xs">Razorpay Official Payment Gateway</div>
                    <div className="text-[11px] text-stone-600">Instant UPI (GPay/PhonePe), Cards, NetBanking</div>
                  </div>
                </div>
              </div>
            </Step>
          </AnimatedStepper>
        </div>
      </div>
    </>
  );
}
