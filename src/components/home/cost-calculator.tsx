"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  CalendarDays,
  Plane,
  UtensilsCrossed,
  Bus,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  calculateTripCost,
  type HotelCategory,
  type MealPlan,
  type Transportation,
} from "@/lib/calculator";
import { useTranslation } from "@/hooks/use-translation";
import { pick, formatINR, cn } from "@/lib/utils";
import { buildWhatsappLink } from "@/lib/config";
import type { Destination } from "@/types";

export function CostCalculator({ destinations }: { destinations: Destination[] }) {
  if (destinations.length === 0) return null;
  return <CostCalculatorInner destinations={destinations} />;
}

function CostCalculatorInner({ destinations }: { destinations: Destination[] }) {
  const { t, locale } = useTranslation();
  const [destinationId, setDestinationId] = useState(destinations[0].id);
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(5);
  const [hotelCategory, setHotelCategory] = useState<HotelCategory>("standard");
  const [flightsIncluded, setFlightsIncluded] = useState(true);
  const [mealPlan, setMealPlan] = useState<MealPlan>("breakfast");
  const [transportation, setTransportation] = useState<Transportation>("shared");

  const destination = destinations.find((d) => d.id === destinationId) ?? destinations[0];

  const result = useMemo(
    () =>
      calculateTripCost({
        destination,
        travelers,
        days,
        hotelCategory,
        flightsIncluded,
        mealPlan,
        transportation,
      }),
    [destination, travelers, days, hotelCategory, flightsIncluded, mealPlan, transportation]
  );

  const hotelOptions: { value: HotelCategory; label: string }[] = [
    { value: "budget", label: t.calculator.hotelBudget },
    { value: "standard", label: t.calculator.hotelStandard },
    { value: "luxury", label: t.calculator.hotelLuxury },
  ];

  const mealOptions: { value: MealPlan; label: string }[] = [
    { value: "none", label: t.calculator.mealNone },
    { value: "breakfast", label: t.calculator.mealBreakfast },
    { value: "halfBoard", label: t.calculator.mealHalfBoard },
    { value: "fullBoard", label: t.calculator.mealFullBoard },
  ];

  const transportOptions: { value: Transportation; label: string }[] = [
    { value: "none", label: t.calculator.transportNone },
    { value: "shared", label: t.calculator.transportShared },
    { value: "private", label: t.calculator.transportPrivate },
  ];

  const destinationName = pick(locale, destination.name, destination.nameHi);
  const whatsappMsg = `Hello, I'd like a detailed quote for a trip to ${destinationName} — ${travelers} traveler(s), ${days} days, ${hotelOptions.find((h) => h.value === hotelCategory)?.label} hotel. Estimated total: ${formatINR(result.total)}.`;

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          {t.calculator.title}
        </span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{t.calculator.subtitle}</h2>
      </motion.div>

      <div className="mt-12 grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="glass-card space-y-6 rounded-3xl p-6 lg:col-span-3 lg:p-8"
        >
          {/* Destination */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              {t.calculator.destination}
            </label>
            <Select value={destinationId} onValueChange={(value) => setDestinationId(value ?? destinations[0].id)}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder={t.calculator.selectDestination} />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {pick(locale, d.name, d.nameHi)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Travelers */}
            <div>
              <label className="mb-3 flex items-center justify-between text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  {t.calculator.travelers}
                </span>
                <span className="font-bold text-primary">{travelers}</span>
              </label>
              <Slider
                value={[travelers]}
                onValueChange={(value) => setTravelers(Array.isArray(value) ? value[0] : value)}
                min={1}
                max={15}
                step={1}
              />
            </div>

            {/* Days */}
            <div>
              <label className="mb-3 flex items-center justify-between text-sm font-medium">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {t.calculator.days}
                </span>
                <span className="font-bold text-primary">{days}</span>
              </label>
              <Slider
                value={[days]}
                onValueChange={(value) => setDays(Array.isArray(value) ? value[0] : value)}
                min={2}
                max={21}
                step={1}
              />
            </div>
          </div>

          {/* Hotel category */}
          <div>
            <label className="mb-2 block text-sm font-medium">{t.calculator.hotelCategory}</label>
            <div className="grid grid-cols-3 gap-2">
              {hotelOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setHotelCategory(opt.value)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                    hotelCategory === opt.value
                      ? "border-transparent bg-gradient-to-r from-amber-600 to-amber-400 text-background shadow-md shadow-amber-600/20"
                      : "border-border bg-background/40 text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Meal plan */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <UtensilsCrossed className="h-4 w-4 text-primary" />
                {t.calculator.mealPlan}
              </label>
              <Select value={mealPlan} onValueChange={(v) => setMealPlan(v as MealPlan)}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mealOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transportation */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Bus className="h-4 w-4 text-primary" />
                {t.calculator.transportation}
              </label>
              <Select
                value={transportation}
                onValueChange={(v) => setTransportation(v as Transportation)}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {transportOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Flights */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3">
            <label htmlFor="flights-switch" className="flex items-center gap-2 text-sm font-medium">
              <Plane className="h-4 w-4 text-primary" />
              {t.calculator.flightsIncluded}
            </label>
            <Switch id="flights-switch" checked={flightsIncluded} onCheckedChange={setFlightsIncluded} />
          </div>
        </motion.div>

        {/* Live price summary */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          <div className="sticky top-24 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-amber-500 to-amber-500 p-[1px] shadow-xl shadow-amber-600/20">
            <div className="rounded-[calc(1.5rem-1px)] bg-card/95 p-6 backdrop-blur-xl lg:p-8">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                {destinationName}
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <PriceRow label={t.calculator.hotelCategory} value={result.accommodation} />
                <PriceRow label={t.calculator.mealPlan} value={result.meals} />
                <PriceRow label={t.calculator.transportation} value={result.transport} />
                {flightsIncluded && <PriceRow label={t.calculator.flightsIncluded} value={result.flights} />}
              </div>

              <div className="mt-5 border-t border-dashed border-border pt-5">
                <p className="text-sm text-muted-foreground">{t.calculator.estimatedCost}</p>
                <motion.p
                  key={result.total}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-heading text-4xl font-extrabold tabular-nums text-gradient-gold"
                >
                  {formatINR(result.total)}
                </motion.p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.calculator.perPersonCost}:{" "}
                  <span className="font-semibold text-foreground">{formatINR(result.perPerson)}</span>
                </p>
              </div>

              <Button
                render={<a href={buildWhatsappLink(whatsappMsg)} target="_blank" rel="noopener noreferrer" />}
                nativeButton={false}
                size="lg"
                className="mt-6 w-full gap-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-400 font-semibold text-background hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                {t.calculator.getQuote}
              </Button>

              <p className="mt-4 text-xs text-muted-foreground">{t.calculator.priceNote}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{formatINR(value)}</span>
    </div>
  );
}
