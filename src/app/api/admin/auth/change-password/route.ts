import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin, ok, fail, ApiError } from "@/lib/server/api-helpers";
import { Admin } from "@/lib/server/models/Admin";
import { clearedAccessCookieOptions, clearedRefreshCookieOptions, ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/server/auth";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).regex(/[A-Z]/, "Must contain an uppercase letter").regex(/\d/, "Must contain a digit"),
});

export async function PATCH(request: NextRequest) {
  try {
    const sessionAdmin = await requireAdmin();
    const body = schema.parse(await request.json());

    const admin = await Admin.findById(sessionAdmin._id).select("+password +refreshTokens");
    if (!admin) throw ApiError.unauthorized();

    const valid = await admin.comparePassword(body.currentPassword);
    if (!valid) throw ApiError.badRequest("Current password is incorrect");

    admin.password = body.newPassword;
    admin.refreshTokens = [];
    await admin.save();

    const res = ok(null, "Password changed. Please log in again.");
    res.cookies.set(ACCESS_COOKIE, "", clearedAccessCookieOptions);
    res.cookies.set(REFRESH_COOKIE, "", clearedRefreshCookieOptions);
    return res;
  } catch (err) {
    return fail(err);
  }
}
