"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, MapPinned, ClipboardCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { navLinks, moreLinks } from "@/lib/config";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-sm shadow-black/5"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-foreground/75 hover:text-foreground"
                )}
              >
                {t.nav[link.key as keyof typeof t.nav]}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-teal-500 to-teal-400"
                  />
                )}
              </Link>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="gap-1 rounded-full px-3.5 text-sm font-medium text-foreground/75 hover:text-foreground"
                />
              }
            >
              {t.nav.planner}
              <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {moreLinks.map((link) => {
                const Icon = link.key === "planner" ? MapPinned : ClipboardCheck;
                return (
                  <DropdownMenuItem
                    key={link.href}
                    render={<Link href={link.href} className="flex items-center gap-2" />}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {t.nav[link.key as keyof typeof t.nav]}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="hidden items-center gap-1 sm:flex">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <Button
            render={<Link href="/packages" />}
            nativeButton={false}
            className="hidden bg-gradient-to-r from-teal-600 to-teal-400 font-semibold text-background shadow-md shadow-teal-600/20 hover:opacity-90 sm:inline-flex"
          >
            {t.nav.bookNow}
          </Button>
          <MobileNav />
        </div>
      </div>
    </motion.header>
  );
}
