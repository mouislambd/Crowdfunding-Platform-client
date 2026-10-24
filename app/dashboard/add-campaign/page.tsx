'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../../../lib/auth-client';
import { API_URL } from "@/lib/api";
import { uploadImage } from '@/lib/uploadImage';
import { normalizeRole, homePathFor } from '@/lib/roles';
import { useSpeech } from '@/lib/useSpeech';
import { Mic, MicOff, Sparkles } from 'lucide-react';

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

  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [aiBanner, setAiBanner] = useState(false);
  const [ideaInput, setIdeaInput] = useState('');

  const {
    supported,
    listening,
    transcript,
    interimTranscript,
    error: speechError,
    start,
    stop,
    setTranscript,
  } = useSpeech();

  useEffect(() => {
    if (transcript) {
      setIdeaInput(transcript);
    }
  }, [transcript]);

  const handleGenerateDraft = async (textToUse?: string) => {
    const text = textToUse || ideaInput || transcript;
    if (!text.trim()) {
      setMessage({ text: 'Please speak or type your campaign idea first.', type: 'error' });
      return;
    }

    if (listening) stop();

    setGeneratingDraft(true);
    setMessage(null);
    setAiBanner(false);

    try {
      const res = await fetch(`${API_URL}/api/ai/draft-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: text,
          lang: lang === 'bn' ? 'bn-BD' : 'en-US'
        }),
        credentials: 'include'
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to generate campaign draft.');
      }

      const draft = await res.json();

      setFormData(prev => {
        const updated = { ...prev };
        const keys = ['campaign_title', 'campaign_story', 'category', 'reward_info', 'funding_goal', 'minimum_contribution'] as const;

        let confirmOverwrite = true;
        const hasExisting = keys.some(k => prev[k] && String(prev[k]).trim() !== '');
        if (hasExisting) {
          confirmOverwrite = window.confirm('Some fields are already filled. Do you want AI draft to overwrite un-matched or all fields?');
        }

        keys.forEach(k => {
          if (draft[k] !== undefined && draft[k] !== null && draft[k] !== '') {
            if (!prev[k] || String(prev[k]).trim() === '' || confirmOverwrite) {
              updated[k] = String(draft[k]);
            }
          }
        });
        return updated;
      });

      setAiBanner(true);
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setGeneratingDraft(false);
    }
  };

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
        <Link href={homePathFor(session?.user?.role)} className="bg-blue-600 px-4 py-2 rounded-2xl hover:bg-blue-500 transition-colors">
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
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto bg-gray-900/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-white shadow-2xl"
    >
      <h1 className="text-2xl font-bold mb-6 tracking-tight">Add New Campaign</h1>
      
       <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 rounded-2xl mb-6 shadow-lg ${message.type === 'success' ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200' : 'bg-red-950/80 border border-red-500/40 text-red-200'}`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speak your idea section for builders */}
      <div className="bg-slate-950/70 p-5 rounded-2xl border border-blue-500/30 mb-6 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-base text-white">AI Campaign Builder</h2>
          </div>
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-200 transition-colors border border-white/10"
          >
            {lang === 'en' ? 'বাংলা' : 'English'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Click the mic to speak your idea, or type it below. AI will draft your campaign form for review.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2 mb-3">
          <button
            type="button"
            onClick={() => {
              if (listening) {
                stop();
              } else {
                setTranscript('');
                setIdeaInput('');
                start(lang === 'bn' ? 'bn-BD' : 'en-US');
              }
            }}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
              listening
                ? 'bg-red-600 border-red-500 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-600/30'
            }`}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{listening ? 'Stop Recording' : 'Speak your idea'}</span>
          </button>
          
          <input
            type="text"
            placeholder={lang === 'bn' ? 'আপনার আইডিয়া লিখুন...' : 'Or type your idea here...'}
            value={ideaInput}
            onChange={e => setIdeaInput(e.target.value)}
            className="w-full flex-grow bg-gray-900 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          <button
            type="button"
            onClick={() => handleGenerateDraft()}
            disabled={generatingDraft || (!ideaInput.trim() && !transcript.trim())}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg"
          >
            {generatingDraft ? 'Generating...' : 'Draft with AI'}
          </button>
        </div>

        {(listening || interimTranscript) && (
          <p className="text-xs text-blue-300 italic">
            {listening ? 'Listening: ' : 'Transcript: '} {ideaInput || interimTranscript}
          </p>
        )}
        {speechError && <p className="text-xs text-red-400 mt-1">{speechError}</p>}
      </div>

      {/* Loading Skeleton while generating */}
      {generatingDraft && (
        <div className="bg-slate-950/80 p-6 rounded-2xl border border-blue-500/30 animate-pulse space-y-4 mb-6">
          <div className="h-5 bg-white/10 rounded w-1/3"></div>
          <div className="h-24 bg-white/10 rounded w-full"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-white/10 rounded"></div>
            <div className="h-10 bg-white/10 rounded"></div>
          </div>
        </div>
      )}

      {/* Dismissible Banner */}
      <AnimatePresence>
        {aiBanner && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-950/80 border border-blue-500/40 text-blue-200 p-4 rounded-2xl mb-6 flex items-center justify-between shadow-lg"
          >
            <span className="text-sm font-medium">AI draft — please review and edit before submitting</span>
            <button type="button" onClick={() => setAiBanner(false)} className="text-blue-300 hover:text-white text-xs underline">Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-400 text-sm mb-2 font-medium">Campaign Title</label>
          <input type="text" required value={formData.campaign_title} className="w-full bg-gray-950 text-white rounded-2xl p-3.5 border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" onChange={e => setFormData({...formData, campaign_title: e.target.value})} />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2 font-medium">Story</label>
          <textarea required value={formData.campaign_story} className="w-full bg-gray-950 text-white rounded-2xl p-3.5 border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all h-32" onChange={e => setFormData({...formData, campaign_story: e.target.value})} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">Category</label>
            <select value={formData.category} className="w-full bg-gray-950 text-white rounded-2xl p-3.5 border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" onChange={e => setFormData({...formData, category: e.target.value})}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">Deadline</label>
            <input type="date" required value={formData.deadline} className="w-full bg-gray-950 text-white rounded-2xl p-3.5 border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" onChange={e => setFormData({...formData, deadline: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">Funding Goal</label>
            <input type="number" required min="1" value={formData.funding_goal} className="w-full bg-gray-950 text-white rounded-2xl p-3.5 border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" onChange={e => setFormData({...formData, funding_goal: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">Min. Contribution</label>
            <input type="number" required min="1" value={formData.minimum_contribution} className="w-full bg-gray-950 text-white rounded-2xl p-3.5 border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" onChange={e => setFormData({...formData, minimum_contribution: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2 font-medium">Reward Info</label>
          <textarea required value={formData.reward_info} className="w-full bg-gray-950 text-white rounded-2xl p-3.5 border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all h-24" onChange={e => setFormData({...formData, reward_info: e.target.value})} />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2 font-medium">Campaign Image</label>
          <input type="file" accept="image/*" required className="w-full bg-gray-950 text-white rounded-2xl p-2.5 border border-white/10 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition-all cursor-pointer" onChange={handleFileChange} />
          {imagePreview && (
            <div className="mt-3 flex items-center gap-3">
              <img src={imagePreview} alt="Campaign Preview" className="w-24 h-16 rounded-xl object-cover border border-white/20 shadow-md" />
              <span className="text-xs text-gray-400">Selected campaign image preview</span>
            </div>
          )}
          {uploadingImage && <p className="text-xs text-blue-400 mt-1">Uploading image...</p>}
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading || uploadingImage} className="w-full bg-blue-600 text-white p-3.5 rounded-2xl font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
          {(loading || uploadingImage) && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {uploadingImage ? 'Uploading Image...' : loading ? 'Submitting...' : 'Submit Campaign'}
        </motion.button>
      </form>
    </motion.div>
  );
}
