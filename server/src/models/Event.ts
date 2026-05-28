import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  posterUrl: string;
  campus: 'ghaziabad' | 'jaipur' | 'bangalore' | 'all';
  club?: mongoose.Types.ObjectId | null; // Optional hosting club
  registrationLink: string;
  eventDate: Date;
  expiryDate: Date;
  category: 'hackathon' | 'coding' | 'workshop' | 'cultural' | 'sports' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    posterUrl: { type: String, default: '' },
    campus: {
      type: String,
      required: true,
      enum: ['ghaziabad', 'jaipur', 'bangalore', 'all'],
      default: 'all',
    },
    club: { type: Schema.Types.ObjectId, ref: 'Club', default: null },
    registrationLink: { type: String, required: true },
    eventDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    category: {
      type: String,
      required: true,
      enum: ['hackathon', 'coding', 'workshop', 'cultural', 'sports', 'other'],
      default: 'workshop',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', EventSchema);
