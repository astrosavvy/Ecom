import React from 'react';
import Link from 'next/link';

export default function BlogListingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 font-body">
      <h1 className="text-3xl font-heading font-bold text-stone-900 border-b border-stone-200 pb-4">
        YOUNOYA Blog & Articles
      </h1>
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2">
        <h3 className="font-heading text-lg font-bold text-stone-900">Significance of Vedic Symbolism in Raksha Bandhan</h3>
        <p className="text-xs text-stone-600">Discover why astrologically selected crystals, kaudis, and natural conch details bring protection and prosperity.</p>
        <Link href="/blog/significance-of-vedic-symbolism" className="text-xs text-[var(--yn-primary)] hover:underline font-semibold block pt-2">
          Read Article →
        </Link>
      </div>
    </div>
  );
}
