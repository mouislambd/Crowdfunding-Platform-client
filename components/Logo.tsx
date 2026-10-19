import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      {/* Icon */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300 ${iconSizes[size]}`}>
        <svg
          className="w-5 h-5 text-white drop-shadow"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Text */}
      <span className={`font-extrabold tracking-tight text-white ${textSizes[size]}`}>
        Fund<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Rise</span>
      </span>
    </div>
  );
};

export default Logo;
