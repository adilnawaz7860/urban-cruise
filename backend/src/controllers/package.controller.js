"use strict";

const packageService = require("../services/package.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// PUBLIC
const getAll = asyncHandler(async (req, res) => {
  const result = await packageService.getAll(req.query, false);
  ApiResponse.paginated(res, result);
});

const getFeatured = asyncHandler(async (req, res) => {
  const data = await packageService.getFeatured(parseInt(req.query.limit, 10) || 4);
  ApiResponse.ok(res, data);
});

const getBySlug = asyncHandler(async (req, res) => {
  const pkg = await packageService.getBySlug(req.params.slug);
  ApiResponse.ok(res, pkg);
});

// ADMIN
const adminGetAll = asyncHandler(async (req, res) => {
  const result = await packageService.getAll(req.query, true);
  ApiResponse.paginated(res, result);
});

const getById = asyncHandler(async (req, res) => {
  const pkg = await packageService.getById(req.params.id);
  ApiResponse.ok(res, pkg);
});

const create = asyncHandler(async (req, res) => {
  const coverBuffer = req.files?.cover?.[0]?.buffer;
  const galleryBuffers = (req.files?.gallery || []).map((f) => f.buffer);
  const pkg = await packageService.create(req.body, req.admin._id, coverBuffer, galleryBuffers);
  ApiResponse.created(res, pkg, "Package created");
});

const update = asyncHandler(async (req, res) => {
  const coverBuffer = req.files?.cover?.[0]?.buffer;
  const galleryBuffers = (req.files?.gallery || []).map((f) => f.buffer);
  const pkg = await packageService.update(req.params.id, req.body, coverBuffer, galleryBuffers);
  ApiResponse.ok(res, pkg, "Package updated");
});

const remove = asyncHandler(async (req, res) => {
  await packageService.remove(req.params.id);
  ApiResponse.ok(res, null, "Package deleted");
});

const duplicate = asyncHandler(async (req, res) => {
  const pkg = await packageService.duplicate(req.params.id);
  ApiResponse.created(res, pkg, "Package duplicated");
});

const toggleStatus = asyncHandler(async (req, res) => {
  const pkg = await packageService.getById(req.params.id);
  const newStatus = pkg.status === "published" ? "draft" : "published";
  const updated = await packageService.update(req.params.id, { status: newStatus });
  ApiResponse.ok(res, updated, `Package ${newStatus}`);
});

module.exports = {
  getAll, getFeatured, getBySlug,
  adminGetAll, getById, create, update, remove, duplicate, toggleStatus,
};
