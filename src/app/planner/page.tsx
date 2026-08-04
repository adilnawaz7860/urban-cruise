"use client";

import { useState } from "react";
import { MapPinned, Users, CalendarDays, Hotel, Utensils, Car, MessageCircle } from "lucide-react";
import { buildWhatsappLink } from "@/lib/config";
import { packages } from "@/lib/data/packages";
import { formatINR } from "@/lib/utils";

const DESTINATIONS = [...new Set(packages.map((p) => p.destination))];

const BASE_PER_DAY: Record<string, number> = {
  budget: 1200,
  standard: 2000,
  luxury: 3500,
};

const MEAL_ADD: Record<string, number> = {
  none: 0,
  breakfast: 250,
  halfboard: 600,
  fullboard: 1100,
};

const TRANSPORT_ADD: Record<string, number> = {
  none: 0,
  shared: 400,
  private: 900,
};

export default function PlannerPage() {
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(3);
  const [hotel, setHotel] = useState<"budget" | "standard" | "luxury">("standard");
  const [meals, setMeals] = useState<"none" | "breakfast" | "halfboard" | "fullboard">("breakfast");
  const [transport, setTransport] = useState<"none" | "shared" | "private">("private");

  const perPerson =
    (BASE_PER_DAY[hotel] + MEAL_ADD[meals] + TRANSPORT_ADD[transport]) * days;
  const total = perPerson * travelers;

  const whatsappMsg = `Hello Urban Cruise! I want a quote for:\n- Destination: ${destination || "Not specified"}\n- Travelers: ${travelers}\n- Days: ${days}\n- Hotel: ${hotel}\n- Meals: ${meals}\n- Transport: ${transport}\n- Estimated budget: ${formatINR(total)}\nPlease send a detailed itinerary.`;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
            <MapPinned className="h-4 w-4" />
            Plan Your Trip
          </span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Trip Planner</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Customize your perfect trip and get an instant cost estimate. Our team will finalize the
            best package for you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Form */}
          <div className="space-y-6">
            {/* Destination */}
            <div className="glass-card rounded-2xl p-6">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                <MapPinned className="h-4 w-4 text-primary" />
                Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">Select a destination...</option>
                {DESTINATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
                <option value="Custom">Custom / Other destination</option>
              </select>
            </div>

            {/* Travelers + Days */}
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Users className="h-4 w-4 text-primary" />
                  Travelers: <span className="text-primary">{travelers}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span><span>20</span>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Days: <span className="text-primary">{days}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={15}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span><span>15</span>
                </div>
              </div>
            </div>

            {/* Hotel */}
            <div className="glass-card rounded-2xl p-6">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Hotel className="h-4 w-4 text-primary" />
                Hotel Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["budget", "standard", "luxury"] as const).map((h) => (
                  <button
                    key={h}
                    onClick={() => setHotel(h)}
                    className={`rounded-xl border py-2.5 text-sm font-medium capitalize transition-colors ${
                      hotel === h
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {h === "budget" ? "3★ Budget" : h === "standard" ? "4★ Standard" : "5★ Luxury"}
                  </button>
                ))}
              </div>
            </div>

            {/* Meals */}
            <div className="glass-card rounded-2xl p-6">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Utensils className="h-4 w-4 text-primary" />
                Meal Plan
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["none", "breakfast", "halfboard", "fullboard"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMeals(m)}
                    className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                      meals === m
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {m === "none"
                      ? "No Meals"
                      : m === "breakfast"
                        ? "Breakfast"
                        : m === "halfboard"
                          ? "Half Board"
                          : "Full Board"}
                  </button>
                ))}
              </div>
            </div>

            {/* Transport */}
            <div className="glass-card rounded-2xl p-6">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Car className="h-4 w-4 text-primary" />
                Transportation
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["none", "shared", "private"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTransport(t)}
                    className={`rounded-xl border py-2.5 text-sm font-medium capitalize transition-colors ${
                      transport === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {t === "none" ? "Self" : t === "shared" ? "Shared" : "Private Cab"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Estimate card */}
          <div>
            <div className="glass-card sticky top-24 rounded-2xl p-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Estimated Cost
              </p>
              <div className="mt-4 text-5xl font-bold text-primary">{formatINR(total)}</div>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatINR(perPerson)} per person · {days} day{days !== 1 ? "s" : ""} · {travelers}{" "}
                traveler{travelers !== 1 ? "s" : ""}
              </p>

              <div className="my-6 border-t border-border/60" />

              <div className="space-y-2 text-sm text-left">
                {[
                  { label: "Destination", value: destination || "Not selected" },
                  { label: "Hotel", value: hotel === "budget" ? "3★ Budget" : hotel === "standard" ? "4★ Standard" : "5★ Luxury" },
                  { label: "Meals", value: meals === "none" ? "None" : meals === "breakfast" ? "Breakfast" : meals === "halfboard" ? "Half Board" : "Full Board" },
                  { label: "Transport", value: transport === "none" ? "Self" : transport === "shared" ? "Shared Coach" : "Private Cab" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="my-6 border-t border-border/60" />

              <a
                href={buildWhatsappLink(whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-semibold text-white shadow-lg hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                Get Detailed Quote on WhatsApp
              </a>

              <p className="mt-4 text-xs text-muted-foreground">
                * Estimate only. Final pricing confirmed by our team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
