'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

export default function CreditCalculator() {
  const [credits, setCredits] = useState<number>(100);
  const shouldReduceMotion = useReducedMotion();
  const usdValue = (credits / 20).toFixed(2);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) {
      setCredits(Math.max(0, Math.min(100000, val)));
    }
  };

  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Credit & Funding Calculator</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Calculate credit conversions and estimate funding values instantly. Rate: 20 credits = $1 USD.</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="bg-slate-950/70 backdrop-blur-xl p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <label className="text-sm font-semibold text-gray-300">Select or Type Credit Amount</label>
                <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    value={credits}
                    onChange={handleInputChange}
                    className="w-28 bg-transparent text-white font-mono font-bold text-xl text-right focus:outline-none"
                  />
                  <span className="text-blue-400 font-semibold text-sm">Credits</span>
                </div>
              </div>

              <input
                type="range"
                min="20"
                max="5000"
                step="20"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-3"
              />
              <div className="flex justify-between text-xs text-gray-400 font-mono">
                <span>20 Credits</span>
                <span>2,500 Credits</span>
                <span>5,000 Credits</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10 mb-8">
              <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Equivalent USD Value</p>
                <p className="text-3xl font-bold text-white font-mono">${usdValue}</p>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Standard Backer Tier</p>
                <p className="text-xl font-bold text-blue-400">
                  {credits >= 1000 ? 'VIP Patron Tier' : credits >= 500 ? 'Supporter Pro Tier' : 'Community Backer'}
                </p>
              </div>
            </div>

            {/* Functional Action Button */}
            <div className="text-center">
              <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href={`/dashboard/purchase-credit?amount=${credits}`}
                  className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all"
                >
                  Get {credits.toLocaleString()} Credits Now →
                </Link>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
