import React, { useEffect, useRef, useState } from 'react';

interface AIMemoryOrbProps {
  size?: number;
  className?: string;
  particleCount?: number;
  interactive?: boolean;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  alpha: number;
}

export const AIMemoryOrb: React.FC<AIMemoryOrbProps> = ({
  size = 160,
  className = '',
  particleCount = 50,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const radius = size * 0.36;
    const points: Point3D[] = [];

    // Distribute points on a sphere (Fibonacci sphere distribution)
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Color gradation (indigo, violet, cyan highlights)
      const colors = ['#6366F1', '#818CF8', '#4F46E5', '#A5B4FC', '#38BDF8'];
      const color = colors[i % colors.length];

      points.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        size: Math.random() * 2 + 1.5,
        color,
        alpha: Math.random() * 0.5 + 0.5,
      });
    }

    let animationFrameId: number;
    let angleX = 0.003;
    let angleY = 0.005;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - size / 2) / (size / 2);
      const y = (e.clientY - rect.top - size / 2) / (size / 2);
      mouseRef.current.targetX = Math.max(-1, Math.min(1, x)) * 0.015;
      mouseRef.current.targetY = Math.max(-1, Math.min(1, y)) * 0.015;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const centerX = size / 2;
      const centerY = size / 2;

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const currentAngleX = angleX + mouseRef.current.y;
      const currentAngleY = angleY + mouseRef.current.x;

      // Draw subtle glowing background aura
      const radialGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.1,
        centerX,
        centerY,
        radius * 1.3
      );
      radialGlow.addColorStop(0, 'rgba(99, 102, 241, 0.28)');
      radialGlow.addColorStop(0.5, 'rgba(129, 140, 248, 0.12)');
      radialGlow.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Core neural nucleus
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius * 0.45
      );
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      coreGrad.addColorStop(0.3, 'rgba(99, 102, 241, 0.6)');
      coreGrad.addColorStop(1, 'rgba(79, 70, 229, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Rotate and project points
      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      const projectedPoints: { x: number; y: number; z: number; pt: Point3D }[] = [];

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];

        // Rotate around Y axis
        const x1 = pt.x * cosY - pt.z * sinY;
        const z1 = pt.z * cosY + pt.x * sinY;

        // Rotate around X axis
        const y2 = pt.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + pt.y * sinX;

        pt.x = x1;
        pt.y = y2;
        pt.z = z2;

        // Perspective projection
        const fov = 300;
        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        projectedPoints.push({ x: projX, y: projY, z: z2, pt });
      }

      // Sort points by z for proper depth rendering
      projectedPoints.sort((a, b) => a.z - b.z);

      // Draw faint synaptic connecting lines between nearby points
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projectedPoints.length; i++) {
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p1 = projectedPoints[i];
          const p2 = projectedPoints[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius * 0.55) {
            const alpha = (1 - dist / (radius * 0.55)) * 0.15;
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw points with 3D depth scaling
      for (const p of projectedPoints) {
        const depthAlpha = Math.max(0.15, Math.min(1, (p.z + radius) / (2 * radius)));
        const pointRadius = Math.max(0.8, p.pt.size * depthAlpha);

        ctx.fillStyle = p.pt.color;
        ctx.globalAlpha = p.pt.alpha * depthAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pointRadius, 0, Math.PI * 2);
        ctx.fill();

        // Highlight glint on closest particles
        if (p.z > radius * 0.3) {
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pointRadius * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [size, particleCount, interactive, reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        className={`relative flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs border border-white/40" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="pointer-events-none drop-shadow-sm"
      />
      {/* Floating micro-particles CSS accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span
          className="absolute w-1.5 h-1.5 rounded-full bg-indigo-400 animate-float-particle opacity-60"
          style={{ top: '15%', left: '20%', animationDelay: '0s' }}
        />
        <span
          className="absolute w-1 h-1 rounded-full bg-cyan-400 animate-float-particle opacity-50"
          style={{ top: '70%', right: '18%', animationDelay: '1.5s' }}
        />
        <span
          className="absolute w-1.5 h-1.5 rounded-full bg-indigo-300 animate-float-particle opacity-70"
          style={{ bottom: '22%', left: '30%', animationDelay: '2.5s' }}
        />
      </div>
    </div>
  );
};
