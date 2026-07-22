"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Send, Car } from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon, XIcon } from "@/components/icons/social-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/config";
import { siteConfig } from "@/lib/config";
import { subscribeNewsletter } from "@/lib/api";
import { useTranslation } from "@/hooks/use-translation";
import { pick } from "@/lib/utils";
import type { Destination } from "@/types";

const socialLinks = [
  { icon: FacebookIcon, href: siteConfig.social.facebook, label: "Facebook" },
  { icon: InstagramIcon, href: siteConfig.social.instagram, label: "Instagram" },
  { icon: YoutubeIcon, href: siteConfig.social.youtube, label: "YouTube" },
  { icon: XIcon, href: siteConfig.social.twitter, label: "Twitter" },
];

export function Footer({ destinations }: { destinations: Destination[] }) {
  const { t, locale } = useTranslation();
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await subscribeNewsletter(email);
    if (res.ok) {
      setStatus("done");
      setStatusMsg("Subscribed! Check your inbox.");
      setEmail("");
    } else {
      setStatus("error");
      setStatusMsg(res.message || "Something went wrong.");
    }
  }

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 via-teal-500 to-teal-400 text-background shadow-lg shadow-teal-600/20">
                <Car className="h-5 w-5" strokeWidth={2.5} />
              </span>
              Urban <span className="text-gradient-gold">Cruise</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t.footer.description}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide">
              {t.footer.quickLinks}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t.nav[link.key as keyof typeof t.nav]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Destinations */}
          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide">
              {t.footer.topDestinations}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {destinations.slice(0, 6).map((dest) => (
                <li key={dest.id}>
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {pick(locale, dest.name, dest.nameHi)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide">
              {t.footer.contactInfo}
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{t.footer.address}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href={`tel:${siteConfig.phoneRaw}`} className="hover:text-primary">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-primary">
                  {siteConfig.email}
                </a>
              </li>
            </ul>

            <h3 className="mt-6 font-heading text-sm font-semibold tracking-wide">
              {t.footer.newsletter}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{t.footer.newsletterDesc}</p>
            <form className="mt-3 flex items-center gap-2" onSubmit={handleSubscribe}>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footer.newsletterPlaceholder}
                className="h-10 bg-background"
              />
              <Button
                type="submit"
                size="icon"
                disabled={status === "loading"}
                aria-label={t.footer.subscribe}
                className="h-10 w-10 shrink-0 bg-gradient-to-r from-teal-600 to-teal-400 text-background hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            {statusMsg && (
              <p className={`mt-2 text-xs ${status === "error" ? "text-destructive" : "text-green-600"}`}>
                {statusMsg}
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            &copy; {year} {siteConfig.name}. {t.footer.rights}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              {t.footer.privacyPolicy}
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
              {t.footer.termsOfService}
            </Link>
            <Link href="/sitemap" className="text-sm text-muted-foreground hover:text-primary">
              {t.footer.sitemap}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
