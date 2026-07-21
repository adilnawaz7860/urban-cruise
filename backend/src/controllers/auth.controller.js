"use strict";

const authService = require("../services/auth.service");
const adminRepo = require("../repositories/admin.repository");
const uploadService = require("../services/upload.service");
const { setRefreshCookie, clearRefreshCookie, verifyRefreshToken } = require("../utils/token");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { parsePagination } = require("../utils/pagination");

// POST /auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { admin, accessToken, refreshToken } = await authService.login(email, password);
  setRefreshCookie(res, refreshToken);
  ApiResponse.ok(res, { admin, accessToken }, "Login successful");
});

// POST /auth/logout
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) await authService.logout(req.admin._id, token);
  clearRefreshCookie(res);
  ApiResponse.ok(res, null, "Logged out successfully");
});

// POST /auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw ApiError.unauthorized("No refresh token");
  const { accessToken, refreshToken } = await authService.refreshTokens(token);
  setRefreshCookie(res, refreshToken);
  ApiResponse.ok(res, { accessToken }, "Token refreshed");
});

// POST /auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  ApiResponse.ok(res, null, "If the email exists, a reset link has been sent");
});

// POST /auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.newPassword);
  ApiResponse.ok(res, null, "Password reset successfully");
});

// PATCH /auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.admin._id, currentPassword, newPassword);
  clearRefreshCookie(res);
  ApiResponse.ok(res, null, "Password changed. Please log in again.");
});

// GET /auth/me
const getProfile = asyncHandler(async (req, res) => {
  ApiResponse.ok(res, req.admin.toSafeObject(), "Profile fetched");
});

// PATCH /auth/me
const updateProfile = asyncHandler(async (req, res) => {
  const avatarBuffer = req.file?.buffer;
  const data = { ...req.body };

  if (avatarBuffer) {
    const admin = await adminRepo.findById(req.admin._id, true);
    if (admin.avatar?.publicId) await uploadService.deleteResource(admin.avatar.publicId);
    const result = await uploadService.uploadAvatar(avatarBuffer);
    data.avatar = { url: result.secure_url, publicId: result.public_id };
  }

  const updated = await adminRepo.update(req.admin._id, data);
  ApiResponse.ok(res, updated.toSafeObject(), "Profile updated");
});

// POST /auth/admins  (super_admin only)
const createAdmin = asyncHandler(async (req, res) => {
  const admin = await authService.createAdmin(req.body);
  ApiResponse.created(res, admin.toSafeObject(), "Admin created");
});

// GET /auth/admins  (super_admin only)
const listAdmins = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parsePagination(req.query);
  const { data, total } = await adminRepo.findAll({ sort, skip, limit });
  ApiResponse.paginated(res, { data, total, page, limit });
});

// DELETE /auth/admins/:id  (super_admin only)
const deleteAdmin = asyncHandler(async (req, res) => {
  if (String(req.params.id) === String(req.admin._id)) {
    throw ApiError.badRequest("You cannot delete your own account");
  }
  await adminRepo.delete(req.params.id);
  ApiResponse.ok(res, null, "Admin deleted");
});

module.exports = {
  login, logout, refresh, forgotPassword, resetPassword,
  changePassword, getProfile, updateProfile, createAdmin,
  listAdmins, deleteAdmin,
};
