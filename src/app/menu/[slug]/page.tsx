"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { DietToggle, type DietPreference } from "@/components/menu/DietToggle";
import { DishNameRow } from "@/components/menu/DishNameRow";
import { MenuCartRail } from "@/components/menu/MenuCartRail";
import type { FoodCardItem } from "@/components/menu/CustomizeItemPanel";
import { ALLOWED_CATEGORY_SLUGS, MENU_CATEGORIES } from "@/data/menu";
import { uniqueByName } from "@/lib/uniqueByName";

type MenuItem = FoodCardItem & {
  category: { name: string; slug: string };
};

function parseDiet(value: string | null): DietPreference {
  if (value === "veg" || value === "nonveg" || value === "all") return value;
  return "all";
}

function CategoryMenuInner() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug;
  const [items, setItems] = useState<MenuItem[]>([]);
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState<DietPreference>(parseDiet(searchParams.get("diet")));

  useEffect(() => {
    setDiet(parseDiet(searchParams.get("diet")));
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]));
  }, []);

  const dishes = useMemo(() => {
    const rows = items.filter((item) => {
      if (item.category.slug !== slug) return false;
      const matchesDiet = diet === "all" || (diet === "veg" ? item.isVeg : !item.isVeg);
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      return matchesDiet && matchesQuery;
    });
    return uniqueByName(rows);
  }, [items, slug, diet, query]);

  const title = MENU_CATEGORIES.find((row) => row.slug === slug)?.name || slug.replace(/-/g, " ");

  const changeDiet = (next: DietPreference) => {
    setDiet(next);
    router.replace(`/menu/${slug}?diet=${next}`, { scroll: false });
  };

  if (!ALLOWED_CATEGORY_SLUGS.includes(slug)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-brand-cream/60">That plate is not on the wok list.</p>
        <Link href="/menu" className="btn-glow mt-6 inline-block px-6 py-3">
          Back to menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
      <div className="mb-4 flex items-center gap-3">
        <Link href={`/menu?diet=${diet}`} className="rounded-full border border-white/10 p-2 text-brand-cream/70 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand-gold">Wok list</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        </div>
      </div>

      <div className="sticky top-14 z-30 mb-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-ink/95 px-2 py-1.5 backdrop-blur sm:top-16">
        <div className="min-w-0 flex-1 overflow-x-auto no-scrollbar">
          <DietToggle value={diet} onChange={changeDiet} />
        </div>
        <form
          onSubmit={(event: FormEvent) => event.preventDefault()}
          className="relative w-[6.75rem] shrink-0 sm:w-44 md:w-52"
        >
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-cream/50" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="w-full rounded-full border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-brand-red"
          />
        </form>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20.5rem]">
        <section className="card-surface overflow-hidden px-3 sm:px-4">
          {dishes.length === 0 ? (
            <p className="py-12 text-center text-sm text-brand-cream/55">
              {diet === "veg" ? "No veg dishes here." : diet === "nonveg" ? "No non-veg dishes here." : "Nothing in this plate yet."}
            </p>
          ) : (
            dishes.map((item) => <DishNameRow key={item.id} item={item} />)
          )}
        </section>
        <MenuCartRail />
      </div>
    </div>
  );
}

export default function CategoryMenuPage() {
  return (
    <Suspense fallback={<div className="px-4 py-20 text-center">Loading plate...</div>}>
      <CategoryMenuInner />
    </Suspense>
  );
}
