import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { siteConfig, buildWhatsappLink } from "@/lib/config";

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

            <form
              className="mt-6 space-y-4"
            >
              <div>
                <label className="mb-1 block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Destination of Interest</label>
                <input
                  type="text"
                  placeholder="e.g. Varanasi, Manali, Kerala..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Message (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your trip requirements..."
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <a
                href={buildWhatsappLink(
                  "Hello Urban Cruise! I just submitted an inquiry from your website. Please get in touch."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                Send via WhatsApp
              </a>
              <p className="text-center text-xs text-muted-foreground">
                You&apos;ll be redirected to WhatsApp with your inquiry pre-filled.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
