import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  type: 'hero' | 'campus_select' | 'featured_opp' | 'hackathon' | 'banner' | 'other';
  campus: 'ghaziabad' | 'jaipur' | 'bangalore' | 'all';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    link: { type: String, default: '' },
    type: {
      type: String,
      required: true,
      enum: ['hero', 'campus_select', 'featured_opp', 'hackathon', 'banner', 'other'],
      default: 'other',
    },
    campus: {
      type: String,
      required: true,
      enum: ['ghaziabad', 'jaipur', 'bangalore', 'all'],
      default: 'all',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICard>('Card', CardSchema);
