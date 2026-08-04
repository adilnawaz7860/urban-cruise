"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const DESTINATIONS = ["Ayodhya", "Varanasi", "Prayagraj", "Lucknow"];

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-background">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/lucknow.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 z-1 bg-hero-overlay" />
      <div className="absolute inset-0 z-1 bg-grid opacity-20" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
        <motion.p
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-sm font-semibold uppercase tracking-widest text-white sm:text-base"
        >
          {DESTINATIONS.join(" • ")}
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-4 max-w-3xl text-balance text-5xl font-bold leading-tight text-white sm:text-6xl md:text-7xl"
        >
          {t.hero.title}{" "}
          <span className="text-gradient-luxury">{t.hero.titleHighlight}</span>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-5 max-w-xl text-balance text-base text-white/80 sm:text-lg"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div custom={3} initial="hidden" animate="show" variants={fadeUp} className="mt-8">
          <Button
            render={<Link href="/packages" />}
            nativeButton={false}
            size="lg"
            className="rounded-full bg-gradient-to-r from-amber-600 to-amber-400 px-10 font-semibold text-background shadow-lg shadow-amber-600/25 hover:opacity-90"
          >
            {t.nav.bookNow}
          </Button>
        </motion.div>

        <motion.div
          custom={4}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-6 flex flex-col items-center gap-1.5"
        >
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Rated 4.8/5 by Travelers
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1.5">
          <motion.span
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
}
