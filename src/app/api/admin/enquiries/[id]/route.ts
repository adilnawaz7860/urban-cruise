import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Enquiry } from "@/lib/server/models/Enquiry";
import { requireAdmin, ok, fail, ApiError } from "@/lib/server/api-helpers";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("admin");
    const { id } = await params;
    await connectDB();

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) throw ApiError.notFound("Enquiry not found");

    if (!enquiry.isRead) {
      enquiry.isRead = true;
      enquiry.readAt = new Date();
      enquiry.status = "read";
      await enquiry.save();
    }

    return ok(enquiry);
  } catch (err) {
    return fail(err);
  }
}

const updateSchema = z.object({
  status: z.enum(["new", "read", "replied", "closed"]).optional(),
  adminNotes: z.string().max(1000).optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("admin");
    const { id } = await params;
    await connectDB();

    const data = updateSchema.parse(await request.json());
    if (data.status === "replied") Object.assign(data, { repliedAt: new Date() });

    const enquiry = await Enquiry.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!enquiry) throw ApiError.notFound("Enquiry not found");

    return ok(enquiry, "Enquiry updated");
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("admin");
    const { id } = await params;
    await connectDB();

    const enquiry = await Enquiry.findByIdAndDelete(id);
    if (!enquiry) throw ApiError.notFound("Enquiry not found");

    return ok(null, "Enquiry deleted");
  } catch (err) {
    return fail(err);
  }
}
