"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/shared/package-card";
import { useTranslation } from "@/hooks/use-translation";
import type { TourPackage } from "@/types";

export function FeaturedPackages({ packages }: { packages: TourPackage[] }) {
  const { t } = useTranslation();

  return (
    <section className="relative bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              {t.featuredPackages.title}
            </span>
            <h2 className="mt-3 max-w-xl text-3xl font-bold sm:text-4xl">
              {t.featuredPackages.subtitle}
            </h2>
          </div>
          <Button render={<Link href="/packages" />} nativeButton={false} variant="outline" className="gap-2 rounded-full">
            {t.common.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packages.slice(0, 8).map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
