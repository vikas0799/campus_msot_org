'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../utils/api';
import { ArrowLeft, Award, Code, Globe, User } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardItem {
  _id: string;
  user: {
    username: string;
    profile: { fullName: string; avatarUrl?: string };
  };
  githubUsername?: string;
  leetcodeUsername?: string;
  codeforcesUsername?: string;
  codechefUsername?: string;
  githubStats: { contributions: number };
  leetcodeStats: { rating: number; solved: number };
  codeforcesStats: { rating: number; rank: string };
  codechefStats: { rating: number; stars: number };
  totalScore: number;
}

export default function CampusPlatformLeaderboard() {
  const params = useParams();
  const campusSlug = params.campus as string;
  const platform = params.platform as string; // 'leetcode', 'codeforces', 'codechef', 'github'

  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.get(`/leaderboard?campus=${campusSlug}&platform=${platform}`);
        setLeaderboard(data);
      } catch (err) {
        // Mock fallback data for demo
        setLeaderboard([
          {
            _id: '1',
            user: { username: 'alex_code', profile: { fullName: 'Alex Mercer' } },
            leetcodeUsername: 'alex_mercer',
            githubUsername: 'alexm',
            githubStats: { contributions: 340 },
            leetcodeStats: { rating: 1980, solved: 540 },
            codeforcesStats: { rating: 1620, rank: 'Specialist' },
            codechefStats: { rating: 1850, stars: 4 },
            totalScore: 3240,
          },
          {
            _id: '2',
            user: { username: 'shreya_t', profile: { fullName: 'Shreya Tripathy' } },
            leetcodeUsername: 'shreya_tri',
            githubUsername: 'shreyat',
            githubStats: { contributions: 210 },
            leetcodeStats: { rating: 1840, solved: 490 },
            codeforcesStats: { rating: 1540, rank: 'Specialist' },
            codechefStats: { rating: 1720, stars: 3 },
            totalScore: 2950,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [campusSlug, platform]);

  const getPlatformValue = (item: LeaderboardItem) => {
    switch (platform) {
      case 'leetcode':
        return `Rating: ${item.leetcodeStats?.rating || 0} (Solved: ${item.leetcodeStats?.solved || 0})`;
      case 'codeforces':
        return `Rating: ${item.codeforcesStats?.rating || 0} (${item.codeforcesStats?.rank || 'Newbie'})`;
      case 'codechef':
        return `Rating: ${item.codechefStats?.rating || 0} (${item.codechefStats?.stars || 1}★)`;
      case 'github':
        return `Contributions: ${item.githubStats?.contributions || 0}`;
      default:
        return `Score: ${item.totalScore}`;
    }
  };

  const getPlatformUsername = (item: LeaderboardItem) => {
    switch (platform) {
      case 'leetcode': return item.leetcodeUsername;
      case 'codeforces': return item.codeforcesUsername;
      case 'codechef': return item.codechefUsername;
      case 'github': return item.githubUsername;
      default: return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-sm">
      <Link href={`/${campusSlug}`} className="inline-flex items-center space-x-1.5 text-xs text-text-muted hover:text-primary transition">
        <ArrowLeft size={14} />
        <span>Back to Campus Dashboard</span>
      </Link>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-primary">
          <Award size={24} />
          <h1 className="text-3xl font-extrabold tracking-tight capitalize">
            {platform} Leaderboard
          </h1>
        </div>
        <p className="text-text-muted text-xs">
          Rankings for students of <span className="capitalize font-semibold text-foreground">{campusSlug} campus</span> based on their {platform} profiles.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden shadow-md">
          <div className="grid grid-cols-12 bg-background p-4 border-b border-card-border font-bold text-xs text-text-muted">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-4">Student</div>
            <div className="col-span-3 capitalize">{platform} Handle</div>
            <div className="col-span-3">Platform Stats</div>
            <div className="col-span-1 text-right">Total Pts</div>
          </div>

          <div className="divide-y divide-card-border">
            {leaderboard.map((item, idx) => (
              <div key={item._id} className="grid grid-cols-12 p-4 items-center hover:bg-background/50 transition">
                <div className="col-span-1 text-center font-extrabold text-sm text-text-muted">
                  #{idx + 1}
                </div>
                <div className="col-span-4 flex items-center space-x-3">
                  <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                    <User size={14} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs">{item.user?.profile?.fullName || item.user?.username}</h3>
                    <p className="text-[10px] text-text-muted">@{item.user?.username}</p>
                  </div>
                </div>
                <div className="col-span-3 text-xs font-mono text-text-muted">
                  {getPlatformUsername(item) ? `@${getPlatformUsername(item)}` : 'Not Linked'}
                </div>
                <div className="col-span-3 text-xs font-medium">
                  {getPlatformValue(item)}
                </div>
                <div className="col-span-1 text-right text-xs font-bold text-primary">
                  {item.totalScore}
                </div>
              </div>
            ))}
          </div>

          {leaderboard.length === 0 && (
            <div className="p-8 text-center text-xs text-text-muted">
              No students on this campus have linked their {platform} handle yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
