import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import { destinations, getDestinationBySlug } from "@/lib/data/destinations";
import { packages } from "@/lib/data/packages";
import { PackageCard } from "@/components/shared/package-card";
import { formatINR } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) return {};
  return {
    title: dest.name,
    description: dest.description,
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) notFound();

  const destPackages = packages.filter((p) =>
    p.destination.toLowerCase().includes(dest.name.toLowerCase()) ||
    dest.name.toLowerCase().includes(p.destination.toLowerCase().split(",")[0])
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-72 w-full overflow-hidden sm:h-96">
        <Image src={dest.image} alt={dest.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <Link
            href="/destinations"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Destinations
          </Link>
          <h1 className="text-3xl font-bold text-white sm:text-5xl">{dest.name}</h1>
          <div className="mt-2 flex items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {dest.country}
            </span>
            <span className="flex items-center gap-1">
              <Package className="h-3.5 w-3.5" />
              {dest.packageCount} packages
            </span>
            <span>
              Starting from{" "}
              <span className="font-semibold text-teal-300">{formatINR(dest.startingPrice)}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="bg-muted/30 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="max-w-3xl text-lg text-muted-foreground">{dest.description}</p>
        </div>
      </section>

      {/* Packages */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">
          {destPackages.length > 0 ? `Tours to ${dest.name}` : "All Available Tours"}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(destPackages.length > 0 ? destPackages : packages).map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
