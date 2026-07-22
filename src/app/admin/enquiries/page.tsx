"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { adminGet, adminPatch, adminDelete } from "@/lib/admin/api-client";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  message: string;
  status: "new" | "read" | "replied" | "closed";
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Enquiry | null>(null);

  async function load() {
    setLoading(true);
    const res = await adminGet<Enquiry[]>("/api/admin/enquiries?limit=100");
    setItems(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function viewDetail(id: string) {
    const res = await adminGet<Enquiry>(`/api/admin/enquiries/${id}`);
    setSelected(res.data);
    load();
  }

  async function updateStatus(status: Enquiry["status"]) {
    if (!selected) return;
    const res = await adminPatch<Enquiry>(`/api/admin/enquiries/${selected._id}`, { status });
    setSelected(res.data);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    await adminDelete(`/api/admin/enquiries/${id}`);
    setSelected(null);
    load();
  }

  const columns: DataTableColumn<Enquiry>[] = [
    { header: "Name", cell: (e) => <span className="font-medium">{e.name}</span> },
    { header: "Destination", cell: (e) => e.destination || "—" },
    { header: "Phone", cell: (e) => e.phone || "—" },
    {
      header: "Status",
      cell: (e) => (
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold capitalize">{e.status}</span>
      ),
    },
    { header: "Date", cell: (e) => new Date(e.createdAt).toLocaleDateString("en-IN") },
    {
      header: "Actions",
      cell: (e) => (
        <div className="flex items-center gap-2">
          <button onClick={() => viewDetail(e._id)} className="rounded-lg p-1.5 hover:bg-muted">
            <Eye className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(e._id)} className="rounded-lg p-1.5 hover:bg-muted">
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Enquiries</h1>
      <div className="mt-6">
        <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No enquiries yet." />
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Enquiry Details</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="space-y-3 p-4 text-sm">
              <Row label="Name" value={selected.name} />
              <Row label="Email" value={selected.email} />
              <Row label="Phone" value={selected.phone} />
              <Row label="Destination" value={selected.destination} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</p>
                <p className="mt-1 whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
                <select
                  className="admin-input"
                  value={selected.status}
                  onChange={(e) => updateStatus(e.target.value as Enquiry["status"])}
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}
