import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type State = {
  wishlist: ProductInWishlist[];
  wishQuantity: number;
};

export type Actions = {
  addToWishlist: (product: ProductInWishlist) => void;
  removeFromWishlist: (id: string) => void;
  setWishlist: (wishlist: ProductInWishlist[]) => void;
  clearWishlist: () => void;
};

export const useWishlistStore = create<State & Actions>()(
  persist(
    (set) => ({
      wishlist: [],
      wishQuantity: 0,
      addToWishlist: (product) => {
        set((state) => {
          const exists = state.wishlist.some((item) => product.id === item.id);
          if (!exists) {
            const next = [...state.wishlist, product];
            return { wishlist: next, wishQuantity: next.length };
          }
          return {
            wishlist: state.wishlist,
            wishQuantity: state.wishlist.length,
          };
        });
      },
      removeFromWishlist: (id) => {
        set((state) => {
          const next = state.wishlist.filter((item) => item.id !== id);
          return { wishlist: next, wishQuantity: next.length };
        });
      },
      setWishlist: (wishlist: ProductInWishlist[]) => {
        set(() => ({
          wishlist: [...wishlist],
          wishQuantity: wishlist.length,
        }));
      },
      clearWishlist: () => {
        set(() => ({
          wishlist: [],
          wishQuantity: 0,
        }));
      },
    }),
    {
      name: "kronovolt-wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
