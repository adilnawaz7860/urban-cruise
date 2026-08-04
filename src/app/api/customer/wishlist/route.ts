import { NextRequest } from "next/server";
import { z } from "zod";
import { Types } from "mongoose";
import { connectDB } from "@/lib/server/db";
import { Customer } from "@/lib/server/models/Customer";
import { requireCustomer, ok, fail } from "@/lib/server/api-helpers";

export async function GET() {
  try {
    const customer = await requireCustomer();
    await connectDB();
    const populated = await Customer.findById(customer._id).populate("wishlist").lean();
    return ok(populated?.wishlist || []);
  } catch (err) {
    return fail(err);
  }
}

const toggleSchema = z.object({
  packageId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export async function POST(request: NextRequest) {
  try {
    const customer = await requireCustomer();
    await connectDB();

    const { packageId } = toggleSchema.parse(await request.json());
    const alreadyLiked = customer.wishlist.some((id) => String(id) === packageId);

    if (alreadyLiked) {
      customer.wishlist = customer.wishlist.filter((id) => String(id) !== packageId);
    } else {
      customer.wishlist.push(new Types.ObjectId(packageId));
    }
    await customer.save();

    return ok(
      { wishlist: customer.wishlist.map((id) => String(id)), liked: !alreadyLiked },
      alreadyLiked ? "Removed from wishlist" : "Added to wishlist"
    );
  } catch (err) {
    return fail(err);
  }
}
