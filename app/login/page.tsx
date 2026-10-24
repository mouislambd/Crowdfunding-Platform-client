'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient, signIn } from '../../lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: `${window.location.origin}/dashboard`,
      });
      router.push(`${window.location.origin}/dashboard`);
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
        newUserCallbackURL: `${window.location.origin}/dashboard`,
        errorCallbackURL: `${window.location.origin}/login`,
      });
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-slate-900/80 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/10 relative z-10"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center tracking-tight">Login</h2>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-950/80 border border-red-500/40 text-red-200 p-4 rounded-2xl mb-6 text-sm flex items-center gap-2 shadow-lg"
            >
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleEmailSignIn} className="space-y-5">
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">Email</label>
            <input type="email" required className="w-full bg-gray-950 text-white rounded-2xl p-3.5 border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">Password</label>
            <input type="password" required className="w-full bg-gray-950 text-white rounded-2xl p-3.5 border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3.5 rounded-2xl font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <div className="my-6 text-center text-gray-500 text-sm uppercase tracking-wider font-semibold">OR</div>
        
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleGoogleSignIn} className="w-full bg-white text-gray-900 p-3.5 rounded-2xl font-semibold shadow-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3">
          Continue with Google
        </motion.button>
        
        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account? <Link href="/register" className="text-blue-400 hover:text-white font-medium transition-colors">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
