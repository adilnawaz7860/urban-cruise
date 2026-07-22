import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Admin } from "@/lib/server/models/Admin";
import { signAccessToken, signRefreshToken, ACCESS_COOKIE, REFRESH_COOKIE, accessCookieOptions, refreshCookieOptions } from "@/lib/server/auth";
import { ok, fail, ApiError } from "@/lib/server/api-helpers";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());
    await connectDB();

    const admin = await Admin.findOne({ email: body.email.toLowerCase() }).select("+password +refreshTokens");
    if (!admin || !admin.isActive) throw ApiError.unauthorized("Invalid email or password");

    const valid = await admin.comparePassword(body.password);
    if (!valid) throw ApiError.unauthorized("Invalid email or password");

    const payload = { id: String(admin._id), role: admin.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    admin.refreshTokens.push(refreshToken);
    admin.lastLogin = new Date();
    await admin.save();

    const res = ok({ admin: admin.toSafeObject() }, "Logged in successfully");
    res.cookies.set(ACCESS_COOKIE, accessToken, accessCookieOptions);
    res.cookies.set(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
    return res;
  } catch (err) {
    return fail(err);
  }
}
