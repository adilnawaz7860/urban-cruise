"use strict";

const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
    },
    name: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    confirmedAt: { type: Date },
    unsubscribedAt: { type: Date },
    source: { type: String, default: "website" },
  },
  { timestamps: true }
);

newsletterSchema.index({ isActive: 1 });

module.exports = mongoose.model("Newsletter", newsletterSchema);
