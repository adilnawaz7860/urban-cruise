"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Car, Package, MessageCircle, Minus, Plus, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { buildWhatsappLink } from "@/lib/config";

type BookType = "full" | "cab";

const CAB_RATE_PER_DAY = 1200;

const POPULAR_DESTINATIONS = [
  "Varanasi", "Ayodhya", "Prayagraj", "Mathura / Vrindavan",
  "Agra", "Lucknow", "Nainital", "Shimla",
];

export function QuickBookSection() {
  const [type, setType] = useState<BookType>("full");
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(2);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const estimatedPrice = CAB_RATE_PER_DAY * days;

  const filteredSuggestions = destination.length > 0
    ? POPULAR_DESTINATIONS.filter((d) =>
        d.toLowerCase().includes(destination.toLowerCase())
      )
    : POPULAR_DESTINATIONS;

  function buildCabMessage() {
    const dest = destination.trim() || "my destination";
    return `Hello, I need a *Cab Only* booking.\n\n📍 Destination: ${dest}\n📅 Days required: ${days} day${days > 1 ? "s" : ""}\n💰 Estimated budget: ₹${estimatedPrice.toLocaleString("en-IN")}\n\nPlease confirm cab availability and share the exact fare.`;
  }

  return (
    <section className="relative bg-muted/40 py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Quick Booking
          </span>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            What are you looking for?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Choose a full package — or just a cab. We handle both.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 rounded-2xl border border-border/60 bg-background shadow-sm"
        >
          {/* Toggle */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-t-2xl border-b border-border/60 bg-border/60">
            {(["full", "cab"] as BookType[]).map((opt) => {
              const Icon = opt === "full" ? Package : Car;
              const label = opt === "full" ? "Full Package" : "Cab Only";
              const sub = opt === "full" ? "Hotel + Cab + Meals + Guide" : "Transport only — no hotel";
              return (
                <button
                  key={opt}
                  onClick={() => setType(opt)}
                  className={`flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                    type === opt
                      ? "bg-primary/8 text-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      type === opt ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-sm sm:text-base">{label}</span>
                    <span className="block text-xs opacity-70">{sub}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Body */}
          <div className="p-6">
            {type === "full" ? (
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                <div className="flex-1">
                  <p className="font-medium">Browse our curated tour packages</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Hotel, cab, meals & guide — all included. Starting from ₹2,999/person.
                  </p>
                </div>
                <Link
                  href="/packages"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  View All Packages
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Destination */}
                <div className="relative">
                  <label className="mb-1.5 block text-sm font-medium">
                    Where do you want to go?
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => { setDestination(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      placeholder="e.g. Varanasi, Ayodhya, Agra…"
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
                      {filteredSuggestions.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onMouseDown={() => { setDestination(d); setShowSuggestions(false); }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted"
                        >
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          {d}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Days selector */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    How many days do you need the cab?
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setDays((d) => Math.max(1, d - 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-16 text-center text-lg font-bold">
                        {days} {days === 1 ? "day" : "days"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDays((d) => Math.min(30, d + 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-xl font-bold text-primary">
                        ≈ ₹{estimatedPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ₹{CAB_RATE_PER_DAY.toLocaleString("en-IN")}/day · final price on WhatsApp
                      </span>
                    </div>
                  </div>

                  {/* Quick day presets */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 7].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDays(d)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          days === d
                            ? "bg-primary text-primary-foreground"
                            : "border border-border hover:border-primary/50 hover:text-foreground"
                        }`}
                      >
                        {d}D
                      </button>
                    ))}
                  </div>
                </div>

                {/* Book button */}
                <a
                  href={buildWhatsappLink(buildCabMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Book Cab for {days} {days === 1 ? "Day" : "Days"} on WhatsApp
                </a>
                <p className="text-center text-xs text-muted-foreground">
                  No advance payment · Driver assigned within 2 hours
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
