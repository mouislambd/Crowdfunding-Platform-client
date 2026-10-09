import React from 'react';
import Link from 'next/link';

const SocialIcon = ({ name }: { name: string }) => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <text x="50%" y="50%" fontSize="8" textAnchor="middle" dominantBaseline="middle">{name[0]}</text>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="text-2xl font-bold">FundRise</Link>
            <p className="text-gray-400 text-sm">Empowering dreams, funding the future.</p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" target="_blank" className="text-gray-400 hover:text-white" title="LinkedIn"><SocialIcon name="L" /></a>
            <a href="#" target="_blank" className="text-gray-400 hover:text-white" title="Facebook"><SocialIcon name="F" /></a>
            <a href="#" target="_blank" className="text-gray-400 hover:text-white" title="GitHub"><SocialIcon name="G" /></a>
            <a href="#" target="_blank" className="text-gray-400 hover:text-white" title="Twitter"><SocialIcon name="T" /></a>
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
