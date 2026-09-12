"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { displayOrderNumber, formatINR } from "@/lib/constants";

type Order = {
  id: string;
  serialNumber: number;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string | null;
};

export default function PayPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [method, setMethod] = useState<"upi" | "card">("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${params.orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data.order);
        if (data.order?.paymentMethod === "card") setMethod("card");
        if (data.order?.paymentStatus === "paid" || data.order?.paymentStatus === "pay_at_counter") {
          router.replace(`/order/${params.orderId}`);
        }
      });
  }, [params.orderId, router]);

  const pay = async (event?: FormEvent) => {
    event?.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(`/api/orders/${params.orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pay: true, paymentMethod: method }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Payment could not be completed. Please sign in and try again.");
      return;
    }
    router.push(`/order/${params.orderId}`);
  };

  if (!order) return <div className="px-4 py-20 text-center">Loading payment...</div>;

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="heading-underline font-display text-3xl font-bold">Pay · Wokora Foods</h1>
      <p className="mt-4 text-brand-gold">
        Order {displayOrderNumber(order.serialNumber)} · {formatINR(order.totalAmount)}
      </p>
      <div className="mt-6 flex gap-2">
        {(["upi", "card"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMethod(value)}
            className={`flex-1 rounded-full py-2 ${method === value ? "bg-brand-red" : "border border-white/10"}`}
          >
            {value === "upi" ? "UPI" : "Card"}
          </button>
        ))}
      </div>
      <form onSubmit={pay} className="card-surface mt-6 space-y-4 p-6">
        {method === "upi" ? (
          <div className="text-center">
            <div className="mx-auto grid h-40 w-40 place-items-center rounded-xl bg-white text-black">
              <p className="font-mono text-xs">WOKORAFOODS@UPI</p>
            </div>
            <p className="mt-3 text-sm text-brand-cream/70">
              Pay with your UPI app, then confirm below. Live UPI keys can be added later.
            </p>
          </div>
        ) : (
          <>
            <input required placeholder="Card number" className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3" />
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="MM/YY" className="rounded-full border border-white/10 bg-white/5 px-4 py-3" />
              <input required placeholder="CVV" className="rounded-full border border-white/10 bg-white/5 px-4 py-3" />
            </div>
            <input required placeholder="Name on card" className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3" />
          </>
        )}
        {error && <p className="text-sm text-brand-red">{error}</p>}
        <button disabled={loading} className="btn-glow w-full py-3">
          {loading ? "Confirming..." : `Pay ${formatINR(order.totalAmount)}`}
        </button>
      </form>
    </div>
  );
}
