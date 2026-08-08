import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 font-body">
      <h1 className="text-3xl font-heading font-bold text-stone-900 border-b border-stone-200 pb-4">
        About YOUNOYA
      </h1>
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4 text-stone-700 font-light leading-relaxed">
        <p>YOUNOYA is a self-hosted, mobile-first e-commerce brand offering handcrafted Vedic Rakhis, astrologically curated sacred keepsakes, and spiritual essentials across India.</p>
        <p>Our core mission is zero-password checkout — offering a seamless purchase journey with passwordless email OTP verification and express Razorpay payment gateway integration.</p>
      </div>
    </div>
  );
}
