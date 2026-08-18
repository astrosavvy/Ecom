import React from "react";

/**
 * GridCrosshair — Trionn-inspired SVG + marker for structural intersections.
 * Renders a small crosshair at the specified position.
 */
interface GridCrosshairProps {
  className?: string;
  size?: number;
  color?: string;
}

export function GridCrosshair({
  className = "",
  size = 11,
  color = "rgba(212, 175, 55, 0.25)",
}: GridCrosshairProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Horizontal line */}
      <line
        x1="0"
        y1={size / 2}
        x2={size}
        y2={size / 2}
        stroke={color}
        strokeWidth="1"
      />
      {/* Vertical line */}
      <line
        x1={size / 2}
        y1="0"
        x2={size / 2}
        y2={size}
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  );
}
