"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { FoodCardItem } from "@/components/menu/CustomizeItemPanel";
import { DietToggle, type DietPreference } from "@/components/menu/DietToggle";
import { useCartStore } from "@/store/cartStore";
import { ALLOWED_CATEGORY_SLUGS } from "@/data/menu";
import { CATEGORY_META, formatINR } from "@/lib/constants";
import { uniqueByName } from "@/lib/uniqueByName";

type MenuItem = FoodCardItem & {
  category: { name: string; slug: string };
  isFeatured?: boolean;
};

type Category = { id: string; name: string; slug: string };

function parseDiet(value: string | null): DietPreference {
  if (value === "veg" || value === "nonveg" || value === "all") return value;
  return "all";
}

function MenuPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setTableNumber = useCartStore((state) => state.setTableNumber);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState<DietPreference>(parseDiet(searchParams.get("diet")));

  useEffect(() => {
    setDiet(parseDiet(searchParams.get("diet")));
  }, [searchParams]);

  useEffect(() => {
    const table = searchParams.get("table");
    if (table) setTableNumber(table);
  }, [searchParams, setTableNumber]);

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.replace("#", ""));
    if (id && ALLOWED_CATEGORY_SLUGS.includes(id)) {
      router.replace(`/menu/${id}?diet=${parseDiet(searchParams.get("diet"))}`);
    }
  }, [router, searchParams]);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setCategories((data.categories || []).filter((category: Category) => ALLOWED_CATEGORY_SLUGS.includes(category.slug)));
      })
      .catch(() => {
        setItems([]);
        setCategories([]);
      });
  }, []);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
  };

  const filtered = useMemo(() => {
    const rows = items.filter((item) => {
      const matchesDiet = diet === "all" || (diet === "veg" ? item.isVeg : !item.isVeg);
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.name.toLowerCase().includes(query.toLowerCase());
      return matchesDiet && matchesQuery && ALLOWED_CATEGORY_SLUGS.includes(item.category.slug);
    });
    return uniqueByName(rows);
  }, [items, diet, query]);

  const plates = useMemo(() => {
    return categories
      .map((category) => {
        const dishes = filtered.filter((item) => item.category.slug === category.slug);
        if (!dishes.length) return null;
        const featured = dishes.find((item) => item.isFeatured) || dishes[0];
        const meta = CATEGORY_META.find((row) => row.slug === category.slug);
        return {
          category,
          featured,
          count: dishes.length,
          fromPrice: Math.min(...dishes.map((item) => item.price)),
          image: featured.imageUrl || meta?.image || "",
        };
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row));
  }, [filtered, categories]);

  const changeDiet = (next: DietPreference) => {
    setDiet(next);
    router.replace(`/menu?diet=${next}`, { scroll: false });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
      <header>
        <div>
          <p className="font-wall text-sm text-brand-gold sm:text-lg">Taste Talks Here</p>
          <h1 className="mt-0.5 font-display text-2xl font-extrabold leading-none tracking-tight sm:text-3xl">
            Menu
          </h1>
        </div>
      </header>

      <div className="sticky top-14 z-30 mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-ink/95 px-2 py-1.5 backdrop-blur sm:top-16 sm:gap-3 sm:px-2.5">
        <div className="min-w-0 flex-1 overflow-x-auto no-scrollbar">
          <DietToggle value={diet} onChange={changeDiet} />
        </div>
        <form onSubmit={submitSearch} className="relative w-[6.75rem] shrink-0 sm:w-44 md:w-56 lg:w-72">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-cream/50 sm:left-3 sm:h-4 sm:w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="w-full rounded-full border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-brand-red sm:py-2 sm:pl-10"
          />
        </form>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {plates.map(({ category, featured, count, fromPrice, image }) => (
          <Link
            key={category.slug}
            id={category.slug}
            href={`/menu/${category.slug}?diet=${diet}`}
            className="card-surface group overflow-hidden"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={image}
                alt={category.name}
                fill
                unoptimized
                className="object-cover transition duration-500 group-hover:scale-110"
              />
              <span
                className={`absolute left-3 top-3 h-3 w-3 ring-2 ring-white ${
                  featured.isVeg ? "rounded-full bg-green-500" : "bg-red-500"
                }`}
                title={featured.isVeg ? "Vegetarian" : "Non-vegetarian"}
              />
              {!featured.isVeg && (
                <span className="absolute right-3 top-3 rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Chicken
                </span>
              )}
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-lg font-semibold">{category.name}</h2>
                <p className="font-display text-brand-gold">{formatINR(fromPrice)}</p>
              </div>
              <p className="line-clamp-2 text-sm text-brand-cream/65">
                {count} {count === 1 ? "dish" : "dishes"}. {featured.description}
              </p>
              <span className="btn-glow inline-flex w-full justify-center px-4 py-2 text-sm">Open {category.name}</span>
            </div>
          </Link>
        ))}
        {plates.length === 0 && (
          <p className="text-brand-cream/60 sm:col-span-2 lg:col-span-3">
            {diet === "veg"
              ? "No veg dishes in this search."
              : diet === "nonveg"
                ? "No non-veg dishes in this search."
                : "No dishes match that search yet."}
          </p>
        )}
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="px-4 py-20 text-center">Loading menu...</div>}>
      <MenuPageInner />
    </Suspense>
  );
}
