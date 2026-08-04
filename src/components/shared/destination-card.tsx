"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Package } from "lucide-react";
import type { Destination } from "@/types";
import { useTranslation } from "@/hooks/use-translation";
import { pick, formatINR } from "@/lib/utils";

export function DestinationCard({ destination, index = 0 }: { destination: Destination; index?: number }) {
  const { t, locale } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      whileHover={{ y: -6 }}
    >
      <Link
        href={`/destinations/${destination.slug}`}
        className="group relative block aspect-[4/5] overflow-hidden rounded-2xl"
      >
        <Image
          src={destination.image}
          alt={pick(locale, destination.name, destination.nameHi)}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:translate-x-2">
          <ArrowUpRight className="h-4 w-4" />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="font-heading text-xl font-bold">
            {pick(locale, destination.name, destination.nameHi)}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/75">
            <Package className="h-3.5 w-3.5" />
            {destination.packageCount} {t.destinations.packagesAvailable}
          </p>
          <p className="mt-2 text-sm">
            <span className="text-white/70">{t.destinations.startingFrom}</span>{" "}
            <span className="font-semibold text-amber-300">
              {formatINR(destination.startingPrice)}
            </span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
