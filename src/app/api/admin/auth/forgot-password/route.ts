import { NextRequest } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Admin } from "@/lib/server/models/Admin";
import { sendPasswordReset } from "@/lib/server/email";
import { ok, fail } from "@/lib/server/api-helpers";

const schema = z.object({ email: z.string().email() });

export async function POST(request: NextRequest) {
  try {
    const { email } = schema.parse(await request.json());
    await connectDB();

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (admin) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");
      admin.passwordResetToken = hashed;
      admin.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
      await admin.save();

      const resetLink = `${request.nextUrl.origin}/admin/reset-password?token=${rawToken}`;
      await sendPasswordReset(admin.email, resetLink);
    }

    return ok(null, "If that email exists, a reset link has been sent.");
  } catch (err) {
    return fail(err);
  }
}
