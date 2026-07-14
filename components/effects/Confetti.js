"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#4F8EF7", "#9B6DFF", "#22D3EE", "#34D399", "#F59E0B", "#EC4899"];

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Explosion de confettis plein ecran, auto-nettoyee. Aucune librairie externe.
export default function Confetti({ fireKey = 0, particleCount = 90 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!fireKey || prefersReducedMotion()) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const originX = width / 2;
    const originY = height * 0.32;

    const particles = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 7;
      return {
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: 5 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        life: 0
      };
    });

    let raf;
    const maxLife = 150;

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      for (const p of particles) {
        p.life += 1;
        if (p.life > maxLife) continue;
        alive = true;
        p.vy += 0.16; // gravite
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;

        const opacity = Math.max(0, 1 - p.life / maxLife);
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }

      if (alive) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, width, height);
    };
  }, [fireKey, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 60 }}
    />
  );
}
