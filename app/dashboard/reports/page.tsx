'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { normalizeRole, homePathFor } from '@/lib/roles';

interface Report {
  _id: string;
  reporterName?: string;
  reporter_name?: string;
  campaignTitle?: string;
  campaign_title?: string;
  campaignId?: string;
  campaign_id?: string;
  reason: string;
  createdAt?: string;
}

export default function ReportsPage() {
  const { data: session, isPending } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = normalizeRole(session?.user?.role);

  useEffect(() => {
    if (role === 'admin') {
      fetchReports();
    }
  }, [role]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/reports`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch reports');
      const data = await res.json();
      setReports(Array.isArray(data) ? data : data.reports || []);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

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

  if (role !== 'admin') {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-4">Only administrators can access this page.</p>
        <Link href={homePathFor(session?.user?.role)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Go to Dashboard Home
        </Link>
      </div>
    );
  }

  const handleSuspend = async (campaignId: string) => {
    if (!campaignId) return;
    try {
      const res = await fetch(`${API_URL}/api/reports/suspend/${campaignId}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to suspend campaign');
      alert('Campaign suspended successfully.');
      fetchReports();
    } catch (err) {
      alert('Failed to suspend campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId: string, reportId: string) => {
    if (!campaignId) return;
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const res = await fetch(`${API_URL}/api/campaigns/admin/${campaignId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const res2 = await fetch(`${API_URL}/api/campaigns/${campaignId}`, { method: 'DELETE', credentials: 'include' });
        if (!res2.ok) throw new Error('Failed to delete campaign');
      }
      setReports(reports.filter(r => r._id !== reportId));
    } catch (err) {
      alert('Failed to delete campaign');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading reports...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Campaign Reports</h1>
      {reports.length === 0 ? (
        <p className="text-gray-400">No campaign reports found.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-800">
          <table className="w-full text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-800 text-gray-300">
              <tr>
                <th className="p-4">Reporter</th>
                <th className="p-4">Campaign Title</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {reports.map(r => {
                const campaignId = r.campaignId || r.campaign_id;
                return (
                  <tr key={r._id}>
                    <td className="p-4 font-medium text-white">{r.reporterName || r.reporter_name || 'Supporter'}</td>
                    <td className="p-4">{r.campaignTitle || r.campaign_title || 'Campaign'}</td>
                    <td className="p-4">{r.reason}</td>
                    <td className="p-4">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4 space-x-2 flex items-center">
                      {campaignId && (
                        <>
                          <button
                            onClick={() => handleSuspend(campaignId)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                          >
                            Suspend
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaignId, r._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                          >
                            Delete Campaign
                          </button>
                        </>
                      )}
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
