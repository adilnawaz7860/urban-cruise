"use strict";

const cloudinary = require("../config/cloudinary");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

const FOLDER = process.env.CLOUDINARY_FOLDER || "urban-cruise";

/**
 * Upload a buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {Object} options
 */
async function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${FOLDER}/${options.subfolder || "misc"}`,
        transformation: options.transformation || [
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
        ...options,
      },
      (err, result) => {
        if (err) reject(new ApiError(500, `Cloudinary upload failed: ${err.message}`));
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

/**
 * Delete a resource from Cloudinary by publicId.
 */
async function deleteResource(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(`Cloudinary: deleted ${publicId}`);
  } catch (err) {
    logger.warn(`Cloudinary: failed to delete ${publicId}:`, err.message);
  }
}

/**
 * Upload a package cover image.
 */
async function uploadPackageImage(buffer) {
  return uploadBuffer(buffer, {
    subfolder: "packages",
    transformation: [
      { width: 1200, height: 800, crop: "fill", gravity: "auto" },
      { quality: "auto:good", fetch_format: "auto" },
    ],
  });
}

/**
 * Upload a blog featured image.
 */
async function uploadBlogImage(buffer) {
  return uploadBuffer(buffer, {
    subfolder: "blogs",
    transformation: [
      { width: 1000, height: 600, crop: "fill", gravity: "auto" },
      { quality: "auto:good", fetch_format: "auto" },
    ],
  });
}

/**
 * Upload a gallery image.
 */
async function uploadGalleryImage(buffer) {
  return uploadBuffer(buffer, {
    subfolder: "gallery",
    transformation: [
      { width: 900, height: 900, crop: "limit" },
      { quality: "auto:eco", fetch_format: "auto" },
    ],
  });
}

/**
 * Upload an admin avatar.
 */
async function uploadAvatar(buffer) {
  return uploadBuffer(buffer, {
    subfolder: "avatars",
    transformation: [
      { width: 200, height: 200, crop: "fill", gravity: "face" },
      { quality: "auto:good", fetch_format: "auto" },
    ],
  });
}

module.exports = {
  uploadPackageImage,
  uploadBlogImage,
  uploadGalleryImage,
  uploadAvatar,
  deleteResource,
};
