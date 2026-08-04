interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown[];
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/customer/auth/refresh", { method: "POST" })
      .then((res) => res.ok)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function customerFetch<T = unknown>(
  url: string,
  init: RequestInit = {},
  _retried = false
): Promise<ApiEnvelope<T>> {
  const res = await fetch(url, init);

  if (res.status === 401 && !_retried) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return customerFetch<T>(url, init, true);
    }
    throw new Error("Not logged in");
  }

  const json = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok) {
    throw new Error(json.message || "Request failed");
  }
  return json;
}

export function customerGet<T = unknown>(url: string) {
  return customerFetch<T>(url);
}

export function customerPost<T = unknown>(url: string, body: unknown) {
  return customerFetch<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
