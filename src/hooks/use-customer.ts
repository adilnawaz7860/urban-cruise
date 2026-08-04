"use client";

import { useEffect } from "react";
import { useCustomerStore, type CustomerProfile } from "@/store/customer-store";

export type { CustomerProfile };

export function useCustomer() {
  const { customer, loading, fetched, refetch } = useCustomerStore();

  useEffect(() => {
    if (!fetched) refetch();
  }, [fetched, refetch]);

  return { customer, loading, refetch, isLoggedIn: !!customer };
}
