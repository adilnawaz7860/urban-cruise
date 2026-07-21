"use strict";

const { z } = require("zod");

const createCouponSchema = z.object({
  code: z.string().min(3).max(30).toUpperCase().trim(),
  description: z.string().max(200).trim().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().positive(),
  maxDiscount: z.coerce.number().min(0).optional().default(0),
  minOrderAmount: z.coerce.number().min(0).optional().default(0),
  expiryDate: z.coerce.date().refine((d) => d > new Date(), {
    message: "Expiry date must be in the future",
  }),
  usageLimit: z.coerce.number().int().positive().optional().nullable().default(null),
  applicablePackages: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

const updateCouponSchema = createCouponSchema.partial();

const validateCouponSchema = z.object({
  code: z.string().min(1).toUpperCase().trim(),
  packageId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid package ID"),
  travelers: z.coerce.number().int().positive(),
});

module.exports = { createCouponSchema, updateCouponSchema, validateCouponSchema };
