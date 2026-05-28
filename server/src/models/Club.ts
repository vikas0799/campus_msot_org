import mongoose, { Schema, Document } from 'mongoose';

export interface IClub extends Document {
  name: string;
  slug: string;
  campus: 'ghaziabad' | 'jaipur' | 'bangalore';
  description: string;
  logoUrl: string;
  category: 'tech' | 'nexcell' | 'culture' | 'sports';
  lead: mongoose.Types.ObjectId; // User ID of Club Admin/Lead
  mentors: Array<{
    name: string;
    role: string;
  }>;
  members: mongoose.Types.ObjectId[]; // Array of User IDs
  createdAt: Date;
  updatedAt: Date;
}

const ClubSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    campus: {
      type: String,
      required: true,
      enum: ['ghaziabad', 'jaipur', 'bangalore'],
    },
    description: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['tech', 'nexcell', 'culture', 'sports'],
      default: 'tech',
    },
    lead: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mentors: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
      },
    ],
    members: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  },
  { timestamps: true }
);

// Ensure club slug is unique per campus
ClubSchema.index({ slug: 1, campus: 1 }, { unique: true });

export default mongoose.model<IClub>('Club', ClubSchema);
