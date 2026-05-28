'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../utils/api';
import { Award, Briefcase, Calendar, Users, MapPin, ExternalLink, ArrowRight, ShieldCheck, Mail } from 'lucide-react';

interface CampusData {
  slug: string;
  name: string;
  bannerUrl: string;
  logoUrl: string;
  description: string;
  facultyCoordinators: Array<{ name: string; role: string; email?: string }>;
  campusAmbassadors: Array<{ name: string; avatarUrl?: string }>;
}

export default function CampusPage() {
  const params = useParams();
  const campusSlug = params.campus as string;

  const [campus, setCampus] = useState<CampusData | null>(null);
  const [clubs, setClubs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const validCampuses = ['ghaziabad', 'jaipur', 'bangalore'];

  useEffect(() => {
    if (!validCampuses.includes(campusSlug)) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const campusInfo = await api.get(`/campuses/${campusSlug}`);
        setCampus(campusInfo);
      } catch (err) {
        // Fallback campus data
        setCampus({
          slug: campusSlug,
          name: `MSOT ${campusSlug.charAt(0).toUpperCase() + campusSlug.slice(1)} Campus`,
          description: `Welcome to MSOT ${campusSlug.charAt(0).toUpperCase() + campusSlug.slice(1)} Hub. Explore technical clubs, upcoming events, placement stats, and leaderboard rankings.`,
          bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
          logoUrl: '',
          facultyCoordinators: [
            { name: 'Dr. A. K. Gupta', role: 'Campus Director', email: `director.${campusSlug}@msot.org` }
          ],
          campusAmbassadors: []
        });
      }

      try {
        const clubList = await api.get(`/clubs?campus=${campusSlug}`);
        setClubs(clubList);
      } catch (err) {
        setClubs([
          { _id: '1', name: 'Kaizen Tech', slug: 'kaizen-tech', category: 'tech', description: 'Central coding club promoting algorithms, full stack development, open source contributions, and competitive programming.' },
          { _id: '2', name: 'Nexcell', slug: 'nexcell', category: 'nexcell', description: 'Entrepreneurship cell fostering innovation, business model pitches, startups incubation, and industry connections.' },
          { _id: '3', name: 'Khel Society', slug: 'khel-society', category: 'sports', description: 'Sports club organizing inter-college tournaments, track events, athletics, and promoting a healthy student life.' },
          { _id: '4', name: 'Malhar', slug: 'malhar', category: 'culture', description: 'Cultural society bringing music, theater, dance, art, photography, and creative student showcases to life.' },
        ]);
      }

      try {
        const eventList = await api.get(`/events?campus=${campusSlug}`);
        setEvents(eventList);
      } catch (err) {
        setEvents([
          { _id: '1', title: 'MSOT Algothon 2026', category: 'hackathon', eventDate: new Date(Date.now() + 86400000 * 3), registrationLink: 'https://devfolio.co' },
          { _id: '2', title: 'Resume Building Workshop', category: 'workshop', eventDate: new Date(Date.now() + 86400000 * 6), registrationLink: 'https://unstop.com' },
        ]);
      }

      try {
        const oppList = await api.get(`/opportunities?campus=${campusSlug}`);
        setOpportunities(oppList);
      } catch (err) {
        setOpportunities([
          { _id: '1', title: 'Software Engineer', company: 'Google', type: 'job', salary: '₹22 LPA' },
          { _id: '2', title: 'Frontend Intern', company: 'Razorpay', type: 'internship', salary: '₹45,000/mo' },
        ]);
      }

      try {
        const leaderList = await api.get(`/leaderboard?campus=${campusSlug}`);
        setLeaderboard(leaderList.slice(0, 5));
      } catch (err) {
        setLeaderboard([
          { _id: '1', user: { username: 'alex_code', profile: { fullName: 'Alex Mercer' } }, totalScore: 3240 },
          { _id: '2', user: { username: 'shreya_t', profile: { fullName: 'Shreya Tripathy' } }, totalScore: 2950 },
        ]);
      }

      setLoading(false);
    };

    fetchData();
  }, [campusSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!validCampuses.includes(campusSlug) || !campus) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-3xl font-bold">Campus Not Found</h1>
        <p className="text-text-muted">The requested campus path "{campusSlug}" is invalid.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Campus Banner */}
      <section className="relative h-64 md:h-80 w-full overflow-hidden border-b border-card-border shadow-md">
        <img
          src={campus.bannerUrl}
          alt={campus.name}
          className="w-full h-full object-cover filter brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6 md:left-12 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 w-fit">
            <MapPin size={12} />
            <span className="capitalize">{campus.slug} Campus</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">{campus.name}</h1>
          <p className="text-sm text-slate-300 max-w-xl line-clamp-2">{campus.description}</p>
        </div>
      </section>

      {/* Dynamic Sub-routes Dashboard grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Clubs & Events */}
        <div className="lg:col-span-2 space-y-12">
          {/* Clubs Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-card-border pb-3 flex items-center space-x-2">
              <Users size={22} className="text-primary" />
              <span>Clubs & Communities</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clubs.map((club) => (
                <Link
                  key={club._id}
                  href={`/${campusSlug}/clubs/${club.slug}`}
                  className="p-6 rounded-xl bg-card-bg border border-card-border hover:border-primary hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 w-fit block">
                      {club.category}
                    </span>
                    <h3 className="font-bold text-lg">{club.name}</h3>
                    <p className="text-text-muted text-xs line-clamp-2">{club.description}</p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-primary pt-4 mt-auto">
                    <span>View Club Details</span>
                    <ArrowRight size={12} className="ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-card-border pb-3 flex items-center space-x-2">
              <Calendar size={22} className="text-primary" />
              <span>Upcoming Events</span>
            </h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 rounded-lg bg-card-bg border border-card-border hover:border-primary/50 transition gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{event.category}</span>
                    <h3 className="font-bold text-base">{event.title}</h3>
                    <p className="text-text-muted text-xs">Date: {new Date(event.eventDate).toLocaleDateString()}</p>
                  </div>
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-md transition flex items-center justify-center space-x-1.5"
                  >
                    <span>Register</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Col: Leaderboard, Opportunities, Faculty */}
        <div className="space-y-12">
          {/* Top Coders */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold border-b border-card-border pb-3 flex items-center space-x-2">
              <Award size={20} className="text-yellow-500" />
              <span>Top Coders</span>
            </h2>
            <div className="bg-card-bg border border-card-border rounded-lg divide-y divide-card-border">
              {leaderboard.map((item, idx) => (
                <div key={item._id} className="flex items-center justify-between p-3.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-text-muted">#{idx + 1}</span>
                    <span className="text-sm font-semibold">{item.user?.profile?.fullName || item.user?.username}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-primary font-bold">{item.totalScore || 100} pts</span>
                </div>
              ))}
            </div>
            {/* Direct Platform Links */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] font-semibold text-text-muted">
              <Link href={`/${campusSlug}/leaderboard/leetcode`} className="p-2 border border-card-border rounded hover:border-primary hover:text-primary transition">
                LeetCode
              </Link>
              <Link href={`/${campusSlug}/leaderboard/codeforces`} className="p-2 border border-card-border rounded hover:border-primary hover:text-primary transition">
                Codeforces
              </Link>
              <Link href={`/${campusSlug}/leaderboard/codechef`} className="p-2 border border-card-border rounded hover:border-primary hover:text-primary transition">
                CodeChef
              </Link>
            </div>
          </section>

          {/* Placements & Placements Update */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold border-b border-card-border pb-3 flex items-center space-x-2">
              <Briefcase size={20} className="text-primary" />
              <span>Placements & Internships</span>
            </h2>
            <div className="space-y-3">
              {opportunities.map((opp) => (
                <div key={opp._id} className="p-4 rounded bg-card-bg border border-card-border text-xs space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold">{opp.title}</span>
                    <span className="font-semibold text-primary">{opp.salary}</span>
                  </div>
                  <p className="text-text-muted">{opp.company}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Coordinators & Ambassadors */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold border-b border-card-border pb-3 flex items-center space-x-2">
              <ShieldCheck size={20} className="text-primary" />
              <span>Faculty Advisors</span>
            </h2>
            <div className="space-y-3 text-xs">
              {campus.facultyCoordinators.map((fc, idx) => (
                <div key={idx} className="p-4 rounded bg-card-bg border border-card-border space-y-1.5">
                  <h4 className="font-bold text-sm">{fc.name}</h4>
                  <p className="text-text-muted">{fc.role}</p>
                  {fc.email && (
                    <div className="flex items-center space-x-1 text-primary pt-1">
                      <Mail size={12} />
                      <a href={`mailto:${fc.email}`} className="hover:underline">{fc.email}</a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}