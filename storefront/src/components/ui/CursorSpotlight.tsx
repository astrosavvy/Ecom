"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * CursorSpotlight — Trionn-inspired dual-element custom cursor.
 * Inner dot: instant tracking. Outer ring: spring-trailing.
 * Both use mix-blend-mode: difference for dynamic contrast.
 * Hidden on touch devices.
 */
export function CursorSpotlight() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [variant, setVariant] = useState<"default" | "hover" | "view">("default");
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device — hide cursor entirely
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // GSAP quickTo for 60fps tracking
    const xDot = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Walk up DOM for data-cursor attribute
      const cursorEl = target.closest("[data-cursor]");
      if (cursorEl) {
        const type = cursorEl.getAttribute("data-cursor");
        if (type === "view") {
          setVariant("view");
        } else {
          setVariant("hover");
        }
        return;
      }

      // Auto-detect interactive elements
      const interactive = target.closest("a, button, input, select, textarea, [role='button']");
      if (interactive) {
        setVariant("hover");
        return;
      }

      setVariant("default");
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    // Hide default cursor
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Inner Instant-Tracking Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[99999] mix-blend-difference will-change-transform"
        style={{
          width: variant === "view" ? 0 : 10,
          height: variant === "view" ? 0 : 10,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          transition: "width 0.3s, height 0.3s",
        }}
      />

      {/* Outer Trailing Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[99998] mix-blend-difference will-change-transform flex items-center justify-center"
        style={{
          width: variant === "view" ? 88 : variant === "hover" ? 60 : 36,
          height: variant === "view" ? 88 : variant === "hover" ? 60 : 36,
          borderRadius: "50%",
          border: variant === "view" ? "none" : `1px solid rgba(255, 255, 255, ${variant === "hover" ? 0.5 : 0.25})`,
          backgroundColor: variant === "view" ? "rgba(255, 255, 255, 0.95)" : variant === "hover" ? "rgba(255, 255, 255, 0.08)" : "transparent",
          transition: "width 0.35s cubic-bezier(0.22, 1, 0.36, 1), height 0.35s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.3s, border 0.3s",
        }}
      >
        {variant === "view" && (
          <span
            ref={textRef}
            className="text-[11px] font-mono font-bold tracking-widest uppercase"
            style={{ color: "#07080E" }}
          >
            VIEW
          </span>
        )}
      </div>
    </>
  );
}
