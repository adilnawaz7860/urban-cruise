"use strict";

const packageRepo = require("../repositories/package.repository");
const { makeSlug } = require("../utils/slugify");
const { parsePagination, buildSearch } = require("../utils/pagination");
const cache = require("../config/redis");
const ApiError = require("../utils/ApiError");
const uploadService = require("./upload.service");

const CACHE_KEY = "packages";

async function generateUniqueSlug(title, excludeId = null) {
  let slug = makeSlug(title);
  let suffix = 0;
  while (await packageRepo.slugExists(slug, excludeId)) {
    suffix++;
    slug = `${makeSlug(title)}-${suffix}`;
  }
  return slug;
}

async function create(data, adminId, coverImageBuffer, galleryBuffers = []) {
  data.slug = await generateUniqueSlug(data.title);

  if (coverImageBuffer) {
    const result = await uploadService.uploadPackageImage(coverImageBuffer);
    data.coverImage = { url: result.secure_url, publicId: result.public_id };
  }

  if (galleryBuffers.length) {
    const uploads = await Promise.all(
      galleryBuffers.map((buf) => uploadService.uploadPackageImage(buf))
    );
    data.galleryImages = uploads.map((u) => ({ url: u.secure_url, publicId: u.public_id }));
  }

  if (data.discountPrice > 0) {
    data.discountPercent = Math.round(((data.price - data.discountPrice) / data.price) * 100);
  }

  data.createdBy = adminId;
  await cache.delPattern(`${CACHE_KEY}*`);
  return packageRepo.create(data);
}

async function getAll(query, isAdmin = false) {
  const { page, limit, skip, sort } = parsePagination(query);

  const filter = {};
  if (!isAdmin || query.status !== "all") {
    filter.status = isAdmin ? (query.status || "published") : "published";
  }
  if (query.destination) filter.destination = new RegExp(query.destination, "i");
  if (query.category) filter.categories = query.category;
  if (query.featured === "true") filter.featured = true;
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.search) {
    const searchFilter = buildSearch(["title", "destination", "shortDescription"], query.search);
    Object.assign(filter, searchFilter);
  }

  const cacheKey = `${CACHE_KEY}:${JSON.stringify({ filter, sort, skip, limit })}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const result = await packageRepo.findAll({ filter, sort, skip, limit });
  const paginated = { data: result.data, total: result.total, page, limit };
  await cache.set(cacheKey, paginated, 300);
  return paginated;
}

async function getBySlug(slug) {
  const cacheKey = `package:${slug}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const pkg = await packageRepo.findBySlug(slug);
  if (!pkg) throw ApiError.notFound("Package not found");

  await cache.set(cacheKey, pkg, 600);
  return pkg;
}

async function getById(id) {
  const pkg = await packageRepo.findById(id);
  if (!pkg) throw ApiError.notFound("Package not found");
  return pkg;
}

async function getFeatured(limit = 4) {
  const cacheKey = `packages:featured:${limit}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;
  const data = await packageRepo.findFeatured(limit);
  await cache.set(cacheKey, data, 600);
  return data;
}

async function update(id, data, coverImageBuffer, galleryBuffers = []) {
  const pkg = await packageRepo.findById(id);
  if (!pkg) throw ApiError.notFound("Package not found");

  if (data.title && data.title !== pkg.title) {
    data.slug = await generateUniqueSlug(data.title, id);
  }

  if (coverImageBuffer) {
    if (pkg.coverImage?.publicId) await uploadService.deleteResource(pkg.coverImage.publicId);
    const result = await uploadService.uploadPackageImage(coverImageBuffer);
    data.coverImage = { url: result.secure_url, publicId: result.public_id };
  }

  if (galleryBuffers.length) {
    const uploads = await Promise.all(
      galleryBuffers.map((buf) => uploadService.uploadPackageImage(buf))
    );
    data.galleryImages = [
      ...(pkg.galleryImages || []),
      ...uploads.map((u) => ({ url: u.secure_url, publicId: u.public_id })),
    ];
  }

  if (data.price && data.discountPrice > 0) {
    data.discountPercent = Math.round(((data.price - data.discountPrice) / data.price) * 100);
  }

  await cache.delPattern(`${CACHE_KEY}*`);
  await cache.del(`package:${pkg.slug}`);
  return packageRepo.update(id, data);
}

async function remove(id) {
  const pkg = await packageRepo.findById(id);
  if (!pkg) throw ApiError.notFound("Package not found");

  if (pkg.coverImage?.publicId) await uploadService.deleteResource(pkg.coverImage.publicId);
  for (const img of pkg.galleryImages || []) {
    if (img.publicId) await uploadService.deleteResource(img.publicId);
  }

  await cache.delPattern(`${CACHE_KEY}*`);
  return packageRepo.delete(id);
}

async function duplicate(id) {
  const pkg = await packageRepo.findById(id);
  if (!pkg) throw ApiError.notFound("Package not found");
  await cache.delPattern(`${CACHE_KEY}*`);
  return packageRepo.duplicate(id);
}

module.exports = { create, getAll, getBySlug, getById, getFeatured, update, remove, duplicate };
