import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { siteConfig, buildWhatsappLink } from "@/lib/config";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Urban Cruise — Lucknow's trusted travel agency. WhatsApp, call or email us anytime.",
};

const CONTACT_ITEMS = [
  {
    icon: Phone,
    label: "Call / WhatsApp",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phoneRaw}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: MapPin,
    label: "Office Address",
    value: siteConfig.address,
    href: "https://maps.google.com/?q=Vineet+Khand+6+Gomti+Nagar+Lucknow",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon – Sun: 6:00 AM – 11:00 PM",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
            <MessageCircle className="h-4 w-4" />
            Get In Touch
          </span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We&apos;re available 7 days a week. Reach out on WhatsApp for the fastest response — usually within minutes.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Contact Information</h2>

            <div className="space-y-4">
              {CONTACT_ITEMS.map((item) => (
                <div key={item.label} className="glass-card flex items-start gap-4 rounded-2xl p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="mt-0.5 font-medium hover:text-primary"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={buildWhatsappLink(
                "Hello Urban Cruise! I have a query about your tour packages."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] py-4 text-base font-semibold text-white shadow-lg shadow-green-500/25 transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp Now
            </a>

            {/* Social links */}
            <div className="flex flex-wrap gap-3">
              {Object.entries(siteConfig.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium capitalize transition-colors hover:bg-muted"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>

          {/* Quick inquiry form */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold">Send a Quick Inquiry</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill this form and we&apos;ll call you back within 2 hours.
            </p>

            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
