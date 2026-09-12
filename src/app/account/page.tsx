"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FoodCard, FoodCardItem } from "@/components/menu/FoodCard";
import { displayOrderNumber, formatINR } from "@/lib/constants";
import { useCartStore } from "@/store/cartStore";

type Order = {
  id: string;
  serialNumber: number;
  createdAt: string;
  totalAmount: number;
  status: string;
  etaMinutes?: number | null;
  items: { quantity: number; menuItem: { id: string; name: string; price: number; imageUrl: string; isVeg: boolean } }[];
};

type Account = {
  name: string;
  phone: string;
  email: string | null;
  loyaltyPoints: number;
  orders: Order[];
};

export default function CustomerDashboardPage() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [user, setUser] = useState<Account | null>(null);
  const [recs, setRecs] = useState<FoodCardItem[]>([]);
  const [reason, setReason] = useState("popular");

  useEffect(() => {
    fetch("/api/account")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login?callbackUrl=/account");
          return null;
        }
        return res.json();
      })
      .then((data) => data && setUser(data.user));

    fetch("/api/recommendations")
      .then((res) => res.json())
      .then((data) => {
        setRecs(data.items || []);
        setReason(data.reason || "popular");
      });
  }, [router]);

  if (!user) return <div className="py-20 text-center">Loading your dashboard...</div>;

  const recent = user.orders.slice(0, 3);
  const reorder = (order: Order) => {
    order.items.forEach((item) => {
      addItem(
        {
          id: item.menuItem.id,
          name: item.menuItem.name,
          price: item.menuItem.price,
          imageUrl: item.menuItem.imageUrl,
          isVeg: item.menuItem.isVeg,
        },
        item.quantity
      );
    });
    router.push("/cart");
  };

  return (
    <div className="space-y-10">
      <header>
        <p className="font-wall text-2xl text-brand-gold">Taste Talks Here</p>
        <h1 className="font-display text-4xl font-bold">Hey {user.name.split(" ")[0]}, hungry again?</h1>
        <p className="mt-2 text-brand-cream/65">Your table, your usuals, your next plate — all in one place.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="card-surface p-5">
          <p className="text-xs uppercase tracking-widest text-brand-cream/50">Orders</p>
          <p className="mt-2 font-display text-4xl text-brand-cream">{user.orders.length}</p>
        </article>
        <article className="card-surface p-5">
          <p className="text-xs uppercase tracking-widest text-brand-cream/50">Loyalty</p>
          <p className="mt-2 font-display text-4xl text-brand-gold">{user.loyaltyPoints}</p>
        </article>
        <article className="card-surface p-5">
          <p className="text-xs uppercase tracking-widest text-brand-cream/50">Last plate</p>
          <p className="mt-2 font-display text-2xl">
            {recent[0] ? displayOrderNumber(recent[0].serialNumber) : "—"}
          </p>
        </article>
      </div>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="heading-underline font-display text-2xl font-bold">Recent orders</h2>
          <Link href="/account/orders" className="text-sm text-brand-gold">See all</Link>
        </div>
        <div className="mt-6 space-y-3">
          {recent.length === 0 && <p className="text-brand-cream/50">Your first order starts on the menu.</p>}
          {recent.map((order) => (
            <article key={order.id} className="card-surface flex flex-wrap items-center gap-4 p-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                <Image
                  src={order.items[0]?.menuItem.imageUrl || "/images/menu/placeholder.jpg"}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-48 flex-1">
                <p className="font-display text-lg">{displayOrderNumber(order.serialNumber)}</p>
                <p className="text-sm text-brand-cream/60">
                  {order.items.map((item) => item.menuItem.name).join(", ")} · {formatINR(order.totalAmount)}
                </p>
              </div>
              <button onClick={() => reorder(order)} className="rounded-full border border-brand-gold/40 px-4 py-2 text-sm text-brand-gold">
                Re-order
              </button>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="heading-underline font-display text-2xl font-bold">
          {reason === "history" ? "Because you ordered these before" : "Wokora picks for you"}
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {recs.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
