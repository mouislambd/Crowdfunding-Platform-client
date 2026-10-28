'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";
import { normalizeRole, homePathFor } from '@/lib/roles';
import Link from 'next/link';

interface Contribution {
  _id: string;
  campaign_title: string;
  contribution_amount: number;
  creator_name: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function SupporterHomePage() {
  const { data: session, isPending } = useSession();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const role = normalizeRole(session?.user?.role);

  useEffect(() => {
    if (role === 'supporter') {
      const fetchData = async () => {
        try {
          const myRes = await fetch(`${API_URL}/api/contributions/my-contributions`, { credentials: 'include' });
          if (!myRes.ok) throw new Error('Failed to fetch data');
          const myData = await myRes.json();
          setContributions(myData.contributions || []);
        } catch (err) {
          setError('Failed to load dashboard data.');
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

  if (role !== 'supporter') {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-4">Only supporters can access this page.</p>
        <Link href={homePathFor(session?.user?.role)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Go to Dashboard Home
        </Link>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const stats = {
    total: contributions.length,
    pending: contributions.filter(c => c.status === 'pending').length,
    amount: contributions
      .filter(c => c.status === 'approved')
      .reduce((sum, c) => sum + c.contribution_amount, 0)
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {session?.user.name}</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <p className="text-gray-400 text-sm">Total Contributions</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <p className="text-gray-400 text-sm">Pending</p>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-500 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl sm:col-span-2 lg:col-span-1">
          <p className="text-gray-400 text-sm">Total Amount Contributed</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-500 mt-1">${stats.amount.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Recent Contributions</h2>
      {contributions.length === 0 ? (
        <div className="bg-gray-900 p-8 rounded-2xl text-center border border-gray-800 shadow-xl">
          <p className="text-gray-400 mb-4">You haven't supported any campaigns yet.</p>
          <Link href="/campaigns" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-2xl font-semibold shadow-lg shadow-blue-600/30 transition-all">Explore Campaigns</Link>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-x-auto shadow-xl w-full">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-800/80 text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-4">Campaign Title</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Creator</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {contributions.map(c => (
                <tr key={c._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white">{c.campaign_title}</td>
                  <td className="p-4">${c.contribution_amount.toLocaleString()}</td>
                  <td className="p-4 text-gray-300">{c.creator_name}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      c.status === 'approved' ? 'bg-green-950/80 border border-green-500/40 text-green-300' : 
                      c.status === 'pending' ? 'bg-yellow-950/80 border border-yellow-500/40 text-yellow-300' : 'bg-red-950/80 border border-red-500/40 text-red-300'
                    }`}>
                      {c.status.toUpperCase()}
                    </span>
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
