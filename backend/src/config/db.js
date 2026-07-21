"use strict";

const mongoose = require("mongoose");
const logger = require("../utils/logger");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/urban_cruise";

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, options);
    logger.info(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected — attempting reconnect...");
    });

    return conn;
  } catch (err) {
    logger.error("MongoDB initial connection failed:", err.message);
    throw err;
  }
}

module.exports = connectDB;
