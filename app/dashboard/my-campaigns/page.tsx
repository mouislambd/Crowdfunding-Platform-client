'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../lib/auth-client';
import Link from 'next/link';
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

  useEffect(() => {
    if (!isPending && session) {
      if (session.user.role !== 'builder') {
        // Maybe redirect or show error if not a builder
        // For now, proceed and let the API handle the auth
      }
      fetchCampaigns();
    }
  }, [session, isPending]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/campaigns/builder/my-campaigns', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch campaigns:", { 
          status: response.status, 
          statusText: response.statusText, 
          errorData 
        });
        throw new Error(`Failed to fetch campaigns: ${response.status}`);
      }
      
      const data = await response.json();
      setCampaigns(data);
    } catch (err) {
      console.error("Error in fetchCampaigns:", err);
      setError('Failed to load campaigns.');
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${id}`, {
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
      const response = await fetch(`http://localhost:5000/api/campaigns/${editingCampaign.id}`, {
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

  if (isPending || loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="p-8">
      {editingCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleUpdate} className="bg-gray-900 p-6 rounded-lg w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Edit Campaign</h2>
            <input type="text" value={formData.campaign_title} onChange={e => setFormData({...formData, campaign_title: e.target.value})} className="w-full bg-gray-950 text-white p-2 rounded mb-3 border border-gray-700" placeholder="Title" required />
            <textarea value={formData.campaign_story} onChange={e => setFormData({...formData, campaign_story: e.target.value})} className="w-full bg-gray-950 text-white p-2 rounded mb-3 border border-gray-700" placeholder="Story" required />
            <textarea value={formData.reward_info} onChange={e => setFormData({...formData, reward_info: e.target.value})} className="w-full bg-gray-950 text-white p-2 rounded mb-3 border border-gray-700" placeholder="Reward Info" required />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={() => setEditingCampaign(null)} className="bg-gray-700 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <h1 className="text-2xl font-bold text-white mb-6">My Campaigns</h1>
      {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4">{error}</div>}
      
      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">You haven't launched any campaigns yet.</p>
          <Link href="/dashboard/add-campaign" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Launch New Campaign
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-800 text-gray-300">
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
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {campaigns.map(campaign => (
                <tr key={campaign._id}>
                  <td className="px-6 py-4 font-medium text-white">{campaign.campaign_title}</td>
                  <td className="px-6 py-4">{campaign.category}</td>
                  <td className="px-6 py-4">${campaign.funding_goal}</td>
                  <td className="px-6 py-4">${campaign.amount_raised}</td>
                  <td className="px-6 py-4">{new Date(campaign.deadline).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      campaign.status === 'approved' ? 'bg-green-900 text-green-200' :
                      campaign.status === 'pending' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-red-900 text-red-200'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => { setEditingCampaign(campaign); setFormData({ campaign_title: campaign.campaign_title, campaign_story: '', reward_info: '' }); }} className="text-blue-400 hover:text-blue-300"><Edit size={18}/></button>
                    <button onClick={() => deleteCampaign(campaign.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18}/></button>
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
