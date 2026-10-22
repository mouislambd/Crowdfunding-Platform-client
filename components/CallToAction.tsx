'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

export default function CallToAction() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-blue-600/5 blur-3xl pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
        <Reveal>
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-10 md:p-16 rounded-2xl border border-white/10 shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Ready to Bring Your Idea to Life?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8 text-base md:text-lg">
              Join thousands of creators and backers building the future of innovation on FundRise.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all inline-block"
                >
                  Get Started Now
                </Link>
              </motion.div>
              <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/campaigns"
                  className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/20 transition-all inline-block"
                >
                  Explore Campaigns
                </Link>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
