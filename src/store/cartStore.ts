import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { create } from "zustand";
import type { CustomizeSelections } from "@/lib/customizations";
import { cartLineId, menuItemIdFromLine } from "@/lib/customizations";

export type CartItem = {
  id: string;
  menuItemId?: string;
  name: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  quantity: number;
  configKey?: string;
  customization?: string;
  selections?: CustomizeSelections;
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
  hydrateFromServer: (items: CartItem[]) => void;
  setTableNumber: (tableNumber: string) => void;
  setOrderType: (orderType: OrderType) => void;
};

let cartOwner = "guest";

export function setCartOwner(userId: string | null) {
  cartOwner = userId || "guest";
}

export function peekPersistedCart(owner: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`wokora-cart:${owner}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { state?: { items?: CartItem[] } };
    return Array.isArray(parsed.state?.items) ? parsed.state.items : [];
  } catch {
    return [];
  }
}

export function clearPersistedCart(owner: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`wokora-cart:${owner}`);
}

function lineId(item: Pick<CartItem, "id" | "menuItemId" | "configKey">) {
  const menuItemId = item.menuItemId || menuItemIdFromLine(item.id);
  const configKey =
    item.configKey || (item.id.includes("::") ? item.id.split("::").slice(1).join("::") : "default");
  return item.id.includes("::") ? item.id : cartLineId(menuItemId, configKey);
}

export function mergeCartLines(left: CartItem[], right: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const item of [...left, ...right]) {
    const menuItemId = item.menuItemId || menuItemIdFromLine(item.id);
    const configKey =
      item.configKey || (item.id.includes("::") ? item.id.split("::").slice(1).join("::") : "default");
    const id = lineId(item);
    const line: CartItem = {
      ...item,
      id,
      menuItemId,
      configKey,
      customization: item.customization || "",
    };
    const prev = map.get(id);
    if (!prev) {
      map.set(id, line);
      continue;
    }
    const richer = (line.customization?.length || 0) >= (prev.customization?.length || 0) ? line : prev;
    map.set(id, {
      ...richer,
      quantity: Math.min(20, Math.max(prev.quantity, line.quantity)),
    });
  }
  return Array.from(map.values());
}

const keyedStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(`${name}:${cartOwner}`);
  },
  setItem: (name, value) => {
    localStorage.setItem(`${name}:${cartOwner}`, value);
  },
  removeItem: (name) => {
    localStorage.removeItem(`${name}:${cartOwner}`);
  },
};

function normalizeLine(item: Omit<CartItem, "quantity">): Omit<CartItem, "quantity"> {
  return {
    ...item,
    menuItemId: item.menuItemId || menuItemIdFromLine(item.id),
    configKey: item.configKey || "default",
    customization: item.customization || "",
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: "",
      orderType: "dine_in",
      addItem: (item, quantity = 1) => {
        const line = normalizeLine(item);
        const existing = get().items.find((row) => row.id === line.id);
        if (existing) {
          set({
            items: get().items.map((row) =>
              row.id === line.id ? { ...row, quantity: Math.min(20, row.quantity + quantity) } : row
            ),
          });
          return;
        }
        set({ items: [...get().items, { ...line, quantity: Math.min(20, quantity) }] });
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
      hydrateFromServer: (items) => set({ items }),
      setTableNumber: (tableNumber) => set({ tableNumber }),
      setOrderType: (orderType) => set({ orderType }),
    }),
    {
      name: "wokora-cart",
      storage: createJSONStorage(() => keyedStorage),
      skipHydration: true,
    }
  )
);

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
