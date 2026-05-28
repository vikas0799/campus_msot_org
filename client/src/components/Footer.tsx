import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-card-border bg-background py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
              Campus MSOT
            </span>
            <p className="text-xs text-text-muted">
              Centralized platform for students of MSOT campuses to connect, explore careers, compete in coding, and share knowledge.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Campuses</h3>
            <ul className="space-y-2 text-xs text-text-muted">
              <li><Link href="/ghaziabad" className="hover:text-primary transition">Ghaziabad Campus</Link></li>
              <li><Link href="/jaipur" className="hover:text-primary transition">Jaipur Campus</Link></li>
              <li><Link href="/bangalore" className="hover:text-primary transition">Bangalore Campus</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Links</h3>
            <ul className="space-y-2 text-xs text-text-muted">
              <li><Link href="/leaderboard" className="hover:text-primary transition">Coding Leaderboard</Link></li>
              <li><Link href="/opportunities" className="hover:text-primary transition">Placements & Internships</Link></li>
              <li><Link href="/hackathons" className="hover:text-primary transition">Hackathons Directory</Link></li>
              <li><Link href="/blogs" className="hover:text-primary transition">Blogs & Newsletters</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Contact</h3>
            <p className="text-xs text-text-muted">
              For campus ambassador program, contact <span className="text-foreground font-medium">ambassadors@msot.org</span>
            </p>
            <p className="text-xs text-text-muted mt-2">
              Faculty Advisory Council: <span className="text-foreground font-medium">faculty-council@msot.org</span>
            </p>
          </div>
        </div>
        <div className="border-t border-card-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Campus MSOT. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-xs text-text-muted">
            <Link href="/privacy" className="hover:text-primary transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
