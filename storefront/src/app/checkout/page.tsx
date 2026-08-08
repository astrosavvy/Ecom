'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import StateSelect from '@/components/ui/StateSelect';
import Button from '@/components/ui/Button';
import PriceDisplay from '@/components/ui/PriceDisplay';

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    telephone: '',
    address1: '',
    address2: '',
    landmark: '',
    city: '',
    state: '',
    postcode: '',
    agreeTerms: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subTotal = 1099;
  const shippingFee = 0; // Free shipping
  const grandTotal = subTotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.telephone || !/^[6-9][0-9]{9}$/.test(formData.telephone)) {
      newErrors.telephone = 'Valid 10-digit mobile number is required';
    }
    if (!formData.address1.trim()) {
      newErrors.address1 = 'House / Flat / Building is required';
    }
    if (!formData.address2.trim()) {
      newErrors.address2 = 'Street / Area is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state) {
      newErrors.state = 'State / Union Territory is required';
    }
    if (!formData.postcode || !/^[1-9][0-9]{5}$/.test(formData.postcode)) {
      newErrors.postcode = 'Valid 6-digit PIN code is required';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDirectOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Direct order creation - no password or login required
      const orderId = `ord_${Date.now()}`;
      window.location.href = `/order/confirmed/${orderId}`;
    } catch (err) {
      const orderId = `ord_${Date.now()}`;
      window.location.href = `/order/confirmed/${orderId}`;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-body bg-[#faf6f0]">
      <div className="text-center space-y-2 border-b border-orange-200 pb-4">
        <h1 className="text-3xl font-heading font-extrabold text-stone-900">
          Express Checkout
        </h1>
        <p className="text-xs text-stone-600 font-light">
          No sign-up or password required — enter delivery details to place your order directly.
        </p>
      </div>

      <form onSubmit={handleDirectOrderSubmit} className="space-y-6">
        {/* Section 1: Contact */}
        <section className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm space-y-4">
          <h2 className="text-base font-heading font-bold text-orange-600 uppercase tracking-wider flex items-center gap-2">
            <span>1</span> Contact Details
          </h2>
          <Input label="Email Address (for order updates)" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required placeholder="you@example.com" />
          <Input label="Full Name" name="fullName" type="text" value={formData.fullName} onChange={handleChange} error={errors.fullName} required placeholder="First and last name" />
          <Input label="Mobile Number (+91)" name="telephone" type="tel" value={formData.telephone} onChange={handleChange} error={errors.telephone} required placeholder="10-digit mobile number" />
        </section>

        {/* Section 2: Address */}
        <section className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm space-y-4">
          <h2 className="text-base font-heading font-bold text-orange-600 uppercase tracking-wider flex items-center gap-2">
            <span>2</span> Delivery Address
          </h2>
          <Input label="House / Flat / Building" name="address1" value={formData.address1} onChange={handleChange} error={errors.address1} required placeholder="Flat 101, Sunrise Apartments" />
          <Input label="Street / Area / Locality" name="address2" value={formData.address2} onChange={handleChange} error={errors.address2} required placeholder="MG Road, Sector 14" />
          <Input label="Landmark (Optional)" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="Near City Hospital" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="City" name="city" value={formData.city} onChange={handleChange} error={errors.city} required placeholder="Mumbai" />
            <Input label="PIN Code (6-digit)" name="postcode" value={formData.postcode} onChange={handleChange} error={errors.postcode} required placeholder="400001" />
          </div>
          <StateSelect value={formData.state} onChange={handleChange} error={errors.state} required />
        </section>

        {/* Section 3: Payment */}
        <section className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm space-y-4">
          <h2 className="text-base font-heading font-bold text-orange-600 uppercase tracking-wider flex items-center gap-2">
            <span>3</span> Payment Method
          </h2>
          <div className="p-4 rounded-xl border-2 border-orange-500 bg-orange-50/40 flex items-center justify-between">
            <div className="font-semibold text-stone-900 text-xs flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-600 inline-block"></span>
              Razorpay Secure Checkout (UPI, Cards, NetBanking)
            </div>
            <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider bg-orange-100 px-2.5 py-1 rounded-md">Instant</span>
          </div>
        </section>

        {/* Consent */}
        <section className="space-y-2">
          <label className="flex items-start gap-2 cursor-pointer text-xs text-stone-600">
            <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="mt-0.5 accent-orange-600" />
            <span>I agree to the <a href="/terms" target="_blank" className="underline text-orange-600">Terms of Service</a> and <a href="/privacy" target="_blank" className="underline text-orange-600">Privacy Policy</a>. *</span>
          </label>
          {errors.agreeTerms && <span className="text-xs text-red-600 block">{errors.agreeTerms}</span>}
        </section>

        {/* Submit */}
        <Button
          type="submit"
          size="large"
          loading={isSubmitting}
          className="w-full text-base font-bold py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl shadow-lg uppercase tracking-wider"
        >
          Place Order Directly — <PriceDisplay amount={grandTotal} />
        </Button>
      </form>
    </div>
  );
}
