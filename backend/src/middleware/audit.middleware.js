"use strict";

const logger = require("../utils/logger");

/**
 * Logs admin write operations (POST/PUT/PATCH/DELETE) for audit trail.
 */
function auditLog(req, res, next) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();
  if (!req.admin) return next();

  const originalJson = res.json.bind(res);
  res.json = function (body) {
    logger.info("[AUDIT]", {
      adminId: req.admin._id,
      adminEmail: req.admin.email,
      role: req.admin.role,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      timestamp: new Date().toISOString(),
    });
    return originalJson(body);
  };

  next();
}

module.exports = { auditLog };
