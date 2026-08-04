import type { ComponentProps } from "react";
import Link from "next/link";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 font-heading font-bold", className)}
      {...props}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-amber-500 to-amber-400 text-background shadow-lg shadow-amber-600/30">
        <Car className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className="text-lg leading-tight tracking-tight">
        Urban <span className="text-gradient-gold">Cruise</span>
      </span>
    </Link>
  );
}
