import { connectDB } from "@/lib/server/db";
import { Settings } from "@/lib/server/models/Settings";
import { ok, fail } from "@/lib/server/api-helpers";

export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.getSingleton();
    const obj = settings.toObject();
    delete obj.updatedBy;
    delete obj.__v;
    return ok(obj);
  } catch (err) {
    return fail(err);
  }
}
