"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORY_META } from "@/lib/constants";

export function ChefGallery() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <h2 className="heading-underline font-display text-3xl font-bold">From the wok tonight</h2>
        <Link href="/menu" className="text-sm text-brand-gold">
          Menu
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        {CATEGORY_META.map((category) => (
          <Link
            key={category.slug}
            href={`/menu/${category.slug}`}
            className="group relative h-36 overflow-hidden rounded-2xl sm:h-44 md:h-56"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              unoptimized
              className="object-cover transition duration-500 group-hover:scale-110"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2 font-display text-sm sm:px-4 sm:py-3 sm:text-base">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
