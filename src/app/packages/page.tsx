import { fetchPackages } from "@/lib/api";
import { PackagesPageClient } from "./packages-page-client";

export default async function PackagesPage() {
  const packages = await fetchPackages({ limit: "100" });
  return <PackagesPageClient packages={packages} />;
}
