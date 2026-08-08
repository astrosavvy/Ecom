import React from 'react';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 font-body">
      <h1 className="text-3xl font-heading font-bold text-stone-900 border-b border-stone-200 pb-4">
        Profile Info
      </h1>
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3 text-sm">
        <div><strong className="text-stone-700">Email:</strong> user@example.com</div>
        <div><strong className="text-stone-700">Authentication:</strong> Passwordless Email OTP</div>
      </div>
    </div>
  );
}
