"use strict";

const { ZodError } = require("zod");
const ApiError = require("../utils/ApiError");

/**
 * Zod schema validation middleware factory.
 * @param {ZodSchema} schema - Zod schema to validate against
 * @param {"body"|"query"|"params"} source - Which part of req to validate
 */
function validate(schema, source = "body") {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed; // replace with sanitized/typed data
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
        return next(ApiError.unprocessable("Validation failed", errors));
      }
      next(err);
    }
  };
}

module.exports = { validate };
