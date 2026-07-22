import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Contact } from "@/lib/server/models/Contact";
import { requireAdmin, ok, fail, ApiError } from "@/lib/server/api-helpers";

export async function PATCH(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("admin");
    const { id } = await params;
    await connectDB();

    const contact = await Contact.findByIdAndUpdate(
      id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    if (!contact) throw ApiError.notFound("Contact message not found");

    return ok(contact, "Marked as read");
  } catch (err) {
    return fail(err);
  }
}
