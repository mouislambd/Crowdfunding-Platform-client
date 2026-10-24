import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

const SocialIcon = ({ name }: { name: string }) => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <text x="50%" y="50%" fontSize="8" textAnchor="middle" dominantBaseline="middle">{name[0]}</text>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-slate-950/90 backdrop-blur-2xl text-white border-t border-white/10 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/">
              <Logo size="md" />
            </Link>
            <p className="text-gray-400 text-sm">Empowering dreams, funding the future.</p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="LinkedIn"><SocialIcon name="L" /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Facebook"><SocialIcon name="F" /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="GitHub"><SocialIcon name="G" /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Twitter"><SocialIcon name="T" /></a>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-12">
          © 2026 FundRise. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
