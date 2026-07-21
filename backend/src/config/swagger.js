"use strict";

const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Urban Cruise API",
      version: "1.0.0",
      description: "Production API for Urban Cruise travel booking platform — Lucknow",
      contact: { name: "Urban Cruise", email: "info@urbancruiselko.com" },
    },
    servers: [
      { url: "http://localhost:5000/api/v1", description: "Development" },
      { url: "https://api.urbancruiselko.com/api/v1", description: "Production" },
    ],
    components: {
      securitySchemes: {
        BearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        CookieAuth: { type: "apiKey", in: "cookie", name: "refreshToken" },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            total: { type: "integer" },
            page: { type: "integer" },
            limit: { type: "integer" },
            pages: { type: "integer" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"],
};

module.exports = swaggerJsdoc(options);
