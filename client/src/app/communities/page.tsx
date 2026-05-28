'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Compass, BookOpen, User, Users, ChevronRight, ExternalLink } from 'lucide-react';

interface Mentor {
  name: string;
  role: string;
}

interface Lead {
  name: string;
  role: string;
}

interface Resource {
  title: string;
  link: string;
  category: string;
}

interface Community {
  _id: string;
  name: string;
  slug: string;
  description: string;
  mentors: Mentor[];
  leads: Lead[];
  resources: Resource[];
  contributionGuide?: string;
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedComm, setSelectedComm] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/communities')
      .then((data: Community[]) => {
        setCommunities(data);
        if (data.length > 0) setSelectedComm(data[0]);
      })
      .catch(err => {
        // Fallback seeded communities
        const fallbacks: Community[] = [
          {
            _id: '1',
            slug: 'open-source',
            name: 'Open Source Community',
            description: 'A thriving community of developers collaborating on global software, contributing to libraries, and organizing code sprints.',
            mentors: [{ name: 'Amit Pathak', role: 'Senior Architect @ RedHat' }],
            leads: [{ name: 'Ishita Sen', role: 'GitHub Campus Expert' }],
            contributionGuide: '### How to get started with Open Source\n1. Find repository on GitHub.\n2. Look for "good first issue" labels.\n3. Fork, clone, make changes, and push a PR!',
            resources: [
              { title: 'GitHub Git Guide', link: 'https://guides.github.com', category: 'Git' },
              { title: 'First Contributions Guide', link: 'https://firstcontributions.github.io', category: 'General' }
            ]
          },
          {
            _id: '2',
            slug: 'cp',
            name: 'Competitive Programming',
            description: 'Sharpen your algorithmic thinking, solve complex puzzles, and top the tables on Codeforces and LeetCode.',
            mentors: [{ name: 'Prof. K. K. Verma', role: 'ACM ICPC Coach' }],
            leads: [{ name: 'Rohit Bansal', role: 'Codeforces Master' }],
            contributionGuide: '### CP Roadmap\n1. Study Data Structures and Algorithms.\n2. Practice on LeetCode / Codeforces.\n3. Take part in Weekly Contests.',
            resources: [
              { title: 'USACO Guide', link: 'https://usaco.guide', category: 'Algorithms' }
            ]
          }
        ];
        setCommunities(fallbacks);
        setSelectedComm(fallbacks[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 min-h-[80vh] text-sm">
      {/* Sidebar - list of communities */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-4">
        <h2 className="text-xl font-bold tracking-tight border-b border-card-border pb-2 flex items-center space-x-1.5">
          <Compass size={18} className="text-primary" />
          <span>Communities</span>
        </h2>
        <div className="space-y-1">
          {communities.map((comm) => (
            <button
              key={comm._id}
              onClick={() => setSelectedComm(comm)}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition flex items-center justify-between ${
                selectedComm?.slug === comm.slug
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'hover:bg-card-bg border border-transparent'
              }`}
            >
              <span>{comm.name}</span>
              <ChevronRight size={14} className={selectedComm?.slug === comm.slug ? 'text-primary' : 'text-text-muted'} />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {selectedComm ? (
        <div className="flex-grow space-y-8 p-6 md:p-8 rounded-xl bg-card-bg border border-card-border shadow-sm">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">{selectedComm.name}</h1>
            <p className="text-text-muted text-sm leading-relaxed">{selectedComm.description}</p>
          </div>

          <hr className="border-card-border" />

          {/* Mentors & Leads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold text-sm flex items-center space-x-1.5 border-b border-card-border pb-2">
                <Users size={16} className="text-primary" />
                <span>Student Leads</span>
              </h3>
              <div className="space-y-2">
                {selectedComm.leads?.map((lead, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="p-1 rounded-full bg-primary/10 text-primary"><User size={12} /></span>
                    <div>
                      <h4 className="font-semibold text-xs">{lead.name}</h4>
                      <p className="text-[10px] text-text-muted">{lead.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm flex items-center space-x-1.5 border-b border-card-border pb-2">
                <User size={16} className="text-yellow-500" />
                <span>Faculty / Industry Mentors</span>
              </h3>
              <div className="space-y-2">
                {selectedComm.mentors?.map((mentor, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="p-1 rounded-full bg-yellow-500/10 text-yellow-500"><User size={12} /></span>
                    <div>
                      <h4 className="font-semibold text-xs">{mentor.name}</h4>
                      <p className="text-[10px] text-text-muted">{mentor.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-card-border" />

          {/* Resources Catalog */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm flex items-center space-x-1.5 border-b border-card-border pb-2">
              <BookOpen size={16} className="text-primary" />
              <span>Resources Directory</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedComm.resources?.map((res, idx) => (
                <a
                  key={idx}
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg bg-background border border-card-border hover:border-primary/50 transition flex items-center justify-between"
                >
                  <div>
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/5 border border-indigo-500/10">
                      {res.category}
                    </span>
                    <h4 className="font-semibold text-xs mt-2">{res.title}</h4>
                  </div>
                  <ExternalLink size={14} className="text-text-muted hover:text-primary transition" />
                </a>
              ))}
            </div>
          </div>

          {/* Contribution Guide */}
          {selectedComm.contributionGuide && (
            <div className="space-y-3 pt-4">
              <h3 className="font-bold text-sm flex items-center space-x-1.5 border-b border-card-border pb-2">
                <Compass size={16} className="text-primary" />
                <span>Contribution Guide</span>
              </h3>
              <div className="p-5 rounded-lg bg-background border border-card-border text-xs leading-relaxed whitespace-pre-line font-mono">
                {selectedComm.contributionGuide}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center p-8 text-text-muted bg-card-bg border border-card-border border-dashed rounded-xl">
          Select a community from the sidebar to view details.
        </div>
      )}
    </div>
  );
}
