import React from 'react';

export default function AddressesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 font-body">
      <h1 className="text-3xl font-heading font-bold text-stone-900 border-b border-stone-200 pb-4">
        Saved Addresses
      </h1>
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2">
        <h3 className="font-bold text-stone-900">Default Delivery Address</h3>
        <p className="text-sm text-stone-600">Flat 101, Sunrise Apartments, MG Road, Mumbai, Maharashtra - 400001</p>
      </div>
    </div>
  );
}
