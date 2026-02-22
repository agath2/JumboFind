"use client";

import { useEffect, useRef } from "react";

type Dot = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
};

export default function InteractiveDotsBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let rafId = 0;
    const dots: Dot[] = [];
    const mouse = { x: 0, y: 0, active: false };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initDots();
    };

    const initDots = () => {
      dots.length = 0;
      const targetSpacing = 64;
      const cols = Math.max(6, Math.floor(width / targetSpacing));
      const rows = Math.max(5, Math.floor(height / targetSpacing));
      const xGap = width / (cols + 1);
      const yGap = height / (rows + 1);

      for (let row = 1; row <= rows; row += 1) {
        for (let col = 1; col <= cols; col += 1) {
          const jitterX = (Math.random() - 0.5) * 4;
          const jitterY = (Math.random() - 0.5) * 4;
          const baseX = col * xGap + jitterX;
          const baseY = row * yGap + jitterY;
          dots.push({ baseX, baseY, x: baseX, y: baseY });
        }
      }
    };

    const distanceSq = (ax: number, ay: number, bx: number, by: number) => {
      const dx = ax - bx;
      const dy = ay - by;
      return dx * dx + dy * dy;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.x >= 0 && mouse.x <= rect.width && mouse.y >= 0 && mouse.y <= rect.height;
    };

    const onMouseOut = () => {
      mouse.active = false;
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      for (const d of dots) {
        d.x += (d.baseX - d.x) * 0.08;
        d.y += (d.baseY - d.y) * 0.08;
      }

      let nearestFour: number[] = [];
      if (mouse.active) {
        const ranked: Array<{ i: number; d: number }> = [];
        for (let i = 0; i < dots.length; i += 1) {
          const d = dots[i];
          ranked.push({ i, d: distanceSq(mouse.x, mouse.y, d.x, d.y) });
        }
        ranked.sort((u, v) => u.d - v.d);
        nearestFour = ranked.slice(0, 4).map((item) => item.i);

        const distances = nearestFour.map((i) => Math.sqrt(distanceSq(mouse.x, mouse.y, dots[i].x, dots[i].y)));
        const targetRadius = distances.reduce((sum, n) => sum + n, 0) / Math.max(distances.length, 1);

        for (const i of nearestFour) {
          const d = dots[i];
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const desiredX = mouse.x + (dx / len) * targetRadius;
          const desiredY = mouse.y + (dy / len) * targetRadius;
          const maxPull = 10;
          const pullX = Math.max(-maxPull, Math.min(maxPull, desiredX - d.x));
          const pullY = Math.max(-maxPull, Math.min(maxPull, desiredY - d.y));
          d.x += pullX * 0.14;
          d.y += pullY * 0.14;
        }

        ctx.strokeStyle = "rgba(9, 37, 54, 0.28)";
        ctx.lineWidth = 1;
        for (const i of nearestFour) {
          const d = dots[i];
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(d.x, d.y);
          ctx.stroke();
        }

      }

      for (let i = 0; i < dots.length; i += 1) {
        const d = dots[i];
        const isNeighbor = nearestFour.includes(i);
        const radius = isNeighbor ? 2.5 : 1.7;
        const alpha = isNeighbor ? 0.84 : 0.38;
        ctx.fillStyle = `rgba(9, 37, 54, ${alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = window.requestAnimationFrame(tick);
    };

    resize();
    tick();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseout", onMouseOut);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
