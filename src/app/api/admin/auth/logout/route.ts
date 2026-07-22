import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Admin } from "@/lib/server/models/Admin";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  clearedAccessCookieOptions,
  clearedRefreshCookieOptions,
  verifyRefreshToken,
} from "@/lib/server/auth";
import { ok, fail } from "@/lib/server/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
    if (refreshToken) {
      await connectDB();
      try {
        const payload = verifyRefreshToken(refreshToken);
        await Admin.findByIdAndUpdate(payload.id, { $pull: { refreshTokens: refreshToken } });
      } catch {
        // token already invalid — nothing to clean up server-side
      }
    }

    const res = ok(null, "Logged out");
    res.cookies.set(ACCESS_COOKIE, "", clearedAccessCookieOptions);
    res.cookies.set(REFRESH_COOKIE, "", clearedRefreshCookieOptions);
    return res;
  } catch (err) {
    return fail(err);
  }
}
