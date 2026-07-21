"use client";

import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

export function LanguageToggle() {
  const { locale, toggleLocale } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label="Toggle language"
      onClick={toggleLocale}
      className="gap-1.5 rounded-full px-3"
    >
      <Languages className="h-4 w-4" />
      <span className="relative inline-flex h-4 w-10 items-center justify-center overflow-hidden text-sm font-semibold">
        <motion.span
          key={locale}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {locale === "en" ? "EN" : "हिं"}
        </motion.span>
      </span>
    </Button>
  );
}
