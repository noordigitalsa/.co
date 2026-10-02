import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollProgressButton: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
        setIsVisible(window.scrollY > 280);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      className="fixed bottom-6 left-6 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-slate-900/90 text-white border border-slate-700/80 shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:bg-slate-800 transition-all hover:scale-110 active:scale-95 group"
    >
      {/* Circular Progress Ring */}
      <svg className="absolute w-12 h-12 -rotate-90 pointer-events-none" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={radius}
          className="text-slate-800 stroke-current"
          strokeWidth="2.5"
          fill="transparent"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          className="text-blue-500 stroke-current transition-all duration-75"
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <ArrowUp className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
    </button>
  );
};
