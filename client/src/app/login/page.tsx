'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { KeyRound, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const data = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 rounded-xl bg-card-bg border border-card-border shadow-2xl space-y-6 glow">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-text-muted">Enter credentials to access your Campus MSOT account</p>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-red-500/10 text-red-500 text-xs border border-red-500/20 flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted"><Mail size={16} /></span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@msot.org"
                className="w-full pl-10 pr-3 py-2 border border-card-border rounded-md bg-background focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted"><KeyRound size={16} /></span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full pl-10 pr-3 py-2 border border-card-border rounded-md bg-background focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold transition flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <span>Logging In...</span> : <><span>Log In</span><ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="text-center text-xs text-text-muted pt-4 border-t border-card-border">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
