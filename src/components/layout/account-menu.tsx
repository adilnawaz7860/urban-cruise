"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Heart, LogOut, LogIn, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/hooks/use-customer";
import { useCustomerStore } from "@/store/customer-store";
import { customerPost } from "@/lib/customer/api-client";
import { toast } from "@/lib/toast";

export function AccountMenu() {
  const router = useRouter();
  const { customer, loading } = useCustomer();

  async function handleLogout() {
    await customerPost("/api/customer/auth/logout", {});
    useCustomerStore.getState().clear();
    toast.success("You've been logged out.");
    router.push("/");
  }

  if (loading) {
    return <span className="h-9 w-9" />;
  }

  if (!customer) {
    return (
      <Button
        render={<Link href="/login" />}
        nativeButton={false}
        variant="ghost"
        size="icon"
        aria-label="Log in"
      >
        <LogIn className="h-4 w-4" />
      </Button>
    );
  }

  const firstName = customer.name.split(" ")[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            aria-label="Account menu"
            className="gap-1.5 px-2"
          />
        }
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <User className="h-3.5 w-3.5" />
        </span>
        <span className="max-w-24 truncate">{firstName}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="px-2 py-1.5 text-sm">
          <p className="truncate font-medium">{customer.name}</p>
          <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/account" className="flex items-center gap-2" />}>
          <User className="h-4 w-4 text-muted-foreground" />
          My Account
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/account/wishlist" className="flex items-center gap-2" />}>
          <Heart className="h-4 w-4 text-muted-foreground" />
          My Wishlist
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4 text-muted-foreground" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
