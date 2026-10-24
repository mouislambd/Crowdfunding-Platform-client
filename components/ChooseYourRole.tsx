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
      { 
        title: 'Curated Innovation', 
        desc: 'Access exclusive vetted tech and creative breakthroughs before public release.',
        details: 'Our expert vetting committee evaluates submissions for technical feasibility and originality, ensuring supporters only back high-potential, trustworthy projects.'
      },
      { 
        title: 'Secure Contributions', 
        desc: 'Bank-grade credit handling with full transparency and refund protection safeguards.',
        details: 'Funds are held in secure smart escrow accounts and released incrementally only when verified milestone deliverables are achieved.'
      },
      { 
        title: 'Community Governance', 
        desc: 'Vote on featured projects and help shape the future of community-driven funding.',
        details: 'Active supporters gain governance voting power to highlight trending initiatives and participate in platform feature decisions.'
      },
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
      { 
        title: 'Global Reach', 
        desc: 'Instantly connect with thousands of active backers and tech enthusiasts worldwide.',
        details: 'Tap into our pre-vetted network of global patrons across 50+ countries eager to support groundbreaking creative and technological ventures.'
      },
      { 
        title: 'Robust Dashboard', 
        desc: 'Manage contributions, track analytics, and streamline updates from an intuitive interface.',
        details: 'Our creator command center provides live funding velocity telemetry, backer demographics, and automated milestone update tools.'
      },
      { 
        title: 'Zero Hidden Fees', 
        desc: 'Transparent credit conversion rates with fair withdrawal thresholds and secure payouts.',
        details: 'Enjoy predictable, low-friction fee structures with instant conversion and swift payout channels directly to your bank account or crypto wallet.'
      },
    ],
  },
};

export default function ChooseYourRole() {
  const [role, setRole] = useState<'supporter' | 'builder'>('supporter');
  const [selectedBenefitIdx, setSelectedBenefitIdx] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();
  const current = rolesData[role];

  const handleRoleChange = (r: 'supporter' | 'builder') => {
    setRole(r);
    setSelectedBenefitIdx(0);
  };

  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
      {/* Glassmorphic Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Choose Your Role</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Whether you are here to fund breakthrough ideas or build your own venture, FundRise is your platform.</p>
          </div>
        </Reveal>

        {/* Glass Segmented Control */}
        <div className="flex justify-center mb-16">
          <div
            role="tablist"
            aria-label="Role Selection"
            className="relative flex bg-slate-950/60 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-2xl"
          >
            {(['supporter', 'builder'] as const).map(r => {
              const isActive = role === r;
              return (
                  <button
                    key={r}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleRoleChange(r)}
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
                    className="bg-slate-950/40 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 shadow-2xl relative group hover:border-blue-500/40 hover:bg-slate-900/60 transition-all duration-300"
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
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-3 text-center">Key Benefits</h3>
              <p className="text-gray-400 text-sm text-center mb-8 max-w-lg mx-auto">Click any benefit card below for interactive insights and deep-dive details.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {current.benefits.map((benefit, idx) => {
                  const isSelected = selectedBenefitIdx === idx;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedBenefitIdx(idx)}
                      className={`p-8 rounded-2xl border cursor-pointer flex flex-col transition-all duration-300 ${
                        isSelected
                          ? 'bg-slate-900 border-blue-500 shadow-2xl shadow-blue-500/20'
                          : 'bg-slate-950/40 backdrop-blur-2xl border-white/10 hover:border-blue-500/40 shadow-xl'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                          ✓
                        </div>
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
                          Benefit 0{idx + 1}
                        </span>
                      </div>
                      <h4 className="text-xl font-semibold text-white mb-3">{benefit.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed flex-grow">{benefit.desc}</p>
                      <div className="mt-4 pt-4 border-t border-white/5 text-xs text-blue-400 font-semibold flex items-center gap-1">
                        <span>{isSelected ? 'Active Spotlight ▼' : 'Click to inspect →'}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Benefit Deep-Dive Spotlight */}
            <div className="mb-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${role}-${selectedBenefitIdx}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-900/90 backdrop-blur-2xl p-8 rounded-2xl border border-blue-500/30 shadow-2xl max-w-3xl mx-auto relative overflow-hidden text-center"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
                  <span className="text-xs uppercase tracking-wider text-blue-400 font-bold mb-2 block">
                    {current.title} Spotlight — Benefit #{selectedBenefitIdx + 1}
                  </span>
                  <h4 className="text-xl font-bold text-white mb-3">
                    {current.benefits[selectedBenefitIdx].title}
                  </h4>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                    {current.benefits[selectedBenefitIdx].details}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href={`/register?role=${role}`}
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
