"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Headphones, Settings, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useCartAccess } from "@/hooks/useCartAccess";

const TABS = [
  { href: "/account", label: "Order", icon: UtensilsCrossed },
  { href: "/account/orders", label: "Orders", icon: ShoppingBag },
  { href: "/account/settings", label: "Settings", icon: Settings },
  { href: "/account/support", label: "Support", icon: Headphones },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin } = useCartAccess();
  const isOrderHome = pathname === "/account";

  useEffect(() => {
    if (isAdmin) router.replace("/admin");
  }, [isAdmin, router]);

  if (isAdmin) return null;

  if (isOrderHome) {
    return <div className="min-h-[calc(100vh-4rem)] bg-ink">{children}</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink">
      <div className="border-b border-white/10">
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm ${
                  active ? "bg-brand-red text-white" : "border border-white/10 text-brand-cream/70"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
