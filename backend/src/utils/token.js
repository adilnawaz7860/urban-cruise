"use strict";

const jwt = require("jsonwebtoken");
const ApiError = require("./ApiError");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXP = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXP = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP });
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") throw ApiError.unauthorized("Access token expired");
    throw ApiError.unauthorized("Invalid access token");
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") throw ApiError.unauthorized("Refresh token expired");
    throw ApiError.unauthorized("Invalid refresh token");
  }
}

function generateTokenPair(payload) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, COOKIE_OPTIONS);
}

function clearRefreshCookie(res) {
  res.clearCookie("refreshToken", { ...COOKIE_OPTIONS, maxAge: 0 });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
  setRefreshCookie,
  clearRefreshCookie,
};
