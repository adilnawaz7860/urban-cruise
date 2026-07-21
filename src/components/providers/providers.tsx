"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLanguageStore } from "@/store/language-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useLanguageStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider delay={150}>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
