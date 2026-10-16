'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { API_URL } from '@/lib/api';
import { normalizeRole, homePathFor } from '@/lib/roles';

interface Contribution {
  id: string;
  _id?: string;
  campaignTitle?: string;
  contribution_amount?: number;
  creatorName?: string;
  createdAt?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

interface ApiResponse {
  contributions: Contribution[];
  totalPages: number;
  currentPage: number;
}

export default function MyContributionsPage() {
  const { data: session, isPending } = useSession();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const role = normalizeRole(session?.user?.role);

  useEffect(() => {
    if (role === 'supporter') {
      const fetchContributions = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `${API_URL}/api/contributions/my-contributions?page=${currentPage}&limit=10`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch contributions');
          }

          const data: ApiResponse = await response.json();
          setContributions(data.contributions || []);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(data.currentPage || 1);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };

      fetchContributions();
    }
  }, [currentPage, role]);

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
        <p className="text-gray-400 mb-4">Only supporters can access this page.</p>
        <Link href={homePathFor(session?.user?.role)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Go to Dashboard Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 text-slate-300">Loading your contributions...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900 text-yellow-200';
      case 'approved': return 'bg-green-900 text-green-200';
      case 'rejected': return 'bg-red-900 text-red-200';
      default: return 'bg-slate-700 text-slate-200';
    }
  };

  return (
    <div className="p-6 text-slate-100 bg-slate-950 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Contributions</h1>
      {contributions.length === 0 ? (
        <div className="text-slate-300">
          <p className="mb-4">You haven't made any contributions yet.</p>
          <Link href="/campaigns" className="text-blue-400 hover:text-blue-300 underline">
            Browse campaigns
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="p-3">Campaign Title</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Creator</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c) => (
                  <tr key={c._id || c.id} className="border-b border-slate-800">
                    <td className="p-3">{c.campaignTitle ?? 'Untitled Campaign'}</td>
                    <td className="p-3">${(c.contribution_amount ?? 0).toFixed(2)}</td>
                    <td className="p-3">{c.creatorName ?? 'Unknown'}</td>
                    <td className="p-3">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(c.status ?? 'pending')}`}>
                        {(c.status ?? 'pending').charAt(0).toUpperCase() + (c.status ?? 'pending').slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-800 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-800 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
