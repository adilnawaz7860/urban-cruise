import jwt from "jsonwebtoken";
import type { AdminRole } from "./models/Admin";

export interface JwtPayload {
  id: string;
  role: AdminRole;
  iat?: number;
  exp?: number;
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export function signAccessToken(payload: { id: string; role: AdminRole }) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export function signRefreshToken(payload: { id: string; role: AdminRole }) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenError";
  }
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) throw new TokenError("Access token expired");
    throw new TokenError("Invalid access token");
  }
}

export function verifyRefreshToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) throw new TokenError("Refresh token expired");
    throw new TokenError("Invalid refresh token");
  }
}

const isProd = process.env.NODE_ENV === "production";

export const ACCESS_COOKIE = "accessToken";
export const REFRESH_COOKIE = "refreshToken";

export const accessCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "strict" : "lax") as "strict" | "lax",
  maxAge: 15 * 60 * 1000,
  path: "/",
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "strict" : "lax") as "strict" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const clearedAccessCookieOptions = { ...accessCookieOptions, maxAge: 0 };
export const clearedRefreshCookieOptions = { ...refreshCookieOptions, maxAge: 0 };
