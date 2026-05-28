import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityResource {
  title: string;
  link: string;
  category: string;
}

export interface ICommunity extends Document {
  name: string;
  slug: 'open-source' | 'gsoc' | 'web-dev' | 'ai-ml' | 'cp' | 'cyber-security' | 'startup';
  description: string;
  mentors: Array<{
    name: string;
    role: string;
    avatarUrl?: string;
  }>;
  leads: Array<{
    name: string;
    role: string;
    avatarUrl?: string;
  }>;
  resources: ICommunityResource[];
  events: mongoose.Types.ObjectId[]; // Array of Event IDs
  contributionGuide: string; // Markdown
  createdAt: Date;
}

const CommunitySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: ['open-source', 'gsoc', 'web-dev', 'ai-ml', 'cp', 'cyber-security', 'startup'],
    },
    description: { type: String, required: true },
    mentors: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        avatarUrl: { type: String, default: '' },
      },
    ],
    leads: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        avatarUrl: { type: String, default: '' },
      },
    ],
    resources: [
      {
        title: { type: String, required: true },
        link: { type: String, required: true },
        category: { type: String, default: 'General' },
      },
    ],
    events: [{ type: Schema.Types.ObjectId, ref: 'Event', default: [] }],
    contributionGuide: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<ICommunity>('Community', CommunitySchema);
