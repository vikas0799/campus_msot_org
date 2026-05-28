'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreateBlogPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [campus, setCampus] = useState('all');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await api.post('/blogs', {
        title,
        content,
        campus,
        category,
        isPublished: true
      });
      alert('Blog published successfully!');
      router.push('/blogs');
    } catch (err: any) {
      setError(err.message || 'Failed to publish blog.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold">Authentication Required</h1>
        <p className="text-text-muted text-xs">Please log in to write blogs.</p>
        <Link href="/login" className="inline-block px-4 py-2 bg-primary text-white rounded font-semibold text-xs">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6 text-sm">
      <Link href="/blogs" className="inline-flex items-center space-x-1 text-xs text-text-muted hover:text-primary transition">
        <ArrowLeft size={14} />
        <span>Back to Blogs Directory</span>
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center space-x-2">
          <BookOpen className="text-primary" />
          <span>Write Technical Blog</span>
        </h1>
        <p className="text-text-muted text-xs">Share your experience, projects, or guides with the community.</p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-500/10 text-red-500 text-xs border border-red-500/20 flex items-center space-x-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-card-bg border border-card-border space-y-4 shadow-sm">
        <div className="space-y-1">
          <label className="font-semibold text-xs text-text-muted">Blog Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Master Competitive Programming in 30 Days"
            className="w-full px-3 py-2 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition"
            >
              <option value="General">General</option>
              <option value="Competitive Programming">Competitive Programming</option>
              <option value="Open Source">Open Source</option>
              <option value="Web Development">Web Development</option>
              <option value="AI / ML">AI / ML</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="Startup">Startup</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Target Campus</label>
            <select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition"
            >
              <option value="all">All Campuses</option>
              <option value="ghaziabad">Ghaziabad</option>
              <option value="jaipur">Jaipur</option>
              <option value="bangalore">Bangalore</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-xs text-text-muted">Content (Markdown supported)</label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article body here... Use standard markdown (# headers, * bullet points, etc.)"
            rows={12}
            className="w-full px-3 py-2 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition font-mono text-xs leading-relaxed"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary text-white rounded font-semibold text-xs hover:bg-primary-hover shadow transition disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Blog'}
        </button>
      </form>
    </div>
  );
}
