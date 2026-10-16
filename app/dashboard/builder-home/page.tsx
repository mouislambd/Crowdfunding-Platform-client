'use client';
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../lib/api';

interface Campaign { _id: string; title: string; deadline: string; amount_raised: number; }
interface Contribution { _id: string; supporterName: string; campaignTitle: string; amount: number; }

export default function BuilderHomePage() {
  const [stats, setStats] = useState({ total: 0, active: 0, raised: 0 });
  const [contributions, setContributions] = useState<Contribution[]>([]);

  useEffect(() => {
    // Fetch stats and pending contributions
    fetch(`${API_URL}/api/campaigns/builder/stats`, { credentials: 'include' }).then(res => res.json()).then(setStats);
    fetch(`${API_URL}/api/contributions/creator/pending`, { credentials: 'include' }).then(res => res.json()).then(setContributions);
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    await fetch(`${API_URL}/api/contributions/${action}/${id}`, { method: 'PATCH', credentials: 'include' });
    setContributions(prev => prev.filter(c => c._id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Builder Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg"><h3>Total Campaigns</h3><p className="text-2xl">{stats.total}</p></div>
        <div className="bg-gray-900 p-6 rounded-lg"><h3>Active Campaigns</h3><p className="text-2xl">{stats.active}</p></div>
        <div className="bg-gray-900 p-6 rounded-lg"><h3>Total Raised</h3><p className="text-2xl">${stats.raised.toLocaleString()}</p></div>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Contributions To Review</h2>
        {contributions.map(c => (
          <div key={c._id} className="flex justify-between p-4 border-b border-gray-800">
            <span>{c.supporterName} - {c.campaignTitle} - ${c.amount}</span>
            <div className="space-x-2">
              <button onClick={() => handleAction(c._id, 'approve')} className="bg-green-600 px-3 py-1 rounded">Approve</button>
              <button onClick={() => handleAction(c._id, 'reject')} className="bg-red-600 px-3 py-1 rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
