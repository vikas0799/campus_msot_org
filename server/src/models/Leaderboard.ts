import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboard extends Document {
  user: mongoose.Types.ObjectId;
  campus: 'ghaziabad' | 'jaipur' | 'bangalore';
  githubUsername?: string;
  leetcodeUsername?: string;
  codeforcesUsername?: string;
  codechefUsername?: string;
  hackerrankUsername?: string;
  githubStats: {
    contributions: number;
    stars: number;
    repos: number;
  };
  leetcodeStats: {
    rating: number;
    solved: number;
    globalRanking: number;
  };
  codeforcesStats: {
    rating: number;
    rank: string;
    maxRating: number;
  };
  codechefStats: {
    rating: number;
    stars: number;
    globalRank: number;
  };
  hackerrankStats: {
    score: number;
    badgesCount: number;
  };
  totalScore: number;
  weeklyRank: number;
  weeklyChange: number; // e.g. +3, -2, 0
  updatedAt: Date;
}

const LeaderboardSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    campus: {
      type: String,
      required: true,
      enum: ['ghaziabad', 'jaipur', 'bangalore'],
    },
    githubUsername: { type: String, default: '' },
    leetcodeUsername: { type: String, default: '' },
    codeforcesUsername: { type: String, default: '' },
    codechefUsername: { type: String, default: '' },
    hackerrankUsername: { type: String, default: '' },
    githubStats: {
      contributions: { type: Number, default: 0 },
      stars: { type: Number, default: 0 },
      repos: { type: Number, default: 0 },
    },
    leetcodeStats: {
      rating: { type: Number, default: 0 },
      solved: { type: Number, default: 0 },
      globalRanking: { type: Number, default: 0 },
    },
    codeforcesStats: {
      rating: { type: Number, default: 0 },
      rank: { type: String, default: 'Newbie' },
      maxRating: { type: Number, default: 0 },
    },
    codechefStats: {
      rating: { type: Number, default: 0 },
      stars: { type: Number, default: 1 },
      globalRank: { type: Number, default: 0 },
    },
    hackerrankStats: {
      score: { type: Number, default: 0 },
      badgesCount: { type: Number, default: 0 },
    },
    totalScore: { type: Number, default: 0 },
    weeklyRank: { type: Number, default: 0 },
    weeklyChange: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);
