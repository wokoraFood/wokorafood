"use client";

import Image from "next/image";
import { CATEGORY_META, WALL_ART } from "@/lib/constants";

function Rail({
  phrases,
  dishes,
  direction,
  accent,
}: {
  phrases: string[];
  dishes: { name: string; image: string }[];
  direction: "ltr" | "rtl";
  accent: "gold" | "red";
}) {
  const items = phrases.flatMap((phrase, index) => [
    { type: "phrase" as const, phrase, key: `p-${index}` },
    { type: "dish" as const, dish: dishes[index % dishes.length], key: `d-${index}` },
  ]);
  const track = [...items, ...items];

  return (
    <div
      className="flex w-max items-center gap-8 will-change-transform sm:gap-12"
      style={{ animation: `${direction === "rtl" ? "marquee-rtl" : "marquee-ltr"} 64s linear infinite` }}
    >
      {track.map((item, index) =>
        item.type === "phrase" ? (
          <p
            key={`${item.key}-${index}`}
            className={`wall-art shrink-0 text-4xl tracking-wide sm:text-6xl md:text-7xl ${
              accent === "gold" ? "text-brand-gold" : "text-brand-red"
            }`}
          >
            {item.phrase}
          </p>
        ) : (
          <span key={`${item.key}-${index}`} className="flex shrink-0 items-center gap-2">
            <span className="relative h-10 w-10 overflow-hidden rounded-full sm:h-12 sm:w-12">
              <Image src={item.dish.image} alt={item.dish.name} fill className="object-cover" sizes="48px" />
            </span>
            <span className="font-display text-sm font-semibold text-brand-cream/80 sm:text-base">
              {item.dish.name}
            </span>
          </span>
        )
      )}
    </div>
  );
}

export function WallCrossTicker() {
  const dishes = CATEGORY_META.map((category) => ({ name: category.name, image: category.image }));
  const reversePhrases = [...WALL_ART].reverse();
  const reverseDishes = [...dishes].reverse();

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="relative h-44 sm:h-56">
        <div className="absolute left-[-8%] top-[18%] w-[116%] -rotate-[8deg]">
          <Rail phrases={WALL_ART} dishes={dishes} direction="rtl" accent="gold" />
        </div>
        <div className="absolute left-[-8%] top-[48%] w-[116%] rotate-[8deg]">
          <Rail phrases={reversePhrases} dishes={reverseDishes} direction="ltr" accent="red" />
        </div>
      </div>
    </section>
  );
}
