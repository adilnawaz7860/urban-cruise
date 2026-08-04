import { create } from "zustand";
import { customerGet } from "@/lib/customer/api-client";

export interface CustomerProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  wishlist: string[];
}

interface CustomerState {
  customer: CustomerProfile | null;
  loading: boolean;
  fetched: boolean;
  refetch: () => Promise<void>;
  clear: () => void;
}

let inFlight: Promise<void> | null = null;

export const useCustomerStore = create<CustomerState>((set) => ({
  customer: null,
  loading: false,
  fetched: false,
  refetch: () => {
    if (inFlight) return inFlight;
    set({ loading: true });
    inFlight = customerGet<CustomerProfile>("/api/customer/auth/me")
      .then((res) => set({ customer: res.data, loading: false, fetched: true }))
      .catch(() => set({ customer: null, loading: false, fetched: true }))
      .finally(() => {
        inFlight = null;
      });
    return inFlight;
  },
  clear: () => set({ customer: null, loading: false, fetched: true }),
}));
