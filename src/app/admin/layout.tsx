"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  BookOpen,
  Images,
  Quote,
  MapPin,
  HelpCircle,
  Inbox,
  Users,
  Settings,
  LogOut,
  Car,
} from "lucide-react";
import { adminGet, adminPost } from "@/lib/admin/api-client";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/blogs", label: "Blog Posts", icon: BookOpen },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/newsletter", label: "Subscribers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const PUBLIC_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

interface AdminInfo {
  name: string;
  email: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminInfo | null>(null);

  const isPublic = PUBLIC_PATHS.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    if (isPublic) return;
    adminGet<AdminInfo>("/api/admin/auth/me")
      .then((res) => setAdmin(res.data))
      .catch(() => {});
  }, [isPublic]);

  async function handleLogout() {
    await adminPost("/api/admin/auth/logout", {});
    router.push("/admin/login");
  }

  if (isPublic) {
    return <div className="min-h-screen bg-muted/30">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-background lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border/60 px-6 font-heading text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-amber-400 text-background">
            <Car className="h-4 w-4" strokeWidth={2.5} />
          </span>
          Admin Panel
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/60 p-4">
          <p className="truncate text-sm font-medium">{admin?.name || "..."}</p>
          <p className="truncate text-xs text-muted-foreground">{admin?.role}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border/60 bg-background px-4 lg:px-8">
          <p className="font-heading font-semibold lg:hidden">Admin Panel</p>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to site
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
