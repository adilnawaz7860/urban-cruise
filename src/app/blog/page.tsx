import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock, User } from "lucide-react";
import { blogs } from "@/lib/data/blogs";

export const metadata: Metadata = {
  title: "Travel Stories & Guides",
  description:
    "Tips, inspiration and insider guides for your next adventure with Urban Cruise.",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const [featured, ...rest] = blogs;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
            <BookOpen className="h-4 w-4" />
            Travel Blog
          </span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Travel Stories &amp; Guides</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Tips, inspiration and insider guides for your next adventure
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Featured post */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-12 grid grid-cols-1 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md lg:grid-cols-2"
        >
          <div className="relative h-64 lg:h-auto">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              {featured.category}
            </span>
          </div>
          <div className="flex flex-col justify-center p-8">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {featured.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {featured.readTime} min read
              </span>
              <span>{formatDate(featured.date)}</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold leading-snug group-hover:text-primary transition-colors">
              {featured.title}
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
            <span className="mt-6 text-sm font-semibold text-primary">Read article →</span>
          </div>
        </Link>

        {/* Rest of posts */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group glass-card overflow-hidden rounded-2xl transition-shadow hover:shadow-md"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                  {post.category}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime} min
                  </span>
                </div>
                <h3 className="mt-2 font-semibold leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                <span className="mt-4 inline-block text-xs font-semibold text-primary">
                  Read more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
