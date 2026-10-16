'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { Trash2 } from 'lucide-react';

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  credits?: number;
}

export default function ManageUsersPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending) {
      if (!session || (session.user.role || '').toLowerCase() !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session && (session.user.role || '').toLowerCase() === 'admin') {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/users`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/api/users/role/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      setUsers(users.map(u => ((u._id === userId || u.id === userId) ? { ...u, role: newRole } : u)));
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!userId) return;
    if (!confirm('Are you sure you want to remove this user?')) return;
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(u => u._id !== userId && u.id !== userId));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (isPending || loading) return <div className="p-8 text-white">Loading users...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      {users.length === 0 ? (
        <p className="text-gray-400">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-800">
          <table className="w-full text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-800 text-gray-300">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Credits</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map(u => {
                const uid = u._id || u.id || '';
                return (
                  <tr key={uid}>
                    <td className="p-4 flex items-center gap-3">
                      <img src={u.image || '/avatar-placeholder.jpg'} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className="font-medium text-white">{u.name}</span>
                    </td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(uid, e.target.value)}
                        className="bg-gray-800 border border-gray-700 p-2 rounded text-white capitalize"
                      >
                        <option value="supporter">Supporter</option>
                        <option value="builder">Builder</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4">{u.credits ?? 0}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteUser(uid)}
                        className="text-red-400 hover:text-red-300 p-2"
                        title="Remove User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
