import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailPosition, setTrailPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices with fine cursor
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if target is interactive
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button, a, input, textarea, select, [role="button"], canvas')
        );
        setIsHovering(isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth trailing animation loop
    let animId: number;
    const updateTrail = () => {
      setTrailPosition((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.22,
        y: prev.y + (position.y - prev.y) * 0.22
      }));
      animId = requestAnimationFrame(updateTrail);
    };
    animId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [position.x, position.y, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Sharp Dot */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-blue-400 transition-transform duration-75 mix-blend-screen"
        style={{
          width: isClicking ? '10px' : isHovering ? '6px' : '8px',
          height: isClicking ? '10px' : isHovering ? '6px' : '8px',
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
          boxShadow: '0 0 10px rgba(96, 165, 250, 0.9)'
        }}
      />

      {/* Smooth Trailing Glow Ring */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border border-blue-500/60 bg-blue-500/10 transition-all duration-150 ease-out"
        style={{
          width: isHovering ? '48px' : isClicking ? '28px' : '32px',
          height: isHovering ? '48px' : isClicking ? '28px' : '32px',
          transform: `translate3d(${trailPosition.x}px, ${trailPosition.y}px, 0) translate(-50%, -50%)`,
          boxShadow: isHovering
            ? '0 0 25px rgba(59, 130, 246, 0.4), inset 0 0 12px rgba(59, 130, 246, 0.2)'
            : '0 0 15px rgba(59, 130, 246, 0.25)'
        }}
      />
    </>
  );
};
