import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface FaqDoc extends Document {
  question: string;
  questionHi: string;
  answer: string;
  answerHi: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema<FaqDoc>(
  {
    question: { type: String, required: true, trim: true, maxlength: 300 },
    questionHi: { type: String, trim: true, default: "" },
    answer: { type: String, required: true, maxlength: 2000 },
    answerHi: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

FaqSchema.index({ isActive: 1, sortOrder: 1 });

export const Faq: Model<FaqDoc> = mongoose.models.Faq || mongoose.model<FaqDoc>("Faq", FaqSchema);
