"use client";

import { useState } from "react";
import { ClipboardCheck, Search, Phone, MessageCircle } from "lucide-react";
import { buildWhatsappLink, siteConfig } from "@/lib/config";

type InquiryStatus = "new" | "contacted" | "quotation_sent" | "confirmed" | "closed";

const STATUS_STEPS: { key: InquiryStatus; label: string; desc: string }[] = [
  { key: "new", label: "Inquiry Received", desc: "We received your inquiry and will contact you shortly." },
  { key: "contacted", label: "Contacted", desc: "Our travel expert has reached out to you." },
  { key: "quotation_sent", label: "Quote Sent", desc: "A detailed quotation has been shared with you." },
  { key: "confirmed", label: "Booking Confirmed", desc: "Your booking is confirmed. Have a great trip!" },
  { key: "closed", label: "Closed", desc: "Inquiry closed. Contact us to reopen or start a new one." },
];

const DEMO_INQUIRIES: Record<string, { status: InquiryStatus; destination: string; name: string }> = {
  "UC-1001": { status: "quotation_sent", destination: "Varanasi", name: "Rahul Sharma" },
  "UC-1002": { status: "contacted", destination: "Manali", name: "Priya Singh" },
  "UC-1003": { status: "confirmed", destination: "Kerala", name: "Amit Gupta" },
};

export default function TrackInquiryPage() {
  const [inquiryId, setInquiryId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<(typeof DEMO_INQUIRIES)[string] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
    const found = DEMO_INQUIRIES[inquiryId.trim().toUpperCase()];
    if (found) {
      setResult(found);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  }

  const currentStepIndex = result
    ? STATUS_STEPS.findIndex((s) => s.key === result.status)
    : -1;

  const whatsappMsg = `Hello Urban Cruise! I want to track my inquiry ID: ${inquiryId || "UC-XXXX"}. My phone: ${phone || "not provided"}.`;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
            <ClipboardCheck className="h-4 w-4" />
            Inquiry Status
          </span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Track Your Inquiry</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Enter your inquiry ID to check the live status of your booking request.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        {/* Search form */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-xl font-bold">Find Your Inquiry</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your Inquiry ID was sent via WhatsApp/SMS when you submitted your request.
            Try <span className="font-mono font-semibold text-primary">UC-1001</span> as a demo.
          </p>

          <form onSubmit={handleSearch} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Inquiry ID</label>
              <input
                type="text"
                required
                value={inquiryId}
                onChange={(e) => setInquiryId(e.target.value)}
                placeholder="e.g. UC-1001"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-mono outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Registered Phone <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90"
            >
              <Search className="h-4 w-4" />
              Track Inquiry
            </button>
          </form>
        </div>

        {/* Result */}
        {searched && notFound && (
          <div className="mt-6 glass-card rounded-2xl p-8 text-center">
            <p className="font-semibold text-destructive">Inquiry not found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              We couldn&apos;t find inquiry <span className="font-mono font-semibold">{inquiryId}</span>.
              Please double-check the ID or contact us directly.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={buildWhatsappLink(whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                <Phone className="h-4 w-4" />
                {siteConfig.phone}
              </a>
            </div>
          </div>
        )}

        {searched && result && (
          <div className="mt-6 glass-card rounded-2xl p-8">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl font-bold">Inquiry {inquiryId.toUpperCase()}</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary capitalize">
                {STATUS_STEPS[currentStepIndex]?.label}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.name} · Destination: <span className="font-semibold">{result.destination}</span>
            </p>

            {/* Progress stepper */}
            <div className="mt-8 space-y-0">
              {STATUS_STEPS.filter((s) => s.key !== "closed").map((step, i) => {
                const done = i <= currentStepIndex && result.status !== "closed";
                const current = i === currentStepIndex && result.status !== "closed";
                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          done
                            ? "bg-primary text-primary-foreground"
                            : "border-2 border-border text-muted-foreground"
                        }`}
                      >
                        {done ? "✓" : i + 1}
                      </div>
                      {i < STATUS_STEPS.filter((s) => s.key !== "closed").length - 1 && (
                        <div className={`mt-0.5 h-8 w-px ${done ? "bg-primary" : "bg-border"}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-semibold ${current ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </p>
                      {(done || current) && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{step.desc}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 border-t border-border/60 pt-6">
              <p className="text-sm text-muted-foreground mb-4">Need help with your booking?</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={buildWhatsappLink(whatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={`tel:${siteConfig.phoneRaw}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  <Phone className="h-4 w-4" />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        )}

        {/* No search yet — helper info */}
        {!searched && (
          <div className="mt-6 rounded-2xl border border-border/60 p-6 text-center text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Don&apos;t have an Inquiry ID?</p>
            <p className="mt-1">
              Submit a booking request via WhatsApp or through any package page — we&apos;ll send you
              your ID within minutes.
            </p>
            <a
              href={buildWhatsappLink(
                "Hello Urban Cruise! I'd like to make a new inquiry for a tour package."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              Start New Inquiry
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
