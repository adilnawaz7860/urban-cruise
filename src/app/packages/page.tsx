"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { PackageCard } from "@/components/shared/package-card";
import { fetchPackages } from "@/lib/api";
import { useTranslation } from "@/hooks/use-translation";
import type { TourPackage, PackageCategory } from "@/types";

const CATEGORIES: { label: string; value: PackageCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Family", value: "family" },
  { label: "Adventure", value: "adventure" },
  { label: "Group", value: "group" },
  { label: "Honeymoon", value: "honeymoon" },
  { label: "Domestic", value: "domestic" },
];

export default function PackagesPage() {
  const { t } = useTranslation();
  const [allPackages, setAllPackages] = useState<TourPackage[]>([]);
  const [activeCategory, setActiveCategory] = useState<PackageCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages({ limit: "100" }).then((pkgs) => {
      setAllPackages(pkgs);
      setLoading(false);
    });
  }, []);

  const filtered = allPackages.filter((pkg) => {
    const matchesCategory =
      activeCategory === "all" || pkg.categories.includes(activeCategory as PackageCategory);
    const matchesQuery =
      query === "" ||
      pkg.title.toLowerCase().includes(query.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
            <SlidersHorizontal className="h-4 w-4" />
            All Tour Packages
          </span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{t.featuredPackages.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t.featuredPackages.subtitle}
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-sm">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-40 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-foreground/70 hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">
            No packages found{query ? ` for "${query}"` : ""}. Try a different search.
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              Showing {filtered.length} package{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((pkg, i) => (
                <PackageCard key={pkg.id} pkg={pkg} index={i} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
