'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
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

export default function AdminHomePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<PendingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending) {
      if (!session || (session.user.role || '').toLowerCase() !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session && (session.user.role || '').toLowerCase() === 'admin') {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [statsRes, campaignsRes] = await Promise.all([
            fetch(`${API_URL}/api/users/admin-stats`, { credentials: 'include' }),
            fetch(`${API_URL}/api/campaigns/admin/pending`, { credentials: 'include' })
          ]);
          if (!statsRes.ok || !campaignsRes.ok) throw new Error('Failed to fetch admin data');
          const statsData = await statsRes.json();
          const campaignsData = await campaignsRes.json();
          setStats(statsData);
          setCampaigns(Array.isArray(campaignsData) ? campaignsData : campaignsData.campaigns || []);
        } catch (err) {
          setError('Failed to load admin dashboard');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [session]);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`${API_URL}/api/campaigns/admin/${action}/${id}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`Failed to ${action} campaign`);
      
      setCampaigns(prev => prev.filter(c => c._id !== id));
      setMessage(`Campaign successfully ${action}d.`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      alert(`Action failed.`);
    }
  };

  if (isPending || loading) return <div className="p-8 text-white">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {message && <div className="bg-green-900/50 text-green-200 p-3 rounded mb-6">{message}</div>}

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400">Supporters</p>
          <p className="text-3xl font-bold">{stats?.supporters ?? stats?.users ?? 0}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400">Builders</p>
          <p className="text-3xl font-bold text-blue-400">{stats?.builders ?? 0}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400">Total Credits</p>
          <p className="text-3xl font-bold text-yellow-400">{stats?.totalCredits ?? stats?.credits ?? 0}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400">Total Payments</p>
          <p className="text-3xl font-bold text-green-400">${stats?.totalPayments ?? stats?.revenue ?? 0}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Pending Campaign Approvals</h2>
      {campaigns.length === 0 ? (
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400">No campaigns waiting for approval.</p>
        </div>
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
                  <td className="px-6 py-4">{c.deadline ? new Date(c.deadline).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleAction(c._id, 'approve')} title="Approve" className="text-green-400 hover:text-green-300 p-1"><Check size={20}/></button>
                    <button onClick={() => handleAction(c._id, 'reject')} title="Reject" className="text-red-400 hover:text-red-300 p-1"><X size={20}/></button>
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
