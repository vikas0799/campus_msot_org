import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  role: 'super_admin' | 'campus_admin' | 'club_admin' | 'student';
  campus?: 'ghaziabad' | 'jaipur' | 'bangalore' | null;
  profile: {
    fullName: string;
    avatarUrl?: string;
    resumeUrl?: string;
    bio?: string;
    skills: string[];
    projects: Array<{
      title: string;
      description: string;
      link?: string;
      githubLink?: string;
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      date?: string;
      credentialUrl?: string;
    }>;
    codingProfiles: {
      github?: string;
      leetcode?: string;
      codeforces?: string;
      hackerrank?: string;
      codechef?: string;
    };
    socialLinks: {
      linkedin?: string;
      twitter?: string;
      portfolio?: string;
    };
    achievements: string[];
  };
  bookmarks: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['super_admin', 'campus_admin', 'club_admin', 'student'],
      default: 'student',
    },
    campus: {
      type: String,
      enum: ['ghaziabad', 'jaipur', 'bangalore', null],
      default: null,
    },
    profile: {
      fullName: { type: String, required: true },
      avatarUrl: { type: String, default: '' },
      resumeUrl: { type: String, default: '' },
      bio: { type: String, default: '' },
      skills: { type: [String], default: [] },
      projects: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
          link: { type: String, default: '' },
          githubLink: { type: String, default: '' },
        },
      ],
      certifications: [
        {
          name: { type: String, required: true },
          issuer: { type: String, required: true },
          date: { type: String, default: '' },
          credentialUrl: { type: String, default: '' },
        },
      ],
      codingProfiles: {
        github: { type: String, default: '' },
        leetcode: { type: String, default: '' },
        codeforces: { type: String, default: '' },
        hackerrank: { type: String, default: '' },
        codechef: { type: String, default: '' },
      },
      socialLinks: {
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        portfolio: { type: String, default: '' },
      },
      achievements: { type: [String], default: [] },
    },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Opportunity', default: [] }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
