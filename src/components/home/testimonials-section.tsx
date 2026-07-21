"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star, PlayCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { testimonials } from "@/lib/data/testimonials";
import { useTranslation } from "@/hooks/use-translation";
import { pick } from "@/lib/utils";

export function TestimonialsSection() {
  const { t, locale } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {t.testimonials.title}
          </span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{t.testimonials.subtitle}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12"
        >
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {testimonials.map((item) => (
                <CarouselItem key={item.id} className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3">
                  <div className="glass-card flex h-full flex-col rounded-2xl p-6">
                    <Quote className="h-8 w-8 text-primary/40" />
                    <div className="mt-3 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < item.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {pick(locale, item.text, item.textHi)}
                    </p>
                    <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                        <Image src={item.avatar} alt={item.name} fill className="object-cover" sizes="44px" />
                        {item.isVideo && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <PlayCircle className="h-5 w-5 text-white" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{item.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {pick(locale, item.location, item.locationHi)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="mt-3 w-fit text-xs font-normal">
                      {pick(locale, item.tripName, item.tripNameHi)}
                    </Badge>
                    {item.isVideo && (
                      <span className="mt-2 inline-flex w-fit items-center gap-1 text-xs font-medium text-primary">
                        <PlayCircle className="h-3.5 w-3.5" />
                        {t.testimonials.watchVideo}
                      </span>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-6 flex items-center justify-center gap-3">
              <CarouselPrevious className="static translate-y-0 rounded-full" />
              <CarouselNext className="static translate-y-0 rounded-full" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
