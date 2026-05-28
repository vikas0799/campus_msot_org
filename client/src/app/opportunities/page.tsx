'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Search, Bookmark, ExternalLink, MapPin } from 'lucide-react';

interface Opportunity {
  _id: string;
  title: string;
  company: string;
  logoUrl?: string;
  description?: string;
  type: 'internship' | 'job' | 'referral' | 'startup' | 'remote';
  link: string;
  skillsRequired: string[];
  salary?: string;
  campus?: string | null;
}

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
    if (user) {
      api.get('/opportunities/bookmarks/all')
        .then((data: any[]) => setBookmarks(data.map(d => d._id)))
        .catch(err => console.log('Error fetching bookmarks'));
    }
  }, [user, search, typeFilter]);

  const fetchOpportunities = async () => {
    try {
      let query = '';
      if (search) query += `search=${search}&`;
      if (typeFilter) query += `type=${typeFilter}`;
      
      const data = await api.get(`/opportunities?${query}`);
      setOpportunities(data);
    } catch (err) {
      // Fallback
      setOpportunities([
        { _id: '1', title: 'Software Development Engineer', company: 'Amazon', type: 'job', link: 'https://amazon.jobs', skillsRequired: ['Java', 'AWS', 'Data Structures'], salary: '₹28 LPA', campus: 'all', description: 'Work on scaling global cloud distribution services.' },
        { _id: '2', title: 'Fullstack Dev Intern', company: 'Postman', type: 'internship', link: 'https://postman.com', skillsRequired: ['Next.js', 'Node.js'], salary: '₹60,000/mo', campus: 'ghaziabad', description: 'Help build and test APIs using next-gen workspaces.' },
        { _id: '3', title: 'Solidity Smart Contract Developer', company: 'Polygon', type: 'remote', link: 'https://polygon.technology', skillsRequired: ['Solidity', 'Ethereum'], salary: '₹14 LPA', campus: null, description: 'Optimize smart contracts and gas fees for scaling protocols.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = async (oppId: string) => {
    if (!user) {
      alert('Please log in to bookmark opportunities');
      return;
    }
    try {
      const res = await api.post(`/opportunities/${oppId}/bookmark`, {});
      if (res.bookmarked) {
        setBookmarks([...bookmarks, oppId]);
      } else {
        setBookmarks(bookmarks.filter(id => id !== oppId));
      }
    } catch (err) {
      alert('Bookmark failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-sm">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center space-x-2">
          <Briefcase className="text-primary" />
          <span>Placements & Opportunities</span>
        </h1>
        <p className="text-text-muted text-xs">
          Explore internships, full-time jobs, referrals, and startup positions across all MSOT campuses.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted"><Search size={16} /></span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, skills, or companies..."
            className="w-full pl-10 pr-3 py-2 border border-card-border rounded-md bg-card-bg focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['', 'job', 'internship', 'remote', 'startup', 'referral'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2 rounded-md font-semibold text-xs transition border whitespace-nowrap capitalize ${
                typeFilter === type
                  ? 'bg-primary text-white border-primary'
                  : 'bg-card-bg border-card-border hover:bg-background'
              }`}
            >
              {type === '' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Job Directory List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp._id}
              className="p-6 rounded-xl bg-card-bg border border-card-border hover:border-primary/50 transition flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {opp.type}
                  </span>
                  
                  <button
                    onClick={() => handleBookmarkToggle(opp._id)}
                    className="text-text-muted hover:text-yellow-500 transition"
                    title={bookmarks.includes(opp._id) ? 'Remove Bookmark' : 'Bookmark Opportunity'}
                  >
                    <Bookmark size={18} fill={bookmarks.includes(opp._id) ? 'currentColor' : 'none'} className={bookmarks.includes(opp._id) ? 'text-yellow-500' : ''} />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold">{opp.title}</h3>
                  <p className="text-text-muted text-xs font-semibold">{opp.company}</p>
                </div>

                <p className="text-xs text-text-muted line-clamp-3">{opp.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {opp.skillsRequired.map((skill, idx) => (
                    <span key={idx} className="text-[10px] bg-background px-2 py-0.5 rounded border border-card-border">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-card-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-text-muted">Estimated Package</p>
                  <p className="text-xs font-bold text-foreground">{opp.salary || 'Competitive'}</p>
                </div>
                
                <a
                  href={opp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-md transition flex items-center space-x-1"
                >
                  <span>Apply</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}

          {opportunities.length === 0 && (
            <div className="col-span-full py-16 text-center text-xs text-text-muted rounded-xl bg-card-bg border border-card-border border-dashed">
              No matching placement opportunities found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
