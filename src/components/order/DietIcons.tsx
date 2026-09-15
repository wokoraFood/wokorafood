"use client";

import type { DietPreference } from "@/components/menu/DietToggle";

export function DietIcons({
  value,
  onChange,
}: {
  value: DietPreference;
  onChange: (value: DietPreference) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/35 p-1">
      <button
        type="button"
        onClick={() => onChange("veg")}
        aria-label="Vegetarian"
        className={`grid h-10 w-10 place-items-center rounded-full ${
          value === "veg" ? "bg-green-500/20 ring-2 ring-green-400" : "opacity-70 hover:opacity-100"
        }`}
      >
        <span className="grid h-5 w-5 place-items-center rounded-[3px] border-2 border-green-500">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
      </button>
      <button
        type="button"
        onClick={() => onChange("nonveg")}
        aria-label="Non-vegetarian"
        className={`grid h-10 w-10 place-items-center rounded-full ${
          value === "nonveg" ? "bg-red-500/20 ring-2 ring-red-400" : "opacity-70 hover:opacity-100"
        }`}
      >
        <span className="grid h-5 w-5 place-items-center rounded-[3px] border-2 border-red-500">
          <span className="h-2.5 w-2.5 bg-red-500" />
        </span>
      </button>
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`rounded-full px-3 py-2 text-xs font-semibold ${
          value === "all" ? "bg-white/15 text-white" : "text-brand-cream/55"
        }`}
      >
        Both
      </button>
    </div>
  );
}
