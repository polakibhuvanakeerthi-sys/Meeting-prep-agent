import React, { useEffect, useRef } from 'react';

interface MemoryOrbProps {
  size?: number;
  className?: string;
  particleCount?: number;
  interactive?: boolean;
  isPreparing?: boolean;
  pulsing?: boolean;
}

export const MemoryOrb: React.FC<MemoryOrbProps> = ({
  size = 140,
  className = '',
  particleCount = 50,
  interactive = true,
  isPreparing = false,
  pulsing = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });
  const isReducedMotion = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotion.current = motionQuery.matches;
    const motionListener = (e: MediaQueryListEvent) => {
      isReducedMotion.current = e.matches;
    };
    motionQuery.addEventListener('change', motionListener);

    // Support Retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const coreRadius = size * 0.26;

    // 3D Orbital particle ring data
    interface OrbParticle {
      theta: number; // orbital angle
      phi: number;   // latitude tilt
      radius: number;
      speed: number;
      size: number;
      color: string;
      alpha: number;
    }

    const colors = isPreparing 
      ? ['#a855f7', '#ec4899', '#06b6d4', '#6366f1', '#38bdf8']
      : ['#6366f1', '#818cf8', '#06b6d4', '#38bdf8', '#c084fc'];

    const count = isPreparing ? particleCount * 1.5 : particleCount;
    const particles: OrbParticle[] = Array.from({ length: Math.floor(count) }, (_, i) => {
      return {
        theta: Math.random() * Math.PI * 2,
        phi: (Math.random() - 0.5) * Math.PI,
        radius: coreRadius * (1.1 + Math.random() * 0.8),
        speed: (0.01 + Math.random() * 0.02) * (i % 2 === 0 ? 1 : -1) * (isPreparing ? 2.2 : 1),
        size: 1.2 + Math.random() * 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.3 + Math.random() * 0.7,
      };
    });

    let animationFrameId: number;
    let rotationAngle = 0;
    let pulseAngle = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - (rect.left + rect.width / 2);
      const clientY = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(clientX, clientY);

      if (dist < size * 1.2) {
        mouseRef.current.targetX = (clientX / (size / 2)) * 0.4;
        mouseRef.current.targetY = (clientY / (size / 2)) * 0.4;
        mouseRef.current.isHovered = true;
      } else {
        mouseRef.current.targetX = 0;
        mouseRef.current.targetY = 0;
        mouseRef.current.isHovered = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      // Lerp mouse interaction
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      if (!isReducedMotion.current) {
        rotationAngle += isPreparing ? 0.035 : 0.015;
        pulseAngle += isPreparing ? 0.08 : 0.03;
      }

      ctx.clearRect(0, 0, size, size);

      const isDark = document.documentElement.classList.contains('dark');
      const pulseScale = 1 + Math.sin(pulseAngle) * (isPreparing ? 0.08 : (pulsing ? 0.05 : 0.025));
      const effectiveRadius = coreRadius * pulseScale;

      // 1. Soft Outermost Ambient Glow
      const outerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        effectiveRadius * 0.4,
        centerX,
        centerY,
        size * 0.48
      );
      if (isDark) {
        outerGlow.addColorStop(0, isPreparing ? 'rgba(168, 85, 247, 0.45)' : 'rgba(99, 102, 241, 0.35)');
        outerGlow.addColorStop(0.5, isPreparing ? 'rgba(236, 72, 153, 0.15)' : 'rgba(6, 182, 212, 0.12)');
        outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        outerGlow.addColorStop(0, isPreparing ? 'rgba(168, 85, 247, 0.35)' : 'rgba(99, 102, 241, 0.25)');
        outerGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.1)');
        outerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.48, 0, Math.PI * 2);
      ctx.fill();

      // 2. 3D Orb Core Gradient with Light Reflection
      const lightSourceX = centerX - effectiveRadius * 0.3 + mouseRef.current.x * 12;
      const lightSourceY = centerY - effectiveRadius * 0.3 + mouseRef.current.y * 12;

      const coreGradient = ctx.createRadialGradient(
        lightSourceX,
        lightSourceY,
        2,
        centerX,
        centerY,
        effectiveRadius
      );

      if (isDark) {
        coreGradient.addColorStop(0, '#ffffff');
        coreGradient.addColorStop(0.2, isPreparing ? '#f472b6' : '#a5b4fc');
        coreGradient.addColorStop(0.55, isPreparing ? '#9333ea' : '#4f46e5');
        coreGradient.addColorStop(0.85, isPreparing ? '#581c87' : '#1e1b4b');
        coreGradient.addColorStop(1, 'rgba(15, 23, 42, 0.85)');
      } else {
        coreGradient.addColorStop(0, '#ffffff');
        coreGradient.addColorStop(0.25, isPreparing ? '#e879f9' : '#818cf8');
        coreGradient.addColorStop(0.65, isPreparing ? '#a855f7' : '#4f46e5');
        coreGradient.addColorStop(1, '#312e81');
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, effectiveRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Inner Core Specular Ring
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.5)';
      ctx.stroke();

      // 3. Orbital 3D Particle Cloud with Latitude/Longitude Rotation
      const tiltX = mouseRef.current.y * 0.4 + (isPreparing ? 0.3 : 0.2);
      const tiltY = mouseRef.current.x * 0.4 + rotationAngle;

      // Sort particles by Z depth for proper 3D layering
      const projectedParticles = particles.map((p) => {
        if (!isReducedMotion.current) {
          p.theta += p.speed;
        }

        // Spherical to 3D Cartesian coordinates
        const x3d = p.radius * Math.cos(p.theta) * Math.cos(p.phi);
        const y3d = p.radius * Math.sin(p.phi);
        const z3d = p.radius * Math.sin(p.theta) * Math.cos(p.phi);

        // Rotate around Y and X axes
        const cosY = Math.cos(tiltY);
        const sinY = Math.sin(tiltY);
        const xRotY = x3d * cosY + z3d * sinY;
        const zRotY = -x3d * sinY + z3d * cosY;

        const cosX = Math.cos(tiltX);
        const sinX = Math.sin(tiltX);
        const yRotX = y3d * cosX - zRotY * sinX;
        const zFinal = y3d * sinX + zRotY * cosX;

        return {
          x: centerX + xRotY,
          y: centerY + yRotX,
          z: zFinal,
          size: p.size * (1 + (zFinal / (size * 0.6)) * 0.5),
          color: p.color,
          alpha: p.alpha * Math.max(0.15, 0.6 + (zFinal / (size * 0.6)) * 0.4),
        };
      });

      // Sort back-to-front
      projectedParticles.sort((a, b) => a.z - b.z);

      // Render Particles
      for (const p of projectedParticles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Extra glow on foreground particles
        if (p.z > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.25;
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      motionQuery.removeEventListener('change', motionListener);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [size, particleCount, interactive, isPreparing, pulsing]);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      data-cursor="orb"
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="block"
      />
    </div>
  );
};

export default MemoryOrb;
