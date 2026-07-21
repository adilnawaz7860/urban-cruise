"use strict";

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 3000 },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    repliedAt: { type: Date },
    adminNotes: { type: String },
    ip: { type: String },
  },
  { timestamps: true }
);

contactSchema.index({ isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Contact", contactSchema);
