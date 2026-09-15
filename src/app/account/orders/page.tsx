"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { displayOrderNumber, formatINR } from "@/lib/constants";
import { useCartStore } from "@/store/cartStore";

type Order = {
  id: string;
  serialNumber: number;
  createdAt: string;
  totalAmount: number;
  status: string;
  etaMinutes?: number | null;
  items: { id?: string; quantity: number; customization?: string; menuItem: { id: string; name: string; price: number; imageUrl: string; isVeg: boolean } }[];
};

export default function CustomerOrdersPage() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/account")
      .then((res) => res.json())
      .then((data) => setOrders(data.user?.orders || []));
  }, []);

  return (
    <div>
      <h1 className="heading-underline font-display text-3xl font-bold">Your orders</h1>
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="card-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-2xl text-brand-gold">{displayOrderNumber(order.serialNumber)}</p>
                <p className="text-sm text-brand-cream/60">
                  {new Date(order.createdAt).toLocaleString("en-IN")} · {order.status}
                  {order.etaMinutes ? ` · ${order.etaMinutes} min` : ""}
                </p>
              </div>
              <p className="font-display text-xl">{formatINR(order.totalAmount)}</p>
            </div>
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {order.items.map((item, index) => (
                <div key={item.id || `${item.menuItem.id}-${index}`} className="w-28 shrink-0">
                  <div className="relative h-20 overflow-hidden rounded-xl">
                    <Image src={item.menuItem.imageUrl} alt={item.menuItem.name} fill className="object-cover" />
                  </div>
                  <p className="mt-1 truncate text-xs">{item.quantity} × {item.menuItem.name}</p>
                  {item.customization ? (
                    <p className="truncate text-[10px] text-brand-gold/80">{item.customization}</p>
                  ) : null}
                </div>
              ))}
            </div>
            <button
              className="btn-glow mt-4 px-5 py-2 text-sm"
              onClick={() => {
                order.items.forEach((item) =>
                  addItem(
                    {
                      id: item.menuItem.id,
                      name: item.menuItem.name,
                      price: item.menuItem.price,
                      imageUrl: item.menuItem.imageUrl,
                      isVeg: item.menuItem.isVeg,
                    },
                    item.quantity
                  )
                );
                router.push("/cart");
              }}
            >
              Re-order
            </button>
          </article>
        ))}
        {orders.length === 0 && <p className="text-brand-cream/50">You have not placed an order yet.</p>}
      </div>
    </div>
  );
}
