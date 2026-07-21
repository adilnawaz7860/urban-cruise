"use strict";

const newsletterService = require("../services/newsletter.service");
const { sendCsv } = require("../utils/csvExport");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// PUBLIC
const subscribe = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  const subscriber = await newsletterService.subscribe(email, name);
  ApiResponse.created(res, { email: subscriber.email }, "Subscribed successfully!");
});

const unsubscribe = asyncHandler(async (req, res) => {
  await newsletterService.unsubscribe(req.body.email);
  ApiResponse.ok(res, null, "Unsubscribed successfully");
});

// ADMIN
const getAll = asyncHandler(async (req, res) => {
  const result = await newsletterService.getAll(req.query);
  ApiResponse.paginated(res, result);
});

const exportCsv = asyncHandler(async (req, res) => {
  const { data } = await newsletterService.getAll({ limit: 100000 });
  const rows = data.map((s) => ({
    email: s.email,
    name: s.name || "",
    isActive: s.isActive,
    subscribedAt: new Date(s.createdAt).toLocaleDateString("en-IN"),
  }));
  await sendCsv(res, rows, `newsletter-subscribers-${Date.now()}`);
});

module.exports = { subscribe, unsubscribe, getAll, exportCsv };
