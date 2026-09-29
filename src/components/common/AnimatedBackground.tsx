import React, { useEffect, useRef } from 'react';

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle ambient particles (16 to 22 only, very lightweight)
    const particleCount = 20;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.8,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.35 + 0.1,
      color: Math.random() > 0.5 ? '56, 189, 248' : '168, 85, 247', // sky / purple
    }));

    let t = 0;

    const render = () => {
      t += 0.004;
      ctx.clearRect(0, 0, width, height);

      // Subtle gradient drift in the background
      const grad1X = width * 0.3 + Math.sin(t * 0.7) * (width * 0.12);
      const grad1Y = height * 0.25 + Math.cos(t * 0.8) * (height * 0.08);
      const radial1 = ctx.createRadialGradient(grad1X, grad1Y, 10, grad1X, grad1Y, width * 0.45);
      radial1.addColorStop(0, 'rgba(56, 189, 248, 0.035)');
      radial1.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = radial1;
      ctx.fillRect(0, 0, width, height);

      const grad2X = width * 0.75 + Math.cos(t * 0.6) * (width * 0.1);
      const grad2Y = height * 0.65 + Math.sin(t * 0.5) * (height * 0.12);
      const radial2 = ctx.createRadialGradient(grad2X, grad2Y, 10, grad2X, grad2Y, width * 0.4);
      radial2.addColorStop(0, 'rgba(168, 85, 247, 0.025)');
      radial2.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = radial2;
      ctx.fillRect(0, 0, width, height);

      // Draw drifting particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pulseAlpha = p.alpha * (0.8 + 0.2 * Math.sin(t * 2 + i));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${pulseAlpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Subtle depth grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.045]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)'
        }}
      />
      {/* Dynamic drifting canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
