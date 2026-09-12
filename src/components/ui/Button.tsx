"use client";

import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "gold";
};

export function Button({ variant = "primary", className = "", children, ...props }: Props) {
  const styles = {
    primary: "btn-glow px-6 py-3",
    ghost: "rounded-full border border-white/15 px-6 py-3 font-display font-semibold text-brand-cream hover:border-brand-red/70 hover:text-brand-red",
    gold: "rounded-full bg-brand-gold px-6 py-3 font-display font-semibold text-black shadow-gold hover:brightness-110",
  }[variant];

  return (
    <button
      className={`${styles} transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
