"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminGet, adminDelete } from "@/lib/admin/api-client";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";

interface AdminBlog {
  _id: string;
  title: string;
  category: string;
  status: "draft" | "published" | "scheduled";
  views: number;
}

export default function AdminBlogsPage() {
  const [items, setItems] = useState<AdminBlog[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await adminGet<AdminBlog[]>("/api/admin/blogs?limit=100&status=all");
    setItems(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this blog post?")) return;
    await adminDelete(`/api/admin/blogs/${id}`);
    load();
  }

  const columns: DataTableColumn<AdminBlog>[] = [
    { header: "Title", cell: (b) => <span className="font-medium">{b.title}</span> },
    { header: "Category", cell: (b) => b.category },
    { header: "Views", cell: (b) => b.views },
    {
      header: "Status",
      cell: (b) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            b.status === "published" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
          }`}
        >
          {b.status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (b) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/blogs/${b._id}/edit`} className="rounded-lg p-1.5 hover:bg-muted">
            <Pencil className="h-4 w-4" />
          </Link>
          <button onClick={() => handleDelete(b._id)} className="rounded-lg p-1.5 hover:bg-muted">
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No blog posts yet." />
      </div>
    </div>
  );
}
