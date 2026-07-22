import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface EnquiryDoc extends Document {
  name: string;
  email: string;
  phone: string;
  destination: string;
  message: string;
  package?: Types.ObjectId;
  status: "new" | "read" | "replied" | "closed";
  isRead: boolean;
  readAt?: Date;
  repliedAt?: Date;
  adminNotes?: string;
  assignedTo?: Types.ObjectId;
  source: "website" | "whatsapp" | "phone" | "other";
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<EnquiryDoc>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    destination: { type: String, trim: true, default: "" },
    message: { type: String, required: true, maxlength: 2000 },
    package: { type: Schema.Types.ObjectId, ref: "Package" },
    status: { type: String, enum: ["new", "read", "replied", "closed"], default: "new" },
    isRead: { type: Boolean, default: false },
    readAt: Date,
    repliedAt: Date,
    adminNotes: { type: String, maxlength: 1000 },
    assignedTo: { type: Schema.Types.ObjectId, ref: "Admin" },
    source: { type: String, enum: ["website", "whatsapp", "phone", "other"], default: "website" },
  },
  { timestamps: true }
);

EnquirySchema.index({ status: 1, createdAt: -1 });
EnquirySchema.index({ isRead: 1 });
EnquirySchema.index({ email: 1 });

export const Enquiry: Model<EnquiryDoc> =
  mongoose.models.Enquiry || mongoose.model<EnquiryDoc>("Enquiry", EnquirySchema);
