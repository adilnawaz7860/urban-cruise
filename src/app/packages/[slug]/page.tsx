import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { fetchPackageBySlug, fetchPackages } from "@/lib/api";
import { BookingCard } from "@/components/shared/booking-card";
import { EnquiryForm } from "@/components/shared/enquiry-form";
import { formatINR } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await fetchPackageBySlug(slug);
  if (!pkg) return {};
  return {
    title: pkg.title,
    description: `${pkg.durationNights}N/${pkg.durationDays}D tour to ${pkg.destination} starting from ${formatINR(pkg.price)} per person. Book with Urban Cruise.`,
  };
}

const DEFAULT_INCLUSIONS = [
  "Accommodation on twin/double sharing basis",
  "Daily breakfast at hotel",
  "All transfers & sightseeing by private cab",
  "Experienced local guide",
  "Toll charges, parking & driver allowance",
  "Urban Cruise travel coordinator — 24/7",
];

const DEFAULT_EXCLUSIONS = [
  "Airfare / train tickets",
  "Lunch & dinner",
  "Monument entry fees",
  "Personal expenses & tips",
];

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await fetchPackageBySlug(slug);
  if (!pkg) notFound();

  const allPackages = await fetchPackages({ limit: "20" });
  const related = allPackages
    .filter((p) => p.slug !== slug && p.categories.some((c) => pkg.categories.includes(c)))
    .slice(0, 3);

  // Use backend itinerary if available, otherwise generate placeholder days
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawPkg = pkg as any;
  const itinerary: { day: number; title: string; description: string }[] =
    rawPkg._itinerary?.length
      ? rawPkg._itinerary
      : Array.from({ length: pkg.durationDays }, (_, i) => ({
          day: i + 1,
          title:
            i === 0
              ? `Arrival in ${pkg.destination}`
              : i === pkg.durationDays - 1
                ? "Departure Day"
                : `Sightseeing in ${pkg.destination}`,
          description:
            i === 0
              ? `Arrive at ${pkg.destination}, check-in to hotel. Evening leisure time and welcome briefing by your Urban Cruise coordinator.`
              : i === pkg.durationDays - 1
                ? "Breakfast at hotel. Check-out and departure transfer. Tour ends with unforgettable memories."
                : `Full-day guided sightseeing covering all major attractions. Meals and transfers as per package.`,
        }));

  const inclusions: string[] = rawPkg.inclusions?.length ? rawPkg.inclusions : DEFAULT_INCLUSIONS;
  const exclusions: string[] = rawPkg.exclusions?.length ? rawPkg.exclusions : DEFAULT_EXCLUSIONS;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-80 w-full overflow-hidden sm:h-105">
        <Image src={pkg.image} alt={pkg.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <Link
            href="/packages"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Packages
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
            {pkg.bestSeller && (
              <span className="rounded-full bg-teal-600 px-2.5 py-0.5 font-semibold text-white">
                Best Seller
              </span>
            )}
            {pkg.discountPercent > 0 && (
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 backdrop-blur-sm">
                {pkg.discountPercent}% OFF
              </span>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{pkg.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {pkg.destination}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {pkg.durationNights}N / {pkg.durationDays}D
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {pkg.rating.toFixed(1)} ({pkg.reviewCount} reviews)
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <div>
              <h2 className="text-xl font-bold">Package Overview</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Experience the best of {pkg.destination} with Urban Cruise&apos;s expertly curated{" "}
                {pkg.durationNights}-night package. Ideal for {pkg.categories.join(", ")} travelers,
                this tour covers all major highlights with comfortable accommodation, private
                transfers and a dedicated guide — ensuring a smooth and memorable journey.
              </p>
            </div>

            {/* Itinerary */}
            <div>
              <h2 className="text-xl font-bold">Day-by-Day Itinerary</h2>
              <div className="mt-4 space-y-0">
                {itinerary.map((day, i) => (
                  <div key={day.day} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {day.day}
                      </div>
                      {i < itinerary.length - 1 && (
                        <div className="mt-1 h-full min-h-8 w-px bg-border" />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold">Day {day.day} — {day.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {day.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions / Exclusions */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h2 className="text-xl font-bold">What&apos;s Included</h2>
                <ul className="mt-4 space-y-2">
                  {inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold">Not Included</h2>
                <ul className="mt-4 space-y-2">
                  {exclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Booking card with service selector */}
          <div className="space-y-6">
            <BookingCard
              title={pkg.title}
              destination={pkg.destination}
              durationNights={pkg.durationNights}
              durationDays={pkg.durationDays}
              price={pkg.price}
              originalPrice={pkg.originalPrice}
              discountPercent={pkg.discountPercent}
            />
            <EnquiryForm packageId={pkg.id} packageTitle={pkg.title} destination={pkg.destination} />
          </div>
        </div>

        {/* Related packages */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold">You Might Also Like</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <div key={p.id} className="glass-card overflow-hidden rounded-2xl">
                  <div className="relative h-44">
                    <Image src={p.image} alt={p.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold leading-snug">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {p.durationNights}N / {p.durationDays}D · {p.destination}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-bold text-primary">{formatINR(p.price)}</span>
                      <Link
                        href={`/packages/${p.slug}`}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
