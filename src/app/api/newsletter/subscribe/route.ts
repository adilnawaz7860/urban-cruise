import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Newsletter } from "@/lib/server/models/Newsletter";
import { sendNewsletterConfirmation } from "@/lib/server/email";
import { ok, fail, ApiError } from "@/lib/server/api-helpers";

const schema = z.object({
  email: z.string().email(),
  name: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    await connectDB();

    const existing = await Newsletter.findOne({ email: body.email.toLowerCase() });
    if (existing?.isActive) throw ApiError.conflict("This email is already subscribed");

    const sub = await Newsletter.findOneAndUpdate(
      { email: body.email.toLowerCase() },
      { email: body.email.toLowerCase(), name: body.name, isActive: true, confirmedAt: new Date() },
      { upsert: true, new: true }
    );

    sendNewsletterConfirmation(sub.email, sub.name);

    return ok(sub, "Subscribed successfully");
  } catch (err) {
    return fail(err);
  }
}
