'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { normalizeRole, homePathFor } from '@/lib/roles';

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
  const [loading, setLoading] = useState(true);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);
  const [contributionsError, setContributionsError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);

  const role = normalizeRole(session?.user?.role);

  useEffect(() => {
    if (role === 'builder') {
      let isMounted = true;
      setLoading(true);

      const fetchStats = async () => {
        try {
          const res = await fetch(`${API_URL}/api/campaigns/builder/my-campaigns`, { credentials: 'include' });
          if (!res.ok) {
            const text = await res.text();
            console.error(res.status, text);
            if (isMounted) {
              setCampaignsError(`Could not load stats (${res.status})`);
            }
          } else {
            const data = await res.json();
            if (isMounted) {
              setCampaigns(Array.isArray(data) ? data : data.campaigns || []);
              setCampaignsError(null);
            }
          }
        } catch (err) {
          console.error(err);
          if (isMounted) {
            setCampaignsError('Could not load stats');
          }
        }
      };

      const fetchContributions = async () => {
        try {
          const res = await fetch(`${API_URL}/api/contributions/creator/pending`, { credentials: 'include' });
          if (!res.ok) {
            const text = await res.text();
            console.error(res.status, text);
            if (isMounted) {
              setContributionsError(`Could not load pending contributions (${res.status})`);
            }
          } else {
            const data = await res.json();
            if (isMounted) {
              setContributions(Array.isArray(data) ? data : data.contributions || []);
              setContributionsError(null);
            }
          }
        } catch (err) {
          console.error(err);
          if (isMounted) {
            setContributionsError('Could not load pending contributions');
          }
        }
      };

      Promise.allSettled([fetchStats(), fetchContributions()]).then(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

      return () => {
        isMounted = false;
      };
    }
  }, [role]);

  if (isPending) {
    return (
      <div className="p-8 text-white flex items-center gap-3">
        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading...</span>
      </div>
    );
  }

  if (role !== 'builder') {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-4">Only builders can access this page.</p>
        <Link href={homePathFor(session?.user?.role)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Go to Dashboard Home
        </Link>
      </div>
    );
  }

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

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.deadline && new Date(c.deadline) > new Date()).length;
  const totalAmountRaised = campaigns.reduce((sum, c) => sum + (c.amount_raised || 0), 0);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Builder Dashboard</h1>
      
      {/* Stat cards */}
      {campaignsError ? (
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8 text-red-500">
          {campaignsError}
        </div>
      ) : (
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
      )}

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Contributions To Review</h2>
        {contributionsError ? (
          <div className="text-red-500">{contributionsError}</div>
        ) : contributions.length === 0 ? (
          <p className="text-gray-400">No contributions to review right now.</p>
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
