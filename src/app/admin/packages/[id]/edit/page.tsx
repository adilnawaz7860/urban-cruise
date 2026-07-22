"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminGet } from "@/lib/admin/api-client";
import { PackageForm, type PackageFormValues } from "../../package-form";

export default function EditPackagePage() {
  const params = useParams<{ id: string }>();
  const [initial, setInitial] = useState<PackageFormValues | null>(null);

  useEffect(() => {
    adminGet<PackageFormValues>(`/api/admin/packages/${params.id}`).then((res) => setInitial(res.data));
  }, [params.id]);

  if (!initial) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Package</h1>
      <div className="mt-6">
        <PackageForm initial={initial} />
      </div>
    </div>
  );
}
