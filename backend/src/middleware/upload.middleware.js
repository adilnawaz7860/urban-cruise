"use strict";

const multer = require("multer");
const ApiError = require("../utils/ApiError");

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Use memory storage — we stream directly to Cloudinary
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only JPEG, PNG, WebP and GIF images are allowed"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

// Single image upload
const uploadSingle = (fieldName = "image") => upload.single(fieldName);

// Multiple images (up to 10)
const uploadMultiple = (fieldName = "images", max = 10) => upload.array(fieldName, max);

// Multiple fields
const uploadFields = (fields) => upload.fields(fields);

// Multer error handler
function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new ApiError(400, `File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB`));
    }
    return next(new ApiError(400, err.message));
  }
  next(err);
}

module.exports = { uploadSingle, uploadMultiple, uploadFields, multerErrorHandler };
