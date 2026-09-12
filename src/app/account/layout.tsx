"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Headphones, LayoutDashboard, Settings, ShoppingBag } from "lucide-react";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { ThemePicker } from "@/components/theme/ThemePicker";

const TABS = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: ShoppingBag },
  { href: "/account/settings", label: "Settings", icon: Settings },
  { href: "/account/support", label: "Support", icon: Headphones },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,rgba(232,39,44,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(245,166,35,0.1),transparent_35%)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="card-surface hidden h-fit p-5 lg:block">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-gold">Customer</p>
          <h2 className="mt-2 font-display text-2xl font-bold">{session?.user.name || "Guest"}</h2>
          <p className="text-sm text-brand-cream/55">{session?.user.phone}</p>
          <nav className="mt-6 flex flex-col gap-1">
            {TABS.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm ${
                    active ? "bg-brand-red text-white" : "text-brand-cream/70 hover:bg-white/5"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6">
            <ThemePicker compact />
          </div>
          <LogoutButton className="mt-6 w-full rounded-full border border-brand-red/40 py-2 text-sm text-brand-red" />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
