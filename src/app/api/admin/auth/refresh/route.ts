import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Admin } from "@/lib/server/models/Admin";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  accessCookieOptions,
  refreshCookieOptions,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  TokenError,
} from "@/lib/server/auth";
import { ok, fail, ApiError } from "@/lib/server/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
    if (!refreshToken) throw ApiError.unauthorized("Not authenticated");

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      if (err instanceof TokenError) throw ApiError.unauthorized(err.message);
      throw ApiError.unauthorized("Invalid session");
    }

    await connectDB();
    const admin = await Admin.findById(payload.id).select("+refreshTokens");
    if (!admin || !admin.isActive) throw ApiError.unauthorized("Account not found or inactive");

    if (!admin.refreshTokens.includes(refreshToken)) {
      admin.refreshTokens = [];
      await admin.save();
      throw ApiError.unauthorized("Token reuse detected. Please log in again.");
    }

    admin.refreshTokens = admin.refreshTokens.filter((t) => t !== refreshToken);
    const newPayload = { id: String(admin._id), role: admin.role };
    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);
    admin.refreshTokens.push(newRefreshToken);
    await admin.save();

    const res = ok(null, "Session refreshed");
    res.cookies.set(ACCESS_COOKIE, newAccessToken, accessCookieOptions);
    res.cookies.set(REFRESH_COOKIE, newRefreshToken, refreshCookieOptions);
    return res;
  } catch (err) {
    return fail(err);
  }
}
