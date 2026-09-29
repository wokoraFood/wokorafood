"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

export function KitchenPopup({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        className="card-surface max-h-[90vh] w-full max-w-lg overflow-y-auto p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-1.5 text-brand-cream/70 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
