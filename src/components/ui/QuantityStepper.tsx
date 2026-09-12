"use client";

import { Minus, Plus } from "lucide-react";

type Props = {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  compact?: boolean;
};

export function QuantityStepper({ value, onIncrement, onDecrement, compact }: Props) {
  return (
    <div className={`inline-flex items-center rounded-full border border-white/15 bg-black/40 ${compact ? "h-8" : "h-10"}`}>
      <button
        type="button"
        onClick={onDecrement}
        className="grid h-full w-8 place-items-center text-brand-cream/80 hover:text-brand-red"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-6 text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        onClick={onIncrement}
        className="grid h-full w-8 place-items-center text-brand-cream/80 hover:text-brand-red"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
