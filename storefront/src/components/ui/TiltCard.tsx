"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * TiltCard — Trionn-inspired 3D cursor-responsive tilt wrapper.
 * Tilts toward cursor on hover with specular sheen overlay.
 * Max rotation: ±8deg with spring physics.
 */
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  perspective = 1200,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const sheenX = useMotionValue(50);
  const sheenY = useMotionValue(50);

  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 18 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xNorm = (x / rect.width - 0.5) * 2; // -1 to 1
    const yNorm = (y / rect.height - 0.5) * 2; // -1 to 1

    rotateY.set(xNorm * maxTilt);
    rotateX.set(-yNorm * maxTilt);
    sheenX.set((x / rect.width) * 100);
    sheenY.set((y / rect.height) * 100);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    sheenX.set(50);
    sheenY.set(50);
  };

  return (
    <div style={{ perspective }} className={className}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative will-change-transform"
      >
        {children}

        {/* Specular Sheen Overlay */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
            style={{
              background: `radial-gradient(circle at ${sheenX.get()}% ${sheenY.get()}%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
    </div>
  );
}
