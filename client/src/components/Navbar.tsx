'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, User as UserIcon, LogOut, Menu, X, ChevronDown, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);
  const pathname = usePathname();

  const campuses = [
    { name: 'Ghaziabad', slug: 'ghaziabad' },
    { name: 'Jaipur', slug: 'jaipur' },
    { name: 'Bangalore', slug: 'bangalore' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-card-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                Campus MSOT
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Campus Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCampusDropdownOpen(!campusDropdownOpen)}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium hover:text-primary transition"
              >
                <span>Campuses</span>
                <ChevronDown size={14} className={`transform transition ${campusDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {campusDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg glass border border-card-border py-1">
                  {campuses.map((campus) => (
                    <Link
                      key={campus.slug}
                      href={`/${campus.slug}`}
                      onClick={() => setCampusDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-card-bg hover:text-primary transition"
                    >
                      {campus.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/leaderboard" className={`px-3 py-2 text-sm font-medium transition ${isActive('/leaderboard') ? 'text-primary' : 'hover:text-primary'}`}>
              Leaderboard
            </Link>
            <Link href="/hackathons" className={`px-3 py-2 text-sm font-medium transition ${isActive('/hackathons') ? 'text-primary' : 'hover:text-primary'}`}>
              Hackathons
            </Link>
            <Link href="/opportunities" className={`px-3 py-2 text-sm font-medium transition ${isActive('/opportunities') ? 'text-primary' : 'hover:text-primary'}`}>
              Opportunities
            </Link>

            <Link href="/blogs" className={`px-3 py-2 text-sm font-medium transition ${isActive('/blogs') ? 'text-primary' : 'hover:text-primary'}`}>
              Blogs
            </Link>
          </div>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-card-border hover:bg-card-bg transition"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-700" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                {/* Admin dashboard access */}
                {['super_admin', 'campus_admin', 'club_admin'].includes(user.role) && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-600/20 transition"
                  >
                    <Shield size={14} />
                    <span>Admin</span>
                  </Link>
                )}
                
                <Link
                  href={`/profile/${user.username}`}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md border border-card-border hover:bg-card-bg transition"
                >
                  <UserIcon size={16} />
                  <span className="text-sm font-medium">{user.username}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 rounded-md hover:text-red-500 transition"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-sm font-medium rounded-md border border-card-border hover:bg-card-bg transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary-hover transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggler */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-card-border hover:bg-card-bg transition"
            >
              {theme === 'dark' ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-card-bg transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-card-border glass py-2 px-4 space-y-2">
          <div className="font-semibold text-xs text-text-muted px-2 py-1">Campuses</div>
          {campuses.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 text-sm rounded-md hover:bg-card-bg hover:text-primary transition"
            >
              {c.name}
            </Link>
          ))}
          
          <hr className="border-card-border my-2" />

          <Link
            href="/leaderboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-1.5 text-sm rounded-md hover:bg-card-bg transition"
          >
            Leaderboard
          </Link>
          <Link
            href="/hackathons"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-1.5 text-sm rounded-md hover:bg-card-bg transition"
          >
            Hackathons
          </Link>
          <Link
            href="/opportunities"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-1.5 text-sm rounded-md hover:bg-card-bg transition"
          >
            Opportunities
          </Link>

          <Link
            href="/blogs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-1.5 text-sm rounded-md hover:bg-card-bg transition"
          >
            Blogs
          </Link>

          <hr className="border-card-border my-2" />

          {user ? (
            <div className="space-y-2">
              {['super_admin', 'campus_admin', 'club_admin'].includes(user.role) && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-sm text-center font-semibold text-emerald-500 bg-emerald-600/10 rounded-md"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                href={`/profile/${user.username}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-sm text-center border border-card-border rounded-md"
              >
                Profile ({user.username})
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center px-3 py-1.5 text-sm text-red-500 hover:bg-red-500/10 rounded-md transition"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-1">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-center text-sm font-medium border border-card-border rounded-md hover:bg-card-bg transition"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-center text-sm font-medium bg-primary text-white rounded-md hover:bg-primary-hover transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
