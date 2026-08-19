import type { ComponentProps } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link href="/" className={cn("flex items-center", className)} {...props}>
      {/* Dark text on car icon — shown on light backgrounds (light theme) */}
      <Image
        src="/logo-on-light.png"
        alt="Urban Cruise"
        width={210}
        height={72}
        priority
        className="h-9 w-auto dark:hidden"
      />
      {/* White text on car icon — shown on dark backgrounds (dark theme) */}
      <Image
        src="/logo-on-dark.png"
        alt="Urban Cruise"
        width={210}
        height={72}
        priority
        className="hidden h-9 w-auto dark:block"
      />
    </Link>
  );
}
