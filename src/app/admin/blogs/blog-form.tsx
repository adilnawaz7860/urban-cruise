"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminPost, adminPut } from "@/lib/admin/api-client";

const CATEGORIES = [
  "Travel Guide",
  "Pilgrimage",
  "Adventure",
  "Budget Travel",
  "Honeymoon",
  "Family Travel",
  "Tips & Tricks",
  "Destination Spotlight",
];

export interface BlogFormValues {
  _id?: string;
  title: string;
  titleHi: string;
  content: string;
  excerpt: string;
  excerptHi: string;
  category: string;
  tags: string[];
  readTime: number;
  status: "draft" | "published" | "scheduled";
  featuredImage?: { url: string };
}

const EMPTY: BlogFormValues = {
  title: "",
  titleHi: "",
  content: "",
  excerpt: "",
  excerptHi: "",
  category: "Travel Guide",
  tags: [],
  readTime: 5,
  status: "published",
};

export function BlogForm({ initial }: { initial?: BlogFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<BlogFormValues>(initial || EMPTY);
  const [tagsText, setTagsText] = useState((initial?.tags || []).join(", "));
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...values,
      tags: tagsText.split(",").map((s) => s.trim()).filter(Boolean),
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    if (image) formData.append("image", image);

    try {
      if (values._id) {
        await adminPut(`/api/admin/blogs/${values._id}`, formData);
      } else {
        await adminPost("/api/admin/blogs", formData);
      }
      router.push("/admin/blogs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save blog post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      <div className="rounded-2xl border border-border/60 bg-background p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Title (English)</label>
            <input className="admin-input" required value={values.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Title (Hindi)</label>
            <input className="admin-input" value={values.titleHi} onChange={(e) => update("titleHi", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select className="admin-input" value={values.category} onChange={(e) => update("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select className="admin-input" value={values.status} onChange={(e) => update("status", e.target.value as BlogFormValues["status"])}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Read Time (minutes)</label>
            <input type="number" min={1} className="admin-input" value={values.readTime} onChange={(e) => update("readTime", Number(e.target.value))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tags (comma separated)</label>
            <input className="admin-input" value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">Excerpt (English)</label>
          <textarea className="admin-input" rows={2} value={values.excerpt} onChange={(e) => update("excerpt", e.target.value)} />
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">Excerpt (Hindi)</label>
          <textarea className="admin-input" rows={2} value={values.excerptHi} onChange={(e) => update("excerptHi", e.target.value)} />
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">Content</label>
          <textarea className="admin-input" rows={10} required value={values.content} onChange={(e) => update("content", e.target.value)} />
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">Featured Image</label>
          {values.featuredImage?.url && !image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={values.featuredImage.url} alt="Current" className="mb-2 h-24 w-auto rounded-lg object-cover" />
          )}
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        {saving ? "Saving..." : values._id ? "Save Changes" : "Create Post"}
      </button>
    </form>
  );
}
