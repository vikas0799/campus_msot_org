'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../utils/api';
import { useAuth } from '../../../../context/AuthContext';
import { Shield, Users, HelpCircle, ArrowLeft, Heart, Award } from 'lucide-react';
import Link from 'next/link';

interface ClubDetail {
  _id: string;
  name: string;
  slug: string;
  campus: string;
  description: string;
  logoUrl?: string;
  category: string;
  lead: { username: string; profile: { fullName: string; avatarUrl?: string } };
  mentors: Array<{ name: string; role: string }>;
  members: Array<{ _id: string; username: string; profile: { fullName: string; avatarUrl?: string } }>;
}

export default function ClubDetailPage() {
  const params = useParams();
  const campusSlug = params.campus as string;
  const clubSlug = params.club_slug as string;

  const { user } = useAuth();
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const data = await api.get(`/clubs/detail/${campusSlug}/${clubSlug}`);
        setClub(data);
        if (user && data.members.some((m: any) => m._id === user.id)) {
          setJoined(true);
        }
      } catch (err) {
        // Fallback for demo
        setClub({
          _id: 'demo-club',
          name: `${clubSlug.toUpperCase()} Club`,
          slug: clubSlug,
          campus: campusSlug,
          category: 'tech',
          description: `This is a demo setup for ${clubSlug} club at ${campusSlug} campus. It promotes students growth, technical coding culture, and placement referrals.`,
          lead: { username: 'lead_user', profile: { fullName: 'Siddharth Roy' } },
          mentors: [{ name: 'Dr. Vivek Sharma', role: 'Faculty Coach' }],
          members: []
        });
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [campusSlug, clubSlug, user]);

  const handleJoinToggle = async () => {
    if (!user) {
      alert('Please log in to join clubs');
      return;
    }
    if (!club) return;
    try {
      const res = await api.post(`/clubs/${club._id}/join`, {});
      setJoined(res.joined);
      // Reload club details to refresh members list
      const updated = await api.get(`/clubs/detail/${campusSlug}/${clubSlug}`);
      setClub(updated);
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Club not found</h1>
        <Link href={`/${campusSlug}`} className="text-primary hover:underline mt-4 inline-block">
          Return to Campus
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-sm">
      <Link href={`/${campusSlug}`} className="inline-flex items-center space-x-1.5 text-xs text-text-muted hover:text-primary transition">
        <ArrowLeft size={14} />
        <span>Back to Campus Dashboard</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Club Info */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="p-8 rounded-xl bg-card-bg border border-card-border shadow-md space-y-4 relative overflow-hidden">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 w-fit block">
              {club.category} Cell
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">{club.name}</h1>
            <p className="text-text-muted text-sm leading-relaxed">{club.description}</p>

            <button
              onClick={handleJoinToggle}
              className={`px-6 py-2.5 rounded-md font-semibold text-xs transition flex items-center space-x-1.5 shadow-md ${
                joined ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' : 'bg-primary text-white hover:bg-primary-hover'
              }`}
            >
              <Heart size={14} fill={joined ? 'currentColor' : 'none'} />
              <span>{joined ? 'Leave Club' : 'Join Club'}</span>
            </button>
          </div>

          {/* Members List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b border-card-border pb-2 flex items-center space-x-2">
              <Users size={20} className="text-primary" />
              <span>Club Members ({club.members.length})</span>
            </h2>
            {club.members.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted rounded-xl bg-card-bg border border-card-border border-dashed">
                Be the first to join this club!
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {club.members.map((member) => (
                  <div key={member._id} className="p-4 rounded-lg bg-card-bg border border-card-border flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <Users size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">{member.profile?.fullName || member.username}</h4>
                      <p className="text-text-muted text-[10px]">@{member.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar leads/mentors */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* Mentors */}
          <div className="p-6 rounded-xl bg-card-bg border border-card-border space-y-4">
            <h3 className="font-bold text-sm border-b border-card-border pb-2 flex items-center space-x-1.5">
              <Award size={16} className="text-yellow-500" />
              <span>Faculty Mentors</span>
            </h3>
            {club.mentors.map((mentor, idx) => (
              <div key={idx} className="space-y-0.5">
                <h4 className="font-bold text-xs text-foreground">{mentor.name}</h4>
                <p className="text-text-muted text-[10px]">{mentor.role}</p>
              </div>
            ))}
          </div>

          {/* Lead Admin info */}
          <div className="p-6 rounded-xl bg-card-bg border border-card-border space-y-4">
            <h3 className="font-bold text-sm border-b border-card-border pb-2 flex items-center space-x-1.5">
              <Shield size={16} className="text-primary" />
              <span>Club President / Lead</span>
            </h3>
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-foreground">{club.lead?.profile?.fullName}</h4>
              <p className="text-text-muted text-[10px]">@{club.lead?.username || 'admin'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
