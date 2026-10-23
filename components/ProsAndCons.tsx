'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

const pros = [
  { title: 'Zero Hidden Platform Fees', desc: 'Keep 100% of your earnings with transparent credit conversion and minimal overhead.' },
  { title: 'Secure Credit Escrow', desc: 'Backer funds are held safely until verifiable milestones are successfully delivered.' },
  { title: 'Global Supporter Reach', desc: 'Connect instantly with thousands of active backers across 50+ countries worldwide.' },
  { title: 'Real-Time Telemetry', desc: 'Watch funding progress and milestone updates update live second by second.' },
];

const cons = [
  { title: 'Strict Moderation Review', desc: 'Every campaign undergoes verification to guarantee quality, which takes up to 24 hours.' },
  { title: 'Credit-Based System', desc: 'Transactions use platform credits (20 credits = $1) rather than direct wire transfers.' },
];

export default function ProsAndCons() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Platform Pros & Considerations</h2>
            <p className="text-gray-400 max-w-xl mx-auto">A transparent look at the advantages and trade-offs of using the FundRise ecosystem.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Pros and Cons */}
          <div className="lg:col-span-7 space-y-8">
            {/* Pros */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pros.map((item, idx) => (
                  <Reveal key={item.title} delay={idx * 0.05}>
                    <div className="bg-slate-950/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl h-full flex flex-col hover:border-emerald-500/30 transition-all">
                      <h4 className="font-semibold text-white mb-1.5 flex items-center gap-2">
                        <span className="text-emerald-400">✦</span> {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Cons */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cons.map((item, idx) => (
                  <Reveal key={item.title} delay={idx * 0.05}>
                    <div className="bg-slate-950/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl h-full flex flex-col hover:border-amber-500/30 transition-all">
                      <h4 className="font-semibold text-white mb-1.5 flex items-center gap-2">
                        <span className="text-amber-400">✧</span> {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Animated Image */}
          <div className="lg:col-span-5 flex justify-center">
            <Reveal delay={0.2}>
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-xl p-4 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-blue-600/10 blur-3xl pointer-events-none" />
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80"
                  alt="Platform Pros and Cons"
                  className="w-full h-full object-cover rounded-2xl shadow-xl"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-campaign.jpg'; }}
                />
              </motion.div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
