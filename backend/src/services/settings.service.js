"use strict";

const settingsRepo = require("../repositories/settings.repository");
const uploadService = require("./upload.service");

async function get() {
  return settingsRepo.get();
}

async function update(data, logoBuffer, faviconBuffer, adminId) {
  const settings = await settingsRepo.get();

  if (logoBuffer) {
    if (settings.logo?.publicId) await uploadService.deleteResource(settings.logo.publicId);
    const result = await uploadService.uploadBuffer(logoBuffer, { subfolder: "branding" });
    data.logo = { url: result.secure_url, publicId: result.public_id };
  }

  if (faviconBuffer) {
    if (settings.favicon?.publicId) await uploadService.deleteResource(settings.favicon.publicId);
    const result = await uploadService.uploadBuffer(faviconBuffer, { subfolder: "branding" });
    data.favicon = { url: result.secure_url, publicId: result.public_id };
  }

  data.updatedBy = adminId;
  return settingsRepo.update(data);
}

// Testimonials
async function createTestimonial(data) {
  return settingsRepo.createTestimonial(data);
}

async function getTestimonials(query = {}) {
  const filter = {};
  if (!query.all) filter.isPublished = true;
  return settingsRepo.findTestimonials({ filter });
}

async function updateTestimonial(id, data) {
  return settingsRepo.updateTestimonial(id, data);
}

async function deleteTestimonial(id) {
  return settingsRepo.deleteTestimonial(id);
}

module.exports = {
  get,
  update,
  createTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
};
