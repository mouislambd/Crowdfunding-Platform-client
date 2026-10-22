'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { API_URL } from '@/lib/api';
import Reveal from './Reveal';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/public/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to subscribe');

      setStatus('success');
      setMessage('Thank you for subscribing to FundRise updates!');
      setEmail('');

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if confetti fails
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <Reveal>
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-8 md:p-14 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/5 blur-3xl pointer-events-none" />

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Stay in the Loop</h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Get weekly roundups of top funded campaigns, developer insights, and platform updates delivered straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="flex-grow bg-slate-900/90 text-white px-5 py-3.5 rounded-2xl border border-white/10 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all text-sm disabled:opacity-50 shrink-0"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </motion.button>
            </form>

            {status === 'success' && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-emerald-400 text-sm mt-4 font-medium">
                {message}
              </motion.p>
            )}

            {status === 'error' && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-4 font-medium">
                {message}
              </motion.p>
            )}

            <p className="text-xs text-gray-500 mt-6">No spam ever. Unsubscribe at any time with a single click.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
