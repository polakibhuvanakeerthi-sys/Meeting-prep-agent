import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AIMemoryOrb } from '../common/AIMemoryOrb';

interface PrepareHeroSequenceProps {
  meetingTitle: string;
  contactName?: string;
  onComplete: () => void;
}

const PHASES = [
  { text: 'Recalling meeting history...', sub: 'Accessing touchpoints, previous meeting notes, and context graph' },
  { text: 'Connecting previous decisions...', sub: 'Synthesizing agreed milestones, commitments, and deadlines' },
  { text: 'Finding unresolved issues...', sub: 'Detecting blockers, pricing sensitivities, and outstanding questions' },
  { text: 'Understanding context...', sub: 'Correlating stakeholder preferences and historical background' },
  { text: 'Preparing your briefing...', sub: 'Structuring 8-part executive intelligence dossier' }
];

export const PrepareHeroSequence: React.FC<PrepareHeroSequenceProps> = ({
  meetingTitle,
  contactName,
  onComplete
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // Step progression timing
    const stepDuration = 550; // fast, responsive, snappy: ~2.2s total
    const interval = setInterval(() => {
      setCurrentPhase((prev) => {
        if (prev < PHASES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(onComplete, 400);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete, prefersReducedMotion]);

  // Converging memory particles canvas
  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = 400);
    const height = (canvas.height = 400);
    const centerX = width / 2;
    const centerY = height / 2;

    // Create 30 memory particles that converge toward the center orb
    const particles = Array.from({ length: 32 }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 120 + 80;
      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        angle,
        distance,
        speed: Math.random() * 1.8 + 1.2,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? 'rgba(99, 102, 241, ' : 'rgba(56, 189, 248, ', // indigo / sky
        alpha: Math.random() * 0.6 + 0.3
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Move particle inward toward center
        p.distance -= p.speed;
        if (p.distance < 20) {
          // Re-spawn on perimeter
          p.distance = Math.random() * 40 + 150;
          p.angle = Math.random() * Math.PI * 2;
          p.speed = Math.random() * 1.8 + 1.2;
        }

        p.x = centerX + Math.cos(p.angle) * p.distance;
        p.y = centerY + Math.sin(p.angle) * p.distance;

        // Draw particle with gentle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowColor = p.color === 'rgba(99, 102, 241, ' ? '#6366f1' : '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [prefersReducedMotion]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-label="Preparing Meeting Briefing"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 transition-opacity duration-300 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative w-full max-w-md mx-auto text-center flex flex-col items-center">
        {/* Subtle radial aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-600/20 via-sky-500/15 to-transparent blur-3xl pointer-events-none" />

        {/* 3D Orb and Converging Particles Container */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-6">
          {/* Converging Memory Particles Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          />

          {/* Central 3D AI Memory Orb */}
          <div className="relative z-10 scale-110">
            <AIMemoryOrb size={150} particleCount={48} />
          </div>
        </div>

        {/* Meeting Header */}
        <div className="mb-6 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">
            MeetMind Neural Synthesis
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight line-clamp-1">
            {meetingTitle}
          </h2>
          {contactName && (
            <p className="text-xs text-slate-400">
              with <span className="text-slate-200 font-semibold">{contactName}</span>
            </p>
          )}
        </div>

        {/* Sequentially Animated Steps */}
        <div className="w-full max-w-sm bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {/* Top subtle scan line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-shimmer" />

          <div className="h-16 flex flex-col justify-center transition-all duration-300">
            <p className="text-base font-semibold text-white tracking-tight animate-fade-in key={currentPhase}">
              {PHASES[currentPhase].text}
            </p>
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
              {PHASES[currentPhase].sub}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-4 gap-2 pt-4 mt-2 border-t border-slate-800/80">
            {PHASES.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx <= currentPhase
                    ? 'bg-gradient-to-r from-indigo-500 to-sky-400 shadow-sm shadow-indigo-500/50'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Skip button for immediate access */}
        <button
          onClick={onComplete}
          className="mt-6 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer py-1 px-3 rounded-md hover:bg-slate-800/60"
        >
          Skip preparation animation →
        </button>
      </div>
    </div>,
    document.body
  );
};
