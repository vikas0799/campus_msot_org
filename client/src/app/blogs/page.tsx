'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Search, Flame, Edit, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  category: string;
  campus: string;
  coverImageUrl?: string;
  trendingScore: number;
  createdAt: string;
  author: { username: string; profile: { fullName: string } };
}

export default function BlogsPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState('');
  const [campusFilter, setCampusFilter] = useState('');
  const [trendingOnly, setTrendingOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, [search, campusFilter, trendingOnly]);

  const fetchBlogs = async () => {
    try {
      let query = '';
      if (search) query += `search=${search}&`;
      if (campusFilter) query += `campus=${campusFilter}&`;
      if (trendingOnly) query += `trending=true`;

      const data = await api.get(`/blogs?${query}`);
      setBlogs(data);
    } catch (err) {
      // Fallback
      setBlogs([
        {
          _id: '1',
          title: 'My Experience Syncing Coding Handles to MSOT Leaderboard',
          slug: 'experience-syncing-handles',
          category: 'Competitive Programming',
          campus: 'ghaziabad',
          trendingScore: 12,
          createdAt: new Date().toISOString(),
          author: { username: 'alex_code', profile: { fullName: 'Alex Mercer' } }
        },
        {
          _id: '2',
          title: 'Mastering Open Source: GSoC 2026 Strategy Guide',
          slug: 'mastering-open-source-gsoc-guide',
          category: 'Open Source',
          campus: 'jaipur',
          trendingScore: 8,
          createdAt: new Date().toISOString(),
          author: { username: 'shreya_t', profile: { fullName: 'Shreya Tripathy' } }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center space-x-2">
            <BookOpen className="text-primary" />
            <span>Blogs & Weekly Newsletters</span>
          </h1>
          <p className="text-text-muted text-xs">
            Discover student accomplishments, internship diaries, guides, and notifications from all campuses.
          </p>
        </div>

        {user && (
          <Link
            href="/blogs/create"
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-primary hover:bg-primary-hover text-white rounded-md transition shadow"
          >
            <Edit size={14} />
            <span>Write a Blog</span>
          </Link>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card-bg border border-card-border p-4 rounded-lg">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted"><Search size={16} /></span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs, keywords..."
            className="w-full pl-10 pr-3 py-2 border border-card-border rounded-md bg-background focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-2">
            <label className="font-semibold text-xs text-text-muted uppercase">Campus</label>
            <select
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
              className="px-3 py-1.5 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition"
            >
              <option value="">All Campuses</option>
              <option value="ghaziabad">Ghaziabad</option>
              <option value="jaipur">Jaipur</option>
              <option value="bangalore">Bangalore</option>
            </select>
          </div>

          <button
            onClick={() => setTrendingOnly(!trendingOnly)}
            className={`px-3 py-1.5 border rounded flex items-center space-x-1 font-semibold text-xs transition ${
              trendingOnly
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                : 'bg-background border-card-border hover:bg-card-bg'
            }`}
          >
            <Flame size={14} />
            <span>Trending</span>
          </button>
        </div>
      </div>

      {/* Blog Cards */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="p-6 rounded-xl bg-card-bg border border-card-border hover:border-primary/50 transition flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {blog.category}
                  </span>
                  <span className="text-xs text-text-muted capitalize">
                    Campus: {blog.campus}
                  </span>
                </div>

                <Link href={`/blogs/detail/${blog.slug}`} className="block group">
                  <h3 className="text-lg font-bold group-hover:text-primary transition line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>

                <div className="flex items-center space-x-2 text-xs text-text-muted">
                  <User size={12} />
                  <span>By {blog.author?.profile?.fullName || blog.author?.username}</span>
                  <span>&bull;</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-card-border flex items-center justify-between">
                <div className="flex items-center space-x-1 text-amber-500 text-xs">
                  <Flame size={14} />
                  <span className="font-semibold">{blog.trendingScore || 0} views</span>
                </div>

                <Link
                  href={`/blogs/detail/${blog.slug}`}
                  className="text-xs text-primary font-semibold flex items-center space-x-1 group"
                >
                  <span>Read Article</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          ))}

          {blogs.length === 0 && (
            <div className="col-span-full py-16 text-center text-xs text-text-muted rounded-xl bg-card-bg border border-card-border border-dashed">
              No articles or blogs found matching filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
