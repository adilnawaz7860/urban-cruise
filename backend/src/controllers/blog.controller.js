"use strict";

const blogService = require("../services/blog.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// PUBLIC
const getAll = asyncHandler(async (req, res) => {
  const result = await blogService.getAll(req.query, false);
  ApiResponse.paginated(res, result);
});

const getBySlug = asyncHandler(async (req, res) => {
  const { blog, related } = await blogService.getBySlug(req.params.slug, false);
  ApiResponse.ok(res, { blog, related });
});

// ADMIN
const adminGetAll = asyncHandler(async (req, res) => {
  const result = await blogService.getAll(req.query, true);
  ApiResponse.paginated(res, result);
});

const create = asyncHandler(async (req, res) => {
  const imageBuffer = req.file?.buffer;
  const blog = await blogService.create(req.body, req.admin._id, imageBuffer);
  ApiResponse.created(res, blog, "Blog post created");
});

const update = asyncHandler(async (req, res) => {
  const imageBuffer = req.file?.buffer;
  const blog = await blogService.update(req.params.id, req.body, imageBuffer);
  ApiResponse.ok(res, blog, "Blog post updated");
});

const remove = asyncHandler(async (req, res) => {
  await blogService.remove(req.params.id);
  ApiResponse.ok(res, null, "Blog post deleted");
});

module.exports = { getAll, getBySlug, adminGetAll, create, update, remove };
