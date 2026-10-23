'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useApprovedCampaigns } from '@/lib/useApprovedCampaigns';
import Reveal from './Reveal';

const TopFundedCampaigns = () => {
  const { campaigns } = useApprovedCampaigns();

  // Sort by amount raised descending for top funded
  const sorted = [...campaigns].sort((a, b) => b.amount_raised - a.amount_raised).slice(0, 6);

  return (
    <section className="py-20 md:py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold text-white mb-2">Top Funded Campaigns</h2>
          <p className="text-gray-400 mb-10">Discover projects that are making waves across our global community.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sorted.map((campaign, idx) => {
            const goal = campaign.funding_goal || 1;
            const progress = Math.min(Math.round((campaign.amount_raised / goal) * 100), 100);

            return (
              <Reveal key={campaign._id} delay={idx * 0.1}>
                <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.3 }} className="h-full">
                  <Link href={`/campaigns/${campaign._id}`} className="group block h-full bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-blue-500/15 hover:border-blue-500/30 transition-all duration-300">
                    <div className="relative overflow-hidden h-52 bg-slate-800">
                      <img 
                        src={campaign.campaign_image_url || '/placeholder-campaign.jpg'} 
                        alt={campaign.campaign_title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-campaign.jpg'; }}
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-blue-400 border border-white/10">
                        {campaign.category || 'Technology'}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">{campaign.campaign_title}</h3>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-blue-400 font-semibold">${campaign.amount_raised.toLocaleString()} raised</span>
                        <span className="text-gray-400">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopFundedCampaigns;
