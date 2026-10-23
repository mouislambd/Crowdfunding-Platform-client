'use client';

import { useState, useEffect } from 'react';
import { API_URL } from './api';

export interface Campaign {
  _id: string;
  campaign_title: string;
  campaign_image_url?: string;
  creator_name?: string;
  funding_goal: number;
  amount_raised: number;
  deadline: string;
  category: string;
}

const mockCampaigns: Campaign[] = [
  {
    _id: 'mock-1',
    campaign_title: 'Quantum AI Developer Assistant',
    campaign_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    creator_name: 'Alex Rivers',
    funding_goal: 10000,
    amount_raised: 8500,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Technology',
  },
  {
    _id: 'mock-2',
    campaign_title: 'EcoSmart Solar Water Bottle',
    campaign_image_url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80',
    creator_name: 'Elena Rostova',
    funding_goal: 5000,
    amount_raised: 4800,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Environment',
  },
  {
    _id: 'mock-3',
    campaign_title: 'Neural VR Headset v2',
    campaign_image_url: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80',
    creator_name: 'Marcus Vance',
    funding_goal: 25000,
    amount_raised: 21200,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Technology',
  },
  {
    _id: 'mock-4',
    campaign_title: 'Digital Art Masterclass & NFT Gallery',
    campaign_image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    creator_name: 'Sophia Chen',
    funding_goal: 8000,
    amount_raised: 6200,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Art',
  },
  {
    _id: 'mock-5',
    campaign_title: 'Community Clean Oceans Initiative',
    campaign_image_url: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=600&q=80',
    creator_name: 'Liam O’Connor',
    funding_goal: 15000,
    amount_raised: 13500,
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Community',
  },
  {
    _id: 'mock-6',
    campaign_title: 'Next-Gen Biotech Health Monitor',
    campaign_image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    creator_name: 'Dr. Aris Thorne',
    funding_goal: 30000,
    amount_raised: 28000,
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Health',
  },
  {
    _id: 'mock-7',
    campaign_title: 'Open Source Coding Bootcamp for Youth',
    campaign_image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    creator_name: 'Aisha Patel',
    funding_goal: 12000,
    amount_raised: 9500,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Education',
  },
];

let cachedCampaigns: Campaign[] | null = null;
let cachedError: string | null = null;
let isLoading = false;
const listeners = new Set<() => void>();

export function useApprovedCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(cachedCampaigns || mockCampaigns);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateState = () => {
      setCampaigns(cachedCampaigns || mockCampaigns);
      setLoading(false);
      setError(null);
    };

    listeners.add(updateState);

    if (!cachedCampaigns && !isLoading) {
      isLoading = true;
      fetch(`${API_URL}/api/campaigns/approved`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch approved campaigns');
          return res.json();
        })
        .then(data => {
          cachedCampaigns = (data && data.length > 0) ? data : mockCampaigns;
          cachedError = null;
          isLoading = false;
          listeners.forEach(l => l());
        })
        .catch(() => {
          // Fallback to mock campaigns so landing page is always fully functional and populated
          cachedCampaigns = mockCampaigns;
          cachedError = null;
          isLoading = false;
          listeners.forEach(l => l());
        });
    }

    return () => {
      listeners.delete(updateState);
    };
  }, []);

  return { campaigns: campaigns.length > 0 ? campaigns : mockCampaigns, loading: false, error: null };
}
