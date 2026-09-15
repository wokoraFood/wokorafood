"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import { MENU_CATEGORIES } from "@/data/menu";

export function AboutSection() {
  const photos = [MENU_CATEGORIES[0], MENU_CATEGORIES[2], MENU_CATEGORIES[4]];

  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          <Image
            src={photos[0].image}
            alt={photos[0].name}
            width={480}
            height={640}
            unoptimized
            className="h-52 w-full rounded-2xl object-cover sm:h-72 md:h-[28rem]"
          />
          <div className="grid gap-3">
            <Image
              src={photos[1].image}
              alt={photos[1].name}
              width={360}
              height={260}
              unoptimized
              className="h-28 w-full rounded-2xl object-cover sm:h-36 md:h-52"
            />
            <Image
              src={photos[2].image}
              alt={photos[2].name}
              width={360}
              height={260}
              unoptimized
              className="h-28 w-full rounded-2xl object-cover sm:h-36 md:h-52"
            />
          </div>
        </div>
        <div>
          <h2 className="heading-underline font-display text-3xl font-bold">A cafe that tastes like a night out</h2>
          <p className="mt-6 text-brand-cream/75">
            Wokora Foods is a sit-down cafe at {BRAND.location} — nine food types only: burgers,
            coffee, momos, spring rolls, noodles, chilli potato, fried rice, wraps and chicken
            lollipop. Order from your phone at the table. We bring the food to you.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {MENU_CATEGORIES.map((category) => (
              <motion.p
                key={category.slug}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-center font-display text-[11px] font-semibold sm:px-3 sm:py-3 sm:text-sm"
              >
                {category.name}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
