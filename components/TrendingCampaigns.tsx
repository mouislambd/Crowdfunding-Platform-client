'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useApprovedCampaigns } from '@/lib/useApprovedCampaigns';
import Reveal from './Reveal';

const categories = ['All', 'Technology', 'Art', 'Community', 'Health', 'Education', 'Environment'];

export default function TrendingCampaigns() {
  const { campaigns, loading, error } = useApprovedCampaigns();
  const [activeCategory, setActiveCategory] = useState('All');
  const shouldReduceMotion = useReducedMotion();

  const filtered = campaigns
    .filter(c => activeCategory === 'All' || c.category === activeCategory)
    .sort((a, b) => {
      const pctA = (a.amount_raised / (a.funding_goal || 1)) * 100;
      const pctB = (b.amount_raised / (b.funding_goal || 1)) * 100;
      return pctB - pctA;
    })
    .slice(0, 6);

  if (loading) {
    return (
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-gray-400">Loading trending campaigns...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-red-400">{error}</div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Trending Campaigns</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Discover the projects gaining the most momentum across our global community right now.</p>
          </div>
        </Reveal>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist">
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Grid with AnimatePresence */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 bg-slate-900/50 rounded-2xl border border-white/10 max-w-xl mx-auto"
            >
              <p className="text-gray-400 text-lg mb-2">No campaigns found in {activeCategory}.</p>
              <p className="text-gray-500 text-sm">Be the pioneer and launch the first project in this category!</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((campaign, idx) => {
                const goal = campaign.funding_goal || 1;
                const progress = Math.min(Math.round((campaign.amount_raised / goal) * 100), 100);
                const deadlineDate = new Date(campaign.deadline);
                const daysLeft = Math.max(0, Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

                return (
                  <motion.div
                    key={campaign._id}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.01 }}
                    className="h-full"
                  >
                    <Link
                      href={`/campaigns/${campaign._id}`}
                      className="group flex flex-col h-full bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-blue-500/15 hover:border-blue-500/30 transition-all duration-300"
                    >
                      <div className="relative overflow-hidden h-52 bg-slate-800">
                        <img
                          src={campaign.campaign_image_url || '/placeholder-campaign.jpg'}
                          alt={campaign.campaign_title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.dataset.fallbackApplied || target.src.endsWith('/placeholder-campaign.jpg')) return;
                            target.dataset.fallbackApplied = 'true';
                            target.src = '/placeholder-campaign.jpg';
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-blue-400 border border-white/10">
                          {campaign.category || 'General'}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                          {campaign.campaign_title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                          Innovative initiative supported by the community. Join backers to reach the goal.
                        </p>

                        <div className="mt-auto">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold text-white">${campaign.amount_raised.toLocaleString()}</span>
                            <span className="text-gray-400">{progress}% funded</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-4">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-400 pt-3 border-t border-white/5">
                            <span>Goal: ${campaign.funding_goal.toLocaleString()}</span>
                            <span className="text-blue-400 font-medium">{daysLeft} days left</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
