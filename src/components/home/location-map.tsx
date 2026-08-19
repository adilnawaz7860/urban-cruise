"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { siteConfig } from "@/lib/config";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.4500336747615!2d81.01385957522233!3d26.857439376680173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be34456399d33%3A0xe7af4fee4ebe0368!2sUrban%20Cruise%20in%20Lucknow%20%7C%20Travel%20Agent%20Lucknow!5e0!3m2!1sen!2sin!4v1787127959297!5m2!1sen!2sin";

export function LocationMap() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
          <MapPin className="h-4 w-4" />
          Find Us
        </span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Visit Our Office</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{siteConfig.address}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-8 overflow-hidden rounded-2xl border border-border/60 shadow-sm"
      >
        <iframe
          src={MAP_EMBED_SRC}
          className="h-80 w-full sm:h-96"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          title="Urban Cruise office location"
        />
      </motion.div>
    </section>
  );
}
