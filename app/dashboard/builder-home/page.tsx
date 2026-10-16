'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import { useSession } from '@/lib/auth-client';

interface Campaign {
  _id?: string;
  id?: string;
  campaign_title?: string;
  deadline?: string;
  amount_raised?: number;
  funding_goal?: number;
}

interface Contribution {
  _id: string;
  supporterName?: string;
  supporter_name?: string;
  campaignTitle?: string;
  campaign_title?: string;
  amount?: number;
  contribution_amount?: number;
  message?: string;
  details?: string;
}

export default function BuilderHomePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);

  useEffect(() => {
    if (!isPending) {
      if (!session || (session.user.role || '').toLowerCase() !== 'builder') {
        router.push('/dashboard');
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session && (session.user.role || '').toLowerCase() === 'builder') {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [campaignsRes, contributionsRes] = await Promise.all([
            fetch(`${API_URL}/api/campaigns/builder/my-campaigns`, { credentials: 'include' }),
            fetch(`${API_URL}/api/contributions/creator/pending`, { credentials: 'include' })
          ]);
          if (!campaignsRes.ok || !contributionsRes.ok) throw new Error('Failed to fetch data');
          const campData = await campaignsRes.json();
          const contribData = await contributionsRes.json();
          setCampaigns(Array.isArray(campData) ? campData : campData.campaigns || []);
          setContributions(Array.isArray(contribData) ? contribData : contribData.contributions || []);
        } catch (err) {
          setError('Failed to load dashboard data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [session]);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`${API_URL}/api/contributions/${action}/${id}`, { method: 'PATCH', credentials: 'include' });
      if (!res.ok) throw new Error(`Failed to ${action} contribution`);
      setContributions(prev => prev.filter(c => c._id !== id));
      if (selectedContribution?._id === id) setSelectedContribution(null);
    } catch (err) {
      alert('Failed to perform action');
    }
  };

  if (isPending || loading) return <div className="p-8 text-white">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.deadline && new Date(c.deadline) > new Date()).length;
  const totalAmountRaised = campaigns.reduce((sum, c) => sum + (c.amount_raised || 0), 0);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Builder Dashboard</h1>
      
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400">Total Campaigns</p>
          <p className="text-3xl font-bold">{totalCampaigns}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400">Active Campaigns (Future Deadline)</p>
          <p className="text-3xl font-bold text-blue-400">{activeCampaigns}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400">Total Amount Raised</p>
          <p className="text-3xl font-bold text-green-400">${totalAmountRaised.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Contributions To Review</h2>
        {contributions.length === 0 ? (
          <p className="text-gray-400">No pending contributions to review.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="p-3">Supporter Name</th>
                  <th className="p-3">Campaign Title</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map(c => {
                  const supporter = c.supporterName || c.supporter_name || 'Supporter';
                  const title = c.campaignTitle || c.campaign_title || 'Campaign';
                  const amt = c.amount ?? c.contribution_amount ?? 0;
                  return (
                    <tr key={c._id} className="border-b border-gray-800">
                      <td className="p-3">{supporter}</td>
                      <td className="p-3">{title}</td>
                      <td className="p-3">${amt.toLocaleString()}</td>
                      <td className="p-3 space-x-2 flex items-center">
                        <button onClick={() => setSelectedContribution(c)} className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-sm">View</button>
                        <button onClick={() => handleAction(c._id, 'approve')} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">Approve</button>
                        <button onClick={() => handleAction(c._id, 'reject')} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Reject</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {selectedContribution && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Contribution Details</h3>
            <p className="mb-2 text-gray-300"><strong>Supporter:</strong> {selectedContribution.supporterName || selectedContribution.supporter_name || 'N/A'}</p>
            <p className="mb-2 text-gray-300"><strong>Campaign:</strong> {selectedContribution.campaignTitle || selectedContribution.campaign_title || 'N/A'}</p>
            <p className="mb-2 text-gray-300"><strong>Amount:</strong> ${selectedContribution.amount ?? selectedContribution.contribution_amount ?? 0}</p>
            <p className="mb-4 text-gray-300"><strong>Message:</strong> {selectedContribution.message || selectedContribution.details || 'No message provided.'}</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => handleAction(selectedContribution._id, 'approve')} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm">Approve</button>
              <button onClick={() => handleAction(selectedContribution._id, 'reject')} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">Reject</button>
              <button onClick={() => setSelectedContribution(null)} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
