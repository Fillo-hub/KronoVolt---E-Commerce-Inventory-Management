import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ProductInCart = {
  id: string;
  title: string;
  price: number;
  image: string;
  amount: number;
  slug?: string;
};

export type State = {
  products: ProductInCart[];
  allQuantity: number;
  total: number;
};

export type Actions = {
  addToCart: (newProduct: ProductInCart) => void;
  removeFromCart: (id: string) => void;
  updateCartAmount: (id: string, quantity: number) => void;
  calculateTotals: () => void;
  clearCart: () => void;
};

const computeTotals = (products: ProductInCart[]) => {
  let allQuantity = 0;
  let total = 0;
  for (const item of products) {
    allQuantity += item.amount;
    total += item.amount * item.price;
  }
  return { allQuantity, total };
};

export const useProductStore = create<State & Actions>()(
  persist(
    (set) => ({
      products: [],
      allQuantity: 0,
      total: 0,
      addToCart: (newProduct) => {
        set((state) => {
          const existingIndex = state.products.findIndex(
            (item) => item.id === newProduct.id
          );
          let nextProducts: ProductInCart[];
          if (existingIndex === -1) {
            nextProducts = [...state.products, { ...newProduct }];
          } else {
            nextProducts = state.products.map((product, idx) =>
              idx === existingIndex
                ? { ...product, amount: product.amount + newProduct.amount }
                : product
            );
          }
          return {
            products: nextProducts,
            ...computeTotals(nextProducts),
          };
        });
      },
      clearCart: () => {
        set(() => ({
          products: [],
          allQuantity: 0,
          total: 0,
        }));
      },
      removeFromCart: (id) => {
        set((state) => {
          const nextProducts = state.products.filter(
            (product: ProductInCart) => product.id !== id
          );
          return {
            products: nextProducts,
            ...computeTotals(nextProducts),
          };
        });
      },
      calculateTotals: () => {
        set((state) => ({
          products: state.products,
          ...computeTotals(state.products),
        }));
      },
      updateCartAmount: (id, amount) => {
        set((state) => {
          const validAmount = Math.max(1, amount);
          const nextProducts = state.products.map((product) =>
            product.id === id ? { ...product, amount: validAmount } : product
          );
          return {
            products: nextProducts,
            ...computeTotals(nextProducts),
          };
        });
      },
    }),
    {
      name: "products-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
