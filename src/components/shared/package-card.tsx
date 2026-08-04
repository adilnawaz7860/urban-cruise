"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Star, Clock, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TourPackage } from "@/types";
import { useTranslation } from "@/hooks/use-translation";
import { useCustomer } from "@/hooks/use-customer";
import { customerPost } from "@/lib/customer/api-client";
import { toast } from "@/lib/toast";
import { pick, formatINR, imgSrc, cn } from "@/lib/utils";
import { buildWhatsappLink } from "@/lib/config";

export function PackageCard({ pkg, index = 0 }: { pkg: TourPackage; index?: number }) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { customer, isLoggedIn, refetch } = useCustomer();
  const [pending, setPending] = useState(false);
  const wishlisted = customer?.wishlist.includes(pkg.id) ?? false;

  async function handleToggleWishlist() {
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setPending(true);
    try {
      await customerPost("/api/customer/wishlist", { packageId: pkg.id });
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update your wishlist");
    } finally {
      setPending(false);
    }
  }

  const whatsappMsg = `Hello, I am interested in the ${pkg.title} package. Please share complete details.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group glass-card flex flex-col overflow-hidden rounded-2xl"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={imgSrc(pkg.image)}
          alt={pick(locale, pkg.title, pkg.titleHi)}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {pkg.bestSeller && (
            <Badge className="border-0 bg-gradient-to-r from-amber-600 to-amber-400 text-background">
              {t.featuredPackages.badge}
            </Badge>
          )}
          <Badge variant="secondary" className="border-0 bg-orange-500 text-white">
            {pkg.discountPercent}% {t.common.off}
          </Badge>
        </div>

        <button
          onClick={handleToggleWishlist}
          disabled={pending}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-colors hover:bg-black/50 disabled:opacity-60"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              wishlisted ? "fill-rose-500 text-rose-500" : "text-white"
            )}
          />
        </button>

        <div className="glass absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white">
          <Clock className="h-3.5 w-3.5" />
          {pkg.durationNights}N / {pkg.durationDays}D
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {pick(locale, pkg.destination, pkg.destinationHi)}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {pkg.rating.toFixed(1)}
            <span className="text-xs font-normal text-muted-foreground">
              ({pkg.reviewCount})
            </span>
          </span>
        </div>

        <h3 className="mt-2 font-heading text-lg font-semibold leading-snug">
          <Link href={`/packages/${pkg.slug}`} className="line-clamp-1 hover:text-primary">
            {pick(locale, pkg.title, pkg.titleHi)}
          </Link>
        </h3>

        <div className="mt-4 border-t border-border/60 pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">{formatINR(pkg.price)}</span>
            <span className="text-sm text-muted-foreground line-through">
              {formatINR(pkg.originalPrice)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{t.common.perPerson}</span>
            <div className="flex items-center gap-2">
              <a
                href={buildWhatsappLink(whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.common.enquireWhatsapp}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366]/20"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <Button
                render={<Link href={`/packages/${pkg.slug}`} />}
                nativeButton={false}
                size="sm"
                className="rounded-full bg-gradient-to-r from-amber-600 to-amber-400 font-semibold text-background hover:opacity-90"
              >
                {t.common.bookNow}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
