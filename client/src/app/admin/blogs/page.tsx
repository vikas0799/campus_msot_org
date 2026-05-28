'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { BookOpen, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  category: string;
  campus: string;
  isPublished: boolean;
  author: { username: string };
}

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await api.get('/blogs');
      setBlogs(data);
    } catch (err) {
      console.log('Error fetching blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${blogId}`);
      alert('Blog deleted successfully!');
      fetchBlogs();
    } catch (err: any) {
      alert(err.message || 'Delete failed.');
    }
  };

  return (
    <div className="space-y-6 text-sm">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center space-x-2">
          <BookOpen className="text-emerald-500" />
          <span>Manage Blogs & Newsletters</span>
        </h1>
        <p className="text-text-muted text-xs">
          Moderate student technical publications or post official weekly campus-wise updates.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-background border border-card-border rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 bg-card-bg p-4 border-b border-card-border font-bold text-xs text-text-muted">
            <div className="col-span-5">Title</div>
            <div className="col-span-2 text-center">Category</div>
            <div className="col-span-2 text-center">Campus</div>
            <div className="col-span-2 text-center">Author</div>
            <div className="col-span-1 text-right font-normal">Actions</div>
          </div>

          <div className="divide-y divide-card-border">
            {blogs.map((blog) => (
              <div key={blog._id} className="grid grid-cols-12 p-4 items-center hover:bg-card-bg/30 transition">
                <div className="col-span-5 font-semibold text-xs truncate">
                  <Link href={`/blogs/detail/${blog.slug}`} className="hover:text-primary transition">
                    {blog.title}
                  </Link>
                </div>
                <div className="col-span-2 text-center text-xs">
                  {blog.category}
                </div>
                <div className="col-span-2 text-center text-xs capitalize">
                  {blog.campus}
                </div>
                <div className="col-span-2 text-center text-xs text-text-muted">
                  @{blog.author?.username}
                </div>
                <div className="col-span-1 text-right flex justify-end space-x-2">
                  <button onClick={() => handleDelete(blog._id)} className="p-1.5 rounded hover:bg-red-500/10 text-red-500 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            {blogs.length === 0 && (
              <div className="p-8 text-center text-xs text-text-muted">
                No blog posts listed.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
