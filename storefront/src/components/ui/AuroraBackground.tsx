"use client";

import React, { useEffect } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";
import { CursorSpotlightBeam } from "@/components/ui/CursorSpotlightBeam";
import { CelestialStarField } from "@/components/ui/CelestialStarField";
import { CelestialRingsBackground } from "@/components/ui/CelestialRingsBackground";

/**
 * AuroraBackground — Cursor-driven dynamic celestial background.
 * Major kinematics are actively steered by mouse coordinates in real-time,
 * providing rich lighting, 3D parallax, and responsive interactive feedback.
 */
export function AuroraBackground() {
  // Normalized mouse coordinates: -1 to 1
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs with varied physics for organic multi-layer parallax depth
  const orb1X = useSpring(mouseX, { stiffness: 40, damping: 22 });
  const orb1Y = useSpring(mouseY, { stiffness: 40, damping: 22 });

  const orb2X = useSpring(mouseX, { stiffness: 28, damping: 20 });
  const orb2Y = useSpring(mouseY, { stiffness: 28, damping: 20 });

  const orb3X = useSpring(mouseX, { stiffness: 35, damping: 25 });
  const orb3Y = useSpring(mouseY, { stiffness: 35, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Direct pixel-based normalized offset from center
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;

      // Displacement scaling per layer
      mouseX.set(xNorm * 90);
      mouseY.set(yNorm * 90);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Deep Cosmic Base Gradient */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            "radial-gradient(ellipse 120% 100% at 50% 20%, #0d1224 0%, #080a14 40%, #040508 100%)",
        }}
        aria-hidden="true"
      />

      {/* 2. Interactive Cursor-Following Radiant Spotlight Beam (100% Cursor-Tracked) */}
      <CursorSpotlightBeam />

      {/* 3. Sacred Astrological Ephemeris Rings (3D Perspective Tilt on Mouse) */}
      <CelestialRingsBackground />

      {/* 4. Multi-Layered Cursor-Driven Glowing Nebula Orbs */}
      {/* Orb 1 — Sacred Solar Gold (Top-Left quadrant, tracks with positive lead) */}
      <motion.div
        className="absolute"
        style={{
          x: orb1X,
          y: orb1Y,
          width: 720,
          height: 720,
          top: "2%",
          left: "8%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(212, 175, 55, 0.35) 0%, rgba(245, 158, 11, 0.16) 40%, transparent 70%)",
          filter: "blur(110px)",
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />

      {/* Orb 2 — Kumkum Crimson / Surya Radiance (Bottom-Right, inverse parallax reaction) */}
      <motion.div
        className="absolute"
        style={{
          x: orb2X,
          y: orb2Y,
          width: 680,
          height: 680,
          top: "40%",
          right: "2%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(220, 38, 38, 0.28) 0%, rgba(185, 28, 28, 0.14) 45%, transparent 70%)",
          filter: "blur(115px)",
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />

      {/* Orb 3 — Cosmic Indigo / Chandra Grace (Center-Bottom, depth anchor) */}
      <motion.div
        className="absolute"
        style={{
          x: orb3X,
          y: orb3Y,
          width: 650,
          height: 650,
          bottom: "-5%",
          left: "28%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(79, 70, 229, 0.26) 0%, rgba(14, 165, 233, 0.12) 45%, transparent 70%)",
          filter: "blur(120px)",
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />

      {/* 5. 60fps Interactive Golden Star Dust & Constellations */}
      <CelestialStarField />

      {/* 6. Subtle SVG Tactile Film Grain Texture */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.025, mixBlendMode: "overlay" }}
        aria-hidden="true"
      >
        <filter id="younoya-grain-deck">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#younoya-grain-deck)" />
      </svg>
    </div>
  );
}
