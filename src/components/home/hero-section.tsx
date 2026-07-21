"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, MapPin, Compass, Phone, Sparkles, Star, Users, Globe2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export function HeroSection() {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = query.trim() ? `?destination=${encodeURIComponent(query.trim())}` : "";
    router.push(`/packages${params}`);
  };

  const floatingStats = [
    { icon: Users, value: "48,500+", label: t.hero.stat1Label, position: "left-[2%] top-[18%] sm:left-[4%]" },
    { icon: Globe2, value: "85+", label: t.hero.stat2Label, position: "right-[2%] top-[28%] sm:right-[5%]" },
    { icon: Package, value: "500+", label: t.hero.stat3Label, position: "left-[6%] bottom-[16%] sm:left-[10%]" },
    { icon: Star, value: "4.8/5", label: t.hero.stat4Label, position: "right-[4%] bottom-[10%] sm:right-[10%]" },
  ];

  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-background">
      {/* Background image with subtle Ken Burns motion */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 16, ease: "easeOut" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2400&auto=format&fit=crop"
          alt="Scenic travel destination"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 z-[1] bg-hero-overlay" />
      <div className="absolute inset-0 z-[1] bg-grid opacity-20" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
        <motion.div
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white"
        >
          <Sparkles className="h-4 w-4 text-teal-400" />
          {t.hero.badge}
        </motion.div>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="max-w-4xl text-balance text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {t.hero.title}{" "}
          <span className="text-gradient-luxury">{t.hero.titleHighlight}</span>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-6 max-w-2xl text-balance text-base text-white/80 sm:text-lg"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* Search bar */}
        <motion.form
          custom={3}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          onSubmit={handleSearch}
          className="glass mt-10 flex w-full max-w-2xl flex-col gap-2 rounded-2xl p-2 sm:flex-row sm:items-center sm:rounded-full"
        >
          <div className="flex flex-1 items-center gap-2 px-4 py-2">
            <MapPin className="h-5 w-5 shrink-0 text-teal-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              aria-label={t.hero.searchLabel}
              className="h-9 border-0 bg-transparent p-0 text-base text-white placeholder:text-white/60 shadow-none focus-visible:ring-0"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full gap-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-400 font-semibold text-background hover:opacity-90 sm:w-auto"
          >
            <Search className="h-4 w-4" />
            {t.hero.searchButton}
          </Button>
        </motion.form>

        {/* CTAs */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            render={<a href="/packages" />}
            nativeButton={false}
            size="lg"
            className="gap-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-400 font-semibold text-background shadow-lg shadow-teal-600/25 hover:opacity-90"
          >
            <Compass className="h-4 w-4" />
            {t.hero.exploreBtn}
          </Button>
          <Button
            render={<a href="/planner" />}
            nativeButton={false}
            size="lg"
            variant="secondary"
            className="glass gap-2 rounded-full border-white/20 text-white hover:bg-white/20"
          >
            <Sparkles className="h-4 w-4" />
            {t.hero.planTripBtn}
          </Button>
          <Button
            render={<a href="/contact" />}
            nativeButton={false}
            size="lg"
            variant="ghost"
            className="gap-2 rounded-full text-white hover:bg-white/10 hover:text-white"
          >
            <Phone className="h-4 w-4" />
            {t.hero.contactBtn}
          </Button>
        </motion.div>
      </div>

      {/* Floating stat cards */}
      {floatingStats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 + i * 0.15, ease: "easeOut" }}
          className={`animate-float absolute z-10 hidden items-center gap-3 rounded-2xl px-4 py-3 glass lg:flex ${stat.position}`}
          style={{ animationDelay: `${i * 0.6}s` }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-teal-400 text-background">
            <stat.icon className="h-5 w-5" />
          </span>
          <span className="text-left">
            <span className="block text-lg font-bold leading-none text-white">{stat.value}</span>
            <span className="mt-1 block text-xs text-white/70">{stat.label}</span>
          </span>
        </motion.div>
      ))}

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
