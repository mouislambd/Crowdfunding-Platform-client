'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { API_URL } from '@/lib/api';

interface WithdrawalRequest {
  _id: string;
  amount: number;
  payment_system: string;
  account_number: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function WithdrawalsPage() {
  const { data: session, isPending } = useSession();
  const [amount, setAmount] = useState<number>(0);
  const [paymentSystem, setPaymentSystem] = useState<string>('Stripe');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const credits = session?.user.credits || 0;
  const dollarAmount = (amount / 20).toFixed(2);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/api/withdrawals/my-withdrawals`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (err) {
      console.error('Failed to fetch withdrawals', err);
    }
  };

  useEffect(() => {
    if (session) fetchRequests();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/withdrawals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credits: amount, payment_system: paymentSystem, account_number: accountNumber }),
      });
      if (!response.ok) throw new Error('Withdrawal request failed');
      alert('Withdrawal request submitted!');
      setAmount(0);
      setAccountNumber('');
      fetchRequests();
    } catch (err) {
      alert('Failed to submit withdrawal');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-6 text-slate-100 bg-slate-950 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Withdrawals</h1>
      <div className="mb-8 bg-slate-900 p-6 rounded-lg border border-slate-800">
        <p className="mb-2">Available Credits: {credits}</p>
        <p className="mb-6">Equivalent Dollar Amount: ${ (credits / 20).toFixed(2) }</p>
        
        {credits < 200 ? (
          <p className="text-red-400">Minimum 200 credits required to withdraw.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Credits to Withdraw</label>
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} max={credits} className="w-full p-2 bg-slate-800 rounded" required />
            </div>
            <div>
              <label className="block mb-1">Dollar Amount (Auto-calculated)</label>
              <input type="text" value={dollarAmount} readOnly className="w-full p-2 bg-slate-800 rounded text-slate-400" />
            </div>
            <div>
              <label className="block mb-1">Payment System</label>
              <select value={paymentSystem} onChange={(e) => setPaymentSystem(e.target.value)} className="w-full p-2 bg-slate-800 rounded">
                <option>Stripe</option>
                <option>Bkash</option>
                <option>Rocket</option>
                <option>Nagad</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Account Number</label>
              <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full p-2 bg-slate-800 rounded" required />
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded font-semibold" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">Past Withdrawal Requests</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="p-3">Date</th>
              <th className="p-3">Amount (Credits)</th>
              <th className="p-3">System</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id} className="border-b border-slate-800">
                <td className="p-3">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{r.amount}</td>
                <td className="p-3">{r.payment_system}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.status === 'approved' ? 'bg-green-900 text-green-200' : r.status === 'pending' ? 'bg-yellow-900 text-yellow-200' : 'bg-red-900 text-red-200'}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
