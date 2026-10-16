'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { API_URL } from '@/lib/api';
import { normalizeRole, homePathFor } from '@/lib/roles';

interface WithdrawalRequest {
  _id: string;
  amount: number;
  payment_system: string;
  account_number: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

export default function WithdrawalsPage() {
  const { data: session, isPending } = useSession();
  const [amount, setAmount] = useState<number>(0);
  const [paymentSystem, setPaymentSystem] = useState<string>('Stripe');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [summary, setSummary] = useState<{ credits: number; dollar_equivalent: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const role = normalizeRole(session?.user?.role);
  const credits = summary?.credits ?? session?.user?.credits ?? 0;
  const dollarAmount = (amount / 20).toFixed(2);

  const fetchSummaryAndRequests = async () => {
    try {
      setLoading(true);
      const [sumRes, reqRes] = await Promise.all([
        fetch(`${API_URL}/api/withdrawals/summary`, { credentials: 'include' }),
        fetch(`${API_URL}/api/withdrawals/my-withdrawals`, { credentials: 'include' })
      ]);
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setSummary(sumData);
      }
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(Array.isArray(reqData) ? reqData : []);
      }
    } catch (err) {
      setError('Failed to load withdrawal data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'builder') {
      fetchSummaryAndRequests();
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

  if (role !== 'builder') {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-4">Only builders can access this page.</p>
        <Link href={homePathFor(session?.user?.role)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Go to Dashboard Home
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > credits) {
      alert('Withdrawal amount cannot exceed available credits.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/withdrawals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credits: amount, payment_system: paymentSystem, account_number: accountNumber }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Withdrawal request failed');
      }
      alert('Withdrawal request submitted successfully!');
      setAmount(0);
      setAccountNumber('');
      fetchSummaryAndRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to submit withdrawal');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading withdrawals...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const availableCredits = summary?.credits ?? 0;
  const dollarEquivalent = summary?.dollar_equivalent ?? (availableCredits / 20);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Builder Withdrawals</h1>

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
        <p className="text-lg mb-2">Available Credits: <span className="font-bold text-blue-400">{availableCredits}</span></p>
        <p className="text-lg mb-6">Equivalent Dollar Amount: <span className="font-bold text-green-400">${dollarEquivalent.toFixed(2)}</span> <span className="text-xs text-gray-400">(20 credits = $1)</span></p>

        {availableCredits < 200 ? (
          <div className="p-4 bg-red-900/30 border border-red-800 rounded text-red-300">
            Insufficient credit (Minimum 200 credits required to withdraw).
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-gray-300">Credits to Withdraw</label>
              <input
                type="number"
                max={availableCredits}
                min={200}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-300">Dollar Amount (Auto-calculated)</label>
              <input
                type="text"
                value={`$${dollarAmount}`}
                readOnly
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-400"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-300">Payment System</label>
              <select
                value={paymentSystem}
                onChange={(e) => setPaymentSystem(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option value="Stripe">Stripe</option>
                <option value="Bkash">Bkash</option>
                <option value="Rocket">Rocket</option>
                <option value="Nagad">Nagad</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-300">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number / identifier"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors disabled:bg-gray-600"
            >
              {submitting ? 'Submitting...' : 'Withdraw'}
            </button>
          </form>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Past Withdrawal Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-400">No past withdrawal requests.</p>
      ) : (
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="p-4">Date</th>
                <th className="p-4">Amount (Credits)</th>
                <th className="p-4">Payment System</th>
                <th className="p-4">Account</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} className="border-b border-gray-800">
                  <td className="p-4">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-4">{r.amount}</td>
                  <td className="p-4">{r.payment_system}</td>
                  <td className="p-4">{r.account_number}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      r.status === 'approved' ? 'bg-green-900 text-green-200' :
                      r.status === 'pending' ? 'bg-yellow-900 text-yellow-200' : 'bg-red-900 text-red-200'
                    }`}>
                      {r.status.toUpperCase()}
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
