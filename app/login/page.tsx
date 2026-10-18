'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
        
        {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input type="email" required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Password</label>
            <input type="password" required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:bg-blue-800">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="my-6 text-center text-gray-500">OR</div>
        
        <button onClick={handleGoogleSignIn} className="w-full bg-white text-gray-900 p-3 rounded font-semibold hover:bg-gray-200">
          Continue with Google
        </button>
        
        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account? <Link href="/register" className="text-blue-400 hover:text-white">Register</Link>
        </p>
      </div>
    </div>
  );
}
