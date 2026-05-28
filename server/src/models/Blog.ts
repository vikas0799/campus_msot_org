import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string; // Markdown content
  author: mongoose.Types.ObjectId; // User ID
  campus: 'ghaziabad' | 'jaipur' | 'bangalore' | 'all';
  category: string;
  coverImageUrl: string;
  isPublished: boolean;
  trendingScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    campus: {
      type: String,
      required: true,
      enum: ['ghaziabad', 'jaipur', 'bangalore', 'all'],
      default: 'all',
    },
    category: { type: String, default: 'General' },
    coverImageUrl: { type: String, default: '' },
    isPublished: { type: Boolean, default: false },
    trendingScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>('Blog', BlogSchema);
