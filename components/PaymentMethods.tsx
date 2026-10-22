'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

const methods = [
  {
    name: 'Stripe',
    desc: 'Global Card Payments',
    svg: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    name: 'bKash',
    desc: 'Mobile Financial Service',
    svg: (
      <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Rocket',
    desc: 'Secure Mobile Transfer',
    svg: (
      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    name: 'Nagad',
    desc: 'Digital Bangladesh Wallet',
    svg: (
      <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function PaymentMethods() {
  const shouldReduceMotion = useReducedMotion();
  const marqueeItems = [...methods, ...methods, ...methods];

  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Supported Payment Systems</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Seamlessly contribute and withdraw through trusted global and regional financial gateways.</p>
          </div>
        </Reveal>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden py-4 group">
          <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

          <motion.div
            animate={shouldReduceMotion ? {} : { x: ['0%', '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="flex gap-6 w-max group-hover:[animation-play-state:paused]"
          >
            {marqueeItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-slate-950/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-xl min-w-[260px] hover:border-blue-500/30 transition-colors"
              >
                <div className="p-3 bg-slate-900 rounded-xl border border-white/5">
                  {item.svg}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Caption */}
        <Reveal delay={0.2}>
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-gray-300 text-sm shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Withdraw at <strong className="text-white">20 credits = $1</strong> with instant processing.</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
