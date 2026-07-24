async function apiPost<T = unknown>(
  path: string,
  body: unknown
): Promise<{ ok: boolean; data?: T; message?: string }> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const json = await res.json();
    return { ok: res.ok, data: json.data, message: json.message };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}

export async function submitEnquiry(data: {
  name: string;
  email: string;
  phone: string;
  destination?: string;
  package?: string;
  travelDate?: string;
  travelers?: number;
  message?: string;
}) {
  return apiPost("/api/enquiries", data);
}

export async function subscribeNewsletter(email: string, name?: string) {
  return apiPost("/api/newsletter/subscribe", { email, name });
}
