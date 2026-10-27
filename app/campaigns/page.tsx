'use client';

import { API_URL } from '../../lib/api';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Campaign {
  _id: string;
  campaign_title: string;
  campaign_image_url?: string;
  creator_name: string;
  funding_goal: number;
  amount_raised: number;
  deadline: string;
  category: string;
}

function CampaignsContent() {
  const searchParams = useSearchParams();
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'All';

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [categoryFilter, setCategoryFilter] = useState(categoryParam);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['All', 'Technology', 'Art', 'Community', 'Health', 'Education', 'Environment'];
  const itemsPerPage = 9;

  useEffect(() => {
    if (searchParam) setSearchTerm(searchParam);
    if (categoryParam) setCategoryFilter(categoryParam);
    setCurrentPage(1);
  }, [searchParam, categoryParam]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  useEffect(() => {
    fetch(`${API_URL}/api/campaigns/approved`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch campaigns');
        return res.json();
      })
      .then(setCampaigns)
      .catch(() => setError('Failed to load campaigns.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const matchesSearch = c.campaign_title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [campaigns, searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCampaigns.slice(start, start + itemsPerPage);
  }, [filteredCampaigns, currentPage]);

  if (loading) return <div className="p-12 text-center text-white">Loading campaigns...</div>;
  if (error) return <div className="p-12 text-center text-red-500">{error}</div>;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by title..."
          className="bg-gray-900 text-white p-3 rounded-lg border border-gray-700 flex-grow"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className="bg-gray-900 text-white p-3 rounded-lg border border-gray-700"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {filteredCampaigns.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No campaigns found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCampaigns.map(c => {
              const progress = Math.min((c.amount_raised / c.funding_goal) * 100, 100);
              return (
                <Link key={c._id} href={`/campaigns/${c._id}`} className="block bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition">
                  <img
                    src={c.campaign_image_url || '/placeholder-campaign.jpg'}
                    alt={c.campaign_title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.dataset.fallbackApplied || target.src.endsWith('/placeholder-campaign.jpg')) return;
                      target.dataset.fallbackApplied = 'true';
                      target.src = '/placeholder-campaign.jpg';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{c.campaign_title}</h3>
                    <p className="text-sm text-gray-400 mb-3">by {c.creator_name}</p>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>${c.amount_raised.toLocaleString()} raised</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">Ends {new Date(c.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
              >
                Previous
              </button>
              <span className="text-gray-400 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function ExploreCampaignsPage() {
  return (
    <div className="pt-24 pb-12 px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-2">Explore Campaigns</h1>
      <p className="text-gray-400 mb-8">Discover projects that matter.</p>
      <Suspense fallback={<div className="p-12 text-center text-white">Loading filters...</div>}>
        <CampaignsContent />
      </Suspense>
    </div>
  );
}
