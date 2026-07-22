"use client";

import { useEffect, useState } from "react";
import { Package, BookOpen, Inbox, Users } from "lucide-react";
import { adminGet } from "@/lib/admin/api-client";

interface DashboardStats {
  packages: { total: number; published: number };
  blogs: { total: number; published: number };
  enquiries: { total: number; unread: number };
  contacts: { unread: number };
  subscribers: { active: number };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminGet<DashboardStats>("/api/admin/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "Packages",
      value: stats ? `${stats.packages.published} / ${stats.packages.total}` : "—",
      sub: "published / total",
      icon: Package,
    },
    {
      label: "Blog Posts",
      value: stats ? `${stats.blogs.published} / ${stats.blogs.total}` : "—",
      sub: "published / total",
      icon: BookOpen,
    },
    {
      label: "Enquiries",
      value: stats ? String(stats.enquiries.unread) : "—",
      sub: "unread",
      icon: Inbox,
    },
    {
      label: "Newsletter",
      value: stats ? String(stats.subscribers.active) : "—",
      sub: "active subscribers",
      icon: Users,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of your site content and activity.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border/60 bg-background p-6">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <card.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="text-xs text-muted-foreground/70">{card.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
