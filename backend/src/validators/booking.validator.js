"use strict";

const { z } = require("zod");

const createBookingSchema = z.object({
  customerName: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  package: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid package ID"),
  travelDate: z.coerce.date().refine((d) => d > new Date(), {
    message: "Travel date must be in the future",
  }),
  travelers: z.coerce.number().int().min(1).max(50),
  notes: z.string().max(1000).trim().optional(),
  couponCode: z.string().trim().toUpperCase().optional(),
});

const updateBookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
  adminNotes: z.string().max(1000).trim().optional(),
  cancellationReason: z.string().max(500).trim().optional(),
});

const bookingQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.enum(["pending", "confirmed", "cancelled", "completed", "all"]).optional().default("all"),
  search: z.string().trim().optional(),
  sortBy: z.string().optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

module.exports = { createBookingSchema, updateBookingStatusSchema, bookingQuerySchema };
