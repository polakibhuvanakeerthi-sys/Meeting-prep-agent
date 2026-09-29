import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'button' | 'card' | 'orb' | 'link'>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Position state with lerp interpolation
  const mousePos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check coarse pointer (touch devices) or prefers-reduced-motion
    const touchCheck = window.matchMedia('(pointer: coarse)');
    const motionCheck = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (touchCheck.matches || motionCheck.matches) {
      setReducedMotion(true);
      return;
    }

    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionCheck.addEventListener('change', motionHandler);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Check target element for contextual cursor reactions
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (cursorAttr === 'orb') {
        setCursorType('orb');
      } else if (cursorAttr === 'card') {
        setCursorType('card');
      } else if (target.closest('button, [role="button"]') || cursorAttr === 'button') {
        setCursorType('button');
      } else if (target.closest('a') || cursorAttr === 'link') {
        setCursorType('link');
      } else {
        setCursorType('default');
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Animation frame loop for smooth interpolation (lerp)
    let animationFrameId: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = () => {
      trailPos.current.x = lerp(trailPos.current.x, mousePos.current.x, 0.18);
      trailPos.current.y = lerp(trailPos.current.y, mousePos.current.y, 0.18);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      motionCheck.removeEventListener('change', motionHandler);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [visible, reducedMotion]);

  if (reducedMotion || !visible) return null;

  const getRingDimensions = () => {
    if (isClicking) return { size: 24, border: 'border-indigo-400', bg: 'bg-indigo-500/20' };
    switch (cursorType) {
      case 'button':
        return { size: 44, border: 'border-indigo-500/80', bg: 'bg-indigo-500/15' };
      case 'orb':
        return { size: 56, border: 'border-cyan-400/80', bg: 'bg-indigo-600/20' };
      case 'link':
        return { size: 36, border: 'border-indigo-400/60', bg: 'bg-indigo-400/10' };
      case 'card':
        return { size: 32, border: 'border-slate-400/40', bg: 'bg-transparent' };
      default:
        return { size: 28, border: 'border-indigo-400/40', bg: 'bg-indigo-500/5' };
    }
  };

  const ring = getRingDimensions();

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Outer Smooth Trailing Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border transition-[width,height,background-color,border-color] duration-200 ease-out will-change-transform ${ring.border} ${ring.bg} backdrop-blur-[0.5px]`}
        style={{
          width: ring.size,
          height: ring.size,
        }}
      />

      {/* Inner Crisp Glowing Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 rounded-full will-change-transform shadow-sm transition-transform duration-75 ${
          cursorType === 'orb' 
            ? 'w-2 h-2 bg-cyan-400 shadow-cyan-400/50' 
            : cursorType === 'button'
            ? 'w-1.5 h-1.5 bg-indigo-500 shadow-indigo-500/50 scale-125'
            : 'w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400'
        }`}
      />
    </div>
  );
};
