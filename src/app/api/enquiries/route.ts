import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Enquiry } from "@/lib/server/models/Enquiry";
import { sendEnquiryReceived } from "@/lib/server/email";
import { created, fail } from "@/lib/server/api-helpers";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  destination: z.string().max(150).optional(),
  package: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  travelDate: z.coerce.date().optional(),
  travelers: z.coerce.number().int().min(1).optional(),
  message: z.string().max(2000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    await connectDB();

    const enquiry = await Enquiry.create({
      ...body,
      message: body.message?.trim() || `Interested in a trip to ${body.destination || "the destination"}. Please share a quote.`,
    });
    sendEnquiryReceived(enquiry);

    return created(enquiry, "Enquiry submitted successfully");
  } catch (err) {
    return fail(err);
  }
}
