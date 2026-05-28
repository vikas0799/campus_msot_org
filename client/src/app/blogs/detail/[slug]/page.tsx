'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../utils/api';
import { ArrowLeft, User, Calendar, Flame, Tag } from 'lucide-react';
import Link from 'next/link';

interface BlogDetail {
  title: string;
  category: string;
  campus: string;
  content: string;
  createdAt: string;
  trendingScore: number;
  author: { username: string; profile: { fullName: string; avatarUrl?: string } };
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await api.get(`/blogs/detail/${slug}`);
        setBlog(data);
      } catch (err) {
        // Fallback for demo
        setBlog({
          title: `Mastering Algorithmic Thinking`,
          category: 'Competitive Programming',
          campus: 'ghaziabad',
          content: `This is a sample blog post details written by a student in Ghaziabad campus.\n\n### Introduction\nLearning DSA is essential for competitive programming. Start by picking one language (C++ or Java) and master basic arrays and sorting algorithms.\n\n### Roadmap\n1. Master basic math & recursion.\n2. Deep dive into graphs & dynamic programming.\n3. Solve 500+ problems on Codeforces/LeetCode.`,
          createdAt: new Date().toISOString(),
          trendingScore: 120,
          author: { username: 'alex_code', profile: { fullName: 'Alex Mercer' } }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Blog not found</h1>
        <Link href="/blogs" className="text-primary hover:underline mt-4 inline-block">
          Return to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-sm">
      <Link href="/blogs" className="inline-flex items-center space-x-1.5 text-xs text-text-muted hover:text-primary transition">
        <ArrowLeft size={14} />
        <span>Back to Blogs Directory</span>
      </Link>

      <article className="p-8 rounded-xl bg-card-bg border border-card-border shadow-sm space-y-6">
        {/* Title */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
              {blog.category}
            </span>
            <span className="text-xs text-text-muted capitalize">
              Campus: {blog.campus}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted border-b border-card-border pb-4">
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span className="font-semibold text-foreground">{blog.author?.profile?.fullName || blog.author?.username}</span>
              <span>(@{blog.author?.username})</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1 text-amber-500">
              <Flame size={14} />
              <span>{blog.trendingScore || 0} views</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="text-sm leading-relaxed whitespace-pre-line text-foreground/90 font-sans space-y-4">
          {blog.content}
        </div>
      </article>
    </div>
  );
}
