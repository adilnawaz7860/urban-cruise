"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { buildWhatsappLink, siteConfig } from "@/lib/config";
import { useTranslation } from "@/hooks/use-translation";

export function ContactCta() {
  const { t } = useTranslation();

  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 px-6 py-14 text-center shadow-2xl shadow-teal-600/20 sm:px-12 sm:py-20"
      >
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          <h2 className="text-3xl font-bold text-background sm:text-4xl lg:text-5xl">
            {t.contactCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-background/80">
            {t.contactCta.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildWhatsappLink(t.whatsapp.defaultMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-transform hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              {t.contactCta.whatsapp}
            </a>
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-lg shadow-black/10 transition-transform hover:scale-105"
            >
              <Phone className="h-4 w-4" />
              {t.contactCta.call}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2 rounded-full border-2 border-background/40 px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-background/10"
            >
              <Mail className="h-4 w-4" />
              {t.contactCta.email}
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
