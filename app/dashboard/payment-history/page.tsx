'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { API_URL } from '@/lib/api';
import { normalizeRole, homePathFor } from '@/lib/roles';

interface Payment {
  _id: string;
  createdAt?: string;
  payment_type?: string;
  amount?: number;
  credits?: number;
  status?: 'success' | 'pending' | 'failed';
}

export default function PaymentHistoryPage() {
  const { data: session, isPending } = useSession();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = normalizeRole(session?.user?.role);
  const isAllowed = role === 'supporter' || role === 'builder';

  useEffect(() => {
    if (isAllowed) {
      const fetchPayments = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`${API_URL}/api/payments/my-payments`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'Failed to fetch payment history');
          }

          const data = await response.json();
          setPayments(Array.isArray(data) ? data : data.payments || []);
        } catch (err: any) {
          setError(err.message || 'An error occurred');
        } finally {
          setLoading(false);
        }
      };

      fetchPayments();
    }
  }, [isAllowed]);

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

  if (!isAllowed) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-4">You do not have permission to view payment history.</p>
        <Link href={homePathFor(session?.user?.role)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Go to Dashboard Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 text-slate-300">Loading your payment history...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-900 text-green-200';
      case 'pending': return 'bg-yellow-900 text-yellow-200';
      case 'failed': return 'bg-red-900 text-red-200';
      default: return 'bg-slate-700 text-slate-200';
    }
  };

  return (
    <div className="p-6 text-slate-100 bg-slate-950 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>

      {payments.length === 0 ? (
        <div className="text-slate-300 bg-gray-900 p-6 rounded-lg border border-gray-800">No payment history found.</div>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-gray-400 text-xs uppercase">
                <th className="p-4">Date</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Credits</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="p-4">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-4 capitalize">
                    {p.payment_type?.replace('_', ' ') ?? 'N/A'}
                  </td>
                  <td className="p-4">${(p.amount ?? 0).toFixed(2)}</td>
                  <td className="p-4">{p.credits ?? 0}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(p.status ?? 'pending')}`}>
                      {(p.status ?? 'pending').charAt(0).toUpperCase() + (p.status ?? 'pending').slice(1)}
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
