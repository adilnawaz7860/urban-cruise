"use strict";

const galleryService = require("../services/gallery.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

// PUBLIC
const getAll = asyncHandler(async (req, res) => {
  const result = await galleryService.getAll(req.query);
  ApiResponse.paginated(res, result);
});

// ADMIN
const upload = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw ApiError.badRequest("No images provided");
  }
  const items = await galleryService.upload(req.files, req.body, req.admin._id);
  ApiResponse.created(res, items, `${items.length} image(s) uploaded`);
});

const adminGetAll = asyncHandler(async (req, res) => {
  const result = await galleryService.getAllAdmin(req.query);
  ApiResponse.paginated(res, result);
});

const update = asyncHandler(async (req, res) => {
  const item = await galleryService.update(req.params.id, req.body);
  ApiResponse.ok(res, item, "Gallery item updated");
});

const remove = asyncHandler(async (req, res) => {
  await galleryService.remove(req.params.id);
  ApiResponse.ok(res, null, "Gallery item deleted");
});

module.exports = { getAll, upload, adminGetAll, update, remove };
