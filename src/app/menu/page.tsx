"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { FoodCard, FoodCardItem } from "@/components/menu/FoodCard";
import { useCartStore } from "@/store/cartStore";

type MenuItem = FoodCardItem & {
  category: { name: string; slug: string };
};

type Category = { id: string; name: string; slug: string };

function MenuPageInner() {
  const searchParams = useSearchParams();
  const setTableNumber = useCartStore((state) => state.setTableNumber);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("all");

  useEffect(() => {
    const table = searchParams.get("table");
    if (table) setTableNumber(table);
  }, [searchParams, setTableNumber]);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setCategories(data.categories || []);
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
    return items.filter((item) => {
      const matchesCategory = active === "all" || item.category.slug === active;
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [items, active, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    filtered.forEach((item) => {
      const key = item.category.slug;
      map.set(key, [...(map.get(key) || []), item]);
    });
    return categories.filter((category) => map.has(category.slug)).map((category) => ({
      category,
      items: map.get(category.slug) || [],
    }));
  }, [filtered, categories]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="heading-underline font-display text-4xl font-bold">Menu</h1>
          <p className="mt-4 text-brand-cream/65">Scan, tap, eat. Login is required only when you place the order.</p>
        </div>
        <form onSubmit={submitSearch} className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-cream/50" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search dishes"
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 outline-none focus:border-brand-red"
          />
        </form>
      </div>

      <div className="sticky top-16 z-30 -mx-4 mt-8 border-y border-white/10 bg-ink/90 px-4 py-3 backdrop-blur md:mx-0 md:rounded-full md:border md:px-2">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {[{ slug: "all", name: "All" }, ...categories].map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => {
                setActive(category.slug);
                if (category.slug !== "all") {
                  document.getElementById(category.slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm ${
                active === category.slug ? "bg-brand-red text-white" : "text-brand-cream/70 hover:text-brand-red"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-14">
        {grouped.map(({ category, items: sectionItems }) => (
          <section key={category.slug} id={category.slug} className="scroll-mt-32">
            <h2 className="heading-underline font-display text-2xl font-bold">{category.name}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sectionItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
        {grouped.length === 0 && (
          <p className="text-brand-cream/60">No dishes match that search yet.</p>
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
