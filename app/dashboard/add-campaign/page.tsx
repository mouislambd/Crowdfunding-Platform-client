'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../lib/auth-client';

const categories = ['Technology', 'Art', 'Community', 'Health', 'Education', 'Environment'];

export default function AddCampaignPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    campaign_title: '',
    campaign_story: '',
    category: 'Technology',
    funding_goal: '',
    minimum_contribution: '',
    deadline: '',
    reward_info: '',
    campaign_image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if ((session?.user.role || '').toLowerCase().trim() !== 'builder') {
    return <div className="p-8 text-white">Access Denied: Only builders can add campaigns.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (new Date(formData.deadline) <= new Date()) {
      setMessage({ text: 'Deadline must be a future date.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          funding_goal: Number(formData.funding_goal),
          minimum_contribution: Number(formData.minimum_contribution),
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to submit campaign.');

      setMessage({ text: 'Campaign submitted for approval!', type: 'success' });
      setTimeout(() => router.push('/dashboard/my-campaigns'), 1500);
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-xl border border-gray-800">
      <h1 className="text-2xl font-bold text-white mb-6">Add New Campaign</h1>
      {message && <div className={`p-4 rounded mb-6 ${message.type === 'success' ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>{message.text}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Campaign Title</label>
          <input type="text" required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, campaign_title: e.target.value})} />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Story</label>
          <textarea required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700 h-32" onChange={e => setFormData({...formData, campaign_story: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Category</label>
            <select className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, category: e.target.value})}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Deadline</label>
            <input type="date" required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, deadline: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Funding Goal</label>
            <input type="number" required min="1" className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, funding_goal: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Min. Contribution</label>
            <input type="number" required min="1" className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, minimum_contribution: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Reward Info</label>
          <textarea required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700 h-24" onChange={e => setFormData({...formData, reward_info: e.target.value})} />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Image URL</label>
          <input type="url" required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, campaign_image_url: e.target.value})} />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:bg-blue-800">
          {loading ? 'Submitting...' : 'Submit Campaign'}
        </button>
      </form>
    </div>
  );
}
