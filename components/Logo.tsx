import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3.5 group cursor-pointer select-none ${className}`}>
      {/* Ultra-Modern Glowing Glassmorphism Icon */}
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600/30 via-indigo-600/30 to-emerald-500/30 border border-blue-400/40 backdrop-blur-xl shadow-xl shadow-blue-900/40 group-hover:border-cyan-400/70 group-hover:shadow-cyan-500/30 transition-all duration-500 ${iconSizes[size]}`}>
        {/* Glow effect background */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-400 opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
        
        {/* Futuristic SVG Growth / Rising Spark Icon */}
        <svg
          className="relative w-5 h-5 text-cyan-300 drop-name group-hover:scale-110 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M14 7h7v7" />
        </svg>
      </div>

      {/* Sleek Typography */}
      <div className="flex flex-col">
        <div className={`font-black tracking-tight text-white flex items-center gap-0.5 ${textSizes[size]}`}>
          <span>Fund</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
            Rise
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold -mt-1 hidden sm:block">
          Crowdfund Platform
        </span>
      </div>
    </div>
  );
};

export default Logo;
