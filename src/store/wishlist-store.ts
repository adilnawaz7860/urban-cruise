import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set({
          ids: get().ids.includes(id)
            ? get().ids.filter((i) => i !== id)
            : [...get().ids, id],
        }),
      has: (id) => get().ids.includes(id),
    }),
    {
      name: "wishlist-storage",
      skipHydration: true,
    }
  )
);
