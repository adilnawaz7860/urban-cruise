import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Faq } from "@/lib/server/models/Faq";
import { requireAdmin, ok, fail, ApiError } from "@/lib/server/api-helpers";
import { revalidatePublicSite } from "@/lib/server/revalidation";

const updateSchema = z.object({
  question: z.string().trim().min(1).max(300).optional(),
  questionHi: z.string().trim().optional(),
  answer: z.string().min(1).max(2000).optional(),
  answerHi: z.string().optional(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.coerce.boolean().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("content_manager");
    const { id } = await params;
    await connectDB();

    const data = updateSchema.parse(await request.json());
    const item = await Faq.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!item) throw ApiError.notFound("FAQ not found");
    revalidatePublicSite();

    return ok(item, "FAQ updated");
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("content_manager");
    const { id } = await params;
    await connectDB();

    const item = await Faq.findByIdAndDelete(id);
    if (!item) throw ApiError.notFound("FAQ not found");
    revalidatePublicSite();

    return ok(null, "FAQ deleted");
  } catch (err) {
    return fail(err);
  }
}
