"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminGet, adminPost, adminPut, adminDelete } from "@/lib/admin/api-client";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AdminFaq {
  _id?: string;
  question: string;
  questionHi: string;
  answer: string;
  answerHi: string;
  sortOrder: number;
  isActive: boolean;
}

const EMPTY: AdminFaq = {
  question: "",
  questionHi: "",
  answer: "",
  answerHi: "",
  sortOrder: 0,
  isActive: true,
};

export default function AdminFaqsPage() {
  const [items, setItems] = useState<AdminFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminFaq>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await adminGet<AdminFaq[]>("/api/admin/faqs");
    setItems(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(EMPTY);
    setOpen(true);
  }

  function openEdit(item: AdminFaq) {
    setEditing(item);
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing._id) {
        await adminPut(`/api/admin/faqs/${editing._id}`, editing);
      } else {
        await adminPost("/api/admin/faqs", editing);
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await adminDelete(`/api/admin/faqs/${id}`);
    load();
  }

  const columns: DataTableColumn<AdminFaq>[] = [
    { header: "Question", cell: (f) => <span className="font-medium">{f.question}</span> },
    {
      header: "Active",
      cell: (f) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${f.isActive ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
          {f.isActive ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (f) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(f)} className="rounded-lg p-1.5 hover:bg-muted">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(f._id!)} className="rounded-lg p-1.5 hover:bg-muted">
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">FAQs</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New FAQ
        </button>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No FAQs yet." />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing._id ? "Edit FAQ" : "New FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input className="admin-input" placeholder="Question (English)" value={editing.question} onChange={(e) => setEditing((v) => ({ ...v, question: e.target.value }))} />
            <input className="admin-input" placeholder="Question (Hindi)" value={editing.questionHi} onChange={(e) => setEditing((v) => ({ ...v, questionHi: e.target.value }))} />
            <textarea className="admin-input" rows={3} placeholder="Answer (English)" value={editing.answer} onChange={(e) => setEditing((v) => ({ ...v, answer: e.target.value }))} />
            <textarea className="admin-input" rows={3} placeholder="Answer (Hindi)" value={editing.answerHi} onChange={(e) => setEditing((v) => ({ ...v, answerHi: e.target.value }))} />
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
