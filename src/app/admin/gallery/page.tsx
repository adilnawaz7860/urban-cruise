"use client";

import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { adminGet, adminPost, adminDelete, adminPatch } from "@/lib/admin/api-client";

const CATEGORIES = ["destinations", "tours", "hotels", "activities", "memories"];

interface AdminGalleryItem {
  _id: string;
  url: string;
  alt: string;
  category: string;
  isActive: boolean;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<AdminGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("destinations");
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await adminGet<AdminGalleryItem[]>("/api/admin/gallery");
    setItems(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    for (const file of files) formData.append("images", file);
    formData.append("category", category);
    try {
      await adminPost("/api/admin/gallery", formData);
      setFiles([]);
      load();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    await adminDelete(`/api/admin/gallery/${id}`);
    load();
  }

  async function toggleActive(item: AdminGalleryItem) {
    await adminPatch(`/api/admin/gallery/${item._id}`, { isActive: !item.isActive });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Gallery</h1>

      <form onSubmit={handleUpload} className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-border/60 bg-background p-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select className="admin-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Images</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
        </div>
        <button
          type="submit"
          disabled={uploading || files.length === 0}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No images yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <div key={item._id} className="group relative overflow-hidden rounded-xl border border-border/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt} className="aspect-square w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => toggleActive(item)} className="rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold">
                  {item.isActive ? "Hide" : "Show"}
                </button>
                <button onClick={() => handleDelete(item._id)} className="rounded-lg bg-white/90 p-1.5">
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
              {!item.isActive && (
                <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Hidden
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
