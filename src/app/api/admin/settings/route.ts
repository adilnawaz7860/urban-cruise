import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Settings } from "@/lib/server/models/Settings";
import { requireAdmin, ok, fail } from "@/lib/server/api-helpers";
import { assertValidImage, deleteResource, fileToBuffer, uploadBranding } from "@/lib/server/cloudinary";

export async function GET() {
  try {
    await requireAdmin("admin");
    await connectDB();
    const settings = await Settings.getSingleton();
    return ok(settings);
  } catch (err) {
    return fail(err);
  }
}

const updateSchema = z.object({
  siteName: z.string().trim().optional(),
  tagline: z.string().trim().optional(),
  email: z.string().email().optional(),
  phone: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  address: z.string().optional(),
  social: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      youtube: z.string().optional(),
      twitter: z.string().optional(),
    })
    .optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
  googleAnalyticsId: z.string().optional(),
  googleMapsApiKey: z.string().optional(),
  maintenanceMode: z.coerce.boolean().optional(),
  maintenanceMessage: z.string().optional(),
  stats: z
    .object({
      happyCustomers: z.coerce.number().int().min(0).optional(),
      toursCompleted: z.coerce.number().int().min(0).optional(),
      destinationsCovered: z.coerce.number().int().min(0).optional(),
      yearsOfExperience: z.coerce.number().int().min(0).optional(),
    })
    .optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin("admin");
    await connectDB();

    const settings = await Settings.getSingleton();

    const formData = await request.formData();
    const raw = formData.get("data");
    const data = raw && typeof raw === "string" ? updateSchema.parse(JSON.parse(raw)) : {};

    const logoFile = formData.get("logo") as File | null;
    if (logoFile && logoFile.size > 0) {
      assertValidImage(logoFile);
      if (settings.logo?.publicId) await deleteResource(settings.logo.publicId);
      settings.logo = await uploadBranding(await fileToBuffer(logoFile));
    }

    const faviconFile = formData.get("favicon") as File | null;
    if (faviconFile && faviconFile.size > 0) {
      assertValidImage(faviconFile);
      if (settings.favicon?.publicId) await deleteResource(settings.favicon.publicId);
      settings.favicon = await uploadBranding(await fileToBuffer(faviconFile));
    }

    if (data.social) settings.social = { ...settings.social, ...data.social };
    if (data.stats) settings.stats = { ...settings.stats, ...data.stats };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { social, stats, ...rest } = data;
    Object.assign(settings, rest);
    settings.updatedBy = admin._id;

    await settings.save();
    return ok(settings, "Settings updated");
  } catch (err) {
    return fail(err);
  }
}
