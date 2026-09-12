"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { formatINR } from "@/lib/constants";

type Category = { id: string; name: string; slug: string };
type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  categoryId: string;
  category: Category;
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: "", description: "", price: "", imageUrl: "" });
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    isVeg: true,
  });

  const load = () =>
    fetch("/api/menu?all=true")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setCategories(data.categories || []);
        if (!form.categoryId && data.categories?.[0]) {
          setForm((current) => ({ ...current, categoryId: data.categories[0].id }));
        }
      });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upload = async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/menu/upload", { method: "POST", body });
    const data = await res.json();
    return data.url as string | undefined;
  };

  const createItem = async (event: FormEvent) => {
    event.preventDefault();
    await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    setForm({ ...form, name: "", description: "", price: "", imageUrl: "" });
    load();
  };

  const patch = async (id: string, body: Record<string, unknown>) => {
    await fetch(`/api/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    load();
  };

  const saveEdit = async (id: string) => {
    await patch(id, {
      name: draft.name,
      description: draft.description,
      price: Number(draft.price),
      imageUrl: draft.imageUrl,
    });
    setEditing(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="heading-underline font-display text-3xl font-bold">Kitchen menu</h1>
      <p className="mt-3 text-sm text-brand-cream/60">
        Hide items from customers, change photos, or add a new plate. Hidden items stay here — customers cannot see them.
      </p>

      <form onSubmit={createItem} className="card-surface mt-8 grid gap-3 p-5 md:grid-cols-2">
        <h2 className="font-display text-xl md:col-span-2">Add new item</h2>
        <input
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Item name — e.g. Chicken Momos"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2"
        />
        <input
          required
          value={form.price}
          onChange={(event) => setForm({ ...form, price: event.target.value })}
          placeholder="Price"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2"
        />
        <select
          value={form.categoryId}
          onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
          className="rounded-full border border-white/10 bg-ink px-4 py-2"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          value={form.imageUrl}
          onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
          placeholder="Image URL"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2"
        />
        <label className="text-sm text-brand-cream/70">
          Or upload photo
          <input
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-xs"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const url = await upload(file);
              if (url) setForm((current) => ({ ...current, imageUrl: url }));
            }}
          />
        </label>
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          placeholder="Short description"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 md:col-span-2"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isVeg} onChange={(event) => setForm({ ...form, isVeg: event.target.checked })} />
          Vegetarian
        </label>
        <button className="btn-glow px-5 py-2">Add to menu</button>
      </form>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <article key={item.id} className="card-surface p-4">
            <div className="flex flex-wrap gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-white/5">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-xs">No photo</div>
                )}
              </div>
              <div className="min-w-56 flex-1">
                {editing === item.id ? (
                  <div className="grid gap-2">
                    <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="rounded-full border border-white/10 bg-ink px-3 py-1.5" />
                    <input value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} className="rounded-full border border-white/10 bg-ink px-3 py-1.5" />
                    <input value={draft.imageUrl} onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })} placeholder="Image URL" className="rounded-full border border-white/10 bg-ink px-3 py-1.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        const url = await upload(file);
                        if (url) setDraft((current) => ({ ...current, imageUrl: url }));
                      }}
                    />
                    <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="rounded-2xl border border-white/10 bg-ink px-3 py-1.5" />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => saveEdit(item.id)} className="btn-glow px-4 py-1.5 text-sm">Save</button>
                      <button type="button" onClick={() => setEditing(null)} className="text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-display text-lg">{item.name}</p>
                    <p className="text-sm text-brand-cream/60">
                      {item.category.name} · {formatINR(item.price)} · {item.isAvailable ? "Visible to customers" : "Hidden from customers"}
                    </p>
                    <p className="mt-1 text-sm text-brand-cream/50">{item.description}</p>
                  </>
                )}
              </div>
            </div>
            {editing !== item.id && (
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <button
                  onClick={() => patch(item.id, { isAvailable: !item.isAvailable })}
                  className={`rounded-full px-3 py-1 ${item.isAvailable ? "border border-white/15" : "bg-brand-red"}`}
                >
                  {item.isAvailable ? "Hide from customers" : "Show to customers"}
                </button>
                <button
                  onClick={() => {
                    setEditing(item.id);
                    setDraft({
                      name: item.name,
                      description: item.description,
                      price: String(item.price),
                      imageUrl: item.imageUrl,
                    });
                  }}
                  className="rounded-full border border-brand-gold/40 px-3 py-1 text-brand-gold"
                >
                  Edit / change image
                </button>
                <button onClick={() => patch(item.id, { isFeatured: !item.isFeatured })} className="rounded-full border border-white/15 px-3 py-1">
                  {item.isFeatured ? "Unfeature" : "Feature"}
                </button>
                <button onClick={() => patch(item.id, { isAvailable: false })} className="rounded-full border border-brand-red/40 px-3 py-1 text-brand-red">
                  Remove from customer menu
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
