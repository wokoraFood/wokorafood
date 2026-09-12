"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { CATEGORY_META } from "@/lib/constants";

export function CategoryStrip() {
  const [paused, setPaused] = useState(false);
  const rail = [...CATEGORY_META, ...CATEGORY_META];

  return (
    <section className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(245,166,35,0.12),transparent_42%),radial-gradient(circle_at_85%_80%,rgba(232,39,44,0.14),transparent_40%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <p className="font-wall text-xl text-brand-gold sm:text-2xl">Pick your craving</p>
        <h2 className="heading-underline mt-1 font-display text-3xl font-bold">The wok list</h2>
      </div>

      <div
        className="relative mt-12 overflow-hidden px-4 py-6 sm:px-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex w-max gap-10 will-change-transform sm:gap-12"
          style={{
            animation: "wok-rail 42s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {rail.map((category, index) => (
            <Link
              key={`${category.slug}-${index}`}
              href={`/menu#${category.slug}`}
              className="group flex w-[140px] shrink-0 flex-col items-center sm:w-[156px]"
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.06 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <div
                  className="relative"
                  style={{ animation: `dish-float 4.6s ease-in-out ${index * 0.18}s infinite` }}
                >
                  <div className="absolute -inset-3 rounded-full bg-brand-red/20 blur-2xl opacity-0 transition duration-500 group-hover:opacity-100" />
                  <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full bg-black shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:h-[132px] sm:w-[132px]">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="132px"
                      className="object-cover object-center scale-[1.12] transition duration-700 group-hover:scale-[1.2]"
                    />
                  </div>
                </div>
              </motion.div>
              <p className="mt-4 text-center font-display text-sm font-semibold tracking-wide text-brand-cream/90 transition group-hover:text-brand-gold sm:text-base">
                {category.emoji} {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
