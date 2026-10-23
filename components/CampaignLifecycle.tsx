'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import Reveal from './Reveal';

const steps = [
  {
    title: 'Submit your campaign',
    desc: 'Share your vision, set funding goals, and upload project imagery.',
    details: 'Fill out project details, select category, upload high-res imagery and set funding target. Time estimate: 5 minutes.',
    badge: 'Step 1: Initiation',
    metric: '5 min setup',
  },
  {
    title: 'Admin review',
    desc: 'Our moderation team verifies authenticity and quality standards promptly.',
    details: 'Our automated and manual moderation checks verify authenticity, compliance, and quality standards within 24 hours.',
    badge: 'Step 2: Verification',
    metric: '< 24h review',
  },
  {
    title: 'Go live',
    desc: 'Your project launches to thousands of enthusiastic supporters globally.',
    details: 'Your campaign is published globally. Share your link via social media, newsletters, and community channels to gain momentum.',
    badge: 'Step 3: Launch',
    metric: 'Global reach',
  },
  {
    title: 'Supporters contribute',
    desc: 'Backers fund your project with credits and track milestone updates.',
    details: 'Backers fund your project securely using credits. Track real-time contributions and pledge milestones on your dashboard.',
    badge: 'Step 4: Funding',
    metric: 'Live telemetry',
  },
  {
    title: 'Withdraw your funds',
    desc: 'Convert and withdraw earned credits securely upon reaching milestones.',
    details: 'Once milestones are reached, convert and withdraw earned credits instantly to your preferred payment gateway with zero hassle.',
    badge: 'Step 5: Impact',
    metric: 'Instant payout',
  },
];

export default function CampaignLifecycle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

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
            <p className="text-gray-400 max-w-xl mx-auto">Follow the transparent 5-step journey. Click any step below to explore interactive insights.</p>
          </div>
        </Reveal>

        <div className="relative mb-12">
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

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <Reveal key={idx} delay={idx * 0.1}>
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveStep(idx)}
                    className={`flex lg:flex-col items-start lg:items-center text-left lg:text-center p-6 rounded-2xl border backdrop-blur-md cursor-pointer h-full transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-950/40 border-blue-500 shadow-xl shadow-blue-500/15'
                        : 'bg-slate-900/80 border-white/10 hover:border-blue-500/30'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl font-bold text-lg flex items-center justify-center shadow-lg mb-0 lg:mb-6 mr-4 lg:mr-0 shrink-0 transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-blue-600/50 scale-110'
                          : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-600/30'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider block mb-1">
                        {step.metric}
                      </span>
                      <h3 className="text-lg font-semibold text-white mb-2 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Interactive Active Step Detail Card */}
        <Reveal delay={0.2}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-blue-500/30 shadow-2xl relative overflow-hidden max-w-3xl mx-auto text-center"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="inline-block px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
                {steps[activeStep].badge}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {steps[activeStep].title}
              </h3>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                {steps[activeStep].details}
              </p>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
