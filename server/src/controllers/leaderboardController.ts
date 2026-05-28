import { Request, Response } from 'express';
import Leaderboard from '../models/Leaderboard';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// Reusable calculation formula
const calculateTotalScore = (stats: {
  github: { contributions: number; stars: number; repos: number };
  leetcode: { rating: number; solved: number };
  codeforces: { rating: number };
  codechef: { rating: number };
  hackerrank: { score: number };
}) => {
  return (
    stats.github.contributions * 3 +
    stats.github.stars * 10 +
    stats.leetcode.solved * 5 +
    (stats.leetcode.rating > 0 ? stats.leetcode.rating * 0.5 : 0) +
    (stats.codeforces.rating > 0 ? stats.codeforces.rating * 1.2 : 0) +
    (stats.codechef.rating > 0 ? stats.codechef.rating * 0.8 : 0) +
    stats.hackerrank.score * 0.1
  );
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { campus, platform } = req.query;
    const filter: any = {};

    if (campus) {
      filter.campus = campus;
    }

    // Default sorting
    let sortKey = 'totalScore';

    // Set sorting base for specific platform routing e.g. /ghaziabad/leaderboard/leetcode
    if (platform === 'github') {
      sortKey = 'githubStats.contributions';
      filter['githubUsername'] = { $ne: '' };
    } else if (platform === 'leetcode') {
      sortKey = 'leetcodeStats.rating';
      filter['leetcodeUsername'] = { $ne: '' };
    } else if (platform === 'codeforces') {
      sortKey = 'codeforcesStats.rating';
      filter['codeforcesUsername'] = { $ne: '' };
    } else if (platform === 'codechef') {
      sortKey = 'codechefStats.rating';
      filter['codechefUsername'] = { $ne: '' };
    } else if (platform === 'hackerrank') {
      sortKey = 'hackerrankStats.score';
      filter['hackerrankUsername'] = { $ne: '' };
    }

    const leaderboard = await Leaderboard.find(filter)
      .sort({ [sortKey]: -1 })
      .populate('user', 'username profile.fullName profile.avatarUrl profile.codingProfiles');

    res.json(leaderboard);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
};

// Generates or updates student statistics
export const syncStudentStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.campus) {
      return res.status(400).json({ message: 'User must belong to a campus to sync leaderboard stats' });
    }

    const handles = user.profile.codingProfiles;

    // Simulate stats fetching with realistic data generators (API simulator with fallback)
    const githubStats = {
      contributions: handles.github ? Math.floor(Math.random() * 300) + 120 : 0,
      stars: handles.github ? Math.floor(Math.random() * 40) + 5 : 0,
      repos: handles.github ? Math.floor(Math.random() * 25) + 5 : 0,
    };

    const leetcodeStats = {
      rating: handles.leetcode ? Math.floor(Math.random() * 1000) + 1400 : 0,
      solved: handles.leetcode ? Math.floor(Math.random() * 400) + 50 : 0,
      globalRanking: handles.leetcode ? Math.floor(Math.random() * 80000) + 5000 : 0,
    };

    const codeforcesStats = {
      rating: handles.codeforces ? Math.floor(Math.random() * 1200) + 1000 : 0,
      rank: handles.codeforces ? 'Specialist' : 'Newbie',
      maxRating: handles.codeforces ? Math.floor(Math.random() * 1200) + 1100 : 0,
    };

    const codechefStats = {
      rating: handles.codechef ? Math.floor(Math.random() * 1000) + 1300 : 0,
      stars: handles.codechef ? Math.floor(Math.random() * 4) + 1 : 1,
      globalRank: handles.codechef ? Math.floor(Math.random() * 40000) + 2000 : 0,
    };

    const hackerrankStats = {
      score: handles.hackerrank ? Math.floor(Math.random() * 1200) + 200 : 0,
      badgesCount: handles.hackerrank ? Math.floor(Math.random() * 6) + 1 : 0,
    };

    // Calculate overall scoring metric
    const totalScore = calculateTotalScore({
      github: githubStats,
      leetcode: leetcodeStats,
      codeforces: codeforcesStats,
      codechef: codechefStats,
      hackerrank: hackerrankStats,
    });

    let leaderboardEntry = await Leaderboard.findOne({ user: userId });

    if (leaderboardEntry) {
      leaderboardEntry.githubUsername = handles.github || '';
      leaderboardEntry.leetcodeUsername = handles.leetcode || '';
      leaderboardEntry.codeforcesUsername = handles.codeforces || '';
      leaderboardEntry.codechefUsername = handles.codechef || '';
      leaderboardEntry.hackerrankUsername = handles.hackerrank || '';
      leaderboardEntry.githubStats = githubStats;
      leaderboardEntry.leetcodeStats = leetcodeStats;
      leaderboardEntry.codeforcesStats = codeforcesStats;
      leaderboardEntry.codechefStats = codechefStats;
      leaderboardEntry.hackerrankStats = hackerrankStats;
      leaderboardEntry.totalScore = totalScore;
      leaderboardEntry.campus = user.campus;
      await leaderboardEntry.save();
    } else {
      leaderboardEntry = new Leaderboard({
        user: userId,
        campus: user.campus,
        githubUsername: handles.github || '',
        leetcodeUsername: handles.leetcode || '',
        codeforcesUsername: handles.codeforces || '',
        codechefUsername: handles.codechef || '',
        hackerrankUsername: handles.hackerrank || '',
        githubStats,
        leetcodeStats,
        codeforcesStats,
        codechefStats,
        hackerrankStats,
        totalScore,
        weeklyRank: 1,
        weeklyChange: 0,
      });
      await leaderboardEntry.save();
    }

    res.json({ message: 'Leaderboard profiles synchronized successfully', leaderboardEntry });
  } catch (error: any) {
    console.error('Leaderboard sync error:', error);
    res.status(500).json({ message: 'Server error syncing leaderboard', error: error.message });
  }
};
