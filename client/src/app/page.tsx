'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../utils/api';
import { Award, Briefcase, Code, Compass, ArrowRight, Zap, Target, BookOpen, Flame, Users, User, Shield, GraduationCap, MapPin, Mail, Calendar } from 'lucide-react';

interface CardItem {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  type: string;
}

export default function LandingPage() {
  const [heroCard, setHeroCard] = useState<CardItem>({
    _id: 'default-hero',
    title: 'Welcome to Campus MSOT Community',
    description: 'A centralized portal for students across all MSOT campuses to collaborate, compete, write blogs, and discover career opportunities.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
    type: 'hero',
  });
  
  const [campusCards, setCampusCards] = useState<CardItem[]>([
    {
      _id: 'ghaziabad',
      title: 'MSOT Ghaziabad Campus',
      description: 'Flagship coding environment, active technical societies, and strong placement tracks.',
      link: '/ghaziabad',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300&auto=format&fit=crop',
      type: 'campus_select'
    },
    {
      _id: 'jaipur',
      title: 'MSOT Jaipur Campus',
      description: 'Rich coding culture, robust incubation hubs, and dynamic startup bootcamps.',
      link: '/jaipur',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=300&auto=format&fit=crop',
      type: 'campus_select'
    },
    {
      _id: 'bangalore',
      title: 'MSOT Bangalore Campus',
      description: 'Silicon Valley connections, cloud computing centers, and top IT hubs.',
      link: '/bangalore',
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=300&auto=format&fit=crop',
      type: 'campus_select'
    }
  ]);

  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Dynamic Cards
    api.get('/cards')
      .then((data: CardItem[]) => {
        const hero = data.find(c => c.type === 'hero');
        if (hero) setHeroCard(hero);
        
        const campuses = data.filter(c => c.type === 'campus_select');
        if (campuses.length > 0) setCampusCards(campuses);
      })
      .catch(err => console.log('Using default cards fallback.'));

    // Fetch Placements/Opportunities
    api.get('/opportunities?limit=3')
      .then(data => setOpportunities(data.slice(0, 3)))
      .catch(err => {
        setOpportunities([
          { _id: '1', title: 'Software Engineer Intern', company: 'Google', salary: '₹1,00,000/mo', type: 'internship', skillsRequired: ['React', 'Algorithms'] },
          { _id: '2', title: 'Backend Developer', company: 'Microsoft', salary: '₹18 LPA', type: 'job', skillsRequired: ['Node.js', 'MongoDB'] },
          { _id: '3', title: 'Product Manager Intern', company: 'Sprinklr', salary: '₹80,000/mo', type: 'internship', skillsRequired: ['Analytics', 'Scrum'] },
        ]);
      });

    // Fetch Top Coders Leaderboard
    api.get('/leaderboard')
      .then(data => setLeaderboard(data.slice(0, 5)))
      .catch(err => {
        setLeaderboard([
          { _id: '1', user: { username: 'alex_code', profile: { fullName: 'Alex Mercer' } }, totalScore: 3240, leetcodeStats: { solved: 540 } },
          { _id: '2', user: { username: 'shreya_t', profile: { fullName: 'Shreya Tripathy' } }, totalScore: 2950, leetcodeStats: { solved: 490 } },
          { _id: '3', user: { username: 'coder_dev', profile: { fullName: 'Devashish Sen' } }, totalScore: 2880, leetcodeStats: { solved: 480 } },
        ]);
      });
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-radial from-indigo-900/20 via-background to-background py-20 px-6 lg:px-8 border-b border-card-border glow">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-2xl text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Zap size={12} className="animate-pulse" />
              <span>centralized Centralized MSOT Ecosystem</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              One Portal for All <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">MSOT Campuses</span>
            </h1>
            <p className="text-lg text-text-muted">
              {heroCard.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="#campuses"
                className="px-6 py-3 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover shadow-lg transition flex items-center space-x-2"
              >
                <span>Select Your Campus</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/leaderboard"
                className="px-6 py-3 text-sm font-semibold rounded-md border border-card-border hover:bg-card-bg transition flex items-center space-x-2"
              >
                <Code size={16} />
                <span>Coding Leaderboard</span>
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 max-w-md relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-indigo-500/20 rounded-2xl filter blur-xl opacity-30"></div>
            {heroCard.imageUrl && (
              <img
                src={heroCard.imageUrl}
                alt="Central Student Community"
                className="rounded-2xl border border-card-border shadow-2xl w-full object-cover aspect-video relative z-10"
              />
            )}
          </div>
        </div>
      </section>

      {/* Campus Selector Cards */}
      <section id="campuses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Explore Campuses</h2>
          <p className="text-text-muted text-sm max-w-xl">
            Navigate to your specific campus hub to check dynamic club activities, faculty coordinator lists, placements, and achievements.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campusCards.map((campus) => (
            <Link
              key={campus._id}
              href={campus.link || '#'}
              className="group flex flex-col rounded-xl bg-card-bg border border-card-border overflow-hidden hover:border-primary transition glow-hover"
            >
              {campus.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={campus.imageUrl}
                    alt={campus.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
              )}
              <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition">{campus.title}</h3>
                  <p className="text-text-muted text-xs mt-2 line-clamp-3">{campus.description}</p>
                </div>
                <div className="flex items-center text-xs font-semibold text-primary pt-4 mt-auto">
                  <span>Enter Campus Hub</span>
                  <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Community highlights and platform categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-card-border pt-16 text-center space-y-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Our Centralized Ecosystem Highlights</h2>
          <p className="text-text-muted text-sm max-w-lg mx-auto">
            Everything you need to grow technically, showcase achievements, participate in hackathons, and land your dream career.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* Clubs & Communities */}
          <div className="p-6 rounded-xl bg-card-bg border border-card-border space-y-3">
            <div className="p-3 bg-primary/10 rounded-lg text-primary w-fit"><Users size={20} /></div>
            <h3 className="font-bold text-base">Clubs & Communities</h3>
            <p className="text-xs text-text-muted">Explore Ghaziabad, Jaipur, and Bangalore technical societies: Tech, Nexcell, Culture, Sports.</p>
          </div>

          {/* Blogs & Newsletters */}
          <div className="p-6 rounded-xl bg-card-bg border border-card-border space-y-3">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500 w-fit"><BookOpen size={20} /></div>
            <h3 className="font-bold text-base">Blogs & Newsletters</h3>
            <p className="text-xs text-text-muted">Read technical posts, preparation diaries, and weekly campus newsletters.</p>
          </div>

          {/* Upcoming Events */}
          <div className="p-6 rounded-xl bg-card-bg border border-card-border space-y-3">
            <div className="p-3 bg-teal-500/10 rounded-lg text-teal-500 w-fit"><Calendar size={20} /></div>
            <h3 className="font-bold text-base">Upcoming Events</h3>
            <p className="text-xs text-text-muted">Participate in upcoming bootcamps, workshops, cultural festivals, and sports tournaments.</p>
          </div>

          {/* Placements & Achievements */}
          <div className="p-6 rounded-xl bg-card-bg border border-card-border space-y-3">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500 w-fit"><Briefcase size={20} /></div>
            <h3 className="font-bold text-base">Placements & Achievements</h3>
            <p className="text-xs text-text-muted">Explore job listings, internship drives, and outstanding placement achievements.</p>
          </div>

          {/* Students Portfolio */}
          <div className="p-6 rounded-xl bg-card-bg border border-card-border space-y-3">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500 w-fit"><User size={20} /></div>
            <h3 className="font-bold text-base">Students Portfolio</h3>
            <p className="text-xs text-text-muted">Create profiles showing skills, project details, certifications, and linked handles.</p>
          </div>

          {/* Leadership */}
          <div className="p-6 rounded-xl bg-card-bg border border-card-border space-y-3">
            <div className="p-3 bg-red-500/10 rounded-lg text-red-500 w-fit"><Shield size={20} /></div>
            <h3 className="font-bold text-base">Leadership Cell</h3>
            <p className="text-xs text-text-muted">Connect with campus ambassadors, faculty leads, and steering coordinators.</p>
          </div>

          {/* Alumni */}
          <div className="p-6 rounded-xl bg-card-bg border border-card-border space-y-3">
            <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500 w-fit"><GraduationCap size={20} /></div>
            <h3 className="font-bold text-base">Alumni Network</h3>
            <p className="text-xs text-text-muted">Stay connected with graduates for placement referrals and mock session bookings.</p>
          </div>

          {/* Mirai HQ */}
          <div className="p-6 rounded-xl bg-card-bg border border-card-border space-y-3">
            <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500 w-fit"><MapPin size={20} /></div>
            <h3 className="font-bold text-base">Mirai Operation HQ</h3>
            <p className="text-xs text-text-muted">Gurugram, Haryana &mdash; Central platform operational and development center.</p>
          </div>

          {/* Contact US */}
          <div className="p-6 rounded-xl bg-card-bg border border-card-border space-y-3">
            <div className="p-3 bg-pink-500/10 rounded-lg text-pink-500 w-fit"><Mail size={20} /></div>
            <h3 className="font-bold text-base">Contact US</h3>
            <p className="text-xs text-text-muted">Get in touch for inquiries, college collaborations, or technical support portal.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
