"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { adminPost, adminPut } from "@/lib/admin/api-client";

const CATEGORIES = ["family", "honeymoon", "group", "adventure", "domestic", "pilgrimage", "weekend"] as const;

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}
interface FaqRow {
  question: string;
  answer: string;
}

export interface PackageFormValues {
  _id?: string;
  title: string;
  titleHi: string;
  destination: string;
  destinationHi: string;
  country: string;
  shortDescription: string;
  fullDescription: string;
  durationDays: number;
  durationNights: number;
  price: number;
  discountPrice: number;
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  faqs: FaqRow[];
  categories: string[];
  status: "draft" | "published";
  featured: boolean;
  bestSeller: boolean;
  coverImage?: { url: string };
}

const EMPTY: PackageFormValues = {
  title: "",
  titleHi: "",
  destination: "",
  destinationHi: "",
  country: "India",
  shortDescription: "",
  fullDescription: "",
  durationDays: 3,
  durationNights: 2,
  price: 0,
  discountPrice: 0,
  inclusions: [],
  exclusions: [],
  itinerary: [],
  faqs: [],
  categories: ["domestic"],
  status: "draft",
  featured: false,
  bestSeller: false,
};

export function PackageForm({ initial }: { initial?: PackageFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<PackageFormValues>(initial || EMPTY);
  const [inclusionsText, setInclusionsText] = useState((initial?.inclusions || []).join("\n"));
  const [exclusionsText, setExclusionsText] = useState((initial?.exclusions || []).join("\n"));
  const [cover, setCover] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof PackageFormValues>(key: K, value: PackageFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function toggleCategory(cat: string) {
    setValues((v) => ({
      ...v,
      categories: v.categories.includes(cat) ? v.categories.filter((c) => c !== cat) : [...v.categories, cat],
    }));
  }

  function addItineraryDay() {
    setValues((v) => ({
      ...v,
      itinerary: [...v.itinerary, { day: v.itinerary.length + 1, title: "", description: "", activities: [] }],
    }));
  }
  function updateItinerary(index: number, field: keyof ItineraryDay, value: string | number) {
    setValues((v) => {
      const itinerary = [...v.itinerary];
      const resolved =
        field === "activities" && typeof value === "string"
          ? value.split(",").map((s) => s.trim()).filter(Boolean)
          : value;
      itinerary[index] = { ...itinerary[index], [field]: resolved } as ItineraryDay;
      return { ...v, itinerary };
    });
  }
  function removeItinerary(index: number) {
    setValues((v) => ({ ...v, itinerary: v.itinerary.filter((_, i) => i !== index) }));
  }

  function addFaq() {
    setValues((v) => ({ ...v, faqs: [...v.faqs, { question: "", answer: "" }] }));
  }
  function updateFaq(index: number, field: keyof FaqRow, value: string) {
    setValues((v) => {
      const faqs = [...v.faqs];
      faqs[index] = { ...faqs[index], [field]: value };
      return { ...v, faqs };
    });
  }
  function removeFaq(index: number) {
    setValues((v) => ({ ...v, faqs: v.faqs.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...values,
      inclusions: inclusionsText.split("\n").map((s) => s.trim()).filter(Boolean),
      exclusions: exclusionsText.split("\n").map((s) => s.trim()).filter(Boolean),
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    if (cover) formData.append("cover", cover);
    for (const file of gallery) formData.append("gallery", file);

    try {
      if (values._id) {
        await adminPut(`/api/admin/packages/${values._id}`, formData);
      } else {
        await adminPost("/api/admin/packages", formData);
      }
      router.push("/admin/packages");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save package");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      <div className="rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="font-semibold">Basic Info</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Title (English)">
            <input className="admin-input" required value={values.title} onChange={(e) => update("title", e.target.value)} />
          </Field>
          <Field label="Title (Hindi)">
            <input className="admin-input" value={values.titleHi} onChange={(e) => update("titleHi", e.target.value)} />
          </Field>
          <Field label="Destination (English)">
            <input className="admin-input" required value={values.destination} onChange={(e) => update("destination", e.target.value)} />
          </Field>
          <Field label="Destination (Hindi)">
            <input className="admin-input" value={values.destinationHi} onChange={(e) => update("destinationHi", e.target.value)} />
          </Field>
          <Field label="Country">
            <input className="admin-input" value={values.country} onChange={(e) => update("country", e.target.value)} />
          </Field>
          <Field label="Status">
            <select className="admin-input" value={values.status} onChange={(e) => update("status", e.target.value as "draft" | "published")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Short Description">
            <textarea className="admin-input" rows={2} value={values.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Full Description">
            <textarea className="admin-input" rows={5} value={values.fullDescription} onChange={(e) => update("fullDescription", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="font-semibold">Pricing & Duration</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <Field label="Duration (Days)">
            <input type="number" min={1} className="admin-input" required value={values.durationDays} onChange={(e) => update("durationDays", Number(e.target.value))} />
          </Field>
          <Field label="Duration (Nights)">
            <input type="number" min={0} className="admin-input" required value={values.durationNights} onChange={(e) => update("durationNights", Number(e.target.value))} />
          </Field>
          <Field label="Price (₹)">
            <input type="number" min={0} className="admin-input" required value={values.price} onChange={(e) => update("price", Number(e.target.value))} />
          </Field>
          <Field label="Discount Price (₹, optional)">
            <input type="number" min={0} className="admin-input" value={values.discountPrice} onChange={(e) => update("discountPrice", Number(e.target.value))} />
          </Field>
        </div>
        <div className="mt-4 flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={values.featured} onChange={(e) => update("featured", e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={values.bestSeller} onChange={(e) => update("bestSeller", e.target.checked)} />
            Best Seller
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="font-semibold">Categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`rounded-full border px-3 py-1.5 text-sm capitalize transition-colors ${
                values.categories.includes(cat) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="font-semibold">Images</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Cover Image">
            {values.coverImage?.url && !cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={values.coverImage.url} alt="Current cover" className="mb-2 h-24 w-auto rounded-lg object-cover" />
            )}
            <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} />
          </Field>
          <Field label="Gallery Images (adds to existing)">
            <input type="file" accept="image/*" multiple onChange={(e) => setGallery(Array.from(e.target.files || []))} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="font-semibold">Inclusions & Exclusions (one per line)</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Inclusions">
            <textarea className="admin-input" rows={5} value={inclusionsText} onChange={(e) => setInclusionsText(e.target.value)} />
          </Field>
          <Field label="Exclusions">
            <textarea className="admin-input" rows={5} value={exclusionsText} onChange={(e) => setExclusionsText(e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Itinerary</h2>
          <button type="button" onClick={addItineraryDay} className="flex items-center gap-1 text-sm font-medium text-primary">
            <Plus className="h-4 w-4" /> Add Day
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {values.itinerary.map((day, i) => (
            <div key={i} className="rounded-xl border border-border/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Day {day.day}</span>
                <button type="button" onClick={() => removeItinerary(i)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <input className="admin-input" placeholder="Title" value={day.title} onChange={(e) => updateItinerary(i, "title", e.target.value)} />
                <input className="admin-input" placeholder="Activities (comma separated)" value={day.activities.join(", ")} onChange={(e) => updateItinerary(i, "activities", e.target.value)} />
              </div>
              <textarea className="admin-input mt-2" rows={2} placeholder="Description" value={day.description} onChange={(e) => updateItinerary(i, "description", e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">FAQs</h2>
          <button type="button" onClick={addFaq} className="flex items-center gap-1 text-sm font-medium text-primary">
            <Plus className="h-4 w-4" /> Add FAQ
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {values.faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">FAQ {i + 1}</span>
                <button type="button" onClick={() => removeFaq(i)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
              <input className="admin-input mt-2" placeholder="Question" value={faq.question} onChange={(e) => updateFaq(i, "question", e.target.value)} />
              <textarea className="admin-input mt-2" rows={2} placeholder="Answer" value={faq.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        {saving ? "Saving..." : values._id ? "Save Changes" : "Create Package"}
      </button>

    </form>
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
