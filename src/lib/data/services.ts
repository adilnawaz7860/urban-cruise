import { Car, Building2, Heart, Crown, type LucideIcon } from "lucide-react";

export interface ServiceFeature {
  title: string;
  desc: string;
}

export interface ServiceItem {
  slug: string;
  navKey: "bookTaxi" | "corporateCarRental" | "weddingCarRental" | "luxuryCarRental";
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  features: ServiceFeature[];
}

export const services: ServiceItem[] = [
  {
    slug: "book-taxi",
    navKey: "bookTaxi",
    icon: Car,
    title: "Book Taxi Services",
    subtitle: "Reliable cabs, anytime, anywhere in Lucknow",
    description:
      "Whether it's a quick airport run, a same-day outstation trip or a daily office commute, Urban Cruise's taxi service gets you there safely and on time. Clean sedans and SUVs, verified drivers, and transparent fares — no surge pricing, no surprises.",
    heroImage:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1600&auto=format&fit=crop",
    features: [
      { title: "24/7 Availability", desc: "Book a cab any time of day or night — we're always on call." },
      { title: "Verified Drivers", desc: "Background-checked, licensed and trained for passenger safety." },
      { title: "Transparent Fares", desc: "Know your fare upfront. No hidden charges, no surge pricing." },
      { title: "Clean Vehicles", desc: "Every car is sanitised and inspected before it picks you up." },
    ],
  },
  {
    slug: "corporate-car-rental",
    navKey: "corporateCarRental",
    icon: Building2,
    title: "Corporate Car Rental",
    subtitle: "Dependable transport for your business, every day",
    description:
      "From daily employee pick-up/drop to client airport transfers and multi-city business tours, Urban Cruise partners with companies across Lucknow for dependable corporate travel. Monthly billing, dedicated account support and a fleet that scales with your team.",
    heroImage:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1600&auto=format&fit=crop",
    features: [
      { title: "Monthly Billing", desc: "Simple consolidated invoicing — no per-trip payment hassle." },
      { title: "Dedicated Account Manager", desc: "One point of contact for scheduling and support." },
      { title: "Employee Pick-up & Drop", desc: "Reliable daily commute service for your entire team." },
      { title: "Client & VIP Transfers", desc: "Premium vehicles for airport pickups and client visits." },
    ],
  },
  {
    slug: "wedding-car-rental",
    navKey: "weddingCarRental",
    icon: Heart,
    title: "Wedding Car Rental",
    subtitle: "Make your big day even more memorable",
    description:
      "Decorated cars for the baraat, comfortable sedans for family and guests, and a coordinated fleet so no one is left waiting — Urban Cruise handles the transport for your wedding so you can focus on the celebration.",
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
    features: [
      { title: "Decorated Vehicles", desc: "Flower and ribbon decoration options for the wedding car." },
      { title: "Fleet Coordination", desc: "Multiple cars scheduled together for the full wedding party." },
      { title: "Punctual Scheduling", desc: "Timed pick-ups so the baraat and guests are never late." },
      { title: "Flexible Packages", desc: "Half-day, full-day or multi-day hire to match your events." },
    ],
  },
  {
    slug: "luxury-car-rental",
    navKey: "luxuryCarRental",
    icon: Crown,
    title: "Luxury Car Rental",
    subtitle: "Premium vehicles for occasions that deserve more",
    description:
      "For airport arrivals, special occasions or clients who expect a little extra, Urban Cruise offers a premium fleet with professional chauffeurs, immaculate interiors and a smooth, first-class ride from pick-up to drop.",
    heroImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
    features: [
      { title: "Premium Fleet", desc: "Well-maintained luxury sedans and SUVs, immaculately presented." },
      { title: "Professional Chauffeurs", desc: "Courteous, trained drivers who know the city well." },
      { title: "Doorstep Pick-up", desc: "Your chauffeur waits at your exact pick-up point, on time." },
      { title: "Special Occasions", desc: "Ideal for airport arrivals, anniversaries and VIP events." },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
