'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useApprovedCampaigns } from '@/lib/useApprovedCampaigns';
import Reveal from './Reveal';

function CountdownTimer({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(deadline).getTime();

    const calculate = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculate());
    const interval = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  if (!mounted) return <div className="text-sm text-gray-400">Loading timer...</div>;

  return (
    <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
      <div className="bg-slate-900/90 px-2 py-1.5 rounded-lg border border-white/10">
        <span className="block font-bold text-white text-sm">{timeLeft.days}</span>
        <span className="text-gray-400 text-[10px]">Days</span>
      </div>
      <div className="bg-slate-900/90 px-2 py-1.5 rounded-lg border border-white/10">
        <span className="block font-bold text-white text-sm">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-gray-400 text-[10px]">Hours</span>
      </div>
      <div className="bg-slate-900/90 px-2 py-1.5 rounded-lg border border-white/10">
        <span className="block font-bold text-white text-sm">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-gray-400 text-[10px]">Mins</span>
      </div>
      <div className="bg-slate-900/90 px-2 py-1.5 rounded-lg border border-white/10">
        <span className="block font-bold text-red-400 text-sm">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-gray-400 text-[10px]">Secs</span>
      </div>
    </div>
  );
}

export default function EndingSoon() {
  const { campaigns, loading, error } = useApprovedCampaigns();
  const shouldReduceMotion = useReducedMotion();

  const now = Date.now();
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

  const endingSoonCampaigns = campaigns
    .filter(c => {
      const deadlineTime = new Date(c.deadline).getTime();
      const diff = deadlineTime - now;
      return diff > 0 && diff <= fourteenDaysMs;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  if (loading || error || endingSoonCampaigns.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-semibold mb-3">
                Urgent Action Required
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ending Soon</h2>
              <p className="text-gray-400 mt-2 max-w-lg">Time is running out for these high-impact projects. Back them before their deadlines expire.</p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {endingSoonCampaigns.slice(0, 6).map((campaign, idx) => {
            const goal = campaign.funding_goal || 1;
            const progress = Math.min(Math.round((campaign.amount_raised / goal) * 100), 100);

            return (
              <Reveal key={campaign._id} delay={idx * 0.1}>
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.01 }}
                  className="h-full"
                >
                  <Link
                    href={`/campaigns/${campaign._id}`}
                    className="group flex flex-col h-full bg-slate-950/80 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-red-500/10 hover:border-red-500/30 transition-all duration-300"
                  >
                    <div className="relative overflow-hidden h-48 bg-slate-900">
                      <img
                        src={campaign.campaign_image_url || '/placeholder-campaign.jpg'}
                        alt={campaign.campaign_title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-campaign.jpg'; }}
                      />
                      <div className="absolute top-3 right-3 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Ending Soon
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-1">
                        {campaign.campaign_title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        Final opportunity to contribute and ensure this innovative vision comes to reality.
                      </p>

                      <div className="mt-auto">
                        <div className="mb-4">
                          <p className="text-xs text-gray-400 mb-1.5 font-medium">Live Countdown:</p>
                          <CountdownTimer deadline={campaign.deadline} />
                        </div>

                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-semibold text-white">${campaign.amount_raised.toLocaleString()}</span>
                          <span className="text-gray-400">{progress}% funded</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                          <div className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full" style={{ width: `${progress}%` }} />
                        </div>
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
}
