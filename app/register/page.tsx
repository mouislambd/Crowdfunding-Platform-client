'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient, signUp } from '../../lib/auth-client';
import { uploadImage } from '../../lib/uploadImage';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'supporter'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
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
          throw new Error(uploadErr.message || 'Failed to upload profile picture.');
        } finally {
          setUploadingImage(false);
        }
      }

      await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: imageUrl,
        role: formData.role,
        credits: 0,
        callbackURL: `${window.location.origin}/dashboard`,
      });
      router.push(`${window.location.origin}/dashboard`);

    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-900/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center tracking-tight">Create Account</h2>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-950/85 border border-red-500/40 text-red-200 p-4 rounded-2xl mb-6 text-sm shadow-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">Name</label>
            <input type="text" required className="w-full bg-gray-950 text-white rounded-2xl p-3.5 border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">Email</label>
            <input type="email" required className="w-full bg-gray-950 text-white rounded-2xl p-3.5 border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">Profile Picture</label>
            <input type="file" accept="image/*" className="w-full bg-gray-950 text-white rounded-2xl p-2.5 border border-white/10 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition-all cursor-pointer" onChange={handleFileChange} />
            {imagePreview && (
              <div className="mt-3 flex items-center gap-3">
                <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-md" />
                <span className="text-xs text-gray-400">Selected image preview</span>
              </div>
            )}
            {uploadingImage && <p className="text-xs text-blue-400 mt-1">Uploading image...</p>}
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">Password</label>
            <input type="password" required className="w-full bg-gray-950 text-white rounded-2xl p-3.5 border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">Role</label>
            <select className="w-full bg-gray-950 text-white rounded-2xl p-3.5 border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="supporter">Supporter</option>
              <option value="builder">Builder</option>
            </select>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading || uploadingImage} className="w-full bg-blue-600 text-white p-3.5 rounded-2xl font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {(loading || uploadingImage) && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {uploadingImage ? 'Uploading Image...' : loading ? 'Creating...' : 'Register'}
          </motion.button>
        </form>
        
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? <Link href="/login" className="text-blue-400 hover:text-white font-medium transition-colors">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
