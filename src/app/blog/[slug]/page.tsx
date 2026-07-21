import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { blogs } from "@/lib/data/blogs";

interface Props {
  params: Promise<{ slug: string }>;
}

function getBlogBySlug(slug: string) {
  return blogs.find((b) => b.slug === slug);
}

export async function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  const related = blogs.filter((b) => b.id !== post.id).slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-72 w-full overflow-hidden sm:h-96">
        <Image src={post.image} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-4 pb-10 sm:px-6">
          <Link
            href="/blog"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Articles
          </Link>
          <span className="mb-3 inline-block rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
            {post.category}
          </span>
          <h1 className="text-2xl font-bold text-white sm:text-4xl leading-tight">{post.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/75">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead">{post.excerpt}</p>
          <p>
            Urban Cruise has helped thousands of travelers experience the best of India — from the
            sacred ghats of Varanasi to the snow-capped peaks of Manali. Our team of expert travel
            consultants has curated this guide based on real experiences and on-ground knowledge to
            help you plan a trip that&apos;s memorable, comfortable and budget-friendly.
          </p>
          <h2>Planning Your Trip</h2>
          <p>
            The key to a great trip is early planning. Whether you&apos;re travelling solo, with family or
            as a group, Urban Cruise offers customized packages that cover accommodation, transfers,
            sightseeing and dedicated support throughout your journey.
          </p>
          <h2>Best Time to Visit</h2>
          <p>
            Timing is everything when it comes to travel in India. Each destination has its own
            ideal season — typically post-monsoon (October to March) is ideal for most North Indian
            destinations, while South India shines between November and February.
          </p>
          <h2>What to Pack</h2>
          <p>
            Pack light and smart. Comfortable walking shoes, weather-appropriate clothing and a
            power bank are travel essentials. For pilgrimage destinations, carry modest clothing
            out of respect for local customs.
          </p>
          <h2>Book With Urban Cruise</h2>
          <p>
            Ready to make this trip happen? Browse our packages or reach us on WhatsApp at{" "}
            <a href={`https://wa.me/919260994765`} target="_blank" rel="noopener noreferrer">
              +91 92609 94765
            </a>{" "}
            for a custom quote. Our team responds within hours.
          </p>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold">You Might Also Like</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group glass-card overflow-hidden rounded-2xl"
                >
                  <div className="relative h-44">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">{p.category} · {p.readTime} min read</p>
                    <h3 className="mt-1 font-semibold leading-snug group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
