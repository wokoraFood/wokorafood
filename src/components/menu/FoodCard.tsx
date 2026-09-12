"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatINR } from "@/lib/constants";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export type FoodCardItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  isAvailable?: boolean;
};

export function FoodCard({ item, staticReveal = false }: { item: FoodCardItem; staticReveal?: boolean }) {
  const cartItem = useCartStore((state) => state.items.find((row) => row.id === item.id));
  const addItem = useCartStore((state) => state.addItem);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const [broken, setBroken] = useState(false);

  const body = (
    <>

      <div className="relative aspect-[4/3] overflow-hidden">
        {broken ? (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-red/40 to-black text-center">
            <p className="font-display text-lg text-white">{item.name}</p>
          </div>
        ) : (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition duration-500 hover:scale-110"
            onError={() => setBroken(true)}
          />
        )}
        <span
          className={`absolute left-3 top-3 h-3 w-3 rounded-full ring-2 ring-white ${item.isVeg ? "bg-green-500" : "bg-red-500"}`}
          title={item.isVeg ? "Vegetarian" : "Non-vegetarian"}
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold">{item.name}</h3>
          <p className="font-display text-brand-gold">{formatINR(item.price)}</p>
        </div>
        <p className="line-clamp-2 text-sm text-brand-cream/65">{item.description}</p>
        {item.isAvailable === false ? (
          <p className="text-sm text-brand-red">Sold out</p>
        ) : cartItem ? (
          <QuantityStepper
            value={cartItem.quantity}
            onIncrement={() => increment(item.id)}
            onDecrement={() => decrement(item.id)}
          />
        ) : (
          <button
            type="button"
            onClick={() =>
              addItem({
                id: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                isVeg: item.isVeg,
              })
            }
            className="btn-glow w-full px-4 py-2 text-sm"
          >
            Add to Cart
          </button>
        )}
      </div>
    </>
  );

  if (staticReveal) {
    return <article className="card-surface overflow-hidden">{body}</article>;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className="card-surface overflow-hidden"
    >
      {body}
    </motion.article>
  );
}
