"use strict";

const crypto = require("crypto");
const adminRepo = require("../repositories/admin.repository");
const { generateTokenPair, verifyRefreshToken } = require("../utils/token");
const ApiError = require("../utils/ApiError");
const { sendPasswordReset } = require("./email.service");
const logger = require("../utils/logger");

async function login(email, password) {
  const admin = await adminRepo.findByEmail(email, true);
  if (!admin || !admin.isActive) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const payload = { id: admin._id, role: admin.role };
  const { accessToken, refreshToken } = generateTokenPair(payload);

  await adminRepo.pushRefreshToken(admin._id, refreshToken);
  await adminRepo.update(admin._id, { lastLogin: new Date() });

  logger.info(`Admin login: ${admin.email}`);
  return { admin: admin.toSafeObject(), accessToken, refreshToken };
}

async function logout(adminId, refreshToken) {
  await adminRepo.removeRefreshToken(adminId, refreshToken);
}

async function refreshTokens(token) {
  const decoded = verifyRefreshToken(token);

  const admin = await adminRepo.findById(decoded.id, true);
  if (!admin || !admin.isActive) throw ApiError.unauthorized("Account not found");

  if (!admin.refreshTokens.includes(token)) {
    // Token reuse attack — clear all tokens
    await adminRepo.clearRefreshTokens(admin._id);
    throw ApiError.unauthorized("Token reuse detected. Please log in again.");
  }

  // Rotate token
  await adminRepo.removeRefreshToken(admin._id, token);
  const payload = { id: admin._id, role: admin.role };
  const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(payload);
  await adminRepo.pushRefreshToken(admin._id, newRefreshToken);

  return { accessToken, refreshToken: newRefreshToken };
}

async function forgotPassword(email) {
  const admin = await adminRepo.findByEmail(email);
  if (!admin) return; // Silent — don't expose whether email exists

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  await adminRepo.update(admin._id, {
    passwordResetToken: hashedToken,
    passwordResetExpires: new Date(Date.now() + 30 * 60 * 1000), // 30 min
  });

  const resetLink = `${process.env.FRONTEND_URL}/admin/reset-password?token=${rawToken}`;
  await sendPasswordReset(admin.email, resetLink);
}

async function resetPassword(rawToken, newPassword) {
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const Admin = require("../models/Admin.model");
  const admin = await Admin.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!admin) throw ApiError.badRequest("Token is invalid or has expired");

  admin.password = newPassword;
  admin.passwordResetToken = undefined;
  admin.passwordResetExpires = undefined;
  await admin.save();
  await adminRepo.clearRefreshTokens(admin._id);
}

async function changePassword(adminId, currentPassword, newPassword) {
  const admin = await adminRepo.findById(adminId, true);
  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) throw ApiError.badRequest("Current password is incorrect");

  admin.password = newPassword;
  await admin.save();
  await adminRepo.clearRefreshTokens(admin._id);
}

async function createAdmin(data) {
  const existing = await adminRepo.findByEmail(data.email);
  if (existing) throw ApiError.conflict("An admin with this email already exists");
  return adminRepo.create(data);
}

module.exports = {
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  changePassword,
  createAdmin,
};
