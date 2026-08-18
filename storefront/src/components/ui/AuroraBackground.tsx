"use client";

import React from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";
import { useEffect } from "react";

/**
 * AuroraBackground — Three large ambient gradient orbs that float
 * behind all content with slow CSS orbital drift + subtle cursor tracking.
 * Includes SVG grain noise overlay for Trionn-style film texture.
 */
export function AuroraBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 15, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 15, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1..1 range, then scale to 3px max shift
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 6;
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 6;
      mouseX.set(xNorm);
      mouseY.set(yNorm);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Aurora Gradient Orbs Layer */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        style={{ x: smoothX, y: smoothY }}
        aria-hidden="true"
      >
        {/* Orb 1 — Sacred Gold */}
        <div
          className="absolute aurora-orb-1"
          style={{
            width: 600,
            height: 600,
            top: "10%",
            left: "15%",
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(212, 175, 55, 0.13) 0%, rgba(212, 175, 55, 0.04) 45%, transparent 70%)",
            filter: "blur(140px)",
          }}
        />

        {/* Orb 2 — Kumkum Red */}
        <div
          className="absolute aurora-orb-2"
          style={{
            width: 500,
            height: 500,
            top: "55%",
            right: "10%",
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(220, 38, 38, 0.09) 0%, rgba(220, 38, 38, 0.03) 45%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />

        {/* Orb 3 — Cosmic Teal */}
        <div
          className="absolute aurora-orb-3"
          style={{
            width: 550,
            height: 550,
            bottom: "5%",
            left: "40%",
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(13, 148, 136, 0.08) 0%, rgba(13, 148, 136, 0.025) 45%, transparent 70%)",
            filter: "blur(130px)",
          }}
        />
      </motion.div>

      {/* SVG Film Grain Noise Overlay */}
      <svg
        className="fixed inset-0 z-[60] w-full h-full pointer-events-none"
        style={{ opacity: 0.03, mixBlendMode: "overlay" }}
        aria-hidden="true"
      >
        <filter id="younoya-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#younoya-grain)" />
      </svg>
    </>
  );
}
