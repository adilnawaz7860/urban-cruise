"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { submitEnquiry } from "@/lib/forms";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", destination: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await submitEnquiry({
      name: form.name,
      email: form.email,
      phone: form.phone,
      destination: form.destination || undefined,
      message: form.message || undefined,
    });
    if (res.ok) {
      setStatus("done");
      setStatusMsg("Thanks! We'll call you back within 2 hours.");
      setForm({ name: "", phone: "", email: "", destination: "", message: "" });
    } else {
      setStatus("error");
      setStatusMsg(res.message || "Something went wrong. Please try WhatsApp instead.");
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium">Full Name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          required
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="+91 XXXXX XXXXX"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Destination of Interest</label>
        <input
          type="text"
          value={form.destination}
          onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
          placeholder="e.g. Varanasi, Manali, Kerala..."
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Message (optional)</label>
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Tell us about your trip requirements..."
          className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 disabled:opacity-60"
      >
        <MessageCircle className="h-4 w-4" />
        {status === "loading" ? "Sending..." : "Send Inquiry"}
      </button>
      {statusMsg && (
        <p className={`text-center text-xs ${status === "error" ? "text-destructive" : "text-green-600"}`}>
          {statusMsg}
        </p>
      )}
    </form>
  );
}
