import React, { useEffect, useState } from 'react';
import { MemoryOrb } from '../3d/MemoryOrb';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<number>(0);
  // Phase 0: Dark background + tiny central glowing spark (0.0s - 0.7s)
  // Phase 1: Particles gather into 3D AI Memory Orb (0.7s - 1.6s)
  // Phase 2: Orb rotating + Text "MeetMind AI" + Tagline fades in (1.6s - 2.8s)
  // Phase 3: Orb smoothly transitions up + Reveal landing page (2.8s - 3.4s)

  useEffect(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2800);
    const t4 = setTimeout(() => {
      sessionStorage.setItem('meetmind_intro_seen', 'true');
      onComplete();
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('meetmind_intro_seen', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden select-none">
      {/* Background Ambient Radial Glow */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.18) 0%, rgba(15, 23, 42, 0.95) 70%, #020617 100%)',
          opacity: phase >= 1 ? 1 : 0.4
        }}
      />

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-20 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <span>Skip Intro</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Main Center Animation Stage */}
      <div 
        className={`relative z-10 flex flex-col items-center justify-center text-center px-4 transition-all duration-700 ease-out ${
          phase === 3 ? 'translate-y-[-100px] opacity-0 scale-95' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Phase 0: Tiny Central Glowing Spark */}
        {phase === 0 && (
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <div className="absolute w-6 h-6 rounded-full bg-indigo-500/50 blur-sm animate-pulse" />
          </div>
        )}

        {/* Phase 1 & 2 & 3: 3D AI Memory Orb */}
        {phase >= 1 && (
          <div className="relative mb-6 transform transition-all duration-700 animate-fade-in">
            <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl pointer-events-none animate-pulse" />
            <MemoryOrb size={150} particleCount={60} isPreparing={phase === 1} pulsing={phase === 2} />
          </div>
        )}

        {/* Phase 2: Title and Tagline Reveal */}
        {phase >= 2 && (
          <div className="space-y-3 max-w-lg mx-auto animate-fade-in">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                MeetMind AI
              </h1>
            </div>
            <p className="text-base sm:text-lg text-slate-300 font-medium tracking-wide">
              Remember every conversation. Prepare for every meeting.
            </p>
          </div>
        )}
      </div>

      {/* Subtle bottom loading bar */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-slate-800/80 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 ease-out"
          style={{ width: `${(phase + 1) * 25}%` }}
        />
      </div>
    </div>
  );
};

export default CinematicIntro;
