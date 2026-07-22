"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Copy, Eye, EyeOff } from "lucide-react";
import { adminGet, adminDelete, adminPatch, adminPost } from "@/lib/admin/api-client";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { formatINR } from "@/lib/utils";

interface AdminPackage {
  _id: string;
  title: string;
  destination: string;
  price: number;
  discountPrice: number;
  status: "draft" | "published";
  featured: boolean;
}

export default function AdminPackagesPage() {
  const [items, setItems] = useState<AdminPackage[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await adminGet<AdminPackage[]>("/api/admin/packages?limit=100");
    setItems(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this package? This cannot be undone.")) return;
    await adminDelete(`/api/admin/packages/${id}`);
    load();
  }

  async function handleToggle(id: string) {
    await adminPatch(`/api/admin/packages/${id}/toggle-status`);
    load();
  }

  async function handleDuplicate(id: string) {
    await adminPost(`/api/admin/packages/${id}/duplicate`, {});
    load();
  }

  const columns: DataTableColumn<AdminPackage>[] = [
    { header: "Title", cell: (p) => <span className="font-medium">{p.title}</span> },
    { header: "Destination", cell: (p) => p.destination },
    {
      header: "Price",
      cell: (p) => (
        <span>
          {formatINR(p.discountPrice > 0 ? p.discountPrice : p.price)}
          {p.discountPrice > 0 && (
            <span className="ml-1 text-xs text-muted-foreground line-through">{formatINR(p.price)}</span>
          )}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (p) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            p.status === "published" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
          }`}
        >
          {p.status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (p) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleToggle(p._id)} title="Toggle status" className="rounded-lg p-1.5 hover:bg-muted">
            {p.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button onClick={() => handleDuplicate(p._id)} title="Duplicate" className="rounded-lg p-1.5 hover:bg-muted">
            <Copy className="h-4 w-4" />
          </button>
          <Link href={`/admin/packages/${p._id}/edit`} title="Edit" className="rounded-lg p-1.5 hover:bg-muted">
            <Pencil className="h-4 w-4" />
          </Link>
          <button onClick={() => handleDelete(p._id)} title="Delete" className="rounded-lg p-1.5 hover:bg-muted">
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Packages</h1>
        <Link
          href="/admin/packages/new"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Package
        </Link>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No packages yet." />
      </div>
    </div>
  );
}
