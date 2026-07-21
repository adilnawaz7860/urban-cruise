"use strict";

const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    destination: { type: String, trim: true },
    message: { type: String, required: true, maxlength: 2000 },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },

    status: {
      type: String,
      enum: ["new", "read", "replied", "closed"],
      default: "new",
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    repliedAt: { type: Date },
    adminNotes: { type: String, maxlength: 1000 },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    source: { type: String, enum: ["website", "whatsapp", "phone", "other"], default: "website" },
  },
  { timestamps: true }
);

enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ isRead: 1 });
enquirySchema.index({ email: 1 });

module.exports = mongoose.model("Enquiry", enquirySchema);
