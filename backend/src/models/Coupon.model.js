"use strict";

const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       required: [code, discountType, discountValue, expiryDate]
 *       properties:
 *         code: { type: string }
 *         discountType: { type: string, enum: [percentage, fixed] }
 *         discountValue: { type: number }
 *         expiryDate: { type: string, format: date }
 *         usageLimit: { type: integer }
 *         usedCount: { type: integer }
 *         isActive: { type: boolean }
 */
const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 30,
    },
    description: { type: String, trim: true, maxlength: 200 },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number, default: 0 }, // cap for percentage coupons

    minOrderAmount: { type: Number, default: 0 },

    expiryDate: { type: Date, required: true },

    usageLimit: { type: Number, default: null }, // null = unlimited
    usedCount: { type: Number, default: 0 },

    applicablePackages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Package" }],

    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

couponSchema.index({ isActive: 1, expiryDate: 1 });

// Virtual: is currently valid
couponSchema.virtual("isValid").get(function () {
  const now = new Date();
  const withinLimit = this.usageLimit === null || this.usedCount < this.usageLimit;
  return this.isActive && this.expiryDate > now && withinLimit;
});

module.exports = mongoose.model("Coupon", couponSchema);
