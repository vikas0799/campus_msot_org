import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletter extends Document {
  title: string;
  content: string; // Markdown or HTML
  campus: 'ghaziabad' | 'jaipur' | 'bangalore' | 'all';
  author: mongoose.Types.ObjectId; // User ID
  publishedDate: Date;
  createdAt: Date;
}

const NewsletterSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    campus: {
      type: String,
      required: true,
      enum: ['ghaziabad', 'jaipur', 'bangalore', 'all'],
      default: 'all',
    },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    publishedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
