'use client';

import React, { useState } from 'react';
import Reveal from './Reveal';

export default function CreditCalculator() {
  const [credits, setCredits] = useState(100);
  const usdValue = (credits / 20).toFixed(2);

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
          <div className="bg-slate-950/80 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-semibold text-gray-300">Select Credits Amount</label>
                <span className="text-2xl font-bold text-blue-400 font-mono">{credits.toLocaleString()} Credits</span>
              </div>
              <input
                type="range"
                min="20"
                max="5000"
                step="20"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                <span>20 Credits</span>
                <span>2,500 Credits</span>
                <span>5,000 Credits</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div className="bg-slate-900/90 p-6 rounded-xl border border-white/5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Equivalent USD Value</p>
                <p className="text-3xl font-bold text-white font-mono">${usdValue}</p>
              </div>
              <div className="bg-slate-900/90 p-6 rounded-xl border border-white/5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Standard Backer Tier</p>
                <p className="text-xl font-bold text-blue-400">
                  {credits >= 1000 ? 'VIP Patron Tier' : credits >= 500 ? 'Supporter Pro Tier' : 'Community Backer'}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
