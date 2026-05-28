'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { KeyRound, Mail, User, Info, ArrowRight, AlertCircle, School } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState('ghaziabad');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const data = await api.post('/auth/register', {
        fullName,
        username,
        email,
        password,
        campus,
        role,
      });
      login(data.token, data.user);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8">
      <div className="w-full max-w-md p-8 rounded-xl bg-card-bg border border-card-border shadow-2xl space-y-6 glow">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
          <p className="text-sm text-text-muted">Register to join the centralized MSOT student community</p>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-red-500/10 text-red-500 text-xs border border-red-500/20 flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted"><User size={16} /></span>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full pl-10 pr-3 py-2 border border-card-border rounded-md bg-background focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">@</span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                placeholder="rahul_sharma"
                className="w-full pl-10 pr-3 py-2 border border-card-border rounded-md bg-background focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted"><Mail size={16} /></span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@msot.org"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted flex items-center space-x-1">
                <School size={12} />
                <span>Select Campus</span>
              </label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full px-3 py-2 border border-card-border rounded-md bg-background focus:outline-none focus:border-primary transition"
              >
                <option value="ghaziabad">Ghaziabad</option>
                <option value="jaipur">Jaipur</option>
                <option value="bangalore">Bangalore</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted flex items-center space-x-1">
                <Info size={12} />
                <span>Demopurpose Role</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-card-border rounded-md bg-background focus:outline-none focus:border-primary border-dashed border-indigo-400 text-primary font-medium"
              >
                <option value="student">Student</option>
                <option value="club_admin">Club Admin</option>
                <option value="campus_admin">Campus Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold transition flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <span>Creating Account...</span> : <><span>Register Account</span><ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="text-center text-xs text-text-muted pt-4 border-t border-card-border">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
