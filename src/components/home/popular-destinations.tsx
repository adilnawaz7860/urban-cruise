"use client";

import { motion } from "framer-motion";
import { DestinationCard } from "@/components/shared/destination-card";
import { useTranslation } from "@/hooks/use-translation";
import type { Destination } from "@/types";

export function PopularDestinations({ destinations }: { destinations: Destination[] }) {
  const { t } = useTranslation();

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          {t.destinations.title}
        </span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{t.destinations.subtitle}</h2>
      </motion.div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        {destinations.map((dest, i) => (
          <DestinationCard key={dest.id} destination={dest} index={i} />
        ))}
      </div>
    </section>
  );
}
