'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/lib/auth-client';
import { API_URL } from '@/lib/api';
import { normalizeRole, homePathFor } from '@/lib/roles';

const packages = [
  { id: 1, credits: 100, price: 10 },
  { id: 2, credits: 300, price: 25 },
  { id: 3, credits: 800, price: 60 },
  { id: 4, credits: 1500, price: 110 },
];

export default function PurchaseCreditPage() {
  const { data: session, isPending, refetch } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const role = normalizeRole(session?.user?.role);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setSuccess('Payment successful! Credits have been added to your account.');
      if (typeof refetch === 'function') {
        refetch();
      }
    }
  }, [refetch]);

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
        <p className="text-gray-400 mb-4">Only supporters can purchase credit.</p>
        <Link href={homePathFor(session?.user?.role)} className="bg-blue-600 px-4 py-2 rounded-2xl hover:bg-blue-500 transition-colors">
          Go to Dashboard Home
        </Link>
      </div>
    );
  }

  const handleStripeCheckout = async (pkg: { credits: number; price: number }) => {
    setLoading(true);
    setSuccess(null);

    try {
      const response = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: pkg.price,
          credits: pkg.credits,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to initialize Stripe checkout');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from payment service');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'Payment initialization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 sm:p-6 text-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Purchase Credit</h1>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-2xl shadow-lg"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg, idx) => (
          <motion.div 
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="p-8 bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-3xl text-center shadow-2xl flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold mb-3">{pkg.credits} credits</h2>
              <p className="text-3xl font-extrabold mb-8 text-blue-400">${pkg.price}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleStripeCheckout(pkg)}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Processing...' : 'Buy with Stripe'}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
