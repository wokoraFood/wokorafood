import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  quantity: number;
};

type OrderType = "dine_in" | "takeaway";

type CartState = {
  items: CartItem[];
  tableNumber: string;
  orderType: OrderType;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  setTableNumber: (tableNumber: string) => void;
  setOrderType: (orderType: OrderType) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: "",
      orderType: "dine_in",
      addItem: (item, quantity = 1) => {
        const existing = get().items.find((row) => row.id === item.id);
        if (existing) {
          set({
            items: get().items.map((row) =>
              row.id === item.id ? { ...row, quantity: row.quantity + quantity } : row
            ),
          });
          return;
        }
        set({ items: [...get().items, { ...item, quantity }] });
      },
      setQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((row) => row.id !== id) });
          return;
        }
        set({
          items: get().items.map((row) => (row.id === id ? { ...row, quantity } : row)),
        });
      },
      increment: (id) => {
        set({
          items: get().items.map((row) =>
            row.id === id ? { ...row, quantity: Math.min(20, row.quantity + 1) } : row
          ),
        });
      },
      decrement: (id) => {
        const current = get().items.find((row) => row.id === id);
        if (!current) return;
        if (current.quantity <= 1) {
          set({ items: get().items.filter((row) => row.id !== id) });
          return;
        }
        set({
          items: get().items.map((row) =>
            row.id === id ? { ...row, quantity: row.quantity - 1 } : row
          ),
        });
      },
      removeItem: (id) => set({ items: get().items.filter((row) => row.id !== id) }),
      clear: () => set({ items: [] }),
      setTableNumber: (tableNumber) => set({ tableNumber }),
      setOrderType: (orderType) => set({ orderType }),
    }),
    { name: "wokora-cart" }
  )
);

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
