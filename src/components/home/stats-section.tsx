"use client";

import { motion } from "framer-motion";
import { Users, Plane, Globe2, Award } from "lucide-react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { useTranslation } from "@/hooks/use-translation";
import type { SiteStats } from "@/types";

export function StatsSection({ siteStats }: { siteStats: SiteStats }) {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, value: siteStats.happyCustomers, suffix: "+", label: t.stats.happyCustomers },
    { icon: Plane, value: siteStats.toursCompleted, suffix: "+", label: t.stats.toursCompleted },
    { icon: Globe2, value: siteStats.destinationsCovered, suffix: "+", label: t.stats.destinationsCovered },
    { icon: Award, value: siteStats.yearsOfExperience, suffix: "+", label: t.stats.yearsOfExperience },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1530] via-[#241b3d] to-[#1a1530] py-20 text-white lg:py-24">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-10" />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-amber-400">
            {t.stats.title}
          </span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{t.stats.subtitle}</h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass flex flex-col items-center rounded-2xl px-4 py-8 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 text-background">
                <stat.icon className="h-6 w-6" />
              </span>
              <p className="mt-4 font-heading text-3xl font-extrabold sm:text-4xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-white/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
