'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { API_URL } from '@/lib/api';

const packages = [
  { id: 1, credits: 100, price: 10 },
  { id: 2, credits: 300, price: 25 },
  { id: 3, credits: 800, price: 60 },
  { id: 4, credits: 1500, price: 110 },
];

export default function PurchaseCreditPage() {
  const { data: session, refetch } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<{ credits: number; price: number } | null>(null);

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    setLoading(true);
    setSuccess(null);

    try {
        const response = await fetch(`${API_URL}/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: selectedPackage.price,
          credits: selectedPackage.credits,
          payment_type: 'credit_purchase',
          transaction_id: `DUMMY-${Date.now()}`,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Payment error:', response.status, errorText);
        throw new Error(`Payment failed: ${response.status} ${errorText}`);
      }

      setSuccess(`${selectedPackage.credits} credits added to your account!`);
      setSelectedPackage(null);
      refetch(); // Update session credits
    } catch (err) {
      console.error('Payment process error:', err);
      alert(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-slate-100 bg-slate-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Purchase Credit</h1>
        <p className="text-xs text-slate-500 mt-1">Note: This is a demo payment system</p>
      </div>

      {success && <div className="mb-6 p-4 bg-green-900 text-green-200 rounded">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="p-6 bg-slate-900 border border-slate-800 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-2">{pkg.credits} credits</h2>
            <p className="text-2xl font-semibold mb-6 text-blue-400">${pkg.price}</p>
            <button
              onClick={() => setSelectedPackage(pkg)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded font-semibold"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>

      {selectedPackage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Purchase</h3>
            <p className="mb-6 text-slate-300">
              Confirm purchase of {selectedPackage.credits} credits for ${selectedPackage.price}?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedPackage(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded font-semibold"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
