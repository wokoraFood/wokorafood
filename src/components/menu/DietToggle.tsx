"use client";

import { Leaf } from "lucide-react";

export type DietPreference = "all" | "veg" | "nonveg";

const OPTIONS: { id: DietPreference; label: string; promo: string }[] = [
  { id: "veg", label: "Veg", promo: "Garden wok. Steam, chilli, green-dot only." },
  { id: "nonveg", label: "Non-veg", promo: "Char night. Lollipop, chilli, kitchen heat." },
  { id: "all", label: "Both", promo: "Veg and non-veg, full menu." },
];

export function DietToggle({
  value,
  onChange,
}: {
  value: DietPreference;
  onChange: (value: DietPreference) => void;
}) {
  return (
    <div className="flex min-w-0 flex-nowrap items-stretch justify-start gap-1 sm:gap-1.5">
      {OPTIONS.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`shrink-0 rounded-xl border px-2 py-1.5 text-left transition sm:px-2.5 md:max-w-[13.5rem] md:px-3 ${
              active
                ? option.id === "veg"
                  ? "border-green-400 bg-green-500/15 shadow-[0_0_16px_rgba(74,222,128,0.22)]"
                  : option.id === "nonveg"
                    ? "border-brand-red bg-brand-red/15 shadow-neon"
                    : "border-brand-gold bg-brand-gold/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <span className="flex items-center gap-1.5 font-display text-xs font-semibold sm:text-sm">
              {option.id === "veg" ? (
                <span className="grid h-3.5 w-3.5 place-items-center rounded-sm border border-green-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                </span>
              ) : option.id === "nonveg" ? (
                <span className="grid h-3.5 w-3.5 place-items-center rounded-sm border border-red-500">
                  <span className="h-1.5 w-1.5 bg-red-500" />
                </span>
              ) : (
                <Leaf className="h-3.5 w-3.5 text-brand-gold" />
              )}
              {option.label}
            </span>
            <span className="mt-0.5 hidden text-[10px] leading-snug text-brand-cream/55 md:block md:text-[11px]">
              {option.promo}
            </span>
          </button>
        );
      })}
    </div>
  );
}
