"use strict";

const galleryRepo = require("../repositories/gallery.repository");
const uploadService = require("./upload.service");
const { parsePagination } = require("../utils/pagination");
const ApiError = require("../utils/ApiError");

async function upload(files, meta, adminId) {
  const uploads = await Promise.all(
    files.map(async (file, i) => {
      const result = await uploadService.uploadGalleryImage(file.buffer);
      return galleryRepo.create({
        url: result.secure_url,
        publicId: result.public_id,
        alt: meta.alts?.[i] || "",
        category: meta.category || "destinations",
        caption: meta.captions?.[i] || "",
        uploadedBy: adminId,
      });
    })
  );
  return uploads;
}

async function getAll(query) {
  const { page, limit, skip, sort } = parsePagination(query);
  const filter = { isActive: true };
  if (query.category) filter.category = query.category;
  const { data, total } = await galleryRepo.findAll({ filter, sort, skip, limit });
  return { data, total, page, limit };
}

async function getAllAdmin(query) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.category) filter.category = query.category;
  const { data, total } = await galleryRepo.findAll({ filter, sort: { createdAt: -1 }, skip, limit });
  return { data, total, page, limit };
}

async function update(id, data) {
  const item = await galleryRepo.findById(id);
  if (!item) throw ApiError.notFound("Gallery item not found");
  return galleryRepo.update(id, data);
}

async function remove(id) {
  const item = await galleryRepo.findById(id);
  if (!item) throw ApiError.notFound("Gallery item not found");
  await uploadService.deleteResource(item.publicId);
  return galleryRepo.delete(id);
}

module.exports = { upload, getAll, getAllAdmin, update, remove };
