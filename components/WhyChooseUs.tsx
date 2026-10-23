'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import Reveal from './Reveal';

const features = [
  {
    title: 'Zero Hidden Platform Fees',
    desc: 'Keep more of what you raise with transparent credit conversion and minimal processing overhead.',
    details: 'Unlike traditional platforms taking up to 10%, FundRise utilizes direct credit escrow with near-zero transactional friction.',
    icon: '⚡',
    metric: '0% Hidden Fees',
  },
  {
    title: 'Secure Credit Escrow',
    desc: 'Contributions are held safely in verified escrow until milestone verification criteria are fulfilled.',
    details: 'Smart milestones ensure funds are only released as creators deliver verified progress updates to their backers.',
    icon: '🔒',
    metric: '100% Escrow Safe',
  },
  {
    title: 'Global Supporter Network',
    desc: 'Instantly tap into thousands of active backers, tech enthusiasts, and angel donors worldwide.',
    details: 'Our cross-border matching algorithm connects your campaign directly with interested patrons across 50+ countries.',
    icon: '🌍',
    metric: '50+ Countries',
  },
  {
    title: 'Real-Time Milestone Tracking',
    desc: 'Stay informed with live telemetry, automated status updates, and direct developer communication logs.',
    details: 'Instant WebSocket telemetry updates let supporters watch campaign funding velocity in real time second by second.',
    icon: '📊',
    metric: 'Real-Time Sync',
  },
];

export default function WhyChooseUs() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);

  return (
    <section className="py-20 bg-slate-950 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Why Choose FundRise</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Engineered for absolute transparency, speed, and maximum impact. Click any feature card for interactive insights.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feat, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <Reveal key={feat.title} delay={idx * 0.1}>
                <motion.div
                  style={{ perspective: 1000 }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03, rotateX: 4, rotateY: -4, y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedIdx(idx)}
                  className={`bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border cursor-pointer h-full flex flex-col group transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-500 shadow-2xl shadow-blue-500/20 bg-slate-900'
                      : 'border-white/10 hover:border-blue-500/40 shadow-xl'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {feat.icon}
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
                      {feat.metric}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed flex-grow">
                    {feat.desc}
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/5 text-xs text-blue-400 font-semibold flex items-center gap-1">
                    <span>{isSelected ? 'Active Insight ▼' : 'Click to inspect →'}</span>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* Interactive Deep-Dive Drawer */}
        {selectedIdx !== null && (
          <Reveal delay={0.2}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-900/90 backdrop-blur-2xl p-8 rounded-2xl border border-blue-500/30 shadow-2xl max-w-2xl mx-auto text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
                <span className="text-xs uppercase tracking-wider text-blue-400 font-bold mb-2 block">
                  Interactive Feature Spotlight
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  {features[selectedIdx].title}
                </h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {features[selectedIdx].details}
                </p>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        )}
      </div>
    </section>
  );
}
