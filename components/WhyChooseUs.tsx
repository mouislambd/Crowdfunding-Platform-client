'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

const features = [
  {
    title: 'Zero Hidden Platform Fees',
    desc: 'Keep more of what you raise with transparent credit conversion and minimal processing overhead.',
    icon: '⚡',
  },
  {
    title: 'Secure Credit Escrow',
    desc: 'Contributions are held safely in verified escrow until milestone verification criteria are fulfilled.',
    icon: '🔒',
  },
  {
    title: 'Global Supporter Network',
    desc: 'Instantly tap into thousands of active backers, tech enthusiasts, and angel donors worldwide.',
    icon: '🌍',
  },
  {
    title: 'Real-Time Milestone Tracking',
    desc: 'Stay informed with live telemetry, automated status updates, and direct developer communication logs.',
    icon: '📊',
  },
];

export default function WhyChooseUs() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 bg-slate-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Why Choose FundRise</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Engineered for absolute transparency, speed, and maximum impact for creators and backers alike.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <Reveal key={feat.title} delay={idx * 0.1}>
              <motion.div
                whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.01 }}
                className="bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl h-full flex flex-col group hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
