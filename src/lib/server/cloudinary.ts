import { v2 as cloudinary, type UploadApiOptions } from "cloudinary";
import { ApiError } from "./api-helpers";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const FOLDER = process.env.CLOUDINARY_FOLDER || "urban-cruise";
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;

export function assertValidImage(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw ApiError.badRequest("Only JPEG, PNG, WebP and GIF images are allowed");
  }
  if (file.size > MAX_SIZE) {
    throw ApiError.badRequest("Image must be smaller than 5MB");
  }
}

export async function uploadBuffer(
  buffer: Buffer,
  options: UploadApiOptions & { subfolder?: string } = {}
): Promise<{ url: string; publicId: string }> {
  const { subfolder, ...rest } = options;
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${FOLDER}/${subfolder || "misc"}`,
        transformation: rest.transformation || [{ quality: "auto:good" }, { fetch_format: "auto" }],
        ...rest,
      },
      (error, result) => {
        if (error || !result) {
          reject(ApiError.badRequest(`Cloudinary upload failed: ${error?.message || "unknown error"}`));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteResource(publicId?: string) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn("Cloudinary delete failed (non-fatal):", err);
  }
}

export async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export function uploadPackageImage(buffer: Buffer) {
  return uploadBuffer(buffer, {
    subfolder: "packages",
    transformation: [{ width: 1200, height: 800, crop: "fill", gravity: "auto" }, { quality: "auto:good" }],
  });
}

export function uploadBlogImage(buffer: Buffer) {
  return uploadBuffer(buffer, {
    subfolder: "blogs",
    transformation: [{ width: 1000, height: 600, crop: "fill", gravity: "auto" }, { quality: "auto:good" }],
  });
}

export function uploadGalleryImage(buffer: Buffer) {
  return uploadBuffer(buffer, {
    subfolder: "gallery",
    transformation: [{ width: 900, height: 900, crop: "limit" }, { quality: "auto:eco" }],
  });
}

export function uploadAvatar(buffer: Buffer) {
  return uploadBuffer(buffer, {
    subfolder: "avatars",
    transformation: [{ width: 200, height: 200, crop: "fill", gravity: "face" }, { quality: "auto:good" }],
  });
}

export function uploadDestinationImage(buffer: Buffer) {
  return uploadBuffer(buffer, {
    subfolder: "destinations",
    transformation: [{ width: 1000, height: 750, crop: "fill", gravity: "auto" }, { quality: "auto:good" }],
  });
}

export function uploadBranding(buffer: Buffer) {
  return uploadBuffer(buffer, { subfolder: "branding" });
}
