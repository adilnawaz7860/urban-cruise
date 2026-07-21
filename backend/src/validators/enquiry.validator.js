"use strict";

const { z } = require("zod");

const createEnquirySchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().trim().optional(),
  destination: z.string().trim().optional(),
  message: z.string().min(10).max(2000).trim(),
  package: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
});

const createContactSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().trim().optional(),
  subject: z.string().max(200).trim().optional(),
  message: z.string().min(10).max(3000).trim(),
});

const enquiryQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.enum(["new", "read", "replied", "closed", "all"]).optional().default("all"),
  search: z.string().trim().optional(),
});

module.exports = { createEnquirySchema, createContactSchema, enquiryQuerySchema };
