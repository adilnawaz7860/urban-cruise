"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight, MapPinned, ClipboardCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { navLinks, moreLinks } from "@/lib/config";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const allLinks = [...navLinks, ...moreLinks];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="Open menu" className="lg:hidden" />}
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="right" className="flex w-75 flex-col p-0">
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle render={<Logo />} />
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {allLinks.map((link) => {
              const active = pathname === link.href;
              const label = t.nav[link.key as keyof typeof t.nav];
              const Icon =
                link.key === "planner"
                  ? MapPinned
                  : link.key === "trackInquiry"
                    ? ClipboardCheck
                    : null;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4" />}
                      {label}
                    </span>
                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <SheetFooter className="gap-3 border-t border-border/60 px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t.nav.home === "Home" ? "Theme & Language" : "थीम और भाषा"}
            </span>
            <div className="flex items-center gap-1">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
          <Button
            render={<Link href="/packages" onClick={() => setOpen(false)} />}
            nativeButton={false}
            className="w-full bg-linear-to-r from-teal-600 to-teal-400 text-background font-semibold hover:opacity-90"
          >
            {t.nav.bookNow}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
