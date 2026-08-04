import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Customer } from "@/lib/server/models/Customer";
import {
  signCustomerAccessToken,
  signCustomerRefreshToken,
  CUSTOMER_ACCESS_COOKIE,
  CUSTOMER_REFRESH_COOKIE,
  customerAccessCookieOptions,
  customerRefreshCookieOptions,
} from "@/lib/server/customer-auth";
import { created, fail, ApiError } from "@/lib/server/api-helpers";

const signupSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().email(),
  phone: z.string().trim().max(20).optional(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = signupSchema.parse(await request.json());
    await connectDB();

    const existing = await Customer.findOne({ email: body.email.toLowerCase() });
    if (existing) throw ApiError.conflict("An account with this email already exists");

    const customer = await Customer.create(body);

    const payload = { id: String(customer._id) };
    const accessToken = signCustomerAccessToken(payload);
    const refreshToken = signCustomerRefreshToken(payload);
    customer.refreshTokens.push(refreshToken);
    await customer.save();

    const res = created({ customer: customer.toSafeObject() }, "Account created");
    res.cookies.set(CUSTOMER_ACCESS_COOKIE, accessToken, customerAccessCookieOptions);
    res.cookies.set(CUSTOMER_REFRESH_COOKIE, refreshToken, customerRefreshCookieOptions);
    return res;
  } catch (err) {
    return fail(err);
  }
}
