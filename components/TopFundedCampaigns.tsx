'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL } from "@/lib/api";

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

  if (loading) return <div className="min-h-[400px] flex items-center justify-center text-white py-20 px-4 md:px-8">Loading top campaigns...</div>;
  if (error || campaigns.length === 0) return (
    <section className="py-20 md:py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8 min-h-[400px] flex items-center justify-center">
        <p className="text-gray-400 text-center">No campaigns yet — be the first to launch one!</p>
      </div>
    </section>
  );

  return (
    <section className="py-20 md:py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold text-white mb-2">Top Funded Campaigns</h2>
        <p className="text-gray-400 mb-10">Discover projects that are making waves.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.slice(0, 6).map((campaign) => (
            <Link href={`/campaigns/${campaign._id}`} key={campaign._id} className="group bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
              <img 
                src={campaign.campaign_image_url || '/placeholder-campaign.jpg'} 
                alt={campaign.campaign_title} 
                className="w-full h-48 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-campaign.jpg'; }}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{campaign.campaign_title}</h3>
                <p className="text-blue-400 font-medium">{campaign.amount_raised.toLocaleString()} credits raised</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopFundedCampaigns;
