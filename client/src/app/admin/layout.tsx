'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { Shield, LayoutDashboard, Calendar, BookOpen, Users, Briefcase, UserCheck, CreditCard, ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  const isAdmin = user && ['super_admin', 'campus_admin', 'club_admin'].includes(user.role);

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 text-sm">
        <h1 className="text-3xl font-extrabold tracking-tight text-red-500 flex items-center justify-center space-x-2">
          <Shield size={32} />
          <span>Access Denied</span>
        </h1>
        <p className="text-text-muted">You do not have administrative privileges to access this area.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-primary text-white rounded font-semibold text-xs">
          Return Home
        </Link>
      </div>
    );
  }

  const menuItems = [
    { name: 'Analytics Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Cards & Banners', path: '/admin/cards', icon: CreditCard },
    { name: 'Manage Events', path: '/admin/events', icon: Calendar },
    { name: 'Manage Blogs', path: '/admin/blogs', icon: BookOpen },
    { name: 'Manage Clubs', path: '/admin/clubs', icon: Users },
    { name: 'Manage Placements', path: '/admin/opportunities', icon: Briefcase },
  ];

  // Super-admin only options
  if (user?.role === 'super_admin') {
    menuItems.push({ name: 'Manage Users & Roles', path: '/admin/users', icon: UserCheck });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 min-h-[80vh] text-sm">
      {/* Admin Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-4">
        <div className="flex items-center space-x-2 text-primary border-b border-card-border pb-3">
          <Shield size={22} />
          <h2 className="text-lg font-bold tracking-tight">Central Admin Console</h2>
        </div>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-lg font-semibold transition border ${
                  active
                    ? 'bg-emerald-600/10 text-emerald-500 border-emerald-500/20'
                    : 'hover:bg-card-bg border-transparent'
                }`}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
        
        <hr className="border-card-border" />
        
        <Link href="/" className="flex items-center space-x-1.5 text-xs text-text-muted hover:text-primary transition px-4 py-2">
          <ArrowLeft size={14} />
          <span>Exit Admin Panel</span>
        </Link>
      </div>

      {/* Admin Panel Workspace */}
      <div className="flex-grow p-6 md:p-8 rounded-xl bg-card-bg border border-card-border shadow-sm space-y-8 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
