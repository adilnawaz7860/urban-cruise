"use client";

import { useEffect, useState } from "react";
import { adminGet } from "@/lib/admin/api-client";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";

interface Subscriber {
  _id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGet<Subscriber[]>("/api/admin/newsletter?limit=200").then((res) => {
      setItems(res.data);
      setLoading(false);
    });
  }, []);

  const columns: DataTableColumn<Subscriber>[] = [
    { header: "Email", cell: (s) => <span className="font-medium">{s.email}</span> },
    { header: "Name", cell: (s) => s.name || "—" },
    {
      header: "Status",
      cell: (s) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.isActive ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
          {s.isActive ? "Active" : "Unsubscribed"}
        </span>
      ),
    },
    { header: "Subscribed", cell: (s) => new Date(s.createdAt).toLocaleDateString("en-IN") },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
      <div className="mt-6">
        <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No subscribers yet." />
      </div>
    </div>
  );
}
