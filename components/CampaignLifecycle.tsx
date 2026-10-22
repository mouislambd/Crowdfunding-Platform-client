'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

const steps = [
  { title: 'Submit your campaign', desc: 'Share your vision, set funding goals, and upload project imagery.' },
  { title: 'Admin review', desc: 'Our moderation team verifies authenticity and quality standards promptly.' },
  { title: 'Go live', desc: 'Your project launches to thousands of enthusiastic supporters globally.' },
  { title: 'Supporters contribute', desc: 'Backers fund your project with credits and track milestone updates.' },
  { title: 'Withdraw your funds', desc: 'Convert and withdraw earned credits securely upon reaching milestones.' },
];

export default function CampaignLifecycle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scaleLine = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <section ref={containerRef} className="py-20 bg-slate-950 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">From Idea to Impact</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Follow the transparent 5-step journey of how campaigns transform from concepts into reality.</p>
          </div>
        </Reveal>

        <div className="relative">
          {/* Timeline Line (Vertical on mobile, horizontal on lg screens) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0">
            {!shouldReduceMotion && (
              <motion.div
                style={{ scaleX: scaleLine, transformOrigin: 'left' }}
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 h-full"
              />
            )}
          </div>
          <div className="lg:hidden absolute left-6 top-0 bottom-0 w-1 bg-slate-800 z-0">
            {!shouldReduceMotion && (
              <motion.div
                style={{ scaleY: scaleLine, transformOrigin: 'top' }}
                className="absolute inset-0 bg-gradient-to-b from-blue-600 to-indigo-600 w-full"
              />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div className="flex lg:flex-col items-start lg:items-center text-left lg:text-center bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl h-full group hover:border-blue-500/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-blue-600/30 mb-0 lg:mb-6 mr-4 lg:mr-0 shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
