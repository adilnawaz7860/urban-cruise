"use strict";

const { z } = require("zod");

const subscribeSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
  name: z.string().max(80).trim().optional(),
});

module.exports = { subscribeSchema };
