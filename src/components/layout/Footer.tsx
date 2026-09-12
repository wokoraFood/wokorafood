"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { BRAND, CATEGORY_META } from "@/lib/constants";

export function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setMessage(res.ok ? "You're on the list." : "Please enter a valid email.");
    if (res.ok) setEmail("");
  };

  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-brand-cream/70">{BRAND.tagline}</p>
          <p className="mt-1 text-sm text-brand-gold">{BRAND.subTagline}</p>
          <div className="mt-5 flex gap-4 text-sm text-brand-cream/70">
            <a href={BRAND.social.instagram} aria-label="Instagram">Instagram</a>
            <a href={BRAND.social.facebook} aria-label="Facebook">Facebook</a>
            <a href={BRAND.social.twitter} aria-label="X">X</a>
          </div>
        </div>
        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-brand-cream">Explore</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-brand-cream/70">
            <Link href="/menu">Menu</Link>
            <Link href="/about">About</Link>
            <Link href="/account/support">Support</Link>
            <Link href="/#visit">Visit</Link>
            <Link href="/account">Account</Link>
          </div>
        </div>
        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-brand-cream">Menu</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-brand-cream/70">
            {CATEGORY_META.slice(0, 6).map((category) => (
              <Link key={category.slug} href={`/menu#${category.slug}`}>
                {category.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-brand-cream">Newsletter</h3>
          <form onSubmit={submit} className="mt-4 flex gap-2">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:border-brand-red"
            />
            <button className="btn-glow px-4 py-2 text-sm">Join</button>
          </form>
          {message && <p className="mt-2 text-xs text-brand-gold">{message}</p>}
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-brand-cream/50">
        © {new Date().getFullYear()} {BRAND.name}. {BRAND.domain}
      </div>
    </footer>
  );
}
