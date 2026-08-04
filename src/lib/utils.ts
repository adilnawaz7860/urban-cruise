import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Locale } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Pick the localized value for the current locale (falls back to English). */
export function pick<T>(locale: Locale, en: T, hi: T): T {
  return locale === "hi" ? hi : en
}

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200&auto=format&fit=crop"

/** Guards against empty-string image URLs (e.g. content with no uploaded image yet), which next/image rejects. */
export function imgSrc(url?: string): string {
  return url || FALLBACK_IMAGE
}

export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}
