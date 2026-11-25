import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CompareProduct = {
  id: string;
  title: string;
  price: number;
  mainImage: string;
  slug: string;
  manufacturer: string;
  rating: number;
  inStock: number;
  description: string;
  categoryName?: string;
};

type CompareState = {
  items: CompareProduct[];
  addToCompare: (product: CompareProduct) => { added: boolean; reason?: string };
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
};

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCompare: (product) => {
        const current = get().items;
        if (current.some((item) => item.id === product.id)) {
          set({ items: current.filter((item) => item.id !== product.id) });
          return { added: false, reason: "removed" };
        }
        if (current.length >= 4) {
          return { added: false, reason: "max" };
        }
        set({ items: [...current, product] });
        return { added: true };
      },
      removeFromCompare: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      clearCompare: () => set({ items: [] }),
    }),
    {
      name: "kronovolt-compare-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
