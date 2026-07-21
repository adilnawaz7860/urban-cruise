"use client";

import { useLanguageStore } from "@/store/language-store";
import { translations } from "@/lib/i18n/translations";

export function useTranslation() {
  const locale = useLanguageStore((s) => s.locale);
  const setLocale = useLanguageStore((s) => s.setLocale);
  const toggleLocale = useLanguageStore((s) => s.toggleLocale);

  return {
    t: translations[locale],
    locale,
    setLocale,
    toggleLocale,
  };
}
