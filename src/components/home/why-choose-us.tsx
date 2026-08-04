"use client";

import { motion } from "framer-motion";
import {
  BadgePercent,
  UserCheck,
  Hotel,
  Headset,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const icons = [BadgePercent, UserCheck, Hotel, Headset, ShieldCheck, SlidersHorizontal];

export function WhyChooseUs() {
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
          {t.whyChooseUs.title}
        </span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{t.whyChooseUs.subtitle}</h2>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {t.whyChooseUs.items.map((item, i) => {
          const Icon = icons[i];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -6 }}
              className="group glass-card relative overflow-hidden rounded-2xl p-6 transition-shadow hover:shadow-2xl hover:shadow-amber-600/10"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 text-background shadow-md shadow-amber-600/20">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="relative mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
