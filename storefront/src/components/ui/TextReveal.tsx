"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * TextReveal — Staggered character-by-character text animation.
 * Each character animates from blurred/offset to clear/positioned
 * with configurable stagger delay.
 */
interface TextRevealProps {
  text: string;
  className?: string;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  delay?: number;
}

export function TextReveal({
  text,
  className = "",
  stagger = 0.02,
  as: Tag = "h3",
  delay = 0,
}: TextRevealProps) {
  const chars = text.split("");

  return (
    <Tag className={`${className} overflow-hidden`}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.5,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </Tag>
  );
}
