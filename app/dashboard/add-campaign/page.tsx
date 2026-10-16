'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../lib/auth-client';
import { API_URL } from "@/lib/api";
import { uploadImage } from '@/lib/uploadImage';
import { normalizeRole, homePathFor } from '@/lib/roles';

const categories = ['Technology', 'Art', 'Community', 'Health', 'Education', 'Environment'];

export default function AddCampaignPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    campaign_title: '',
    campaign_story: '',
    category: 'Technology',
    funding_goal: '',
    minimum_contribution: '',
    deadline: '',
    reward_info: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const role = normalizeRole(session?.user?.role);

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

  if (role !== 'builder') {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-4">Only builders can add campaigns.</p>
        <Link href={homePathFor(session?.user?.role)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Go to Dashboard Home
        </Link>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (new Date(formData.deadline) <= new Date()) {
      setMessage({ text: 'Deadline must be a future date.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (uploadErr: any) {
          throw new Error(uploadErr.message || 'Failed to upload campaign image.');
        } finally {
          setUploadingImage(false);
        }
      } else {
        throw new Error('Campaign image is required.');
      }

      const response = await fetch(`${API_URL}/api/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          funding_goal: Number(formData.funding_goal),
          minimum_contribution: Number(formData.minimum_contribution),
          campaign_image_url: imageUrl,
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to submit campaign.');

      setMessage({ text: 'Campaign submitted for approval!', type: 'success' });
      setTimeout(() => router.push('/dashboard/my-campaigns'), 1500);
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-xl border border-gray-800 text-white">
      <h1 className="text-2xl font-bold mb-6">Add New Campaign</h1>
      {message && <div className={`p-4 rounded mb-6 ${message.type === 'success' ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>{message.text}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Campaign Title</label>
          <input type="text" required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, campaign_title: e.target.value})} />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Story</label>
          <textarea required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700 h-32" onChange={e => setFormData({...formData, campaign_story: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Category</label>
            <select className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, category: e.target.value})}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Deadline</label>
            <input type="date" required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, deadline: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Funding Goal</label>
            <input type="number" required min="1" className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, funding_goal: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Min. Contribution</label>
            <input type="number" required min="1" className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, minimum_contribution: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Reward Info</label>
          <textarea required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700 h-24" onChange={e => setFormData({...formData, reward_info: e.target.value})} />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Campaign Image</label>
          <input type="file" accept="image/*" required className="w-full bg-gray-950 text-white rounded p-2 border border-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" onChange={handleFileChange} />
          {imagePreview && (
            <div className="mt-3 flex items-center gap-3">
              <img src={imagePreview} alt="Campaign Preview" className="w-24 h-16 rounded object-cover border border-gray-700" />
              <span className="text-xs text-gray-400">Selected campaign image preview</span>
            </div>
          )}
          {uploadingImage && <p className="text-xs text-blue-400 mt-1">Uploading image...</p>}
        </div>
        <button type="submit" disabled={loading || uploadingImage} className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:bg-blue-800 flex items-center justify-center gap-2">
          {(loading || uploadingImage) && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {uploadingImage ? 'Uploading Image...' : loading ? 'Submitting...' : 'Submit Campaign'}
        </button>
      </form>
    </div>
  );
}
