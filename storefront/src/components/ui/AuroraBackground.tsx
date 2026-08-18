"use client";

import React from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";
import { useEffect } from "react";
import { CursorSpotlightBeam } from "@/components/ui/CursorSpotlightBeam";
import { CelestialStarField } from "@/components/ui/CelestialStarField";
import { CelestialRingsBackground } from "@/components/ui/CelestialRingsBackground";

/**
 * AuroraBackground — The unified living celestial background layer featuring:
 * 1. Multi-color dynamic cursor-tracking spotlight beam (750px)
 * 2. Vibrant multi-hue floating aurora mesh blobs (Gold, Kumkum Red, Cosmic Indigo)
 * 3. Sacred rotating Vedic ephemeris rings
 * 4. 60fps golden star dust & constellation particle canvas
 * 5. Subtle film grain overlay
 */
export function AuroraBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 20, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 20, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Expanded parallax range for noticeable cursor reaction (±35px)
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 70;
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 70;
      mouseX.set(xNorm);
      mouseY.set(yNorm);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* 1. Base Gradient Canvas */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #0c0e18 0%, #06070d 50%, #030407 100%)",
        }}
        aria-hidden="true"
      />

      {/* 2. Interactive Cursor-Tracked Spotlight Beam */}
      <CursorSpotlightBeam />

      {/* 3. Sacred Astrological Ephemeris Rings */}
      <CelestialRingsBackground />

      {/* 4. Vibrant Aurora Mesh Blobs (High-Saturation Glow) */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        style={{ x: smoothX, y: smoothY }}
        aria-hidden="true"
      >
        {/* Orb 1 — Sacred Celestial Gold (Top Left) */}
        <div
          className="absolute aurora-orb-1"
          style={{
            width: 700,
            height: 700,
            top: "5%",
            left: "10%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(212, 175, 55, 0.28) 0%, rgba(245, 158, 11, 0.12) 40%, transparent 70%)",
            filter: "blur(130px)",
            mixBlendMode: "screen",
          }}
        />

        {/* Orb 2 — Kumkum Crimson / Surya Fire (Bottom Right) */}
        <div
          className="absolute aurora-orb-2"
          style={{
            width: 650,
            height: 650,
            top: "45%",
            right: "5%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(220, 38, 38, 0.24) 0%, rgba(185, 28, 28, 0.10) 45%, transparent 70%)",
            filter: "blur(120px)",
            mixBlendMode: "screen",
          }}
        />

        {/* Orb 3 — Cosmic Indigo / Chandra Grace (Center-Bottom) */}
        <div
          className="absolute aurora-orb-3"
          style={{
            width: 650,
            height: 650,
            bottom: "0%",
            left: "30%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(79, 70, 229, 0.22) 0%, rgba(14, 165, 233, 0.10) 45%, transparent 70%)",
            filter: "blur(130px)",
            mixBlendMode: "screen",
          }}
        />
      </motion.div>

      {/* 5. 60fps Interactive Star Dust & Constellations */}
      <CelestialStarField />

      {/* 6. Subtle SVG Film Grain Noise Overlay */}
      <svg
        className="fixed inset-0 z-[60] w-full h-full pointer-events-none"
        style={{ opacity: 0.025, mixBlendMode: "overlay" }}
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
