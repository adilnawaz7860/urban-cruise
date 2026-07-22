interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: { total: number; page: number; limit: number; pages: number; hasNext: boolean; hasPrev: boolean };
  errors?: unknown[];
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/admin/auth/refresh", { method: "POST" })
      .then((res) => res.ok)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function adminFetch<T = unknown>(
  url: string,
  init: RequestInit = {},
  _retried = false
): Promise<ApiEnvelope<T>> {
  const res = await fetch(url, init);

  if (res.status === 401 && !_retried) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return adminFetch<T>(url, init, true);
    }
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new Error("Session expired");
  }

  const json = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok) {
    throw new Error(json.message || "Request failed");
  }
  return json;
}

export function adminGet<T = unknown>(url: string) {
  return adminFetch<T>(url);
}

export function adminPost<T = unknown>(url: string, body: unknown) {
  const isFormData = body instanceof FormData;
  return adminFetch<T>(url, {
    method: "POST",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? body : JSON.stringify(body),
  });
}

export function adminPut<T = unknown>(url: string, body: unknown) {
  const isFormData = body instanceof FormData;
  return adminFetch<T>(url, {
    method: "PUT",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? body : JSON.stringify(body),
  });
}

export function adminPatch<T = unknown>(url: string, body?: unknown) {
  const isFormData = body instanceof FormData;
  return adminFetch<T>(url, {
    method: "PATCH",
    headers: isFormData || body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });
}

export function adminDelete<T = unknown>(url: string) {
  return adminFetch<T>(url, { method: "DELETE" });
}
