"use client";

import { FormEvent, useEffect, useState } from "react";
import { displayOrderNumber, formatINR } from "@/lib/constants";

type Order = {
  id: string;
  serialNumber: number;
  status: string;
  tableNumber: string | null;
  type: string;
  paymentStatus: string;
  etaMinutes: number | null;
  totalAmount: number;
  createdAt: string;
  user: { name: string; phone: string };
  items: { quantity: number; menuItem: { name: string } }[];
};

const STATUSES = ["placed", "preparing", "ready", "served", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [eta, setEta] = useState<Record<string, string>>({});

  const load = () =>
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []));

  useEffect(() => {
    load();
    const timer = setInterval(load, 4000);
    return () => clearInterval(timer);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const sendEta = async (event: FormEvent, id: string) => {
    event.preventDefault();
    const minutes = Number(eta[id]);
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ etaMinutes: minutes, status: "preparing" }),
    });
    setEta((current) => ({ ...current, [id]: "" }));
    load();
  };

  const reprint = async (id: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reprint: true }),
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="heading-underline font-display text-3xl font-bold">Live orders</h1>
      <p className="mt-3 text-sm text-brand-cream/60">
        Orders are queued by serial number. Setting a wait time notifies the customer in-app and by email.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {orders.map((order) => (
          <article key={order.id} className="card-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-3xl text-brand-gold">{displayOrderNumber(order.serialNumber)}</p>
                <p className="text-sm text-brand-cream/60">
                  {order.user.name} · {order.user.phone}
                </p>
                <p className="text-sm text-brand-gold">
                  {order.type === "dine_in" ? `Table ${order.tableNumber}` : "Takeaway"} · {formatINR(order.totalAmount)}
                </p>
                <p className="text-xs text-brand-cream/50">
                  Payment: {order.paymentStatus.replace(/_/g, " ")}
                  {order.etaMinutes ? ` · ETA ${order.etaMinutes} min` : ""}
                </p>
              </div>
              <span className="rounded-full bg-brand-red/20 px-3 py-1 text-xs uppercase">{order.status}</span>
            </div>
            <ul className="mt-3 text-sm text-brand-cream/75">
              {order.items.map((item) => (
                <li key={item.menuItem.name}>
                  {item.quantity} × {item.menuItem.name}
                </li>
              ))}
            </ul>
            <form onSubmit={(event) => sendEta(event, order.id)} className="mt-4 flex flex-wrap items-center gap-2">
              <input
                required
                type="number"
                min={1}
                max={180}
                value={eta[order.id] || ""}
                onChange={(event) => setEta((current) => ({ ...current, [order.id]: event.target.value }))}
                placeholder="Minutes"
                className="w-24 rounded-full border border-white/10 bg-ink px-3 py-1.5 text-sm"
              />
              <button className="rounded-full bg-brand-gold px-3 py-1.5 text-sm text-black">
                Send time to customer
              </button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2">
              <select
                value={order.status}
                onChange={(event) => updateStatus(order.id, event.target.value)}
                className="rounded-full border border-white/10 bg-ink px-3 py-1.5 text-sm"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button onClick={() => reprint(order.id)} className="rounded-full border border-brand-gold/40 px-3 py-1.5 text-sm text-brand-gold">
                Print receipt
              </button>
            </div>
          </article>
        ))}
        {orders.length === 0 && <p className="text-brand-cream/50">No orders yet.</p>}
      </div>
    </div>
  );
}
