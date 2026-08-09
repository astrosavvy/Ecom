"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#07080d] text-[#8b93a8] border-t border-white/10 relative z-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 text-left">
        {/* Brand */}
        <div className="md:col-span-5 space-y-4">
          <Link href="/" className="flex items-baseline text-2xl font-bold tracking-tight">
            <span className="chrome-text">CHROMA</span>
            <span className="text-[#ff2e88] font-black text-2xl ml-0.5">.</span>
          </Link>
          <p className="text-xs sm:text-sm text-[#8b93a8] leading-relaxed max-w-sm">
            The next-generation generative creative suite engineered for fluid 3D vectors, tactile shaders, and modern design systems.
          </p>
          <div className="text-[11px] font-mono text-stone-500 uppercase tracking-widest">
            v2.0 // Liquid Engine Core
          </div>
        </div>

        {/* Product Links */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest font-semibold text-white">Product</h4>
          <ul className="space-y-2 text-xs text-[#8b93a8] list-none p-0 m-0">
            <li><Link href="#features" className="hover:text-white transition-colors">Generative 3D</Link></li>
            <li><Link href="#features" className="hover:text-white transition-colors">Shader Studio</Link></li>
            <li><Link href="#features" className="hover:text-white transition-colors">Clean Code Export</Link></li>
            <li><Link href="#features" className="hover:text-white transition-colors">Changelog</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest font-semibold text-white">Resources</h4>
          <ul className="space-y-2 text-xs text-[#8b93a8] list-none p-0 m-0">
            <li><Link href="/blog" className="hover:text-white transition-colors">Documentation</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">API Reference</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Community</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Showcase</Link></li>
          </ul>
        </div>

        {/* Legal & Status */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest font-semibold text-white">Status</h4>
          <div className="space-y-2 text-xs text-[#8b93a8]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c6ff3d] shadow-[0_0_8px_#c6ff3d]" />
              <span className="text-white font-medium text-xs">All Systems Operational</span>
            </div>
            <p className="text-[11px] pt-1 text-stone-500">Latency: 14ms across global edge POPs</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 px-6 sm:px-12 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>© 2026 CHROMA Labs Inc. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
