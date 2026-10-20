'use client';

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { API_URL } from "@/lib/api";
import Reveal from './Reveal';

interface Campaign {
  _id: string;
  campaign_title: string;
  campaign_image_url?: string;
  amount_raised: number;
  funding_goal: number;
}

const TopFundedCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${API_URL}/api/campaigns/top-funded`);
        if (!response.ok) throw new Error('Failed to fetch campaigns');
        const data = await response.json();
        setCampaigns(data);
      } catch (err) {
        setError('Could not load campaigns.');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) return (
    <section className="py-20 md:py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8 min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse flex space-x-4 text-gray-400">Loading top campaigns...</div>
      </div>
    </section>
  );

  if (error || campaigns.length === 0) return (
    <section className="py-20 md:py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8 min-h-[400px] flex items-center justify-center">
        <p className="text-gray-400 text-center">No campaigns yet — be the first to launch one!</p>
      </div>
    </section>
  );

  return (
    <section className="py-20 md:py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold text-white mb-2">Top Funded Campaigns</h2>
          <p className="text-gray-400 mb-10">Discover projects that are making waves.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.slice(0, 6).map((campaign, idx) => (
            <Reveal key={campaign._id} delay={idx * 0.1}>
              <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.3 }} className="h-full">
                <Link href={`/campaigns/${campaign._id}`} className="group block h-full bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <img 
                      src={campaign.campaign_image_url || '/placeholder-campaign.jpg'} 
                      alt={campaign.campaign_title} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-campaign.jpg'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{campaign.campaign_title}</h3>
                    <p className="text-blue-400 font-medium">{campaign.amount_raised.toLocaleString()} credits raised</p>
                  </div>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopFundedCampaigns;
