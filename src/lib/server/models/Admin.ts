import mongoose, { Schema, type Document, type Model } from "mongoose";
import bcrypt from "bcryptjs";

export type AdminRole = "super_admin" | "admin" | "content_manager";

export interface AdminDoc extends Document {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  avatar: { url: string; publicId: string };
  isActive: boolean;
  lastLogin?: Date;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
  changedPasswordAfter(jwtIat: number): boolean;
  toSafeObject(): Record<string, unknown>;
}

const AdminSchema = new Schema<AdminDoc>(
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
    role: {
      type: String,
      enum: ["super_admin", "admin", "content_manager"],
      default: "admin",
    },
    avatar: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    passwordChangedAt: Date,
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    refreshTokens: { type: [String], select: false, default: [] },
  },
  { timestamps: true }
);

AdminSchema.index({ role: 1, isActive: 1 });

AdminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = new Date();
});

AdminSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

AdminSchema.methods.changedPasswordAfter = function (jwtIat: number) {
  if (!this.passwordChangedAt) return false;
  const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
  return jwtIat < changedTimestamp;
};

AdminSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

export const Admin: Model<AdminDoc> =
  mongoose.models.Admin || mongoose.model<AdminDoc>("Admin", AdminSchema);
