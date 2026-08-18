"use client";

import React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

/**
 * CelestialRingsBackground — Sacred Vedic ephemeris concentric orbital rings
 * and 12-house dividers rotating slowly in opposite directions with subtle cursor parallax.
 */
export function CelestialRingsBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 20, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 20, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 20;
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 20;
      mouseX.set(xNorm);
      mouseY.set(yNorm);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 overflow-hidden"
      style={{ x: smoothX, y: smoothY }}
      aria-hidden="true"
    >
      <div className="relative w-[850px] h-[850px] md:w-[1100px] md:h-[1100px] flex items-center justify-center opacity-25">
        {/* Outer Ring — Clockwise rotation (90s) */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 1000 1000" className="w-full h-full">
            {/* Concentric circles */}
            <circle cx="500" cy="500" r="480" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 8" opacity="0.6" />
            <circle cx="500" cy="500" r="440" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
            <circle cx="500" cy="500" r="380" fill="none" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="12 6" opacity="0.5" />
            <circle cx="500" cy="500" r="300" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.35" />

            {/* 12 House Radial Rays */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 500 + Math.cos(angle) * 300;
              const y1 = 500 + Math.sin(angle) * 300;
              const x2 = 500 + Math.cos(angle) * 480;
              const y2 = 500 + Math.sin(angle) * 480;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#D4AF37"
                  strokeWidth="0.8"
                  opacity="0.35"
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Inner Ring — Counter-Clockwise rotation (75s) */}
        <motion.div
          className="absolute inset-[15%]"
          animate={{ rotate: -360 }}
          transition={{ duration: 85, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 700 700" className="w-full h-full">
            <circle cx="350" cy="350" r="320" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="6 10" opacity="0.5" />
            <circle cx="350" cy="350" r="220" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
            <circle cx="350" cy="350" r="140" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeDasharray="2 6" opacity="0.6" />

            {/* 8 Cardinal / Nakshatra Points */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const cx = 350 + Math.cos(angle) * 220;
              const cy = 350 + Math.sin(angle) * 220;
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  fill="#D4AF37"
                  opacity="0.7"
                />
              );
            })}
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}
