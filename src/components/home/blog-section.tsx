"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { pick } from "@/lib/utils";
import type { BlogPost } from "@/types";

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  const { t, locale } = useTranslation();

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {t.blog.title}
          </span>
          <h2 className="mt-3 max-w-xl text-3xl font-bold sm:text-4xl">{t.blog.subtitle}</h2>
        </div>
        <Button render={<Link href="/blog" />} nativeButton={false} variant="outline" className="gap-2 rounded-full">
          {t.blog.viewAllPosts}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
            whileHover={{ y: -6 }}
            className="group glass-card flex flex-col overflow-hidden rounded-2xl"
          >
            <Link href={`/blog/${post.slug}`} className="relative block h-44 w-full overflow-hidden">
              <Image
                src={post.image}
                alt={pick(locale, post.title, post.titleHi)}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <Badge className="absolute left-3 top-3 border-0 bg-black/40 text-white backdrop-blur-md">
                {pick(locale, post.category, post.categoryHi)}
              </Badge>
            </Link>
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.date).toLocaleDateString(locale === "hi" ? "hi-IN" : "en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime} {t.common.minRead}
                </span>
              </div>
              <h3 className="mt-2 line-clamp-2 font-heading text-base font-semibold leading-snug">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                  {pick(locale, post.title, post.titleHi)}
                </Link>
              </h3>
              <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                {pick(locale, post.excerpt, post.excerptHi)}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                {t.common.readMore}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
