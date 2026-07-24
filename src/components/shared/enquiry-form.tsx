"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { submitEnquiry } from "@/lib/forms";

interface Props {
  packageId?: string;
  packageTitle: string;
  destination: string;
}

export function EnquiryForm({ packageId, packageTitle, destination }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", travelDate: "", travelers: 2, message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const res = await submitEnquiry({
      name: form.name,
      email: form.email,
      phone: form.phone,
      destination,
      package: packageId,
      travelDate: form.travelDate || undefined,
      travelers: form.travelers,
      message: form.message || `Interested in "${packageTitle}".`,
    });

    if (res.ok) {
      setStatus("done");
    } else {
      setStatus("error");
      setErrorMsg(res.message || "Something went wrong. Please try again or WhatsApp us.");
    }
  }

  if (status === "done") {
    return (
      <div className="glass-card flex flex-col items-center gap-2 rounded-2xl p-6 text-center">
        <CheckCircle2 className="h-8 w-8 text-green-500" />
        <p className="font-semibold">Enquiry sent!</p>
        <p className="text-sm text-muted-foreground">
          Our team will get back to you within 2 hours with a detailed quote for {packageTitle}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-3 rounded-2xl p-6">
      <h3 className="font-semibold">Get a Detailed Quote</h3>
      <p className="text-sm text-muted-foreground">
        Share your details and we&apos;ll send a customised quote for {packageTitle}.
      </p>

      <input
        type="text"
        required
        placeholder="Full name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <input
        type="email"
        required
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <input
        type="tel"
        required
        placeholder="Phone number"
        value={form.phone}
        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          value={form.travelDate}
          onChange={(e) => setForm((f) => ({ ...f, travelDate: e.target.value }))}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <input
          type="number"
          min={1}
          placeholder="Travelers"
          value={form.travelers}
          onChange={(e) => setForm((f) => ({ ...f, travelers: Number(e.target.value) }))}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      <textarea
        rows={2}
        placeholder="Anything else we should know? (optional)"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {status === "loading" ? "Sending..." : "Request Quote"}
      </button>
      {status === "error" && <p className="text-center text-xs text-destructive">{errorMsg}</p>}
    </form>
  );
}
