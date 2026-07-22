"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminGet, adminPost, adminPut, adminDelete } from "@/lib/admin/api-client";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatINR } from "@/lib/utils";

interface AdminDestination {
  _id?: string;
  name: string;
  nameHi: string;
  packageCount: number;
  startingPrice: number;
  description: string;
  isActive: boolean;
  sortOrder: number;
}

const EMPTY: AdminDestination = {
  name: "",
  nameHi: "",
  packageCount: 0,
  startingPrice: 0,
  description: "",
  isActive: true,
  sortOrder: 0,
};

export default function AdminDestinationsPage() {
  const [items, setItems] = useState<AdminDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminDestination>(EMPTY);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await adminGet<AdminDestination[]>("/api/admin/destinations");
    setItems(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(EMPTY);
    setImage(null);
    setOpen(true);
  }

  function openEdit(item: AdminDestination) {
    setEditing(item);
    setImage(null);
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const formData = new FormData();
    formData.append("data", JSON.stringify(editing));
    if (image) formData.append("image", image);
    try {
      if (editing._id) {
        await adminPut(`/api/admin/destinations/${editing._id}`, formData);
      } else {
        await adminPost("/api/admin/destinations", formData);
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this destination?")) return;
    await adminDelete(`/api/admin/destinations/${id}`);
    load();
  }

  const columns: DataTableColumn<AdminDestination>[] = [
    { header: "Name", cell: (d) => <span className="font-medium">{d.name}</span> },
    { header: "Packages", cell: (d) => d.packageCount },
    { header: "Starting Price", cell: (d) => formatINR(d.startingPrice) },
    {
      header: "Active",
      cell: (d) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${d.isActive ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
          {d.isActive ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (d) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(d)} className="rounded-lg p-1.5 hover:bg-muted">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(d._id!)} className="rounded-lg p-1.5 hover:bg-muted">
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Destinations</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Destination
        </button>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No destinations yet." />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing._id ? "Edit Destination" : "New Destination"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input className="admin-input" placeholder="Name (English)" value={editing.name} onChange={(e) => setEditing((v) => ({ ...v, name: e.target.value }))} />
            <input className="admin-input" placeholder="Name (Hindi)" value={editing.nameHi} onChange={(e) => setEditing((v) => ({ ...v, nameHi: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" min={0} className="admin-input" placeholder="Package Count" value={editing.packageCount} onChange={(e) => setEditing((v) => ({ ...v, packageCount: Number(e.target.value) }))} />
              <input type="number" min={0} className="admin-input" placeholder="Starting Price" value={editing.startingPrice} onChange={(e) => setEditing((v) => ({ ...v, startingPrice: Number(e.target.value) }))} />
            </div>
            <textarea className="admin-input" rows={3} placeholder="Description" value={editing.description} onChange={(e) => setEditing((v) => ({ ...v, description: e.target.value }))} />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={editing.isActive} onChange={(e) => setEditing((v) => ({ ...v, isActive: e.target.checked }))} />
              Active
            </label>
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
