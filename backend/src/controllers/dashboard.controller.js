"use strict";

const dashboardService = require("../services/dashboard.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  ApiResponse.ok(res, stats, "Dashboard stats");
});

const getCharts = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();
  const charts = await dashboardService.getMonthlyCharts(year);
  ApiResponse.ok(res, charts, "Dashboard charts");
});

module.exports = { getStats, getCharts };
