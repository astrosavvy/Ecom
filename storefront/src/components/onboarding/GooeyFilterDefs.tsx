"use client";

import React from "react";

export function GooeyFilterDefs() {
  return (
    <svg
      className="absolute w-0 h-0 pointer-events-none opacity-0 overflow-hidden"
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0 }}
    >
      <defs>
        {/* 1. Gooey Fluid Detachment Filter for Card Separation */}
        <filter id="younoya-gooey-filter" x="-20%" y="-20%" width="140%" height="140%">
          {/* Step 1: Smooth blur to create overlapping alpha falloffs */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          
          {/* Step 2: High-contrast alpha threshold matrix to solidify gooey neck */}
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1  0  0  0    0
              0  1  0  0    0
              0  0  1  0    0
              0  0  0  24  -10
            "
            result="gooey"
          />

          {/* Step 3: Composite original crisp edges on top */}
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>

        {/* 2. Fluid Bubble Shimmer & Displacement Filter for Dissolve Transition */}
        <filter id="younoya-bubble-shimmer" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="15"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
