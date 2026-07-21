"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/use-translation";
import { pick } from "@/lib/utils";
import type { GalleryImage } from "@/types";

const categories: { value: "all" | GalleryImage["category"]; labelKey: keyof ReturnType<typeof useTranslation>["t"]["gallery"] }[] = [
  { value: "all", labelKey: "all" },
  { value: "adventure", labelKey: "adventure" },
  { value: "memories", labelKey: "memories" },
];

export function GallerySection({ images }: { images: GalleryImage[] }) {
  const { t, locale } = useTranslation();
  const [filter, setFilter] = useState<"all" | GalleryImage["category"]>("all");
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  const filtered =
    filter === "all" ? images : images.filter((img) => img.category === filter);

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {t.gallery.title}
          </span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{t.gallery.subtitle}</h2>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="flex-wrap rounded-full bg-muted p-1">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value} className="rounded-full px-4">
                {t.gallery[cat.labelKey]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((img, i) => (
          <motion.button
            key={img.id}
            type="button"
            onClick={() => setSelected(img)}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
            className={`group relative overflow-hidden rounded-xl ${i % 5 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}
          >
            <Image
              src={img.src}
              alt={pick(locale, img.alt, img.altHi)}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
              <Expand className="h-6 w-6 text-white" />
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button render={<Link href="/gallery" />} nativeButton={false} variant="outline" className="gap-2 rounded-full">
          {t.gallery.viewGallery}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent showCloseButton className="max-w-3xl border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">
            {selected ? pick(locale, selected.alt, selected.altHi) : ""}
          </DialogTitle>
          {selected && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
              <Image
                src={selected.src}
                alt={pick(locale, selected.alt, selected.altHi)}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
