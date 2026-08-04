import Image from "next/image";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { siteConfig, buildWhatsappLink } from "@/lib/config";
import type { ServiceItem } from "@/lib/data/services";

export function ServicePage({ service }: { service: ServiceItem }) {
  const whatsappMsg = `Hello Urban Cruise! I'm interested in your ${service.title} service. Please share more details.`;
  const Icon = service.icon;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
                <Icon className="h-4 w-4" />
                Our Services
              </span>
              <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">{service.title}</h1>
              <p className="mt-4 text-lg text-muted-foreground">{service.subtitle}</p>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={buildWhatsappLink(whatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enquire on WhatsApp
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
              <Image src={service.heroImage} alt={service.title} fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Why Choose Us</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Here&apos;s what you can expect from our {service.title.toLowerCase()}.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.features.map((feature) => (
            <div key={feature.title} className="glass-card rounded-2xl p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="glass-card flex flex-col items-center gap-4 rounded-2xl p-8 text-center">
          <Icon className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold">Ready to Book {service.title}?</h2>
          <p className="max-w-xl text-muted-foreground">
            Message us on WhatsApp or call directly — our team responds within minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={buildWhatsappLink(whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              WhatsApp Us
            </a>
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:bg-muted"
            >
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
