'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { API_URL } from '@/lib/api';

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
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push('/login');
      } else {
        const role = (session.user.role || '').toLowerCase();
        if (role !== 'supporter' && role !== 'builder') {
          router.push('/dashboard');
        }
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (isPending || !session) return;
    const role = (session.user.role || '').toLowerCase();
    if (role !== 'supporter' && role !== 'builder') return;

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
  }, [session, isPending]);

  if (isPending || loading) {
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
