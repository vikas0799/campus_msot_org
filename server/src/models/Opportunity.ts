import mongoose, { Schema, Document } from 'mongoose';

export interface IOpportunity extends Document {
  title: string;
  company: string;
  logoUrl: string;
  description: string;
  type: 'internship' | 'job' | 'referral' | 'startup' | 'remote';
  link: string;
  skillsRequired: string[];
  salary?: string;
  deadline?: Date;
  campus?: 'ghaziabad' | 'jaipur' | 'bangalore' | null;
  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    logoUrl: { type: String, default: '' },
    description: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['internship', 'job', 'referral', 'startup', 'remote'],
    },
    link: { type: String, required: true },
    skillsRequired: { type: [String], default: [] },
    salary: { type: String, default: '' },
    deadline: { type: Date },
    campus: {
      type: String,
      enum: ['ghaziabad', 'jaipur', 'bangalore', null],
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
