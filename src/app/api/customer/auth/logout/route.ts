import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Customer } from "@/lib/server/models/Customer";
import {
  CUSTOMER_ACCESS_COOKIE,
  CUSTOMER_REFRESH_COOKIE,
  clearedCustomerAccessCookieOptions,
  clearedCustomerRefreshCookieOptions,
  verifyCustomerRefreshToken,
} from "@/lib/server/customer-auth";
import { ok, fail } from "@/lib/server/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(CUSTOMER_REFRESH_COOKIE)?.value;
    if (refreshToken) {
      await connectDB();
      try {
        const payload = verifyCustomerRefreshToken(refreshToken);
        await Customer.findByIdAndUpdate(payload.id, { $pull: { refreshTokens: refreshToken } });
      } catch {
        // token already invalid — nothing to clean up server-side
      }
    }

    const res = ok(null, "Logged out");
    res.cookies.set(CUSTOMER_ACCESS_COOKIE, "", clearedCustomerAccessCookieOptions);
    res.cookies.set(CUSTOMER_REFRESH_COOKIE, "", clearedCustomerRefreshCookieOptions);
    return res;
  } catch (err) {
    return fail(err);
  }
}
