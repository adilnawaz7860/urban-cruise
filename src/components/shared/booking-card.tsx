"use client";

import { useState } from "react";
import { MessageCircle, Phone, Car, Package, Minus, Plus } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { buildWhatsappLink, siteConfig } from "@/lib/config";

type BookingType = "full" | "cab";

const CAB_RATE_PER_DAY = 1200;

const OPTIONS: {
  value: BookingType;
  icon: React.ElementType;
  label: string;
  sublabel: string;
  includes: string[];
}[] = [
  {
    value: "full",
    icon: Package,
    label: "Full Package",
    sublabel: "Everything included",
    includes: ["Hotel stay", "Cab & transfers", "Daily breakfast", "Tour guide", "24/7 support"],
  },
  {
    value: "cab",
    icon: Car,
    label: "Cab Only",
    sublabel: "Transport & transfers",
    includes: ["Pickup & drop", "All sightseeing transfers", "Experienced driver", "Toll & parking"],
  },
];

interface Props {
  title: string;
  destination: string;
  durationNights: number;
  durationDays: number;
  price: number;
  originalPrice: number;
  discountPercent: number;
}

export function BookingCard({
  title,
  destination,
  durationNights,
  durationDays,
  price,
  originalPrice,
  discountPercent,
}: Props) {
  const [type, setType] = useState<BookingType>("full");
  const [cabDays, setCabDays] = useState(durationDays);

  const cabPrice = CAB_RATE_PER_DAY * cabDays;
  const displayPrice = type === "full" ? price : cabPrice;
  const displayOriginal = type === "full" ? originalPrice : CAB_RATE_PER_DAY * cabDays * 1.2;

  function buildMessage() {
    if (type === "cab") {
      return `Hello, I need *Cab Only* for my ${destination} trip.\n\n📍 Trip: *${title}*\n📅 Cab required for: *${cabDays} day${cabDays > 1 ? "s" : ""}*\n💰 Estimated fare: ₹${cabPrice.toLocaleString("en-IN")}\n\nI do NOT need hotel or meals — just cab service.\n\nPlease confirm availability and share the exact fare.`;
    }
    return `Hello, I want to book the *${title}* — Full Package (${durationNights}N/${durationDays}D) to ${destination}.\n\nIncludes: Hotel, Cab, Meals & Tour Guide.\nStarting price: ₹${price.toLocaleString("en-IN")}/person.\n\nPlease confirm availability.`;
  }

  const selected = OPTIONS.find((o) => o.value === type)!;

  return (
    <div className="glass-card sticky top-24 rounded-2xl p-6">
      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-primary">{formatINR(displayPrice)}</span>
        {displayOriginal > displayPrice && (
          <span className="text-sm text-muted-foreground line-through">
            {formatINR(Math.round(displayOriginal))}
          </span>
        )}
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {type === "full" ? "per person · starting price" : `estimated · ₹${CAB_RATE_PER_DAY.toLocaleString("en-IN")}/day`}
      </p>

      <div className="my-4 border-t border-border/60" />

      {/* Trip info */}
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Destination</span>
          <span className="font-medium">{destination}</span>
        </div>
        {type === "full" ? (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">{durationNights}N / {durationDays}D</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">You save</span>
                <span className="font-semibold text-green-600">
                  {formatINR(originalPrice - price)} ({discountPercent}%)
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cab days</span>
            <span className="font-medium">{cabDays} day{cabDays > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      <div className="my-4 border-t border-border/60" />

      {/* Option selector */}
      <p className="mb-3 text-sm font-semibold">What do you need?</p>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = type === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${
                active
                  ? "border-primary bg-primary/8 text-foreground"
                  : "border-border bg-transparent text-muted-foreground hover:border-primary/40"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-xs font-semibold leading-tight">{opt.label}</span>
                <span className="block text-[10px] opacity-70">{opt.sublabel}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Cab days selector */}
      {type === "cab" && (
        <div className="mt-4 rounded-xl bg-muted/50 p-4">
          <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            How many days do you need the cab?
          </p>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCabDays((d) => Math.max(1, d - 1))}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <div className="text-center">
              <span className="block text-2xl font-bold">{cabDays}</span>
              <span className="text-xs text-muted-foreground">{cabDays === 1 ? "day" : "days"}</span>
            </div>
            <button
              type="button"
              onClick={() => setCabDays((d) => Math.min(30, d + 1))}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          {/* Day presets */}
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {[1, 2, 3, 4, 5, 7].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setCabDays(d)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                  cabDays === d
                    ? "bg-primary text-primary-foreground"
                    : "border border-border hover:border-primary/50"
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inclusions list */}
      <ul className="mt-4 space-y-1.5">
        {selected.includes.map((item) => (
          <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>

      <div className="my-4 border-t border-border/60" />

      {/* CTA */}
      <a
        href={buildWhatsappLink(buildMessage())}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <MessageCircle className="h-4 w-4" />
        {type === "cab"
          ? `Book Cab (${cabDays}D) on WhatsApp`
          : "Book Full Package on WhatsApp"}
      </a>

      <a
        href={`tel:${siteConfig.phoneRaw}`}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted"
      >
        <Phone className="h-4 w-4" />
        {siteConfig.phone}
      </a>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        No advance payment. Our team confirms within 2 hours.
      </p>
    </div>
  );
}
