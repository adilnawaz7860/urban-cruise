"use strict";

const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required: [customerName, email, phone, package, travelDate, travelers]
 *       properties:
 *         bookingId: { type: string }
 *         customerName: { type: string }
 *         email: { type: string }
 *         phone: { type: string }
 *         travelDate: { type: string, format: date }
 *         travelers: { type: integer }
 *         status: { type: string, enum: [pending, confirmed, cancelled, completed] }
 *         totalAmount: { type: number }
 */
const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },
    customerName: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
    },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"],
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    travelDate: { type: Date, required: true },
    travelers: { type: Number, required: true, min: 1, max: 50 },
    notes: { type: String, maxlength: 1000 },

    couponCode: { type: String, uppercase: true },
    originalAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "partially_paid", "paid", "refunded"],
      default: "unpaid",
    },

    // Razorpay integration hooks (ready for future)
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    adminNotes: { type: String, maxlength: 1000 },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    confirmedAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ package: 1 });
bookingSchema.index({ travelDate: 1 });

// ─── Auto-generate bookingId ──────────────────────────────────────────────────
bookingSchema.pre("save", async function (next) {
  if (this.isNew && !this.bookingId) {
    const year = new Date().getFullYear().toString().slice(-2);
    const rand = Math.floor(10000 + Math.random() * 90000);
    this.bookingId = `UC${year}${rand}`;
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
