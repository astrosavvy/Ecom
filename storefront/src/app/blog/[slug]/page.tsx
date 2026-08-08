import React from 'react';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 font-body">
      <h1 className="text-3xl font-heading font-bold text-stone-900 border-b border-stone-200 pb-4">
        Significance of Vedic Symbolism in Raksha Bandhan
      </h1>
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4 text-stone-700 font-light leading-relaxed">
        <p>Celebrate Raksha Bandhan with a handcrafted Vedic Rakhi where every element has been chosen with intention...</p>
      </div>
    </div>
  );
}
