'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Calendar, Search, Award, ExternalLink, ArrowRight, Hourglass } from 'lucide-react';

interface Hackathon {
  _id: string;
  title: string;
  platform: 'Devfolio' | 'MLH' | 'Unstop' | 'Devpost' | 'Codeforces';
  link: string;
  category: string;
  startDate: string;
  deadlineDate: string;
  prizePool?: string;
  description: string;
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Normally fetch from API
    // Let's create beautiful mock listings representing actual university contests
    setHackathons([
      {
        _id: '1',
        title: 'MSOT HackJaipur 2026',
        platform: 'Devfolio',
        link: 'https://devfolio.co',
        category: 'Blockchain & AI',
        startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        deadlineDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        prizePool: '₹2,50,000',
        description: 'Collaborate with developers to build Web3 and Generative AI solutions. Mentored by industry professionals.'
      },
      {
        _id: '2',
        title: 'Unstop CodeCraft Competition',
        platform: 'Unstop',
        link: 'https://unstop.com',
        category: 'Algorithms',
        startDate: new Date(Date.now() + 86400000 * 8).toISOString(),
        deadlineDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        prizePool: '₹1,00,000',
        description: 'Solve complex engineering puzzles under time constraints. Top performers win direct placement interviews.'
      },
      {
        _id: '3',
        title: 'MLH Local Hack Day 2026',
        platform: 'MLH',
        link: 'https://mlh.io',
        category: 'Open Innovation',
        startDate: new Date(Date.now() + 86400000 * 12).toISOString(),
        deadlineDate: new Date(Date.now() + 86400000 * 10).toISOString(),
        prizePool: 'Gadgets & Swags',
        description: '24-hour hackathon for building applications, learning APIs, and earning badges.'
      },
      {
        _id: '4',
        title: 'Codeforces Round 1024 (Div. 2)',
        platform: 'Codeforces',
        link: 'https://codeforces.com',
        category: 'Competitive Programming',
        startDate: new Date(Date.now() + 86400000 * 1).toISOString(),
        deadlineDate: new Date(Date.now() + 86400000 * 1 + 7200000).toISOString(), // 2 hrs after start
        prizePool: 'Rating Points',
        description: 'Standard Div. 2 round consisting of 6 algorithmic problems.'
      }
    ]);
    setLoading(false);
  }, []);

  const getDeadlineBadge = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff < 0) {
      return <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-bold">Closed</span>;
    }
    const days = Math.ceil(diff / 86400000);
    if (days <= 3) {
      return <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold">Closing in {days}d!</span>;
    }
    return <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">Open</span>;
  };

  const filtered = hackathons.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(search.toLowerCase()) || h.category.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform = platformFilter === '' || h.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-sm">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center space-x-2">
          <Calendar className="text-primary" />
          <span>Hackathons & Coding Contests</span>
        </h1>
        <p className="text-text-muted text-xs">
          Never miss an upcoming contest! Directory of Devfolio, MLH, Unstop, Devpost, and Codeforces events.
        </p>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card-bg border border-card-border p-4 rounded-lg">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted"><Search size={16} /></span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hackathons, themes..."
            className="w-full pl-10 pr-3 py-2 border border-card-border rounded-md bg-background focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['', 'Devfolio', 'MLH', 'Unstop', 'Devpost', 'Codeforces'].map((plat) => (
            <button
              key={plat}
              onClick={() => setPlatformFilter(plat)}
              className={`px-4 py-2 rounded border font-semibold text-xs transition whitespace-nowrap ${
                platformFilter === plat
                  ? 'bg-primary text-white border-primary'
                  : 'bg-background border-card-border hover:bg-card-bg'
              }`}
            >
              {plat === '' ? 'All Platforms' : plat}
            </button>
          ))}
        </div>
      </div>

      {/* Hackathon Cards */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((hack) => (
            <div
              key={hack._id}
              className="p-6 rounded-xl bg-card-bg border border-card-border hover:border-primary/50 transition flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {hack.platform}
                  </span>
                  
                  {getDeadlineBadge(hack.deadlineDate)}
                </div>

                <h3 className="text-lg font-bold">{hack.title}</h3>
                <p className="text-text-muted text-xs font-semibold">{hack.category}</p>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-3">{hack.description}</p>
              </div>

              <div className="pt-4 border-t border-card-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-text-muted">Prize Pool / Reward</p>
                  <p className="text-xs font-bold text-foreground flex items-center space-x-1">
                    <Award size={14} className="text-yellow-500" />
                    <span>{hack.prizePool || 'Swag / Certificate'}</span>
                  </p>
                </div>

                <a
                  href={hack.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded transition flex items-center space-x-1"
                >
                  <span>Register Contest</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-xs text-text-muted rounded-xl bg-card-bg border border-card-border border-dashed">
              No contests found matching criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
