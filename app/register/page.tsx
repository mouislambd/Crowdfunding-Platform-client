'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '../../lib/auth-client';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profilePictureUrl: '',
    role: 'supporter'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

        try {
          await signUp.email({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            image: formData.profilePictureUrl,
            role: formData.role,
            credits: 0
          });
          router.push('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
        
        {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Name</label>
            <input type="text" required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input type="email" required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Profile Picture URL</label>
            <input type="url" className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, profilePictureUrl: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Password</label>
            <input type="password" required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Role</label>
            <select className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="supporter">Supporter</option>
              <option value="builder">Builder</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:bg-blue-800">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? <Link href="/login" className="text-blue-400 hover:text-white">Login</Link>
        </p>
      </div>
    </div>
  );
}
