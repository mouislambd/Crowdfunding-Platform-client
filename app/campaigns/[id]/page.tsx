'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";
import Link from 'next/link';
import { voiceBus } from '@/components/voiceBus';

interface Campaign {
  _id: string;
  campaign_title: string;
  campaign_story: string;
  category: string;
  funding_goal: number;
  minimum_contribution: number;
  deadline: string;
  reward_info: string;
  campaign_image_url?: string;
  amount_raised: number;
  creator_name: string;
}

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Contribution state
  const [contributionAmount, setContributionAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [contributionMessage, setContributionMessage] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/api/campaigns/${id}`)
      .then(res => {
        if (res.status === 404) throw new Error('Campaign not found');
        if (!res.ok) throw new Error('Failed to fetch campaign');
        return res.json();
      })
      .then(setCampaign)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;
    
    setSubmitting(true);
    setContributionMessage('');

    try {
      const res = await fetch(`${API_URL}/api/contributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: id,
          contribution_amount: parseFloat(contributionAmount)
        }),
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Contribution failed');
      }

      setContributionMessage('Thank you for your contribution! Pending approval.');
      setContributionAmount('');
    } catch (err: any) {
      setContributionMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async () => {
    setReporting(true);
    try {
        const res = await fetch(`${API_URL}/api/reports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ campaign_id: id, reason: reportReason }),
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to report campaign');
        alert('Campaign reported.');
        setReportModalOpen(false);
        setReportReason('');
    } catch (err: any) {
        alert(err.message);
    } finally {
        setReporting(false);
    }
  };

  if (loading) return <div className="pt-24 p-8 text-center text-white">Loading campaign...</div>;
  if (error) return <div className="pt-24 p-8 text-center text-red-500">{error}</div>;
  if (!campaign) return null;

  const progress = Math.min((campaign.amount_raised / campaign.funding_goal) * 100, 100);

  return (
    <div className="pt-24 pb-12 px-8 max-w-4xl mx-auto text-white">
      {/* Header */}
      <img
        src={campaign.campaign_image_url || '/placeholder-campaign.jpg'}
        alt={campaign.campaign_title}
        className="w-full h-80 object-cover rounded-xl mb-8"
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.dataset.fallbackApplied || target.src.endsWith('/placeholder-campaign.jpg')) return;
          target.dataset.fallbackApplied = 'true';
          target.src = '/placeholder-campaign.jpg';
        }}
      />
      <h1 className="text-4xl font-bold mb-2">{campaign.campaign_title}</h1>
      <p className="text-gray-400 mb-4">by {campaign.creator_name} | {campaign.category}</p>
      <button onClick={() => setReportModalOpen(true)} className="text-red-500 hover:text-red-400 underline text-sm mb-4">Report this campaign</button>

      {/* Ask AI about this campaign chips */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 mb-8 shadow-xl">
        <p className="text-xs font-semibold text-blue-400 mb-2.5 flex items-center gap-1.5">
          <span>✨</span> Ask AI about this campaign:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            'How much is still needed?',
            'What do I get?',
            'When does it end?',
            'Is it close to its goal?',
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => voiceBus.ask(`${q} for campaign ${campaign.campaign_title}`)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs text-gray-200 hover:text-white border border-white/10 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Progress & Info */}
      <div className="bg-gray-900 p-6 rounded-lg mb-8 border border-gray-800">
        <div className="flex justify-between mb-2">
          <span className="text-2xl font-bold">${campaign.amount_raised.toLocaleString()}</span>
          <span className="text-gray-400">raised of ${campaign.funding_goal.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
          <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-sm text-gray-400">Ends {new Date(campaign.deadline).toLocaleDateString()}</p>
      </div>

      {/* Story */}
      <div className="prose prose-invert max-w-none mb-8">
        <h2 className="text-2xl font-semibold mb-4">About this campaign</h2>
        <p className="text-gray-300 whitespace-pre-line">{campaign.campaign_story}</p>
      </div>

      {/* Reward */}
      <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-800 mb-12">
        <h3 className="text-xl font-semibold mb-2 text-blue-200">Reward Info</h3>
        <p className="text-gray-200">{campaign.reward_info}</p>
      </div>

      {/* Contribution Section */}
      <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
        <h2 className="text-2xl font-bold mb-6">Support this Campaign</h2>
        
        {isPending ? (
          <p>Loading session...</p>
        ) : !session ? (
          <p>Please <Link href="/login" className="text-blue-400 underline">log in</Link> to contribute.</p>
        ) : session.user.role !== 'supporter' ? (
          <p className="text-red-400">Only supporters can contribute to campaigns.</p>
        ) : (
          <form onSubmit={handleContribution} className="space-y-4">
            <div>
              <label className="block mb-2">Contribution Amount (Min: ${campaign.minimum_contribution})</label>
              <input
                type="number"
                min={campaign.minimum_contribution}
                className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700"
                value={contributionAmount}
                onChange={e => setContributionAmount(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600"
            >
              {submitting ? 'Processing...' : 'Contribute Now'}
            </button>
          </form>
        )}
        {contributionMessage && (
          <p className={`mt-4 ${contributionMessage.includes('Thank you') ? 'text-green-400' : 'text-red-400'}`}>
            {contributionMessage}
          </p>
        )}
      </div>
    </div>
  );
}
// End of file
