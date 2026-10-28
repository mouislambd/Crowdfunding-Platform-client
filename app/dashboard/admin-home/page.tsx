'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
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

export default function AdminHomePage() {
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<PendingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const role = normalizeRole(session?.user?.role);

  useEffect(() => {
    if (role === 'admin') {
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

  if (loading) return <div className="p-8 text-white">Loading admin data...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

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
      alert('Action failed.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>

      {message && <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 p-4 rounded-2xl shadow-lg">{message}</div>}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <p className="text-gray-400 text-sm">Supporters</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">{stats?.supporters ?? stats?.users ?? 0}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <p className="text-gray-400 text-sm">Builders</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-400 mt-1">{stats?.builders ?? 0}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <p className="text-gray-400 text-sm">Total Credits</p>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-400 mt-1">{stats?.totalCredits ?? stats?.credits ?? 0}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <p className="text-gray-400 text-sm">Total Payments</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-400 mt-1">${stats?.totalPayments ?? stats?.revenue ?? 0}</p>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold mb-4">Pending Campaign Approvals</h2>
      {campaigns.length === 0 ? (
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <p className="text-gray-400">No campaigns waiting for approval.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-2xl border border-gray-800 shadow-xl w-full">
          <table className="w-full text-left text-gray-400 min-w-[700px]">
            <thead className="text-xs uppercase bg-gray-800/80 text-gray-300">
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
                <tr key={c._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{c.campaign_title}</td>
                  <td className="px-6 py-4">{c.category}</td>
                  <td className="px-6 py-4">{c.creatorName || c.creator_name || 'N/A'}</td>
                  <td className="px-6 py-4">${c.funding_goal}</td>
                  <td className="px-6 py-4">{c.deadline ? new Date(c.deadline).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 flex flex-wrap items-center gap-2">
                    <button onClick={() => handleAction(c._id, 'approve')} title="Approve" className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-xl transition-colors shadow-md"><Check size={18}/></button>
                    <button onClick={() => handleAction(c._id, 'reject')} title="Reject" className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-xl transition-colors shadow-md"><X size={18}/></button>
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
