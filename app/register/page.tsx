'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '../../lib/auth-client';
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

      await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: imageUrl,
        role: formData.role,
        credits: 0
      });
      router.push('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
        
        {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Name</label>
            <input type="text" required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input type="email" required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Profile Picture</label>
            <input type="file" accept="image/*" className="w-full bg-gray-950 text-white rounded p-2 border border-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" onChange={handleFileChange} />
            {imagePreview && (
              <div className="mt-3 flex items-center gap-3">
                <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-gray-700" />
                <span className="text-xs text-gray-400">Selected image preview</span>
              </div>
            )}
            {uploadingImage && <p className="text-xs text-blue-400 mt-1">Uploading image...</p>}
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Password</label>
            <input type="password" required className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Role</label>
            <select className="w-full bg-gray-950 text-white rounded p-3 border border-gray-700" onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="supporter">Supporter</option>
              <option value="builder">Builder</option>
            </select>
          </div>
          <button type="submit" disabled={loading || uploadingImage} className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:bg-blue-800 flex items-center justify-center gap-2">
            {(loading || uploadingImage) && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {uploadingImage ? 'Uploading Image...' : loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? <Link href="/login" className="text-blue-400 hover:text-white">Login</Link>
        </p>
      </div>
    </div>
  );
}
