"use strict";

const ApiError = require("../utils/ApiError");

/**
 * Role hierarchy — higher index = more privileges.
 */
const ROLE_LEVELS = {
  content_manager: 1,
  admin: 2,
  super_admin: 3,
};

/**
 * Restrict access to one or more roles.
 * Usage: authorize("super_admin", "admin")
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.admin) return next(ApiError.unauthorized());
    if (!roles.includes(req.admin.role)) {
      return next(ApiError.forbidden(`Role '${req.admin.role}' is not allowed here`));
    }
    next();
  };
}

/**
 * Restrict to users with at least the given role level.
 * Usage: atLeast("admin")  — allows admin + super_admin
 */
function atLeast(minRole) {
  return (req, res, next) => {
    if (!req.admin) return next(ApiError.unauthorized());
    const userLevel = ROLE_LEVELS[req.admin.role] ?? 0;
    const requiredLevel = ROLE_LEVELS[minRole] ?? 99;
    if (userLevel < requiredLevel) {
      return next(ApiError.forbidden("Insufficient privileges"));
    }
    next();
  };
}

module.exports = { authorize, atLeast };
