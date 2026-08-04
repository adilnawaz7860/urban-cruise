import { requireCustomer, ok, fail } from "@/lib/server/api-helpers";

export async function GET() {
  try {
    const customer = await requireCustomer();
    const safe = customer.toSafeObject();
    return ok({
      ...safe,
      wishlist: customer.wishlist.map((id) => String(id)),
    });
  } catch (err) {
    return fail(err);
  }
}
