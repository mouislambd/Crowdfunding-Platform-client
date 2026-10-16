'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { normalizeRole, homePathFor } from '@/lib/roles';
import { Trash2 } from 'lucide-react';

interface Campaign {
  _id: string;
  id?: string;
  campaign_title: string;
  category: string;
  creatorName?: string;
  creator_name?: string;
  funding_goal: number;
  amount_raised: number;
  status: string;
}

export default function ManageCampaignsPage() {
  const { data: session, isPending } = useSession();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = normalizeRole(session?.user?.role);

  useEffect(() => {
    if (role === 'admin') {
      fetchCampaigns();
    }
  }, [role]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/campaigns/admin/all`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch campaigns');
      const data = await res.json();
      setCampaigns(Array.isArray(data) ? data : data.campaigns || []);
    } catch (err) {
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

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

  if (role !== 'admin') {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-4">Only administrators can access this page.</p>
        <Link href={homePathFor(session?.user?.role)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Go to Dashboard Home
        </Link>
      </div>
    );
  }

  const handleDeleteCampaign = async (id: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const res = await fetch(`${API_URL}/api/campaigns/admin/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const res2 = await fetch(`${API_URL}/api/campaigns/${id}`, { method: 'DELETE', credentials: 'include' });
        if (!res2.ok) throw new Error('Failed to delete campaign');
      }
      setCampaigns(campaigns.filter(c => c._id !== id && c.id !== id));
    } catch (err) {
      alert('Failed to delete campaign');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading campaigns...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Manage Campaigns</h1>
      {campaigns.length === 0 ? (
        <p className="text-gray-400">No campaigns found.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-800">
          <table className="w-full text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-800 text-gray-300">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Creator</th>
                <th className="p-4">Goal</th>
                <th className="p-4">Raised</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {campaigns.map(c => {
                const cid = c._id || c.id || '';
                return (
                  <tr key={cid}>
                    <td className="p-4 font-medium text-white">{c.campaign_title}</td>
                    <td className="p-4">{c.category}</td>
                    <td className="p-4">{c.creatorName || c.creator_name || 'N/A'}</td>
                    <td className="p-4">${c.funding_goal}</td>
                    <td className="p-4">${c.amount_raised ?? 0}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        c.status === 'approved' ? 'bg-green-900 text-green-200' :
                        c.status === 'pending' ? 'bg-yellow-900 text-yellow-200' : 'bg-red-900 text-red-200'
                      }`}>
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteCampaign(cid)}
                        className="text-red-400 hover:text-red-300 p-2"
                        title="Delete Campaign"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
