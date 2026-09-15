"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ClipboardList, Home, QrCode, Settings, ShoppingBag, UserRound, UtensilsCrossed } from "lucide-react";
import { cartCount, useCartStore } from "@/store/cartStore";

const CUSTOMER_TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
  { href: "/account", label: "Order", icon: UserRound },
];

const ADMIN_TABS = [
  { href: "/admin", label: "Orders", icon: ClipboardList, exact: true },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/tables", label: "Tables", icon: QrCode },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const items = useCartStore((state) => state.items);
  const count = cartCount(items);

  if (status !== "authenticated" || !session) return null;

  const tabs = session.user.role === "admin" ? ADMIN_TABS : CUSTOMER_TABS;

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-4">
          {tabs.map((tab) => {
            const active = isActive(pathname, tab.href, (tab as { exact?: boolean }).exact);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  active ? "text-brand-gold" : "text-brand-cream/55"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
                {tab.href === "/cart" && count > 0 && (
                  <span className="absolute right-1/4 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-red px-1 text-[9px] font-bold text-white">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="h-[4.25rem] lg:hidden" aria-hidden />
    </>
  );
}
