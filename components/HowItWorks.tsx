'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Wallet, TrendingUp } from 'lucide-react';

const steps = [
  {
    title: 'Discover a Campaign',
    description: 'Browse through innovative projects and find one that resonates with your vision.',
    video: '/v1.mp4',
    icon: Search,
  },
  {
    title: 'Contribute Credits',
    description: 'Support the creators by contributing your credits to fuel their journey.',
    video: '/v2.mp4',
    icon: Wallet,
  },
  {
    title: 'Watch Your Impact Grow',
    description: 'Track the progress of projects you’ve backed and see the real-world change.',
    video: '/v3.mp4',
    icon: TrendingUp,
  },
];

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`py-20 bg-gray-950 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">How It Works</h2>
        <p className="text-gray-400 mb-16">Simple steps to start making an impact.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative">
              <div className="absolute top-0 -right-6 hidden md:block text-gray-700 text-4xl font-bold">→</div>
              
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-800 bg-gray-900 mb-6 group">
                <video
                  src={step.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      e.currentTarget.style.display = 'none';
                      const iconContainer = document.createElement('div');
                      iconContainer.className = 'w-full h-full flex items-center justify-center';
                      const Icon = step.icon;
                      // Note: This is a simple fallback implementation
                      parent.appendChild(iconContainer);
                    }
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity">
                  <step.icon size={64} className="text-blue-500" />
                </div>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
