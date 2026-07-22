import type { Metadata } from "next";
import { DestinationCard } from "@/components/shared/destination-card";
import { fetchDestinations } from "@/lib/api";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore all destinations covered by Urban Cruise — Varanasi, Ayodhya, Lucknow, Prayagraj, Mathura, Shimla, Kasol, Kerala and more.",
};

export default async function DestinationsPage() {
  const destinations = await fetchDestinations();
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
            <MapPin className="h-4 w-4" />
            Explore India
          </span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Our Destinations</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            From sacred pilgrimage sites to hill stations and backwaters — Urban Cruise takes you everywhere with comfort and care.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {destinations.map((dest, i) => (
            <DestinationCard key={dest.id} destination={dest} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
