"use client";

import { useEffect, useState } from "react";
import { adminGet, adminPut } from "@/lib/admin/api-client";

interface SettingsValues {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  social: { facebook: string; instagram: string; youtube: string; twitter: string };
  stats: { happyCustomers: number; toursCompleted: number; destinationsCovered: number; yearsOfExperience: number };
}

export default function AdminSettingsPage() {
  const [values, setValues] = useState<SettingsValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    adminGet<SettingsValues>("/api/admin/settings").then((res) => setValues(res.data));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;
    setSaving(true);
    setSavedMsg("");
    const formData = new FormData();
    formData.append("data", JSON.stringify(values));
    try {
      const res = await adminPut<SettingsValues>("/api/admin/settings", formData);
      setValues(res.data);
      setSavedMsg("Settings saved.");
    } finally {
      setSaving(false);
    }
  }

  if (!values) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Site Settings</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="rounded-2xl border border-border/60 bg-background p-6">
          <h2 className="font-semibold">General</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Site Name">
              <input className="admin-input" value={values.siteName} onChange={(e) => setValues({ ...values, siteName: e.target.value })} />
            </Field>
            <Field label="Tagline">
              <input className="admin-input" value={values.tagline} onChange={(e) => setValues({ ...values, tagline: e.target.value })} />
            </Field>
            <Field label="Email">
              <input className="admin-input" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <input className="admin-input" value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} />
            </Field>
            <Field label="WhatsApp Number">
              <input className="admin-input" value={values.whatsapp} onChange={(e) => setValues({ ...values, whatsapp: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Address">
              <textarea className="admin-input" rows={2} value={values.address} onChange={(e) => setValues({ ...values, address: e.target.value })} />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background p-6">
          <h2 className="font-semibold">Social Links</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(["facebook", "instagram", "youtube", "twitter"] as const).map((key) => (
              <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                <input
                  className="admin-input"
                  value={values.social[key]}
                  onChange={(e) => setValues({ ...values, social: { ...values.social, [key]: e.target.value } })}
                />
              </Field>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background p-6">
          <h2 className="font-semibold">Homepage Stats</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            <Field label="Happy Customers">
              <input type="number" className="admin-input" value={values.stats.happyCustomers} onChange={(e) => setValues({ ...values, stats: { ...values.stats, happyCustomers: Number(e.target.value) } })} />
            </Field>
            <Field label="Tours Completed">
              <input type="number" className="admin-input" value={values.stats.toursCompleted} onChange={(e) => setValues({ ...values, stats: { ...values.stats, toursCompleted: Number(e.target.value) } })} />
            </Field>
            <Field label="Destinations Covered">
              <input type="number" className="admin-input" value={values.stats.destinationsCovered} onChange={(e) => setValues({ ...values, stats: { ...values.stats, destinationsCovered: Number(e.target.value) } })} />
            </Field>
            <Field label="Years of Experience">
              <input type="number" className="admin-input" value={values.stats.yearsOfExperience} onChange={(e) => setValues({ ...values, stats: { ...values.stats, yearsOfExperience: Number(e.target.value) } })} />
            </Field>
          </div>
        </div>

        {savedMsg && <p className="text-sm text-green-600">{savedMsg}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
