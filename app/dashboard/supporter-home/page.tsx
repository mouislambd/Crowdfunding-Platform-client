'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '../../../lib/auth-client';
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

  useEffect(() => {
    if (isPending || !session) return;

    const fetchData = async () => {
      try {
        const [myRes, approvedRes] = await Promise.all([
          fetch('http://localhost:5000/api/contributions/my-contributions', { credentials: 'include' }),
          fetch('http://localhost:5000/api/contributions/approved', { credentials: 'include' })
        ]);

        if (!myRes.ok || !approvedRes.ok) throw new Error('Failed to fetch data');

        const myData = await myRes.json();
        // Extract contributions from paginated response
        setContributions(myData.contributions || []);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, isPending]);

  if (isPending || loading) return <div className="p-8 text-white">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const stats = {
    total: contributions.length,
    pending: contributions.filter(c => c.status === 'pending').length,
    amount: contributions
      .filter(c => c.status === 'approved')
      .reduce((sum, c) => sum + c.contribution_amount, 0)
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {session?.user.name}</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400">Total Contributions</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400">Pending</p>
          <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400">Total Amount Contributed</p>
          <p className="text-3xl font-bold text-green-500">${stats.amount.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <h2 className="text-2xl font-bold mb-4">Recent Contributions</h2>
      {contributions.length === 0 ? (
        <div className="bg-gray-900 p-8 rounded-lg text-center border border-gray-800">
          <p className="text-gray-400 mb-4">You haven't supported any campaigns yet.</p>
          <Link href="/campaigns" className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700">Explore Campaigns</Link>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-800 text-gray-400">
              <tr>
                <th className="p-4">Campaign Title</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Creator</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map(c => (
                <tr key={c._id} className="border-t border-gray-800">
                  <td className="p-4">{c.campaign_title}</td>
                  <td className="p-4">${c.contribution_amount.toLocaleString()}</td>
                  <td className="p-4">{c.creator_name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      c.status === 'approved' ? 'bg-green-900 text-green-200' : 
                      c.status === 'pending' ? 'bg-yellow-900 text-yellow-200' : 'bg-red-900 text-red-200'
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
