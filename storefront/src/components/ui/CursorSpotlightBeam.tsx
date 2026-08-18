"use client";

import React, { useEffect } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";

/**
 * CursorSpotlightBeam — A radiant 750px multi-hue gradient beam that
 * smoothly follows the mouse pointer with spring physics across the entire screen,
 * lighting up the dark background with sacred gold, kumkum crimson, and cosmic indigo.
 */
export function CursorSpotlightBeam() {
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 500);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 500);

  const springConfig = { stiffness: 45, damping: 25, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-0 overflow-hidden will-change-transform"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      aria-hidden="true"
    >
      {/* 1. Core Golden Solar Flare */}
      <div
        style={{
          width: 750,
          height: 750,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212, 175, 55, 0.32) 0%, rgba(220, 38, 38, 0.22) 35%, rgba(99, 102, 241, 0.18) 60%, transparent 75%)",
          filter: "blur(75px)",
          mixBlendMode: "screen",
        }}
      />

      {/* 2. Secondary High-Contrast Amber Focus Beam */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 380,
          height: 380,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(212, 175, 55, 0.15) 50%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
    </motion.div>
  );
}
