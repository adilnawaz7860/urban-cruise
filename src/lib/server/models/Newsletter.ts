import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface NewsletterDoc extends Document {
  email: string;
  name: string;
  isActive: boolean;
  confirmedAt?: Date;
  unsubscribedAt?: Date;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema = new Schema<NewsletterDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    name: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
    confirmedAt: Date,
    unsubscribedAt: Date,
    source: { type: String, default: "website" },
  },
  { timestamps: true }
);

NewsletterSchema.index({ isActive: 1 });

export const Newsletter: Model<NewsletterDoc> =
  mongoose.models.Newsletter || mongoose.model<NewsletterDoc>("Newsletter", NewsletterSchema);
