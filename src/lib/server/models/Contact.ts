import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ContactDoc extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  readAt?: Date;
  repliedAt?: Date;
  adminNotes?: string;
  ip: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<ContactDoc>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    subject: { type: String, trim: true, maxlength: 200, default: "" },
    message: { type: String, required: true, maxlength: 3000 },
    isRead: { type: Boolean, default: false },
    readAt: Date,
    repliedAt: Date,
    adminNotes: String,
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

ContactSchema.index({ isRead: 1, createdAt: -1 });

export const Contact: Model<ContactDoc> =
  mongoose.models.Contact || mongoose.model<ContactDoc>("Contact", ContactSchema);
