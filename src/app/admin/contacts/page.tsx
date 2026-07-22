"use client";

import { useEffect, useState } from "react";
import { adminGet, adminPatch } from "@/lib/admin/api-client";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await adminGet<Contact[]>("/api/admin/contacts?limit=100");
    setItems(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: string) {
    await adminPatch(`/api/admin/contacts/${id}/read`);
    load();
  }

  const columns: DataTableColumn<Contact>[] = [
    { header: "Name", cell: (c) => <span className="font-medium">{c.name}</span> },
    { header: "Email", cell: (c) => c.email },
    { header: "Phone", cell: (c) => c.phone || "—" },
    { header: "Message", cell: (c) => <span className="line-clamp-2 max-w-xs">{c.message}</span> },
    { header: "Date", cell: (c) => new Date(c.createdAt).toLocaleDateString("en-IN") },
    {
      header: "Status",
      cell: (c) =>
        c.isRead ? (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">Read</span>
        ) : (
          <button
            onClick={() => markRead(c._id)}
            className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
          >
            Mark as read
          </button>
        ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Contact Messages</h1>
      <div className="mt-6">
        <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No contact messages yet." />
      </div>
    </div>
  );
}
