import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Faq } from "@/lib/server/models/Faq";
import { requireAdmin, ok, created, fail } from "@/lib/server/api-helpers";

export async function GET() {
  try {
    await requireAdmin("content_manager");
    await connectDB();
    const items = await Faq.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return ok(items);
  } catch (err) {
    return fail(err);
  }
}

const createSchema = z.object({
  question: z.string().trim().min(1).max(300),
  questionHi: z.string().trim().optional(),
  answer: z.string().min(1).max(2000),
  answerHi: z.string().optional(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.coerce.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdmin("content_manager");
    await connectDB();
    const data = createSchema.parse(await request.json());
    const item = await Faq.create(data);
    return created(item, "FAQ created");
  } catch (err) {
    return fail(err);
  }
}
