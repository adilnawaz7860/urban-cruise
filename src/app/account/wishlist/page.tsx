import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { connectDB } from "@/lib/server/db";
import { Customer } from "@/lib/server/models/Customer";
import { requireCustomer } from "@/lib/server/api-helpers";
import { adaptPackage } from "@/lib/api";
import { PackageCard } from "@/components/shared/package-card";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "Packages you've saved for later.",
};

export default async function WishlistPage() {
  const customer = await requireCustomer();
  await connectDB();
  const populated = await Customer.findById(customer._id).populate("wishlist").lean();
  const packages = (populated?.wishlist || []).map(adaptPackage);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/account" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" />
        My Account
      </Link>
      <h1 className="text-2xl font-bold">My Wishlist</h1>

      {packages.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          You haven&apos;t saved any packages yet. Browse{" "}
          <Link href="/packages" className="font-medium text-primary hover:underline">
            our packages
          </Link>{" "}
          and tap the heart icon to save your favourites here.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
