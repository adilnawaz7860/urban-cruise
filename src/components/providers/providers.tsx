"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import { useLanguageStore } from "@/store/language-store";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useLanguageStore.persist.rehydrate();
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider delay={150}>
        {children}
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
