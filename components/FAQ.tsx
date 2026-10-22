'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from './Reveal';

const faqs = [
  {
    q: 'How do I create and launch a campaign?',
    a: 'Simply register as a Builder, fill out your project title, funding goal, compelling imagery, and milestones. Our moderation team reviews submissions swiftly before approval.',
  },
  {
    q: 'How does credit conversion and withdrawal work?',
    a: 'Credits are the universal currency on FundRise. You can withdraw earned credits at a transparent conversion rate of 20 credits = $1 USD once milestone goals are achieved.',
  },
  {
    q: 'Is my financial contribution secure?',
    a: 'Yes. All payments and credit escrow accounts are protected with bank-grade encryption and rigorous verification standards to ensure total safety.',
  },
  {
    q: 'What happens if a campaign does not reach its goal?',
    a: 'If a project fails to reach its funding goal within the deadline window, backer credits are fully protected and eligible for redistribution or refund safeguards.',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-20 bg-slate-950 text-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Got questions about backing, building, or credit withdrawals? We have answers.</p>
          </div>
        </Reveal>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <Reveal key={idx} delay={idx * 0.05}>
                <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-lg text-white">{faq.q}</span>
                    <span className="text-blue-400 text-xl font-bold shrink-0">{isOpen ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
