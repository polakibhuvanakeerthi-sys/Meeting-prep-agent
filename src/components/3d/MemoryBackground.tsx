import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  z: number; // depth
}

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  connections: number[];
  pulse: number;
  pulseSpeed: number;
}

export const MemoryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const isReducedMotion = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotion.current = motionQuery.matches;
    const motionListener = (e: MediaQueryListEvent) => {
      isReducedMotion.current = e.matches;
    };
    motionQuery.addEventListener('change', motionListener);

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNetwork();
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = e.clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Node & Particle Storage
    let particles: Particle[] = [];
    let nodes: NodePoint[] = [];

    const initNetwork = () => {
      const isMobile = width < 768;
      const count = isMobile ? 22 : 45;
      const nodeCount = isMobile ? 8 : 18;

      // Color palette tailored for subtle futuristic SaaS glow
      const colors = ['#6366f1', '#818cf8', '#06b6d4', '#a855f7', '#38bdf8'];

      particles = Array.from({ length: count }, () => {
        const baseAlpha = 0.15 + Math.random() * 0.25;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: 1.2 + Math.random() * 2.2,
          alpha: baseAlpha,
          baseAlpha,
          color: colors[Math.floor(Math.random() * colors.length)],
          z: 0.3 + Math.random() * 0.7,
        };
      });

      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 2.5 + Math.random() * 2,
        connections: [],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
      }));
    };

    initNetwork();

    let lastTime = performance.now();

    const draw = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mouseOffsetX = (mouseRef.current.x - 0.5) * 35;
      const mouseOffsetY = (mouseRef.current.y - 0.5) * 35;

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');

      // 1. Draw subtle ambient depth gradient
      const gradient = ctx.createRadialGradient(
        width * 0.5 + mouseOffsetX * 0.5,
        height * 0.35 + mouseOffsetY * 0.5,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );

      if (isDark) {
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.07)');
        gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.03)');
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.04)');
        gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.02)');
        gradient.addColorStop(1, 'rgba(248, 250, 252, 0)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Connect near nodes with subtle animated lines
      const maxDistance = width < 768 ? 130 : 200;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * (isDark ? 0.18 : 0.12);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x + mouseOffsetX * 0.5, nodes[i].y + mouseOffsetY * 0.5);
            ctx.lineTo(nodes[j].x + mouseOffsetX * 0.5, nodes[j].y + mouseOffsetY * 0.5);
            ctx.strokeStyle = isDark ? `rgba(129, 140, 248, ${opacity})` : `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 3. Draw & update nodes
      for (const node of nodes) {
        if (!isReducedMotion.current) {
          node.x += node.vx;
          node.y += node.vy;
          node.pulse += node.pulseSpeed;

          // Boundary bounce
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }

        const nx = node.x + mouseOffsetX * 0.5;
        const ny = node.y + mouseOffsetY * 0.5;
        const pulseFactor = 0.8 + Math.sin(node.pulse) * 0.25;

        // Glow ring
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius * pulseFactor * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.05)';
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(129, 140, 248, 0.6)' : 'rgba(99, 102, 241, 0.5)';
        ctx.fill();
      }

      // 4. Draw & update particles with 3D parallax depth
      for (const p of particles) {
        if (!isReducedMotion.current) {
          p.x += p.vx * p.z;
          p.y += p.vy * p.z;

          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }

        const px = p.x + mouseOffsetX * p.z;
        const py = p.y + mouseOffsetY * p.z;

        ctx.beginPath();
        ctx.arc(px, py, p.radius * p.z, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (isDark ? 0.7 : 0.45);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      motionQuery.removeEventListener('change', motionListener);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90 dark:opacity-95"
      aria-hidden="true"
    />
  );
};

export default MemoryBackground;
