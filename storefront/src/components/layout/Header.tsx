"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  // Hide on admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const items: PillNavItem[] = [
    { label: "Vedic Rakhis", href: "/#products" },
    { label: "All Products", href: "/products" },
    { label: "Consecration", href: "/#rituals" },
    { label: "Our Story", href: "/about" },
    { label: "Contact", href: "/contact" }
  ];

  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector<HTMLElement>(".pill-label");
        const white = pill.querySelector<HTMLElement>(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(
          circle,
          {
            scale: 1.2,
            xPercent: -50,
            duration: 0.7,
            ease: "power3.out",
            overwrite: "auto"
          },
          0
        );

        if (label) {
          tl.to(
            label,
            {
              y: -(h + 8),
              duration: 0.5,
              ease: "power3.out",
              overwrite: "auto"
            },
            0
          );
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 20), opacity: 0 });
          tl.to(
            white,
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power3.out",
              overwrite: "auto"
            },
            0
          );
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();
    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    return () => window.removeEventListener("resize", onResize);
  }, [items]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto"
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.25,
      ease: "power3.out",
      overwrite: "auto"
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    gsap.to(img, {
      scale: 1.08,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleLogoLeave = () => {
    const img = logoImgRef.current;
    if (!img) return;
    gsap.to(img, {
      scale: 1,
      duration: 0.3,
      ease: "power2.inOut",
      overwrite: "auto"
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-8 py-2 bg-transparent backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: ENLARGED PROMINENT GOLD LOGO (h-20 to h-24 with negative margins to keep header slim) */}
        <Link
          href="/"
          onMouseEnter={handleLogoEnter}
          onMouseLeave={handleLogoLeave}
          className="flex items-center gap-3 flex-shrink-0 group py-0 -my-2.5"
        >
          <div className="relative h-20 sm:h-24 w-48 sm:w-60 flex items-center">
            <img
              ref={logoImgRef}
              src="/younoya_logo.png"
              alt="YOUNOYA"
              className="object-contain h-full w-auto filter drop-shadow-[0_0_24px_rgba(255,190,60,0.75)] transition-transform duration-300 pointer-events-none"
            />
          </div>
        </Link>

        {/* Center: GSAP Pill Navigation (Without Reviews Link) */}
        <div className="hidden md:flex items-center rounded-full px-2 py-1 bg-white/[0.04] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <ul role="menubar" className="list-none flex items-center gap-1.5 m-0 p-0">
            {items.map((item, i) => (
              <li key={item.href} role="none" className="flex items-center">
                <Link
                  role="menuitem"
                  href={item.href}
                  className="relative overflow-hidden inline-flex items-center justify-center px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider text-[#cbd4e8] hover:text-black cursor-pointer transition-colors duration-200"
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                >
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none bg-amber-400"
                    aria-hidden="true"
                    ref={(el) => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack relative inline-block leading-none z-[2] overflow-hidden py-0.5">
                    <span className="pill-label relative z-[2] inline-block">
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0.5 z-[3] inline-block w-full text-center text-black font-bold"
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Dynamic Cart & Express Checkout */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/cart"
            className="aero-btn-secondary text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2 hover:border-amber-400/40"
          >
            <ShoppingBag size={14} className="text-amber-400" />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-black text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            href="/checkout"
            className="aero-btn-primary text-white text-xs font-semibold px-5 py-2.5 rounded-full uppercase tracking-wider shadow-lg"
          >
            Express Checkout
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white/80 p-2 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 p-5 rounded-2xl bg-[#0e111a]/95 border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col gap-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 px-4 text-xs font-mono uppercase tracking-wider text-stone-300 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-3 border-t border-white/10">
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 text-center aero-btn-secondary text-white text-xs font-medium py-2.5 rounded-full flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={13} />
              <span>Cart ({totalItems})</span>
            </Link>
            <Link
              href="/checkout"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 text-center aero-btn-primary text-white text-xs font-semibold uppercase tracking-wider py-2.5 rounded-full"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
