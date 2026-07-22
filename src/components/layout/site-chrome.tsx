"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsappFloatingButton } from "@/components/layout/whatsapp-floating-button";
import type { Destination } from "@/types";

export function SiteChrome({
  children,
  destinations,
}: {
  children: React.ReactNode;
  destinations: Destination[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer destinations={destinations} />
      <WhatsappFloatingButton />
    </>
  );
}
