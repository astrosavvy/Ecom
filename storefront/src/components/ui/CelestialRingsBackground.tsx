"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CelestialRingsBackground — Sacred Vedic ephemeris rings with
 * 3D cursor-perspective tilt (rotateX, rotateY) and subtle slow continuous rotation.
 */
export function CelestialRingsBackground() {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const transX = useMotionValue(0);
  const transY = useMotionValue(0);

  const springConfig = { stiffness: 35, damping: 25 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);
  const smoothTransX = useSpring(transX, springConfig);
  const smoothTransY = useSpring(transY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;

      // ±14deg 3D tilt
      rotateY.set(xNorm * 14);
      rotateX.set(-yNorm * 14);

      // ±30px parallax translation
      transX.set(xNorm * 30);
      transY.set(yNorm * 30);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rotateX, rotateY, transX, transY]);

  return (
    <div
      className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-0 overflow-hidden"
      style={{ perspective: 1400 }}
    >
      <motion.div
        className="relative w-[850px] h-[850px] md:w-[1150px] md:h-[1150px] flex items-center justify-center opacity-35 will-change-transform"
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          x: smoothTransX,
          y: smoothTransY,
          transformStyle: "preserve-3d",
        }}
        aria-hidden="true"
      >
        {/* Outer Ring — Clockwise rotation (120s) */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 1000 1000" className="w-full h-full">
            {/* Concentric circles */}
            <circle cx="500" cy="500" r="480" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 8" opacity="0.65" />
            <circle cx="500" cy="500" r="440" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.45" />
            <circle cx="500" cy="500" r="380" fill="none" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="12 6" opacity="0.55" />
            <circle cx="500" cy="500" r="300" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />

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
                  opacity="0.4"
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Inner Ring — Counter-Clockwise rotation (90s) */}
        <motion.div
          className="absolute inset-[15%]"
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 700 700" className="w-full h-full">
            <circle cx="350" cy="350" r="320" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="6 10" opacity="0.55" />
            <circle cx="350" cy="350" r="220" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.45" />
            <circle cx="350" cy="350" r="140" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeDasharray="2 6" opacity="0.65" />

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
                  opacity="0.8"
                />
              );
            })}
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
