"use strict";

/**
 * Extracts page/limit/sort/order from query string with safe defaults.
 */
function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  const sortField = query.sortBy || "createdAt";
  const sortOrder = query.order === "asc" ? 1 : -1;
  const sort = { [sortField]: sortOrder };
  return { page, limit, skip, sort };
}

/**
 * Builds a text-search or regex filter from query string.
 */
function buildSearch(fields, searchTerm) {
  if (!searchTerm) return {};
  const regex = new RegExp(searchTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i");
  return { $or: fields.map((f) => ({ [f]: regex })) };
}

module.exports = { parsePagination, buildSearch };
