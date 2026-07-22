"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import type { GalleryImage } from "@/types";

type GalleryCategory = "all" | "adventure" | "memories";

const TABS: { label: string; value: GalleryCategory }[] = [
  { label: "All", value: "all" },
  { label: "Adventure Trips", value: "adventure" },
  { label: "Customer Memories", value: "memories" },
];

export function GalleryPageClient({ images }: { images: GalleryImage[] }) {
  const { t } = useTranslation();
  const [active, setActive] = useState<GalleryCategory>("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered =
    active === "all" ? images : images.filter((img) => img.category === active);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
            <Camera className="h-4 w-4" />
            Photography
          </span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{t.gallery.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t.gallery.subtitle}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActive(tab.value)}
                className={`shrink-0 border-b-2 py-3 text-sm font-medium transition-colors ${
                  active === tab.value
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {filtered.map((img) => (
            <button
              key={img.id}
              onClick={() => setLightbox(img.src)}
              className="group mb-4 block w-full overflow-hidden rounded-xl"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl w-full overflow-hidden rounded-xl">
            <Image
              src={lightbox}
              alt="Gallery photo"
              width={1200}
              height={900}
              className="h-full w-full object-contain"
            />
          </div>
          <button
            className="absolute right-4 top-4 text-white/70 hover:text-white text-2xl font-light"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
