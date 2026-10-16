'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";
import { normalizeRole, homePathFor } from '@/lib/roles';
import { Check, X } from 'lucide-react';

interface PendingCampaign {
  _id: string;
  campaign_title: string;
  category: string;
  creatorName?: string;
  creator_name?: string;
  funding_goal: number;
  deadline: string;
}

export default function AdminCampaignApprovalsPage() {
  const { data: session, isPending } = useSession();
  const [campaigns, setCampaigns] = useState<PendingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const role = normalizeRole(session?.user?.role);

  useEffect(() => {
    if (role === 'admin') {
      fetchPendingCampaigns();
    }
  }, [role]);

  const fetchPendingCampaigns = async () => {
    try {
      const response = await fetch(`${API_URL}/api/campaigns/admin/pending`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch pending campaigns');
      const data = await response.json();
      setCampaigns(data);
    } catch (err) {
      console.error(err);
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

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`${API_URL}/api/campaigns/admin/${action}/${id}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`Failed to ${action} campaign`);
      
      setCampaigns(campaigns.filter(c => c._id !== id));
      setMessage(`Campaign successfully ${action}d.`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      alert('Action failed.');
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Pending Campaign Approvals</h1>
      {message && <div className="bg-green-900/50 text-green-200 p-3 rounded mb-4">{message}</div>}
      
      {campaigns.length === 0 ? (
        <p className="text-gray-400">No campaigns waiting for approval.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-800">
          <table className="w-full text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-800 text-gray-300">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Creator</th>
                <th className="px-6 py-3">Goal</th>
                <th className="px-6 py-3">Deadline</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {campaigns.map(c => (
                <tr key={c._id}>
                  <td className="px-6 py-4 text-white font-medium">{c.campaign_title}</td>
                  <td className="px-6 py-4">{c.category}</td>
                  <td className="px-6 py-4">{c.creatorName || c.creator_name || 'N/A'}</td>
                  <td className="px-6 py-4">${c.funding_goal}</td>
                  <td className="px-6 py-4">{new Date(c.deadline).toLocaleDateString()}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleAction(c._id, 'approve')} className="text-green-400 hover:text-green-300"><Check size={20}/></button>
                    <button onClick={() => handleAction(c._id, 'reject')} className="text-red-400 hover:text-red-300"><X size={20}/></button>
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
