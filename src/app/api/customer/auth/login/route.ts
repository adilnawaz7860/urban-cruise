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
import { ok, fail, ApiError } from "@/lib/server/api-helpers";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());
    await connectDB();

    const customer = await Customer.findOne({ email: body.email.toLowerCase() }).select(
      "+password +refreshTokens"
    );
    if (!customer || !customer.isActive) throw ApiError.unauthorized("Invalid email or password");

    const valid = await customer.comparePassword(body.password);
    if (!valid) throw ApiError.unauthorized("Invalid email or password");

    const payload = { id: String(customer._id) };
    const accessToken = signCustomerAccessToken(payload);
    const refreshToken = signCustomerRefreshToken(payload);

    customer.refreshTokens.push(refreshToken);
    await customer.save();

    const res = ok({ customer: customer.toSafeObject() }, "Logged in successfully");
    res.cookies.set(CUSTOMER_ACCESS_COOKIE, accessToken, customerAccessCookieOptions);
    res.cookies.set(CUSTOMER_REFRESH_COOKIE, refreshToken, customerRefreshCookieOptions);
    return res;
  } catch (err) {
    return fail(err);
  }
}
