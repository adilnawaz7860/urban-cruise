import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Contact } from "@/lib/server/models/Contact";
import { created, fail } from "@/lib/server/api-helpers";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(3000),
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    await connectDB();

    const ip = request.headers.get("x-forwarded-for") || "";
    const contact = await Contact.create({ ...body, ip });

    return created(contact, "Message sent successfully");
  } catch (err) {
    return fail(err);
  }
}
