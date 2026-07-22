"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminGet, adminPost, adminPatch, adminDelete } from "@/lib/admin/api-client";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Testimonial {
  _id?: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  tripName: string;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

const EMPTY: Testimonial = {
  name: "",
  location: "",
  rating: 5,
  text: "",
  tripName: "",
  isPublished: false,
  isFeatured: false,
  sortOrder: 0,
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial>(EMPTY);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await adminGet<Testimonial[]>("/api/admin/testimonials");
    setItems(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(EMPTY);
    setAvatar(null);
    setOpen(true);
  }

  function openEdit(item: Testimonial) {
    setEditing(item);
    setAvatar(null);
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const formData = new FormData();
    formData.append("data", JSON.stringify(editing));
    if (avatar) formData.append("avatar", avatar);
    try {
      if (editing._id) {
        await adminPatch(`/api/admin/testimonials/${editing._id}`, formData);
      } else {
        await adminPost("/api/admin/testimonials", formData);
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await adminDelete(`/api/admin/testimonials/${id}`);
    load();
  }

  const columns: DataTableColumn<Testimonial>[] = [
    { header: "Name", cell: (t) => <span className="font-medium">{t.name}</span> },
    { header: "Trip", cell: (t) => t.tripName },
    { header: "Rating", cell: (t) => `${t.rating} ★` },
    {
      header: "Published",
      cell: (t) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${t.isPublished ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
          {t.isPublished ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (t) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(t)} className="rounded-lg p-1.5 hover:bg-muted">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(t._id!)} className="rounded-lg p-1.5 hover:bg-muted">
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Testimonial
        </button>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No testimonials yet." />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing._id ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input className="admin-input" placeholder="Name" value={editing.name} onChange={(e) => setEditing((v) => ({ ...v, name: e.target.value }))} />
            <input className="admin-input" placeholder="Location" value={editing.location} onChange={(e) => setEditing((v) => ({ ...v, location: e.target.value }))} />
            <input className="admin-input" placeholder="Trip Name" value={editing.tripName} onChange={(e) => setEditing((v) => ({ ...v, tripName: e.target.value }))} />
            <input type="number" min={1} max={5} className="admin-input" placeholder="Rating" value={editing.rating} onChange={(e) => setEditing((v) => ({ ...v, rating: Number(e.target.value) }))} />
            <textarea className="admin-input" rows={3} placeholder="Testimonial text" value={editing.text} onChange={(e) => setEditing((v) => ({ ...v, text: e.target.value }))} />
            <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={editing.isPublished} onChange={(e) => setEditing((v) => ({ ...v, isPublished: e.target.checked }))} />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={editing.isFeatured} onChange={(e) => setEditing((v) => ({ ...v, isFeatured: e.target.checked }))} />
                Featured
              </label>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
