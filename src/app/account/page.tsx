"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LogOut, User } from "lucide-react";
import { useCustomer } from "@/hooks/use-customer";
import { useCustomerStore } from "@/store/customer-store";
import { customerPost } from "@/lib/customer/api-client";
import { toast } from "@/lib/toast";

export default function AccountPage() {
  const router = useRouter();
  const { customer, loading } = useCustomer();

  async function handleLogout() {
    await customerPost("/api/customer/auth/logout", {});
    useCustomerStore.getState().clear();
    toast.success("You've been logged out.");
    router.push("/login");
  }

  if (loading) {
    return <p className="mx-auto max-w-2xl px-4 py-16 text-sm text-muted-foreground">Loading...</p>;
  }

  if (!customer) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold">{customer.name}</h1>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
            {customer.phone && <p className="text-sm text-muted-foreground">{customer.phone}</p>}
          </div>
        </div>

        <div className="my-6 border-t border-border/60" />

        <Link
          href="/account/wishlist"
          className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-sm font-medium hover:bg-muted"
        >
          <span className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            My Wishlist
          </span>
          <span className="text-muted-foreground">{customer.wishlist.length}</span>
        </Link>

        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}
