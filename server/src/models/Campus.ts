import mongoose, { Schema, Document } from 'mongoose';

export interface ICoordinator {
  name: string;
  role: string;
  email?: string;
  avatarUrl?: string;
}

export interface ICampus extends Document {
  slug: 'ghaziabad' | 'jaipur' | 'bangalore';
  name: string;
  bannerUrl: string;
  logoUrl: string;
  description: string;
  facultyCoordinators: ICoordinator[];
  campusAmbassadors: Array<{
    user: mongoose.Types.ObjectId;
    name: string;
    avatarUrl?: string;
  }>;
  createdAt: Date;
}

const CampusSchema: Schema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: ['ghaziabad', 'jaipur', 'bangalore'],
    },
    name: { type: String, required: true },
    bannerUrl: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    facultyCoordinators: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        email: { type: String, default: '' },
        avatarUrl: { type: String, default: '' },
      },
    ],
    campusAmbassadors: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        avatarUrl: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ICampus>('Campus', CampusSchema);
