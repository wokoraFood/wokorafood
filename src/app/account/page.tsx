"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { DietPreference } from "@/components/menu/DietToggle";
import { DietGate } from "@/components/order/DietGate";
import { DietIcons } from "@/components/order/DietIcons";
import { OrderItemRow } from "@/components/order/OrderItemRow";
import { CATEGORY_META, displayOrderNumber, formatINR } from "@/lib/constants";
import { ALLOWED_CATEGORY_SLUGS } from "@/data/menu";
import { useCartStore } from "@/store/cartStore";
import { uniqueByName } from "@/lib/uniqueByName";
import type { FoodCardItem } from "@/components/menu/CustomizeItemPanel";

type Order = {
  id: string;
  serialNumber: number;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: { quantity: number; menuItem: { id: string; name: string; price: number; imageUrl: string; isVeg: boolean } }[];
};

type Account = {
  name: string;
  phone: string;
  email: string | null;
  loyaltyPoints: number;
  dietPreference: DietPreference;
  orders: Order[];
};

type MenuItem = FoodCardItem & {
  category: { name: string; slug: string };
  isFeatured?: boolean;
};

type Category = { id: string; name: string; slug: string };

export default function OrderHomePage() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const orderType = useCartStore((state) => state.orderType);
  const setOrderType = useCartStore((state) => state.setOrderType);
  const [user, setUser] = useState<Account | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [diet, setDiet] = useState<DietPreference>("all");
  const [gateOpen, setGateOpen] = useState(true);
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/account")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login?callbackUrl=/account");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data?.user) return;
        setUser(data.user);
        const saved = data.user.dietPreference as DietPreference;
        if (saved === "veg" || saved === "nonveg" || saved === "all") {
          setDiet(saved);
          setGateOpen(saved === "all");
        }
      });

    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setCategories((data.categories || []).filter((row: Category) => ALLOWED_CATEGORY_SLUGS.includes(row.slug)));
      })
      .catch(() => {
        setItems([]);
        setCategories([]);
      });
  }, [router]);

  const saveDiet = (next: DietPreference) => {
    setDiet(next);
    setGateOpen(false);
    fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dietPreference: next }),
    }).catch(() => undefined);
  };

  const filtered = useMemo(() => {
    const rows = items.filter((item) => {
      const matchesDiet = diet === "all" || (diet === "veg" ? item.isVeg : !item.isVeg);
      const matchesCategory = active === "all" || item.category.slug === active;
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      return matchesDiet && matchesCategory && matchesQuery;
    });
    return uniqueByName(rows);
  }, [items, diet, active, query]);

  const deals = useMemo(
    () =>
      uniqueByName(
        items
          .filter((item) => item.isFeatured)
          .filter((item) => diet === "all" || (diet === "veg" ? item.isVeg : !item.isVeg))
      ).slice(0, 8),
    [items, diet]
  );

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

  if (!user) return <div className="py-24 text-center text-brand-cream/60">Loading the kitchen...</div>;

  const firstName = user.name.split(" ")[0];
  const lastOrder = user.orders[0];
  const categoryMeta = (slug: string) => CATEGORY_META.find((row) => row.slug === slug);

  if (gateOpen) {
    return <DietGate name={firstName} onPick={saveDiet} />;
  }

  return (
    <div className="pb-10">
      <div className="border-b border-white/10 bg-charcoal/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-brand-gold">Hi {firstName}</p>
            <p className="font-display text-xl font-semibold leading-tight sm:text-xl">Wokora Foods</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex w-full rounded-full border border-white/15 bg-black/30 p-1 text-sm sm:w-auto">
              <button
                type="button"
                onClick={() => setOrderType("dine_in")}
                className={`flex-1 rounded-full px-4 py-1.5 sm:flex-none ${orderType === "dine_in" ? "bg-brand-red text-white" : "text-brand-cream/65"}`}
              >
                Dine-in
              </button>
              <button
                type="button"
                onClick={() => setOrderType("takeaway")}
                className={`flex-1 rounded-full px-4 py-1.5 sm:flex-none ${orderType === "takeaway" ? "bg-brand-red text-white" : "text-brand-cream/65"}`}
              >
                Takeaway
              </button>
            </div>
            <DietIcons value={diet} onChange={saveDiet} />
            <button type="button" onClick={() => setGateOpen(true)} className="text-xs text-brand-cream/50 hover:text-brand-gold">
              Change
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {lastOrder && (
          <button
            type="button"
            onClick={() => {
              lastOrder.items.forEach((item) =>
                addItem(
                  {
                    id: item.menuItem.id,
                    name: item.menuItem.name,
                    price: item.menuItem.price,
                    imageUrl: item.menuItem.imageUrl,
                    isVeg: item.menuItem.isVeg,
                  },
                  item.quantity
                )
              );
              router.push("/cart");
            }}
            className="mt-5 flex w-full flex-col gap-2 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 px-4 py-3 text-left sm:flex-row sm:items-center sm:justify-between"
          >
            <span>
              <span className="block text-xs uppercase tracking-widest text-brand-gold">Repeat last order</span>
              <span className="text-sm text-brand-cream/80">
                {displayOrderNumber(lastOrder.serialNumber)} ·{" "}
                <span className="line-clamp-2 sm:line-clamp-1">
                  {lastOrder.items.map((item) => item.menuItem.name).join(", ")}
                </span>
              </span>
            </span>
            <span className="font-display text-brand-gold">{formatINR(lastOrder.totalAmount)}</span>
          </button>
        )}

        {deals.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-2xl font-bold">Wokora Deals</h2>
            <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-2">
              {deals.map((item) => (
                <button
                  key={item.id}
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
                  className="w-64 shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-charcoal text-left"
                >
                  <div className="relative h-36">
                    <Image src={item.imageUrl} alt={item.name} fill unoptimized className="object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-bold text-white">
                      DEAL
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-display font-semibold">{item.name}</p>
                    <p className="mt-1 text-sm text-brand-gold">{formatINR(item.price)} · Tap to add</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-2xl font-bold">Explore Menu</h2>
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-cream/45" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-red"
              />
            </div>
          </div>
          <div className="no-scrollbar mt-5 flex gap-5 overflow-x-auto pb-3">
            <button type="button" onClick={() => setActive("all")} className="w-[76px] shrink-0 text-center">
              <span
                className={`mx-auto grid h-[76px] w-[76px] place-items-center rounded-full border-2 text-xs font-semibold ${
                  active === "all" ? "border-brand-red bg-brand-red/20" : "border-white/15 bg-white/5"
                }`}
              >
                All
              </span>
              <span className="mt-2 block text-xs text-brand-cream/70">All</span>
            </button>
            {categories.map((category) => {
              const meta = categoryMeta(category.slug);
              const selected = active === category.slug;
              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setActive(category.slug)}
                  className="w-[76px] shrink-0 text-center"
                >
                  <span
                    className={`relative mx-auto block h-[76px] w-[76px] overflow-hidden rounded-full border-2 ${
                      selected ? "border-brand-red shadow-[0_0_18px_rgba(232,39,44,0.45)]" : "border-white/15"
                    }`}
                  >
                    {meta?.image ? (
                      <Image src={meta.image} alt="" fill className="object-cover" sizes="76px" unoptimized />
                    ) : (
                      <span className="grid h-full place-items-center text-[10px]">{category.name}</span>
                    )}
                  </span>
                  <span className={`mt-2 block truncate text-xs ${selected ? "text-brand-gold" : "text-brand-cream/70"}`}>
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-8 space-y-10">
          {grouped.map(({ category, items: sectionItems }) => (
            <section key={category.slug} id={category.slug}>
              <h3 className="font-display text-2xl font-bold">{category.name}</h3>
              <div className="mt-2 divide-y divide-white/10 rounded-3xl border border-white/10 bg-charcoal/60 px-4">
                {sectionItems.map((item) => (
                  <OrderItemRow key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
          {grouped.length === 0 && (
            <p className="py-16 text-center text-brand-cream/55">Nothing in this filter. Switch veg / non-veg and try again.</p>
          )}
        </div>
      </div>
    </div>
  );
}
