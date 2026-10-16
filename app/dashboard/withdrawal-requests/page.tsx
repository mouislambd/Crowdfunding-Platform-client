'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { normalizeRole, homePathFor } from '@/lib/roles';

interface Withdrawal {
  _id: string;
  builderName?: string;
  builder_name?: string;
  amount: number;
  payment_system: string;
  account_number: string;
  createdAt?: string;
}

export default function WithdrawalRequestsPage() {
  const { data: session, isPending } = useSession();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = normalizeRole(session?.user?.role);

  useEffect(() => {
    if (role === 'admin') {
      fetchWithdrawals();
    }
  }, [role]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/withdrawals/pending`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch pending withdrawals');
      const data = await res.json();
      setWithdrawals(Array.isArray(data) ? data : data.withdrawals || []);
    } catch (err) {
      setError('Failed to load pending withdrawals');
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

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/withdrawals/approve/${id}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to approve withdrawal');
      setWithdrawals(withdrawals.filter(w => w._id !== id));
    } catch (err) {
      alert('Failed to process payment success');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading withdrawals...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Pending Withdrawal Requests</h1>
      {withdrawals.length === 0 ? (
        <p className="text-gray-400">No pending withdrawal requests.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-800">
          <table className="w-full text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-800 text-gray-300">
              <tr>
                <th className="p-4">Builder</th>
                <th className="p-4">Amount (Credits)</th>
                <th className="p-4">Payment System</th>
                <th className="p-4">Account Number</th>
                <th className="p-4">Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {withdrawals.map(w => (
                <tr key={w._id}>
                  <td className="p-4 font-medium text-white">{w.builderName || w.builder_name || 'Builder'}</td>
                  <td className="p-4">{w.amount}</td>
                  <td className="p-4">{w.payment_system}</td>
                  <td className="p-4">{w.account_number}</td>
                  <td className="p-4">{w.createdAt ? new Date(w.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleApprove(w._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                    >
                      Payment Success
                    </button>
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
