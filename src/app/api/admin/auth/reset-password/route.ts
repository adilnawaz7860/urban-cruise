import { NextRequest } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Admin } from "@/lib/server/models/Admin";
import { ok, fail, ApiError } from "@/lib/server/api-helpers";

const schema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8).regex(/[A-Z]/, "Must contain an uppercase letter").regex(/\d/, "Must contain a digit"),
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    await connectDB();

    const hashed = crypto.createHash("sha256").update(body.token).digest("hex");
    const admin = await Admin.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: new Date() },
    }).select("+password +refreshTokens +passwordResetToken +passwordResetExpires");

    if (!admin) throw ApiError.badRequest("Reset link is invalid or has expired");

    admin.password = body.newPassword;
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    admin.refreshTokens = [];
    await admin.save();

    return ok(null, "Password reset successfully. Please log in.");
  } catch (err) {
    return fail(err);
  }
}
