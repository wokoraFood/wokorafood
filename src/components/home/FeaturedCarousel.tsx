"use client";

import { useState } from "react";
import { FoodCard, FoodCardItem } from "@/components/menu/FoodCard";

export function FeaturedCarousel({ items }: { items: FoodCardItem[] }) {
  const [paused, setPaused] = useState(false);
  const track = items.length ? [...items, ...items] : [];

  if (items.length === 0) return null;

  return (
    <section className="dark-band overflow-hidden bg-[#111] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="heading-underline font-display text-3xl font-bold">Bestsellers</h2>
        <p className="mt-3 max-w-xl font-wall text-lg text-brand-gold sm:text-xl">
          From the wok. Straight to the booth.
        </p>
      </div>
      <div
        className="mt-10 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex w-max gap-6 px-8 will-change-transform"
          style={{
            animation: "marquee-rtl 48s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {track.map((item, index) => (
            <div key={`${item.id}-${index}`} className="w-[280px] shrink-0 sm:w-[320px]">
              <FoodCard item={item} staticReveal />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
