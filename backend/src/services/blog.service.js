"use strict";

const blogRepo = require("../repositories/blog.repository");
const { makeSlug } = require("../utils/slugify");
const { parsePagination } = require("../utils/pagination");
const uploadService = require("./upload.service");
const cache = require("../config/redis");
const ApiError = require("../utils/ApiError");

async function generateUniqueSlug(title, excludeId = null) {
  let slug = makeSlug(title);
  let suffix = 0;
  while (await blogRepo.slugExists(slug, excludeId)) {
    suffix++;
    slug = `${makeSlug(title)}-${suffix}`;
  }
  return slug;
}

async function create(data, adminId, imageBuffer) {
  data.slug = await generateUniqueSlug(data.title);
  data.author = adminId;

  if (imageBuffer) {
    const result = await uploadService.uploadBlogImage(imageBuffer);
    data.featuredImage = {
      url: result.secure_url,
      publicId: result.public_id,
      alt: data.title,
    };
  }

  await cache.delPattern("blogs*");
  return blogRepo.create(data);
}

async function getAll(query, isAdmin = false) {
  const { page, limit, skip, sort } = parsePagination(query);
  const filter = {};

  if (!isAdmin) {
    filter.status = "published";
  } else if (query.status && query.status !== "all") {
    filter.status = query.status;
  }

  if (query.category) filter.category = query.category;
  if (query.tag) filter.tags = query.tag.toLowerCase();
  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const { data, total } = await blogRepo.findAll({ filter, sort, skip, limit });
  return { data, total, page, limit };
}

async function getBySlug(slug, isAdmin = false) {
  const blog = await blogRepo.findBySlug(slug);
  if (!blog || (!isAdmin && blog.status !== "published")) {
    throw ApiError.notFound("Blog post not found");
  }
  await blogRepo.incrementViews(blog._id);
  const related = await blogRepo.findRelated(blog._id, blog.category);
  return { blog, related };
}

async function update(id, data, imageBuffer) {
  const blog = await blogRepo.findById(id);
  if (!blog) throw ApiError.notFound("Blog post not found");

  if (data.title && data.title !== blog.title) {
    data.slug = await generateUniqueSlug(data.title, id);
  }

  if (imageBuffer) {
    if (blog.featuredImage?.publicId) {
      await uploadService.deleteResource(blog.featuredImage.publicId);
    }
    const result = await uploadService.uploadBlogImage(imageBuffer);
    data.featuredImage = { url: result.secure_url, publicId: result.public_id, alt: data.title || blog.title };
  }

  await cache.delPattern("blogs*");
  return blogRepo.update(id, data);
}

async function remove(id) {
  const blog = await blogRepo.findById(id);
  if (!blog) throw ApiError.notFound("Blog post not found");
  if (blog.featuredImage?.publicId) await uploadService.deleteResource(blog.featuredImage.publicId);
  await cache.delPattern("blogs*");
  return blogRepo.delete(id);
}

module.exports = { create, getAll, getBySlug, update, remove };
