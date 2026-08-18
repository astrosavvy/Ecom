"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  alphaSpeed: number;
  vx: number;
  vy: number;
}

/**
 * CelestialStarField — A lightweight 60fps HTML5 canvas rendering floating
 * golden star dust particles and connecting constellation lines that react to cursor movement.
 */
export function CelestialStarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -1000, y: -1000, active: false };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Initialize Stars
    const starCount = Math.min(Math.floor((width * height) / 18000), 75);
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.6,
        baseAlpha: Math.random() * 0.5 + 0.25,
        alpha: Math.random() * 0.5 + 0.25,
        alphaSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      });
    }

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Drift
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = width;
        else if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        else if (star.y > height) star.y = 0;

        // Twinkle
        star.alpha += star.alphaSpeed;
        if (star.alpha > 0.85 || star.alpha < 0.2) {
          star.alphaSpeed = -star.alphaSpeed;
        }

        // Mouse Proximity Glow & Repel
        let extraAlpha = 0;
        if (mouse.active) {
          const dx = mouse.x - star.x;
          const dy = mouse.y - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            extraAlpha = (1 - dist / 140) * 0.5;
            // Gentle nudge
            star.x -= (dx / dist) * 0.35;
            star.y -= (dy / dist) * 0.35;
          }
        }

        const finalAlpha = Math.min(star.alpha + extraAlpha, 1);

        // Draw Star Dot
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 218, 122, ${finalAlpha})`;
        ctx.shadowBlur = star.size > 1.2 ? 6 : 0;
        ctx.shadowColor = "rgba(212, 175, 55, 0.8)";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Constellation Lines between close stars
        for (let j = i + 1; j < stars.length; j++) {
          const star2 = stars[j];
          const dx = star.x - star2.x;
          const dy = star.y - star2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            const lineAlpha = (1 - dist / 90) * 0.18 * Math.min(star.alpha, star2.alpha);
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
}
