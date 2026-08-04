import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Customer } from "@/lib/server/models/Customer";
import {
  CUSTOMER_ACCESS_COOKIE,
  CUSTOMER_REFRESH_COOKIE,
  customerAccessCookieOptions,
  customerRefreshCookieOptions,
  signCustomerAccessToken,
  signCustomerRefreshToken,
  verifyCustomerRefreshToken,
} from "@/lib/server/customer-auth";
import { TokenError } from "@/lib/server/auth";
import { ok, fail, ApiError } from "@/lib/server/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(CUSTOMER_REFRESH_COOKIE)?.value;
    if (!refreshToken) throw ApiError.unauthorized("Not authenticated");

    let payload;
    try {
      payload = verifyCustomerRefreshToken(refreshToken);
    } catch (err) {
      if (err instanceof TokenError) throw ApiError.unauthorized(err.message);
      throw ApiError.unauthorized("Invalid session");
    }

    await connectDB();
    const customer = await Customer.findById(payload.id).select("+refreshTokens");
    if (!customer || !customer.isActive) throw ApiError.unauthorized("Account not found or inactive");

    if (!customer.refreshTokens.includes(refreshToken)) {
      customer.refreshTokens = [];
      await customer.save();
      throw ApiError.unauthorized("Token reuse detected. Please log in again.");
    }

    customer.refreshTokens = customer.refreshTokens.filter((t) => t !== refreshToken);
    const newPayload = { id: String(customer._id) };
    const newAccessToken = signCustomerAccessToken(newPayload);
    const newRefreshToken = signCustomerRefreshToken(newPayload);
    customer.refreshTokens.push(newRefreshToken);
    await customer.save();

    const res = ok(null, "Session refreshed");
    res.cookies.set(CUSTOMER_ACCESS_COOKIE, newAccessToken, customerAccessCookieOptions);
    res.cookies.set(CUSTOMER_REFRESH_COOKIE, newRefreshToken, customerRefreshCookieOptions);
    return res;
  } catch (err) {
    return fail(err);
  }
}
