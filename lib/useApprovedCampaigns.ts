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

let cachedCampaigns: Campaign[] | null = null;
let cachedError: string | null = null;
let isLoading = false;
const listeners = new Set<() => void>();

export function useApprovedCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(cachedCampaigns || []);
  const [loading, setLoading] = useState<boolean>(!cachedCampaigns && !cachedError);
  const [error, setError] = useState<string | null>(cachedError);

  useEffect(() => {
    const updateState = () => {
      setCampaigns(cachedCampaigns || []);
      setLoading(!cachedCampaigns && !cachedError);
      setError(cachedError);
    };

    listeners.add(updateState);

    if (!cachedCampaigns && !cachedError && !isLoading) {
      isLoading = true;
      fetch(`${API_URL}/api/campaigns/approved`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch approved campaigns');
          return res.json();
        })
        .then(data => {
          cachedCampaigns = data;
          cachedError = null;
          isLoading = false;
          listeners.forEach(l => l());
        })
        .catch(err => {
          cachedError = err.message || 'Failed to load campaigns';
          isLoading = false;
          listeners.forEach(l => l());
        });
    } else if (cachedCampaigns || cachedError) {
      setLoading(false);
    }

    return () => {
      listeners.delete(updateState);
    };
  }, []);

  return { campaigns, loading, error };
}
