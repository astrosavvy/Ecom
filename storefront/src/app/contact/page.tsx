import React from 'react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 font-body">
      <h1 className="text-3xl font-heading font-bold text-stone-900 border-b border-stone-200 pb-4">
        Contact Us
      </h1>
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4 text-stone-700 font-light">
        <div>📞 Customer Helpline: <strong>+91 (022) 8000-9090</strong></div>
        <div>📱 Mobile/WhatsApp: <strong>+91 98200-12345</strong></div>
        <div>✉️ Email: <strong>support@younoya.com</strong></div>
      </div>
    </div>
  );
}
