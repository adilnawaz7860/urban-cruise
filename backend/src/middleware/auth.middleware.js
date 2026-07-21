"use strict";

const { verifyAccessToken } = require("../utils/token");
const Admin = require("../models/Admin.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Validates Bearer token in Authorization header.
 * Attaches req.admin on success.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw ApiError.unauthorized("No access token provided");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyAccessToken(token);

  const admin = await Admin.findById(decoded.id).select("+passwordChangedAt");
  if (!admin || !admin.isActive) {
    throw ApiError.unauthorized("Account not found or deactivated");
  }

  if (admin.changedPasswordAfter(decoded.iat)) {
    throw ApiError.unauthorized("Password was changed recently. Please log in again.");
  }

  req.admin = admin;
  next();
});

module.exports = { authenticate };
