'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";
import { normalizeRole, homePathFor } from '@/lib/roles';
import { PlusCircle, Trash2, Edit } from 'lucide-react';

interface Campaign {
  _id: string;
  id: string;
  campaign_title: string;
  category: string;
  funding_goal: number;
  amount_raised: number;
  deadline: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function MyCampaignsPage() {
  const { data: session, isPending } = useSession();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const role = normalizeRole(session?.user?.role);

  useEffect(() => {
    if (role === 'builder') {
      fetchCampaigns();
    }
  }, [role]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${API_URL}/api/campaigns/builder/my-campaigns`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch campaigns: ${response.status}`);
      }
      
      const data = await response.json();
      setCampaigns(data);
    } catch (err) {
      setError('Failed to load campaigns.');
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

  const deleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const response = await fetch(`${API_URL}/api/campaigns/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete campaign');
      setCampaigns(campaigns.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete campaign.');
    }
  };

  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({ campaign_title: '', campaign_story: '', reward_info: '' });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;
    try {
      const response = await fetch(`${API_URL}/api/campaigns/${editingCampaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to update campaign');
      setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? { ...c, ...formData } : c));
      setEditingCampaign(null);
    } catch (err) {
      alert('Failed to update campaign.');
    }
  };

  if (loading) return <div className="text-white p-8">Loading campaigns...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-white">
      {editingCampaign && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <form onSubmit={handleUpdate} className="bg-gray-900 p-6 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">Edit Campaign</h2>
            <input type="text" value={formData.campaign_title} onChange={e => setFormData({...formData, campaign_title: e.target.value})} className="w-full bg-gray-950 text-white p-3.5 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Title" required />
            <textarea value={formData.campaign_story} onChange={e => setFormData({...formData, campaign_story: e.target.value})} className="w-full bg-gray-950 text-white p-3.5 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 h-28" placeholder="Story" required />
            <textarea value={formData.reward_info} onChange={e => setFormData({...formData, reward_info: e.target.value})} className="w-full bg-gray-950 text-white p-3.5 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24" placeholder="Reward Info" required />
            <div className="flex justify-end gap-2 pt-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-lg transition-all">Save</button>
              <button type="button" onClick={() => setEditingCampaign(null)} className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">My Campaigns</h1>
      {error && <div className="bg-red-950/80 border border-red-500/40 text-red-200 p-4 rounded-2xl shadow-lg">{error}</div>}
      
      {campaigns.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-3xl border border-gray-800 p-8 shadow-xl">
          <p className="text-gray-400 mb-4">You haven't launched any campaigns yet.</p>
          <Link href="/dashboard/add-campaign" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-blue-600/30 transition-all">
            Launch New Campaign
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto w-full bg-gray-900 rounded-2xl border border-gray-800 shadow-xl">
          <table className="w-full text-left text-gray-400 min-w-[750px]">
            <thead className="text-xs uppercase bg-gray-800/80 text-gray-300">
              <tr>
                <th className="px-6 py-3">Campaign Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Funding Goal</th>
                <th className="px-6 py-3">Amount Raised</th>
                <th className="px-6 py-3">Deadline</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {campaigns.map(campaign => (
                <tr key={campaign._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{campaign.campaign_title}</td>
                  <td className="px-6 py-4">{campaign.category}</td>
                  <td className="px-6 py-4">${campaign.funding_goal}</td>
                  <td className="px-6 py-4">${campaign.amount_raised}</td>
                  <td className="px-6 py-4">{new Date(campaign.deadline).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      campaign.status === 'approved' ? 'bg-green-950/80 border border-green-500/40 text-green-300' :
                      campaign.status === 'pending' ? 'bg-yellow-950/80 border border-yellow-500/40 text-yellow-300' :
                      'bg-red-950/80 border border-red-500/40 text-red-300'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex flex-wrap items-center gap-2">
                    <button onClick={() => { setEditingCampaign(campaign); setFormData({ campaign_title: campaign.campaign_title, campaign_story: '', reward_info: '' }); }} className="text-blue-400 hover:text-blue-300 p-2 bg-blue-950/40 rounded-xl border border-blue-500/20" title="Edit"><Edit size={18}/></button>
                    <button onClick={() => deleteCampaign(campaign.id)} className="text-red-400 hover:text-red-300 p-2 bg-red-950/40 rounded-xl border border-red-500/20" title="Delete"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
