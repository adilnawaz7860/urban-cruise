import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface CustomerDoc extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  wishlist: Types.ObjectId[];
  isActive: boolean;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
  toSafeObject(): Record<string, unknown>;
}

const CustomerSchema = new Schema<CustomerDoc>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String, trim: true, default: "" },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Package" }],
    isActive: { type: Boolean, default: true },
    refreshTokens: { type: [String], select: false, default: [] },
  },
  { timestamps: true }
);

CustomerSchema.index({ isActive: 1 });

CustomerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

CustomerSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

CustomerSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

export const Customer: Model<CustomerDoc> =
  mongoose.models.Customer || mongoose.model<CustomerDoc>("Customer", CustomerSchema);
