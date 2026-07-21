import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Car, Shield, Clock, ThumbsUp, MapPin, Phone } from "lucide-react";
import { siteConfig, buildWhatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Urban Cruise — Lucknow's trusted travel agency since 2018. Learn our story, our team and why thousands of families choose us.",
};

const VALUES = [
  {
    icon: Car,
    title: "Clean & Comfortable Cars",
    desc: "Every vehicle is sanitised before every trip. We maintain a diverse fleet from Sedans to SUVs.",
  },
  {
    icon: Shield,
    title: "Safe & Trusted",
    desc: "All drivers are verified, trained and licensed. Your family's safety is our first priority.",
  },
  {
    icon: Clock,
    title: "Always On Time",
    desc: "Punctuality is non-negotiable. We track every booking to ensure on-time pick-ups and drops.",
  },
  {
    icon: ThumbsUp,
    title: "Transparent Pricing",
    desc: "No hidden charges. What we quote is what you pay — full breakdown before you book.",
  },
];

const TEAM = [
  {
    name: "Adil Khan",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Priya Sharma",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Rohit Verma",
    role: "Senior Tour Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
  },
];

export default function AboutPage() {
  const whatsappMsg = "Hello, I'd like to know more about Urban Cruise services.";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Our Story
              </span>
              <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
                Lucknow&apos;s Most Trusted
                <span className="block text-primary">Travel Partner</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                Founded in 2018 by Adil Khan in Gomti Nagar, Urban Cruise started with a single cab
                and one simple goal — make travel from Lucknow stress-free. Today we serve 3,200+
                happy customers with a fleet of clean, well-maintained vehicles and a dedicated team
                that cares about every trip like it&apos;s their own.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={buildWhatsappLink(whatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90"
                >
                  Chat With Us
                </a>
                <a
                  href={`tel:${siteConfig.phoneRaw}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-muted"
                >
                  <Phone className="h-4 w-4" />
                  {siteConfig.phone}
                </a>
              </div>
            </div>
            <div className="relative h-80 overflow-hidden rounded-2xl lg:h-96">
              <Image
                src="https://images.unsplash.com/photo-1562887009-4d8fe8b8b891?q=80&w=1200&auto=format&fit=crop"
                alt="Urban Cruise team in Lucknow"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/60 bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
            {[
              { num: "3,200+", label: "Happy Customers" },
              { num: "4,800+", label: "Tours Completed" },
              { num: "28", label: "Destinations" },
              { num: "8 yrs", label: "Experience" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-primary">{s.num}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">What Sets Us Apart</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            We&apos;ve built our reputation one trip at a time — on trust, comfort and honest service.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="glass-card rounded-2xl p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <v.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Meet Our Team</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              People who pour their heart into making your journey perfect.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            {TEAM.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full ring-4 ring-primary/20">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="mt-4 font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="glass-card flex flex-col items-center gap-4 rounded-2xl p-8 text-center">
          <MapPin className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold">Find Us in Lucknow</h2>
          <p className="text-muted-foreground">{siteConfig.address}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Get Directions
            </Link>
            <a
              href={buildWhatsappLink(whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:bg-muted"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
