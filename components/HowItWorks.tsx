'use client';

'use client';

import React from 'react';
import { Search, Wallet, TrendingUp } from 'lucide-react';
import Reveal from './Reveal';

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
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-white mb-2">How It Works</h2>
          <p className="text-gray-400 mb-16">Simple steps to start making an impact.</p>
        </Reveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <Reveal key={index} delay={index * 0.15}>
              <div className="flex flex-col items-center relative h-full bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-900 mb-6 group">
                  <video
                    src={step.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity">
                    <step.icon size={64} className="text-blue-500" />
                  </div>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-4 shadow-lg shadow-blue-600/30">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
