import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "./db";
import { Admin, type AdminDoc, type AdminRole } from "./models/Admin";
import { Customer, type CustomerDoc } from "./models/Customer";
import { ACCESS_COOKIE, TokenError, verifyAccessToken } from "./auth";
import { CUSTOMER_ACCESS_COOKIE, verifyCustomerAccessToken } from "./customer-auth";

export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
  static badRequest(msg: string) {
    return new ApiError(400, msg);
  }
  static unauthorized(msg = "Unauthorized") {
    return new ApiError(401, msg);
  }
  static forbidden(msg = "Insufficient privileges") {
    return new ApiError(403, msg);
  }
  static notFound(msg = "Not found") {
    return new ApiError(404, msg);
  }
  static conflict(msg: string) {
    return new ApiError(409, msg);
  }
}

export function ok<T>(data: T, message = "Success", statusCode = 200) {
  return NextResponse.json({ success: true, message, data }, { status: statusCode });
}

export function created<T>(data: T, message = "Created successfully") {
  return ok(data, message, 201);
}

export function paginated<T>(
  data: T[],
  pagination: { total: number; page: number; limit: number },
  message = "Success"
) {
  const { total, page, limit } = pagination;
  return NextResponse.json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
}

export function fail(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json({ success: false, message: err.message, errors: [] }, { status: err.statusCode });
  }
  if (err && typeof err === "object" && "issues" in err) {
    // zod error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zerr = err as any;
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: zerr.issues },
      { status: 422 }
    );
  }
  console.error(err);
  return NextResponse.json(
    { success: false, message: "Something went wrong", errors: [] },
    { status: 500 }
  );
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));
  const skip = (page - 1) * limit;
  const sortField = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("order") === "asc" ? 1 : -1;
  return { page, limit, skip, sort: { [sortField]: sortOrder } as Record<string, 1 | -1> };
}

export function buildSearch(fields: string[], term?: string | null) {
  if (!term) return {};
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return { $or: fields.map((f) => ({ [f]: new RegExp(escaped, "i") })) };
}

const ROLE_LEVELS: Record<AdminRole, number> = {
  content_manager: 1,
  admin: 2,
  super_admin: 3,
};

export async function requireAdmin(minRole: AdminRole = "content_manager"): Promise<AdminDoc> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!token) throw ApiError.unauthorized("Not authenticated");

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    if (err instanceof TokenError) throw ApiError.unauthorized(err.message);
    throw ApiError.unauthorized("Invalid session");
  }

  await connectDB();
  const admin = await Admin.findById(payload.id).select("+passwordChangedAt");
  if (!admin || !admin.isActive) throw ApiError.unauthorized("Account not found or inactive");
  if (payload.iat && admin.changedPasswordAfter(payload.iat)) {
    throw ApiError.unauthorized("Password changed. Please log in again.");
  }
  if (ROLE_LEVELS[admin.role] < ROLE_LEVELS[minRole]) {
    throw ApiError.forbidden();
  }
  return admin;
}

export async function requireCustomer(): Promise<CustomerDoc> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_ACCESS_COOKIE)?.value;
  if (!token) throw ApiError.unauthorized("Not authenticated");

  let payload;
  try {
    payload = verifyCustomerAccessToken(token);
  } catch (err) {
    if (err instanceof TokenError) throw ApiError.unauthorized(err.message);
    throw ApiError.unauthorized("Invalid session");
  }

  await connectDB();
  const customer = await Customer.findById(payload.id);
  if (!customer || !customer.isActive) throw ApiError.unauthorized("Account not found or inactive");
  return customer;
}
