'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, authClient } from '../../lib/auth-client';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    } else if (session) {
      setName(session.user.name || '');
      setImage(session.user.image || '');
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await authClient.updateUser({
        name,
        image,
      });
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setMessage('Failed to update profile: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session) return <div className="min-h-screen bg-gray-950 p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 pt-24">
      <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-xl border border-gray-800">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        <div className="flex items-center gap-6 mb-8">
          <img src={session.user.image || '/avatar-placeholder.jpg'} alt={session.user.name} className="w-20 h-20 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{session.user.name}</h2>
            <span className="bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-300 capitalize">{session.user.role}</span>
            <p className="text-gray-400 mt-1">{session.user.email}</p>
            <p className="text-blue-400 mt-1">{session.user.credits || 0} Credits</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Profile Image URL</label>
            <input
              type="url"
              value={image}
              onChange={e => setImage(e.target.value)}
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}

        <Link href="/dashboard" className="block text-center mt-8 text-gray-400 hover:text-white underline">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
