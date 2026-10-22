'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

const rolesData = {
  supporter: {
    title: 'Supporter',
    buttonText: 'Join as Supporter',
    steps: [
      { number: '01', title: 'Explore Projects', desc: 'Browse hundreds of verified, high-impact campaigns across technology, arts, and community initiatives.' },
      { number: '02', title: 'Fund with Credits', desc: 'Securely contribute using your account credits or payment systems with transparent tracking.' },
      { number: '03', title: 'Track Progress', desc: 'Receive live updates, milestones, and direct developer logs as your backed project comes to life.' },
      { number: '04', title: 'Earn Rewards', desc: 'Unlock exclusive backer perks, early access, and recognition within our global ecosystem.' },
    ],
    benefits: [
      { title: 'Curated Innovation', desc: 'Access exclusive vetted tech and creative breakthroughs before public release.' },
      { title: 'Secure Contributions', desc: 'Bank-grade credit handling with full transparency and refund protection safeguards.' },
      { title: 'Community Governance', desc: 'Vote on featured projects and help shape the future of community-driven funding.' },
    ],
  },
  builder: {
    title: 'Builder',
    buttonText: 'Start as Builder',
    steps: [
      { number: '01', title: 'Pitch Your Vision', desc: 'Submit your campaign details, funding goal, compelling imagery, and milestones in minutes.' },
      { number: '02', title: 'Rapid Approval', desc: 'Our moderation team reviews and approves verified projects swiftly to go live.' },
      { number: '03', title: 'Engage Supporters', desc: 'Share updates, interact with backers, and build a passionate community around your idea.' },
      { number: '04', title: 'Withdraw Funds', desc: 'Easily withdraw earned credits into real-world currency once funding milestones are achieved.' },
    ],
    benefits: [
      { title: 'Global Reach', desc: 'Instantly connect with thousands of active backers and tech enthusiasts worldwide.' },
      { title: 'Robust Dashboard', desc: 'Manage contributions, track analytics, and streamline updates from an intuitive interface.' },
      { title: 'Zero Hidden Fees', desc: 'Transparent credit conversion rates with fair withdrawal thresholds and secure payouts.' },
    ],
  },
};

export default function ChooseYourRole() {
  const [role, setRole] = useState<'supporter' | 'builder'>('supporter');
  const shouldReduceMotion = useReducedMotion();
  const current = rolesData[role];

  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Choose Your Role</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Whether you are here to fund breakthrough ideas or build your own venture, FundRise is your platform.</p>
          </div>
        </Reveal>

        {/* Segmented Control */}
        <div className="flex justify-center mb-16">
          <div
            role="tablist"
            aria-label="Role Selection"
            className="relative flex bg-slate-950 p-1.5 rounded-full border border-white/10 shadow-xl"
          >
            {(['supporter', 'builder'] as const).map(r => {
              const isActive = role === r;
              return (
                <button
                  key={r}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setRole(r)}
                  className={`relative px-8 py-3 rounded-full text-sm font-semibold capitalize transition-colors z-10 ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="roleTab"
                      className="absolute inset-0 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  {r === 'supporter' ? 'Supporter' : 'Builder'}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -15 }}
            transition={{ duration: 0.4 }}
          >
            {/* 4 Steps */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">4 Simple Steps as a {current.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {current.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/70 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl relative group hover:border-blue-500/30 transition-all"
                  >
                    <div className="text-3xl font-black text-blue-500/30 mb-4 group-hover:text-blue-500/60 transition-colors">
                      {step.number}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Benefits */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Key Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {current.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-b from-slate-950/80 to-slate-900/50 p-8 rounded-2xl border border-white/10 shadow-xl"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold mb-4">
                      ✓
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-3">{benefit.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href="/register"
                  className="inline-block px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all"
                >
                  {current.buttonText}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
