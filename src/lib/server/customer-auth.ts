import jwt from "jsonwebtoken";
import { TokenError } from "./auth";

export interface CustomerJwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

const ACCESS_SECRET = process.env.JWT_CUSTOMER_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_CUSTOMER_REFRESH_SECRET as string;
const ACCESS_EXPIRES_IN = process.env.JWT_CUSTOMER_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.JWT_CUSTOMER_REFRESH_EXPIRES_IN || "30d";

export function signCustomerAccessToken(payload: { id: string }) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export function signCustomerRefreshToken(payload: { id: string }) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export function verifyCustomerAccessToken(token: string): CustomerJwtPayload {
  try {
    return jwt.verify(token, ACCESS_SECRET) as CustomerJwtPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) throw new TokenError("Access token expired");
    throw new TokenError("Invalid access token");
  }
}

export function verifyCustomerRefreshToken(token: string): CustomerJwtPayload {
  try {
    return jwt.verify(token, REFRESH_SECRET) as CustomerJwtPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) throw new TokenError("Refresh token expired");
    throw new TokenError("Invalid refresh token");
  }
}

const isProd = process.env.NODE_ENV === "production";

export const CUSTOMER_ACCESS_COOKIE = "customerAccessToken";
export const CUSTOMER_REFRESH_COOKIE = "customerRefreshToken";

export const customerAccessCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "strict" : "lax") as "strict" | "lax",
  maxAge: 15 * 60 * 1000,
  path: "/",
};

export const customerRefreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "strict" : "lax") as "strict" | "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const clearedCustomerAccessCookieOptions = { ...customerAccessCookieOptions, maxAge: 0 };
export const clearedCustomerRefreshCookieOptions = { ...customerRefreshCookieOptions, maxAge: 0 };
